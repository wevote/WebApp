import React, { Component } from 'react';
import filter from 'lodash-es/filter';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import DelayedLoad from '../Widgets/DelayedLoad';
import IssueActions from '../../actions/IssueActions';
import IssueStore from '../../stores/IssueStore';
import { renderLog } from '../../utils/logging';
import IssueCard from './IssueCard';


export default class FriendInvitationOnboardingValuesList extends Component {
  static propTypes = {
    displayOnlyIssuesNotFollowedByVoter: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      allIssues: [],
      searchQuery: '',
    };
  }

  componentDidMount () {
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    if (!IssueStore.issueDescriptionsRetrieveCalled()) {
      IssueActions.issueDescriptionsRetrieve();
      IssueActions.issueDescriptionsRetrieveCalled();
    }
    IssueActions.issuesFollowedRetrieve();

    const allIssues = IssueStore.getAllIssues();
    // console.log('allIssues:', allIssues);
    this.setState({
      allIssues,
    });
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
  }

  onIssueStoreChange () {
    const allIssues = IssueStore.getAllIssues();
    // console.log('allIssues:', allIssues);
    this.setState({
      allIssues,
    });
  }

  render () {
    renderLog('FriendInvitationOnboardingValuesList');  // Set LOG_RENDER_EVENTS to log all renders
    const { displayOnlyIssuesNotFollowedByVoter } = this.props;
    const { allIssues, searchQuery } = this.state;
    let issuesList = [];
    if (allIssues) {
      if (displayOnlyIssuesNotFollowedByVoter) {
        issuesList = allIssues.filter(issue => !IssueStore.isVoterFollowingThisIssue(issue.issue_we_vote_id));
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

    const issuesToShowBeforeDelayedLoad = 6;
    let issuesRenderedCount = 0;
    let issueCardHtml = '';
    const issuesListForDisplay = issuesList.map((issue) => {
      issuesRenderedCount += 1;
      issueCardHtml = (
        <Column
          className="col col-12 col-md-6 u-stack--lg"
          key={`column-issue-list-key-${issue.issue_we_vote_id}`}
        >
          <IssueCard
            followToggleOn
            hideAdvocatesCount
            issue={issue}
            issueImageSize="SMALL"
            key={`issue-list-key-${issue.issue_we_vote_id}`}
          />
        </Column>
      );
      if (issuesRenderedCount <= issuesToShowBeforeDelayedLoad) {
        return issueCardHtml;
      } else {
        // We create a delay after the first 6 issues are rendered, so the initial page load is a little faster
        return (
          <DelayedLoad
            key={`delayed-issue-list-key-${issue.issue_we_vote_id}`}
            showLoadingText={issuesRenderedCount === (issuesToShowBeforeDelayedLoad + 1)}
            waitBeforeShow={1000}
          >
            {issueCardHtml}
          </DelayedLoad>
        );
      }
    });

    return (
      <>
        { issuesList && issuesList.length ? (
          <Row className="row">
            {issuesListForDisplay}
          </Row>
        ) :
          null
        }
      </>
    );
  }
}

const Row = styled.div`
  // margin-left: -16px;
  // margin-right: -16px;
  // width: calc(100% + 32px);
`;

const Column = styled.div`
  @media (max-width: 768px) {
    margin-bottom: 24px !important;
  }
`;
