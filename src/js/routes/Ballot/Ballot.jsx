import React, { Component, PropTypes } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { browserHistory, Link } from "react-router";
import CandidateModal from "../../components/Ballot/CandidateModal";
import cookies from "../../utils/cookies";
import BallotActions from "../../actions/BallotActions";
import BallotFilter from "../../components/Navigation/BallotFilter";
import BallotItemCompressed from "../../components/Ballot/BallotItemCompressed";
import BallotItemReadyToVote from "../../components/Ballot/BallotItemReadyToVote";
import BallotIntroModal from "../../components/Ballot/BallotIntroModal";
import BallotSideBar from "../../components/Navigation/BallotSideBar";
import BallotStore from "../../stores/BallotStore";
import BallotSummaryModal from "../../components/Ballot/BallotSummaryModal";
import BrowserPushMessage from "../../components/Widgets/BrowserPushMessage";
import EditAddress from "../../components/Widgets/EditAddress";
import VoterGuideActions from "../../actions/VoterGuideActions";
import VoterGuideStore from "../../stores/VoterGuideStore";
import Helmet from "react-helmet";
import LoadingWheel from "../../components/LoadingWheel";
import MeasureModal from "../../components/Ballot/MeasureModal";
import SelectAddressModal from "../../components/Ballot/SelectAddressModal";
import SelectBallotModal from "../../components/Ballot/SelectBallotModal";
import SupportActions from "../../actions/SupportActions";
import SupportStore from "../../stores/SupportStore";
import VoterActions from "../../actions/VoterActions";
import VoterConstants from "../../constants/VoterConstants";
import VoterStore from "../../stores/VoterStore";


const web_app_config = require("../../config");

export default class Ballot extends Component {
  static propTypes = {
    location: PropTypes.object
  };

  constructor (props){
    super(props);
    this.state = {
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
    };

    this._toggleBallotIntroModal = this._toggleBallotIntroModal.bind(this);
    this._toggleCandidateModal = this._toggleCandidateModal.bind(this);
    this._toggleMeasureModal = this._toggleMeasureModal.bind(this);
    this._toggleSelectBallotModal = this._toggleSelectBallotModal.bind(this);
    this._toggleSelectAddressModal = this._toggleSelectAddressModal.bind(this);
    this._toggleBallotSummaryModal = this._toggleBallotSummaryModal.bind(this);
  }

  componentWillMount () {
  }

  componentDidMount () {
    this.setState({
      mounted: true,
      showBallotIntroModal: !VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_MODAL_SHOWN),
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
      this.ballotStoreListener = BallotStore.addListener(this._onBallotStoreChange.bind(this));
      // NOTE: voterAllPositionsRetrieve and positionsCountForAllBallotItems are also called in SupportStore when voterAddressRetrieve is received,
      // so we get duplicate calls when you come straight to the Ballot page. There is no easy way around this currently.
      SupportActions.voterAllPositionsRetrieve();
      SupportActions.positionsCountForAllBallotItems();
      BallotActions.voterBallotListRetrieve();
      this.voterGuideStoreListener = VoterGuideStore.addListener(this._onVoterGuideStoreChange.bind(this));
      this.supportStoreListener = SupportStore.addListener(this._onBallotStoreChange.bind(this));
      this._onVoterStoreChange(); // We call this to properly set showBallotIntroModal
      this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
      // Once a voter hits the ballot, they have gone through orientation
      cookies.setItem("voter_orientation_complete", "1", Infinity, "/");
    }
  }

  componentWillUnmount (){
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
    let ballot_type = nextProps.location.query ? nextProps.location.query.type : "all";
    this.setState({ballot: this.getBallot(nextProps), ballot_type: ballot_type });
  }

  _toggleCandidateModal (candidate_for_modal) {
    if (candidate_for_modal) {
      VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(candidate_for_modal.we_vote_id, "CANDIDATE");
      candidate_for_modal.voter_guides_to_follow_for_latest_ballot_item = VoterGuideStore.getVoterGuidesToFollowForBallotItemId(candidate_for_modal.we_vote_id);
    }

    this.setState({
      candidate_for_modal: candidate_for_modal,
      showCandidateModal: !this.state.showCandidateModal
    });
  }

