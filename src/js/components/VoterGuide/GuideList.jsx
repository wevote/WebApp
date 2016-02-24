import React, { Component, PropTypes } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import Organization from "./Organization";

import GuideStore from "../../stores/GuideStore";
import GuideActions from "../../actions/GuideActions";

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

  componentDidMount () {
    GuideStore.addChangeListener(this.storeChange.bind(this));
  }

  componentWillUnmount () {
    GuideStore.removeChangeListener(this.storeChange.bind(this));
  }

  storeChange () {
    this.setState({ orgList: GuideStore.toArray() });
  }

  /**
   * when a user clicks ignore, make the org disappear
   * @param {Integer} i index in array of the item clicked
   */
  handleIgnore (i) {

    var {
      organization_we_vote_id: id
    } = this.state.orgList.slice().splice(i, 1)[0];

    GuideActions.ignore(id);

  }

  handleFollow (i) {
    var {
      organization_we_vote_id: id
    } = this.state.orgList.slice().splice(i, 1)[0];

    GuideActions.follow(id);
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
          <button className="btn btn-primary follow" onClick={this.handleFollow.bind(this, i)}>
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
