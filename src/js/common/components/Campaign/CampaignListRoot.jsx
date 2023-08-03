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
import arrayContains from '../../utils/arrayContains';
import { handleHorizontalScroll, leftAndRightArrowStateCalculation } from '../../utils/leftRightArrowCalculation';
import { getTodayAsInteger, getYearFromUltimateElectionDate } from '../../utils/dateFormat';
import extractAttributeValueListFromObjectList from '../../utils/extractAttributeValueListFromObjectList';
import { renderLog } from '../../utils/logging';
import CampaignStore from '../../stores/CampaignStore';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import isMobileScreenSize from '../../utils/isMobileScreenSize';

const CampaignCardList = React.lazy(() => import(/* webpackChunkName: 'CampaignCardList' */ './CampaignCardList'));
const HORIZONTAL_SCROLL_DISTANCE_ON_LEFT_ARROW_CLICK = -630;
const HORIZONTAL_SCROLL_DISTANCE_ON_RIGHT_ARROW_CLICK = 630;
const HORIZONTAL_SCROLL_DISTANCE_MOBILE_LEFT_ARROW_CLICK = -315;
const HORIZONTAL_SCROLL_DISTANCE_MOBILE_RIGHT_ARROW_CLICK = 315;
const HORIZONTAL_SCROLL_DISTANCE_ON_SHOW_MORE = 315;
const RIGHT_MARGIN_SIZE = 24;

class CampaignListRoot extends Component {
  constructor (props) {
    super(props);
    this.scrollElement = createRef();
    this.state = {
      campaignList: [],
      campaignSearchResults: [],
      filteredList: [],
      timeStampOfChange: 0,
      hideLeftArrow: true,
      hideRightArrow: false,
    };
  }

  componentDidMount () {
    // console.log('CampaignListRoot componentDidMount');
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
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
    this.campaignSupporterStoreListener.remove();
    this.campaignStoreListener.remove();
  }

  onCampaignSupporterStoreChange () {
    // We need to instantiate CampaignSupporterStore before we call campaignListRetrieve so that store gets filled with data
  }

  onCampaignStoreChange () {
    this.onIncomingListChange();
  }

  onIncomingListChange () {
    const { incomingList } = this.props;
    if (incomingList) {
      this.setState({
        campaignList: incomingList,
      }, () => this.onFilterOrListChange());
    }
  }

  orderByAlphabetical = (firstEntry, secondEntry) => {
    let firstEntryValue;
    let secondEntryValue = 'x';
    if (firstEntry && firstEntry.campaign_title) {
      firstEntryValue = firstEntry.campaign_title;
    }
    if (secondEntry && secondEntry.campaign_title) {
      secondEntryValue = secondEntry.campaign_title;
    }
    if (firstEntryValue < secondEntryValue) { return -1; }
    if (firstEntryValue > secondEntryValue) { return 1; }
    return 0;
  };

  // Order by 1, 2, 3. Push 0's to the bottom in the same order.
  orderByOrderInList = (firstEntry, secondEntry) => (firstEntry.order_in_list || Number.MAX_VALUE) - (secondEntry.order_in_list || Number.MAX_VALUE);

  orderBySupportersCount = (firstEntry, secondEntry) => secondEntry.supporters_count - firstEntry.supporters_count;

  orderCandidatesByUltimateDate = (firstEntry, secondEntry) => secondEntry.candidate_ultimate_election_date - firstEntry.candidate_ultimate_election_date;

