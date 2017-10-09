import React, { Component, PropTypes } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { browserHistory, Link } from "react-router";
import AnalyticsActions from "../../actions/AnalyticsActions";
import CandidateModal from "../../components/Ballot/CandidateModal";
import cookies from "../../utils/cookies";
import BallotActions from "../../actions/BallotActions";
import BallotFilter from "../../components/Navigation/BallotFilter";
import BallotItemCompressed from "../../components/Ballot/BallotItemCompressed";
import BallotItemReadyToVote from "../../components/Ballot/BallotItemReadyToVote";
import BallotIntroModal from "../../components/Ballot/BallotIntroModal";
import BallotLocationChoices from "../../components/Navigation/BallotLocationChoices";
import BallotSideBar from "../../components/Navigation/BallotSideBar";
import BallotStatusMessage from "../../components/Ballot/BallotStatusMessage";
import BallotStore from "../../stores/BallotStore";
import BallotSummaryModal from "../../components/Ballot/BallotSummaryModal";
import BrowserPushMessage from "../../components/Widgets/BrowserPushMessage";
import EditAddress from "../../components/Widgets/EditAddress";
import ElectionStore from "../../stores/ElectionStore";
import Helmet from "react-helmet";
import LoadingWheel from "../../components/LoadingWheel";
import MeasureModal from "../../components/Ballot/MeasureModal";
import SelectAddressModal from "../../components/Ballot/SelectAddressModal";
import SelectBallotModal from "../../components/Ballot/SelectBallotModal";
import SupportActions from "../../actions/SupportActions";
import SupportStore from "../../stores/SupportStore";
import VoterActions from "../../actions/VoterActions";
import VoterConstants from "../../constants/VoterConstants";
import VoterGuideActions from "../../actions/VoterGuideActions";
import VoterGuideStore from "../../stores/VoterGuideStore";
import VoterStore from "../../stores/VoterStore";


const web_app_config = require("../../config");

export default class Ballot extends Component {
  static propTypes = {
    location: PropTypes.object,
    params: PropTypes.object
  };

  constructor (props){
    super(props);
    this.state = {
      ballot_returned_we_vote_id: "",
      ballot_location_shortcut: "",
      candidate_for_modal: {
        voter_guides_to_follow_for_latest_ballot_item: [],
        position_list: []
      },
      measure_for_modal: {
        voter_guides_to_follow_for_latest_ballot_item: [],
        position_list: []
      },
      showBallotIntroModal: false,
      showCandidateModal: false,
      showMeasureModal: false,
      showSelectBallotModal: false,
      showSelectAddressModal: false,
      showBallotSummaryModal: false,
      ballotElectionList: [],
      mounted: false,
      hide_intro_modal_from_url: 0,
      hide_intro_modal_from_cookie: 0,
    };

    this.toggleBallotIntroModal = this.toggleBallotIntroModal.bind(this);
    this.toggleCandidateModal = this.toggleCandidateModal.bind(this);
    this.toggleMeasureModal = this.toggleMeasureModal.bind(this);
    this.toggleSelectBallotModal = this.toggleSelectBallotModal.bind(this);
    this.toggleSelectAddressModal = this.toggleSelectAddressModal.bind(this);
    this.toggleBallotSummaryModal = this.toggleBallotSummaryModal.bind(this);
  }

  componentDidMount () {
    console.log("Ballot componentDidMount");
    let hide_intro_modal_from_url = this.props.location.query ? this.props.location.query.hide_intro_modal : 0;
    let hide_intro_modal_from_cookie = cookies.getItem("hide_intro_modal") || 0;
    let wait_until_voter_sign_in_completes = this.props.location.query ? this.props.location.query.wait_until_voter_sign_in_completes : 0;
    if ( wait_until_voter_sign_in_completes !== undefined || hide_intro_modal_from_cookie || hide_intro_modal_from_url ) {
      this.setState({
        mounted: true,
        showBallotIntroModal: false
      });
    } else {
      this.setState({
        mounted: true,
        showBallotIntroModal: !VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_MODAL_SHOWN)
      });
    }

