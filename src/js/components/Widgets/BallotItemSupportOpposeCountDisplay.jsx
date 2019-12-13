import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import DoneIcon from '@material-ui/icons/Done';
import CommentIcon from '@material-ui/icons/Comment';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import CandidateStore from '../../stores/CandidateStore';
import IssueStore from '../../stores/IssueStore';
import { renderLog } from '../../utils/logging';
import MeasureStore from '../../stores/MeasureStore';
import OrganizationStore from '../../stores/OrganizationStore';
import SupportStore from '../../stores/SupportStore';
import { stringContains } from '../../utils/textFormat';
import StickyPopover from '../Ballot/StickyPopover';
import { getPositionSummaryListForBallotItem, getPositionListSummaryIncomingDataStats } from '../../utils/positionFunctions';
import PositionSummaryListForPopover from './PositionSummaryListForPopover';

// December 2018:  We want to work toward being airbnb style compliant, but for now these are disabled in this file to minimize complex changes
/* eslint array-callback-return: 1 */
class BallotItemSupportOpposeCountDisplay extends Component {
  static closePositionsPopover () {
    document.body.click();
  }

  static propTypes = {
    ballotItemWeVoteId: PropTypes.string.isRequired,
    goToCandidate: PropTypes.func, // We don't require this because sometimes we don't want the link to do anything
    classes: PropTypes.object,
    handleLeaveCandidateCard: PropTypes.func,
    handleEnterCandidateCard: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.mobile = 'ontouchstart' in document.documentElement;
    this.networkScoreRef = React.createRef();
    this.issueScoreRef = React.createRef();
    // this.networkScoreRef = 'network-score-overlay';
    // this.issueScoreRef = 'issue-score-overlay';
    this.state = {
      allCachedPositionsLength: 0,
      allIssuesVoterIsFollowingLength: 0,
      ballotItemDisplayName: '',
      ballotItemWeVoteId: '',
      componentDidMountFinished: false,
      issueWeVoteIdsLinkedToByOrganizationDictLength: 0,
      organizationWeVoteIdsVoterIsFollowingLength: 0,
      positionSummaryList: [],
      positionSummaryListLength: 0,
      voterOpposesListLength: 0,
      voterSupportsListLength: 0,
      voterPersonalNetworkScore: 0,
      voterOpposesBallotItem: false,
      voterSupportsBallotItem: false,
    };
    this.closeIssueScorePopover = this.closeIssueScorePopover.bind(this);
    this.closeNetworkScorePopover = this.closeNetworkScorePopover.bind(this);
    this.goToCandidateLinkLocal = this.goToCandidateLinkLocal.bind(this);
  }

