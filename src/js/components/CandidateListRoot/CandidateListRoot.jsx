import withStyles from '@mui/styles/withStyles';
import { filter } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { HorizontallyScrollingContainer, ScrollingInnerWrapper, ScrollingOuterWrapper } from '../../common/components/Style/ScrollingStyles';
import { convertStateCodeToStateText } from '../../common/utils/addressFunctions';
import { getTodayAsInteger, getYearFromUltimateElectionDate } from '../../common/utils/dateFormat';
import { renderLog } from '../../common/utils/logging';
import CandidateStore from '../../stores/CandidateStore';

const CandidateCardList = React.lazy(() => import(/* webpackChunkName: 'CandidateCardList' */ './CandidateCardList'));

class CandidateListRoot extends Component {
  constructor (props) {
    super(props);
    this.state = {
      candidateList: [],
      candidateSearchResults: [],
      filteredCandidateList: [],
      timeStampOfChange: 0,
    };
  }

  componentDidMount () {
    // console.log('CandidateListRoot componentDidMount');
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
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
    this.candidateStoreListener.remove();
  }

  onCandidateStoreChange () {
    this.onIncomingListChange();
  }

  onIncomingListChange () {
    const { incomingList } = this.props;
    if (incomingList) {
      const filteredCandidateList = [];
      incomingList.forEach((oneCandidate) => {
        if (oneCandidate.id && oneCandidate.id > 0) {
          filteredCandidateList.push(oneCandidate);
        }
      });
      // console.log('candidateList:', candidateList);
      this.setState({
        candidateList: filteredCandidateList,
      }, () => this.onFilterOrListChange());
    }
  }

