import withStyles from '@mui/styles/withStyles';
import { filter } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { HorizontallyScrollingContainer, ScrollingInnerWrapper, ScrollingOuterWrapper } from '../../common/components/Style/ScrollingStyles';
import { convertStateCodeToStateText } from '../../common/utils/addressFunctions';
import { getTodayAsInteger, getYearFromUltimateElectionDate } from '../../common/utils/dateFormat';
import { renderLog } from '../../common/utils/logging';
import RepresentativeStore from '../../stores/RepresentativeStore';

const RepresentativeCardList = React.lazy(() => import(/* webpackChunkName: 'RepresentativeCardList' */ './RepresentativeCardList'));

class RepresentativeListRoot extends Component {
  constructor (props) {
    super(props);
    this.state = {
      hideDisplayBecauseNoSearchResults: false,
      representativeList: [],
      representativeSearchResults: [],
      filteredRepresentativeList: [],
      timeStampOfChange: 0,
    };
  }

  componentDidMount () {
    // console.log('RepresentativeListRoot componentDidMount');
    this.representativeStoreListener = RepresentativeStore.addListener(this.onRepresentativeStoreChange.bind(this));
    this.onIncomingListChange();
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
  }

  onRepresentativeStoreChange () {
    this.onIncomingListChange();
  }

