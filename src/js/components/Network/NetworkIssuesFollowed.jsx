import React, { Component } from 'react';
import { Link } from 'react-router';
import IssueActions from '../../actions/IssueActions';
import IssueFollowToggleSquare from '../Issues/IssueFollowToggleSquare';
import IssueStore from '../../stores/IssueStore';
import { renderLog } from '../../utils/logging';

export default class NetworkIssuesFollowed extends Component {
  constructor (props) {
    super(props);
    this.state = {
      editMode: false,
      issuesFollowed: [],
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

  onKeyDownEditMode (event) {
    const { editMode } = this.state;
    const enterAndSpaceKeyCodes = [13, 32];
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      this.setState({ editMode: !editMode });
    }
  }

  getCurrentRoute () { // eslint-disable-line
    return '/issues_followed';
  }

  _onIssueStoreChange () {
    this.setState({
      issuesFollowed: IssueStore.getIssuesVoterIsFollowing(),
    });
  }

  toggleEditMode () {
    const { editMode } = this.state;
    this.setState({ editMode: !editMode });
  }

  render () {
    renderLog(__filename);
    let issueList = [];
    if (this.state.issuesFollowed) {
      issueList = this.state.issuesFollowed;
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
            issueWeVoteId={issue.issue_we_vote_id}
            issueName={issue.issue_name}
            issueDescription={issue.issue_description}
            issueImageUrl={issue.issue_image_url}
            issueIconLocalPath={issue.issue_icon_local_path}
            editMode={this.state.editMode}
            isFollowing={isFollowing}
            grid="col-sm-6"
            readOnly
            sideBar
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
              { issueListForDisplay }
              <div>
                {
                  this.state.issuesFollowed.length > 0 ?
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