  componentDidMount () {
    // console.log('BallotItemSupportOpposeCountDisplay componentDidMount');
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
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
      ballotItemDisplayName = candidate.ballot_item_display_name || '';
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
      ballotItemDisplayName = measure.ballot_item_display_name || '';
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

  componentWillReceiveProps (nextProps) {
    // console.log('componentWillReceiveProps, nextProps: ', nextProps);
    let ballotItemDisplayName;
    const { ballotItemWeVoteId } = nextProps;
    const isCandidate = stringContains('cand', ballotItemWeVoteId);
    const isMeasure = stringContains('meas', ballotItemWeVoteId);
    if (isCandidate) {
      const candidate = CandidateStore.getCandidate(ballotItemWeVoteId);
      ballotItemDisplayName = candidate.ballot_item_display_name || '';
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
      ballotItemDisplayName = measure.ballot_item_display_name || '';
      const countResults = MeasureStore.getNumberOfPositionsByMeasureWeVoteId(ballotItemWeVoteId);
      const { numberOfAllSupportPositions, numberOfAllOpposePositions, numberOfAllInfoOnlyPositions } = countResults;
      this.setState({
        ballotItemDisplayName,
        numberOfAllSupportPositions,
        numberOfAllOpposePositions,
        numberOfAllInfoOnlyPositions,
      });
    }
    this.setState(() => ({
      ballotItemDisplayName,
      ballotItemWeVoteId,
      isCandidate,
      isMeasure,
    }));
    this.onCachedPositionsOrIssueStoreChange();
  }

  // Turning off while working on modifications 2019-12-06
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
    if (this.state.numberOfAllSupportPositions !== nextState.numberOfAllSupportPositions) {
      return true;
    }
    if (this.state.numberOfAllOpposePositions !== nextState.numberOfAllOpposePositions) {
      return true;
    }
    if (this.state.numberOfAllInfoOnlyPositions !== nextState.numberOfAllInfoOnlyPositions) {
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

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.issueStoreListener.remove();
    this.measureStoreListener.remove();
    this.organizationStoreListener.remove();
    this.supportStoreListener.remove();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) {       // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  onCachedPositionsOrIssueStoreChange () {
    const { ballotItemWeVoteId } = this.props;
    const {
      allCachedPositionsLength: priorAllCachedPositionsLength,
      allIssuesVoterIsFollowingLength: priorAllIssuesVoterIsFollowingLength,
      issueWeVoteIdsLinkedToByOrganizationDictLength: priorIssueWeVoteIdsLinkedToByOrganizationDictLength,
      organizationWeVoteIdsVoterIsFollowingLength: priorOrganizationWeVoteIdsVoterIsFollowingLength,
      voterOpposesListLength: priorVoterOpposesListLength,
      voterSupportsListLength: priorVoterSupportsListLength,
    } = this.state;

    // Before we try to update the PositionSummaryList, make sure we have minimum data and that there has been a change
    const results = getPositionListSummaryIncomingDataStats(ballotItemWeVoteId);
    const {
      allCachedPositionsLength, allIssuesVoterIsFollowingLength, issueWeVoteIdsLinkedToByOrganizationDictLength, organizationWeVoteIdsVoterIsFollowingLength,
      voterOpposesListLength, voterSupportsListLength,
    } = results;
    // console.log('allCachedPositionsLength:', allCachedPositionsLength, ', priorAllCachedPositionsLength:', priorAllCachedPositionsLength);
    // console.log('allIssuesVoterIsFollowingLength:', allIssuesVoterIsFollowingLength, ', priorAllIssuesVoterIsFollowingLength:', priorAllIssuesVoterIsFollowingLength);
    // console.log('issueWeVoteIdsLinkedToByOrganizationDictLength:', issueWeVoteIdsLinkedToByOrganizationDictLength, ', priorIssueWeVoteIdsLinkedToByOrganizationDictLength:', priorIssueWeVoteIdsLinkedToByOrganizationDictLength);
    // console.log('organizationWeVoteIdsVoterIsFollowingLength:', organizationWeVoteIdsVoterIsFollowingLength, ', priorOrganizationWeVoteIdsVoterIsFollowingLength:', priorOrganizationWeVoteIdsVoterIsFollowingLength);
    // console.log('voterOpposesListLength:', voterOpposesListLength, ', priorVoterOpposesListLength:', priorVoterOpposesListLength);
    // console.log('voterSupportsListLength:', voterSupportsListLength, ', priorVoterSupportsListLength:', priorVoterSupportsListLength);

    const minimumPositionSummaryListVariablesFound = allCachedPositionsLength !== undefined && (issueWeVoteIdsLinkedToByOrganizationDictLength || organizationWeVoteIdsVoterIsFollowingLength);
    const changedPositionSummaryListVariablesFound = !!((allCachedPositionsLength !== priorAllCachedPositionsLength) || (allIssuesVoterIsFollowingLength !== priorAllIssuesVoterIsFollowingLength) || (issueWeVoteIdsLinkedToByOrganizationDictLength !== priorIssueWeVoteIdsLinkedToByOrganizationDictLength) || (organizationWeVoteIdsVoterIsFollowingLength !== priorOrganizationWeVoteIdsVoterIsFollowingLength) || (voterOpposesListLength !== priorVoterOpposesListLength) || (voterSupportsListLength !== priorVoterSupportsListLength));

    const refreshPositionSummaryList = !!(minimumPositionSummaryListVariablesFound && changedPositionSummaryListVariablesFound);
    // console.log('refreshPositionSummaryList: ', refreshPositionSummaryList, ballotItemWeVoteId);
    if (refreshPositionSummaryList) {
      const limitToThisIssue = false;
      const limitToVoterNetwork = true;
      const positionSummaryList = getPositionSummaryListForBallotItem(ballotItemWeVoteId, limitToThisIssue, limitToVoterNetwork);
      const positionSummaryListLength = positionSummaryList.length;
      this.setState({
        allCachedPositionsLength,
        allIssuesVoterIsFollowingLength,
        issueWeVoteIdsLinkedToByOrganizationDictLength,
        organizationWeVoteIdsVoterIsFollowingLength,
        positionSummaryList,
        positionSummaryListLength,
        voterOpposesListLength,
        voterSupportsListLength,
      });
      const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(ballotItemWeVoteId);
      // Network Score
      let numberOfSupportPositionsForScore = 0;
      let numberOfOpposePositionsForScore = 0;
      let voterPersonalNetworkScore = 0;
      let voterPersonalNetworkScoreWithSign;
      let voterPersonalNetworkScoreIsNegative = false;
      let voterPersonalNetworkScoreIsPositive = false;
      let voterOpposesBallotItem = false;
      let voterSupportsBallotItem = false;
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
          voterPersonalNetworkScoreWithSign = voterPersonalNetworkScore;
          voterPersonalNetworkScoreIsNegative = true;
        } else {
          voterPersonalNetworkScoreWithSign = voterPersonalNetworkScore;
        }
      }

      let showVoterPersonalScore = true;
      if (numberOfSupportPositionsForScore === 0 && numberOfOpposePositionsForScore === 0) {
        // There is NOT an issue score, and BOTH network_support and network_oppose must be zero to hide Network Score
        showVoterPersonalScore = false;
      }
      this.setState({
        showVoterPersonalScore,
        voterPersonalNetworkScore,
        voterPersonalNetworkScoreIsNegative,
        voterPersonalNetworkScoreIsPositive,
        voterPersonalNetworkScoreWithSign,
        voterOpposesBallotItem,
        voterSupportsBallotItem,
      });
    }
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

