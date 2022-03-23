import styled from '@mui/material/styles/styled';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CandidateStore from '../../stores/CandidateStore';
import FriendStore from '../../stores/FriendStore';
import MeasureStore from '../../stores/MeasureStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import SvgImage from '../../common/components/Widgets/SvgImage';


const STARTING_NUMBER_OF_POSITIONS_TO_DISPLAY = 5;

class PositionRowEmpty extends Component {
  constructor (props) {
    super(props);
    this.state = {
      allCachedPositionsForThisBallotItem: [],
      allCachedPositionsForThisBallotItemLength: 0,
      numberOfPositionItemsToDisplay: STARTING_NUMBER_OF_POSITIONS_TO_DISPLAY,
    };
  }

  componentDidMount () {
    // console.log('PositionRowEmpty componentDidMount');

    // let { incomingPositionList } = this.props;
    const { ballotItemWeVoteId } = this.props;
    // console.log('PositionRowEmpty componentDidMount, ballotItemWeVoteId:', ballotItemWeVoteId);
    let allCachedPositionsForThisBallotItem;
    if (ballotItemWeVoteId.includes('cand')) {
      allCachedPositionsForThisBallotItem = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
    } else if (ballotItemWeVoteId.includes('meas')) {
      allCachedPositionsForThisBallotItem = MeasureStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
    }
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.measureStoreListener = MeasureStore.addListener(this.onFriendStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));

