import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { Link } from "react-router";
import Helmet from "react-helmet";
import moment from "moment";
import AddressBox from "../../components/AddressBox";
import AnalyticsActions from "../../actions/AnalyticsActions";
import BallotActions from "../../actions/BallotActions";
import BallotElectionList from "../../components/Ballot/BallotElectionList";
import BallotTabsRaccoon from "../../components/Navigation/BallotTabsRaccoon";
import BallotItemCompressed from "../../components/Ballot/BallotItemCompressed";
import BallotItemReadyToVote from "../../components/Ballot/BallotItemReadyToVote";
import BallotIntroModal from "../../components/Ballot/BallotIntroModal";
import BallotSideBar from "../../components/Navigation/BallotSideBar";
import BallotStatusMessage from "../../components/Ballot/BallotStatusMessage";
import BallotStore from "../../stores/BallotStore";
import BallotSummaryModal from "../../components/Ballot/BallotSummaryModal";
import BrowserPushMessage from "../../components/Widgets/BrowserPushMessage";
import cookies from "../../utils/cookies";
import {
  cordovaDot, historyPush, isCordova, isWebApp,
} from "../../utils/cordovaUtils";
import ElectionActions from "../../actions/ElectionActions";
import ElectionStore from "../../stores/ElectionStore";
import isMobile from "../../utils/isMobile";
import IssueActions from "../../actions/IssueActions";
import IssueStore from "../../stores/IssueStore";
import OpenExternalWebSite from "../../utils/OpenExternalWebSite";
import OrganizationActions from "../../actions/OrganizationActions";
import { renderLog } from "../../utils/logging";
import SelectBallotModal from "../../components/Ballot/SelectBallotModal";
import SupportActions from "../../actions/SupportActions";
import SupportStore from "../../stores/SupportStore";
import VoterActions from "../../actions/VoterActions";
import VoterConstants from "../../constants/VoterConstants";
import VoterGuideStore from "../../stores/VoterGuideStore";
import VoterStore from "../../stores/VoterStore";
import webAppConfig from "../../config";
import { formatVoterBallotList, checkShouldUpdate } from './utils';

// December 2018:  We want to work toward being airbnb style compliant, but for now these are disabled in this file to minimize massive changes
/* eslint class-methods-use-this: 0 */
/* eslint react/jsx-indent-props: 0 */
/* eslint jsx-a11y/no-static-element-interactions: 0 */
/* eslint jsx-a11y/no-noninteractive-element-to-interactive-role: 0 */
/* eslint jsx-a11y/click-events-have-key-events: 0 */
/* eslint jsx-a11y/anchor-is-valid: 0 */
/* eslint no-param-reassign: 0 */

// Related to WebApp/src/js/components/VoterGuide/VoterGuideBallot.jsx
const BALLOT_ITEM_FILTER_TYPES = ["Federal", "State", "Measure", "Local"];

export default class Ballot extends Component {
  static propTypes = {
    location: PropTypes.object,
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      ballotElectionList: [],
      ballotItemUnfurledTracker: {},
      ballotLength: 0,
      ballotRemainingChoicesLength: 0,
      ballotWithAllItems: [],
      ballotWithAllItemsByFilterType: [],
      raceLevelFilterType: "",
      ballotReturnedWeVoteId: "",
      ballotLocationShortcut: "",
      candidateForModal: {
        voter_guides_to_follow_for_latest_ballot_item: [],
        position_list: [],
      },
      componentDidMountFinished: false,
      hideIntroModalFromUrl: 0,
      hideIntroModalFromCookie: 0,
      lastHashUsedInLinkScroll: "",
      measureForModal: {
        voter_guides_to_follow_for_latest_ballot_item: [],
        position_list: [],
      },
      mounted: false,
      showBallotIntroModal: false,
      showSelectBallotModal: false,
      showBallotSummaryModal: false,
      voterBallotList: [],
      foundFirstRaceLevel: false,
      showFilterTabs: false,
    };

