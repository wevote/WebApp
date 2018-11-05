import React, { Component } from "react";
import PropTypes from "prop-types";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { findDOMNode } from "react-dom";
import BallotStore from "../../stores/BallotStore";
import $ from "jquery";
import CandidateActions from "../../actions/CandidateActions";
import CandidateStore from "../../stores/CandidateStore";
import {cordovaDot, isCordova} from "../../utils/cordovaUtils";
import IssuesByBallotItemDisplayList from "../../components/Issues/IssuesByBallotItemDisplayList";
import IssueStore from "../../stores/IssueStore";
import ItemActionBar from "../Widgets/ItemActionBar";
import ItemPositionStatementActionBar from "../Widgets/ItemPositionStatementActionBar";
import ItemTinyPositionBreakdownList from "../Position/ItemTinyPositionBreakdownList";
import { renderLog } from "../../utils/logging";
import MeasureActions from "../../actions/MeasureActions";
import MeasureStore from "../../stores/MeasureStore";
import OrganizationCard from "../VoterGuide/OrganizationCard";
import OrganizationTinyDisplay from "../VoterGuide/OrganizationTinyDisplay";
import SupportStore from "../../stores/SupportStore";
import { stringContains } from "../../utils/textFormat";
import VoterGuideStore from "../../stores/VoterGuideStore";
import VoterStore from "../../stores/VoterStore";

