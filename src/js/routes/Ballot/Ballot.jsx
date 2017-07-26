import React, { Component, PropTypes } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { browserHistory, Link } from "react-router";
import CandidateModal from "../../components/Ballot/CandidateModal";
import BallotActions from "../../actions/BallotActions";
import BallotFilter from "../../components/Navigation/BallotFilter";
import BallotItemCompressed from "../../components/Ballot/BallotItemCompressed";
import BallotItemReadyToVote from "../../components/Ballot/BallotItemReadyToVote";
import BallotIntroModal from "../../components/Ballot/BallotIntroModal";
import BallotStore from "../../stores/BallotStore";
import BallotSummaryModal from "../../components/Ballot/BallotSummaryModal";
import BrowserPushMessage from "../../components/Widgets/BrowserPushMessage";
import EditAddress from "../../components/Widgets/EditAddress";
import GuideActions from "../../actions/GuideActions";
import GuideStore from "../../stores/GuideStore";
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
        guides_to_follow_list: [],
        position_list: []
      },
      measure_for_modal: {
        guides_to_follow_list: [],
        position_list: []
      },
      showBallotIntroModal: !VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_MODAL_SHOWN),
      showCandidateModal: false,
      showMeasureModal: false,
      showSelectBallotModal: false,
      showSelectAddressModal: false,
      showBallotSummaryModal: false,
      ballotElectionList: [],
      mounted: false,
    };
  }

  componentDidMount () {
    this.setState({mounted: true});
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
      this._toggleBallotIntroModal = this._toggleBallotIntroModal.bind(this);
      this._toggleCandidateModal = this._toggleCandidateModal.bind(this);
      this._toggleMeasureModal = this._toggleMeasureModal.bind(this);
      this._toggleSelectBallotModal = this._toggleSelectBallotModal.bind(this);
      this._toggleSelectAddressModal = this._toggleSelectAddressModal.bind(this);
      this._toggleBallotSummaryModal = this._toggleBallotSummaryModal.bind(this);
      SupportActions.voterAllPositionsRetrieve();
      SupportActions.positionsCountForAllBallotItems();
      BallotActions.voterBallotListRetrieve();
      this.guideStoreListener = GuideStore.addListener(this._onGuideStoreChange.bind(this));
      this.supportStoreListener = SupportStore.addListener(this._onBallotStoreChange.bind(this));
      this._onVoterStoreChange(); // We call this to properly set showBallotIntroModal
      this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    }
  }

  componentWillUnmount (){
    this.setState({mounted: false});
    if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_found === false){
      // No ballot found
    } else {
      this.ballotStoreListener.remove();
      this.guideStoreListener.remove();
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
      GuideActions.retrieveGuidesToFollowByBallotItem(candidate_for_modal.we_vote_id, "CANDIDATE");
      candidate_for_modal.guides_to_follow_list = GuideStore.toFollowListForBallotItemById(candidate_for_modal.we_vote_id);
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
      GuideActions.retrieveGuidesToFollowByBallotItem(measureForModal.measure_we_vote_id, "MEASURE");
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

  _onGuideStoreChange (){
    // Update the data for the modal to include the position of the organization related to this ballot item
    if (this.state.candidate_for_modal) {
      this.setState({
        candidate_for_modal: {
          ...this.state.candidate_for_modal,
          guides_to_follow_list: GuideStore.toFollowListForBallotItem()
        }
      });
    } else if (this.state.measure_for_modal) {
      this.setState({
        measure_for_modal: {
          ...this.state.measure_for_modal,
          guides_to_follow_list: GuideStore.toFollowListForBallotItem()
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
    let voter_address = VoterStore.getAddress();
    if (!ballot) {
      if (voter_address.length === 0) {
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
        // console.log("Loading Wheel " + "voter_address " + voter_address + " ballot " + ballot + " location " + this.props.location);
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

      <div className="ballot__heading u-stack--lg">
        <Helmet title="Ballot - We Vote" />
        <BrowserPushMessage incomingProps={this.props} />
        { election_name ?
          <OverlayTrigger placement="top" overlay={electionTooltip} >
            <h1 className="h1 ballot__election-name">
               <span className="u-push--sm">{election_name}</span>
               {this.state.ballotElectionList.length > 1 ? <img src={"/img/global/icons/gear-icon.png"}
                                                                  className="hidden-print" role="button"
                                                                  onClick={this._toggleSelectBallotModal}
                                                                  alt={"view your ballots"}/> : null}
            </h1>
          </OverlayTrigger> :
          null }
        <EditAddress address={voter_address} _toggleSelectAddressModal={this._toggleSelectAddressModal} />
        {voter_address ?
          <div className="ballot__filter hidden-print"><BallotFilter ballot_type={this.getBallotType()} /> (<a onClick={this._toggleBallotIntroModal}>show intro</a>)</div> :
          null}
          <div className="visible-xs-block hidden-print">
            <div className="BallotItemsSummary">
              <a onClick={this._toggleBallotSummaryModal}>Summary of Ballot Items</a>
            </div>
          </div>
        </div>
        {emptyBallot}
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
      </div>;
  }
}
