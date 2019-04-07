import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { renderLog } from '../../utils/logging';
import VoterGuideStore from '../../stores/VoterGuideStore';
import SearchGuidesToFollowBox from '../../components/Search/SearchGuidesToFollowBox';
import GuideList from '../../components/VoterGuide/GuideList';
import IssueStore from '../../stores/IssueStore';


class VoterGuidesUnderOneValue extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      ballotHasGuidesForValue: [],
      issue: {},
      issueWeVoteId: '',
      voterGuidesForValue: [],
    };
    this.onIssueStoreChange = this.onIssueStoreChange.bind(this);
  }

  componentDidMount () {
    this.onIssueStoreChange();
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange);
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onIssueStoreChange () {
    const issue = IssueStore.getIssueBySlug(this.props.params.value_slug);
    // console.log('VoterGuidesUnderOneValue onIssueStoreChange, value_slug', this.props.params.value_slug);
    if (issue && issue.issue_name) {
      this.setState({
        ballotHasGuidesForValue: VoterGuideStore.ballotHasGuidesForValue(issue.issue_we_vote_id),
        voterGuidesForValue: VoterGuideStore.getVoterGuidesForValue(issue.issue_we_vote_id),
        issue,
        issueWeVoteId: issue.issue_we_vote_id,
      });
    }
  }

  onVoterGuideStoreChange () {
    const { issueWeVoteId } = this.state;
    this.setState({
      ballotHasGuidesForValue: VoterGuideStore.ballotHasGuidesForValue(issueWeVoteId),
      voterGuidesForValue: VoterGuideStore.getVoterGuidesForValue(issueWeVoteId),
    });
  }

  render () {
    renderLog(__filename);
    const { ballotHasGuidesForValue, issue, voterGuidesForValue } = this.state;
    // console.log('VoterGuidesUnderOneValue render, issue:', issue);
    // if (!issueWeVoteId) {
    //   return null;
    // }
    let issueNameFound = false;
    let pageTitle = 'Value';
    if (issue && issue.issue_name) {
      issueNameFound = true;
      pageTitle = issue.issue_name;
    }

    return (
      <div className="opinion-view">
        <Helmet title={`${pageTitle} - We Vote`} />
        <h1 className="h1">{pageTitle}</h1>
        <div>
          <SearchGuidesToFollowBox />
          { ballotHasGuidesForValue || !issueNameFound ?
            <p /> :
            (
              <p>
                We don
                {'\'t '}
                have any endorsements for
                {' '}
                {issue.issue_name}
                .
              </p>
            )
          }
          <div className="card">
            <Suspense fallback={<span>Loading...</span>}>
              <GuideList incomingVoterGuideList={voterGuidesForValue} />
            </Suspense>
          </div>
        </div>
        <br />
      </div>
    );
  }
}

export default VoterGuidesUnderOneValue;
