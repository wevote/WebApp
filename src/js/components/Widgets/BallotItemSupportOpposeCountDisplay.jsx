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
import { cordovaDot } from '../../utils/cordovaUtils';
import IssueStore from '../../stores/IssueStore';
import { renderLog } from '../../utils/logging';
import MeasureStore from '../../stores/MeasureStore';
import SupportStore from '../../stores/SupportStore';
import { stringContains } from '../../utils/textFormat';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import thumbsUpColorIcon from '../../../img/global/svg-icons/thumbs-up-color-icon.svg';      // 11/17/19, I don't think this is going to work in Cordova without the cordovaDot()
import thumbsDownColorIcon from '../../../img/global/svg-icons/thumbs-down-color-icon.svg';  // 11/17/19, I don't think this is going to work in Cordova without the cordovaDot()
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
      ballotItemDisplayName: '',
      ballotItemWeVoteId: '',
      componentDidMountFinished: false,
      organizationsToFollowSupport: [],
      organizationsToFollowOppose: [],
      ballotItemStatSheet: {},
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
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.voterGuideStoreListener = SupportStore.addListener(this.onVoterGuideStoreChange.bind(this));
    let ballotItemDisplayName = '';
    const { ballotItemWeVoteId } = this.props;
    const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(ballotItemWeVoteId);
    const isCandidate = stringContains('cand', ballotItemWeVoteId);
    const isMeasure = stringContains('meas', ballotItemWeVoteId);
    let numberOfAllSupportPositions = 0;
    let numberOfAllOpposePositions = 0;
    let numberOfAllInfoOnlyPositions = 0;
    if (isCandidate) {
      const candidate = CandidateStore.getCandidate(ballotItemWeVoteId);
      ballotItemDisplayName = candidate.ballot_item_display_name || '';
      const countResults = CandidateStore.getNumberOfPositionsByCandidateWeVoteId(ballotItemWeVoteId);
      ({ numberOfAllSupportPositions, numberOfAllOpposePositions, numberOfAllInfoOnlyPositions } = countResults);
    } else if (isMeasure) {
      const measure = MeasureStore.getMeasure(ballotItemWeVoteId);
      ballotItemDisplayName = measure.ballot_item_display_name || '';
      const countResults = MeasureStore.getNumberOfPositionsByMeasureWeVoteId(ballotItemWeVoteId);
      ({ numberOfAllSupportPositions, numberOfAllOpposePositions, numberOfAllInfoOnlyPositions } = countResults);
    }
    // console.log('BallotItemSupportOpposeCountDisplay positionsNeededForThisWeVoteId:', positionsNeededForThisWeVoteId);
    // console.log('isCandidate:', isCandidate, 'isMeasure:', isMeasure);

    const organizationsToFollowSupport = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdSupports(ballotItemWeVoteId);
    const organizationsToFollowOppose = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdOpposes(ballotItemWeVoteId);
    this.setState({
      ballotItemDisplayName,
      ballotItemStatSheet,
      ballotItemWeVoteId,
      componentDidMountFinished: true,
      isCandidate,
      isMeasure,
      numberOfAllSupportPositions,
      numberOfAllOpposePositions,
      numberOfAllInfoOnlyPositions,
      organizationsToFollowSupport,
      organizationsToFollowOppose,
      voter: VoterStore.getVoter(), // We only set this once since the info we need isn't dynamic
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log('componentWillReceiveProps, nextProps: ', nextProps);
    let ballotItemDisplayName;
    const { ballotItemWeVoteId } = nextProps;
    const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(ballotItemWeVoteId);
    const isCandidate = stringContains('cand', ballotItemWeVoteId);
    const isMeasure = stringContains('meas', ballotItemWeVoteId);
    let numberOfAllSupportPositions = 0;
    let numberOfAllOpposePositions = 0;
    let numberOfAllInfoOnlyPositions = 0;
    if (isCandidate) {
      const candidate = CandidateStore.getCandidate(ballotItemWeVoteId);
      ballotItemDisplayName = candidate.ballot_item_display_name || '';
      const countResults = CandidateStore.getNumberOfPositionsByCandidateWeVoteId(ballotItemWeVoteId);
      ({ numberOfAllSupportPositions, numberOfAllOpposePositions, numberOfAllInfoOnlyPositions } = countResults);
    } else if (isMeasure) {
      const measure = MeasureStore.getMeasure(ballotItemWeVoteId);
      ballotItemDisplayName = measure.ballot_item_display_name || '';
      const countResults = MeasureStore.getNumberOfPositionsByMeasureWeVoteId(ballotItemWeVoteId);
      ({ numberOfAllSupportPositions, numberOfAllOpposePositions, numberOfAllInfoOnlyPositions } = countResults);
    }
    const organizationsToFollowSupport = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdSupports(ballotItemWeVoteId);
    const organizationsToFollowOppose = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdOpposes(ballotItemWeVoteId);
    this.setState(() => ({
      ballotItemDisplayName,
      ballotItemStatSheet,
      ballotItemWeVoteId,
      isCandidate,
      isMeasure,
      numberOfAllSupportPositions,
      numberOfAllOpposePositions,
      numberOfAllInfoOnlyPositions,
      organizationsToFollowSupport,
      organizationsToFollowOppose,
    }));
  }

  // Turning off while working on modifications 2019-12-06
  // shouldComponentUpdate (nextProps, nextState) {
  //   // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
  //   if (this.state.componentDidMountFinished === false) {
  //     // console.log('shouldComponentUpdate: componentDidMountFinished === false');
  //     return true;
  //   }
  //   if (this.state.forceReRender === true) {
  //     if (this.state.voterIssuesScore !== nextState.voterIssuesScore) {
  //       // console.log('shouldComponentUpdate: forceReRender === true and voterIssuesScore change');
  //       return true;
  //     }
  //   }
  //   if (this.state.ballotItemDisplayName !== nextState.ballotItemDisplayName) {
  //     // console.log('this.state.ballotItemDisplayName:', this.state.ballotItemDisplayName, ', nextState.ballotItemDisplayName:', nextState.ballotItemDisplayName);
  //     return true;
  //   }
  //   if (this.state.ballotItemWeVoteId !== nextState.ballotItemWeVoteId) {
  //     // console.log('this.state.ballotItemWeVoteId:', this.state.ballotItemWeVoteId, ', nextState.ballotItemWeVoteId:', nextState.ballotItemWeVoteId);
  //     return true;
  //   }
  //   if (this.state.numberOfAllSupportPositions !== nextState.numberOfAllSupportPositions) {
  //     return true;
  //   }
  //   if (this.state.numberOfAllOpposePositions !== nextState.numberOfAllOpposePositions) {
  //     return true;
  //   }
  //   if (this.state.numberOfAllInfoOnlyPositions !== nextState.numberOfAllInfoOnlyPositions) {
  //     return true;
  //   }
  //   if ((!this.state.organizationsToFollowSupport) || (!nextState.organizationsToFollowSupport) || (this.state.organizationsToFollowSupport.length !== nextState.organizationsToFollowSupport.length)) {
  //     // console.log('this.state.organizationsToFollowSupport.length:', this.state.organizationsToFollowSupport.length, ', nextState.organizationsToFollowSupport.length:', nextState.organizationsToFollowSupport.length);
  //     return true;
  //   }
  //   if ((!this.state.organizationsToFollowOppose) || (!nextState.organizationsToFollowOppose) || (this.state.organizationsToFollowOppose.length !== nextState.organizationsToFollowOppose.length)) {
  //     // console.log('this.state.organizationsToFollowOppose.length:', this.state.organizationsToFollowOppose.length, ', nextState.organizationsToFollowOppose.length:', nextState.organizationsToFollowOppose.length);
  //     return true;
  //   }
  //   if (this.state.ballotItemStatSheet !== undefined && nextState.ballotItemStatSheet !== undefined) {
  //     const currentNetworkSupportCount = parseInt(this.state.ballotItemStatSheet.support_count) || 0;
  //     const nextNetworkSupportCount = parseInt(nextState.ballotItemStatSheet.support_count) || 0;
  //     const currentNetworkOpposeCount = parseInt(this.state.ballotItemStatSheet.oppose_count) || 0;
  //     const nextNetworkOpposeCount = parseInt(nextState.ballotItemStatSheet.oppose_count) || 0;
  //     if (currentNetworkSupportCount !== nextNetworkSupportCount || currentNetworkOpposeCount !== nextNetworkOpposeCount) {
  //       // console.log('shouldComponentUpdate: support or oppose count change');
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.issueStoreListener.remove();
    this.measureStoreListener.remove();
    this.supportStoreListener.remove();
    this.voterGuideStoreListener.remove();
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
    } = this.state;

    // Before we try to update the PositionSummaryList, make sure we have minimum data and that there has been a change
    const results = getPositionListSummaryIncomingDataStats(ballotItemWeVoteId);
    const { allCachedPositionsLength, allIssuesVoterIsFollowingLength, issueWeVoteIdsLinkedToByOrganizationDictLength, organizationWeVoteIdsVoterIsFollowingLength } = results;
    // console.log('allCachedPositionsLength:', allCachedPositionsLength, ', priorAllCachedPositionsLength:', priorAllCachedPositionsLength);
    // console.log('allIssuesVoterIsFollowingLength:', allIssuesVoterIsFollowingLength, ', priorAllIssuesVoterIsFollowingLength:', priorAllIssuesVoterIsFollowingLength);
    // console.log('issueWeVoteIdsLinkedToByOrganizationDictLength:', issueWeVoteIdsLinkedToByOrganizationDictLength, ', priorIssueWeVoteIdsLinkedToByOrganizationDictLength:', priorIssueWeVoteIdsLinkedToByOrganizationDictLength);
    // console.log('organizationWeVoteIdsVoterIsFollowingLength:', organizationWeVoteIdsVoterIsFollowingLength, ', priorOrganizationWeVoteIdsVoterIsFollowingLength:', priorOrganizationWeVoteIdsVoterIsFollowingLength);

    const minimumPositionSummaryListVariablesFound = allCachedPositionsLength > 0 && (issueWeVoteIdsLinkedToByOrganizationDictLength || organizationWeVoteIdsVoterIsFollowingLength);
    const changedPositionSummaryListVariablesFound = !!((allCachedPositionsLength !== priorAllCachedPositionsLength) || (allIssuesVoterIsFollowingLength !== priorAllIssuesVoterIsFollowingLength) || (issueWeVoteIdsLinkedToByOrganizationDictLength !== priorIssueWeVoteIdsLinkedToByOrganizationDictLength) || (organizationWeVoteIdsVoterIsFollowingLength !== priorOrganizationWeVoteIdsVoterIsFollowingLength));

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
      });
      const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(ballotItemWeVoteId);
      // Network Score
      let numberOfSupportPositionsForScore = 0;
      let numberOfOpposePositionsForScore = 0;
      let totalNetworkScore = 0;
      let totalNetworkScoreWithSign;
      let totalNetworkScoreIsNegative = false;
      let totalNetworkScoreIsPositive = false;
      numberOfSupportPositionsForScore = parseInt(ballotItemStatSheet.numberOfSupportPositionsForScore) || 0;
      numberOfOpposePositionsForScore = parseInt(ballotItemStatSheet.numberOfOpposePositionsForScore) || 0;
      // console.log('numberOfSupportPositionsForScore:', numberOfSupportPositionsForScore);
      // console.log('numberOfOpposePositionsForScore:', numberOfOpposePositionsForScore);
      totalNetworkScore = numberOfSupportPositionsForScore - numberOfOpposePositionsForScore;
      if (totalNetworkScore > 0) {
        totalNetworkScoreWithSign = `+${totalNetworkScore}`;
        totalNetworkScoreIsPositive = true;
      } else if (totalNetworkScore < 0) {
        totalNetworkScoreWithSign = totalNetworkScore;
        totalNetworkScoreIsNegative = true;
      } else {
        totalNetworkScoreWithSign = totalNetworkScore;
      }

      let showNetworkScore = true;
      if (numberOfSupportPositionsForScore === 0 && numberOfOpposePositionsForScore === 0) {
        // There is NOT an issue score, and BOTH network_support and network_oppose must be zero to hide Network Score
        showNetworkScore = false;
      }
      this.setState({
        ballotItemStatSheet,
        numberOfSupportPositionsForScore,
        numberOfOpposePositionsForScore,
        showNetworkScore,
        totalNetworkScore,
        totalNetworkScoreIsNegative,
        totalNetworkScoreIsPositive,
        totalNetworkScoreWithSign,
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

  onSupportStoreChange () {
    // const { ballotItemWeVoteId } = this.state;
    // const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(ballotItemWeVoteId);
    // // Network Score
    // let numberOfSupportPositionsForScore = 0;
    // let numberOfOpposePositionsForScore = 0;
    // let totalNetworkScore = 0;
    // let totalNetworkScoreWithSign;
    // let totalNetworkScoreIsNegative = false;
    // let totalNetworkScoreIsPositive = false;
    // numberOfSupportPositionsForScore = parseInt(ballotItemStatSheet.numberOfSupportPositionsForScore) || 0;
    // numberOfOpposePositionsForScore = parseInt(ballotItemStatSheet.numberOfOpposePositionsForScore) || 0;
    // // console.log('numberOfSupportPositionsForScore:', numberOfSupportPositionsForScore);
    // // console.log('numberOfOpposePositionsForScore:', numberOfOpposePositionsForScore);
    // totalNetworkScore = numberOfSupportPositionsForScore - numberOfOpposePositionsForScore;
    // if (totalNetworkScore > 0) {
    //   totalNetworkScoreWithSign = `+${totalNetworkScore}`;
    //   totalNetworkScoreIsPositive = true;
    // } else if (totalNetworkScore < 0) {
    //   totalNetworkScoreWithSign = totalNetworkScore;
    //   totalNetworkScoreIsNegative = true;
    // } else {
    //   totalNetworkScoreWithSign = totalNetworkScore;
    // }
    //
    // let showNetworkScore = true;
    // if (numberOfSupportPositionsForScore === 0 && numberOfOpposePositionsForScore === 0) {
    //   // There is NOT an issue score, and BOTH network_support and network_oppose must be zero to hide Network Score
    //   showNetworkScore = false;
    // }
    // this.setState({
    //   ballotItemStatSheet,
    //   numberOfSupportPositionsForScore,
    //   numberOfOpposePositionsForScore,
    //   showNetworkScore,
    //   totalNetworkScore,
    //   totalNetworkScoreIsNegative,
    //   totalNetworkScoreIsPositive,
    //   totalNetworkScoreWithSign,
    // });
    this.onCachedPositionsOrIssueStoreChange();
  }

  onVoterGuideStoreChange () {
    const organizationsToFollowSupport = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdSupports(this.state.ballotItemWeVoteId);
    const organizationsToFollowOppose = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdOpposes(this.state.ballotItemWeVoteId);
    this.setState(() => ({
      organizationsToFollowSupport,
      organizationsToFollowOppose,
    }));
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
    // console.log('BallotItemSupportOpposeCountDisplay render');
    const { classes } = this.props;
    const {
      ballotItemDisplayName, ballotItemWeVoteId, ballotItemStatSheet,
      numberOfAllSupportPositions, numberOfAllOpposePositions, numberOfAllInfoOnlyPositions,
      organizationsToFollowSupport, organizationsToFollowOppose,
      numberOfSupportPositionsForScore,
      numberOfOpposePositionsForScore,
      positionSummaryList, positionSummaryListLength,
      showNetworkScore,
      totalNetworkScore,
      totalNetworkScoreIsNegative,
      totalNetworkScoreIsPositive,
      totalNetworkScoreWithSign,
      voter,
    } = this.state;

    if (!ballotItemWeVoteId || !ballotItemStatSheet) return null;

    const organizationsToFollowSupportCount =  organizationsToFollowSupport ? organizationsToFollowSupport.length :  0;
    const organizationsToFollowOpposeCount =  organizationsToFollowOppose ? organizationsToFollowOppose.length :  0;
    const positionsCount = numberOfSupportPositionsForScore + numberOfOpposePositionsForScore + organizationsToFollowSupportCount + organizationsToFollowOpposeCount;

    let scoreInYourNetworkPopover;

    if (positionSummaryListLength > 0) {
      scoreInYourNetworkPopover = (
        <PopoverWrapper>
          <PopoverHeader>
            <PopoverTitleText>About this Score</PopoverTitleText>
          </PopoverHeader>
          <PopoverBody>
            Opinions about
            {' '}
            <strong>{ballotItemDisplayName}</strong>
            {' '}
            which make up this score:
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
    } else {
      scoreInYourNetworkPopover = (
        <PopoverWrapper>
          <PopoverHeader>
            <PopoverTitleText>About this Score</PopoverTitleText>
          </PopoverHeader>
          <PopoverBody>
            This personal scoring of
            {' '}
            <strong>{ballotItemDisplayName}</strong>
            {' '}
            is calculated from the Values you follow, the opinions of your friends, and the public opinions you follow.
          </PopoverBody>
        </PopoverWrapper>
      );
    }

    const voterDecidedItem = ballotItemStatSheet && voter &&
      (ballotItemStatSheet.is_support || ballotItemStatSheet.is_oppose);

    const positionsPopover = positionsCount > 1 || (positionsCount && !voterDecidedItem) ? (     // eslint-disable-line no-nested-ternary
      <PopoverWrapper>
        <PopoverHeader>
          <PopoverTitleText>
            Opinions
            {ballotItemDisplayName ? ` about ${ballotItemDisplayName}` : ''}
            {' '}
          </PopoverTitleText>
        </PopoverHeader>
        <PopoverBody>
          See below for details about who
          {' '}
          <span className="u-no-break">
            <img
              src={cordovaDot(thumbsUpColorIcon)}
              alt="Thumbs Up"
              width="20"
              height="20"
            />
            {' '}
            supports
          </span>
          {' '}
          or&nbsp;
          <span className="u-no-break">
            <img
              src={cordovaDot(thumbsDownColorIcon)}
              alt="Thumbs Down"
              width="20"
              height="20"
            />
            {' '}
            opposes
          </span>
          {ballotItemDisplayName ? ` ${ballotItemDisplayName}` : ''}
          .
        </PopoverBody>
      </PopoverWrapper>
    ) :
      positionsCount && voterDecidedItem ? (
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
            {ballotItemDisplayName ? ` about ${ballotItemDisplayName}` : ''}
            {' '}
            so far.
          </PopoverBody>
        </PopoverWrapper>
      ) : (
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
            {ballotItemDisplayName ? ` about ${ballotItemDisplayName}` : ''}
            {' '}
            yet.
          </PopoverBody>
        </PopoverWrapper>
      );

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
    // console.log('showNetworkScore:', showNetworkScore, ', ballotItemStatSheet:', ballotItemStatSheet);

    return (
      <Wrapper
        onMouseEnter={this.handleEnterHoverLocalArea}
        onMouseLeave={this.handleLeaveHoverLocalArea}
      >
        { ballotItemStatSheet.voterSupportsBallotItem ? (
          <NetworkScore className={classes.voterSupports} totalNetworkScoreIsNegative={totalNetworkScoreIsNegative} totalNetworkScoreIsPositive={totalNetworkScoreIsPositive}>
            <VoterChoiceWrapper>
              <DoneIcon classes={{ root: classes.buttonIcon }} />
            </VoterChoiceWrapper>
          </NetworkScore>
        ) :
          null
        }

        { ballotItemStatSheet.voterOpposesBallotItem ? (
          <NetworkScore className={classes.voterOpposes} totalNetworkScoreIsNegative={totalNetworkScoreIsNegative} totalNetworkScoreIsPositive={totalNetworkScoreIsPositive}>
            <VoterChoiceWrapper>
              <NotInterestedIcon classes={{ root: classes.buttonIcon }} />
            </VoterChoiceWrapper>
          </NetworkScore>
        ) :
          null
        }

        {/* Total counts of all support, opposition and info only comments for this ballot item */}
        { showNetworkScore || ballotItemStatSheet.voterSupportsBallotItem || ballotItemStatSheet.voterOpposesBallotItem ?
          null : (
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
                    { showOpposeCount ? (
                      <Endorsement>
                        <ThumbDownIcon classes={{ root: classes.endorsementIconRoot }} />
                        <EndorsementCount>
                          {numberOfAllOpposePositions}
                        </EndorsementCount>
                      </Endorsement>
                    ) :
                      null }
                    { showCommentCount ? (
                      <Endorsement>
                        <CommentIcon classes={{ root: classes.endorsementIconRoot }} />
                        <EndorsementCount>
                          {numberOfAllInfoOnlyPositions}
                        </EndorsementCount>
                      </Endorsement>
                    ) :
                      null }
                  </EndorsementRow>
                </EndorsementWrapper>
              </EndorsementsContainer>
            </StickyPopover>
          )
        }

        {/* Network Score for this ballot item here */}
        { showNetworkScore && !ballotItemStatSheet.voterSupportsBallotItem && !ballotItemStatSheet.voterOpposesBallotItem ? (
          <StickyPopover
            delay={{ show: 100000, hide: 100 }}
            popoverComponent={scoreInYourNetworkPopover}
            placement="bottom"
            id="ballot-support-oppose-count-trigger-click-root-close"
            openOnClick
            showCloseIcon
          >
            { totalNetworkScore === 0 ? (
              <NetworkScore totalNetworkScoreIsNegative={totalNetworkScoreIsNegative} totalNetworkScoreIsPositive={totalNetworkScoreIsPositive}>
                0
              </NetworkScore>
            ) : (
              <NetworkScore totalNetworkScoreIsNegative={totalNetworkScoreIsNegative} totalNetworkScoreIsPositive={totalNetworkScoreIsPositive}>
                { totalNetworkScoreWithSign }
              </NetworkScore>
            )}
          </StickyPopover>
        ) : null
        }
        <span className="sr-only">
          {totalNetworkScore > 0 ? `${totalNetworkScore} Support` : null }
          {totalNetworkScore < 0 ? `${totalNetworkScore} Oppose` : null }
        </span>
      </Wrapper>
    );
  }
}

// ${theme.colors.opposeRedRgb}  // Why doesn't this pull from WebApp/src/js/styled-theme.js ?
const styles = theme => ({
  buttonIcon: {
    root: {
      fontSize: 18,
      [theme.breakpoints.down('lg')]: {
        fontSize: 16,
      },
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
  background: ${({ totalNetworkScoreIsNegative, totalNetworkScoreIsPositive }) => ((totalNetworkScoreIsNegative && 'rgb(255, 73, 34)') || (totalNetworkScoreIsPositive && 'rgb(31, 192, 111)') || '#888')};
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
    border-color: ${({ totalNetworkScoreIsNegative, totalNetworkScoreIsPositive }) => ((totalNetworkScoreIsNegative && 'rgb(255, 73, 34)') || (totalNetworkScoreIsPositive && 'rgb(31, 192, 111)') || '#888')};
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

export default withTheme(withStyles(styles)(BallotItemSupportOpposeCountDisplay));