  orderByAlphabetical = (firstEntry, secondEntry) => {
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

  orderByTwitterFollowers = (firstCandidate, secondCandidate) => secondCandidate.twitter_followers_count - firstCandidate.twitter_followers_count;

  orderCandidatesByUltimateDate = (firstEntry, secondEntry) => secondEntry.candidate_ultimate_election_date - firstEntry.candidate_ultimate_election_date;

  onFilterOrListChange = () => {
    // console.log('onFilterOrListChange');
    // Start over with full list, and apply all active filters
    const { listModeFilters, searchText, stateCode } = this.props;
    const { candidateList } = this.state;
    // console.log('candidateList:', candidateList);
    let candidateAlreadyFoundThisYear = false;
    const candidateDisplayedThisYear = {};
    let filteredCandidateList = candidateList;
    // //////////////////////////////////////////
    // Make sure we have all required variables
    const filteredCandidateListModified = [];
    let modifiedCandidate;
    filteredCandidateList.forEach((oneCandidate) => {
      modifiedCandidate = { ...oneCandidate };
      if (!oneCandidate.state_code) {
        modifiedCandidate = {
          ...modifiedCandidate,
          state_code: '',
        };
      }
      modifiedCandidate = {
        ...modifiedCandidate,
        candidate_state_name: convertStateCodeToStateText(oneCandidate.state_code),
        candidate_ultimate_election_year: getYearFromUltimateElectionDate(modifiedCandidate.candidate_ultimate_election_date),
      };
      if (!oneCandidate.twitter_description) {
        modifiedCandidate = {
          ...modifiedCandidate,
          twitter_description: '',
        };
      }
      if (!oneCandidate.twitter_handle) {
        modifiedCandidate = {
          ...modifiedCandidate,
          twitter_handle: '',
        };
      }
      if (!oneCandidate.contest_office_name) {
        modifiedCandidate = {
          ...modifiedCandidate,
          contest_office_name: '',
        };
      }
      // Remove duplicate candidates in the same year (based on politician_we_vote_id or twitter_handle)
      candidateAlreadyFoundThisYear = false;
      if (modifiedCandidate.candidate_ultimate_election_year) {
        if (!(modifiedCandidate.candidate_ultimate_election_year in candidateDisplayedThisYear)) {
          candidateDisplayedThisYear[modifiedCandidate.candidate_ultimate_election_year] = {};
        }
        if (modifiedCandidate.politician_we_vote_id) {
          if (modifiedCandidate.politician_we_vote_id in candidateDisplayedThisYear[modifiedCandidate.candidate_ultimate_election_year]) {
            candidateAlreadyFoundThisYear = true;
          } else {
            candidateDisplayedThisYear[modifiedCandidate.candidate_ultimate_election_year][modifiedCandidate.politician_we_vote_id] = true;
          }
        }
        if (modifiedCandidate.twitter_handle) {
          if (modifiedCandidate.twitter_handle in candidateDisplayedThisYear[modifiedCandidate.candidate_ultimate_election_year]) {
            candidateAlreadyFoundThisYear = true;
          } else {
            candidateDisplayedThisYear[modifiedCandidate.candidate_ultimate_election_year][modifiedCandidate.twitter_handle] = true;
          }
        }
      }
      if (!candidateAlreadyFoundThisYear) {
        filteredCandidateListModified.push(modifiedCandidate);
      }
    });
    filteredCandidateList = filteredCandidateListModified;
    // //////////////////////
    // Now filter candidates
    if (listModeFilters && listModeFilters.length > 0) {
      const todayAsInteger = getTodayAsInteger();
      listModeFilters.forEach((oneFilter) => {
        // console.log('oneFilter:', oneFilter);
        if ((oneFilter.filterType === 'showUpcomingEndorsements') && (oneFilter.filterSelected === true)) {
          filteredCandidateList = filteredCandidateList.filter((oneCandidate) => oneCandidate.candidate_ultimate_election_date >= todayAsInteger);
        }
        if ((oneFilter.filterType === 'showYear') && (oneFilter.filterSelected === true)) {
          filteredCandidateList = filteredCandidateList.filter((oneCandidate) => getYearFromUltimateElectionDate(oneCandidate.candidate_ultimate_election_date) === oneFilter.filterYear);
        }
      });
    }
    if (stateCode && stateCode.toLowerCase() !== 'all') {
      filteredCandidateList = filteredCandidateList.filter((oneCandidate) => oneCandidate.state_code.toLowerCase() === stateCode.toLowerCase());
    }
    // //////////
    // Now sort
    filteredCandidateList = filteredCandidateList.sort(this.orderByAlphabetical);
    filteredCandidateList = filteredCandidateList.sort(this.orderByTwitterFollowers);
    filteredCandidateList = filteredCandidateList.sort(this.orderCandidatesByUltimateDate);
    let candidateSearchResults = [];
    if (searchText && searchText.length > 0) {
      const searchTextLowercase = searchText.toLowerCase();
      // console.log('searchTextLowercase:', searchTextLowercase);
      const searchWordArray = searchTextLowercase.match(/\b(\w+)\b/g);
      // console.log('searchWordArray:', searchWordArray);
      let foundInThisCandidate;
      let isFirstWord;
      let thisWordFound;
      candidateSearchResults = filter(filteredCandidateList,
        (oneCandidate) => {
          foundInThisCandidate = false;
          isFirstWord = true;
          searchWordArray.forEach((oneSearchWordLowerCase) => {
            thisWordFound = (
              oneCandidate.ballot_item_display_name.toLowerCase().includes(oneSearchWordLowerCase) ||
              oneCandidate.state_code.toLowerCase().includes(oneSearchWordLowerCase) ||
              oneCandidate.candidate_state_name.toLowerCase().includes(oneSearchWordLowerCase) ||
              oneCandidate.contest_office_name.toLowerCase().includes(oneSearchWordLowerCase) ||
              oneCandidate.twitter_description.toLowerCase().includes(oneSearchWordLowerCase) ||
              oneCandidate.twitter_handle.toLowerCase().includes(oneSearchWordLowerCase)
            );
            if (isFirstWord) {
              foundInThisCandidate = thisWordFound;
              isFirstWord = false;
            } else {
              foundInThisCandidate = foundInThisCandidate && thisWordFound;
            }
          });
          return foundInThisCandidate;
        });
    }
    // console.log('onFilterOrListChange, candidateSearchResults:', candidateSearchResults);
    // console.log('onFilterOrListChange, filteredCandidateList:', filteredCandidateList);
    this.setState({
      candidateSearchResults,
      filteredCandidateList,
      timeStampOfChange: Date.now(),
    });
  }

  render () {
    renderLog('CandidateListRoot');  // Set LOG_RENDER_EVENTS to log all renders
    const { hideTitle, searchText, titleTextIfCampaigns } = this.props;
    const isSearching = searchText && searchText.length > 0;
    const { candidateList, candidateSearchResults, filteredCandidateList, timeStampOfChange } = this.state;

    if (!candidateList) {
      return null;
    }
    return (
      <CandidateListWrapper>
        {!!(!hideTitle &&
            titleTextIfCampaigns &&
            titleTextIfCampaigns.length &&
            candidateList) &&
        (
          <WhatIsHappeningTitle>
            {titleTextIfCampaigns}
          </WhatIsHappeningTitle>
        )}
        <ScrollingOuterWrapper>
          <ScrollingInnerWrapper>
            <HorizontallyScrollingContainer>
              <CandidateCardList
                incomingCandidateList={(isSearching ? candidateSearchResults : filteredCandidateList)}
                timeStampOfChange={timeStampOfChange}
                verticalListOn
              />
            </HorizontallyScrollingContainer>
          </ScrollingInnerWrapper>
        </ScrollingOuterWrapper>
      </CandidateListWrapper>
    );
  }
}
CandidateListRoot.propTypes = {
  hideTitle: PropTypes.bool,
  incomingList: PropTypes.array,
  incomingListTimeStampOfChange: PropTypes.number,
  listModeFilters: PropTypes.array,
  listModeFiltersTimeStampOfChange: PropTypes.number,
  searchText: PropTypes.string,
  stateCode: PropTypes.string,
  titleTextIfCampaigns: PropTypes.string,
};

const styles = () => ({
  iconButton: {
    padding: 8,
  },
});

const CandidateListWrapper = styled('div')`
`;

const WhatIsHappeningTitle = styled('h2')`
  font-size: 22px;
  text-align: left;
`;

export default withStyles(styles)(CandidateListRoot);
