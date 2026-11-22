import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { CircularProgress } from '@mui/material';
import PoliticianStore from '../../common/stores/PoliticianStore';
import { ballotWrapperBodyStyles, ElectionNameH1 } from '../../components/Style/BallotTitleHeaderStyles';
// import searchIcon from '../../../img/global/svg-icons/search.svg';
import VoterStore from '../../stores/VoterStore';
import LoadingWheelComp from '../../common/components/Widgets/LoadingWheelComp';
import SnackNotifier from '../../common/components/Widgets/SnackNotifier';
import {
  BallotFilterContainer, BallotHeaderBottomWrapper,
  // BallotHeaderDivider,
  BallotHeaderGroup, BallotTitleHeaderContainer,
  DualHeaderContainer,
  getTopOffsetDueToHeadroomWrapper,
  HeaderContentContainer, HeaderContentOuterContainer, LoadingItemsWheel,
  PageContentContainer, SearchResultsFoundInExplanation,
} from '../../components/Style/pageLayoutStyles';
// import BallotTitleHeader from '../../components/Ballot/BallotTitleHeader';
import BallotStore from '../../stores/BallotStore';
import BallotFilterRow from '../../components/Ballot/BallotFilterRow';
import { chipLabelText, isIPad } from '../../common/utils/cordovaUtils';
// import BallotStatusMessage from '../../components/Ballot/BallotStatusMessage';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import { SearchTitle } from '../../common/components/Style/FilterStyles';
import BallotItemCompressed from '../../components/Ballot/BallotItemCompressed';
import BallotShowAllItemsFooter from '../../components/Navigation/BallotShowAllItemsFooter';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import { outerHeightOfDualHeaderContainer } from '../../utils/cordovaCalculatedOffsets';
// import getBooleanValue from '../../common/utils/getBooleanValue';
// import historyPush from '../../common/utils/historyPush';
// import apiCalming from '../../common/utils/apiCalming';
import BallotActions from '../../actions/BallotActions';

const TYPES = require('keymirror')({
  OFFICE: null,
  MEASURE: null,
});

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));
// const DisplayWhileRetrievingBallot = React.lazy(() => import(/* webpackChunkName: 'DisplayWhileRetrievingBallot' */ '../../components/Ballot/DisplayWhileRetrievingBallot'));
// const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));
const ShowMoreItems = React.lazy(() => import(/* webpackChunkName: 'ShowMoreItems' */ '../../components/Widgets/ShowMoreItems'));