    this.ballotItems = {};
    this.ballotItemLinkHasBeenClicked = this.ballotItemLinkHasBeenClicked.bind(this);
    this.toggleBallotIntroModal = this.toggleBallotIntroModal.bind(this);
    this.toggleSelectBallotModal = this.toggleSelectBallotModal.bind(this);
    this.toggleBallotSummaryModal = this.toggleBallotSummaryModal.bind(this);
    this.updateOfficeDisplayUnfurledTracker = this.updateOfficeDisplayUnfurledTracker.bind(this);
  }

  componentDidMount () {
    const ballotBaseUrl = "/ballot";
    // console.log("Ballot componentDidMount");

    const hideIntroModalFromUrl = this.props.location.query ? this.props.location.query.hide_intro_modal : 0;
    const hideIntroModalFromCookie = cookies.getItem("hide_intro_modal") || 0;
    const waitUntilVoterSignInCompletes = this.props.location.query ? this.props.location.query.wait_until_voter_sign_in_completes : 0;
    const issuesVoterCanFollow = IssueStore.getIssuesVoterCanFollow(); // Check to see if the issues have been retrieved yet
    const issuesVoterCanFollowExist = issuesVoterCanFollow && issuesVoterCanFollow.length;
    // console.log("Ballot componentDidMount issuesVoterCanFollowExist: ", issuesVoterCanFollowExist);

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

    const completionLevelFilterType = BallotStore.getCompletionLevelFilterTypeSaved() || "all";
    const ballotWithAllItemsByFilterType = BallotStore.getBallotByCompletionLevelFilterType(completionLevelFilterType);
    if (ballotWithAllItemsByFilterType !== undefined) {
      // console.log("ballotWithAllItemsByFilterType !== undefined");
      if (completionLevelFilterType === "all") {
        this.setState({
          ballotWithAllItems: ballotWithAllItemsByFilterType,
          ballotWithAllItemsByFilterType,
        });
      } else {
        const ballotWithAllItems = BallotStore.getBallotByCompletionLevelFilterType("all");
        this.setState({
          ballotWithAllItems,
          ballotWithAllItemsByFilterType,
        });
      }
    }

    let googleCivicElectionIdFromUrl = this.props.params.google_civic_election_id || 0;

    // console.log("googleCivicElectionIdFromUrl: ", googleCivicElectionIdFromUrl);
    let ballotReturnedWeVoteId = this.props.params.ballot_returned_we_vote_id || "";
    ballotReturnedWeVoteId = ballotReturnedWeVoteId === "none" ? "" : ballotReturnedWeVoteId;

    // console.log("this.props.params.ballot_returned_we_vote_id: ", this.props.params.ballot_returned_we_vote_id);
    let ballotLocationShortcut = this.props.params.ballot_location_shortcut || "";
    ballotLocationShortcut = ballotLocationShortcut.trim();
    ballotLocationShortcut = ballotLocationShortcut === "none" ? "" : ballotLocationShortcut;
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
      if (ballotLocationShortcut !== "") {
        // Change the ballot on load to make sure we are getting what we expect from the url
        BallotActions.voterBallotItemsRetrieve(0, "", ballotLocationShortcut);

        // Change the URL to match
        historyPush(`${ballotBaseUrl}/${ballotLocationShortcut}`);
      } else if (ballotReturnedWeVoteId !== "") {
        // Change the ballot on load to make sure we are getting what we expect from the url
        BallotActions.voterBallotItemsRetrieve(0, ballotReturnedWeVoteId, "");

        // Change the URL to match
        historyPush(`${ballotBaseUrl}/id/${ballotReturnedWeVoteId}`);
      } else if (googleCivicElectionIdFromUrl !== 0) {
        // Change the ballot on load to make sure we are getting what we expect from the url
        if (googleCivicElectionId !== googleCivicElectionIdFromUrl) {
          BallotActions.voterBallotItemsRetrieve(googleCivicElectionIdFromUrl, "", "");

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
      historyPush("/settings/location");
    } else if (ballotWithAllItemsByFilterType === undefined) {
      // console.log("WebApp doesn't know the election or have ballot data, so ask the API server to return best guess");
      BallotActions.voterBallotItemsRetrieve(0, "", "");
    }

    // console.log("Ballot, googleCivicElectionId: ", googleCivicElectionId, ", ballotLocationShortcut: ", ballotLocationShortcut, "ballotReturnedWeVoteId: ", ballotReturnedWeVoteId);
    // console.log("VoterStore.election_id: ", VoterStore.election_id());
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
    cookies.setItem("show_full_navigation", "1", Infinity, "/");

    this.electionListListener = ElectionStore.addListener(this.onElectionStoreChange.bind(this));
    ElectionActions.electionsRetrieve();
    OrganizationActions.organizationsFollowedRetrieve();
    VoterActions.voterRetrieve(); // This is needed to update the interface status settings

    if (googleCivicElectionId && googleCivicElectionId !== 0) {
      AnalyticsActions.saveActionBallotVisit(googleCivicElectionId);
    } else {
      AnalyticsActions.saveActionBallotVisit(VoterStore.election_id());
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
      raceLevelFilterType: BallotStore.getRaceLevelFilterTypeSaved() || "Federal",
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
    let ballotReturnedWeVoteId = nextProps.params.ballot_returned_we_vote_id || "";
    ballotReturnedWeVoteId = ballotReturnedWeVoteId.trim();
    let ballotLocationShortcut = nextProps.params.ballot_location_shortcut || "";
    ballotLocationShortcut = ballotLocationShortcut.trim();
    const completionLevelFilterType = BallotStore.getCompletionLevelFilterTypeSaved() || "all";

    // Were there any actual changes?
    if (ballotReturnedWeVoteId !== this.state.ballotReturnedWeVoteId ||
        ballotLocationShortcut !== this.state.ballotLocationShortcut ||
        googleCivicElectionId !== this.state.googleCivicElectionId ||
        completionLevelFilterType !== this.state.completionLevelFilterType) {
      this.setState({
        ballotWithAllItems: BallotStore.getBallotByCompletionLevelFilterType("all"),
        ballotWithAllItemsByFilterType: BallotStore.getBallotByCompletionLevelFilterType(completionLevelFilterType),
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
        AnalyticsActions.saveActionBallotVisit(VoterStore.election_id());
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
    const { foundFirstRaceLevel, raceLevelFilterType } = this.state;
    if (this.state.lastHashUsedInLinkScroll && this.state.lastHashUsedInLinkScroll !== prevState.lastHashUsedInLinkScroll) {
      this.hashLinkScroll();
    }
    // If we haven't found our default race level, run this check
    if (this.state.ballotWithAllItems && this.state.ballotWithAllItems.length && !foundFirstRaceLevel) {
      const { ballotWithAllItems } = this.state;
      const raceLevelFilterItems = ballotWithAllItems.filter(item => item.race_office_level === raceLevelFilterType || item.kind_of_ballot_item === raceLevelFilterType.toUpperCase());
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
        this.setState({ raceLevelFilterType: BALLOT_ITEM_FILTER_TYPES[raceLevelIdx + 1] });
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
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
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
          googleCivicElectionId: parseInt(VoterStore.election_id(), 10),
        });
      } else {
        this.setState({
          voter: VoterStore.getVoter(),
          googleCivicElectionId: parseInt(VoterStore.election_id(), 10),
        });
      }
    }
  }

  onBallotStoreChange () {
    // console.log("Ballot.jsx onBallotStoreChange");
    const completionLevelFilterType = BallotStore.getCompletionLevelFilterTypeSaved() || "";
    const { ballot, ballotProperties } = BallotStore;
    const {
      raceLevelFilterType, mounted, issuesRetrievedFromGoogleCivicElectionId,
      issuesRetrievedFromBallotReturnedWeVoteId, issuesRetrievedFromBallotLocationShortcut,
    } = this.state;
    if (mounted) {
      if (ballotProperties && ballotProperties.ballot_found && ballot && ballot.length === 0) {
        // Ballot is found but ballot is empty. We want to stay put.
        // console.log("onBallotStoreChange: ballotWithAllItemsByFilterType is empty");
      } else {
        const ballotWithAllItemsByFilterType = BallotStore.getBallotByCompletionLevelFilterType(completionLevelFilterType);
        this.setState({
          ballotWithAllItems: BallotStore.getBallotByCompletionLevelFilterType("all"),
          ballotWithAllItemsByFilterType,
        });
        if (ballotWithAllItemsByFilterType && ballotWithAllItemsByFilterType.length) {
          const raceLevelFilterItems = ballotWithAllItemsByFilterType.filter(item => item.race_office_level === raceLevelFilterType || item.kind_of_ballot_item === raceLevelFilterType.toUpperCase());
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
        ballotReturnedWeVoteId: ballotProperties.ballot_returned_we_vote_id || "",
        ballotLocationShortcut: ballotProperties.ballot_location_shortcut || "",
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
        raceLevelFilterType: 'Federal',
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
    const { candidateForModal, measureForModal } = this.state;
    // console.log("Ballot onVoterGuideStoreChange");
    // Update the data for the modal to include the position of the organization related to this ballot item
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
    this.setState({ raceLevelFilterType, doubleFilteredBallotItemsLength });
  }

  getEmptyMessageByFilterType (completionLevelFilterType) {
    switch (completionLevelFilterType) {
      case "filterRemaining":
        return "You have chosen a candidate for every office and decided on all measures.";
      case "filterDecided":
        return "You haven't chosen any candidates or decided on any measures yet.";
      default:
        return "";
    }
  }

  showUserEmptyOptions = () => {
    const { completionLevelFilterType, raceLevelFilterType } = this.state;
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
  }

  toggleBallotIntroModal () {
    const { showBallotIntroModal, location, pathname } = this.state;
    if (showBallotIntroModal) {
      // Saved to the voter record that the ballot introduction has been seen
      VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.BALLOT_INTRO_MODAL_SHOWN);
    } else if (location.hash.includes("#")) {
      // Clear out any # from anchors in the URL
      historyPush(pathname);
    }

    this.setState({ showBallotIntroModal: !showBallotIntroModal });
  }

  toggleSelectBallotModal (destinationUrlForHistoryPush = "") {
    const { showSelectBallotModal } = this.state;
    if (showSelectBallotModal) {
      if (destinationUrlForHistoryPush && destinationUrlForHistoryPush !== "") {
        historyPush(destinationUrlForHistoryPush);
      }
    } else {
      BallotActions.voterBallotListRetrieve(); // Retrieve a list of ballots for the voter from other elections
    }

    this.setState({
      showSelectBallotModal: !showSelectBallotModal,
    });
  }

  toggleBallotSummaryModal () {
    const { showBallotSummaryModal } = this.state;
    this.setState({
      showBallotSummaryModal: !showBallotSummaryModal,
    });
  }

  // Needed to scroll to anchor tags based on hash in url (as done for bookmarks)
  hashLinkScroll () {
    const { hash } = window.location;
    if (hash !== "") {
      // Push onto callback queue so it runs after the DOM is updated,
      // this is required when navigating from a different page so that
      // the element is rendered on the page before trying to getElementById.
      setTimeout(() => {
        const id = hash.replace("#", "");
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
    const ballotItem = this.state.ballotWithAllItemsByFilterType.find(item => item.we_vote_id === selectedBallotItemId);
    if (ballotItem && ballotItem.kind_of_ballot_item === "MEASURE") {
      this.setState({
        raceLevelFilterType: "Measure",
      }, () => this.toggleExpandBallotItemDetails(selectedBallotItemId));
    } else {
      let raceOfficeLevel = "Federal";
      if (ballotItem) {
        raceOfficeLevel = ballotItem.race_office_level;
      }
      this.setState({
        raceLevelFilterType: raceOfficeLevel,
      }, () => this.toggleExpandBallotItemDetails(selectedBallotItemId));
    }
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error("Ballot caught error: ", `${error} with info: `, info);
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
    const ballotBaseUrl = "/ballot";
    const {
      ballotWithAllItemsByFilterType, showFilterTabs, doubleFilteredBallotItemsLength, completionLevelFilterType,
    } = this.state;
    const textForMapSearch = VoterStore.getTextForMapSearch();
    const issuesVoterCanFollow = IssueStore.getIssuesVoterCanFollow(); // Don't auto-open intro until Issues are loaded
    const issuesVoterCanFollowExist = issuesVoterCanFollow && issuesVoterCanFollow.length;
    // console.log("Ballot render issuesVoterCanFollowExist: ", issuesVoterCanFollowExist);

    if (!ballotWithAllItemsByFilterType) {
      return (
        <div className="ballot container-fluid well u-stack--md u-inset--md">
          { this.state.showBallotIntroModal && issuesVoterCanFollowExist ?
            <BallotIntroModal show={this.state.showBallotIntroModal} toggleFunction={this.toggleBallotIntroModal} /> :
            null
          }
          <div className={isWebApp() ? "ballot__header" : "ballot__header ballot__header__top-cordova"}>
            <BrowserPushMessage incomingProps={this.props} />
            <p className="ballot__date_location">
              If your ballot does not appear momentarily, please
              {" "}
              <Link to="/settings/location">change your address</Link>
              .
            </p>
          </div>
          <BallotElectionList
            ballotBaseUrl={ballotBaseUrl}
            ballotElectionList={this.state.voterBallotList}
            showRelevantElections
          />
        </div>
      );
    }

    const voterAddressMissing = this.state.location === null;

    // const ballot_caveat = BallotStore.ballotProperties.ballot_caveat; // ballot_properties might be undefined
    const electionName = BallotStore.currentBallotElectionName;
    const electionDayText = BallotStore.currentBallotElectionDate;
    const sourcePollingLocationWeVoteId = BallotStore.currentBallotPollingLocationSource;
    const ballotReturnedAdminEditUrl = `${webAppConfig.WE_VOTE_SERVER_ROOT_URL}b/${sourcePollingLocationWeVoteId}/list_edit_by_polling_location/?google_civic_election_id=${VoterStore.election_id()}&state_code=`;
    // console.log("electionName: ", electionName, ", electionDayTextFormatted: ", electionDayText);

    const emptyBallotButton = this.state.completionLevelFilterType !== "none" && !voterAddressMissing ? (
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

    // console.log("ballotWithAllItemsByFilterType: ", this.state.ballotWithAllItemsByFilterType);
    const emptyBallot = ballotWithAllItemsByFilterType.length === 0 ? (
      <div>
        <h3 className="text-center">{this.getEmptyMessageByFilterType(this.state.completionLevelFilterType)}</h3>
        {emptyBallotButton}
        <div className="container-fluid well u-stack--md u-inset--md">
          <BallotElectionList
            ballotBaseUrl={ballotBaseUrl}
            ballotElectionList={this.state.voterBallotList}
          />
        </div>
      </div>
    ) : null;

    const electionDayTextFormatted = electionDayText ? <span>{moment(electionDayText).format("MMM Do, YYYY")}</span> : <span />;

    const inRemainingDecisionsMode = this.state.completionLevelFilterType === "filterRemaining";
    const inReadyToVoteMode = this.state.completionLevelFilterType === "filterReadyToVote";

    if (ballotWithAllItemsByFilterType.length === 0 && inRemainingDecisionsMode) {
      historyPush(this.state.pathname);
    }

    return (
      <div className="ballot_root">
        { this.state.showBallotIntroModal ? <BallotIntroModal show={this.state.showBallotIntroModal} toggleFunction={this.toggleBallotIntroModal} /> : null }
        { this.state.showSelectBallotModal ? (
          <SelectBallotModal
            ballotElectionList={this.state.ballotElectionList}
            ballotBaseUrl={ballotBaseUrl}
            google_civic_election_id={this.state.googleCivicElectionId}
            location={this.state.location}
            pathname={this.state.pathname}
            show={this.state.showSelectBallotModal}
            toggleFunction={this.toggleSelectBallotModal}
          />
        ) : null }
        { this.state.showBallotSummaryModal ? <BallotSummaryModal show={this.state.showBallotSummaryModal} toggleFunction={this.toggleBallotSummaryModal} /> : null }
        <div className="ballot__heading">
          <div className="page-content-container">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12">
                  <Helmet title="Ballot - We Vote" />
                  <BrowserPushMessage incomingProps={this.props} />
                  <header className="ballot__header__group">
                    <h1 className={isCordova() ? "ballot__header__title__cordova" : "ballot__header__title"}>
                      { electionName ? (
                        <span className="u-push--sm">
                          {electionName}
                          {" "}
                          <span className="d-none d-sm-inline">&mdash; </span>
                          <span className="u-gray-mid u-no-break">{electionDayTextFormatted}</span>
                        </span>
                      ) : (
                        <span className="u-push--sm">
                         Loading Election...
                        </span>
                      )}
                      {/* We always show the change election option */}
                      <div className="u-no-break d-print-none u-cursor--pointer"
                           onClick={this.toggleSelectBallotModal}
                      >
                        <span className="u-no-break u-f8 d-none d-sm-inline">
                          <img
                            src={cordovaDot("/img/global/icons/gear-icon.png")}
                            role="button"
                            alt="change address or election"
                          />
                          {" "}
                          change address or election
                        </span>
                        <span className="u-no-break u-f6 d-inline d-sm-none">
                          <img
                            src={cordovaDot("/img/global/icons/gear-icon.png")}
                            role="button"
                            alt="change address or election"
                          />
                          {" "}
                          change address or election
                        </span>
                      </div>
                    </h1>
                  </header>

                  {ballotWithAllItemsByFilterType.length > 0 ? (
                    <div>
                      <BallotStatusMessage
                        ballotLocationChosen
                        googleCivicElectionId={this.state.googleCivicElectionId}
                      />
                    </div>
                  ) : null
                  }

                  { textForMapSearch || ballotWithAllItemsByFilterType.length > 0 ? (
                    <div className="ballot__filter__container">
                      <div className="ballot__filter d-print-none">
                        <BallotTabsRaccoon
                          completionLevelFilterType={BallotStore.cleanCompletionLevelFilterType(completionLevelFilterType)}
                          ballotLength={BallotStore.ballotLength}
                          ballotLengthRemaining={BallotStore.ballotRemainingChoicesLength}
                        />
                      </div>
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
            <div className="row ballot__body">
              <div className="col-xs-12 col-md-8">
                { inReadyToVoteMode ? (
                  <div>
                    <div className="alert alert-success d-print-none">
                      <a href="#" className="close" data-dismiss="alert">&times;</a>
                      We Vote helps you get ready to vote,
                      {" "}
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
                    <div className={isWebApp() ? "BallotList" : "BallotList__cordova"}>
                      {ballotWithAllItemsByFilterType.map(item => <BallotItemReadyToVote key={item.we_vote_id} {...item} />)}
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* The rest of the ballot items */}
                    { ballotWithAllItemsByFilterType.length && showFilterTabs ? (
                      <div className="row ballot__item-filter-tabs">
                        { BALLOT_ITEM_FILTER_TYPES.map((oneTypeOfBallotItem) => {
                          const allBallotItemsByFilterType = this.state.ballotWithAllItems.filter((item) => {
                            if (oneTypeOfBallotItem === "Measure") {
                              return item.kind_of_ballot_item === "MEASURE";
                            } else {
                              return oneTypeOfBallotItem === item.race_office_level;
                            }
                          });
                          if (allBallotItemsByFilterType.length) {
                            const ballotItemsByFilterType = ballotWithAllItemsByFilterType.filter((item) => {
                              if (oneTypeOfBallotItem === "Measure") {
                                return item.kind_of_ballot_item === "MEASURE";
                              } else {
                                return oneTypeOfBallotItem === item.race_office_level;
                              }
                            });
                            return (
                              <div className="col-6 col-sm-3 u-stack--md u-inset__h--sm" key={oneTypeOfBallotItem}>
                                <Button variant="outline-secondary"
                                        block
                                        active={oneTypeOfBallotItem === this.state.raceLevelFilterType}
                                        onClick={() => this.setBallotItemFilterType(oneTypeOfBallotItem, ballotItemsByFilterType.length)}
                                        className="btn_ballot_filter"
                                >
                                  {oneTypeOfBallotItem}
                                  &nbsp;(
                                  {ballotItemsByFilterType.length}
                                  )
                                </Button>
                              </div>
                            );
                          } else {
                            return null;
                          }
                        })
                      }
                      </div>
                    ) : null
                    }
                    <div className={isWebApp() ? "BallotList" : "BallotList__cordova"}>
                      { ballotWithAllItemsByFilterType.map((item) => {
                      // ballot limited by items by filter type
                      // console.log(this.state.raceLevelFilterType);
                        if ((this.state.raceLevelFilterType === "All" ||
                          (item.kind_of_ballot_item === this.state.raceLevelFilterType.toUpperCase()) ||
                            this.state.raceLevelFilterType === item.race_office_level)) {
                          return (
                            <BallotItemCompressed
                              currentBallotIdInUrl={this.props.location.hash.slice(1)}
                              key={item.we_vote_id}
                              updateOfficeDisplayUnfurledTracker={this.updateOfficeDisplayUnfurledTracker}
                              allBallotItemsCount={ballotWithAllItemsByFilterType.length}
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

              { ballotWithAllItemsByFilterType.length === 0 || isCordova() ?
                null : (
                  <div className="col-md-4 d-none d-sm-block sidebar-menu">
                    <BallotSideBar
                      displayTitle
                      displaySubtitles
                      rawUrlVariablesString={this.props.location.search}
                      ballotWithAllItemsByFilterType={this.state.ballotWithAllItemsByFilterType}
                      ballotItemLinkHasBeenClicked={this.ballotItemLinkHasBeenClicked}
                    />
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
