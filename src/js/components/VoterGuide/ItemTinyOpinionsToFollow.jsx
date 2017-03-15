import React, { Component, PropTypes } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import FollowToggle from "../../components/Widgets/FollowToggle";
import OrganizationCard from "./OrganizationCard";
import OrganizationTinyDisplay from "./OrganizationTinyDisplay";

export default class ItemTinyOpinionsToFollow extends Component {

  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    organizationsToFollow: PropTypes.array,
    instantRefreshOn: PropTypes.bool
  };

  constructor (props) {
    super(props);

    this.show_popover = false;

    this.state = {
      organizations_to_follow: this.props.organizationsToFollow,
      ballot_item_we_vote_id: ""
    };
  }

  componentDidMount () {
    this.setState({
      organizations_to_follow: this.props.organizationsToFollow,
      ballot_item_we_vote_id: this.props.ballotItemWeVoteId
    });
  }

  componentWillReceiveProps (nextProps){
    // console.log("ItemTinyOpinionsToFollow, componentWillReceiveProps, nextProps.organizationsToFollow:", nextProps.organizationsToFollow);
    //if (nextProps.instantRefreshOn ) {
      // NOTE: This is off because we don't want the organization to disappear from the "More opinions" list when clicked
      this.setState({
        organizations_to_follow: nextProps.organizationsToFollow,
        ballot_item_we_vote_id: nextProps.ballotItemWeVoteId
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
    if (this.state.organizations_to_follow === undefined) {
      return null;
    }

    const MAXIMUM_ORGANIZATION_DISPLAY = 4;
    let local_counter = 0;
    let orgs_not_shown_count = 0;
    let one_organization_for_organization_card;
    if (this.state.organizations_to_follow && this.state.organizations_to_follow.length > MAXIMUM_ORGANIZATION_DISPLAY) {
      orgs_not_shown_count = this.state.organizations_to_follow.length - MAXIMUM_ORGANIZATION_DISPLAY;
    }
    const organizations_to_display = this.state.organizations_to_follow.map( (one_organization) => {
      local_counter++;
      let org_id = one_organization.organization_we_vote_id;
      if (local_counter > MAXIMUM_ORGANIZATION_DISPLAY) {
        if (local_counter === MAXIMUM_ORGANIZATION_DISPLAY + 1) {
          // If here we want to show how many organizations there are to follow
          return <span key={one_organization.organization_we_vote_id}> +{orgs_not_shown_count}</span>;
        } else {
          return "";
        }
      } else {
        one_organization_for_organization_card = {
            organization_name: one_organization.voter_guide_display_name,
            organization_photo_url_tiny: one_organization.voter_guide_image_url_tiny,
            organization_twitter_handle: one_organization.twitter_handle,
            // organization_website: one_organization.,
            twitter_description: one_organization.twitter_description,
            twitter_followers_count: one_organization.twitter_followers_count,
          };

        let organizationPopover = <Popover
            id={`organization-popover-${org_id}`}
            onMouseOver={() => this.onTriggerEnter(org_id)}
            onMouseOut={() => this.onTriggerLeave(org_id)}
            className="card-popover">
            <div className="card">
              <div className="card-main">
                <FollowToggle we_vote_id={one_organization.organization_we_vote_id} />
                <OrganizationCard organization={one_organization_for_organization_card} />
              </div>
            </div>
          </Popover>;

        let placement = "bottom";
        return <OverlayTrigger
            key={`trigger-${org_id}`}
            ref={`overlay-${org_id}`}
            onMouseOver={() => this.onTriggerEnter(org_id)}
            onMouseOut={() => this.onTriggerLeave(org_id)}
            rootClose
            placement={placement}
            overlay={organizationPopover}>
          <span className="position-rating__source with-popover">
            <OrganizationTinyDisplay {...one_organization}
                                     showPlaceholderImage />
          </span>
        </OverlayTrigger>;
      }
    });

    return <span className="guidelist card-child__list-group">
          {organizations_to_display}
      </span>;
  }

}
