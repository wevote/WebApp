import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import IssueActions from '../../actions/IssueActions';
import { renderLog } from '../../common/utils/logging';
import IssueStore from '../../stores/IssueStore';
import VoterStore from '../../stores/VoterStore';
import ShowMoreButtons from '../Widgets/ShowMoreButtons';

const IssueCard = React.lazy(() => import(/* webpackChunkName: 'IssueCard' */ './IssueCard'));

const NUMBER_OF_ISSUES_TO_DISPLAY = 6;


export default class ReadyPageValuesList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      allIssues: [],
      limitNumberOfIssuesShownToThisNumber: NUMBER_OF_ISSUES_TO_DISPLAY,
    };
  }

  componentDidMount () {
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    IssueActions.issueDescriptionsRetrieve(VoterStore.getVoterWeVoteId());
    IssueActions.issuesFollowedRetrieve(VoterStore.getVoterWeVoteId());
    const allIssues = IssueStore.getAllIssues();
    this.setState({
      allIssues,
    });
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
  }

  onIssueStoreChange () {
    const allIssues = IssueStore.getAllIssues();
    this.setState({
      allIssues,
    });
  }

  orderByIssueFollowersCount = (firstIssue, secondIssue) => secondIssue.issue_followers_count - firstIssue.issue_followers_count;

  orderByLinkedOrganizationCount = (firstIssue, secondIssue) => secondIssue.linked_organization_count - firstIssue.linked_organization_count;

  // If secondIssue isn't considered left or right, move it up vs. firstIssue
  orderByNotLeftOrRight = (firstIssue, secondIssue) => ((!secondIssue.considered_left && !secondIssue.considered_right) ? 1 : 0) - ((!firstIssue.considered_left && !firstIssue.considered_right) ? 1 : 0);

  showMoreIssues = () => {
    const { limitNumberOfIssuesShownToThisNumber: previousCount } = this.state;
    this.setState({
      limitNumberOfIssuesShownToThisNumber: previousCount + 6,
    });
  }

  render () {
    renderLog('ReadyPageValuesList');  // Set LOG_RENDER_EVENTS to log all renders
    const { sortByNumberOfAdvocates } = this.props;
    const { allIssues } = this.state;
    const { limitNumberOfIssuesShownToThisNumber } = this.state;
    let issuesList = [];
    if (allIssues) {
      if (sortByNumberOfAdvocates) {
        issuesList = allIssues;
        issuesList = issuesList.sort(this.orderByIssueFollowersCount);
        issuesList = issuesList.sort(this.orderByLinkedOrganizationCount);
        issuesList = issuesList.sort(this.orderByNotLeftOrRight);
      } else {
        issuesList = allIssues;
      }
    }

    let issueCardHtml = '';
    const issuesListForDisplay = issuesList.slice(0, limitNumberOfIssuesShownToThisNumber).map((issue) => {
      issueCardHtml = (
        <Column
          key={`readyPageValuesListKey-${issue.issue_we_vote_id}`}
        >
          <Suspense fallback={<></>}>
            <IssueCard
              followToggleOn
              hideAdvocatesCount
              issue={issue}
              issueImageSize="MEDIUM"
              key={`readyPageIssueListKey-${issue.issue_we_vote_id}`}
            />
          </Suspense>
        </Column>
      );
      return issueCardHtml;
    });

    return (
      <ReadyPageValuesListWrapper>
        <div>
          <PopularTopicsH1>
            Popular Topics
          </PopularTopicsH1>
          <PopularTopicsDescription>
            Follow topics to see endorsements on your ballot for candidates from people and groups.
          </PopularTopicsDescription>
          <div>
            {allIssues && allIssues.length ? (
              <Row>
                {issuesListForDisplay}
              </Row>
            ) :
              null}
          </div>
          {(limitNumberOfIssuesShownToThisNumber < allIssues.length) && (
            <ShowMoreButtons
              showMoreId="showMoreReadyPageValuesList"
              showMoreButtonsLink={this.showMoreIssues}
            />
          )}
        </div>
      </ReadyPageValuesListWrapper>
    );
  }
}
ReadyPageValuesList.propTypes = {
  sortByNumberOfAdvocates: PropTypes.bool,
};

const Column = styled('div')(({ theme }) => (`
  ${theme.breakpoints.up('sm')} {
    width: 50%;
  }
`));

const PopularTopicsH1 = styled('h1')`
  font-size: 22px;
  font-weight: 500;
  margin-bottom: 8px;
  margin-top: 0px;
`;

const PopularTopicsDescription = styled('p')(({ theme }) => (`
  margin-bottom: 0;
  ${theme.breakpoints.up('sm')} {
    margin-bottom: 0;
  }
`));

const Row = styled('div')(({ theme }) => (`
  ${theme.breakpoints.up('sm')} {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
  }
`));

const ReadyPageValuesListWrapper = styled('div')`
`;
