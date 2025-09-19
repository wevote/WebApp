import { ArrowForwardIos, ArrowBackIos } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import { filter } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component, createRef } from 'react';
import styled from 'styled-components';
import {
  CampaignsHorizontallyScrollingContainer, RightArrowInnerWrapper,
  RightArrowOuterWrapper, LeftArrowInnerWrapper, LeftArrowOuterWrapper,
  CampaignsScrollingInnerWrapper, CampaignsScrollingOuterWrapper,
  TitleAndMobileArrowsOuterWrapper, MobileArrowsInnerWrapper,
} from '../../common/components/Style/ScrollingStyles';
import { convertStateCodeToStateText } from '../../common/utils/addressFunctions';
import { handleHorizontalScroll, leftAndRightArrowStateCalculation, checkDivPositionForLoadMore } from '../../common/utils/leftRightArrowCalculation';
import { getYearFromUltimateElectionDate, isAnyYearInOfficeSetTrue, isThisYearInOfficeSetTrue } from '../../common/utils/dateFormat';
import filterListToRemoveEntriesWithDuplicateValue from '../../common/utils/filterListToRemoveEntriesWithDuplicateValue';
import { renderLog } from '../../common/utils/logging';
import RepresentativeStore from '../../stores/RepresentativeStore';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';

const RepresentativeCardList = React.lazy(() => import(/* webpackChunkName: 'RepresentativeCardList' */ './RepresentativeCardList'));
// import OfficeHeldConstants from '../../constants/OfficeHeldConstants';  // I couldn't get this to work
const OFFICE_HELD_YEARS_AVAILABLE = [2023, 2024, 2025, 2026];
const HORIZONTAL_SCROLL_DISTANCE_ON_LEFT_ARROW_CLICK = -630;
const HORIZONTAL_SCROLL_DISTANCE_ON_RIGHT_ARROW_CLICK = 630;
const HORIZONTAL_SCROLL_DISTANCE_MOBILE_LEFT_ARROW_CLICK = -315;
const HORIZONTAL_SCROLL_DISTANCE_MOBILE_RIGHT_ARROW_CLICK = 315;
const RIGHT_MARGIN_SIZE = 24;
// const HORIZONTAL_SCROLL_SPEED = 2;
// const HORIZONTAL_SCROLL_DISTANCE_ON_SHOW_MORE = 315;
// const HORIZONTAL_SCROLL_STEP_LEFT = -20;
// const HORIZONTAL_SCROLL_STEP_RIGHT = 20;

class RepresentativeListRoot extends Component {
  constructor (props) {
    super(props);
    this.scrollElement = createRef();
    this.state = {
      hideDisplayBecauseNoSearchResults: false,
      representativeList: [],
      representativeSearchResults: [],
      filteredList: [],
      timeStampOfChange: 0,
      hideLeftArrow: true,
      hideRightArrow: false,
      callShowMoreCards: false,
    };
  }

  componentDidMount () {
    // console.log('RepresentativeListRoot componentDidMount');
    this.representativeStoreListener = RepresentativeStore.addListener(this.onRepresentativeStoreChange.bind(this));
    const { incomingList } = this.props;
    // console.log('RepresentativeListRoot componentDidMount incomingList:', incomingList);
    if (incomingList) {
      const filteredList = [];
      incomingList.forEach((oneEntry) => {
        if (oneEntry.id && oneEntry.id > 0) {
          filteredList.push(oneEntry);
        }
      });
      // console.log('filteredList with id > 0:', filteredList);
      this.setState({
        representativeList: filteredList,
      }, () => this.onFilterOrListChange());
      if ((isMobileScreenSize() && filteredList.length < 2) || (!isMobileScreenSize() && filteredList.length < 3)) {
        this.setState({
          hideRightArrow: true,
        });
      } else {
        this.setState({
          hideRightArrow: false,
        });
      }
    }
  }

