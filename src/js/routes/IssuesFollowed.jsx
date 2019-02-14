import React, { Component } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { _ } from 'lodash';
import { isCordova } from '../utils/cordovaUtils';
import IssueActions from '../actions/IssueActions';
import IssueFollowToggleSquare from '../components/Issues/IssueFollowToggleSquare';
import IssueStore from '../stores/IssueStore';
import { renderLog } from '../utils/logging';
import SearchBar from '../components/Search/SearchBar';

export default class IssuesFollowed extends Component {
  constructor (props) {
    super(props);
    this.state = {
      editMode: false,
      issuesFollowed: [],
      searchQuery: '',
    };

    this.searchFunction = this.searchFunction.bind(this);
    this.clearFunction = this.clearFunction.bind(this);
    this.onKeyDownEditMode = this.onKeyDownEditMode.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  componentDidMount () {
    const currentElectionNotSpecified = IssueStore.getPreviousGoogleCivicElectionId() === 0;
    const getIssuesVoterIsFollowingFound = IssueStore.getIssuesVoterIsFollowing().count !== 0;
    if (currentElectionNotSpecified || !getIssuesVoterIsFollowingFound) {
      IssueActions.issuesRetrieve();
    }

    this.setState({
      issuesFollowed: IssueStore.getIssuesVoterIsFollowing(),
    });

    this.issueStoreListener = IssueStore.addListener(this._onIssueStoreChange.bind(this));
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

  searchFunction (searchQuery) {
    this.setState({ searchQuery });
  }

  clearFunction () {
    this.searchFunction('');
  }

  render () {
    const { editMode } = this.state;
    renderLog(__filename);
    let issueList = [];
    if (this.state.issuesFollowed) {
      issueList = this.state.issuesFollowed;
    }

    if (this.state.searchQuery.length > 0) {
      const searchQueryLowercase = this.state.searchQuery.toLowerCase();
      issueList = _.filter(issueList,
        oneIssue => oneIssue.issue_name.toLowerCase().includes(searchQueryLowercase) ||
            oneIssue.issue_description.toLowerCase().includes(searchQueryLowercase));
    }

    const issueListForDisplay = issueList.map(issue => (
      <IssueFollowToggleSquare
        key={issue.issue_we_vote_id}
        issueWeVoteId={issue.issue_we_vote_id}
        issueName={issue.issue_name}
        issueDescription={issue.issue_description}
        issueImageUrl={issue.issue_image_url}
        issueIconLocalPath={issue.issue_icon_local_path}
        editMode={editMode}
        isFollowing
        grid="col-4 col-sm-2"
        readOnly
      />
    ));

    return (
      <div className={`opinions-followed__container ${isCordova() && 'opinions-followed__container-cordova'}`}>
        <Helmet title="Issues You Follow - We Vote" />
        <section className="card">
          <div className="card-main">
            <h1 className="h1">Issues You Are Following</h1>
            <a
              className="fa-pull-right"
              onKeyDown={this.onKeyDownEditMode}
              onClick={this.toggleEditMode}
            >
              {editMode ? 'Done Editing' : 'Edit'}
            </a>
            <p>
              These are the issues you currently follow. We recommend organizations that you might want to learn from
              based on these issues.
            </p>
            <SearchBar
              clearButton
              searchButton
              placeholder="Search by name or Description"
              searchFunction={this.searchFunction}
              clearFunction={this.clearFunction}
              searchUpdateDelayTime={0}
            />
            <br />
            <div className="network-issues-list voter-guide-list card">
              { issueList.length ?
                issueListForDisplay :
                <h4 className="intro-modal__default-text">You are not following any issues yet.</h4>
              }
            </div>
            <Link className="pull-left" to="/issues_to_follow">Find Issues to follow</Link>
            <br />
          </div>
        </section>
      </div>
    );
  }
}