    // OrganizationActions.organizationsFollowedRetrieve();
    // const organizationsVoterIsFriendsWith = FriendStore.currentFriendsOrganizationWeVoteIDList();
    // if (!organizationsVoterIsFriendsWith.length > 0) {
    //   if (apiCalming('friendList', 1500)) {
    //     FriendActions.currentFriends();
    //   }
    // }
    if (allCachedPositionsForThisBallotItem) {
      const allCachedPositionsForThisBallotItemLength = Object.keys(allCachedPositionsForThisBallotItem).length;
      this.setState({
        allCachedPositionsForThisBallotItem,
        allCachedPositionsForThisBallotItemLength,
      });
    }
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.friendStoreListener.remove();
    this.measureStoreListener.remove();
    this.organizationStoreListener.remove();
    if (this.positionItemTimer) clearTimeout(this.positionItemTimer);
  }

  onCandidateStoreChange () {
    const { ballotItemWeVoteId } = this.props;
    // console.log('PositionRowEmpty onCandidateStoreChange, ballotItemWeVoteId:', ballotItemWeVoteId);
    let allCachedPositionsForThisBallotItem;
    if (ballotItemWeVoteId.includes('cand')) {
      allCachedPositionsForThisBallotItem = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
      if (allCachedPositionsForThisBallotItem) {
        const allCachedPositionsForThisBallotItemLength = Object.keys(allCachedPositionsForThisBallotItem).length;
        this.setState({
          allCachedPositionsForThisBallotItem,
          allCachedPositionsForThisBallotItemLength,
        });
      }
    }
  }

  onFriendStoreChange () {
    const { allCachedPositionsForThisBallotItem } = this.state;
    this.onPositionListUpdate(allCachedPositionsForThisBallotItem);
  }

  onMeasureStoreChange () {
    const { ballotItemWeVoteId } = this.props;
    // console.log('PositionRowEmpty onMeasureStoreChange, ballotItemWeVoteId:', ballotItemWeVoteId);
    let allCachedPositionsForThisBallotItem;
    if (ballotItemWeVoteId.includes('meas')) {
      allCachedPositionsForThisBallotItem = MeasureStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
      if (allCachedPositionsForThisBallotItem) {
        const allCachedPositionsForThisBallotItemLength = Object.keys(allCachedPositionsForThisBallotItem).length;
        this.setState({
          allCachedPositionsForThisBallotItem,
          allCachedPositionsForThisBallotItemLength,
        });
      }
      // this.onPositionListUpdate(allCachedPositionsForThisBallotItem);
    }
  }

  onOrganizationStoreChange () {
    // console.log('PositionRowEmpty onOrganizationStoreChange');
    const { allCachedPositionsForThisBallotItem } = this.state;
    this.onPositionListUpdate(allCachedPositionsForThisBallotItem);
  }

  onPositionListUpdate = (allCachedPositionsForThisBallotItem) => {
    const { showInfoOnly, showOppose, showSupport } = this.props;
    const organizationsVoterIsFollowing = OrganizationStore.getOrganizationsVoterIsFollowing();
    // eslint-disable-next-line arrow-body-style
    let filteredPositionList = allCachedPositionsForThisBallotItem.map((position) => {
      // console.log('PositionRowEmpty onOrganizationStoreChange, position: ', position);
      return ({
        ...position,
        followed: organizationsVoterIsFollowing.filter((org) => org.organization_we_vote_id === position.speaker_we_vote_id).length > 0,
      });
    });

    const organizationsVoterIsFriendsWith = FriendStore.currentFriendsOrganizationWeVoteIDList();
    // console.log('PositionRowEmpty onFriendStoreChange, organizationsVoterIsFriendsWith:', organizationsVoterIsFriendsWith);
    // eslint-disable-next-line arrow-body-style
    filteredPositionList = filteredPositionList.map((position) => {
      // console.log('PositionRowEmpty componentDidMount, position: ', position);
      return ({
        ...position,
        currentFriend: organizationsVoterIsFriendsWith.filter((organizationWeVoteId) => organizationWeVoteId === position.speaker_we_vote_id).length > 0,
      });
    });

    if (showInfoOnly) {
      filteredPositionList = this.limitToShowInfoOnly(filteredPositionList);
    } else if (showOppose) {
      filteredPositionList = this.limitToShowOppose(filteredPositionList);
    } else if (showSupport) {
      filteredPositionList = this.limitToShowSupport(filteredPositionList);
    }
    filteredPositionList = filteredPositionList.sort(this.orderByTwitterFollowers);
    filteredPositionList = filteredPositionList.sort(this.orderByWrittenComment);
    filteredPositionList = filteredPositionList.sort(this.orderByFollowedOrgsFirst);
    filteredPositionList = filteredPositionList.sort(this.orderByCurrentFriendsFirst);
    filteredPositionList = filteredPositionList.sort(this.orderByCurrentVoterFirst); // Always put current voter at top

    // console.log('PositionRowEmpty onPositionListUpdate, filteredPositionList:', filteredPositionList);
    this.setState({
      filteredPositionList,
      filteredPositionListLength: filteredPositionList.length,
    });
  }

  increaseNumberOfPositionItemsToDisplay = () => {
    let { numberOfPositionItemsToDisplay } = this.state;
    // console.log('Number of position items before increment: ', numberOfPositionItemsToDisplay);

    numberOfPositionItemsToDisplay += 5;
    // console.log('Number of position items after increment: ', numberOfPositionItemsToDisplay);

    if (this.positionItemTimer) clearTimeout(this.positionItemTimer);
    this.positionItemTimer = setTimeout(() => {
      this.setState({
        numberOfPositionItemsToDisplay,
      });
    }, 500);
  }

  limitToShowInfoOnly = (filteredPositionList) => filteredPositionList.filter((item) => (item && item.is_information_only));

  limitToShowOppose = (filteredPositionList) => filteredPositionList.filter((item) => (item && item.is_oppose_or_negative_rating));

  limitToShowSupport = (filteredPositionList) => filteredPositionList.filter((item) => (item && item.is_support_or_positive_rating));

  orderByCurrentFriendsFirst = (firstGuide, secondGuide) => {
    const secondGuideIsFromFriend = secondGuide && secondGuide.currentFriend === true ? 1 : 0;
    const firstGuideIsFromFriend = firstGuide && firstGuide.currentFriend === true ? 1 : 0;
    return secondGuideIsFromFriend - firstGuideIsFromFriend;
  };

  orderByCurrentVoterFirst = (firstGuide, secondGuide) => {
    const currentVoterOrganizationWeVoteId = VoterStore.getLinkedOrganizationWeVoteId();
    const secondGuideIsFromCurrentVoter = secondGuide && secondGuide.speaker_we_vote_id === currentVoterOrganizationWeVoteId ? 1 : 0;
    const firstGuideIsFromCurrentVoter = firstGuide && firstGuide.speaker_we_vote_id === currentVoterOrganizationWeVoteId ? 1 : 0;
    return secondGuideIsFromCurrentVoter - firstGuideIsFromCurrentVoter;
  };

  orderByFollowedOrgsFirst = (firstGuide, secondGuide) => secondGuide.followed - firstGuide.followed;

  orderByTwitterFollowers = (firstGuide, secondGuide) => secondGuide.twitter_followers_count - firstGuide.twitter_followers_count;

  orderByWrittenComment = (firstGuide, secondGuide) => {
    const secondGuideHasStatement = secondGuide && secondGuide.statement_text && secondGuide.statement_text.length ? 1 : 0;
    const firstGuideHasStatement = firstGuide && firstGuide.statement_text && firstGuide.statement_text.length ? 1 : 0;
    return secondGuideHasStatement - firstGuideHasStatement;
  };

  render () {
    const { ballotItemWeVoteId } = this.props;
    renderLog('PositionRowEmpty');  // Set LOG_RENDER_EVENTS to log all renders
    // if (allCachedPositionsForThisBallotItemLength > 0) {
    //   return null;
    // }
    const avatar = normalizedImagePath('../../img/global/svg-icons/avatar-generic.svg');
    const imagePlaceholder = (
      <SvgImage imageName={avatar} />
    );
    // console.log('PositionRowEmpty render, positionListExistsTitle:', positionListExistsTitle);
    // console.log('this.state.filteredPositionList render: ', this.state.filteredPositionList);
    return (
      <OuterWrapper>
        <CandidateEndorsementsContainer key={`PositionRowEmpty-${ballotItemWeVoteId}`}>
          <RowItemWrapper>
            <OrganizationPhotoOuterWrapper>
              <OrganizationPhotoInnerWrapper>
                { imagePlaceholder }
              </OrganizationPhotoInnerWrapper>
            </OrganizationPhotoOuterWrapper>
            <HorizontalSpacer />
            <YesNoScoreTextWrapper>
              <OrganizationSupportWrapper>
                <OrganizationSupportSquare>
                  <OrganizationSupportWordWrapper>
                    Yes?
                  </OrganizationSupportWordWrapper>
                  <AddScoreWrapper className="u-link-color-on-hover">
                    <ToScoreLabel1>
                      ask
                    </ToScoreLabel1>
                    <ToScoreLabel2 className="u-no-break">
                      your friends
                    </ToScoreLabel2>
                  </AddScoreWrapper>
                </OrganizationSupportSquare>
              </OrganizationSupportWrapper>
            </YesNoScoreTextWrapper>
          </RowItemWrapper>
        </CandidateEndorsementsContainer>
      </OuterWrapper>
    );
  }
}
PositionRowEmpty.propTypes = {
  ballotItemWeVoteId: PropTypes.string.isRequired,
  showInfoOnly: PropTypes.bool,
  showOppose: PropTypes.bool,
  showSupport: PropTypes.bool,
};