  componentDidUpdate (prevProps) {
    let filterChangeNeeded = false;
    let incomingListChangeNeeded = false;
    if (this.props.listModeFiltersTimeStampOfChange !== prevProps.listModeFiltersTimeStampOfChange) {
      filterChangeNeeded = true;
    }
    if (this.props.searchText !== prevProps.searchText) {
      filterChangeNeeded = true;
    }
    if (this.props.stateCode !== prevProps.stateCode) {
      filterChangeNeeded = true;
    }
    if (this.props.incomingListTimeStampOfChange !== prevProps.incomingListTimeStampOfChange) {
      incomingListChangeNeeded = true;
    }
    if (incomingListChangeNeeded) {
      this.onIncomingListChange();
    } else if (filterChangeNeeded) {
      this.onFilterOrListChange();
    }
  }

  componentWillUnmount () {
    this.representativeStoreListener.remove();
    if (this.timer) clearTimeout(this.timer);
  }

  handleNumberOfResults (numberOfFilteredResults, numberOfSearchResults) {
    // console.log('RepresentativeListRoot handleNumberOfResults numberOfFilteredResults:', numberOfFilteredResults, ', numberOfSearchResults:', numberOfSearchResults);
    if (this.props.handleNumberOfResults) {
      // Delay telling the parent component that the number of results has changed
      // if (this.timer) clearTimeout(this.timer);
      // this.timer = setTimeout(() => {
      this.props.handleNumberOfResults(numberOfFilteredResults, numberOfSearchResults);
      // }, 500);
    }
  }

  onRepresentativeStoreChange () {
    this.onIncomingListChange();
  }

  onIncomingListChange () {
    const { incomingList } = this.props;
    if (incomingList) {
      const filteredList = [];
      incomingList.forEach((oneEntry) => {
        if (oneEntry.id && oneEntry.id > 0) {
          filteredList.push(oneEntry);
        }
      });
      // console.log('representativeList:', representativeList);
      this.setState({
        representativeList: filteredList,
      }, () => this.onFilterOrListChange());
    }
  }

  orderByAlphabetical = (firstEntry, secondEntry) => {
    let firstEntryValue;
    let secondEntryValue = 'z';
    if (firstEntry && firstEntry.ballot_item_display_name) {
      firstEntryValue = firstEntry.ballot_item_display_name;
    }
    if (secondEntry && secondEntry.ballot_item_display_name) {
      secondEntryValue = secondEntry.ballot_item_display_name;
    }
    if (firstEntryValue < secondEntryValue) { return -1; }
    if (firstEntryValue > secondEntryValue) { return 1; }
    return 0;
  };

  orderByIsBattlegroundRace = (firstEntry, secondEntry) => {
    let firstEntryValue = false;
    let secondEntryValue = false;
    if (firstEntry && 'is_battleground_race' in firstEntry) {
      firstEntryValue = firstEntry.is_battleground_race;
    }
    if (secondEntry && 'is_battleground_race' in secondEntry) {
      secondEntryValue = secondEntry.is_battleground_race;
    }
    if (firstEntryValue === true && secondEntryValue === false) { return -1; }
    if (firstEntryValue === false && secondEntryValue === true) { return 1; }
    return 0;
  };

  orderByTwitterFollowers = (firstEntry, secondEntry) => secondEntry.twitter_followers_count - firstEntry.twitter_followers_count;

  // orderByUltimateElectionDate = (firstEntry, secondEntry) => secondEntry.candidate_ultimate_election_date - firstEntry.candidate_ultimate_election_date;