  onIssueStoreChange () {
    // We want to re-render so issue data can update
    this.onCachedPositionsOrIssueStoreChange();
  }

  onOrganizationStoreChange () {
    // We want to re-render so issue data can update
    this.onCachedPositionsOrIssueStoreChange();
  }

  onSupportStoreChange () {
    this.onCachedPositionsOrIssueStoreChange();
  }

  handleEnterHoverLocalArea = () => {
    if (this.props.handleLeaveCandidateCard) {
      this.props.handleLeaveCandidateCard();
    }
  };

  handleLeaveHoverLocalArea = () => {
    if (this.props.handleEnterCandidateCard) {
      this.props.handleEnterCandidateCard();
    }
  };

  closeNetworkScorePopover () {
    this.networkScoreRef.hide();
  }

  closeIssueScorePopover () {
    this.issueScoreRef.hide();
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('BallotItemSupportOpposeCountDisplay caught error: ', `${error} with info: `, info);
  }

  goToCandidateLinkLocal () {
    // console.log("BallotItemSupportOpposeCountDisplay goToCandidateLinkLocal");
    if (this.props.goToCandidate) {
      this.props.goToCandidate();
    }
  }

  render () {
    renderLog('BallotItemSupportOpposeCountDisplay');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      ballotItemDisplayName, ballotItemWeVoteId,
      numberOfAllSupportPositions, numberOfAllOpposePositions, numberOfAllInfoOnlyPositions,
      positionSummaryList, positionSummaryListLength,
      showVoterPersonalScore,
      voterPersonalNetworkScore,
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
    const positionSummaryListExists = positionSummaryListLength && positionSummaryListLength > 0;
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
    } else if (positionSummaryListExists) {
      if (voterDecidedItem) {
        positionsPopover = (
          <PopoverWrapper>
            <PopoverHeader>
              <PopoverTitleText>Your Opinion</PopoverTitleText>
            </PopoverHeader>
            <PopoverBody>
              {voterSupportsBallotItem && (
                <div>
                  <DecidedIconWrapper>
                    <NetworkScoreSmall className={classes.voterSupports} voterPersonalNetworkScoreIsNegative={voterPersonalNetworkScoreIsNegative} voterPersonalNetworkScoreIsPositive={voterPersonalNetworkScoreIsPositive}>
                      <DoneIcon classes={{ root: classes.decidedIconSmall }} />
                    </NetworkScoreSmall>
                  </DecidedIconWrapper>
                  You support
                  {' '}
                  <strong>{ballotItemDisplayName}</strong>
                  .
                  <br />
                </div>
              )}
              {voterOpposesBallotItem && (
                <span>
                  <DecidedIconWrapper>
                    <NetworkScoreSmall className={classes.voterOpposes} voterPersonalNetworkScoreIsNegative={voterPersonalNetworkScoreIsNegative} voterPersonalNetworkScoreIsPositive={voterPersonalNetworkScoreIsPositive}>
                      <NotInterestedIcon classes={{ root: classes.decidedIconSmall }} />
                    </NetworkScoreSmall>
                  </DecidedIconWrapper>
                  You oppose
                  {' '}
                  <strong>{ballotItemDisplayName}</strong>
                  .
                  {' '}
                </span>
              )}
              <span>
                Your personal network also has
                {' '}
                {positionSummaryListLength > 1 ? (
                  <span> these opinions:</span>
                ) : (
                  <span> this opinion:</span>
                )}
              </span>
              {positionSummaryList && (
                <RenderedOrganizationsWrapper>
                  <PositionSummaryListForPopover
                    positionSummaryList={positionSummaryList}
                  />
                </RenderedOrganizationsWrapper>
              )}
            </PopoverBody>
          </PopoverWrapper>
        );
      } else {
        positionsPopover = (
          <PopoverWrapper>
            <PopoverHeader>
              <PopoverTitleText>About this Score</PopoverTitleText>
            </PopoverHeader>
            <PopoverBody>
              This score about
              {' '}
              <strong>{ballotItemDisplayName}</strong>
              {' '}
              is calculated from opinions in your personal network:
              <br />
              {positionSummaryList && (
                <RenderedOrganizationsWrapper>
                  <PositionSummaryListForPopover
                    positionSummaryList={positionSummaryList}
                  />
                </RenderedOrganizationsWrapper>
              )}
            </PopoverBody>
          </PopoverWrapper>
        );
      }
    } else if (voterPersonalNetworkScore) { // We have a voterPersonalNetworkScore, but don't have positionSummaryList, so this is generic explanation
      positionsPopover = (
        <PopoverWrapper>
          <PopoverHeader>
            <PopoverTitleText>About this Score</PopoverTitleText>
          </PopoverHeader>
          <PopoverBody>
            This score about
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
            There are no opinions
            {ballotItemDisplayName ? ' about ' : ''}
            <strong>{ballotItemDisplayName ? `${ballotItemDisplayName}` : ''}</strong>
            {' '}
            yet.
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
              <div>
                <DecidedIconWrapper>
                  <NetworkScoreSmall className={classes.voterSupports} voterPersonalNetworkScoreIsNegative={voterPersonalNetworkScoreIsNegative} voterPersonalNetworkScoreIsPositive={voterPersonalNetworkScoreIsPositive}>
                    <DoneIcon classes={{ root: classes.decidedIconSmall }} />
                  </NetworkScoreSmall>
                </DecidedIconWrapper>
                You support
                {' '}
                <strong>{ballotItemDisplayName}</strong>
                .
                <br />
              </div>
            )}
            {voterOpposesBallotItem && (
              <span>
                <DecidedIconWrapper>
                  <NetworkScoreSmall className={classes.voterOpposes} voterPersonalNetworkScoreIsNegative={voterPersonalNetworkScoreIsNegative} voterPersonalNetworkScoreIsPositive={voterPersonalNetworkScoreIsPositive}>
                    <NotInterestedIcon classes={{ root: classes.decidedIconSmall }} />
                  </NetworkScoreSmall>
                </DecidedIconWrapper>
                You oppose
                {' '}
                <strong>{ballotItemDisplayName}</strong>
                .
                {' '}
              </span>
            )}
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
            <div>
              Learn more details about who
            </div>
            <div>
              <span className="u-no-break">
                <Support>
                  <ThumbUpIcon classes={{ root: classes.endorsementIcon }} />
                </Support>
                {' '}
                supports
              </span>
            </div>
            <div>
              <span className="u-no-break">
                <Oppose>
                  <ThumbDownIcon classes={{ root: classes.endorsementIcon }} />
                </Oppose>
                or opposes
              </span>
              <strong>{ballotItemDisplayName ? ` ${ballotItemDisplayName}` : ''}</strong>
              .
            </div>
            <div>
              To see your own personal score, follow public figures you trust or organizations that share your values.
              Follow issues/values you care about.
              Add friends to see their opinions.
              To see the opinions of private citizens, adjust your filters.
            </div>
          </PopoverBody>
        </PopoverWrapper>
      );
    }

    const commentCountExists = numberOfAllInfoOnlyPositions > 0;
    const opposeCountExists = numberOfAllOpposePositions > 0;
    // Default settings
    let showCommentCount = false;
    let showOpposeCount = true;
    if (commentCountExists && !opposeCountExists) {
      // Override if comment count exists, and oppose count does not
      showCommentCount = true;
      showOpposeCount = false;
    }
    // console.log('showVoterPersonalScore:', showVoterPersonalScore ');

    return (
      <Wrapper
        onMouseEnter={this.handleEnterHoverLocalArea}
        onMouseLeave={this.handleLeaveHoverLocalArea}
      >
        { voterSupportsBallotItem && (
          <StickyPopover
            delay={{ show: 100000, hide: 100 }}
            popoverComponent={positionsPopover}
            placement="bottom"
            id="ballot-support-oppose-count-trigger-click-root-close"
            openOnClick
            showCloseIcon
          >
            <NetworkScore className={classes.voterSupports} voterPersonalNetworkScoreIsNegative={voterPersonalNetworkScoreIsNegative} voterPersonalNetworkScoreIsPositive={voterPersonalNetworkScoreIsPositive}>
              <VoterChoiceWrapper>
                <DoneIcon classes={{ root: classes.decidedIcon }} />
              </VoterChoiceWrapper>
            </NetworkScore>
          </StickyPopover>
        )}

        { voterOpposesBallotItem && (
          <StickyPopover
            delay={{ show: 100000, hide: 100 }}
            popoverComponent={positionsPopover}
            placement="bottom"
            id="ballot-support-oppose-count-trigger-click-root-close"
            openOnClick
            showCloseIcon
          >
            <NetworkScore className={classes.voterOpposes} voterPersonalNetworkScoreIsNegative={voterPersonalNetworkScoreIsNegative} voterPersonalNetworkScoreIsPositive={voterPersonalNetworkScoreIsPositive}>
              <VoterChoiceWrapper>
                <NotInterestedIcon classes={{ root: classes.decidedIcon }} />
              </VoterChoiceWrapper>
            </NetworkScore>
          </StickyPopover>
        )}

        {/* Gray overview display. Show if no personal score, or voter position */}
        {(!showVoterPersonalScore && !voterSupportsBallotItem && !voterOpposesBallotItem) && (
          <StickyPopover
            delay={{ show: 100000, hide: 100 }}
            popoverComponent={positionsPopover}
            placement="bottom"
            id="ballot-support-oppose-count-trigger-click-root-close"
            openOnClick
            showCloseIcon
          >
            <EndorsementsContainer>
              <EndorsementsTitle>
                Endorsements
              </EndorsementsTitle>
              <EndorsementWrapper>
                <EndorsementRow>
                  <Endorsement>
                    <ThumbUpIcon classes={{ root: classes.endorsementIconRoot }} />
                    <EndorsementCount>
                      {numberOfAllSupportPositions}
                    </EndorsementCount>
                  </Endorsement>
                  { showOpposeCount && (
                    <Endorsement>
                      <ThumbDownIcon classes={{ root: classes.endorsementIconRoot }} />
                      <EndorsementCount>
                        {numberOfAllOpposePositions}
                      </EndorsementCount>
                    </Endorsement>
                  )}
                  { showCommentCount && (
                    <Endorsement>
                      <CommentIcon classes={{ root: classes.endorsementIconRoot }} />
                      <EndorsementCount>
                        {numberOfAllInfoOnlyPositions}
                      </EndorsementCount>
                    </Endorsement>
                  )}
                </EndorsementRow>
              </EndorsementWrapper>
            </EndorsementsContainer>
          </StickyPopover>
        )}

        {/* Show green or red score square. A personal score exists, and the voter hasn't chosen to support or oppose yet. */}
        { showVoterPersonalScore && !voterSupportsBallotItem && !voterOpposesBallotItem ? (
          <StickyPopover
            delay={{ show: 100000, hide: 100 }}
            popoverComponent={positionsPopover}
            placement="bottom"
            id="ballot-support-oppose-count-trigger-click-root-close"
            openOnClick
            showCloseIcon
          >
            { voterPersonalNetworkScore === 0 ? (
              <NetworkScore voterPersonalNetworkScoreIsNegative={voterPersonalNetworkScoreIsNegative} voterPersonalNetworkScoreIsPositive={voterPersonalNetworkScoreIsPositive}>
                0
              </NetworkScore>
            ) : (
              <NetworkScore voterPersonalNetworkScoreIsNegative={voterPersonalNetworkScoreIsNegative} voterPersonalNetworkScoreIsPositive={voterPersonalNetworkScoreIsPositive}>
                { voterPersonalNetworkScoreWithSign }
              </NetworkScore>
            )}
          </StickyPopover>
        ) : null
        }
        <span className="sr-only">
          {voterPersonalNetworkScore > 0 ? `${voterPersonalNetworkScore} Support` : null }
          {voterPersonalNetworkScore < 0 ? `${voterPersonalNetworkScore} Oppose` : null }
        </span>
      </Wrapper>
    );
  }
}

