import React, { Component } from 'react';
import { Link } from 'react-router';
import IssueActions from '../../actions/IssueActions';
import IssueCard from './IssueCard';
import IssueStore from '../../stores/IssueStore';
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

  render () {
    renderLog(__filename);
    let issueList = [];
    if (this.state.issuesToFollow) {
      issueList = this.state.issuesToFollow;
    }

    const ISSUES_TO_SHOW = 3;

    let issueCount = 0;
    const issueListForDisplay = issueList.map((issue) => {
      issueCount++;
      if (issueCount > ISSUES_TO_SHOW) {
        return null;
      } else {
        return (
          <IssueCard
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
            <h1 className="h4">Values to Follow</h1>
            <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
              { issueListForDisplay }
            </div>
            <div>
              <Link to="/values/list">Explore all 26 values</Link>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