  onFilterOrListChange = () => {
    // console.log('onFilterOrListChange');
    // Start over with full list, and apply all active filters
    const { listModeFilters, searchText, stateCode } = this.props;
    const { representativeList } = this.state;
    // console.log('RepresentativeListRoot onFilterOrListChange representativeList at start:', representativeList);
    let alreadyFoundThisYear = false;
    const displayedThisYear = {};
    let filteredList = representativeList;
    // //////////////////////////////////////////
    // For now require all candidates to have a politician_we_vote_id in order to be displayed
    filteredList = filteredList.filter((oneEntry) => (oneEntry.politician_we_vote_id));
    // //////////////////////////////////////////
    // Make sure we have all required variables
    const filteredListModified = [];
    let modifiedEntry;
    filteredList.forEach((oneEntry) => {
      modifiedEntry = { ...oneEntry };
      if (!oneEntry.state_code) {
        modifiedEntry = {
          ...modifiedEntry,
          state_code: '',
        };
      }
      modifiedEntry = {
        ...modifiedEntry,
        representative_state_name: convertStateCodeToStateText(oneEntry.state_code),
        representative_ultimate_election_year: getYearFromUltimateElectionDate(modifiedEntry.representative_ultimate_election_date),
      };
      if (!oneEntry.twitter_description) {
        modifiedEntry = {
          ...modifiedEntry,
          twitter_description: '',
        };
      }
      if (!oneEntry.twitter_handle) {
        modifiedEntry = {
          ...modifiedEntry,
          twitter_handle: '',
        };
      }
      if (!oneEntry.contest_office_name) {
        modifiedEntry = {
          ...modifiedEntry,
          contest_office_name: '',
        };
      }
      // Remove duplicates in the same year (based on politician_we_vote_id or twitter_handle)
      alreadyFoundThisYear = false;
      if (modifiedEntry.representative_ultimate_election_year) {
        if (!(modifiedEntry.representative_ultimate_election_year in displayedThisYear)) {
          displayedThisYear[modifiedEntry.representative_ultimate_election_year] = {};
        }
        if (modifiedEntry.politician_we_vote_id) {
          if (modifiedEntry.politician_we_vote_id in displayedThisYear[modifiedEntry.representative_ultimate_election_year]) {
            alreadyFoundThisYear = true;
          } else {
            displayedThisYear[modifiedEntry.representative_ultimate_election_year][modifiedEntry.politician_we_vote_id] = true;
          }
        }
        if (modifiedEntry.twitter_handle) {
          if (modifiedEntry.twitter_handle in displayedThisYear[modifiedEntry.representative_ultimate_election_year]) {
            alreadyFoundThisYear = true;
          } else {
            displayedThisYear[modifiedEntry.representative_ultimate_election_year][modifiedEntry.twitter_handle] = true;
          }
        }
      }
      if (!alreadyFoundThisYear) {
        filteredListModified.push(modifiedEntry);
      }
    });
    filteredList = filteredListModified;
    // console.log('onFilterOrListChange filteredListModified:', filteredListModified);
    // //////////////////////
    // Now filter representatives
    if (listModeFilters && listModeFilters.length > 0) {
      // const todayAsInteger = getTodayAsInteger();
      const yearsInOfficeUpcoming = [];
      const today = new Date();
      const thisYearInteger = today.getFullYear();
      // console.log('thisYearInteger:', thisYearInteger, 'OFFICE_HELD_YEARS_AVAILABLE:', OFFICE_HELD_YEARS_AVAILABLE);
      for (let i = 0; i < OFFICE_HELD_YEARS_AVAILABLE.length; i++) {
        // console.log('OFFICE_HELD_YEARS_AVAILABLE[i]:', OFFICE_HELD_YEARS_AVAILABLE[i]);
        if (OFFICE_HELD_YEARS_AVAILABLE[i] < thisYearInteger) {
          // Skip over prior years
        } else if (!(OFFICE_HELD_YEARS_AVAILABLE[i] in yearsInOfficeUpcoming)) {
          yearsInOfficeUpcoming.push(OFFICE_HELD_YEARS_AVAILABLE[i]);
        }
      }
      // console.log('yearsInOfficeUpcoming:', yearsInOfficeUpcoming);
      listModeFilters.forEach((oneFilter) => {
        // console.log('oneFilter:', oneFilter);
        if ((oneFilter.filterType === 'showUpcomingEndorsements') && (oneFilter.filterSelected === true)) {
          filteredList = filteredList.filter((oneEntry) => isAnyYearInOfficeSetTrue(yearsInOfficeUpcoming, oneEntry));
        }
        if ((oneFilter.filterType === 'showYear') && (oneFilter.filterSelected === true)) {
          filteredList = filteredList.filter((oneEntry) => isThisYearInOfficeSetTrue(oneFilter.filterYear, oneEntry));
        }
      });
    }
    if (stateCode && stateCode.toLowerCase() !== 'all') {
      // Include those from this state AND labeled 'na' for National
      filteredList = filteredList.filter((oneEntry) => ((oneEntry.state_code.toLowerCase() === stateCode.toLowerCase()) || (oneEntry.state_code.toLowerCase() === 'na')));
    }
    // //////////
    // Now sort
    filteredList = filteredList.sort(this.orderByAlphabetical);
    filteredList = filteredList.sort(this.orderByTwitterFollowers);
    // filteredList = filteredList.sort(this.orderByIsBattlegroundRace); // Update to work with "is_battleground_race_2023"
    // filteredList = filteredList.sort(this.orderByUltimateElectionDate);
    let searchResults = [];
    let hideDisplayBecauseNoSearchResults = false;
    if (searchText && searchText.length > 0) {
      const searchTextLowercase = searchText.toLowerCase();
      // console.log('searchTextLowercase:', searchTextLowercase);
      const searchWordArray = searchTextLowercase.match(/\b(\w+)\b/g);
      // console.log('searchWordArray:', searchWordArray);
      let foundInThisEntry;
      let isFirstWord;
      let thisWordFound;
      searchResults = filter(filteredList,
        (oneEntry) => {
          foundInThisEntry = false;
          isFirstWord = true;
          searchWordArray.forEach((oneSearchWordLowerCase) => {
            thisWordFound = (
              oneEntry.ballot_item_display_name.toLowerCase().includes(oneSearchWordLowerCase) ||
              oneEntry.state_code.toLowerCase().includes(oneSearchWordLowerCase) ||
              oneEntry.representative_state_name.toLowerCase().includes(oneSearchWordLowerCase) ||
              oneEntry.contest_office_name.toLowerCase().includes(oneSearchWordLowerCase) ||
              oneEntry.twitter_description.toLowerCase().includes(oneSearchWordLowerCase) ||
              oneEntry.twitter_handle.toLowerCase().includes(oneSearchWordLowerCase)
            );
            if (isFirstWord) {
              foundInThisEntry = thisWordFound;
              isFirstWord = false;
            } else {
              foundInThisEntry = foundInThisEntry && thisWordFound;
            }
          });
          return foundInThisEntry;
        });
      if (searchResults.length === 0) {
        hideDisplayBecauseNoSearchResults = true;
      }
      if (searchResults.length > 0) {
        // Only allow the first politician entry to be displayed (when there are multiple candidate entries for the same politician)
        searchResults = filterListToRemoveEntriesWithDuplicateValue(searchResults, 'politician_we_vote_id', true);
      }
    } else if (filteredList.length > 0) {
      // Only allow the first politician entry to be displayed (when there are multiple candidate entries for the same politician)
      // Revisit this if we start to all filtering by year again
      filteredList = filterListToRemoveEntriesWithDuplicateValue(filteredList, 'politician_we_vote_id', true);
    }
    // console.log('onFilterOrListChange, searchResults:', searchResults);
    // console.log('onFilterOrListChange, filteredList:', filteredList);

    // Set state of hideRightArrow
    if (searchResults.length > 0) {
      if ((isMobileScreenSize() && searchResults.length < 2) || (!isMobileScreenSize() && searchResults.length < 3)) {
        this.setState({
          hideLeftArrow: true,
          hideRightArrow: true,
        });
      }
    } else if ((isMobileScreenSize() && filteredList.length < 2) || (!isMobileScreenSize() && filteredList.length < 3)) {
      this.setState({
        hideLeftArrow: true,
        hideRightArrow: true,
      });
    } else {
      this.setState({
        hideLeftArrow: true,
        hideRightArrow: false,
      });
    }

    this.setState({
      filteredList,
      hideDisplayBecauseNoSearchResults,
      representativeSearchResults: searchResults,
      timeStampOfChange: Date.now(),
    }, () => { this.handleNumberOfResults(filteredList.length, searchResults.length); });
  }

