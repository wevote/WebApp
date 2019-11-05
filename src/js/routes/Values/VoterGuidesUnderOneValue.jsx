import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import BallotIcon from '@material-ui/icons/Ballot';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';
import { renderLog } from '../../utils/logging';
import VoterGuideStore from '../../stores/VoterGuideStore';
import GuideList from '../../components/VoterGuide/GuideList';
import IssueStore from '../../stores/IssueStore';
import IssueCard from '../../components/Values/IssueCard';
import ValuesList from './ValuesList';
// import SearchGuidesToFollowBox from '../../components/Search/SearchGuidesToFollowBox';

class VoterGuidesUnderOneValue extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    classes: PropTypes.object,
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

  componentWillReceiveProps (nextProps) {
    const issue = IssueStore.getIssueBySlug(nextProps.params.value_slug);
    this.setState({
      ballotHasGuidesForValue: VoterGuideStore.ballotHasGuidesForValue(issue.issue_we_vote_id),
      voterGuidesForValue: VoterGuideStore.getVoterGuidesForValue(issue.issue_we_vote_id),
      issue,
      issueWeVoteId: issue.issue_we_vote_id,
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.issueWeVoteId !== nextState.issueWeVoteId) {
      return true;
    }
    if (this.state.ballotHasGuidesForValue !== nextState.ballotHasGuidesForValue) {
      return true;
    }
    return false;
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
    const voterGuidesForValue = VoterGuideStore.getVoterGuidesForValue(issueWeVoteId);
    console.log('onVoterGuideStoreChange, voterGuidesForValue: ', voterGuidesForValue);
    this.setState({
      ballotHasGuidesForValue: VoterGuideStore.ballotHasGuidesForValue(issueWeVoteId),
      voterGuidesForValue,
    });
  }

  render () {
    renderLog('VoterGuidesUnderOneValue');  // Set LOG_RENDER_EVENTS to log all renders
    const { ballotHasGuidesForValue, issue, voterGuidesForValue } = this.state;

    const { classes } = this.props;

    let issueNameFound = false;
    let pageTitle = 'Value';
    if (issue && issue.issue_name) {
      issueNameFound = true;
      pageTitle = issue.issue_name;
    }

    return (
      <div className="opinion-view">
        <Helmet title={`${pageTitle} - We Vote`} />
        <div>
          <IssueCard
            followToggleOn
            issue={issue}
            issueImageSize="MEDIUM"
            key={`issue-list-key-${issue.issue_we_vote_id}`}
          />
          {/* This is not currently working and probably doesn't make sense to allow search on a single value page.
          <SearchGuidesToFollowBox /> */}
          { ballotHasGuidesForValue || !issueNameFound ?
            <p /> : (
              <>
                <br />
                <Card>
                  <EmptyBallotMessageContainer>
                    <BallotIcon classes={{ root: classes.ballotIconRoot }} />
                    <EmptyBallotText>There are no endorsements for this issue yet. Click &quot;Add Endorsements&quot; to help people who trust you make better voting decisions.</EmptyBallotText>
                    <Button
                      classes={{ root: classes.ballotButtonRoot }}
                      color="primary"
                      variant="contained"
                    >
                      <BallotIcon classes={{ root: classes.ballotButtonIconRoot }} />
                      Add Endorsements
                    </Button>
                  </EmptyBallotMessageContainer>
                </Card>
              </>
            )}
          <div className="card">
            <Suspense fallback={<span>Loading...</span>}>
              <GuideList incomingVoterGuideList={voterGuidesForValue} />
            </Suspense>
          </div>
          <Title>Explore More Values</Title>
          <ValuesList displayOnlyIssuesNotFollowedByVoter currentIssue={issue} />
        </div>
        <br />
      </div>
    );
  }
}

const styles = theme => ({
  ballotIconRoot: {
    width: 100,
    height: 100,
    color: 'rgb(171, 177, 191)',
  },
  ballotButtonIconRoot: {
    marginRight: 8,
  },
  ballotButtonRoot: {
    width: 250,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const EmptyBallotMessageContainer = styled.div`
  padding: 1em 2em;
  display: flex;
  flex-flow: column;
  align-items: center;
`;

const EmptyBallotText = styled.p`
  font-size: 16px;
  text-align: center;
  margin: 1em 2em;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 1em;
  }
`;

const Title = styled.h3`
  color: #333;
  font-size: 22px;
  margin-bottom: 32px;
  margin-top: 24px;
`;

export default withStyles(styles)(VoterGuidesUnderOneValue);
