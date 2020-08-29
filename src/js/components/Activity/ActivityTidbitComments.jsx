import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { AccountCircle } from '@material-ui/icons';
import ActivityStore from '../../stores/ActivityStore';
import AppActions from '../../actions/AppActions';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';


const STARTING_NUMBER_OF_PARENT_COMMENTS_TO_DISPLAY = 2;

class ActivityTidbitComments extends Component {
  static propTypes = {
    activityTidbitWeVoteId: PropTypes.string.isRequired,
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      commentsInTree: [],
      numberOfParentCommentsToDisplay: STARTING_NUMBER_OF_PARENT_COMMENTS_TO_DISPLAY,
    };
  }

  componentDidMount () {
    this.activityStoreListener = ActivityStore.addListener(this.onActivityStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.onActivityStoreChange();
    this.onVoterStoreChange();
  }

  componentWillUnmount () {
    this.activityStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onActivityStoreChange () {
    const { activityTidbitWeVoteId } = this.props;
    const commentsInTree = ActivityStore.getActivityCommentsInTreeByTidbitWeVoteId(activityTidbitWeVoteId);
    this.setState({
      commentsInTree,
    });
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    const { full_name: voterFullName, voter_photo_url_tiny: voterPhotoUrlTiny } = voter;
    this.setState({
      voterFullName,
      voterPhotoUrlTiny,
    });
  }

  onClickShowActivityTidbitDrawer = () => {
    const { activityTidbitWeVoteId } = this.props;
    AppActions.setActivityTidbitWeVoteIdForDrawer(activityTidbitWeVoteId);
    AppActions.setShowActivityTidbitDrawer(true);
  }

  increaseNumberOfActivityTidbitsToDisplay = () => {
    let { numberOfParentCommentsToDisplay } = this.state;
    // console.log('Number of position items before increment: ', numberOfParentCommentsToDisplay);

    numberOfParentCommentsToDisplay += 5;
    // console.log('Number of position items after increment: ', numberOfParentCommentsToDisplay);

    this.positionItemTimer = setTimeout(() => {
      this.setState({
        numberOfParentCommentsToDisplay,
      });
    }, 500);
  }

  render () {
    renderLog('ActivityTidbitComments');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { commentsInTree, numberOfParentCommentsToDisplay, voterFullName, voterPhotoUrlTiny } = this.state;
    if (!commentsInTree || commentsInTree.length === 0) {
      return null;
    }
    let numberOfCommentsDisplayed = 0;
    return (
      <Wrapper>
        {commentsInTree.map((parentComment) => {
          // console.log('oneActivityTidbit:', oneActivityTidbit);
          // console.log('numberOfCommentsDisplayed:', numberOfCommentsDisplayed);
          if (!parentComment || !parentComment.commenter_name) {
            // console.log('Missing oneActivityTidbit.commenter_name:', parentComment);
            return null;
          }
          if (numberOfCommentsDisplayed >= numberOfParentCommentsToDisplay) {
            return null;
          }
          numberOfCommentsDisplayed += 1;
          return (
            <CommentWrapper key={`comment-${parentComment.we_vote_id}`}>
              <ParentPhotoDiv>
                {(voterPhotoUrlTiny) ? (
                  <SpeakerAvatar>
                    <ActivityImage src={voterPhotoUrlTiny} alt={`${voterFullName}`} />
                  </SpeakerAvatar>
                ) : (
                  <SpeakerAvatar>
                    <AccountCircle classes={{ root: classes.accountCircle }} />
                  </SpeakerAvatar>
                )}
              </ParentPhotoDiv>
              <ParentCommentWrapper>
                <ParentCommentText>
                  {parentComment.statement_text}
                </ParentCommentText>
                {(parentComment.comment_list && parentComment.comment_list.length > 0) && (
                  <ChildCommentListWrapper>
                    {parentComment.comment_list.map(childComment => (
                      <ChildCommentWrapper>
                        {childComment.statement_text}
                      </ChildCommentWrapper>
                    ))}
                  </ChildCommentListWrapper>
                )}
              </ParentCommentWrapper>
            </CommentWrapper>
          );
        })}
      </Wrapper>
    );
  }
}

const styles = () => ({
  accountCircle: {
    color: 'rgba(17, 17, 17, .4)',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  likeIcon: {
    color: '#1fc06f', // #2e3c5d
    '&:hover': {
      backgroundColor: 'transparent',
    },
    width: 12,
    height: 12,
  },
  numberOfLikesButton: {
    padding: 6,
  },
  numberOfCommentsButton: {
    color: 'rgba(17, 17, 17, .4)',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    padding: 6,
  },
});

const ActivityImage = styled.img`
  border-radius: 4px;
  width: 32px;
`;

const ChildCommentListWrapper = styled.div`
`;

const ChildCommentWrapper = styled.div`
`;

const CommentWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 3px;
`;
const ParentCommentText = styled.div`
  border-radius: 32px;
  background: rgb(224, 224, 224);
  color: #2e3c5d;
  font-size: 16px;
  font-weight: 500;
  padding: 4px 12px;
  margin-top: 0px;
`;

const ParentCommentWrapper = styled.div`
  width: 100%;
`;

const ParentPhotoDiv = styled.div`
`;

const SpeakerAvatar = styled.div`
  background: transparent;
  display: flex;
  justify-content: center;
  margin-right: 4px;
  position: relative;
`;

const Wrapper = styled.div`
  margin-bottom: 6px !important;
  padding: 0px !important;
`;

export default withTheme(withStyles(styles)(ActivityTidbitComments));
