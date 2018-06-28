import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router";
import AddressBox from "../../components/AddressBox";
import AnalyticsActions from "../../actions/AnalyticsActions";
import BallotActions from "../../actions/BallotActions";
import BallotElectionList from "../../components/Ballot/BallotElectionList";
import BallotItemCompressed from "../../components/Ballot/BallotItemCompressed";
import BallotStatusMessage from "../../components/Ballot/BallotStatusMessage";
import BallotStore from "../../stores/BallotStore";
import BallotSummaryModal from "../../components/Ballot/BallotSummaryModal";
import BrowserPushMessage from "../../components/Widgets/BrowserPushMessage";
import CandidateActions from "../../actions/CandidateActions";
import CandidateModal from "../../components/Ballot/CandidateModal";
import {cordovaDot, historyPush, isWebApp} from "../../utils/cordovaUtils";
import cookies from "../../utils/cookies";
import EditAddressInPlace from "../../components/Widgets/EditAddressInPlace";
import ElectionActions from "../../actions/ElectionActions";
import ElectionStore from "../../stores/ElectionStore";
import getElementPosition from "../../utils/getElementPosition";
import Helmet from "react-helmet";
import isMobile from "../../utils/isMobile";
import MeasureActions from "../../actions/MeasureActions";
import MeasureModal from "../../components/Ballot/MeasureModal";
import moment from "moment";
import OpenExternalWebSite from "../../utils/OpenExternalWebSite";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationStore from "../../stores/OrganizationStore";
import PledgeToSupportOrganizationButton from "../../components/VoterGuide/PledgeToSupportOrganizationButton";
import PledgeToSupportOrganizationStatusBar from "../../components/VoterGuide/PledgeToSupportOrganizationStatusBar";
import SelectBallotModal from "../../components/Ballot/SelectBallotModal";
import SupportActions from "../../actions/SupportActions";
import SupportStore from "../../stores/SupportStore";
import VoterGuideActions from "../../actions/VoterGuideActions";
import VoterGuideBallotItemCompressed from "../../components/VoterGuide/VoterGuideBallotItemCompressed";
import VoterGuideStore from "../../stores/VoterGuideStore";
import VoterStore from "../../stores/VoterStore";
import { calculateBallotBaseUrl } from "../../utils/textFormat";
import { renderLog } from "../../utils/logging";
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
      ballot_returned_we_vote_id: "",
      ballot_location_shortcut: "",
      candidate_for_modal: {
        voter_guides_to_follow_for_latest_ballot_item: [],
        position_list: [],
      },
      hide_intro_modal_from_url: 0,
      hide_intro_modal_from_cookie: 0,
      lastHashUsedInLinkScroll: "",
      measure_for_modal: {
        voter_guides_to_follow_for_latest_ballot_item: [],
        position_list: [],
      },
      mounted: false,
      organization: {},
      showCandidateModal: false,
      showMeasureModal: false,
      showSelectBallotModal: false,
      showBallotSummaryModal: false,
      voter_ballot_list: [],
      waiting_for_new_ballot_items: false,
    };

    this.ballotItemsCompressedReference = {};
    this.nullFunction = this.nullFunction.bind(this);
    this.pledgeToVoteWithVoterGuide = this.pledgeToVoteWithVoterGuide.bind(this);
    this.toggleCandidateModal = this.toggleCandidateModal.bind(this);
    this.toggleMeasureModal = this.toggleMeasureModal.bind(this);
    this.toggleSelectBallotModal = this.toggleSelectBallotModal.bind(this);
    this.toggleBallotSummaryModal = this.toggleBallotSummaryModal.bind(this);
  }

  componentDidMount () {
    let ballotBaseUrl = calculateBallotBaseUrl(null, this.props.location.pathname);
    // console.log("VoterGuideBallot componentDidMount, ballotBaseUrl", ballotBaseUrl);

    let hide_intro_modal_from_url = this.props.location.query ? this.props.location.query.hide_intro_modal : 0;
    let hide_intro_modal_from_cookie = cookies.getItem("hide_intro_modal") || 0;
    let wait_until_voter_sign_in_completes = this.props.location.query ? this.props.location.query.wait_until_voter_sign_in_completes : 0;

    if ( wait_until_voter_sign_in_completes !== undefined || hide_intro_modal_from_cookie || hide_intro_modal_from_url) {
      this.setState({
        mounted: true,
      });
    } else {
      this.setState({
        mounted: true,
      });
    }

    let filter_type = this.props.location && this.props.location.query ? this.props.location.query.type : "all";
    let ballot_with_all_items = BallotStore.getBallotByFilterType(filter_type);
    if (ballot_with_all_items !== undefined) {
      // console.log("ballot_with_all_items !== undefined");
      this.setState({
        ballot_with_all_items: ballot_with_all_items,
        filter_type: filter_type,
      });
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
    } else if (ballot_with_all_items === undefined) {
      // console.log("WebApp doesn't know the election or have ballot data, so ask the API server to return best guess");
      BallotActions.voterBallotItemsRetrieve(0, "", "");
    }
    // DALE NOTE 2018-1-18 Commented this out because it will take voter away from voter guide. Needs further testing.
    // else if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_found === false){ // No ballot found
    //   // console.log("if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_found === false");
    //   historyPush("/settings/location");
    // }

    // We need a ballotStoreListener here because we want the ballot to display before positions are received
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    // NOTE: voterAllPositionsRetrieve and positionsCountForAllBallotItems are also called in SupportStore when voterAddressRetrieve is received,
    // so we get duplicate calls when you come straight to the Ballot page. There is no easy way around this currently.
    SupportActions.voterAllPositionsRetrieve();
    SupportActions.positionsCountForAllBallotItems(google_civic_election_id);
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
    // console.log("End of componentDidMount");

    this.setState({
      ballotElectionList: BallotStore.ballotElectionList(),
      ballot_returned_we_vote_id: ballot_returned_we_vote_id,
      ballot_location_shortcut: ballot_location_shortcut,
      google_civic_election_id: parseInt(google_civic_election_id, 10),
      hide_intro_modal_from_url: hide_intro_modal_from_url,
      hide_intro_modal_from_cookie: hide_intro_modal_from_cookie,
      location: this.props.location,
      organization: this.props.organization,
      pathname: this.props.location.pathname,
      voter_guide: VoterGuideStore.getVoterGuideForOrganizationIdAndElection(this.props.organization.organization_we_vote_id, VoterStore.election_id()),
      wait_until_voter_sign_in_completes: wait_until_voter_sign_in_completes,
    });

    if (this.props.location && this.props.location.hash) {
      this.setState({ lastHashUsedInLinkScroll: this.props.location.hash });
    }
  }

  componentWillReceiveProps (nextProps) {
    // console.log("VoterGuideBallot componentWillReceiveProps, nextProps: ", nextProps);
    // console.log("VoterGuideBallot this.state: ", this.state);
    let filter_type = nextProps.location && nextProps.location.query ? nextProps.location.query.type : "all";

    // We don't want to let the google_civic_election_id disappear
    let google_civic_election_id = nextProps.params.google_civic_election_id || this.state.google_civic_election_id;
    let ballot_returned_we_vote_id = nextProps.params.ballot_returned_we_vote_id || "";
    ballot_returned_we_vote_id = ballot_returned_we_vote_id.trim();
    let ballot_location_shortcut = nextProps.params.ballot_location_shortcut || "";
    ballot_location_shortcut = ballot_location_shortcut.trim();

    // Were there any actual changes?
    if (ballot_returned_we_vote_id !== this.state.ballot_returned_we_vote_id || ballot_location_shortcut !== this.state.ballot_location_shortcut || google_civic_election_id !== this.state.google_civic_election_id || filter_type !== this.state.filter_type) {
      // console.log("VoterGuideBallot componentWillReceiveProps - change found, nextProps: ", nextProps);
      this.setState({
        ballot_with_all_items: BallotStore.getBallotByFilterType(filter_type),
        ballot_returned_we_vote_id: ballot_returned_we_vote_id,
        ballot_location_shortcut: ballot_location_shortcut,
        filter_type: filter_type,
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

    if (nextProps.location && nextProps.location.hash){
      this.setState({lastHashUsedInLinkScroll: nextProps.location.hash});
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
        this.setState({
          voter: VoterStore.getVoter(),
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
    if (this.state.mounted) {
      if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_found && BallotStore.ballot && BallotStore.ballot.length === 0) {
        // Ballot is found but ballot is empty. We want to stay put.
        // console.log("onBallotStoreChange: ballot_with_all_items is empty");
      } else {
        let prior_filter_type = this.state.filter_type || "all";
        let new_filter_type = this.state.location && this.state.location.query && this.state.location.query.type !== "" ? this.state.location.query.type : prior_filter_type;
        this.setState({
          ballot_with_all_items: BallotStore.getBallotByFilterType(new_filter_type),
          filter_type: new_filter_type,
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
    });

    if (Object.keys(this.state.ballot_item_unfurled_tracker).length === 0) {
      this.setState({
        ballot_item_unfurled_tracker: BallotStore.current_ballot_item_unfurled_tracker
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

    for (var i = 0; i < elections_list.length; i++) {
      var election = elections_list[i];
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

  componentDidUpdate (prevProps, prevState) {
    if (this.state.lastHashUsedInLinkScroll && this.state.lastHashUsedInLinkScroll !== prevState.lastHashUsedInLinkScroll) {
    this.hashLinkScroll();
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
          const topPosition = getElementPosition(element).top;
          if (isMobile()) {
            window.scrollTo(0, topPosition - 104);
          } else {
            window.scrollTo(0, topPosition - 104);
          }
        }
      }, 0);
    }
  }

  getEmptyMessageByFilterType (filter_type) {
    switch (filter_type) {
      case "filterRemaining":
        return "You already chose a candidate or position for each ballot item";
      case "filterSupport":
        return "You haven't supported any candidates or measures yet.";
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

  updateOfficeDisplayUnfurledTracker = (we_vote_id, status) => {
    const new_ballot_item_unfurled_tracker = { ... this.state.ballot_item_unfurled_tracker, [we_vote_id]: status};
    BallotActions.voterBallotItemOpenOrClosedSave(new_ballot_item_unfurled_tracker);
    this.setState({
      ballot_item_unfurled_tracker: new_ballot_item_unfurled_tracker
    });
  }

  render () {
    renderLog(__filename);
    // console.log("VoterGuideBallot render, this.state: ", this.state);
    let ballot_with_all_items = this.state.ballot_with_all_items;
    let ballotBaseUrl = calculateBallotBaseUrl(null, this.props.location.pathname);
    // console.log("VoterGuideBallot render, ballotBaseUrl: ", ballotBaseUrl);

    if (!ballot_with_all_items) {
      let voter_address_object = VoterStore.getAddressObject();
      return <div className="ballot container-fluid well u-stack--md u-inset--md">
        <div className="ballot__header">
          <BrowserPushMessage incomingProps={this.props} />
          <EditAddressInPlace address={voter_address_object}
                              noAddressMessage={"We are guessing your location. If a ballot does not appear here momentarily, please enter your address, or choose an election below."}
                              pathname={this.state.pathname}
                              toggleFunction={this.nullFunction} />

        </div>

        <BallotElectionList ballotBaseUrl={ballotBaseUrl}
                            ballotElectionList={this.state.voter_ballot_list}
                            organization_we_vote_id={this.state.organization.organization_we_vote_id} />
      </div>;
    }

    const missing_address = this.state.location === null;
    // const ballot_caveat = BallotStore.ballot_properties.ballot_caveat; // ballot_properties might be undefined
    const election_name = BallotStore.currentBallotElectionName;
    const election_day_text = BallotStore.currentBallotElectionDate;
    const polling_location_we_vote_id_source = BallotStore.currentBallotPollingLocationSource;
    let organization_admin_url = webAppConfig.WE_VOTE_SERVER_ROOT_URL + "org/" + this.state.organization.organization_we_vote_id + "/pos/?google_civic_election_id=" + VoterStore.election_id() + "&state_code=";
    let ballot_returned_admin_edit_url = webAppConfig.WE_VOTE_SERVER_ROOT_URL + "pl/" + polling_location_we_vote_id_source + "/summary/?google_civic_election_id=" + VoterStore.election_id() + "&state_code=";

    const emptyBallotButton = this.state.filter_type !== "none" && !missing_address ?
        <span>
          <Link to={ballotBaseUrl}>
              <Button bsStyle="primary">View Full Ballot</Button>
          </Link>
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

    // console.log("ballot_with_all_items: ", ballot_with_all_items);
    const emptyBallot = ballot_with_all_items.length === 0 ?
      <div>
        <h3 className="text-center">{this.getEmptyMessageByFilterType(this.state.filter_type)}</h3>
        {emptyBallotButton}
        <div className="container-fluid well u-stack--md u-inset--md">
          <BallotElectionList ballotBaseUrl={ballotBaseUrl}
                              ballotElectionList={this.state.voter_ballot_list}
                              organization_we_vote_id={this.state.organization.organization_we_vote_id} />
        </div>
     </div> :
      null;

    const electionTooltip = election_day_text ? <Tooltip id="tooltip">Election day {moment(election_day_text).format("MMM Do, YYYY")}</Tooltip> : <span />;

    let in_remaining_decisions_mode = this.state.filter_type === "filterRemaining";

    let voter_ballot_location = VoterStore.getBallotLocationForVoter();
    let voter_entered_address = false;
    let voter_specific_ballot_from_google_civic = false;
    let ballot_location_display_name = "";
    if (voter_ballot_location && voter_ballot_location.voter_entered_address) {
      voter_entered_address = true;
    }
    if (voter_ballot_location && voter_ballot_location.voter_specific_ballot_from_google_civic) {
      voter_specific_ballot_from_google_civic = true;
    }
    if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_location_display_name) {
      ballot_location_display_name = BallotStore.ballot_properties.ballot_location_display_name;
    } else if (voter_ballot_location && voter_ballot_location.ballot_location_display_name) {
      // Get the location name from the VoterStore address object
      ballot_location_display_name = voter_ballot_location.ballot_location_display_name;
    }

    if (ballot_with_all_items.length === 0 && in_remaining_decisions_mode) {
      historyPush(this.state.pathname);
    }
    // console.log("VoterGuideBallot.jsx, this.state.google_civic_election_id: ", this.state.google_civic_election_id);

    // Split up the ballot into items that the organization is highlighting vs. the items NOT being discussed
    let ballot_with_organization_items = [];
    let ballot_with_remaining_items = [];

    for (var i = 0; i < ballot_with_all_items.length; i++) {
      var one_contest = ballot_with_all_items[i];
      if (one_contest && this.doesOrganizationHavePositionOnOffice(one_contest.we_vote_id)) {
        ballot_with_organization_items.push(one_contest);
      } else {
        ballot_with_remaining_items.push(one_contest);
      }
    }

    // console.log("VoterGuideBallot SelectBallotModal, this.state.organization.organization_we_vote_id:", this.state.organization.organization_we_vote_id);
    return <div className="ballot">
      { this.state.showMeasureModal ? <MeasureModal show={this.state.showMeasureModal} toggleFunction={this.toggleMeasureModal} measure={this.state.measure_for_modal}/> : null }
      { this.state.showCandidateModal ? <CandidateModal show={this.state.showCandidateModal} toggleFunction={this.toggleCandidateModal} candidate={this.state.candidate_for_modal}/> : null }
      { this.state.showSelectBallotModal ? <SelectBallotModal ballotElectionList={this.state.ballotElectionList}
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
            <h1 className="h3 ballot__header__title-voter-guide">
              { election_name ?
                <OverlayTrigger placement="top" overlay={electionTooltip} >
                 <span className="u-push--sm">{election_name}</span>
                </OverlayTrigger> :
                null
              }
              {/* We always show the change election option */}
              <span className="u-no-break hidden-print u-f8 u-cursor--pointer"
                    onClick={this.toggleSelectBallotModal}>
                <img src={cordovaDot("/img/global/icons/gear-icon.png")}
                     role="button"
                     alt={"change address or election"} />
                &nbsp;change address or election
              </span>
            </h1>
          </header>

          <div className="hidden-print">
            { ballot_with_organization_items.length ?
              <PledgeToSupportOrganizationStatusBar organization={this.state.organization} /> :
              null
            }
            {/* Turned off for now:
             <PledgeToVoteStatusBar organization={this.state.organization} /> */}
          </div>

          <div className="hidden-print">
            { ballot_with_organization_items.length ?
              <PledgeToSupportOrganizationButton organization={this.state.organization}
                                               pledgeToVoteAction={this.pledgeToVoteWithVoterGuide} /> :
              null
            }
            {/* Turned off for now:
             <PledgeToVoteButton organization={this.state.organization}
                                 pledgeToVoteAction={this.pledgeToVoteWithVoterGuide} />*/}
          </div>

          { this.state.ballot_with_all_items.length ?
            <div>
              <BallotStatusMessage ballot_location_chosen
                                   ballot_location_display_name={ballot_location_display_name}
                                   election_day_text={ElectionStore.getElectionDayText(this.state.google_civic_election_id)}
                                   election_is_upcoming={ElectionStore.isElectionUpcoming(this.state.google_civic_election_id)}
                                   voter_entered_address={voter_entered_address}
                                   google_civic_data_exists={ElectionStore.googleCivicDataExists(this.state.google_civic_election_id)}
                                   voter_specific_ballot_from_google_civic={voter_specific_ballot_from_google_civic}
                                   toggleSelectBallotModal={this.toggleSelectBallotModal}
                                   google_civic_election_id={this.state.google_civic_election_id} />
            </div> :
            null
          }
        </div>
      </div>

      <div className="page-content-container">
        <div className="container-fluid">
          {emptyBallot}
          <div className="row ballot__voter-guide-body">
            <div className="col-xs-12 col-md-12">
              {/* The ballot items the organization wants to promote */}
              <div>
                {ballot_with_organization_items.length > 0 &&
                  <div className={isWebApp() ? "BallotList" : "BallotList__cordova"}>
                    {ballot_with_organization_items.map( (item) => <VoterGuideBallotItemCompressed toggleCandidateModal={this.toggleCandidateModal}
                                                                                                   toggleMeasureModal={this.toggleMeasureModal}
                                                                                                   key={item.we_vote_id}
                                                                                                   organization={this.props.organization}
                                                                                                   organization_we_vote_id={this.props.organization.organization_we_vote_id}
                                                                                                   location={this.props.location}
                                                                                                   {...item} />)}
                  </div>
                }
              </div>

              {ballot_with_organization_items.length && ballot_with_remaining_items.length ?
                <h4 className="h4">More Ballot Items</h4> :
                null }
              {/* The rest of the ballot items */}
              <div>
              {ballot_with_remaining_items.length > 0 &&
                <div className={isWebApp() ? "BallotList" : "BallotList__cordova"}>
                  {ballot_with_remaining_items.map( (item) => <BallotItemCompressed currentBallotIdInUrl={this.props.location.hash.slice(1)}
                                                                                    key={item.we_vote_id}
                                                                                    organization={this.props.organization}
                                                                                    organization_we_vote_id={this.props.organization.organization_we_vote_id}
                                                                                    toggleCandidateModal={this.toggleCandidateModal}
                                                                                    toggleMeasureModal={this.toggleMeasureModal}
                                                                                    updateOfficeDisplayUnfurledTracker={this.updateOfficeDisplayUnfurledTracker}
                                                                                    urlWithoutHash={this.props.location.pathname + this.props.location.search}
                                                                                    ref={(ref) => {this.ballotItemsCompressedReference[item.we_vote_id] = ref;}}
                                                                                    {...item} />)}
                </div>
              }
              </div>

              {/* Show link to this organization in the admin tools */}
              { this.state.voter && (this.state.voter.is_admin || this.state.voter.is_verified_volunteer)
                && this.props.organization && this.props.organization.organization_we_vote_id ?
                <div className="u-wrap-links hidden-print">Admin link:
                  <OpenExternalWebSite url={organization_admin_url}
                                       target="_blank"
                                       body={<span>Open this organization in Admin interface ("{this.props.organization.organization_we_vote_id}")</span>} />
                </div> : null
              }

              {/* Show links to the polling location this was copied from in the admin tools */}
              { this.state.voter && polling_location_we_vote_id_source && (this.state.voter.is_admin || this.state.voter.is_verified_volunteer) ?
                <div className="u-wrap-links hidden-print">Admin link:
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