    let ballot_returned_we_vote_id = this.props.params.ballot_returned_we_vote_id || "";
    // console.log("Specific ballot requested, ballot_returned_we_vote_id: ", ballot_returned_we_vote_id);
    let ballot_location_shortcut = this.props.params.ballot_location_shortcut || "";
    // console.log("Specific ballot requested, ballot_location_shortcut: ", ballot_location_shortcut);
    let google_civic_election_id = 0;
    // console.log("componentDidMount, BallotStore.ballot_properties: ", BallotStore.ballot_properties);
    if (BallotStore.ballot_properties && BallotStore.ballot_properties.google_civic_election_id) {
      google_civic_election_id = BallotStore.ballot_properties.google_civic_election_id;
    }

    this.setState({
      google_civic_election_id: google_civic_election_id,
      ballot_returned_we_vote_id: ballot_returned_we_vote_id,
      ballot_location_shortcut: ballot_location_shortcut,
      hide_intro_modal_from_url: hide_intro_modal_from_url,
      hide_intro_modal_from_cookie: hide_intro_modal_from_cookie,
      wait_until_voter_sign_in_completes: wait_until_voter_sign_in_completes
    });

    if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_found === false){ // No ballot found
      browserHistory.push("settings/location");
    } else {
      let ballot = this.getBallot(this.props);
      if (ballot !== undefined) {
        let ballot_type = this.props.location.query ? this.props.location.query.type : "all";
        this.setState({ballot: ballot, ballot_type: ballot_type});
      }
      // We need a ballotStoreListener here because we want the ballot to display before positions are received
      this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
      // NOTE: voterAllPositionsRetrieve and positionsCountForAllBallotItems are also called in SupportStore when voterAddressRetrieve is received,
      // so we get duplicate calls when you come straight to the Ballot page. There is no easy way around this currently.
      SupportActions.voterAllPositionsRetrieve();
      SupportActions.positionsCountForAllBallotItems();
      BallotActions.voterBallotListRetrieve(); // Retrieve a list of ballots for the voter from other elections
      this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
      this.supportStoreListener = SupportStore.addListener(this.onBallotStoreChange.bind(this));
      this._onVoterStoreChange(); // We call this to properly set showBallotIntroModal
      this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
      // Once a voter hits the ballot, they have gone through orientation
      cookies.setItem("show_full_navigation", "1", Infinity, "/");
    }
    if (ballot_returned_we_vote_id || ballot_location_shortcut) {
      let google_civic_election_id_zero = 0;
      BallotActions.voterBallotItemsRetrieve(google_civic_election_id_zero, ballot_returned_we_vote_id, ballot_location_shortcut);
    }
    AnalyticsActions.saveActionBallotVisit(VoterStore.election_id());
  }

  componentWillUnmount (){
    console.log("Ballot componentWillUnmount");
    this.setState({mounted: false});
    if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_found === false){
      // No ballot found
    } else {
      this.ballotStoreListener.remove();
      this.voterGuideStoreListener.remove();
      this.supportStoreListener.remove();
      this.voterStoreListener.remove();
    }
  }

  componentWillReceiveProps (nextProps){
    console.log("Ballot componentWillReceiveProps");
    let ballot_type = nextProps.location.query ? nextProps.location.query.type : "all";

    let ballot_returned_we_vote_id = nextProps.params.ballot_returned_we_vote_id || "";
    // console.log("componentWillReceiveProps, ballot_returned_we_vote_id: ", ballot_returned_we_vote_id);
    let ballot_location_shortcut = nextProps.params.ballot_location_shortcut || "";
    // console.log("componentWillReceiveProps, ballot_location_shortcut: ", ballot_location_shortcut);
    if (ballot_returned_we_vote_id !== this.state.ballot_returned_we_vote_id) {
      let google_civic_election_id_zero = 0;
      BallotActions.voterBallotItemsRetrieve(google_civic_election_id_zero, ballot_returned_we_vote_id);
    } else if (ballot_location_shortcut !== this.state.ballot_location_shortcut) {
      let google_civic_election_id_zero = 0;
      let ballot_returned_we_vote_id_empty = "";
      BallotActions.voterBallotItemsRetrieve(google_civic_election_id_zero, ballot_returned_we_vote_id_empty, ballot_location_shortcut);
    }

    this.setState({
      ballot: this.getBallot(nextProps),
      ballot_type: ballot_type,
      ballot_returned_we_vote_id: ballot_returned_we_vote_id,
      ballot_location_shortcut: ballot_location_shortcut
    });

    if (nextProps.location.pathname !== "/ballot" && ballot_location_shortcut === "") {
      browserHistory.push("/ballot");
    }
  }

  toggleCandidateModal (candidate_for_modal) {
    if (candidate_for_modal) {
      VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(candidate_for_modal.we_vote_id, "CANDIDATE");
      candidate_for_modal.voter_guides_to_follow_for_latest_ballot_item = VoterGuideStore.getVoterGuidesToFollowForBallotItemId(candidate_for_modal.we_vote_id);
    }

    this.setState({
      candidate_for_modal: candidate_for_modal,
      showCandidateModal: !this.state.showCandidateModal
    });
  }

  toggleBallotIntroModal () {
    if (this.state.showBallotIntroModal) {
      // Saved to the voter record that the ballot introduction has been seen
      VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.BALLOT_INTRO_MODAL_SHOWN);
    } else if (this.props.location.hash.includes("#")) {
      // Clear out any # from anchors in the URL
      browserHistory.push(this.props.location.pathname);
    }
    this.setState({ showBallotIntroModal: !this.state.showBallotIntroModal });
  }

  toggleMeasureModal (measureForModal) {
    if (measureForModal) {
      VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(measureForModal.measure_we_vote_id, "MEASURE");
    }
    this.setState({
      measure_for_modal: measureForModal,
      showMeasureModal: !this.state.showMeasureModal
    });
  }

  toggleSelectBallotModal () {
    this.setState({
      showSelectBallotModal: !this.state.showSelectBallotModal
    });
  }

  toggleSelectAddressModal () {
    // Clear out any # from anchors in the URL
    if (!this.state.showSelectAddressModal && this.props.location.hash.includes("#")) {
      browserHistory.push(this.props.location.pathname);
    }

    this.setState({
      showSelectAddressModal: !this.state.showSelectAddressModal
    });
  }

  toggleBallotSummaryModal () {
    this.setState({
      showBallotSummaryModal: !this.state.showBallotSummaryModal
    });
  }

  _onVoterStoreChange () {
    console.log("Ballot.jsx _onVoterStoreChange");
    if (this.state.mounted) {
      let consider_opening_ballot_intro_modal = true;
      if ( this.state.wait_until_voter_sign_in_completes ) {
        consider_opening_ballot_intro_modal = false;
        if ( this.state.voter && this.state.voter.is_signed_in ) {
          consider_opening_ballot_intro_modal = true;
          this.setState({ wait_until_voter_sign_in_completes: undefined });
          browserHistory.push(this.props.location.pathname);
        }
      }

      if ( this.state.hide_intro_modal_from_cookie || this.state.hide_intro_modal_from_url ) {
        consider_opening_ballot_intro_modal = false;
      }

      if ( consider_opening_ballot_intro_modal ) {
        this.setState({
          voter: VoterStore.getVoter(),
          showBallotIntroModal: !VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_MODAL_SHOWN)
        });
      } else {
        this.setState({ voter: VoterStore.getVoter() });
      }
    }
  }

  onBallotStoreChange (){
    // console.log("Ballot.jsx onBallotStoreChange, BallotStore.ballot_properties: ", BallotStore.ballot_properties);
    if (this.state.mounted) {
      if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_found && BallotStore.ballot && BallotStore.ballot.length === 0) {
        // Ballot is found but ballot is empty. We want to stay put.
        console.log("onBallotStoreChange: ballot is empty");
      } else {
        let ballot_type = this.props.location.query ? this.props.location.query.type : "all";
        this.setState({ballot: this.getBallot(this.props), ballot_type: ballot_type});
      }
      this.setState({ballotElectionList: BallotStore.ballotList()});
    }
    if (BallotStore.ballot_properties && BallotStore.ballot_properties.google_civic_election_id) {
      // console.log("onBallotStoreChange, google_civic_election_id: ", BallotStore.ballot_properties.google_civic_election_id);
      this.setState({google_civic_election_id: BallotStore.ballot_properties.google_civic_election_id});
    }

    let ballot_location_shortcut_of_retrieved_ballot = "";
    if (BallotStore.ballot_properties) {
      ballot_location_shortcut_of_retrieved_ballot = BallotStore.ballot_properties.ballot_location_shortcut;
      // ballot_location_shortcut_of_retrieved_ballot = "none" ? "" : ballot_location_shortcut_of_retrieved_ballot;
      // console.log("ballot_location_shortcut_of_retrieved_ballot: ", ballot_location_shortcut_of_retrieved_ballot);
    }
    // console.log("this.state.ballot_location_shortcut: ", this.state.ballot_location_shortcut);
    if (ballot_location_shortcut_of_retrieved_ballot !== "" || this.state.ballot_location_shortcut !== "") {
      if (this.state.ballot_location_shortcut !== ballot_location_shortcut_of_retrieved_ballot) {
        browserHistory.push("/ballot/" + ballot_location_shortcut_of_retrieved_ballot);
      }
    }
  }

  onVoterGuideStoreChange (){
    // Update the data for the modal to include the position of the organization related to this ballot item
    if (this.state.candidate_for_modal) {
      this.setState({
        candidate_for_modal: {
          ...this.state.candidate_for_modal,
          voter_guides_to_follow_for_latest_ballot_item: VoterGuideStore.getVoterGuidesToFollowForLatestBallotItem()
        }
      });
    } else if (this.state.measure_for_modal) {
      this.setState({
        measure_for_modal: {
          ...this.state.measure_for_modal,
          voter_guides_to_follow_for_latest_ballot_item: VoterGuideStore.getVoterGuidesToFollowForLatestBallotItem()
        }
      });
    }
  }

  componentDidUpdate (){
    this.hashLinkScroll();
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
        if (element) element.scrollIntoView();
      }, 0);
    }
  }

  getBallot (props){
    let ballot_type = props.location.query ? props.location.query.type : "all";
    switch (ballot_type) {
      case "filterRemaining":
        return BallotStore.ballot_remaining_choices;
      case "filterSupport":
        return BallotStore.ballot_supported;
      case "filterReadyToVote":
        return BallotStore.ballot;
      default :
        return BallotStore.ballot;
    }
  }

  getBallotType (){
    switch (this.state.ballot_type) {
      case "filterRemaining":
        return "CHOICES_REMAINING";
      case "filterSupport":
        return "WHAT_I_SUPPORT";
      case "filterReadyToVote":
        return "READY_TO_VOTE";
      default :
        return "ALL_BALLOT_ITEMS";
    }
  }

  getFilterType (){
    switch (this.state.ballot_type) {
      case "filterRemaining":
        return "filterRemaining";
      case "filterSupport":
        return "filterSupport";
      case "filterReadyToVote":
        return "filterReadyToVote";
      default :
        return "none";
    }
  }

  emptyMsg (){
    switch (this.state.ballot_type) {
      case "filterRemaining":
        return "You already chose a candidate or position for each ballot item";
      case "filterSupport":
        return "You haven't supported any candidates or measures yet.";
      default :
        return "";
    }
  }

  render () {
    let ballot = this.state.ballot;
    let text_for_map_search = VoterStore.getTextForMapSearch();
    let voter_address_object = VoterStore.getAddressObject();

    if (!ballot) {
      if (text_for_map_search.length === 0) {
        return <div className="ballot">
          { this.state.showBallotIntroModal ?
            <BallotIntroModal show={this.state.showBallotIntroModal} toggleFunction={this.toggleBallotIntroModal} /> : null }
          <div className="ballot__header">
            <BrowserPushMessage incomingProps={this.props} />
            <p className="ballot__date_location">
              If your ballot does not appear momentarily, please <Link to="/settings/location">change your address</Link>.
            </p>
          </div>
        </div>;
      } else {
        // console.log("Loading Wheel " + "text_for_map_search " + text_for_map_search + " ballot " + ballot + " location " + this.props.location);
        return <div className="ballot">
          { this.state.showBallotIntroModal ?
            <BallotIntroModal show={this.state.showBallotIntroModal} toggleFunction={this.toggleBallotIntroModal} /> : null }
            <div className="ballot__header">
              <p className="ballot__date_location">
                If your ballot does not appear momentarily, please <Link to="/settings/location">change your address</Link>.
              </p>
              {LoadingWheel}
            </div>
          </div>;
      }
    }

    const missing_address = this.props.location === null;
    // const ballot_caveat = BallotStore.ballot_properties.ballot_caveat; // ballot_properties might be undefined
    const election_name = BallotStore.currentBallotElectionName;
    const election_day_text = BallotStore.currentBallotElectionDate;
    const polling_location_we_vote_id_source = BallotStore.currentBallotPollingLocationSource;
    let ballot_returned_admin_edit_url = web_app_config.WE_VOTE_SERVER_ROOT_URL + "b/" + polling_location_we_vote_id_source + "/list_edit_by_polling_location/?google_civic_election_id=" + VoterStore.election_id() + "&state_code=";

    const emptyBallotButton = this.getFilterType() !== "none" && !missing_address ?
        <span>
          <Link to="/ballot">
              <Button bsStyle="primary">View Full Ballot</Button>
          </Link>
        </span> :
        <span>
          <Link to="/settings/location">
              <Button bsStyle="primary">Enter a Different Address</Button>
          </Link>
        </span>;

    const emptyBallot = ballot.length === 0 ?
      <div className="container-fluid well u-stack--md u-inset--md">
        <h3 className="text-center">{this.emptyMsg()}</h3>
        {emptyBallotButton}
      </div> :
      null;

    const electionTooltip = election_day_text ? <Tooltip id="tooltip">Ballot for {election_day_text}</Tooltip> : <span />;

    let in_ready_to_vote_mode = this.getFilterType() === "filterReadyToVote";

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
      ballot_location_display_name = voter_ballot_location.ballot_location_display_name;
    }

    return <div className="ballot">
      { this.state.showBallotIntroModal ? <BallotIntroModal show={this.state.showBallotIntroModal} toggleFunction={this.toggleBallotIntroModal} /> : null }
      { this.state.showMeasureModal ? <MeasureModal show={this.state.showMeasureModal} toggleFunction={this.toggleMeasureModal} measure={this.state.measure_for_modal}/> : null }
      { this.state.showCandidateModal ? <CandidateModal show={this.state.showCandidateModal} toggleFunction={this.toggleCandidateModal} candidate={this.state.candidate_for_modal}/> : null }
      { this.state.showSelectBallotModal ? <SelectBallotModal show={this.state.showSelectBallotModal} toggleFunction={this.toggleSelectBallotModal} ballotElectionList={this.state.ballotElectionList} /> : null }
      { this.state.showSelectAddressModal ? <SelectAddressModal show={this.state.showSelectAddressModal} toggleFunction={this.toggleSelectAddressModal} /> : null }
      { this.state.showBallotSummaryModal ? <BallotSummaryModal show={this.state.showBallotSummaryModal} toggleFunction={this.toggleBallotSummaryModal} /> : null }

      <div className="ballot__heading">
        <div className="page-content-container">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <Helmet title="Ballot - We Vote" />
                <BrowserPushMessage incomingProps={this.props} />
                { election_name ?
                    <header className="ballot__header-group">
                      <h1 className="h1 ballot__election-name ballot__header-title">
                         <OverlayTrigger placement="top" overlay={electionTooltip} >
                           <span className="u-push--sm">{election_name}</span>
                         </OverlayTrigger>
                         {this.state.ballotElectionList.length > 1 ? <img src={"/img/global/icons/gear-icon.png"}
                                                                            className="hidden-print" role="button"
                                                                            onClick={this.toggleSelectBallotModal}
                                                                            alt={"view your ballots"}/> : null}
                      </h1>
                      <span className="hidden-xs hidden-print pull-right ballot__header-address">
                        <EditAddress address={voter_address_object}
                                     toggleSelectAddressModal={this.toggleSelectAddressModal}
                                     ballot_location_chosen
                                     ballot_location_display_name={ballot_location_display_name}
                                     election_day_text={ElectionStore.getElectionDayText(this.state.google_civic_election_id)}
                                     election_is_upcoming={ElectionStore.isElectionIsUpcoming(this.state.google_civic_election_id)}
                                     voter_entered_address={voter_entered_address}
                                     google_civic_data_exists={ElectionStore.googleCivicDataExists(this.state.google_civic_election_id)}
                                     voter_specific_ballot_from_google_civic={voter_specific_ballot_from_google_civic}
                        />
                      </span>
                    </header> :
                  null }
                <div className="visible-xs-block hidden-print ballot__header-address-xs">
                  <EditAddress address={voter_address_object}
                               toggleSelectAddressModal={this.toggleSelectAddressModal}
                               ballot_location_chosen
                               ballot_location_display_name={ballot_location_display_name}
                               election_day_text={ElectionStore.getElectionDayText(this.state.google_civic_election_id)}
                               election_is_upcoming={ElectionStore.isElectionIsUpcoming(this.state.google_civic_election_id)}
                               voter_entered_address={voter_entered_address}
                               google_civic_data_exists={ElectionStore.googleCivicDataExists(this.state.google_civic_election_id)}
                               voter_specific_ballot_from_google_civic={voter_specific_ballot_from_google_civic} />
                </div>

                {this.state.ballot.length > 0 ?
                  <div>
                    <BallotLocationChoices google_civic_election_id={this.state.google_civic_election_id} />
                    <BallotStatusMessage ballot_location_chosen
                                         ballot_location_display_name={ballot_location_display_name}
                                         election_day_text={ElectionStore.getElectionDayText(this.state.google_civic_election_id)}
                                         election_is_upcoming={ElectionStore.isElectionIsUpcoming(this.state.google_civic_election_id)}
                                         voter_entered_address={voter_entered_address}
                                         google_civic_data_exists={ElectionStore.googleCivicDataExists(this.state.google_civic_election_id)}
                                         voter_specific_ballot_from_google_civic={voter_specific_ballot_from_google_civic}
                                         toggleSelectBallotModal={this.toggleSelectBallotModal}
                    />
                  </div> :
                  null }

                { text_for_map_search ?
                  <div className="ballot__filter-container">
                    <div className="ballot__filter hidden-print">
                      <BallotFilter pathname={this.props.location.pathname}
                                    ballot_type={this.getBallotType()}
                                    length={BallotStore.ballotLength}
                                    length_remaining={BallotStore.ballot_remaining_choices_length} />
                    </div>
                  </div> :
                  null }
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="visible-xs-block hidden-print">
        <div className="BallotItemsSummary">
          <a onClick={this.toggleBallotSummaryModal}>Summary of Ballot Items</a>
        </div>
      </div>

      <div className="page-content-container">
        <div className="container-fluid">
          {emptyBallot}
          <div className="row ballot__body">
            <div className="col-xs-12 col-md-8">
              { in_ready_to_vote_mode ?
                <div>
                  <div className="alert alert-success">
                    <a href="#" className="close" data-dismiss="alert">&times;</a>
                    We Vote helps you get ready to vote, <strong>but you cannot use We Vote to actually cast your vote</strong>.
                    Make sure to return your official ballot to your polling
                    place!<br />
                    <a href="https://help.wevote.us/hc/en-us/articles/115002401353-Can-I-cast-my-vote-with-We-Vote-"
                       target="_blank">See more information about casting your official vote.</a>
                  </div>
                  <div className="BallotList">
                    {ballot.map( (item) => <BallotItemReadyToVote key={item.we_vote_id} {...item} />)}
                  </div>
                </div> :
                <div>
                  <div className="BallotList">
                    {ballot.map( (item) => <BallotItemCompressed toggleCandidateModal={this.toggleCandidateModal}
                                                                 toggleMeasureModal={this.toggleMeasureModal}
                                                                 key={item.we_vote_id}
                                                                 {...item} />)}
                  </div>
                </div>
              }
              {/* Show links to this candidate in the admin tools */}
              { this.state.voter && polling_location_we_vote_id_source && (this.state.voter.is_admin || this.state.voter.is_verified_volunteer) ?
                <span>Admin: <a href={ballot_returned_admin_edit_url} target="_blank">
                    Ballot copied from polling location "{polling_location_we_vote_id_source}"
                  </a></span> :
                null
              }
            </div>
            <div className="col-md-4 hidden-xs sidebar-menu">
              <BallotSideBar displayTitle displaySubtitles />
            </div>
          </div>
        </div>
      </div>
    </div>;
  }
}
