import React, { Component, PropTypes } from "react";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import CandidateActions from "../../actions/CandidateActions";
import CandidateStore from "../../stores/CandidateStore";
import ItemActionBar from "../Widgets/ItemActionBar";
import ItemTinyPositionBreakdownList from "../Position/ItemTinyPositionBreakdownList";
import OrganizationCard from "../VoterGuide/OrganizationCard";
import OrganizationTinyDisplay from "../VoterGuide/OrganizationTinyDisplay";
import SupportStore from "../../stores/SupportStore";

export default class ItemSupportOpposeRaccoon extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string,
    ballotItemWeVoteId: PropTypes.string,
    goToCandidate: PropTypes.func, // We don't require this because sometimes we don't want the link to do anything
    maximumOrganizationDisplay: PropTypes.number,
    organizationsToFollowSupport: PropTypes.array,
    organizationsToFollowOppose: PropTypes.array,
    positionBarIsClickable: PropTypes.bool,
    supportProps: PropTypes.object,
  };

  constructor (props) {
    super(props);

    this.popover_state = {};
    this.mobile = "ontouchstart" in document.documentElement;

    this.state = {
      ballot_item_display_name: "",
      ballot_item_we_vote_id: "",
      candidate: {},
      maximum_organization_display: 0,
      organizations_to_follow_support: [],
      organizations_to_follow_oppose: [],
      position_list_from_advisers_followed_by_voter: [],
      supportProps: this.props.supportProps,
    };
    this.closePositionsPopover = this.closePositionsPopover.bind(this);
    this.closeScorePopover = this.closeScorePopover.bind(this);
    this.goToCandidateLinkLocal = this.goToCandidateLinkLocal.bind(this);
  }

  componentDidMount () {
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    CandidateActions.positionListForBallotItem(this.props.ballotItemWeVoteId);
    this.setState({
      ballot_item_display_name: this.props.ballot_item_display_name,
      ballot_item_we_vote_id: this.props.ballotItemWeVoteId,
      candidate: CandidateStore.getCandidate(this.props.ballotItemWeVoteId),
      maximum_organization_display: this.props.maximumOrganizationDisplay,
      organizations_to_follow_support: this.props.organizationsToFollowSupport,
      organizations_to_follow_oppose: this.props.organizationsToFollowOppose,
      position_list_from_advisers_followed_by_voter: CandidateStore.getPositionList(this.props.ballotItemWeVoteId),
      supportProps: this.props.supportProps,
    });
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      ballot_item_display_name: nextProps.ballot_item_display_name,
      ballot_item_we_vote_id: nextProps.ballotItemWeVoteId,
      candidate: CandidateStore.getCandidate(nextProps.ballotItemWeVoteId),
      maximum_organization_display: nextProps.maximumOrganizationDisplay,
      organizations_to_follow_support: nextProps.organizationsToFollowSupport,
      organizations_to_follow_oppose: nextProps.organizationsToFollowOppose,
      position_list_from_advisers_followed_by_voter: CandidateStore.getPositionList(nextProps.ballotItemWeVoteId),
      supportProps: nextProps.supportProps,
    });
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
  }

  goToCandidateLinkLocal () {
    // console.log("ItemSupportOpposeRaccoon goToCandidateLinkLocal");
    if (this.props.goToCandidate) {
      this.props.goToCandidate();
    }
  }

  onCandidateStoreChange () {
    this.setState({
      candidate: CandidateStore.getCandidate(this.state.ballot_item_we_vote_id),
      position_list_from_advisers_followed_by_voter: CandidateStore.getPositionList(this.state.ballot_item_we_vote_id),
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

  onTriggerToggle (e, org_id, visible_tag) {
    if (this.mobile) {
      e.preventDefault();
      e.stopPropagation();
      if (!this.popover_state[org_id]) {
        // If it wasn't created, create it now
        this.popover_state[org_id] = {show: false, timer: null};
      }

      if (this.popover_state[org_id].show) {
        this.onTriggerLeave(org_id, visible_tag);
      } else {
        this.onTriggerEnter(org_id, visible_tag);
      }
    }
  }

  percentageMajority () {
    const { support_count, oppose_count } = this.state.supportProps;
    return Math.round(100 * Math.max(support_count, oppose_count) / (support_count + oppose_count));
  }

  organizationsToDisplay (organizations_to_follow, maximum_organization_display, ballot_item_we_vote_id, visible_tag, supports_this_ballot_item = false, opposes_this_ballot_item = false) {
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
    return organizations_to_follow.map( (one_organization) => {
      local_counter++;
      let org_id = one_organization.organization_we_vote_id;

      // Once we have more organizations than we want to show, put them into a drop-down
      if (local_counter > maximum_organization_display) {
        // For now we don't want the dropdown
        // if (local_counter === maximum_organization_display + 1) {
        //   // If here, we want to show how many organizations there are to follow
        //   // Using orgs_not_shown_count as the key seems arbitrary and could cause a collision
        //   this.popover_state[orgs_not_shown_count] = {show: false, timer: null};
        //   let organizationPopover = <Popover
        //       id={`organization-popover-${orgs_not_shown_count}-${visible_tag}`}
        //       onMouseOver={() => this.onTriggerEnter(orgs_not_shown_count, visible_tag)}
        //       onMouseOut={() => this.onTriggerLeave(orgs_not_shown_count, visible_tag)}
        //       className="card-popover">
        //       <OrganizationsNotShownList orgs_not_shown_list={orgs_not_shown_list} />
        //     </Popover>;
        //
        //   return <OverlayTrigger
        //       key={`trigger-${orgs_not_shown_count}-${visible_tag}`}
        //       ref={`cheetah-overlay-${orgs_not_shown_count}-${visible_tag}`}
        //       onMouseOver={() => this.onTriggerEnter(orgs_not_shown_count, visible_tag)}
        //       onMouseOut={() => this.onTriggerLeave(orgs_not_shown_count, visible_tag)}
        //       onExiting={() => this.onTriggerLeave(orgs_not_shown_count, visible_tag)}
        //       trigger={["focus", "hover", "click"]}
        //       rootClose
        //       placement="bottom"
        //       overlay={organizationPopover}>
        //     <span className="position-rating__source with-popover">
        //       <Link to="/opinions"> +{orgs_not_shown_count}</Link>
        //     </span>
        //   </OverlayTrigger>;
        // } else {
        //   return "";
        // }
        return null;
      } else {
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

        let organizationPopover = <Popover
            id={`organization-popover-${org_id}-${visible_tag}`}
            onMouseOver={() => this.onTriggerEnter(org_id, visible_tag)}
            onMouseOut={() => this.onTriggerLeave(org_id, visible_tag)}
            className="card-popover">
            <OrganizationCard organization={one_organization_for_organization_card}
                              ballotItemWeVoteId={ballot_item_we_vote_id}
                              followToggleOn />
          </Popover>;

        return <OverlayTrigger
            key={`trigger-${org_id}-${visible_tag}`}
            ref={`cheetah-overlay-${org_id}-${visible_tag}`}
            onMouseOver={() => this.onTriggerEnter(org_id, visible_tag)}
            onMouseOut={() => this.onTriggerLeave(org_id, visible_tag)}
            onExiting={() => this.onTriggerLeave(org_id, visible_tag)}
            trigger={ visible_tag === "mobile" ? "click" : ["focus", "hover", "click"] }
            rootClose
            placement="bottom"
            overlay={organizationPopover}>
          <span className="position-rating__source with-popover">
            <OrganizationTinyDisplay {...one_organization}
                                     showPlaceholderImage
                                     toFollow
                                     showSupport={supports_this_ballot_item}
                                     showOppose={opposes_this_ballot_item} />
          </span>
        </OverlayTrigger>
      }
    });
  }

  closePositionsPopover () {
    this.refs["positions-overlay"].hide();
  }

  closeScorePopover () {
    this.refs["score-overlay"].hide();
  }

  render () {
    // console.log("ItemSupportOpposeRaccoon render");
    let candidateSupportStore = SupportStore.get(this.state.ballot_item_we_vote_id);
    // Removed from ItemActionBar opposeHideInMobile
    let candidate_support_action_raccoon = <span>
      <ItemActionBar ballot_item_display_name={this.state.ballot_item_display_name}
                     ballot_item_we_vote_id={this.state.ballot_item_we_vote_id}
                     commentButtonHide
                     shareButtonHide
                     supportProps={candidateSupportStore}
                     transitioning={this.state.transitioning}
                     type="CANDIDATE"/>
      </span>;

    let support_count = 0;
    let oppose_count = 0;
    let total_score = 0;
    let total_score_with_sign;
    if (this.state.supportProps !== undefined) {
      support_count = parseInt(this.state.supportProps.support_count) || 0;
      oppose_count = parseInt(this.state.supportProps.oppose_count) || 0;
      total_score = parseInt(support_count - oppose_count);
      if (total_score > 0) {
        total_score_with_sign = "+" + total_score;
      } else if (total_score < 0) {
        total_score_with_sign = total_score;
      } else {
        total_score_with_sign = total_score;
      }
    }

    let positions_exist = support_count || oppose_count || this.state.organizations_to_follow_support.length || this.state.organizations_to_follow_oppose.length;
    let maximum_organizations_to_show_desktop = 12;
    let maximum_organizations_to_show_mobile = 7;

    let organizations_to_follow_support_desktop = [];
    let organizations_to_follow_support_mobile = [];
    let organizations_to_follow_oppose_desktop = [];
    let organizations_to_follow_oppose_mobile = [];

    // console.log("this.state.position_list_from_advisers_followed_by_voter: ", this.state.position_list_from_advisers_followed_by_voter);
    if (positions_exist) {
      // console.log("ItemSupportOpposeCheetah, this.state.ballot_item_we_vote_id: ", this.state.ballot_item_we_vote_id);
      let support_positions_list_count = 0;
      let oppose_positions_list_count = 0;
      // let info_only_positions_list_count = 0;
      this.state.position_list_from_advisers_followed_by_voter.map((one_position) => {
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

      organizations_to_follow_support_desktop = this.organizationsToDisplay(this.state.organizations_to_follow_support, organizations_to_follow_support_desktop_to_show, this.state.ballot_item_we_vote_id, "desktop", true, false);
      organizations_to_follow_support_mobile = this.organizationsToDisplay(this.state.organizations_to_follow_support, organizations_to_follow_support_mobile_to_show, this.state.ballot_item_we_vote_id, "mobile", true, false);
      organizations_to_follow_oppose_desktop = this.organizationsToDisplay(this.state.organizations_to_follow_oppose, organizations_to_follow_oppose_desktop_to_show, this.state.ballot_item_we_vote_id, "desktop", false, true);
      organizations_to_follow_oppose_mobile = this.organizationsToDisplay(this.state.organizations_to_follow_oppose, organizations_to_follow_oppose_mobile_to_show, this.state.ballot_item_we_vote_id, "mobile", false, true);
    }

    const scoreInYourNetworkPopover =
      <Popover id="popover-trigger-click-root-close"
               title={<span>Score in Your Network <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" /></span>}
               onClick={this.closeScorePopover}>
        Your friends, and the organizations you follow, are <strong>Your Network</strong>.
        Each friend or organization you follow
        that <span className="u-no-break"><img src="/img/global/icons/thumbs-up-color-icon.svg"
                                               width="20" height="20" /> supports</span> {this.state.ballot_item_display_name} adds
        +1 to this <strong>Score</strong>.
        Each one that <span className="u-no-break"><img src="/img/global/icons/thumbs-down-color-icon.svg"
                                               width="20" height="20" /> opposes</span> subtracts
        1 from this <strong>Score</strong>. <Button bsStyle="info"
                                                    bsSize="xsmall"
                                                    >
                                              <span>Follow</span>
                                            </Button> an
        organization to add their position to the <strong>Score in Your Network</strong>.
      </Popover>;

    const positionsPopover =
      <Popover id="popover-trigger-click-root-close"
               title={<span>Positions about {this.state.ballot_item_display_name} <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" /></span>}
               onClick={this.closePositionsPopover}>
        These organizations <span className="u-no-break"><img src="/img/global/icons/thumbs-up-color-icon.svg"
                                               width="20" height="20" /> support</span> or&nbsp;
        <span className="u-no-break"><img src="/img/global/icons/thumbs-down-color-icon.svg"
                                               width="20" height="20" /> oppose</span> {this.state.ballot_item_display_name}.
        Click on the logo
        and <Button bsStyle="info"
                    bsSize="xsmall"
                    >
              <span>Follow</span>
            </Button> an organization to add their position to the <strong>Score in Your Network</strong>.
      </Popover>;

    return <div className="network-positions-stacked">
      <div className="network-positions-stacked__support">
        {/* Support toggle here */}
        {candidate_support_action_raccoon}

        {/* Support Score here */}
        <div>
          <OverlayTrigger trigger="click"
                          ref="score-overlay"
                          onExit={this.closeScorePopover}
                          rootClose
                          placement="top"
                          overlay={scoreInYourNetworkPopover}>
            <span className="network-positions-stacked__support-score u-cursor--pointer u-no-break">
              { total_score === 0 ?
                <span className="u-margin-left--md">{ total_score_with_sign }&nbsp;</span> :
                <span className="u-margin-left--xs">{ total_score_with_sign }&nbsp;</span>
              }
              <span className="network-positions-stacked__support-score-label">
                <span className="visible-xs">Network Score</span>
                <span className="hidden-xs">Score in Your Network</span>
              </span>
            </span>
          </OverlayTrigger>
          <span className="sr-only">{total_score > 0 ? total_score + " Support" : null }{total_score < 0 ? total_score + " Oppose" : null }</span>
        </div>
      </div>
      <div className="network-positions-stacked__support">
        { positions_exist ?
          <OverlayTrigger trigger="click"
                          ref="positions-overlay"
                          onExit={this.closePositionsPopover}
                          rootClose
                          placement="top"
                          overlay={positionsPopover}>
            <span className="network-positions-stacked__support-label u-cursor--pointer">Positions&nbsp;</span>
          </OverlayTrigger> :
          null }
        {/* Show a break-down of the current positions in your network */}
        <span className="u-flex u-justify-between u-inset__v--xs hidden-xs">
          <ItemTinyPositionBreakdownList ballot_item_display_name={this.state.ballot_item_display_name}
                                         ballotItemWeVoteId={this.state.ballot_item_we_vote_id}
                                         position_list={this.state.position_list_from_advisers_followed_by_voter}
                                         showSupport
                                         supportProps={this.state.supportProps}
                                         visibility="desktop" />
        </span>
        <span className="u-flex u-justify-between u-inset__v--xs hidden-xs">
          <ItemTinyPositionBreakdownList ballot_item_display_name={this.state.ballot_item_display_name}
                                         ballotItemWeVoteId={this.state.ballot_item_we_vote_id}
                                         position_list={this.state.position_list_from_advisers_followed_by_voter}
                                         showOppose
                                         supportProps={this.state.supportProps}
                                         visibility="desktop" />
        </span>
        <span className="u-flex u-justify-between u-inset__v--xs visible-xs">
          <ItemTinyPositionBreakdownList ballot_item_display_name={this.state.ballot_item_display_name}
                                         ballotItemWeVoteId={this.state.ballot_item_we_vote_id}
                                         position_list={this.state.position_list_from_advisers_followed_by_voter}
                                         showSupport
                                         supportProps={this.state.supportProps}
                                         visibility="mobile" />
        </span>
        <span className="u-flex u-justify-between u-inset__v--xs visible-xs">
          <ItemTinyPositionBreakdownList ballot_item_display_name={this.state.ballot_item_display_name}
                                         ballotItemWeVoteId={this.state.ballot_item_we_vote_id}
                                         position_list={this.state.position_list_from_advisers_followed_by_voter}
                                         showOppose
                                         supportProps={this.state.supportProps}
                                         visibility="mobile" />
        </span>

        {/* Show support positions the voter can follow Desktop */}
        { organizations_to_follow_support_desktop.length ?
          <span className="hidden-xs">
            {organizations_to_follow_support_desktop}
          </span> :
          null }
        {/* Show support positions the voter can follow Mobile */}
        { organizations_to_follow_support_mobile.length ?
          <span className="visible-xs">
            {organizations_to_follow_support_mobile}
          </span> :
          null }
        {/* Show oppose positions the voter can follow Desktop */}
        { organizations_to_follow_oppose_desktop.length ?
          <span className="hidden-xs">
            {organizations_to_follow_oppose_desktop}
          </span> :
          null }

        {/* Show oppose positions the voter can follow Mobile */}
        { organizations_to_follow_oppose_mobile.length ?
          <span className="visible-xs">
            {organizations_to_follow_oppose_mobile}
          </span> :
          null }
      </div>
    </div>;
  }
}
