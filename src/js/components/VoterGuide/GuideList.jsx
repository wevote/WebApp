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

    let orgs = this.props.organizations.map( (org, i) => {

      var {
        organization_we_vote_id: id,
        voter_guide_display_name: displayName,
        voter_guide_image_url: imageUrl,
        twitter_followers_count: followers
      } = org;

      // Key can be id once issue #85 is resolved on server
      // https://github.com/wevote/WeVoteServer/issues/85
      const key = id + "-" + i;

      return <Organization id={id} key={key} displayName={displayName} followers={followers} imageUrl={imageUrl} />;

    });

    const guideList =
      <div className="guidelist">
        {orgs}
      </div>;

    return guideList;
  }

}
