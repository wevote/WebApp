import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import moment from 'moment';
import styled from 'styled-components';
import Badge from '@material-ui/core/Badge';
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';
import AddressBox from '../../components/AddressBox';
import AnalyticsActions from '../../actions/AnalyticsActions';
import BallotActions from '../../actions/BallotActions';
import BallotElectionList from '../../components/Ballot/BallotElectionList';
import BallotDecisionsTabs from '../../components/Navigation/BallotDecisionsTabs';
import BallotItemCompressed from '../../components/Ballot/BallotItemCompressed';
import BallotItemReadyToVote from '../../components/Ballot/BallotItemReadyToVote';
import BallotIntroModal from '../../components/Ballot/BallotIntroModal';
import BallotSideBar from '../../components/Navigation/BallotSideBar';
import BallotSearch from '../../components/Ballot/BallotSearch';
import BallotStatusMessage from '../../components/Ballot/BallotStatusMessage';
import BallotStore from '../../stores/BallotStore';
import BallotSummaryModal from '../../components/Ballot/BallotSummaryModal';
import BrowserPushMessage from '../../components/Widgets/BrowserPushMessage';
import cookies from '../../utils/cookies';
import {
  historyPush, isCordova, isWebApp,
} from '../../utils/cordovaUtils';
import ElectionActions from '../../actions/ElectionActions';
import ElectionStore from '../../stores/ElectionStore';
// import HeaderBar from '../../components/Navigation/HeaderBar';
import isMobile from '../../utils/isMobile';
import LocationGuess from './LocationGuess';
import mapCategoryFilterType from '../../utils/map-category-filter-type';
import IssueActions from '../../actions/IssueActions';
import IssueStore from '../../stores/IssueStore';
import OpenExternalWebSite from '../../utils/OpenExternalWebSite';
import OrganizationActions from '../../actions/OrganizationActions';
import { renderLog } from '../../utils/logging';
import SupportActions from '../../actions/SupportActions';
import SupportStore from '../../stores/SupportStore';
import VoterActions from '../../actions/VoterActions';
import VoterConstants from '../../constants/VoterConstants';
import VoterGuideStore from '../../stores/VoterGuideStore';
import AppStore from '../../stores/AppStore';
import VoterStore from '../../stores/VoterStore';
import webAppConfig from '../../config';
import { formatVoterBallotList, checkShouldUpdate } from './utils';
import SelectBallotModal from '../../components/Ballot/SelectBallotModal';
import AppActions from '../../actions/AppActions';
// import IconButton from '@material-ui/core/IconButton';
// import PlaceIcon from '@material-ui/core/SvgIcon/SvgIcon';


