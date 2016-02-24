import React, { Component, PropTypes } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import Organization from "./Organization";

import GuideStore from "../../stores/GuideStore";

export default class GuideList extends Component {

  static propTypes = {
    organizations: PropTypes.array
  };

  constructor (props) {
    super(props);

    var { organizations: orgs } = this.props;

    /**
     * this is being done because of issue #85...
     * https://github.com/wevote/WeVoteServer/issues/85

     * READ:
     *   -- GuideStore is naturally unique per item key
     *   -- so... store data and then convert it to an array

     * SEE BELOW:
     *  GuideStore.addOrganization
     * then ->
     *  GuideStore.toArray()

     * this is inefficient but it needs to be done to create unique
     * organizations in the list because the backend is not unique.
     */

    orgs.forEach(GuideStore.addOrganization);
    this.state = { orgList: GuideStore.toArray() };

  }

  /**
   * when a user clicks ignore, make the org disappear
   * @param {Integer} i index in array of the item clicked
   */
  handleIgnore (i) {
    console.log(i);
    var newOrgList = this.state.orgList.slice();
    newOrgList.splice(i, 1);
    this.setState({ orgList: newOrgList });
  }

  render () {

    let orgs = this.state.orgList.map( (org, i) => {

      var {
        organization_we_vote_id: id,
        voter_guide_display_name: displayName,
        voter_guide_image_url: imageUrl,
        twitter_followers_count: followers
      } = org;

      // Key can be id once issue #85 is resolved on server
      // https://github.com/wevote/WeVoteServer/issues/85
      const key = id + "-" + i;

      const organization =
        <Organization id={id} key={key} displayName={displayName} followers={followers} imageUrl={imageUrl} >
          <button className="btn btn-primary follow">
            Follow
          </button>
          <button className="btn btn-default ignore" onClick={this.handleIgnore.bind(this, i)}>
            Ignore
          </button>
        </Organization>;

      return organization;

    });

    const guideList =
      <div className="guidelist row">
        <ReactCSSTransitionGroup transitionName="org-ignore" transitionEnterTimeout={400} transitionLeaveTimeout={200}>
          {orgs}
        </ReactCSSTransitionGroup>
      </div>;

    return guideList;
  }

}
