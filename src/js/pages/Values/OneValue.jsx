import { Chip } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import IssueActions from '../../actions/IssueActions';
import apiCalming from '../../common/utils/apiCalming';
import { renderLog } from '../../common/utils/logging';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import GuideList from '../../components/VoterGuide/GuideList';
import IssueStore from '../../stores/IssueStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import ValuesList from './ValuesList';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));
const IssueCard = React.lazy(() => import(/* webpackChunkName: 'IssueCard' */ '../../components/Values/IssueCard'));
const OrganizationList = React.lazy(() => import(/* webpackChunkName: 'OrganizationList' */ '../../components/Organization/OrganizationList'));


class OneValue extends Component {
  constructor (props) {
    super(props);
    this.state = {
      issue: {},
      issueWeVoteId: '',
      listModeShown: 'allEndorsers',
      organizationsForValue: [],
      organizationsForValueLength: 0,
      organizationListIdentifier: '',
      voterGuidesForValue: [],
      voterGuidesForValueLength: 0,
    };
  }

  componentDidMount () {
    const { match: { params: { value_slug: valueSlug } } } = this.props;
    const issue = IssueStore.getIssueBySlug(valueSlug);
    const issueWeVoteId = issue.issue_we_vote_id;
    this.onIssueStoreChange();
    this.onOrganizationStoreChange();
    // this.onVoterGuideStoreChange(); // Updated by componentDidUpdate
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    if (apiCalming('issueDescriptionsRetrieve', 3600000)) { // Only once per 60 minutes
      IssueActions.issueDescriptionsRetrieve();
    }
    if (apiCalming('issuesFollowedRetrieve', 60000)) { // Only once per minute
      IssueActions.issuesFollowedRetrieve();
    }
    window.scrollTo(0, 0);
    if (issueWeVoteId) {
      if (apiCalming(`issueOrganizationsRetrieve${issueWeVoteId}`, 3600000)) { // Only once per 60 minutes
        IssueActions.issueOrganizationsRetrieve(issueWeVoteId);
      }
      this.setState({
        issue,
        issueWeVoteId,
      });
    }
  }

