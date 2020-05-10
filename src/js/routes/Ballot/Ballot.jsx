import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import moment from 'moment';
import styled from 'styled-components';
import Badge from '@material-ui/core/Badge';
import Chip from '@material-ui/core/Chip';
import Link from '@material-ui/core/Link';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddressBox from '../../components/AddressBox';
import AnalyticsActions from '../../actions/AnalyticsActions';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import BallotActions from '../../actions/BallotActions';
import BallotDecisionsTabs from '../../components/Navigation/BallotDecisionsTabs';
import BallotItemCompressed from '../../components/Ballot/BallotItemCompressed';
import BallotTitleHeader from './BallotTitleHeader';
import BallotSideBar from '../../components/Navigation/BallotSideBar';
import BallotSearch from '../../components/Ballot/BallotSearch';
import BallotStatusMessage from '../../components/Ballot/BallotStatusMessage';
import BallotStore from '../../stores/BallotStore';
import BallotSummaryFooter from '../../components/Navigation/BallotSummaryFooter';
import BrowserPushMessage from '../../components/Widgets/BrowserPushMessage';
import cookies from '../../utils/cookies';
import CompleteYourProfile from '../../components/CompleteYourProfile/CompleteYourProfile';
import { cordovaBallotFilterTopMargin, cordovaScrollablePaneTopPadding } from '../../utils/cordovaOffsets';
import { historyPush, isCordova, isWebApp } from '../../utils/cordovaUtils';
import DelayedLoad from '../../components/Widgets/DelayedLoad';
import ElectionActions from '../../actions/ElectionActions';
import ElectionStore from '../../stores/ElectionStore';
import isMobile from '../../utils/isMobile';
import isMobileScreenSize from '../../utils/isMobileScreenSize';
import mapCategoryFilterType from '../../utils/map-category-filter-type';
import IssueActions from '../../actions/IssueActions';
import IssueStore from '../../stores/IssueStore';
import OpenExternalWebSite from '../../components/Widgets/OpenExternalWebSite';
import OrganizationActions from '../../actions/OrganizationActions';
import { renderLog } from '../../utils/logging';
import showBallotDecisionsTabs from '../../utils/showBallotDecisionsTabs';
import SupportActions from '../../actions/SupportActions';
import SupportStore from '../../stores/SupportStore';
import { checkShouldUpdate, formatVoterBallotList } from './utils';
import VoterActions from '../../actions/VoterActions';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import webAppConfig from '../../config';

const TYPES = require('keymirror')({
  OFFICE: null,
  MEASURE: null,
});

// Related to WebApp/src/js/components/VoterGuide/VoterGuideBallot.jsx
const BALLOT_ITEM_FILTER_TYPES = ['All', 'Federal', 'State', 'Measure', 'Local'];
const delayBeforeVoterRefreshCall = 1000;

// const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

class Ballot extends Component {
  static propTypes = {
    location: PropTypes.object,
    pathname: PropTypes.string,
    params: PropTypes.object,
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      ballotElectionList: [],
      ballotItemUnfurledTracker: {},
      ballotLength: 0,
      ballotRemainingChoicesLength: 0,
      ballotWithAllItems: [],
      ballotWithItemsFromCompletionFilterType: [],
      foundFirstRaceLevel: false,
      raceLevelFilterType: '',
      ballotReturnedWeVoteId: '',
      ballotLocationShortcut: '',
      candidateForModal: {
        voter_guides_to_follow_for_latest_ballot_item: [],
        position_list: [],
      },
      componentDidMountFinished: false,
      lastHashUsedInLinkScroll: '',
      loadingMoreItems: false,
      measureForModal: {
        voter_guides_to_follow_for_latest_ballot_item: [],
        position_list: [],
      },
      memberViewedBallotHasBeenSavedOnce: {},
      mounted: false,
      numberOfBallotItemsToDisplay: 5,
      numberOfVoterRetrieveAttempts: 0,
      showSelectBallotModal: false,
      totalNumberOfBallotItems: 0,
      voterBallotList: [],
      showFilterTabs: false,
      ballotHeaderUnpinned: false,
      isSearching: false,
      ballotSearchResults: [],
      raceLevelFilterItemsInThisBallot: undefined,
    };

    this.ballotItems = {};
    this.ballotItemLinkHasBeenClicked = this.ballotItemLinkHasBeenClicked.bind(this);
    this.toggleSelectBallotModal = this.toggleSelectBallotModal.bind(this);
    this.updateOfficeDisplayUnfurledTracker = this.updateOfficeDisplayUnfurledTracker.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount () {
    const ballotBaseUrl = '/ballot';
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    // We need a ballotStoreListener here because we want the ballot to display before positions are received
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.electionListListener = ElectionStore.addListener(this.onElectionStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onBallotStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));

    this.setState({
      componentDidMountFinished: true,
      mounted: true,
    });

    const completionLevelFilterType = BallotStore.getCompletionLevelFilterTypeSaved() || 'all';
    const ballotWithItemsFromCompletionFilterType = BallotStore.getBallotByCompletionLevelFilterType(completionLevelFilterType);
    if (ballotWithItemsFromCompletionFilterType !== undefined) {
      // console.log('ballotWithItemsFromCompletionFilterType !== undefined');
      if (completionLevelFilterType === 'all') {
        this.setState({
          ballotWithAllItems: ballotWithItemsFromCompletionFilterType,
          ballotWithItemsFromCompletionFilterType,
        });
      } else {
        const ballotWithAllItems = BallotStore.getBallotByCompletionLevelFilterType('all');
        this.setState({
          ballotWithAllItems,
          ballotWithItemsFromCompletionFilterType,
        });
      }
    }

    let googleCivicElectionIdFromUrl = this.props.params.google_civic_election_id || 0;

    // console.log('googleCivicElectionIdFromUrl: ', googleCivicElectionIdFromUrl);
    let ballotReturnedWeVoteId = this.props.params.ballot_returned_we_vote_id || '';
    ballotReturnedWeVoteId = ballotReturnedWeVoteId === 'none' ? '' : ballotReturnedWeVoteId;

    // console.log('this.props.params.ballot_returned_we_vote_id: ', this.props.params.ballot_returned_we_vote_id);
    let ballotLocationShortcut = this.props.params.ballot_location_shortcut || '';
    ballotLocationShortcut = ballotLocationShortcut.trim();
    ballotLocationShortcut = ballotLocationShortcut === 'none' ? '' : ballotLocationShortcut;
    let googleCivicElectionId = 0;

    // console.log('componentDidMount, BallotStore.ballotProperties: ', BallotStore.ballotProperties);
    if (googleCivicElectionIdFromUrl !== 0) {
      googleCivicElectionIdFromUrl = parseInt(googleCivicElectionIdFromUrl, 10);

      // googleCivicElectionId = googleCivicElectionIdFromUrl;
    } else if (BallotStore.ballotProperties && BallotStore.ballotProperties.google_civic_election_id) {
      googleCivicElectionId = BallotStore.ballotProperties.google_civic_election_id;
    }

