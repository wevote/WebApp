import React, { Component, PropTypes } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import VoterGuideStore from "../../stores/VoterGuideStore";
import IssuesDisplayListWithOrganizationPopovers from "../Issues/IssuesDisplayListWithOrganizationPopovers";
import IssueStore from "../../stores/IssueStore";


// Show a voter a horizontal list of all of the issues they are following that relate to this ballot item,
//  with a dropdown under each one that has all of the organizations they can follow underneath.
export default class IssuesFollowedByBallotItemDisplayList extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string,
    ballotItemWeVoteId: PropTypes.string,
    popoverBottom: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      transitioning: false,
      showModal: false,
      issues_voter_is_following: [],
      maximum_organization_display: 4,
    };
    this.closeIssuesLabelPopover = this.closeIssuesLabelPopover.bind(this);
  }

  componentDidMount () {
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.onVoterGuideStoreChange();
    this.setState({
      ballot_item_display_name: this.props.ballot_item_display_name ? this.props.ballot_item_display_name : "this candidate",
      issues_voter_is_following: IssueStore.getIssuesVoterIsFollowing(),
    });
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      ballot_item_display_name: nextProps.ballot_item_display_name ? nextProps.ballot_item_display_name : "this candidate",
      issues_voter_is_following: IssueStore.getIssuesVoterIsFollowing(),
    });
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  closeIssuesLabelPopover () {
    this.refs["issues-overlay"].hide();
  }

  onIssueStoreChange () {
    this.setState({
      issues_voter_is_following: IssueStore.getIssuesVoterIsFollowing(),
    });
  }

  onVoterGuideStoreChange () {
    // We just want to trigger a re-render
    this.setState({ transitioning: false });
    // console.log("onVoterGuideStoreChange");
  }

  render () {
    // console.log("this.state.issues_voter_is_following: ", this.state.issues_voter_is_following);
    if (!this.state.issues_voter_is_following || this.state.issues_voter_is_following.length === 0) {
      return null;
    }

    const issuesLabelPopover =
      <Popover id="positions-popover-trigger-click-root-close"
               title={<span>Issues related to {this.state.ballot_item_display_name} <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" /></span>}
               onClick={this.closeIssuesLabelPopover}>
        See opinions about {this.state.ballot_item_display_name}, organized by issues you care about.
      </Popover>;

    const issuesLabel =
      <OverlayTrigger trigger="click"
                      ref="issues-overlay"
                      onExit={this.closeIssuesLabelPopover}
                      rootClose
                      placement={this.props.popoverBottom ? "bottom" : "top"}
                      overlay={issuesLabelPopover}>
        <span className="network-positions-stacked__support-label u-cursor--pointer u-no-break">Related Issues&nbsp;<i className="fa fa-info-circle fa-md network-positions-stacked__info-icon-for-popover hidden-print" aria-hidden="true" />&nbsp;</span>
      </OverlayTrigger>;

    return <span className="">
      {issuesLabel}

      {/* We want to display the images of the issues in the list we pass in */}
      <IssuesDisplayListWithOrganizationPopovers issueImageSize={"MEDIUM"}
                                                 issueListToDisplay={this.state.issues_voter_is_following} />
    </span>;
  }
}
