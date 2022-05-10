import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import OrganizationActions from '../../actions/OrganizationActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import SvgImage from '../../common/components/Widgets/SvgImage';
import apiCalming from '../../common/utils/apiCalming';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import CandidateStore from '../../stores/CandidateStore';
import FriendStore from '../../stores/FriendStore';
import IssueStore from '../../stores/IssueStore';
import MeasureStore from '../../stores/MeasureStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterStore from '../../stores/VoterStore';
import PositionRowItem from './PositionRowItem';
import {
  CandidateEndorsementsContainer,
  EmptyPhotoOuterWrapper, EmptyText,
  EmptyTextWrapper,
  HorizontalSpacer,
  OrganizationPhotoInnerWrapper,
  PositionRowItemEmptyWrapper,
} from '../Style/PositionRowListStyles';

const PositionRowSupportOpposeCountDisplay = React.lazy(() => import(/* webpackChunkName: 'PositionRowSupportOpposeCountDisplay' */ './PositionRowSupportOpposeCountDisplay'));

const STARTING_NUMBER_OF_POSITIONS_TO_DISPLAY = 5;

class PositionRowList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      allCachedPositionsForThisBallotItem: [],
      allCachedPositionsForThisBallotItemLength: 0,
      filteredPositionList: [],
      filteredPositionListLength: 0,
      numberOfPositionItemsToDisplay: STARTING_NUMBER_OF_POSITIONS_TO_DISPLAY,
    };
  }

  componentDidMount () {
    // console.log('PositionRowList componentDidMount');

    // let { incomingPositionList } = this.props;
    const { ballotItemWeVoteId } = this.props;
    // console.log('PositionRowList componentDidMount, ballotItemWeVoteId:', ballotItemWeVoteId);
    let allCachedPositionsForThisBallotItem;
    if (ballotItemWeVoteId.includes('cand')) {
      allCachedPositionsForThisBallotItem = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
    } else if (ballotItemWeVoteId.includes('meas')) {
      allCachedPositionsForThisBallotItem = MeasureStore.getAllCachedPositionsByMeasureWeVoteId(ballotItemWeVoteId);
    }
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.measureStoreListener = MeasureStore.addListener(this.onFriendStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));

    if (apiCalming('organizationsFollowedRetrieve', 60000)) {
      OrganizationActions.organizationsFollowedRetrieve();
    }
    const organizationsVoterIsFriendsWith = FriendStore.currentFriendsOrganizationWeVoteIDList();
    if (!organizationsVoterIsFriendsWith.length > 0) {
      if (apiCalming('friendList', 1500)) {
        FriendActions.currentFriends();
      }
    }

    this.onPositionListUpdate(allCachedPositionsForThisBallotItem);
    this.setState({
      allCachedPositionsForThisBallotItem,
      allCachedPositionsForThisBallotItemLength: allCachedPositionsForThisBallotItem.length,
    });
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
    // console.log('PositionRowList onCandidateStoreChange, ballotItemWeVoteId:', ballotItemWeVoteId);
    let allCachedPositionsForThisBallotItem;
    if (ballotItemWeVoteId.includes('cand')) {
      allCachedPositionsForThisBallotItem = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
      this.setState({
        // positionList: incomingPositionList,
        allCachedPositionsForThisBallotItem,
        allCachedPositionsForThisBallotItemLength: allCachedPositionsForThisBallotItem.length,
      });
    }
  }

  onFriendStoreChange () {
    const { allCachedPositionsForThisBallotItem } = this.state;
    this.onPositionListUpdate(allCachedPositionsForThisBallotItem);
  }

  onMeasureStoreChange () {
    const { ballotItemWeVoteId } = this.props;
    // console.log('PositionRowList onMeasureStoreChange, ballotItemWeVoteId:', ballotItemWeVoteId);
    let allCachedPositionsForThisBallotItem;
    if (ballotItemWeVoteId.includes('meas')) {
      allCachedPositionsForThisBallotItem = MeasureStore.getAllCachedPositionsByMeasureWeVoteId(ballotItemWeVoteId);
      this.setState({ allCachedPositionsForThisBallotItem });
      this.onPositionListUpdate(allCachedPositionsForThisBallotItem);
    }
  }

  onOrganizationStoreChange () {
    // console.log('PositionRowList onOrganizationStoreChange');
    const { allCachedPositionsForThisBallotItem } = this.state;
    this.onPositionListUpdate(allCachedPositionsForThisBallotItem);
  }

  onPositionListUpdate = (allCachedPositionsForThisBallotItem) => {
    const { showInfoOnly, showOppose, showSupport } = this.props;
    const organizationsVoterIsFollowing = OrganizationStore.getOrganizationsVoterIsFollowing();
    // eslint-disable-next-line arrow-body-style
    let filteredPositionList = allCachedPositionsForThisBallotItem.map((position) => {
      // console.log('PositionRowList onOrganizationStoreChange, position: ', position);
      return ({
        ...position,
        followed: organizationsVoterIsFollowing.filter((org) => org.organization_we_vote_id === position.speaker_we_vote_id).length > 0,
      });
    });

    const organizationsVoterIsFriendsWith = FriendStore.currentFriendsOrganizationWeVoteIDList();
    // console.log('PositionRowList onFriendStoreChange, organizationsVoterIsFriendsWith:', organizationsVoterIsFriendsWith);
    // eslint-disable-next-line arrow-body-style
    filteredPositionList = filteredPositionList.map((position) => {
      // console.log('PositionRowList componentDidMount, position: ', position);
      return ({
        ...position,
        currentFriend: organizationsVoterIsFriendsWith.filter((organizationWeVoteId) => organizationWeVoteId === position.speaker_we_vote_id).length > 0,
      });
    });

    // eslint-disable-next-line arrow-body-style
    filteredPositionList = filteredPositionList.map((position) => {
      // console.log('PositionRowList componentDidMount, position: ', position);
      return ({
        ...position,
        linkedToIssueVoterIsFollowing: IssueStore.isOrganizationLinkedToIssueVoterIsFollowing(position.speaker_we_vote_id),
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
    filteredPositionList = filteredPositionList.sort(this.orderByIssuesFollowedFirst);
    filteredPositionList = filteredPositionList.sort(this.orderByFollowedOrgsFirst);
    filteredPositionList = filteredPositionList.sort(this.orderByCurrentFriendsFirst);
    filteredPositionList = filteredPositionList.sort(this.orderByCurrentVoterFirst); // Always put current voter at top

    // console.log('PositionRowList onPositionListUpdate, filteredPositionList:', filteredPositionList);
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

  orderByIssuesFollowedFirst = (firstGuide, secondGuide) => {
    const secondGuideIsLinkedToIssueVoterIsFollowing = secondGuide && secondGuide.linkedToIssueVoterIsFollowing === true ? 1 : 0;
    const firstGuideIsLinkedToIssueVoterIsFollowing = firstGuide && firstGuide.linkedToIssueVoterIsFollowing === true ? 1 : 0;
    return secondGuideIsLinkedToIssueVoterIsFollowing - firstGuideIsLinkedToIssueVoterIsFollowing;
  };

  orderByTwitterFollowers = (firstGuide, secondGuide) => secondGuide.twitter_followers_count - firstGuide.twitter_followers_count;

  orderByWrittenComment = (firstGuide, secondGuide) => {
    const secondGuideHasStatement = secondGuide && secondGuide.statement_text && secondGuide.statement_text.length ? 1 : 0;
    const firstGuideHasStatement = firstGuide && firstGuide.statement_text && firstGuide.statement_text.length ? 1 : 0;
    return secondGuideHasStatement - firstGuideHasStatement;
  };

  render () {
    const {
      ballotItemWeVoteId, showInfoOnly, showOppose, showSupport,
    } = this.props;
    const {
      allCachedPositionsForThisBallotItemLength,
      filteredPositionList, filteredPositionListLength, numberOfPositionItemsToDisplay,
    } = this.state;
    renderLog('PositionRowList');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('PositionRowList render, filteredPositionList:', filteredPositionList, ', filteredPositionListLength:', filteredPositionListLength);
    // console.log('PositionRowList, ballotItemWeVoteId:', ballotItemWeVoteId);
    if (!filteredPositionList) {
      // console.log('PositionRowList Loading...');
      return LoadingWheel;
    }
    // console.log('TRYING TO RENDER, filteredPositionListLength: ', filteredPositionListLength);
    let numberOfPositionItemsDisplayed = 0;
    if (showSupport && allCachedPositionsForThisBallotItemLength === 0) {
      const avatar = normalizedImagePath('../../img/global/svg-icons/avatar-generic.svg');
      const imagePlaceholder = (
        <SvgImage imageName={avatar} />
      );
      return (
        <CandidateEndorsementsWrapper>
          <ChooseOpposeInfoHeaderWrapper>
            <ChooseEmptyHeaderWrapper>
              <ChooseEmptyHeaderText>
                Choose
              </ChooseEmptyHeaderText>
            </ChooseEmptyHeaderWrapper>
          </ChooseOpposeInfoHeaderWrapper>
          <CandidateEndorsementsContainer id={`PositionRowEmpty-${ballotItemWeVoteId}`} onClick={this.onClickAskFriends}>
            <PositionRowItemEmptyWrapper>
              <EmptyPhotoOuterWrapper>
                <OrganizationPhotoInnerWrapper>
                  { imagePlaceholder }
                </OrganizationPhotoInnerWrapper>
              </EmptyPhotoOuterWrapper>
              <HorizontalSpacer />
              <EmptyTextWrapper>
                <EmptyText>
                  No endorsements found for this candidate.
                </EmptyText>
              </EmptyTextWrapper>
            </PositionRowItemEmptyWrapper>
          </CandidateEndorsementsContainer>
        </CandidateEndorsementsWrapper>
      );
    } else {
      return (
        <CandidateEndorsementsWrapper>
          {filteredPositionListLength > 0 && (
            <ChooseOpposeInfoHeaderWrapper>
              <Suspense fallback={<></>}>
                <PositionRowSupportOpposeCountDisplay
                  ballotItemWeVoteId={ballotItemWeVoteId}
                  // goToBallotItem={this.onClickShowOrganizationModal}
                  showInfoOnly={showInfoOnly}
                  showOppose={showOppose}
                  showSupport={showSupport}
                />
              </Suspense>
            </ChooseOpposeInfoHeaderWrapper>
          )}
          <CandidateEndorsementsContainer>
            {filteredPositionList.map((onePosition) => {
              // console.log('numberOfPositionItemsDisplayed:', numberOfPositionItemsDisplayed, ', numberOfPositionItemsToDisplay:', numberOfPositionItemsToDisplay);
              if (numberOfPositionItemsDisplayed >= numberOfPositionItemsToDisplay) {
                return null;
              }
              numberOfPositionItemsDisplayed += 1;
              return (
                <CandidateEndorsementContainer
                  key={`${onePosition.position_we_vote_id}-${onePosition.voter_guide_we_vote_id}-${onePosition.speaker_display_name}`}
                >
                  <PositionRowItem
                    position={onePosition}
                  />
                </CandidateEndorsementContainer>
              );
            })}
            {filteredPositionListLength > numberOfPositionItemsToDisplay && (
              <div>
                <TopSpacer />
                <ShowMoreEndorsementsContainer
                  onClick={() => this.increaseNumberOfPositionItemsToDisplay()}
                >
                  <ShowMoreEndorsementsLink className="u-link-color">
                    {filteredPositionListLength - numberOfPositionItemsDisplayed}
                    {' '}
                    more
                  </ShowMoreEndorsementsLink>
                </ShowMoreEndorsementsContainer>
              </div>
            )}
            {numberOfPositionItemsDisplayed > 0 && (
              <CandidateEndorsementsRightSpacer />
            )}
          </CandidateEndorsementsContainer>
        </CandidateEndorsementsWrapper>
      );
    }
  }
}
PositionRowList.propTypes = {
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

const CandidateEndorsementContainer = styled('div')(({ theme }) => (`
  min-width: 58px;
  ${theme.breakpoints.down('xs')} {
    display: none;
  }
`));

const CandidateEndorsementsRightSpacer = styled('div')`
  margin-right: 0px;
`;

const CandidateEndorsementsWrapper = styled('div')`
  height: 100%;
`;

const ChooseEmptyHeaderText = styled('div')`
  color: #999;
  line-height: 20px;
  margin-left: 6px;
  margin-right: 24px;
`;

const ChooseEmptyHeaderWrapper = styled('div')`
  border-bottom: 1px solid #dcdcdc;
`;

const ChooseOpposeInfoHeaderWrapper = styled('div')`
  border-left: 1px dotted #dcdcdc;
`;

const ShowMoreEndorsementsContainer = styled('div')(({ theme }) => (`
  cursor: pointer;
  display: flex;
  justify-content: center;
  min-width: 50px;
  width: 50px;
  ${theme.breakpoints.down('xs')} {
    display: none;
  }
`));

const ShowMoreEndorsementsLink = styled('div')`
  font-size: 14px;
  line-height: 15px;
  margin-top: 10px;
  text-align: center
`;

const TopSpacer = styled('div')`
  height: 6px;
`;

export default withTheme(withStyles(styles)(PositionRowList));
