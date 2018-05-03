import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import BallotActions from "../../actions/BallotActions";
import BallotStore from "../../stores/BallotStore";
import { cordovaDot, historyPush } from "../../utils/cordovaUtils";
import { renderLog } from "../../utils/logging";
import LoadingWheel from "../../components/LoadingWheel";
import OrganizationActions from "../../actions/OrganizationActions";
import VoterActions from "../../actions/VoterActions";
import VoterStore from "../../stores/VoterStore";
import { cleanArray } from "../../utils/textFormat";

const MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW = 36;

export default class BallotElectionList extends Component {

  static propTypes = {
    ballotElectionList: PropTypes.array.isRequired,
    ballotBaseUrl: PropTypes.string,
    organization_we_vote_id: PropTypes.string, // If looking at voter guide, we pass in the parent organization_we_vote_id
    toggleFunction: PropTypes.func,
  };

  constructor (props) {
    super(props);
    let prior_election_id = "";
    if (BallotStore.ballot_properties) {
      prior_election_id = BallotStore.ballot_properties.google_civic_election_id;
    } else if (VoterStore.election_id()) {
      prior_election_id = VoterStore.election_id();
    }

    this.state = {
      loading_new_ballot_items: false,
      prior_election_id: prior_election_id,
      updated_election_id: ""
    };

    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  goToDifferentElection (ballot_location_shortcut, ballot_returned_we_vote_id, googleCivicElectionId, originalTextForMapSearch = "") {
    let ballot_base_url = this.props.ballotBaseUrl || "/ballot";
    let destinationUrlForHistoryPush = "";
    if (ballot_location_shortcut && ballot_location_shortcut !== "" && ballot_location_shortcut !== "none") {
      // console.log("goToDifferentElection, ballot_location_shortcut: ", ballot_location_shortcut);
      BallotActions.voterBallotItemsRetrieve(0, "", ballot_location_shortcut);
      destinationUrlForHistoryPush = ballot_base_url + "/" + ballot_location_shortcut; // Used with historyPush once modal is closed
    } else if (ballot_returned_we_vote_id && ballot_returned_we_vote_id !== "" && ballot_returned_we_vote_id !== "none") {
      // console.log("goToDifferentElection, ballot_returned_we_vote_id: ", ballot_returned_we_vote_id);
      BallotActions.voterBallotItemsRetrieve(0, ballot_returned_we_vote_id, "");
      destinationUrlForHistoryPush = ballot_base_url + "/id/" + ballot_returned_we_vote_id; // Used with historyPush once modal is closed
    } else if (originalTextForMapSearch && originalTextForMapSearch !== "") {
      // Do we still want to be updating addresses? Maybe instead just update google_civic_election_id?
      // console.log("goToDifferentElection, originalTextForMapSearch: ", originalTextForMapSearch);
      let simple_save = false;
      VoterActions.voterAddressSave(originalTextForMapSearch, simple_save, googleCivicElectionId);
      destinationUrlForHistoryPush = ballot_base_url; // Used with historyPush once modal is closed
    } else if (googleCivicElectionId && googleCivicElectionId !== 0) {
      BallotActions.voterBallotItemsRetrieve(googleCivicElectionId, "", "");
      // console.log("goToDifferentElection, googleCivicElectionId: ", googleCivicElectionId);
      destinationUrlForHistoryPush = ballot_base_url + "/election/" + googleCivicElectionId; // Used with historyPush once modal is closed
    }

    // Request positions for the different election
    if (this.props.organization_we_vote_id && this.props.organization_we_vote_id !== "") {
      // console.log("BallotElectionList calling positionListForOpinionMaker, this.props.organization_we_vote_id: ", this.props.organization_we_vote_id, ", googleCivicElectionId:", googleCivicElectionId);
      OrganizationActions.positionListForOpinionMaker(this.props.organization_we_vote_id, true, false, googleCivicElectionId);
    }

    if (this.props.toggleFunction) {
      // console.log("goToDifferentElection, loading_new_ballot_items: ", this.state.loading_new_ballot_items);
      // console.log("goToDifferentElection, prior_election_id: ", this.state.prior_election_id, ", updated_election_id: ", this.state.updated_election_id);
      this.setState({
        destinationUrlForHistoryPush: destinationUrlForHistoryPush,
        loading_new_ballot_items: true,
        prior_election_id: BallotStore.ballot_properties.google_civic_election_id || VoterStore.election_id() || 0,
        updated_election_id: 0,
      });
    } else {
      historyPush(destinationUrlForHistoryPush);
    }
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onBallotStoreChange () {
    // console.log("BallotElectionList.jsx onBallotStoreChange, prior_election_id: ", this.state.prior_election_id, ", updated_election_id: ", this.state.updated_election_id);
    // console.log("BallotStore.ballot_properties: ", BallotStore.ballot_properties);
    if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_found && BallotStore.ballot && BallotStore.ballot.length === 0) {
      // Ballot is found but ballot is empty. We want to stay put.
      console.log("onBallotStoreChange: ballot_with_all_items is empty");
    }
    if (this.state.prior_election_id !== this.state.updated_election_id && this.state.loading_new_ballot_items && this.props.toggleFunction) {
      // console.log("onBallotStoreChange--------- loading_new_ballot_items:", this.state.loading_new_ballot_items);
      this.setState({
        loading_new_ballot_items: false,
        updated_election_id: BallotStore.ballot_properties.google_civic_election_id,
      });
      // console.log("onBallotStoreChange--------- this.props.toggleFunction()");
      this.props.toggleFunction(this.state.destinationUrlForHistoryPush);
    }
  }

  onVoterStoreChange () {
    // console.log("BallotElectionList.jsx onVoterStoreChange, VoterStore.election_id(): ", VoterStore.election_id(), ", prior_election_id: ", this.state.prior_election_id, ", updated_election_id: ", this.state.updated_election_id);
    // if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_found && BallotStore.ballot && BallotStore.ballot.length !== 0) {
    if (VoterStore.election_id() && VoterStore.election_id() !== this.state.prior_election_id) {
      if (this.state.loading_new_ballot_items && this.props.toggleFunction) {
        // console.log("onVoterStoreChange--------- loading_new_ballot_items:", this.state.loading_new_ballot_items);
        this.setState({
          loading_new_ballot_items: false,
          updated_election_id: VoterStore.election_id()
        });
        // console.log("onVoterStoreChange--------- this.props.toggleFunction()");
        this.props.toggleFunction(this.state.destinationUrlForHistoryPush);
      }
    }
  }

  render () {
    renderLog(__filename);
    if (this.state.loading_new_ballot_items) {
      return <div>
        <h1 className="h1">Switching ballot data now...</h1>
        <br />
        {LoadingWheel}
      </div>;
    }

    let currentDate = moment().format("YYYY-MM-DD");
    //console.log("currentDate: ", currentDate);
    let electionDateTomorrow;
    let electionDateTomorrowMoment;
    let ballotElectionListUpcomingSorted = this.props.ballotElectionList;
    // We want to sort ascending so the next upcoming election is first
    ballotElectionListUpcomingSorted.sort(function (a, b) {
      let election_day_text_A = a.election_day_text.toLowerCase();
      let election_day_text_B = b.election_day_text.toLowerCase();
      if (election_day_text_A < election_day_text_B) //sort string ascending
        return -1;
      if (election_day_text_A > election_day_text_B)
        return 1;
      return 0; //default return value (no sorting)
    });
    let upcomingElectionList = ballotElectionListUpcomingSorted.map((item, index) => {
      electionDateTomorrowMoment = moment(item.election_day_text, "YYYY-MM-DD").add(1, "days");
      electionDateTomorrow = electionDateTomorrowMoment.format("YYYY-MM-DD");
      // console.log("electionDateTomorrow: ", electionDateTomorrow);
      return electionDateTomorrow > currentDate ?
        <div key={index}>
          <dl className="list-unstyled text-center">
            <button type="button" className="btn btn-success ballot-election-list__button"
                    onClick={this.goToDifferentElection.bind(this, item.ballot_location_shortcut, item.ballot_returned_we_vote_id, item.google_civic_election_id, item.original_text_for_map_search)}>
              {/* Mobile */}
              { item.election_description_text.length < MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW ?
                <span className="visible-xs">{item.election_description_text}&nbsp;<img
                  src={cordovaDot("/img/global/icons/Circle-Arrow.png")}/></span> :
                <span
                  className="visible-xs">{item.election_description_text.substring(0, MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW - 3)}...&nbsp;
                  <img src={cordovaDot("/img/global/icons/Circle-Arrow.png")}/></span>
              }
              {/* Desktop */}
              <span className="hidden-xs">{item.election_description_text}&nbsp;<img
                src={cordovaDot("/img/global/icons/Circle-Arrow.png")}/></span>

              <div className="ballot-election-list__h2">{moment(item.election_day_text).format("MMMM Do, YYYY")}</div>
            </button>
          </dl>
        </div> :
        null;
    });
    upcomingElectionList = cleanArray(upcomingElectionList);

    let ballotElectionListPastSorted = this.props.ballotElectionList;
    // We want to sort descending so the most recent election is first
    ballotElectionListPastSorted.sort(function (a, b) {
      let election_day_text_A = a.election_day_text.toLowerCase();
      let election_day_text_B = b.election_day_text.toLowerCase();
      if (election_day_text_A < election_day_text_B) //sort string descending
        return 1;
      if (election_day_text_A > election_day_text_B)
        return -1;
      return 0; //default return value (no sorting)
    });
    let priorElectionList = ballotElectionListPastSorted.map((item, index) => {
      // console.log("item.election_day_text: ", item.election_day_text);
      electionDateTomorrowMoment = moment(item.election_day_text, "YYYY-MM-DD").add(1, "days");
      electionDateTomorrow = electionDateTomorrowMoment.format("YYYY-MM-DD");
      return electionDateTomorrow > currentDate ?
        null :
        <div key={index}>
          <dl className="list-unstyled text-center">
            <button type="button" className="btn btn-success ballot-election-list__button"
                    onClick={this.goToDifferentElection.bind(this, item.ballot_location_shortcut, item.ballot_returned_we_vote_id, item.google_civic_election_id, item.original_text_for_map_search)}>
              {/* Mobile */}
              { item.election_description_text.length < MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW ?
                <span className="visible-xs">{item.election_description_text}&nbsp;<img
                  src={cordovaDot("/img/global/icons/Circle-Arrow.png")}/></span> :
                <span
                  className="visible-xs">{item.election_description_text.substring(0, MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW - 3)}...&nbsp;
                  <img src={cordovaDot("/img/global/icons/Circle-Arrow.png")}/></span>
              }
              {/* Desktop */}
              <span className="hidden-xs">{item.election_description_text}&nbsp;<img
                src={cordovaDot("/img/global/icons/Circle-Arrow.png")}/></span>

              <div className="ballot-election-list__h2">{moment(item.election_day_text).format("MMMM Do, YYYY")}</div>
            </button>
          </dl>
        </div>;
    });
    priorElectionList = cleanArray(priorElectionList);

    return <div>
      { upcomingElectionList && upcomingElectionList.length ?
        <h4 className="h4">Upcoming Election(s)</h4> :
        null }
      {upcomingElectionList}

      { priorElectionList && priorElectionList.length ?
        <h4 className="h4">Prior Election(s)</h4> :
        null }
      {priorElectionList}
    </div>;
  }
}
