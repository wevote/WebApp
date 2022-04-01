import { ArrowRightAlt, Comment, Done, NotInterested, ThumbDown, ThumbUp } from '@mui/icons-material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import SupportActions from '../../actions/SupportActions';
import { renderLog } from '../../common/utils/logging';
import CandidateStore from '../../stores/CandidateStore';
import FriendStore from '../../stores/FriendStore';
import IssueStore from '../../stores/IssueStore';
import MeasureStore from '../../stores/MeasureStore';
import OrganizationStore from '../../stores/OrganizationStore';
import SupportStore from '../../stores/SupportStore';
import { getPositionListSummaryIncomingDataStats, getPositionSummaryListForBallotItem } from '../../utils/positionFunctions';
import { stringContains } from '../../utils/textFormat';
import StickyPopover from '../Ballot/StickyPopover';
import { openSnackbar } from './SnackNotifier';

const ItemActionBar = React.lazy(() => import(/* webpackChunkName: 'ItemActionBar' */ './ItemActionBar/ItemActionBar'));
const PositionSummaryListForPopover = React.lazy(() => import(/* webpackChunkName: 'PositionSummaryListForPopover' */ './PositionSummaryListForPopover'));
const ShowMoreFooter = React.lazy(() => import(/* webpackChunkName: 'ShowMoreFooter' */ '../Navigation/ShowMoreFooter'));


