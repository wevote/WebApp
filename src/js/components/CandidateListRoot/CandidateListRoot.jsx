import withStyles from '@mui/styles/withStyles';
import { filter } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import { convertStateCodeToStateText } from '../../common/utils/addressFunctions';
import { getTodayAsInteger, getYearFromUltimateElectionDate } from '../../common/utils/dateFormat';
import { renderLog } from '../../common/utils/logging';
import CandidateStore from '../../stores/CandidateStore';

const CandidateCardList = React.lazy(() => import(/* webpackChunkName: 'CandidateCardList' */ './CandidateCardList'));
const FirstCandidateListController = React.lazy(() => import(/* webpackChunkName: 'FirstCandidateListController' */ './FirstCandidateListController'));

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
    let changeNeeded = false;
    if (this.props.listModeFiltersTimeStampOfChange !== prevProps.listModeFiltersTimeStampOfChange) {
      changeNeeded = true;
    }
    if (this.props.searchText !== prevProps.searchText) {
      changeNeeded = true;
    }
    if (changeNeeded) {
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
    const candidateList = CandidateStore.getCandidateList();
    const filteredCandidateList = [];
    candidateList.forEach((oneCandidate) => {
      if (oneCandidate.id && oneCandidate.id > 0) {
        filteredCandidateList.push(oneCandidate);
      }
    });
    // console.log('candidateList:', candidateList);
    this.setState({
      candidateList: filteredCandidateList,
    }, () => this.onFilterOrListChange());
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

  onFilterOrListChange = () => {
    // console.log('onFilterOrListChange');
    // Start over with full candidateList, and apply all active filters
    const { listModeFilters, searchText } = this.props;
    const { candidateList } = this.state;
    // console.log('candidateList:', candidateList);
    let filteredCandidateList = candidateList;
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
    const filteredCandidateListModified = [];
    let modifiedCandidate;
    filteredCandidateList.forEach((oneCandidate) => {
      modifiedCandidate = { ...oneCandidate };
      modifiedCandidate = {
        ...modifiedCandidate,
        candidate_state_name: convertStateCodeToStateText(oneCandidate.state_code),
        state_code: oneCandidate.state_code || '',
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
      filteredCandidateListModified.push(modifiedCandidate);
    });
    filteredCandidateList = filteredCandidateListModified;
    // We need to add support for ballot_item_twitter_followers_count
    // filteredCandidateList = filteredCandidateList.sort(this.orderPositionsByBallotItemTwitterFollowers);
    filteredCandidateList = filteredCandidateList.sort(this.orderByAlphabetical);
    filteredCandidateList = filteredCandidateList.sort(this.orderByTwitterFollowers);
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
        <CandidateCardList
          incomingCandidateList={(isSearching ? candidateSearchResults : filteredCandidateList)}
          timeStampOfChange={timeStampOfChange}
          verticalListOn
        />

        <Suspense fallback={<span>&nbsp;</span>}>
          <FirstCandidateListController />
        </Suspense>
      </CandidateListWrapper>
    );
  }
}
CandidateListRoot.propTypes = {
  hideTitle: PropTypes.bool,
  listModeFilters: PropTypes.array,
  listModeFiltersTimeStampOfChange: PropTypes.number,
  searchText: PropTypes.string,
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