export default class ItemSupportOpposeRaccoon extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string,
    ballotItemWeVoteId: PropTypes.string,
    currentBallotIdInUrl: PropTypes.string,
    goToCandidate: PropTypes.func, // We don't require this because sometimes we don't want the link to do anything
    maximumOrganizationDisplay: PropTypes.number,
    organizationsToFollowSupport: PropTypes.array,
    organizationsToFollowOppose: PropTypes.array,
    popoverBottom: PropTypes.bool,
    positionBarIsClickable: PropTypes.bool,
    showIssueList: PropTypes.bool,
    showPositionStatementActionBar: PropTypes.bool,
    supportProps: PropTypes.object,
    urlWithoutHash: PropTypes.string,
    we_vote_id: PropTypes.string
  };

  constructor (props) {
    super(props);

    this.popover_state = {};
    this.mobile = "ontouchstart" in document.documentElement;

    this.state = {
      ballotItem: {},
      ballot_item_display_name: "",
      ballotItemType: "",
      ballotItemWeVoteId: "",
      can_scroll_desktop: false,
      can_scroll_mobile: false,
      can_scroll_left_desktop: false,
      can_scroll_left_mobile: false,
      can_scroll_right_desktop: true,
      can_scroll_right_mobile: true,
      componentDidMountFinished: false,
      showPositionStatement: false,
      shouldFocusCommentArea: false,
      maximum_organization_display: 0,
      organizations_to_follow_support: [],
      organizations_to_follow_oppose: [],
      position_list_from_advisers_followed_by_voter: [],
      supportProps: this.props.supportProps,
    };
    this.closePositionsPopover = this.closePositionsPopover.bind(this);
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
    let is_candidate = false;
    let is_measure = false;
    if (stringContains("cand", this.props.ballotItemWeVoteId)) {
      ballotItemType = "CANDIDATE";
      is_candidate = true;
    } else if (stringContains("meas", this.props.ballotItemWeVoteId)) {
      ballotItemType = "MEASURE";
      is_measure = true;
    }

    let ballotItem;
    let position_list_from_advisers_followed_by_voter;
    if (is_candidate) {
      if (!BallotStore.positionListHasBeenRetrievedOnce(this.props.ballotItemWeVoteId)) {
        CandidateActions.positionListForBallotItem(this.props.ballotItemWeVoteId);
      }
      ballotItem = CandidateStore.getCandidate(this.props.ballotItemWeVoteId);
      position_list_from_advisers_followed_by_voter = CandidateStore.getPositionList(this.props.ballotItemWeVoteId);
    } else if (is_measure) {
      if (!BallotStore.positionListHasBeenRetrievedOnce(this.props.ballotItemWeVoteId)) {
        MeasureActions.positionListForBallotItem(this.props.ballotItemWeVoteId);
      }
      ballotItem = MeasureStore.getMeasure(this.props.ballotItemWeVoteId);
      position_list_from_advisers_followed_by_voter = MeasureStore.getPositionList(this.props.ballotItemWeVoteId);
    }
    this.setScrollState();
    this.setState({
      ballotItem: ballotItem,
      ballot_item_display_name: this.props.ballot_item_display_name,
      ballotItemType: ballotItemType,
      ballotItemWeVoteId: this.props.ballotItemWeVoteId,
      componentDidMountFinished: true,
      is_candidate: is_candidate,
      is_measure: is_measure,
      maximum_organization_display: this.props.maximumOrganizationDisplay,
      organizations_to_follow_support: this.props.organizationsToFollowSupport,
      organizations_to_follow_oppose: this.props.organizationsToFollowOppose,
      position_list_from_advisers_followed_by_voter: position_list_from_advisers_followed_by_voter,
      supportProps: this.props.supportProps,
      voter: VoterStore.getVoter(), // We only set this once since the info we need isn't dynamic
    });
  }

  componentWillReceiveProps (nextProps) {
    let ballotItemType;
    let is_candidate = false;
    let is_measure = false;
    if (stringContains("cand", nextProps.ballotItemWeVoteId)) {
      ballotItemType = "CANDIDATE";
      is_candidate = true;
    } else if (stringContains("meas", nextProps.ballotItemWeVoteId)) {
      ballotItemType = "MEASURE";
      is_measure = true;
    }
    let ballotItem;
    let position_list_from_advisers_followed_by_voter;
    if (is_candidate) {
      // CandidateActions.positionListForBallotItem(nextProps.ballotItemWeVoteId);
      ballotItem = CandidateStore.getCandidate(nextProps.ballotItemWeVoteId);
      position_list_from_advisers_followed_by_voter = CandidateStore.getPositionList(nextProps.ballotItemWeVoteId);
    } else if (is_measure) {
      // MeasureActions.positionListForBallotItem(nextProps.ballotItemWeVoteId);
      ballotItem = MeasureStore.getMeasure(nextProps.ballotItemWeVoteId);
      position_list_from_advisers_followed_by_voter = MeasureStore.getPositionList(nextProps.ballotItemWeVoteId);
    }
    this.setScrollState();
    this.setState({
      ballotItem: ballotItem,
      ballot_item_display_name: nextProps.ballot_item_display_name,
      ballotItemType: ballotItemType,
      ballotItemWeVoteId: nextProps.ballotItemWeVoteId,
      is_candidate: is_candidate,
      is_measure: is_measure,
      maximum_organization_display: nextProps.maximumOrganizationDisplay,
      organizations_to_follow_support: nextProps.organizationsToFollowSupport,
      organizations_to_follow_oppose: nextProps.organizationsToFollowOppose,
      position_list_from_advisers_followed_by_voter: position_list_from_advisers_followed_by_voter,
      supportProps: nextProps.supportProps,
    });
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
    if (this.state.ballot_item_display_name !== nextState.ballot_item_display_name) {
      // console.log("shouldComponentUpdate: this.state.ballot_item_display_name", this.state.ballot_item_display_name, ", nextState.ballot_item_display_name", nextState.ballot_item_display_name);
      return true;
    }
    if (this.state.ballotItemWeVoteId !== nextState.ballotItemWeVoteId) {
      // console.log("shouldComponentUpdate: this.state.ballotItemWeVoteId", this.state.ballotItemWeVoteId, ", nextState.ballotItemWeVoteId", nextState.ballotItemWeVoteId);
      return true;
    }
    if (this.state.organizations_to_follow_support.length !== nextState.organizations_to_follow_support.length) {
      // console.log("shouldComponentUpdate: this.state.organizations_to_follow_support.length", this.state.organizations_to_follow_support.length, ", nextState.organizations_to_follow_support.length", nextState.organizations_to_follow_support.length);
      return true;
    }
    if (this.state.organizations_to_follow_oppose.length !== nextState.organizations_to_follow_oppose.length) {
      // console.log("shouldComponentUpdate: this.state.organizations_to_follow_oppose.length", this.state.organizations_to_follow_oppose.length, ", nextState.organizations_to_follow_oppose.length", nextState.organizations_to_follow_oppose.length);
      return true;
    }
    if (this.state.supportProps !== undefined && nextState.supportProps !== undefined) {
      let currentNetworkSupportCount = parseInt(this.state.supportProps.support_count) || 0;
      let nextNetworkSupportCount = parseInt(nextState.supportProps.support_count) || 0;
      let currentNetworkOpposeCount = parseInt(this.state.supportProps.oppose_count) || 0;
      let nextNetworkOpposeCount = parseInt(nextState.supportProps.oppose_count) || 0;
      if (currentNetworkSupportCount !== nextNetworkSupportCount || currentNetworkOpposeCount !== nextNetworkOpposeCount) {
        // console.log("shouldComponentUpdate: support or oppose count change");
        return true;
      }
    }
    if (this.props.showPositionStatementActionBar !== nextProps.showPositionStatementActionBar) {
      // console.log("shouldComponentUpdate: this.props.showPositionStatementActionBar change");
      return true;
    }
    if (this.state.showPositionStatement !== nextState.showPositionStatement) {
      // console.log("shouldComponentUpdate: this.state.showPositionStatement change");
      return true;
    }

    return false;
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.issueStoreListener.remove();
    this.measureStoreListener.remove();
  }

  goToCandidateLinkLocal () {
    // console.log("ItemSupportOpposeRaccoon goToCandidateLinkLocal");
    if (this.props.goToCandidate) {
      this.props.goToCandidate();
    }
  }

  onCandidateStoreChange () {
    this.setScrollState();
    if (this.state.is_candidate) {
      this.setState({
        ballotItem: CandidateStore.getCandidate(this.state.ballotItemWeVoteId),
        position_list_from_advisers_followed_by_voter: CandidateStore.getPositionList(this.state.ballotItemWeVoteId),
      });
    }
  }

  onMeasureStoreChange () {
    this.setScrollState();
    if (this.state.is_measure) {
      this.setState({
        ballotItem: MeasureStore.getMeasure(this.state.ballotItemWeVoteId),
        position_list_from_advisers_followed_by_voter: MeasureStore.getPositionList(this.state.ballotItemWeVoteId),
      });
    }
  }

  onIssueStoreChange () {
    // We want to re-render so issue data can update
    this.setState({
      forceReRender: true,
      voterIssuesScore: IssueStore.getIssuesScoreByBallotItemWeVoteId(this.state.ballotItemWeVoteId),
    });
  }

  onTriggerEnter (org_id, visible_tag) {
    if (this.refs[`cheetah-overlay-${org_id}-${visible_tag}`]) {
      this.refs[`cheetah-overlay-${org_id}-${visible_tag}`].show();
    }
    if (!this.popover_state[org_id]) {
      // If it wasn't created, create it now
      this.popover_state[org_id] = {show: false, timer: null};
    }
    clearTimeout(this.popover_state[org_id].timer);
    this.popover_state[org_id].show = true;
  }

  onTriggerLeave (org_id, visible_tag) {
    if (!this.popover_state[org_id]) {
      // If it wasn't created, create it now
      this.popover_state[org_id] = {show: false, timer: null};
    }
    this.popover_state[org_id].show = false;
    clearTimeout(this.popover_state[org_id].timer);
    this.popover_state[org_id].timer = setTimeout(() => {
      if (!this.popover_state[org_id].show) {
        if (this.refs[`cheetah-overlay-${org_id}-${visible_tag}`]) {
          this.refs[`cheetah-overlay-${org_id}-${visible_tag}`].hide();
        }
      }
    }, 100);
  }

  passDataBetweenItemActionToItemPosition () {
    this.setState({ shouldFocusCommentArea: true});
  }

  // This is used for organizations to Follow (not currently followed by the voter)
  organizationsToDisplay (organizations_to_follow, maximum_organization_display, ballotItemWeVoteId, visible_tag, supports_this_ballot_item = false, opposes_this_ballot_item = false) {
    if (!maximum_organization_display || maximum_organization_display === 0) {
      return [];
    }

    let local_counter = 0;
    // let orgs_not_shown_count = 0;
    // let orgs_not_shown_list = [];
    let one_organization_for_organization_card;
    // if (organizations_to_follow &&
    //   organizations_to_follow.length > maximum_organization_display) {
    //   orgs_not_shown_count = organizations_to_follow.length - maximum_organization_display;
    //   orgs_not_shown_list = organizations_to_follow.slice(maximum_organization_display);
    // }
    return organizations_to_follow.map( one_organization => {
      local_counter++;
      let org_id = one_organization.organization_we_vote_id;

      // Once we have more organizations than we want to show, put them into a drop-down
      if (local_counter <= maximum_organization_display) {
        one_organization_for_organization_card = {
            organization_we_vote_id: one_organization.organization_we_vote_id,
            organization_name: one_organization.voter_guide_display_name,
            organization_photo_url_large: one_organization.voter_guide_image_url_large,
            organization_photo_url_tiny: one_organization.voter_guide_image_url_tiny,
            organization_twitter_handle: one_organization.twitter_handle,
            // organization_website: one_organization.organization_website,
            twitter_description: one_organization.twitter_description,
            twitter_followers_count: one_organization.twitter_followers_count,
          };

        this.popover_state[org_id] = {show: false, timer: null};

        // Removed bsPrefix="card-popover"
        // onMouseOver={() => this.onTriggerEnter(org_id, visible_tag)}
        // onMouseOut={() => this.onTriggerLeave(org_id, visible_tag)}
        let organizationPopover = <Popover id={`organization-popover-${org_id}-${visible_tag}`}
                                           title={<span onClick={() => this.onTriggerLeave(org_id, visible_tag)}>&nbsp;
                                             <span className={`fa fa-times pull-right u-cursor--pointer ${isCordova() && "u-mobile-x"} `} aria-hidden="true" /> </span>}
                                           >
            <OrganizationCard ballotItemWeVoteId={ballotItemWeVoteId}
                              currentBallotIdInUrl={this.props.currentBallotIdInUrl}
                              followToggleOn
                              organization={one_organization_for_organization_card}
                              urlWithoutHash={this.props.urlWithoutHash}
                              we_vote_id={this.props.we_vote_id} />
          </Popover>;

        // Removed from OverlayTrigger
        // onMouseOver={() => this.onTriggerEnter(org_id, visible_tag)}
        // onMouseOut={() => this.onTriggerLeave(org_id, visible_tag)}
        // onExiting={() => this.onTriggerLeave(org_id, visible_tag)}
        // trigger={ visible_tag === "mobile" ? "click" : ["focus", "hover", "click"] }
        return <OverlayTrigger key={`trigger-${org_id}-${visible_tag}`}
                               ref={`cheetah-overlay-${org_id}-${visible_tag}`}
                               rootClose
                               placement="bottom"
                               trigger="click"
                               overlay={organizationPopover}>
          <span className="position-rating__source with-popover">
            <OrganizationTinyDisplay {...one_organization}
                                     currentBallotIdInUrl={this.props.currentBallotIdInUrl}
                                     showPlaceholderImage
                                     showSupport={supports_this_ballot_item}
                                     showOppose={opposes_this_ballot_item}
                                     toFollow
                                     urlWithoutHash={this.props.urlWithoutHash}
                                     we_vote_id={this.props.we_vote_id} />
          </span>
        </OverlayTrigger>;
      } else {
        return null;
      }
    });
  }

  closePositionsPopover () {
    document.body.click();
  }

  closeIssueScorePopover () {
    this.refs["issue-score-overlay"].hide();
  }

  closeNetworkScorePopover () {
    this.refs["network-score-overlay"].hide();
  }

  scrollLeft (visible_tag) {
    const element = findDOMNode(this.refs[`${this.state.ballotItemWeVoteId}-org-list-${visible_tag}`]);
    let position = $(element).scrollLeft();
    let width = Math.round($(element).width());
    $(element).animate({
      scrollLeft: position - width,
    }, 350, () => {
      let new_position = $(element).scrollLeft();
      if (visible_tag === "desktop") {
        this.setState({
          can_scroll_left_desktop: new_position > 0,
          can_scroll_right_desktop: true,
        });
      } else {
        this.setState({
          can_scroll_left_mobile: new_position > 0,
          can_scroll_right_mobile: true,
        });
      }
    });
  }

  scrollRight (visible_tag) {
    const element = findDOMNode(this.refs[`${this.state.ballotItemWeVoteId}-org-list-${visible_tag}`]);
    let position = $(element).scrollLeft();
    let width = Math.round($(element).width());
    $(element).animate({
      scrollLeft: position + width,
    }, 350, () => {
      let new_position = $(element).scrollLeft();
      if (visible_tag === "desktop") {
        this.setState({
          can_scroll_left_desktop: new_position > 0,
          can_scroll_right_desktop: position + width === new_position,
        });
      } else {
        this.setState({
          can_scroll_left_mobile: new_position > 0,
          can_scroll_right_mobile: position + width === new_position,
        });
      }
    });
  }

  setScrollState () {
    const desktop_list = findDOMNode(this.refs[`${this.state.ballotItemWeVoteId}-org-list-desktop`]);
    const mobile_list = findDOMNode(this.refs[`${this.state.ballotItemWeVoteId}-org-list-mobile`]);
    let desktop_list_visible_width = $(desktop_list).width();
    let desktop_list_width = $(desktop_list).children().eq(0).children().eq(0).width();
    let mobile_list_visible_width = $(mobile_list).width();
    let mobile_list_width = $(mobile_list).children().eq(0).children().eq(0).width();
    this.setState({
      can_scroll_desktop: desktop_list_visible_width <= desktop_list_width,
      can_scroll_mobile: mobile_list_visible_width <= mobile_list_width,
    });
  }

  togglePositionStatement () {
    this.setState({
      showPositionStatement: !this.state.showPositionStatement,
      shouldFocusCommentArea: true,
    });
  }

  render () {
    // console.log("ItemSupportOpposeRaccoon render, we_vote_id:", this.props.we_vote_id);
    renderLog(__filename);
    let ballotItemSupportStore = SupportStore.get(this.state.ballotItemWeVoteId);
    // Issue Score
    let voterIssuesScore = IssueStore.getIssuesScoreByBallotItemWeVoteId(this.state.ballotItemWeVoteId);
    let voterIssuesScoreWithSign;
    if (voterIssuesScore > 0) {
      voterIssuesScoreWithSign = "+" + voterIssuesScore;
    } else if (voterIssuesScore < 0) {
      voterIssuesScoreWithSign = voterIssuesScore;
    } else {
      voterIssuesScoreWithSign = voterIssuesScore;
    }
    // console.log("ItemSupportOpposeRaccoon, voterIssuesScore: ", voterIssuesScore, ", ballotItemWeVoteId: ", this.state.ballotItemWeVoteId);
    let issueCountUnderThisBallotItem = IssueStore.getIssuesCountUnderThisBallotItem(this.state.ballotItemWeVoteId);
    let issueCountUnderThisBallotItemVoterIsFollowing = IssueStore.getIssuesCountUnderThisBallotItemVoterIsFollowing(this.state.ballotItemWeVoteId);

    // Network Score
    let network_support_count = 0;
    let network_oppose_count = 0;
    let total_network_score = 0;
    let total_network_score_with_sign;
    if (this.state.supportProps !== undefined) {
      network_support_count = parseInt(this.state.supportProps.support_count) || 0;
      network_oppose_count = parseInt(this.state.supportProps.oppose_count) || 0;
      total_network_score = parseInt(network_support_count - network_oppose_count);
      if (total_network_score > 0) {
        total_network_score_with_sign = "+" + total_network_score;
      } else if (total_network_score < 0) {
        total_network_score_with_sign = total_network_score;
      } else {
        total_network_score_with_sign = total_network_score;
      }
    }

    let showIssueScore = true;
    if (voterIssuesScore === undefined) {
      showIssueScore = false;
    } else if (issueCountUnderThisBallotItem === 0 && voterIssuesScore === 0) {
      // There can't be an issue score because there aren't any issues tagged to organizations with a position on this candidate
      showIssueScore = false;
    } else if (total_network_score !== 0 && voterIssuesScore === 0) {
      // We show the network score when there isn't a network score and there is a voterIssuesScore
      showIssueScore = false;
    }

    let showNetworkScore = true;
    if (voterIssuesScore !== 0 && total_network_score === 0) {
      // There is an issue score, and the total Network Score is 0, so don't show Network score
      showNetworkScore = false;
    } else if (voterIssuesScore === 0 && network_support_count === 0 && network_oppose_count === 0) {
      // There is NOT an issue score, and BOTH network_support and network_oppose must be zero to hide Network Score
      showNetworkScore = false;
    }

    // Voter Support or opposition
    let is_voter_support = false;
    let is_voter_oppose = false;
    let voter_statement_text = false;
    if (ballotItemSupportStore !== undefined) {
      // console.log("ballotItemSupportStore: ", ballotItemSupportStore);
      is_voter_support = ballotItemSupportStore.is_support;
      is_voter_oppose = ballotItemSupportStore.is_oppose;
      voter_statement_text = ballotItemSupportStore.voter_statement_text;
    }

    let commentBoxIsVisible = false;
    if (this.props.showPositionStatementActionBar || is_voter_support || is_voter_oppose || voter_statement_text || this.state.showPositionStatement) {
      commentBoxIsVisible = true;
    }
    let item_action_bar;
    item_action_bar = <span>
      <ItemActionBar ballot_item_display_name={this.state.ballot_item_display_name}
                     ballot_item_we_vote_id={this.state.ballotItemWeVoteId}
                     commentButtonHide={commentBoxIsVisible}
                     commentButtonHideInMobile
                     currentBallotIdInUrl={this.props.currentBallotIdInUrl}
                     shareButtonHide
                     supportProps={ballotItemSupportStore}
                     supportOrOpposeHasBeenClicked={this.passDataBetweenItemActionToItemPosition}
                     toggleFunction={this.togglePositionStatement.bind(this)}
                     transitioning={this.state.transitioning}
                     type={this.state.ballotItemType}
                     urlWithoutHash={this.props.urlWithoutHash}
                     we_vote_id={this.props.we_vote_id} />
    </span>;

    let comment_display_raccoon_desktop = this.props.showPositionStatementActionBar || is_voter_support || is_voter_oppose || voter_statement_text || this.state.showPositionStatement ?
      <div className="d-none d-sm-block o-media-object u-flex-auto u-min-50 u-push--sm u-stack--sm">
        <div className="o-media-object__body u-flex u-flex-column u-flex-auto u-justify-between">
          <ItemPositionStatementActionBar ballot_item_we_vote_id={this.state.ballotItemWeVoteId}
                                          ballot_item_display_name={this.state.ballot_item_display_name}
                                          comment_edit_mode_on={this.state.showPositionStatement}
                                          supportProps={ballotItemSupportStore}
                                          shouldFocus={this.state.shouldFocusCommentArea}
                                          transitioning={this.state.transitioning}
                                          type={this.state.ballotItemType}
                                          shown_in_list />
        </div>
      </div> :
      null;

    let comment_display_raccoon_mobile = this.props.showPositionStatementActionBar || is_voter_support || is_voter_oppose || voter_statement_text ?
      <div className="d-block d-sm-none o-media-object u-flex-auto u-min-50 u-push--sm u-stack--sm">
        <div className="o-media-object__body u-flex u-flex-column u-flex-auto u-justify-between">
          <ItemPositionStatementActionBar ballot_item_we_vote_id={this.state.ballotItemWeVoteId}
                                          ballot_item_display_name={this.state.ballot_item_display_name}
                                          supportProps={ballotItemSupportStore}
                                          shouldFocus={this.state.shouldFocusCommentArea}
                                          transitioning={this.state.transitioning}
                                          type={this.state.ballotItemType}
                                          shown_in_list />
        </div>
      </div> :
      null;

    let positions_count = network_support_count + network_oppose_count + this.state.organizations_to_follow_support.length + this.state.organizations_to_follow_oppose.length;
    let maximum_organizations_to_show_desktop = 50;
    let maximum_organizations_to_show_mobile = 50;

    let organizations_to_follow_support_desktop = [];
    let organizations_to_follow_support_mobile = [];
    let organizations_to_follow_oppose_desktop = [];
    let organizations_to_follow_oppose_mobile = [];

    // console.log("this.state.position_list_from_advisers_followed_by_voter: ", this.state.position_list_from_advisers_followed_by_voter);
    if (positions_count) {
      let support_positions_list_count = 0;
      let oppose_positions_list_count = 0;
      // let info_only_positions_list_count = 0;
      this.state.position_list_from_advisers_followed_by_voter.map( one_position => {
        // console.log("one_position: ", one_position);
        // Filter out the positions that we don't want to display
        if (one_position.is_support_or_positive_rating) {
          support_positions_list_count++;
        } else if (one_position.is_oppose_or_negative_rating) {
          oppose_positions_list_count++;
        } // else if (!one_position.is_support_or_positive_rating && !one_position.is_oppose_or_negative_rating) {
        //   info_only_positions_list_count++;
        // }
      });
      // console.log("support_positions_list_count:", support_positions_list_count);

      // We calculate how many organizations_to_follow based on the number of positions from advisers we follow
      const offset_for_more_text = 3;
      let organizations_to_follow_support_desktop_to_show = maximum_organizations_to_show_desktop - support_positions_list_count - offset_for_more_text;
      organizations_to_follow_support_desktop_to_show = organizations_to_follow_support_desktop_to_show >= 0 ? organizations_to_follow_support_desktop_to_show : 0;
      let organizations_to_follow_support_mobile_to_show = maximum_organizations_to_show_mobile - support_positions_list_count - offset_for_more_text;
      organizations_to_follow_support_mobile_to_show = organizations_to_follow_support_mobile_to_show >= 0 ? organizations_to_follow_support_mobile_to_show : 0;
      let organizations_to_follow_oppose_desktop_to_show = maximum_organizations_to_show_desktop - oppose_positions_list_count - offset_for_more_text;
      organizations_to_follow_oppose_desktop_to_show = organizations_to_follow_oppose_desktop_to_show >= 0 ? organizations_to_follow_oppose_desktop_to_show : 0;
      let organizations_to_follow_oppose_mobile_to_show = maximum_organizations_to_show_mobile - oppose_positions_list_count - offset_for_more_text;
      organizations_to_follow_oppose_mobile_to_show = organizations_to_follow_oppose_mobile_to_show >= 0 ? organizations_to_follow_oppose_mobile_to_show : 0;

      //console.log("organizations_to_follow_support_mobile_to_show:", organizations_to_follow_support_mobile_to_show);

      organizations_to_follow_support_desktop = this.organizationsToDisplay(this.state.organizations_to_follow_support, organizations_to_follow_support_desktop_to_show, this.state.ballotItemWeVoteId, "desktop", true, false);
      organizations_to_follow_support_mobile = this.organizationsToDisplay(this.state.organizations_to_follow_support, organizations_to_follow_support_mobile_to_show, this.state.ballotItemWeVoteId, "mobile", true, false);
      organizations_to_follow_oppose_desktop = this.organizationsToDisplay(this.state.organizations_to_follow_oppose, organizations_to_follow_oppose_desktop_to_show, this.state.ballotItemWeVoteId, "desktop", false, true);
      organizations_to_follow_oppose_mobile = this.organizationsToDisplay(this.state.organizations_to_follow_oppose, organizations_to_follow_oppose_mobile_to_show, this.state.ballotItemWeVoteId, "mobile", false, true);
    }

    let scoreFromYourIssuesPopover;
    let scoreInYourNetworkPopover;
    let issuesPopoverPlacement = "top";
    let advisorsThatMakeVoterIssuesScoreDisplay;
    let advisorsThatMakeVoterIssuesScoreCount = 0;
    if (issueCountUnderThisBallotItemVoterIsFollowing) {
      // If there are issues the voter is following, we should attempt to to create a list of orgs that support or oppose this ballot item
      let organizationNameIssueSupportList = IssueStore.getOrganizationNameSupportListUnderThisBallotItem(this.state.ballotItemWeVoteId);
      let organizationNameIssueSupportListDisplay = organizationNameIssueSupportList.map( organization_name => {
        return <span key={organization_name} className="u-flex u-flex-row u-justify-start u-items-start"><img src={cordovaDot("/img/global/icons/thumbs-up-color-icon.svg")} width="20" height="20" /><span>&nbsp;</span><span>{organization_name} <strong>+1</strong></span></span>;
      });
      let organizationNameIssueOpposeList = IssueStore.getOrganizationNameOpposeListUnderThisBallotItem(this.state.ballotItemWeVoteId);
      let organizationNameIssueOpposeListDisplay = organizationNameIssueOpposeList.map( organization_name => {
        return <span key={organization_name} className="u-flex u-flex-row u-justify-start u-items-start"><img src={cordovaDot("/img/global/icons/thumbs-down-color-icon.svg")} width="20" height="20" /><span>&nbsp;</span><span>{organization_name} <strong>-1</strong></span></span>;
      });
      advisorsThatMakeVoterIssuesScoreDisplay = <span>
        { organizationNameIssueSupportList.length ? <span>{organizationNameIssueSupportListDisplay}</span> : null}
        { organizationNameIssueOpposeList.length ? <span>{organizationNameIssueOpposeListDisplay}</span> : null}
      </span>;
      advisorsThatMakeVoterIssuesScoreCount = organizationNameIssueSupportList.length + organizationNameIssueOpposeList.length;
    }
    if (showIssueScore) {
      // If here, we know this Ballot item has at least one related issue
      if (advisorsThatMakeVoterIssuesScoreCount > 0) {
        // There is a voterIssuesScore, and we have some advisers to display
        // Removed bsPrefix="card-popover"
        scoreFromYourIssuesPopover =
          <Popover id="score-popover-trigger-click-root-close"
                   title={<span>Issue Score <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" /></span>}
                   onClick={this.closeIssueScorePopover}>
            We've added up the opinions about {this.state.ballot_item_display_name} from all the organizations tagged with your issues:
            {advisorsThatMakeVoterIssuesScoreDisplay}
          </Popover>;
        issuesPopoverPlacement = "bottom";
      } else if (!issueCountUnderThisBallotItem ) {
        // At this point the Issue Score is showing, but the issues haven't loaded yet
        // Removed bsPrefix="card-popover"
        scoreFromYourIssuesPopover =
          <Popover id="score-popover-trigger-click-root-close"
                   title={<span>Issue Score <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" /></span>}
                   onClick={this.closeIssueScorePopover}>
            We've added up the opinions about {this.state.ballot_item_display_name} from all the organizations tagged with your issues. Loading issues now...
          </Popover>;
        issuesPopoverPlacement = "top";
      } else if (issueCountUnderThisBallotItemVoterIsFollowing === 0) {
        // Voter isn't following any Issues related to this ballot item, or none that contribute to the Issues score.
        // Encourage voter to follow Issues
        // Removed bsPrefix="card-popover"
        scoreFromYourIssuesPopover =
          <Popover id="score-popover-trigger-click-root-close"
                   title={<span>Issue Score <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" /></span>}
                   onClick={this.closeIssueScorePopover}>
            Follow <strong><img src={cordovaDot("/img/global/svg-icons/issues-v1-64x42.svg")}
                                width="24px"/> Issues</strong> to get a personalized <strong>Score</strong> for {this.state.ballot_item_display_name}.
            We add up the opinions from all organizations tagged with your issues. Whew, that's a mouthful!
          </Popover>;
        issuesPopoverPlacement = "top";
      } else {
        // There is a voterIssuesScore, and we have some advisers to display
        // Removed bsPrefix="card-popover"
        scoreFromYourIssuesPopover =
          <Popover id="score-popover-trigger-click-root-close"
                   title={<span>Issue Score <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" /></span>}
                   onClick={this.closeIssueScorePopover}>
            We've added up the opinions about {this.state.ballot_item_display_name} from all the organizations tagged with your issues:
            {advisorsThatMakeVoterIssuesScoreDisplay}
          </Popover>;
        issuesPopoverPlacement = "bottom";
      }
    }

    // If there are issues the voter is following, we should attempt to to create a list of orgs that support or oppose this ballot item
    let nameNetworkSupportList = SupportStore.getNameSupportListUnderThisBallotItem(this.state.ballotItemWeVoteId);
    let nameNetworkSupportListDisplay = nameNetworkSupportList.map( speaker_display_name => {
      return <span key={speaker_display_name} className="u-flex u-flex-row u-justify-start u-items-start"><img src={cordovaDot("/img/global/icons/thumbs-up-color-icon.svg")} width="20" height="20" /><span>&nbsp;</span><span>{speaker_display_name} <strong>+1</strong></span></span>;
    });
    let nameNetworkOpposeList = SupportStore.getNameOpposeListUnderThisBallotItem(this.state.ballotItemWeVoteId);
    let nameNetworkOpposeListDisplay = nameNetworkOpposeList.map( speaker_display_name => {
      return <span key={speaker_display_name} className="u-flex u-flex-row u-justify-start u-items-start"><img src={cordovaDot("/img/global/icons/thumbs-down-color-icon.svg")} width="20" height="20" /><span>&nbsp;</span><span>{speaker_display_name} <strong>-1</strong></span></span>;
    });
    let advisorsThatMakeVoterNetworkScoreDisplay = <span>
      { nameNetworkSupportList.length ? <span>{nameNetworkSupportListDisplay}</span> : null}
      { nameNetworkOpposeList.length ? <span>{nameNetworkOpposeListDisplay}</span> : null}
    </span>;
    let advisorsThatMakeVoterNetworkScoreCount = nameNetworkSupportList.length + nameNetworkOpposeList.length;

    if (advisorsThatMakeVoterNetworkScoreCount > 0) {
      scoreInYourNetworkPopover =
        <Popover id="score-popover-trigger-click-root-close"
                 title={<span>Score in Your Network <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" /></span>}
                 onClick={this.closeNetworkScorePopover}>
          These friends or organizations support or oppose <strong>{this.state.ballot_item_display_name}</strong>:<br />
          {advisorsThatMakeVoterNetworkScoreDisplay}
        </Popover>;

    } else {
      scoreInYourNetworkPopover =
        <Popover id="score-popover-trigger-click-root-close"
                 title={<span>Score in Your Network <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" /></span>}
                 onClick={this.closeNetworkScorePopover}>
          Your friends, and the organizations you listen to, are <strong>Your Network</strong>.
          Everyone in your network
          that <span className="u-no-break"> <img src={cordovaDot("/img/global/icons/thumbs-up-color-icon.svg")}
                                                  width="20"
                                                  height="20"/> supports</span> {this.state.ballot_item_display_name}
          adds
          +1 to this <strong>Score</strong>.
          Each one that <span className="u-no-break"><img
          src={cordovaDot("/img/global/icons/thumbs-down-color-icon.svg")}
          width="20" height="20"/> opposes</span> subtracts
          1 from this <strong>Score</strong>. <strong>Listen</strong> to an
          organization to add their opinion to your personalized <strong>Score</strong>.
        </Popover>;
    }

    let voter_decided_item = this.state.supportProps && this.state.voter &&
    (this.state.supportProps.is_support || this.state.supportProps.is_oppose);

    // Removed bsPrefix="card-popover"
    const positionsPopover = positions_count > 1 || positions_count && !voter_decided_item ?
      <Popover id="positions-popover-trigger-click-root-close"
               title={<span className="u-f4 u-no-break">Opinions{this.state.ballot_item_display_name ? " about " + this.state.ballot_item_display_name : ""} <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" /></span>}
               onClick={this.closePositionsPopover}
               >
        These organizations <span className="u-no-break"><img src={cordovaDot("/img/global/icons/thumbs-up-color-icon.svg")}
                                               width="20" height="20" /> support</span> or&nbsp;
        <span className="u-no-break"><img src={cordovaDot("/img/global/icons/thumbs-down-color-icon.svg")}
                                               width="20" height="20" /> oppose</span>{this.state.ballot_item_display_name ? " " + this.state.ballot_item_display_name : ""}.
        Click on the logo
        and <strong>Listen</strong> to an organization to add their opinion to your personalized <strong>Score</strong>.
      </Popover> :
      positions_count && voter_decided_item ?
      <Popover id="positions-popover-trigger-click-root-close"
               title={<span className="u-f4 u-no-break">Opinions{this.state.ballot_item_display_name ? " about " + this.state.ballot_item_display_name : ""} <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" /></span>}
               onClick={this.closePositionsPopover}
               >
        You have the only opinion{this.state.ballot_item_display_name ? " about " + this.state.ballot_item_display_name : ""} so far.
      </Popover> :
      <Popover id="positions-popover-trigger-click-root-close"
               title={<span className="u-f4 u-no-break">Opinions{this.state.ballot_item_display_name ? " about " + this.state.ballot_item_display_name : ""} <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" /></span>}
               onClick={this.closePositionsPopover}
               >
        There are no opinions{this.state.ballot_item_display_name ? " about " + this.state.ballot_item_display_name : ""} yet.
      </Popover>;

    let ballotItemSupportProps = SupportStore.get(this.state.ballotItemWeVoteId);
    let networkSupportCount = 0;
    let networkOpposeCount = 0;
    if (ballotItemSupportProps !== undefined) {
      networkSupportCount = ballotItemSupportProps.support_count ? parseInt(ballotItemSupportProps.support_count || 0) : 0;
      networkOpposeCount = ballotItemSupportProps.oppose_count ? parseInt(ballotItemSupportProps.oppose_count || 0) : 0;
    }
    let organizationsToFollowSupport = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdSupports(this.state.ballotItemWeVoteId);
    let organizationsToFollowOppose = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdOpposes(this.state.ballotItemWeVoteId);
    let totalSupportCount = networkSupportCount + organizationsToFollowSupport.length;
    let totalOpposeCount = networkOpposeCount + organizationsToFollowOppose.length;

    const endorsementsLabel = <span className="issues-list-stacked__support-label u-cursor--pointer u-no-break">
                  <span className="u-push--xs">
                    { totalSupportCount ?
                      <span className="u-no-break u-push--xs issue-icon-list__endorsements-label"><img
                        src={cordovaDot("/img/global/icons/thumbs-up-color-icon.svg")}
                        width="20" height="20"/> {totalSupportCount}</span> :
                      null
                    }
                    { totalOpposeCount ?
                      <span className="u-no-break u-push--xs issue-icon-list__endorsements-label"><img
                        src={cordovaDot("/img/global/icons/thumbs-down-color-icon.svg")}
                        width="20" height="20"/> {totalOpposeCount}</span> :
                      null
                    }
                    { totalSupportCount || totalOpposeCount ?
                      <span className="issue-icon-list__endorsements-label">Endorsements</span> :
                      <span className="issue-icon-list__endorsements-label">No Endorsements</span>
                    }
                  </span>
                </span>;

    const positionsLabel =
      <OverlayTrigger trigger="click"
                      rootClose
                      placement={this.props.popoverBottom ? "bottom" : "top"}
                      overlay={positionsPopover}
                      >
        <span className="network-positions-stacked__support-label u-cursor--pointer u-no-break">
          <span>{endorsementsLabel}</span>
          <span className="u-push--xs"><i className="fa fa-info-circle fa-md network-positions-stacked__info-icon-for-popover d-print-none" aria-hidden="true" /></span>
        </span>
      </OverlayTrigger>;

    return <div className="network-positions-stacked">
      <div className="d-print-none network-positions-stacked__support-list u-flex u-justify-between u-items-center">
        {/* Click to scroll left through list Desktop */}
        { this.state.can_scroll_desktop && this.state.can_scroll_left_desktop ?
          <i className="fa fa-1x fa-chevron-left network-positions-stacked__support-list__scroll-icon network-positions-stacked__support-list__scroll-icon--small u-cursor--pointer d-none d-sm-block d-print-none" aria-hidden="true" onClick={this.scrollLeft.bind(this, "desktop")} /> :
          <i className="fa fa-1x fa-chevron-left network-positions-stacked__support-list__scroll-icon--disabled-small d-none d-sm-block d-print-none" aria-hidden="true" />
        }
        {/* Click to scroll left through list Mobile */}
        { this.state.can_scroll_mobile && this.state.can_scroll_left_mobile ?
          <i className="fa fa-1x fa-chevron-left network-positions-stacked__support-list__scroll-icon network-positions-stacked__support-list__scroll-icon--small u-cursor--pointer d-block d-sm-none d-print-none" aria-hidden="true" onClick={this.scrollLeft.bind(this, "mobile")} /> :
          <i className="fa fa-1x fa-chevron-left network-positions-stacked__support-list__scroll-icon--disabled-small d-block d-sm-none d-print-none" aria-hidden="true" />
        }
        <div className="network-positions-stacked__support-list__container-wrap">
          {/* Network Positions - Desktop */}
          <span ref={`${this.state.ballotItemWeVoteId}-org-list-desktop`}
                className="network-positions-stacked__support-list__container u-flex u-justify-between u-items-center u-inset__v--xs d-none d-sm-block">
            <ul className="network-positions-stacked__support-list__items">
              <li className="network-positions-stacked__support-list__item">
                { positionsLabel }
                {/* Show a break-down of the current positions in your network - Desktop */}
                <ItemTinyPositionBreakdownList ballot_item_display_name={this.state.ballot_item_display_name}
                                               ballotItemWeVoteId={this.state.ballotItemWeVoteId}
                                               currentBallotIdInUrl={this.props.currentBallotIdInUrl}
                                               position_list={this.state.position_list_from_advisers_followed_by_voter}
                                               showSupport
                                               supportProps={this.state.supportProps}
                                               visibility="desktop"
                                               urlWithoutHash={this.props.urlWithoutHash}
                                               we_vote_id={this.props.we_vote_id}
                                                />
                <ItemTinyPositionBreakdownList ballot_item_display_name={this.state.ballot_item_display_name}
                                               ballotItemWeVoteId={this.state.ballotItemWeVoteId}
                                               currentBallotIdInUrl={this.props.currentBallotIdInUrl}
                                               position_list={this.state.position_list_from_advisers_followed_by_voter}
                                               showOppose
                                               supportProps={this.state.supportProps}
                                               visibility="desktop"
                                               urlWithoutHash={this.props.urlWithoutHash}
                                               we_vote_id={this.props.we_vote_id}
                                                />
                {/* Show support positions the voter can follow Desktop */}
                { organizations_to_follow_support_desktop.length ? organizations_to_follow_support_desktop : null }
                {/* Show oppose positions the voter can follow Desktop */}
                { organizations_to_follow_oppose_desktop.length ? organizations_to_follow_oppose_desktop : null }
              </li>
            </ul>
          </span>
          {/* Network Positions - Mobile */}
          <span ref={`${this.state.ballotItemWeVoteId}-org-list-mobile`}
                className="network-positions-stacked__support-list__container u-flex u-justify-between u-items-center u-inset__v--xs d-block d-sm-none">
            <ul className="network-positions-stacked__support-list__items">
              <li className="network-positions-stacked__support-list__item">
                { positionsLabel }
                {/* Show a break-down of the current positions in your network - Mobile */}
                <ItemTinyPositionBreakdownList ballot_item_display_name={this.state.ballot_item_display_name}
                                               ballotItemWeVoteId={this.state.ballotItemWeVoteId}
                                               currentBallotIdInUrl={this.props.currentBallotIdInUrl}
                                               position_list={this.state.position_list_from_advisers_followed_by_voter}
                                               showSupport
                                               supportProps={this.state.supportProps}
                                               visibility="mobile"
                                               urlWithoutHash={this.props.urlWithoutHash}
                                               we_vote_id={this.props.we_vote_id}
                                                />
                <ItemTinyPositionBreakdownList ballot_item_display_name={this.state.ballot_item_display_name}
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
                { organizations_to_follow_support_mobile.length ? organizations_to_follow_support_mobile : null }
                {/* Show oppose positions the voter can follow Mobile */}
                { organizations_to_follow_oppose_mobile.length ? organizations_to_follow_oppose_mobile : null }
              </li>
            </ul>
          </span>
        </div>
        {/* Click to scroll right through list Desktop */}
        { this.state.can_scroll_desktop && this.state.can_scroll_right_desktop ?
          <i className="fa fa-1x fa-chevron-right network-positions-stacked__support-list__scroll-icon network-positions-stacked__support-list__scroll-icon--small u-cursor--pointer d-none d-sm-block d-print-none" aria-hidden="true" onClick={this.scrollRight.bind(this, "desktop")} /> :
          <i className="fa fa-1x fa-chevron-right network-positions-stacked__support-list__scroll-icon--disabled d-none d-sm-block d-print-none" aria-hidden="true" />
        }
        {/* Click to scroll right through list Mobile */}
        { this.state.can_scroll_mobile && this.state.can_scroll_right_mobile ?
          <i className="fa fa-1x fa-chevron-right network-positions-stacked__support-list__scroll-icon network-positions-stacked__support-list__scroll-icon--small u-cursor--pointer d-block d-sm-none d-print-none" aria-hidden="true" onClick={this.scrollRight.bind(this, "mobile")} /> :
          <i className="fa fa-1x fa-chevron-right network-positions-stacked__support-list__scroll-icon--disabled d-block d-sm-none d-print-none" aria-hidden="true" />
        }
      </div>

      {/* Issues that have a score related to this ballot item */}
      { this.props.showIssueList ?
        <div className="o-media-object__body u-flex u-flex-column u-flex-auto u-justify-between u-padding-bottom--sm">
          <div>
            {/* We use this component to show the label showing number of endorsements */}
            <IssuesByBallotItemDisplayList ballotItemDisplayName={this.state.ballot_item_display_name}
                                           ballotItemWeVoteId={this.state.ballotItemWeVoteId}
                                           currentBallotIdInUrl={this.props.currentBallotIdInUrl}
                                           endorsementsLabelHidden
                                           overlayTriggerOnClickOnly
                                           placement={"bottom"}
                                           urlWithoutHash={this.props.urlWithoutHash}
                                           />
          </div>
        </div> :
        null
      }

      <div className="network-positions-stacked__support">
        {/* Issue Score here */}
        { showIssueScore ?
          <OverlayTrigger trigger="click"
                          ref="issue-score-overlay"
                          onExit={this.closeIssueScorePopover}
                          rootClose
                          placement={issuesPopoverPlacement}
                          overlay={scoreFromYourIssuesPopover}>
            {/* If there is a Network Score, don't show Issue score in mobile */}
            <span className={ showNetworkScore ?
                              "network-positions-stacked__support-score u-cursor--pointer u-no-break d-none d-sm-block" :
                              "network-positions-stacked__support-score u-cursor--pointer u-no-break" }>
              { voterIssuesScore === 0 ?
                <span className="u-margin-left--md">{ voterIssuesScoreWithSign }&nbsp;</span> :
                <span className="u-margin-left--xs">{ voterIssuesScoreWithSign }&nbsp;</span>
              }
              <span className="network-positions-stacked__support-score-label">
                <span>Issue<br />Score</span>
                <span>&nbsp;<i className="fa fa-info-circle fa-md network-positions-stacked__info-icon-for-popover d-print-none" aria-hidden="true" />&nbsp;</span>
              </span>
            </span>
          </OverlayTrigger> :
          null
        }

        {/* Network Score here */}
        { showNetworkScore ?
          <OverlayTrigger trigger="click"
                          ref="network-score-overlay"
                          onExit={this.closeNetworkScorePopover}
                          rootClose
                          placement={this.props.popoverBottom ? "bottom" : "top"}
                          overlay={scoreInYourNetworkPopover}>
            <span className="network-positions-stacked__support-score u-cursor--pointer u-no-break">
              { total_network_score === 0 ?
                <span className="u-margin-left--md">{ total_network_score_with_sign }&nbsp;</span> :
                <span className="u-margin-left--xs">{ total_network_score_with_sign }&nbsp;</span>
              }
              <span className="network-positions-stacked__support-score-label">
                <span className="d-block d-sm-none">Network<br />
                  Score <i className="fa fa-info-circle fa-md network-positions-stacked__info-icon-for-popover d-print-none" aria-hidden="true" /></span>
                <span className="d-none d-sm-block">Score in<br />
                  Your Network <i className="fa fa-info-circle fa-md network-positions-stacked__info-icon-for-popover d-print-none" aria-hidden="true" /></span>
              </span>
            </span>
          </OverlayTrigger> :
          null
        }
        <span className="sr-only">
          {total_network_score > 0 ? total_network_score + " Support" : null }
          {total_network_score < 0 ? total_network_score + " Oppose" : null }
        </span>
      </div>

      <div className="network-positions-stacked__support">
        {/* Support/Oppose/Comment toggle here */}
        {item_action_bar}
      </div>
      { comment_display_raccoon_desktop }
      { comment_display_raccoon_mobile }
    </div>;
  }
}
