import { Chip, CircularProgress } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import { filter } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FriendActions from '../../actions/FriendActions';
import OrganizationActions from '../../actions/OrganizationActions';
import { NumbersFoundWrapper, SearchTitle } from '../../common/components/Style/FilterStyles';
import { convertStateCodeToStateText } from '../../common/utils/addressFunctions';
import apiCalming from '../../common/utils/apiCalming';
import arrayContains from '../../common/utils/arrayContains';
import { getTodayAsInteger } from '../../common/utils/dateFormat';
import { renderLog } from '../../common/utils/logging';
import FriendStore from '../../stores/FriendStore';
import OrganizationStore from '../../stores/OrganizationStore';
import NumberOfItemsFound from '../Widgets/NumberOfItemsFound';
import SearchBar2024 from '../../common/components/Search/SearchBar2024';

const ShowMoreItems = React.lazy(() => import(/* webpackChunkName: 'ShowMoreItems' */ '../Widgets/ShowMoreItems'));
const VoterGuidePositionItem = React.lazy(() => import(/* webpackChunkName: 'VoterGuidePositionItem' */ './VoterGuidePositionItem'));


const STARTING_NUMBER_OF_POSITIONS_TO_DISPLAY = 6;

class VoterGuidePositionList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      listModeFiltersAvailable: [],
      filteredPositionList: [],
      filteredPositionListLength: 0,
      isSearching: false,
      listModeShown: 'showUpcomingEndorsements',
      loadingMoreItems: false,
      numberOfPositionItemsToDisplay: STARTING_NUMBER_OF_POSITIONS_TO_DISPLAY,
      positionList: [],
      positionSearchResults: [],
      listOfYearsWhenPositionExists: [],
      searchText: '',
      totalNumberOfPositionSearchResults: 0,
    };
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount () {
    // console.log('VoterGuidePositionList componentDidMount');
    // const { incomingPositionList } = this.props;
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));

    // Replicate onFriendStoreChange
    const organizationsVoterIsFriendsWith = FriendStore.currentFriendsOrganizationWeVoteIDList();
    // if (apiCalming('organizationsFollowedRetrieve', 60000)) {
    // We do not want apiCalming here because the filters on the OneValue page
    // will cause this component to be mounted and unmounted within one session, and we want to get a fresh retrieve each time
    if (apiCalming('organizationsFollowedRetrieve', 60000)) {
      OrganizationActions.organizationsFollowedRetrieve();
    }
    if (!organizationsVoterIsFriendsWith.length > 0) {
      if (apiCalming('friendListsAll', 3000)) {
        FriendActions.friendListsAll();
      }
    }

    // const stateCodesToDisplay = getStateCodesFoundInObjectList(incomingPositionList);
    // console.log('stateCodesToDisplay:', stateCodesToDisplay);

    window.addEventListener('scroll', this.onScroll);
    // this.setState({
    //   // listOfYearsWhenPositionExists: this.getListOfYearsWhenPositionExists(positionListModified2Filtered),
    // }, () => this.onIncomingPositionListChange(true));
    this.onIncomingPositionListChange(true);
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    this.organizationStoreListener.remove();
    window.removeEventListener('scroll', this.onScroll);
    if (this.positionItemTimer) clearTimeout(this.positionItemTimer);
  }

  onFriendStoreChange () {
    // console.log('onFriendStoreChange');
    this.onIncomingPositionListChange();
  }

  onOrganizationStoreChange () {
    this.onIncomingPositionListChange();
  }

  onIncomingPositionListChange (setDefaultListMode = false) {
    // console.log('VoterGuidePositionList onIncomingPositionListChange');
    const { incomingPositionList: positionList } = this.props;
    // Remove any positions which have duplicates (we always want to clean up on the API server, but sometimes miss duplicates)
    const candidateAlreadySeenThisYear = {};
    const positionListDeduplicated = positionList.map((position) => {
      // console.log('VoterGuidePositionList componentDidMount positionListModified1, position: ', position);
      if (!position.position_we_vote_id) {
        // console.log('MISSING position.position_we_vote_id');
        return null;
      }
      if (candidateAlreadySeenThisYear[position.ballot_item_we_vote_id] && candidateAlreadySeenThisYear[position.ballot_item_we_vote_id].includes(position.position_year)) {
        // console.log('componentDidMount already seen');
        return null;
      } else if (candidateAlreadySeenThisYear[position.ballot_item_we_vote_id]) {
        candidateAlreadySeenThisYear[position.ballot_item_we_vote_id].push(position.position_year);
      } else {
        candidateAlreadySeenThisYear[position.ballot_item_we_vote_id] = [];
        candidateAlreadySeenThisYear[position.ballot_item_we_vote_id].push(position.position_year);
      }
      return position;
    });

    const positionListNullsRemoved = positionListDeduplicated.filter((position) => position != null);

    const organizationsVoterIsFollowing = OrganizationStore.getOrganizationsVoterIsFollowing();
    // eslint-disable-next-line arrow-body-style
    const positionListWithFollowedData = positionListNullsRemoved.map((position) => {
      // console.log('onIncomingPositionListChange, position: ', position);
      return ({
        ...position,
        followed: organizationsVoterIsFollowing.filter((org) => (org && position && org.organization_we_vote_id === position.speaker_we_vote_id)).length > 0,
      });
    });
    let currentFriend;
    let atLeastOneFriendAdded = false;
    const organizationsVoterIsFriendsWith = FriendStore.currentFriendsOrganizationWeVoteIDList();
    const positionListWithFriendData = positionListWithFollowedData.map((position) => {
      // console.log('VoterGuidePositionList onFriendStoreChange, position: ', position);
      currentFriend = organizationsVoterIsFriendsWith.filter((organizationWeVoteId) => (position && organizationWeVoteId === position.speaker_we_vote_id)).length > 0;
      if (currentFriend) {
        atLeastOneFriendAdded = true;
      } else {
        // Shouldn't this be set here?
        // atLeastOneFriendAdded = false;
      }
      return ({
        ...position,
        atLeastOneFriendAdded,
        currentFriend,
      });
    });
    this.setState({
      positionList: positionListWithFriendData,
      listOfYearsWhenPositionExists: this.getListOfYearsWhenPositionExists(positionList),
      // numberOfPositionItemsToDisplay: this.props.startingNumberOfPositionsToDisplay || STARTING_NUMBER_OF_POSITIONS_TO_DISPLAY, // commented to fix the WV-99 issue - 03/11/2024
    }, () => this.updateActiveFilters(setDefaultListMode));
  }

  onFilterOrListChange = (setDefaultListMode = false) => {
    // console.log('onFilterOrListChange');
    // Start over with full positionList, and apply all active filters
    const { listModeFiltersAvailable, positionList, searchText } = this.state;
    let filteredPositions = positionList;
    const todayAsInteger = getTodayAsInteger();
    listModeFiltersAvailable.forEach((oneFilter) => {
      // console.log('oneFilter:', oneFilter);
      if ((oneFilter.filterType === 'showUpcomingEndorsements') && (oneFilter.filterSelected === true)) {
        filteredPositions = filteredPositions.filter((onePosition) => onePosition.position_ultimate_election_date >= todayAsInteger);
      }
      if ((oneFilter.filterType === 'showYear') && (oneFilter.filterSelected === true)) {
        filteredPositions = filteredPositions.filter((onePosition) => onePosition.position_year === oneFilter.filterYear);
      }
    });
    let positionSearchResults = [];
    if (searchText.length > 0) {
      let modifiedOrganization;
      const searchTextLowercase = searchText.toLowerCase();
      const filteredPositionsModified = [];
      filteredPositions.forEach((onePosition) => {
        modifiedOrganization = { ...onePosition };
        modifiedOrganization = {
          ...modifiedOrganization,
          ballot_item_state_code: onePosition.ballot_item_state_code || '',
          ballot_item_state_name: convertStateCodeToStateText(onePosition.ballot_item_state_code),
        };
        if (!onePosition.ballot_item_twitter_handle) {
          modifiedOrganization = {
            ...modifiedOrganization,
            ballot_item_twitter_handle: '',
          };
        }
        if (!onePosition.contest_office_name) {
          modifiedOrganization = {
            ...modifiedOrganization,
            contest_office_name: '',
          };
        }
        filteredPositionsModified.push(modifiedOrganization);
      });
      // console.log('searchTextLowercase:', searchTextLowercase);
      const searchWordArray = searchTextLowercase.match(/\b(\w+)\b/g);
      // console.log('searchWordArray:', searchWordArray);
      let foundInThisPosition;
      let isFirstWord;
      let thisWordFound;
      positionSearchResults = filter(filteredPositionsModified,
        (onePosition) => {
          foundInThisPosition = false;
          isFirstWord = true;
          searchWordArray.forEach((oneSearchWordLowerCase) => {
            thisWordFound = (
              onePosition.ballot_item_display_name.toLowerCase().includes(oneSearchWordLowerCase) ||
              onePosition.ballot_item_state_code.toLowerCase().includes(oneSearchWordLowerCase) ||
              onePosition.ballot_item_state_name.toLowerCase().includes(oneSearchWordLowerCase) ||
              onePosition.ballot_item_twitter_handle.toLowerCase().includes(oneSearchWordLowerCase) ||
              onePosition.contest_office_name.toLowerCase().includes(oneSearchWordLowerCase)
            );
            if (isFirstWord) {
              foundInThisPosition = thisWordFound;
              isFirstWord = false;
            } else {
              foundInThisPosition = foundInThisPosition && thisWordFound;
            }
          });
          return foundInThisPosition;
        });
      positionSearchResults = positionSearchResults.sort(this.orderPositionsByAlphabetical);
    }
    filteredPositions = filteredPositions.sort(this.orderPositionsByAlphabetical);
    // We need to add support for ballot_item_twitter_followers_count
    // filteredPositions = filteredPositions.sort(this.orderPositionsByBallotItemTwitterFollowers);
    // console.log('onFilterOrListChange, filteredPositions:', filteredPositions);
    this.setState({
      filteredPositionList: filteredPositions,
      filteredPositionListLength: filteredPositions.length,
      positionSearchResults,
      totalNumberOfPositionSearchResults: positionSearchResults.length,
    });
    if (setDefaultListMode) {
      this.setState({
        listModeShown: this.getDefaultListModeShown(),
      });
    }
  }

  onScroll () {
    if (this.props.turnOffOnScroll) {
      return null;
    }

    const showMoreItemsElement =  document.querySelector('#showMoreItemsId');
    // console.log('showMoreItemsElement: ', showMoreItemsElement);
    // console.log('Loading more: ', this.state.loadingMoreItems);
    if (showMoreItemsElement) {
      // console.log('onScroll');
      const {
        filteredPositionListLength, isSearching, loadingMoreItems,
        numberOfPositionItemsToDisplay, totalNumberOfPositionSearchResults,
      } = this.state;

      // console.log('window.height: ', window.innerHeight);
      // console.log('Window Scroll: ', window.scrollY);
      // console.log('Bottom: ', showMoreItemsElement.getBoundingClientRect().bottom);
      // console.log('filteredPositionListLength: ', filteredPositionListLength);
      // console.log('numberOfPositionItemsToDisplay: ', numberOfPositionItemsToDisplay);

      if ((isSearching && (numberOfPositionItemsToDisplay < totalNumberOfPositionSearchResults)) ||
          (!isSearching && (numberOfPositionItemsToDisplay < filteredPositionListLength))) {
        if (showMoreItemsElement.getBoundingClientRect().bottom <= window.innerHeight) {
          this.setState({ loadingMoreItems: true });
          this.increaseNumberOfPositionItemsToDisplay();
        } else {
          this.setState({ loadingMoreItems: false });
        }
      } else if (loadingMoreItems) {
        this.setState({ loadingMoreItems: false });
      }
    }
    return null;
  }

  handleToggleSearchBallot = (isSearching) => {
    // console.log('VoterGuideSettingsAddPositions handleToggleSearchBallot isSearching:', isSearching);
    // When we toggle, reset numberOfPositionItemsToDisplay
    this.setState({
      isSearching: !isSearching,
      loadingMoreItems: false,
      numberOfPositionItemsToDisplay: STARTING_NUMBER_OF_POSITIONS_TO_DISPLAY,
    });
  };

  increaseNumberOfPositionItemsToDisplay = () => {
    let { numberOfPositionItemsToDisplay } = this.state;
    // console.log('Number of position items before increment: ', numberOfPositionItemsToDisplay);

    numberOfPositionItemsToDisplay += 5;
    // console.log('Number of position items after increment: ', numberOfPositionItemsToDisplay);

    if (this.positionItemTimer) clearTimeout(this.positionItemTimer);
    this.positionItemTimer = setTimeout(() => {
      this.setState({
        numberOfPositionItemsToDisplay,
      });
    }, 500);
  }

  orderPositionsByAlphabetical = (firstEntry, secondEntry) => {
    let firstEntryName;
    let secondEntryName = 'x';
    if (firstEntry && firstEntry.ballot_item_display_name) {
      firstEntryName = firstEntry.ballot_item_display_name;
    }
    if (secondEntry && secondEntry.ballot_item_display_name) {
      secondEntryName = secondEntry.ballot_item_display_name;
    }
    if (firstEntryName < secondEntryName) { return -1; }
    if (firstEntryName > secondEntryName) { return 1; }
    return 0;
  };

  orderByFilterOrder = (firstFilter, secondFilter) => firstFilter.filterOrder - secondFilter.filterOrder;

  orderPositionsByBallotItemTwitterFollowers = (firstEntry, secondEntry) => secondEntry.ballot_item_twitter_followers_count - firstEntry.ballot_item_twitter_followers_count;

  updateActiveFilters = (setDefaultListMode = false) => {
    const { listOfYearsWhenPositionExists, positionList } = this.state;
    let { listModeShown } = this.state;
    let filterCount = 0;
    let upcomingEndorsementsAvailable = false;
    const todayAsInteger = getTodayAsInteger();
    positionList.forEach((onePosition) => {
      if (onePosition.position_ultimate_election_date >= todayAsInteger) {
        upcomingEndorsementsAvailable = true;
      }
    });
    if (setDefaultListMode) {
      listModeShown = this.getDefaultListModeShown(upcomingEndorsementsAvailable);
    }
    // console.log('updateActiveFilters listModeShown:', listModeShown);
    let listModeFiltersAvailable = [
    ];
    listOfYearsWhenPositionExists.forEach((oneYear) => {
      filterCount += 1;
      listModeFiltersAvailable.push({
        filterDisplayName: `${oneYear}`,
        filterName: `show${oneYear}`,
        filterOrder: 3000 - oneYear,
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
    this.setState({
      listModeFiltersAvailable,
      upcomingEndorsementsAvailable,
    }, () => this.onFilterOrListChange(setDefaultListMode));
  }

  changeListModeShown = (newListModeShown) => {
    this.setState({
      listModeShown: newListModeShown,
    }, () => this.updateActiveFilters());
  }

  getDefaultListModeShown = (incomingUpcomingEndorsementsAvailable = false) => {
    const { listOfYearsWhenPositionExists, upcomingEndorsementsAvailable } = this.state;
    // console.log('getDefaultListModeShown listOfYearsWhenPositionExists:', listOfYearsWhenPositionExists);
    if (upcomingEndorsementsAvailable || incomingUpcomingEndorsementsAvailable) {
      return 'showUpcomingEndorsements';
    } else if (listOfYearsWhenPositionExists && listOfYearsWhenPositionExists.length > 0) {
      const mostRecentYear = Math.max.apply(null, listOfYearsWhenPositionExists);
      // console.log('mostRecentYear:', mostRecentYear);
      return `show${mostRecentYear}`;
    }
    return 'showAllEndorsements';
  }

  getListOfYearsWhenPositionExists = (positionList) => {
    const listOfYearsWhenPositionExists = [];
    positionList.forEach((onePosition) => {
      if (onePosition.position_year > 0 && !arrayContains(onePosition.position_year, listOfYearsWhenPositionExists)) {
        listOfYearsWhenPositionExists.push(onePosition.position_year);
      }
    });
    return listOfYearsWhenPositionExists;
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

  render () {
    renderLog('VoterGuidePositionList');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, organizationWeVoteId, positionListExistsTitle } = this.props;
    const {
      filteredPositionList, filteredPositionListLength, isSearching,
      listModeFiltersAvailable, loadingMoreItems,
      numberOfPositionItemsToDisplay, positionList, positionSearchResults,
      searchText, totalNumberOfPositionSearchResults,
    } = this.state;
    // console.log('VoterGuidePositionList render');
    // console.log('this.state.positionList render: ', this.state.positionList);
    // console.log('filteredPositionList render: ', filteredPositionList);
    if (!positionList) {
      // console.log('VoterGuidePositionList Loading...');
      return <div>Loading...</div>;
    }
    let showTitle = false;
    let count;
    for (count = 0; count < positionList.length; count++) {
      showTitle = true;
    }
    let numberOfPositionItemsDisplayed = 0;
    let searchTextString = '';
    const showingPartialResults = isSearching ? totalNumberOfPositionSearchResults < 781 : filteredPositionListLength < 781;
    return (
      <div>
        <VoterGuideFilterWrapper>
          { showTitle ?
            <span>{positionListExistsTitle}</span> :
            null}
          {(listModeFiltersAvailable || showingPartialResults) && (
            <VoterGuideFilterChoices>
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
              {showingPartialResults && (
                <NumbersFoundWrapper>
                  <NumberOfItemsFound
                    numberOfItemsTotal={isSearching ? totalNumberOfPositionSearchResults : filteredPositionListLength}
                  />
                </NumbersFoundWrapper>
              )}
            </VoterGuideFilterChoices>
          )}
          {((positionList && (positionList.length > 10)) || isSearching) && (
            <SearchBarWrapper>
              <SearchBar2024
                clearButton
                searchButton
                placeholder="Search by name, office or state"
                searchFunction={this.searchFunction}
                clearFunction={this.clearFunction}
                searchUpdateDelayTime={250}
              />
            </SearchBarWrapper>
          )}
          {(isSearching && searchText) && (
            <SearchTitle>
              Searching for &quot;
              {searchText}
              &quot;
            </SearchTitle>
          )}
        </VoterGuideFilterWrapper>
        <ul className="card-child__list-group">
          {isSearching ? (
            <>
              {(positionSearchResults && !positionSearchResults.length) && (
                <NoResultsText>
                  {searchText ? (
                    <>
                      We couldn&apos;t find any endorsements containing the search term &quot;
                      {searchText}
                      &quot;
                      .
                    </>
                  ) : (
                    <>
                      Please enter a search term.
                    </>
                  )}
                </NoResultsText>
              )}
            </>
          ) : (
            <>
              {(filteredPositionList && !filteredPositionListLength) && (
                <NoResultsText>
                  Please change the filters to see past or other endorsements.
                </NoResultsText>
              )}
            </>
          )}
          {(isSearching ? positionSearchResults : filteredPositionList).map((onePosition) => {
            // console.log('numberOfPositionItemsDisplayed:', numberOfPositionItemsDisplayed);
            if (isSearching) {
              if (numberOfPositionItemsDisplayed >= numberOfPositionItemsToDisplay) {
                return null;
              }
              numberOfPositionItemsDisplayed += 1;
            } else {
              if (numberOfPositionItemsDisplayed >= numberOfPositionItemsToDisplay) {
                return null;
              }
              numberOfPositionItemsDisplayed += 1;
            }
            // console.log('numberOfBallotItemsDisplayed: ', numberOfBallotItemsDisplayed);
            let foundInItemsAlreadyShown = 0;
            let searchWordAlreadyShown = 0;
            if (searchText) {
              const wordsArray = searchText.split(' ');
              searchTextString = wordsArray.map((oneItem) => {
                const foundInStringItem = `${searchWordAlreadyShown ? ' or ' : ''}"${oneItem}"`;
                searchWordAlreadyShown += 1;
                return foundInStringItem;
              });
            }
            const searchResultsNode = (isSearching && searchTextString && onePosition.foundInArray && onePosition.foundInArray.length) ? (
              <SearchResultsFoundInExplanation>
                {searchTextString}
                {' '}
                found in
                {' '}
                {onePosition.foundInArray.map((oneItem) => {
                  const foundInStringItem = (
                    <span key={foundInItemsAlreadyShown}>
                      {foundInItemsAlreadyShown ? ', ' : ''}
                      {oneItem}
                    </span>
                  );
                  foundInItemsAlreadyShown += 1;
                  return foundInStringItem;
                })}
              </SearchResultsFoundInExplanation>
            ) : null;
            return (
              <div key={`${onePosition.position_we_vote_id}-${onePosition.voter_guide_we_vote_id}-${onePosition.speaker_display_name}`}>
                <VoterGuidePositionItem
                  ballotItemWeVoteId={onePosition.ballot_item_we_vote_id}
                  ballotItemDisplayName={onePosition.ballot_item_display_name}
                  organizationWeVoteId={organizationWeVoteId}
                  positionWeVoteId={onePosition.position_we_vote_id}
                  searchResultsNode={searchResultsNode}
                />
              </div>
            );
          })}
        </ul>
        <ShowMoreItemsWrapper id="showMoreItemsId" onClick={this.increaseNumberOfPositionItemsToDisplay}>
          <ShowMoreItems
            loadingMoreItemsNow={loadingMoreItems}
            numberOfItemsDisplayed={numberOfPositionItemsDisplayed}
            numberOfItemsTotal={isSearching ? totalNumberOfPositionSearchResults : filteredPositionListLength}
          />
        </ShowMoreItemsWrapper>
        <LoadingItemsWheel>
          {(loadingMoreItems) && (
            <CircularProgress />
          )}
        </LoadingItemsWheel>
      </div>
    );
  }
}
VoterGuidePositionList.propTypes = {
  classes: PropTypes.object,
  incomingPositionList: PropTypes.array.isRequired,
  organizationWeVoteId: PropTypes.string.isRequired,
  positionListExistsTitle: PropTypes.object,
  startingNumberOfPositionsToDisplay: PropTypes.string,
  turnOffOnScroll: PropTypes.bool,
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

const VoterGuideFilterChoices = styled('div')`
  margin-top: 8px;
`;

const VoterGuideFilterWrapper = styled('div')`
  margin: 0 15px;
  margin-bottom: 8px;
`;

const LoadingItemsWheel = styled('div')`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NoResultsText = styled('div')`
  margin: 15px;
`;

const SearchBarWrapper = styled('div')`
  margin-top: 4px;
  margin-bottom: 8px;
`;

const SearchResultsFoundInExplanation = styled('div')`
  background-color: #C2DCE8;
  border-radius: 4px;
  color: #0E759F;
  margin-left: 0 !important;
  margin-right: 0 !important;
  padding: 8px !important;
`;

const ShowMoreItemsWrapper = styled('div')(({ theme }) => (`
  margin-bottom: 16px;
  padding-left: 16px;
  padding-right: 26px;
  ${theme.breakpoints.down('sm')} {
    padding-right: 16px;
  }
  @media print{
    display: none;
  }
`));

export default withStyles(styles)(VoterGuidePositionList);
