import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import IssueActions from "../../actions/IssueActions";
import IssueStore from "../../stores/IssueStore";
import { renderLog } from "../../utils/logging";
import VoterStore from "../../stores/VoterStore";
import { showToastError, showToastSuccess } from "../../utils/showToast";
import { historyPush } from "../../utils/cordovaUtils";

export default class IssueFollowToggleButton extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    currentBallotIdInUrl: PropTypes.string,
    issue_we_vote_id: PropTypes.string.isRequired,
    issue_name: PropTypes.string.isRequired,
    issue_description: PropTypes.string,
    issue_image_url: PropTypes.string,
    on_issue_follow: PropTypes.func,
    on_issue_stop_following: PropTypes.func,
    urlWithoutHash: PropTypes.string,
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
    const is_following = IssueStore.isVoterFollowingThisIssue(this.props.issue_we_vote_id);
    this.setState({ is_following });
  }

  onIssueFollow () {
    // This check is necessary as we enable follow when user clicks on Issue text
    if (!this.state.is_following) {
      this.setState({ is_following: true });
      IssueActions.issueFollow(this.props.issue_we_vote_id, VoterStore.election_id());
      if (this.props.on_issue_follow) {
        this.props.on_issue_follow(this.props.issue_we_vote_id);
      }

      showToastSuccess(`Now following ${this.props.issue_name}!`);
    }

    const { currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId } = this.props;
    if (currentBallotIdInUrl !== ballotItemWeVoteId) {
      historyPush(`${urlWithoutHash}#${this.props.ballotItemWeVoteId}`);
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
    const { currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId } = this.props;
    if (currentBallotIdInUrl !== ballotItemWeVoteId) {
      historyPush(`${urlWithoutHash}#${this.props.ballotItemWeVoteId}`);
    }
  }

  render () {
    renderLog(__filename);
    if (!this.state) { return <div />; }

    return this.state.is_following ? (
      <div className="u-flex u-items-center u-justify-between card-main intro-modal__text-dark">
        <Button variant="warning" size="small" onClick={this.onIssueStopFollowing}>
          <span>Following</span>
        </Button>
      </div>
    ) : (
      <div className="u-flex u-items-center u-justify-between card-main intro-modal__text-dark">
        <Button variant="success" size="small" onClick={this.onIssueFollow}>
          <span>Follow</span>
        </Button>
      </div>
    );
  }
}
