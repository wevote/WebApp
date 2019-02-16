import React, { Component } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { _ } from 'lodash';
import IssueActions from '../../actions/IssueActions';
import IssueFollowToggleSquare from '../Issues/IssueFollowToggleSquare';
import IssueStore from '../../stores/IssueStore';
import SearchBar from '../Search/SearchBar';


export default class NetworkIssuesToFollow extends Component {
  constructor (props) {
    super(props);
    this.state = {
      issuesToFollow: [],
      issuesFollowed: [],
      issueWeVoteIdsFollowed: [],
      searchQuery: '',
    };

    this.searchFunction = this.searchFunction.bind(this);
    this.clearFunction = this.clearFunction.bind(this);
  }

  componentDidMount () {
    IssueActions.retrieveIssuesToFollow();
    if (IssueStore.getPreviousGoogleCivicElectionId() < 1) {
      IssueActions.issuesRetrieve();
    }

    this.issueStoreListener = IssueStore.addListener(this._onIssueStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
  }

  _onIssueStoreChange () {
    this.setState({
      issuesToFollow: IssueStore.getIssuesVoterCanFollow(),
      issuesFollowed: IssueStore.getIssuesVoterIsFollowing(),
      issueWeVoteIdsFollowed: IssueStore.getIssueWeVoteIdsVoterIsFollowing(),
    });
  }

  searchFunction (searchQuery) {
    this.setState({ searchQuery });
  }

  clearFunction () {
    this.searchFunction('');
  }

  render () {
    let { issuesToFollow } = this.state;

    if (this.state.searchQuery.length > 0) {
      const searchQueryLower = this.state.searchQuery.toLowerCase();
      issuesToFollow = issuesToFollow.concat(this.state.issuesFollowed);
      issuesToFollow = _.filter(issuesToFollow,
        oneIssue => oneIssue.issue_name.toLowerCase().includes(searchQueryLower) ||
          oneIssue.issue_description.toLowerCase().includes(searchQueryLower));
    }

    const isFollowing = false;
    const issueListForDisplay = issuesToFollow.map(issue => (
      <IssueFollowToggleSquare
        key={issue.issue_we_vote_id}
        issueWeVoteId={issue.issue_we_vote_id}
        issueName={issue.issue_name}
        issueDescription={issue.issue_description}
        issueImageUrl={issue.issue_image_url}
        issueIconLocalPath={issue.issue_icon_local_path}
        editMode
        isFollowing={this.state.issueWeVoteIdsFollowed.includes(issue.issue_we_vote_id) || isFollowing}
        grid="col-4 col-sm-3"
      />
    ));
    const floatRight = {
      float: 'right',
    };

    return (
      <div className="opinions-followed__container">
        <Helmet title="Issues to Follow - We Vote" />
        <section className="card">
          <div className="card-main">
            <p>
            Follow the values and issues you care about, so we can highlight the organizations that care about the same issues you do.
              <span style={floatRight}>
                <Link to="/issues_followed" className="u-margin-left--md u-no-break">See issues you follow</Link>
              </span>
            </p>
            <SearchBar
              clearButton
              searchButton
              placeholder="Search by Name or Description"
              searchFunction={this.searchFunction}
              clearFunction={this.clearFunction}
              searchUpdateDelayTime={0}
            />
            <br />
            <div className="network-issues-list voter-guide-list card">
              <div className="card-child__list-group">
                {
                  this.state.issuesToFollow && this.state.issuesToFollow.length ?
                    issueListForDisplay :
                    <h4 className="intro-modal__default-text">There are no more issues to follow!</h4>
                }
              </div>
            </div>
            <Link className="pull-left" to="/issues_followed">Issues you are following</Link>
            <br />
          </div>
        </section>
      </div>
    );
  }
}
