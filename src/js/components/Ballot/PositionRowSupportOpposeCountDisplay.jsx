import { Comment,  ThumbDown, ThumbUp } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import SupportActions from '../../actions/SupportActions';
import CandidateStore from '../../stores/CandidateStore';
import FriendStore from '../../stores/FriendStore';
import IssueStore from '../../stores/IssueStore';
import MeasureStore from '../../stores/MeasureStore';
import OrganizationStore from '../../stores/OrganizationStore';
import SupportStore from '../../stores/SupportStore';
import { renderLog } from '../../common/utils/logging';
import { getPositionListSummaryIncomingDataStats, getPositionSummaryListForBallotItem } from '../../utils/positionFunctions';
import { stringContains } from '../../utils/textFormat';
import StickyPopover from './StickyPopover';
import { openSnackbar } from '../Widgets/SnackNotifier';

const ItemActionBar = React.lazy(() => import(/* webpackChunkName: 'ItemActionBar' */ '../Widgets/ItemActionBar/ItemActionBar'));
const PositionSummaryListForPopover = React.lazy(() => import(/* webpackChunkName: 'PositionSummaryListForPopover' */ '../Widgets/PositionSummaryListForPopover'));


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
      ballotItemDisplayName: '',
      ballotItemWeVoteId: '',
      componentDidMountFinished: false,
      issueWeVoteIdsLinkedToByOrganizationDictLength: 0,
      organizationWeVoteIdsVoterIsFollowingLength: 0,
      positionsInNetworkSummaryListLength: 0,
      positionsOutOfNetworkSummaryList: [],
      positionsOutOfNetworkSummaryListLength: 0,
      voterOpposesListLength: 0,
      voterSupportsListLength: 0,
      voterPersonalNetworkScore: 0,
      voterOpposesBallotItem: false,
      voterSupportsBallotItem: false,
    };
    this.goToBallotItemLinkLocal = this.goToBallotItemLinkLocal.bind(this);
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
    let ballotItemDisplayName = '';
    const { ballotItemWeVoteId } = this.props;
    const isCandidate = stringContains('cand', ballotItemWeVoteId);
    const isMeasure = stringContains('meas', ballotItemWeVoteId);
    // console.log('isCandidate:', isCandidate, 'isMeasure:', isMeasure);
    if (isCandidate) {
      const candidate = CandidateStore.getCandidate(ballotItemWeVoteId);
      ballotItemDisplayName = candidate.ballot_item_display_name || this.props.ballotItemDisplayName;
      const countResults = CandidateStore.getNumberOfPositionsByCandidateWeVoteId(ballotItemWeVoteId);
      const { numberOfAllSupportPositions, numberOfAllOpposePositions, numberOfAllInfoOnlyPositions } = countResults;
      this.setState({
        ballotItemDisplayName,
        numberOfAllSupportPositions,
        numberOfAllOpposePositions,
        numberOfAllInfoOnlyPositions,
      });
    } else if (isMeasure) {
      const measure = MeasureStore.getMeasure(ballotItemWeVoteId);
      ballotItemDisplayName = measure.ballot_item_display_name || this.props.ballotItemDisplayName;
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
      ballotItemWeVoteId,
      componentDidMountFinished: true,
      isCandidate,
      isMeasure,
    });
    this.onCachedPositionsOrIssueStoreChange();
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.state.componentDidMountFinished === false) {
      // console.log('shouldComponentUpdate: componentDidMountFinished === false');
      return true;
    }
    if (this.state.ballotItemDisplayName !== nextState.ballotItemDisplayName) {
      // console.log('this.state.ballotItemDisplayName:', this.state.ballotItemDisplayName, ', nextState.ballotItemDisplayName:', nextState.ballotItemDisplayName);
      return true;
    }
    if (this.state.ballotItemWeVoteId !== nextState.ballotItemWeVoteId) {
      // console.log('this.state.ballotItemWeVoteId:', this.state.ballotItemWeVoteId, ', nextState.ballotItemWeVoteId:', nextState.ballotItemWeVoteId);
      return true;
    }
    if (this.state.controlAdviserMaterialUIPopoverFromProp !== nextState.controlAdviserMaterialUIPopoverFromProp) {
      // console.log('this.state.controlAdviserMaterialUIPopoverFromProp:', this.state.controlAdviserMaterialUIPopoverFromProp, ', nextState.controlAdviserMaterialUIPopoverFromProp:', nextState.controlAdviserMaterialUIPopoverFromProp);
      return true;
    }
    if (this.state.issueWeVoteIdsLinkedToByOrganizationDictLength !== nextState.issueWeVoteIdsLinkedToByOrganizationDictLength) {
      // console.log('this.state.issueWeVoteIdsLinkedToByOrganizationDictLength:', this.state.issueWeVoteIdsLinkedToByOrganizationDictLength, ', nextState.issueWeVoteIdsLinkedToByOrganizationDictLength:', nextState.issueWeVoteIdsLinkedToByOrganizationDictLength);
      return true;
    }
    if (this.state.numberOfAllSupportPositions !== nextState.numberOfAllSupportPositions) {
      return true;
    }
    if (this.state.numberOfAllOpposePositions !== nextState.numberOfAllOpposePositions) {
      return true;
    }
    if (this.state.numberOfAllInfoOnlyPositions !== nextState.numberOfAllInfoOnlyPositions) {
      return true;
    }
    if (this.props.closeSupportOpposeCountDisplayModal !== nextProps.closeSupportOpposeCountDisplayModal) {
      return true;
    }
    if (this.props.openAdviserMaterialUIPopover !== nextProps.openAdviserMaterialUIPopover) {
      return true;
    }
    if (this.props.openSupportOpposeCountDisplayModal !== nextProps.openSupportOpposeCountDisplayModal) {
      return true;
    }
    if (this.state.organizationWeVoteIdsVoterIsFollowingLength !== nextState.organizationWeVoteIdsVoterIsFollowingLength) {
      // console.log('this.state.organizationWeVoteIdsVoterIsFollowingLength:', this.state.organizationWeVoteIdsVoterIsFollowingLength, ', nextState.organizationWeVoteIdsVoterIsFollowingLength:', nextState.organizationWeVoteIdsVoterIsFollowingLength);
      return true;
    }
    if (this.state.positionsInNetworkSummaryListLength !== nextState.positionsInNetworkSummaryListLength) {
      return true;
    }
    if (this.state.positionsOutOfNetworkSummaryListLength !== nextState.positionsOutOfNetworkSummaryListLength) {
      return true;
    }
    if (this.props.supportOpposeCountDisplayModalTutorialOn !== nextProps.supportOpposeCountDisplayModalTutorialOn) {
      return true;
    }
    if (this.props.supportOpposeCountDisplayModalTutorialText !== nextProps.supportOpposeCountDisplayModalTutorialText) {
      return true;
    }
    if (this.props.showDownArrow !== nextProps.showDownArrow) {
      return true;
    }
    if (this.props.showUpArrow !== nextProps.showUpArrow) {
      return true;
    }
    if (this.state.voterPersonalNetworkScore !== nextState.voterPersonalNetworkScore) {
      // console.log('this.state.voterPersonalNetworkScore:', this.state.voterPersonalNetworkScore, ', nextState.voterPersonalNetworkScore:', nextState.voterPersonalNetworkScore);
      return true;
    }
    if (this.state.voterOpposesBallotItem !== nextState.voterOpposesBallotItem) {
      // console.log('this.state.voterOpposesBallotItem:', this.state.voterOpposesBallotItem, ', nextState.voterOpposesBallotItem:', nextState.voterOpposesBallotItem);
      return true;
    }
    if (this.state.voterSupportsBallotItem !== nextState.voterSupportsBallotItem) {
      // console.log('this.state.voterSupportsBallotItem:', this.state.voterSupportsBallotItem, ', nextState.voterSupportsBallotItem:', nextState.voterSupportsBallotItem);
      return true;
    }
    return false;
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
          voterPersonalNetworkScoreWithSign = `+${voterPersonalNetworkScore}`;
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
      const { ballotItemWeVoteId: candidateWeVoteId } = this.state;
      const countResults = CandidateStore.getNumberOfPositionsByCandidateWeVoteId(candidateWeVoteId);
      const { numberOfAllSupportPositions, numberOfAllOpposePositions, numberOfAllInfoOnlyPositions } = countResults;
      this.setState({
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
      const { ballotItemWeVoteId: measureWeVoteId } = this.state;
      const countResults = MeasureStore.getNumberOfPositionsByMeasureWeVoteId(measureWeVoteId);
      const { numberOfAllSupportPositions, numberOfAllOpposePositions, numberOfAllInfoOnlyPositions } = countResults;
      this.setState({
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

  handleEnterHoverLocalArea = () => {
    const { openSupportOpposeCountDisplayModal } = this.props;
    if (openSupportOpposeCountDisplayModal) {
      // If we open the Popover with a prop, then don't let the mouse motion close it
    } else if (this.props.handleLeaveCandidateCard) {
      this.props.handleLeaveCandidateCard();
    }
  };

  handleLeaveHoverLocalArea = () => {
    const { openSupportOpposeCountDisplayModal } = this.props;
    if (openSupportOpposeCountDisplayModal) {
      // If we open the Popover with a prop, then don't let the mouse motion close it
    } else if (this.props.handleEnterCandidateCard) {
      this.props.handleEnterCandidateCard();
    }
  };

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
      ballotItemWeVoteId, classes, controlAdviserMaterialUIPopoverFromProp, inModal,
      openAdviserMaterialUIPopover, uniqueExternalId,
    } = this.props;
    // console.log('PositionRowSupportOpposeCountDisplay, controlAdviserMaterialUIPopoverFromProp: ', controlAdviserMaterialUIPopoverFromProp,  ', openAdviserMaterialUIPopover:', openAdviserMaterialUIPopover);
    const {
      ballotItemDisplayName,
      numberOfAllSupportPositions, numberOfAllOpposePositions, numberOfAllInfoOnlyPositions,
      positionsOutOfNetworkSummaryList,
      voterPersonalNetworkScore,
      voterPersonalNetworkScoreIsNegative,
      voterPersonalNetworkScoreIsPositive,
      voterPersonalNetworkScoreWithSign,
    } = this.state;
    // console.log('PositionRowSupportOpposeCountDisplay render, voterSupportsBallotItem/voterOpposesBallotItem:', voterSupportsBallotItem, voterOpposesBallotItem);

    if (!ballotItemWeVoteId) return null;

    const endorsementsOverviewPopover = (
      <PopoverWrapper>
        <PopoverHeader>
          <PopoverTitleText>
            Opinions
            {ballotItemDisplayName ? ` about ${ballotItemDisplayName}` : ''}
            {' '}
          </PopoverTitleText>
        </PopoverHeader>
        <PopoverBody>
          <ItemActionBarWrapper>
            <Suspense fallback={<></>}>
              <ItemActionBar
                inModal={inModal}
                ballotItemWeVoteId={ballotItemWeVoteId}
                commentButtonHide
                externalUniqueId={`BallotItemSupportOrOpposeCountDisplay-ItemActionBar-${uniqueExternalId}-${ballotItemWeVoteId}`}
                hidePositionPublicToggle
                positionPublicToggleWrapAllowed
                shareButtonHide
              />
            </Suspense>
          </ItemActionBarWrapper>
          <div>
            Follow opinions to build your personalized score
            {(ballotItemDisplayName) && (
              <span>
                {' '}
                about
                {' '}
                <strong>
                  {ballotItemDisplayName}
                </strong>
              </span>
            )}
            .
          </div>
          <div>
            {positionsOutOfNetworkSummaryList && (
              <RenderedOrganizationsWrapper>
                <Suspense fallback={<></>}>
                  <PositionSummaryListForPopover
                    ballotItemWeVoteId={ballotItemWeVoteId}
                    controlAdviserMaterialUIPopoverFromProp={controlAdviserMaterialUIPopoverFromProp}
                    openAdviserMaterialUIPopover={openAdviserMaterialUIPopover}
                    positionSummaryList={positionsOutOfNetworkSummaryList}
                    showAllPositions={this.props.goToBallotItem}
                    voterPersonalNetworkScore={voterPersonalNetworkScore}
                    voterPersonalNetworkScoreIsNegative={voterPersonalNetworkScoreIsNegative}
                    voterPersonalNetworkScoreIsPositive={voterPersonalNetworkScoreIsPositive}
                    voterPersonalNetworkScoreWithSign={voterPersonalNetworkScoreWithSign}
                  />
                </Suspense>
              </RenderedOrganizationsWrapper>
            )}
          </div>
        </PopoverBody>
      </PopoverWrapper>
    );

    const commentCountExists = numberOfAllInfoOnlyPositions > 0;
    // const opposeCountExists = numberOfAllOpposePositions > 0;
    // Default settings
    const showOpposeCount = true;
    let showCommentCount = false;
    if (commentCountExists) {
      // Override if comment count exists, and oppose count does not
      showCommentCount = true;
    }
    // console.log('showVoterPersonalScore:', showVoterPersonalScore);
    // console.log('voterSupportsBallotItem:', voterSupportsBallotItem);
    // console.log('voterOpposesBallotItem:', voterOpposesBallotItem);
    // console.log('(!showVoterPersonalScore && !voterSupportsBallotItem && !voterOpposesBallotItem):', (!showVoterPersonalScore && !voterSupportsBallotItem && !voterOpposesBallotItem));
    // console.log('(showVoterPersonalScore && !voterSupportsBallotItem && !voterOpposesBallotItem):', (showVoterPersonalScore && !voterSupportsBallotItem && !voterOpposesBallotItem));
    return (
      <Wrapper
        onMouseEnter={this.handleEnterHoverLocalArea}
        onMouseLeave={this.handleLeaveHoverLocalArea}
      >
        {/* Gray overview display. Show if no personalized score, or voter position */}
        <EndorsementsOverviewShowOrNotShow>
          <StickyPopover
            delay={{ show: 700, hide: 100 }}
            popoverComponent={endorsementsOverviewPopover}
            placement="bottom"
            id="endorsements-overview-trigger-click-root-close"
            openOnClick
            // openPopoverByProp={openSupportOpposeCountDisplayModal}
            // closePopoverByProp={closeSupportOpposeCountDisplayModal}
            showCloseIcon
          >
            <EndorsementsContainer className="u-cursor--pointer u-no-break">
              <EndorsementsTitle>
                Opinions
              </EndorsementsTitle>
              <EndorsementsOuterWrapper>
                <EndorsementsInnerWrapper>
                  <EndorsementRow>
                    <ThumbUp classes={{ root: classes.endorsementIconRoot }} />
                    <EndorsementCount>
                      {numberOfAllSupportPositions}
                      {' '}
                      Yes
                    </EndorsementCount>
                  </EndorsementRow>
                  { showOpposeCount && (
                    <EndorsementRow>
                      <ThumbDown classes={{ root: classes.endorsementIconRoot }} />
                      <EndorsementCount>
                        {numberOfAllOpposePositions}
                        {' '}
                        No
                      </EndorsementCount>
                    </EndorsementRow>
                  )}
                  { showCommentCount && (
                    <EndorsementRow>
                      <Comment classes={{ root: classes.endorsementIconRoot }} />
                      <EndorsementCount>
                        {numberOfAllInfoOnlyPositions}
                        {' '}
                        Info
                      </EndorsementCount>
                    </EndorsementRow>
                  )}
                </EndorsementsInnerWrapper>
              </EndorsementsOuterWrapper>
            </EndorsementsContainer>
          </StickyPopover>
        </EndorsementsOverviewShowOrNotShow>
        <EndorsementsOverviewSpacer />
      </Wrapper>
    );
  }
}
PositionRowSupportOpposeCountDisplay.propTypes = {
  ballotItemDisplayName: PropTypes.string,
  ballotItemWeVoteId: PropTypes.string.isRequired,
  classes: PropTypes.object,
  closeSupportOpposeCountDisplayModal: PropTypes.bool,
  controlAdviserMaterialUIPopoverFromProp: PropTypes.bool,
  goToBallotItem: PropTypes.func, // We don't require this because sometimes we don't want the link to do anything
  handleLeaveCandidateCard: PropTypes.func,
  handleEnterCandidateCard: PropTypes.func,
  inModal: PropTypes.bool,
  openAdviserMaterialUIPopover: PropTypes.bool,
  openSupportOpposeCountDisplayModal: PropTypes.bool,
  supportOpposeCountDisplayModalTutorialOn: PropTypes.bool,
  supportOpposeCountDisplayModalTutorialText: PropTypes.object,
  showDownArrow: PropTypes.bool,
  showUpArrow: PropTypes.bool,
  uniqueExternalId: PropTypes.string,
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

const EndorsementCount = styled('div')`
  line-height: 15px;
  padding-top: 3px;
`;

const EndorsementRow = styled('div')`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin-left: 16px;
`;

const EndorsementsOuterWrapper = styled('div')`
  display: flex;
  justify-content: flex-start;
  margin-top: 6px;
`;

const EndorsementsOverviewShowOrNotShow = styled('div')`
`;

const EndorsementsContainer = styled('div')`
  display: flex;
  justify-content: flex-start;
`;

const EndorsementsInnerWrapper = styled('div')`
  color: #888;
  display: flex;
  justify-content: flex-start;
  text-align: right;
  user-select: none;
  margin-top: -4px;
`;

const EndorsementsOverviewSpacer = styled('div')`
  padding-right: 8px;
`;

const EndorsementsTitle = styled('div')`
  color: #888;
  margin-left: 8px;
  margin-right: 8px;
`;

const ItemActionBarWrapper = styled('div')`
  margin-bottom: 8px;
  width: 100%;
`;

const PopoverWrapper = styled('div')`
  width: 100%;
  height: 100%;
`;

const PopoverHeader = styled('div')(({ theme }) => (`
  background: ${theme.colors.brandBlue};
  padding: 4px 8px;
  min-height: 35px;
  color: white;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 5px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
`));

const PopoverTitleText = styled('div')`
  font-size: 14px;
  font-weight: bold;
  margin-right: 20px;
`;

const PopoverBody = styled('div')`
  padding: 8px;
  border-left: .5px solid #ddd;
  border-right: .5px solid #ddd;
  border-bottom: .5px solid #ddd;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;

const RenderedOrganizationsWrapper = styled('div')`
  margin-top: 6px;
`;

const Wrapper = styled('div')`
`;

export default withTheme(withStyles(styles)(PositionRowSupportOpposeCountDisplay));