class BallotItemSupportOpposeCountDisplay extends Component {
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
      positionsInNetworkSummaryList: [],
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
    // console.log('BallotItemSupportOpposeCountDisplay componentDidMount');
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
    console.error('BallotItemSupportOpposeCountDisplay caught error: ', `${error} with info: `, info);
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
    // console.log('BallotItemSupportOpposeCountDisplay goToBallotItemLinkLocal, ballotItemWeVoteId:', ballotItemWeVoteId);
    if (this.props.goToBallotItem) {
      this.props.goToBallotItem(ballotItemWeVoteId);
    }
  }

  render () {
    renderLog('BallotItemSupportOpposeCountDisplay');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      ballotItemWeVoteId, classes, closeSupportOpposeCountDisplayModal, controlAdviserMaterialUIPopoverFromProp,
      hideEndorsementsOverview, hideNumbersOfAllPositions, hideShowMoreLink, inModal,
      openAdviserMaterialUIPopover, openSupportOpposeCountDisplayModal, supportOpposeCountDisplayModalTutorialOn,
      supportOpposeCountDisplayModalTutorialText, showDownArrow, showUpArrow, uniqueExternalId,
    } = this.props;
    // console.log('BallotItemSupportOpposeCountDisplay, controlAdviserMaterialUIPopoverFromProp: ', controlAdviserMaterialUIPopoverFromProp,  ', openAdviserMaterialUIPopover:', openAdviserMaterialUIPopover);
    const {
      ballotItemDisplayName,
      numberOfAllSupportPositions, numberOfAllOpposePositions, numberOfAllInfoOnlyPositions,
      positionsInNetworkSummaryList, positionsInNetworkSummaryListLength,
      positionsOutOfNetworkSummaryList,
      showVoterPersonalScore,
      voterPersonalNetworkScore,
      voterPersonalScoreHasBeenCalculated,
      voterPersonalNetworkScoreIsNegative,
      voterPersonalNetworkScoreIsPositive,
      voterPersonalNetworkScoreWithSign,
      voterOpposesBallotItem,
      voterSupportsBallotItem,
    } = this.state;
    // console.log('BallotItemSupportOpposeCountDisplay render, voterSupportsBallotItem/voterOpposesBallotItem:', voterSupportsBallotItem, voterOpposesBallotItem);

    if (!ballotItemWeVoteId) return null;

    const numberOfAllPositions = numberOfAllSupportPositions + numberOfAllOpposePositions + numberOfAllInfoOnlyPositions;
    const voterDecidedItem = voterSupportsBallotItem || voterOpposesBallotItem;
    const positionsInNetworkSummaryListExists = positionsInNetworkSummaryListLength && positionsInNetworkSummaryListLength > 0;
    const youHaveTheOnlyOpinion = !!(!numberOfAllPositions && voterDecidedItem);
    const noOpinionsExist = !voterDecidedItem && !numberOfAllPositions;

    let positionsPopover;
    if (youHaveTheOnlyOpinion) {
      positionsPopover = (
        <PopoverWrapper>
          <PopoverHeader>
            <PopoverTitleText>
              Opinions
              {ballotItemDisplayName ? ` about ${ballotItemDisplayName}` : ''}
              {' '}
            </PopoverTitleText>
          </PopoverHeader>
          <PopoverBody>
            You have the only opinion
            {ballotItemDisplayName ? ' about ' : ''}
            <strong>{ballotItemDisplayName ? `${ballotItemDisplayName}` : ''}</strong>
            {' '}
            so far.
          </PopoverBody>
        </PopoverWrapper>
      );
    } else if (positionsInNetworkSummaryListExists) {
      if (voterDecidedItem) {
        positionsPopover = (
          <PopoverWrapper>
            <PopoverHeader>
              <PopoverTitleText>Your Opinion</PopoverTitleText>
            </PopoverHeader>
            <PopoverBody>
              {voterSupportsBallotItem && (
                <YourOpinion>
                  <DecidedIconWrapper>
                    <NetworkScoreSmall
                      onClick={this.stopSupportingItem}
                      voterPersonalNetworkScoreIsNegative={voterPersonalNetworkScoreIsNegative}
                      voterPersonalNetworkScoreIsPositive={voterPersonalNetworkScoreIsPositive}
                      voterSupportsBallotItem={voterSupportsBallotItem}
                    >
                      <Done classes={{ root: classes.decidedIconSmall }} />
                    </NetworkScoreSmall>
                  </DecidedIconWrapper>
                  You support
                  {ballotItemDisplayName && (
                    <>
                      {' '}
                      <strong>{ballotItemDisplayName}</strong>
                    </>
                  )}
                  .
                </YourOpinion>
              )}
              {voterOpposesBallotItem && (
                <YourOpinion>
                  <DecidedIconWrapper>
                    <NetworkScoreSmall
                      onClick={this.stopOpposingItem}
                      voterPersonalNetworkScoreIsNegative={voterPersonalNetworkScoreIsNegative}
                      voterPersonalNetworkScoreIsPositive={voterPersonalNetworkScoreIsPositive}
                      voterOpposesBallotItem={voterOpposesBallotItem}
                    >
                      <NotInterested classes={{ root: classes.decidedIconSmall }} />
                    </NetworkScoreSmall>
                  </DecidedIconWrapper>
                  You oppose
                  {ballotItemDisplayName && (
                    <>
                      {' '}
                      <strong>{ballotItemDisplayName}</strong>
                      .
                    </>
                  )}
                </YourOpinion>
              )}
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
              <YourPersonalNetworkIntroText>
                Your personal network also has
                {' '}
                {positionsInNetworkSummaryListLength > 1 ? (
                  <span> these opinions:</span>
                ) : (
                  <span> this opinion:</span>
                )}
              </YourPersonalNetworkIntroText>
              {positionsInNetworkSummaryList && (
                <RenderedOrganizationsWrapper>
                  <Suspense fallback={<></>}>
                    <PositionSummaryListForPopover
                      ballotItemWeVoteId={ballotItemWeVoteId}
                      controlAdviserMaterialUIPopoverFromProp={controlAdviserMaterialUIPopoverFromProp}
                      openAdviserMaterialUIPopover={openAdviserMaterialUIPopover}
                      positionSummaryList={positionsInNetworkSummaryList}
                      showAllPositions={this.props.goToBallotItem}
                      voterPersonalNetworkScore={voterPersonalNetworkScore}
                      voterPersonalNetworkScoreIsNegative={voterPersonalNetworkScoreIsNegative}
                      voterPersonalNetworkScoreIsPositive={voterPersonalNetworkScoreIsPositive}
                      voterPersonalNetworkScoreWithSign={voterPersonalNetworkScoreWithSign}
                    />
                  </Suspense>
                </RenderedOrganizationsWrapper>
              )}
            </PopoverBody>
          </PopoverWrapper>
        );
      } else {
        const positionsInNetworkVoterNotDecidedIntro = (
          <div>
            Your personalized score about
            {' '}
            <strong>{ballotItemDisplayName}</strong>
            {' '}
            is calculated from opinions in your personal network:
          </div>
        );
        positionsPopover = (
          <PopoverWrapper>
            <PopoverHeader>
              <PopoverTitleText>Your Personalized Score</PopoverTitleText>
            </PopoverHeader>
            <PopoverBody>
              {supportOpposeCountDisplayModalTutorialOn ? (
                <TutorialTextBlue
                  style={{
                    color: '#2e3c5d',
                    fontSize: '18px',
                    fontWeight: 600,
                  }}
                >
                  {supportOpposeCountDisplayModalTutorialText}
                </TutorialTextBlue>
              ) : (
                <>
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
                  {positionsInNetworkVoterNotDecidedIntro}
                </>
              )}
              {positionsInNetworkSummaryList && (
                <RenderedOrganizationsWrapper>
                  <Suspense fallback={<></>}>
                    <PositionSummaryListForPopover
                      ballotItemWeVoteId={ballotItemWeVoteId}
                      controlAdviserMaterialUIPopoverFromProp={controlAdviserMaterialUIPopoverFromProp}
                      openAdviserMaterialUIPopover={openAdviserMaterialUIPopover}
                      positionSummaryList={positionsInNetworkSummaryList}
                      showAllPositions={this.props.goToBallotItem}
                      voterPersonalNetworkScore={voterPersonalNetworkScore}
                      voterPersonalNetworkScoreIsNegative={voterPersonalNetworkScoreIsNegative}
                      voterPersonalNetworkScoreIsPositive={voterPersonalNetworkScoreIsPositive}
                      voterPersonalNetworkScoreWithSign={voterPersonalNetworkScoreWithSign}
                    />
                  </Suspense>
                </RenderedOrganizationsWrapper>
              )}
            </PopoverBody>
          </PopoverWrapper>
        );
      }
    } else if (voterPersonalNetworkScore) { // We have a voterPersonalNetworkScore, but don't have positionsInNetworkSummaryList, so this is generic explanation
      positionsPopover = (
        <PopoverWrapper>
          <PopoverHeader>
            <PopoverTitleText>Your Personalized Score</PopoverTitleText>
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
            Your personalized score about
            {' '}
            <strong>{ballotItemDisplayName}</strong>
            {' '}
            is calculated from the Values you follow, the opinions of your friends, and the public opinions you follow.
          </PopoverBody>
        </PopoverWrapper>
      );
    } else if (noOpinionsExist) {
      positionsPopover = (
        <PopoverWrapper>
          <PopoverHeader>
            <PopoverTitleText>
              Opinions
              {ballotItemDisplayName ? ` about ${ballotItemDisplayName}` : ''}
              {' '}
            </PopoverTitleText>
          </PopoverHeader>
          <PopoverBody>
            <PopoverBodyText>
              There are no opinions
              {ballotItemDisplayName ? ' about ' : ''}
              <strong>{ballotItemDisplayName ? `${ballotItemDisplayName}` : ''}</strong>
              {' '}
              yet.
            </PopoverBodyText>
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
            {!hideShowMoreLink && (
              <ShowCandidateFooterWrapper>
                <Suspense fallback={<></>}>
                  <ShowMoreFooter
                    showMoreId={`noPositionsForPopoverShowAllPositions-${ballotItemWeVoteId}`}
                    showMoreLink={() => this.goToBallotItemLinkLocal(ballotItemWeVoteId)}
                    showMoreText="Show More"
                  />
                </Suspense>
              </ShowCandidateFooterWrapper>
            )}
          </PopoverBody>
        </PopoverWrapper>
      );
    } else if (voterDecidedItem) {
      positionsPopover = (
        <PopoverWrapper>
          <PopoverHeader>
            <PopoverTitleText>Your Opinion</PopoverTitleText>
          </PopoverHeader>
          <PopoverBody>
            {voterSupportsBallotItem && (
              <YourOpinion>
                <DecidedIconWrapper>
                  <NetworkScoreSmall
                    onClick={this.stopSupportingItem}
                    voterSupportsBallotItem={voterSupportsBallotItem}
                    voterPersonalNetworkScoreIsNegative={voterPersonalNetworkScoreIsNegative}
                    voterPersonalNetworkScoreIsPositive={voterPersonalNetworkScoreIsPositive}
                  >
                    <Done classes={{ root: classes.decidedIconSmall }} />
                  </NetworkScoreSmall>
                </DecidedIconWrapper>
                You support
                {ballotItemDisplayName && (
                  <>
                    {' '}
                    <strong>{ballotItemDisplayName}</strong>
                  </>
                )}
                .
                <br />
              </YourOpinion>
            )}
            {voterOpposesBallotItem && (
              <YourOpinion>
                <DecidedIconWrapper>
                  <NetworkScoreSmall
                    onClick={this.stopOpposingItem}
                    voterOpposesBallotItem={voterOpposesBallotItem}
                    voterPersonalNetworkScoreIsNegative={voterPersonalNetworkScoreIsNegative}
                    voterPersonalNetworkScoreIsPositive={voterPersonalNetworkScoreIsPositive}
                  >
                    <NotInterested classes={{ root: classes.decidedIconSmall }} />
                  </NetworkScoreSmall>
                </DecidedIconWrapper>
                You oppose
                {' '}
                <strong>{ballotItemDisplayName}</strong>
                .
                {' '}
              </YourOpinion>
            )}
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
          </PopoverBody>
        </PopoverWrapper>
      );
    } else {
      positionsPopover = (
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
    }
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
        {(!hideEndorsementsOverview && !hideNumbersOfAllPositions) && (
          <>
            {/*  className={(!showVoterPersonalScore && !voterSupportsBallotItem && !voterOpposesBallotItem) ? '' : 'u-show-desktop-tablet'} */}
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
                <EndorsementsContainer>
                  <EndorsementsTitle>
                    Opinions
                  </EndorsementsTitle>
                  <EndorsementsOuterWrapper>
                    <EndorsementsInnerWrapper>
                      <EndorsementRow>
                        <ThumbUp classes={{ root: classes.endorsementIconRoot }} />
                        <EndorsementCount>
                          {numberOfAllSupportPositions}
                        </EndorsementCount>
                      </EndorsementRow>
                      { showOpposeCount && (
                        <EndorsementRow>
                          <ThumbDown classes={{ root: classes.endorsementIconRoot }} />
                          <EndorsementCount>
                            {numberOfAllOpposePositions}
                          </EndorsementCount>
                        </EndorsementRow>
                      )}
                      { showCommentCount && (
                        <EndorsementRow>
                          <Comment classes={{ root: classes.endorsementIconRoot }} />
                          <EndorsementCount>
                            {numberOfAllInfoOnlyPositions}
                          </EndorsementCount>
                        </EndorsementRow>
                      )}
                    </EndorsementsInnerWrapper>
                  </EndorsementsOuterWrapper>
                </EndorsementsContainer>
              </StickyPopover>
            </EndorsementsOverviewShowOrNotShow>

            <EndorsementsOverviewSpacer />
          </>
        )}

        {(voterSupportsBallotItem) && (
          <StickyPopover
            delay={{ show: 700, hide: 100 }}
            popoverComponent={positionsPopover}
            placement="bottom"
            id="ballot-support-oppose-count-trigger-click-root-close"
            openOnClick
            openPopoverByProp={openSupportOpposeCountDisplayModal}
            closePopoverByProp={closeSupportOpposeCountDisplayModal}
            showCloseIcon
          >
            <NetworkScore
              voterOpposesBallotItem={voterOpposesBallotItem}
              voterPersonalNetworkScoreIsNegative={voterPersonalNetworkScoreIsNegative}
              voterPersonalNetworkScoreIsPositive={voterPersonalNetworkScoreIsPositive}
              voterSupportsBallotItem={voterSupportsBallotItem}
            >
              <VoterChoiceWrapper>
                <Done classes={{ root: classes.decidedIcon }} />
              </VoterChoiceWrapper>
              {voterPersonalScoreHasBeenCalculated ? (
                <>
                  {voterPersonalNetworkScore === 0 ? (
                    <ScoreNumberZeroAfterDecision className="u-no-break">
                      score 0
                    </ScoreNumberZeroAfterDecision>
                  ) : (
                    <ScoreNumberAfterDecision className="u-no-break">
                      {voterPersonalNetworkScoreIsPositive && (
                        <span>+</span>
                      )}
                      {voterPersonalNetworkScore}
                    </ScoreNumberAfterDecision>
                  )}
                </>
              ) : (
                <ScoreLabelAfterDecisionNoScore className="u-no-break">
                  no score
                </ScoreLabelAfterDecisionNoScore>
              )}
            </NetworkScore>
          </StickyPopover>
        )}

        {(voterOpposesBallotItem) && (
          <StickyPopover
            delay={{ show: 700, hide: 100 }}
            popoverComponent={positionsPopover}
            placement="bottom"
            id="ballot-support-oppose-count-trigger-click-root-close"
            openOnClick
            openPopoverByProp={openSupportOpposeCountDisplayModal}
            closePopoverByProp={closeSupportOpposeCountDisplayModal}
            showCloseIcon
          >
            <NetworkScore
              voterOpposesBallotItem={voterOpposesBallotItem}
              voterPersonalNetworkScoreIsNegative={voterPersonalNetworkScoreIsNegative}
              voterPersonalNetworkScoreIsPositive={voterPersonalNetworkScoreIsPositive}
            >
              <VoterChoiceWrapper>
                <NotInterested classes={{ root: classes.decidedIcon }} />
              </VoterChoiceWrapper>
              {voterPersonalScoreHasBeenCalculated ? (
                <>
                  {voterPersonalNetworkScore === 0 ? (
                    <ScoreNumberZeroAfterDecision className="u-no-break">
                      score 0
                    </ScoreNumberZeroAfterDecision>
                  ) : (
                    <ScoreNumberAfterDecision className="u-no-break">
                      {voterPersonalNetworkScoreIsPositive && (
                        <span>+</span>
                      )}
                      {voterPersonalNetworkScore}
                    </ScoreNumberAfterDecision>
                  )}
                </>
              ) : (
                <ScoreLabelAfterDecisionNoScore className="u-no-break">
                  no score
                </ScoreLabelAfterDecisionNoScore>
              )}
            </NetworkScore>
          </StickyPopover>
        )}

        {/* Show green or red score square. A personalized score exists, and the voter hasn't chosen to support or oppose yet. */}
        {(voterPersonalScoreHasBeenCalculated && !voterSupportsBallotItem && !voterOpposesBallotItem) ? (
          <StickyPopover
            delay={{ show: 700, hide: 100 }}
            popoverComponent={positionsPopover}
            placement="bottom"
            id="ballot-support-oppose-count-trigger-click-root-close"
            openOnClick
            openPopoverByProp={openSupportOpposeCountDisplayModal}
            closePopoverByProp={closeSupportOpposeCountDisplayModal}
            showCloseIcon
          >
            { voterPersonalNetworkScore === 0 ? (
              <NetworkScore voterPersonalNetworkScoreIsNegative={voterPersonalNetworkScoreIsNegative} voterPersonalNetworkScoreIsPositive={voterPersonalNetworkScoreIsPositive}>
                <ScoreLabel>
                  score
                </ScoreLabel>
                <ScoreNumberWrapper>
                  0
                </ScoreNumberWrapper>
              </NetworkScore>
            ) : (
              <NetworkScoreWrapper>
                <NetworkScore
                  voterOpposesBallotItem={voterOpposesBallotItem}
                  voterPersonalNetworkScoreIsNegative={voterPersonalNetworkScoreIsNegative}
                  voterPersonalNetworkScoreIsPositive={voterPersonalNetworkScoreIsPositive}
                  voterSupportsBallotItem={voterSupportsBallotItem}
                >
                  <ScoreLabel>
                    score
                  </ScoreLabel>
                  <ScoreNumberWrapper>
                    { voterPersonalNetworkScoreWithSign }
                  </ScoreNumberWrapper>
                </NetworkScore>
                {showDownArrow && (
                  <DownArrow>
                    <ArrowRightAlt classes={{ root: classes.arrowRightAltIconDown }} />
                  </DownArrow>
                )}
                {showUpArrow && (
                  <UpArrow>
                    <ArrowRightAlt classes={{ root: classes.arrowRightAltIconUp }} />
                  </UpArrow>
                )}
              </NetworkScoreWrapper>
            )}
          </StickyPopover>
        ) : null}
        {/* Your Score: Where you aren't supporting or opposing yet */}
        {(!showVoterPersonalScore && !voterSupportsBallotItem && !voterOpposesBallotItem) && (
          <>
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
              <NetworkScore
                hideNumbersOfAllPositions
                voterPersonalNetworkScoreIsNegative={voterPersonalNetworkScoreIsNegative}
                voterPersonalNetworkScoreIsPositive={voterPersonalNetworkScoreIsPositive}
              >
                <YourScoreWrapper>
                  Your Score
                </YourScoreWrapper>
              </NetworkScore>
            </StickyPopover>
          </>
        )}
        <span className="sr-only">
          {voterPersonalNetworkScore > 0 ? `${voterPersonalNetworkScore} Support` : null }
          {voterPersonalNetworkScore < 0 ? `${voterPersonalNetworkScore} Oppose` : null }
        </span>
      </Wrapper>
    );
  }
}
BallotItemSupportOpposeCountDisplay.propTypes = {
  ballotItemDisplayName: PropTypes.string,
  ballotItemWeVoteId: PropTypes.string.isRequired,
  classes: PropTypes.object,
  closeSupportOpposeCountDisplayModal: PropTypes.bool,
  controlAdviserMaterialUIPopoverFromProp: PropTypes.bool,
  goToBallotItem: PropTypes.func, // We don't require this because sometimes we don't want the link to do anything
  handleLeaveCandidateCard: PropTypes.func,
  handleEnterCandidateCard: PropTypes.func,
  hideEndorsementsOverview: PropTypes.bool,
  hideNumbersOfAllPositions: PropTypes.bool,
  hideShowMoreLink: PropTypes.bool,
  inModal: PropTypes.bool,
  openAdviserMaterialUIPopover: PropTypes.bool,
  openSupportOpposeCountDisplayModal: PropTypes.bool,
  supportOpposeCountDisplayModalTutorialOn: PropTypes.bool,
  supportOpposeCountDisplayModalTutorialText: PropTypes.object,
  showDownArrow: PropTypes.bool,
  showUpArrow: PropTypes.bool,
  uniqueExternalId: PropTypes.string,
};

