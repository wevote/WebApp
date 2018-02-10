import React, { Component, PropTypes } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import IssueCard from "./IssueCard";
import IssueTinyImageDisplay from "./IssueTinyImageDisplay";
import OrganizationListUnderIssue from "./OrganizationListUnderIssue";

// We use this for IssuesFollowedDisplayList, to show a voter a horizontal list of all of their
// issues, with a drop down under each one that has all of the organizations they can follow underneath.
export default class IssuesDisplayListWithOrganizationPopovers extends Component {

  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    issueListToDisplay: PropTypes.array,
    instantRefreshOn: PropTypes.bool,
    maximumIssuesToDisplay: PropTypes.number,
  };

  constructor (props) {
    super(props);

    this.popover_state = {};
    this.mobile = "ontouchstart" in document.documentElement;

    this.state = {
      issues_to_display: [],
      maximum_issues_display: 0,
    };
  }

  componentDidMount () {
    this.setState({
      issues_to_display: this.props.issueListToDisplay,
      maximum_issues_display: this.props.maximumIssuesToDisplay ? this.props.maximumIssuesToDisplay : 20,
    });
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
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
      local_counter++;
      console.log("IssuesDisplayListWithOrganizationPopovers one_issue: ", one_issue);
      let issue_we_vote_id = one_issue.issue_we_vote_id;

      // Once we have more organizations than we want to show, put them into a drop-down
      if (local_counter <= this.state.maximum_issues_display) {
        this.popover_state[issue_we_vote_id] = {show: false, timer: null};

        let issuePopover = <Popover id={`issue-popover-${issue_we_vote_id}`}
                                    onMouseOver={() => this.onTriggerEnter(issue_we_vote_id)}
                                    onMouseOut={() => this.onTriggerLeave(issue_we_vote_id)}
                                    className="issue-popover"
                            >
            <IssueCard issue={one_issue}
                       ballotItemWeVoteId={this.state.ballot_item_we_vote_id}
                       followToggleOn />
            <OrganizationListUnderIssue issue_we_vote_id={issue_we_vote_id} />
          </Popover>;

                  // onClick={(e) => this.onTriggerToggle(e, issue_we_vote_id)}
        return <OverlayTrigger key={`trigger-${issue_we_vote_id}`}
                               ref={`issue-overlay-${issue_we_vote_id}`}
                               onMouseOver={() => this.onTriggerEnter(issue_we_vote_id)}
                               onMouseOut={() => this.onTriggerLeave(issue_we_vote_id)}
                               onExiting={() => this.onTriggerLeave(issue_we_vote_id)}
                               trigger={["click", "focus", "hover"]}
                               rootClose
                               placement="bottom"
                               overlay={issuePopover}
                >
          <span className="">
            <IssueTinyImageDisplay issue={one_issue} showPlaceholderImage />
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
