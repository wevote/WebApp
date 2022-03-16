import styled from '@mui/material/styles/styled';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import IssueActions from '../../actions/IssueActions';
import { renderLog } from '../../common/utils/logging';
import IssueStore from '../../stores/IssueStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';

const IssueCard = React.lazy(() => import(/* webpackChunkName: 'IssueCard' */ './IssueCard'));


export default class FriendInvitationOnboardingValuesList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      allIssuesNoLean: [],
      allLeftIssues: [],
      allRightIssues: [],
    };
  }

  componentDidMount () {
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onIssueStoreChange.bind(this));
    IssueActions.issueDescriptionsRetrieve(VoterStore.getVoterWeVoteId());
    IssueActions.issuesFollowedRetrieve(VoterStore.getVoterWeVoteId());
    this.onIssueStoreChange();
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onIssueStoreChange () {
    const { displayOnlyIssuesNotFollowedByVoter, friendIssueWeVoteIdList } = this.props;
    const includeOrganizationsCount = true;
    const allIssuesRaw = IssueStore.getAllIssues(includeOrganizationsCount);
    // console.log('allIssuesRaw:', allIssuesRaw);
    let allIssuesForDisplay = [];
    if (allIssuesRaw) {
      if (displayOnlyIssuesNotFollowedByVoter) {
        allIssuesForDisplay = allIssuesRaw.filter((issue) => !IssueStore.isVoterFollowingThisIssue(issue.issue_we_vote_id));
      } else {
        allIssuesForDisplay = allIssuesRaw;
      }
    }
    // Remove issues shown under friend who invited voter
    if (friendIssueWeVoteIdList && friendIssueWeVoteIdList.length) {
      allIssuesForDisplay = allIssuesForDisplay.filter((issue) => !friendIssueWeVoteIdList.includes(issue.issue_we_vote_id));
    }
    let oneIssue;
    const allIssuesNoLean = [];
    const allLeftIssues = [];
    const allRightIssues = [];
    for (let i = 0; i < allIssuesForDisplay.length; i++) {
      oneIssue = allIssuesForDisplay[i];
      if (oneIssue.considered_left) {
        allLeftIssues.push(oneIssue);
      } else if (oneIssue.considered_right) {
        allRightIssues.push(oneIssue);
      } else {
        allIssuesNoLean.push(oneIssue);
      }
    }
    allIssuesNoLean.sort((optionA, optionB) => (optionB.organizations_under_this_issue_count - optionA.organizations_under_this_issue_count));
    allLeftIssues.sort((optionA, optionB) => (optionB.organizations_under_this_issue_count - optionA.organizations_under_this_issue_count));
    allRightIssues.sort((optionA, optionB) => (optionB.organizations_under_this_issue_count - optionA.organizations_under_this_issue_count));
    this.setState({
      allIssuesNoLean,
      allLeftIssues,
      allRightIssues,
    });
  }

  render () {
    renderLog('FriendInvitationOnboardingValuesList');  // Set LOG_RENDER_EVENTS to log all renders
    const { followToggleOnItsOwnLine, includeLinkToIssue, oneColumn } = this.props;
    const { allIssuesNoLean, allLeftIssues, allRightIssues } = this.state;

    // console.log('All issues:', issuesList);

    const issuesToShowPerClassification = 2;
    let totalIssuesRenderedCount = 0;
    let issuesRenderedCount = 0;
    let issueCardHtml = '';
    const noLeanIssuesListForDisplay = allIssuesNoLean.map((issue) => {
      issuesRenderedCount += 1;
      totalIssuesRenderedCount += 1;
      issueCardHtml = (
        <Column
          className={`col col-12 ${oneColumn ? '' : ' u-stack--lg col-md-6'}`}
          key={`column-issue-list-key-${issue.issue_we_vote_id}`}
        >
          <Suspense fallback={<></>}>
            <IssueCard
              condensed
              followToggleOn
              followToggleOnItsOwnLine={followToggleOnItsOwnLine}
              hideAdvocatesCount
              includeLinkToIssue={includeLinkToIssue}
              issue={issue}
              issueImageSize="SMALL"
              key={`issue-list-key-${issue.issue_we_vote_id}`}
            />
          </Suspense>
        </Column>
      );
      if (issuesRenderedCount > issuesToShowPerClassification) {
        return null;
      } else {
        return issueCardHtml;
      }
    });
    issuesRenderedCount = 0;
    const leftIssuesListForDisplay = allLeftIssues.map((issue) => {
      issuesRenderedCount += 1;
      totalIssuesRenderedCount += 1;
      issueCardHtml = (
        <Column
          className={`col col-12 ${oneColumn ? '' : 'u-stack--lg col-md-6'}`}
          key={`column-issue-list-key-${issue.issue_we_vote_id}`}
        >
          <Suspense fallback={<></>}>
            <IssueCard
              condensed
              followToggleOn
              followToggleOnItsOwnLine={followToggleOnItsOwnLine}
              hideAdvocatesCount
              includeLinkToIssue={includeLinkToIssue}
              issue={issue}
              issueImageSize="SMALL"
              key={`issue-list-key-${issue.issue_we_vote_id}`}
            />
          </Suspense>
        </Column>
      );
      if (issuesRenderedCount > issuesToShowPerClassification) {
        return null;
      } else {
        return issueCardHtml;
      }
    });
    issuesRenderedCount = 0;
    const rightIssuesListForDisplay = allRightIssues.map((issue) => {
      issuesRenderedCount += 1;
      totalIssuesRenderedCount += 1;
      issueCardHtml = (
        <Column
          className={`col col-12 ${oneColumn ? '' : ' u-stack--lg col-md-6'}`}
          key={`column-issue-list-key-${issue.issue_we_vote_id}`}
        >
          <Suspense fallback={<></>}>
            <IssueCard
              condensed
              followToggleOn
              followToggleOnItsOwnLine={followToggleOnItsOwnLine}
              hideAdvocatesCount
              includeLinkToIssue={includeLinkToIssue}
              issue={issue}
              issueImageSize="SMALL"
              key={`issue-list-key-${issue.issue_we_vote_id}`}
            />
          </Suspense>
        </Column>
      );
      if (issuesRenderedCount > issuesToShowPerClassification) {
        return null;
      } else {
        return issueCardHtml;
      }
    });

    return (
      <Wrapper>
        { totalIssuesRenderedCount ? (
          <Row className="row">
            {noLeanIssuesListForDisplay}
            {leftIssuesListForDisplay}
            {rightIssuesListForDisplay}
          </Row>
        ) :
          null}
      </Wrapper>
    );
  }
}
FriendInvitationOnboardingValuesList.propTypes = {
  displayOnlyIssuesNotFollowedByVoter: PropTypes.bool,
  followToggleOnItsOwnLine: PropTypes.bool,
  friendIssueWeVoteIdList: PropTypes.array,
  includeLinkToIssue: PropTypes.bool,
  oneColumn: PropTypes.bool,
};

const Wrapper = styled('div')`
  margin-bottom: 18px;
`;

const Row = styled('div')`
`;

const Column = styled('div')`
`;
