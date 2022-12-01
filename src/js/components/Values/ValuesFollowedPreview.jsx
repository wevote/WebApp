import withTheme from '@mui/styles/withTheme';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import IssueActions from '../../actions/IssueActions';
import apiCalming from '../../common/utils/apiCalming';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import IssueStore from '../../stores/IssueStore';
import IssueCardCompressed from './IssueCardCompressed';

const ShowMoreFooter = React.lazy(() => import(/* webpackChunkName: 'ShowMoreFooter' */ '../Navigation/ShowMoreFooter'));

class ValuesFollowedPreview extends Component {
  constructor (props) {
    super(props);
    this.state = {
      issuesFollowed: [],
    };
  }

  componentDidMount () {
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.onIssueStoreChange();
    if (apiCalming('issueDescriptionsRetrieve', 3600000)) { // Only once per 60 minutes
      IssueActions.issueDescriptionsRetrieve();
    }
    if (apiCalming('issuesFollowedRetrieve', 60000)) { // Only once per minute
      IssueActions.issuesFollowedRetrieve();
    }
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
  }

  onIssueStoreChange () {
    this.setState({
      issuesFollowed: IssueStore.getIssuesVoterIsFollowing(),
    });
  }

  goToValuesLink () {
    historyPush('/values/list');
  }

  render () {
    // const width = document.documentElement.clientWidth;
    renderLog('ValuesFollowedPreview');  // Set LOG_RENDER_EVENTS to log all renders
    const { issuesFollowed: issueList } = this.state;
    if (!issueList) {
      return null;
    }

    let ISSUES_TO_SHOW = 4;

    if (window.innerWidth < 768) {
      ISSUES_TO_SHOW = 2;
    } else {
      ISSUES_TO_SHOW = 4;
    }

    let issueCount = 0;
    const issueListForDisplay = issueList.map((issue) => {
      issueCount++;
      if (issueCount > ISSUES_TO_SHOW) {
        return null;
      } else {
        return (
          <IssueCardCompressed
            followToggleOn
            issue={issue}
            issueImageSize="SMALL"
            key={`issue-list-key-${issue.issue_we_vote_id}`}
          />
        );
      }
    });

    return (
      <div className="opinions-followed__container">
        <section className="card">
          <div className="card-main">
            <SectionTitle>
              Values You Are Following
              {!!(issueList && issueList.length) && (
                <>
                  {' '}
                  (
                  {issueList.length}
                  )
                </>
              )}
            </SectionTitle>
            <Row className="row">
              { issueListForDisplay }
            </Row>
            {!!(issueList && issueList.length) && (
              <Suspense fallback={<></>}>
                <ShowMoreFooter
                  showMoreId="valuesFollowedPreviewShowMoreId"
                  showMoreLink={() => this.goToValuesLink()}
                  showMoreText="Explore all values"
                />
              </Suspense>
            )}
          </div>
        </section>
      </div>
    );
  }
}

const Row = styled('div')`
  margin: 0px -6px;
`;

const SectionTitle = styled('h2')`
  width: fit-content;  font-weight: bold;
  font-size: 18px;
  margin-bottom: 16px;
`;

export default withTheme((ValuesFollowedPreview));
