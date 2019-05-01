import React, { Component } from 'react';
import { _ } from 'lodash';
import Helmet from 'react-helmet';
import IssueActions from '../../actions/IssueActions';
import IssueStore from '../../stores/IssueStore';
import { renderLog } from '../../utils/logging';
import SearchBar from '../../components/Search/SearchBar';
import IssueCard from '../../components/Values/IssueCard';

export default class ValuesList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      allIssues: [],
      searchQuery: '',
    };

    this.searchFunction = this.searchFunction.bind(this);
    this.clearFunction = this.clearFunction.bind(this);
  }

  componentDidMount () {
    IssueActions.retrieveIssuesToFollow();
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
  }

  onIssueStoreChange () {
    this.setState({
      allIssues: IssueStore.getAllIssues(),
    });
  }

  searchFunction (searchQuery) {
    this.setState({ searchQuery });
  }

  clearFunction () {
    this.searchFunction('');
  }

  render () {
    const { allIssues, searchQuery } = this.state;
    renderLog(__filename);
    let issueList = [];
    if (allIssues) {
      issueList = allIssues;
    }

    if (searchQuery.length > 0) {
      const searchQueryLowercase = searchQuery.toLowerCase();
      issueList = _.filter(issueList,
        oneIssue => oneIssue.issue_name.toLowerCase().includes(searchQueryLowercase) ||
            oneIssue.issue_description.toLowerCase().includes(searchQueryLowercase));
    }

    const issueListForDisplay = issueList.map(issue => (
      <IssueCard
        followToggleOn
        issue={issue}
        issueImageSize="SMALL"
        key={`issue-list-key-${issue.issue_we_vote_id}`}
      />
    ));

    return (
      <div className="opinions-followed__container">
        <Helmet title="Values - We Vote" />
        <section className="card">
          <div className="card-main">
            <h1 className="h1">Values</h1>
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
            <div className="network-issues-list voter-guide-list">
              { this.state.allIssues && this.state.allIssues.length ? (
                <div className="row">
                  {issueListForDisplay}
                </div>
              ) :
                null
              }
            </div>
          </div>
        </section>
      </div>
    );
  }
}
