import { Chip } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import { filter } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import TagManager from 'react-gtm-module';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import IssueActions from '../../actions/IssueActions';
import OrganizationActions from '../../actions/OrganizationActions';
import SearchBar2024 from '../../common/components/Search/SearchBar2024';
import apiCalming from '../../common/utils/apiCalming';
import { renderLog } from '../../common/utils/logging';
import { convertNameToSlug } from '../../common/utils/textFormat';
import NoSearchResult from '../../components/Search/NoSearchResult';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import GuideList from '../../components/VoterGuide/GuideList';
import EndorsementCard from '../../components/Widgets/EndorsementCard';
import IssueStore from '../../stores/IssueStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';
import ValuesList from './ValuesList';


const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));
const IssueCard = React.lazy(() => import(/* webpackChunk: 'IssueCard' */ '../../components/Values/IssueCard'));
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
      searchText: '',
      voterGuidesForValue: [],
      voterGuidesForValueLength: 0,
      isDataLayerFired: false,
    };
  }

  componentDidMount () {
    this.fireAnalyticsEvent();
    const { match: { params: { value_slug: valueSlug } } } = this.props;
    const issue = IssueStore.getIssueBySlug(valueSlug);
    const issueWeVoteId = issue.issue_we_vote_id;
    this.onIssueStoreChange();
    this.onOrganizationStoreChange();
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    if (apiCalming('issueDescriptionsRetrieve', 3600000)) {
      IssueActions.issueDescriptionsRetrieve();
    }
    if (apiCalming('issuesFollowedRetrieve', 60000)) {
      IssueActions.issuesFollowedRetrieve();
    }
    OrganizationActions.organizationsFollowedRetrieve();
    window.scrollTo(0, 0);
    if (issueWeVoteId) {
      if (apiCalming(`issueOrganizationsRetrieve${issueWeVoteId}`, 3600000)) {
        IssueActions.issueOrganizationsRetrieve(issueWeVoteId);
      }
      this.setState({
        issue,
        issueWeVoteId,
      });
    }
  }

  componentDidUpdate (prevProps) {
    this.fireAnalyticsEvent();
    const { match: { params: prevParams } } = prevProps;
    const { match: { params: nextParams } } = this.props;
    const issue = IssueStore.getIssueBySlug(nextParams.value_slug);
    const issueWeVoteId = issue.issue_we_vote_id;
    if (issueWeVoteId) {
      if (apiCalming(`issueOrganizationsRetrieve${issueWeVoteId}`, 3600000)) {
        IssueActions.issueOrganizationsRetrieve(issueWeVoteId);
      }
    }
    if (prevParams.value_slug !== nextParams.value_slug) {
      this.onIssueStoreChange();
      window.scrollTo(0, 0);
    }
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onIssueStoreChange () {
    const { match: { params: { value_slug: valueSlug } } } = this.props;
    const issue = IssueStore.getIssueBySlug(valueSlug);
    const { organizationsForValueLength } = this.state;
    if (issue && issue.issue_we_vote_id) {
      const voterGuidesForValue = VoterGuideStore.getVoterGuidesForValue(issue.issue_we_vote_id);
      const voterGuidesForValueLength = voterGuidesForValue.length || 0;
      if ((voterGuidesForValueLength > 0) && (organizationsForValueLength === 0)) {
        this.setState({
          listModeShown: 'voterGuidesForThisElection',
        });
      }
      this.setState({
        voterGuidesForValueLength,
        voterGuidesForValue,
        issue,
        issueWeVoteId: issue.issue_we_vote_id,
      }, () => this.onOrganizationStoreChange());
    }
  }

  onOrganizationStoreChange () {
    const { match: { params: { value_slug: valueSlug } } } = this.props;
    const issue = IssueStore.getIssueBySlug(valueSlug);
    const organizationsForValue = IssueStore.getOrganizationsForOneIssue(issue.issue_we_vote_id);
    const organizationsForValueLength = organizationsForValue.length || 0;
    const organizationListIdentifier = `${valueSlug}${organizationsForValueLength}`;
    this.setState({
      organizationsForValue,
      organizationsForValueLength,
      organizationListIdentifier,
    });
  }

  onVoterGuideStoreChange () {
    const { issueWeVoteId, organizationsForValueLength } = this.state;
    const voterGuidesForValue = VoterGuideStore.getVoterGuidesForValue(issueWeVoteId);
    const voterGuidesForValueLength = voterGuidesForValue.length || 0;
    if ((voterGuidesForValueLength > 0) && (organizationsForValueLength === 0)) {
      this.setState({
        listModeShown: 'voterGuidesForThisElection',
      });
    }
    this.setState({
      voterGuidesForValue,
      voterGuidesForValueLength,
    });
  }

fireAnalyticsEvent = () => {
  if (!this.state.isDataLayerFired && VoterStore.voterFirstRetrieveCompleted()) {
    const dataLayerObject = {
      actionDetails: {
        actionType: 'landing',
      },
      event: 'landing',
      pageDetails: getPageDetails(),
      userDetails: VoterStore.getAnalyticsUserDetails(),
    };
    TagManager.dataLayer({ dataLayer: dataLayerObject });
    this.setState({ isDataLayerFired: true });
  }
}

  changeListModeShown = (buttonId) => {
    const { issue } = this.state;
    const dataLayerObject = {
      actionDetails: {
        actionType: 'filter',
        buttonId,
      },
      event: 'action',
      pageDetails: getPageDetails(),
      userDetails: VoterStore.getAnalyticsUserDetails(),
    };
    if (issue.issue_we_vote_id) {
      dataLayerObject.topicDetails = IssueStore.getAnalyticsIssueDetails(issue.issue_we_vote_id);
    }
    TagManager.dataLayer({ dataLayer: dataLayerObject });
    this.setState({
      listModeShown: buttonId,
    });
  }

  searchFunction = (searchText) => {
    this.setState({ searchText });
  }

  clearFunction = () => {
    this.searchFunction('');
  }

  render () {
    renderLog('OneValue');
    const {
      issue, listModeShown,
      searchText, voterGuidesForValueLength,
    } = this.state;
    let issueSlugFromName = '';
    if (issue && issue.issue_name) {
      issueSlugFromName = convertNameToSlug(issue.issue_name);
    }
    let { organizationListIdentifier, organizationsForValue, organizationsForValueLength, voterGuidesForValue } = this.state;
    const { classes } = this.props;
    const { match: { params: { value_slug: valueSlug } } } = this.props;

    let issueNameFound = false;
    let pageTitle = 'Value';
    if (issue && issue.issue_name) {
      issueNameFound = true;
      pageTitle = issue.issue_name;
    }

    if (!issueNameFound) {
      return null;
    }

    const showAllEndorsers = (listModeShown === 'allEndorsers');
    const showEndorsersForThisElection = (listModeShown === 'voterGuidesForThisElection');

    if (searchText.length > 0) {
      let modifiedOrganization;
      const searchTextLowercase = searchText.toLowerCase();
      if (showAllEndorsers) {
        const organizationsForValueModified = [];
        organizationsForValue.forEach((oneOrganization) => {
          if (!oneOrganization.twitter_description) {
            modifiedOrganization = {
              ...oneOrganization,
              twitter_description: '',
            };
            organizationsForValueModified.push(modifiedOrganization);
          } else {
            organizationsForValueModified.push(oneOrganization);
          }
        });
        organizationsForValue = filter(organizationsForValueModified,
          (organization) => (
            organization.organization_name?.toLowerCase().includes(searchTextLowercase) ||
            organization.twitter_description?.toLowerCase().includes(searchTextLowercase) ||
            organization.organization_twitter_handle?.toLowerCase().includes(searchTextLowercase)
          ));
        organizationsForValueLength = organizationsForValue.length;
        organizationListIdentifier = `${valueSlug}${organizationsForValueLength}`;
      }
      if (showEndorsersForThisElection) {
        voterGuidesForValue = filter(voterGuidesForValue,
          (guide) => guide.voter_guide_display_name?.toLowerCase().includes(searchTextLowercase) ||
              guide.twitter_description?.toLowerCase().includes(searchTextLowercase) ||
              guide.twitter_handle?.toLowerCase().includes(searchTextLowercase));
      }
    }

    const advocatesTotalCount = Math.max(organizationsForValueLength, voterGuidesForValueLength);
    let advocatesVisibleCount = 0;
    if (showAllEndorsers) {
      advocatesVisibleCount = organizationsForValueLength;
    } else {
      advocatesVisibleCount = voterGuidesForValue.length;
    }

    const ifPigsFly = false;
    return (
      <PageContentContainer>
        <OneValueWrapper>
          <Helmet>
            <title>{`${pageTitle} - WeVote`}</title>
            {issueSlugFromName && (
              <link rel="canonical" href={`https://wevote.us/value/${issueSlugFromName}`} />
            )}
          </Helmet>
          <IssueCardOuterWrapper>
            <Suspense fallback={<></>}>
              <IssueCard
                advocatesCount={advocatesTotalCount}
                condensed
                followToggleOn
                hideAdvocatesCount
                issue={issue}
                issueImageSize="MEDIUM"
                key={`issue-list-key-${issue.issue_we_vote_id}`}
              />
            </Suspense>
          </IssueCardOuterWrapper>
          <Title id="advocatesTitle">
            Advocates for
            {' '}
            {issue.issue_name}
          </Title>
          {organizationsForValueLength > 0 && (
            <FilterChoices>
              <Chip
                key="forThisElectionKey"
                id="forThisElection"
                label={<span style={showEndorsersForThisElection ? { fontWeight: 600 } : {}}>For This Election</span>}
                className={showEndorsersForThisElection ? classes.selectedChip : classes.notSelectedChip}
                component="div"
                onClick={() => this.changeListModeShown('voterGuidesForThisElection')}
                variant={showEndorsersForThisElection ? undefined : 'outlined'}
              />
              <Chip
                key="allOrganizationsKey"
                id="allEndorsers"
                label={<span style={showAllEndorsers ? { fontWeight: 600 } : {}}>All Endorsers</span>}
                className={showAllEndorsers ? classes.selectedChip : classes.notSelectedChip}
                component="div"
                onClick={() => this.changeListModeShown('allEndorsers')}
                variant={showAllEndorsers ? undefined : 'outlined'}
              />
            </FilterChoices>
          )}
          <SearchBarWrapper>
            <SearchBar2024
              placeholder="Search by name, X handle or description"
              searchFunction={this.searchFunction}
              clearFunction={this.clearFunction}
              searchUpdateDelayTime={250}
            />
          </SearchBarWrapper>
          <Suspense fallback={<></>}>
            <OrganizationList
              incomingOrganizationList={showAllEndorsers ? organizationsForValue : []}
              increaseNumberOfItemsOnScroll
              organizationListIdentifier={showAllEndorsers ? organizationListIdentifier : 'noOrganizations'}
            />
          </Suspense>
          <Suspense fallback={<></>}>
            <GuideList incomingVoterGuideList={showEndorsersForThisElection ? voterGuidesForValue : []} increaseNumberOfItemsOnScroll />
          </Suspense>
          {(advocatesVisibleCount === 0) && (
            <NoSearchResultWrapper>
              <NoSearchResult
                title={`No results found${(showEndorsersForThisElection) ? ' for this election' : ''}.`}
                subtitle="Don't see an organization you want to follow?"
              />
              <EndorsementCard
                  className="btn endorsement-btn btn-sm"
                  bsPrefix="u-margin-top--sm u-stack--xs"
                  variant="primary"
                  buttonText="Endorse organization"
                  text=""
              />
            </NoSearchResultWrapper>
          )}
          {ifPigsFly && (
            <Suspense fallback={<></>}>
              <DelayedLoad waitBeforeShow={2000}>
                <ValuesList currentIssue={issue} hideAdvocatesCount includedOnAnotherPage />
              </DelayedLoad>
            </Suspense>
          )}
          <br />
        </OneValueWrapper>
      </PageContentContainer>
    );
  }
}
OneValue.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object.isRequired,
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
    paddingLeft: 1,
    paddingRight: 1,
  },
  selectedChip: {
    border: '1px solid #bdbdbd',
    margin: 2,
  },
});

const FilterChoices = styled('div')`
  margin-bottom: 8px;
`;

const IssueCardOuterWrapper = styled('div')`
  margin-bottom: 48px;
`;

const NoSearchResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const OneValueWrapper = styled('div')`
  margin: 0 15px;
`;

const SearchBarWrapper = styled('div')`
  margin-bottom: 16px;
`;

const Title = styled('h3')`
  color: #333;
  font-size: 22px;
  margin-bottom: 12px;
  margin-top: 64px;
`;

export default withStyles(styles)(OneValue);
