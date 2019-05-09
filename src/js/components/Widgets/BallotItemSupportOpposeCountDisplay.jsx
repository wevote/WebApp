import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { OverlayTrigger, Popover } from 'react-bootstrap';
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

// December 2018:  We want to work toward being airbnb style compliant, but for now these are disabled in this file to minimize complex changes
/* eslint react/no-find-dom-node: 1 */
/* eslint array-callback-return: 1 */

class BallotItemSupportOpposeCountDisplay extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string.isRequired,
    goToCandidate: PropTypes.func, // We don't require this because sometimes we don't want the link to do anything
    popoverTop: PropTypes.bool,
    classes: PropTypes.object,
    handleLeaveCandidateCard: PropTypes.func,
    handleEnterCandidateCard: PropTypes.func,
  };

  static closePositionsPopover () {
    document.body.click();
  }

  constructor (props) {
    super(props);

    this.popover_state = {};
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
      positionListFromAdvisersFollowedByVoter: [],
      ballotItemSupportProps: {},
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
    const ballotItemSupportProps = SupportStore.get(ballotItemWeVoteId);
    const isCandidate = stringContains('cand', ballotItemWeVoteId);
    const isMeasure = stringContains('meas', ballotItemWeVoteId);
    let numberOfSupportPositions = 0;
    let numberOfOpposePositions = 0;
    let numberOfInfoOnlyPositions = 0;
    if (isCandidate) {
      const candidate = CandidateStore.getCandidate(ballotItemWeVoteId);
      ballotItemDisplayName = candidate.ballot_item_display_name || '';
      const countResults = CandidateStore.getNumberOfPositionsByCandidateWeVoteId(ballotItemWeVoteId);
      ({ numberOfSupportPositions, numberOfOpposePositions, numberOfInfoOnlyPositions } = countResults);
    } else if (isMeasure) {
      const measure = MeasureStore.getMeasure(ballotItemWeVoteId);
      ballotItemDisplayName = measure.ballot_item_display_name || '';
      const countResults = MeasureStore.getNumberOfPositionsByMeasureWeVoteId(ballotItemWeVoteId);
      ({ numberOfSupportPositions, numberOfOpposePositions, numberOfInfoOnlyPositions } = countResults);
    }
    // console.log('BallotItemSupportOpposeCountDisplay positionsNeededForThisWeVoteId:', positionsNeededForThisWeVoteId);
    // console.log('isCandidate:', isCandidate, 'isMeasure:', isMeasure);

    let positionListFromAdvisersFollowedByVoter;
    if (isCandidate) {
      positionListFromAdvisersFollowedByVoter = CandidateStore.getPositionList(ballotItemWeVoteId);
    } else if (isMeasure) {
      positionListFromAdvisersFollowedByVoter = MeasureStore.getPositionList(ballotItemWeVoteId);
    }
    const organizationsToFollowSupport = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdSupports(ballotItemWeVoteId);
    const organizationsToFollowOppose = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdOpposes(ballotItemWeVoteId);
    this.setState({
      ballotItemDisplayName,
      ballotItemSupportProps,
      ballotItemWeVoteId,
      componentDidMountFinished: true,
      isCandidate,
      isMeasure,
      numberOfSupportPositions,
      numberOfOpposePositions,
      numberOfInfoOnlyPositions,
      organizationsToFollowSupport,
      organizationsToFollowOppose,
      positionListFromAdvisersFollowedByVoter,
      voter: VoterStore.getVoter(), // We only set this once since the info we need isn't dynamic
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log('componentWillReceiveProps, nextProps: ', nextProps);
    let ballotItemDisplayName;
    const { ballotItemWeVoteId } = nextProps;
    const ballotItemSupportProps = SupportStore.get(ballotItemWeVoteId);
    const isCandidate = stringContains('cand', ballotItemWeVoteId);
    const isMeasure = stringContains('meas', ballotItemWeVoteId);
    let numberOfSupportPositions = 0;
    let numberOfOpposePositions = 0;
    let numberOfInfoOnlyPositions = 0;
    if (isCandidate) {
      const candidate = CandidateStore.getCandidate(ballotItemWeVoteId);
      ballotItemDisplayName = candidate.ballot_item_display_name || '';
      const countResults = CandidateStore.getNumberOfPositionsByCandidateWeVoteId(ballotItemWeVoteId);
      ({ numberOfSupportPositions, numberOfOpposePositions, numberOfInfoOnlyPositions } = countResults);
    } else if (isMeasure) {
      const measure = MeasureStore.getMeasure(ballotItemWeVoteId);
      ballotItemDisplayName = measure.ballot_item_display_name || '';
      const countResults = MeasureStore.getNumberOfPositionsByMeasureWeVoteId(ballotItemWeVoteId);
      ({ numberOfSupportPositions, numberOfOpposePositions, numberOfInfoOnlyPositions } = countResults);
    }
    let positionListFromAdvisersFollowedByVoter;
    if (isCandidate) {
      // CandidateActions.positionListForBallotItemPublic(ballotItemWeVoteId);
      positionListFromAdvisersFollowedByVoter = CandidateStore.getPositionList(ballotItemWeVoteId);
    } else if (isMeasure) {
      // MeasureActions.positionListForBallotItemPublic(ballotItemWeVoteId);
      positionListFromAdvisersFollowedByVoter = MeasureStore.getPositionList(ballotItemWeVoteId);
    }
    const organizationsToFollowSupport = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdSupports(ballotItemWeVoteId);
    const organizationsToFollowOppose = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdOpposes(ballotItemWeVoteId);
    this.setState(() => ({
      ballotItemDisplayName,
      ballotItemSupportProps,
      ballotItemWeVoteId,
      isCandidate,
      isMeasure,
      numberOfSupportPositions,
      numberOfOpposePositions,
      numberOfInfoOnlyPositions,
      organizationsToFollowSupport,
      organizationsToFollowOppose,
      positionListFromAdvisersFollowedByVoter,
    }));
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.state.componentDidMountFinished === false) {
      // console.log("shouldComponentUpdate: componentDidMountFinished === false");
      return true;
    }
    if (this.state.forceReRender === true) {
      if (this.state.voterIssuesScore !== nextState.voterIssuesScore) {
        // console.log("shouldComponentUpdate: forceReRender === true and voterIssuesScore change");
        return true;
      }
    }
    if (this.state.ballotItemDisplayName !== nextState.ballotItemDisplayName) {
      // console.log("shouldComponentUpdate: this.state.ballotItemDisplayName", this.state.ballotItemDisplayName, ", nextState.ballotItemDisplayName", nextState.ballotItemDisplayName);
      return true;
    }
    if (this.state.ballotItemWeVoteId !== nextState.ballotItemWeVoteId) {
      // console.log("shouldComponentUpdate: this.state.ballotItemWeVoteId", this.state.ballotItemWeVoteId, ", nextState.ballotItemWeVoteId", nextState.ballotItemWeVoteId);
      return true;
    }
    if (this.state.numberOfSupportPositions !== nextState.numberOfSupportPositions) {
      return true;
    }
    if (this.state.numberOfOpposePositions !== nextState.numberOfOpposePositions) {
      return true;
    }
    if (this.state.numberOfInfoOnlyPositions !== nextState.numberOfInfoOnlyPositions) {
      return true;
    }
    if ((!this.state.organizationsToFollowSupport) || (!nextState.organizationsToFollowSupport) || (this.state.organizationsToFollowSupport.length !== nextState.organizationsToFollowSupport.length)) {
      // console.log("shouldComponentUpdate: this.state.organizationsToFollowSupport.length", this.state.organizationsToFollowSupport.length, ", nextState.organizationsToFollowSupport.length", nextState.organizationsToFollowSupport.length);
      return true;
    }
    if ((!this.state.organizationsToFollowOppose) || (!nextState.organizationsToFollowOppose) || (this.state.organizationsToFollowOppose.length !== nextState.organizationsToFollowOppose.length)) {
      // console.log("shouldComponentUpdate: this.state.organizationsToFollowOppose.length", this.state.organizationsToFollowOppose.length, ", nextState.organizationsToFollowOppose.length", nextState.organizationsToFollowOppose.length);
      return true;
    }
    if (this.state.ballotItemSupportProps !== undefined && nextState.ballotItemSupportProps !== undefined) {
      const currentNetworkSupportCount = parseInt(this.state.ballotItemSupportProps.support_count) || 0;
      const nextNetworkSupportCount = parseInt(nextState.ballotItemSupportProps.support_count) || 0;
      const currentNetworkOpposeCount = parseInt(this.state.ballotItemSupportProps.oppose_count) || 0;
      const nextNetworkOpposeCount = parseInt(nextState.ballotItemSupportProps.oppose_count) || 0;
      if (currentNetworkSupportCount !== nextNetworkSupportCount || currentNetworkOpposeCount !== nextNetworkOpposeCount) {
        // console.log("shouldComponentUpdate: support or oppose count change");
        return true;
      }
    }
    return false;
  }

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

  onCandidateStoreChange () {
    if (this.state.isCandidate) {
      const { ballotItemWeVoteId: candidateWeVoteId } = this.state;
      const countResults = CandidateStore.getNumberOfPositionsByCandidateWeVoteId(candidateWeVoteId);
      const { numberOfSupportPositions, numberOfOpposePositions, numberOfInfoOnlyPositions } = countResults;
      this.setState({
        ballotItem: CandidateStore.getCandidate(candidateWeVoteId),
        numberOfSupportPositions,
        numberOfOpposePositions,
        numberOfInfoOnlyPositions,
        positionListFromAdvisersFollowedByVoter: CandidateStore.getPositionList(candidateWeVoteId),
      });
    }
  }

  onMeasureStoreChange () {
    if (this.state.isMeasure) {
      const { ballotItemWeVoteId: measureWeVoteId } = this.state;
      const countResults = MeasureStore.getNumberOfPositionsByMeasureWeVoteId(measureWeVoteId);
      const { numberOfSupportPositions, numberOfOpposePositions, numberOfInfoOnlyPositions } = countResults;
      this.setState({
        ballotItem: MeasureStore.getMeasure(measureWeVoteId),
        numberOfSupportPositions,
        numberOfOpposePositions,
        numberOfInfoOnlyPositions,
        positionListFromAdvisersFollowedByVoter: MeasureStore.getPositionList(measureWeVoteId),
      });
    }
  }

  onIssueStoreChange () {
    // We want to re-render so issue data can update
    this.setState(state => ({
      forceReRender: true,
      voterIssuesScore: IssueStore.getIssuesScoreByBallotItemWeVoteId(state.ballotItemWeVoteId),
    }));
  }

  onSupportStoreChange () {
    this.setState(state => ({
      ballotItemSupportProps: SupportStore.get(state.ballotItemWeVoteId),
    }));
  }

  onVoterGuideStoreChange () {
    const organizationsToFollowSupport = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdSupports(this.state.ballotItemWeVoteId);
    const organizationsToFollowOppose = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdOpposes(this.state.ballotItemWeVoteId);
    this.setState(() => ({
      organizationsToFollowSupport,
      organizationsToFollowOppose,
    }));
  }

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
    const handleEnterHoverLocalArea = () => {
      if (this.props.handleLeaveCandidateCard) {
        this.props.handleLeaveCandidateCard();
      }
    };

    const handleLeaveHoverLocalArea = () => {
      if (this.props.handleEnterCandidateCard) {
        this.props.handleEnterCandidateCard();
      }
    };

    if (!this.state.ballotItemWeVoteId) return null;
    // console.log('BallotItemSupportOpposeCountDisplay render, ballotItemWeVoteId:', this.state.ballotItemWeVoteId);
    renderLog(__filename);
    // Issue Score
    // const voterIssuesScore = IssueStore.getIssuesScoreByBallotItemWeVoteId(this.state.ballotItemWeVoteId);
    // let voterIssuesScoreWithSign;
    // if (voterIssuesScore > 0) {
    //   voterIssuesScoreWithSign = `+${voterIssuesScore}`;
    // } else if (voterIssuesScore < 0) {
    //   voterIssuesScoreWithSign = voterIssuesScore;
    // } else {
    //   voterIssuesScoreWithSign = voterIssuesScore;
    // }
    // // console.log('BallotItemSupportOpposeCountDisplay, voterIssuesScore: ', voterIssuesScore, ', ballotItemWeVoteId: ', this.state.ballotItemWeVoteId);
    // const issueCountUnderThisBallotItem = IssueStore.getIssuesCountUnderThisBallotItem(this.state.ballotItemWeVoteId);
    // const issueCountUnderThisBallotItemVoterIsFollowing = IssueStore.getIssuesCountUnderThisBallotItemVoterIsFollowing(this.state.ballotItemWeVoteId);
    const { classes } = this.props;

    // Network Score
    let networkSupportCount = 0;
    let networkOpposeCount = 0;
    let totalNetworkScore = 0;
    let totalNetworkScoreWithSign;
    if (this.state.ballotItemSupportProps !== undefined) {
      networkSupportCount = parseInt(this.state.ballotItemSupportProps.support_count) || 0;
      networkOpposeCount = parseInt(this.state.ballotItemSupportProps.oppose_count) || 0;
      totalNetworkScore = parseInt(networkSupportCount - networkOpposeCount);
      if (totalNetworkScore > 0) {
        totalNetworkScoreWithSign = `+${totalNetworkScore}`;
      } else if (totalNetworkScore < 0) {
        totalNetworkScoreWithSign = totalNetworkScore;
      } else {
        totalNetworkScoreWithSign = totalNetworkScore;
      }
    }

    let showNetworkScore = true;
    if (networkSupportCount === 0 && networkOpposeCount === 0) {
      // There is NOT an issue score, and BOTH network_support and network_oppose must be zero to hide Network Score
      showNetworkScore = false;
    }

    // Voter Support or opposition
    const isVoterOppose = SupportStore.getIsOpposeByBallotItemWeVoteId(this.state.ballotItemWeVoteId);
    const isVoterSupport = SupportStore.getIsSupportByBallotItemWeVoteId(this.state.ballotItemWeVoteId);

    const { organizationsToFollowSupport, organizationsToFollowOppose } = this.state;
    const { numberOfSupportPositions, numberOfOpposePositions, numberOfInfoOnlyPositions } = this.state;

    const organizationsToFollowSupportCount =  organizationsToFollowSupport ? organizationsToFollowSupport.length :  0;
    const organizationsToFollowOpposeCount =  organizationsToFollowOppose ? organizationsToFollowOppose.length :  0;
    const positionsCount = networkSupportCount + networkOpposeCount + organizationsToFollowSupportCount + organizationsToFollowOpposeCount;

    // console.log('this.state.positionListFromAdvisersFollowedByVoter: ', this.state.positionListFromAdvisersFollowedByVoter);
    // if (positionsCount) {
    //   let supportPositionsListCount = 0;
    //   let opposePositionsListCount = 0;
    //   // let info_only_positions_list_count = 0;
    //   this.state.positionListFromAdvisersFollowedByVoter.map((onePosition) => {
    //     // console.log('onePosition: ', onePosition);
    //     // Filter out the positions that we don't want to display
    //     if (onePosition.is_support_or_positive_rating) {
    //       supportPositionsListCount++;
    //     } else if (onePosition.is_oppose_or_negative_rating) {
    //       opposePositionsListCount++;
    //     } // else if (!onePosition.is_support_or_positive_rating && !onePosition.is_oppose_or_negative_rating) {
    //     //   info_only_positions_list_count++;
    //     // }
    //     return null;
    //   });
    //   // console.log('supportPositionsListCount:', supportPositionsListCount);
    //
    //   // We calculate how many organizations_to_follow based on the number of positions from advisers we follow
    //   const offsetForMoreText = 3;
    // }

    let scoreInYourNetworkPopover;
    // let advisersThatMakeVoterIssuesScoreDisplay;
    // let advisersThatMakeVoterIssuesScoreCount = 0;
    // if (issueCountUnderThisBallotItemVoterIsFollowing) {
    //   // If there are issues the voter is following, we should attempt to to create a list of orgs that support or oppose this ballot item
    //   const organizationNameIssueSupportList = IssueStore.getOrganizationNameSupportListUnderThisBallotItem(this.state.ballotItemWeVoteId);
    //   const organizationNameIssueSupportListDisplay = organizationNameIssueSupportList.map(organizationName => (
    //     <span key={organizationName} className="u-flex u-flex-row u-justify-start u-items-start">
    //       <img src={cordovaDot('/img/global/icons/thumbs-up-color-icon.svg')} alt="Thumbs Up" width="20" height="20" />
    //       <span>&nbsp;</span>
    //       <span>
    //         {organizationName}
    //         {' '}
    //         <strong>+1</strong>
    //       </span>
    //     </span>
    //   ));
    //   const organizationNameIssueOpposeList = IssueStore.getOrganizationNameOpposeListUnderThisBallotItem(this.state.ballotItemWeVoteId);
    //   const organizationNameIssueOpposeListDisplay = organizationNameIssueOpposeList.map(organizationName => (
    //     <span key={organizationName} className="u-flex u-flex-row u-justify-start u-items-start">
    //       <img src={cordovaDot('/img/global/icons/thumbs-down-color-icon.svg')} alt="Thumbs Down" width="20" height="20" />
    //       <span>&nbsp;</span>
    //       <span>
    //         {organizationName}
    //         {' '}
    //         <strong>-1</strong>
    //       </span>
    //     </span>
    //   ));
    //   advisersThatMakeVoterIssuesScoreDisplay = (
    //     <span>
    //       { organizationNameIssueSupportList.length ? <span>{organizationNameIssueSupportListDisplay}</span> : null}
    //       { organizationNameIssueOpposeList.length ? <span>{organizationNameIssueOpposeListDisplay}</span> : null}
    //     </span>
    //   );
    //   advisersThatMakeVoterIssuesScoreCount = organizationNameIssueSupportList.length + organizationNameIssueOpposeList.length;
    // }

    // If there are issues the voter is following, we should attempt to to create a list of orgs that support or oppose this ballot item
    const nameNetworkSupportList = SupportStore.getNameSupportListUnderThisBallotItem(this.state.ballotItemWeVoteId);
    const nameNetworkSupportListDisplay = nameNetworkSupportList.map(speakerDisplayName => (
      <span key={speakerDisplayName} className="u-flex u-flex-row u-justify-start u-items-start">
        <img src={cordovaDot('/img/global/icons/thumbs-up-color-icon.svg')} alt="Thumbs Up" width="20" height="20" />
        <span>&nbsp;</span>
        <span>
          {speakerDisplayName}
          {' '}
          <strong>+1</strong>
        </span>
      </span>
    ));
    const nameNetworkOpposeList = SupportStore.getNameOpposeListUnderThisBallotItem(this.state.ballotItemWeVoteId);
    const nameNetworkOpposeListDisplay = nameNetworkOpposeList.map(speakerDisplayName => (
      <span key={speakerDisplayName} className="u-flex u-flex-row u-justify-start u-items-start">
        <img src={cordovaDot('/img/global/icons/thumbs-down-color-icon.svg')} alt="Thumbs Down" width="20" height="20" />
        <span>&nbsp;</span>
        <span>
          {speakerDisplayName}
          {' '}
          <strong>-1</strong>
        </span>
      </span>
    ));
    const advisersThatMakeVoterNetworkScoreDisplay = (
      <span>
        { nameNetworkSupportList.length ? <span>{nameNetworkSupportListDisplay}</span> : null}
        { nameNetworkOpposeList.length ? <span>{nameNetworkOpposeListDisplay}</span> : null}
      </span>
    );
    const advisersThatMakeVoterNetworkScoreCount = nameNetworkSupportList.length + nameNetworkOpposeList.length;

    if (advisersThatMakeVoterNetworkScoreCount > 0) {
      scoreInYourNetworkPopover = (
        <Popover
          id="score-popover-trigger-click-root-close"
          title={(
            <span>
              Score in Your Network
              <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" />
            </span>
          )}
          onClick={this.closeNetworkScorePopover}
        >
          These friends or organizations support or oppose
          {' '}
          <strong>{this.state.ballotItemDisplayName}</strong>
          :
          <br />
          {advisersThatMakeVoterNetworkScoreDisplay}
        </Popover>
      );
    } else {
      scoreInYourNetworkPopover = (
        <Popover
          id="score-popover-trigger-click-root-close"
          title={(
            <span>
              Score in Your Network
              <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" />
            </span>
          )}
          onClick={this.closeNetworkScorePopover}
        >
          Your friends, and the organizations you follow, are
          {' '}
          <strong>Your Network</strong>
          .
          Everyone in your network that
          {' '}
          <span className="u-no-break">
            {' '}
            <img
              src={cordovaDot('/img/global/icons/thumbs-up-color-icon.svg')}
              alt="Thumbs Up"
              width="20"
              height="20"
            />
            {' '}
            supports
          </span>
          {' '}
          {this.state.ballotItemDisplayName}
          adds
          +1 to this
          {' '}
          <strong>Score</strong>
          .
          Each one that
          {' '}
          <span className="u-no-break">
            <img
              src={cordovaDot('/img/global/icons/thumbs-down-color-icon.svg')}
              alt="Thumbs Down"
              width="20"
              height="20"
            />
            {' '}
            opposes
          </span>
          {' '}
          subtracts 1 from this
          {' '}
          <strong>Score</strong>
          .
          {' '}
          <strong>Listen</strong>
          {' '}
          to an organization to add their opinion to your personalized
          {' '}
          <strong>Score</strong>
          .
        </Popover>
      );
    }

    const voterDecidedItem = this.state.ballotItemSupportProps && this.state.voter &&
      (this.state.ballotItemSupportProps.is_support || this.state.ballotItemSupportProps.is_oppose);

    const positionsPopover = positionsCount > 1 || (positionsCount && !voterDecidedItem) ? (     // eslint-disable-line no-nested-ternary
      <Popover
        id="positions-popover-trigger-click-root-close"
        title={(
          <span className="u-f4 u-no-break">
            Opinions
            {this.state.ballotItemDisplayName ? ` about ${this.state.ballotItemDisplayName}` : ''}
            {' '}
            <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" />
          </span>
        )}
        onClick={BallotItemSupportOpposeCountDisplay.closePositionsPopover}
      >
        These organizations
        {' '}
        <span className="u-no-break">
          <img
            src={cordovaDot('/img/global/icons/thumbs-up-color-icon.svg')}
            alt="Thumbs Up"
            width="20"
            height="20"
          />
          {' '}
          support
        </span>
        {' '}
        or&nbsp;
        <span className="u-no-break">
          <img
            src={cordovaDot('/img/global/icons/thumbs-down-color-icon.svg')}
            alt="Thumbs Down"
            width="20"
            height="20"
          />
          {' '}
          oppose
        </span>
        {this.state.ballotItemDisplayName ? ` ${this.state.ballotItemDisplayName}` : ''}
        .
      </Popover>
    ) :
      positionsCount && voterDecidedItem ? (
        <Popover
          id="positions-popover-trigger-click-root-close"
          title={(
            <span className="u-f4 u-no-break">
              Opinions
              {this.state.ballotItemDisplayName ? ` about ${this.state.ballotItemDisplayName}` : ''}
              {' '}
              <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" />
            </span>
          )}
          onClick={BallotItemSupportOpposeCountDisplay.closePositionsPopover}
        >
          You have the only opinion
          {this.state.ballotItemDisplayName ? ` about ${this.state.ballotItemDisplayName}` : ''}
          {' '}
          so far.
        </Popover>
      ) : (
        <Popover
          id="positions-popover-trigger-click-root-close"
          title={(
            <span className="u-f4 u-no-break">
              Opinions
              {this.state.ballotItemDisplayName ? ` about ${this.state.ballotItemDisplayName}` : ''}
              {' '}
              <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" />
            </span>
          )}
          onClick={BallotItemSupportOpposeCountDisplay.closePositionsPopover}
        >
          There are no opinions
          {this.state.ballotItemDisplayName ? ` about ${this.state.ballotItemDisplayName}` : ''}
          {' '}
          yet.
        </Popover>
      );

    const commentCountExists = numberOfInfoOnlyPositions > 0;
    const opposeCountExists = numberOfOpposePositions > 0;
    // Default settings
    let showCommentCount = false;
    let showOpposeCount = true;
    if (commentCountExists && !opposeCountExists) {
      // Override if comment count exists, and oppose count does not
      showCommentCount = true;
      showOpposeCount = false;
    }

    return (
      <Wrapper
        onMouseEnter={handleEnterHoverLocalArea}
        onMouseLeave={handleLeaveHoverLocalArea}
      >
        { isVoterSupport ? (
          <NetworkScore className={classes.voterSupports}>
            <DoneIcon classes={{ root: classes.buttonIcon }} />
          </NetworkScore>
        ) :
          null
        }

        { isVoterOppose ? (
          <NetworkScore className={classes.voterOpposes}>
            <NotInterestedIcon classes={{ root: classes.buttonIcon }} />
          </NetworkScore>
        ) :
          null
        }

        {/* Total counts of all support, opposition and info only comments for this ballot item */}
        { showNetworkScore || isVoterSupport || isVoterOppose ?
          null : (
            <OverlayTrigger
              trigger="click"
              rootClose
              placement={this.props.popoverTop ? 'top' : 'bottom'}
              overlay={positionsPopover}
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
                        {numberOfSupportPositions}
                      </EndorsementCount>
                    </Endorsement>
                    { showOpposeCount ? (
                      <Endorsement>
                        <ThumbDownIcon classes={{ root: classes.endorsementIconRoot }} />
                        <EndorsementCount>
                          {numberOfOpposePositions}
                        </EndorsementCount>
                      </Endorsement>
                    ) :
                      null }
                    { showCommentCount ? (
                      <Endorsement>
                        <CommentIcon classes={{ root: classes.endorsementIconRoot }} />
                        <EndorsementCount>
                          {numberOfInfoOnlyPositions}
                        </EndorsementCount>
                      </Endorsement>
                    ) :
                      null }
                  </EndorsementRow>
                </EndorsementWrapper>
              </EndorsementsContainer>
            </OverlayTrigger>
          )
        }

        {/* Network Score for this ballot item here */}
        { showNetworkScore && !isVoterSupport && !isVoterOppose ? (
          <OverlayTrigger
            trigger="click"
            ref={(ref) => { this.networkScoreRef = ref; }}
            onExit={this.closeNetworkScorePopover}
            rootClose
            placement={this.props.popoverTop ? 'top' : 'bottom'}
            overlay={scoreInYourNetworkPopover}
          >
            <NetworkScore>
              { totalNetworkScore === 0 ? (
                <span className="u-margin-left--md">
                  { totalNetworkScoreWithSign }
                </span>
              ) : (
                <span className="u-margin-left--xs">
                  { totalNetworkScoreWithSign }
                </span>
              )}
            </NetworkScore>
          </OverlayTrigger>
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
    background: 'rgb(255, 73, 34)', // colors.opposeRedRgb
  },
  voterSupports: {
    background: 'rgb(31, 192, 111)', // colors.supportGreenRgb
  },
});

const Wrapper = styled.div`
  margin-top: .1rem;
`;
// @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
//   margin-top: 0;
//   width: 100%;
//   max-width: 100%;
//   border-top: 1px solid #eee;
//   border-bottom: 1px solid #eee;
//   padding-top: 8px;
// }

const EndorsementsContainer = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: space-between;
`;
// @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
//   flex-flow: row;
// }

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
  font-size: 18px;
  background: rgb(31, 192, 111);
  color: white;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12);
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 14px;
    text-align: right;
    justify-content: flex-end;
  }
`;


export default withTheme()(withStyles(styles)(BallotItemSupportOpposeCountDisplay));
