import React, { Component } from 'react';
import IssuesDisplayListWithOrganizationPopovers from './IssuesDisplayListWithOrganizationPopovers';
import IssueStore from '../../stores/IssueStore';
import { renderLog } from '../../utils/logging';


// Show a voter a horizontal list of all of their issues,
//  with a dropdown under each one that has all of the organizations they can follow underneath.
export default class IssuesFollowedDisplayList extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      issuesVoterIsFollowing: [],
    };
  }

  componentDidMount () {
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.setState({
      issuesVoterIsFollowing: IssueStore.getIssuesVoterIsFollowing(),
    });
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
  }

  onIssueStoreChange () {
    this.setState({
      issuesVoterIsFollowing: IssueStore.getIssuesVoterIsFollowing(),
    });
  }

  render () {
    renderLog(__filename);

    // console.log("this.state.issuesVoterIsFollowing: ", this.state.issuesVoterIsFollowing);
    const issuesVoterIsFollowingMobile = this.state.issuesVoterIsFollowing.slice(0, 2);
    const issuesVoterIsFollowingDesktop = this.state.issuesVoterIsFollowing.slice(0, 4);
    return (
      <span className="">
        {/* We want to display the images of the issues in the list we pass in */}
        <span className="d-block d-sm-none">
          <IssuesDisplayListWithOrganizationPopovers
            issueImageSize="LARGE"
            issueListToDisplay={issuesVoterIsFollowingMobile}
            popoverBottom
          />
        </span>
        <span className="d-none d-sm-block">
          <IssuesDisplayListWithOrganizationPopovers
            issueImageSize="LARGE"
            issueListToDisplay={issuesVoterIsFollowingDesktop}
            popoverBottom
          />
        </span>
      </span>
    );
  }
}
