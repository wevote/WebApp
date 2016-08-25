import React, { Component, PropTypes } from "react";
import Organization from "./Organization";
import GuideActions from "../../actions/GuideActions";
import FollowToggle from "../Widgets/FollowToggle";

export default class GuideList extends Component {

  static propTypes = {
    organizationsToFollow: PropTypes.array,
    instantRefreshOn: PropTypes.bool
  };

  constructor (props) {
    super(props);
    this.state = { organizations_to_follow: this.props.organizationsToFollow };
  }

  componentWillReceiveProps (nextProps){
    if (this.props.instantRefreshOn) {
      // NOTE: This is off because we don't want the organization to disappear from the "More opinions" list when clicked
      this.setState({organizations_to_follow: nextProps.organizationsToFollow});
    }
  }

  handleIgnore (id) {
    GuideActions.ignore(id);
    this.setState({ organizations_to_follow: this.state.organizations_to_follow.filter( (org) => { return org.organization_we_vote_id !== id;})});
  }

  render () {
    const orgs = this.state.organizations_to_follow.map( (org) => {
      return <Organization key={org.organization_we_vote_id} {...org}>
            <FollowToggle we_vote_id={org.organization_we_vote_id} />
              <button className="btn btn-default btn-sm"
                      onClick={this.handleIgnore.bind(this, org.organization_we_vote_id)}>
                Ignore
              </button>
          </Organization>;
    });

    return <div className="guidelist">
          {orgs}
      </div>;
  }

}
