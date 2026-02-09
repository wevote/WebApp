import { ArrowForwardIos, ArrowBackIos } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import { filter } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component, createRef } from 'react';
import styled from 'styled-components';
import {
  CampaignsHorizontallyScrollingContainer,
  RightArrowInnerWrapper,
  RightArrowOuterWrapper,
  LeftArrowInnerWrapper,
  LeftArrowOuterWrapper,
  CampaignsScrollingInnerWrapper,
  CampaignsScrollingOuterWrapper,
  TitleAndMobileArrowsOuterWrapper,
  MobileArrowsInnerWrapper,
} from '../../common/components/Style/ScrollingStyles';
import { convertStateCodeToStateText } from '../../common/utils/addressFunctions';
import { handleHorizontalScroll, leftAndRightArrowStateCalculation, checkDivPositionForLoadMore } from '../../common/utils/leftRightArrowCalculation';
import { getTodayAsInteger, getYearFromUltimateElectionDate } from '../../common/utils/dateFormat';
import filterListToRemoveEntriesWithDuplicateValue from '../../common/utils/filterListToRemoveEntriesWithDuplicateValue';
import { renderLog } from '../../common/utils/logging';
import PoliticianStore from '../../common/stores/PoliticianStore';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';

const PoliticianCardList = React.lazy(() => import(/* webpackChunkName: 'PoliticianCardList' */ './PoliticianCardList'));
// const HORIZONTAL_SCROLL_SPEED = 2;
const HORIZONTAL_SCROLL_DISTANCE_ON_LEFT_ARROW_CLICK = -630;
const HORIZONTAL_SCROLL_DISTANCE_ON_RIGHT_ARROW_CLICK = 630;
const HORIZONTAL_SCROLL_DISTANCE_MOBILE_LEFT_ARROW_CLICK = -315;
const HORIZONTAL_SCROLL_DISTANCE_MOBILE_RIGHT_ARROW_CLICK = 315;
// const HORIZONTAL_SCROLL_DISTANCE_ON_SHOW_MORE = 315;
const RIGHT_MARGIN_SIZE = 24;
// const HORIZONTAL_SCROLL_STEP_LEFT = -20;
// const HORIZONTAL_SCROLL_STEP_RIGHT = 20;

class PoliticianListRoot extends Component {
  constructor (props) {
    super(props);
    this.scrollElement = createRef();
    this.state = {
      politicianList: [],
      politicianSearchResults: [],
      filteredList: [],
      hideDisplayBecauseNoSearchResults: false,
      timeStampOfChange: 0,
      hideLeftArrow: true,
      hideRightArrow: false,
      callShowMoreCards: false,
    };
  }

