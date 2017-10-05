import React, { Component, PropTypes } from "react";
//import VoterActions from "../../actions/VoterActions";
import ElectionActions from "../../actions/ElectionActions";
import ElectionStore from "../../stores/ElectionStore";
import { cleanArray } from "../../utils/textFormat";
import moment from "moment";

export default class MoreElections extends Component {

  //static propTypes = {
    //ballotElectionList: PropTypes.array.isRequired,
    //toggleFunction: PropTypes.func.isRequired,
  //};

  constructor (props) {
    super(props);
    this.state = {
      elections_locations_list: []
    };
  }

  componentDidMount(){
    this.electionListListener = ElectionStore.addListener(this._onElectionStoreChange.bind(this));
    ElectionActions.electionsRetrieve();
  }

  _onElectionStoreChange(){
    // quick and messy version of this will look for better way if one exists already
    var elections_list = ElectionStore.getElectionList();
    var elections_locations_list = [];

    for (var i = 0; i < elections_list.length; i++){
      var election = elections_list[i];
      var ballot_locations = ElectionStore.getBallotLocationsForElection(election.google_civic_election_id);
      election.ballot_locations = ballot_locations;
      elections_locations_list.push(election);
    }

    this.setState({ elections_locations_list: elections_locations_list });
  }

  componentWillUnmount(){
    this.electionListListener.remove();
  }

  // updateBallot (originalTextForMapSearch, simple_save, googleCivicElectionId) {
    // console.log("BallotElectionList.jsx updateBallot, googleCivicElectionId: ", googleCivicElectionId);
    // #VoterActions.voterAddressSave(originalTextForMapSearch, simple_save, googleCivicElectionId);
    // Not necessary here: BallotActions.voterBallotItemsRetrieve(googleCivicElectionId);
    // this.props.toggleFunction();
  //}

  render () {
    return <div className="elections-list-container">
      <ul>
      {this.state.elections_locations_list.map((election) => {
        return <li key={election.google_civic_election_id}>
          <p>{election.election_name}</p>
          <p>{moment(election.election_day_text).format("MMMM Do, YYYY")}</p>
          <ul>
          {election.ballot_locations.map((location) => {
            return <li>
              <p><a href={"/ballot/" + location.ballot_location_shortcut}>{location.ballot_location_display_name}</a></p>
              <p>{location.text_for_map_search}</p>
            </li>;
          })}
          </ul>
        </li>;
      })}
      </ul>
    </div>;
  }
}