// Related to WebApp/src/js/components/VoterGuide/VoterGuideBallot.jsx
const BALLOT_ITEM_FILTER_TYPES = ['Federal', 'State', 'Measure', 'Local'];

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
      hideIntroModalFromUrl: 0,
      hideIntroModalFromCookie: 0,
      lastHashUsedInLinkScroll: '',
      measureForModal: {
        voter_guides_to_follow_for_latest_ballot_item: [],
        position_list: [],
      },
      mounted: false,
      showBallotIntroModal: false,
      showSelectBallotModal: false,
      showBallotSummaryModal: false,
      voterBallotList: [],
      showFilterTabs: false,
      ballotHeaderUnpinned: false,
      isSearching: false,
      ballotSearchResults: [],
    };

    this.ballotItems = {};
    this.ballotItemLinkHasBeenClicked = this.ballotItemLinkHasBeenClicked.bind(this);
    this.toggleBallotIntroModal = this.toggleBallotIntroModal.bind(this);
    this.toggleBallotSummaryModal = this.toggleBallotSummaryModal.bind(this);
    this.toggleSelectBallotModal = this.toggleSelectBallotModal.bind(this);
    this.updateOfficeDisplayUnfurledTracker = this.updateOfficeDisplayUnfurledTracker.bind(this);
  }

  componentDidMount () {
    const ballotBaseUrl = '/ballot';
    // console.log("Ballot componentDidMount");

    const hideIntroModalFromUrl = this.props.location.query ? this.props.location.query.hide_intro_modal : 0;
    const hideIntroModalFromCookie = cookies.getItem('hide_intro_modal') || 0;
    const waitUntilVoterSignInCompletes = this.props.location.query ? this.props.location.query.wait_until_voter_sign_in_completes : 0;
    const issuesVoterCanFollow = IssueStore.getIssuesVoterCanFollow(); // Check to see if the issues have been retrieved yet
    const issuesVoterCanFollowExist = issuesVoterCanFollow && issuesVoterCanFollow.length;
    // console.log("Ballot componentDidMount issuesVoterCanFollowExist: ", issuesVoterCanFollowExist);
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));

    if (waitUntilVoterSignInCompletes !== undefined ||
        hideIntroModalFromCookie ||
        hideIntroModalFromUrl ||
        !issuesVoterCanFollowExist) {
      this.setState({
        componentDidMountFinished: true,
        mounted: true,
        showBallotIntroModal: false,
      });
    } else {
      // hide_intro_modal is the default now
      // showBallotIntroModal: !VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_MODAL_SHOWN),
      this.setState({
        componentDidMountFinished: true,
        mounted: true,
        showBallotIntroModal: false,
      });
    }

    const completionLevelFilterType = BallotStore.getCompletionLevelFilterTypeSaved() || 'all';
    const ballotWithItemsFromCompletionFilterType = BallotStore.getBallotByCompletionLevelFilterType(completionLevelFilterType);
    if (ballotWithItemsFromCompletionFilterType !== undefined) {
      // console.log("ballotWithItemsFromCompletionFilterType !== undefined");
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

    // console.log("googleCivicElectionIdFromUrl: ", googleCivicElectionIdFromUrl);
    let ballotReturnedWeVoteId = this.props.params.ballot_returned_we_vote_id || '';
    ballotReturnedWeVoteId = ballotReturnedWeVoteId === 'none' ? '' : ballotReturnedWeVoteId;

    // console.log("this.props.params.ballot_returned_we_vote_id: ", this.props.params.ballot_returned_we_vote_id);
    let ballotLocationShortcut = this.props.params.ballot_location_shortcut || '';
    ballotLocationShortcut = ballotLocationShortcut.trim();
    ballotLocationShortcut = ballotLocationShortcut === 'none' ? '' : ballotLocationShortcut;
    let googleCivicElectionId = 0;

    // console.log("componentDidMount, BallotStore.ballotProperties: ", BallotStore.ballotProperties);
    if (googleCivicElectionIdFromUrl !== 0) {
      googleCivicElectionIdFromUrl = parseInt(googleCivicElectionIdFromUrl, 10);

      // googleCivicElectionId = googleCivicElectionIdFromUrl;
    } else if (BallotStore.ballotProperties && BallotStore.ballotProperties.google_civic_election_id) {
      googleCivicElectionId = BallotStore.ballotProperties.google_civic_election_id;
    }

    // console.log("ballotReturnedWeVoteId: ", ballotReturnedWeVoteId, ", ballotLocationShortcut:", ballotLocationShortcut, ", googleCivicElectionIdFromUrl: ", googleCivicElectionIdFromUrl);
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
      // console.log("if (BallotStore.ballotProperties && BallotStore.ballotProperties.ballot_found === false");
      historyPush('/settings/location');
    } else if (ballotWithItemsFromCompletionFilterType === undefined) {
      // console.log("WebApp doesn't know the election or have ballot data, so ask the API server to return best guess");
      BallotActions.voterBallotItemsRetrieve(0, '', '');
    }

    // console.log("Ballot, googleCivicElectionId: ", googleCivicElectionId, ", ballotLocationShortcut: ", ballotLocationShortcut, "ballotReturnedWeVoteId: ", ballotReturnedWeVoteId);
    // console.log("VoterStore.election_id: ", VoterStore.electionId());
    if (googleCivicElectionId || ballotLocationShortcut || ballotReturnedWeVoteId) {
      // console.log("CALLING IssueActions.issuesRetrieveForElection");

      if (IssueStore.getPreviousGoogleCivicElectionId() < 1) {
        IssueActions.issuesRetrieveForElection(googleCivicElectionId, ballotLocationShortcut, ballotReturnedWeVoteId);
      }

      this.setState({
        issuesRetrievedFromGoogleCivicElectionId: googleCivicElectionId,
        issuesRetrievedFromBallotReturnedWeVoteId: ballotReturnedWeVoteId,
        issuesRetrievedFromBallotLocationShortcut: ballotLocationShortcut,
      });
    }
    // We need a ballotStoreListener here because we want the ballot to display before positions are received
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    // NOTE: voterAllPositionsRetrieve and positionsCountForAllBallotItems are also called in SupportStore when voterAddressRetrieve is received,
    // so we get duplicate calls when you come straight to the Ballot page. There is no easy way around this currently.
    SupportActions.voterAllPositionsRetrieve();

    // June 2018: Avoid hitting this same api multiple times, if we already have the data
    if (!SupportStore.isSupportAlreadyInCache()) {
      SupportActions.positionsCountForAllBallotItems(googleCivicElectionId);
    }

    BallotActions.voterBallotListRetrieve(); // Retrieve a list of ballots for the voter from other elections
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onBallotStoreChange.bind(this));
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));

    // Once a voter hits the ballot, they have gone through orientation
    cookies.setItem('show_full_navigation', '1', Infinity, '/');

    this.electionListListener = ElectionStore.addListener(this.onElectionStoreChange.bind(this));
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
      hideIntroModalFromUrl,
      hideIntroModalFromCookie,
      location,
      pathname,
      raceLevelFilterType: BallotStore.getRaceLevelFilterTypeSaved() || 'Federal',
      waitUntilVoterSignInCompletes,
    });

    const { hash } = location;
    if (location && hash) {
      // this.hashLinkScroll();
      this.setState({ lastHashUsedInLinkScroll: hash });
    }
  }

  componentWillReceiveProps (nextProps) {
    // console.log("Ballot componentWillReceiveProps");

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

      if (googleCivicElectionId && googleCivicElectionId !== 0) {
        AnalyticsActions.saveActionBallotVisit(googleCivicElectionId);
      } else {
        AnalyticsActions.saveActionBallotVisit(VoterStore.electionId());
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
    const { foundFirstRaceLevel } = this.state;
    let { raceLevelFilterType } = this.state;
    if (!raceLevelFilterType) {
      raceLevelFilterType = ''; // Make sure this is a string
    }
    if (this.state.lastHashUsedInLinkScroll && this.state.lastHashUsedInLinkScroll !== prevState.lastHashUsedInLinkScroll) {
      this.hashLinkScroll();
    }
    // If we haven't found our default race level, run this check
    if (this.state.ballotWithAllItems && this.state.ballotWithAllItems.length && !foundFirstRaceLevel) {
      const { ballotWithAllItems } = this.state;
      const raceLevelFilterItems = ballotWithAllItems.filter(item => item.race_office_level === raceLevelFilterType ||
        item.kind_of_ballot_item === raceLevelFilterType.toUpperCase());
      // If there are items mapped to the current race level filter, set foundFirstRaceLevel to true
      // so we don't have to re-run this check
      if (raceLevelFilterItems.length) {
        this.setState({
          foundFirstRaceLevel: true,
          showFilterTabs: raceLevelFilterItems.length !== ballotWithAllItems.length,
        });
      } else {
        // If there are no items mapped to the current race level filter, set the raceLevelFilterType
        // to the next item in BALLOT_ITEM_FILTER_TYPES
        const raceLevelIdx = BALLOT_ITEM_FILTER_TYPES.indexOf(raceLevelFilterType);
        // console.log('componentDidUpdate raceLevelFilterType:', raceLevelFilterType, ', raceLevelIdx: ', raceLevelIdx);
        if (raceLevelIdx >= 0) {
          this.setState({ raceLevelFilterType: BALLOT_ITEM_FILTER_TYPES[raceLevelIdx + 1] });
        } else {
          // If the raceLevelFilterType is not a valid type, turn off the tabs and set foundFirstRaceLevel to stop cycling through
          this.setState({
            foundFirstRaceLevel: true,
            showFilterTabs: false,
          });
        }
      }
    }
  }

  componentWillUnmount () {
    // console.log("Ballot componentWillUnmount");
    this.setState({
      mounted: false,
    });

    this.ballotStoreListener.remove();
    this.electionListListener.remove();
    this.supportStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.voterStoreListener.remove();
    this.appStoreListener.remove();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  onAppStoreChange () {
    this.setState({
      ballotHeaderUnpinned: AppStore.getScrolledDown(),
      showSelectBallotModal: AppStore.showSelectBallotModal(),
    });
  }

  onVoterStoreChange () {
    // console.log("Ballot.jsx onVoterStoreChange");
    if (this.state.mounted) {
      let considerOpeningBallotIntroModal = true;
      if (this.state.waitUntilVoterSignInCompletes) {
        considerOpeningBallotIntroModal = false;
        if (this.state.voter && this.state.voter.is_signed_in) {
          considerOpeningBallotIntroModal = true;
          this.setState({
            waitUntilVoterSignInCompletes: undefined,
          });
          // console.log("onVoterStoreChange, about to historyPush(this.state.pathname):", this.state.pathname);
          historyPush(this.state.pathname);
        }
      }

      const issuesVoterCanFollow = IssueStore.getIssuesVoterCanFollow(); // Check to see if the issues have been retrieved yet
      const issuesVoterCanFollowExist = issuesVoterCanFollow && issuesVoterCanFollow.length;
      // console.log("Ballot onVoterStoreChange issuesVoterCanFollowExist: ", issuesVoterCanFollowExist);

      if (this.state.hideIntroModalFromCookie || this.state.hideIntroModalFromUrl || !issuesVoterCanFollowExist) {
        considerOpeningBallotIntroModal = false;
      }

      // console.log("Ballot.jsx onVoterStoreChange VoterStore.getVoter: ", VoterStore.getVoter());
      if (considerOpeningBallotIntroModal) {
        // hide_intro_modal is the default now
        // showBallotIntroModal: !VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_MODAL_SHOWN),
        this.setState({
          voter: VoterStore.getVoter(),
          showBallotIntroModal: false,
          googleCivicElectionId: parseInt(VoterStore.electionId(), 10),
        });
      } else {
        this.setState({
          voter: VoterStore.getVoter(),
          googleCivicElectionId: parseInt(VoterStore.electionId(), 10),
        });
      }
    }
  }

  onBallotStoreChange () {
    // console.log("Ballot.jsx onBallotStoreChange");
    const completionLevelFilterType = BallotStore.getCompletionLevelFilterTypeSaved() || '';
    const { ballot, ballotProperties } = BallotStore;
    const {
      mounted, issuesRetrievedFromGoogleCivicElectionId,
      issuesRetrievedFromBallotReturnedWeVoteId, issuesRetrievedFromBallotLocationShortcut,
    } = this.state;
    let { raceLevelFilterType } = this.state;
    if (!raceLevelFilterType) {
      raceLevelFilterType = ''; // Make sure this is a string
    }

    if (mounted) {
      if (ballotProperties && ballotProperties.ballot_found && ballot && ballot.length === 0) {
        // Ballot is found but ballot is empty. We want to stay put.
        // console.log("onBallotStoreChange: ballotWithItemsFromCompletionFilterType is empty");
      } else {
        const ballotWithItemsFromCompletionFilterType = BallotStore.getBallotByCompletionLevelFilterType(completionLevelFilterType);
        this.setState({
          ballotWithAllItems: BallotStore.getBallotByCompletionLevelFilterType('all'),
          ballotWithItemsFromCompletionFilterType,
        });
        if (ballotWithItemsFromCompletionFilterType && ballotWithItemsFromCompletionFilterType.length) {
          const raceLevelFilterItems = ballotWithItemsFromCompletionFilterType.filter(item => item.race_office_level === raceLevelFilterType ||
            item.kind_of_ballot_item === raceLevelFilterType.toUpperCase());
          this.setState({ doubleFilteredBallotItemsLength: raceLevelFilterItems.length });
        }
      }
    }
    if (ballotProperties) {
      // If the incoming googleCivicElectionId, ballotReturnedWeVoteId, or ballotLocationShortcut are different, call issuesRetrieveForElection
      if (parseInt(ballotProperties.google_civic_election_id, 10) !== issuesRetrievedFromGoogleCivicElectionId ||
          ballotProperties.ballot_returned_we_vote_id !== issuesRetrievedFromBallotReturnedWeVoteId ||
          ballotProperties.ballot_location_shortcut !== issuesRetrievedFromBallotLocationShortcut) {
        // console.log("onBallotStoreChange, Calling issuesRetrieveForElection");

        if (IssueStore.getPreviousGoogleCivicElectionId() < 1) {
          IssueActions.issuesRetrieveForElection(ballotProperties.google_civic_election_id, ballotProperties.ballot_location_shortcut, ballotProperties.ballot_returned_we_vote_id);
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
      });
    }
    this.setState({
      ballotElectionList: BallotStore.ballotElectionList(),
      completionLevelFilterType,
    });

    if (this.state.ballotLength !== BallotStore.ballotLength) {
      this.setState({
        ballotLength: BallotStore.ballotLength,
        // raceLevelFilterType: 'Federal',
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
      // console.log("current tracker in Ballotstore", BallotStore.current_ballot_item_unfurled_tracker)
      this.setState({
        ballotItemUnfurledTracker: BallotStore.currentBallotItemUnfurledTracker,
      });
    }
  }

  onElectionStoreChange () {
    // console.log("Elections, onElectionStoreChange");
    this.setState({
      voterBallotList: formatVoterBallotList(ElectionStore.getElectionList()),
    });
  }

  onVoterGuideStoreChange () {
    // console.log("Ballot onVoterGuideStoreChange");
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

  setBallotItemFilterType (raceLevelFilterType, doubleFilteredBallotItemsLength) {
    BallotActions.raceLevelFilterTypeSave(raceLevelFilterType);
    this.setState({
      raceLevelFilterType,
      doubleFilteredBallotItemsLength,
      isSearching: false,
    });
  }

  getEmptyMessageByFilterType (completionLevelFilterType) {
    switch (completionLevelFilterType) {
      case 'filterRemaining':
        return 'You have chosen a candidate for every office and decided on all measures.';
      case 'filterDecided':
        return "You haven't chosen any candidates or decided on any measures yet.";
      default:
        return '';
    }
  }

  showUserEmptyOptions = () => {
    const { completionLevelFilterType } = this.state;
    let { raceLevelFilterType } = this.state;
    if (!raceLevelFilterType) {
      raceLevelFilterType = ''; // Make sure this is a string
    }
    const raceLevel = raceLevelFilterType.toLowerCase();
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
              {window.innerWidth > 575 ? 'Remaining Choices' : 'Choices'}
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
              {window.innerWidth > 575 ? 'Items Decided' : 'Decided'}
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

  handleSearch = (filteredItems) => {
    this.setState({ ballotSearchResults: filteredItems });
  };

  handleToggleSearchBallot = () => {
    const { isSearching } = this.state;
    this.setState({ isSearching: !isSearching });
  };

  hideLocationsGuessComponent () {
    document.getElementById('location_guess').style.display = 'none';
  }

  toggleBallotIntroModal () {
    const { showBallotIntroModal, location, pathname } = this.state;
    if (showBallotIntroModal) {
      // Saved to the voter record that the ballot introduction has been seen
      VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.BALLOT_INTRO_MODAL_SHOWN);
    } else if (location.hash.includes('#')) {
      // Clear out any # from anchors in the URL
      historyPush(pathname);
    }

    this.setState({ showBallotIntroModal: !showBallotIntroModal });
  }

  toggleBallotSummaryModal () {
    const { showBallotSummaryModal } = this.state;
    this.setState({
      showBallotSummaryModal: !showBallotSummaryModal,
    });
  }

  toggleSelectBallotModal (destinationUrlForHistoryPush = '') {
    const { showSelectBallotModal } = this.state;
    if (showSelectBallotModal) {
      if (destinationUrlForHistoryPush && destinationUrlForHistoryPush !== '') {
        historyPush(destinationUrlForHistoryPush);
      }
    } else {
      BallotActions.voterBallotListRetrieve(); // Retrieve a list of ballots for the voter from other elections
    }

    AppActions.setShowSelectBallotModal(!showSelectBallotModal);
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
      this.setState({
        raceLevelFilterType: raceCategoryDisplayText,
      }, () => this.toggleExpandBallotItemDetails(selectedBallotItemId));
    } else {
      // The ballot item was not found in the array of ballot items filtered by completion filter type
      const ballotItemFromAll = ballotWithAllItems.find(item => item.we_vote_id === selectedBallotItemId);
      const raceCategoryDisplayText = mapCategoryFilterType(ballotItemFromAll.race_office_level || ballotItemFromAll.kind_of_ballot_item);
      BallotActions.completionLevelFilterTypeSave('filterAllBallotItems');
      BallotActions.raceLevelFilterTypeSave(raceCategoryDisplayText);
      this.setState({
        raceLevelFilterType: raceCategoryDisplayText,
      }, () => this.toggleExpandBallotItemDetails(selectedBallotItemId));
    }
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('Ballot caught error: ', `${error} with info: `, info);
  }

  updateOfficeDisplayUnfurledTracker (weVoteId, status) {
    const { ballotItemUnfurledTracker } = this.state;
    const newBallotItemUnfurledTracker = { ...ballotItemUnfurledTracker, [weVoteId]: status };
    BallotActions.voterBallotItemOpenOrClosedSave(newBallotItemUnfurledTracker);
    this.setState({
      ballotItemUnfurledTracker: newBallotItemUnfurledTracker,
    });
  }

  render () {
    renderLog(__filename);
    const ballotBaseUrl = '/ballot';
    const { classes } = this.props;
    const {
      ballotWithItemsFromCompletionFilterType, showFilterTabs, doubleFilteredBallotItemsLength, completionLevelFilterType,
      ballotHeaderUnpinned, isSearching, ballotWithAllItems, ballotSearchResults,
    } = this.state;
    let { raceLevelFilterType } = this.state;
    if (!raceLevelFilterType) {
      raceLevelFilterType = ''; // Make sure this is a string
    }
    // console.log(ballotWithAllItems);
    const textForMapSearch = VoterStore.getTextForMapSearch();
    const issuesVoterCanFollow = IssueStore.getIssuesVoterCanFollow(); // Don't auto-open intro until Issues are loaded
    const issuesVoterCanFollowExist = issuesVoterCanFollow && issuesVoterCanFollow.length;
    // console.log("Ballot render issuesVoterCanFollowExist: ", issuesVoterCanFollowExist);

    if (!ballotWithItemsFromCompletionFilterType) {
      return (
        <div className="ballot container-fluid well u-stack--md u-inset--md">
          { this.state.showBallotIntroModal && issuesVoterCanFollowExist ?
            <BallotIntroModal show={this.state.showBallotIntroModal} toggleFunction={this.toggleBallotIntroModal} /> :
            null
          }
          <div className={`ballot__header ${isWebApp() ? 'ballot__header__top-cordova' : ''}`}>
            <p>
              <span className="u-cursor--pointer" onClick={this.toggleSelectBallotModal}>
                If your ballot does not appear momentarily, please click to change your address
                {/* {' '}
                <IconButton>
                  <PlaceIcon />
                </IconButton> */}
              </span>
              .
            </p>
          </div>
          {
            this.state.showSelectBallotModal ? (
              <SelectBallotModal
                ballotElectionList={this.state.ballotElectionList}
                ballotBaseUrl={ballotBaseUrl}
                location={this.props.location}
                pathname={this.props.pathname}
                show={this.state.showSelectBallotModal}
                toggleFunction={this.toggleSelectBallotModal}
              />
            ) : null
          }
        </div>
      );
    }

    const voterAddressMissing = this.state.location === null;

    // const ballot_caveat = BallotStore.ballotProperties.ballot_caveat; // ballotProperties might be undefined
    const electionName = BallotStore.currentBallotElectionName;
    const electionDayText = BallotStore.currentBallotElectionDate;
    const sourcePollingLocationWeVoteId = BallotStore.currentBallotPollingLocationSource;
    const ballotReturnedAdminEditUrl = `${webAppConfig.WE_VOTE_SERVER_ROOT_URL}b/${sourcePollingLocationWeVoteId}/list_edit_by_polling_location/?google_civic_election_id=${VoterStore.electionId()}&state_code=`;
    // console.log("electionName: ", electionName, ", electionDayTextFormatted: ", electionDayText);

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

    // console.log("ballotWithItemsFromCompletionFilterType: ", this.state.ballotWithItemsFromCompletionFilterType);
    const emptyBallot = ballotWithItemsFromCompletionFilterType.length === 0 ? (
      <div>
        <h3 className="text-center">{this.getEmptyMessageByFilterType(completionLevelFilterType)}</h3>
        {emptyBallotButton}
        <div className="container-fluid well u-stack--md u-inset--md">
          <BallotElectionList
            ballotBaseUrl={ballotBaseUrl}
            ballotElectionList={this.state.voterBallotList}
          />
        </div>
      </div>
    ) : null;

    const electionDayTextFormatted = electionDayText ? <span>{moment(electionDayText).format('MMM Do, YYYY')}</span> : <span />;

    const inRemainingDecisionsMode = completionLevelFilterType === 'filterRemaining';
    const inReadyToVoteMode = this.state.completionLevelFilterType === 'filterReadyToVote';

    if (ballotWithItemsFromCompletionFilterType.length === 0 && inRemainingDecisionsMode) {
      historyPush(this.state.pathname);
    }

    const showBallotDecisionTabs = (BallotStore.ballotLength !== BallotStore.ballotRemainingChoicesLength) &&
      (BallotStore.ballotRemainingChoicesLength > 0);

    return (
      <div className="ballot_root">
        { this.state.showBallotIntroModal ? <BallotIntroModal show={this.state.showBallotIntroModal} toggleFunction={this.toggleBallotIntroModal} /> : null }
        {/*
          this.state.showSelectBallotModal ? (
          <SelectBallotModal
            ballotElectionList={this.state.ballotElectionList}
            ballotBaseUrl={ballotBaseUrl}
            location={this.state.location}
            pathname={this.state.pathname}
            show={this.state.showSelectBallotModal}
            toggleFunction={this.toggleSelectBallotModal}
          />
        ) : null
        */}
        { this.state.showBallotSummaryModal ? <BallotSummaryModal show={this.state.showBallotSummaryModal} toggleFunction={this.toggleBallotSummaryModal} /> : null }
        <div className={`ballot__heading ${ballotHeaderUnpinned ? 'ballot__heading__unpinned' : ''}`}>
          <div className="page-content-container">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12">
                  <Helmet title="Ballot - We Vote" />
                  <header className="ballot__header__group">
                    <h1 className={isCordova() ? 'ballot__header__title__cordova' : 'ballot__header__title'}>
                      { electionName ? (
                        <span className="u-push--sm">
                          {electionName}
                          {' '}
                          <span className="d-none d-sm-inline">&mdash; </span>
                          <span className="u-gray-mid u-no-break">{electionDayTextFormatted}</span>
                        </span>
                      ) : (
                        <span className="u-push--sm">
                         Loading Election...
                        </span>
                      )}
                    </h1>
                  </header>

                  { textForMapSearch || ballotWithItemsFromCompletionFilterType.length > 0 ? (
                    <div className="ballot__filter__container">
                      { showBallotDecisionTabs && (
                        <div className="ballot__filter d-print-none">
                          <BallotDecisionsTabs
                            completionLevelFilterType={BallotStore.cleanCompletionLevelFilterType(completionLevelFilterType)}
                            ballotLength={BallotStore.ballotLength}
                            ballotLengthRemaining={BallotStore.ballotRemainingChoicesLength}
                          />
                        </div>
                      )}
                      <hr className="ballot-header-divider" />
                      <BallotFilterRow showFilterTabs={showFilterTabs}>
                        <div className="ballot__item-filter-tabs" ref={(chips) => { this.chipContainer = chips; }}>
                          { ballotWithItemsFromCompletionFilterType.length ? (
                            <React.Fragment>
                              <BallotSearch
                              isSearching={isSearching}
                              onToggleSearch={this.handleToggleSearchBallot}
                              items={ballotWithAllItems}
                              onBallotSearch={this.handleSearch}
                              />
                              { showFilterTabs ? (
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
                                    return (
                                      <div className="ballot_filter_btns" key={oneTypeOfBallotItem}>
                                        <Badge
                                          classes={{ badge: classes.badge, colorPrimary: classes.badgeColorPrimary }}
                                          color={(oneTypeOfBallotItem === raceLevelFilterType && !isSearching) ? 'primary' : 'default'}
                                          badgeContent={ballotItemsByFilterType.length}
                                          invisible={ballotItemsByFilterType.length === 0}
                                          onClick={() => this.setBallotItemFilterType(oneTypeOfBallotItem, ballotItemsByFilterType.length)}
                                        >
                                          <Chip variant="outlined"
                                            color={(oneTypeOfBallotItem === raceLevelFilterType && !isSearching) ? 'primary' : 'default'}
                                            onClick={() => this.setBallotItemFilterType(oneTypeOfBallotItem, ballotItemsByFilterType.length)}
                                            className="btn_ballot_filter"
                                            classes={{ root: classes.chipRoot, label: classes.chipLabel, outlinedPrimary: (oneTypeOfBallotItem === raceLevelFilterType && !isSearching) ? classes.chipOutlined : null }}
                                            label={oneTypeOfBallotItem}
                                          />
                                        </Badge>
                                      </div>
                                    );
                                  } else {
                                    return null;
                                  }
                                })
                              ) :
                                null
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
            {emptyBallot}
            <Wrapper cordova={isCordova()}>
              <div className={showBallotDecisionTabs ? 'row ballot__body' : 'row ballot__body__no-decision-tabs'}>
                <BrowserPushMessage incomingProps={this.props} />
                {ballotWithItemsFromCompletionFilterType.length > 0 ? (
                  <BallotStatusMessage
                    ballotLocationChosen
                    googleCivicElectionId={this.state.googleCivicElectionId}
                  />
                ) : null
                  }
                <div className="col-sm-12 col-lg-9">
                  <LocationGuess
                    toggleSelectBallotModal={this.toggleSelectBallotModal}
                    hideLocationsGuessComponent={this.hideLocationsGuessComponent}
                  />
                  { inReadyToVoteMode ? (
                    <div>
                      <div className="alert alert-success d-print-none">
                        <a // eslint-disable-line
                          href="#"
                          className="close"
                          data-dismiss="alert"
                        >
                          &times;
                        </a>
                      We Vote helps you get ready to vote,
                        {' '}
                        <strong>but you cannot use We Vote to cast your vote</strong>
                      .
                      Make sure to return your official ballot to your polling
                      place!
                        <br />
                        <OpenExternalWebSite
                        url="https://help.wevote.us/hc/en-us/articles/115002401353-Can-I-cast-my-vote-with-We-Vote-"
                        target="_blank"
                        body="See more information about casting your official vote."
                        />
                      </div>
                      <div className={isWebApp() ? 'BallotList' : 'BallotList__cordova'}>
                        {ballotWithItemsFromCompletionFilterType.map(item => <BallotItemReadyToVote key={item.we_vote_id} {...item} />)}
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* The rest of the ballot items */}
                      <div className={isWebApp() ? 'BallotList' : 'BallotList__cordova'}>
                        {(isSearching && ballotSearchResults.length ? ballotSearchResults : ballotWithItemsFromCompletionFilterType).map((item) => {
                          // ballot limited by items by filter typeß
                          if ((raceLevelFilterType === 'All' || (isSearching && ballotSearchResults.length) ||
                          (item.kind_of_ballot_item === raceLevelFilterType.toUpperCase()) ||
                            raceLevelFilterType === item.race_office_level)) {
                            return (
                              <BallotItemCompressed
                                currentBallotIdInUrl={this.props.location.hash.slice(1)}
                                key={item.we_vote_id}
                                updateOfficeDisplayUnfurledTracker={this.updateOfficeDisplayUnfurledTracker}
                                allBallotItemsCount={ballotWithItemsFromCompletionFilterType.length}
                                urlWithoutHash={this.props.location.pathname + this.props.location.search}
                                ref={(ref) => { this.ballotItems[item.we_vote_id] = ref; }}
                                {...item}
                              />
                            );
                          } else {
                            return null;
                          }
                        })
                    }
                        {
                        doubleFilteredBallotItemsLength === 0 &&
                        this.showUserEmptyOptions()
                      }
                      </div>
                      {
                        this.state.showSelectBallotModal ? (
                          <SelectBallotModal
                            ballotElectionList={this.state.ballotElectionList}
                            ballotBaseUrl={ballotBaseUrl}
                            location={this.props.location}
                            pathname={this.props.pathname}
                            show={this.state.showSelectBallotModal}
                            toggleFunction={this.toggleSelectBallotModal}
                          />
                        ) : null
                      }
                    </div>
                  )}
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
                      displayTitle
                      displaySubtitles
                      rawUrlVariablesString={this.props.location.search}
                      ballotWithAllItemsByFilterType={this.state.ballotWithItemsFromCompletionFilterType}
                      ballotItemLinkHasBeenClicked={this.ballotItemLinkHasBeenClicked}
                      />
                    </div>
                  )}
              </div>
            </Wrapper>
          </div>
        </div>
      </div>
    );
  }
}

const Wrapper = styled.div`
  padding-top: ${({ cordova }) => (cordova ? '100px' : 0)};
`;

// If we want to turn off filter tabs navigation bar:  ${({ showFilterTabs }) => !showFilterTabs && 'height: 0;'}
const BallotFilterRow = styled.div`
  display: flex;
`;

const styles = theme => ({
  badge: {
    top: 13,
    minWidth: 16,
    width: 20,
    right: 14,
    background: 'rgba(46, 60, 93, 0.08)',
    color: '#333',
    cursor: 'pointer',
    [theme.breakpoints.down('md')]: {
      fontSize: 9,
      width: 16,
      height: 16,
      top: 11,
      right: 11,
    },
  },
  badgeColorPrimary: {
    background: 'white',
    color: theme.palette.primary.main,
  },
  unselectedBadgeColorPrimary: {
    background: 'rgba(0, 0, 0, .2)',
    color: '#333',
  },
  chipRoot: {
    height: 26,
    [theme.breakpoints.down('md')]: {
      height: 22.5,
    },
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
    paddingLeft: 0,
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
