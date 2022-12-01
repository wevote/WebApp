import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import IssueActions from '../../actions/IssueActions';
import apiCalming from '../../common/utils/apiCalming';
import { renderLog } from '../../common/utils/logging';
import IssueStore from '../../stores/IssueStore';

const IssueCard = React.lazy(() => import(/* webpackChunkName: 'IssueCard' */ './IssueCard'));


export default class FriendInvitationOnboardingFriendValuesList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      allIssuesForDisplay: [],
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
    this.onIssueStoreChange();
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
  }

  onIssueStoreChange () {
    const { friendIssueWeVoteIdList } = this.props;
    const allIssuesRaw = IssueStore.getAllIssues();
    // console.log('allIssuesRaw:', allIssuesRaw);
    const allIssuesForDisplay = [];
    let oneIssue;
    for (let i = 0; i < allIssuesRaw.length; i++) {
      oneIssue = allIssuesRaw[i];
      if (friendIssueWeVoteIdList.includes(oneIssue.issue_we_vote_id)) {
        allIssuesForDisplay.push(oneIssue);
      }
    }
    this.setState({
      allIssuesForDisplay,
    });
  }

  render () {
    renderLog('FriendInvitationOnboardingFriendValuesList');  // Set LOG_RENDER_EVENTS to log all renders
    const { allIssuesForDisplay } = this.state;
    // console.log('allIssuesForDisplay:', allIssuesForDisplay);

    let totalIssuesRenderedCount = 0;
    let issueCardHtml = '';
    const allIssuesHtml = allIssuesForDisplay.map((issue) => {
      totalIssuesRenderedCount += 1;
      issueCardHtml = (
        <Column
          className="col col-12 col-md-6 u-stack--lg"
          key={`friend-column-issue-list-key-${issue.issue_we_vote_id}`}
        >
          <Suspense fallback={<></>}>
            <IssueCard
              followToggleOn
              hideAdvocatesCount
              issue={issue}
              issueImageSize="SMALL"
              key={`issue-list-key-${issue.issue_we_vote_id}`}
            />
          </Suspense>
        </Column>
      );
      return issueCardHtml;
    });

    return (
      <>
        { totalIssuesRenderedCount ? (
          <Wrapper>
            <Row className="row">
              {allIssuesHtml}
            </Row>
          </Wrapper>
        ) : null}
      </>
    );
  }
}
FriendInvitationOnboardingFriendValuesList.propTypes = {
  friendIssueWeVoteIdList: PropTypes.array,
};

const Wrapper = styled('div')`
  margin-bottom: 12px;
`;

const Row = styled('div')`
`;

const Column = styled('div')`
`;
