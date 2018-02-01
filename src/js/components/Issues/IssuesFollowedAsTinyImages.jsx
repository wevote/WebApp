import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import { OverlayTrigger, Popover } from "react-bootstrap";
import IssueCard from "./IssueCard";
// import OrganizationsNotShownList from "./OrganizationsNotShownList";
import IssueTinyImageDisplay from "./IssueTinyImageDisplay";

// This will be called by VoterIssuesForBallotItem, which will pull from the store all positions about this candidate
// and display them under each issue
// We can also use this for OrganizationsDisplayedUnderIssuesFollowed, to show a voter a horizontal list of all of their
// issues, with a drop down under each one that has all of the organizations they can follow underneath.
export default class IssuesFollowedAsTinyImages extends Component {

  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    issueListToDisplay: PropTypes.array,
    instantRefreshOn: PropTypes.bool,
    maximumIssuesToDisplay: PropTypes.number,
    supportProps: PropTypes.object,
  };

  constructor (props) {
    super(props);

    this.popover_state = {};
    this.mobile = "ontouchstart" in document.documentElement;

    this.state = {
      issues_to_display: [],
      // ballot_item_we_vote_id: "",
      maximum_issues_display: 0,
      // supportProps: this.props.supportProps,
    };
  }

  componentDidMount () {
    this.setState({
      issues_to_display: this.props.issueListToDisplay,
      // ballot_item_we_vote_id: this.props.ballotItemWeVoteId,
      maximum_issues_display: this.props.maximumIssuesToDisplay ? this.props.maximumIssuesToDisplay : 20,
      // supportProps: this.props.supportProps,
    });
  }

  componentWillReceiveProps (nextProps) {
    //if (nextProps.instantRefreshOn ) {
      // NOTE: This is off because we don't want the organization to disappear from the "More opinions" list when clicked
      this.setState({
        issues_to_display: nextProps.issueListToDisplay,
        // ballot_item_we_vote_id: nextProps.ballotItemWeVoteId,
        maximum_issues_display: this.props.maximumIssuesToDisplay ? nextProps.maximumIssuesToDisplay : 20,
        // supportProps: nextProps.supportProps,
      });
    //}
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

    let is_empty;
    // if (this.state.supportProps !== undefined) {
    //   let { support_count, oppose_count } = this.state.supportProps;
    //   if (support_count !== undefined && oppose_count !== undefined) {
    //     is_empty = support_count === 0 && oppose_count === 0;
    //   }
    // }
    //
    let local_counter = 0;
    // let orgs_not_shown_count = 0;
    // let orgs_not_shown_list = [];
    // let one_issue_for_organization_card;
    // if (this.state.organizations_to_follow &&
    //   this.state.organizations_to_follow.length > this.state.maximum_issues_display) {
    //   orgs_not_shown_count = this.state.organizations_to_follow.length - this.state.maximum_issues_display;
    //   orgs_not_shown_list = this.state.organizations_to_follow.slice(this.state.maximum_issues_display);
    // }
    const issues_html_to_display = this.state.issues_to_display.map( (one_issue) => {
      local_counter++;
      // console.log("IssuesFollowedAsTinyImages one_issue: ", one_issue);
      let issue_we_vote_id = one_issue.issue_we_vote_id;

      // Once we have more organizations than we want to show, put them into a drop-down
      if (local_counter > this.state.maximum_issues_display) {
        // if (local_counter === this.state.maximum_issues_display + 1) {
        //   // If here, we want to show how many organizations there are to follow
        //   this.popover_state[orgs_not_shown_count] = {show: false, timer: null};
        //   let issuePopover = <Popover
        //       id={`issue-popover-${orgs_not_shown_count}`}
        //       onMouseOver={() => this.onTriggerEnter(orgs_not_shown_count)}
        //       onMouseOut={() => this.onTriggerLeave(orgs_not_shown_count)}
        //       className="card-popover">
        //       <OrganizationsNotShownList orgs_not_shown_list={orgs_not_shown_list} />
        //     </Popover>;
        //
        //   return <OverlayTrigger
        //       key={`trigger-${orgs_not_shown_count}`}
        //       ref={`issue-overlay-${orgs_not_shown_count}`}
        //       onMouseOver={() => this.onTriggerEnter(orgs_not_shown_count)}
        //       onMouseOut={() => this.onTriggerLeave(orgs_not_shown_count)}
        //       onExiting={() => this.onTriggerLeave(orgs_not_shown_count)}
        //       trigger={["focus", "hover"]}
        //       rootClose
        //       placement="bottom"
        //       overlay={issuePopover}>
        //     <span className="position-rating__source with-popover">
        //       <Link to="/opinions"> +{orgs_not_shown_count}</Link>
        //     </span>
        //   </OverlayTrigger>;
        // } else {
        //   return "";
        // }
      } else {

        this.popover_state[issue_we_vote_id] = {show: false, timer: null};

        // let issueLink = one_organization.organization_twitter_handle ?
        //                           "/" + one_organization.organization_twitter_handle :
        //                           "/voterguide/" + one_organization.organization_we_vote_id;
        let issueLink = "";

        let issuePopover = <Popover id={`issue-popover-${issue_we_vote_id}`}
                                    onMouseOver={() => this.onTriggerEnter(issue_we_vote_id)}
                                    onMouseOut={() => this.onTriggerLeave(issue_we_vote_id)}
                                    className="issue-popover"
        >
            <IssueCard issue={one_issue}
                       ballotItemWeVoteId={this.state.ballot_item_we_vote_id}
                       followToggleOn />
          </Popover>;

        return <OverlayTrigger key={`trigger-${issue_we_vote_id}`}
                               ref={`issue-overlay-${issue_we_vote_id}`}
                               onMouseOver={() => this.onTriggerEnter(issue_we_vote_id)}
                               onMouseOut={() => this.onTriggerLeave(issue_we_vote_id)}
                               onExiting={() => this.onTriggerLeave(issue_we_vote_id)}
                               trigger={["focus", "hover"]}
                               rootClose
                               placement="bottom"
                               overlay={issuePopover}
        >
          <span className="">
            <Link key={`tiny-link-${issue_we_vote_id}`}
                  to={issueLink}
                  onClick={(e) => this.onTriggerToggle(e, issue_we_vote_id)}
                  className="u-no-underline"
            >
              <IssueTinyImageDisplay issue={one_issue} showPlaceholderImage />
            </Link>
          </span>
        </OverlayTrigger>;
      }
    });

    return <span className={ is_empty ? "" : "" }>
          {issues_html_to_display}
      </span>;
  }

}
