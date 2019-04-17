import React, { Component } from 'react';
import IssueActions from '../../actions/IssueActions';
import IssueCard from './IssueCard';
import IssueStore from '../../stores/IssueStore';
import ShowMoreFooter from '../Navigation/ShowMoreFooter';
import { historyPush } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';

export default class ValuesToFollowPreview extends Component {
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

  getValuesList () {
    const valuesLink = `/values/list`;
    historyPush(valuesLink);
  }

  render () {
    renderLog(__filename);
    let issueList = [];
    if (this.state.issuesToFollow) {
      issueList = this.state.issuesToFollow;
    }

    const ISSUES_TO_SHOW_DESKTOP = 4;
    const ISSUES_TO_SHOW_MOBILE = 3;
    let issueCount = 0;
    const issueListForDisplayDesktop = issueList.map((issue) => {
      issueCount++;
      if (issueCount > ISSUES_TO_SHOW_DESKTOP) {
        return null;
      } else {
        return (
          <IssueCard
            followToggleOn
            issue={issue}
            issueImageSize="SMALL"
            key={`issue-list-desktop-${issue.issue_we_vote_id}`}
            turnOffDescription
          />
        );
      }
    });
    issueCount = 0;
    const issueListForDisplayMobile = issueList.map((issue) => {
      issueCount++;
      if (issueCount > ISSUES_TO_SHOW_MOBILE) {
        return null;
      } else {
        return (
          <IssueCard
            followToggleOn
            issue={issue}
            issueImageSize="SMALL"
            key={`issue-list-mobile-${issue.issue_we_vote_id}`}
          />
        );
      }
    });


    return (
      <div className="opinions-followed__container">
        <section className="card">
          <div className="card-main">
            <h1 className="h4">Values to Follow</h1>
            <div className="u-show-desktop-tablet">
              {issueListForDisplayDesktop}
            </div>
            <div className="u-show-mobile">
              {issueListForDisplayMobile}
            </div>
            <div>
              <ShowMoreFooter showMoreLink={() => this.getValuesList()} showMoreText="Explore all 26 values" />
            </div>
          </div>
        </section>
      </div>
    );
  }
}
