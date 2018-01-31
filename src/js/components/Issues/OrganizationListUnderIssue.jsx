import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import ImageHandler from "../../components/ImageHandler";
import LoadingWheel from "../../components/LoadingWheel";

export default class OrganizationListUnderIssue extends Component {
  static propTypes = {
    orgs_not_shown_list: PropTypes.array.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    if (!this.props.orgs_not_shown_list){
      return <div>{LoadingWheel}</div>;
    }

    const organizations_not_shown_display = this.props.orgs_not_shown_list.map( (one_organization) => {
      let organization_we_vote_id = one_organization.organization_we_vote_id;
      let organization_name = one_organization.voter_guide_display_name;
      let organization_photo_url_tiny = one_organization.voter_guide_image_url_tiny;
      let organization_twitter_handle = one_organization.twitter_handle;

      // If the displayName is in the twitterDescription, remove it from twitterDescription
      let displayName = organization_name ? organization_name : "";
      var voterGuideLink = organization_twitter_handle ? "/" + organization_twitter_handle : "/voterguide/" + organization_we_vote_id;
      return <div key={organization_we_vote_id} className="card-main__media-object">
        <div className="card-main__media-object-anchor">
          <Link to={voterGuideLink} className="u-no-underline">
            <ImageHandler imageUrl={organization_photo_url_tiny}
              className=""
              sizeClassName="organization__image--tiny"/>
          </Link>
          <br/>
        </div>
        &nbsp;&nbsp;
        <div className="card-main__media-object-content">
          <Link to={voterGuideLink}>
            <h3 className="card-main__display-name">{displayName}</h3>
          </Link>
        </div>
      </div>;
    });

    return <span className="guidelist card-child__list-group">
        {organizations_not_shown_display}
      </span>;
  }
}