// ${theme.colors.opposeRedRgb}  // Why doesn't this pull from WebApp/src/js/styled-theme.js ?
const styles = theme => ({
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
    margin: '.3rem .3rem 0 .5rem',
  },
  endorsementIcon: {
    width: 12,
    height: 12,
  },
  cardFooterIconRoot: {
    fontSize: 14,
    margin: '0 0 .1rem .4rem',
  },
  voterOpposes: {
    background: 'rgb(255, 73, 34)', // colors.opposeRedRg
  },
  voterSupports: {
    background: 'rgb(31, 192, 111)', // colors.supportGreenRgb
  },
});

const Wrapper = styled.div`
  margin-top: .1rem;
`;

const DecidedIconWrapper = styled.span`
  margin-right: 6px;
`;

const EndorsementsContainer = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: space-between;
`;

const EndorsementsTitle = styled.div`
  color: #888;
  font-weight: 500;
  font-size: 10px;
  text-align: right;
`;

const EndorsementWrapper = styled.div`
  max-width: 25%;
  color: #888;
  text-align: right;
  user-select: none;
  max-width: 100%;
  display: flex;
  flex-flow: row;
  padding-bottom: 8px;
  margin-top: -4px;
  justify-content: space-between;
`;

const Endorsement = styled.div`
  display: flex;
  flex-flow: row nowrap;
  font-size: 12px;
