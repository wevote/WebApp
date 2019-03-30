import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { findDOMNode } from 'react-dom';
import $ from 'jquery';
import BallotStore from '../../stores/BallotStore';
import CandidateActions from '../../actions/CandidateActions';
import CandidateStore from '../../stores/CandidateStore';
import { cordovaDot } from '../../utils/cordovaUtils';
import IssuesByBallotItemDisplayList from '../Values/IssuesByBallotItemDisplayList';
import IssueStore from '../../stores/IssueStore';
import ItemActionBar from './ItemActionBar';
import ItemPositionStatementActionBar from './ItemPositionStatementActionBar';
import ItemTinyPositionBreakdownList from '../Position/ItemTinyPositionBreakdownList';
import { renderLog } from '../../utils/logging';
import MeasureActions from '../../actions/MeasureActions';
import MeasureStore from '../../stores/MeasureStore';
import OrganizationsToDisplay from './OrganizationsToDisplay';
import SupportStore from '../../stores/SupportStore';
import { stringContains } from '../../utils/textFormat';
import VoterStore from '../../stores/VoterStore';
import thumbsUpIcon from '../../../img/global/svg-icons/issues/thumbs-up-icon.svg';
import thumbsDownIcon from '../../../img/global/svg-icons/issues/thumbs-down-icon.svg';
import thumbsUpColorIcon from '../../../img/global/icons/thumbs-up-color-icon.svg';
import thumbsDownColorIcon from '../../../img/global/icons/thumbs-down-color-icon.svg';
import issueV1Icon from '../../../img/global/svg-icons/issues-v1-64x42.svg';

// December 2018:  We want to work toward being airbnb style compliant, but for now these are disabled in this file to minimize complex changes
/* eslint react/no-find-dom-node: 1 */
/* eslint array-callback-return: 1 */

