import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import SupportActions from '../../actions/SupportActions';
import { renderLog } from '../../common/utils/logging';
import stringContains from '../../common/utils/stringContains';
import CandidateStore from '../../stores/CandidateStore';
import FriendStore from '../../stores/FriendStore';
import IssueStore from '../../stores/IssueStore';
import MeasureStore from '../../stores/MeasureStore';
import OrganizationStore from '../../stores/OrganizationStore';
import SupportStore from '../../stores/SupportStore';
import {
  getPositionListSummaryIncomingDataStats,
  getPositionSummaryListForBallotItem,
} from '../../utils/positionFunctions';
import { openSnackbar } from '../../common/components/Widgets/SnackNotifier';
import AppObservableStore from '../../common/stores/AppObservableStore';


class PositionRowSupportOpposeCountDisplay extends Component {
  static closePositionsPopover () {
    document.body.click();
  }

  constructor (props) {
    super(props);
    this.mobile = 'ontouchstart' in document.documentElement;
    this.state = {
      allCachedPositionsLength: 0,
      allIssuesVoterIsFollowingLength: 0,
      issueWeVoteIdsLinkedToByOrganizationDictLength: 0,
      organizationWeVoteIdsVoterIsFollowingLength: 0,
      voterOpposesListLength: 0,
      voterSupportsListLength: 0,
      voterOpposesBallotItem: false,
      voterSupportsBallotItem: false,
    };
    this.goToBallotItemLinkLocal = this.goToBallotItemLinkLocal.bind(this);
    this.onClickShowOrganizationModalWithPositions = this.onClickShowOrganizationModalWithPositions.bind(this);
    this.stopOpposingItem = this.stopOpposingItem.bind(this);
    this.stopSupportingItem = this.stopSupportingItem.bind(this);
  }

