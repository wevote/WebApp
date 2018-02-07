import React, { Component, PropTypes } from "react";
import VoterGuideStore from "../../stores/VoterGuideStore";
import IssuesFollowedAsTinyImages from "../Issues/IssuesFollowedAsTinyImages";
import IssueStore from "../../stores/IssueStore";
import SupportStore from "../../stores/SupportStore";

// Show a voter a horizontal list of all of their issues,
//  with a dropdown under each one that has all of the organizations they can follow underneath.
export default class OrganizationsDisplayedUnderIssuesFollowed extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string,
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
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.setState({
      issues_voter_is_following: IssueStore.getIssuesVoterIsFollowing(),
      supportProps: SupportStore.get(this.props.we_vote_id),
    });
  }

  componentWillUnmount () {
    this.voterGuideStoreListener.remove();
    this.supportStoreListener.remove();
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

  onSupportStoreChange () {
    this.setState({
      supportProps: SupportStore.get(this.props.we_vote_id),
      transitioning: false,
    });
  }

  render () {
    // console.log("this.state.issues_voter_is_following: ", this.state.issues_voter_is_following);
    return <span className="">
      {/* We want to display the images of the issues in the list we pass in */}
      <IssuesFollowedAsTinyImages issueListToDisplay={this.state.issues_voter_is_following} />
    </span>;
  }
}
