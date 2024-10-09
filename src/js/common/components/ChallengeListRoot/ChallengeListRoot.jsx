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
} from '../Style/ScrollingStyles';
import { convertStateCodeToStateText } from '../../utils/addressFunctions';
import { handleHorizontalScroll, leftAndRightArrowStateCalculation, checkDivPositionForLoadMore } from '../../utils/leftRightArrowCalculation';
import { renderLog } from '../../utils/logging';
import ChallengeStore from '../../stores/ChallengeStore';
import ChallengeParticipantStore from '../../stores/ChallengeParticipantStore';
import isMobileScreenSize from '../../utils/isMobileScreenSize';

const ChallengeCardList = React.lazy(() => import(/* webpackChunkName: 'ChallengeCardList' */ './ChallengeCardList'));
const HORIZONTAL_SCROLL_DISTANCE_ON_LEFT_ARROW_CLICK = -630;
const HORIZONTAL_SCROLL_DISTANCE_ON_RIGHT_ARROW_CLICK = 630;
const HORIZONTAL_SCROLL_DISTANCE_MOBILE_LEFT_ARROW_CLICK = -315;
const HORIZONTAL_SCROLL_DISTANCE_MOBILE_RIGHT_ARROW_CLICK = 315;
const HORIZONTAL_SCROLL_DISTANCE_ON_SHOW_MORE = 315;
const RIGHT_MARGIN_SIZE = 24;

class ChallengeListRoot extends Component {
  constructor (props) {
    super(props);
    this.scrollElement = createRef();
    this.state = {
      challengeList: [],
      challengeSearchResults: [],
      filteredList: [],
      timeStampOfChange: 0,
      hideLeftArrow: true,
      hideRightArrow: false,
      callShowMoreCards: false,
    };
  }

  componentDidMount () {
    // console.log('ChallengeListRoot componentDidMount');
    this.challengeParticipantStoreListener = ChallengeParticipantStore.addListener(this.onChallengeParticipantStoreChange.bind(this));
    this.challengeStoreListener = ChallengeStore.addListener(this.onChallengeStoreChange.bind(this));
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
    this.challengeParticipantStoreListener.remove();
    this.challengeStoreListener.remove();
  }

  onChallengeParticipantStoreChange () {
    // We need to instantiate ChallengeParticipantStore before we call challengeListRetrieve so that store gets filled with data
  }

  onChallengeStoreChange () {
    this.onIncomingListChange();
  }

  onIncomingListChange () {
    const { incomingList } = this.props;
    if (incomingList) {
      this.setState({
        challengeList: incomingList,
      }, () => this.onFilterOrListChange());
    }
  }

  orderByAlphabetical = (firstEntry, secondEntry) => {
    let firstEntryValue;
    let secondEntryValue = 'x';
    if (firstEntry && firstEntry.challenge_title) {
      firstEntryValue = firstEntry.challenge_title;
    }
    if (secondEntry && secondEntry.challenge_title) {
      secondEntryValue = secondEntry.challenge_title;
    }
    if (firstEntryValue < secondEntryValue) { return -1; }
    if (firstEntryValue > secondEntryValue) { return 1; }
    return 0;
  };

  // Order by 1, 2, 3. Push 0's to the bottom in the same order.
  orderByOrderInList = (firstEntry, secondEntry) => (firstEntry.order_in_list || Number.MAX_VALUE) - (secondEntry.order_in_list || Number.MAX_VALUE);

  orderByInviteesCount = (firstEntry, secondEntry) => secondEntry.invitees_count - firstEntry.invitees_count;

  orderByInviteesPlusParticipantsCount = (firstEntry, secondEntry) => (secondEntry.invitees_count + secondEntry.participants_count) - (firstEntry.invitees_count + firstEntry.participants_count);

  orderByParticipantsCount = (firstEntry, secondEntry) => secondEntry.participants_count - firstEntry.participants_count;

  orderCandidatesByUltimateDate = (firstEntry, secondEntry) => secondEntry.candidate_ultimate_election_date - firstEntry.candidate_ultimate_election_date;

