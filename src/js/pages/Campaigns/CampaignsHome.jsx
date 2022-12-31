import { Chip, FormControl, InputLabel, Select } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import ActivityActions from '../../actions/ActivityActions';
import IssueActions from '../../actions/IssueActions';
import { SearchTitleTop } from '../../common/components/Style/FilterStyles';
import { convertStateCodeToStateText, convertStateTextToStateCode, stateCodeMap } from '../../common/utils/addressFunctions';
import extractAttributeValueListFromObjectList from '../../common/utils/extractAttributeValueListFromObjectList';
import historyPush from '../../common/utils/historyPush';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import SearchBar from '../../components/Search/SearchBar';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import BallotStore from '../../stores/BallotStore';
import CampaignStore from '../../common/stores/CampaignStore';
import CandidateStore from '../../stores/CandidateStore';
import IssueStore from '../../stores/IssueStore';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../common/utils/logging';
import apiCalming from '../../common/utils/apiCalming';
import { cordovaSimplePageContainerTopOffset } from '../../utils/cordovaCalculatedOffsets';
import { getTodayAsInteger, getYearFromUltimateElectionDate } from '../../common/utils/dateFormat';
import arrayContains from '../../common/utils/arrayContains';

const CandidateListRoot = React.lazy(() => import(/* webpackChunkName: 'CandidateListRoot' */ '../../components/CandidateListRoot/CandidateListRoot'));
// const CampaignListRoot = React.lazy(() => import(/* webpackChunkName: 'CampaignListRoot' */ '../../common/components/Campaign/CampaignListRoot'));
// const FirstCampaignListController = React.lazy(() => import(/* webpackChunkName: 'FirstCampaignListController' */ '../../common/components/Campaign/FirstCampaignListController'));
const FirstCandidateListController = React.lazy(() => import(/* webpackChunkName: 'FirstCandidateListController' */ '../../components/CandidateListRoot/FirstCandidateListController'));

