import React, { Component } from "react";
import PropTypes from "prop-types";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { isCordova } from "../../utils/cordovaUtils";
import IssueCard from "./IssueCard";
import IssueImageDisplay from "./IssueImageDisplay";
import IssueStore from "../../stores/IssueStore";
import OrganizationListUnderIssue from "./OrganizationListUnderIssue";
import { renderLog } from "../../utils/logging";

// We use this for IssuesFollowedDisplayList, to show a voter a horizontal list of all of their
// issues, with a drop down under each one that has all of the organizations they can follow underneath.
export default class IssuesDisplayListWithOrganizationPopovers extends Component {

  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    currentBallotIdInUrl: PropTypes.string,
    issueImageSize: PropTypes.string,
    issueListToDisplay: PropTypes.array,
    instantRefreshOn: PropTypes.bool,
    maximumIssuesToDisplay: PropTypes.number,
    toFollow: PropTypes.bool,
    overlayTriggerOnClickOnly: PropTypes.bool,
    urlWithoutHash: PropTypes.string,
    we_vote_id: PropTypes.string
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

  onTriggerEnter (issueWeVoteId) {
    if (this.refs[`issue-overlay-${issueWeVoteId}`]) {
      this.refs[`issue-overlay-${issueWeVoteId}`].show();
    }

    if (!this.popover_state[issueWeVoteId]) {
      // If it wasn't created, create it now
      this.popover_state[issueWeVoteId] = { show: false, timer: null };
    }

    clearTimeout(this.popover_state[issueWeVoteId].timer);
    if (!this.popover_state[issueWeVoteId]) {
      // If it wasn't created, create it now
      this.popover_state[issueWeVoteId] = { show: false, timer: null };
    }

    this.popover_state[issueWeVoteId].show = true;
  }

  onTriggerLeave (issueWeVoteId) {
    if (!this.popover_state[issueWeVoteId]) {
      // If it wasn't created, create it now
      this.popover_state[issueWeVoteId] = { show: false, timer: null };
    }

    this.popover_state[issueWeVoteId].show = false;
    clearTimeout(this.popover_state[issueWeVoteId].timer);
    this.popover_state[issueWeVoteId].timer = setTimeout(() => {
      if (!this.popover_state[issueWeVoteId].show) {
        if (this.refs[`issue-overlay-${issueWeVoteId}`]) {
          this.refs[`issue-overlay-${issueWeVoteId}`].hide();
        }
      }
    }, 100);
  }

  onTriggerToggle (e, issueWeVoteId) {
    if (this.mobile) {
      e.preventDefault();
      e.stopPropagation();

      if (!this.popover_state[issueWeVoteId]) {
        // If it wasn't created, create it now
        this.popover_state[issueWeVoteId] = { show: false, timer: null };
      }

      if (this.popover_state[issueWeVoteId].show) {
        this.onTriggerLeave(issueWeVoteId);
      } else {
        this.onTriggerEnter(issueWeVoteId);
      }
    }
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
      let issueWeVoteId = oneIssue.issue_we_vote_id;

      // Once we have more organizations than we want to show, put them into a drop-down
      if (localCounter <= this.state.maximum_issues_display) {
        this.popover_state[issueWeVoteId] = { show: false, timer: null };

        let issuePopover = <Popover id={`issue-popover-${issueWeVoteId}`}
                                    onMouseOver={() => this.onTriggerEnter(issueWeVoteId)}
                                    onMouseOut={() => this.onTriggerLeave(issueWeVoteId)}
                                    className="card-popover" title={<span onClick={() => this.onTriggerLeave(issueWeVoteId)}> &nbsp;
                                      <span className={`fa fa-times pull-right u-cursor--pointer ${isCordova() && "u-mobile-x"} `} aria-hidden="true" /> </span>}
                                    >
            <IssueCard ballotItemWeVoteId={this.state.ballotItemWeVoteId}
                       currentBallotIdInUrl={this.props.currentBallotIdInUrl}
                       followToggleOn={this.props.toFollow}
                       issue={oneIssue}
                       issueImageSize={"MEDIUM"}
                       urlWithoutHash={this.props.urlWithoutHash}
                       we_vote_id={this.props.we_vote_id}
            />
            <OrganizationListUnderIssue currentBallotIdInUrl={this.props.currentBallotIdInUrl}
                                        issue_we_vote_id={issueWeVoteId}
                                        urlWithoutHash={this.props.urlWithoutHash}
                                        we_vote_id={this.props.we_vote_id} />
          </Popover>;

        // onClick={(e) => this.onTriggerToggle(e, issueWeVoteId)}
        return <OverlayTrigger key={`trigger-${issueWeVoteId}`}
                               ref={`issue-overlay-${issueWeVoteId}`}
                               onMouseOver={() => this.onTriggerEnter(issueWeVoteId)}
                               onMouseOut={() => this.onTriggerLeave(issueWeVoteId)}
                               onExiting={() => this.onTriggerLeave(issueWeVoteId)}
                               trigger={this.props.overlayTriggerOnClickOnly ? "click" : ["focus", "hover", "click"]}
                               rootClose
                               placement="bottom"
                               overlay={issuePopover}
                >
          <span className="">
            <IssueImageDisplay issue={oneIssue}
                               issueImageSize={this.state.issueImageSize}
                               showPlaceholderImage
                               isVoterFollowingThisIssue={IssueStore.isVoterFollowingThisIssue(issueWeVoteId)}/>
          </span>
        </OverlayTrigger>;
      } else {
        return null;
      }
    });

    return <span>
          {issuesHtmlToDisplay}
      </span>;
  }
}