// ${theme.colors.opposeRedRgb}  // Why doesn't this pull from WebApp/src/js/styled-theme.js ?
const styles = (theme) => ({
  arrowRightAltIconDown: {
    transform: 'rotate(90deg) scale(2, 2)',
    position: 'relative',
  },
  arrowRightAltIconUp: {
    transform: 'rotate(90deg) scale(-2, 2)',
    position: 'relative',
  },
  decidedIcon: {
    fontSize: 32,
    [theme.breakpoints.down('lg')]: {
      fontSize: 28,
    },
  },
  decidedIconSmall: {
    fontSize: 16,
    [theme.breakpoints.down('lg')]: {
      fontSize: 16,
    },
  },
  cardRoot: {
    padding: '8px 16px',
    [theme.breakpoints.down('lg')]: {
      padding: '2px 16px',
    },
  },
  endorsementIconRoot: {
    fontSize: 14,
    margin: '3px 3px 0 0',
  },
  endorsementIcon: {
    width: 12,
    height: 12,
  },
  cardFooterIconRoot: {
    fontSize: 14,
    margin: '0 0 .1rem .4rem',
  },
});

const Wrapper = styled('div')`
  align-items: flex-start;
  display: flex;
  justify-content: flex-end;
  margin-top: .1rem;
`;

