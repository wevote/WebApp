import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { Link } from "react-router";
import AddressBox from "../../components/AddressBox";
import AnalyticsActions from "../../actions/AnalyticsActions";
import BallotActions from "../../actions/BallotActions";
import BallotElectionList from "../../components/Ballot/BallotElectionList";
import BallotItemCompressed from "../../components/Ballot/BallotItemCompressed";
import BallotIntroModal from "../../components/Ballot/BallotIntroModal";
import BallotStatusMessage from "../../components/Ballot/BallotStatusMessage";
import BallotStore from "../../stores/BallotStore";
import BallotSummaryModal from "../../components/Ballot/BallotSummaryModal";
import BrowserPushMessage from "../../components/Widgets/BrowserPushMessage";
import CandidateActions from "../../actions/CandidateActions";
import CandidateModal from "../../components/Ballot/CandidateModal";
import cookies from "../../utils/cookies";
import {
  cordovaDot,
  hasIPhoneNotch,
  historyPush,
  isCordova,
  isIPhone678Plus,
  isIPhoneXorXS,
  isIPhoneXSMax,
  isWebApp
} from "../../utils/cordovaUtils";
import ElectionActions from "../../actions/ElectionActions";
import ElectionStore from "../../stores/ElectionStore";
import Helmet from "react-helmet";
import isMobile from "../../utils/isMobile";
import OpenExternalWebSite from "../../utils/OpenExternalWebSite";
import MeasureActions from "../../actions/MeasureActions";
import MeasureModal from "../../components/Ballot/MeasureModal";
import moment from "moment";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationStore from "../../stores/OrganizationStore";
import PledgeToSupportOrganizationButton from "../../components/VoterGuide/PledgeToSupportOrganizationButton";
import PledgeToSupportOrganizationStatusBar from "../../components/VoterGuide/PledgeToSupportOrganizationStatusBar";
import { renderLog } from "../../utils/logging";
import SelectBallotModal from "../../components/Ballot/SelectBallotModal";
import SupportActions from "../../actions/SupportActions";
import SupportStore from "../../stores/SupportStore";
import VoterGuideActions from "../../actions/VoterGuideActions";
import VoterGuideBallotItemCompressed from "../../components/VoterGuide/VoterGuideBallotItemCompressed";
import VoterGuideStore from "../../stores/VoterGuideStore";
import VoterStore from "../../stores/VoterStore";
import { calculateBallotBaseUrl } from "../../utils/textFormat";
import { showToastSuccess } from "../../utils/showToast";

import webAppConfig from "../../config";

// Related to WebApp/src/js/routes/Ballot/Ballot.jsx
export default class VoterGuideBallot extends Component {
  static propTypes = {
    active_route: PropTypes.string,
    location: PropTypes.object,
    organization: PropTypes.object.isRequired,
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      active_route: "",
      ballotElectionList: [],
      ballot_item_unfurled_tracker: {},
      ballotWithAllItems: [],
      ballotWithAllItemsByFilterType: [],
      raceLevelFilterType: "",
      ballot_returned_we_vote_id: "",
      ballot_location_shortcut: "",
      candidate_for_modal: {
        voter_guides_to_follow_for_latest_ballot_item: [],
        position_list: [],
      },
      componentDidMountFinished: false,
      hide_intro_modal_from_url: 0,
      hide_intro_modal_from_cookie: 0,
      lastHashUsedInLinkScroll: "",
      measure_for_modal: {
        voter_guides_to_follow_for_latest_ballot_item: [],
        position_list: [],
      },
      mounted: false,
      organization: {},
      showBallotIntroModal: false,
      showCandidateModal: false,
      showMeasureModal: false,
      showSelectBallotModal: false,
      showBallotSummaryModal: false,
      voter_ballot_list: [],
      waiting_for_new_ballot_items: false,
    };

