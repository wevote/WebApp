import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import OrganizationActions from '../../actions/OrganizationActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import apiCalming from '../../common/utils/apiCalming';
import { renderLog } from '../../common/utils/logging';
import AppObservableStore from '../../common/stores/AppObservableStore';
import { limitToShowInfoOnly, limitToShowOppose, limitToShowSupport, orderByTwitterFollowers, orderByWrittenComment } from '../../common/utils/orderByPositionFunctions';
import BallotStore from '../../stores/BallotStore';
import CandidateStore from '../../stores/CandidateStore';
import FriendStore from '../../stores/FriendStore';
import IssueStore from '../../stores/IssueStore';
import MeasureStore from '../../stores/MeasureStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import PositionRowItem from './PositionRowItem';
import {
  CandidateEndorsementsContainer,
} from '../Style/PositionRowListStyles';

const PositionRowSupportOpposeCountDisplay = React.lazy(() => import(/* webpackChunkName: 'PositionRowSupportOpposeCountDisplay' */ './PositionRowSupportOpposeCountDisplay'));

const STARTING_NUMBER_OF_POSITIONS_TO_DISPLAY = 5;

class PositionRowList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      filteredPositionList: [],
      filteredPositionListLength: 0,
      numberOfPositionItemsToDisplay: STARTING_NUMBER_OF_POSITIONS_TO_DISPLAY,
      supportPositionListLength: 0,
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
      this.onPositionListUpdate(allCachedPositionsForThisBallotItem);
    } else if (ballotItemWeVoteId.includes('meas')) {
      allCachedPositionsForThisBallotItem = MeasureStore.getAllCachedPositionsByMeasureWeVoteId(ballotItemWeVoteId);
      this.onPositionListUpdate(allCachedPositionsForThisBallotItem);
    }
    this.ballotStoreListener = BallotStore.addListener(this.onCandidateStoreChange.bind(this));
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.measureStoreListener = MeasureStore.addListener(this.onFriendStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));

    if (apiCalming('organizationsFollowedRetrieve', 60000)) {
      OrganizationActions.organizationsFollowedRetrieve();
    }
    const organizationsVoterIsFriendsWith = FriendStore.currentFriendsOrganizationWeVoteIDList();
    if (!organizationsVoterIsFriendsWith.length > 0) {
      if (apiCalming('friendListsAll', 3000)) {
        FriendActions.friendListsAll();
      }
    }
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
    this.candidateStoreListener.remove();
    this.friendStoreListener.remove();
    this.measureStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
    if (this.positionItemTimer) clearTimeout(this.positionItemTimer);
  }

  onBallotStoreChange () {
    // console.log('PositionRowList onBallotStoreChange');
    this.onCachedPositionsChange();
  }

  onCandidateStoreChange () {
    const { ballotItemWeVoteId } = this.props;
    // console.log('PositionRowList onCandidateStoreChange, ballotItemWeVoteId:', ballotItemWeVoteId);
    let allCachedPositionsForThisBallotItem;
    if (ballotItemWeVoteId.includes('cand')) {
      allCachedPositionsForThisBallotItem = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
      this.onPositionListUpdate(allCachedPositionsForThisBallotItem);
    }
  }

  onCachedPositionsChange () {
    const { ballotItemWeVoteId } = this.props;
    let allCachedPositionsForThisBallotItem;
    if (ballotItemWeVoteId.includes('cand')) {
      allCachedPositionsForThisBallotItem = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
      this.onPositionListUpdate(allCachedPositionsForThisBallotItem);
    } else if (ballotItemWeVoteId.includes('meas')) {
      allCachedPositionsForThisBallotItem = MeasureStore.getAllCachedPositionsByMeasureWeVoteId(ballotItemWeVoteId);
      this.onPositionListUpdate(allCachedPositionsForThisBallotItem);
    }
  }

  onFriendStoreChange () {
    // console.log('PositionRowList onOrganizationStoreChange');
    this.onCachedPositionsChange();
  }

  onMeasureStoreChange () {
    const { ballotItemWeVoteId } = this.props;
    // console.log('PositionRowList onMeasureStoreChange, ballotItemWeVoteId:', ballotItemWeVoteId);
    let allCachedPositionsForThisBallotItem;
    if (ballotItemWeVoteId.includes('meas')) {
      allCachedPositionsForThisBallotItem = MeasureStore.getAllCachedPositionsByMeasureWeVoteId(ballotItemWeVoteId);
      this.onPositionListUpdate(allCachedPositionsForThisBallotItem);
    }
  }

  onOrganizationStoreChange () {
    // console.log('PositionRowList onOrganizationStoreChange');
    this.onCachedPositionsChange();
  }

  onVoterGuideStoreChange () {
    // console.log('PositionRowList onVoterGuideStoreChange');
    this.onCachedPositionsChange();
  }

  onClickShowOrganizationModalWithPositions () {
    const { ballotItemWeVoteId } = this.props;
    // console.log('onClickShowOrganizationModalWithPositions, ballotItemWeVoteId:', ballotItemWeVoteId);
    AppObservableStore.setOrganizationModalBallotItemWeVoteId(ballotItemWeVoteId);
    AppObservableStore.setShowOrganizationModal(true);
    AppObservableStore.setHideOrganizationModalBallotItemInfo(true);
  }

  onPositionListUpdate = (allCachedPositionsForThisBallotItem) => {
    const { showInfoOnly, showOppose, showOpposeDisplayNameIfNoSupport, showSupport } = this.props;
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

    if (showOpposeDisplayNameIfNoSupport) {
      let supportPositionList = JSON.parse(JSON.stringify(filteredPositionList));
      supportPositionList = limitToShowSupport(supportPositionList);
      this.setState({
        supportPositionListLength: supportPositionList.length,
      });
    }

    if (showInfoOnly) {
      filteredPositionList = limitToShowInfoOnly(filteredPositionList);
    } else if (showOppose) {
      filteredPositionList = limitToShowOppose(filteredPositionList);
    } else if (showSupport) {
      filteredPositionList = limitToShowSupport(filteredPositionList);
    }
    filteredPositionList = filteredPositionList.sort(orderByTwitterFollowers);
    filteredPositionList = filteredPositionList.sort(orderByWrittenComment);
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

  // increaseNumberOfPositionItemsToDisplay = () => {
  //   let { numberOfPositionItemsToDisplay } = this.state;
  //   // console.log('Number of position items before increment: ', numberOfPositionItemsToDisplay);
  //
  //   numberOfPositionItemsToDisplay += 5;
  //   // console.log('Number of position items after increment: ', numberOfPositionItemsToDisplay);
  //
  //   if (this.positionItemTimer) clearTimeout(this.positionItemTimer);
  //   this.positionItemTimer = setTimeout(() => {
  //     this.setState({
  //       numberOfPositionItemsToDisplay,
  //     });
  //   }, 500);
  // }

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

  render () {
    const {
      ballotItemWeVoteId, showInfoOnly, showOppose, showOpposeDisplayName, showOpposeDisplayNameIfNoSupport, showSupport,
    } = this.props;
    const {
      filteredPositionList, filteredPositionListLength, numberOfPositionItemsToDisplay, supportPositionListLength,
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
    let showOpposeDisplayNameBecauseNoSupport = false;
    if (showOpposeDisplayNameIfNoSupport && supportPositionListLength === 0) {
      showOpposeDisplayNameBecauseNoSupport = true;
    }
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
                showOpposeDisplayName={showOpposeDisplayName || showOpposeDisplayNameBecauseNoSupport}
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
                onClick={() => this.onClickShowOrganizationModalWithPositions()}
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
PositionRowList.propTypes = {
  ballotItemWeVoteId: PropTypes.string.isRequired,
  showInfoOnly: PropTypes.bool,
  showOppose: PropTypes.bool,
  showOpposeDisplayName: PropTypes.bool,
  showOpposeDisplayNameIfNoSupport: PropTypes.bool,
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