  _toggleBallotIntroModal () {
    if (this.state.showBallotIntroModal) {
      // Saved to the voter record that the ballot introduction has been seen
      VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.BALLOT_INTRO_MODAL_SHOWN);
    } else {
      // Clear out any # from anchors in the URL
      browserHistory.push("/ballot");
    }
    this.setState({ showBallotIntroModal: !this.state.showBallotIntroModal });
  }

  _toggleMeasureModal (measureForModal) {
    if (measureForModal) {
      VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(measureForModal.measure_we_vote_id, "MEASURE");
    }
    this.setState({
      measure_for_modal: measureForModal,
      showMeasureModal: !this.state.showMeasureModal
    });
  }

  _toggleSelectBallotModal () {
    this.setState({
      showSelectBallotModal: !this.state.showSelectBallotModal
    });
  }

  _toggleSelectAddressModal () {
    // Clear out any # from anchors in the URL
    if (!this.state.showSelectAddressModal)
      browserHistory.push("/ballot");

    this.setState({
      showSelectAddressModal: !this.state.showSelectAddressModal
    });
  }

  _toggleBallotSummaryModal () {
    this.setState({
      showBallotSummaryModal: !this.state.showBallotSummaryModal
    });
  }

  _onVoterStoreChange () {
    if (this.state.mounted) {
      this.setState({
        voter: VoterStore.getVoter(),
        showBallotIntroModal: !VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_MODAL_SHOWN),
      });
    }
  }

  _onBallotStoreChange (){
    if (this.state.mounted) {
      if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_found && BallotStore.ballot && BallotStore.ballot.length === 0) {
        // Ballot is found but ballot is empty
        browserHistory.push("/ballot/empty");
        console.log("_onBallotStoreChange: ballot is empty");
      } else {
        let ballot_type = this.props.location.query ? this.props.location.query.type : "all";
        this.setState({ballot: this.getBallot(this.props), ballot_type: ballot_type});
      }
      this.setState({ballotElectionList: BallotStore.ballotList()});
    }
  }

  _onVoterGuideStoreChange (){
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
            <BallotIntroModal show={this.state.showBallotIntroModal} toggleFunction={this._toggleBallotIntroModal} /> : null }
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
            <BallotIntroModal show={this.state.showBallotIntroModal} toggleFunction={this._toggleBallotIntroModal} /> : null }
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
    // const ballot_caveat = BallotStore.ballot_properties.ballot_caveat;
    const election_name = BallotStore.currentBallotElectionName;
    const election_date = BallotStore.currentBallotElectionDate;
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

    const electionTooltip = election_date ? <Tooltip id="tooltip">Ballot for {election_date}</Tooltip> : <span />;

    let in_ready_to_vote_mode = this.getFilterType() === "filterReadyToVote";

    return <div className="ballot">
      { this.state.showBallotIntroModal ? <BallotIntroModal show={this.state.showBallotIntroModal} toggleFunction={this._toggleBallotIntroModal} /> : null }
      { this.state.showMeasureModal ? <MeasureModal show={this.state.showMeasureModal} toggleFunction={this._toggleMeasureModal} measure={this.state.measure_for_modal}/> : null }
      { this.state.showCandidateModal ? <CandidateModal show={this.state.showCandidateModal} toggleFunction={this._toggleCandidateModal} candidate={this.state.candidate_for_modal}/> : null }
      { this.state.showSelectBallotModal ? <SelectBallotModal show={this.state.showSelectBallotModal} toggleFunction={this._toggleSelectBallotModal} ballotElectionList={this.state.ballotElectionList} /> : null }
      { this.state.showSelectAddressModal ? <SelectAddressModal show={this.state.showSelectAddressModal} toggleFunction={this._toggleSelectAddressModal} /> : null }
      { this.state.showBallotSummaryModal ? <BallotSummaryModal show={this.state.showBallotSummaryModal} toggleFunction={this._toggleBallotSummaryModal} /> : null }

      <div className="ballot__heading">
        <div className="page-content-container">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <Helmet title="Ballot - We Vote" />
                <BrowserPushMessage incomingProps={this.props} />
                { election_name ?
                  <OverlayTrigger placement="top" overlay={electionTooltip} >
                    <header className="ballot__header-group">
                      <h1 className="h1 ballot__election-name ballot__header-title">
                         <span className="u-push--sm">{election_name}</span>
                         {this.state.ballotElectionList.length > 1 ? <img src={"/img/global/icons/gear-icon.png"}
                                                                            className="hidden-print" role="button"
                                                                            onClick={this._toggleSelectBallotModal}
                                                                            alt={"view your ballots"}/> : null}
                      </h1>
                      <span className="hidden-xs hidden-print pull-right ballot__header-address">
                        <EditAddress address={voter_address_object} _toggleSelectAddressModal={this._toggleSelectAddressModal} />
                      </span>
                    </header>
                  </OverlayTrigger> :
                  null }
                <div className="visible-xs-block hidden-print ballot__header-address-xs">
                  <EditAddress address={voter_address_object} _toggleSelectAddressModal={this._toggleSelectAddressModal} />
                </div>
                { text_for_map_search ?
                  <div className="ballot__filter-container">
                    <div className="ballot__filter hidden-print">
                      <BallotFilter ballot_type={this.getBallotType()}
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
          <a onClick={this._toggleBallotSummaryModal}>Summary of Ballot Items</a>
        </div>
      </div>

      <div className="page-content-container">
        <div className="container-fluid">
          {emptyBallot}
          <div className="row ballot__body">
            <div className="col-xs-12 col-md-8">
              <div className="BallotList">
              { in_ready_to_vote_mode ?
                ballot.map( (item) => <BallotItemReadyToVote key={item.we_vote_id} {...item} />) :
                ballot.map( (item) => <BallotItemCompressed _toggleCandidateModal={this._toggleCandidateModal}
                                                            _toggleMeasureModal={this._toggleMeasureModal}
                                                            key={item.we_vote_id}
                                                            {...item} />)
              }
              </div>
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