    // console.log('ballotReturnedWeVoteId: ', ballotReturnedWeVoteId, ', ballotLocationShortcut:', ballotLocationShortcut, ', googleCivicElectionIdFromUrl: ', googleCivicElectionIdFromUrl);
    if (ballotReturnedWeVoteId || ballotLocationShortcut || googleCivicElectionIdFromUrl) {
      if (ballotLocationShortcut !== '') {
        // Change the ballot on load to make sure we are getting what we expect from the url
        BallotActions.voterBallotItemsRetrieve(0, '', ballotLocationShortcut);

        // Change the URL to match
        historyPush(`${ballotBaseUrl}/${ballotLocationShortcut}`);
      } else if (ballotReturnedWeVoteId !== '') {
        // Change the ballot on load to make sure we are getting what we expect from the url
        BallotActions.voterBallotItemsRetrieve(0, ballotReturnedWeVoteId, '');

        // Change the URL to match
        historyPush(`${ballotBaseUrl}/id/${ballotReturnedWeVoteId}`);
      } else if (googleCivicElectionIdFromUrl !== 0) {
        // Change the ballot on load to make sure we are getting what we expect from the url
        if (googleCivicElectionId !== googleCivicElectionIdFromUrl) {
          BallotActions.voterBallotItemsRetrieve(googleCivicElectionIdFromUrl, '', '');

          // Change the URL to match
          const ballotElectionUrl = `${ballotBaseUrl}/election/${googleCivicElectionIdFromUrl}`;
          historyPush(ballotElectionUrl);
        }

        // No change to the URL needed
        // Now set googleCivicElectionId
        googleCivicElectionId = googleCivicElectionIdFromUrl;
      } else if (googleCivicElectionId !== 0) {
        // No need to retrieve data again
        // Change the URL to match the current googleCivicElectionId
        const ballotElectionUrl2 = `${ballotBaseUrl}/election/${googleCivicElectionId}`;
        historyPush(ballotElectionUrl2);
      }
    } else if (BallotStore.ballotProperties && BallotStore.ballotProperties.ballot_found === false) { // No ballot found
      // console.log('if (BallotStore.ballotProperties && BallotStore.ballotProperties.ballot_found === false');
      historyPush('/settings/location');
    } else if (ballotWithItemsFromCompletionFilterType === undefined) {
      // console.log('WebApp doesn't know the election or have ballot data, so ask the API server to return best guess');
      BallotActions.voterBallotItemsRetrieve(0, '', '');
    }

    // console.log('Ballot, googleCivicElectionId: ', googleCivicElectionId, ', ballotLocationShortcut: ', ballotLocationShortcut, 'ballotReturnedWeVoteId: ', ballotReturnedWeVoteId);
    // console.log('VoterStore.election_id: ', VoterStore.electionId());
    if (!IssueStore.issueDescriptionsRetrieveCalled()) {
      IssueActions.issueDescriptionsRetrieve();
      // IssueActions.issueDescriptionsRetrieveCalled(); // TODO: Move this to AppActions? Currently throws error: 'Cannot dispatch in the middle of a dispatch'
    }
    IssueActions.issuesFollowedRetrieve();
    if (googleCivicElectionId || ballotLocationShortcut || ballotReturnedWeVoteId) {
      // console.log('CALLING IssueActions.issuesUnderBallotItemsRetrieve');
      let callIssuesUnderBallotItemRetrieve = true;
      if (googleCivicElectionId) {
        // If we have a value for googleCivicElectionId, then prevent a calling issuesUnderBallotItemsRetrieve if we already have the data
        if (IssueStore.issuesUnderBallotItemsRetrieveCalled(googleCivicElectionId)) {
          callIssuesUnderBallotItemRetrieve = false;
        }
      }
      if (callIssuesUnderBallotItemRetrieve) {
        IssueActions.issuesUnderBallotItemsRetrieve(googleCivicElectionId, ballotLocationShortcut, ballotReturnedWeVoteId);
        // IssueActions.issuesUnderBallotItemsRetrieveCalled(googleCivicElectionId); // TODO: Move this to AppActions? Currently throws error: 'Cannot dispatch in the middle of a dispatch'
      }

      this.setState({
        issuesRetrievedFromGoogleCivicElectionId: googleCivicElectionId,
        issuesRetrievedFromBallotReturnedWeVoteId: ballotReturnedWeVoteId,
        issuesRetrievedFromBallotLocationShortcut: ballotLocationShortcut,
      });
    }
    // NOTE: voterAllPositionsRetrieve is also called in SupportStore when voterAddressRetrieve is received,
    // so we get duplicate calls when you come straight to the Ballot page. There is no easy way around this currently.
    SupportActions.voterAllPositionsRetrieve();

    BallotActions.voterBallotListRetrieve(); // Retrieve a list of ballots for the voter from other elections
    this.onVoterStoreChange();

    // Once a voter hits the ballot, they have gone through orientation
    cookies.setItem('ballot_has_been_visited', '1', Infinity, '/');

    ElectionActions.electionsRetrieve();
    OrganizationActions.organizationsFollowedRetrieve();
    VoterActions.voterRetrieve(); // This is needed to update the interface status settings

    if (googleCivicElectionId && googleCivicElectionId !== 0) {
      AnalyticsActions.saveActionBallotVisit(googleCivicElectionId);
    } else {
      AnalyticsActions.saveActionBallotVisit(VoterStore.electionId());
    }

    const { location } = this.props;
    const { pathname } = location;
    this.setState({
      ballotElectionList: BallotStore.ballotElectionList(),
      completionLevelFilterType,
      ballotReturnedWeVoteId,
      ballotLocationShortcut,
      googleCivicElectionId: parseInt(googleCivicElectionId, 10),
      location,
      pathname,
      raceLevelFilterType: BallotStore.getRaceLevelFilterTypeSaved() || 'All',
    });

    const { hash } = location;
    if (location && hash) {
      // this.hashLinkScroll();
      this.setState({ lastHashUsedInLinkScroll: hash });
    }

