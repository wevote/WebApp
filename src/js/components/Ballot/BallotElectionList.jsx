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
import { convertStateCodeToStateText } from "../../utils/address-functions";

const MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW = 36;

export default class BallotElectionList extends Component {
  static propTypes = {
    ballotElectionList: PropTypes.array.isRequired,
    ballotBaseUrl: PropTypes.string,
    organization_we_vote_id: PropTypes.string, // If looking at voter guide, we pass in the parent organization_we_vote_id
    showRelevantElections: PropTypes.bool,
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
    let state_code = VoterStore.getStateCodeFromIPAddress();

    this.state = {
      loading_new_ballot_items: false,
      prior_election_id: prior_election_id,
      show_more_upcoming_elections: false,
      show_more_prior_elections: false,
      show_prior_elections_list: false,
      state_code: state_code,
      state_name: convertStateCodeToStateText(state_code),
      updated_election_id: "",
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
      // console.log("onBallotStoreChange: ballot_with_all_items is empty");
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
        let state_code = VoterStore.getStateCodeFromIPAddress();
        this.setState({
          loading_new_ballot_items: false,
          state_code: state_code,
          state_name: convertStateCodeToStateText(state_code),
          updated_election_id: VoterStore.election_id(),
        });
        // console.log("onVoterStoreChange--------- this.props.toggleFunction()");
        this.props.toggleFunction(this.state.destinationUrlForHistoryPush);
      }
    }
  }

  filterElectionsInsideState (election_list) {
    return election_list.filter(election => this.isElectionInState(election));
  }

  filterElectionsOutsideState (election_list) {
    return election_list.filter(election => !this.isElectionInState(election));
  }

  isElectionInState (election) {
    let election_name = election.election_description_text;
    if (this.state.state_name.length && election_name.includes(this.state.state_name)) {
      return true;
    }
    // show all national elections regardless of state
    // return election.is_national;
    return election_name.includes("U.S.") ||
           election_name.includes("US") ||
           election_name.includes("United States");
  }

  renderUpcomingElectionList (list, current_date) {
    let rendered_list = list.map((item, index) => {
      let electionDateTomorrowMoment = moment(item.election_day_text, "YYYY-MM-DD").add(1, "days");
      let electionDateTomorrow = electionDateTomorrowMoment.format("YYYY-MM-DD");
      return electionDateTomorrow > current_date ?
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
    return cleanArray(rendered_list);
  }

  renderPriorElectionList (list, current_date) {
    let rendered_list = list.map((item, index) => {
      let electionDateTomorrowMoment = moment(item.election_day_text, "YYYY-MM-DD").add(1, "days");
      let electionDateTomorrow = electionDateTomorrowMoment.format("YYYY-MM-DD");
      return electionDateTomorrow > current_date ?
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
    return cleanArray(rendered_list);
  }

  toggleShowMoreUpcomingElections () {
    this.setState({
      show_more_upcoming_elections: !this.state.show_more_upcoming_elections,
    });
  }

  toggleShowMorePriorElections () {
    this.setState({
      show_more_prior_elections: !this.state.show_more_prior_elections,
    });
  }

  toggleShowPriorElectionsList () {
    this.setState({
      show_prior_elections_list: !this.state.show_prior_elections_list,
    });
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

    let ballotElectionListUpcomingSorted = this.props.ballotElectionList.concat();
    // We want to sort ascending so the next upcoming election is first
    ballotElectionListUpcomingSorted.sort((a, b) => {
      let election_day_text_A = a.election_day_text.toLowerCase();
      let election_day_text_B = b.election_day_text.toLowerCase();
      if (election_day_text_A < election_day_text_B) //sort string ascending
        return -1;
      if (election_day_text_A > election_day_text_B)
        return 1;
      return 0; //default return value (no sorting)
    });

    let ballotElectionListPastSorted = this.props.ballotElectionList.concat();
    // We want to sort descending so the most recent election is first
    ballotElectionListPastSorted.sort((a, b) => {
      let election_day_text_A = a.election_day_text.toLowerCase();
      let election_day_text_B = b.election_day_text.toLowerCase();
      if (election_day_text_A < election_day_text_B) //sort string descending
        return 1;
      if (election_day_text_A > election_day_text_B)
        return -1;
      return 0; //default return value (no sorting)
    });

    let upcomingElectionList = this.renderUpcomingElectionList(ballotElectionListUpcomingSorted, currentDate);
    let priorElectionList = this.renderPriorElectionList(ballotElectionListPastSorted, currentDate);

    if (this.props.showRelevantElections) {
      let upcomingBallotElectionListInsideState = this.filterElectionsInsideState(ballotElectionListUpcomingSorted);
      let upcomingBallotElectionListOutsideState = this.filterElectionsOutsideState(ballotElectionListUpcomingSorted);
      let priorBallotElectionListInsideState = this.filterElectionsInsideState(ballotElectionListPastSorted);
      let priorBallotElectionListOutsideState = this.filterElectionsOutsideState(ballotElectionListPastSorted);

      let upcomingElectionListInsideState = this.renderUpcomingElectionList(upcomingBallotElectionListInsideState, currentDate);
      let upcomingElectionListOutsideState = this.renderUpcomingElectionList(upcomingBallotElectionListOutsideState, currentDate);
      let priorElectionListInsideState = this.renderPriorElectionList(priorBallotElectionListInsideState, currentDate);
      let priorElectionListOutsideState = this.renderPriorElectionList(priorBallotElectionListOutsideState, currentDate);

      return <div className="ballot-election-list__list">
        <div className="ballot-election-list__upcoming">
          <h4 className="h4">
            Upcoming Election
            { upcomingElectionListInsideState && upcomingElectionListInsideState.length !== 1 &&
              !this.state.show_more_upcoming_elections ||
              upcomingElectionList && upcomingElectionList.length !== 1 &&
              this.state.show_more_upcoming_elections ?
              "s" :
              null
            }
            { this.state.state_name && this.state.state_name.length &&
              !this.state.show_more_upcoming_elections ?
              " in " + this.state.state_name :
              null
            }
          </h4>
          { upcomingElectionListInsideState && upcomingElectionListInsideState.length ?
            upcomingElectionListInsideState :
            "There are no upcoming elections at this time."
          }
          { upcomingElectionListOutsideState && upcomingElectionListOutsideState.length &&
            this.state.show_more_upcoming_elections ?
            upcomingElectionListOutsideState :
            upcomingElectionListInsideState && upcomingElectionListInsideState.length ?
            null :
            "There are no upcoming elections at this time."
          }
          { upcomingElectionListOutsideState && upcomingElectionListOutsideState.length ?
            this.state.show_more_upcoming_elections ?
            <a onClick={this.toggleShowMoreUpcomingElections.bind(this)}>
              { this.state.state_name && this.state.state_name.length ?
                "Only show elections in " + this.state.state_name :
                "Hide state elections"
              }
            </a> :
            <a onClick={this.toggleShowMoreUpcomingElections.bind(this)}>
              Show all states - { upcomingElectionListOutsideState.length } more election{ upcomingElectionListOutsideState.length !== 1 ? "s" : null }
            </a> :
            null
          }
        </div>

        { this.state.show_prior_elections_list ?
          <div className="ballot-election-list__prior">
            <h4 className="h4">
              Prior Election
              { priorElectionListInsideState && priorElectionListInsideState.length !== 1 &&
                !this.state.show_more_prior_elections ||
                priorElectionList && priorElectionList.length !== 1 &&
                this.state.show_more_prior_elections ?
                "s" :
                null
              }
              { this.state.state_name && this.state.state_name.length &&
                !this.state.show_more_prior_elections ?
                " in " + this.state.state_name :
                null
              }
            </h4>
            { priorElectionListInsideState && priorElectionListInsideState.length ?
              priorElectionListInsideState :
              "There are no prior elections at this time."
            }
            { priorElectionListOutsideState && priorElectionListOutsideState.length &&
              this.state.show_more_prior_elections ?
              priorElectionListOutsideState :
              priorElectionListInsideState && priorElectionListInsideState.length ?
              null :
              "There are no prior elections at this time."
            }
            { priorElectionListOutsideState && priorElectionListOutsideState.length ?
              this.state.show_more_prior_elections ?
              <a onClick={this.toggleShowMorePriorElections.bind(this)}>
                { this.state.state_name && this.state.state_name.length ?
                  "Only show elections in " + this.state.state_name :
                  "Hide state elections"
                }
              </a> :
              <a onClick={this.toggleShowMorePriorElections.bind(this)}>
                Show all states - { priorElectionListOutsideState.length } more election{ priorElectionListOutsideState.length !== 1 ? "s" : null }
              </a> :
              null
            }
          </div> :
          <a onClick={this.toggleShowPriorElectionsList.bind(this)}>
            Show prior elections
          </a>
        }
      </div>;
    } else {
      return <div className="ballot-election-list__list">
        <div className="ballot-election-list__upcoming">
          <h4 className="h4">
            Upcoming Election
            { upcomingElectionList && upcomingElectionList.length !== 1 ? "s" : null }
          </h4>
          { upcomingElectionList && upcomingElectionList.length ?
            upcomingElectionList :
            "There are no upcoming elections at this time."
          }
        </div>

        <div className="ballot-election-list__prior">
          <h4 className="h4">
            Prior Election
            { priorElectionList && priorElectionList.length !== 1 ? "s" : null }
          </h4>
          { priorElectionList && priorElectionList.length ?
            priorElectionList :
            "There are no prior elections at this time."
          }
        </div>
      </div>;
    }
  }
}
