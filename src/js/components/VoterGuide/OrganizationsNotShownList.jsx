import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import ImageHandler from "../ImageHandler";
import LoadingWheel from "../LoadingWheel";
import { renderLog } from "../../utils/logging";

export default class OrganizationsNotShownList extends Component {
  static propTypes = {
    orgs_not_shown_list: PropTypes.array.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    renderLog(__filename);
    if (!this.props.orgs_not_shown_list) {
      return <div>{LoadingWheel}</div>;
    }

    const organizations_not_shown_display = this.props.orgs_not_shown_list.map( (one_organization) => {
      const organization_we_vote_id = one_organization.organization_we_vote_id;
      const organization_name = one_organization.voter_guide_display_name;
      const organization_photo_url_tiny = one_organization.voter_guide_image_url_tiny;
      const organization_twitter_handle = one_organization.twitter_handle;

      // If the displayName is in the twitterDescription, remove it from twitterDescription
      const displayName = organization_name || "";
      const voterGuideLink = organization_twitter_handle ? `/${organization_twitter_handle}` : `/voterguide/${organization_we_vote_id}`;
      return (
        <div key={organization_we_vote_id} className="card-main__media-object">
          <div className="card-main__media-object-anchor">
            <Link to={voterGuideLink} className="u-no-underline">
              <ImageHandler
                imageUrl={organization_photo_url_tiny}
                className=""
                sizeClassName="organization__image--tiny"
              />
            </Link>
            <br />
          </div>
          &nbsp;&nbsp;
          <div className="card-main__media-object-content">
            <Link to={voterGuideLink}>
              <h3 className="card-main__display-name">{displayName}</h3>
            </Link>
          </div>
        </div>
      );
    });

    return (
      <span className="guidelist card-child__list-group">
        {organizations_not_shown_display}
      </span>
    );
  }
}