    const modalToOpen = this.props.params.modal_to_show || '';
    if (modalToOpen === 'share') {
      AppActions.setShowShareModal(true);
    } else if (modalToOpen === 'sic') { // sic = Shared Item Code
      const sharedItemCode = this.props.params.shared_item_code || '';
      if (sharedItemCode) {
        AppActions.setShowSharedItemModal(sharedItemCode);
      }
    }
    window.addEventListener('scroll', this.onScroll);
  }

  componentWillReceiveProps (nextProps) {
    // console.log('Ballot componentWillReceiveProps');

    // We don't want to let the googleCivicElectionId disappear
    const googleCivicElectionId = nextProps.params.google_civic_election_id || this.state.googleCivicElectionId;
    let ballotReturnedWeVoteId = nextProps.params.ballot_returned_we_vote_id || '';
    ballotReturnedWeVoteId = ballotReturnedWeVoteId.trim();
    let ballotLocationShortcut = nextProps.params.ballot_location_shortcut || '';
    ballotLocationShortcut = ballotLocationShortcut.trim();
    const completionLevelFilterType = BallotStore.getCompletionLevelFilterTypeSaved() || 'all';

    // Were there any actual changes?
    if (ballotReturnedWeVoteId !== this.state.ballotReturnedWeVoteId ||
        ballotLocationShortcut !== this.state.ballotLocationShortcut ||
        googleCivicElectionId !== this.state.googleCivicElectionId ||
        completionLevelFilterType !== this.state.completionLevelFilterType) {
      // console.log('Ballot componentWillReceiveProps changes found');
      this.setState({
        ballotWithAllItems: BallotStore.getBallotByCompletionLevelFilterType('all'),
        ballotWithItemsFromCompletionFilterType: BallotStore.getBallotByCompletionLevelFilterType(completionLevelFilterType),
        ballotReturnedWeVoteId,
        ballotLocationShortcut,
        completionLevelFilterType,
        googleCivicElectionId: parseInt(googleCivicElectionId, 10),
        location: nextProps.location,
        pathname: nextProps.location.pathname,
      });
      if (googleCivicElectionId !== this.state.googleCivicElectionId) {
        this.setState({
          raceLevelFilterType: 'All',
        });
      }
      if (googleCivicElectionId && googleCivicElectionId !== 0) {
        AnalyticsActions.saveActionBallotVisit(googleCivicElectionId);
      } else if (VoterStore.electionId()) {
        AnalyticsActions.saveActionBallotVisit(VoterStore.electionId());
      }
    } else {
      // console.log('Ballot componentWillReceiveProps NO changes found');
    }

    const modalToOpen = nextProps.params.modal_to_show || '';
    if (modalToOpen === 'share') {
      AppActions.setShowShareModal(true);
    } else if (modalToOpen === 'sic') { // sic = Shared Item Code
      const sharedItemCode = nextProps.params.shared_item_code || '';
      if (sharedItemCode) {
        AppActions.setShowSharedItemModal(sharedItemCode);
      }
    }

    if (nextProps.location && nextProps.location.hash) {
      // this.hashLinkScroll();
      this.setState({ lastHashUsedInLinkScroll: nextProps.location.hash });
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    return checkShouldUpdate(this.state, nextState);
  }

  componentDidUpdate (prevProps, prevState) {
    // console.log('Ballot componentDidUpdate');
    const { ballotWithAllItems, foundFirstRaceLevel, raceLevelFilterType } = this.state;
    if (!foundFirstRaceLevel) {
      // We only need to be here if we haven't found the first Race level we are going to show, or we don't have a raceLevelFilterType identified
      let { newRaceLevelFilterType } = this.state;
      let raceLevelFilterTypeChanged = false;
      // console.log('Ballot, componentDidUpdate raceLevelFilterType BEFORE:', raceLevelFilterType, ', newRaceLevelFilterType: ', newRaceLevelFilterType);

      let raceLevelFilterItemsInThisBallot = [];
      if (ballotWithAllItems && ballotWithAllItems.length) {
        // console.log('Ballot, componentDidUpdate ballotWithAllItems:', this.state.ballotWithAllItems);
        // const raceLevelFilterItems = ballotWithAllItems.filter(item => item.race_office_level === raceLevelFilterType ||
        //   item.kind_of_ballot_item === raceLevelFilterType.toUpperCase());
        let currentIndex = 0;
        let lowestIndexFound = 3;
        const raceLevelsAlreadyFound = [];
        let ballotItemRaceOfficeLevel;
        let raceLevelCapitalized;
        let ballotItemKindOfOfficeItem;
        raceLevelFilterItemsInThisBallot = ballotWithAllItems.filter((ballotItem) => {
          // If true comes back from this filter, the 'map' tacked onto the end of this returns just the race_office_level
          raceLevelCapitalized = '';
          ballotItemRaceOfficeLevel = ballotItem.race_office_level || '';
          if (ballotItemRaceOfficeLevel) {
            // For Federal, State, Local
            raceLevelCapitalized = ballotItemRaceOfficeLevel.charAt(0).toUpperCase() + ballotItemRaceOfficeLevel.slice(1).toLowerCase();
          } else {
            // For Measures
            ballotItemKindOfOfficeItem = ballotItem.kind_of_ballot_item || '';
            raceLevelCapitalized = ballotItemKindOfOfficeItem.charAt(0).toUpperCase() + ballotItemKindOfOfficeItem.slice(1).toLowerCase();
          }
          currentIndex = BALLOT_ITEM_FILTER_TYPES.indexOf(raceLevelCapitalized);
          if (currentIndex > -1) {
            if (currentIndex < lowestIndexFound) {
              newRaceLevelFilterType = raceLevelCapitalized;
              lowestIndexFound = currentIndex;
            }
            if (raceLevelsAlreadyFound.indexOf(raceLevelCapitalized) === -1) {
              // If this office level hasn't already been added, then add it
              raceLevelsAlreadyFound.push(raceLevelCapitalized);
              return raceLevelCapitalized;
            } else {
              return null;
            }
          }
          return null;
        }).map((ballotItem) => {
          raceLevelCapitalized = '';
          ballotItemRaceOfficeLevel = ballotItem.race_office_level || '';
          if (ballotItemRaceOfficeLevel) {
            // For Federal, State, Local
            raceLevelCapitalized = ballotItemRaceOfficeLevel.charAt(0).toUpperCase() + ballotItemRaceOfficeLevel.slice(1).toLowerCase();
          } else {
            // For Measures
            ballotItemKindOfOfficeItem = ballotItem.kind_of_ballot_item || '';
            raceLevelCapitalized = ballotItemKindOfOfficeItem.charAt(0).toUpperCase() + ballotItemKindOfOfficeItem.slice(1).toLowerCase();
          }
          return raceLevelCapitalized;
        });

        // We must have a raceLevelFilterType that matches this ballot
        const currentRaceLevelFilterTypeNotFoundInBallot = raceLevelFilterItemsInThisBallot.indexOf(raceLevelFilterType) === -1;
        if (!raceLevelFilterType || currentRaceLevelFilterTypeNotFoundInBallot) {
          newRaceLevelFilterType = BALLOT_ITEM_FILTER_TYPES[lowestIndexFound];
          raceLevelFilterTypeChanged = true;
        }
      }

      this.setState({ raceLevelFilterItemsInThisBallot });
      // console.log('Ballot, componentDidUpdate raceLevelFilterType AFTER:', raceLevelFilterType, ', newRaceLevelFilterType: ', newRaceLevelFilterType);
      // console.log('Ballot, componentDidUpdate raceLevelFilterItemsInThisBallot:', raceLevelFilterItemsInThisBallot);

      if (this.state.lastHashUsedInLinkScroll && this.state.lastHashUsedInLinkScroll !== prevState.lastHashUsedInLinkScroll) {
        this.hashLinkScroll();
      }

      if (!foundFirstRaceLevel || raceLevelFilterTypeChanged) {
        if (raceLevelFilterTypeChanged) {
          this.setState({
            raceLevelFilterType: newRaceLevelFilterType,
          });
        }
        this.setState({
          foundFirstRaceLevel: true,
          showFilterTabs: raceLevelFilterItemsInThisBallot.length > 1,
        });
      }
    }
  }

  componentWillUnmount () {
    // console.log('Ballot componentWillUnmount');
    this.setState({
      mounted: false,
    });

    this.appStoreListener.remove();
    this.ballotStoreListener.remove();
    this.electionListListener.remove();
    this.supportStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.voterStoreListener.remove();
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.ballotItemTimer) {
      clearTimeout(this.ballotItemTimer);
      this.ballotItemTimer = null;
    }
    window.removeEventListener('scroll', this.onScroll);
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a 'Oh snap' page
    return { hasError: true };
  }

  onAppStoreChange () {
    this.setState({
      ballotHeaderUnpinned: AppStore.getScrolledDown(),
      showSelectBallotModal: AppStore.showSelectBallotModal(),
    });
    const { googleCivicElectionId } = this.state;
    const membershipOrganizationWeVoteId = AppStore.getSiteOwnerOrganizationWeVoteId();
    // console.log('onAppStoreChange membershipOrganizationWeVoteId: ', membershipOrganizationWeVoteId);
    if (membershipOrganizationWeVoteId) {
      const googleCivicElectionIdViewed = googleCivicElectionId || VoterStore.electionId();
      if (!this.memberViewedBallotHasBeenSavedOnce(membershipOrganizationWeVoteId, googleCivicElectionIdViewed)) {
        // console.log('onAppStoreChange getting ready to save: ', googleCivicElectionIdViewed);
        if (googleCivicElectionIdViewed && googleCivicElectionIdViewed !== 0) {
          AnalyticsActions.saveActionBallotVisit(googleCivicElectionIdViewed);
          this.memberViewedBallot(membershipOrganizationWeVoteId, googleCivicElectionIdViewed);
        }
      } else {
        // console.log('onAppStoreChange already saved: ', googleCivicElectionIdViewed);
      }
    }
  }

  onVoterStoreChange () {
    // console.log('Ballot.jsx onVoterStoreChange');
    const { mounted, googleCivicElectionId } = this.state;
    if (mounted) {
      let voterRefreshTimerOn = false;
      if (this.props.location && this.props.location.query && this.props.location.query.voter_refresh_timer_on) {
        voterRefreshTimerOn = (this.props.location.query.voter_refresh_timer_on);
        // console.log('onVoterStoreChange voterRefreshTimerOn: ', voterRefreshTimerOn);
      } else {
        // console.log('onVoterStoreChange voterRefreshTimerOn is FALSE');
      }
      if (voterRefreshTimerOn) {
        const voter = VoterStore.getVoter();
        const { numberOfVoterRetrieveAttempts } = this.state;
        if (voter && voter.is_signed_in) {
          // console.log('onVoterStoreChange, about to historyPush(this.state.pathname):', this.state.pathname);
          // Return to the same page without the 'voter_refresh_timer_on' variable
          historyPush(this.state.pathname);
        } else if (numberOfVoterRetrieveAttempts < 3) {
          // console.log('About to startTimerToRetrieveVoter');
          this.startTimerToRetrieveVoter();
        } else {
          // We have exceeded the number of allowed attempts and want to 'turn off' the request to refresh the voter object
          // Return to the same page without the 'voter_refresh_timer_on' variable
          // console.log('Exiting voterRefreshTimerOn');
          historyPush(this.state.pathname);
        }
      } else {
        // console.log('Ballot.jsx onVoterStoreChange VoterStore.getVoter: ', VoterStore.getVoter());
        this.setState({
          googleCivicElectionId: parseInt(VoterStore.electionId(), 10),
          textForMapSearch: VoterStore.getTextForMapSearch(),
          voter: VoterStore.getVoter(),
        });
      }
      const membershipOrganizationWeVoteId = AppStore.getSiteOwnerOrganizationWeVoteId();
      // console.log('onVoterStoreChange membershipOrganizationWeVoteId: ', membershipOrganizationWeVoteId);
      if (membershipOrganizationWeVoteId) {
        const googleCivicElectionIdViewed = googleCivicElectionId || VoterStore.electionId();
        if (!this.memberViewedBallotHasBeenSavedOnce(membershipOrganizationWeVoteId, googleCivicElectionIdViewed)) {
          // console.log('onVoterStoreChange getting ready to save: ', googleCivicElectionIdViewed);
          if (googleCivicElectionIdViewed && googleCivicElectionIdViewed !== 0) {
            AnalyticsActions.saveActionBallotVisit(googleCivicElectionIdViewed);
            this.memberViewedBallot(membershipOrganizationWeVoteId, googleCivicElectionIdViewed);
          }
        } else {
          // console.log('onVoterStoreChange already saved: ', googleCivicElectionIdViewed);
        }
      }
    }
  }

  onBallotStoreChange () {
    // console.log('Ballot.jsx onBallotStoreChange');
    const completionLevelFilterType = BallotStore.getCompletionLevelFilterTypeSaved() || '';
    const { ballot, ballotProperties } = BallotStore;
    // console.log('Ballot.jsx onBallotStorechange, ballotProperties: ', ballotProperties);
    const {
      mounted, isSearching, issuesRetrievedFromGoogleCivicElectionId,
      issuesRetrievedFromBallotReturnedWeVoteId, issuesRetrievedFromBallotLocationShortcut,
    } = this.state;
    // console.log('Ballot.jsx onBallotStorechange, mounted: ', mounted);
    let { raceLevelFilterType } = this.state;
    if (!raceLevelFilterType) {
      raceLevelFilterType = 'All'; // Make sure this is a string
    }

    if (mounted) {
      if (ballotProperties && ballotProperties.ballot_found && ballot && ballot.length === 0) {
        // Ballot is found but ballot is empty. We want to stay put.
        // console.log('onBallotStoreChange: ballotWithItemsFromCompletionFilterType is empty');
      } else {
        const ballotWithAllItems = BallotStore.getBallotByCompletionLevelFilterType('all') || [];
        let raceLevelFilterItems = [];
        // console.log('onBallotStoreChange completionLevelFilterType: ', completionLevelFilterType);
        let ballotWithItemsFromCompletionFilterType = BallotStore.getBallotByCompletionLevelFilterType(completionLevelFilterType);
        if (ballotWithItemsFromCompletionFilterType && ballotWithItemsFromCompletionFilterType.length) {
          raceLevelFilterItems = ballotWithItemsFromCompletionFilterType.filter(item => item.race_office_level === raceLevelFilterType ||
            item.kind_of_ballot_item === raceLevelFilterType.toUpperCase());
          this.setState({
            doubleFilteredBallotItemsLength: raceLevelFilterItems.length,
          });
        } else {
          // If here, the 'completionLevelFilterType' has been made obsolete.
          // Unfortunately we can't reset it without creating a dispatch loop
          // BallotActions.completionLevelFilterTypeSave('all');
          ballotWithItemsFromCompletionFilterType = ballotWithAllItems;
        }
        this.setState({
          ballotWithAllItems,
          ballotWithItemsFromCompletionFilterType,
        });

        // Calculate totalNumberOfBallotItems given filters set
        if (!isSearching) {
          let totalNumberOfBallotItems;
          if (raceLevelFilterItems && raceLevelFilterItems.length) {
            totalNumberOfBallotItems = raceLevelFilterItems.length;
          } else if (completionLevelFilterType !== '') {
            const list = BallotStore.getBallotByCompletionLevelFilterType(completionLevelFilterType);
            totalNumberOfBallotItems = list.length;
          } else {
            totalNumberOfBallotItems = BallotStore.ballotLength;
          }
          // console.log('totalNumberOfBallotItems:', totalNumberOfBallotItems);
          this.setState({
            totalNumberOfBallotItems,
          });
        }
      }
    }
    if (ballotProperties) {
      // If the incoming googleCivicElectionId, ballotReturnedWeVoteId, or ballotLocationShortcut are different, call issuesUnderBallotItemsRetrieve
      if (parseInt(ballotProperties.google_civic_election_id, 10) !== issuesRetrievedFromGoogleCivicElectionId ||
          ballotProperties.ballot_returned_we_vote_id !== issuesRetrievedFromBallotReturnedWeVoteId ||
          ballotProperties.ballot_location_shortcut !== issuesRetrievedFromBallotLocationShortcut) {
        // console.log('onBallotStoreChange, Calling issuesUnderBallotItemsRetrieve');
        let callIssuesUnderBallotItemRetrieve = true;
        if (ballotProperties.google_civic_election_id) {
          // If we only have a value for googleCivicElectionId, then prevent a calling issuesUnderBallotItemsRetrieve if we already have the data
          if (IssueStore.issuesUnderBallotItemsRetrieveCalled(ballotProperties.google_civic_election_id)) {
            callIssuesUnderBallotItemRetrieve = false;
          }
        }
        if (callIssuesUnderBallotItemRetrieve) {
          IssueActions.issuesUnderBallotItemsRetrieve(ballotProperties.google_civic_election_id, ballotProperties.ballot_location_shortcut, ballotProperties.ballot_returned_we_vote_id);
          // IssueActions.issuesUnderBallotItemsRetrieveCalled(ballotProperties.google_civic_election_id); // This causes error: 'Cannot dispatch in the middle of a dispatch'
        }

        this.setState({
          issuesRetrievedFromGoogleCivicElectionId: parseInt(BallotStore.ballotProperties.google_civic_election_id, 10),
          issuesRetrievedFromBallotReturnedWeVoteId: BallotStore.ballotProperties.ballot_returned_we_vote_id,
          issuesRetrievedFromBallotLocationShortcut: BallotStore.ballotProperties.ballot_location_shortcut,
        });
      }

      this.setState({
        ballotReturnedWeVoteId: ballotProperties.ballot_returned_we_vote_id || '',
        ballotLocationShortcut: ballotProperties.ballot_location_shortcut || '',
        googleCivicElectionId: parseInt(ballotProperties.google_civic_election_id, 10),
        textForMapSearchFromBallot: ballotProperties.text_for_map_search || '',
      });
    }
    this.setState({
      ballotElectionList: BallotStore.ballotElectionList(),
      completionLevelFilterType,
    });

    if (this.state.ballotLength !== BallotStore.ballotLength) {
      const { ballotLength } = BallotStore;
      this.setState({
        ballotLength,
        showFilterTabs: false,
        foundFirstRaceLevel: false,
      });
    }
    if (this.state.ballotRemainingChoicesLength !== BallotStore.ballotRemainingChoicesLength) {
      this.setState({
        ballotRemainingChoicesLength: BallotStore.ballotRemainingChoicesLength,
      });
    }

    if (Object.keys(this.state.ballotItemUnfurledTracker).length === 0) {
      // console.log('current tracker in Ballotstore', BallotStore.current_ballot_item_unfurled_tracker)
      this.setState({
        ballotItemUnfurledTracker: BallotStore.currentBallotItemUnfurledTracker,
      });
    }
  }

  onElectionStoreChange () {
    // console.log('Elections, onElectionStoreChange');
    this.setState({
      voterBallotList: formatVoterBallotList(ElectionStore.getElectionList()),
    });
  }

  onVoterGuideStoreChange () {
    // console.log('Ballot onVoterGuideStoreChange');
    // Update the data for the modal to include the position of the organization related to this ballot item
    const { candidateForModal, measureForModal } = this.state;
    if (candidateForModal) {
      this.setState({
        candidateForModal: {
          ...candidateForModal,
          voter_guides_to_follow_for_latest_ballot_item: VoterGuideStore.getVoterGuidesToFollowForLatestBallotItem(),
        },
      });
    } else if (measureForModal) {
      this.setState({
        measureForModal: {
          ...measureForModal,
          voter_guides_to_follow_for_latest_ballot_item: VoterGuideStore.getVoterGuidesToFollowForLatestBallotItem(),
        },
      });
    }
  }

  onScroll () {
    const showMoreItemsElement =  document.querySelector('#showMoreItemsId');
    // console.log('showMoreItemsElement: ', showMoreItemsElement);
    // console.log('Loading more: ', this.state.loadingMoreItems);
    if (showMoreItemsElement) {
      const { numberOfBallotItemsToDisplay, totalNumberOfBallotItems } = this.state;
      if (numberOfBallotItemsToDisplay < totalNumberOfBallotItems) {
        if (showMoreItemsElement.getBoundingClientRect().bottom <= window.innerHeight) {
          this.setState({ loadingMoreItems: true });
          this.increaseNumberOfBallotItemsToDisplay();
        }
      } else {
        this.setState({ loadingMoreItems: false });
      }
    }
  }

  setBallotItemFilterType (raceLevelFilterType, doubleFilteredBallotItemsLength) {
    window.scrollTo(0, 0);
    BallotActions.raceLevelFilterTypeSave(raceLevelFilterType);
    // Calculate totalNumberOfBallotItems given filters set
    const completionLevelFilterType = BallotStore.getCompletionLevelFilterTypeSaved() || '';
    const ballotWithItemsFromCompletionFilterType = BallotStore.getBallotByCompletionLevelFilterType(completionLevelFilterType);
    let totalNumberOfBallotItems;
    if (ballotWithItemsFromCompletionFilterType && ballotWithItemsFromCompletionFilterType.length) {
      const raceLevelFilterItems = ballotWithItemsFromCompletionFilterType.filter(item => item.race_office_level === raceLevelFilterType ||
        item.kind_of_ballot_item === raceLevelFilterType.toUpperCase());
      if (raceLevelFilterItems && raceLevelFilterItems.length) {
        totalNumberOfBallotItems = raceLevelFilterItems.length;
      } else if (completionLevelFilterType !== '') {
        const list = BallotStore.getBallotByCompletionLevelFilterType(completionLevelFilterType);
        totalNumberOfBallotItems = list.length;
      } else {
        totalNumberOfBallotItems = BallotStore.ballotLength;
      }
    }
    // console.log('setBallotItemFilterType totalNumberOfBallotItems:', totalNumberOfBallotItems);
    this.setState({
      doubleFilteredBallotItemsLength,
      isSearching: false,
      raceLevelFilterType,
      totalNumberOfBallotItems,
    });
  }

  getEmptyMessageByFilterType (completionLevelFilterType) {
    switch (completionLevelFilterType) {
      case 'filterRemaining':
        return 'You have chosen a candidate for every office and decided on all measures.';
      case 'filterDecided':
        return 'You haven\'t chosen any candidates or decided on any measures yet.';
      default:
        return '';
    }
  }

  setRaceLevelFilterType (raceLevelFilterType) {
    BallotActions.raceLevelFilterTypeSave(raceLevelFilterType);
    this.setState({ raceLevelFilterType });
  }

  memberViewedBallotHasBeenSavedOnce = (membershipOrganizationWeVoteId, googleCivicElectionId) => {
    if (!membershipOrganizationWeVoteId || !googleCivicElectionId) {
      return false;
    }
    const { memberViewedBallotHasBeenSavedOnce } = this.state;
    if (memberViewedBallotHasBeenSavedOnce[membershipOrganizationWeVoteId]) {
      return memberViewedBallotHasBeenSavedOnce[membershipOrganizationWeVoteId][googleCivicElectionId] || false;
    } else {
      return false;
    }
  };

  memberViewedBallot = (membershipOrganizationWeVoteId, googleCivicElectionId) => {
    if (!membershipOrganizationWeVoteId || !googleCivicElectionId) {
      return false;
    }
    let { memberViewedBallotHasBeenSavedOnce } = this.state;
    if (!memberViewedBallotHasBeenSavedOnce) {
      memberViewedBallotHasBeenSavedOnce = {};
    }
    if (!memberViewedBallotHasBeenSavedOnce[membershipOrganizationWeVoteId]) {
      memberViewedBallotHasBeenSavedOnce[membershipOrganizationWeVoteId] = {};
    }
    memberViewedBallotHasBeenSavedOnce[membershipOrganizationWeVoteId][googleCivicElectionId] = true;
    this.setState({
      memberViewedBallotHasBeenSavedOnce,
    });
    return true;
  };

  showUserEmptyOptions = () => {
    const { completionLevelFilterType } = this.state;
    let { raceLevelFilterType } = this.state;
    if (!raceLevelFilterType) {
      raceLevelFilterType = ''; // Make sure this is a string
    }
    const raceLevel = raceLevelFilterType.toLowerCase();
    if (raceLevel === 'all') {
      return null;
    }
    switch (completionLevelFilterType) {
      case 'filterDecided':
        return (
          <div>
            <h3>
              You have not decided on any&nbsp;
              {raceLevel}
              &nbsp;ballot items yet.
              <br />
              <br />
              Click on &quot;
              {isMobileScreenSize() ? 'Choices' : 'Remaining Choices'}
              &quot; to see the&nbsp;
              {raceLevel}
              &nbsp;ballot items you need to decide on.
            </h3>
          </div>
        );
      case 'filterRemaining':
        return (
          <div>
            <h3>
              You do not have any remaining&nbsp;
              {raceLevelFilterType.toLowerCase()}
              &nbsp;ballot items to decide on.
              <br />
              <br />
              Click on &quot;
              {isMobileScreenSize() ? 'Decided' : 'Items Decided'}
              &quot; to see the&nbsp;
              {raceLevel}
              &nbsp;ballot items you&apos;ve decided on.
            </h3>
          </div>
        );
      default:
        return null;
    }
  };

  onBallotSearch = (searchText, filteredItems) => {
    window.scrollTo(0, 0);
    const totalNumberOfBallotItems = filteredItems.length || 0;
    this.setState({
      ballotSearchResults: filteredItems,
      searchText,
      totalNumberOfBallotItems,
    });
  };

  handleToggleSearchBallot = () => {
    const { isSearching } = this.state;
    let totalNumberOfBallotItems;
    this.setState({
      isSearching: !isSearching,
    });
    if (!isSearching) {
      // If here, we are now searching
      totalNumberOfBallotItems = 0;
      this.setState({
        totalNumberOfBallotItems,
      });
    } else {
      // // If here, we are canceling a search
      const completionLevelFilterType = BallotStore.getCompletionLevelFilterTypeSaved() || 'all';
      const ballotWithItemsFromCompletionFilterType = BallotStore.getBallotByCompletionLevelFilterType(completionLevelFilterType);
      if (ballotWithItemsFromCompletionFilterType !== undefined) {
        // console.log('ballotWithItemsFromCompletionFilterType !== undefined');
        if (completionLevelFilterType === 'all') {
          this.setState({
            ballotWithAllItems: ballotWithItemsFromCompletionFilterType,
            ballotWithItemsFromCompletionFilterType,
          });
        } else {
          const ballotWithAllItems = BallotStore.getBallotByCompletionLevelFilterType('all');
          this.setState({
            ballotWithAllItems,
            ballotWithItemsFromCompletionFilterType,
          });
        }
      }
    }
  };

  startTimerToRetrieveVoter = () => {
    let { numberOfVoterRetrieveAttempts } = this.state;
    // console.log('startTimerToRetrieveVoter, numberOfVoterRetrieveAttempts:', numberOfVoterRetrieveAttempts);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      VoterActions.voterRetrieve();
      numberOfVoterRetrieveAttempts += 1;
      this.setState({
        numberOfVoterRetrieveAttempts,
      });
    }, delayBeforeVoterRefreshCall);
  };

  increaseNumberOfBallotItemsToDisplay = () => {
    let { numberOfBallotItemsToDisplay } = this.state;
    // console.log('Number of ballot items before increment: ', numberOfBallotItemsToDisplay);
    numberOfBallotItemsToDisplay += 5;
    // console.log('Number of ballot items after increment: ', numberOfBallotItemsToDisplay);

    this.ballotItemTimer = setTimeout(() => {
      this.setState({
        numberOfBallotItemsToDisplay,
      });
    }, 500);
  }

  toggleSelectBallotModal (destinationUrlForHistoryPush = '', hideAddressEdit = false, hideElections = false) {
    const { showSelectBallotModal } = this.state;
    // console.log('Ballot toggleSelectBallotModal, destinationUrlForHistoryPush:', destinationUrlForHistoryPush, ', showSelectBallotModal:', showSelectBallotModal);
    if (showSelectBallotModal && destinationUrlForHistoryPush && destinationUrlForHistoryPush !== '') {
      historyPush(destinationUrlForHistoryPush);
    } else {
      // console.log('Ballot toggleSelectBallotModal, BallotActions.voterBallotListRetrieve()');
      BallotActions.voterBallotListRetrieve(); // Retrieve a list of ballots for the voter from other elections
    }

    AppActions.setShowSelectBallotModal(!showSelectBallotModal, hideAddressEdit, hideElections);
  }

  // Needed to scroll to anchor tags based on hash in url (as done for bookmarks)
  hashLinkScroll () {
    const { hash } = window.location;
    if (hash !== '') {
      // Push onto callback queue so it runs after the DOM is updated,
      // this is required when navigating from a different page so that
      // the element is rendered on the page before trying to getElementById.
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);

        if (element) {
          const positionY = element.offsetTop;
          if (isMobile()) {
            window.scrollTo(0, positionY + 250);
          } else {
            window.scrollTo(0, positionY + 196);
          }
        }
      }, 0);
    }
  }

  toggleExpandBallotItemDetails (selectedBallotItemId) {
    if (this.ballotItems[selectedBallotItemId] &&
        this.ballotItems[selectedBallotItemId].ballotItem &&
        this.ballotItems[selectedBallotItemId].ballotItem.toggleExpandDetails) {
      this.ballotItems[selectedBallotItemId].ballotItem.toggleExpandDetails(true);
    }
  }

  ballotItemLinkHasBeenClicked (selectedBallotItemId) {
    const { ballotWithItemsFromCompletionFilterType, ballotWithAllItems } = this.state;
    const ballotItem = ballotWithItemsFromCompletionFilterType.find(item => item.we_vote_id === selectedBallotItemId);
    // If the ballot item exists in the array of ballot items filtered by the completion filter type
    if (ballotItem) {
      const raceCategoryDisplayText = mapCategoryFilterType(ballotItem.race_office_level || ballotItem.kind_of_ballot_item);
      // console.log('ballotItemLinkHasBeenClicked raceLevelFilterType ballotItem=True:', raceCategoryDisplayText);
      if (raceCategoryDisplayText) {
        this.setState({
          raceLevelFilterType: raceCategoryDisplayText,
        }, () => this.toggleExpandBallotItemDetails(selectedBallotItemId));
      }
    } else {
      // The ballot item was not found in the array of ballot items filtered by completion filter type
      const ballotItemFromAll = ballotWithAllItems.find(item => item.we_vote_id === selectedBallotItemId);
      const raceCategoryDisplayText = mapCategoryFilterType(ballotItemFromAll.race_office_level || ballotItemFromAll.kind_of_ballot_item);
      // console.log('ballotItemLinkHasBeenClicked raceLevelFilterType ballotItem=False:', raceCategoryDisplayText);
      BallotActions.completionLevelFilterTypeSave('filterAllBallotItems');
      BallotActions.raceLevelFilterTypeSave(raceCategoryDisplayText);
      if (raceCategoryDisplayText) {
        this.setState({
          raceLevelFilterType: raceCategoryDisplayText,
        }, () => this.toggleExpandBallotItemDetails(selectedBallotItemId));
      }
    }
  }

  // componentDidCatch (error, info) {
  //   // We should get this information to Splunk!
  //   console.error('Ballot caught error: ', `${error} with info: `, info);
  // }

  updateOfficeDisplayUnfurledTracker (weVoteId, status) {
    const { ballotItemUnfurledTracker } = this.state;
    const newBallotItemUnfurledTracker = { ...ballotItemUnfurledTracker, [weVoteId]: status };
    BallotActions.voterBallotItemOpenOrClosedSave(newBallotItemUnfurledTracker);
    this.setState({
      ballotItemUnfurledTracker: newBallotItemUnfurledTracker,
    });
  }

  render () {
    renderLog('Ballot');  // Set LOG_RENDER_EVENTS to log all renders
    const ballotBaseUrl = '/ballot';
    const { classes } = this.props;
    const {
      ballotWithItemsFromCompletionFilterType, showFilterTabs, doubleFilteredBallotItemsLength, completionLevelFilterType,
      ballotHeaderUnpinned, isSearching, ballotWithAllItems, ballotSearchResults, raceLevelFilterItemsInThisBallot,
      loadingMoreItems, numberOfBallotItemsToDisplay, searchText, totalNumberOfBallotItems,
    } = this.state;
    let { raceLevelFilterType } = this.state;
    if (!raceLevelFilterType) {
      raceLevelFilterType = 'All'; // Make sure this is a string
    }
    // console.log(ballotWithAllItems);
    // console.log('window.innerWidth:', window.innerWidth);
    const textForMapSearch = VoterStore.getTextForMapSearch();

    if (!ballotWithItemsFromCompletionFilterType) {
      return (
        <DelayedLoad showLoadingText waitBeforeShow={2000}>
          <div className="ballot container-fluid well u-stack--md u-inset--md">
            <div className="ballot__header" style={{ marginTop: `${isCordova() ? '100px' : 'undefined'}` }}>
              <BallotLoadingWrapper>
                If your ballot does not appear momentarily,
                {' '}
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <Link
                  // since we use a button as the component, we can disable that es-lint rule
                  component="button"
                  id="ballotIfBallotDoesNotAppear"
                  onClick={() => this.toggleSelectBallotModal('', false, true)}
                  style={{ color: 'rgb(6, 95, 212)' }}
                >
                  please click here to enter an address
                </Link>
                {' '}
                in the United States of America where you are registered to vote.
              </BallotLoadingWrapper>
            </div>
          </div>
        </DelayedLoad>
      );
    }

    const voterAddressMissing = this.state.location === null;

    // const ballot_caveat = BallotStore.ballotProperties.ballot_caveat; // ballotProperties might be undefined
    const electionName = BallotStore.currentBallotElectionName || '';
    const electionDayText = BallotStore.currentBallotElectionDate;
    const sourcePollingLocationWeVoteId = BallotStore.currentBallotPollingLocationSource;
    const ballotReturnedAdminEditUrl = `${webAppConfig.WE_VOTE_SERVER_ROOT_URL}b/${sourcePollingLocationWeVoteId}/list_edit_by_polling_location/?google_civic_election_id=${VoterStore.electionId()}&state_code=`;
    // console.log('electionName: ', electionName, ', electionDayText: ', electionDayText);

    const emptyBallotButton = completionLevelFilterType !== 'none' && !voterAddressMissing ? (
      <span>
        {/* <Link to={ballotBaseUrl}>
          <Button variant="primary">View Full Ballot</Button>
        </Link> */}
      </span>
    ) : (
      <div className="container-fluid well u-stack--md u-inset--md">
        <Helmet title="Enter Your Address - We Vote" />
        <h3 className="h3">
          Enter address where you are registered to vote
        </h3>
        <div>
          <AddressBox {...this.props} saveUrl={ballotBaseUrl} />
        </div>
      </div>
    );

    // console.log('ballotWithItemsFromCompletionFilterType: ', ballotWithItemsFromCompletionFilterType);
    // Was: ballotWithItemsFromCompletionFilterType
    const emptyBallot = ballotWithAllItems.length === 0 ? (
      <DelayedLoad waitBeforeShow={3000}>
        <div>
          <h3 className="text-center">{this.getEmptyMessageByFilterType(completionLevelFilterType)}</h3>
          {emptyBallotButton}
        </div>
      </DelayedLoad>
    ) : null;

    const electionDayTextFormatted = electionDayText ? moment(electionDayText).format('MMM Do, YYYY') : '';
    const electionDayTextObject = <span>{electionDayTextFormatted}</span>;
    // console.log('electionName: ', electionName, ', electionDayTextFormatted: ', electionDayTextFormatted);

    const inRemainingDecisionsMode = completionLevelFilterType === 'filterRemaining';
    // console.log('inRemainingDecisionsMode: ', inRemainingDecisionsMode);

    if (ballotWithItemsFromCompletionFilterType.length === 0 && inRemainingDecisionsMode) {
      historyPush(this.state.pathname);
    }

    let numberOfBallotItemsDisplayed = 0;
    let showLoadingText = true;
    let searchTextString = '';
    return (
      <div className="ballot_root">
        <div className={`ballot__heading ${ballotHeaderUnpinned && isWebApp() ? 'ballot__heading__unpinned' : ''}`}>
          <div className="page-content-container" style={{ marginTop: `${cordovaBallotFilterTopMargin()}` }}>
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12">
                  <Helmet title="Ballot - We Vote" />
                  <header className="ballot__header__group">
                    <BallotTitleHeader
                      electionName={electionName}
                      electionDayTextObject={electionDayTextObject}
                      toggleSelectBallotModal={() => this.toggleSelectBallotModal('', true, false)}
                      scrolled={this.state.ballotHeaderUnpinned}
                    />
                  </header>

                  { textForMapSearch || ballotWithItemsFromCompletionFilterType.length > 0 ? (
                    <div className="ballot__filter__container">
                      { showBallotDecisionsTabs() && (
                        <React.Fragment>
                          <div className="ballot__filter d-print-none">
                            <BallotDecisionsTabs
                              completionLevelFilterType={BallotStore.cleanCompletionLevelFilterType(completionLevelFilterType)}
                              ballotLength={BallotStore.ballotLength}
                              ballotLengthRemaining={BallotStore.ballotRemainingChoicesLength}
                            />
                          </div>
                          <hr className="ballot-header-divider" />
                        </React.Fragment>
                      )}
                      <BallotFilterRow showFilterTabs={showFilterTabs}>
                        <div className="ballot__item-filter-tabs" ref={(chips) => { this.chipContainer = chips; }}>
                          { ballotWithItemsFromCompletionFilterType.length ? (
                            <React.Fragment>
                              <BallotSearch
                                alwaysOpen={!showFilterTabs}
                                isSearching={isSearching}
                                items={ballotWithAllItems}
                                onBallotSearch={this.onBallotSearch}
                                onToggleSearch={this.handleToggleSearchBallot}
                              />
                              { showFilterTabs && (
                                <div
                                  className="ballot_filter_btns"
                                  id="ballotBadgeMobileAndDesktop-All"
                                  key="filterTypeAll"
                                  onClick={() => this.setBallotItemFilterType('All', ballotWithItemsFromCompletionFilterType.length)}
                                >
                                  <Chip variant="outlined"
                                    color={(raceLevelFilterType === 'All' && !isSearching) ? 'primary' : 'default'}
                                    className="btn_ballot_filter"
                                    classes={{ root: classes.chipRootAll, label: classes.chipLabel, outlinedPrimary: (raceLevelFilterType === 'All' && !isSearching) ? classes.chipOutlined : null }}
                                    label="All"
                                  />
                                </div>
                              )}
                              { showFilterTabs && (
                                BALLOT_ITEM_FILTER_TYPES.map((oneTypeOfBallotItem) => {
                                  const allBallotItemsByFilterType = this.state.ballotWithAllItems.filter((item) => {
                                    if (oneTypeOfBallotItem === 'Measure') {
                                      return item.kind_of_ballot_item === 'MEASURE';
                                    } else {
                                      return oneTypeOfBallotItem === item.race_office_level;
                                    }
                                  });
                                  if (allBallotItemsByFilterType.length) {
                                    const ballotItemsByFilterType = ballotWithItemsFromCompletionFilterType.filter((item) => {
                                      if (oneTypeOfBallotItem === 'Measure') {
                                        return item.kind_of_ballot_item === 'MEASURE';
                                      } else {
                                        return oneTypeOfBallotItem === item.race_office_level;
                                      }
                                    });
                                    const ballotChip = (
                                      <Chip variant="outlined"
                                        color={(oneTypeOfBallotItem === raceLevelFilterType && !isSearching) ? 'primary' : 'default'}
                                        className="btn_ballot_filter"
                                        classes={{ root: classes.chipRoot, label: classes.chipLabel, outlinedPrimary: (oneTypeOfBallotItem === raceLevelFilterType && !isSearching) ? classes.chipOutlined : null }}
                                        label={oneTypeOfBallotItem}
                                      />
                                    );
                                    return (
                                      <div key={oneTypeOfBallotItem}>
                                        <div className="u-show-mobile">
                                          <div
                                            className="ballot_filter_btns"
                                            id={`ballotBadgeMobile-${oneTypeOfBallotItem}`}
                                            onClick={() => this.setBallotItemFilterType(oneTypeOfBallotItem, ballotItemsByFilterType.length)}
                                          >
                                            {ballotChip}
                                          </div>
                                        </div>
                                        <div className="u-show-desktop-tablet">
                                          <div className="ballot_filter_btns">
                                            <Badge
                                              badgeContent={ballotItemsByFilterType.length}
                                              classes={{ badge: classes.badge, colorPrimary: classes.badgeColorPrimary }}
                                              color={(oneTypeOfBallotItem === raceLevelFilterType && !isSearching) ? 'primary' : 'default'}
                                              id={`ballotBadgeDesktop-${oneTypeOfBallotItem}`}
                                              invisible={ballotItemsByFilterType.length === 0}
                                              onClick={() => this.setBallotItemFilterType(oneTypeOfBallotItem, ballotItemsByFilterType.length)}
                                            >
                                              {ballotChip}
                                            </Badge>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  } else {
                                    return null;
                                  }
                                })
                              )
                            }
                            </React.Fragment>
                          ) : null
                          }
                        </div>
                      </BallotFilterRow>
                    </div>
                  ) : null
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="page-content-container">
          <div className="container-fluid">
            <Wrapper padTop={cordovaScrollablePaneTopPadding()}>
              {emptyBallot}
              {/* eslint-disable-next-line no-nested-ternary */}
              <div className={showBallotDecisionsTabs() ? 'row ballot__body' : isWebApp() ? 'row ballot__body__no-decision-tabs' : undefined}>
                <BrowserPushMessage incomingProps={this.props} />
                {ballotWithItemsFromCompletionFilterType.length > 0 ? (
                  <BallotStatusMessage
                    ballotLocationChosen
                    googleCivicElectionId={this.state.googleCivicElectionId}
                  />
                ) : null
                }
                <div className="col-sm-12 col-lg-9" id="ballotRoute-topOfBallot">
                  {(isSearching && searchText) && (
                    <SearchTitle>
                      Searching for &quot;
                      {searchText}
                      &quot;
                    </SearchTitle>
                  )}
                  {!isSearching && (
                    <span className="u-show-desktop-tablet">
                      <DelayedLoad waitBeforeShow={2000}>
                        <CompleteYourProfile />
                      </DelayedLoad>
                    </span>
                  )}
                  <BallotListWrapper>
                    {/* The rest of the ballot items */}
                    <div className="BallotList">
                      {(isSearching && ballotSearchResults && ballotSearchResults.length === 0) && (
                        <SearchResultsEmpty>
                          Please enter new search terms to find results.
                        </SearchResultsEmpty>
                      )}
                      {(isSearching ? ballotSearchResults : ballotWithItemsFromCompletionFilterType).map((item) => {
                        // Ballot limited by items by race_office_level = (Federal, State, Local) or kind_of_ballot_item = (Measure)
                        // console.log('raceLevelFilterType:', raceLevelFilterType, ', item:', item);
                        if ((raceLevelFilterType === 'All' || isSearching ||
                          (item.kind_of_ballot_item === raceLevelFilterType.toUpperCase()) ||
                          raceLevelFilterType === item.race_office_level)) {
                          // console.log('Ballot item for BallotItemCompressed:', item);
                          // {...item}
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
                          return (
                            <DelayedLoad
                              key={key}
                              showLoadingText={showLoadingText}
                              waitBeforeShow={500}
                            >
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
                                    })
                                    }
                                  </SearchResultsFoundInExplanation>
                                )}
                                <BallotItemCompressed
                                  isMeasure={item.kind_of_ballot_item === TYPES.MEASURE}
                                  ballotItemDisplayName={item.ballot_item_display_name}
                                  candidateList={item.candidate_list}
                                  candidatesToShowForSearchResults={item.candidatesToShowForSearchResults}
                                  weVoteId={item.we_vote_id}
                                />
                              </>
                            </DelayedLoad>
                          );
                        } else {
                          return null;
                        }
                      })
                      }
                      {doubleFilteredBallotItemsLength === 0 &&
                        this.showUserEmptyOptions()
                      }
                      {!!(loadingMoreItems && totalNumberOfBallotItems && (numberOfBallotItemsToDisplay < totalNumberOfBallotItems)) && (
                        <LoadingItemsWheel>
                          <CircularProgress />
                        </LoadingItemsWheel>
                      )}
                      {!!(totalNumberOfBallotItems) && (
                        <ShowMoreItems id="showMoreItemsId" onClick={() => this.increaseNumberOfBallotItemsToDisplay()}>
                          Displaying
                          {' '}
                          {numberOfBallotItemsDisplayed}
                          {' '}
                          of
                          {' '}
                          {totalNumberOfBallotItems}
                        </ShowMoreItems>
                      )}
                      {!isSearching && (
                        <BallotSummaryFooter
                          activeRaceItem={raceLevelFilterType}
                          displayTitle
                          displaySubtitles
                          rawUrlVariablesString={this.props.location.search}
                          ballotWithAllItemsByFilterType={this.state.ballotWithItemsFromCompletionFilterType}
                          ballotItemLinkHasBeenClicked={this.ballotItemLinkHasBeenClicked}
                          raceLevelFilterItemsInThisBallot={raceLevelFilterItemsInThisBallot}
                          setActiveRaceItem={type => this.setRaceLevelFilterType(type)}
                        />
                      )}
                    </div>
                  </BallotListWrapper>
                  {/* Show links to this candidate in the admin tools */}
                  { (this.state.voter && sourcePollingLocationWeVoteId) && (this.state.voter.is_admin || this.state.voter.is_verified_volunteer) ? (
                    <span className="u-wrap-links d-print-none">
                      <span>Admin:</span>
                      <OpenExternalWebSite
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
                    </span>
                  ) : null
                }
                </div>

                { ballotWithItemsFromCompletionFilterType.length === 0 || isCordova() ?
                  null : (
                    <div className="col-lg-3 d-none d-lg-block sidebar-menu">
                      <BallotSideBar
                        activeRaceItem={raceLevelFilterType}
                        displayTitle
                        displaySubtitles
                        rawUrlVariablesString={this.props.location.search}
                        ballotWithAllItemsByFilterType={this.state.ballotWithItemsFromCompletionFilterType}
                        ballotItemLinkHasBeenClicked={this.ballotItemLinkHasBeenClicked}
                        raceLevelFilterItemsInThisBallot={raceLevelFilterItemsInThisBallot}
                      />
                    </div>
                  )
                }
              </div>
            </Wrapper>
          </div>
        </div>
      </div>
    );
  }
}

