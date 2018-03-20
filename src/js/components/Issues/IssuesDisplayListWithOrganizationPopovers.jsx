import React, { Component } from "react";
import PropTypes from "prop-types";
import { OverlayTrigger, Popover } from "react-bootstrap";
import IssueCard from "./IssueCard";
import IssueImageDisplay from "./IssueImageDisplay";
import IssueStore from "../../stores/IssueStore";
import OrganizationListUnderIssue from "./OrganizationListUnderIssue";

// We use this for IssuesFollowedDisplayList, to show a voter a horizontal list of all of their
// issues, with a drop down under each one that has all of the organizations they can follow underneath.
export default class IssuesDisplayListWithOrganizationPopovers extends Component {

  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    issueImageSize: PropTypes.string,
    issueListToDisplay: PropTypes.array,
    instantRefreshOn: PropTypes.bool,
    maximumIssuesToDisplay: PropTypes.number,
    toFollow: PropTypes.bool,
    visibility: PropTypes.string,
  };

  constructor (props) {
    super(props);

    this.popover_state = {};
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
      issueImageSize = this.props.issueImageSize;
    }
    this.setState({
      ballotItemWeVoteId: this.props.ballotItemWeVoteId,
      issueImageSize: issueImageSize,
      issues_to_display: this.props.issueListToDisplay,
      maximum_issues_display: this.props.maximumIssuesToDisplay ? this.props.maximumIssuesToDisplay : 20,
    });
  }

  componentWillReceiveProps (nextProps) {
    const imageSizes = new Set(["SMALL", "MEDIUM", "LARGE"]);
    let issueImageSize = "SMALL"; // Set the default
    if (imageSizes.has(nextProps.issueImageSize)) {
      issueImageSize = nextProps.issueImageSize;
    }
    this.setState({
      ballotItemWeVoteId: nextProps.ballotItemWeVoteId,
      issueImageSize: issueImageSize,
      issues_to_display: nextProps.issueListToDisplay,
      maximum_issues_display: nextProps.maximumIssuesToDisplay ? nextProps.maximumIssuesToDisplay : 20,
    });
  }

  onTriggerEnter (issue_we_vote_id) {
    if (this.refs[`issue-overlay-${issue_we_vote_id}`]) {
      this.refs[`issue-overlay-${issue_we_vote_id}`].show();
    }
    if (!this.popover_state[issue_we_vote_id]) {
      // If it wasn't created, create it now
      this.popover_state[issue_we_vote_id] = {show: false, timer: null};
    }

    clearTimeout(this.popover_state[issue_we_vote_id].timer);
    if (!this.popover_state[issue_we_vote_id]) {
      // If it wasn't created, create it now
      this.popover_state[issue_we_vote_id] = {show: false, timer: null};
    }
    this.popover_state[issue_we_vote_id].show = true;
  }

  onTriggerLeave (issue_we_vote_id) {
    if (!this.popover_state[issue_we_vote_id]) {
      // If it wasn't created, create it now
      this.popover_state[issue_we_vote_id] = {show: false, timer: null};
    }
    this.popover_state[issue_we_vote_id].show = false;
    clearTimeout(this.popover_state[issue_we_vote_id].timer);
    this.popover_state[issue_we_vote_id].timer = setTimeout(() => {
      if (!this.popover_state[issue_we_vote_id].show) {
        if (this.refs[`issue-overlay-${issue_we_vote_id}`]) {
          this.refs[`issue-overlay-${issue_we_vote_id}`].hide();
        }
      }
    }, 100);
  }

  onTriggerToggle (e, issue_we_vote_id) {
    if (this.mobile) {
      e.preventDefault();
      e.stopPropagation();

      if (!this.popover_state[issue_we_vote_id]) {
        // If it wasn't created, create it now
        this.popover_state[issue_we_vote_id] = {show: false, timer: null};
      }

      if (this.popover_state[issue_we_vote_id].show) {
        this.onTriggerLeave(issue_we_vote_id);
      } else {
        this.onTriggerEnter(issue_we_vote_id);
      }
    }
  }

  render () {
    if (this.state.issues_to_display === undefined) {
      return null;
    }

    let local_counter = 0;
    const issues_html_to_display = this.state.issues_to_display.map( (one_issue) => {
      if (!one_issue) {
        return null;
      }
      local_counter++;
      // console.log("IssuesDisplayListWithOrganizationPopovers one_issue: ", one_issue);
      let issue_we_vote_id = one_issue.issue_we_vote_id;

      // Once we have more organizations than we want to show, put them into a drop-down
      if (local_counter <= this.state.maximum_issues_display) {
        this.popover_state[issue_we_vote_id] = {show: false, timer: null};

        let issuePopover = <Popover id={`issue-popover-${issue_we_vote_id}`}
                                    onMouseOver={() => this.onTriggerEnter(issue_we_vote_id)}
                                    onMouseOut={() => this.onTriggerLeave(issue_we_vote_id)}
                                    className="issue-popover"
                            >
            <IssueCard ballotItemWeVoteId={this.state.ballotItemWeVoteId}
                       followToggleOn={this.props.toFollow}
                       issue={one_issue}
                       issueImageSize={"MEDIUM"}
            />
            <OrganizationListUnderIssue issue_we_vote_id={issue_we_vote_id} />
          </Popover>;

                  // onClick={(e) => this.onTriggerToggle(e, issue_we_vote_id)}
        return <OverlayTrigger key={`trigger-${issue_we_vote_id}`}
                               ref={`issue-overlay-${issue_we_vote_id}`}
                               onMouseOver={() => this.onTriggerEnter(issue_we_vote_id)}
                               onMouseOut={() => this.onTriggerLeave(issue_we_vote_id)}
                               onExiting={() => this.onTriggerLeave(issue_we_vote_id)}
                               trigger={this.props.visibility === "mobile" ? "click" : ["focus", "hover", "click"]}
                               rootClose
                               placement="bottom"
                               overlay={issuePopover}
                >
          <span className="">
            <IssueImageDisplay issue={one_issue}
                               issueImageSize={this.state.issueImageSize}
                               showPlaceholderImage
                               isVoterFollowingThisIssue={IssueStore.isVoterFollowingThisIssue(issue_we_vote_id)}/>
          </span>
        </OverlayTrigger>;
      } else {
        return null;
      }
    });

    return <span>
          {issues_html_to_display}
      </span>;
  }
}
