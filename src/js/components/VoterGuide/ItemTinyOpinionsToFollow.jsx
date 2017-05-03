import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import { OverlayTrigger, Popover } from "react-bootstrap";
import FollowToggle from "../../components/Widgets/FollowToggle";
import OrganizationCard from "./OrganizationCard";
import OrganizationTinyDisplay from "./OrganizationTinyDisplay";

export default class ItemTinyOpinionsToFollow extends Component {

  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    organizationsToFollow: PropTypes.array,
    instantRefreshOn: PropTypes.bool,
    maximumOrganizationDisplay: PropTypes.number,
  };

  constructor (props) {
    super(props);

    this.popover_state = {};
    this.mobile = "ontouchstart" in document.documentElement;

    this.state = {
      organizations_to_follow: this.props.organizationsToFollow,
      ballot_item_we_vote_id: "",
      maximum_organization_display: this.props.maximumOrganizationDisplay,
    };
  }

  componentDidMount () {
    this.setState({
      organizations_to_follow: this.props.organizationsToFollow,
      ballot_item_we_vote_id: this.props.ballotItemWeVoteId,
      maximum_organization_display: this.props.maximumOrganizationDisplay,
    });
  }

  componentWillReceiveProps (nextProps){
    // console.log("ItemTinyOpinionsToFollow, componentWillReceiveProps, nextProps.organizationsToFollow:", nextProps.organizationsToFollow);
    //if (nextProps.instantRefreshOn ) {
      // NOTE: This is off because we don't want the organization to disappear from the "More opinions" list when clicked
      this.setState({
        organizations_to_follow: nextProps.organizationsToFollow,
        ballot_item_we_vote_id: nextProps.ballotItemWeVoteId,
        maximum_organization_display: nextProps.maximumOrganizationDisplay,
      });
    //}
  }

  onTriggerEnter (org_id) {
    this.refs[`overlay-${org_id}`].show();
    clearTimeout(this.popover_state[org_id].timer);
    this.popover_state[org_id].show = true;
  }

  onTriggerLeave (org_id) {
    this.popover_state[org_id].show = false;
    clearTimeout(this.popover_state[org_id].timer);
    this.popover_state[org_id].timer = setTimeout(() => {
      if (!this.popover_state[org_id].show) {
        this.refs[`overlay-${org_id}`].hide();
      }
    }, 100);
  }

  onTriggerToggle (e, org_id) {
    if (this.mobile) {
      e.preventDefault();
      e.stopPropagation();

      if (this.popover_state[org_id].show) {
        this.onTriggerLeave(org_id);
      } else {
        this.onTriggerEnter(org_id);
      }
    }
  }

  render () {
    if (this.state.organizations_to_follow === undefined) {
      return null;
    }

    let local_counter = 0;
    let orgs_not_shown_count = 0;
    let one_organization_for_organization_card;
    if (this.state.organizations_to_follow &&
      this.state.organizations_to_follow.length > this.state.maximum_organization_display) {
      orgs_not_shown_count = this.state.organizations_to_follow.length - this.state.maximum_organization_display;
    }
    const organizations_to_display = this.state.organizations_to_follow.map( (one_organization) => {
      local_counter++;
      let org_id = one_organization.organization_we_vote_id;

      if (local_counter > this.state.maximum_organization_display) {
        if (local_counter === this.state.maximum_organization_display + 1) {
          // If here we want to show how many organizations there are to follow
          return <span key={one_organization.organization_we_vote_id}>
            <Link to="/opinions"> +{orgs_not_shown_count}</Link>
          </span>;
        } else {
          return "";
        }
      } else {
        one_organization_for_organization_card = {
            organization_name: one_organization.voter_guide_display_name,
            organization_photo_url_large: one_organization.voter_guide_image_url_large,
            organization_photo_url_tiny: one_organization.voter_guide_image_url_tiny,
            organization_twitter_handle: one_organization.twitter_handle,
            // organization_website: one_organization.organization_website,
            twitter_description: one_organization.twitter_description,
            twitter_followers_count: one_organization.twitter_followers_count,
          };

        this.popover_state[org_id] = {show: false, timer: null};

        let voterGuideLink = one_organization.organization_twitter_handle ?
                                  "/" + one_organization.organization_twitter_handle :
                                  "/voterguide/" + one_organization.organization_we_vote_id;

        let organizationPopover = <Popover
            id={`organization-popover-${org_id}`}
            onMouseOver={() => this.onTriggerEnter(org_id)}
            onMouseOut={() => this.onTriggerLeave(org_id)}
            className="card-popover">
            <FollowToggle we_vote_id={one_organization.organization_we_vote_id} />
            <OrganizationCard organization={one_organization_for_organization_card} />
          </Popover>;

        return <OverlayTrigger
            key={`trigger-${org_id}`}
            ref={`overlay-${org_id}`}
            onMouseOver={() => this.onTriggerEnter(org_id)}
            onMouseOut={() => this.onTriggerLeave(org_id)}
            onExiting={() => this.onTriggerLeave(org_id)}
            trigger={["focus", "hover"]}
            rootClose
            placement="bottom"
            overlay={organizationPopover}>
          <span className="position-rating__source with-popover">
            <Link key={`tiny-link-${org_id}`} to={voterGuideLink} onClick={(e) => this.onTriggerToggle(e, org_id)} className="u-no-underline">
              <OrganizationTinyDisplay {...one_organization} showPlaceholderImage />
            </Link>
          </span>
        </OverlayTrigger>;
      }
    });

    return <span className="guidelist card-child__list-group">
          {organizations_to_display}
      </span>;
  }

}
