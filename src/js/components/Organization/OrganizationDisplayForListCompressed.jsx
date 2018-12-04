import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import ImageHandler from "../ImageHandler";
import { renderLog } from "../../utils/logging";

// OrganizationDisplayForListCompressed is used by OpinionsFollowedListCompressed for viewing organizations
export default class OrganizationDisplayForListCompressed extends Component {
  static propTypes = {
    organization_we_vote_id: PropTypes.string,
    organization_photo_url_medium: PropTypes.string,
    organization_name: PropTypes.string,
    children: PropTypes.array, // A list of the tags in OrganizationDisplayForList when called (from GuideList for example)
    twitter_description: PropTypes.string,
    organization_twitter_handle: PropTypes.string,
  };

  render () {
    renderLog(__filename);
    if (this.props.organization_we_vote_id === undefined) {
      // console.log("OrganizationDisplayForList this.props.organization_we_vote_id === undefined");
      return null;
    }

    const {
      organization_we_vote_id,
      organization_photo_url_medium,
    } = this.props;
    const organization_name = this.props.organization_name ? this.props.organization_name : "";

    // TwitterHandle-based link
    const voterGuideLink = this.props.organization_twitter_handle ? `/${this.props.organization_twitter_handle}` : `/voterguide/${organization_we_vote_id}`;

    return (
      <div className="card-child card-child--not-followed">
        <div className="card-child__media-object-anchor">
          <Link to={voterGuideLink} className="u-no-underline">
            <ImageHandler className="card-child__avatar" sizeClassName="image-lg " imageUrl={organization_photo_url_medium} />
          </Link>
        </div>
        <div className="card-child__media-object-content">
          <div className="card-child__content">
            <Link to={voterGuideLink}>
              <h4 className="card-child__display-name">{organization_name}</h4>
            </Link>
          </div>
          <div className="card-child__additional">
            <div className="card-child__follow-buttons">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
