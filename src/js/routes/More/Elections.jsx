import React, { Component } from "react";
import Helmet from "react-helmet";
import AnalyticsActions from "../../actions/AnalyticsActions";
import BallotElectionList from "../../components/Ballot/BallotElectionList";
import ElectionActions from "../../actions/ElectionActions";
import ElectionStore from "../../stores/ElectionStore";
import VoterStore from "../../stores/VoterStore";

export default class Elections extends Component {
  constructor (props) {
    super(props);
    this.state = {
      electionsLocationsList: [],
      voterBallotList: []
    };
  }

  static getProps () {
    return {};
  }

  componentDidMount (){
    this.electionListListener = ElectionStore.addListener(this.onElectionStoreChange.bind(this));
    ElectionActions.electionsRetrieve();
    AnalyticsActions.saveActionElections(VoterStore.election_id());
  }

  componentWillUnmount (){
    this.electionListListener.remove();
  }

  onElectionStoreChange (){
    let electionsList = ElectionStore.getElectionList();
    let electionsLocationsList = [];
    let voter_ballot; // A different format for much of the same data
    let voterBallotList = [];
    let one_ballot_location;
    let ballot_location_shortcut;
    let ballot_returned_we_vote_id;

    for (var i = 0; i < electionsList.length; i++){
      var election = electionsList[i];
      electionsLocationsList.push(election);
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
      voterBallotList.push(voter_ballot);
    }

    this.setState({
      electionsLocationsList: electionsLocationsList,
      voterBallotList: voterBallotList,
    });
  }

  render () {
    return <div>
        <Helmet title="Elections - We Vote" />
      <h1 className="h1">Supported Elections</h1>
        <div className="elections-list-container">
          <BallotElectionList ballotElectionList={this.state.voterBallotList} ballotBaseUrl="/ballot" />
        </div>
      </div>;
  }
}
