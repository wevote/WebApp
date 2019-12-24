import React, { Component } from 'react';
import filter from 'lodash-es/filter';
import styled from 'styled-components';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import IssueActions from '../../actions/IssueActions';
import IssueStore from '../../stores/IssueStore';
import { renderLog } from '../../utils/logging';
import SearchBar from '../../components/Search/SearchBar';
import IssueCard from '../../components/Values/IssueCard';

export default class ValuesList extends Component {
  static propTypes = {
    displayOnlyIssuesNotFollowedByVoter: PropTypes.bool,
    currentIssue: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      allIssues: [],
      searchQuery: '',
      currentIssue: {},
    };

    this.searchFunction = this.searchFunction.bind(this);
    this.clearFunction = this.clearFunction.bind(this);
  }

  componentDidMount () {
    IssueActions.retrieveIssuesToFollow();
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));

    const { currentIssue } = this.props;
    // let currentIssueWeVoteId = '';
    // if (currentIssue) {
    //   currentIssueWeVoteId = currentIssue.issue_we_vote_id;
    // }
    const allIssues = IssueStore.getAllIssues();
    // let allIssuesCount = 0;
    // if (allIssues) {
    //   allIssuesCount = allIssues.length;
    // }
    this.setState({
      allIssues,
      // allIssuesCount,
      currentIssue,
      // currentIssueWeVoteId,
    });
  }

  componentWillReceiveProps (nextProps) {
    const { currentIssue } = nextProps;
    // let currentIssueWeVoteId = '';
    // if (currentIssue) {
    //   currentIssueWeVoteId = currentIssue.issue_we_vote_id;
    // }
    const allIssues = IssueStore.getAllIssues();
    // let allIssuesCount = 0;
    // if (allIssues) {
    //   allIssuesCount = allIssues.length;
    // }
    this.setState({
      allIssues,
      // allIssuesCount,
      currentIssue,
      // currentIssueWeVoteId,
    });
  }

  // This was preventing the page from updating on search. Commenting out and not fixing because this isn't a CPU intensive page.
  // shouldComponentUpdate (nextProps, nextState) {
  //   if (this.state.allIssuesCount !== nextState.allIssuesCount) {
  //     // console.log("shouldComponentUpdate: this.state.allIssuesCount", this.state.allIssuesCount, ", nextState.allIssuesCount", nextState.allIssuesCount);
  //     return true;
  //   }
  //   if (this.state.currentIssueWeVoteId !== nextState.currentIssueWeVoteId) {
  //     // console.log("shouldComponentUpdate: this.state.currentIssueWeVoteId", this.state.currentIssueWeVoteId, ", nextState.currentIssueWeVoteId", nextState.currentIssueWeVoteId);
  //     return true;
  //   }
  //   if (this.props.displayOnlyIssuesNotFollowedByVoter !== nextProps.displayOnlyIssuesNotFollowedByVoter) {
  //     // console.log("shouldComponentUpdate: this.props.displayOnlyIssuesNotFollowedByVoter", this.props.displayOnlyIssuesNotFollowedByVoter, ", nextProps.displayOnlyIssuesNotFollowedByVoter", nextProps.displayOnlyIssuesNotFollowedByVoter);
  //     return true;
  //   }
  //   return false;
  // }

  componentWillUnmount () {
    this.issueStoreListener.remove();
  }

  onIssueStoreChange () {
    const allIssues = IssueStore.getAllIssues();
    // let allIssuesCount = 0;
    // if (allIssues) {
    //   allIssuesCount = allIssues.length;
    // }
    this.setState({
      allIssues,
      // allIssuesCount,
    });
  }

  searchFunction (searchQuery) {
    this.setState({ searchQuery });
  }

  clearFunction () {
    this.searchFunction('');
  }

  render () {
    renderLog('ValuesList');  // Set LOG_RENDER_EVENTS to log all renders
    const { allIssues, searchQuery, currentIssue } = this.state;
    let issuesList = [];
    // let issuesNotFollowedByVoterList = [];
    // let issuesNotCurrentIssue = [];
    if (allIssues) {
      if (this.props.displayOnlyIssuesNotFollowedByVoter) {
        issuesList = allIssues.filter(issue => issue.issue_we_vote_id !== currentIssue.issue_we_vote_id).filter(issue => issue.is_issue_followed === false);
      } else {
        issuesList = allIssues;
      }
    }

    // console.log('All issues:', issuesList);

    if (searchQuery.length > 0) {
      const searchQueryLowercase = searchQuery.toLowerCase();
      issuesList = filter(issuesList,
        oneIssue => oneIssue.issue_name.toLowerCase().includes(searchQueryLowercase) ||
            oneIssue.issue_description.toLowerCase().includes(searchQueryLowercase));
    }

    const issuesListForDisplay = issuesList.map(issue => (
      <div
        className="col col-12 col-md-6 u-stack--md"
        key={`div-issue-list-key-${issue.issue_we_vote_id}`}

      >
        <IssueCard
          followToggleOn
          includeLinkToIssue
          issue={issue}
          issueImageSize="SMALL"
          key={`issue-list-key-${issue.issue_we_vote_id}`}
        />
      </div>
    ));

    return (
      <>
        {this.props.displayOnlyIssuesNotFollowedByVoter ? (
          <Row className="row" noMargin>
            {issuesListForDisplay}
          </Row>
        ) : (
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
                    <Row className="row">
                      {issuesListForDisplay}
                    </Row>
                  ) :
                    null
                  }
                </div>
              </div>
            </section>
          </div>
        )}
      </>

    );
  }
}

const Row = styled.div`
  margin-left: -16px;
  margin-right: -16px;
  width: ${props => (props.noMargin ? 'calc(100% + 32px)' : '100%')}
`;
