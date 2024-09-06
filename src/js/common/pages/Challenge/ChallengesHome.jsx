import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import ActivityActions from '../../../actions/ActivityActions';
import IssueActions from '../../../actions/IssueActions';
import OrganizationActions from '../../../actions/OrganizationActions';
import SupportActions from '../../../actions/SupportActions';
import ChallengeStore from '../../stores/ChallengeStore';
import apiCalming from '../../utils/apiCalming';
import arrayContains from '../../utils/arrayContains';
import { getTodayAsInteger } from '../../utils/dateFormat';
import extractAttributeValueListFromObjectList from '../../utils/extractAttributeValueListFromObjectList';
import { isAndroid } from '../../utils/isCordovaOrWebApp';
import { renderLog } from '../../utils/logging';
import { convertToInteger } from '../../utils/textFormat';
import ChallengesHomeFilter from '../../components/Challenge/ChallengesHomeFilter';
import ChallengeListRootPlaceholder from '../../components/ChallengeListRoot/ChallengeListRootPlaceholder';
import NoSearchResult from '../../../components/Search/NoSearchResult';
import webAppConfig from '../../../config';
import BallotStore from '../../../stores/BallotStore';
import CandidateStore from '../../../stores/CandidateStore';
import IssueStore from '../../../stores/IssueStore';
import RepresentativeStore from '../../../stores/RepresentativeStore';
import VoterStore from '../../../stores/VoterStore';

const ChallengeListRoot = React.lazy(() => import(/* webpackChunkName: 'ChallengeListRoot' */ '../../components/ChallengeListRoot/ChallengeListRoot'));
const FirstChallengeListController = React.lazy(() => import(/* webpackChunkName: 'FirstChallengeListController' */ '../../components/ChallengeListRoot/FirstChallengeListController'));

// const representativeDataExistsYears = [2023];
const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

// import OfficeHeldConstants from '../../constants/OfficeHeldConstants';  // I couldn't get this to work
const OFFICE_HELD_YEARS_AVAILABLE = [2023, 2024, 2025, 2026];

class ChallengesHome extends Component {
  constructor (props) {
    super(props);
    this.state = {
      battlegroundDataFoundByStateDict: {},
      battlegroundDataNotReturnedInTime: false,
      battlegroundDataNotReturnedInTimeByStateDict: {},
      battlegroundWaitingForData: false,
      challengeList: [],
      challengeListTimeStampOfChange: 0,
      candidateList: [],
      candidateListIsBattleground: [],
      isSearching: false,
      listModeShown: 'showUpcomingEndorsements',
      listModeFiltersAvailable: [],
      listModeFiltersTimeStampOfChange: 0,
      // listOfYearsWhenChallengeExists: [],
      // listOfYearsWhenCandidateExists: [],
      listOfYearsWhenRepresentativeExists: [],
      numberOfChallengeResults: 99,
      numberOfChallengeSearchResults: 0,
      politicianWeVoteIdsAlreadyShown: [],
      searchText: '',
      stateCode: '',
    };
  }

  componentDidMount () {
    // console.log('ChallengesHome componentDidMount');
    window.scrollTo(0, 0);
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.challengeStoreListener = ChallengeStore.addListener(this.onChallengeStoreChange.bind(this));
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.representativeStoreListener = RepresentativeStore.addListener(this.onRepresentativeStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));

    // /////////////////////////
    // Pulled from onChallengeStoreChange
    // const challengeList = ChallengeStore.getPromotedChallengeDicts();
    const challengeList = ChallengeStore.getAllCachedChallengeList();
    this.setState({
      challengeList,
      challengeListTimeStampOfChange: Date.now(),
    }, () => this.onIncomingChallengeListChange(true));

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