`;

const EndorsementRow = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
`;

const EndorsementCount = styled.div`
  padding-top: 4px;
`;

const NetworkScore = styled.div`
  font-size: 16px;
  background: ${({ voterPersonalNetworkScoreIsNegative, voterPersonalNetworkScoreIsPositive }) => ((voterPersonalNetworkScoreIsNegative && 'rgb(255, 73, 34)') || (voterPersonalNetworkScoreIsPositive && 'rgb(31, 192, 111)') || '#888')};
  color: white;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 5px;
  float: right;
  font-size: 16px;
  font-weight: bold;
  @media print{
    border-width: 1 px;
    border-style: solid;
    border-color: ${({ voterPersonalNetworkScoreIsNegative, voterPersonalNetworkScoreIsPositive }) => ((voterPersonalNetworkScoreIsNegative && 'rgb(255, 73, 34)') || (voterPersonalNetworkScoreIsPositive && 'rgb(31, 192, 111)') || '#888')};
  }
`;

const NetworkScoreSmall = styled.div`
  font-size: 16px;
  background: ${({ voterPersonalNetworkScoreIsNegative, voterPersonalNetworkScoreIsPositive }) => ((voterPersonalNetworkScoreIsNegative && 'rgb(255, 73, 34)') || (voterPersonalNetworkScoreIsPositive && 'rgb(31, 192, 111)') || '#888')};
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
    border-width: 1 px;
    border-style: solid;
    border-color: ${({ voterPersonalNetworkScoreIsNegative, voterPersonalNetworkScoreIsPositive }) => ((voterPersonalNetworkScoreIsNegative && 'rgb(255, 73, 34)') || (voterPersonalNetworkScoreIsPositive && 'rgb(31, 192, 111)') || '#888')};
  }
`;

