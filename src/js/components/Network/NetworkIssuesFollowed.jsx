import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import IssueActions from "../../actions/IssueActions";
import IssueFollowToggleSquare from "../Issues/IssueFollowToggleSquare";
import IssueStore from "../../stores/IssueStore";
import { renderLog } from "../../utils/logging";

export default class NetworkIssuesFollowed extends Component {
  static propTypes = {
    children: PropTypes.object,
    history: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      edit_mode: false,
      issues_followed: [],
    };
  }

  componentDidMount () {
    if (IssueStore.getPreviousGoogleCivicElectionId() < 1) {
      IssueActions.issuesRetrieve();
    }

    this.issueStoreListener = IssueStore.addListener(this._onIssueStoreChange.bind(this));
    this._onIssueStoreChange();
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
  }

  _onIssueStoreChange () {
    this.setState({
      issues_followed: IssueStore.getIssuesVoterIsFollowing(),
    });
  }

  getCurrentRoute () {
    return "/issues_followed";
  }

  toggleEditMode () {
    this.setState({ edit_mode: !this.state.edit_mode });
  }

  onKeyDownEditMode (event) {
    const enterAndSpaceKeyCodes = [13, 32];
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      this.setState({ edit_mode: !this.state.edit_mode });
    }
  }

  render () {
    renderLog(__filename);
    let issueList = [];
    if (this.state.issues_followed) {
      issueList = this.state.issues_followed;
    }

    const ISSUES_TO_SHOW = 6;

    const isFollowing = true;
    let issueCount = 0;
    const issueListForDisplay = issueList.map((issue) => {
      issueCount++;
      if (issueCount > ISSUES_TO_SHOW) {
        return null;
      } else {
        return (
          <IssueFollowToggleSquare
            key={issue.issue_we_vote_id}
            issue_we_vote_id={issue.issue_we_vote_id}
            issue_name={issue.issue_name}
            issue_description={issue.issue_description}
            issue_image_url={issue.issue_image_url}
            edit_mode={this.state.edit_mode}
            is_following={isFollowing}
            grid="col-sm-6"
            read_only
          />
        );
      }
    });

    return (
      <div className="opinions-followed__container">
        <section className="card">
          <div className="card-main">
            <h1 className="h4">Issues You Are Following</h1>
            <div className="network-issues-list voter-guide-list card">
              <div className="card-child__list-group clearfix">
                { issueListForDisplay }
              </div>
              <div>
                {
                  this.state.issues_followed.length > 0 ?
                    <span><Link to="/issues_followed">See All</Link></span> :
                    <span>You are not following any issues yet.</span>
                }
              </div>
            </div>
            <br />
          </div>
        </section>
      </div>
    );
  }
}