const DecidedIconWrapper = styled('span')`
  margin-right: 6px;
`;

const EndorsementRow = styled('div')`
  display: flex;
  flex-flow: row nowrap;
  font-size: 12px;
  justify-content: space-between;
  margin-bottom: -4px;
`;

const EndorsementCount = styled('div')`
  line-height: 15px;
  padding-top: 3px;
`;

const EndorsementsOuterWrapper = styled('div')`
  display: flex;
  flex-flow: row;
  justify-content: center;
`;

const EndorsementsOverviewShowOrNotShow = styled('div')`
`;

const EndorsementsContainer = styled('div')`
  display: flex;
  flex-flow: column;
  justify-content: space-between;
`;

const EndorsementsOverviewSpacer = styled('div')`
  padding-right: 8px;
`;

const EndorsementsTitle = styled('div')`
  color: #888;
  font-weight: 500;
  font-size: 10px;
  line-height: 15px;
  text-align: center;
`;

const EndorsementsInnerWrapper = styled('div')`
  max-width: 25%;
  color: #888;
  text-align: right;
  user-select: none;
  max-width: 100%;
  display: flex;
  flex-flow: column;
  margin-top: -4px;
  justify-content: flex-start;
`;

const ItemActionBarWrapper = styled('div')`
  margin-bottom: 8px;
  width: 100%;
`;