    this.ballotItems = {};
    this.ballotItemLinkHasBeenClicked = this.ballotItemLinkHasBeenClicked.bind(this);
    this.toggleBallotIntroModal = this.toggleBallotIntroModal.bind(this);
    this.ballotItemsCompressedReference = {};
    this.nullFunction = this.nullFunction.bind(this);
    this.pledgeToVoteWithVoterGuide = this.pledgeToVoteWithVoterGuide.bind(this);
    this.toggleCandidateModal = this.toggleCandidateModal.bind(this);
    this.toggleMeasureModal = this.toggleMeasureModal.bind(this);
    this.toggleSelectBallotModal = this.toggleSelectBallotModal.bind(this);
    this.toggleBallotSummaryModal = this.toggleBallotSummaryModal.bind(this);
    this.updateOfficeDisplayUnfurledTracker = this.updateOfficeDisplayUnfurledTracker.bind(this);
  }

  componentDidMount () {
    let ballotBaseUrl = calculateBallotBaseUrl(null, this.props.location.pathname);
    // console.log("VoterGuideBallot componentDidMount, ballotBaseUrl", ballotBaseUrl);

    let hide_intro_modal_from_url = this.props.location.query ? this.props.location.query.hide_intro_modal : 0;
    let hide_intro_modal_from_cookie = cookies.getItem("hide_intro_modal") || 0;
    let wait_until_voter_sign_in_completes = this.props.location.query ? this.props.location.query.wait_until_voter_sign_in_completes : 0;

    if (wait_until_voter_sign_in_completes !== undefined ||
        hide_intro_modal_from_cookie ||
        hide_intro_modal_from_url) {
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

    let completionLevelFilterType = BallotStore.getCompletionLevelFilterTypeSaved() || "all";
    let ballotWithAllItemsByFilterType = BallotStore.getBallotByCompletionLevelFilterType(completionLevelFilterType);
    if (ballotWithAllItemsByFilterType !== undefined) {
      // console.log("ballotWithAllItemsByFilterType !== undefined");
      if (completionLevelFilterType === "all") {
        this.setState({
          ballotWithAllItems: ballotWithAllItemsByFilterType,
          ballotWithAllItemsByFilterType: ballotWithAllItemsByFilterType,
        });
      } else {
        let ballotWithAllItems = BallotStore.getBallotByCompletionLevelFilterType("all");
        this.setState({
          ballotWithAllItems: ballotWithAllItems,
          ballotWithAllItemsByFilterType: ballotWithAllItemsByFilterType,
        });
      }
    }

    let google_civic_election_id_from_url = this.props.params.google_civic_election_id || 0;

    // console.log("google_civic_election_id_from_url: ", google_civic_election_id_from_url);
    let ballot_returned_we_vote_id = this.props.params.ballot_returned_we_vote_id || "";
    ballot_returned_we_vote_id = ballot_returned_we_vote_id === "none" ? "" : ballot_returned_we_vote_id;

    // console.log("this.props.params.ballot_returned_we_vote_id: ", this.props.params.ballot_returned_we_vote_id);
    let ballot_location_shortcut = this.props.params.ballot_location_shortcut || "";
    ballot_location_shortcut = ballot_location_shortcut.trim();
    ballot_location_shortcut = ballot_location_shortcut === "none" ? "" : ballot_location_shortcut;
    let google_civic_election_id = 0;

    // console.log("componentDidMount, BallotStore.ballot_properties: ", BallotStore.ballot_properties);
    if (google_civic_election_id_from_url !== 0) {
      google_civic_election_id_from_url = parseInt(google_civic_election_id_from_url, 10);

      // google_civic_election_id = google_civic_election_id_from_url;
    } else if (BallotStore.ballot_properties && BallotStore.ballot_properties.google_civic_election_id) {
      google_civic_election_id = BallotStore.ballot_properties.google_civic_election_id;
    }

    // console.log("ballot_returned_we_vote_id: ", ballot_returned_we_vote_id, ", ballot_location_shortcut:", ballot_location_shortcut, ", google_civic_election_id_from_url: ", google_civic_election_id_from_url);
    if (ballot_returned_we_vote_id || ballot_location_shortcut || google_civic_election_id_from_url) {
      if (ballot_location_shortcut !== "") {
        // Change the ballot on load to make sure we are getting what we expect from the url
        BallotActions.voterBallotItemsRetrieve(0, "", ballot_location_shortcut);

        // Change the URL to match
        historyPush(ballotBaseUrl + "/" + ballot_location_shortcut);
      } else if (ballot_returned_we_vote_id !== "") {

        // Change the ballot on load to make sure we are getting what we expect from the url
        BallotActions.voterBallotItemsRetrieve(0, ballot_returned_we_vote_id, "");

        // Change the URL to match
        historyPush(ballotBaseUrl + "/id/" + ballot_returned_we_vote_id);
      } else if (google_civic_election_id_from_url !== 0) {
        // Change the ballot on load to make sure we are getting what we expect from the url
        if (google_civic_election_id !== google_civic_election_id_from_url) {
          BallotActions.voterBallotItemsRetrieve(google_civic_election_id_from_url, "", "");

          // Change the URL to match
          let ballotElectionUrl = ballotBaseUrl + "/election/" + google_civic_election_id_from_url;
          if (this.props.active_route && this.props.active_route !== "") {
            ballotElectionUrl += "/" + this.props.active_route;
          }
          historyPush(ballotElectionUrl);
        }

        // No change to the URL needed
        // Now set google_civic_election_id
        google_civic_election_id = google_civic_election_id_from_url;
      } else if (google_civic_election_id !== 0) {
        // No need to retrieve data again
        // Change the URL to match the current google_civic_election_id
        let ballotElectionUrl2 = ballotBaseUrl + "/election/" + google_civic_election_id;
        if (this.props.active_route && this.props.active_route !== "") {
          ballotElectionUrl2 += "/" + this.props.active_route;
        }
        historyPush(ballotElectionUrl2);
      }
    // DALE NOTE 2018-1-18 Commented this out because it will take voter away from voter guide. Needs further testing.
    // else if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_found === false){ // No ballot found
    //   // console.log("if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_found === false");
    //   historyPush("/settings/location");
    } else if (ballotWithAllItemsByFilterType === undefined) {
      // console.log("WebApp doesn't know the election or have ballot data, so ask the API server to return best guess");
      BallotActions.voterBallotItemsRetrieve(0, "", "");
    }

    // We need a ballotStoreListener here because we want the ballot to display before positions are received
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    // NOTE: voterAllPositionsRetrieve and positionsCountForAllBallotItems are also called in SupportStore when voterAddressRetrieve is received,
    // so we get duplicate calls when you come straight to the Ballot page. There is no easy way around this currently.
    SupportActions.voterAllPositionsRetrieve();

    // June 2018: Avoid hitting this same api multiple times, if we already have the data
    if (!SupportStore.isSupportAlreadyInCache()) {
      SupportActions.positionsCountForAllBallotItems(google_civic_election_id);
    }

    BallotActions.voterBallotListRetrieve(); // Retrieve a list of ballots for the voter from other elections
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));

    // Once a voter hits the ballot, they have gone through orientation
    cookies.setItem("show_full_navigation", "1", Infinity, "/");

    this.electionListListener = ElectionStore.addListener(this.onElectionStoreChange.bind(this));
    ElectionActions.electionsRetrieve();
    OrganizationActions.organizationsFollowedRetrieve();

    if (google_civic_election_id && google_civic_election_id !== 0) {
      AnalyticsActions.saveActionBallotVisit(google_civic_election_id);
    } else {
      AnalyticsActions.saveActionBallotVisit(VoterStore.election_id());
    }

    this.setState({
      ballotElectionList: BallotStore.ballotElectionList(),
      completionLevelFilterType: completionLevelFilterType,
      ballot_returned_we_vote_id: ballot_returned_we_vote_id,
      ballot_location_shortcut: ballot_location_shortcut,
      google_civic_election_id: parseInt(google_civic_election_id, 10),
      hide_intro_modal_from_url: hide_intro_modal_from_url,
      hide_intro_modal_from_cookie: hide_intro_modal_from_cookie,
      location: this.props.location,
      organization: this.props.organization,
      pathname: this.props.location.pathname,
      raceLevelFilterType: BallotStore.getRaceLevelFilterTypeSaved() || "Federal",
      voter_guide: VoterGuideStore.getVoterGuideForOrganizationIdAndElection(this.props.organization.organization_we_vote_id, VoterStore.election_id()),
      wait_until_voter_sign_in_completes: wait_until_voter_sign_in_completes,
    });

    if (this.props.location && this.props.location.hash) {
      // this.hashLinkScroll();
      this.setState({ lastHashUsedInLinkScroll: this.props.location.hash });
    }
  }

  componentWillReceiveProps (nextProps) {
    // console.log("VoterGuideBallot componentWillReceiveProps, nextProps: ", nextProps);

    // We don't want to let the google_civic_election_id disappear
    let google_civic_election_id = nextProps.params.google_civic_election_id || this.state.google_civic_election_id;
    let ballot_returned_we_vote_id = nextProps.params.ballot_returned_we_vote_id || "";
    ballot_returned_we_vote_id = ballot_returned_we_vote_id.trim();
    let ballot_location_shortcut = nextProps.params.ballot_location_shortcut || "";
    ballot_location_shortcut = ballot_location_shortcut.trim();
    let completionLevelFilterType = BallotStore.getCompletionLevelFilterTypeSaved() || "all";

    // Were there any actual changes?
    if (ballot_returned_we_vote_id !== this.state.ballot_returned_we_vote_id ||
        ballot_location_shortcut !== this.state.ballot_location_shortcut ||
        google_civic_election_id !== this.state.google_civic_election_id ||
        completionLevelFilterType !== this.state.completionLevelFilterType) {
      this.setState({
        ballotWithAllItems: BallotStore.getBallotByCompletionLevelFilterType("all"),
        ballotWithAllItemsByFilterType: BallotStore.getBallotByCompletionLevelFilterType(completionLevelFilterType),
        ballot_returned_we_vote_id: ballot_returned_we_vote_id,
        ballot_location_shortcut: ballot_location_shortcut,
        completionLevelFilterType: completionLevelFilterType,
        google_civic_election_id: parseInt(google_civic_election_id, 10),
        location: nextProps.location,
        organization: nextProps.organization,
        pathname: nextProps.location.pathname,
        voter_guide: VoterGuideStore.getVoterGuideForOrganizationIdAndElection(nextProps.organization.organization_we_vote_id, VoterStore.election_id()),
      });

      // if (google_civic_election_id && google_civic_election_id !== 0) {
      //   AnalyticsActions.saveActionBallotVisit(google_civic_election_id);
      // } else {
      //   AnalyticsActions.saveActionBallotVisit(VoterStore.election_id());
      // }
    } else {
      this.setState({
        organization: OrganizationStore.getOrganizationByWeVoteId(nextProps.organization.organization_we_vote_id),
        voter_guide: VoterGuideStore.getVoterGuideForOrganizationIdAndElection(nextProps.organization.organization_we_vote_id, VoterStore.election_id()),
      });
    }

    if (nextProps.location && nextProps.location.hash) {
      // this.hashLinkScroll();
      this.setState({ lastHashUsedInLinkScroll: nextProps.location.hash });
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.lastHashUsedInLinkScroll && this.state.lastHashUsedInLinkScroll !== prevState.lastHashUsedInLinkScroll) {
      this.hashLinkScroll();
    }
  }

  componentWillUnmount () {
    // console.log("VoterGuideBallot componentWillUnmount");
    this.setState({
      mounted: false,
    });
    if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_found === false) {
      // No ballot found
    }

    this.ballotStoreListener.remove();
    this.electionListListener.remove();
    this.organizationStoreListener.remove();
    this.supportStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.voterStoreListener.remove();
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.state.componentDidMountFinished === false) {
      // console.log("shouldComponentUpdate: componentDidMountFinished === false");
      return true;
    }
    if (this.state.raceLevelFilterType !== nextState.raceLevelFilterType) {
      // console.log("shouldComponentUpdate: this.state.raceLevelFilterType", this.state.raceLevelFilterType, ", nextState.raceLevelFilterType", nextState.raceLevelFilterType);
      return true;
    }
    if (this.state.ballot_item_unfurled_tracker !== nextState.ballot_item_unfurled_tracker) {
      // console.log("shouldComponentUpdate: this.state.ballot_item_unfurled_tracker", this.state.ballot_item_unfurled_tracker, ", nextState.ballot_item_unfurled_tracker", nextState.ballot_item_unfurled_tracker);
      return true;
    }
    if (this.state.ballotLength !== nextState.ballotLength) {
      // console.log("shouldComponentUpdate: this.state.ballotLength", this.state.ballotLength, ", nextState.ballotLength", nextState.ballotLength);
      return true;
    }
    if (this.state.ballotRemainingChoicesLength !== nextState.ballotRemainingChoicesLength) {
      // console.log("shouldComponentUpdate: this.state.ballotRemainingChoicesLength", this.state.ballotRemainingChoicesLength, ", nextState.ballotRemainingChoicesLength", nextState.ballotRemainingChoicesLength);
      return true;
    }
    if (this.state.ballot_location_shortcut !== nextState.ballot_location_shortcut) {
      // console.log("shouldComponentUpdate: this.state.ballot_location_shortcut", this.state.ballot_location_shortcut, ", nextState.ballot_location_shortcut", nextState.ballot_location_shortcut);
      return true;
    }
    if (this.state.ballot_returned_we_vote_id !== nextState.ballot_returned_we_vote_id) {
      // console.log("shouldComponentUpdate: this.state.ballot_returned_we_vote_id", this.state.ballot_returned_we_vote_id, ", nextState.ballot_returned_we_vote_id", nextState.ballot_returned_we_vote_id);
      return true;
    }
    if (this.state.completionLevelFilterType !== nextState.completionLevelFilterType) {
      // console.log("shouldComponentUpdate: this.state.completionLevelFilterType", this.state.completionLevelFilterType, ", nextState.completionLevelFilterType", nextState.completionLevelFilterType);
      return true;
    }
    if (this.state.google_civic_election_id !== nextState.google_civic_election_id) {
      // console.log("shouldComponentUpdate: this.state.google_civic_election_id", this.state.google_civic_election_id, ", nextState.google_civic_election_id", nextState.google_civic_election_id);
      return true;
    }
    if (this.state.lastHashUsedInLinkScroll !== nextState.lastHashUsedInLinkScroll) {
      // console.log("shouldComponentUpdate: this.state.lastHashUsedInLinkScroll", this.state.lastHashUsedInLinkScroll, ", nextState.lastHashUsedInLinkScroll", nextState.lastHashUsedInLinkScroll);
      return true;
    }
    if (this.state.location !== nextState.location) {
      // console.log("shouldComponentUpdate: this.state.location", this.state.location, ", nextState.location", nextState.location);
      return true;
    }
    if (this.state.pathname !== nextState.pathname) {
      // console.log("shouldComponentUpdate: this.state.pathname", this.state.pathname, ", nextState.pathname", nextState.pathname);
      return true;
    }
    if (this.state.showBallotIntroModal !== nextState.showBallotIntroModal) {
      // console.log("shouldComponentUpdate: this.state.showBallotIntroModal", this.state.showBallotIntroModal, ", nextState.showBallotIntroModal", nextState.showBallotIntroModal);
      return true;
    }
    if (this.state.showBallotSummaryModal !== nextState.showBallotSummaryModal) {
      // console.log("shouldComponentUpdate: this.state.showBallotSummaryModal", this.state.showBallotSummaryModal, ", nextState.showBallotSummaryModal", nextState.showBallotSummaryModal);
      return true;
    }
    if (this.state.showCandidateModal !== nextState.showCandidateModal) {
      // console.log("shouldComponentUpdate: this.state.showCandidateModal", this.state.showCandidateModal, ", nextState.showCandidateModal", nextState.showCandidateModal);
      return true;
    }
    if (this.state.showMeasureModal !== nextState.showMeasureModal) {
      // console.log("shouldComponentUpdate: this.state.showMeasureModal", this.state.showMeasureModal, ", nextState.showMeasureModal", nextState.showMeasureModal);
      return true;
    }
    if (this.state.showSelectBallotModal !== nextState.showSelectBallotModal) {
      // console.log("shouldComponentUpdate: this.state.showSelectBallotModal", this.state.showSelectBallotModal, ", nextState.showSelectBallotModal", nextState.showSelectBallotModal);
      return true;
    }

    return false;
  }

  nullFunction () {
  }

  toggleCandidateModal (candidate_for_modal) {
    if (candidate_for_modal) {
      // Slows down the browser too much when run for all candidates
      // VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(candidate_for_modal.we_vote_id, "CANDIDATE");
      candidate_for_modal.voter_guides_to_follow_for_latest_ballot_item = VoterGuideStore.getVoterGuidesToFollowForBallotItemId(candidate_for_modal.we_vote_id);
      CandidateActions.positionListForBallotItem(candidate_for_modal.we_vote_id);
    }

    this.setState({
      candidate_for_modal: candidate_for_modal,
      showCandidateModal: !this.state.showCandidateModal,
    });
  }

  toggleBallotIntroModal () {
    if (this.state.location.hash.includes("#")) {
      // Clear out any # from anchors in the URL
      historyPush(this.state.pathname);
    }

    this.setState({ showBallotIntroModal: !this.state.showBallotIntroModal });
  }

  toggleMeasureModal (measure_for_modal) {
    // console.log("toggleMeasureModal, measure_for_modal: ", measure_for_modal);
    if (measure_for_modal) {
      VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(measure_for_modal.we_vote_id, "MEASURE");
      measure_for_modal.voter_guides_to_follow_for_latest_ballot_item = VoterGuideStore.getVoterGuidesToFollowForBallotItemId(measure_for_modal.we_vote_id);
      MeasureActions.positionListForBallotItem(measure_for_modal.we_vote_id);
    }

    this.setState({
      measure_for_modal: measure_for_modal,
      showMeasureModal: !this.state.showMeasureModal,
    });
  }

  toggleSelectBallotModal () {
    if (!this.state.showSelectBallotModal) {
      BallotActions.voterBallotListRetrieve(); // Retrieve a list of ballots for the voter from other elections
    }

    this.setState({
      showSelectBallotModal: !this.state.showSelectBallotModal,
    });
  }

  toggleBallotSummaryModal () {
    this.setState({
      showBallotSummaryModal: !this.state.showBallotSummaryModal,
    });
  }

  onVoterStoreChange () {
    // console.log("VoterGuideBallot.jsx onVoterStoreChange");
    if (this.state.mounted) {
      let consider_opening_ballot_intro_modal = true;
      if (this.state.wait_until_voter_sign_in_completes) {
        consider_opening_ballot_intro_modal = false;
        if (this.state.voter && this.state.voter.is_signed_in) {
          consider_opening_ballot_intro_modal = true;
          this.setState({
            wait_until_voter_sign_in_completes: undefined,
          });
          // console.log("onVoterStoreChange, about to historyPush(this.state.pathname):", this.state.pathname);
          historyPush(this.state.pathname);
        }
      }

      if (this.state.hide_intro_modal_from_cookie || this.state.hide_intro_modal_from_url) {
        consider_opening_ballot_intro_modal = false;
      }

      // console.log("VoterGuideBallot.jsx onVoterStoreChange VoterStore.getVoter: ", VoterStore.getVoter());
      if (consider_opening_ballot_intro_modal) {
        // hide_intro_modal is the default now
        // showBallotIntroModal: !VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_MODAL_SHOWN),
        this.setState({
          voter: VoterStore.getVoter(),
          showBallotIntroModal: false,
          google_civic_election_id: parseInt(VoterStore.election_id(), 10),
        });
      } else {
        this.setState({
          voter: VoterStore.getVoter(),
          google_civic_election_id: parseInt(VoterStore.election_id(), 10),
        });
      }
    }
  }

  onBallotStoreChange () {
    // console.log("VoterGuideBallot.jsx onBallotStoreChange, BallotStore.ballot_properties: ", BallotStore.ballot_properties);
    let completionLevelFilterType = BallotStore.getCompletionLevelFilterTypeSaved() || "";
    if (this.state.mounted) {
      if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_found && BallotStore.ballot && BallotStore.ballot.length === 0) {
        // Ballot is found but ballot is empty. We want to stay put.
        // console.log("onBallotStoreChange: ballotWithAllItemsByFilterType is empty");
      } else {
        this.setState({
          ballotWithAllItems: BallotStore.getBallotByCompletionLevelFilterType("all"),
          ballotWithAllItemsByFilterType: BallotStore.getBallotByCompletionLevelFilterType(completionLevelFilterType),
        });
      }
    }

    if (BallotStore.ballot_properties) {
      this.setState({
        ballot_returned_we_vote_id: BallotStore.ballot_properties.ballot_returned_we_vote_id || "",
        ballot_location_shortcut: BallotStore.ballot_properties.ballot_location_shortcut || "",
        google_civic_election_id: parseInt(BallotStore.ballot_properties.google_civic_election_id, 10),
      });

    }
    this.setState({
      ballotElectionList: BallotStore.ballotElectionList(),
      completionLevelFilterType: completionLevelFilterType,
    });

    if (Object.keys(this.state.ballot_item_unfurled_tracker).length === 0) {
      // console.log("current tracker in Ballotstore", BallotStore.current_ballot_item_unfurled_tracker)
      this.setState({
        ballot_item_unfurled_tracker: BallotStore.current_ballot_item_unfurled_tracker,
      });
    }
  }

  onElectionStoreChange () {
    // console.log("Elections, onElectionStoreChange");
    let elections_list = ElectionStore.getElectionList();
    let elections_locations_list = [];
    let voter_ballot; // A different format for much of the same data
    let voter_ballot_list = [];
    let one_ballot_location;
    let ballot_location_shortcut;
    let ballot_returned_we_vote_id;

    for (let i = 0; i < elections_list.length; i++) {
      let election = elections_list[i];
      elections_locations_list.push(election);
      ballot_returned_we_vote_id = "";
      ballot_location_shortcut = "";
      if (election.ballot_location_list && election.ballot_location_list.length) {
        // We want to add the shortcut and we_vote_id for the first ballot location option
        one_ballot_location = election.ballot_location_list[0];
        ballot_location_shortcut = one_ballot_location.ballot_location_shortcut || "";
        ballot_location_shortcut = ballot_location_shortcut.trim();
        ballot_returned_we_vote_id = one_ballot_location.ballot_returned_we_vote_id || "";
        ballot_returned_we_vote_id = ballot_returned_we_vote_id.trim();
      }

      voter_ballot = {
        google_civic_election_id: election.google_civic_election_id,
        election_description_text: election.election_name,
        election_day_text: election.election_day_text,
        original_text_for_map_search: "",
        ballot_location_shortcut: ballot_location_shortcut,
        ballot_returned_we_vote_id: ballot_returned_we_vote_id,
      };
      voter_ballot_list.push(voter_ballot);
    }

    this.setState({
      elections_locations_list: elections_locations_list,
      voter_ballot_list: voter_ballot_list,
    });
  }

  onOrganizationStoreChange () {
    // console.log("VoterGuideBallot onOrganizationStoreChange, org_we_vote_id: ", this.state.organization.organization_we_vote_id);
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(this.state.organization.organization_we_vote_id),
    });
  }

  onSupportStoreChange () {
    // Whenever positions change, we want to make sure to get the latest organization, because it has
    //  position_list_for_one_election and position_list_for_all_except_one_election attached to it
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(this.state.organization.organization_we_vote_id),
    });
  }

  onVoterGuideStoreChange (){
    // console.log("VoterGuideBallot onVoterGuideStoreChange");
    // Update the data for the modal to include the position of the organization related to this ballot item
    if (this.state.candidate_for_modal) {
      this.setState({
        candidate_for_modal: {
          ...this.state.candidate_for_modal,
          voter_guides_to_follow_for_latest_ballot_item: VoterGuideStore.getVoterGuidesToFollowForLatestBallotItem(),
        },
        voter_guide: VoterGuideStore.getVoterGuideForOrganizationIdAndElection(this.state.organization.organization_we_vote_id, VoterStore.election_id()),
      });
    } else if (this.state.measure_for_modal) {
      this.setState({
        measure_for_modal: {
          ...this.state.measure_for_modal,
          voter_guides_to_follow_for_latest_ballot_item: VoterGuideStore.getVoterGuidesToFollowForLatestBallotItem(),
        },
        voter_guide: VoterGuideStore.getVoterGuideForOrganizationIdAndElection(this.state.organization.organization_we_vote_id, VoterStore.election_id()),
      });
    }
  }

  // Needed to scroll to anchor tags based on hash in url (as done for bookmarks)
  hashLinkScroll () {
    const { hash } = window.location;
    if (hash !== "") {
      // Push onto callback queue so it runs after the DOM is updated,
      // this is required when navigating from a different page so that
      // the element is rendered on the page before trying to getElementById.
      setTimeout(() => {
        let id = hash.replace("#", "");
        const element = document.getElementById(id);

        if (element) {
          let positionY = element.offsetTop;
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
    let ballot_item = this.state.ballotWithAllItemsByFilterType.find(item => item.we_vote_id === selectedBallotItemId);
    if (ballot_item && ballot_item.kind_of_ballot_item === "MEASURE") {
      this.setState({
        raceLevelFilterType: "Measure",
      }, () => this.toggleExpandBallotItemDetails(selectedBallotItemId));
    } else {
      this.setState({
        raceLevelFilterType: ballot_item.race_office_level,
      }, () => this.toggleExpandBallotItemDetails(selectedBallotItemId));
    }
  }

  getEmptyMessageByFilterType (completionLevelFilterType) {
    switch (completionLevelFilterType) {
      case "filterRemaining":
        return "You have chosen a candidate for every office and decided on all measures.";
      case "filterDecided":
        return "You haven't supported any candidates or decided on any measures yet.";
      default:
        return "";
    }
  }

  doesOrganizationHavePositionOnOffice (contest_office_we_vote_id) {
    return OrganizationStore.doesOrganizationHavePositionOnOffice(this.state.organization.organization_we_vote_id, contest_office_we_vote_id);
  }

  pledgeToVoteWithVoterGuide () {
    // console.log("VoterGuideBallot pledgeToVoteWithVoterGuide, this.state.voter_guide:", this.state.voter_guide);
    console.log("VoterGuideBallot pledgeToVoteWithVoterGuide, this.state.voter_guide:", this.state.voter_guide);
    let toast_message = `Now you match what ${this.state.organization.organization_name} supports or opposes`;
    VoterGuideActions.pledgeToVoteWithVoterGuide(this.state.voter_guide.we_vote_id);
    // console.log("voter_guide we_vote_id ", VoterGuideActions.pledgeToVoteWithVoterGuide(voter_guide_we_vote_id)); //undefined
    showToastSuccess(toast_message);
  }

  updateOfficeDisplayUnfurledTracker (we_vote_id, status) {
    const new_ballot_item_unfurled_tracker = { ... this.state.ballot_item_unfurled_tracker, [we_vote_id]: status };
    BallotActions.voterBallotItemOpenOrClosedSave(new_ballot_item_unfurled_tracker);
    this.setState({
      ballot_item_unfurled_tracker: new_ballot_item_unfurled_tracker,
    });
  }

  setBallotItemFilterType (raceLevelFilterType) {
    BallotActions.raceLevelFilterTypeSave(raceLevelFilterType);
    this.setState({raceLevelFilterType: raceLevelFilterType, });
  }

  render () {
    renderLog(__filename);
    const BALLOT_ITEM_FILTER_TYPES = ["Federal", "State", "Measure", "Local"];
    let ballotBaseUrl = calculateBallotBaseUrl(null, this.props.location.pathname);
    // console.log("VoterGuideBallot render, ballotBaseUrl: ", ballotBaseUrl);

    if (!this.state.ballotWithAllItemsByFilterType) {
      return <div className="ballot container-fluid well u-stack--md u-inset--md">
        { this.state.showBallotIntroModal ?
          <BallotIntroModal show={this.state.showBallotIntroModal} toggleFunction={this.toggleBallotIntroModal} /> :
          null
        }
        <div className={ isWebApp() ? "ballot__header" : "ballot__header ballot__header__top-cordova"} >
          <BrowserPushMessage incomingProps={this.props} />
          <p className="ballot__date_location">
            If your ballot does not appear momentarily, please <Link to="/settings/location">change your address</Link>.
          </p>
        </div>
        <BallotElectionList ballotBaseUrl={ballotBaseUrl}
                            ballotElectionList={this.state.voter_ballot_list}
                            organization_we_vote_id={this.state.organization.organization_we_vote_id}
                            showRelevantElections />
      </div>;
    }

    const missing_address = this.state.location === null;

    // const ballot_caveat = BallotStore.ballot_properties.ballot_caveat; // ballot_properties might be undefined
    const electionName = BallotStore.currentBallotElectionName;
    const electionDayText = BallotStore.currentBallotElectionDate;
    const polling_location_we_vote_id_source = BallotStore.currentBallotPollingLocationSource;
    let organization_admin_url = webAppConfig.WE_VOTE_SERVER_ROOT_URL + "org/" + this.state.organization.organization_we_vote_id + "/pos/?google_civic_election_id=" + VoterStore.election_id() + "&state_code=";
    let ballot_returned_admin_edit_url = webAppConfig.WE_VOTE_SERVER_ROOT_URL + "pl/" + polling_location_we_vote_id_source + "/summary/?google_civic_election_id=" + VoterStore.election_id() + "&state_code=";

    const emptyBallotButton = this.state.completionLevelFilterType !== "none" && !missing_address ?
        <span>
          {/* <Link to={ballotBaseUrl}>
              <Button variant="primary">View Full Ballot</Button>
          </Link> */}
        </span> :
        <div className="container-fluid well u-stack--md u-inset--md">
          <Helmet title="Enter Your Address - We Vote" />
          <h3 className="h3">
            Enter address where you are registered to vote
          </h3>
          <div>
            <AddressBox {...this.props} saveUrl={ballotBaseUrl} />
          </div>
        </div>;

    // console.log("ballotWithAllItemsByFilterType: ", this.state.ballotWithAllItemsByFilterType);
    const emptyBallot = this.state.ballotWithAllItemsByFilterType.length === 0 ?
      <div>
        <h3 className="text-center">{this.getEmptyMessageByFilterType(this.state.completionLevelFilterType)}</h3>
        {emptyBallotButton}
        <div className="container-fluid well u-stack--md u-inset--md">
          <BallotElectionList ballotBaseUrl={ballotBaseUrl}
                              ballotElectionList={this.state.voter_ballot_list}
                              organization_we_vote_id={this.state.organization.organization_we_vote_id} />
        </div>
     </div> :
      null;

    const electionDayTextFormatted = electionDayText ? <span>{moment(electionDayText).format("MMM Do, YYYY")}</span> : <span />;

    let in_remaining_decisions_mode = this.state.completionLevelFilterType === "filterRemaining";

    let voter_ballot_location = VoterStore.getBallotLocationForVoter();
    let voter_entered_address = false;
    let voter_specific_ballot_from_google_civic = false;
    let ballot_location_display_name = "";
    let substituted_address_nearby = "";
    if (voter_ballot_location && voter_ballot_location.voter_entered_address) {
      voter_entered_address = true;
    }

    if (voter_ballot_location && voter_ballot_location.voter_specific_ballot_from_google_civic) {
      voter_specific_ballot_from_google_civic = true;
    }

    if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_location_display_name) {
      // console.log("BallotStore.ballot_properties:", BallotStore.ballot_properties);
      ballot_location_display_name = BallotStore.ballot_properties.ballot_location_display_name;
    } else if (voter_ballot_location && voter_ballot_location.ballot_location_display_name) {
      // Get the location name from the VoterStore address object
      // console.log("voter_ballot_location:", voter_ballot_location);
      ballot_location_display_name = voter_ballot_location.ballot_location_display_name;
    }

    if (BallotStore.ballot_properties && BallotStore.ballot_properties.substituted_address_nearby) {
      substituted_address_nearby = BallotStore.ballot_properties.substituted_address_nearby;
    } else if (voter_ballot_location && voter_ballot_location.text_for_map_search) {
      // Get the location from the VoterStore address object
      substituted_address_nearby = voter_ballot_location.text_for_map_search;
    }

    if (this.state.ballotWithAllItemsByFilterType.length === 0 && in_remaining_decisions_mode) {
      historyPush(this.state.pathname);
    }

    let ballotHeading = "ballot__heading";
    if (isCordova()) {
      if (isIPhoneXSMax() || isIPhone678Plus() || isIPhoneXorXS()) {
        ballotHeading = "ballot__heading ballot__heading-cordova-md";
      } else if (hasIPhoneNotch()) {
        ballotHeading = "ballot__heading ballot__heading-cordova-sm";
      } else {
        ballotHeading = "ballot__heading ballot__heading-cordova-lg";
      }
    }

    // Split up the ballot into items that the organization is highlighting vs. the items NOT being discussed
    let ballotWithOrganizationEndorsements = [];
    let ballotWithRemainingItems = [];

    for (var i = 0; i < this.state.ballotWithAllItemsByFilterType.length; i++) {
      var one_contest = this.state.ballotWithAllItemsByFilterType[i];
      if (one_contest && this.doesOrganizationHavePositionOnOffice(one_contest.we_vote_id)) {
        ballotWithOrganizationEndorsements.push(one_contest);
      } else {
        ballotWithRemainingItems.push(one_contest);
      }
    }

    // console.log("VoterGuideBallot SelectBallotModal, this.state.organization.organization_we_vote_id:", this.state.organization.organization_we_vote_id);
    return <div className="ballot">
      { this.state.showBallotIntroModal ? <BallotIntroModal show={this.state.showBallotIntroModal} toggleFunction={this.toggleBallotIntroModal} /> : null }
      { this.state.showMeasureModal ? <MeasureModal show={this.state.showMeasureModal} toggleFunction={this.toggleMeasureModal} measure={this.state.measure_for_modal}/> : null }
      { this.state.showCandidateModal ? <CandidateModal show={this.state.showCandidateModal} toggleFunction={this.toggleCandidateModal} candidate={this.state.candidate_for_modal}/> : null }
      { this.state.showSelectBallotModal ? <SelectBallotModal ballotElectionList={this.state.ballotElectionList}
                                                              ballotBaseUrl={ballotBaseUrl}
                                                              google_civic_election_id={this.state.google_civic_election_id}
                                                              location={this.state.location}
                                                              organization_we_vote_id={this.state.organization.organization_we_vote_id}
                                                              pathname={this.state.pathname}
                                                              show={this.state.showSelectBallotModal}
                                                              toggleFunction={this.toggleSelectBallotModal}
                                                              /> : null }
      { this.state.showBallotSummaryModal ? <BallotSummaryModal show={this.state.showBallotSummaryModal} toggleFunction={this.toggleBallotSummaryModal} /> : null }

      <div className="card">
        <div className="card-main">
                <Helmet title={this.state.organization.organization_name + " - We Vote"} />
                <BrowserPushMessage incomingProps={this.props} />
                <header className="ballot__header__group">
                  <h1 className={`ballot__header__title${isCordova() && "__cordova"}`}>
                    { electionName ?
                       <span className="u-push--sm">
                         {electionName} <span className="d-none d-sm-inline">&mdash; </span>
                         <span className="u-gray-mid u-no-break">{electionDayTextFormatted}</span>
                       </span> :
                       <span className="u-push--sm">
                         Loading Election...
                       </span> }
                    {/* We always show the change election option */}
                    <span className="u-no-break d-print-none u-cursor--pointer"
                          onClick={this.toggleSelectBallotModal} >
                      <span className="u-no-break u-f8 d-none d-sm-inline"><img src={cordovaDot("/img/global/icons/gear-icon.png")}
                           role="button"
                           alt={"change address or election"}/> change address or election</span>
                      <span className="u-no-break u-f6 d-inline d-sm-none"><img src={cordovaDot("/img/global/icons/gear-icon.png")}
                           role="button"
                           alt={"change address or election"}/> change address or election</span>
                    </span>
                  </h1>
                </header>

          <div className="d-print-none">
            { ballotWithOrganizationEndorsements.length ?
              <PledgeToSupportOrganizationStatusBar organization={this.state.organization} /> :
              null
            }
            {/* Turned off for now:
             <PledgeToVoteStatusBar organization={this.state.organization} /> */}
          </div>

          <div className="d-print-none">
            { ballotWithOrganizationEndorsements.length ?
              <PledgeToSupportOrganizationButton organization={this.state.organization}
                                               pledgeToVoteAction={this.pledgeToVoteWithVoterGuide} /> :
              null
            }
            {/* Turned off for now:  This button is almost exactly like the PledgeToSupportOrganizationButton and should be merged together
             <PledgeToVoteButton organization={this.state.organization}
                                 pledgeToVoteAction={this.pledgeToVoteWithVoterGuide} />*/}
          </div>

                {this.state.ballotWithAllItemsByFilterType.length > 0 ?
                  <div>
                    <BallotStatusMessage ballot_location_chosen
                                         ballot_location_display_name={ballot_location_display_name}
                                         election_day_text={ElectionStore.getElectionDayText(this.state.google_civic_election_id)}
                                         election_is_upcoming={ElectionStore.isElectionUpcoming(this.state.google_civic_election_id)}
                                         voter_entered_address={voter_entered_address}
                                         google_civic_data_exists={ElectionStore.googleCivicDataExists(this.state.google_civic_election_id)}
                                         voter_specific_ballot_from_google_civic={voter_specific_ballot_from_google_civic}
                                         text_for_map_search={substituted_address_nearby}
                                         toggleSelectBallotModal={this.toggleSelectBallotModal}
                                         google_civic_election_id={this.state.google_civic_election_id}
                    />
                  </div> :
                  null }
        </div>
      </div>

      <div className="page-content-container">
        <div className="container-fluid">
          {emptyBallot}
          <div className="row ballot__body">
            <div className="col-xs-12 col-md-12">
              {/* The ballot items the organization wants to promote */}
              <div>
                {ballotWithOrganizationEndorsements.length > 0 &&
                  <div className={isWebApp() ? "BallotList" : "BallotList__cordova"}>
                    {ballotWithOrganizationEndorsements.map( (item) => <VoterGuideBallotItemCompressed toggleCandidateModal={this.toggleCandidateModal}
                                                                                                   toggleMeasureModal={this.toggleMeasureModal}
                                                                                                   key={item.we_vote_id}
                                                                                                   organization={this.props.organization}
                                                                                                   organization_we_vote_id={this.props.organization.organization_we_vote_id}
                                                                                                   location={this.props.location}
                                                                                                   urlWithoutHash={this.props.location.pathname + this.props.location.search}
                                                                                                   {...item} />)}
                  </div>
                }
              </div>

              {ballotWithOrganizationEndorsements.length && ballotWithRemainingItems.length ?
                <h4 className="h4">More Ballot Items</h4> :
                null }
                <div>
               {/* The rest of the ballot items */}
                 { this.state.ballotWithAllItemsByFilterType && this.state.ballotWithAllItemsByFilterType.length ?
                    <div className="row ballot__item-filter-tabs">
                      { BALLOT_ITEM_FILTER_TYPES.map(one_type => {
                          let allBallotItemsByFilterType = this.state.ballotWithAllItems.filter(item => {
                            if (one_type === "Measure") {
                              return item.kind_of_ballot_item === "MEASURE";
                            } else {
                              return one_type === item.race_office_level;
                            }
                          });
                          if (allBallotItemsByFilterType.length) {
                            let ballotItemsByFilterType = this.state.ballotWithAllItemsByFilterType.filter(item => {
                              if (one_type === "Measure") {
                                return item.kind_of_ballot_item === "MEASURE";
                              } else {
                                return one_type === item.race_office_level;
                              }
                            });
                            return <div className="col-6 col-sm-3 u-stack--md u-inset__h--sm" key={one_type}>
                              <Button variant="outline-secondary" block active={one_type === this.state.raceLevelFilterType}
                                      onClick={() => this.setBallotItemFilterType(one_type)}
                                      className={"btn_ballot_filter"}>
                                {one_type}&nbsp;({ballotItemsByFilterType.length})
                              </Button>
                            </div>;
                          } else {
                            return null;
                          }
                        })
                      }
                    </div> :
                    null
                  }
                {ballotWithRemainingItems.length > 0 &&
                  <div className={isWebApp() ? "BallotList" : "BallotList__cordova"}>
                  {ballotWithRemainingItems.map( (item) => {
                      //ballot limited by items by filter type
                        // console.log(this.state.raceLevelFilterType);
                        if (this.state.raceLevelFilterType === "All" ||
                            item.kind_of_ballot_item === "MEASURE" && this.state.raceLevelFilterType === "Measure" ||
                            this.state.raceLevelFilterType === item.race_office_level) {
                          return <BallotItemCompressed currentBallotIdInUrl={this.props.location.hash.slice(1)}
                                                       key={item.we_vote_id}
                                                       organization={this.props.organization}
                                                       organization_we_vote_id={this.props.organization.organization_we_vote_id}
                                                       toggleCandidateModal={this.toggleCandidateModal}
                                                       toggleMeasureModal={this.toggleMeasureModal}
                                                       updateOfficeDisplayUnfurledTracker={this.updateOfficeDisplayUnfurledTracker}
                                                       urlWithoutHash={this.props.location.pathname + this.props.location.search}
                                                       ref={(ref) => {this.ballotItemsCompressedReference[item.we_vote_id] = ref;}}
                                                       {...item} />;
                        } else {
                          return null;
                        }
                      })
                    }
                  </div>
              }
              </div>

              {/* Show links to this candidate in the admin tools */}
              { this.state.voter && (this.state.voter.is_admin || this.state.voter.is_verified_volunteer) &&
                this.props.organization && this.props.organization.organization_we_vote_id ?
                <span className="u-wrap-links d-print-none"><span>Admin:</span>
                  <OpenExternalWebSite url={organization_admin_url}
                                       target="_blank"
                                       body={<span>Open this organization in Admin interface ("{this.props.organization.organization_we_vote_id}")</span>} />
                </span> :
                null
              }

              {/* Show links to the polling location this was copied from in the admin tools */}
              { this.state.voter && polling_location_we_vote_id_source && (this.state.voter.is_admin || this.state.voter.is_verified_volunteer) ?
                <div className="u-wrap-links d-print-none">Admin link:
                  <OpenExternalWebSite url={ballot_returned_admin_edit_url}
                                       target="_blank"
                                       body={<span>This ballot copied from polling location "{polling_location_we_vote_id_source}"</span>} />
                </div> : null
              }
            </div>
          </div>
        </div>
      </div>
    </div>;
  }
}
