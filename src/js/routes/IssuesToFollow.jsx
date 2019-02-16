import React, { Component } from 'react';
import { Link } from 'react-router';
import { _ } from 'lodash';
import Helmet from 'react-helmet';
import IssueActions from '../actions/IssueActions';
import IssueFollowToggleSquare from '../components/Issues/IssueFollowToggleSquare';
import IssueStore from '../stores/IssueStore';
import { renderLog } from '../utils/logging';
import SearchBar from '../components/Search/SearchBar';

export default class IssuesToFollow extends Component {
  constructor (props) {
    super(props);
    this.state = {
      issuesToFollow: [],
      searchQuery: '',
    };

    this.searchFunction = this.searchFunction.bind(this);
    this.clearFunction = this.clearFunction.bind(this);
  }

  componentDidMount () {
    IssueActions.retrieveIssuesToFollow();
    this.issueStoreListener = IssueStore.addListener(this._onIssueStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
  }

  _onIssueStoreChange () {
    this.setState({
      issuesToFollow: IssueStore.getIssuesVoterCanFollow(),
    });
  }

  searchFunction (searchQuery) {
    this.setState({ searchQuery });
  }

  clearFunction () {
    this.searchFunction('');
  }

  render () {
    const { issuesToFollow, searchQuery } = this.state;
    renderLog(__filename);
    let issueList = [];
    if (issuesToFollow) {
      issueList = issuesToFollow;
    }

    if (searchQuery.length > 0) {
      const searchQueryLowercase = searchQuery.toLowerCase();
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
        editMode
        isFollowing={false}
        grid="col-4 col-sm-2"
      />
    ));

    return (
      <div className="opinions-followed__container">
        <Helmet title="Issues You Follow - We Vote" />
        <section className="card">
          <div className="card-main">
            <h1 className="h1">Issues You Can Follow</h1>
            <p>
              Follow the values and issues you care about, so we can highlight the organizations that care about the same issues you do.
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
              { this.state.issuesToFollow && this.state.issuesToFollow.length ?
                issueListForDisplay :
                null
              }
            </div>
            <Link className="pull-left" to="/issues_followed">Issues you are following</Link>
            <br />
          </div>
        </section>
      </div>
    );
  }
}
