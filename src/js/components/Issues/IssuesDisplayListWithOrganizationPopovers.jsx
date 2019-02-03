import React, { Component } from "react";
import PropTypes from "prop-types";
import IssueTinyDisplay from "./IssueTinyDisplay";
import { renderLog } from "../../utils/logging";

// We use this for IssuesFollowedDisplayList, to show a voter a horizontal list of all of their
// issues, with a drop down under each one that has all of the organizations they can follow underneath.
export default class IssuesDisplayListWithOrganizationPopovers extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    currentBallotIdInUrl: PropTypes.string,
    issueImageSize: PropTypes.string,
    issueListToDisplay: PropTypes.array,
    maximumIssuesToDisplay: PropTypes.number,
    popoverBottom: PropTypes.bool,
    toFollow: PropTypes.bool,
    overlayTriggerOnClickOnly: PropTypes.bool,
    urlWithoutHash: PropTypes.string,
  };

  constructor (props) {
    super(props);

    this.mobile = "ontouchstart" in document.documentElement;

    this.state = {
      issueImageSize: "SMALL", // We support SMALL, MEDIUM, LARGE
      issues_to_display: [],
      maximum_issues_display: 0,
    };
  }

  componentDidMount () {
    const imageSizes = new Set(["SMALL", "MEDIUM", "LARGE"]);
    let issueImageSize = "SMALL"; // Set the default
    if (imageSizes.has(this.props.issueImageSize)) {
      ({ issueImageSize } = this.props);
    }

    this.setState({
      ballotItemWeVoteId: this.props.ballotItemWeVoteId,
      issueImageSize,
      issues_to_display: this.props.issueListToDisplay,
      maximum_issues_display: this.props.maximumIssuesToDisplay ? this.props.maximumIssuesToDisplay : 20,
    });
  }

  componentWillReceiveProps (nextProps) {
    const imageSizes = new Set(["SMALL", "MEDIUM", "LARGE"]);
    let issueImageSize = "SMALL"; // Set the default
    if (imageSizes.has(nextProps.issueImageSize)) {
      ({ issueImageSize } = nextProps);
    }

    this.setState({
      ballotItemWeVoteId: nextProps.ballotItemWeVoteId,
      issueImageSize,
      issues_to_display: nextProps.issueListToDisplay,
      maximum_issues_display: nextProps.maximumIssuesToDisplay ? nextProps.maximumIssuesToDisplay : 20,
    });
  }

  render () {
    renderLog(__filename);
    if (this.state.issues_to_display === undefined) {
      return null;
    }

    let localCounter = 0;
    const issuesHtmlToDisplay = this.state.issues_to_display.map((oneIssue) => {
      if (!oneIssue) {
        return null;
      }

      localCounter++;

      // console.log("IssuesDisplayListWithOrganizationPopovers oneIssue: ", oneIssue);
      const issueWeVoteId = oneIssue.issue_we_vote_id;

      // Once we have more organizations than we want to show, put them into a drop-down
      if (localCounter <= this.state.maximum_issues_display) {
        // May need this:
        // overlayTriggerOnClickOnly={this.props.overlayTriggerOnClickOnly}
        return (
          <IssueTinyDisplay
            key={`trigger-${issueWeVoteId}`}
            ballotItemWeVoteId={this.state.ballotItemWeVoteId}
            currentBallotIdInUrl={this.props.currentBallotIdInUrl}
            issue={oneIssue}
            issueImageSize={this.state.issueImageSize}
            issueWeVoteId={issueWeVoteId}
            popoverBottom={this.props.popoverBottom}
            toFollow={this.props.toFollow}
            urlWithoutHash={this.props.urlWithoutHash}
          />
        );
      } else {
        return null;
      }
    });

    return (
      <span>
        {issuesHtmlToDisplay}
      </span>
    );
  }
}
