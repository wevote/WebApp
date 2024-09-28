import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ActivityActions from '../../../actions/ActivityActions';
import BallotActions from '../../../actions/BallotActions';
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
import commonMuiStyles from '../../components/Style/commonMuiStyles';
import IssueStore from '../../../stores/IssueStore';
import VoterStore from '../../../stores/VoterStore';

const ChallengeListRoot = React.lazy(() => import(/* webpackChunkName: 'ChallengeListRoot' */ '../../components/ChallengeListRoot/ChallengeListRoot'));
const FirstChallengeListController = React.lazy(() => import(/* webpackChunkName: 'FirstChallengeListController' */ '../../components/ChallengeListRoot/FirstChallengeListController'));

// import OfficeHeldConstants from '../../constants/OfficeHeldConstants';  // I couldn't get this to work
const OFFICE_HELD_YEARS_AVAILABLE = [2023, 2024, 2025, 2026];

class ChallengesHome extends Component {
  constructor (props) {
    super(props);
    this.state = {
      challengeList: [],
      challengeListTimeStampOfChange: 0,
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
    this.challengeStoreListener = ChallengeStore.addListener(this.onChallengeStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));

    // /////////////////////////
    // Pulled from onChallengeStoreChange
    // const challengeList = ChallengeStore.getPromotedChallengeDicts();
    const challengeList = ChallengeStore.getAllCachedChallengeList();
    this.setState({
      challengeList,
      challengeListTimeStampOfChange: Date.now(),
    }, () => this.onIncomingChallengeListChange(true));

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
    this.ballotRetrieveTimer = setTimeout(() => {
      // voterBallotItemsRetrieve is takes significant resources, so let's delay it for a few seconds
      if (apiCalming('voterBallotItemsRetrieve', 600000)) {
        BallotActions.voterBallotItemsRetrieve(0, '', '');
      }
    }, 5000);  // April 19, 2021: Tuned to keep performance above 83.  LCP at 597ms
    // AnalyticsActions.saveActionOffice(VoterStore.electionId(), params.office_we_vote_id);
  }

  componentWillUnmount () {
    this.challengeStoreListener.remove();
    this.voterStoreListener.remove();
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.ballotRetrieveTimer) {
      clearTimeout(this.ballotRetrieveTimer);
      this.ballotRetrieveTimer = null;
    }
  }

  onChallengeStoreChange () {
    // const challengeList = ChallengeStore.getPromotedChallengeDicts();
    const challengeList = ChallengeStore.getAllCachedChallengeList();
    this.setState({
      challengeList,
      challengeListTimeStampOfChange: Date.now(),
    }, () => this.onIncomingChallengeListChange());
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

  orderByFilterOrder = (firstFilter, secondFilter) => firstFilter.filterOrder - secondFilter.filterOrder;

  updateActiveFilters = (setDefaultListMode = false) => {
    const {
      challengeList,
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

  handleNumberOfChallengeResults = (listResults, searchResults) => {
    // console.log('ChallengesHome handleNumberOfChallengeResults listResults:', listResults, ', searchResults:', searchResults);
    this.setState({
      numberOfChallengeResults: listResults,
      numberOfChallengeSearchResults: searchResults,
    });
  }

  render () {
    renderLog('ChallengesHome');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      challengeList, challengeListTimeStampOfChange,
      detailsListMode,
      isSearching, listModeFiltersAvailable, listModeFiltersTimeStampOfChange,
      numberOfChallengeResults, numberOfChallengeSearchResults,
      searchText, stateCode,
    } = this.state;
    const numberOfSearchResults = numberOfChallengeSearchResults;
    // console.log('ChallengesHome.jsx render challengeList:', challengeList);

    if (detailsListMode) {
      // console.log('detailsListMode TRUE');
      return (
        <ChallengesHomeWrapper>
          <StartAChallengeMobileWrapper>
            <Link to="/start-a-challenge">
              <Button
                classes={{ root: classes.buttonDesktop }}
                color="primary"
                id="saveChallengeTitle"
                variant="contained"
              >
                Create Challenge
              </Button>
            </Link>
          </StartAChallengeMobileWrapper>
          <ChallengesHomeFilter
            clearSearchFunction={this.clearSearchFunction}
            searchFunction={this.searchFunction}
          />
          <WhatIsHappeningSection useMinimumHeight={!!(numberOfChallengeResults)}>
            <Suspense fallback={<span>&nbsp;</span>}>
              <ChallengeListRoot
                hideChallengesLinkedToPoliticians
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
        </ChallengesHomeWrapper>
      );
    }

    // console.log('ChallengesHome, isSearching: ', isSearching, 'numberOfRepresentativeResults:', numberOfRepresentativeResults);
    return (
      <ChallengesHomeWrapper>
        <StartAChallengeMobileWrapper className="u-show-mobile">
          <Link to="/start-a-challenge">
            <Button
              classes={{ root: classes.buttonDefault }}
              color="primary"
              id="createChalllengeMobile"
              variant="contained"
            >
              Create Challenge
            </Button>
          </Link>
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
        </StartAChallengeMobileWrapper>
        <CreateAndSearchWrapper className="u-show-desktop-tablet">
          <StartAChallengeDesktopWrapper>
            <Link className="u-link-color" to="/start-a-challenge">
              <Button
                classes={{ root: classes.buttonDesktop }}
                color="primary"
                id="createChalllengeDesktop"
                variant="contained"
              >
                Create Challenge
              </Button>
            </Link>
          </StartAChallengeDesktopWrapper>
          <SearchDesktopWrapper>
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
          </SearchDesktopWrapper>
        </CreateAndSearchWrapper>
        {(isSearching && numberOfSearchResults === 0) && (
          <NoSearchResult
            title="No Democracy Challenges Found"
            subtitle="Please try a different search term."
          />
        )}

        <WhatIsHappeningSection useMinimumHeight>
          <Suspense fallback={<span><ChallengeListRootPlaceholder titleTextForList="Democracy Challenges" /></span>}>
            <ChallengeListRoot
              hideChallengesLinkedToPoliticians
              handleNumberOfResults={this.handleNumberOfChallengeResults}
              hideIfNoResults
              incomingList={challengeList}
              incomingListTimeStampOfChange={challengeListTimeStampOfChange}
              listModeFilters={listModeFiltersAvailable}
              listModeFiltersTimeStampOfChange={listModeFiltersTimeStampOfChange}
              searchText={searchText}
              stateCode={stateCode}
              titleTextForList="Democracy Challenges"
            />
          </Suspense>
        </WhatIsHappeningSection>

        {/* */}
        <Suspense fallback={<></>}>
          <FirstChallengeListController searchText={searchText} stateCode={stateCode} />
        </Suspense>
      </ChallengesHomeWrapper>
    );
  }
}
ChallengesHome.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
};

const ChallengesHomeWrapper = styled('div')`
  padding-top: ${isAndroid() ? '30px' : ''};
`;

const CreateAndSearchWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-bottom: 18px;
  margin-top: 12px;
`;

const SearchDesktopWrapper = styled('div')`
  margin-left: 15px;
  width: 100%;
`;

const StartAChallengeDesktopWrapper = styled('div')`
  margin-bottom: 24px;
  margin-top: 20px;
`;

const StartAChallengeMobileWrapper = styled('div')`
  margin-bottom: 18px;
  margin-top: 12px;
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



export default withStyles(commonMuiStyles)(ChallengesHome);
