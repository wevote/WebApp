import React, { Component, PropTypes } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { Link } from "react-router";
import CandidateActions from "../../actions/CandidateActions";
import CandidateStore from "../../stores/CandidateStore";
import { cordovaDot } from "../../utils/cordovaUtils";
import FollowToggle from "./FollowToggle";
import ItemTinyPositionBreakdownList from "../Position/ItemTinyPositionBreakdownList";
import OrganizationCard from "../VoterGuide/OrganizationCard";
import OrganizationsNotShownList from "../VoterGuide/OrganizationsNotShownList";

export default class ItemSupportOpposeCheetah extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string,
    ballotItemWeVoteId: PropTypes.string,
    display_cheetah_details_flag: PropTypes.bool,
    maximumOrganizationDisplay: PropTypes.number,
    organizationsToFollowSupport: PropTypes.array,
    organizationsToFollowOppose: PropTypes.array,
    positionBarIsClickable: PropTypes.bool,
    supportProps: PropTypes.object,
    toggleCandidateModal: PropTypes.func,
  };

  constructor (props) {
    super(props);

    this.popover_state = {};
    this.mobile = "ontouchstart" in document.documentElement;

    this.state = {
      ballot_item_display_name: "",
      ballot_item_we_vote_id: "",
      candidate: {},
      display_cheetah_details_flag: false,
      maximum_organization_display: 0,
      organizations_to_follow_support: [],
      organizations_to_follow_oppose: [],
      position_list_from_advisers_followed_by_voter: [],
      supportProps: this.props.supportProps,
    };

    this.openCandidateModal = this.openCandidateModal.bind(this);
  }

  componentDidMount () {
    CandidateActions.positionListForBallotItem(this.props.ballotItemWeVoteId);
    this.setState({
      ballot_item_display_name: this.props.ballot_item_display_name,
      ballot_item_we_vote_id: this.props.ballotItemWeVoteId,
      candidate: CandidateStore.getCandidate(this.props.ballotItemWeVoteId),
      display_cheetah_details_flag: this.props.display_cheetah_details_flag,
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
      display_cheetah_details_flag: nextProps.display_cheetah_details_flag,
      maximum_organization_display: nextProps.maximumOrganizationDisplay,
      organizations_to_follow_support: nextProps.organizationsToFollowSupport,
      organizations_to_follow_oppose: nextProps.organizationsToFollowOppose,
      position_list_from_advisers_followed_by_voter: CandidateStore.getPositionList(nextProps.ballotItemWeVoteId),
      supportProps: nextProps.supportProps,
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

  organizationsToDisplay (organizations_to_follow, maximum_organization_display, ballot_item_we_vote_id, visible_tag) {
    if (!maximum_organization_display || maximum_organization_display === 0) {
      return [];
    }

    let local_counter = 0;
    let orgs_not_shown_count = 0;
    let orgs_not_shown_list = [];
    let one_organization_for_organization_card;
    if (organizations_to_follow &&
      organizations_to_follow.length > maximum_organization_display) {
      orgs_not_shown_count = organizations_to_follow.length - maximum_organization_display;
      orgs_not_shown_list = organizations_to_follow.slice(maximum_organization_display);
    }
    return organizations_to_follow.map( (one_organization) => {
      local_counter++;
      let org_id = one_organization.organization_we_vote_id;

      // Once we have more organizations than we want to show, put them into a drop-down
      if (local_counter > maximum_organization_display) {
        if (local_counter === maximum_organization_display + 1) {
          // If here, we want to show how many organizations there are to follow
          // Using orgs_not_shown_count as the key seems arbitrary and could cause a collision
          this.popover_state[orgs_not_shown_count] = {show: false, timer: null};
          let organizationPopover = <Popover
              id={`organization-popover-${orgs_not_shown_count}-${visible_tag}`}
              onMouseOver={() => this.onTriggerEnter(orgs_not_shown_count, visible_tag)}
              onMouseOut={() => this.onTriggerLeave(orgs_not_shown_count, visible_tag)}
              className="card-popover">
              <OrganizationsNotShownList orgs_not_shown_list={orgs_not_shown_list} />
            </Popover>;

          return <OverlayTrigger
              key={`trigger-${orgs_not_shown_count}-${visible_tag}`}
              ref={`cheetah-overlay-${orgs_not_shown_count}-${visible_tag}`}
              onMouseOver={() => this.onTriggerEnter(orgs_not_shown_count, visible_tag)}
              onMouseOut={() => this.onTriggerLeave(orgs_not_shown_count, visible_tag)}
              onExiting={() => this.onTriggerLeave(orgs_not_shown_count, visible_tag)}
              trigger={["focus", "hover"]}
              rootClose
              placement="bottom"
              overlay={organizationPopover}>
            <span className="position-rating__source with-popover">
              <Link to="/opinions"> +{orgs_not_shown_count}</Link>
            </span>
          </OverlayTrigger>;
        } else {
          return "";
        }
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
            trigger={["focus", "hover"]}
            rootClose
            placement="bottom"
            overlay={organizationPopover}>
          <span className="position-rating__source with-popover">
            <FollowToggle we_vote_id={one_organization.organization_we_vote_id}
                          organization_for_display={one_organization}
                          classNameOverride="pull-left" />
          </span>
        </OverlayTrigger>;
      }
    });
  }

  openCandidateModal () {
    // console.log("this.state.candidate: ", this.state.candidate);
    if (this.state.candidate.we_vote_id) {
      this.props.toggleCandidateModal(this.state.candidate);
    }
  }

  render () {
    let is_majority_support;
    let is_majority_oppose;
    let support_count = 0;
    let oppose_count = 0;
    if (this.state.supportProps !== undefined) {
      support_count = this.state.supportProps.support_count || 0;
      oppose_count = this.state.supportProps.oppose_count || 0;
      is_majority_support = support_count > oppose_count;
      is_majority_oppose = support_count < oppose_count;
    }

    let positions_exist = support_count || oppose_count || this.state.organizations_to_follow_support || this.state.organizations_to_follow_oppose;
    let maximum_organizations_to_show_desktop = 8;
    let maximum_organizations_to_show_mobile = 5;

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

      let organizations_to_follow_support_desktop = this.organizationsToDisplay(this.state.organizations_to_follow_support, organizations_to_follow_support_desktop_to_show, this.state.ballot_item_we_vote_id, "desktop");
      let organizations_to_follow_support_mobile = this.organizationsToDisplay(this.state.organizations_to_follow_support, organizations_to_follow_support_mobile_to_show, this.state.ballot_item_we_vote_id, "mobile");
      let organizations_to_follow_oppose_desktop = this.organizationsToDisplay(this.state.organizations_to_follow_oppose, organizations_to_follow_oppose_desktop_to_show, this.state.ballot_item_we_vote_id, "desktop");
      let organizations_to_follow_oppose_mobile = this.organizationsToDisplay(this.state.organizations_to_follow_oppose, organizations_to_follow_oppose_mobile_to_show, this.state.ballot_item_we_vote_id, "mobile");

      let show_support_row = this.state.display_cheetah_details_flag ? support_count || organizations_to_follow_support_desktop.length : support_count;
      let show_oppose_row = this.state.display_cheetah_details_flag ? oppose_count || organizations_to_follow_oppose_desktop.length : oppose_count;

      return <div className="network-positions-stacked">
        { show_support_row ?
          <div className="network-positions-stacked__support">
            <img
              src={ is_majority_support ? cordovaDot("/img/global/icons/up-arrow-color-icon.svg") : cordovaDot("/img/global/icons/up-arrow-gray-icon.svg") }
              className="network-positions-stacked__support-icon u-push--xs" width="20" height="20"/>
            <div className="network-positions-stacked__count">
              <span className="u-cursor--pointer u-no-break" onClick={() => this.openCandidateModal()}> { support_count } Support&nbsp;</span>
              <span className="sr-only"> Support</span>
            </div>
            {/* Show a break-down of the positions in your network */}
            <div className="u-flex u-justify-between u-inset__v--xs">
              <ItemTinyPositionBreakdownList ballot_item_display_name={this.state.ballot_item_display_name}
                                             ballotItemWeVoteId={this.state.ballot_item_we_vote_id}
                                             position_list={this.state.position_list_from_advisers_followed_by_voter}
                                             showSupport
                                             supportProps={this.state.supportProps} />
            </div>

            {/* Show support positions the voter can follow Desktop */}
            { this.state.display_cheetah_details_flag && organizations_to_follow_support_desktop.length ?
              <span className="hidden-xs">
                <span className="network-positions-stacked__more-opinions u-margin-left--md u-no-break">More </span>
                {organizations_to_follow_support_desktop}
              </span> :
              null }
            {/* Show support positions the voter can follow Mobile */}
            { this.state.display_cheetah_details_flag && organizations_to_follow_support_mobile.length ?
              <span className="visible-xs">
                <span className="network-positions-stacked__more-opinions u-margin-left--md u-no-break">More </span>
                {organizations_to_follow_support_mobile}
              </span> :
              null }
          </div> :
          null }

        { show_oppose_row ?
          <div className="network-positions-stacked__oppose">
            <img
              src={ is_majority_oppose ? cordovaDot("/img/global/icons/down-arrow-color-icon.svg") : cordovaDot("/img/global/icons/down-arrow-gray-icon.svg") }
              className="network-positions-stacked__oppose-icon" width="20" height="20"/>
            <div className="network-positions-stacked__count u-push--xs">
              <span className="u-cursor--pointer u-no-break" onClick={() => this.openCandidateModal()}> { oppose_count } Oppose&nbsp;</span>
              <span className="sr-only"> Oppose</span>
            </div>
            {/* Show a break-down of the positions in your network */}
            <div className="u-flex u-justify-between u-inset__v--xs">
              <ItemTinyPositionBreakdownList ballot_item_display_name={this.state.ballot_item_display_name}
                                             ballotItemWeVoteId={this.state.ballot_item_we_vote_id}
                                             position_list={this.state.position_list_from_advisers_followed_by_voter}
                                             showOppose
                                             supportProps={this.state.supportProps}/>
            </div>

            {/* Show oppose positions the voter can follow Desktop */}
            { this.state.display_cheetah_details_flag && organizations_to_follow_oppose_desktop.length ?
              <span className="hidden-xs">
                <span className="network-positions-stacked__more-opinions u-margin-left--md u-no-break">More&nbsp;</span>
                {organizations_to_follow_oppose_desktop}
              </span> :
              null }

            {/* Show oppose positions the voter can follow Mobile */}
            { this.state.display_cheetah_details_flag && organizations_to_follow_oppose_mobile.length ?
              <span className="visible-xs">
                <span className="network-positions-stacked__more-opinions u-margin-left--md u-no-break">More&nbsp;</span>
                {organizations_to_follow_oppose_mobile}
              </span> :
              null }
          </div> :
          null }
      </div>;
    } else {
      return null;
    }
  }
}
