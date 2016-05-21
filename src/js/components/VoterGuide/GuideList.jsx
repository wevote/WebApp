import React, { Component, PropTypes } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import Organization from "./Organization";
import GuideActions from "../../actions/GuideActions";

export default class GuideList extends Component {

  static propTypes = {
    organizations: PropTypes.array
  };

  /**
   * when a user clicks ignore or follow, make the org disappear
   */
  handleIgnore (id) {
    GuideActions.ignore(id);
  }

  handleFollow (id) {
    GuideActions.follow(id);
  }

  render () {

    let orgs = this.props.organizations.map( (org) => {

    return <Organization key={org.organization_we_vote_id}
                      {...org}
            >
          <button className="btn btn-primary btn-sm follow"
                  onClick={this.handleFollow.bind(this, org.organization_we_vote_id)}>
            Follow
          </button>
          <button className="btn btn-default btn-sm"
                  onClick={this.handleIgnore.bind(this, org.organization_we_vote_id)}>
            Ignore
          </button>
        </Organization>;
    });

    return <div className="guidelist">
        <ReactCSSTransitionGroup transitionName="org-ignore" transitionEnterTimeout={400} transitionLeaveTimeout={200}>
          {orgs}
        </ReactCSSTransitionGroup>
      </div>;
  }

}
