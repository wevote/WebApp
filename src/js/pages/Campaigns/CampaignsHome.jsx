import { Chip, FormControl, InputLabel, Select } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import ActivityActions from '../../actions/ActivityActions';
import IssueActions from '../../actions/IssueActions';
import SupportActions from '../../actions/SupportActions';
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
import RepresentativeStore from '../../stores/RepresentativeStore';
// import SupportStore from '../../stores/SupportStore';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../common/utils/logging';
import apiCalming from '../../common/utils/apiCalming';
import { convertToInteger } from '../../common/utils/textFormat';
import { cordovaSimplePageContainerTopOffset } from '../../utils/cordovaCalculatedOffsets';
import { getTodayAsInteger, getYearFromUltimateElectionDate } from '../../common/utils/dateFormat';
import arrayContains from '../../common/utils/arrayContains';
import webAppConfig from '../../config';

const CandidateListRoot = React.lazy(() => import(/* webpackChunkName: 'CandidateListRoot' */ '../../components/CandidateListRoot/CandidateListRoot'));
const CampaignListRoot = React.lazy(() => import(/* webpackChunkName: 'CampaignListRoot' */ '../../common/components/Campaign/CampaignListRoot'));
const FirstCampaignListController = React.lazy(() => import(/* webpackChunkName: 'FirstCampaignListController' */ '../../common/components/Campaign/FirstCampaignListController'));
const FirstCandidateListController = React.lazy(() => import(/* webpackChunkName: 'FirstCandidateListController' */ '../../components/CandidateListRoot/FirstCandidateListController'));
const FirstRepresentativeListController = React.lazy(() => import(/* webpackChunkName: 'FirstRepresentativeListController' */ '../../components/RepresentativeListRoot/FirstRepresentativeListController'));
const RepresentativeListRoot = React.lazy(() => import(/* webpackChunkName: 'RepresentativeListRoot' */ '../../components/RepresentativeListRoot/RepresentativeListRoot'));

// const representativeDataExistsYears = [2023];
const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

// import OfficeHeldConstants from '../../constants/OfficeHeldConstants';  // I couldn't get this to work
const OFFICE_HELD_YEARS_AVAILABLE = [2023, 2024, 2025, 2026];