  componentDidUpdate (prevProps) {
    const { match: { params: prevParams } } = prevProps;
    const { match: { params: nextParams } } = this.props;
    // console.log('prevParams:', prevParams, 'nextParams:', nextParams);
    if (prevParams.value_slug !== nextParams.value_slug) {
      this.onIssueStoreChange();
      // this.onOrganizationStoreChange();
      const issue = IssueStore.getIssueBySlug(nextParams.value_slug);
      const issueWeVoteId = issue.issue_we_vote_id;
      if (issueWeVoteId) {
        if (apiCalming(`issueOrganizationsRetrieve${issueWeVoteId}`, 3600000)) { // Only once per 60 minutes
          IssueActions.issueOrganizationsRetrieve(issueWeVoteId);
        }
      }
      window.scrollTo(0, 0);
    }
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onIssueStoreChange () {
    // console.log('oneIssueStoreChange');
    const { match: { params: { value_slug: valueSlug } } } = this.props;
    const issue = IssueStore.getIssueBySlug(valueSlug);
    // console.log('onIssueStoreChange, valueSlug', valueSlug, ', issue:', issue);
    if (issue && issue.issue_we_vote_id) {
      const voterGuidesForValue = VoterGuideStore.getVoterGuidesForValue(issue.issue_we_vote_id);
      const voterGuidesForValueLength = voterGuidesForValue.length || 0;
      this.setState({
        voterGuidesForValueLength,
        voterGuidesForValue,
        issue,
        issueWeVoteId: issue.issue_we_vote_id,
      }, () => this.onOrganizationStoreChange());
    }
  }

  onOrganizationStoreChange () {
    // console.log('oneOrganizationStoreChange');
    const { match: { params: { value_slug: valueSlug } } } = this.props;
    const issue = IssueStore.getIssueBySlug(valueSlug);
    // console.log('onOrganizationStoreChange, valueSlug', valueSlug, ', issue:', issue);
    const organizationsForValue = IssueStore.getOrganizationsForOneIssue(issue.issue_we_vote_id);
    const organizationsForValueLength = organizationsForValue.length || 0;
    // If either the issue changes, or the number of organizations, we change the identifier so the OrganizationList will update
    const organizationListIdentifier = `${valueSlug}${organizationsForValueLength}`;
    // console.log('onOrganizationStoreChange, organizationListIdentifier: ', organizationListIdentifier);
    this.setState({
      organizationsForValue,
      organizationsForValueLength,
      organizationListIdentifier,
    });
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

  changeListModeShown = (newListModeShown) => {
    this.setState({
      listModeShown: newListModeShown,
    });
  }

  render () {
    renderLog('OneValue');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      issue, listModeShown,
      organizationsForValue, organizationsForValueLength, organizationListIdentifier,
      voterGuidesForValue, voterGuidesForValueLength,
    } = this.state;

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

    const showAllEndorsers = (listModeShown === 'allEndorsers') || (voterGuidesForValueLength === 0);
    const showEndorsersForThisElection = (listModeShown === 'voterGuidesForThisElection') && (voterGuidesForValueLength > 0);
    const advocatesCount = Math.max(organizationsForValueLength, voterGuidesForValueLength);
    return (
      <PageContentContainer>
        <OneValueWrapper>
          <Helmet title={`${pageTitle} - We Vote`} />
          <IssueCardWrapper>
            <Suspense fallback={<></>}>
              <IssueCard
                advocatesCount={advocatesCount}
                condensed
                followToggleOn
                hideAdvocatesCount
                issue={issue}
                issueImageSize="MEDIUM"
                key={`issue-list-key-${issue.issue_we_vote_id}`}
              />
            </Suspense>
          </IssueCardWrapper>
          {voterGuidesForValueLength > 0 && (
            <FilterChoices>
              <Chip
                key="allOrganizationsKey"
                label="All Endorsers"
                className={classes.notSelectedChip}
                component="div"
                onClick={() => this.changeListModeShown('allEndorsers')}
                variant={showAllEndorsers ? undefined : 'outlined'}
              />
              <Chip
                key="forThisElectionKey"
                label="For this Election"
                className={classes.notSelectedChip}
                component="div"
                onClick={() => this.changeListModeShown('voterGuidesForThisElection')}
                variant={showEndorsersForThisElection ? undefined : 'outlined'}
              />
            </FilterChoices>
          )}
          {/* This is not currently working and probably doesn't make sense to allow search on a single value page.
          <SearchGuidesToFollowBox /> */}
          <Title id="advocatesTitle">
            Advocates for
            {' '}
            {issue.issue_name}
          </Title>
          {showAllEndorsers && (
            <Suspense fallback={<></>}>
              <OrganizationList
                incomingOrganizationList={organizationsForValue}
                organizationListIdentifier={organizationListIdentifier}
              />
            </Suspense>
          )}
          {showEndorsersForThisElection && (
            <>
              <div className="card">
                <Suspense fallback={<></>}>
                  <GuideList incomingVoterGuideList={voterGuidesForValue} />
                </Suspense>
              </div>
            </>
          )}
          <Suspense fallback={<></>}>
            <DelayedLoad waitBeforeShow={2000}>
              <>
                <ValuesList currentIssue={issue} hideAdvocatesCount includedOnAnotherPage />
              </>
            </DelayedLoad>
          </Suspense>
          <br />
        </OneValueWrapper>
      </PageContentContainer>
    );
  }
}
OneValue.propTypes = {
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
  notSelectedChip: {
    margin: 2,
  },
  selectedChip: {
    margin: 2,
  },
});

const FilterChoices = styled('div')`
  margin-bottom: 24px;
`;

const IssueCardWrapper = styled('div')`
  margin-bottom: 48px;
`;

const OneValueWrapper = styled('div')`
  margin: 0 15px;
`;

const Title = styled('h3')`
  color: #333;
  font-size: 22px;
  margin-bottom: 12px;
  margin-top: 64px;
`;

export default withStyles(styles)(OneValue);
