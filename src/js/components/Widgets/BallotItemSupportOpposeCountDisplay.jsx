import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import BallotStore from '../../stores/BallotStore';
import CandidateActions from '../../actions/CandidateActions';
import CandidateStore from '../../stores/CandidateStore';
import { cordovaDot } from '../../utils/cordovaUtils';
import IssueStore from '../../stores/IssueStore';
import { renderLog } from '../../utils/logging';
import MeasureActions from '../../actions/MeasureActions';
import MeasureStore from '../../stores/MeasureStore';
import SupportStore from '../../stores/SupportStore';
import { stringContains } from '../../utils/textFormat';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
// import { findDOMNode } from 'react-dom';

// December 2018:  We want to work toward being airbnb style compliant, but for now these are disabled in this file to minimize complex changes
/* eslint react/no-find-dom-node: 1 */
/* eslint array-callback-return: 1 */

export default class BallotItemSupportOpposeCountDisplay extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    goToCandidate: PropTypes.func, // We don't require this because sometimes we don't want the link to do anything
    popoverBottom: PropTypes.bool,
  };

  static closePositionsPopover () {
    document.body.click();
  }

  constructor (props) {
    super(props);

    this.popover_state = {};
    this.mobile = 'ontouchstart' in document.documentElement;

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
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    let ballotItemDisplayName = '';
    const ballotItemSupportProps = SupportStore.get(this.props.ballotItemWeVoteId);
    let isCandidate = false;
    let isMeasure = false;
    if (stringContains('cand', this.props.ballotItemWeVoteId)) {
      const candidate = CandidateStore.getCandidate(this.props.ballotItemWeVoteId);
      ballotItemDisplayName = candidate.ballot_item_display_name || '';
      isCandidate = true;
    } else if (stringContains('meas', this.props.ballotItemWeVoteId)) {
      const measure = MeasureStore.getMeasure(this.props.ballotItemWeVoteId);
      ballotItemDisplayName = measure.ballot_item_display_name || '';
      isMeasure = true;
    }

    let positionListFromAdvisersFollowedByVoter;
    if (isCandidate) {
      if (!BallotStore.positionListHasBeenRetrievedOnce(this.props.ballotItemWeVoteId)) {
        CandidateActions.positionListForBallotItem(this.props.ballotItemWeVoteId);
      }
      positionListFromAdvisersFollowedByVoter = CandidateStore.getPositionList(this.props.ballotItemWeVoteId);
    } else if (isMeasure) {
      if (!BallotStore.positionListHasBeenRetrievedOnce(this.props.ballotItemWeVoteId)) {
        MeasureActions.positionListForBallotItem(this.props.ballotItemWeVoteId);
      }
      positionListFromAdvisersFollowedByVoter = MeasureStore.getPositionList(this.props.ballotItemWeVoteId);
    }
    const organizationsToFollowSupport = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdSupports(this.props.ballotItemWeVoteId);
    const organizationsToFollowOppose = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdOpposes(this.props.ballotItemWeVoteId);
    this.setState(props => ({
      ballotItemDisplayName,
      ballotItemSupportProps,
      ballotItemWeVoteId: props.ballotItemWeVoteId,
      componentDidMountFinished: true,
      isCandidate,
      isMeasure,
      organizationsToFollowSupport,
      organizationsToFollowOppose,
      positionListFromAdvisersFollowedByVoter,
      voter: VoterStore.getVoter(), // We only set this once since the info we need isn't dynamic
    }));
  }

  componentWillReceiveProps (nextProps) {
    let ballotItemDisplayName;
    const ballotItemSupportProps = SupportStore.get(nextProps.ballotItemWeVoteId);
    let isCandidate = false;
    let isMeasure = false;
    if (stringContains('cand', nextProps.ballotItemWeVoteId)) {
      const candidate = CandidateStore.getCandidate(nextProps.ballotItemWeVoteId);
      ballotItemDisplayName = candidate.ballot_item_display_name || '';
      isCandidate = true;
    } else if (stringContains('meas', nextProps.ballotItemWeVoteId)) {
      const measure = MeasureStore.getMeasure(nextProps.ballotItemWeVoteId);
      ballotItemDisplayName = measure.ballot_item_display_name || '';
      isMeasure = true;
    }
    let positionListFromAdvisersFollowedByVoter;
    if (isCandidate) {
      // CandidateActions.positionListForBallotItem(nextProps.ballotItemWeVoteId);
      positionListFromAdvisersFollowedByVoter = CandidateStore.getPositionList(nextProps.ballotItemWeVoteId);
    } else if (isMeasure) {
      // MeasureActions.positionListForBallotItem(nextProps.ballotItemWeVoteId);
      positionListFromAdvisersFollowedByVoter = MeasureStore.getPositionList(nextProps.ballotItemWeVoteId);
    }
    const organizationsToFollowSupport = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdSupports(nextProps.ballotItemWeVoteId);
    const organizationsToFollowOppose = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdOpposes(nextProps.ballotItemWeVoteId);
    this.setState(() => ({
      ballotItemDisplayName,
      ballotItemSupportProps,
      ballotItemWeVoteId: nextProps.ballotItemWeVoteId,
      isCandidate,
      isMeasure,
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
    if ((!this.state.organizationsToFollowSupport) || (!nextState.organizationsToFollowSupport) || (this.state.organizationsToFollowSupport.length !== nextState.organizationsToFollowSupport.length)) {
      // console.log("shouldComponentUpdate: this.state.organizationsToFollowSupport.length", this.state.organizationsToFollowSupport.length, ", nextState.organizationsToFollowSupport.length", nextState.organizationsToFollowSupport.length);
      return true;
    }
    if (this.state.organizationsToFollowOppose.length !== nextState.organizationsToFollowOppose.length) {
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
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) {       // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  onCandidateStoreChange () {
    if (this.state.isCandidate) {
      this.setState(state => ({
        ballotItem: CandidateStore.getCandidate(state.ballotItemWeVoteId),
        positionListFromAdvisersFollowedByVoter: CandidateStore.getPositionList(state.ballotItemWeVoteId),
      }));
    }
  }

  onMeasureStoreChange () {
    if (this.state.isMeasure) {
      this.setState(state => ({
        ballotItem: MeasureStore.getMeasure(state.ballotItemWeVoteId),
        positionListFromAdvisersFollowedByVoter: MeasureStore.getPositionList(state.ballotItemWeVoteId),
      }));
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

  closeNetworkScorePopover () {
    this.refs['network-score-overlay'].hide();
  }

  closeIssueScorePopover () {
    this.refs['issue-score-overlay'].hide();
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
    // console.log("BallotItemSupportOpposeCountDisplay render, ballotItemWeVoteId:", this.props.ballotItemWeVoteId);
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
    // // console.log("BallotItemSupportOpposeCountDisplay, voterIssuesScore: ", voterIssuesScore, ", ballotItemWeVoteId: ", this.state.ballotItemWeVoteId);
    // const issueCountUnderThisBallotItem = IssueStore.getIssuesCountUnderThisBallotItem(this.state.ballotItemWeVoteId);
    // const issueCountUnderThisBallotItemVoterIsFollowing = IssueStore.getIssuesCountUnderThisBallotItemVoterIsFollowing(this.state.ballotItemWeVoteId);

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
    // const { is_voter_support: isVoterSupport, is_voter_oppose: isVoterOppose, voter_statement_text: voterStatementText } = this.state.ballotItemSupportProps || {};

    const { organizationsToFollowSupport, organizationsToFollowOppose } = this.state;

    const organizationsToFollowSupportCount =  organizationsToFollowSupport ? organizationsToFollowSupport.length :  0;
    const organizationsToFollowOpposeCount =  organizationsToFollowOppose ? organizationsToFollowOppose.length :  0;
    const positionsCount = networkSupportCount + networkOpposeCount + organizationsToFollowSupportCount + organizationsToFollowOpposeCount;

    // console.log("this.state.positionListFromAdvisersFollowedByVoter: ", this.state.positionListFromAdvisersFollowedByVoter);
    // if (positionsCount) {
    //   let supportPositionsListCount = 0;
    //   let opposePositionsListCount = 0;
    //   // let info_only_positions_list_count = 0;
    //   this.state.positionListFromAdvisersFollowedByVoter.map((onePosition) => {
    //     // console.log("onePosition: ", onePosition);
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
    //   // console.log("supportPositionsListCount:", supportPositionsListCount);
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

    const ballotItemSupportProps = SupportStore.get(this.state.ballotItemWeVoteId);
    networkSupportCount = 0;
    networkOpposeCount = 0;
    if (ballotItemSupportProps !== undefined) {
      networkSupportCount = ballotItemSupportProps.support_count ? parseInt(ballotItemSupportProps.support_count || '0') : 0;
      networkOpposeCount = ballotItemSupportProps.oppose_count ? parseInt(ballotItemSupportProps.oppose_count || '0') : 0;
    }
    const totalSupportCount = networkSupportCount + organizationsToFollowSupport.length;
    const totalOpposeCount = networkOpposeCount + organizationsToFollowOppose.length;
    const totalInfoOnlyCount = 0;

    return (
      <span>
        {/* Total counts of all support, opposition and info only comments for this ballot item */}
        { showNetworkScore ?
          null : (
            <OverlayTrigger
              trigger="click"
              rootClose
              placement={this.props.popoverBottom ? 'bottom' : 'top'}
              overlay={positionsPopover}
            >
              <span className="u-cursor--pointer">
                <span>Endorsements</span>
                <br />
                <span className="network-positions-stacked__support-label">
                  <span className="issues-list-stacked__support-label u-no-break">
                    <span className="u-no-break issue-icon-list__endorsements-label">
                      <img
                        src={cordovaDot(
                          '/img/global/svg-icons/issues/thumbs-up-icon.svg',
                        )}
                        className="issue-icon-list__endorsement-icon"
                        alt="Thumbs Up"
                        width="20"
                        height="20"
                      />
                      <span className="issue-icon-list__endorsement-count">
                        {totalSupportCount}
                      </span>
                    </span>
                    <span className="issue-icon-list__endorsements-label u-no-break">
                      <img
                        src={cordovaDot(
                          '/img/global/svg-icons/issues/thumbs-down-icon.svg',
                        )}
                        className="issue-icon-list__endorsement-icon"
                        alt="Thumbs Down"
                        width="20"
                        height="20"
                      />
                      <span className="issue-icon-list__endorsement-count">
                        {totalOpposeCount}
                      </span>
                    </span>
                    <span className="issue-icon-list__endorsements-label u-no-break">
                      <img
                        src={cordovaDot(
                          '/img/global/svg-icons/comment-icon.svg',
                        )}
                        className="issue-icon-list__endorsement-icon"
                        alt="Comment"
                        width="20"
                        height="20"
                      />
                      <span className="issue-icon-list__endorsement-count">
                        {totalInfoOnlyCount}
                      </span>
                    </span>
                  </span>
                </span>
              </span>
            </OverlayTrigger>
          )
        }

        {/* Network Score for this ballot item here */}
        { showNetworkScore ? (
          <OverlayTrigger
            trigger="click"
            ref="network-score-overlay"
            onExit={this.closeNetworkScorePopover}
            rootClose
            placement={this.props.popoverBottom ? 'bottom' : 'top'}
            overlay={scoreInYourNetworkPopover}
          >
            <span className="network-positions-stacked__support-score u-cursor--pointer u-no-break">
              { totalNetworkScore === 0 ? (
                <span className="u-margin-left--md">
                  { totalNetworkScoreWithSign }
                </span>
              ) : (
                <span className="u-margin-left--xs">
                  { totalNetworkScoreWithSign }
                </span>
              )}
            </span>
          </OverlayTrigger>
        ) : null
        }
        <span className="sr-only">
          {totalNetworkScore > 0 ? `${totalNetworkScore} Support` : null }
          {totalNetworkScore < 0 ? `${totalNetworkScore} Oppose` : null }
        </span>
      </span>
    );
  }
}