const NetworkScoreWrapper = styled('div')`
  position: relative;
  z-index: 1;
`;

// TODO:  This is almost identical to BallotItemVoterGuideSupportOpposeDisplay, it should be a reused component
const NetworkScore = styled('div', {
  shouldForwardProp: (prop) => !['hideNumbersOfAllPositions', 'voterOpposesBallotItem', 'voterPersonalNetworkScoreIsNegative', 'voterPersonalNetworkScoreIsPositive', 'voterSupportsBallotItem'].includes(prop),
})(({ hideNumbersOfAllPositions, voterOpposesBallotItem, voterPersonalNetworkScoreIsNegative, voterPersonalNetworkScoreIsPositive, voterSupportsBallotItem }) => (`
  background: ${(voterSupportsBallotItem && 'rgb(31, 192, 111)') || (voterOpposesBallotItem && 'rgb(255, 73, 34)') || (voterPersonalNetworkScoreIsPositive && 'rgb(31, 192, 111)') || (voterPersonalNetworkScoreIsNegative && 'rgb(255, 73, 34)') || (hideNumbersOfAllPositions && 'rgb(211, 211, 211)') || '#888'};
  align-items: center;
  border-radius: 5px;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12);
  color: white;
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;
  font-size: 16px;
  font-weight: bold;
  justify-content: center;
  margin-top: 2px;
  width: 40px;
  height: 40px;
  @media print{
    border-width: 1px;
    border-style: solid;
    border-color: ${(voterSupportsBallotItem && 'rgb(31, 192, 111)') || (voterOpposesBallotItem && 'rgb(255, 73, 34)') || (voterPersonalNetworkScoreIsPositive && 'rgb(31, 192, 111)') || (voterPersonalNetworkScoreIsNegative && 'rgb(255, 73, 34)') || (hideNumbersOfAllPositions && 'rgb(211, 211, 211)') || '#888'};
  }
`));