  componentDidMount () {
    // console.log('PositionRowSupportOpposeCountDisplay componentDidMount');
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    const { ballotItemWeVoteId } = this.props;
    const isCandidate = stringContains('cand', ballotItemWeVoteId);
    const isMeasure = stringContains('meas', ballotItemWeVoteId);
    // console.log('isCandidate:', isCandidate, 'isMeasure:', isMeasure);
    if (isCandidate) {
      const ballotItemDisplayName = CandidateStore.getCandidateName(ballotItemWeVoteId);
      const countResults = CandidateStore.getNumberOfPositionsByCandidateWeVoteId(ballotItemWeVoteId);
      const { numberOfAllSupportPositions, numberOfAllOpposePositions, numberOfAllInfoOnlyPositions } = countResults;
      this.setState({
        ballotItemDisplayName,
        numberOfAllSupportPositions,
        numberOfAllOpposePositions,
        numberOfAllInfoOnlyPositions,
      });
    } else if (isMeasure) {
      const ballotItemDisplayName = MeasureStore.getMeasureName(ballotItemWeVoteId);
      const countResults = MeasureStore.getNumberOfPositionsByMeasureWeVoteId(ballotItemWeVoteId);
      const { numberOfAllSupportPositions, numberOfAllOpposePositions, numberOfAllInfoOnlyPositions } = countResults;
      this.setState({
        ballotItemDisplayName,
        numberOfAllSupportPositions,
        numberOfAllOpposePositions,
        numberOfAllInfoOnlyPositions,
      });
    }
    this.setState({
      isCandidate,
      isMeasure,
    });
    this.onCachedPositionsOrIssueStoreChange();
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('PositionRowSupportOpposeCountDisplay caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.friendStoreListener.remove();
    this.issueStoreListener.remove();
    this.measureStoreListener.remove();
    this.organizationStoreListener.remove();
    this.supportStoreListener.remove();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) {       // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a 'Oh snap' page
    return { hasError: true };
  }

  onCachedPositionsOrIssueStoreChange () {
    const { ballotItemWeVoteId } = this.props;
    const {
      allCachedPositionsLength: priorAllCachedPositionsLength,
      allIssuesVoterIsFollowingLength: priorAllIssuesVoterIsFollowingLength,
      currentFriendsOrganizationWeVoteIdsLength: priorCurrentFriendsOrganizationWeVoteIdsLength,
      issueWeVoteIdsLinkedToByOrganizationDictLength: priorIssueWeVoteIdsLinkedToByOrganizationDictLength,
      organizationWeVoteIdsVoterIsFollowingLength: priorOrganizationWeVoteIdsVoterIsFollowingLength,
      voterOpposesBallotItem: priorVoterOpposesBallotItem,
      voterOpposesListLength: priorVoterOpposesListLength,
      voterSupportsBallotItem: priorVoterSupportsBallotItem,
      voterSupportsListLength: priorVoterSupportsListLength,
    } = this.state;

    // Before we try to update the PositionSummaryList, make sure we have minimum data and that there has been a change
    const results = getPositionListSummaryIncomingDataStats(ballotItemWeVoteId);
    const {
      allCachedPositionsLength, allIssuesVoterIsFollowingLength,
      currentFriendsOrganizationWeVoteIdsLength, issueWeVoteIdsLinkedToByOrganizationDictLength, organizationWeVoteIdsVoterIsFollowingLength,
      voterOpposesListLength, voterSupportsListLength,
    } = results;
    // console.log('allCachedPositionsLength:', allCachedPositionsLength, ', priorAllCachedPositionsLength:', priorAllCachedPositionsLength);
    // console.log('allIssuesVoterIsFollowingLength:', allIssuesVoterIsFollowingLength, ', priorAllIssuesVoterIsFollowingLength:', priorAllIssuesVoterIsFollowingLength);
    // console.log('issueWeVoteIdsLinkedToByOrganizationDictLength:', issueWeVoteIdsLinkedToByOrganizationDictLength, ', priorIssueWeVoteIdsLinkedToByOrganizationDictLength:', priorIssueWeVoteIdsLinkedToByOrganizationDictLength);
    // console.log('organizationWeVoteIdsVoterIsFollowingLength:', organizationWeVoteIdsVoterIsFollowingLength, ', priorOrganizationWeVoteIdsVoterIsFollowingLength:', priorOrganizationWeVoteIdsVoterIsFollowingLength);
    // console.log('voterOpposesListLength:', voterOpposesListLength, ', priorVoterOpposesListLength:', priorVoterOpposesListLength);
    // console.log('voterSupportsListLength:', voterSupportsListLength, ', priorVoterSupportsListLength:', priorVoterSupportsListLength);

    let voterSupportsBallotItem = SupportStore.voterSupportsList[ballotItemWeVoteId] || false;
    let voterOpposesBallotItem = SupportStore.voterOpposesList[ballotItemWeVoteId] || false;

    const minimumPositionSummaryListVariablesFound = !!(allCachedPositionsLength !== undefined && (currentFriendsOrganizationWeVoteIdsLength || issueWeVoteIdsLinkedToByOrganizationDictLength || organizationWeVoteIdsVoterIsFollowingLength));
    const changedPositionSummaryListVariablesFound = !!((allCachedPositionsLength !== priorAllCachedPositionsLength) || (allIssuesVoterIsFollowingLength !== priorAllIssuesVoterIsFollowingLength) || (currentFriendsOrganizationWeVoteIdsLength !== priorCurrentFriendsOrganizationWeVoteIdsLength) || (issueWeVoteIdsLinkedToByOrganizationDictLength !== priorIssueWeVoteIdsLinkedToByOrganizationDictLength) || (organizationWeVoteIdsVoterIsFollowingLength !== priorOrganizationWeVoteIdsVoterIsFollowingLength) || (voterOpposesListLength !== priorVoterOpposesListLength) || (voterSupportsListLength !== priorVoterSupportsListLength));
    const changedVoterPosition = !!((voterOpposesBallotItem !== priorVoterOpposesBallotItem) || (voterSupportsBallotItem !== priorVoterSupportsBallotItem));
    // console.log('minimumPositionSummaryListVariablesFound:', minimumPositionSummaryListVariablesFound, ', changedPositionSummaryListVariablesFound:', changedPositionSummaryListVariablesFound, ', changedVoterPosition:', changedVoterPosition);

    const refreshPositionSummaryList = !!((minimumPositionSummaryListVariablesFound && changedPositionSummaryListVariablesFound) || changedVoterPosition);
    // console.log('refreshPositionSummaryList: ', refreshPositionSummaryList, ballotItemWeVoteId);
    let firstStateBatch;
    let secondStateBatch;
    if (refreshPositionSummaryList) {
      const limitToThisIssue = false;
      const showPositionsInVotersNetwork = true;
      const doNotShowPositionsInVotersNetwork = false;
      const showPositionsOutOfVotersNetwork = true;
      const positionsInNetworkSummaryList = getPositionSummaryListForBallotItem(ballotItemWeVoteId, limitToThisIssue, showPositionsInVotersNetwork);
      // console.log('positionsInNetworkSummaryList: ', positionsInNetworkSummaryList);
      const positionsInNetworkSummaryListLength = positionsInNetworkSummaryList.length;
      const positionsOutOfNetworkSummaryList = getPositionSummaryListForBallotItem(ballotItemWeVoteId, limitToThisIssue, doNotShowPositionsInVotersNetwork, showPositionsOutOfVotersNetwork);
      const positionsOutOfNetworkSummaryListLength = positionsOutOfNetworkSummaryList.length;
      firstStateBatch = {
        allCachedPositionsLength,
        allIssuesVoterIsFollowingLength,
        currentFriendsOrganizationWeVoteIdsLength,
        issueWeVoteIdsLinkedToByOrganizationDictLength,
        organizationWeVoteIdsVoterIsFollowingLength,
        positionsInNetworkSummaryList,
        positionsInNetworkSummaryListLength,
        positionsOutOfNetworkSummaryList,
        positionsOutOfNetworkSummaryListLength,
        voterOpposesListLength,
        voterSupportsListLength,
      };
      const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(ballotItemWeVoteId);
      // Network Score
      let numberOfSupportPositionsForScore = 0;
      let numberOfOpposePositionsForScore = 0;
      let voterPersonalNetworkScore = 0;
      let voterPersonalScoreHasBeenCalculated = false;
      let voterPersonalNetworkScoreWithSign;
      let voterPersonalNetworkScoreIsNegative = false;
      let voterPersonalNetworkScoreIsPositive = false;
      if (ballotItemStatSheet) {
        ({ voterOpposesBallotItem, voterSupportsBallotItem } = ballotItemStatSheet);
        numberOfSupportPositionsForScore = parseInt(ballotItemStatSheet.numberOfSupportPositionsForScore) || 0;
        numberOfOpposePositionsForScore = parseInt(ballotItemStatSheet.numberOfOpposePositionsForScore) || 0;
        // console.log('numberOfSupportPositionsForScore:', numberOfSupportPositionsForScore);
        // console.log('numberOfOpposePositionsForScore:', numberOfOpposePositionsForScore);
        voterPersonalNetworkScore = numberOfSupportPositionsForScore - numberOfOpposePositionsForScore;
        if (voterPersonalNetworkScore > 0) {
          voterPersonalNetworkScoreWithSign = `${voterPersonalNetworkScore}`; // We no longer want to add '+' sign for positive numbers
          voterPersonalNetworkScoreIsPositive = true;
        } else if (voterPersonalNetworkScore < 0) {
          voterPersonalNetworkScoreWithSign = `${voterPersonalNetworkScore}`; // Minus sign '-' is already built into the number
          voterPersonalNetworkScoreIsNegative = true;
        } else {
          voterPersonalNetworkScoreWithSign = `${voterPersonalNetworkScore}`;
        }
      }

      let showVoterPersonalScore = true;
      if (numberOfSupportPositionsForScore === 0 && numberOfOpposePositionsForScore === 0) {
        // There is NOT an issue score, and BOTH network_support and network_oppose must be zero to hide Network Score
        showVoterPersonalScore = false;
      }
      if (numberOfSupportPositionsForScore || numberOfOpposePositionsForScore) {
        voterPersonalScoreHasBeenCalculated = true;
      }
      secondStateBatch = {
        showVoterPersonalScore,
        voterPersonalNetworkScore,
        voterPersonalNetworkScoreIsNegative,
        voterPersonalNetworkScoreIsPositive,
        voterPersonalNetworkScoreWithSign,
        voterPersonalScoreHasBeenCalculated,
        voterOpposesBallotItem,
        voterSupportsBallotItem,
      };
    }
    // Don't set state twice in the same function
    const combinedState = Object.assign({}, firstStateBatch, secondStateBatch); // eslint-disable-line prefer-object-spread
    this.setState(combinedState);
  }

  onCandidateStoreChange () {
    const { isCandidate } = this.state;
    if (isCandidate) {
      const { ballotItemWeVoteId } = this.props;
      const ballotItemDisplayName = CandidateStore.getCandidateName(ballotItemWeVoteId);
      const countResults = CandidateStore.getNumberOfPositionsByCandidateWeVoteId(ballotItemWeVoteId);
      const { numberOfAllSupportPositions, numberOfAllOpposePositions, numberOfAllInfoOnlyPositions } = countResults;
      this.setState({
        ballotItemDisplayName,
        numberOfAllSupportPositions,
        numberOfAllOpposePositions,
        numberOfAllInfoOnlyPositions,
      });
      this.onCachedPositionsOrIssueStoreChange();
    }
  }

  onMeasureStoreChange () {
    const { isMeasure } = this.state;
    if (isMeasure) {
      const { ballotItemWeVoteId } = this.props;
      const ballotItemDisplayName = MeasureStore.getMeasureName(ballotItemWeVoteId);
      const countResults = MeasureStore.getNumberOfPositionsByMeasureWeVoteId(ballotItemWeVoteId);
      const { numberOfAllSupportPositions, numberOfAllOpposePositions, numberOfAllInfoOnlyPositions } = countResults;
      this.setState({
        ballotItemDisplayName,
        numberOfAllSupportPositions,
        numberOfAllOpposePositions,
        numberOfAllInfoOnlyPositions,
      });
      this.onCachedPositionsOrIssueStoreChange();
    }
  }

  onFriendStoreChange () {
    // We want to re-render so friend data can update
    this.onCachedPositionsOrIssueStoreChange();
  }

  onIssueStoreChange () {
    // We want to re-render so issue data can update
    this.onCachedPositionsOrIssueStoreChange();
    const issueWeVoteIdsLinkedToByOrganizationDictLength = IssueStore.getIssueWeVoteIdsLinkedToByOrganizationDictLength();
    this.setState({
      issueWeVoteIdsLinkedToByOrganizationDictLength,
    });
  }

  onOrganizationStoreChange () {
    // We want to re-render so organization data can update
    this.onCachedPositionsOrIssueStoreChange();
    const organizationWeVoteIdsVoterIsFollowingLength = OrganizationStore.getOrganizationWeVoteIdsVoterIsFollowingLength();
    this.setState({
      organizationWeVoteIdsVoterIsFollowingLength,
    });
  }

  onSupportStoreChange () {
    this.onCachedPositionsOrIssueStoreChange();
  }

  onClickShowOrganizationModalWithPositions () {
    const { ballotItemWeVoteId } = this.props;
    // console.log('onClickShowOrganizationModalWithPositions, ballotItemWeVoteId:', ballotItemWeVoteId);
    AppObservableStore.setOrganizationModalBallotItemWeVoteId(ballotItemWeVoteId);
    AppObservableStore.setShowOrganizationModal(true);
    AppObservableStore.setHideOrganizationModalBallotItemInfo(true);
  }

  stopOpposingItem () {
    const { ballotItemWeVoteId } = this.props;
    const isMeasure = stringContains('meas', ballotItemWeVoteId);
    let kindOfBallotItem = 'CANDIDATE';
    if (isMeasure) {
      kindOfBallotItem = 'MEASURE';
    }
    // console.log('ItemActionBar, stopOpposingItem, transitioning:', this.state.transitioning);
    SupportActions.voterStopOpposingSave(ballotItemWeVoteId, kindOfBallotItem);
    openSnackbar({ message: 'Opposition removed!' });
  }

  stopSupportingItem () {
    const { ballotItemWeVoteId } = this.props;
    const isMeasure = stringContains('meas', ballotItemWeVoteId);
    let kindOfBallotItem = 'CANDIDATE';
    if (isMeasure) {
      kindOfBallotItem = 'MEASURE';
    }
    SupportActions.voterStopSupportingSave(ballotItemWeVoteId, kindOfBallotItem);
    openSnackbar({ message: 'Support removed!' });
  }

  goToBallotItemLinkLocal (ballotItemWeVoteId) {
    // console.log('PositionRowSupportOpposeCountDisplay goToBallotItemLinkLocal, ballotItemWeVoteId:', ballotItemWeVoteId);
    if (this.props.goToBallotItem) {
      this.props.goToBallotItem(ballotItemWeVoteId);
    }
  }

  render () {
    renderLog('PositionRowSupportOpposeCountDisplay');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      ballotItemWeVoteId, showInfoOnly, showNoOpinions, showOppose, showOpposeDisplayName, showSupport,
    } = this.props;
    // console.log('PositionRowSupportOpposeCountDisplay, controlAdviserMaterialUIPopoverFromProp: ', controlAdviserMaterialUIPopoverFromProp,  ', openAdviserMaterialUIPopover:', openAdviserMaterialUIPopover);
    const {
      ballotItemDisplayName,
      numberOfAllSupportPositions, numberOfAllOpposePositions, numberOfAllInfoOnlyPositions,
    } = this.state;
    // console.log('PositionRowSupportOpposeCountDisplay render, voterSupportsBallotItem/voterOpposesBallotItem:', voterSupportsBallotItem, voterOpposesBallotItem);

    if (!ballotItemWeVoteId) return null;

    const commentCountExists = numberOfAllInfoOnlyPositions > 0;
    // const opposeCountExists = numberOfAllOpposePositions > 0;
    // Default settings
    const showOpposeCount = true;
    let showInfoOnlyCount = false;
    if (commentCountExists) {
      // Override if comment count exists, and oppose count does not
      showInfoOnlyCount = true;
    }
    // console.log('showVoterPersonalScore:', showVoterPersonalScore);
    // console.log('voterSupportsBallotItem:', voterSupportsBallotItem);
    // console.log('voterOpposesBallotItem:', voterOpposesBallotItem);
    // console.log('(!showVoterPersonalScore && !voterSupportsBallotItem && !voterOpposesBallotItem):', (!showVoterPersonalScore && !voterSupportsBallotItem && !voterOpposesBallotItem));
    // console.log('(showVoterPersonalScore && !voterSupportsBallotItem && !voterOpposesBallotItem):', (showVoterPersonalScore && !voterSupportsBallotItem && !voterOpposesBallotItem));
    return (
      <Wrapper>
        {/* Gray overview display. Show if no personalized score, or voter position */}
        <EndorsementsOverviewShowOrNotShow>
          <EndorsementsContainer className="u-cursor--pointer u-no-break">
            <EndorsementsOuterWrapper>
              <EndorsementsInnerWrapper>
                {showSupport && (
                  <EndorsementRow onClick={this.onClickShowOrganizationModalWithPositions}>
                    <EndorsementCount>
                      <ChooseWrapper>
                        {numberOfAllSupportPositions > 1 ? (
                          <div>
                            {numberOfAllSupportPositions}
                            {' '}
                            Choose
                          </div>
                        ) : (
                          <div>
                            {numberOfAllSupportPositions}
                            {' '}
                            Chooses
                          </div>
                        )}
                        {ballotItemDisplayName && (
                          <BallotItemDisplayNameWrapper>
                            &nbsp;
                            <BallotItemDisplayName>
                              {ballotItemDisplayName}
                            </BallotItemDisplayName>
                          </BallotItemDisplayNameWrapper>
                        )}
                        <div>
                          &nbsp;&nbsp;&nbsp;
                        </div>
                      </ChooseWrapper>
                    </EndorsementCount>
                  </EndorsementRow>
                )}
                {showOppose && (
                  <>
                    { showOpposeCount && (
                      <EndorsementRow onClick={this.onClickShowOrganizationModalWithPositions}>
                        <EndorsementCount>
                          <OpposeWrapper>
                            {numberOfAllOpposePositions > 1 ? (
                              <div>
                                {numberOfAllOpposePositions}
                                {' '}
                                Oppose
                              </div>
                            ) : (
                              <div>
                                {numberOfAllOpposePositions}
                                {' '}
                                Opposes
                              </div>
                            )}
                            {(ballotItemDisplayName && showOpposeDisplayName) && (
                              <BallotItemDisplayNameWrapper>
                                &nbsp;
                                <BallotItemDisplayName>
                                  {ballotItemDisplayName}
                                </BallotItemDisplayName>
                              </BallotItemDisplayNameWrapper>
                            )}
                            <div>
                              &nbsp;&nbsp;&nbsp;
                            </div>
                          </OpposeWrapper>
                        </EndorsementCount>
                      </EndorsementRow>
                    )}
                  </>
                )}
                {showInfoOnly && (
                  <>
                    { showInfoOnlyCount && (
                      <EndorsementRow onClick={this.onClickShowOrganizationModalWithPositions}>
                        <EndorsementCount>
                          {numberOfAllInfoOnlyPositions > 1 ? (
                            <>
                              {/* {numberOfAllInfoOnlyPositions} */}
                              {' '}
                              Info
                            </>
                          ) : (
                            <>Info</>
                          )}
                        </EndorsementCount>
                      </EndorsementRow>
                    )}
                  </>
                )}
                {showNoOpinions && (
                  <EndorsementRow>
                    <EndorsementCount>
                      No Opinions
                    </EndorsementCount>
                  </EndorsementRow>
                )}
              </EndorsementsInnerWrapper>
            </EndorsementsOuterWrapper>
          </EndorsementsContainer>
        </EndorsementsOverviewShowOrNotShow>
        <EndorsementsOverviewSpacer />
      </Wrapper>
    );
  }
}
PositionRowSupportOpposeCountDisplay.propTypes = {
  ballotItemWeVoteId: PropTypes.string.isRequired,
  goToBallotItem: PropTypes.func, // We don't require this because sometimes we don't want the link to do anything
  showInfoOnly: PropTypes.bool,
  showOppose: PropTypes.bool,
  showOpposeDisplayName: PropTypes.bool,
  showNoOpinions: PropTypes.bool,
  showSupport: PropTypes.bool,
};

