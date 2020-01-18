import React, { Component } from 'react';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import IssueActions from '../../actions/IssueActions';
import IssueCardCompressed from './IssueCardCompressed';
import IssueStore from '../../stores/IssueStore';
import { renderLog } from '../../utils/logging';
import ShowMoreFooter from '../Navigation/ShowMoreFooter';
import { historyPush } from '../../utils/cordovaUtils';

class ValuesFollowedPreview extends Component {
  constructor (props) {
    super(props);
    this.state = {
      issuesFollowed: [],
    };
  }

  componentDidMount () {
    IssueActions.retrieveIssuesToFollow();

    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.onIssueStoreChange();
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
              <ShowMoreFooter
                showMoreId="valuesFollowedPreviewShowMoreId"
                showMoreLink={() => this.goToValuesLink()}
                showMoreText="Explore all values"
              />
            )}
          </div>
        </section>
      </div>
    );
  }
}

const Row = styled.div`
  margin: 0px -6px;
`;

const SectionTitle = styled.h2`
  width: fit-content;  font-weight: bold;
  font-size: 18px;
  margin-bottom: 16px;
`;

export default withTheme((ValuesFollowedPreview));
