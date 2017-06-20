import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import IssueActions from "../../actions/issueActions";

export default class IssueFollowToggle extends Component {
  static propTypes = {
    issue_we_vote_id: PropTypes.string.isRequired,
    issue_name: PropTypes.string.isRequired,
    on_follow: PropTypes.func.isRequired,
    on_unfollow: PropTypes.func.isRequired,
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
    // This check is necessary as we enable follow when user clicks on Issue text
    if (!this.state.is_following) {
      this.setState({is_following: true});
      IssueActions.issueFollow(this.props.issue_we_vote_id);
      this.props.on_follow(this.props.issue_we_vote_id);
    }
  }

  onStopFollowing () {
    this.setState({ is_following: false });
    IssueActions.issueUnFollow(this.props.issue_we_vote_id);
    this.props.on_unfollow(this.props.issue_we_vote_id);
  }

  render () {
    if (!this.state) { return <div />; }
    let is_following = this.state.is_following;

    return is_following ?
      <div className="card-child">
        {this.props.issue_name} &nbsp;
        <Button bsStyle="warning" bsSize="small" className="pull-right" onClick={this.onStopFollowing}>
          <span>UnFollow</span>
        </Button>
      </div> :
      <div>
        {this.props.issue_name} &nbsp; onClick={this.onStartFollowing}
        <Button bsStyle="info" bsSize="small" className="pull-right" onClick={this.onStartFollowing}>
          <span>Follow</span>
        </Button>
      </div>
  }
}