const styles = () => ({
  endorsementIconRoot: {
    fontSize: 14,
    margin: '3px 3px 0 0',
  },
  endorsementIcon: {
    width: 12,
    height: 12,
  },
});

const BallotItemDisplayName = styled('div')`
  max-width: 25ch;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const BallotItemDisplayNameWrapper = styled('div')`
  align-items: flex-start;
  display: flex;
  justify-content: flex-start;
`;

const ChooseWrapper = styled('div')`
  display: flex;
  justify-content: flex-start;
`;

const EndorsementCount = styled('div')`
  color: #999;
  line-height: 20px;
`;

const EndorsementRow = styled('div')`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin-left: 6px;
  min-width: 70px;
`;

const EndorsementsContainer = styled('div')`
  border-bottom: 1px solid #dcdcdc;
  display: flex;
  justify-content: flex-start;
`;

const EndorsementsInnerWrapper = styled('div')`
  display: flex;
  justify-content: flex-start;
  user-select: none;
`;

const EndorsementsOuterWrapper = styled('div')`
  display: flex;
  justify-content: flex-start;
`;

const EndorsementsOverviewShowOrNotShow = styled('div')`
`;

const EndorsementsOverviewSpacer = styled('div')`
  padding-right: 8px;
`;

const OpposeWrapper = styled('div')`
  display: flex;
  justify-content: flex-start;
`;

const Wrapper = styled('div')`
`;

export default withTheme(withStyles(styles)(PositionRowSupportOpposeCountDisplay));