  componentDidMount () {
    this.politicianStoreListener = PoliticianStore.addListener(this.onPoliticianStoreChange.bind(this));
    const { incomingList } = this.props;
    // console.log('PoliticianListRoot componentDidMount incomingList:', incomingList);
    if (incomingList) {
      const filteredList = [];
      incomingList.forEach((oneEntry) => {
        if (oneEntry.politician_we_vote_id) {
          filteredList.push(oneEntry);
        }
      });
      // console.log('filteredList with id > 0:', filteredList);
      this.setState({
        politicianList: filteredList,
      }, () => this.onFilterOrListChange());
      if ((isMobileScreenSize() && filteredList.length < 2) || (!isMobileScreenSize() && filteredList.length < 3)) {
        this.setState({
          hideLeftArrow: true,
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
    this.politicianStoreListener.remove();
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

  onPoliticianStoreChange () {
    this.onIncomingListChange();
  }

  onIncomingListChange () {
    const { incomingList } = this.props;
    if (incomingList) {
      const filteredList = [];
      incomingList.forEach((oneEntry) => {
        if (oneEntry.politician_we_vote_id && oneEntry.politician_we_vote_id !== '') {
          filteredList.push(oneEntry);
        }
      });
      // console.log('onIncomingListChange filteredList:', filteredList);
      this.setState({
        politicianList: filteredList,
      }, () => this.onFilterOrListChange());
    }
  }

  // orderByAlphabetical = (firstEntry, secondEntry) => {
  //   let firstEntryValue;
  //   let secondEntryValue = 'z';
  //   if (firstEntry && firstEntry.politician_name) {
  //     firstEntryValue = firstEntry.politician_name;
  //   }
  //   if (secondEntry && secondEntry.politician_name) {
  //     secondEntryValue = secondEntry.politician_name;
  //   }
  //   if (firstEntryValue < secondEntryValue) { return -1; }
  //   if (firstEntryValue > secondEntryValue) { return 1; }
  //   return 0;
  // };

  orderBySupporters = (firstEntry, secondEntry) => secondEntry.supporters_count - firstEntry.supporters_count;

  onFilterOrListChange = () => {
    // Start over with full list, and apply all active filters
    const { listModeFilters, searchText, stateCode } = this.props;
    const { politicianList } = this.state;
    let filteredList = politicianList;
    // console.log('onFilterOrListChange at START filteredList:', filteredList);
    // //////////////////////////////////////////
    // For now require all politicians to have a politician_we_vote_id in order to be displayed
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
        state_name: convertStateCodeToStateText(oneEntry.state_code),
      };
      if (!oneEntry.twitter_description) {
        modifiedEntry = {
          ...modifiedEntry,
          twitter_description: '',
        };
      }
      if (!oneEntry.politician_twitter_handle) {
        modifiedEntry = {
          ...modifiedEntry,
          politician_twitter_handle: '',
        };
      }

      filteredListModified.push(modifiedEntry);
    });
    // console.log('PoliticianListRoot onFilterOrListChange filteredListModified:', filteredListModified);
    filteredList = filteredListModified;
    // //////////////////////
    // Now filter politicians
    if (stateCode && stateCode.toLowerCase() !== 'all') {
      // Include those from this state AND labeled 'na' for National
      filteredList = filteredList.filter((oneEntry) => ((oneEntry.state_code.toLowerCase() === stateCode.toLowerCase()) || (oneEntry.state_code.toLowerCase() === 'na')));
    }
    // //////////
    // Now sort
    // filteredList = filteredList.sort(this.orderByAlphabetical);
    filteredList = filteredList.sort(this.orderBySupporters);
    let searchResults = [];
    let hideDisplayBecauseNoSearchResults = false;
    // this.callbackToParentHideIfNoResults(false);
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
              oneEntry.politician_name.toLowerCase().includes(oneSearchWordLowerCase) ||
              // NOTE: WV-1084 We decided to search on fewer fields
              // oneEntry.state_code.toLowerCase().includes(oneSearchWordLowerCase) ||
              // oneEntry.politician_state_name.toLowerCase().includes(oneSearchWordLowerCase) ||
              // oneEntry.twitter_description.toLowerCase().includes(oneSearchWordLowerCase) ||
              // oneEntry.twitter_handle.toLowerCase().includes(oneSearchWordLowerCase) ||
              // oneEntry.contest_office_name.toLowerCase().includes(oneSearchWordLowerCase)
              oneEntry.political_party.toLowerCase().includes(oneSearchWordLowerCase)
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
        // this.callbackToParentHideIfNoResults(true);
      }
      if (searchResults.length > 0) {
        // Only allow the first politician entry to be displayed (when there are multiple entries for the same politician)
        searchResults = filterListToRemoveEntriesWithDuplicateValue(searchResults, 'politician_we_vote_id', true);
      }
    } else if (filteredList.length > 0) {
      // Only allow the first politician entry to be displayed (when there are multiple entries for the same politician)
      // Revisit this if we start to all filtering by year again
      // console.log('FIRST_POLITICIAN: onFilterOrListChange, filteredList.length BEFORE:', filteredList.length);
      filteredList = filterListToRemoveEntriesWithDuplicateValue(filteredList, 'politician_we_vote_id', true);
      // console.log('FIRST_POLITICIAN: filteredList.length AFTER:', filteredList.length);
    }
    // console.log('onFilterOrListChange, searchResults:', searchResults);
    // console.log('onFilterOrListChange, filteredList:', filteredList);
    // console.log('filtered list length:', filteredList.length);

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
    // console.log('onFilterOrListChange at end, filteredList:', filteredList);
    this.setState({
      politicianSearchResults: searchResults,
      filteredList,
      hideDisplayBecauseNoSearchResults,
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
      callShowMoreCards: checkDivPositionForLoadMore(element, isMobileScreenSize()),
    });
  }

  render () {
    renderLog('PoliticianListRoot');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, hideIfNoResults, hideTitle, searchText, titleTextForList } = this.props;
    const isSearching = searchText && searchText.length > 0;
    const { politicianList, politicianSearchResults, filteredList, hideDisplayBecauseNoSearchResults, timeStampOfChange } = this.state;
    const filteredListLength = (filteredList) ? filteredList.length : 0;

