import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import OrganizationActions from "../../actions/OrganizationActions";

export default class OrganizationFollowToggle extends Component {
  static propTypes = {
    organization_we_vote_id: PropTypes.string.isRequired,
    organization_name: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      is_following: false,
    };
  }

  componentDidMount() {
    this.onStartFollowing = this.onStartFollowing.bind(this);
    this.onStopFollowing = this.onStopFollowing.bind(this);
  }

  onStartFollowing () {
    console.log("user chose to follow " + this.props.organization_name );
    this.setState({ is_following: true });
    OrganizationActions.organizationFollowForVoter(this.props.organization_we_vote_id);
  }

  onStopFollowing () {
    console.log("user chose to unfollow " + this.props.organization_name);
    this.setState({ is_following: false });
  }

  render () {
    if (!this.state) { return <div />; }
    let is_following = this.state.is_following;

    return is_following ?
      <div className="card-child">
        {this.props.issue_name} &nbsp;
        <Button bsStyle="warning" bsSize="small" className="pull-right" onClick={this.onStopFollowing}>
          <span>Unfollow</span>
        </Button>
      </div> :
      <div>
        {this.props.issue_name} &nbsp;
        <Button bsStyle="info" bsSize="small" className="pull-right" onClick={this.onStartFollowing}>
          <span>Follow</span>
        </Button>
      </div>
  }
}
