import React, { Component, PropTypes } from "react";
import Helmet from "react-helmet";
import moment from "moment";
import AnalyticsActions from "../../actions/AnalyticsActions";
import ElectionActions from "../../actions/ElectionActions";
import ElectionStore from "../../stores/ElectionStore";
import VoterStore from "../../stores/VoterStore";

export default class Elections extends Component {
  constructor (props) {
    super(props);
    this.state = {
      elections_locations_list: []
    };
  }

  static getProps () {
    return {};
  }

  componentDidMount(){
    this.electionListListener = ElectionStore.addListener(this._onElectionStoreChange.bind(this));
    ElectionActions.electionsRetrieve();
    AnalyticsActions.saveActionElections(VoterStore.election_id());
  }

  _onElectionStoreChange(){
    // quick and messy version of this will look for better way if one exists already
    var elections_list = ElectionStore.getElectionList();
    var elections_locations_list = [];
    var ballot_locations = [];

    for (var i = 0; i < elections_list.length; i++){
      var election = elections_list[i];
      ballot_locations = ElectionStore.getBallotLocationsForElection(election.google_civic_election_id);
      election.ballot_locations = ballot_locations;
      elections_locations_list.push(election);
    }

    this.setState({ elections_locations_list: elections_locations_list });
  }

  componentWillUnmount(){
    this.electionListListener.remove();
  }

  render () {
    return <div>
        <Helmet title="Elections - We Vote" />
      <h1 className="h1">Supported Elections</h1>
        <div className="elections-list-container">
          <ul>
          {this.state.elections_locations_list.map((election) => {
            return <li key={election.google_civic_election_id}>
              {election.election_name}, {moment(election.election_day_text).format("MMMM Do, YYYY")}
              <ul>
              {election.ballot_locations.map((location) => {
                return <li key={location.ballot_returned_we_vote_id}>
                  <a href={"/ballot/" + location.ballot_location_shortcut}>{location.ballot_location_display_name}, {location.text_for_map_search}</a>
                </li>;
              })}
              </ul>
            </li>;
          })}
          </ul>
        </div>
      </div>;
  }
}