  onFilterOrListChange = () => {
    // console.log('onFilterOrListChange');
    // Start over with full list, and apply all active filters
    const { hideChallengesLinkedToPoliticians, searchText } = this.props;
    const { challengeList } = this.state;
    let filteredList = challengeList;
    // console.log('filteredList:', filteredList);
    // //////////////////////////////////////////
    // Make sure we have all required variables
    const filteredListModified = [];
    let modifiedEntry;
    filteredList.forEach((oneEntry) => {
      modifiedEntry = { ...oneEntry };
      // modifiedEntry = {
      //   ...modifiedEntry,
      //   challenge_state_name: convertStateCodeToStateText(oneEntry.state_code),
      //   state_code: oneEntry.state_code || '',
      // };
      if (!oneEntry.challenge_description) {
        modifiedEntry = {
          ...modifiedEntry,
          challenge_description: '',
        };
      }
      if (!oneEntry.challenge_title) {
        modifiedEntry = {
          ...modifiedEntry,
          challenge_title: '',
        };
      }
      if (!oneEntry.contest_office_name) {
        modifiedEntry = {
          ...modifiedEntry,
          contest_office_name: '',
        };
      }
      filteredListModified.push(modifiedEntry);
    });
    filteredList = filteredListModified;
    // //////////////////////
    // Now filter

    // //////////
    // Now sort, with the most important sort at the bottom of this list
    filteredList = filteredList.sort(this.orderByAlphabetical);
    filteredList = filteredList.sort(this.orderByParticipantsCount);
    // filteredList = filteredList.sort(this.orderByInviteesCount);
    filteredList = filteredList.sort(this.orderByInviteesPlusParticipantsCount);
    filteredList = filteredList.sort(this.orderByOrderInList);
    let challengeSearchResults = [];
    if (searchText && searchText.length > 0) {
      const searchTextLowercase = searchText.toLowerCase();
      // console.log('searchTextLowercase:', searchTextLowercase);
      const searchWordArray = searchTextLowercase.match(/\b(\w+)\b/g);
      // console.log('searchWordArray:', searchWordArray);
      let foundInThisEntry;
      let foundInThisChallengesPoliticians;
      let isFirstWord;
      let politicianStateName;
      let thisWordFound;
      challengeSearchResults = filter(filteredList,
        (oneEntry) => {
          foundInThisEntry = false;
          isFirstWord = true;
          searchWordArray.forEach((oneSearchWordLowerCase) => {
            thisWordFound = (
              // We should add these fields on API server:
              // oneEntry.state_code.toLowerCase().includes(oneSearchWordLowerCase) ||
              // oneEntry.challenge_state_name.toLowerCase().includes(oneSearchWordLowerCase) ||
              oneEntry.challenge_description.toLowerCase().includes(oneSearchWordLowerCase) ||
              oneEntry.challenge_title.toLowerCase().includes(oneSearchWordLowerCase)
            );
            if (!thisWordFound) {
              foundInThisChallengesPoliticians = false;
              // Go on to search in the challenge_politician_list
              if (oneEntry.challenge_politician_list && oneEntry.challenge_politician_list.length > 0) {
                oneEntry.challenge_politician_list.forEach((onePolitician) => {
                  politicianStateName = convertStateCodeToStateText(onePolitician.state_code);
                  foundInThisChallengesPoliticians = (
                    foundInThisChallengesPoliticians ||
                    // We should add this field on API server:
                    // onePolitician.contest_office_name.toLowerCase().includes(oneSearchWordLowerCase) ||
                    onePolitician.politician_name.toLowerCase().includes(oneSearchWordLowerCase) ||
                    politicianStateName.toLowerCase().includes(oneSearchWordLowerCase) ||
                    onePolitician.state_code.toLowerCase().includes(oneSearchWordLowerCase)
                  );
                });
              }
              thisWordFound = foundInThisChallengesPoliticians;
            }
            if (isFirstWord) {
              foundInThisEntry = thisWordFound;
              isFirstWord = false;
            } else {
              foundInThisEntry = foundInThisEntry && thisWordFound;
            }
          });
          // console.log('oneEntry:', oneEntry);
          if (hideChallengesLinkedToPoliticians && oneEntry.linked_politician_we_vote_id) {
            return false;
          } else {
            return foundInThisEntry;
          }
        });
    }
    // console.log('onFilterOrListChange, challengeSearchResults:', challengeSearchResults);
    // console.log('onFilterOrListChange, filteredList:', filteredList);
    if (challengeSearchResults.length > 0) {
      if ((isMobileScreenSize() && challengeSearchResults.length < 2) || (!isMobileScreenSize() && challengeSearchResults.length < 3)) {
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
      challengeSearchResults,
      filteredList,
      timeStampOfChange: Date.now(),
    }, () => { this.handleNumberOfResults(filteredList.length, challengeSearchResults.length); });
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

  leftAndRightArrowSetState = (el) => {
    // set state here
    const leftRightStateDict = leftAndRightArrowStateCalculation(el);
    this.setState({
      hideLeftArrow: leftRightStateDict[0],
      hideRightArrow: leftRightStateDict[1],
    });
  }

  shouldLoadMoreSetState = (el) => {
    const element = el;
    this.setState({
      callShowMoreCards: checkDivPositionForLoadMore(element),
    });
  }

  render () {
    renderLog('ChallengeListRoot');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, hideIfNoResults, hideTitle, listModeFilters, searchText, titleTextForList } = this.props;
    const isSearching = searchText && searchText.length > 0;
    const { challengeList, challengeSearchResults, filteredList, timeStampOfChange } = this.state;
    const filteredListLength = (filteredList) ? filteredList.length : 0;
    let hideDisplayBecauseNoResults = false;
    // console.log('hideIfNoResults:', hideIfNoResults, 'filteredList:', filteredList, 'filteredListLength:', filteredListLength);
    if (hideIfNoResults) {
      if (isSearching) {
        if (challengeSearchResults && challengeSearchResults.length === 0) {
          hideDisplayBecauseNoResults = true;
        }
      } else if (filteredListLength === 0) {
        hideDisplayBecauseNoResults = true;
      }
      if (hideDisplayBecauseNoResults) {
        return null;
      }
    }
    return (
      <ChallengeListWrapper>
        <TitleAndMobileArrowsOuterWrapper>
          {!!(!hideTitle &&
              titleTextForList &&
              titleTextForList.length &&
              challengeList) &&
          (
            <WhatIsHappeningTitle>
              {titleTextForList}
            </WhatIsHappeningTitle>
          )}
          <MobileArrowsInnerWrapper className="u-show-mobile">
            <LeftArrowInnerWrapper id="campaignLeftArrowMobile" disableMobileLeftArrow={this.state.hideLeftArrow} onClick={() => { handleHorizontalScroll(this.scrollElement.current, HORIZONTAL_SCROLL_DISTANCE_MOBILE_LEFT_ARROW_CLICK, this.leftAndRightArrowSetState, RIGHT_MARGIN_SIZE); }}>
              <ArrowBackIos classes={{ root: classes.arrowRoot }} />
            </LeftArrowInnerWrapper>
            <RightArrowInnerWrapper id="campaignRightArrowMobile" disableMobileRightArrow={this.state.hideRightArrow} onClick={() => { handleHorizontalScroll(this.scrollElement.current, HORIZONTAL_SCROLL_DISTANCE_MOBILE_RIGHT_ARROW_CLICK, this.leftAndRightArrowSetState, RIGHT_MARGIN_SIZE); this.shouldLoadMoreSetState(this.scrollElement.current); }}>
              <ArrowForwardIos classes={{ root: classes.arrowRoot }} />
            </RightArrowInnerWrapper>
          </MobileArrowsInnerWrapper>
        </TitleAndMobileArrowsOuterWrapper>
        <CampaignsScrollingOuterWrapper>
          <LeftArrowOuterWrapper className="u-show-desktop-tablet">
            <LeftArrowInnerWrapper id="campaignLeftArrowDesktop" onClick={() => { handleHorizontalScroll(this.scrollElement.current, HORIZONTAL_SCROLL_DISTANCE_ON_LEFT_ARROW_CLICK, this.leftAndRightArrowSetState, RIGHT_MARGIN_SIZE); }}>
              { this.state.hideLeftArrow ? null : <ArrowBackIos classes={{ root: classes.arrowRoot }} /> }
            </LeftArrowInnerWrapper>
          </LeftArrowOuterWrapper>
          <CampaignsScrollingInnerWrapper>
            <CampaignsHorizontallyScrollingContainer ref={this.scrollElement}
               onScroll={() => { this.leftAndRightArrowSetState(this.scrollElement.current); }}
               showLeftGradient={!this.state.hideLeftArrow}
               showRightGradient={!this.state.hideRightArrow}
            >
              <ChallengeCardList
                incomingChallengeList={(isSearching ? challengeSearchResults : filteredList)}
                listModeFilters={listModeFilters}
                listModeFiltersTimeStampOfChange={timeStampOfChange}
                searchText={searchText}
                timeStampOfChange={timeStampOfChange}
                useVerticalCard
                loadMoreScroll={() => { handleHorizontalScroll(this.scrollElement.current, HORIZONTAL_SCROLL_DISTANCE_ON_SHOW_MORE, this.leftAndRightArrowSetState, RIGHT_MARGIN_SIZE); }}
                shouldLoadMore={this.state.callShowMoreCards}
              />
            </CampaignsHorizontallyScrollingContainer>
          </CampaignsScrollingInnerWrapper>
          <RightArrowOuterWrapper className="u-show-desktop-tablet">
            <RightArrowInnerWrapper id="campaignRightArrowDesktop" onClick={() => { handleHorizontalScroll(this.scrollElement.current, HORIZONTAL_SCROLL_DISTANCE_ON_RIGHT_ARROW_CLICK, this.leftAndRightArrowSetState, RIGHT_MARGIN_SIZE); this.shouldLoadMoreSetState(this.scrollElement.current); }}>
              { this.state.hideRightArrow ? null : <ArrowForwardIos classes={{ root: classes.arrowRoot }} /> }
            </RightArrowInnerWrapper>
          </RightArrowOuterWrapper>
        </CampaignsScrollingOuterWrapper>
      </ChallengeListWrapper>
    );
  }
}
ChallengeListRoot.propTypes = {
  classes: PropTypes.object,
  handleNumberOfResults: PropTypes.func,
  hideChallengesLinkedToPoliticians: PropTypes.bool,
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

const ChallengeListWrapper = styled('div')`
  margin-bottom: 25px;
`;

const WhatIsHappeningTitle = styled('h2')`
  font-size: 22px;
  text-align: left;
`;

export default withStyles(styles)(ChallengeListRoot);