const styles = () => ({
  iconButton: {
    padding: 8,
  },
});

const CandidateEndorsementsContainer = styled('div')`
  display: flex;
  justify-content: flex-start;
`;

const OuterWrapper = styled('div')`
  height: 100%;
  width: 64px;
`;

const RowItemWrapper = styled('div')`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const AddScoreWrapper = styled('div')`
  align-items: center;
  border-top: 1px dotted #dcdcdc;
  color: #ccc;
  display: flex;
  flex-flow: column;
  font-weight: normal;
  justify-content: flex-start;
  padding-top: 4px;
`;

const HorizontalSpacer = styled('div')`
  border-bottom: 1px dotted #dcdcdc;
`;

const OrganizationPhotoInnerWrapper = styled('div')`
  align-items: flex-start;
  display: flex;
  height: 42px;
  width: 42px;
  justify-content: center;
  & img, & svg, & path {
    border: 1px solid #ccc;
    border-radius: 29px;
    width: 42px !important;
    height: 42px !important;
    max-width: 42px !important;
    display: flex;
    align-items: flex-start;
  }
`;

const OrganizationPhotoOuterWrapper = styled('div')`
  border-bottom: 1px dotted #dcdcdc;
  border-left: 1px dotted #dcdcdc;
  cursor: pointer;
  display: flex;
  justify-content: center;
  padding: 4px 3px 6px 4px;
  width: 64px;
`;

const OrganizationSupportWordWrapper = styled('div')`
  margin-bottom: 1px;
`;

const OrganizationSupportSquare = styled('div')(({ theme }) => (`
  align-items: center;
  background: white;
  color: ${theme.colors.supportGreenRgb};
  cursor: pointer;
  display: flex;
  flex-flow: column;
  flex-wrap: wrap;
  font-size: 16px;
  font-weight: bold;
  justify-content: flex-start;
  width: 40px;
`));

const OrganizationSupportWrapper = styled('div')`
  position: relative;
  z-index: 1;
`;

const ToScoreLabel1 = styled('div')`
  font-size: 14px;
  margin-top: 0;
`;

const ToScoreLabel2 = styled('div')`
  font-size: 10px;
  margin-top: -3px;
`;

const YesNoScoreTextWrapper = styled('div')`
  border-left: 1px dotted #dcdcdc;
  padding: 3px 3px 4px 4px;
  width: 64px;
`;

export default withTheme(withStyles(styles)(PositionRowEmpty));