const NetworkScoreSmall = styled('div', {
  shouldForwardProp: (prop) => !['hideNumbersOfAllPositions', 'voterOpposesBallotItem', 'voterPersonalNetworkScoreIsNegative', 'voterPersonalNetworkScoreIsPositive', 'voterSupportsBallotItem'].includes(prop),
})(({ hideNumbersOfAllPositions, voterOpposesBallotItem, voterPersonalNetworkScoreIsNegative, voterPersonalNetworkScoreIsPositive, voterSupportsBallotItem }) => (`
  background: ${(voterSupportsBallotItem && 'rgb(31, 192, 111)') || (voterOpposesBallotItem && 'rgb(255, 73, 34)') || (voterPersonalNetworkScoreIsPositive && 'rgb(31, 192, 111)') || (voterPersonalNetworkScoreIsNegative && 'rgb(255, 73, 34)') || (hideNumbersOfAllPositions && 'rgb(211, 211, 211)') || '#888'};
  color: white;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  float: left;
  font-size: 10px;
  font-weight: bold;
  @media print{
    border-width: 1px;
    border-style: solid;
    border-color: ${(voterSupportsBallotItem && 'rgb(31, 192, 111)') || (voterOpposesBallotItem && 'rgb(255, 73, 34)') || (voterPersonalNetworkScoreIsPositive && 'rgb(31, 192, 111)') || (voterPersonalNetworkScoreIsNegative && 'rgb(255, 73, 34)') || (hideNumbersOfAllPositions && 'rgb(211, 211, 211)') || '#888'};
  }
`));

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

