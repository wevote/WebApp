import { Button, Card } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Ballot } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import IssueActions from '../../actions/IssueActions';
import GuideList from '../../components/VoterGuide/GuideList';
import IssueStore from '../../stores/IssueStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import { historyPush } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import { PageContentContainer } from '../../utils/pageLayoutStyles';
import ValuesList from './ValuesList';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../components/Widgets/DelayedLoad'));
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
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    const { match: { params: nextParams } } = nextProps;
    const issue = IssueStore.getIssueBySlug(nextParams.value_slug);
    const voterGuidesForValue = VoterGuideStore.getVoterGuidesForValue(issue.issue_we_vote_id);
    const voterGuidesForValueLength = voterGuidesForValue.length || 0;
    this.setState({
      voterGuidesForValue,
      voterGuidesForValueLength,
      issue,
      issueWeVoteId: issue.issue_we_vote_id,
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.issueWeVoteId !== nextState.issueWeVoteId) {
      return true;
    }
    if (this.state.voterGuidesForValueLength !== nextState.voterGuidesForValueLength) {
      return true;
    }
    return false;
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
          <IssueCard
            followToggleOn
            issue={issue}
            issueImageSize="MEDIUM"
            key={`issue-list-key-${issue.issue_we_vote_id}`}
          />
          {/* This is not currently working and probably doesn't make sense to allow search on a single value page.
          <SearchGuidesToFollowBox /> */}
          { !voterGuidesForValueLength ? (
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
          ) : (
            <>
              <div className="card">
                <Suspense fallback={<span>Loading...</span>}>
                  <GuideList incomingVoterGuideList={voterGuidesForValue} />
                </Suspense>
              </div>
            </>
          )}
          <DelayedLoad waitBeforeShow={2000}>
            <>
              <Title id="valuesListTitle">Explore More Values</Title>
              <ValuesList displayOnlyIssuesNotFollowedByVoter currentIssue={issue} />
            </>
          </DelayedLoad>
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
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const EmptyValueMessageContainer = styled.div`
  padding: 1em 2em;
  display: flex;
  flex-flow: column;
  align-items: center;
`;

const EmptyValueText = styled.p`
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
