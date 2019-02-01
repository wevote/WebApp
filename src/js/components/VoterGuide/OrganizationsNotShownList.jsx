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

    const organizationsNotShownDisplay = this.props.orgs_not_shown_list.map((oneOrganization) => {
      const { organization_we_vote_id: organizationWeVoteId, voter_guide_display_name: organizationName,
        voter_guide_image_url_tiny: organizationPhotoUrlTiny, twitter_handle: organizationTwitterHandle } = oneOrganization;
      // const organizationWeVoteId = oneOrganization.organization_we_vote_id;
      // const organizationName = oneOrganization.voter_guide_display_name;
      // const organizationPhotoUrlTiny = oneOrganization.voter_guide_image_url_tiny;
      // const organizationTwitterHandle = oneOrganization.twitter_handle;

      // If the displayName is in the twitterDescription, remove it from twitterDescription
      const displayName = organizationName || "";
      const voterGuideLink = organizationTwitterHandle ? `/${organizationTwitterHandle}` : `/voterguide/${organizationWeVoteId}`;
      return (
        <div key={organizationWeVoteId} className="card-main__media-object">
          <div className="card-main__media-object-anchor">
            <Link to={voterGuideLink} className="u-no-underline">
              <ImageHandler
                imageUrl={organizationPhotoUrlTiny}
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
        {organizationsNotShownDisplay}
      </span>
    );
  }
}