const BallotListWrapper = styled.div`
  padding-bottom: 40px;
`;

const BallotLoadingWrapper = styled.div`
  font-size: 20px;
  padding-top: 20px;
  text-align: center;
`;

// If we want to turn off filter tabs navigation bar:  ${({ showFilterTabs }) => !showFilterTabs && 'height: 0;'}
const BallotFilterRow = styled.div`
  display: flex;
`;

const SearchResultsFoundInExplanation = styled.div`
  background-color: #C2DCE8;
  color: #0E759F;
  padding: 12px !important;
`;

const LoadingItemsWheel = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ShowMoreItems = styled.div`
  font-size: 18px;
  text-align: right;
  user-select: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding-top: 5px;
    padding-bottom: 3px;
  }
  @media print{
    display: none;
  }
`;

const SearchResultsEmpty = styled.div`
  font-size: 20px;
`;

const SearchTitle = styled.div`
  font-size: 24px;
  margin-top: 12px;
  margin-bottom: 12px;
`;

const Wrapper = styled.div`
  padding-top: ${({ padTop }) => padTop};
`;

const styles = theme => ({
  badge: {
    top: 13,
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
  unselectedBadgeColorPrimary: {
    background: 'rgba(0, 0, 0, .2)',
    color: '#333',
  },
  chipRoot: {
    height: 22.5,
  },
  chipRootAll: {
    height: 22.5,
    width: 54,
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
    fontSize: 13,
    paddingLeft: 0,
    [theme.breakpoints.up('md')]: {
      fontSize: 14,
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

export default withStyles(styles)(Ballot);
