import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import IssueActions from '../../actions/IssueActions';
import apiCalming from '../../common/utils/apiCalming';
import { renderLog } from '../../common/utils/logging';
import IssueStore from '../../stores/IssueStore';
import ShowMoreButtons from '../Widgets/ShowMoreButtons';

const IssueCard = React.lazy(() => import(/* webpackChunkName: 'IssueCard' */ './IssueCard'));

const NUMBER_OF_ISSUES_TO_DISPLAY = 6;

export default class ReadyPageValuesList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      allIssues: [],
      allIssuesCount: 0,
      limitNumberOfIssuesShownToThisNumber: NUMBER_OF_ISSUES_TO_DISPLAY,
    };
  }

  componentDidMount () {
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    if (apiCalming('issueDescriptionsRetrieve', 3600000)) { // Only once per 60 minutes
      IssueActions.issueDescriptionsRetrieve();
    }
    if (apiCalming('issuesFollowedRetrieve', 60000)) { // Only once per minute
      IssueActions.issuesFollowedRetrieve();
    }
    const allIssues = IssueStore.getAllIssues();
    const allIssuesCount = allIssues.length || 0;
    this.setState({
      allIssues,
      allIssuesCount,
    });
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
  }

  onIssueStoreChange () {
    const allIssues = IssueStore.getAllIssues();
    const allIssuesCount = allIssues.length || 0;
    this.setState({
      allIssues,
      allIssuesCount,
    });
  }

  // Order by 1, 2, 3. Push 0's to the bottom in the same order.
  orderByForcedSortOrder = (firstIssue, secondIssue) => (firstIssue.forced_sort_order || Number.MAX_VALUE) - (secondIssue.forced_sort_order || Number.MAX_VALUE);

  orderByIssueFollowersCount = (firstIssue, secondIssue) => secondIssue.issue_followers_count - firstIssue.issue_followers_count;

  // orderByLinkedOrganizationCount = (firstIssue, secondIssue) => secondIssue.linked_organization_count - firstIssue.linked_organization_count;

  // If secondIssue isn't considered left or right, move it up vs. firstIssue
  // orderByNotLeftOrRight = (firstIssue, secondIssue) => ((!secondIssue.considered_left && !secondIssue.considered_right) ? 1 : 0) - ((!firstIssue.considered_left && !firstIssue.considered_right) ? 1 : 0);

  showMoreIssues = () => {
    const { allIssuesCount } = this.state;
    this.setState({
      limitNumberOfIssuesShownToThisNumber: allIssuesCount,
    });
  }

  render () {
    renderLog('ReadyPageValuesList');  // Set LOG_RENDER_EVENTS to log all renders
    const { sortByNumberOfAdvocates, sortByForcedSortOrder } = this.props;
    const { allIssues } = this.state;
    const { limitNumberOfIssuesShownToThisNumber } = this.state;
    let issuesList = [];
    if (allIssues) {
      if (sortByNumberOfAdvocates) {
        issuesList = allIssues;
        issuesList = issuesList.sort(this.orderByIssueFollowersCount);
        // issuesList = issuesList.sort(this.orderByLinkedOrganizationCount);
        // issuesList = issuesList.sort(this.orderByNotLeftOrRight);
      } else {
        issuesList = allIssues;
      }
      if (sortByForcedSortOrder) {
        issuesList = issuesList.sort(this.orderByForcedSortOrder);
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
              includeLinkToIssue
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
            Follow Popular Topics
          </PopularTopicsH1>
          <PopularTopicsDescription>
            Follow topics
            {' '}
            <TextBold>
              to see endorsements
            </TextBold>
            {' '}
            for candidates from people who share your values.
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
            <ShowMoreWrapperCentered>
              <ShowMoreButtons
                showMoreId="showMoreReadyPageValuesList"
                showMoreButtonsLink={this.showMoreIssues}
              />
            </ShowMoreWrapperCentered>
          )}
        </div>
      </ReadyPageValuesListWrapper>
    );
  }
}
ReadyPageValuesList.propTypes = {
  sortByForcedSortOrder: PropTypes.bool,
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

const TextBold = styled('strong')`
  font-weight: 500;
`;

const Row = styled('div')(({ theme }) => (`
  ${theme.breakpoints.up('sm')} {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
  }
`));

const ReadyPageValuesListWrapper = styled('div')`
`;

const ShowMoreWrapperCentered = styled('div')`
  display: flex;
  justify-content: center;
`;
