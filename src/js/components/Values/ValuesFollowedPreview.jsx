import React, { Component } from 'react';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import IssueActions from '../../actions/IssueActions';
import IssueCardCompressed from './IssueCardCompressed';
import IssueStore from '../../stores/IssueStore';
import { renderLog } from '../../utils/logging';
import ShowMoreFooter from '../Navigation/ShowMoreFooter';
import { historyPush } from '../../utils/cordovaUtils';

// To be updated to show values followed instead of values to follow
class ValuesFollowedPreview extends Component {
  constructor (props) {
    super(props);
    this.state = {
      issuesToFollow: [],
    };
  }

  componentDidMount () {
    // if (IssueStore.getPreviousGoogleCivicElectionId() < 1) {
    //   IssueActions.issuesRetrieve();
    // }
    IssueActions.retrieveIssuesToFollow();

    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.onIssueStoreChange();
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
  }

  onIssueStoreChange () {
    this.setState({
      issuesToFollow: IssueStore.getIssuesVoterCanFollow(),
    });
  }

  goToValuesLink () {
    historyPush('/values/list');
  }

  render () {
    // const width = document.documentElement.clientWidth;
    renderLog('ValuesFollowedPreview');  // Set LOG_RENDER_EVENTS to log all renders
    let issueList = [];
    if (this.state.issuesToFollow) {
      issueList = this.state.issuesToFollow;
    }

    const ISSUES_TO_SHOW = 4;

    // if (width < 768) {
    //   ISSUES_TO_SHOW = 3;
    // } else {
    //   ISSUES_TO_SHOW = 4;
    // }

    // window.onresize = () => {
    //   if (width < 768) {
    //     ISSUES_TO_SHOW = 3;
    //   } else {
    //     ISSUES_TO_SHOW = 4;
    //   }
    // };

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
            <SectionTitle>Values to Follow</SectionTitle>
            <Row className="row">
              { issueListForDisplay }
            </Row>
            <ShowMoreFooter showMoreId="valuesToFollowPreviewShowMoreId" showMoreLink={() => this.goToValuesLink()} showMoreText="Explore all 30 values" />
          </div>
        </section>
      </div>
    );
  }
}

const Row = styled.div`
  margin: 0px -4px;
`;

const SectionTitle = styled.h2`
  width: fit-content;  font-weight: bold;
  font-size: 18px;
  margin-bottom: 16px;
`;

export default withTheme((ValuesFollowedPreview));