  onFilterOrListChange = () => {
    // console.log('onFilterOrListChange');
    // Start over with full list, and apply all active filters
    const { hideCampaignsLinkedToPoliticians, listModeFilters, searchText, stateCode } = this.props;
    const { campaignList } = this.state;
    let filteredList = campaignList;
    // console.log('filteredList:', filteredList);
    // //////////////////////////////////////////
    // Make sure we have all required variables
    const filteredListModified = [];
    let modifiedEntry;
    filteredList.forEach((oneEntry) => {
      modifiedEntry = { ...oneEntry };
      // modifiedEntry = {
      //   ...modifiedEntry,
      //   campaign_state_name: convertStateCodeToStateText(oneEntry.state_code),
      //   state_code: oneEntry.state_code || '',
      // };
      if (!oneEntry.campaign_description) {
        modifiedEntry = {
          ...modifiedEntry,
          campaign_description: '',
        };
      }
      if (!oneEntry.campaign_title) {
        modifiedEntry = {
          ...modifiedEntry,
          campaign_title: '',
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
    if (listModeFilters && listModeFilters.length > 0) {
      const todayAsInteger = getTodayAsInteger();
      listModeFilters.forEach((oneFilter) => {
        // console.log('oneFilter:', oneFilter);
        if ((oneFilter.filterType === 'showUpcomingEndorsements') && (oneFilter.filterSelected === true)) {
          filteredList = filteredList.filter((oneEntry) => oneEntry.final_election_date_as_integer >= todayAsInteger);
        }
        if ((oneFilter.filterType === 'showYear') && (oneFilter.filterSelected === true)) {
          filteredList = filteredList.filter((oneEntry) => getYearFromUltimateElectionDate(oneEntry.final_election_date_as_integer) === oneFilter.filterYear);
        }
      });
    }
    if (stateCode && stateCode.toLowerCase() !== 'all') {
      filteredList = filteredList.filter((oneEntry) => {
        const politicianStateCodeList = extractAttributeValueListFromObjectList('state_code', oneEntry.campaignx_politician_list, true);
        return arrayContains(stateCode.toLowerCase(), politicianStateCodeList);
      });
    }
    // //////////
    // Now sort
    // We need to add support for ballot_item_twitter_followers_count
    // filteredList = filteredList.sort(this.orderPositionsByBallotItemTwitterFollowers);
    filteredList = filteredList.sort(this.orderByAlphabetical);
    filteredList = filteredList.sort(this.orderBySupportersCount);
    filteredList = filteredList.sort(this.orderByOrderInList);
    let campaignSearchResults = [];
    if (searchText && searchText.length > 0) {
      const searchTextLowercase = searchText.toLowerCase();
      // console.log('searchTextLowercase:', searchTextLowercase);
      const searchWordArray = searchTextLowercase.match(/\b(\w+)\b/g);
      // console.log('searchWordArray:', searchWordArray);
      let foundInThisEntry;
      let foundInThisCampaignsPoliticians;
      let isFirstWord;
      let politicianStateName;
      let thisWordFound;
      campaignSearchResults = filter(filteredList,
        (oneEntry) => {
          foundInThisEntry = false;
          isFirstWord = true;
          searchWordArray.forEach((oneSearchWordLowerCase) => {
            thisWordFound = (
              // We should add these fields on API server:
              // oneEntry.state_code.toLowerCase().includes(oneSearchWordLowerCase) ||
              // oneEntry.campaign_state_name.toLowerCase().includes(oneSearchWordLowerCase) ||
              oneEntry.campaign_description.toLowerCase().includes(oneSearchWordLowerCase) ||
              oneEntry.campaign_title.toLowerCase().includes(oneSearchWordLowerCase)
            );
            if (!thisWordFound) {
              foundInThisCampaignsPoliticians = false;
              // Go on to search in the campaignx_politician_list
              if (oneEntry.campaignx_politician_list && oneEntry.campaignx_politician_list.length > 0) {
                oneEntry.campaignx_politician_list.forEach((onePolitician) => {
                  politicianStateName = convertStateCodeToStateText(onePolitician.state_code);
                  foundInThisCampaignsPoliticians = (
                    foundInThisCampaignsPoliticians ||
                    // We should add this field on API server:
                    // onePolitician.contest_office_name.toLowerCase().includes(oneSearchWordLowerCase) ||
                    onePolitician.politician_name.toLowerCase().includes(oneSearchWordLowerCase) ||
                    politicianStateName.toLowerCase().includes(oneSearchWordLowerCase) ||
                    onePolitician.state_code.toLowerCase().includes(oneSearchWordLowerCase)
                  );
                });
              }
              thisWordFound = foundInThisCampaignsPoliticians;
            }
            if (isFirstWord) {
              foundInThisEntry = thisWordFound;
              isFirstWord = false;
            } else {
              foundInThisEntry = foundInThisEntry && thisWordFound;
            }
          });
          // console.log('oneEntry:', oneEntry);
          if (hideCampaignsLinkedToPoliticians && oneEntry.linked_politician_we_vote_id) {
            return false;
          } else {
            return foundInThisEntry;
          }
        });
    }
    // console.log('onFilterOrListChange, campaignSearchResults:', campaignSearchResults);
    // console.log('onFilterOrListChange, filteredList:', filteredList);
    if (campaignSearchResults.length > 0) {
      if ((isMobileScreenSize() && campaignSearchResults.length < 2) || (!isMobileScreenSize() && campaignSearchResults.length < 3)) {
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
      campaignSearchResults,
      filteredList,
      timeStampOfChange: Date.now(),
    });
  }

  checkScrollPositionLocal = (el) => {
    // set state here
    const leftRightStateDict = leftAndRightArrowStateCalculation(el);
    this.setState({
      hideLeftArrow: leftRightStateDict[0],
      hideRightArrow: leftRightStateDict[1],
    });
  }


  render () {
    renderLog('CampaignListRoot');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, hideIfNoResults, hideTitle, listModeFilters, searchText, titleTextForList } = this.props;
    const isSearching = searchText && searchText.length > 0;
    const { campaignList, campaignSearchResults, filteredList, timeStampOfChange } = this.state;
    const filteredListLength = (filteredList) ? filteredList.length : 0;
    let hideDisplayBecauseNoResults = false;
    // console.log('hideIfNoResults:', hideIfNoResults, 'filteredList:', filteredList, 'filteredListLength:', filteredListLength);
    if (hideIfNoResults) {
      if (isSearching) {
        if (campaignSearchResults && campaignSearchResults.length === 0) {
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
      <CampaignListWrapper>
        <TitleAndMobileArrowsOuterWrapper>
          {!!(!hideTitle &&
              titleTextForList &&
              titleTextForList.length &&
              campaignList) &&
          (
            <WhatIsHappeningTitle>
              {titleTextForList}
            </WhatIsHappeningTitle>
          )}
          <MobileArrowsInnerWrapper className="u-show-mobile">
            <LeftArrowInnerWrapper id="campaignLeftArrowMobile" disableMobileLeftArrow={this.state.hideLeftArrow} onClick={() => { handleHorizontalScroll(this.scrollElement.current, HORIZONTAL_SCROLL_DISTANCE_MOBILE_LEFT_ARROW_CLICK, this.checkScrollPositionLocal, RIGHT_MARGIN_SIZE); }}>
              <ArrowBackIos classes={{ root: classes.arrowRoot }} />
            </LeftArrowInnerWrapper>
            <RightArrowInnerWrapper id="campaignRightArrowMobile" disableMobileRightArrow={this.state.hideRightArrow} onClick={() => { handleHorizontalScroll(this.scrollElement.current, HORIZONTAL_SCROLL_DISTANCE_MOBILE_RIGHT_ARROW_CLICK, this.checkScrollPositionLocal, RIGHT_MARGIN_SIZE); }}>
              <ArrowForwardIos classes={{ root: classes.arrowRoot }} />
            </RightArrowInnerWrapper>
          </MobileArrowsInnerWrapper>
        </TitleAndMobileArrowsOuterWrapper>
        <CampaignsScrollingOuterWrapper>
          <LeftArrowOuterWrapper className="u-show-desktop-tablet">
            <LeftArrowInnerWrapper id="campaignLeftArrowDesktop" onClick={() => { handleHorizontalScroll(this.scrollElement.current, HORIZONTAL_SCROLL_DISTANCE_ON_LEFT_ARROW_CLICK, this.checkScrollPositionLocal, RIGHT_MARGIN_SIZE); }}>
              { this.state.hideLeftArrow ? null : <ArrowBackIos classes={{ root: classes.arrowRoot }} /> }
            </LeftArrowInnerWrapper>
          </LeftArrowOuterWrapper>
          <CampaignsScrollingInnerWrapper>
            <CampaignsHorizontallyScrollingContainer ref={this.scrollElement}
               onScroll={() => { this.checkScrollPositionLocal(this.scrollElement.current); }}
               showLeftGradient={!this.state.hideLeftArrow}
               showRightGradient={!this.state.hideRightArrow}
            >
              <CampaignCardList
                incomingCampaignList={(isSearching ? campaignSearchResults : filteredList)}
                listModeFilters={listModeFilters}
                listModeFiltersTimeStampOfChange={timeStampOfChange}
                searchText={searchText}
                timeStampOfChange={timeStampOfChange}
                verticalListOn
                loadMoreScroll={() => { handleHorizontalScroll(this.scrollElement.current, HORIZONTAL_SCROLL_DISTANCE_ON_SHOW_MORE, this.checkScrollPositionLocal, RIGHT_MARGIN_SIZE); }}
              />
            </CampaignsHorizontallyScrollingContainer>
          </CampaignsScrollingInnerWrapper>
          <RightArrowOuterWrapper className="u-show-desktop-tablet">
            <RightArrowInnerWrapper id="campaignRightArrowDesktop" onClick={() => { handleHorizontalScroll(this.scrollElement.current, HORIZONTAL_SCROLL_DISTANCE_ON_RIGHT_ARROW_CLICK, this.checkScrollPositionLocal, RIGHT_MARGIN_SIZE); }}>
              { this.state.hideRightArrow ? null : <ArrowForwardIos classes={{ root: classes.arrowRoot }} /> }
            </RightArrowInnerWrapper>
          </RightArrowOuterWrapper>
        </CampaignsScrollingOuterWrapper>
      </CampaignListWrapper>
    );
  }
}
CampaignListRoot.propTypes = {
  classes: PropTypes.object,
  hideCampaignsLinkedToPoliticians: PropTypes.bool,
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

const CampaignListWrapper = styled('div')`
  margin-bottom: 25px;
`;

const WhatIsHappeningTitle = styled('h2')`
  font-size: 22px;
  text-align: left;
`;

export default withStyles(styles)(CampaignListRoot);
