import React, { Component, PropTypes } from "react";
import { Modal, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { browserHistory, Link } from "react-router";
import BallotActions from "../../actions/BallotActions";
import BallotItem from "../../components/Ballot/BallotItem";
import BallotItemCompressed from "../../components/Ballot/BallotItemCompressed";
import BallotItemReadyToVote from "../../components/Ballot/BallotItemReadyToVote";
import BallotStore from "../../stores/BallotStore";
import BallotFilter from "../../components/Navigation/BallotFilter";
import BrowserPushMessage from "../../components/Widgets/BrowserPushMessage";
import cookies from "../../utils/cookies";
import GuideActions from "../../actions/GuideActions";
import GuideList from "../../components/VoterGuide/GuideList";
import GuideStore from "../../stores/GuideStore";
import Helmet from "react-helmet";
import ItemSupportOpposeCounts from "../../components/Widgets/ItemSupportOpposeCounts";
import ItemTinyPositionBreakdownList from "../../components/Position/ItemTinyPositionBreakdownList";
import LoadingWheel from "../../components/LoadingWheel";
import SupportActions from "../../actions/SupportActions";
import SupportStore from "../../stores/SupportStore";
import VoterStore from "../../stores/VoterStore";

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
      showCandidateModal: false,
      showMeasureModal: false
      //shouldn't ballot be here?
    };
  }

  componentDidMount () {
    if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_found === false){ // No ballot found
      browserHistory.push("settings/location");
    } else {
      //if ballot is found
      let ballot = this.getBallot(this.props);
      // console.log(ballot);
      if (ballot !== undefined) {
        let ballot_type = this.props.location.query ? this.props.location.query.type : "all";
        this.setState({ballot: ballot, ballot_type: ballot_type});
      }
      // We need a ballotStoreListener here because we want the ballot to display before positions are received
      this.ballotStoreListener = BallotStore.addListener(this._onBallotStoreChange.bind(this));
      // NOTE: voterAllPositionsRetrieve and positionsCountForAllBallotItems are also called in SupportStore when voterAddressRetrieve is received,
      // so we get duplicate calls when you come straight to the Ballot page. There is no easy way around this currently.
      this._toggleCandidateModal = this._toggleCandidateModal.bind(this);
      this._toggleMeasureModal = this._toggleMeasureModal.bind(this);
      SupportActions.voterAllPositionsRetrieve();
      SupportActions.positionsCountForAllBallotItems();
      BallotActions.voterBallotListRetrieve();
      this.supportStoreListener = SupportStore.addListener(this._onBallotStoreChange.bind(this));
      this.guideStoreListener = GuideStore.addListener(this._onGuideStoreChange.bind(this));
    }
  }

  componentWillUnmount (){
    if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_found === false){
      // No ballot found
    } else {
      this.ballotStoreListener.remove();
      this.guideStoreListener.remove();
      this.supportStoreListener.remove();
    }
  }

  componentWillReceiveProps (nextProps){
    let ballot_type = nextProps.location.query ? nextProps.location.query.type : "all";
    this.setState({ballot: this.getBallot(nextProps), ballot_type: ballot_type });
  }

  _toggleCandidateModal (candidateForModal) {
    if (candidateForModal) {
      GuideActions.retrieveGuidesToFollowByBallotItem(candidateForModal.we_vote_id, "CANDIDATE");
      candidateForModal.guides_to_follow_list = GuideStore.toFollowListForBallotItemById(candidateForModal.we_vote_id);
    }

    this.setState({
      candidate_for_modal: candidateForModal,
      showCandidateModal: !this.state.showCandidateModal
    });
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

  _onBallotStoreChange (){
    if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_found && BallotStore.ballot && BallotStore.ballot.length === 0){ // Ballot is found but ballot is empty
      browserHistory.push("ballot/empty");
      console.log("_onBallotStoreChange: ballot is empty");
    } else {
      let ballot_type = this.props.location.query ? this.props.location.query.type : "all";
      this.setState({ballot: this.getBallot(this.props), ballot_type: ballot_type });
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

  //Needed to scroll to anchor tags based on hash in url(as done for bookmarks)
  hashLinkScroll () {
    const { hash } = window.location;
    if (hash !== "") {
      // Push onto callback queue so it runs after the DOM is updated,
      // this is required when navigating from a different page so that
      // the element is rendered on the page before trying to getElementById.
      setTimeout(() => {
        var id = hash.replace("#", "");
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

    const show_intro_story = !cookies.getItem("intro_story_watched");
    if (show_intro_story) {

      browserHistory.push("/intro/story");
      return LoadingWheel;
    }

    // We create this modal to pop up and show voter guides that the voter can follow relating to this Candidate.
    const CandidateModal = <Modal show={this.state.showCandidateModal} onHide={()=>{this._toggleCandidateModal(null);}}>
        <Modal.Header closeButton>
          <Modal.Title>
            { this.state.candidate_for_modal ?
              "Opinions about " + this.state.candidate_for_modal.ballot_item_display_name :
              null }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { this.state.candidate_for_modal ?
            <section className="card">
              {/* Show positions in your network with the tiny icons */}
              <p className="card__no-additional">
                This is a summary of the positions of those you are following.
              </p>
              <ItemSupportOpposeCounts we_vote_id={this.state.candidate_for_modal.we_vote_id}
                                       supportProps={SupportStore.get(this.state.candidate_for_modal.we_vote_id)}
                                       type="CANDIDATE" />
              { this.state.candidate_for_modal.position_list ?
                <span>
                  {/* Show a break-down of the positions in your network */}
                  { SupportStore.get(this.state.candidate_for_modal.we_vote_id) && ( SupportStore.get(this.state.candidate_for_modal.we_vote_id).oppose_count || SupportStore.get(this.state.candidate_for_modal.we_vote_id).support_count) ?
                    <span>
                      {/* In desktop mode, align left with position bar */}
                      {/* In mobile mode, turn on green up-arrow before icons */}
                      <ItemTinyPositionBreakdownList ballotItemWeVoteId={this.state.candidate_for_modal.we_vote_id}
                                                     position_list={this.state.candidate_for_modal.position_list}
                                                     showSupport
                                                     supportProps={SupportStore.get(this.state.candidate_for_modal.we_vote_id)} />
                      <span className="pull-right">
                        {/* In desktop mode, align right with position bar */}
                        {/* In mobile mode, turn on red down-arrow before icons (make sure there is line break after support positions) */}
                        <ItemTinyPositionBreakdownList ballotItemWeVoteId={this.state.candidate_for_modal.we_vote_id}
                                                       position_list={this.state.candidate_for_modal.position_list}
                                                       showOppose
                                                       supportProps={SupportStore.get(this.state.candidate_for_modal.we_vote_id)} />
                      </span>
                    </span> :
                    null }
                </span> :
                null }
              {/* Show voter guides to follow that relate to this candidate */}
              <div className="card__additional">
                {this.state.candidate_for_modal.guides_to_follow_list.length === 0 ?
                  null :
                  <span>
                    <p className="card__no-additional">
                      <strong>Follow</strong> the voter guides of organizations and people you trust.<br />
                      <strong>Ignore</strong> voter guides that don't share your values.
                    </p>
                    <GuideList ballotItemWeVoteId={this.state.candidate_for_modal.we_vote_id}
                               organizationsToFollow={this.state.candidate_for_modal.guides_to_follow_list}/>
                  </span>
                }
              </div>
            </section> :
            null }
        </Modal.Body>
      </Modal>;

    // We create this modal to pop up and show voter guides that the voter can follow relating to this Measure.
    const MeasureModal = <Modal show={this.state.showMeasureModal} onHide={()=>{this._toggleMeasureModal(null);}}>
        <Modal.Header closeButton>
          <Modal.Title>
            { this.state.measure_for_modal ?
              "Opinions about " + this.state.measure_for_modal.ballot_item_display_name :
              null }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { this.state.measure_for_modal ?
            <section className="card">
              {/* Show positions in your network with the tiny icons */}
              <p className="card__no-additional">
                This is a summary of the positions of those you are following.
              </p>
              <ItemSupportOpposeCounts we_vote_id={this.state.measure_for_modal.measure_we_vote_id}
                                       supportProps={SupportStore.get(this.state.measure_for_modal.measure_we_vote_id)}
                                       type="MEASURE" />
              { this.state.measure_for_modal.position_list ?
                <span>
                  {/* Show a break-down of the positions in your network */}
                  { SupportStore.get(this.state.measure_for_modal.measure_we_vote_id) && ( SupportStore.get(this.state.measure_for_modal.measure_we_vote_id).oppose_count || SupportStore.get(this.state.measure_for_modal.measure_we_vote_id).support_count) ?
                    <span>
                      {/* In desktop mode, align left with position bar */}
                      {/* In mobile mode, turn on green up-arrow before icons */}
                      <ItemTinyPositionBreakdownList ballotItemWeVoteId={this.state.measure_for_modal.measure_we_vote_id}
                                                     position_list={this.state.measure_for_modal.position_list}
                                                     showSupport
                                                     supportProps={SupportStore.get(this.state.measure_for_modal.measure_we_vote_id)} />
                      <span className="pull-right">
                        {/* In desktop mode, align right with position bar */}
                        {/* In mobile mode, turn on red down-arrow before icons (make sure there is line break after support positions) */}
                        <ItemTinyPositionBreakdownList ballotItemWeVoteId={this.state.measure_for_modal.measure_we_vote_id}
                                                       position_list={this.state.measure_for_modal.position_list}
                                                       showOppose
                                                       supportProps={SupportStore.get(this.state.measure_for_modal.measure_we_vote_id)} />
                      </span>
                    </span> :
                    null }
                </span> :
                null }
              {/* Show voter guides to follow that relate to this measure */}
              <div className="card__additional">
                {this.state.measure_for_modal.guides_to_follow_list.length === 0 ?
                  null :
                  <span>
                    <p className="card__no-additional">
                      <strong>Follow</strong> the voter guides of organizations and people you trust.<br />
                      <strong>Ignore</strong> voter guides that don't share your values.
                    </p>
                    <GuideList ballotItemWeVoteId={this.state.measure_for_modal.measure_we_vote_id}
                               organizationsToFollow={this.state.measure_for_modal.guides_to_follow_list}/>
                  </span>
                }
              </div>
            </section> :
            null }
        </Modal.Body>
      </Modal>;

    let ballot = this.state.ballot;
    var voter_address = VoterStore.getAddress();
    if (!ballot) {
      if (voter_address.length === 0) {
        return <div className="ballot">
          <div className="ballot__header">
            <BrowserPushMessage incomingProps={this.props} />
            <p className="ballot__date_location">
              Your ballot could not be found. Please <Link to="/settings/location">change your address</Link>.
            </p>
          </div>
        </div>;
      } else {
        // console.log("Loading Wheel " + "voter_address " + voter_address + " ballot " + ballot + " location " + this.props.location);
        return <div className="ballot">
            <div className="ballot__header">
              <p className="ballot__date_location">
                Your ballot could not be found. Please <Link to="/settings/location">change your address</Link>.
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
      { this.state.showMeasureModal ? MeasureModal : null }
      { this.state.showCandidateModal ? CandidateModal : null }
      <div className="ballot__heading u-stack--lg">
        <Helmet title="Ballot - We Vote" />
        <BrowserPushMessage incomingProps={this.props} />
        <OverlayTrigger placement="top" overlay={electionTooltip} >
          <h1 className="h1 ballot__election-name">{election_name}
            <span className="ballotList__edit"> (<Link to="/ballot/select_ballot">Edit</Link>)</span></h1>
        </OverlayTrigger>
        <p className="ballot__date_location">
          {voter_address}
          <span> (<Link to="/settings/location">Edit</Link>)</span>
        </p>
        <div className="ballot__filter"><BallotFilter ballot_type={this.getBallotType()} /></div>
      </div>
      {/* TO BE DISCUSSED ballot_caveat !== "" ?
        <div className="alert alert alert-info alert-dismissible" role="alert">n
          <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          {ballot_caveat}
        </div> : null
      */}
      {emptyBallot}

      { in_ready_to_vote_mode ?
        ballot.map( (item) => <BallotItemReadyToVote key={item.we_vote_id} {...item} />) :
        ballot.map( (item) => <BallotItemCompressed _toggleCandidateModal={this._toggleCandidateModal}
                                                    _toggleMeasureModal={this._toggleMeasureModal}
                                                    key={item.we_vote_id}
                                                    {...item} />)
      }
      </div>;
  }
}
