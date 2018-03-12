import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import IssueActions from "../../actions/IssueActions";
import IssueStore from "../../stores/IssueStore";
import VoterStore from "../../stores/VoterStore";
import { showToastError, showToastSuccess } from "../../utils/showToast";


export default class IssueFollowToggleButton extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    issue_we_vote_id: PropTypes.string.isRequired,
    issue_name: PropTypes.string.isRequired,
    issue_description: PropTypes.string,
    issue_image_url: PropTypes.string,
    on_issue_follow: PropTypes.func,
    on_issue_stop_following: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {
      is_following: false,
    };
    this.onIssueFollow = this.onIssueFollow.bind(this);
    this.onIssueStopFollowing = this.onIssueStopFollowing.bind(this);
  }

  componentDidMount () {
    let is_following = IssueStore.isVoterFollowingThisIssue(this.props.issue_we_vote_id);
    this.setState({is_following: is_following});
  }

  onIssueFollow () {
    // This check is necessary as we enable follow when user clicks on Issue text
    if (!this.state.is_following) {
      this.setState({is_following: true});
      IssueActions.issueFollow(this.props.issue_we_vote_id, VoterStore.election_id());
      if (this.props.on_issue_follow) {
        this.props.on_issue_follow(this.props.issue_we_vote_id);
      }
      showToastSuccess(`Now following ${this.props.issue_name}!`);
    }
  }

  onIssueStopFollowing () {
    this.setState({ is_following: false });
    IssueActions.issueStopFollowing(this.props.issue_we_vote_id, VoterStore.election_id());
    // console.log("IssueFollowToggleButton, this.props.ballotItemWeVoteId:", this.props.ballotItemWeVoteId);
    if (this.props.ballotItemWeVoteId) {
      IssueActions.removeBallotItemIssueScoreFromCache(this.props.ballotItemWeVoteId);
    }
    if (this.props.on_issue_stop_following) {
      this.props.on_issue_stop_following(this.props.issue_we_vote_id);
    }
    showToastError(`You've stopped following ${this.props.issue_name}.`);
  }

  render () {
    if (!this.state) { return <div />; }

    return this.state.is_following ?
      <div className="u-flex u-items-center u-justify-between card-main intro-modal__text-dark">
        <Button bsStyle="warning" bsSize="small" onClick={this.onIssueStopFollowing}>
          <span>Following</span>
        </Button>
      </div> :
      <div className="u-flex u-items-center u-justify-between card-main intro-modal__text-dark">
        <Button bsStyle="success" bsSize="small" onClick={this.onIssueFollow}>
          <span>Follow</span>
        </Button>
      </div>;
  }
}
