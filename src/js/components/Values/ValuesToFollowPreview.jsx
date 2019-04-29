import React, { Component } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import IssueActions from '../../actions/IssueActions';
import IssueCardCompressed from './IssueCardCompressed';
import IssueStore from '../../stores/IssueStore';
import { renderLog } from '../../utils/logging';

class ValuesToFollowPreview extends Component {
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
    // const width = document.documentElement.clientWidth;
    renderLog(__filename);
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
            <h1 className="h4">Values to Follow</h1>
            <Row className="row">
              { issueListForDisplay }
            </Row>
            <div>
              <Link to="/values/list">Explore all 26 values</Link>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

const Row = styled.div`
  margin: 0px -4px;
`;

export default withTheme()((ValuesToFollowPreview));
