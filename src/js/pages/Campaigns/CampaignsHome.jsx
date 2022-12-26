import { Chip } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import ActivityActions from '../../actions/ActivityActions';
import IssueActions from '../../actions/IssueActions';
import { SearchTitleTop } from '../../common/components/Style/FilterStyles';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import SearchBar from '../../components/Search/SearchBar';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import CampaignStore from '../../common/stores/CampaignStore';
import CandidateStore from '../../stores/CandidateStore';
import IssueStore from '../../stores/IssueStore';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../common/utils/logging';
import apiCalming from '../../common/utils/apiCalming';
import { cordovaSimplePageContainerTopOffset } from '../../utils/cordovaCalculatedOffsets';
// import { sortCandidateList } from '../../utils/positionFunctions';
import { getTodayAsInteger, getYearFromUltimateElectionDate } from '../../common/utils/dateFormat';
import arrayContains from '../../common/utils/arrayContains';

const CandidateListRoot = React.lazy(() => import(/* webpackChunkName: 'CandidateListRoot' */ '../../components/CandidateListRoot/CandidateListRoot'));
const CampaignListRoot = React.lazy(() => import(/* webpackChunkName: 'CampaignListRoot' */ '../../common/components/Campaign/CampaignListRoot'));

class CampaignsHome extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignList: [],
      candidateList: [],
      isSearching: false,
      listModeShown: 'showUpcomingEndorsements',
      listModeFiltersAvailable: [],
      listModeFiltersTimeStampOfChange: 0,
      listOfYearsWhenCampaignExists: [],
      listOfYearsWhenCandidateExists: [],
      searchText: '',
    };
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    // const { match: { params } } = this.props;
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    const campaignList = CampaignStore.getPromotedCampaignXDicts();
    this.setState({
      campaignList,
    }, () => this.onIncomingCampaignListChange(true));
    const candidateList = CandidateStore.getCandidateList();
    this.setState({
      candidateList,
    }, () => this.onIncomingCandidateListChange(true));

    if (apiCalming('issueDescriptionsRetrieve', 3600000)) { // Only once per 60 minutes
      IssueActions.issueDescriptionsRetrieve();
    }
    if (apiCalming('issuesFollowedRetrieve', 60000)) { // Only once per minute
      IssueActions.issuesFollowedRetrieve();
    }
    if (VoterStore.electionId() && !IssueStore.issuesUnderBallotItemsRetrieveCalled(VoterStore.electionId())) {
      IssueActions.issuesUnderBallotItemsRetrieve(VoterStore.electionId());
    }
    if (apiCalming('activityNoticeListRetrieve', 10000)) {
      ActivityActions.activityNoticeListRetrieve();
    }
    // AnalyticsActions.saveActionOffice(VoterStore.electionId(), params.office_we_vote_id);
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    if (this.modalOpenTimer) clearTimeout(this.modalOpenTimer);
  }

  onCampaignStoreChange () {
    const campaignList = CampaignStore.getPromotedCampaignXDicts();
    this.setState({
      campaignList,
    }, () => this.onIncomingCampaignListChange());
  }

  onCandidateStoreChange () {
    const candidateList = CandidateStore.getCandidateList();
    this.setState({
      candidateList,
    }, () => this.onIncomingCandidateListChange());
  }

  onIncomingCampaignListChange (setDefaultListMode = false) {
    const campaignList = CampaignStore.getPromotedCampaignXDicts();
    console.log('CampaignsHome onIncomingCampaignListChange, campaignList:', campaignList);
    this.setState({
      listOfYearsWhenCampaignExists: this.getListOfYearsWhenCampaignExists(campaignList),
    }, () => this.updateActiveFilters(setDefaultListMode));
  }

  onIncomingCandidateListChange (setDefaultListMode = false) {
    const candidateList = CandidateStore.getCandidateList();
    console.log('CampaignsHome onIncomingCandidateListChange, candidateList:', candidateList);
    this.setState({
      listOfYearsWhenCandidateExists: this.getListOfYearsWhenCandidateExists(candidateList),
    }, () => this.updateActiveFilters(setDefaultListMode));
  }

  orderByFilterOrder = (firstFilter, secondFilter) => firstFilter.filterOrder - secondFilter.filterOrder;

  orderPositionsByBallotItemTwitterFollowers = (firstEntry, secondEntry) => secondEntry.ballot_item_twitter_followers_count - firstEntry.ballot_item_twitter_followers_count;

  updateActiveFilters = (setDefaultListMode = false) => {
    const { campaignList, candidateList, listOfYearsWhenCampaignExists, listOfYearsWhenCandidateExists } = this.state;
    let { listModeShown } = this.state;
    const listOfYears = [...new Set([...listOfYearsWhenCampaignExists, ...listOfYearsWhenCandidateExists])];
    console.log('listOfYears:', listOfYears, ', setDefaultListMode:', setDefaultListMode);
    let filterCount = 0;
    let upcomingEndorsementsAvailable = false;
    const todayAsInteger = getTodayAsInteger();
    campaignList.forEach((oneCampaign) => {
      if (oneCampaign.final_election_date_as_integer >= todayAsInteger) {
        upcomingEndorsementsAvailable = true;
      }
    });
    candidateList.forEach((oneCandidate) => {
      if (oneCandidate.candidate_ultimate_election_date >= todayAsInteger) {
        upcomingEndorsementsAvailable = true;
      }
    });
    if (setDefaultListMode) {
      listModeShown = this.getDefaultListModeShown(upcomingEndorsementsAvailable);
    }
    // console.log('updateActiveFilters listModeShown:', listModeShown);
    let listModeFiltersAvailable = [
    ];
    listOfYears.forEach((oneYear) => {
      filterCount += 1;
      listModeFiltersAvailable.push({
        filterDisplayName: `${oneYear}`,
        filterName: `show${oneYear}`,
        filterOrder: oneYear,
        filterSelected: listModeShown === `show${oneYear}`,
        filterType: 'showYear',
        filterYear: oneYear,
      });
    });
    if (upcomingEndorsementsAvailable) {
      filterCount += 1;
      listModeFiltersAvailable.push({
        filterDisplayName: 'This Election',
        filterName: 'showUpcomingEndorsements',
        filterOrder: 1,
        filterSelected: listModeShown === 'showUpcomingEndorsements',
        filterType: 'showUpcomingEndorsements',
      });
    }
    if (filterCount > 1) {
      listModeFiltersAvailable.push({
        filterDisplayName: 'All',
        filterName: 'showAllEndorsements',
        filterOrder: 5000,
        filterSelected: listModeShown === 'showAllEndorsements',
        filterType: 'showAllEndorsements',
      });
    }
    listModeFiltersAvailable = listModeFiltersAvailable.sort(this.orderByFilterOrder);
    // console.log('listModeFiltersAvailable:', listModeFiltersAvailable);
    const listModeFiltersTimeStampOfChange = Date.now();
    if (setDefaultListMode) {
      this.setState({
        listModeFiltersAvailable,
        listModeFiltersTimeStampOfChange,
        upcomingEndorsementsAvailable,
        listModeShown: this.getDefaultListModeShown(),
      });
    } else {
      this.setState({
        listModeFiltersAvailable,
        listModeFiltersTimeStampOfChange,
        upcomingEndorsementsAvailable,
      });
    }
  }

  changeListModeShown = (newListModeShown) => {
    this.setState({
      listModeShown: newListModeShown,
    }, () => this.updateActiveFilters());
  }

  getDefaultListModeShown = (incomingUpcomingEndorsementsAvailable = false) => {
    const { listOfYearsWhenCampaignExists, listOfYearsWhenCandidateExists, upcomingEndorsementsAvailable } = this.state;
    const listOfYears = [...new Set([...listOfYearsWhenCampaignExists, ...listOfYearsWhenCandidateExists])];
    // console.log('getDefaultListModeShown listOfYearsWhenCandidateExists:', listOfYearsWhenCandidateExists);
    if (upcomingEndorsementsAvailable || incomingUpcomingEndorsementsAvailable) {
      return 'showUpcomingEndorsements';
    } else if (listOfYears && listOfYears.length > 0) {
      const mostRecentYear = Math.max.apply(null, listOfYears);
      // console.log('mostRecentYear:', mostRecentYear);
      return `show${mostRecentYear}`;
    }
    return 'showAllEndorsements';
  }

  getListOfYearsWhenCampaignExists = (campaignList) => {
    const listOfYearsWhenCampaignExists = [];
    let tempYearInteger;
    campaignList.forEach((oneCampaign) => {
      if (oneCampaign.final_election_date_as_integer && oneCampaign.final_election_date_as_integer > 0) {
        tempYearInteger = getYearFromUltimateElectionDate(oneCampaign.final_election_date_as_integer);
        console.log('getListOfYearsWhenCampaignExists:', tempYearInteger, ', oneCampaign:', oneCampaign);
        if (!arrayContains(tempYearInteger, listOfYearsWhenCampaignExists)) {
          listOfYearsWhenCampaignExists.push(tempYearInteger);
        }
      }
    });
    return listOfYearsWhenCampaignExists;
  }

  getListOfYearsWhenCandidateExists = (candidateList) => {
    const listOfYearsWhenCandidateExists = [];
    let tempYearInteger;
    candidateList.forEach((oneCandidate) => {
      if (oneCandidate.candidate_ultimate_election_date && oneCandidate.candidate_ultimate_election_date > 0) {
        tempYearInteger = getYearFromUltimateElectionDate(oneCandidate.candidate_ultimate_election_date);
        console.log('getListOfYearsWhenCampaignExists:', tempYearInteger, ', oneCandidate:', oneCandidate);
        if (!arrayContains(tempYearInteger, listOfYearsWhenCandidateExists)) {
          listOfYearsWhenCandidateExists.push(tempYearInteger);
        }
      }
    });
    return listOfYearsWhenCandidateExists;
  }

  searchFunction = (searchText) => {
    const { listModeShown, searchText: previousSearchText } = this.state;
    let searchingJustStarted = false;
    if (previousSearchText.length === 0 && searchText.length === 1) {
      searchingJustStarted = true;
    }
    const isSearching = (searchText && searchText.length > 0);
    this.setState({
      isSearching,
      listModeShown: searchingJustStarted ? '' : listModeShown,
      searchText,
    }, () => this.updateActiveFilters());
  }

  clearFunction = () => {
    this.searchFunction('');
  }

  getTopPadding = () => {
    if (isWebApp()) {
      return { paddingTop: '0 !important' };
    }
    cordovaSimplePageContainerTopOffset(VoterStore.getVoterIsSignedIn());
    return {};
  }

  render () {
    renderLog('CampaignsHome');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { isSearching, listModeFiltersAvailable, listModeFiltersTimeStampOfChange, searchText } = this.state;
    // console.log('CampaignsHome.jsx office:', office, ', candidateList:', candidateList);

    const titleText = 'Candidates - We Vote';
    const descriptionText = 'Choose which candidates you support.';

    return (
      <PageContentContainer>
        <CampaignsHomeContainer className="container-fluid" style={this.getTopPadding()}>
          <Helmet
            title={titleText}
            meta={[{ name: 'description', content: descriptionText }]}
          />
          <CampaignsHomeFilterWrapper>
            {(isSearching && searchText) && (
              <SearchTitleTop>
                Searching for &quot;
                {searchText}
                &quot;
              </SearchTitleTop>
            )}
            {!!(listModeFiltersAvailable) && (
              <CampaignsHomeFilterChoices>
                {listModeFiltersAvailable.map((oneFilter) => (
                  <Chip
                    key={oneFilter.filterName}
                    label={<span style={oneFilter.filterSelected ? { fontWeight: 600 } : {}}>{oneFilter.filterDisplayName}</span>}
                    className={oneFilter.filterSelected ? classes.selectedChip : classes.notSelectedChip}
                    component="div"
                    onClick={() => this.changeListModeShown(oneFilter.filterName)}
                    variant={oneFilter.filterSelected ? undefined : 'outlined'}
                  />
                ))}
              </CampaignsHomeFilterChoices>
            )}
            <SearchBarWrapper>
              <SearchBar
                clearButton
                searchButton
                placeholder="Search by name, office or state"
                searchFunction={this.searchFunction}
                clearFunction={this.clearFunction}
                searchUpdateDelayTime={0}
              />
            </SearchBarWrapper>
          </CampaignsHomeFilterWrapper>
          <WhatIsHappeningSection>
            <Suspense fallback={<span>&nbsp;</span>}>
              <CampaignListRoot
                listModeFilters={listModeFiltersAvailable}
                listModeFiltersTimeStampOfChange={listModeFiltersTimeStampOfChange}
                searchText={searchText}
                titleTextIfCampaigns="Sponsored Campaigns"
              />
            </Suspense>
          </WhatIsHappeningSection>
          <WhatIsHappeningSection>
            <Suspense fallback={<span>&nbsp;</span>}>
              <CandidateListRoot
                listModeFilters={listModeFiltersAvailable}
                listModeFiltersTimeStampOfChange={listModeFiltersTimeStampOfChange}
                searchText={searchText}
                titleTextIfCampaigns="On Your Ballot"
              />
            </Suspense>
          </WhatIsHappeningSection>
        </CampaignsHomeContainer>
      </PageContentContainer>
    );
  }
}
CampaignsHome.propTypes = {
  classes: PropTypes.object,
  // match: PropTypes.object.isRequired,
};

const styles = () => ({
  iconButton: {
    padding: 8,
  },
  notSelectedChip: {
    margin: 2,
  },
  selectedChip: {
    border: '1px solid #bdbdbd',
    margin: 2,
  },
});

const CampaignsHomeContainer = styled('div')`
`;

const CampaignsHomeFilterChoices = styled('div')`
  margin-top: 8px;
`;

const CampaignsHomeFilterWrapper = styled('div')`
  margin-top: 48px;
  margin-bottom: 24px;
`;

const SearchBarWrapper = styled('div')`
  margin-top: 4px;
  margin-bottom: 8px;
`;

const WhatIsHappeningSection = styled('div')`
  margin: 0 0 25px 0;
`;

export default withStyles(styles)(CampaignsHome);