export default class ItemSupportOpposeRaccoon extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string,
    ballotItemWeVoteId: PropTypes.string,
    currentBallotIdInUrl: PropTypes.string,
    goToCandidate: PropTypes.func, // We don't require this because sometimes we don't want the link to do anything
    // maximumOrganizationDisplay: PropTypes.number,
    organizationsToFollowSupport: PropTypes.array,
    organizationsToFollowOppose: PropTypes.array,
    popoverBottom: PropTypes.bool,
    // positionBarIsClickable: PropTypes.bool,
    showIssueList: PropTypes.bool,
    showPositionStatementActionBar: PropTypes.bool,
    supportProps: PropTypes.object,
    urlWithoutHash: PropTypes.string,
    we_vote_id: PropTypes.string,
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
      ballotItemType: '',
      ballotItemWeVoteId: '',
      can_scroll_desktop: false,
      can_scroll_mobile: false,
      can_scroll_left_desktop: false,
      can_scroll_left_mobile: false,
      can_scroll_right_desktop: true,
      can_scroll_right_mobile: true,
      componentDidMountFinished: false,
      showPositionStatement: false,
      shouldFocusCommentArea: false,
      organizationsToFollowSupport: [],
      organizationsToFollowOppose: [],
      position_list_from_advisers_followed_by_voter: [],
      supportProps: this.props.supportProps,
    };
    this.closeIssueScorePopover = this.closeIssueScorePopover.bind(this);
    this.closeNetworkScorePopover = this.closeNetworkScorePopover.bind(this);
    this.goToCandidateLinkLocal = this.goToCandidateLinkLocal.bind(this);
    this.passDataBetweenItemActionToItemPosition = this.passDataBetweenItemActionToItemPosition.bind(this);
  }

  componentDidMount () {
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
    let ballotItemType;
    let isCandidate = false;
    let isMeasure = false;
    if (stringContains('cand', this.props.ballotItemWeVoteId)) {
      ballotItemType = 'CANDIDATE';
      isCandidate = true;
    } else if (stringContains('meas', this.props.ballotItemWeVoteId)) {
      ballotItemType = 'MEASURE';
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
    this.setScrollState();
    this.setState(props => ({
      ballotItemDisplayName: props.ballot_item_display_name,
      ballotItemType,
      ballotItemWeVoteId: props.ballotItemWeVoteId,
      componentDidMountFinished: true,
      is_candidate: isCandidate,
      is_measure: isMeasure,
      organizationsToFollowSupport: props.organizationsToFollowSupport,
      organizationsToFollowOppose: props.organizationsToFollowOppose,
      position_list_from_advisers_followed_by_voter: positionListFromAdvisersFollowedByVoter,
      supportProps: props.supportProps,
      voter: VoterStore.getVoter(), // We only set this once since the info we need isn't dynamic
    }));
  }

  componentWillReceiveProps (nextProps) {
    let ballotItemType;
    let isCandidate = false;
    let isMeasure = false;
    if (stringContains('cand', nextProps.ballotItemWeVoteId)) {
      ballotItemType = 'CANDIDATE';
      isCandidate = true;
    } else if (stringContains('meas', nextProps.ballotItemWeVoteId)) {
      ballotItemType = 'MEASURE';
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
    this.setScrollState();
    this.setState(() => ({
      ballotItemDisplayName: nextProps.ballot_item_display_name,
      ballotItemType,
      ballotItemWeVoteId: nextProps.ballotItemWeVoteId,
      is_candidate: isCandidate,
      is_measure: isMeasure,
      organizationsToFollowSupport: nextProps.organizationsToFollowSupport,
      organizationsToFollowOppose: nextProps.organizationsToFollowOppose,
      position_list_from_advisers_followed_by_voter: positionListFromAdvisersFollowedByVoter,
      supportProps: nextProps.supportProps,
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
    if (this.state.supportProps !== undefined && nextState.supportProps !== undefined) {
      const currentNetworkSupportCount = parseInt(this.state.supportProps.support_count) || 0;
      const nextNetworkSupportCount = parseInt(nextState.supportProps.support_count) || 0;
      const currentNetworkOpposeCount = parseInt(this.state.supportProps.oppose_count) || 0;
      const nextNetworkOpposeCount = parseInt(nextState.supportProps.oppose_count) || 0;
      if (currentNetworkSupportCount !== nextNetworkSupportCount || currentNetworkOpposeCount !== nextNetworkOpposeCount) {
        // console.log("shouldComponentUpdate: support or oppose count change");
        return true;
      }
    }
    if (this.props.showPositionStatementActionBar !== nextProps.showPositionStatementActionBar) {
      // console.log("shouldComponentUpdate: this.props.showPositionStatementActionBar change");
      return true;
    }
    return this.state.showPositionStatement !== nextState.showPositionStatement;
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.issueStoreListener.remove();
    this.measureStoreListener.remove();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) {       // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  onCandidateStoreChange () {
    this.setScrollState();
    if (this.state.is_candidate) {
      this.setState(state => ({
        ballotItem: CandidateStore.getCandidate(state.ballotItemWeVoteId),
        position_list_from_advisers_followed_by_voter: CandidateStore.getPositionList(state.ballotItemWeVoteId),
      }));
    }
  }

  onMeasureStoreChange () {
    this.setScrollState();
    if (this.state.is_measure) {
      this.setState(state => ({
        ballotItem: MeasureStore.getMeasure(state.ballotItemWeVoteId),
        position_list_from_advisers_followed_by_voter: MeasureStore.getPositionList(state.ballotItemWeVoteId),
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

  setScrollState () {
    const desktopList = findDOMNode(this.refs[`${this.state.ballotItemWeVoteId}-org-list-desktop`]);
    const mobileList = findDOMNode(this.refs[`${this.state.ballotItemWeVoteId}-org-list-mobile`]);
    const desktopListVisibleWidth = $(desktopList).width();
    const desktopListWidth = $(desktopList).children().eq(0).children()
      .eq(0)
      .width();
    const mobileListVisibleWidth = $(mobileList).width();
    const mobileListWidth = $(mobileList).children().eq(0).children()
      .eq(0)
      .width();
    this.setState(() => ({
      can_scroll_desktop: desktopListVisibleWidth <= desktopListWidth,
      can_scroll_mobile: mobileListVisibleWidth <= mobileListWidth,
    }));
  }

  closeNetworkScorePopover () {
    this.refs['network-score-overlay'].hide();
  }

  scrollLeft (visibleTag) {
    // todo: design out findDOMNode see https://github.com/yannickcr/eslint-plugin-react/issues/678
    const element = findDOMNode(this.refs[`${this.state.ballotItemWeVoteId}-org-list-${visibleTag}`]);
    const position = $(element).scrollLeft();
    const width = Math.round($(element).width());
    $(element).animate({
      scrollLeft: position - width,
    }, 350, () => {
      const newPosition = $(element).scrollLeft();
      if (visibleTag === 'desktop') {
        this.setState(() => ({
          can_scroll_left_desktop: newPosition > 0,
          can_scroll_right_desktop: true,
        }));
      } else {
        this.setState(() => ({
          can_scroll_left_mobile: newPosition > 0,
          can_scroll_right_mobile: true,
        }));
      }
    });
  }

  scrollRight (visibleTag) {
    const element = findDOMNode(this.refs[`${this.state.ballotItemWeVoteId}-org-list-${visibleTag}`]);
    const position = $(element).scrollLeft();
    const width = Math.round($(element).width());
    $(element).animate({
      scrollLeft: position + width,
    }, 350, () => {
      const newPosition = $(element).scrollLeft();
      if (visibleTag === 'desktop') {
        this.setState(() => ({
          can_scroll_left_desktop: newPosition > 0,
          can_scroll_right_desktop: position + width === newPosition,
        }));
      } else {
        this.setState(() => ({
          can_scroll_left_mobile: newPosition > 0,
          can_scroll_right_mobile: position + width === newPosition,
        }));
      }
    });
  }

  closeIssueScorePopover () {
    this.refs['issue-score-overlay'].hide();
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('ItemSupportOpposeRaccoon caught error: ', `${error} with info: `, info);
  }

  passDataBetweenItemActionToItemPosition () {
    this.setState(() => ({ shouldFocusCommentArea: true }));
  }

  goToCandidateLinkLocal () {
    // console.log("ItemSupportOpposeRaccoon goToCandidateLinkLocal");
    if (this.props.goToCandidate) {
      this.props.goToCandidate();
    }
  }

  togglePositionStatement () {
    this.setState(state => ({
      showPositionStatement: !state.showPositionStatement,
      shouldFocusCommentArea: true,
    }));
  }

  render () {
    // console.log("ItemSupportOpposeRaccoon render, we_vote_id:", this.props.we_vote_id);
    renderLog(__filename);
    const ballotItemSupportStore = SupportStore.get(this.state.ballotItemWeVoteId);
    // Issue Score
    const voterIssuesScore = IssueStore.getIssuesScoreByBallotItemWeVoteId(this.state.ballotItemWeVoteId);
    let voterIssuesScoreWithSign;
    if (voterIssuesScore > 0) {
      voterIssuesScoreWithSign = `+${voterIssuesScore}`;
    } else if (voterIssuesScore < 0) {
      voterIssuesScoreWithSign = voterIssuesScore;
    } else {
      voterIssuesScoreWithSign = voterIssuesScore;
    }
    // console.log("ItemSupportOpposeRaccoon, voterIssuesScore: ", voterIssuesScore, ", ballotItemWeVoteId: ", this.state.ballotItemWeVoteId);
    const issueCountUnderThisBallotItem = IssueStore.getIssuesCountUnderThisBallotItem(this.state.ballotItemWeVoteId);
    const issueCountUnderThisBallotItemVoterIsFollowing = IssueStore.getIssuesCountUnderThisBallotItemVoterIsFollowing(this.state.ballotItemWeVoteId);

    // Network Score
    let networkSupportCount = 0;
    let networkOpposeCount = 0;
    let totalNetworkScore = 0;
    let totalNetworkScoreWithSign;
    if (this.state.supportProps !== undefined) {
      networkSupportCount = parseInt(this.state.supportProps.support_count) || 0;
      networkOpposeCount = parseInt(this.state.supportProps.oppose_count) || 0;
      totalNetworkScore = parseInt(networkSupportCount - networkOpposeCount);
      if (totalNetworkScore > 0) {
        totalNetworkScoreWithSign = `+${totalNetworkScore}`;
      } else if (totalNetworkScore < 0) {
        totalNetworkScoreWithSign = totalNetworkScore;
      } else {
        totalNetworkScoreWithSign = totalNetworkScore;
      }
    }

    let showIssueScore = true;
    if (voterIssuesScore === undefined) {
      showIssueScore = false;
    } else if (issueCountUnderThisBallotItem === 0 && voterIssuesScore === 0) {
      // There can't be an issue score because there aren't any issues tagged to organizations with a position on this candidate
      showIssueScore = false;
    } else if (totalNetworkScore !== 0 && voterIssuesScore === 0) {
      // We show the network score when there isn't a network score and there is a voterIssuesScore
      showIssueScore = false;
    }

    let showNetworkScore = true;
    if (voterIssuesScore !== 0 && totalNetworkScore === 0) {
      // There is an issue score, and the total Network Score is 0, so don't show Network score
      showNetworkScore = false;
    } else if (voterIssuesScore === 0 && networkSupportCount === 0 && networkOpposeCount === 0) {
      // There is NOT an issue score, and BOTH network_support and network_oppose must be zero to hide Network Score
      showNetworkScore = false;
    }

    // Voter Support or opposition
    const { is_voter_support: isVoterSupport, is_voter_oppose: isVoterOppose, voter_statement_text: voterStatementText } = ballotItemSupportStore || {};

    let commentBoxIsVisible = false;
    if (this.props.showPositionStatementActionBar || isVoterSupport || isVoterOppose || voterStatementText || this.state.showPositionStatement) {
      commentBoxIsVisible = true;
    }
    const itemActionBar = (
      <span>
        <ItemActionBar
          ballot_item_display_name={this.state.ballotItemDisplayName}
          ballotItemWeVoteId={this.state.ballotItemWeVoteId}
          commentButtonHide={commentBoxIsVisible}
          commentButtonHideInMobile
          currentBallotIdInUrl={this.props.currentBallotIdInUrl}
          shareButtonHide
          supportOrOpposeHasBeenClicked={this.passDataBetweenItemActionToItemPosition}
          toggleFunction={this.togglePositionStatement}
          transitioning={this.state.transitioning}
          type={this.state.ballotItemType}
          urlWithoutHash={this.props.urlWithoutHash}
        />
      </span>
    );

    const commentDisplayDesktop = this.props.showPositionStatementActionBar || isVoterSupport || isVoterOppose || voterStatementText || this.state.showPositionStatement ? (
      <div className="d-none d-sm-block o-media-object u-flex-auto u-min-50 u-push--sm u-stack--sm">
        <div className="o-media-object__body u-flex u-flex-column u-flex-auto u-justify-between">
          <ItemPositionStatementActionBar
            ballot_item_we_vote_id={this.state.ballotItemWeVoteId}
            ballotItemDisplayName={this.state.ballotItemDisplayName}
            comment_edit_mode_on={this.state.showPositionStatement}
            supportProps={ballotItemSupportStore}
            shouldFocus={this.state.shouldFocusCommentArea}
            transitioning={this.state.transitioning}
            type={this.state.ballotItemType}
            shown_in_list
          />
        </div>
      </div>
    ) :
      null;

    const commentDisplayMobile = this.props.showPositionStatementActionBar || isVoterSupport || isVoterOppose || voterStatementText ? (
      <div className="d-block d-sm-none o-media-object u-flex-auto u-min-50 u-push--sm u-stack--sm">
        <div className="o-media-object__body u-flex u-flex-column u-flex-auto u-justify-between">
          <ItemPositionStatementActionBar
            ballot_item_we_vote_id={this.state.ballotItemWeVoteId}
            ballotItemDisplayName={this.state.ballotItemDisplayName}
            supportProps={ballotItemSupportStore}
            shouldFocus={this.state.shouldFocusCommentArea}
            transitioning={this.state.transitioning}
            type={this.state.ballotItemType}
            shown_in_list
          />
        </div>
      </div>
    ) :
      null;

    const { organizationsToFollowSupport, organizationsToFollowOppose } = this.state;

    const organizationsToFollowSupportCount =  organizationsToFollowSupport ? organizationsToFollowSupport.length :  0;
    const organizationsToFollowOpposeCount =  organizationsToFollowOppose ? organizationsToFollowOppose.length :  0;
    const positionsCount = networkSupportCount + networkOpposeCount + organizationsToFollowSupportCount + organizationsToFollowOpposeCount;
    const maximumOrganizationsToShowDesktop = 50;
    const maximumOrganizationsToShowMobile = 50;

    let organizationsToFollowSupportDesktopToShow = 0;
    let organizationsToFollowOpposeDesktopToShow = 0;
    let organizationsToFollowOpposeMobileToShow = 0;
    let organizationsToFollowSupportMobileToShow = 0;

    // console.log("this.state.position_list_from_advisers_followed_by_voter: ", this.state.position_list_from_advisers_followed_by_voter);
    if (positionsCount) {
      let supportPositionsListCount = 0;
      let opposePositionsListCount = 0;
      // let info_only_positions_list_count = 0;
      this.state.position_list_from_advisers_followed_by_voter.map((onePosition) => {
        // console.log("onePosition: ", onePosition);
        // Filter out the positions that we don't want to display
        if (onePosition.is_support_or_positive_rating) {
          supportPositionsListCount++;
        } else if (onePosition.is_oppose_or_negative_rating) {
          opposePositionsListCount++;
        } // else if (!onePosition.is_support_or_positive_rating && !onePosition.is_oppose_or_negative_rating) {
        //   info_only_positions_list_count++;
        // }
        return null;
      });
      // console.log("supportPositionsListCount:", supportPositionsListCount);

      // We calculate how many organizations_to_follow based on the number of positions from advisers we follow
      const offsetForMoreText = 3;
      organizationsToFollowSupportDesktopToShow = maximumOrganizationsToShowDesktop - supportPositionsListCount - offsetForMoreText;
      organizationsToFollowSupportDesktopToShow = organizationsToFollowSupportDesktopToShow >= 0 ? organizationsToFollowSupportDesktopToShow : 0;
      organizationsToFollowSupportMobileToShow = maximumOrganizationsToShowMobile - supportPositionsListCount - offsetForMoreText;
      organizationsToFollowSupportMobileToShow = organizationsToFollowSupportMobileToShow >= 0 ? organizationsToFollowSupportMobileToShow : 0;
      organizationsToFollowOpposeDesktopToShow = maximumOrganizationsToShowDesktop - opposePositionsListCount - offsetForMoreText;
      organizationsToFollowOpposeDesktopToShow = organizationsToFollowOpposeDesktopToShow >= 0 ? organizationsToFollowOpposeDesktopToShow : 0;
      organizationsToFollowOpposeMobileToShow = maximumOrganizationsToShowMobile - opposePositionsListCount - offsetForMoreText;
      organizationsToFollowOpposeMobileToShow = organizationsToFollowOpposeMobileToShow >= 0 ? organizationsToFollowOpposeMobileToShow : 0;
    }

    let scoreFromYourIssuesPopover;
    let scoreInYourNetworkPopover;
    let issuesPopoverPlacement = 'top';
    let advisorsThatMakeVoterIssuesScoreDisplay;
    let advisorsThatMakeVoterIssuesScoreCount = 0;
    if (issueCountUnderThisBallotItemVoterIsFollowing) {
      // If there are issues the voter is following, we should attempt to to create a list of orgs that support or oppose this ballot item
      const organizationNameIssueSupportList = IssueStore.getOrganizationNameSupportListUnderThisBallotItem(this.state.ballotItemWeVoteId);
      const organizationNameIssueSupportListDisplay = organizationNameIssueSupportList.map(organizationName => (
        <span key={organizationName} className="u-flex u-flex-row u-justify-start u-items-start">
          <img src={cordovaDot(thumbsUpColorIcon)} alt="Thumbs Up" width="20" height="20" />
          <span>&nbsp;</span>
          <span>
            {organizationName}
            {' '}
            <strong>+1</strong>
          </span>
        </span>
      ));
      const organizationNameIssueOpposeList = IssueStore.getOrganizationNameOpposeListUnderThisBallotItem(this.state.ballotItemWeVoteId);
      const organizationNameIssueOpposeListDisplay = organizationNameIssueOpposeList.map(organizationName => (
        <span key={organizationName} className="u-flex u-flex-row u-justify-start u-items-start">
          <img src={cordovaDot(thumbsDownColorIcon)} alt="Thumbs Down" width="20" height="20" />
          <span>&nbsp;</span>
          <span>
            {organizationName}
            {' '}
            <strong>-1</strong>
          </span>
        </span>
      ));
      advisorsThatMakeVoterIssuesScoreDisplay = (
        <span>
          { organizationNameIssueSupportList.length ? <span>{organizationNameIssueSupportListDisplay}</span> : null}
          { organizationNameIssueOpposeList.length ? <span>{organizationNameIssueOpposeListDisplay}</span> : null}
        </span>
      );
      advisorsThatMakeVoterIssuesScoreCount = organizationNameIssueSupportList.length + organizationNameIssueOpposeList.length;
    }

    if (showIssueScore) {
      // If here, we know this Ballot item has at least one related issue
      if (advisorsThatMakeVoterIssuesScoreCount > 0) {
        // There is a voterIssuesScore, and we have some advisers to display
        // Removed bsPrefix="card-popover"
        scoreFromYourIssuesPopover = (
          <Popover
            id="score-popover-trigger-click-root-close"
            title={(
              <span>
              Issue Score
                <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" />
              </span>
            )}
            onClick={this.closeIssueScorePopover}
          >
            We&apos;ve added up the opinions about
            {' '}
            {this.state.ballotItemDisplayName}
            {' '}
            from all the organizations tagged with your issues:
            {advisorsThatMakeVoterIssuesScoreDisplay}
          </Popover>
        );
        issuesPopoverPlacement = 'bottom';
      } else if (!issueCountUnderThisBallotItem) {
        // At this point the Issue Score is showing, but the issues haven't loaded yet
        // Removed bsPrefix="card-popover"
        scoreFromYourIssuesPopover = (
          <Popover
            id="score-popover-trigger-click-root-close"
            title={(
              <span>
                Issue Score
                <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" />
              </span>
            )}
            onClick={this.closeIssueScorePopover}
          >
            We&apos;ve added up the opinions about
            {' '}
            {this.state.ballotItemDisplayName}
            {' '}
            from all the organizations tagged with your issues. Loading issues now...
          </Popover>
        );
        issuesPopoverPlacement = 'top';
      } else if (issueCountUnderThisBallotItemVoterIsFollowing === 0) {
        // Voter isn't following any Issues related to this ballot item, or none that contribute to the Issues score.
        // Encourage voter to follow Issues
        // Removed bsPrefix="card-popover"
        scoreFromYourIssuesPopover = (
          <Popover
            id="score-popover-trigger-click-root-close"
            title={(
              <span>
                Issue Score
                <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" />
              </span>
            )}
            onClick={this.closeIssueScorePopover}
          >
            Follow
            {' '}
            <strong>
              <img
                src={cordovaDot(issueV1Icon)}
                width="24px"
                alt="Issues"
              />
              {' '}
              Issues
            </strong>
            {' '}
            to get a personalized
            {' '}
            <strong>Score</strong>
            {' '}
            for
            {' '}
            {this.state.ballotItemDisplayName}
            .
            We add up the opinions from all organizations tagged with your issues. Whew, that&apos;s a mouthful!
          </Popover>
        );
        issuesPopoverPlacement = 'top';
      } else {
        // There is a voterIssuesScore, and we have some advisers to display
        // Removed bsPrefix="card-popover"
        scoreFromYourIssuesPopover = (
          <Popover
            id="score-popover-trigger-click-root-close"
            title={(
              <span>
                Issue Score
                <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" />
              </span>
            )}
            onClick={this.closeIssueScorePopover}
          >
            We&apos;ve added up the opinions about
            {' '}
            {this.state.ballotItemDisplayName}
            {' '}
            from all the organizations tagged with your issues:
            {advisorsThatMakeVoterIssuesScoreDisplay}
          </Popover>
        );
        issuesPopoverPlacement = 'bottom';
      }
    }

    // If there are issues the voter is following, we should attempt to to create a list of orgs that support or oppose this ballot item
    const nameNetworkSupportList = SupportStore.getNameSupportListUnderThisBallotItem(this.state.ballotItemWeVoteId);
    const nameNetworkSupportListDisplay = nameNetworkSupportList.map(speakerDisplayName => (
      <span key={speakerDisplayName} className="u-flex u-flex-row u-justify-start u-items-start">
        <img src={cordovaDot(thumbsUpColorIcon)} alt="Thumbs Up" width="20" height="20" />
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
        <img src={cordovaDot(thumbsDownColorIcon)} alt="Thumbs Down" width="20" height="20" />
        <span>&nbsp;</span>
        <span>
          {speakerDisplayName}
          {' '}
          <strong>-1</strong>
        </span>
      </span>
    ));
    const advisorsThatMakeVoterNetworkScoreDisplay = (
      <span>
        { nameNetworkSupportList.length ? <span>{nameNetworkSupportListDisplay}</span> : null}
        { nameNetworkOpposeList.length ? <span>{nameNetworkOpposeListDisplay}</span> : null}
      </span>
    );
    const advisorsThatMakeVoterNetworkScoreCount = nameNetworkSupportList.length + nameNetworkOpposeList.length;

    if (advisorsThatMakeVoterNetworkScoreCount > 0) {
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
          {advisorsThatMakeVoterNetworkScoreDisplay}
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
              src={cordovaDot(thumbsUpColorIcon)}
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
              src={cordovaDot(thumbsDownColorIcon)}
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

    const voterDecidedItem = this.state.supportProps && this.state.voter &&
    (this.state.supportProps.is_support || this.state.supportProps.is_oppose);

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
        onClick={ItemSupportOpposeRaccoon.closePositionsPopover}
      >
        These organizations
        {' '}
        <span className="u-no-break">
          <img
            src={cordovaDot(thumbsUpColorIcon)}
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
            src={cordovaDot(thumbsDownColorIcon)}
            alt="Thumbs Down"
            width="20"
            height="20"
          />
          {' '}
          oppose
        </span>
        {this.state.ballotItemDisplayName ? ` ${this.state.ballotItemDisplayName}` : ''}
        .
        Click on the logo
        and
        {' '}
        <strong>Listen</strong>
        {' '}
        to an organization to add their opinion to your personalized
        {' '}
        <strong>Score</strong>
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
          onClick={ItemSupportOpposeRaccoon.closePositionsPopover}
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
          onClick={ItemSupportOpposeRaccoon.closePositionsPopover}
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
    // These are already passed in as props
    // const organizationsToFollowSupport = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdSupports(this.state.ballotItemWeVoteId);
    // const organizationsToFollowOppose = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdOpposes(this.state.ballotItemWeVoteId);
    const totalSupportCount = networkSupportCount + organizationsToFollowSupport.length;
    const totalOpposeCount = networkOpposeCount + organizationsToFollowOppose.length;

    const endorsementsLabel = (
      <span className="issues-list-stacked__support-label u-cursor--pointer u-no-break">
        {totalSupportCount ? (                                                               // eslint-disable-line no-nested-ternary
          <span className="u-no-break issue-icon-list__endorsements-label">
            <img
              src={cordovaDot(thumbsUpIcon)}
              className="issue-icon-list__endorsement-icon"
              alt="Thumbs Up"
              width="20"
              height="20"
            />
            <span className="issue-icon-list__endorsement-count">
              {totalSupportCount}
            </span>
          </span>
        ) : null
        }
        {totalOpposeCount ? (
          <span className="u-no-break issue-icon-list__endorsements-label">
            <img
              src={cordovaDot(
                thumbsDownIcon,
              )}
              className="issue-icon-list__endorsement-icon"
              alt="Thumbs Down"
              width="20"
              height="20"
            />
            <span className="issue-icon-list__endorsement-count">
              -
              {totalOpposeCount}
            </span>
          </span>
        ) : null
        }
        {totalSupportCount || totalOpposeCount ? (
          <span>Endorsements</span>
        ) : (
          <span>No Endorsements</span>
        )}
      </span>
    );

    const positionsLabel = (
      <OverlayTrigger
        trigger="click"
        rootClose
        placement={this.props.popoverBottom ? 'bottom' : 'top'}
        overlay={positionsPopover}
      >
        <span className="network-positions-stacked__support-label u-cursor--pointer u-no-break">
          {endorsementsLabel}
          <span className="u-push--xs"><i className="fa fa-info-circle fa-md network-positions-stacked__info-icon-for-popover d-print-none" aria-hidden="true" /></span>
        </span>
      </OverlayTrigger>
    );

    return (
      <div className="network-positions-stacked">
        <div className="d-print-none network-positions-stacked__support-list u-flex u-justify-between u-items-center">
          {/* Click to scroll left through list Desktop */}
          { this.state.can_scroll_desktop && this.state.can_scroll_left_desktop ?
            <i className="fa fa-1x fa-chevron-left network-positions-stacked__support-list__scroll-icon network-positions-stacked__support-list__scroll-icon--small u-cursor--pointer d-none d-sm-block d-print-none" aria-hidden="true" onClick={this.scrollLeft.bind(this, 'desktop')} /> :
            <i className="fa fa-1x fa-chevron-left network-positions-stacked__support-list__scroll-icon--disabled-small d-none d-sm-block d-print-none" aria-hidden="true" />
          }
          {/* Click to scroll left through list Mobile */}
          { this.state.can_scroll_mobile && this.state.can_scroll_left_mobile ?
            <i className="fa fa-1x fa-chevron-left network-positions-stacked__support-list__scroll-icon network-positions-stacked__support-list__scroll-icon--small u-cursor--pointer d-block d-sm-none d-print-none" aria-hidden="true" onClick={this.scrollLeft.bind(this, 'mobile')} /> :
            <i className="fa fa-1x fa-chevron-left network-positions-stacked__support-list__scroll-icon--disabled-small d-block d-sm-none d-print-none" aria-hidden="true" />
          }
          <div className="network-positions-stacked__support-list__container-wrap">
            {/* Network Positions - Desktop */}
            <span
              ref={`${this.state.ballotItemWeVoteId}-org-list-desktop`}
              className="network-positions-stacked__support-list__container u-flex u-justify-between u-items-center u-inset__v--xs d-none d-sm-block"
            >
              <ul className="network-positions-stacked__support-list__items">
                <li className="network-positions-stacked__support-list__item">
                  { positionsLabel }
                  {/* Show a break-down of the current positions in your network - Desktop */}
                  <ItemTinyPositionBreakdownList
                    ballot_item_display_name={this.state.ballotItemDisplayName}
                    ballotItemWeVoteId={this.state.ballotItemWeVoteId}
                    currentBallotIdInUrl={this.props.currentBallotIdInUrl}
                    position_list={this.state.position_list_from_advisers_followed_by_voter}
                    showSupport
                    supportProps={this.state.supportProps}
                    visibility="desktop"
                    urlWithoutHash={this.props.urlWithoutHash}
                    we_vote_id={this.props.we_vote_id}
                  />
                  <ItemTinyPositionBreakdownList
                    ballot_item_display_name={this.state.ballotItemDisplayName}
                    ballotItemWeVoteId={this.state.ballotItemWeVoteId}
                    currentBallotIdInUrl={this.props.currentBallotIdInUrl}
                    position_list={this.state.position_list_from_advisers_followed_by_voter}
                    showOppose
                    supportProps={this.state.supportProps}
                    visibility="desktop"
                    urlWithoutHash={this.props.urlWithoutHash}
                    we_vote_id={this.props.we_vote_id}
                  />
                  {/* Show support positions the voter can follow Desktop, organizations_to_follow_support_desktop */}
                  <OrganizationsToDisplay
                    organizationsToFollow={this.state.organizationsToFollowSupport}
                    maximumOrganizationDisplay={organizationsToFollowSupportDesktopToShow}
                    ballotItemWeVoteId={this.state.ballotItemWeVoteId}
                    visibleTag="desktop"
                    supportsThisBallotItem
                    opposesThisBallotItem={false}
                    currentBallotIdInUrl={this.props.currentBallotIdInUrl}
                    urlWithoutHash={this.props.urlWithoutHash}
                    weVoteId={this.props.we_vote_id}
                  />
                  {/* Show oppose positions the voter can follow Desktop */}
                  <OrganizationsToDisplay
                    organizationsToFollow={this.state.organizationsToFollowOppose}
                    maximumOrganizationDisplay={organizationsToFollowOpposeDesktopToShow}
                    ballotItemWeVoteId={this.state.ballotItemWeVoteId}
                    visibleTag="desktop"
                    supportsThisBallotItem={false}
                    opposesThisBallotItem
                    currentBallotIdInUrl={this.props.currentBallotIdInUrl}
                    urlWithoutHash={this.props.urlWithoutHash}
                    weVoteId={this.props.we_vote_id}
                  />
                </li>
              </ul>
            </span>
            {/* Network Positions - Mobile */}
            <span
              ref={`${this.state.ballotItemWeVoteId}-org-list-mobile`}
              className="network-positions-stacked__support-list__container u-flex u-justify-between u-items-center u-inset__v--xs d-block d-sm-none"
            >
              <ul className="network-positions-stacked__support-list__items">
                <li className="network-positions-stacked__support-list__item">
                  { positionsLabel }
                  {/* Show a break-down of the current positions in your network - Mobile */}
                  <ItemTinyPositionBreakdownList
                    ballot_item_display_name={this.state.ballotItemDisplayName}
                    ballotItemWeVoteId={this.state.ballotItemWeVoteId}
                    currentBallotIdInUrl={this.props.currentBallotIdInUrl}
                    position_list={this.state.position_list_from_advisers_followed_by_voter}
                    showSupport
                    supportProps={this.state.supportProps}
                    visibility="mobile"
                    urlWithoutHash={this.props.urlWithoutHash}
                    we_vote_id={this.props.we_vote_id}
                  />
                  <ItemTinyPositionBreakdownList
                    ballot_item_display_name={this.state.ballotItemDisplayName}
                    ballotItemWeVoteId={this.state.ballotItemWeVoteId}
                    currentBallotIdInUrl={this.props.currentBallotIdInUrl}
                    position_list={this.state.position_list_from_advisers_followed_by_voter}
                    showOppose
                    supportProps={this.state.supportProps}
                    visibility="mobile"
                    urlWithoutHash={this.props.urlWithoutHash}
                    we_vote_id={this.props.we_vote_id}
                  />
                  {/* Show support positions the voter can follow Mobile */}
                  <OrganizationsToDisplay
                    organizationsToFollow={this.state.organizationsToFollowSupport}
                    maximumOrganizationDisplay={organizationsToFollowSupportMobileToShow}
                    ballotItemWeVoteId={this.state.ballotItemWeVoteId}
                    visibleTag="mobile"
                    supportsThisBallotItem
                    opposesThisBallotItem={false}
                    currentBallotIdInUrl={this.props.currentBallotIdInUrl}
                    urlWithoutHash={this.props.urlWithoutHash}
                    weVoteId={this.props.we_vote_id}
                  />
                  {/* Show oppose positions the voter can follow Mobile */}
                  <OrganizationsToDisplay
                    organizationsToFollow={this.state.organizationsToFollowOppose}
                    maximumOrganizationDisplay={organizationsToFollowOpposeMobileToShow}
                    ballotItemWeVoteId={this.state.ballotItemWeVoteId}
                    visibleTag="mobile"
                    supportsThisBallotItem={false}
                    opposesThisBallotItem
                    currentBallotIdInUrl={this.props.currentBallotIdInUrl}
                    urlWithoutHash={this.props.urlWithoutHash}
                    weVoteId={this.props.we_vote_id}
                  />
                </li>
              </ul>
            </span>
          </div>
          {/* Click to scroll right through list Desktop */}
          { this.state.can_scroll_desktop && this.state.can_scroll_right_desktop ?
            <i className="fa fa-1x fa-chevron-right network-positions-stacked__support-list__scroll-icon network-positions-stacked__support-list__scroll-icon--small u-cursor--pointer d-none d-sm-block d-print-none" aria-hidden="true" onClick={this.scrollRight.bind(this, 'desktop')} /> :
            <i className="fa fa-1x fa-chevron-right network-positions-stacked__support-list__scroll-icon--disabled d-none d-sm-block d-print-none" aria-hidden="true" />
          }
          {/* Click to scroll right through list Mobile */}
          { this.state.can_scroll_mobile && this.state.can_scroll_right_mobile ?
            <i className="fa fa-1x fa-chevron-right network-positions-stacked__support-list__scroll-icon network-positions-stacked__support-list__scroll-icon--small u-cursor--pointer d-block d-sm-none d-print-none" aria-hidden="true" onClick={this.scrollRight.bind(this, 'mobile')} /> :
            <i className="fa fa-1x fa-chevron-right network-positions-stacked__support-list__scroll-icon--disabled d-block d-sm-none d-print-none" aria-hidden="true" />
          }
        </div>

        {/* Issues that have a score related to this ballot item */}
        {this.props.showIssueList ? (
          <div className="o-media-object__body u-flex u-flex-column u-flex-auto u-justify-between u-padding-bottom--sm">
            <div>
              {/* We use this component to show the label showing number of endorsements */}
              <IssuesByBallotItemDisplayList
                ballotItemWeVoteId={this.state.ballotItemWeVoteId}
                endorsementsLabelHidden
                placement="bottom"
              />
            </div>
          </div>
        ) : null
        }

        <div className="network-positions-stacked__support">
          {/* Issue Score here */}
          { showIssueScore ? (
            <OverlayTrigger
              trigger="click"
              ref="issue-score-overlay"
              onExit={this.closeIssueScorePopover}
              rootClose
              placement={issuesPopoverPlacement}
              overlay={scoreFromYourIssuesPopover}
            >
              {/* If there is a Network Score, don't show Issue score in mobile */}
              <span className={showNetworkScore ?
                'network-positions-stacked__support-score u-cursor--pointer u-no-break d-none d-sm-block' :
                'network-positions-stacked__support-score u-cursor--pointer u-no-break'}
              >
                { voterIssuesScore === 0 ? (
                  <span className="u-margin-left--md">
                    { voterIssuesScoreWithSign }
                  </span>
                ) : (
                  <span className="u-margin-left--xs">
                    { voterIssuesScoreWithSign }
                  </span>
                )}
                <span className="network-positions-stacked__support-score-label">
                  <span>
                    Issue
                    <br />
                    Score
                  </span>
                  <span>
                    &nbsp;
                    <i className="fa fa-info-circle fa-md network-positions-stacked__info-icon-for-popover d-print-none" aria-hidden="true" />
                  </span>
                </span>
              </span>
            </OverlayTrigger>
          ) : null
          }

          {/* Network Score here */}
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
                <span className="network-positions-stacked__support-score-label">
                  <span className="d-block d-sm-none">
                    Network
                    <br />
                    Score
                    {' '}
                    <i className="fa fa-info-circle fa-md network-positions-stacked__info-icon-for-popover d-print-none" aria-hidden="true" />
                  </span>
                  <span className="d-none d-sm-block">
                    Score in
                    <br />
                    Your Network
                    {' '}
                    <i className="fa fa-info-circle fa-md network-positions-stacked__info-icon-for-popover d-print-none" aria-hidden="true" />
                  </span>
                </span>
              </span>
            </OverlayTrigger>
          ) : null
          }
          <span className="sr-only">
            {totalNetworkScore > 0 ? `${totalNetworkScore} Support` : null }
            {totalNetworkScore < 0 ? `${totalNetworkScore} Oppose` : null }
          </span>
        </div>

        <div className="network-positions-stacked__support">
          {/* Support/Oppose/Comment toggle here */}
          {itemActionBar}
        </div>
        { commentDisplayDesktop }
        { commentDisplayMobile }
      </div>
    );
  }
}
