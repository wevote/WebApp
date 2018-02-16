import React, { Component } from "react";
import VoterGuideStore from "../../stores/VoterGuideStore";
import IssuesDisplayListWithOrganizationPopovers from "../Issues/IssuesDisplayListWithOrganizationPopovers";
import IssueStore from "../../stores/IssueStore";


// Show a voter a horizontal list of all of their issues,
//  with a dropdown under each one that has all of the organizations they can follow underneath.
export default class IssuesFollowedDisplayList extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      transitioning: false,
      showModal: false,
      issues_voter_is_following: [],
      maximum_organization_display: 4,
    };
  }

  componentDidMount () {
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.onVoterGuideStoreChange();
    this.setState({
      issues_voter_is_following: IssueStore.getIssuesVoterIsFollowing(),
    });
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
    this.voterGuideStoreListener.remove();
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
    let issues_voter_is_following_mobile = this.state.issues_voter_is_following.slice(0, 2);
    let issues_voter_is_following_desktop = this.state.issues_voter_is_following.slice(0, 4);
    return <span className="">
      {/* We want to display the images of the issues in the list we pass in */}
      <span className="visible-xs">
        <IssuesDisplayListWithOrganizationPopovers issueImageSize={"LARGE"}
                                                   issueListToDisplay={issues_voter_is_following_mobile} />
      </span>
      <span className="hidden-xs">
        <IssuesDisplayListWithOrganizationPopovers issueImageSize={"LARGE"}
                                                   issueListToDisplay={issues_voter_is_following_desktop} />
      </span>
    </span>;
  }
}
