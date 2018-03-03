import React, { Component, PropTypes } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { findDOMNode } from "react-dom";
import $ from "jquery";
import VoterGuideStore from "../../stores/VoterGuideStore";
import IssuesDisplayListWithOrganizationPopovers from "../Issues/IssuesDisplayListWithOrganizationPopovers";
import IssueStore from "../../stores/IssueStore";


// Show a voter a horizontal list of all of the issues they are following that relate to this ballot item,
//  with a dropdown under each one that has all of the organizations they can follow underneath.
export default class IssuesFollowedByBallotItemDisplayList extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string,
    ballotItemWeVoteId: PropTypes.string.isRequired,
    popoverBottom: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      transitioning: false,
      showModal: false,
      can_scroll_left_desktop: false,
      can_scroll_left_mobile: false,
      can_scroll_right_desktop: true,
      can_scroll_right_mobile: true,
      issues_under_this_ballot_item: [],
      issues_under_this_ballot_item_voter_is_following: [],
      issues_under_this_ballot_item_voter_not_following: [],
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
      ballotItemWeVoteId: this.props.ballotItemWeVoteId,
      ballot_item_display_name: this.props.ballot_item_display_name ? this.props.ballot_item_display_name : "this candidate",
      issues_under_this_ballot_item: IssueStore.getIssuesUnderThisBallotItem(this.props.ballotItemWeVoteId),
      issues_under_this_ballot_item_voter_is_following: IssueStore.getIssuesUnderThisBallotItemVoterIsFollowing(this.props.ballotItemWeVoteId),
      issues_under_this_ballot_item_voter_not_following: IssueStore.getIssuesUnderThisBallotItemVoterNotFollowing(this.props.ballotItemWeVoteId),
      issues_voter_is_following: IssueStore.getIssuesVoterIsFollowing(),
    });
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      ballotItemWeVoteId: nextProps.ballotItemWeVoteId,
      ballot_item_display_name: nextProps.ballot_item_display_name ? nextProps.ballot_item_display_name : "this candidate",
      issues_under_this_ballot_item: IssueStore.getIssuesUnderThisBallotItem(nextProps.ballotItemWeVoteId),
      issues_under_this_ballot_item_voter_is_following: IssueStore.getIssuesUnderThisBallotItemVoterIsFollowing(nextProps.ballotItemWeVoteId),
      issues_under_this_ballot_item_voter_not_following: IssueStore.getIssuesUnderThisBallotItemVoterNotFollowing(nextProps.ballotItemWeVoteId),
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
      issues_under_this_ballot_item: IssueStore.getIssuesUnderThisBallotItem(this.state.ballotItemWeVoteId),
      issues_under_this_ballot_item_voter_is_following: IssueStore.getIssuesUnderThisBallotItemVoterIsFollowing(this.state.ballotItemWeVoteId),
      issues_under_this_ballot_item_voter_not_following: IssueStore.getIssuesUnderThisBallotItemVoterNotFollowing(this.state.ballotItemWeVoteId),
      issues_voter_is_following: IssueStore.getIssuesVoterIsFollowing(),
    });
  }

  onVoterGuideStoreChange () {
    // We just want to trigger a re-render
    this.setState({ transitioning: false });
    // console.log("onVoterGuideStoreChange");
  }

  scrollLeft (visible_tag) {
    const element = findDOMNode(this.refs[`${this.props.ballotItemWeVoteId}-issue-list-${visible_tag}`]);
    let position = $(element).scrollLeft();
    let width = Math.round($(element).width());
    $(element).animate({
      scrollLeft: position - width,
    }, 350, () => {
      let new_position = $(element).scrollLeft();
      if (visible_tag === "desktop") {
        this.setState({
          can_scroll_left_desktop: new_position > 0,
          can_scroll_right_desktop: true,
        });
      } else {
        this.setState({
          can_scroll_left_mobile: new_position > 0,
          can_scroll_right_mobile: true,
        });
      }
    });
  }

  scrollRight (visible_tag) {
    const element = findDOMNode(this.refs[`${this.props.ballotItemWeVoteId}-issue-list-${visible_tag}`]);
    let position = $(element).scrollLeft();
    let width = Math.round($(element).width());
    $(element).animate({
      scrollLeft: position + width,
    }, 350, () => {
      let new_position = $(element).scrollLeft();
      if (visible_tag === "desktop") {
        this.setState({
          can_scroll_left_desktop: new_position > 0,
          can_scroll_right_desktop: position + width === new_position,
        });
      } else {
        this.setState({
          can_scroll_left_mobile: new_position > 0,
          can_scroll_right_mobile: position + width === new_position,
        });
      }
    });
  }

  render () {
    let issues_under_this_ballot_item_voter_is_following_found = this.state.issues_under_this_ballot_item_voter_is_following && this.state.issues_under_this_ballot_item_voter_is_following.length;
    let issues_under_this_ballot_item_voter_is_not_following = this.state.issues_under_this_ballot_item_voter_not_following && this.state.issues_under_this_ballot_item_voter_not_following.length;
    // console.log("this.state.issues_under_this_ballot_item_voter_is_following: ", this.state.issues_under_this_ballot_item_voter_is_following);
    // console.log("this.state.issues_under_this_ballot_item_voter_not_following: ", this.state.issues_under_this_ballot_item_voter_not_following);
    if (!issues_under_this_ballot_item_voter_is_following_found && !issues_under_this_ballot_item_voter_is_not_following) {
      return null;
    }

    let issues_count = issues_under_this_ballot_item_voter_is_following_found + issues_under_this_ballot_item_voter_is_not_following;
    // console.log(issues_count);

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
        <span className="issues-list-stacked__support-label u-cursor--pointer u-no-break">Related Issues&nbsp;<i className="fa fa-info-circle fa-md issues-list-stacked__info-icon-for-popover hidden-print" aria-hidden="true" />&nbsp;</span>
      </OverlayTrigger>;

    return (
      <div className="issues-list-stacked__support-list u-flex u-justify-between u-items-center">
        {/* Click to scroll left through list Desktop */}
        { issues_count > 7 && this.state.can_scroll_left_desktop ?
          <i className="fa fa-2x fa-chevron-left issues-list-stacked__support-list__scroll-icon u-cursor--pointer hidden-xs" aria-hidden="true" onClick={this.scrollLeft.bind(this, "desktop")} /> :
          <i className="fa fa-2x fa-chevron-left network-positions-stacked__support-list__scroll-icon-disabled hidden-xs" aria-hidden="true" />
        }
        {/* Click to scroll left through list Mobile */}
        { issues_count > 4 && this.state.can_scroll_left_mobile ?
          <i className="fa fa-2x fa-chevron-left issues-list-stacked__support-list__scroll-icon u-cursor--pointer visible-xs" aria-hidden="true" onClick={this.scrollLeft.bind(this, "mobile")} /> :
          <i className="fa fa-2x fa-chevron-left network-positions-stacked__support-list__scroll-icon-disabled visible-xs" aria-hidden="true" />
        }
        <div className="issues-list-stacked__support-list__container-wrap">
          {/* Show a break-down of the current positions in your network */}
          <span ref={`${this.props.ballotItemWeVoteId}-issue-list-desktop`} className="issues-list-stacked__support-list__container u-flex u-justify-between u-items-center u-inset__v--xs hidden-xs">
            <ul className="issues-list-stacked__support-list__items">
              <li className="issues-list-stacked__support-list__item">
                {issuesLabel}

                {/* Issues the voter is already following */}
                <IssuesDisplayListWithOrganizationPopovers ballotItemWeVoteId={this.state.ballotItemWeVoteId}
                                                           issueImageSize={"MEDIUM"}
                                                           issueListToDisplay={this.state.issues_under_this_ballot_item_voter_is_following}
                                                           visibility="desktop"
                                                           toFollow />
                {/* Issues the voter is not following yet */}
                <IssuesDisplayListWithOrganizationPopovers ballotItemWeVoteId={this.state.ballotItemWeVoteId}
                                                           issueImageSize={"MEDIUM"}
                                                           issueListToDisplay={this.state.issues_under_this_ballot_item_voter_not_following}
                                                           visibility="desktop"
                                                           toFollow />
              </li>
            </ul>
          </span>
          <span ref={`${this.props.ballotItemWeVoteId}-issue-list-mobile`} className="issues-list-stacked__support-list__container u-flex u-justify-between u-items-center u-inset__v--xs visible-xs">
            <ul className="issues-list-stacked__support-list__items">
              <li className="issues-list-stacked__support-list__item">
                {issuesLabel}

                {/* Issues the voter is already following */}
                <IssuesDisplayListWithOrganizationPopovers ballotItemWeVoteId={this.state.ballotItemWeVoteId}
                                                           issueImageSize={"MEDIUM"}
                                                           issueListToDisplay={this.state.issues_under_this_ballot_item_voter_is_following}
                                                           visibility="mobile"
                                                           toFollow />
                {/* Issues the voter is not following yet */}
                <IssuesDisplayListWithOrganizationPopovers ballotItemWeVoteId={this.state.ballotItemWeVoteId}
                                                           issueImageSize={"MEDIUM"}
                                                           issueListToDisplay={this.state.issues_under_this_ballot_item_voter_not_following}
                                                           visibility="mobile"
                                                           toFollow />
              </li>
            </ul>
          </span>
        </div>
        {/* Click to scroll right through list Desktop */}
        { issues_count > 7 && this.state.can_scroll_right_desktop ?
          <i className="fa fa-2x fa-chevron-right issues-list-stacked__support-list__scroll-icon u-cursor--pointer hidden-xs" aria-hidden="true" onClick={this.scrollRight.bind(this, "desktop")} /> :
          <i className="fa fa-2x fa-chevron-right network-positions-stacked__support-list__scroll-icon-disabled hidden-xs" aria-hidden="true" />
        }
        {/* Click to scroll right through list Mobile */}
        { issues_count > 4 && this.state.can_scroll_right_mobile ?
          <i className="fa fa-2x fa-chevron-right issues-list-stacked__support-list__scroll-icon u-cursor--pointer visible-xs" aria-hidden="true" onClick={this.scrollRight.bind(this, "mobile")} /> :
          <i className="fa fa-2x fa-chevron-right network-positions-stacked__support-list__scroll-icon-disabled visible-xs" aria-hidden="true" />
        }
      </div>
    );
  }
}