  componentWillUnmount () {
    this.ballotStoreListener.remove();
    this.challengeStoreListener.remove();
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

  onChallengeStoreChange () {
    // const challengeList = ChallengeStore.getPromotedChallengeDicts();
    const challengeList = ChallengeStore.getAllCachedChallengeList();
    this.setState({
      challengeList,
      challengeListTimeStampOfChange: Date.now(),
    }, () => this.onIncomingChallengeListChange());
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

  onIncomingChallengeListChange (setDefaultListMode = false) {
    const { challengeList, stateCode } = this.state;
    // console.log('ChallengesHome onIncomingChallengeListChange, challengeList:', challengeList);
    // Do challenges exist for this state?
    let challengesShowing = false;
    if (stateCode && stateCode.toLowerCase() === 'all') {
      challengesShowing = true;
    } else if (stateCode) {
      challengeList.forEach((oneChallenge) => {
        const politicianStateCodeList = extractAttributeValueListFromObjectList('state_code', oneChallenge.challenge_politician_list, true);
        if (!challengesShowing && arrayContains(stateCode.toLowerCase(), politicianStateCodeList)) {
          challengesShowing = true;
        }
      });
    }
    this.setState({
      challengesShowing,
      // listOfYearsWhenChallengeExists: this.getListOfYearsWhenChallengeExists(challengeList),
    }, () => this.updateActiveFilters(setDefaultListMode));
  }

  onIncomingCandidateListChange (setDefaultListMode = false) {
    // const { candidateList } = this.state;
    // console.log('ChallengesHome onIncomingCandidateListChange, candidateList:', candidateList);
    this.setState({
      // listOfYearsWhenCandidateExists: this.getListOfYearsWhenCandidateExists(candidateList),
    }, () => this.updateActiveFilters(setDefaultListMode));
  }

  onIncomingRepresentativeListChange (setDefaultListMode = false) {
    const { representativeList } = this.state;
    // console.log('ChallengesHome onIncomingRepresentativeListChange, representativeList:', representativeList);
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
      challengeList, candidateList,
      // listOfYearsWhenChallengeExists, listOfYearsWhenCandidateExists,
      listOfYearsWhenRepresentativeExists,
    } = this.state;

    let { listModeShown } = this.state;
    // const listOfYears = [...new Set([...listOfYearsWhenChallengeExists, ...listOfYearsWhenCandidateExists, ...listOfYearsWhenRepresentativeExists])];
    // console.log('listOfYears:', listOfYears, ', setDefaultListMode:', setDefaultListMode);
    // let filterCount = 0;
    let upcomingEndorsementsAvailable = false;
    const todayAsInteger = getTodayAsInteger();
    // console.log('thisYearInteger:', thisYearInteger);
    challengeList.forEach((oneChallenge) => {
      if (oneChallenge.final_election_date_as_integer >= todayAsInteger) {
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

  changeListModeShown = (newListModeShown, newFilterYear = '') => {
    const filterYearInteger = convertToInteger(newFilterYear);
    this.setState({
      listModeShown: newListModeShown,
      filterYear: filterYearInteger,
    }, () => this.updateActiveFilters());
  }

  getDefaultListModeShown = (incomingUpcomingEndorsementsAvailable = false) => {
    // const { listOfYearsWhenChallengeExists, listOfYearsWhenCandidateExists, listOfYearsWhenRepresentativeExists, upcomingEndorsementsAvailable } = this.state;
    const { upcomingEndorsementsAvailable } = this.state;
    // const listOfYears = [...new Set([...listOfYearsWhenChallengeExists, ...listOfYearsWhenCandidateExists, ...listOfYearsWhenRepresentativeExists])];
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

  clearSearchFunction = () => {
    this.setState({
      isSearching: false,
      listModeShown: 'showUpcomingEndorsements',
      searchText: '',
    }, () => this.updateActiveFilters());
  }

  searchFunction = (searchText) => {
    // console.log('ChallengesHome searchFunction searchText:', searchText);
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

  handleNumberOfChallengeResults = (listResults, searchResults) => {
    this.setState({
      numberOfChallengeResults: listResults,
      numberOfChallengeSearchResults: searchResults,
    });
  }

  render () {
    renderLog('ChallengesHome');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      challengeList, challengeListTimeStampOfChange,
      detailsListMode,
      isSearching, listModeFiltersAvailable, listModeFiltersTimeStampOfChange,
      numberOfChallengeResults, numberOfChallengeSearchResults,
      searchText, stateCode,
    } = this.state;
    const numberOfSearchResults = numberOfChallengeSearchResults;
    // console.log('ChallengesHomeLoader.jsx render challengeList:', challengeList);

    if (detailsListMode) {
      // console.log('detailsListMode TRUE');
      return (
        <ChallengesHomeWrapper>
          <ChallengesHomeFilter
            changeListModeShown={this.changeListModeShown}
            clearSearchFunction={this.clearSearchFunction}
            // handleChooseStateChange={this.handleChooseStateChange}
            isSearching={isSearching}
            listModeFiltersAvailable={listModeFiltersAvailable}
            searchFunction={this.searchFunction}
            searchText={searchText}
            stateCode={stateCode}
          />
          {(nextReleaseFeaturesEnabled) && (
            <WhatIsHappeningSection useMinimumHeight={!!(numberOfChallengeResults)}>
              <Suspense fallback={<span>&nbsp;</span>}>
                <ChallengeListRoot
                  hideChallengesLinkedToPoliticians
                  hideIfNoResults
                  handleNumberOfResults={this.handleNumberOfChallengeResults}
                  incomingList={challengeList}
                  incomingListTimeStampOfChange={challengeListTimeStampOfChange}
                  listModeFilters={listModeFiltersAvailable}
                  listModeFiltersTimeStampOfChange={listModeFiltersTimeStampOfChange}
                  searchText={searchText}
                  stateCode={stateCode}
                  titleTextForList="Upcoming Challenges"
                />
              </Suspense>
            </WhatIsHappeningSection>
          )}
        </ChallengesHomeWrapper>
      );
    }

    // const useMinimumBattlegroundHeight = this.useMinimumBattlegroundHeightForState(stateCode);
    const displayBattlegroundPlaceholder = this.displayBattlegroundPlaceholderForState(stateCode);
    // console.log('ChallengesHome, isSearching: ', isSearching, 'numberOfRepresentativeResults:', numberOfRepresentativeResults);
    return (
      <ChallengesHomeWrapper>
        <ChallengesHomeFilter
          changeListModeShown={this.changeListModeShown}
          clearSearchFunction={this.clearSearchFunction}
          // handleChooseStateChange={this.handleChooseStateChange}
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

        {(nextReleaseFeaturesEnabled) ? (
          <WhatIsHappeningSection useMinimumHeight>
            <Suspense fallback={<span><ChallengeListRootPlaceholder titleTextForList="Challenges" /></span>}>
              <ChallengeListRoot
                hideChallengesLinkedToPoliticians
                hideIfNoResults
                // onHideIfNoResultsChange={this.handleHideIfNoResultsChange}
                incomingList={challengeList}
                incomingListTimeStampOfChange={challengeListTimeStampOfChange}
                listModeFilters={listModeFiltersAvailable}
                listModeFiltersTimeStampOfChange={listModeFiltersTimeStampOfChange}
                searchText={searchText}
                stateCode={stateCode}
                // titleTextForList="Upcoming Challenges" // TODO: Needs work
                titleTextForList="Democracy Challenges"
              />
            </Suspense>
          </WhatIsHappeningSection>
        ) : (
          <>
            {displayBattlegroundPlaceholder && <ChallengeListRootPlaceholder titleTextForList="Challenges" />}
          </>
        )}

        {/* */}
        <Suspense fallback={<></>}>
          <FirstChallengeListController searchText={searchText} stateCode={stateCode} />
        </Suspense>
      </ChallengesHomeWrapper>
    );
  }
}
ChallengesHome.propTypes = {
  match: PropTypes.object,
};

const ChallengesHomeWrapper = styled('div')`
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



export default ChallengesHome;