class CampaignsHome extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignList: [],
      candidateList: [],
      candidateListIsBattleground: [],
      candidateListOnYourBallot: [],
      candidateListTimeStampOfChange: 0,
      filterYear: 0,
      isSearching: false,
      listModeShown: 'showUpcomingEndorsements',
      listModeFiltersAvailable: [],
      listModeFiltersTimeStampOfChange: 0,
      listOfYearsWhenCampaignExists: [],
      listOfYearsWhenCandidateExists: [],
      listOfYearsWhenRepresentativeExists: [],
      politicianWeVoteIdsAlreadyShown: [],
      representativeListOnYourBallot: [],
      representativeListShownAsRepresentatives: [],
      representativeListTimeStampOfChange: 0,
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
    this.representativeStoreListener = RepresentativeStore.addListener(this.onRepresentativeStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));

    // /////////////////////////
    // Pulled from onCampaignStoreChange
    // const campaignList = CampaignStore.getPromotedCampaignXDicts();
    const campaignList = CampaignStore.getAllCachedCampaignXList();
    this.setState({
      campaignList,
      // campaignListTimeStampOfChange: Date.now(),
    }, () => this.onIncomingCampaignListChange(true));

    // /////////////////////////
    // Pulled from onCandidateStoreChange and onBallotStoreChange
    // Note: sorting is being done in CandidateListRoot
    const candidateList = CandidateStore.getCandidateList();
    const { candidateListOnYourBallot, candidateListIsBattleground, candidateListOther } = this.splitUpCandidateList(candidateList);
    this.setState({
      candidateList,
      candidateListIsBattleground,
      candidateListOnYourBallot,
      candidateListOther,
      candidateListTimeStampOfChange: Date.now(),
    }, () => this.onIncomingCandidateListChange(true));

    // /////////////////////////
    // Pulled from onRepresentativeStoreChange
    const representativeList = RepresentativeStore.getRepresentativeList();
    // Note: sorting is being done in RepresentativeListRoot
    const { politicianWeVoteIdsAlreadyShown, representativeListOnYourBallot, representativeListShownAsRepresentatives } = this.splitUpRepresentativeList(representativeList); // representativeListIsBattleground
    this.setState({
      politicianWeVoteIdsAlreadyShown,
      representativeList,
      representativeListOnYourBallot,
      representativeListShownAsRepresentatives,
      representativeListTimeStampOfChange: Date.now(),
    }, () => this.onIncomingRepresentativeListChange(true));

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
    } else if (VoterStore.getStateCode() || VoterStore.getStateCodeFromIPAddress()) {
      const voterStateCode =  VoterStore.getStateCode() || VoterStore.getStateCodeFromIPAddress();
      const newPathname = this.getStateNamePathnameFromStateCode(voterStateCode);
      const { location: { pathname } } = window;
      if (pathname !== newPathname) {
        historyPush(newPathname);
      } else {
        this.setState({ stateCode: voterStateCode });
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
    SupportActions.voterAllPositionsRetrieve();
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
    this.representativeStoreListener.remove();
    this.voterStoreListener.remove();
    if (this.modalOpenTimer) clearTimeout(this.modalOpenTimer);
  }

  onBallotStoreChange () {
    const { candidateList } = this.state;
    const { candidateListOnYourBallot, candidateListIsBattleground, candidateListOther } = this.splitUpCandidateList(candidateList);
    this.setState({
      candidateListIsBattleground,
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
    const { candidateListOnYourBallot, candidateListIsBattleground, candidateListOther } = this.splitUpCandidateList(candidateList);
    this.setState({
      candidateList,
      candidateListIsBattleground,
      candidateListOnYourBallot,
      candidateListOther,
      candidateListTimeStampOfChange: Date.now(),
    }, () => this.onIncomingCandidateListChange());
  }

  onRepresentativeStoreChange () {
    const representativeList = RepresentativeStore.getRepresentativeList();
    // Note: sorting is being done in RepresentativeListRoot
    const { politicianWeVoteIdsAlreadyShown, representativeListOnYourBallot, representativeListShownAsRepresentatives } = this.splitUpRepresentativeList(representativeList);  // representativeListIsBattleground
    this.setState({
      politicianWeVoteIdsAlreadyShown,
      representativeList,
      representativeListOnYourBallot,
      representativeListShownAsRepresentatives,
      representativeListTimeStampOfChange: Date.now(),
    }, () => this.onIncomingRepresentativeListChange());
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

  onIncomingRepresentativeListChange (setDefaultListMode = false) {
    const { representativeList } = this.state;
    // console.log('CampaignsHome onIncomingRepresentativeListChange, representativeList:', representativeList);
    this.setState({
      listOfYearsWhenRepresentativeExists: this.getListOfYearsWhenRepresentativeExists(representativeList),
    }, () => this.updateActiveFilters(setDefaultListMode));
  }

  orderByFilterOrder = (firstFilter, secondFilter) => firstFilter.filterOrder - secondFilter.filterOrder;

  splitUpCandidateList = (candidateList) => {
    const { politicianWeVoteIdsAlreadyShown } = this.state;
    // console.log('splitUpCandidateList, politicianWeVoteIdsAlreadyShown:', politicianWeVoteIdsAlreadyShown)
    const candidateListOnYourBallot = BallotStore.getAllBallotItemsFlattened();
    const weVoteIdsOnYourBallot = extractAttributeValueListFromObjectList('we_vote_id', candidateListOnYourBallot);
    const candidateListRemaining = candidateList.filter((oneCandidate) => !arrayContains(oneCandidate.we_vote_id, weVoteIdsOnYourBallot));
    const candidateListIsBattleground = candidateListRemaining.filter((oneCandidate) => oneCandidate.is_battleground_race);
    const weVoteIdsIsBattlegroundRace = extractAttributeValueListFromObjectList('we_vote_id', candidateListIsBattleground);
    const candidateMinusBattleground = candidateListRemaining.filter((oneCandidate) => !arrayContains(oneCandidate.we_vote_id, weVoteIdsIsBattlegroundRace));
    const candidateListOther = candidateMinusBattleground.filter((oneCandidate) => !arrayContains(oneCandidate.politician_we_vote_id, politicianWeVoteIdsAlreadyShown));
    return {
      candidateListOnYourBallot,
      candidateListIsBattleground,
      candidateListOther,
    };
  }

  splitUpRepresentativeList = (representativeList) => {
    const candidateListOnYourBallot = BallotStore.getAllBallotItemsFlattened();
    const politicianWeVoteIdsOnYourBallot = extractAttributeValueListFromObjectList('politician_we_vote_id', candidateListOnYourBallot);
    const representativeListOnYourBallot = representativeList.filter((oneRepresentative) => arrayContains(oneRepresentative.politician_we_vote_id, politicianWeVoteIdsOnYourBallot));
    const representativeListShownAsRepresentatives = representativeList.filter((oneRepresentative) => !arrayContains(oneRepresentative.politician_we_vote_id, politicianWeVoteIdsOnYourBallot));
    const politicianWeVoteIdsShownAsRepresentatives = extractAttributeValueListFromObjectList('politician_we_vote_id', representativeListShownAsRepresentatives);
    const politicianWeVoteIdsAlreadyShown = politicianWeVoteIdsOnYourBallot.concat(politicianWeVoteIdsShownAsRepresentatives);
    return {
      politicianWeVoteIdsAlreadyShown,
      representativeListOnYourBallot,
      representativeListShownAsRepresentatives,
    };
  }

  updateActiveFilters = (setDefaultListMode = false) => {
    const {
      campaignList, candidateList,
      listOfYearsWhenCampaignExists, listOfYearsWhenCandidateExists, listOfYearsWhenRepresentativeExists,
    } = this.state;
    let { listModeShown } = this.state;
    const listOfYears = [...new Set([...listOfYearsWhenCampaignExists, ...listOfYearsWhenCandidateExists, ...listOfYearsWhenRepresentativeExists])];
    // console.log('listOfYears:', listOfYears, ', setDefaultListMode:', setDefaultListMode);
    let filterCount = 0;
    let upcomingEndorsementsAvailable = false;
    const todayAsInteger = getTodayAsInteger();
    // console.log('thisYearInteger:', thisYearInteger);
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
    const today = new Date();
    const thisYearInteger = today.getFullYear();
    for (let i = 0; i < OFFICE_HELD_YEARS_AVAILABLE.length; i++) {
      if (OFFICE_HELD_YEARS_AVAILABLE[i] < thisYearInteger) {
        // Skip over prior years
      } else if (OFFICE_HELD_YEARS_AVAILABLE[i] in listOfYearsWhenRepresentativeExists) {
        upcomingEndorsementsAvailable = true;
      }
    }
    if (setDefaultListMode) {
      listModeShown = this.getDefaultListModeShown(upcomingEndorsementsAvailable);
    }
    // console.log('updateActiveFilters listModeShown:', listModeShown);
    let listModeFiltersAvailable = [
    ];
    // const numberOfYears = listOfYears.length;
    // const useDropdownWithThisNumberOfYears = 4;
    // const displayAsChip = numberOfYears < useDropdownWithThisNumberOfYears;
    const displayAsChip = true; // Explore converting this to a dropdown
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
    // if (upcomingEndorsementsAvailable) {
    // We still want to show this filter option
    filterCount += 1;
    listModeFiltersAvailable.push({
      displayAsChip: true,
      filterDisplayName: 'Upcoming',
      filterName: 'showUpcomingEndorsements',
      filterOrder: 1,
      filterSelected: listModeShown === 'showUpcomingEndorsements',
      filterType: 'showUpcomingEndorsements',
    });
    // }
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

  changeListModeShown = (newListModeShown, newFilterYear = '') => {
    const filterYearInteger = convertToInteger(newFilterYear);
    this.setState({
      listModeShown: newListModeShown,
      filterYear: filterYearInteger,
    }, () => this.updateActiveFilters());
  }

  getDefaultListModeShown = (incomingUpcomingEndorsementsAvailable = false) => {
    const { listOfYearsWhenCampaignExists, listOfYearsWhenCandidateExists, listOfYearsWhenRepresentativeExists, upcomingEndorsementsAvailable } = this.state;
    const listOfYears = [...new Set([...listOfYearsWhenCampaignExists, ...listOfYearsWhenCandidateExists, ...listOfYearsWhenRepresentativeExists])];
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

  getListOfYearsWhenRepresentativeExists = (representativeList) => {
    const listOfYearsWhenRepresentativeExists = [];
    let yearInOfficeKey;
    representativeList.forEach((oneRepresentative) => {
      for (let i = 0; i < OFFICE_HELD_YEARS_AVAILABLE.length; i++) {
        // console.log('One year from OFFICE_HELD_YEARS_AVAILABLE: ', OFFICE_HELD_YEARS_AVAILABLE[i]);
        yearInOfficeKey = `year_in_office_${OFFICE_HELD_YEARS_AVAILABLE[i]}`;
        // console.log('yearInOfficeKey: ', yearInOfficeKey);
        if ((yearInOfficeKey in oneRepresentative) && oneRepresentative[yearInOfficeKey]) {
          // console.log('oneRepresentative[yearInOfficeKey]: ', oneRepresentative[yearInOfficeKey]);
          if (!arrayContains(OFFICE_HELD_YEARS_AVAILABLE[i], listOfYearsWhenRepresentativeExists)) {
            listOfYearsWhenRepresentativeExists.push(OFFICE_HELD_YEARS_AVAILABLE[i]);
          }
        }
      }
    });
    // console.log('listOfYearsWhenRepresentativeExists: ', listOfYearsWhenRepresentativeExists);
    return listOfYearsWhenRepresentativeExists;
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
      campaignList, campaignListTimeStampOfChange,
      campaignsShowing,
      candidateListOther, candidateListTimeStampOfChange,
      candidateListIsBattleground, candidateListOnYourBallot, filterYear,
      isSearching, listModeFiltersAvailable, listModeFiltersTimeStampOfChange,
      representativeListOnYourBallot, representativeListShownAsRepresentatives, representativeListTimeStampOfChange,
      searchText, stateCode,
    } = this.state;
    // console.log('CampaignsHome.jsx campaignList:', campaignList);

    const titleText = 'Candidates - We Vote';
    const descriptionText = 'Choose which candidates you support.';
    let stateCodeTemp;
    const stateNameList = Object.values(stateCodeMap);
    const representativesShowing = (representativeListOnYourBallot && representativeListOnYourBallot.length > 0) || (representativeListShownAsRepresentatives && representativeListShownAsRepresentatives.length > 0);
    const otherTitlesShown = (campaignsShowing && nextReleaseFeaturesEnabled) || (candidateListOnYourBallot && candidateListOnYourBallot.length > 0) || (candidateListIsBattleground && candidateListIsBattleground.length > 0) || representativesShowing;
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
                  <span key={oneFilter.filterName}>
                    {oneFilter.displayAsChip && (
                      <Chip
                        label={<span style={oneFilter.filterSelected ? { fontWeight: 600 } : {}}>{oneFilter.filterDisplayName}</span>}
                        className={oneFilter.filterSelected ? classes.selectedChip : classes.notSelectedChip}
                        component="div"
                        onClick={() => this.changeListModeShown(oneFilter.filterName, oneFilter.filterYear)}
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
          {nextReleaseFeaturesEnabled && (
            <WhatIsHappeningSection>
              <Suspense fallback={<span>&nbsp;</span>}>
                <CampaignListRoot
                  incomingList={campaignList}
                  incomingListTimeStampOfChange={campaignListTimeStampOfChange}
                  listModeFilters={listModeFiltersAvailable}
                  listModeFiltersTimeStampOfChange={listModeFiltersTimeStampOfChange}
                  searchText={searchText}
                  stateCode={stateCode}
                  titleTextForList="Campaigns"
                />
              </Suspense>
            </WhatIsHappeningSection>
          )}
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
                  titleTextForList="On Your Ballot"
                />
              </Suspense>
            </WhatIsHappeningSection>
          )}
          {(candidateListIsBattleground && candidateListIsBattleground.length > 0) && (
            <WhatIsHappeningSection>
              <Suspense fallback={<span>&nbsp;</span>}>
                <CandidateListRoot
                  hideIfNoResults
                  incomingList={candidateListIsBattleground}
                  incomingListTimeStampOfChange={candidateListTimeStampOfChange}
                  listModeFilters={listModeFiltersAvailable}
                  listModeFiltersTimeStampOfChange={listModeFiltersTimeStampOfChange}
                  searchText={searchText}
                  stateCode={stateCode}
                  titleTextForList="Close Races"
                />
              </Suspense>
            </WhatIsHappeningSection>
          )}
          <WhatIsHappeningSection>
            <Suspense fallback={<span>&nbsp;</span>}>
              <RepresentativeListRoot
                hideIfNoResults
                incomingList={representativeListShownAsRepresentatives}
                incomingListTimeStampOfChange={representativeListTimeStampOfChange}
                listModeFilters={listModeFiltersAvailable}
                listModeFiltersTimeStampOfChange={listModeFiltersTimeStampOfChange}
                searchText={searchText}
                stateCode={stateCode}
                titleTextForList="Current Representatives"
              />
            </Suspense>
          </WhatIsHappeningSection>
          <WhatIsHappeningSection>
            <Suspense fallback={<span>&nbsp;</span>}>
              <CandidateListRoot
                hideIfNoResults
                incomingList={candidateListOther}
                incomingListTimeStampOfChange={candidateListTimeStampOfChange}
                listModeFilters={listModeFiltersAvailable}
                listModeFiltersTimeStampOfChange={listModeFiltersTimeStampOfChange}
                searchText={searchText}
                stateCode={stateCode}
                titleTextForList={otherTitlesShown ? 'More Politicians' : 'Candidates'}
              />
            </Suspense>
          </WhatIsHappeningSection>
        </CampaignsHomeContainer>

        {/* */}
        <Suspense fallback={<></>}>
          <FirstCampaignListController searchText={searchText} stateCode={stateCode} />
        </Suspense>
        {/* */}
        <Suspense fallback={<></>}>
          <FirstCandidateListController searchText={searchText} stateCode={stateCode} year={filterYear} />
        </Suspense>
        {/* */}
        <Suspense fallback={<></>}>
          <FirstRepresentativeListController searchText={searchText} stateCode={stateCode} year={filterYear} />
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

