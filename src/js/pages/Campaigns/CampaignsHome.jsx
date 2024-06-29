import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import ActivityActions from '../../actions/ActivityActions';
import IssueActions from '../../actions/IssueActions';
import OrganizationActions from '../../actions/OrganizationActions';
import SupportActions from '../../actions/SupportActions';
import CampaignStore from '../../common/stores/CampaignStore';
import { convertStateCodeToStateText, convertStateTextToStateCode } from '../../common/utils/addressFunctions';
import apiCalming from '../../common/utils/apiCalming';
import arrayContains from '../../common/utils/arrayContains';
import { getTodayAsInteger } from '../../common/utils/dateFormat'; // getYearFromUltimateElectionDate
import extractAttributeValueListFromObjectList from '../../common/utils/extractAttributeValueListFromObjectList';
import historyPush from '../../common/utils/historyPush';
import { isAndroid } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import { convertToInteger } from '../../common/utils/textFormat';
import CampaignsHomeFilter from '../../components/CampaignsHome/CampaignsHomeFilter';
import CandidateListRootPlaceholder from '../../components/CampaignsHome/CandidateListRootPlaceholder';
import NoSearchResult from '../../components/Search/NoSearchResult';
import webAppConfig from '../../config';
import BallotStore from '../../stores/BallotStore';
import CandidateStore from '../../stores/CandidateStore';
import IssueStore from '../../stores/IssueStore';
import RepresentativeStore from '../../stores/RepresentativeStore';
import VoterStore from '../../stores/VoterStore';

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
      battlegroundDataFoundByStateDict: {},
      battlegroundDataNotReturnedInTime: false,
      battlegroundDataNotReturnedInTimeByStateDict: {},
      battlegroundWaitingForData: false,
      campaignList: [],
      campaignListTimeStampOfChange: 0,
      candidateList: [],
      candidateListIsBattleground: [],
      candidateListOnYourBallot: [],
      candidateListTimeStampOfChange: 0,
      filterYear: 0,
      isSearching: false,
      listModeShown: 'showUpcomingEndorsements',
      listModeFiltersAvailable: [],
      listModeFiltersTimeStampOfChange: 0,
      // listOfYearsWhenCampaignExists: [],
      // listOfYearsWhenCandidateExists: [],
      listOfYearsWhenRepresentativeExists: [],
      numberOfCampaignResults: 99,
      numberOfCampaignSearchResults: 0,
      numberOfCandidatesOnBallotResults: 99,
      numberOfCandidatesOnBallotSearchResults: 0,
      numberOfCloseRacesResults: 99,
      numberOfCloseRacesSearchResults: 0,
      numberOfMorePoliticiansResults: 99,
      numberOfMorePoliticiansSearchResults: 0,
      numberOfRepresentativeResults: 99,
      numberOfRepresentativeSearchResults: 0,
      politicianWeVoteIdsAlreadyShown: [],
      representativeListOnYourBallot: [],
      representativeListShownAsRepresentatives: [],
      representativeListTimeStampOfChange: 0,
      searchText: '',
      stateCode: '',
    };
  }

  componentDidMount () {
    // console.log('CampaignsHome componentDidMount');
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
      campaignListTimeStampOfChange: Date.now(),
    }, () => this.onIncomingCampaignListChange(true));

    // /////////////////////////
    // Pulled from onCandidateStoreChange and onBallotStoreChange
    // Note: sorting is being done in CandidateListRoot
    const candidateList = CandidateStore.getCandidateList();
    // console.log('ComponentDidMount candidateList', candidateList);
    const { candidateListOnYourBallot, candidateListIsBattleground, candidateListOther } = this.splitUpCandidateList(candidateList);
    // console.log('ComponentDidMount candidateListOther', candidateListOther);
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

    let stateName;
    if (stateCandidatesPhrase) {
      const campaignsHomeMode = (stateCandidatesPhrase.includes('-candidates'));
      const detailsListMode = (stateCandidatesPhrase.includes('-politicians-list'));
      this.setState({
        // campaignsHomeMode,
        detailsListMode,
      });
      if (campaignsHomeMode) {
        stateName = stateCandidatesPhrase.replace('-candidates', '');
      } else if (detailsListMode) {
        stateName = stateCandidatesPhrase.replace('-politicians-list', '');
      }
    }
    if (stateName) {
      stateName = stateName.replaceAll('-', ' ');
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
        historyPush(newPathname, true);
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
    if (apiCalming('organizationsFollowedRetrieve', 60000)) {
      OrganizationActions.organizationsFollowedRetrieve();
    }
    // AnalyticsActions.saveActionOffice(VoterStore.electionId(), params.office_we_vote_id);
  }

  componentDidUpdate (prevProps) {
    const { match: { params: { state_candidates_phrase: previousStateCandidatesPhrase } } } = prevProps;
    const { match: { params: { state_candidates_phrase: stateCandidatesPhrase } } } = this.props;
    if (stateCandidatesPhrase && (stateCandidatesPhrase !== previousStateCandidatesPhrase)) {
      const campaignsHomeMode = (stateCandidatesPhrase.includes('-candidates'));
      const detailsListMode = (stateCandidatesPhrase.includes('-politicians-list'));
      this.setState({
        battlegroundDataNotReturnedInTime: false,
        battlegroundWaitingForData: false,
        detailsListMode,
      });
      let stateName;
      if (campaignsHomeMode) {
        stateName = stateCandidatesPhrase.replace('-candidates', '');
      } else if (detailsListMode) {
        stateName = stateCandidatesPhrase.replace('-politicians-list', '');
      }

      if (stateName) {
        stateName = stateName.replaceAll('-', ' ');
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
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  onBallotStoreChange () {
    const { battlegroundDataFoundByStateDict, candidateList, stateCode } = this.state;
    const { candidateListOnYourBallot, candidateListIsBattleground, candidateListOther } = this.splitUpCandidateList(candidateList);
    const battlegroundDataFound = !!(candidateListIsBattleground && candidateListIsBattleground.length > 0);
    if (battlegroundDataFound) {
      battlegroundDataFoundByStateDict[stateCode] = true;
      // If battleground data not returned, we let the timer in candidateQueryInitiatedLocal
      //  set battlegroundWaitingForData to false, but if found, we can set battlegroundWaitingForData to false
      this.setState({
        battlegroundDataFoundByStateDict,
        battlegroundWaitingForData: false,
      });
    }
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
      campaignListTimeStampOfChange: Date.now(),
    }, () => this.onIncomingCampaignListChange());
  }

  onCandidateStoreChange () {
    const candidateList = CandidateStore.getCandidateList();
    const { battlegroundDataFoundByStateDict } = this.state;
    // Note: sorting is being done in CandidateListRoot
    const { candidateListOnYourBallot, candidateListIsBattleground, candidateListOther, stateCode } = this.splitUpCandidateList(candidateList);
    const battlegroundDataFound = !!(candidateListIsBattleground && candidateListIsBattleground.length > 0);
    if (battlegroundDataFound) {
      battlegroundDataFoundByStateDict[stateCode] = true;
      // If battleground data not returned, we let the timer in candidateQueryInitiatedLocal
      //  set battlegroundWaitingForData to false, but if found, we can set battlegroundWaitingForData to false
      this.setState({
        battlegroundDataFoundByStateDict,
        battlegroundWaitingForData: false,
      });
    }
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
      // listOfYearsWhenCampaignExists: this.getListOfYearsWhenCampaignExists(campaignList),
    }, () => this.updateActiveFilters(setDefaultListMode));
  }

  onIncomingCandidateListChange (setDefaultListMode = false) {
    // const { candidateList } = this.state;
    // console.log('CampaignsHome onIncomingCandidateListChange, candidateList:', candidateList);
    this.setState({
      // listOfYearsWhenCandidateExists: this.getListOfYearsWhenCandidateExists(candidateList),
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
    // console.log('splitUpCandidateList, politicianWeVoteIdsAlreadyShown:', politicianWeVoteIdsAlreadyShown);
    const candidateListOnYourBallot = BallotStore.getAllBallotItemsFlattened();
    // console.log('splitUpCandidateList, candidateListOnYourBallot:', candidateListOnYourBallot);
    const weVoteIdsOnYourBallot = extractAttributeValueListFromObjectList('we_vote_id', candidateListOnYourBallot);
    const candidateListRemaining = candidateList.filter((oneCandidate) => !arrayContains(oneCandidate.we_vote_id, weVoteIdsOnYourBallot));
    const candidateListIsBattleground = candidateListRemaining.filter((oneCandidate) => oneCandidate.is_battleground_race);
    const weVoteIdsIsBattlegroundRace = extractAttributeValueListFromObjectList('we_vote_id', candidateListIsBattleground);
    const candidateMinusBattleground = candidateListRemaining.filter((oneCandidate) => !arrayContains(oneCandidate.we_vote_id, weVoteIdsIsBattlegroundRace));
    const candidateListOther = candidateMinusBattleground.filter((oneCandidate) => !arrayContains(oneCandidate.politician_we_vote_id, politicianWeVoteIdsAlreadyShown));

    // Ok to remove once https://wevoteusa.atlassian.net/jira/software/projects/WV/issues/WV-282 is fixed
    // console.log('------ candidateList biden: ', candidateList.find((x) => x.ballot_item_display_name === 'Joe Biden'));
    // console.log('------ candidateList trump: ', candidateList.find((x) => x.ballot_item_display_name === 'Donald Trump'));
    // console.log('candidateListOnYourBallot biden: ', candidateListOnYourBallot.find((x) => x.ballot_item_display_name === 'Joe Biden')?.ballot_item_display_name);
    // console.log('weVoteIdsOnYourBallot: ', weVoteIdsOnYourBallot);
    // console.log('candidateListRemaining biden: ', candidateListRemaining.find((x) => x.ballot_item_display_name === 'Joe Biden')?.ballot_item_display_name);
    // console.log('politicianWeVoteIdsAlreadyShown: ', politicianWeVoteIdsAlreadyShown);
    // console.log('candidateMinusBattleground biden: ', candidateMinusBattleground.find((x) => x.ballot_item_display_name === 'Joe Biden')?.ballot_item_display_name);
    // console.log('candidateMinusBattleground trump: ', candidateMinusBattleground.find((x) => x.ballot_item_display_name === 'Donald Trump')?.ballot_item_display_name);
    // console.log('candidateListOther candidate id biden: ', candidateListOther.find((x) => x.ballot_item_display_name === 'Joe Biden')?.politician_we_vote_id);
    // console.log('candidateListOther candidate id trump: ', candidateListOther.find((x) => x.ballot_item_display_name === 'Donald Trump')?.politician_we_vote_id);
    // console.log('candidateListOther biden: ', candidateListOther.find((x) => x.ballot_item_display_name === 'Joe Biden')?.ballot_item_display_name);
    // console.log('candidateListOther trump: ', candidateListOther.find((x) => x.ballot_item_display_name === 'Donald Trump')?.ballot_item_display_name);

    return {
      candidateListOnYourBallot,
      candidateListIsBattleground,
      candidateListOther,
    };
  }

  splitUpRepresentativeList = (representativeList) => {
    // console.log('representativeList = ', representativeList);
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
      // listOfYearsWhenCampaignExists, listOfYearsWhenCandidateExists,
      listOfYearsWhenRepresentativeExists,
    } = this.state;

    let { listModeShown } = this.state;
    // const listOfYears = [...new Set([...listOfYearsWhenCampaignExists, ...listOfYearsWhenCandidateExists, ...listOfYearsWhenRepresentativeExists])];
    // console.log('listOfYears:', listOfYears, ', setDefaultListMode:', setDefaultListMode);
    // let filterCount = 0;
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
    // listOfYears.forEach((oneYear) => {
    //   filterCount += 1;
    //   listModeFiltersAvailable.push({
    //     displayAsChip,
    //     filterDisplayName: `${oneYear}`,
    //     filterName: `show${oneYear}`,
    //     filterOrder: 5000 - oneYear,
    //     filterSelected: listModeShown === `show${oneYear}`,
    //     filterType: 'showYear',
    //     filterYear: oneYear,
    //   });
    // });
    // // if (upcomingEndorsementsAvailable) {
    // // We still want to show this filter option
    // filterCount += 1;
    listModeFiltersAvailable.push({
      // WV314 Temporary Fix Changed from displayAsChip to true to false to hide the "Upcoming" button on Candidates Page
      displayAsChip: false,
      filterDisplayName: 'Upcoming',
      filterName: 'showUpcomingEndorsements',
      filterOrder: 1,
      filterSelected: listModeShown === 'showUpcomingEndorsements',
      filterType: 'showUpcomingEndorsements',
    });
    // // }
    // if (filterCount > 1) {
    if (listModeShown === 'showAllEndorsements') {
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

  candidatesQueryInitiatedLocal = () => {
    // This gets fired after a state-specific request happens in FirstCandidateListController
    // console.log('CampaignsHome.candidatesQueryInitiatedLocal reset battlegroundWaitingForData to true');
    this.setState({
      battlegroundWaitingForData: true,
    });
    const howLongWeWaitForData = 1000;
    this.timer = setTimeout(() => {
      const { battlegroundDataFoundByStateDict, battlegroundDataNotReturnedInTimeByStateDict, candidateListIsBattleground, stateCode } = this.state;
      const battlegroundDataFound = !!(candidateListIsBattleground && candidateListIsBattleground.length > 0);
      // console.log('CampaignsHome.candidatesQueryInitiatedLocal after 1 second battlegroundDataFound:', battlegroundDataFound, ', and reset battlegroundWaitingForData to false');
      this.setState({
        battlegroundWaitingForData: false,
      });
      if (!battlegroundDataFound) {
        battlegroundDataFoundByStateDict[stateCode] = false;
        battlegroundDataNotReturnedInTimeByStateDict[stateCode] = true;
        this.setState({
          battlegroundDataFoundByStateDict,
          battlegroundDataNotReturnedInTimeByStateDict,
          battlegroundDataNotReturnedInTime: true,
        });
      }
    }, howLongWeWaitForData);
  }

  changeListModeShown = (newListModeShown, newFilterYear = '') => {
    const filterYearInteger = convertToInteger(newFilterYear);
    this.setState({
      listModeShown: newListModeShown,
      filterYear: filterYearInteger,
    }, () => this.updateActiveFilters());
  }

  getDefaultListModeShown = (incomingUpcomingEndorsementsAvailable = false) => {
    // const { listOfYearsWhenCampaignExists, listOfYearsWhenCandidateExists, listOfYearsWhenRepresentativeExists, upcomingEndorsementsAvailable } = this.state;
    const { upcomingEndorsementsAvailable } = this.state;
    // const listOfYears = [...new Set([...listOfYearsWhenCampaignExists, ...listOfYearsWhenCandidateExists, ...listOfYearsWhenRepresentativeExists])];
    // console.log('getDefaultListModeShown listOfYearsWhenCandidateExists:', listOfYearsWhenCandidateExists);
    if (upcomingEndorsementsAvailable || incomingUpcomingEndorsementsAvailable) {
      return 'showUpcomingEndorsements';
      // } else if (listOfYears && listOfYears.length > 0) {
      //   const mostRecentYear = Math.max.apply(null, listOfYears);
      //   // console.log('mostRecentYear:', mostRecentYear);
      //   return `show${mostRecentYear}`;
      // }
    }
    // 2023-05-15 Turned off for now
    // else if (listOfYears && listOfYears.length > 1) {
    //   return 'showAllEndorsements';
    // }
    return 'showUpcomingEndorsements';
  }

  // getListOfYearsWhenCampaignExists = (campaignList) => {
  //   const listOfYearsWhenCampaignExists = [];
  //   let tempYearInteger;
  //   campaignList.forEach((oneCampaign) => {
  //     if (oneCampaign.final_election_date_as_integer && oneCampaign.final_election_date_as_integer > 0) {
  //       tempYearInteger = getYearFromUltimateElectionDate(oneCampaign.final_election_date_as_integer);
  //       // console.log('getListOfYearsWhenCampaignExists:', tempYearInteger, ', oneCampaign:', oneCampaign);
  //       if (!arrayContains(tempYearInteger, listOfYearsWhenCampaignExists)) {
  //         listOfYearsWhenCampaignExists.push(tempYearInteger);
  //       }
  //     }
  //   });
  //   return listOfYearsWhenCampaignExists;
  // }

  // getListOfYearsWhenCandidateExists = (candidateList) => {
  //   const listOfYearsWhenCandidateExists = [];
  //   let tempYearInteger;
  //   candidateList.forEach((oneCandidate) => {
  //     if (oneCandidate.candidate_ultimate_election_date && oneCandidate.candidate_ultimate_election_date > 0) {
  //       tempYearInteger = getYearFromUltimateElectionDate(oneCandidate.candidate_ultimate_election_date);
  //       if (!arrayContains(tempYearInteger, listOfYearsWhenCandidateExists)) {
  //         listOfYearsWhenCandidateExists.push(tempYearInteger);
  //       }
  //     }
  //   });
  //   return listOfYearsWhenCandidateExists;
  // }

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
    const stateNamePhraseLowerCase = stateNamePhrase.replaceAll(/\s+/g, '-').toLowerCase();
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
      listModeShown: 'showUpcomingEndorsements',
      searchText: '',
    }, () => this.updateActiveFilters());
  }

  searchFunction = (searchText) => {
    // console.log('CampaignsHome searchFunction searchText:', searchText);
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

  displayBattlegroundPlaceholderForState = (stateCode) => {
    // For one state, should we display a placeholder for the "Candidates in Close Races" horizontal section as the data is loaded?
    const { battlegroundDataNotReturnedInTimeByStateDict, battlegroundDataNotReturnedInTime, isSearching } = this.state;
    if (battlegroundDataNotReturnedInTimeByStateDict && stateCode && (stateCode in battlegroundDataNotReturnedInTimeByStateDict)) {
      return !battlegroundDataNotReturnedInTimeByStateDict[stateCode] && !isSearching;
    } else {
      return !battlegroundDataNotReturnedInTime && !isSearching;
    }
  }

  useMinimumBattlegroundHeightForState = (stateCode) => {
    // For one state, should we block out space for the "Candidates in Close Races" horizontal section as the data is loaded?
    const { battlegroundDataFoundByStateDict, battlegroundDataFound, battlegroundWaitingForData, isSearching } = this.state;
    if (battlegroundDataFoundByStateDict && battlegroundDataFoundByStateDict[stateCode]) {
      return !isSearching && battlegroundDataFoundByStateDict[stateCode];
    } else {
      return !isSearching && (battlegroundWaitingForData || battlegroundDataFound);
    }
  }

  handleNumberOfCampaignResults = (listResults, searchResults) => {
    this.setState({
      numberOfCampaignResults: listResults,
      numberOfCampaignSearchResults: searchResults,
    });
  }

  handleNumberOfCandidatesOnBallotResults = (listResults, searchResults) => {
    this.setState({
      numberOfCandidatesOnBallotResults: listResults,
      numberOfCandidatesOnBallotSearchResults: searchResults,
    });
  }

  handleNumberOfCloseRacesResults = (listResults, searchResults) => {
    this.setState({
      numberOfCloseRacesResults: listResults,
      numberOfCloseRacesSearchResults: searchResults,
    });
  }

  handleNumberOfMorePoliticiansResults = (listResults, searchResults) => {
    this.setState({
      numberOfMorePoliticiansResults: listResults,
      numberOfMorePoliticiansSearchResults: searchResults,
    });
  }

  handleNumberOfRepresentativeResults = (listResults, searchResults) => {
    this.setState({
      numberOfRepresentativeResults: listResults,
      numberOfRepresentativeSearchResults: searchResults,
    });
  }

  render () {
    renderLog('CampaignsHome');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      campaignList, campaignListTimeStampOfChange,
      campaignsShowing,
      candidateListOther, candidateListTimeStampOfChange,
      candidateListIsBattleground, candidateListOnYourBallot,
      detailsListMode, filterYear,
      isSearching, listModeFiltersAvailable, listModeFiltersTimeStampOfChange,
      numberOfCampaignResults, numberOfCampaignSearchResults,
      numberOfCandidatesOnBallotResults, numberOfCandidatesOnBallotSearchResults,
      numberOfCloseRacesResults, numberOfCloseRacesSearchResults,
      numberOfMorePoliticiansResults, numberOfMorePoliticiansSearchResults,
      numberOfRepresentativeResults, numberOfRepresentativeSearchResults,
      representativeListOnYourBallot, representativeListShownAsRepresentatives, representativeListTimeStampOfChange,
      searchText, stateCode,
    } = this.state;
    // const numberOfAnyResults = numberOfCampaignResults + numberOfCandidatesOnBallotResults + numberOfCloseRacesResults + numberOfMorePoliticiansResults + numberOfRepresentativeResults;
    const numberOfSearchResults = numberOfCampaignSearchResults + numberOfCandidatesOnBallotSearchResults + numberOfCloseRacesSearchResults + numberOfMorePoliticiansSearchResults + numberOfRepresentativeSearchResults;
    // console.log('CampaignsHome render numberOfAnyResults:', numberOfAnyResults, ', numberOfSearchResults:', numberOfSearchResults);
    // console.log('CampaignsHomeLoader.jsx render campaignList:', campaignList);
    const pigsCanFly = false;

    if (detailsListMode) {
      // console.log('detailsListMode TRUE');
      return (
        <CampaignsHomeWrapper>
          <CampaignsHomeFilter
            changeListModeShown={this.changeListModeShown}
            clearSearchFunction={this.clearSearchFunction}
            handleChooseStateChange={this.handleChooseStateChange}
            isSearching={isSearching}
            listModeFiltersAvailable={listModeFiltersAvailable}
            searchFunction={this.searchFunction}
            searchText={searchText}
            stateCode={stateCode}
          />
          {(nextReleaseFeaturesEnabled && pigsCanFly) && (
            <WhatIsHappeningSection useMinimumHeight={!!(numberOfCampaignResults)}>
              <Suspense fallback={<span>&nbsp;</span>}>
                <CampaignListRoot
                  hideCampaignsLinkedToPoliticians
                  hideIfNoResults
                  handleNumberOfResults={this.handleNumberOfCampaignResults}
                  incomingList={campaignList}
                  incomingListTimeStampOfChange={campaignListTimeStampOfChange}
                  listModeFilters={listModeFiltersAvailable}
                  listModeFiltersTimeStampOfChange={listModeFiltersTimeStampOfChange}
                  searchText={searchText}
                  stateCode={stateCode}
                  titleTextForList="Upcoming Campaigns"
                />
              </Suspense>
            </WhatIsHappeningSection>
          )}
        </CampaignsHomeWrapper>
      );
    }

    const representativesShowing = (representativeListOnYourBallot && representativeListOnYourBallot.length > 0) || (representativeListShownAsRepresentatives && representativeListShownAsRepresentatives.length > 0);
    const otherTitlesShown = (campaignsShowing && nextReleaseFeaturesEnabled) || (candidateListOnYourBallot && candidateListOnYourBallot.length > 0) || (candidateListIsBattleground && candidateListIsBattleground.length > 0) || representativesShowing;
    // const useMinimumBattlegroundHeight = this.useMinimumBattlegroundHeightForState(stateCode);
    const displayBattlegroundPlaceholder = this.displayBattlegroundPlaceholderForState(stateCode);
    // console.log('CampaignsHome, isSearching: ', isSearching, 'numberOfRepresentativeResults:', numberOfRepresentativeResults);
    return (
      <CampaignsHomeWrapper>
        <CampaignsHomeFilter
          changeListModeShown={this.changeListModeShown}
          clearSearchFunction={this.clearSearchFunction}
          handleChooseStateChange={this.handleChooseStateChange}
          isSearching={isSearching}
          listModeFiltersAvailable={listModeFiltersAvailable}
          searchFunction={this.searchFunction}
          searchText={searchText}
          stateCode={stateCode}
        />
        {(isSearching && numberOfSearchResults === 0) && (
          <NoSearchResult
            title="No Candidates Found"
            subtitle="Please try a different search term."
          />
        )}

        {(nextReleaseFeaturesEnabled && pigsCanFly) && (
          <WhatIsHappeningSection>
            <Suspense fallback={<span><CandidateListRootPlaceholder titleTextForList="Campaigns" /></span>}>
              <CampaignListRoot
                hideCampaignsLinkedToPoliticians
                hideIfNoResults
                // onHideIfNoResultsChange={this.handleHideIfNoResultsChange}
                incomingList={campaignList}
                incomingListTimeStampOfChange={campaignListTimeStampOfChange}
                listModeFilters={listModeFiltersAvailable}
                listModeFiltersTimeStampOfChange={listModeFiltersTimeStampOfChange}
                searchText={searchText}
                stateCode={stateCode}
                // titleTextForList="Upcoming Campaigns" // TODO: Needs work
                titleTextForList="Campaigns"
              />
            </Suspense>
          </WhatIsHappeningSection>
        )}
        {(candidateListIsBattleground && candidateListIsBattleground.length > 0) ? (
          <WhatIsHappeningSection useMinimumHeight={!isSearching && numberOfCloseRacesResults > 0}>
            {/* Was useMinimumBattlegroundHeight */}
            <Suspense fallback={<span><CandidateListRootPlaceholder titleTextForList="Candidates in Close Races" /></span>}>
              <CandidateListRoot
                hideIfNoResults
                handleNumberOfResults={this.handleNumberOfCloseRacesResults}
                incomingList={candidateListIsBattleground}
                incomingListTimeStampOfChange={candidateListTimeStampOfChange}
                listModeFilters={listModeFiltersAvailable}
                listModeFiltersTimeStampOfChange={listModeFiltersTimeStampOfChange}
                searchText={searchText}
                stateCode={stateCode}
                titleTextForList="Candidates in Close Races"
              />
            </Suspense>
          </WhatIsHappeningSection>
        ) : (
          <>
            {displayBattlegroundPlaceholder && <CandidateListRootPlaceholder titleTextForList="Candidates in Close Races" />}
          </>
        )}
        {(representativeListShownAsRepresentatives && representativeListShownAsRepresentatives.length > 0) ? (
          <WhatIsHappeningSection useMinimumHeight={!isSearching && numberOfRepresentativeResults > 0}>
            <Suspense fallback={<span><CandidateListRootPlaceholder titleTextForList="Current Representatives" /></span>}>
              <RepresentativeListRoot
                hideIfNoResults
                handleNumberOfResults={this.handleNumberOfRepresentativeResults}
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
        ) : (
          <>
            {numberOfRepresentativeResults > 0 && (
              <>
                <CandidateListRootPlaceholder titleTextForList="Current Representatives" />
              </>
            )}
          </>
        )}
        {(candidateListOnYourBallot && candidateListOnYourBallot.length > 0) ? (
          <WhatIsHappeningSection useMinimumHeight={!isSearching && numberOfCandidatesOnBallotResults > 0}>
            <Suspense fallback={<span><CandidateListRootPlaceholder titleTextForList="On Your Ballot" /></span>}>
              <CandidateListRoot
                hideIfNoResults
                handleNumberOfResults={this.handleNumberOfCandidatesOnBallotResults}
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
        ) : (
          <>
            {numberOfCandidatesOnBallotResults > 0 && (
              <>
                <CandidateListRootPlaceholder titleTextForList="On Your Ballot" />
              </>
            )}
          </>
        )}
        <WhatIsHappeningSection useMinimumHeight={!isSearching && numberOfMorePoliticiansResults > 0}>
          <Suspense fallback={<span><CandidateListRootPlaceholder /></span>}>
            <CandidateListRoot
              hideIfNoResults
              handleNumberOfResults={this.handleNumberOfMorePoliticiansResults}
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

        {/* <WhatIsHappeningSection useMinimumHeight={!isSearching} /> */}

        {/* */}
        {pigsCanFly && (
          <Suspense fallback={<></>}>
            <FirstCampaignListController searchText={searchText} stateCode={stateCode} />
          </Suspense>
        )}
        {/* */}
        <Suspense fallback={<></>}>
          <FirstCandidateListController
            candidatesQueryInitiated={this.candidatesQueryInitiatedLocal}
            searchText={searchText}
            stateCode={stateCode}
            year={filterYear}
          />
        </Suspense>
        {/* */}
        <Suspense fallback={<></>}>
          <FirstRepresentativeListController searchText={searchText} stateCode={stateCode} year={filterYear} />
        </Suspense>
      </CampaignsHomeWrapper>
    );
  }
}
CampaignsHome.propTypes = {
  match: PropTypes.object,
};

const CampaignsHomeWrapper = styled('div')`
  padding-top: ${isAndroid() ? '30px' : ''};
`;

const WhatIsHappeningSection = styled('div', {
  shouldForwardProp: (prop) => !['useMinimumHeight'].includes(prop),
})(({ useMinimumHeight }) => (`
  // background: linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(46,55,77,0) 52%);
  // background: linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(46,55,77,0) 52%);
  // background-color: #f5f5f5;
  // box-shadow: 0 0 80px 0px rgba(46,55,77,.3);
  ${useMinimumHeight ? 'height: 460px;' : ''};
  ${useMinimumHeight ? 'min-height: 460px;' : ''};
  // padding: 0 0 25px 0;
`));



export default CampaignsHome;