  onIncomingListChange () {
    const { incomingList } = this.props;
    if (incomingList) {
      const filteredRepresentativeList = [];
      incomingList.forEach((oneRepresentative) => {
        if (oneRepresentative.id && oneRepresentative.id > 0) {
          filteredRepresentativeList.push(oneRepresentative);
        }
      });
      // console.log('representativeList:', representativeList);
      this.setState({
        representativeList: filteredRepresentativeList,
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
    // console.log('representativeList:', representativeList);
    let representativeAlreadyFoundThisYear = false;
    const representativeDisplayedThisYear = {};
    let filteredRepresentativeList = representativeList;
    // //////////////////////////////////////////
    // Make sure we have all required variables
    const filteredRepresentativeListModified = [];
    let modifiedRepresentative;
    filteredRepresentativeList.forEach((oneRepresentative) => {
      modifiedRepresentative = { ...oneRepresentative };
      if (!oneRepresentative.state_code) {
        modifiedRepresentative = {
          ...modifiedRepresentative,
          state_code: '',
        };
      }
      modifiedRepresentative = {
        ...modifiedRepresentative,
        representative_state_name: convertStateCodeToStateText(oneRepresentative.state_code),
        representative_ultimate_election_year: getYearFromUltimateElectionDate(modifiedRepresentative.representative_ultimate_election_date),
      };
      if (!oneRepresentative.twitter_description) {
        modifiedRepresentative = {
          ...modifiedRepresentative,
          twitter_description: '',
        };
      }
      if (!oneRepresentative.twitter_handle) {
        modifiedRepresentative = {
          ...modifiedRepresentative,
          twitter_handle: '',
        };
      }
      if (!oneRepresentative.contest_office_name) {
        modifiedRepresentative = {
          ...modifiedRepresentative,
          contest_office_name: '',
        };
      }
      // Remove duplicate representatives in the same year (based on politician_we_vote_id or twitter_handle)
      representativeAlreadyFoundThisYear = false;
      if (modifiedRepresentative.representative_ultimate_election_year) {
        if (!(modifiedRepresentative.representative_ultimate_election_year in representativeDisplayedThisYear)) {
          representativeDisplayedThisYear[modifiedRepresentative.representative_ultimate_election_year] = {};
        }
        if (modifiedRepresentative.politician_we_vote_id) {
          if (modifiedRepresentative.politician_we_vote_id in representativeDisplayedThisYear[modifiedRepresentative.representative_ultimate_election_year]) {
            representativeAlreadyFoundThisYear = true;
          } else {
            representativeDisplayedThisYear[modifiedRepresentative.representative_ultimate_election_year][modifiedRepresentative.politician_we_vote_id] = true;
          }
        }
        if (modifiedRepresentative.twitter_handle) {
          if (modifiedRepresentative.twitter_handle in representativeDisplayedThisYear[modifiedRepresentative.representative_ultimate_election_year]) {
            representativeAlreadyFoundThisYear = true;
          } else {
            representativeDisplayedThisYear[modifiedRepresentative.representative_ultimate_election_year][modifiedRepresentative.twitter_handle] = true;
          }
        }
      }
      if (!representativeAlreadyFoundThisYear) {
        filteredRepresentativeListModified.push(modifiedRepresentative);
      }
    });
    filteredRepresentativeList = filteredRepresentativeListModified;
    // //////////////////////
    // Now filter representatives
    if (listModeFilters && listModeFilters.length > 0) {
      const todayAsInteger = getTodayAsInteger();
      listModeFilters.forEach((oneFilter) => {
        // console.log('oneFilter:', oneFilter);
        if ((oneFilter.filterType === 'showUpcomingEndorsements') && (oneFilter.filterSelected === true)) {
          filteredRepresentativeList = filteredRepresentativeList.filter((oneRepresentative) => oneRepresentative.representative_ultimate_election_date >= todayAsInteger);
        }
        if ((oneFilter.filterType === 'showYear') && (oneFilter.filterSelected === true)) {
          filteredRepresentativeList = filteredRepresentativeList.filter((oneRepresentative) => getYearFromUltimateElectionDate(oneRepresentative.representative_ultimate_election_date) === oneFilter.filterYear);
        }
      });
    }
    if (stateCode && stateCode.toLowerCase() !== 'all') {
      filteredRepresentativeList = filteredRepresentativeList.filter((oneRepresentative) => oneRepresentative.state_code.toLowerCase() === stateCode.toLowerCase());
    }
    // //////////
    // Now sort
    filteredRepresentativeList = filteredRepresentativeList.sort(this.orderByAlphabetical);
    filteredRepresentativeList = filteredRepresentativeList.sort(this.orderByTwitterFollowers);
    filteredRepresentativeList = filteredRepresentativeList.sort(this.orderByIsBattlegroundRace);
    // filteredRepresentativeList = filteredRepresentativeList.sort(this.orderByUltimateElectionDate);
    let hideDisplayBecauseNoSearchResults = false;
    let representativeSearchResults = [];
    if (searchText && searchText.length > 0) {
      const searchTextLowercase = searchText.toLowerCase();
      // console.log('searchTextLowercase:', searchTextLowercase);
      const searchWordArray = searchTextLowercase.match(/\b(\w+)\b/g);
      // console.log('searchWordArray:', searchWordArray);
      let foundInThisRepresentative;
      let isFirstWord;
      let thisWordFound;
      representativeSearchResults = filter(filteredRepresentativeList,
        (oneRepresentative) => {
          foundInThisRepresentative = false;
          isFirstWord = true;
          searchWordArray.forEach((oneSearchWordLowerCase) => {
            thisWordFound = (
              oneRepresentative.ballot_item_display_name.toLowerCase().includes(oneSearchWordLowerCase) ||
              oneRepresentative.state_code.toLowerCase().includes(oneSearchWordLowerCase) ||
              oneRepresentative.representative_state_name.toLowerCase().includes(oneSearchWordLowerCase) ||
              oneRepresentative.contest_office_name.toLowerCase().includes(oneSearchWordLowerCase) ||
              oneRepresentative.twitter_description.toLowerCase().includes(oneSearchWordLowerCase) ||
              oneRepresentative.twitter_handle.toLowerCase().includes(oneSearchWordLowerCase)
            );
            if (isFirstWord) {
              foundInThisRepresentative = thisWordFound;
              isFirstWord = false;
            } else {
              foundInThisRepresentative = foundInThisRepresentative && thisWordFound;
            }
          });
          return foundInThisRepresentative;
        });
      if (representativeSearchResults.length === 0) {
        hideDisplayBecauseNoSearchResults = true;
      }
    }
    // console.log('onFilterOrListChange, representativeSearchResults:', representativeSearchResults);
    // console.log('onFilterOrListChange, filteredRepresentativeList:', filteredRepresentativeList);
    this.setState({
      filteredRepresentativeList,
      hideDisplayBecauseNoSearchResults,
      representativeSearchResults,
      timeStampOfChange: Date.now(),
    });
  }

  render () {
    renderLog('RepresentativeListRoot');  // Set LOG_RENDER_EVENTS to log all renders
    const { hideIfNoResults, hideTitle, searchText, titleTextForList } = this.props;
    const isSearching = searchText && searchText.length > 0;
    const { filteredRepresentativeList, hideDisplayBecauseNoSearchResults, representativeList, representativeSearchResults, timeStampOfChange } = this.state;

    if (!representativeList) {
      return null;
    }
    let hideDisplayBecauseNoResults = false;
    if (hideIfNoResults) {
      if (isSearching) {
        if (representativeSearchResults && representativeSearchResults.length === 0) {
          hideDisplayBecauseNoResults = true;
        }
      } else if (filteredRepresentativeList && filteredRepresentativeList.length === 0) {
        hideDisplayBecauseNoResults = true;
      }
      if (hideDisplayBecauseNoResults) {
        return null;
      }
    }
    return (
      <RepresentativeListWrapper>
        {!!(!hideTitle &&
            !hideDisplayBecauseNoSearchResults &&
            titleTextForList &&
            titleTextForList.length &&
            representativeList) &&
        (
          <WhatIsHappeningTitle>
            {titleTextForList}
          </WhatIsHappeningTitle>
        )}
        {(!hideDisplayBecauseNoSearchResults) && (
          <ScrollingOuterWrapper>
            <ScrollingInnerWrapper>
              <HorizontallyScrollingContainer>
                <RepresentativeCardList
                  incomingRepresentativeList={(isSearching ? representativeSearchResults : filteredRepresentativeList)}
                  timeStampOfChange={timeStampOfChange}
                  verticalListOn
                />
              </HorizontallyScrollingContainer>
            </ScrollingInnerWrapper>
          </ScrollingOuterWrapper>
        )}
      </RepresentativeListWrapper>
    );
  }
}
RepresentativeListRoot.propTypes = {
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
  iconButton: {
    padding: 8,
  },
});

const RepresentativeListWrapper = styled('div')`
`;

const WhatIsHappeningTitle = styled('h2')`
  font-size: 22px;
  text-align: left;
`;

export default withStyles(styles)(RepresentativeListRoot);
