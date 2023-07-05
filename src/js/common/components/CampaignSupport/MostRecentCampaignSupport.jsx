import { AccountCircle } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { createRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import anonymous from '../../../../img/global/icons/avatar-generic.png';
import LazyImage from '../LazyImage';
import {
  Comment, CommentName, CommentNameWrapper,
  CommentTextWrapper,
  CommentVoterPhotoWrapper, CommentWrapper,
} from '../Style/CampaignDetailsStyles';
import { timeFromDate } from '../../utils/dateFormat';
import { renderLog } from '../../utils/logging';
import returnFirstXWords from '../../utils/returnFirstXWords';
import stringContains from '../../utils/stringContains';
import CampaignStore from '../../stores/CampaignStore';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import VoterStore from '../../../stores/VoterStore';

class MostRecentCampaignSupport extends React.Component {
  constructor (props) {
    super(props);
    this.commentsWrapperDiv = createRef();
    this.state = {
      countOfStageQueueItemsMovedOnStage: 0,
      stageQueue: [],
      supportersOnStageNow: [],
      waitingForInitialData: true,
      isAutoScroll: false,
    };
  }

  componentDidMount () {
    // Both use onCampaignSupporterStoreChange
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    const { campaignXWeVoteId } = this.props;
    // console.log('componentDidMount campaignXWeVoteId:', campaignXWeVoteId);
    if (campaignXWeVoteId) {
      // This list includes "CampaignXSupporter" entries without a text comment
      const allLatestSupporters = CampaignSupporterStore.getLatestCampaignXSupportersList(campaignXWeVoteId);
      // console.log('componentDidMount allLatestSupporters:', allLatestSupporters);
      if (allLatestSupporters && allLatestSupporters.length) {
        this.setState({
          waitingForInitialData: false,
        });
        // The first time we aren't waiting for initial data, fill it
        this.onFirstLoadOfSupporterData(allLatestSupporters);
      }
    }
    const voterWeVoteId = VoterStore.getVoterWeVoteId();
    this.setState({
      voterWeVoteId,
    });

    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    this.timeInterval = null;
    // this.timeInterval = setInterval(() => this.setCommentsToDisplay(), 30000);
    this.timeInterval = setInterval(() => this.moveSupportersOnStage(), 3000);
  }

  componentDidUpdate (prevProps, prevState) {
    // console.log('MostRecentCampaignSupport componentDidUpdate');
    const {
      campaignXWeVoteId,
    } = this.props;
    const {
      waitingForInitialData: waitingForInitialDataPrevious,
    } = prevState;
    // console.log('componentDidUpdate campaignXWeVoteId:', campaignXWeVoteId, ', waitingForInitialDataPrevious:', waitingForInitialDataPrevious);
    if (campaignXWeVoteId) {
      const allLatestSupporters = CampaignSupporterStore.getLatestCampaignXSupportersList(campaignXWeVoteId);
      // console.log('componentDidUpdate allLatestSupporters:', allLatestSupporters, ', waitingForInitialDataPrevious:', waitingForInitialDataPrevious, ', waitingForInitialData:', waitingForInitialData);
      const dataExists = allLatestSupporters && allLatestSupporters.length > 0;
      const waitingForInitialData = !dataExists;
      // The first time we aren't waiting for initial data, fill it
      if (!waitingForInitialData) {
        if (waitingForInitialData !== waitingForInitialDataPrevious) {
          this.setState({
            waitingForInitialData: false,
          });
          this.onFirstLoadOfSupporterData(allLatestSupporters);
        }
      }
    }
  }

  componentWillUnmount () {
    this.campaignSupporterStoreListener.remove();
    this.campaignStoreListener.remove();
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    this.timeInterval = null;
    clearInterval(this.scrollInterval);
  }

  handleScroll () {
    if (this.state.isAutoScroll) {
      this.setState({ isAutoScroll: false });
    } else {
      // break out of auto scroll when manually scrolled
      clearInterval(this.scrollInterval);
    }
  }

  onFirstLoadOfSupporterData (allLatestSupporters) {
    // The first time we aren't waiting for initial data, fill it
    const stageQueue = this.fillStageQueue(allLatestSupporters);
    let countOfStageQueueItemsMovedOnStage = 0;
    // Reverse this so newest is at top of array
    const supportersToMoveOnStage = [];
    if (stageQueue.length === 0) {
      // Do nothing
    } else if (stageQueue.length === 1) {
      supportersToMoveOnStage.push(stageQueue[0]);
      countOfStageQueueItemsMovedOnStage = 1;
    } else {
      supportersToMoveOnStage.unshift(stageQueue[0]);
      supportersToMoveOnStage.unshift(stageQueue[1]);
      countOfStageQueueItemsMovedOnStage = 2;
    }
    this.setState({
      countOfStageQueueItemsMovedOnStage,
      stageQueue,
      supportersOnStageNow: supportersToMoveOnStage,
    });

    // when CommentsWrapper DOM div mounts
    if (this.commentsWrapperDiv.current) {
      this.autoScroll();
    }
  }

  onCampaignSupporterStoreChange () {
    const { campaignXWeVoteId } = this.props;
    // console.log('onCampaignSupporterStoreChange campaignXWeVoteId:', campaignXWeVoteId);
    if (campaignXWeVoteId) {
      const allLatestSupporters = CampaignSupporterStore.getLatestCampaignXSupportersList(campaignXWeVoteId);
      if (allLatestSupporters && allLatestSupporters.length) {
        const stageQueue = this.fillStageQueue(allLatestSupporters);
        this.setState({
          stageQueue,
          waitingForInitialData: false,
        });
      }
    }
    const voterWeVoteId = VoterStore.getVoterWeVoteId();
    this.setState({
      voterWeVoteId,
    });
  }

  fillStageQueue (allLatestSupporters) {
    const { stageQueue } = this.state;
    // stageQueue is oldest-to-newest
    // Find newest entry in stageQueue
    let dateClosestToPresent;
    for (let i = 0; i < stageQueue.length; ++i) {
      if (!dateClosestToPresent) {
        dateClosestToPresent = stageQueue[i].date_supported;
      } else if (Date.parse(stageQueue[i].date_supported) > Date.parse(dateClosestToPresent)) {
        dateClosestToPresent = stageQueue[i].date_supported;
      }
    }
    // console.log('dateClosestToPresent:', dateClosestToPresent);

    // Order allLatestSupporters oldest-to-newest
    allLatestSupporters.sort((optionA, optionB) => Date.parse(optionA.date_supported) - Date.parse(optionB.date_supported));
    // console.log('allLatestSupporters after sort:', allLatestSupporters);
    for (let i = 0; i < allLatestSupporters.length; ++i) {
      if (!dateClosestToPresent) {
        stageQueue.push(allLatestSupporters[i]);
      } else if (Date.parse(allLatestSupporters[i].date_supported) > Date.parse(dateClosestToPresent)) {
        stageQueue.push(allLatestSupporters[i]);
      }
    }

    // console.log('stageQueue at end:', stageQueue);
    return stageQueue;
  }

  moveSupportersOnStage () {
    const { countOfStageQueueItemsMovedOnStage, stageQueue, supportersOnStageNow } = this.state;
    if (stageQueue && countOfStageQueueItemsMovedOnStage < stageQueue.length) {
      // console.log('moveSupportersOnStage, countOfStageQueueItemsMovedOnStage:', countOfStageQueueItemsMovedOnStage);
      // Add the next most recent supporter to the top of the display array
      supportersOnStageNow.unshift(stageQueue[countOfStageQueueItemsMovedOnStage]);
      this.setState({
        countOfStageQueueItemsMovedOnStage: countOfStageQueueItemsMovedOnStage + 1,
        supportersOnStageNow,
      });
    }
  }

  autoScroll () {
    // pause for 1 second before autscroll starts
    if (this.commentsWrapperDiv && this.commentsWrapperDiv.current && this.commentsWrapperDiv.current.scrollTop) {
      setTimeout(
        () => {
          this.scrollInterval = setInterval(
            () => {
              // set flag to distinguish auto from manual scroll
              this.setState({isAutoScroll: true});
              this.commentsWrapperDiv.current.scrollTop += 1;
            }, 100,
          );
        },
        1000,
      );
    }
  }

  render () {
    renderLog('MostRecentCampaignSupport');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { supportersOnStageNow, voterWeVoteId } = this.state;

    return (
      <MostRecentCampaignSupportWrapper>
        {supportersOnStageNow && supportersOnStageNow.length > 0 && (
          <CommentsWrapper
            id="comments-wrapper"
            ref={this.commentsWrapperDiv}
            onScroll={() => this.handleScroll()}
          >
            {supportersOnStageNow.map((comment) => (
              <CommentWrapper className="comment" key={comment.id}>
                <CommentVoterPhotoWrapper>
                  {comment.we_vote_hosted_profile_image_url_tiny ? (
                    <LazyImage
                      src={comment.we_vote_hosted_profile_image_url_tiny}
                      placeholder={anonymous}
                      className="profile-photo"
                      height={24}
                      width={24}
                      alt="Your Settings"
                    />
                  ) : (
                    <AccountCircle classes={{ root: classes.accountCircleRoot }} />
                  )}
                </CommentVoterPhotoWrapper>
                <CommentTextWrapper>
                  {comment.supporter_endorsement && (
                    <Comment>{returnFirstXWords(comment.supporter_endorsement, 18, true)}</Comment>
                  )}
                  <CommentNameWrapper>
                    {!stringContains('Voter-', comment.supporter_name) && (
                      <CommentName>
                        {comment.supporter_name}
                        {' '}
                      </CommentName>
                    )}
                    supported
                    {' '}
                    {timeFromDate(comment.date_supported)}
                    {comment.voter_we_vote_id === voterWeVoteId && (
                      <>
                        &nbsp;&nbsp;&nbsp;
                        <Link to={`/id/${comment.campaignx_we_vote_id}/why-do-you-support`}>
                          Edit
                        </Link>
                      </>
                    )}
                  </CommentNameWrapper>
                </CommentTextWrapper>
              </CommentWrapper>
            ))}
          </CommentsWrapper>
        )}
      </MostRecentCampaignSupportWrapper>
    );
  }
}
MostRecentCampaignSupport.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  classes: PropTypes.object,
};

const styles = () => ({
  accountCircleRoot: {
    color: '#999',
    marginRight: 8,
  },
});

const CommentsWrapper = styled('div')`
  height: 100px;
  max-height: 140px;
  overflow-y: scroll;
  transition-duration: .3s;
  // scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  .comment {
    // scroll-snap-align: start;
  }

  ::-webkit-scrollbar {
    width: 0;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: transparent;
    z-index: 9999;
    border-radius: 50px;
  }
`;

const MostRecentCampaignSupportWrapper = styled('div')`
`;

export default withStyles(styles)(MostRecentCampaignSupport);