class CampaignsHome extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignList: [],
      // campaignListTimeStampOfChange: 0,
      candidateList: [],
      candidateListTimeStampOfChange: 0,
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
    const { match: { params: {
      state_candidates_phrase: stateCandidatesPhrase,
    } } } = this.props;
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // const campaignList = CampaignStore.getPromotedCampaignXDicts();
    const campaignList = CampaignStore.getAllCachedCampaignXList();
    this.setState({
      campaignList,
      // campaignListTimeStampOfChange: Date.now(),
    }, () => this.onIncomingCampaignListChange(true));
    const candidateList = CandidateStore.getCandidateList();
    // Note: sorting is being done in CandidateListRoot
    const candidateListOnYourBallot = BallotStore.getAllBallotItemsFlattened();
    const weVoteIdsOnYourBallot = extractAttributeValueListFromObjectList('we_vote_id', candidateListOnYourBallot);
    const candidateListOther = candidateList.filter((oneCandidate) => !arrayContains(oneCandidate.we_vote_id, weVoteIdsOnYourBallot));

    this.setState({
      candidateList,
      candidateListOnYourBallot,
      candidateListOther,
      candidateListTimeStampOfChange: Date.now(),
    }, () => this.onIncomingCandidateListChange(true));
    if (stateCandidatesPhrase) {
      let stateName = stateCandidatesPhrase.replace('-candidates', '');
      stateName = stateName.replace('-', ' ');
      let newStateCode = convertStateTextToStateCode(stateName);
      if (newStateCode.toLowerCase() === 'na') {
        newStateCode = 'all';
      }
      // console.log('componentDidMount newStateCode:', newStateCode);
      this.setState({
        stateCode: newStateCode,
      });
    } else if (VoterStore.getStateCodeFromIPAddress()) {
      const newPathname = this.getStateNamePathnameFromStateCode(VoterStore.getStateCodeFromIPAddress());
      const { location: { pathname } } = window;
      if (pathname !== newPathname) {
        historyPush(newPathname);
      } else {
        this.setState({ stateCode: VoterStore.getStateCodeFromIPAddress() });
      }
    }
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

  componentDidUpdate (prevProps) {
    const { match: { params: { state_candidates_phrase: previousStateCandidatesPhrase } } } = prevProps;
    const { match: { params: { state_candidates_phrase: stateCandidatesPhrase } } } = this.props;
    if (stateCandidatesPhrase && (stateCandidatesPhrase !== previousStateCandidatesPhrase)) {
      let stateName = stateCandidatesPhrase.replace('-candidates', '');
      if (stateName) {
        stateName = stateName.replace('-', ' ');
        const { stateCode } = this.state;
        let newStateCode = convertStateTextToStateCode(stateName);
        // console.log('stateCode:', stateCode, ', newStateCode:', newStateCode);
        if (newStateCode.toLowerCase() === 'na') {
          newStateCode = 'all';
        }
        if (newStateCode !== stateCode) {
          this.setState({
            stateCode: newStateCode,
          });
        }
      }
      window.scrollTo(0, 0);
    }
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
    this.campaignStoreListener.remove();
    this.candidateStoreListener.remove();
    this.voterStoreListener.remove();
    if (this.modalOpenTimer) clearTimeout(this.modalOpenTimer);
  }

  onBallotStoreChange () {
    const { candidateList } = this.state;
    const candidateListOnYourBallot = BallotStore.getAllBallotItemsFlattened();
    const weVoteIdsOnYourBallot = extractAttributeValueListFromObjectList('we_vote_id', candidateListOnYourBallot);
    const candidateListOther = candidateList.filter((oneCandidate) => !arrayContains(oneCandidate.we_vote_id, weVoteIdsOnYourBallot));
    this.setState({
      candidateListOnYourBallot,
      candidateListOther,
      candidateListTimeStampOfChange: Date.now(),
    }, () => this.onIncomingCandidateListChange());
  }

  onCampaignStoreChange () {
    // const campaignList = CampaignStore.getPromotedCampaignXDicts();
    const campaignList = CampaignStore.getAllCachedCampaignXList();
    this.setState({
      campaignList,
      // campaignListTimeStampOfChange: Date.now(),
    }, () => this.onIncomingCampaignListChange());
  }

  onCandidateStoreChange () {
    const candidateList = CandidateStore.getCandidateList();
    // Note: sorting is being done in CandidateListRoot
    const candidateListOnYourBallot = BallotStore.getAllBallotItemsFlattened();
    const weVoteIdsOnYourBallot = extractAttributeValueListFromObjectList('we_vote_id', candidateListOnYourBallot);
    const candidateListOther = candidateList.filter((oneCandidate) => !arrayContains(oneCandidate.we_vote_id, weVoteIdsOnYourBallot));
    this.setState({
      candidateList,
      candidateListOnYourBallot,
      candidateListOther,
      candidateListTimeStampOfChange: Date.now(),
    }, () => this.onIncomingCandidateListChange());
  }

  onVoterStoreChange () {
    const { stateCode } = this.state;
    if (!stateCode) {
      this.setState({
        stateCode: VoterStore.getStateCode() || VoterStore.getStateCodeFromIPAddress(),
      });
    }
  }

  onIncomingCampaignListChange (setDefaultListMode = false) {
    const { campaignList, stateCode } = this.state;
    // console.log('CampaignsHome onIncomingCampaignListChange, campaignList:', campaignList);
    // Do campaigns exist for this state?
    let campaignsShowing = false;
    if (stateCode && stateCode.toLowerCase() === 'all') {
      campaignsShowing = true;
    } else if (stateCode) {
      campaignList.forEach((oneCampaign) => {
        const politicianStateCodeList = extractAttributeValueListFromObjectList('state_code', oneCampaign.campaignx_politician_list, true);
        if (!campaignsShowing && arrayContains(stateCode.toLowerCase(), politicianStateCodeList)) {
          campaignsShowing = true;
        }
      });
    }
    this.setState({
      campaignsShowing,
      listOfYearsWhenCampaignExists: this.getListOfYearsWhenCampaignExists(campaignList),
    }, () => this.updateActiveFilters(setDefaultListMode));
  }

  onIncomingCandidateListChange (setDefaultListMode = false) {
    const { candidateList } = this.state;
    // console.log('CampaignsHome onIncomingCandidateListChange, candidateList:', candidateList);
    this.setState({
      listOfYearsWhenCandidateExists: this.getListOfYearsWhenCandidateExists(candidateList),
    }, () => this.updateActiveFilters(setDefaultListMode));
  }

  orderByFilterOrder = (firstFilter, secondFilter) => firstFilter.filterOrder - secondFilter.filterOrder;

  updateActiveFilters = (setDefaultListMode = false) => {
    const { campaignList, candidateList, listOfYearsWhenCampaignExists, listOfYearsWhenCandidateExists } = this.state;
    let { listModeShown } = this.state;
    const listOfYears = [...new Set([...listOfYearsWhenCampaignExists, ...listOfYearsWhenCandidateExists])];
    // console.log('listOfYears:', listOfYears, ', setDefaultListMode:', setDefaultListMode);
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
    // const numberOfYears = listOfYears.length;
    // const useDropdownWithThisNumberOfYears = 4;
    // const displayAsChip = numberOfYears < useDropdownWithThisNumberOfYears;
    const displayAsChip = true; // Explore converting this to a drop down
    listOfYears.forEach((oneYear) => {
      filterCount += 1;
      listModeFiltersAvailable.push({
        displayAsChip,
        filterDisplayName: `${oneYear}`,
        filterName: `show${oneYear}`,
        filterOrder: 5000 - oneYear,
        filterSelected: listModeShown === `show${oneYear}`,
        filterType: 'showYear',
        filterYear: oneYear,
      });
    });
    if (upcomingEndorsementsAvailable) {
      filterCount += 1;
      listModeFiltersAvailable.push({
        displayAsChip: true,
        filterDisplayName: 'Upcoming',
        filterName: 'showUpcomingEndorsements',
        filterOrder: 1,
        filterSelected: listModeShown === 'showUpcomingEndorsements',
        filterType: 'showUpcomingEndorsements',
      });
    }
    if (filterCount > 1) {
      listModeFiltersAvailable.push({
        displayAsChip,
        filterDisplayName: 'All Years',
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
        // console.log('getListOfYearsWhenCampaignExists:', tempYearInteger, ', oneCampaign:', oneCampaign);
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
        if (!arrayContains(tempYearInteger, listOfYearsWhenCandidateExists)) {
          listOfYearsWhenCandidateExists.push(tempYearInteger);
        }
      }
    });
    return listOfYearsWhenCandidateExists;
  }

  getStateNamePathnameFromStateCode = (stateCode) => {
    const stateName = convertStateCodeToStateText(stateCode);
    const stateNamePhrase = `${stateName}-candidates`;
    const stateNamePhraseLowerCase = stateNamePhrase.replace(/\s+/g, '-').toLowerCase();
    return `/${stateNamePhraseLowerCase}/cs/`;
  }

  handleChooseStateChange = (e) => {
    if (e.target.value === 'all') {
      this.setState({ stateCode: e.target.value });
    } else {
      const newPathname = this.getStateNamePathnameFromStateCode(e.target.value);
      const { location: { pathname } } = window;
      if (pathname !== newPathname) {
        historyPush(newPathname);
      } else {
        this.setState({ stateCode: e.target.value });
      }
    }
  }

  clearSearchFunction = () => {
    this.setState({
      isSearching: false,
      searchText: '',
    }, () => this.updateActiveFilters());
  }

  searchFunction = (searchText) => {
    const { listModeShown, searchText: previousSearchText, stateCode: currentStateCode } = this.state;
    let searchingJustStarted = false;
    if (previousSearchText.length === 0 && searchText.length > 0) {
      searchingJustStarted = true;
    }
    const isSearching = (searchText && searchText.length > 0);
    this.setState({
      isSearching,
      listModeShown: searchingJustStarted ? '' : listModeShown,
      searchText,
      stateCode: searchingJustStarted ? '' : currentStateCode,
    }, () => this.updateActiveFilters());
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
    const {
      // campaignList, campaignListTimeStampOfChange,
      campaignsShowing,
      candidateListOther, candidateListTimeStampOfChange,
      candidateListOnYourBallot,
      isSearching, listModeFiltersAvailable, listModeFiltersTimeStampOfChange, searchText, stateCode,
    } = this.state;
    // console.log('CampaignsHome.jsx campaignList:', campaignList);

    const titleText = 'Candidates - We Vote';
    const descriptionText = 'Choose which candidates you support.';
    let stateCodeTemp;
    const stateNameList = Object.values(stateCodeMap);

    return (
      <PageContentContainer>
        <CampaignsHomeContainer className="container-fluid" style={this.getTopPadding()}>
          <Helmet
            title={titleText}
            meta={[{ name: 'description', content: descriptionText }]}
          />
          <CampaignsHomeFilterWrapper>
            {(isSearching && searchText) ? (
              <SearchTitleTop>
                Searching for &quot;
                {searchText}
                &quot;
              </SearchTitleTop>
            ) : (
              <SearchTitleTop className="u-show-mobile">
                Candidates
              </SearchTitleTop>
            )}
            {!!(listModeFiltersAvailable) && (
              <CampaignsHomeFilterChoices>
                {listModeFiltersAvailable.map((oneFilter) => (
                  <span key={oneFilter.filterName}>
                    {oneFilter.displayAsChip && (
                      <Chip
                        label={<span style={oneFilter.filterSelected ? { fontWeight: 600 } : {}}>{oneFilter.filterDisplayName}</span>}
                        className={oneFilter.filterSelected ? classes.selectedChip : classes.notSelectedChip}
                        component="div"
                        onClick={() => this.changeListModeShown(oneFilter.filterName)}
                        variant={oneFilter.filterSelected ? undefined : 'outlined'}
                      />
                    )}
                  </span>
                ))}
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel htmlFor="outlined-age-native-simple" />
                  <Select
                    classes={{ select: classes.select }}
                    native
                    value={stateCode}
                    onChange={this.handleChooseStateChange}
                    label="State"
                    inputProps={{
                      name: 'age',
                      id: 'outlined-age-native-simple',
                    }}
                  >
                    <option aria-label="-- any state --" value="all">-- any state --</option>
                    {stateNameList.map((stateName) => {
                      if (stateName === 'National') {
                        return null;
                      } else {
                        stateCodeTemp = convertStateTextToStateCode(stateName);
                        return (
                          <option key={`${stateCodeTemp}-option`} value={stateCodeTemp}>{stateName}</option>
                        );
                      }
                    })}
                  </Select>
                </FormControl>
              </CampaignsHomeFilterChoices>
            )}
            <SearchBarWrapper>
              <SearchBar
                clearButton
                searchButton
                placeholder="Search by name, office or state"
                searchFunction={this.searchFunction}
                clearFunction={this.clearSearchFunction}
                searchUpdateDelayTime={500}
              />
            </SearchBarWrapper>
          </CampaignsHomeFilterWrapper>
          {/*
          <WhatIsHappeningSection>
            <Suspense fallback={<span>&nbsp;</span>}>
              <CampaignListRoot
                incomingList={campaignList}
                incomingListTimeStampOfChange={campaignListTimeStampOfChange}
                listModeFilters={listModeFiltersAvailable}
                listModeFiltersTimeStampOfChange={listModeFiltersTimeStampOfChange}
                searchText={searchText}
                stateCode={stateCode}
                titleTextIfCampaigns="Campaigns"
              />
            </Suspense>
          </WhatIsHappeningSection>
          */}
          {(candidateListOnYourBallot && candidateListOnYourBallot.length > 0) && (
            <WhatIsHappeningSection>
              <Suspense fallback={<span>&nbsp;</span>}>
                <CandidateListRoot
                  incomingList={candidateListOnYourBallot}
                  incomingListTimeStampOfChange={candidateListTimeStampOfChange}
                  listModeFilters={listModeFiltersAvailable}
                  listModeFiltersTimeStampOfChange={listModeFiltersTimeStampOfChange}
                  searchText={searchText}
                  stateCode={stateCode}
                  titleTextIfCampaigns="On Your Ballot"
                />
              </Suspense>
            </WhatIsHappeningSection>
          )}
          <WhatIsHappeningSection>
            <Suspense fallback={<span>&nbsp;</span>}>
              <CandidateListRoot
                incomingList={candidateListOther}
                incomingListTimeStampOfChange={candidateListTimeStampOfChange}
                listModeFilters={listModeFiltersAvailable}
                listModeFiltersTimeStampOfChange={listModeFiltersTimeStampOfChange}
                searchText={searchText}
                stateCode={stateCode}
                titleTextIfCampaigns={(campaignsShowing || (candidateListOnYourBallot && candidateListOnYourBallot.length > 0)) ? 'Other Candidates' : ''}
              />
            </Suspense>
          </WhatIsHappeningSection>
        </CampaignsHomeContainer>

        {/*
        <Suspense fallback={<></>}>
          <FirstCampaignListController searchText={searchText} stateCode={stateCode} />
        </Suspense>
        */}
        <Suspense fallback={<></>}>
          <FirstCandidateListController searchText={searchText} stateCode={stateCode} />
        </Suspense>
      </PageContentContainer>
    );
  }
}
CampaignsHome.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
};

const styles = () => ({
  formControl: {
    marginTop: 2,
    padding: '0px 4px',
    width: 200,
  },
  select: {
    padding: '5px 12px',
    margin: '0px 1px',
  },
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

