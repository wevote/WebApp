import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { OverlayTrigger, Popover } from "react-bootstrap";
import FollowToggle from "../../components/Widgets/FollowToggle";
import { renderLog } from "../../utils/logging";
import OrganizationCard from "../../components/VoterGuide/OrganizationCard";
import OrganizationTinyDisplay from "../../components/VoterGuide/OrganizationTinyDisplay";

export default class OrganizationsFollowedOnTwitter extends Component {

  static propTypes = {
    organizationsFollowedOnTwitter: PropTypes.array,
    maximumOrganizationDisplay: PropTypes.number,
  };

  constructor (props) {
    super(props);

    this.show_popover = false;

    this.state = {
      organizations_followed_on_twitter: this.props.organizationsFollowedOnTwitter,
      maximum_organization_display: this.props.maximumOrganizationDisplay,
    };
  }

  componentDidMount () {
    console.log("OrganizationsFollowedOnTwitter componentDidMount");
    this.setState({
      organizations_followed_on_twitter: this.props.organizationsFollowedOnTwitter,
      maximum_organization_display: this.props.maximumOrganizationDisplay,
    });
  }

  componentWillReceiveProps (nextProps){
    // console.log("OrganizationsFollowedOnTwitter, componentWillReceiveProps, nextProps.organizationsFollowedOnTwitter:", nextProps.organizationsFollowedOnTwitter);
    //if (nextProps.instantRefreshOn ) {
      // NOTE: This is off because we don't want the organization to disappear from the "More opinions" list when clicked
      this.setState({
        organizations_followed_on_twitter: nextProps.organizationsFollowedOnTwitter,
        maximum_organization_display: nextProps.maximumOrganizationDisplay,
      });
    //}
  }

  onTriggerEnter (org_id) {
    this.refs[`overlay-${org_id}`].show();
    this.show_popover = true;
    clearTimeout(this.hide_popover_timer);
  }

  onTriggerLeave (org_id) {
    this.show_popover = false;
    clearTimeout(this.hide_popover_timer);
    this.hide_popover_timer = setTimeout(() => {
      if (!this.show_popover) {
        this.refs[`overlay-${org_id}`].hide();
      }
    }, 100);
  }

  render () {
    // console.log("OrganizationsFollowedOnTwitter render")
    renderLog(__filename);
    if (this.state.organizations_followed_on_twitter === undefined) {
      return null;
    }

    let local_counter = 0;
    let orgs_not_shown_count = 0;
    let one_organization_for_organization_card;
    if (this.state.organizations_followed_on_twitter &&
      this.state.organizations_followed_on_twitter.length > this.state.maximum_organization_display) {
      orgs_not_shown_count = this.state.organizations_followed_on_twitter.length - this.state.maximum_organization_display;
    }
    const organizations_to_display = this.state.organizations_followed_on_twitter.map( (one_organization) => {
      local_counter++;
      let org_id = one_organization.organization_we_vote_id;
      if (local_counter > this.state.maximum_organization_display) {
        if (local_counter === this.state.maximum_organization_display + 1) {
          // If here we want to show how many organizations there are to follow
          return <span key={one_organization.organization_we_vote_id}>
            <Link to="/opinions_followed"> +{orgs_not_shown_count}</Link>
          </span>;
        } else {
          return "";
        }
      } else {
        one_organization_for_organization_card = {
            organization_name: one_organization.organization_name,
            organization_photo_url_large: one_organization.organization_photo_url_large,
            organization_photo_url_tiny: one_organization.organization_photo_url_tiny,
            organization_twitter_handle: one_organization.organization_twitter_handle,
            organization_website: one_organization.organization_website,
            twitter_description: one_organization.twitter_description,
            twitter_followers_count: one_organization.twitter_followers_count,
          };

        // Removed bsPrefix="card-popover"
        // onMouseOver={() => this.onTriggerEnter(org_id)}
        // onMouseOut={() => this.onTriggerLeave(org_id)}
        let organizationPopover = <Popover id={`organization-popover-${org_id}`}
                                           >
            <div className="card">
              <div className="card-main">
                <FollowToggle organizationWeVoteId={one_organization.organization_we_vote_id} />
                <OrganizationCard organization={one_organization_for_organization_card} />
              </div>
            </div>
          </Popover>;
        var voterGuideLink = one_organization.organization_twitter_handle ?
          "/" + one_organization.organization_twitter_handle :
          "/voterguide/" + one_organization.organization_we_vote_id;
        let placement = "bottom";
        // onMouseOver={() => this.onTriggerEnter(org_id)}
        // onMouseOut={() => this.onTriggerLeave(org_id)}
        return <OverlayTrigger
            key={`trigger-${org_id}`}
            ref={`overlay-${org_id}`}
            rootClose
            placement={placement}
            overlay={organizationPopover}>
          <span className="position-rating__source with-popover">
            <Link to={voterGuideLink}>
              <OrganizationTinyDisplay {...one_organization}
                                      showPlaceholderImage />
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

