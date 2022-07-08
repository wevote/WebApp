import { Done, NotInterested } from '@mui/icons-material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { renderLog } from '../../../common/utils/logging';
import stringContains from '../../../common/utils/stringContains';
import {
  DecidedIconWrapper,
  NetworkScoreSmall,
  PopoverBodyText,
  RenderedOrganizationsWrapper,
  YourOpinion,
  YourPersonalNetworkIntroText,
} from '../../Style/ScoreDisplayStyles';
import AppObservableStore from '../../../stores/AppObservableStore';
import CandidateStore from '../../../stores/CandidateStore';
import FriendStore from '../../../stores/FriendStore';
import IssueStore from '../../../stores/IssueStore';
import MeasureStore from '../../../stores/MeasureStore';
import OrganizationStore from '../../../stores/OrganizationStore';
import SupportStore from '../../../stores/SupportStore';
import { getPositionListSummaryIncomingDataStats, getPositionSummaryListForBallotItem } from '../../../utils/positionFunctions';

const PositionSummaryListForPopover = React.lazy(() => import(/* webpackChunkName: 'PositionSummaryListForPopover' */ './PositionSummaryListForPopover'));


class ScoreSummaryListController extends Component {
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
      issueWeVoteIdsLinkedToByOrganizationDictLength: 0,
      organizationWeVoteIdsVoterIsFollowingLength: 0,
      positionsInNetworkSummaryList: [],
      positionsInNetworkSummaryListLength: 0,
      positionsOutOfNetworkSummaryList: [],
      voterOpposesListLength: 0,
      voterSupportsListLength: 0,
      voterPersonalNetworkScore: 0,
      voterOpposesBallotItem: false,
      voterSupportsBallotItem: false,
    };
    this.onClickFunctionLinkLocal = this.onClickFunctionLinkLocal.bind(this);
    this.onClickShowOrganizationModalWithPositions = this.onClickShowOrganizationModalWithPositions.bind(this);
  }

  componentDidMount () {
    // console.log('ScoreSummaryListController componentDidMount');
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
      isCandidate,
      isMeasure,
    });
    this.onCachedPositionsOrIssueStoreChange();
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('ScoreSummaryListController caught error: ', `${error} with info: `, info);
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

  onClickFunctionLinkLocal (ballotItemWeVoteId) {
    // console.log('ScoreSummaryListController onClickFunctionLinkLocal, ballotItemWeVoteId:', ballotItemWeVoteId);
    if (this.props.onClickFunction) {
      this.props.onClickFunction(ballotItemWeVoteId);
    }
  }

  onClickShowOrganizationModalWithPositions () {
    const { ballotItemWeVoteId, blockOnClickShowOrganizationModalWithPositions } = this.props;
    // console.log('onClickShowOrganizationModalWithPositions, ballotItemWeVoteId:', ballotItemWeVoteId);
    if (!blockOnClickShowOrganizationModalWithPositions) {
      AppObservableStore.setOrganizationModalBallotItemWeVoteId(ballotItemWeVoteId);
      AppObservableStore.setShowOrganizationModal(true);
      AppObservableStore.setHideOrganizationModalBallotItemInfo(true);
    }
  }

  render () {
    renderLog('ScoreSummaryListController');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      ballotItemWeVoteId, classes, controlAdviserMaterialUIPopoverFromProp,
      openAdviserMaterialUIPopover,
    } = this.props;
    // console.log('ScoreSummaryListController, controlAdviserMaterialUIPopoverFromProp: ', controlAdviserMaterialUIPopoverFromProp,  ', openAdviserMaterialUIPopover:', openAdviserMaterialUIPopover);
    const {
      ballotItemDisplayName,
      numberOfAllSupportPositions, numberOfAllOpposePositions, numberOfAllInfoOnlyPositions,
      positionsInNetworkSummaryList, positionsInNetworkSummaryListLength,
      positionsOutOfNetworkSummaryList,
      voterPersonalNetworkScore,
      voterPersonalNetworkScoreIsNegative,
      voterPersonalNetworkScoreIsPositive,
      voterPersonalNetworkScoreWithSign,
      voterOpposesBallotItem,
      voterSupportsBallotItem,
    } = this.state;
    // console.log('ScoreSummaryListController render, voterSupportsBallotItem/voterOpposesBallotItem:', voterSupportsBallotItem, voterOpposesBallotItem);

    if (!ballotItemWeVoteId) return null;

    const numberOfAllPositions = numberOfAllSupportPositions + numberOfAllOpposePositions + numberOfAllInfoOnlyPositions;
    const voterDecidedItem = voterSupportsBallotItem || voterOpposesBallotItem;
    const positionsInNetworkSummaryListExists = positionsInNetworkSummaryListLength && positionsInNetworkSummaryListLength > 0;
    const youHaveTheOnlyOpinion = !!(!numberOfAllPositions && voterDecidedItem);
    const noOpinionsExist = !voterDecidedItem && !numberOfAllPositions;

    let scoreSummaryHtml;
    if (youHaveTheOnlyOpinion) {
      scoreSummaryHtml = (
        <ScoreSummaryHtmlWrapper>
          You have the only opinion
          {ballotItemDisplayName ? ' about ' : ''}
          <strong>{ballotItemDisplayName ? `${ballotItemDisplayName}` : ''}</strong>
          {' '}
          so far.
        </ScoreSummaryHtmlWrapper>
      );
    } else if (positionsInNetworkSummaryListExists) {
      if (voterDecidedItem) {
        scoreSummaryHtml = (
          <ScoreSummaryHtmlWrapper>
            {voterSupportsBallotItem && (
              <YourOpinion>
                <DecidedIconWrapper>
                  <NetworkScoreSmall
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
                    showAllPositions={this.props.onClickFunction}
                    voterPersonalNetworkScore={voterPersonalNetworkScore}
                    voterPersonalNetworkScoreIsNegative={voterPersonalNetworkScoreIsNegative}
                    voterPersonalNetworkScoreIsPositive={voterPersonalNetworkScoreIsPositive}
                    voterPersonalNetworkScoreWithSign={voterPersonalNetworkScoreWithSign}
                  />
                </Suspense>
              </RenderedOrganizationsWrapper>
            )}
          </ScoreSummaryHtmlWrapper>
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
        scoreSummaryHtml = (
          <ScoreSummaryHtmlWrapper>
            {positionsInNetworkVoterNotDecidedIntro}
            {positionsInNetworkSummaryList && (
              <RenderedOrganizationsWrapper>
                <Suspense fallback={<></>}>
                  <PositionSummaryListForPopover
                    ballotItemWeVoteId={ballotItemWeVoteId}
                    controlAdviserMaterialUIPopoverFromProp={controlAdviserMaterialUIPopoverFromProp}
                    openAdviserMaterialUIPopover={openAdviserMaterialUIPopover}
                    positionSummaryList={positionsInNetworkSummaryList}
                    showAllPositions={this.props.onClickFunction}
                    voterPersonalNetworkScore={voterPersonalNetworkScore}
                    voterPersonalNetworkScoreIsNegative={voterPersonalNetworkScoreIsNegative}
                    voterPersonalNetworkScoreIsPositive={voterPersonalNetworkScoreIsPositive}
                    voterPersonalNetworkScoreWithSign={voterPersonalNetworkScoreWithSign}
                  />
                </Suspense>
              </RenderedOrganizationsWrapper>
            )}
          </ScoreSummaryHtmlWrapper>
        );
      }
    } else if (voterPersonalNetworkScore) { // We have a voterPersonalNetworkScore, but don't have positionsInNetworkSummaryList, so this is generic explanation
      scoreSummaryHtml = (
        <ScoreSummaryHtmlWrapper>
          Your personalized score about
          {' '}
          <strong>{ballotItemDisplayName}</strong>
          {' '}
          is calculated from the Values you follow, the opinions of your friends, and the public opinions you follow.
        </ScoreSummaryHtmlWrapper>
      );
    } else if (noOpinionsExist) {
      scoreSummaryHtml = (
        <ScoreSummaryHtmlWrapper>
          <PopoverBodyText>
            There are no opinions
            {ballotItemDisplayName ? ' about ' : ''}
            <strong>{ballotItemDisplayName ? `${ballotItemDisplayName}` : ''}</strong>
            {' '}
            yet.
          </PopoverBodyText>
        </ScoreSummaryHtmlWrapper>
      );
    } else if (voterDecidedItem) {
      scoreSummaryHtml = (
        <ScoreSummaryHtmlWrapper>
          {voterSupportsBallotItem && (
            <YourOpinion>
              <DecidedIconWrapper>
                <NetworkScoreSmall
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
        </ScoreSummaryHtmlWrapper>
      );
    } else {
      scoreSummaryHtml = (
        <ScoreSummaryHtmlWrapper>
          <div>
            <strong>
              Add to score
            </strong>
            {' '}
            any opinion. This builds your score
            {(ballotItemDisplayName) && (
              <span>
                {' '}
                for
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
                    showAllPositions={this.props.onClickFunction}
                    voterPersonalNetworkScore={voterPersonalNetworkScore}
                    voterPersonalNetworkScoreIsNegative={voterPersonalNetworkScoreIsNegative}
                    voterPersonalNetworkScoreIsPositive={voterPersonalNetworkScoreIsPositive}
                    voterPersonalNetworkScoreWithSign={voterPersonalNetworkScoreWithSign}
                  />
                </Suspense>
              </RenderedOrganizationsWrapper>
            )}
          </div>
        </ScoreSummaryHtmlWrapper>
      );
    }
    return (
      <ScoreSummaryListControllerWrapper>
        {scoreSummaryHtml}
      </ScoreSummaryListControllerWrapper>
    );
  }
}
ScoreSummaryListController.propTypes = {
  ballotItemDisplayName: PropTypes.string,
  ballotItemWeVoteId: PropTypes.string.isRequired,
  blockOnClickShowOrganizationModalWithPositions: PropTypes.bool,
  classes: PropTypes.object,
  controlAdviserMaterialUIPopoverFromProp: PropTypes.bool,
  onClickFunction: PropTypes.func, // We don't require this because sometimes we don't want the link to do anything
  openAdviserMaterialUIPopover: PropTypes.bool,
};

const styles = (theme) => ({
  decidedIconSmall: {
    fontSize: 16,
    [theme.breakpoints.down('lg')]: {
      fontSize: 16,
    },
  },
});

const ScoreSummaryListControllerWrapper = styled('div')`
  margin: 0 15px;
`;

const ScoreSummaryHtmlWrapper = styled('div')`
`;

export default withTheme(withStyles(styles)(ScoreSummaryListController));