  leftAndRightArrowSetState = (el) => {
    // set state here
    const leftRightStateDict = leftAndRightArrowStateCalculation(el);
    this.setState({
      hideLeftArrow: leftRightStateDict[0],
      hideRightArrow: leftRightStateDict[1],
    });
  }

  loadMoreScrollLocal = (el) => {
    handleHorizontalScroll(el, 29, this.leftAndRightArrowSetState, RIGHT_MARGIN_SIZE);
    // handleHorizontalScroll(this.scrollElement.current, distance, this.leftAndRightArrowSetState, RIGHT_MARGIN_SIZE);
  }

  shouldLoadMoreSetState = (el) => {
    const element = el;
    this.setState({
      callShowMoreCards: checkDivPositionForLoadMore(element),
    });
  }

  render () {
    renderLog('RepresentativeListRoot');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, hideIfNoResults, hideTitle, searchText, titleTextForList } = this.props;
    const isSearching = searchText && searchText.length > 0;
    const { filteredList, hideDisplayBecauseNoSearchResults, representativeList, representativeSearchResults, timeStampOfChange } = this.state;

    if (!representativeList) {
      return null;
    }
    let hideDisplayBecauseNoResults = false;
    if (hideIfNoResults) {
      if (isSearching) {
        if (representativeSearchResults && representativeSearchResults.length === 0) {
          hideDisplayBecauseNoResults = true;
        }
      } else if (filteredList && filteredList.length === 0) {
        hideDisplayBecauseNoResults = true;
      }
      if (hideDisplayBecauseNoResults) {
        return null;
      }
    }
    return (
      <RepresentativeListWrapper>
        <TitleAndMobileArrowsOuterWrapper>
          {!!(!hideTitle &&
              !hideDisplayBecauseNoSearchResults &&
              titleTextForList &&
              titleTextForList.length &&
              representativeList) &&
          (
            <WhatIsHappeningTitle id="whatIsHappeningTitle">
              {titleTextForList}
            </WhatIsHappeningTitle>
          )}
          <MobileArrowsInnerWrapper className="u-show-mobile">
            <LeftArrowInnerWrapper id="representativeLeftArrowMobile" disableMobileLeftArrow={this.state.hideLeftArrow} onClick={() => { handleHorizontalScroll(this.scrollElement.current, HORIZONTAL_SCROLL_DISTANCE_MOBILE_LEFT_ARROW_CLICK, this.leftAndRightArrowSetState, RIGHT_MARGIN_SIZE); }}>
              <ArrowBackIos classes={{ root: classes.arrowRoot }} />
            </LeftArrowInnerWrapper>
            <RightArrowInnerWrapper id="representativeRightArrowMobile" disableMobileRightArrow={this.state.hideRightArrow} onClick={() => { handleHorizontalScroll(this.scrollElement.current, HORIZONTAL_SCROLL_DISTANCE_MOBILE_RIGHT_ARROW_CLICK, this.leftAndRightArrowSetState, RIGHT_MARGIN_SIZE); this.shouldLoadMoreSetState(this.scrollElement.current); }}>
              <ArrowForwardIos classes={{ root: classes.arrowRoot }} />
            </RightArrowInnerWrapper>
          </MobileArrowsInnerWrapper>
        </TitleAndMobileArrowsOuterWrapper>
        {(!hideDisplayBecauseNoSearchResults) && (
          <CampaignsScrollingOuterWrapper>
            <LeftArrowOuterWrapper className="u-show-desktop-tablet">
              <LeftArrowInnerWrapper id="representativeLeftArrowDesktop" onClick={() => { handleHorizontalScroll(this.scrollElement.current, HORIZONTAL_SCROLL_DISTANCE_ON_LEFT_ARROW_CLICK, this.leftAndRightArrowSetState, RIGHT_MARGIN_SIZE); }}>
                {this.state.hideLeftArrow ? null : <ArrowBackIos classes={{ root: classes.arrowRoot }} />}
              </LeftArrowInnerWrapper>
            </LeftArrowOuterWrapper>
            <CampaignsScrollingInnerWrapper>
              <CampaignsHorizontallyScrollingContainer ref={this.scrollElement}
                onScroll={() => { this.leftAndRightArrowSetState(this.scrollElement.current); this.shouldLoadMoreSetState(this.scrollElement.current); }}
                showLeftGradient={!this.state.hideLeftArrow}
                showRightGradient={!this.state.hideRightArrow}
              >
                <RepresentativeCardList
                  incomingRepresentativeList={(isSearching ? representativeSearchResults : filteredList)}
                  timeStampOfChange={timeStampOfChange}
                  useVerticalCard
                  loadMoreScroll={isMobileScreenSize() ? () => { handleHorizontalScroll(this.scrollElement.current, HORIZONTAL_SCROLL_DISTANCE_MOBILE_RIGHT_ARROW_CLICK, this.leftAndRightArrowSetState, RIGHT_MARGIN_SIZE); } : () => { handleHorizontalScroll(this.scrollElement.current, HORIZONTAL_SCROLL_DISTANCE_ON_RIGHT_ARROW_CLICK, this.leftAndRightArrowSetState, RIGHT_MARGIN_SIZE); }}
                  shouldLoadMore={this.state.callShowMoreCards}
                />
              </CampaignsHorizontallyScrollingContainer>
            </CampaignsScrollingInnerWrapper>
            <RightArrowOuterWrapper className="u-show-desktop-tablet">
              <RightArrowInnerWrapper id="representativeLeftArrowDesktop" onClick={() => { handleHorizontalScroll(this.scrollElement.current, HORIZONTAL_SCROLL_DISTANCE_ON_RIGHT_ARROW_CLICK, this.leftAndRightArrowSetState, RIGHT_MARGIN_SIZE); this.shouldLoadMoreSetState(this.scrollElement.current); }}>
                { this.state.hideRightArrow ? null : <ArrowForwardIos classes={{ root: classes.arrowRoot }} /> }
              </RightArrowInnerWrapper>
            </RightArrowOuterWrapper>
          </CampaignsScrollingOuterWrapper>
        )}
      </RepresentativeListWrapper>
    );
  }
}
RepresentativeListRoot.propTypes = {
  classes: PropTypes.object,
  handleNumberOfResults: PropTypes.func,
  hideIfNoResults: PropTypes.bool,
  hideTitle: PropTypes.bool,
  incomingList: PropTypes.array,
  incomingListTimeStampOfChange: PropTypes.number,
  listModeFilters: PropTypes.array,
  listModeFiltersTimeStampOfChange: PropTypes.number,
  searchText: PropTypes.string,
  stateCode: PropTypes.string,
  titleTextForList: PropTypes.string,
};

const styles = () => ({
  arrowRoot: {
    fontSize: 24,
  },
  iconButton: {
    padding: 8,
  },
});

const RepresentativeListWrapper = styled('div')`
  margin-bottom: 25px;
`;

const WhatIsHappeningTitle = styled('h2')`
  font-size: 22px;
  text-align: left;
`;

export default withStyles(styles)(RepresentativeListRoot);