    if (!politicianList) {
      return null;
    }
    let hideDisplayBecauseNoResults = false;
    // console.log('hideIfNoResults:', hideIfNoResults, 'filteredList:', filteredList, 'filteredListLength:', filteredListLength);
    if (hideIfNoResults) {
      if (isSearching) {
        if (politicianSearchResults && politicianSearchResults.length === 0) {
          hideDisplayBecauseNoResults = true;
        }
      } else if (filteredListLength === 0) {
        hideDisplayBecauseNoResults = true;
      }
      if (hideDisplayBecauseNoResults) {
        return null;
      }
    }
    // console.log('PoliticianListRoot actually rendering hideDisplayBecauseNoSearchResults', hideDisplayBecauseNoSearchResults);
    // console.log('PoliticianListRoot politicianList:', politicianList, ', filteredList at start:', filteredList);
    return (
      <PoliticianListWrapper>
        <TitleAndMobileArrowsOuterWrapper>
          {!!(!hideTitle &&
              !(isSearching && hideDisplayBecauseNoSearchResults) &&
              titleTextForList &&
              titleTextForList.length &&
              politicianList) &&
          (
            <WhatIsHappeningTitle id="whatIsHappeningTitle">
              {titleTextForList}
            </WhatIsHappeningTitle>
          )}
          <MobileArrowsInnerWrapper className="u-show-mobile" mobileDisableBothArrows={this.state.hideLeftArrow && this.state.hideRightArrow}>
            <LeftArrowInnerWrapper id="politicianLeftArrowMobile" disableMobileLeftArrow={this.state.hideLeftArrow} onClick={() => { handleHorizontalScroll(this.scrollElement.current, HORIZONTAL_SCROLL_DISTANCE_MOBILE_LEFT_ARROW_CLICK, this.leftAndRightArrowSetState, RIGHT_MARGIN_SIZE); }}>
              <ArrowBackIos classes={{ root: classes.arrowRoot }} />
            </LeftArrowInnerWrapper>
            <RightArrowInnerWrapper id="politicianRightArrowMobile" disableMobileRightArrow={this.state.hideRightArrow} onClick={() => { handleHorizontalScroll(this.scrollElement.current, HORIZONTAL_SCROLL_DISTANCE_MOBILE_RIGHT_ARROW_CLICK, this.leftAndRightArrowSetState, RIGHT_MARGIN_SIZE); this.shouldLoadMoreSetState(this.scrollElement.current); }}>
              <ArrowForwardIos classes={{ root: classes.arrowRoot }} />
            </RightArrowInnerWrapper>
          </MobileArrowsInnerWrapper>
        </TitleAndMobileArrowsOuterWrapper>
        {(!(isSearching && hideDisplayBecauseNoSearchResults)) && (
          <CampaignsScrollingOuterWrapper>
            <LeftArrowOuterWrapper className="u-show-desktop-tablet">
              <LeftArrowInnerWrapper id="politicianLeftArrowDesktop" onClick={() => { handleHorizontalScroll(this.scrollElement.current, HORIZONTAL_SCROLL_DISTANCE_ON_LEFT_ARROW_CLICK, this.leftAndRightArrowSetState, RIGHT_MARGIN_SIZE); }}>
                { this.state.hideLeftArrow ? null : <ArrowBackIos classes={{ root: classes.arrowRoot }} /> }
              </LeftArrowInnerWrapper>
            </LeftArrowOuterWrapper>
            <CampaignsScrollingInnerWrapper>
              <CampaignsHorizontallyScrollingContainer ref={this.scrollElement}
               onScroll={() => { this.leftAndRightArrowSetState(this.scrollElement.current); this.shouldLoadMoreSetState(this.scrollElement.current); }}
               showLeftGradient={!this.state.hideLeftArrow}
               showRightGradient={!this.state.hideRightArrow}
              >
                <PoliticianCardList
                  incomingPoliticianList={(isSearching ? politicianSearchResults : filteredList)}
                  searchText={searchText}
                  timeStampOfChange={timeStampOfChange}
                  useVerticalCard
                  loadMoreScroll={isMobileScreenSize() ? () => { handleHorizontalScroll(this.scrollElement.current, HORIZONTAL_SCROLL_DISTANCE_MOBILE_RIGHT_ARROW_CLICK, this.leftAndRightArrowSetState, RIGHT_MARGIN_SIZE); } : () => { handleHorizontalScroll(this.scrollElement.current, HORIZONTAL_SCROLL_DISTANCE_ON_RIGHT_ARROW_CLICK, this.leftAndRightArrowSetState, RIGHT_MARGIN_SIZE); }}
                  shouldLoadMore={this.state.callShowMoreCards}
                />
              </CampaignsHorizontallyScrollingContainer>
            </CampaignsScrollingInnerWrapper>
            <RightArrowOuterWrapper className="u-show-desktop-tablet">
              <RightArrowInnerWrapper id="politicianRightArrowDesktop" onClick={() => { handleHorizontalScroll(this.scrollElement.current, HORIZONTAL_SCROLL_DISTANCE_ON_RIGHT_ARROW_CLICK, this.leftAndRightArrowSetState, RIGHT_MARGIN_SIZE); this.shouldLoadMoreSetState(this.scrollElement.current); }}>
                { this.state.hideRightArrow ? null : <ArrowForwardIos classes={{ root: classes.arrowRoot }} /> }
              </RightArrowInnerWrapper>
            </RightArrowOuterWrapper>
          </CampaignsScrollingOuterWrapper>
        )}
      </PoliticianListWrapper>
    );
  }
}
PoliticianListRoot.propTypes = {
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

const PoliticianListWrapper = styled('div')`
  margin-bottom: 25px;
`;

const WhatIsHappeningTitle = styled('h2')`
  font-size: 22px;
  text-align: left;
`;

export default withStyles(styles)(PoliticianListRoot);
