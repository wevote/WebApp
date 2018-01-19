import React, { Component, PropTypes } from "react";
import { browserHistory } from "react-router";
import BallotActions from "../../actions/BallotActions";
import OrganizationActions from "../../actions/OrganizationActions";
import VoterActions from "../../actions/VoterActions";
import { cleanArray } from "../../utils/textFormat";
import moment from "moment";

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
    this.state = {};
  }

  goToDifferentElection (ballot_location_shortcut, ballot_returned_we_vote_id, googleCivicElectionId, originalTextForMapSearch = "") {
    // console.log("BallotElectionList.jsx goToDifferentElection, googleCivicElectionId: ", googleCivicElectionId, ", originalTextForMapSearch: ", originalTextForMapSearch);
    let ballot_base_url = this.props.ballotBaseUrl || "/ballot";
    if (ballot_location_shortcut && ballot_location_shortcut !== "" && ballot_location_shortcut !== "none") {
      // console.log("goToDifferentElection, ballot_location_shortcut: ", ballot_location_shortcut);
      BallotActions.voterBallotItemsRetrieve(0, "", ballot_location_shortcut);
      browserHistory.push(ballot_base_url + "/" + ballot_location_shortcut);
    } else if (ballot_returned_we_vote_id && ballot_returned_we_vote_id !== "" && ballot_returned_we_vote_id !== "none") {
      // console.log("goToDifferentElection, ballot_returned_we_vote_id: ", ballot_returned_we_vote_id);
      BallotActions.voterBallotItemsRetrieve(0, ballot_returned_we_vote_id, "");
      browserHistory.push(ballot_base_url + "/id/" + ballot_returned_we_vote_id);
    } else if (originalTextForMapSearch && originalTextForMapSearch !== "") {
      // Do we still want to be updating addresses? Maybe instead just update google_civic_election_id?
      // console.log("goToDifferentElection, originalTextForMapSearch: ", originalTextForMapSearch);
      let simple_save = false;
      VoterActions.voterAddressSave(originalTextForMapSearch, simple_save, googleCivicElectionId);
      browserHistory.push(ballot_base_url);
    } else if (googleCivicElectionId && googleCivicElectionId !== 0) {
      BallotActions.voterBallotItemsRetrieve(googleCivicElectionId, "", "");
      // console.log("goToDifferentElection, googleCivicElectionId: ", googleCivicElectionId);
      browserHistory.push(ballot_base_url + "/election/" + googleCivicElectionId);
    }
    // Request positions for the different election
    if (this.props.organization_we_vote_id && this.props.organization_we_vote_id !== "") {
      // console.log("BallotElectionList calling positionListForOpinionMaker, this.props.organization_we_vote_id: ", this.props.organization_we_vote_id, ", googleCivicElectionId:", googleCivicElectionId);
      OrganizationActions.positionListForOpinionMaker(this.props.organization_we_vote_id, true, false, googleCivicElectionId);
    }

    if (this.props.toggleFunction) {
      this.props.toggleFunction();
    }
  }

  render () {
    // console.log("BallotElectionList, this.props.ballotElectionList", this.props.ballotElectionList);
    let currentDate = moment().format("YYYY-MM-DD");
    let upcomingElectionList = this.props.ballotElectionList.map((item, index) =>
      item.election_day_text > currentDate ?
      <div key={index}>
        <dl className="list-unstyled text-center">
          <button type="button" className="btn btn-success ballot-election-list__button"
                  onClick={this.goToDifferentElection.bind(this, item.ballot_location_shortcut, item.ballot_returned_we_vote_id, item.google_civic_election_id, item.original_text_for_map_search)}>
            {/* Mobile */}
            { item.election_description_text.length < MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW ?
              <span className="visible-xs">{item.election_description_text}&nbsp;<img src={"/img/global/icons/Circle-Arrow.png"}/></span> :
              <span className="visible-xs">{item.election_description_text.substring(0, MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW - 3)}...&nbsp;<img src={"/img/global/icons/Circle-Arrow.png"}/></span>
            }
            {/* Desktop */}
            <span className="hidden-xs">{item.election_description_text}&nbsp;<img src={"/img/global/icons/Circle-Arrow.png"}/></span>

            <div className="ballot-election-list__h2">{moment(item.election_day_text).format("MMMM Do, YYYY")}</div>
          </button>
        </dl>
      </div> :
      null
     );
    upcomingElectionList = cleanArray(upcomingElectionList);

    let priorElectionList = this.props.ballotElectionList.map((item, index) =>
      item.election_day_text > currentDate ?
      null :
      <div key={index}>
        <dl className="list-unstyled text-center">
          <button type="button" className="btn btn-success ballot-election-list__button"
                  onClick={this.goToDifferentElection.bind(this, item.ballot_location_shortcut, item.ballot_returned_we_vote_id, item.google_civic_election_id, item.original_text_for_map_search)}>
            {/* Mobile */}
            { item.election_description_text.length < MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW ?
              <span className="visible-xs">{item.election_description_text}&nbsp;<img src={"/img/global/icons/Circle-Arrow.png"}/></span> :
              <span className="visible-xs">{item.election_description_text.substring(0, MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW - 3)}...&nbsp;<img src={"/img/global/icons/Circle-Arrow.png"}/></span>
            }
            {/* Desktop */}
            <span className="hidden-xs">{item.election_description_text}&nbsp;<img src={"/img/global/icons/Circle-Arrow.png"}/></span>

            <div className="ballot-election-list__h2">{moment(item.election_day_text).format("MMMM Do, YYYY")}</div>
          </button>
        </dl>
      </div>
     );
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
