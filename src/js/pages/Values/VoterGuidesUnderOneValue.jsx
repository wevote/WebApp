import { Ballot } from '@mui/icons-material';
import { Button, Card } from '@mui/material';
import styled from '@mui/material/styles/styled';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import IssueActions from '../../actions/IssueActions';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import GuideList from '../../components/VoterGuide/GuideList';
import IssueStore from '../../stores/IssueStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import ValuesList from './ValuesList';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));
const IssueCard = React.lazy(() => import(/* webpackChunkName: 'IssueCard' */ '../../components/Values/IssueCard'));


class VoterGuidesUnderOneValue extends Component {
  constructor (props) {
    super(props);
    this.state = {
      issue: {},
      issueWeVoteId: '',
      voterGuidesForValue: [],
      voterGuidesForValueLength: 0,
    };
    this.onIssueStoreChange = this.onIssueStoreChange.bind(this);
  }

  componentDidMount () {
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange);
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.onIssueStoreChange();
    IssueActions.issueDescriptionsRetrieve(VoterStore.getVoterWeVoteId());
    window.scrollTo(0, 0);
  }

  componentDidUpdate (prevProps) {
    const { match: { params: prevParams } } = prevProps;
    const { match: { params: nextParams } } = this.props;
    if (prevParams.value_slug !== nextParams.value_slug) {
      const newIssue = IssueStore.getIssueBySlug(nextParams.value_slug);
      const voterGuidesForValue = VoterGuideStore.getVoterGuidesForValue(newIssue.issue_we_vote_id);
      const voterGuidesForValueLength = voterGuidesForValue.length || 0;
      this.setState({
        voterGuidesForValue,
        voterGuidesForValueLength,
        issue: newIssue,
        issueWeVoteId: newIssue.issue_we_vote_id,
      });
      window.scrollTo(0, 0);
    }
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onIssueStoreChange () {
    const { match: { params: { value_slug: valueSlug } } } = this.props;
    const issue = IssueStore.getIssueBySlug(valueSlug);
    // console.log('VoterGuidesUnderOneValue onIssueStoreChange, valueSlug', valueSlug);
    if (issue && issue.issue_name) {
      const voterGuidesForValue = VoterGuideStore.getVoterGuidesForValue(issue.issue_we_vote_id);
      const voterGuidesForValueLength = voterGuidesForValue.length || 0;
      this.setState({
        voterGuidesForValueLength,
        voterGuidesForValue,
        issue,
        issueWeVoteId: issue.issue_we_vote_id,
      });
    }
  }

  onVoterGuideStoreChange () {
    const { issueWeVoteId } = this.state;
    const voterGuidesForValue = VoterGuideStore.getVoterGuidesForValue(issueWeVoteId);
    const voterGuidesForValueLength = voterGuidesForValue.length || 0;
    // console.log('onVoterGuideStoreChange, voterGuidesForValue: ', voterGuidesForValue);
    this.setState({
      voterGuidesForValue,
      voterGuidesForValueLength,
    });
  }

  render () {
    renderLog('VoterGuidesUnderOneValue');  // Set LOG_RENDER_EVENTS to log all renders
    const { issue, voterGuidesForValue, voterGuidesForValueLength } = this.state;

    const { classes } = this.props;

    let issueNameFound = false;
    let pageTitle = 'Value';
    if (issue && issue.issue_name) {
      issueNameFound = true;
      pageTitle = issue.issue_name;
    }

    if (!issueNameFound) {
      return null;
    }

    return (
      <PageContentContainer>
        <div className="opinion-view">
          <Helmet title={`${pageTitle} - We Vote`} />
          <Suspense fallback={<></>}>
            <IssueCard
              followToggleOn
              issue={issue}
              issueImageSize="MEDIUM"
              key={`issue-list-key-${issue.issue_we_vote_id}`}
            />
          </Suspense>
          {/* This is not currently working and probably doesn't make sense to allow search on a single value page.
          <SearchGuidesToFollowBox /> */}
          { !voterGuidesForValueLength ? (
            <Suspense fallback={<></>}>
              <DelayedLoad showLoadingText waitBeforeShow={500}>
                <>
                  <br />
                  <Card>
                    <EmptyValueMessageContainer id="noEndorsements">
                      <Ballot classes={{ root: classes.ballotIconRoot }} location={window.location} />
                      <EmptyValueText>There are no endorsements for this issue yet. Click &quot;Add Endorsements&quot; to help people who trust you make better voting decisions.</EmptyValueText>
                      <Button
                        id="addEndorsements"
                        classes={{ root: classes.ballotButtonRoot }}
                        color="primary"
                        onClick={() => historyPush('/settings/voterguidelist')}
                        variant="contained"
                      >
                        <Ballot classes={{ root: classes.ballotButtonIconRoot }} location={window.location} />
                        Add Endorsements
                      </Button>
                    </EmptyValueMessageContainer>
                  </Card>
                </>
              </DelayedLoad>
            </Suspense>
          ) : (
            <>
              <div className="card">
                <Suspense fallback={<span>Loading...</span>}>
                  <GuideList incomingVoterGuideList={voterGuidesForValue} />
                </Suspense>
              </div>
            </>
          )}
          <Suspense fallback={<></>}>
            <DelayedLoad waitBeforeShow={2000}>
              <>
                <Title id="valuesListTitle">Explore More Values</Title>
                <ValuesList displayOnlyIssuesNotFollowedByVoter currentIssue={issue} includedOnAnotherPage />
              </>
            </DelayedLoad>
          </Suspense>
          <br />
        </div>
      </PageContentContainer>
    );
  }
}
VoterGuidesUnderOneValue.propTypes = {
  match: PropTypes.object.isRequired,
  classes: PropTypes.object,
};

const styles = (theme) => ({
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
    [theme.breakpoints.down('lg')]: {
      width: '100%',
    },
  },
});

const EmptyValueMessageContainer = styled('div')`
  padding: 1em 2em;
  display: flex;
  flex-flow: column;
  align-items: center;
`;

const EmptyValueText = styled('p')`
  font-size: 16px;
  text-align: center;
  margin: 1em 2em;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 1em;
  }
`;

const Title = styled('h3')`
  color: #333;
  font-size: 22px;
  margin-bottom: 12px;
  margin-top: 64px;
`;

export default withStyles(styles)(VoterGuidesUnderOneValue);
