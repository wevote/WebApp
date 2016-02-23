import React, { Component, PropTypes } from "react";
import Organization from "./Organization";

export default class GuideList extends Component {

  static propTypes = {
    organizations: PropTypes.array
  };

  constructor (props) {
    super(props);
  }

  render () {
    const orgs = this.props.organizations.map( org => {

      var {
        organization_we_vote_id: id,
        voter_guide_display_name: displayName,
        voter_guide_image_url: imageUrl,
        twitter_followers_count: followers
      } = org;

      return <Organization id={id} displayName={displayName} followers={followers} imageUrl={imageUrl} />;

    });

    const guideList =
      <div className="guidelist">
        {orgs}
      </div>;

    return guideList;
  }

}