const PopoverBodyText = styled('div')`
  margin-bottom: 8px;
`;

const RenderedOrganizationsWrapper = styled('div')`
  margin-top: 6px;
`;

const ScoreLabel = styled('div')`
  font-size: 13px;
  margin-top: -4px;
`;

const ScoreNumberAfterDecision = styled('div')`
  font-size: 12px;
  margin-top: -5px;
`;

const ScoreNumberZeroAfterDecision = styled('div')`
  font-size: 10px;
  margin-top: -5px;
`;

const ScoreLabelAfterDecisionNoScore = styled('div')`
  font-size: 8px;
  margin-top: -5px;
`;

const ScoreNumberWrapper = styled('div')`
  font-size: 18px;
  margin-top: -8px;
`;
const ShowCandidateFooterWrapper = styled('div')`
  margin-top: 10px;
`;

const TutorialTextBlue = styled('div')`
`;

const VoterChoiceWrapper = styled('div')`
  color: white;
  @media print{
    color: #1fc06f;
  }
  margin-top: 0;
`;

const YourOpinion = styled('div')`
  margin-bottom: 8px;
`;

const YourPersonalNetworkIntroText = styled('div')`
  margin-top: 6px;
`;

const YourScoreWrapper = styled('div')`
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  text-align: center;
  width: 40px;
  height: 40px;
`;

const DownArrow = styled('div')`
  margin-left: 9px;
  margin-top: -70px;
  z-index: 2;
`;

const UpArrow = styled('div')`
  margin-left: 9px;
  margin-top: 10px;
  z-index: 2;
`;

export default withTheme(withStyles(styles)(BallotItemSupportOpposeCountDisplay));