function MyElectedOfficials ({ classes, location, match }) {
  const [ballotSearchResults, setBallotSearchResults] = useState([]);
  const [ballotWithAllItems, setBallotWithAllItems] = useState([]);
  const [ballotWithItemsFromCompletionFilterType, setBallotWithItemsFromCompletionFilterType] = useState([]);
  const ballotItemTimer = useRef(null); // Initialize a ref to store the timer ID
  const [doubleFilteredBallotItemsLength, setDoubleFilteredBallotItemsLength] = useState(0);
  const [dummyVariable, setDummyVariable] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const listModeFiltersAvailable = useMemo(() => ([]), []);
  const listModeFiltersTimeStampOfChange = 0;
  const [loadingMoreItems, setLoadingMoreItems] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [numberOfBallotItemsToDisplay, setNumberOfBallotItemsToDisplay] = useState(5);
  const [numberOfPoliticiansResults, setNumberOfPoliticiansResults] = useState(0);
  const [politicianListToShow, setPoliticianListToShow] = useState([]);
  const [politicianListTimeStampOfChange, setPoliticianListTimeStampOfChange] = useState(0);
  const [raceLevelFilterType, setRaceLevelFilterType] = useState(BallotStore.getRaceLevelFilterTypeSaved() || 'All');
  const [scrolledDown, setScrolledDown] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showFilterTabs, setShowFilterTabs] = useState(false);
  const [stateCode, setStateCode] = useState(VoterStore.getStateCode() || VoterStore.getStateCodeFromIPAddress());
  const [textForMapSearch, setTextForMapSearch] = useState(VoterStore.getTextForMapSearch());
  const [totalNumberOfBallotItems, setTotalNumberOfBallotItems] = useState(0);

  const onAppObservableStoreChange = useCallback(() => {
    // console.log('MyElectedOfficials onAppObservableStoreChange');
    // We update dummyVariable so we can force a re-render of the component,
    //  which is necessary to pick up an AppObservableStore update that changes
    //  getPaddingTop in PageContentContainer
    setScrolledDown(AppObservableStore.getScrolledDown());
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    setDummyVariable(formattedTime);
  }, []);

  // Convert to something like onRepresentativesChange
  const onBallotStoreChange = () => {
    // console.log('MyElectedOfficials onBallotStoreChange');
    const completionLevelFilterType = BallotStore.getCompletionLevelFilterTypeSaved() || '';
    const { ballot, ballotProperties } = BallotStore;
    // console.log('Ballot.jsx onBallotStorechange, ballotProperties: ', ballotProperties);
    // console.log('MyElectedOfficials.jsx onBallotStorechange, mounted: ', mounted);
    if (mounted) {
      if (ballotProperties && ballotProperties.ballot_found && ballot && ballot.length === 0) {
        // Ballot is found but ballot is empty. We want to stay put.
        console.log('onBallotStoreChange: ballotWithItemsFromCompletionFilterType is empty');
      } else {
        const ballotWithAllItemsTemp = BallotStore.getBallotByCompletionLevelFilterType('all') || [];
        let raceLevelFilterItems = [];
        // console.log('onBallotStoreChange completionLevelFilterType: ', completionLevelFilterType);
        let ballotWithItemsFromCompletionFilterTypeTemp = BallotStore.getBallotByCompletionLevelFilterType(completionLevelFilterType);
        if (ballotWithItemsFromCompletionFilterTypeTemp && ballotWithItemsFromCompletionFilterTypeTemp.length) {
          raceLevelFilterItems = ballotWithItemsFromCompletionFilterTypeTemp.filter((item) => item.race_office_level === raceLevelFilterType ||
            item.kind_of_ballot_item === raceLevelFilterType.toUpperCase());
          setDoubleFilteredBallotItemsLength(raceLevelFilterItems.length);
        } else {
          // If here, the 'completionLevelFilterType' has been made obsolete.
          // Unfortunately we can't reset it without creating a dispatch loop
          // BallotActions.completionLevelFilterTypeSave('all');
          ballotWithItemsFromCompletionFilterTypeTemp = ballotWithAllItems;
        }
        setBallotWithItemsFromCompletionFilterType(ballotWithItemsFromCompletionFilterTypeTemp);
        setBallotWithAllItems(ballotWithAllItemsTemp);

        // Calculate totalNumberOfBallotItems given filters set
        if (!isSearching) {
          let totalNumberOfBallotItemsTemp;
          if (raceLevelFilterItems && raceLevelFilterItems.length) {
            totalNumberOfBallotItemsTemp = raceLevelFilterItems.length;
          } else if (completionLevelFilterType !== '') {
            const list = BallotStore.getBallotByCompletionLevelFilterType(completionLevelFilterType);
            totalNumberOfBallotItemsTemp = list ? list.length : 0;
          } else {
            totalNumberOfBallotItemsTemp = BallotStore.ballotLength;
          }
          // console.log('totalNumberOfBallotItemsTemp:', totalNumberOfBallotItemsTemp);
          setTotalNumberOfBallotItems(totalNumberOfBallotItemsTemp);
        }
      }
    }
  };

  const onPoliticianStoreChange = () => {
    // console.log('MyElectedOfficials onPoliticianStoreChange');
    const politicianList = PoliticianStore.getPoliticianList();
    // setPoliticianListToShow(politicianList || []);
    // setPoliticianListTimeStampOfChange(Date.now());
  };

  const onVoterStoreChange = () => {
    // console.log('MyElectedOfficials onVoterStoreChange');
    setStateCode(VoterStore.getStateCode() || VoterStore.getStateCodeFromIPAddress());
    setTextForMapSearch(VoterStore.getTextForMapSearch());
  };

  useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(onAppObservableStoreChange);
    onAppObservableStoreChange();
    return () => {
      appStateSubscription.unsubscribe();
    };
  }, [onAppObservableStoreChange]);

  useEffect(() => {
    const ballotStoreListener = BallotStore.addListener(onBallotStoreChange);
    onBallotStoreChange();
    return () => {
      ballotStoreListener.remove();
    };
  }, []);

  useEffect(() => {
    const politicianStoreListener = PoliticianStore.addListener(onPoliticianStoreChange);
    onPoliticianStoreChange();
    return () => {
      politicianStoreListener.remove();
    };
  }, []);

  useEffect(() => {
    const voterStoreListener = VoterStore.addListener(onVoterStoreChange);
    onVoterStoreChange();
    return () => {
      voterStoreListener.remove();
    };
  }, []);

  useEffect(() => {
    console.log('searchText.length:', searchText.length);
    if (searchText.length <= 1) {
      setPoliticianListToShow([]);
      setPoliticianListTimeStampOfChange(Date.now());
      setNumberOfPoliticiansResults(0);
    }
  }, [searchText]);

  const increaseNumberOfBallotItemsToDisplay = () => {
    console.log('increaseNumberOfBallotItemsToDisplay');
    clearTimeout(ballotItemTimer.current);
    ballotItemTimer.current = setTimeout(() => {
      setNumberOfBallotItemsToDisplay((prev) => prev + 5);
    }, 500);
  };

  const onScroll = () => {
    const showMoreItemsElement =  document.querySelector('#showMoreItemsId');
    // console.log('showMoreItemsElement: ', showMoreItemsElement);
    // console.log('Loading more: ', this.state.loadingMoreItems);
    if (showMoreItemsElement) {
      if (numberOfBallotItemsToDisplay < totalNumberOfBallotItems) {
        if (showMoreItemsElement.getBoundingClientRect().bottom <= window.innerHeight) {
          setLoadingMoreItems(true);
          increaseNumberOfBallotItemsToDisplay();
        }
      } else {
        setLoadingMoreItems(false);
      }
    }
  };

  const handleToggleSearchBallot = () => {
    setIsSearching(!isSearching);
    if (!isSearching) {
      // If here, we are now searching
      setTotalNumberOfBallotItems(0);
    } else {
      // // If here, we are canceling a search
      const completionLevelFilterType = BallotStore.getCompletionLevelFilterTypeSaved() || 'all';
      const ballotWithItemsFromCompletionFilterTypeTemp = BallotStore.getBallotByCompletionLevelFilterType(completionLevelFilterType);
      if (ballotWithItemsFromCompletionFilterTypeTemp !== undefined) {
        // console.log('ballotWithItemsFromCompletionFilterTypeTemp !== undefined');
        if (completionLevelFilterType === 'all') {
          setBallotWithAllItems(ballotWithItemsFromCompletionFilterTypeTemp);
          setBallotWithItemsFromCompletionFilterType(ballotWithItemsFromCompletionFilterTypeTemp);
        } else {
          const ballotWithAllItemsTemp = BallotStore.getBallotByCompletionLevelFilterType('all');
          setBallotWithAllItems(ballotWithAllItemsTemp);
          setBallotWithItemsFromCompletionFilterType(ballotWithItemsFromCompletionFilterTypeTemp);
        }
      }
    }
  };

  const onFilterBaseSearch = (searchTextIncoming, filteredItems) => {
    window.scrollTo(0, 0);
    setBallotSearchResults(filteredItems);
    setSearchText(searchTextIncoming);
    setTotalNumberOfBallotItems(filteredItems.length || 0);
  };

  const setRaceLevelFilterTypePlus = (raceLevelFilterTypeIncoming, doubleFilteredBallotItemsLengthIncoming) => {
    window.scrollTo(0, 0);
    BallotActions.raceLevelFilterTypeSave(raceLevelFilterTypeIncoming);
    // Calculate totalNumberOfBallotItems given filters set
    let totalNumberOfBallotItemsTemp = 0;
    if (ballotWithItemsFromCompletionFilterType && ballotWithItemsFromCompletionFilterType.length) {
      const raceLevelFilterItems = ballotWithItemsFromCompletionFilterType.filter((item) => item.race_office_level === raceLevelFilterTypeIncoming ||
        item.kind_of_ballot_item === raceLevelFilterTypeIncoming.toUpperCase());
      if (raceLevelFilterItems && raceLevelFilterItems.length) {
        totalNumberOfBallotItemsTemp = raceLevelFilterItems.length;
      } else {
        totalNumberOfBallotItemsTemp = BallotStore.ballotLength;
      }
    }
    // console.log('setRaceLevelFilterTypePlus totalNumberOfBallotItemsTemp:', totalNumberOfBallotItemsTemp);
    setDoubleFilteredBallotItemsLength(doubleFilteredBallotItemsLengthIncoming);
    setIsSearching(false);
    setRaceLevelFilterType(raceLevelFilterTypeIncoming);
    setTotalNumberOfBallotItems(totalNumberOfBallotItemsTemp);
  };

  const showAllBallotItems = () => {
    BallotActions.raceLevelFilterTypeSave('All');
    setRaceLevelFilterType('All');
  };

  // const toggleSelectBallotModal = (destinationUrlForHistoryPush = '', showEditAddress = false) => {
  //   console.log('Ballot toggleSelectBallotModal');
  //   const showSelectBallotModal = AppObservableStore.showSelectBallotModal();
  //   // console.log('Ballot toggleSelectBallotModal, destinationUrlForHistoryPush:', destinationUrlForHistoryPush, ', showSelectBallotModal:', showSelectBallotModal);
  //   AppObservableStore.setShowSelectBallotModal(!showSelectBallotModal, getBooleanValue(showEditAddress));
  //   if (showSelectBallotModal && destinationUrlForHistoryPush && destinationUrlForHistoryPush !== '') {
  //     // console.log('toggleSelectBallotModal destinationUrlForHistoryPush:', destinationUrlForHistoryPush);
  //     historyPush(destinationUrlForHistoryPush);
  //   // } else if (apiCalming('voterOfficeHeldListRetrieve', 10000)) {
  //   //   BallotActions.voterOfficeHeldListRetrieve(); // Retrieve a list of ballots for the voter from other elections
  //   }
  // };

  // DALE 2026-11-15 I went back to look at the history of the Ballot file, and as far back as August 22, 2020 I can't find: class=Ballot__Wrapper
  let padBallotWindowBottomForCordova = '';
  if (isCordova()) {
    // If the previous render of the Ballot__Wrapper is less than the device height, pad it
    // temporarily for Cordova to stop the footer menu from bouncing when initially rendered
    const { $, visualViewport: { height, scale } } = window;
    const deviceHeight = height / scale;
    const ballotWrapperHeight = $('[class^="class=Ballot__Wrapper"]').outerHeight() || 0;
    if (ballotWrapperHeight < deviceHeight) {
      padBallotWindowBottomForCordova = '625px';  // big enough for the largest phone with a footer menu
    }
  }

  let hasRenderedFirstBallotItem = false;
  let numberOfBallotItemsDisplayed = 0;
  let showLoadingText = true;
  let searchTextString = '';
  let paddingTop = '';
  if (isIPad()) {
    paddingTop = `${outerHeightOfDualHeaderContainer()}px`;
  }

  useEffect(() => {
    // This is called on initial load
    console.log('MyElectedOfficials initial load');
    setMounted(true);
    window.addEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="ballot_root">
      <Suspense fallback={<LoadingWheelComp />}>
        <SnackNotifier />
        <DualHeaderContainer id="ballot" scrolledDown={scrolledDown} topOffset={getTopOffsetDueToHeadroomWrapper()}>
          <HeaderContentOuterContainer>
            <HeaderContentContainer>
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12">
                    <Helmet>
                      <title>My Elected Officials - WeVote</title>
                      {/* TODO mimic <link rel="canonical" from Ballot page */}
                    </Helmet>
                    <BallotHeaderGroup>
                      <BallotTitleHeaderContainer>
                        <ElectionNameH1>
                          My Elected Officials
                        </ElectionNameH1>
                      </BallotTitleHeaderContainer>
                    </BallotHeaderGroup>
                    <BallotHeaderBottomWrapper scrolledDown={scrolledDown}>
                      TEXT_FOR_MAP_SEARCH:
                      {textForMapSearch}
                      <br />
                      ballotWithItemsFromCompletionFilterType.length:
                      {ballotWithItemsFromCompletionFilterType.length}
                      <br />
                      { textForMapSearch || ballotWithItemsFromCompletionFilterType.length > 0 ? (
                        <BallotFilterContainer>
                          <BallotFilterRow
                            ballotWithAllItems={ballotWithAllItems}
                            ballotWithItemsFromCompletionFilterType={ballotWithItemsFromCompletionFilterType}
                            classes={classes}
                            chipLabelText={chipLabelText}
                            handleToggleSearchBallot={handleToggleSearchBallot}
                            isSearching={isSearching}
                            onFilterBaseSearch={onFilterBaseSearch}
                            raceLevelFilterType={raceLevelFilterType}
                            setRaceLevelFilterType={setRaceLevelFilterTypePlus}
                            showFilterTabs={showFilterTabs}
                          />
                        </BallotFilterContainer>
                      ) : null}
                    </BallotHeaderBottomWrapper>
                  </div>
                  {/* ABOVE: div className="col-md-12" */}
                </div>
                {/* ABOVE: div className="row" */}
              </div>
              {/* ABOVE: div className="container-fluid" */}
            </HeaderContentContainer>
          </HeaderContentOuterContainer>
          <div id="cordovaHeaderBottomDatum" />
        </DualHeaderContainer>

        <PageContentContainer>
          <div className="container-fluid">
            <MyElectedOfficialsWrapper padTop={paddingTop} padBottom={padBallotWindowBottomForCordova} id="ballotWrapper">
              {/* eslint-disable-next-line no-nested-ternary */}
              <MyElectedOfficialsWrapperBody id="MyElectedOfficialsWrapperBody" style={ballotWrapperBodyStyles()}>
                <div className="col-12">
                  <Suspense fallback={<></>}>
                    {/* <DisplayWhileRetrievingBallot ballotWithAllItems={ballotWithAllItems} /> */}
                  </Suspense>
                </div>
                {/* TEMP
                {ballotWithItemsFromCompletionFilterType.length > 0 ? (
                  <BallotStatusMessage
                    ballotLocationChosen
                    googleCivicElectionId={this.state.googleCivicElectionId}
                  />
                ) : null}
                */}
                <MyElectedOfficialsOverflowWrapper className="col-12" id="ballotRoute-topOfBallot" style={isCordova() ? { paddingLeft: 0, paddingRight: 0 } : {}}>
                  {(isSearching && searchText) && (
                    <SearchTitle>
                      Searching for &quot;
                      {searchText}
                      &quot;
                    </SearchTitle>
                  )}
                  <OfficeHeldListWrapper>
                    {/* The rest of the ballot items */}
                    <OfficeHeldListInternalWrapper id="OfficeHeldListId">
                      {(isSearching && ballotSearchResults && ballotSearchResults.length === 0) && (
                        <SearchResultsEmpty>
                          Please enter new search terms to find results.
                        </SearchResultsEmpty>
                      )}
                      {(isSearching ? ballotSearchResults : ballotWithItemsFromCompletionFilterType).map((item, index) => {
                        // Ballot limited by items by race_office_level = (Federal, State, Local) or kind_of_ballot_item = (Measure)
                        // console.log('raceLevelFilterType:', raceLevelFilterType, ', item:', item);
                        if ((raceLevelFilterType === 'All' || isSearching ||
                          (item.kind_of_ballot_item === raceLevelFilterType.toUpperCase()) ||
                          raceLevelFilterType === item.race_office_level)) {
                          // console.log('Ballot item for BallotItemCompressed:', item);
                          // {...item}
                          // Determine if this is the first valid item
                          const isFirstBallotItem = !hasRenderedFirstBallotItem;
                          if (isFirstBallotItem) {
                            hasRenderedFirstBallotItem = true; // Mark the first valid item as rendered
                          }
                          const key = item.we_vote_id;
                          // console.log('numberOfBallotItemsDisplayed:', numberOfBallotItemsDisplayed, ', numberOfBallotItemsToDisplay:', numberOfBallotItemsToDisplay);
                          if (numberOfBallotItemsDisplayed >= numberOfBallotItemsToDisplay) {
                            return null;
                          }
                          numberOfBallotItemsDisplayed += 1;
                          // console.log('numberOfBallotItemsDisplayed: ', numberOfBallotItemsDisplayed);
                          showLoadingText = numberOfBallotItemsDisplayed === 1;
                          // console.log('foundInArray:', item.foundInArray);
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
                          // console.log('-------- Ballot --------- numberOfBallotItemsDisplayed', numberOfBallotItemsDisplayed, item.we_vote_id);
                          return (
                            <OfficeHeldWrapper className="keyInsertionDiv" key={key}>
                              <Suspense fallback={<></>}>
                                <DelayedLoad showLoadingText={showLoadingText} waitBeforeShow={500}>
                                  <>
                                    {!!(isSearching && searchTextString && item.foundInArray && item.foundInArray.length) && (
                                      <SearchResultsFoundInExplanation>
                                        {searchTextString}
                                        {' '}
                                        found in
                                        {' '}
                                        {item.foundInArray.map((oneItem) => {
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
                                    )}
                                    <BallotItemCompressed
                                      ballotItemDisplayName={item.ballot_item_display_name}
                                      candidateList={item.candidate_list}
                                      candidatesToShowForSearchResults={item.candidatesToShowForSearchResults}
                                      foundInSearchWords={item.foundInSearchWords}
                                      id={chipLabelText(item.ballot_item_display_name)}
                                      isFirstBallotItem={isFirstBallotItem}
                                      isMeasure={item.kind_of_ballot_item === TYPES.MEASURE}
                                      officeExplanation={item.office_explanation_text}
                                      primaryParty={item.primary_party}
                                      totalNumberOfBallotItems={totalNumberOfBallotItems}
                                      useHelpDefeatOrHelpWin
                                      videoUrlHorizontal={item.video_url_horizontal}
                                      videoUrlVertical={item.video_url_vertical}
                                      weVoteId={item.we_vote_id}
                                      key={key}
                                    />
                                  </>
                                </DelayedLoad>
                              </Suspense>
                            </OfficeHeldWrapper>
                          );
                        } else {
                          return null;
                        }
                      })}
                      {doubleFilteredBallotItemsLength === 0}
                      {!!(totalNumberOfBallotItems) && (
                        <ShowMoreItemsWrapper id="showMoreItemsId">
                          {/*  onClick={() => increaseNumberOfBallotItemsToDisplay()} */}
                          <Suspense fallback={<></>}>
                            <ShowMoreItems
                              loadingMoreItemsNow={loadingMoreItems}
                              numberOfItemsDisplayed={numberOfBallotItemsDisplayed}
                              numberOfItemsTotal={totalNumberOfBallotItems}
                            />
                          </Suspense>
                        </ShowMoreItemsWrapper>
                      )}
                      {!!(loadingMoreItems && totalNumberOfBallotItems && (numberOfBallotItemsToDisplay < totalNumberOfBallotItems)) && (
                        <LoadingItemsWheel>
                          <CircularProgress />
                        </LoadingItemsWheel>
                      )}
                      {(!isSearching && raceLevelFilterType !== 'All') && (
                        <BallotShowAllItemsFooter
                          setActiveRaceItem={showAllBallotItems}
                        />
                      )}
                    </OfficeHeldListInternalWrapper>
                  </OfficeHeldListWrapper>
                  {/* Show links to this candidate in the admin tools */}
                  {/*
                  { (!twoColumnDisplay) && (this.state.voter && sourcePollingLocationWeVoteId) && (this.state.voter.is_admin || this.state.voter.is_verified_volunteer) ? (
                    <AdminLinkDisplay className="u-wrap-links d-print-none">
                      <span>Admin:</span>
                      <Suspense fallback={<></>}>
                        <OpenExternalWebSite
                          linkIdAttribute="ballotReturnedAdminEdit"
                          url={ballotReturnedAdminEditUrl}
                          target="_blank"
                          body={(
                            <span>
                                Ballot copied from polling location &quot;
                              {sourcePollingLocationWeVoteId}
                              &quot;
                              </span>
                          )}
                        />
                      </Suspense>
                    </AdminLinkDisplay>
                  ) : null}
                */}
                </MyElectedOfficialsOverflowWrapper>
              </MyElectedOfficialsWrapperBody>
            </MyElectedOfficialsWrapper>
          </div>
          {/* ABOVE: div className="container-fluid" */}
        </PageContentContainer>
      </Suspense>
      {/* BELOW: div className="ballot_root" */}
    </div>
  );
}
MyElectedOfficials.propTypes = {
  classes: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,
};

const styles = (theme) => ({
  badge: {
    top: 11,
    minWidth: 16,
    width: 20,
    height: 16,
    right: 14,
    background: 'rgba(46, 60, 93, 0.08)',
    color: '#333',
    cursor: 'pointer',
    [theme.breakpoints.down('lg')]: {
      fontSize: 9,
      width: 16,
      top: 11,
      right: 11,
    },
  },
  badgeColorPrimary: {
    background: 'white',
    color: theme.palette.primary.main,
    '@media print': {
      color: theme.palette.primary.main,
    },
  },
  badgeFocused: {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '2px',
  },
  badgeRoot: {
    display: 'inline-block', // This ensures the focus outline wraps around the entire badge
  },
  unselectedBadgeColorPrimary: {
    background: 'rgba(0, 0, 0, .2)',
    color: '#333',
  },
  chipRoot: {
    height: 22.5,
  },
  chipRootAll: {
    height: 22.5,
    width: 64,
  },
  chipOutlined: {
    background: theme.palette.primary.main,
    color: 'white',
    '&:hover': {
      background: `${theme.palette.primary.light} !important`,
    },
    '&:active': {
      background: theme.palette.primary.main,
    },
    '&:focus': {
      background: `${theme.palette.primary.main} !important`,
    },
  },
  chipLabel: {
    fontSize: 14,
    paddingLeft: 0,
    [theme.breakpoints.up('md')]: {
      fontSize: 16,
    },
  },
  iconRoot: {
    position: 'absolute',
    left: 3,
    top: 1,
    color: theme.palette.primary.main,
    cursor: 'pointer',
    [theme.breakpoints.down('md')]: {
      fontSize: 16,
      top: 3,
    },
  },
});

const MyElectedOfficialsOverflowWrapper = styled('div')`
  overflow-x: hidden;
`;

const MyElectedOfficialsWrapper = styled('div', {
  shouldForwardProp: (prop) => !['padTop', 'padBottom'].includes(prop),
})(({ padTop, padBottom }) => (`
  padding-top: ${padTop};
  padding-bottom: ${padBottom};
`));

export const MyElectedOfficialsWrapperBody = styled('div')`
`;

const OfficeHeldWrapper = styled('div')`
`;

const OfficeHeldListInternalWrapper = styled('div')`
  @media print {
    column-count: 1;
  }
`;

const OfficeHeldListWrapper = styled('div')`
  padding-bottom: 40px;
`;

const SearchResultsEmpty = styled('div')`
  font-size: 20px;
`;

const ShowMoreItemsWrapper = styled('div')`
  margin-bottom: 16px;
`;

export default withTheme(withStyles(styles)(MyElectedOfficials));