const VoterChoiceWrapper = styled.div`
  color: white;
  @media print{
    color: #1fc06f;
  }
`;

const PopoverWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 3px;
`;

const PopoverHeader = styled.div`
  background: ${({ theme }) => theme.colors.brandBlue};
  padding: 4px 8px;
  min-height: 35px;
  color: white;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 4px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
`;

const PopoverTitleText = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-right: 20px;
`;

const PopoverBody = styled.div`
  padding: 8px;
`;

const RenderedOrganizationsWrapper = styled.div`
  margin-top: 6px;
`;

const Support = styled.div`
  color: ${({ theme }) => theme.colors.supportGreenRgb};
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  min-width: 20px;
  height: 20px;
  border-radius: 5px;
  border: 2px solid ${({ theme }) => theme.colors.supportGreenRgb};
  float: left;
  font-size: 10px;
  font-weight: bold;
  margin-right: 6px;
`;

const Oppose = styled.div`
  color: ${({ theme }) => theme.colors.opposeRedRgb};
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  min-width: 20px;
  height: 20px;
  border-radius: 5px;
  float: left;
  border: 2px solid ${({ theme }) => theme.colors.opposeRedRgb};
  font-size: 10px;
  font-weight: bold;
  margin-right: 6px;
`;

export default withTheme(withStyles(styles)(BallotItemSupportOpposeCountDisplay));
