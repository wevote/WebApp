import React, { Component, PropTypes } from "react";
import AddressBox from "../../components/AddressBox";
import AnalyticsActions from "../../actions/AnalyticsActions";
import BrowserPushMessage from "../../components/Widgets/BrowserPushMessage";
import BallotElectionList from "../../components/Ballot/BallotElectionList";
import ElectionActions from "../../actions/ElectionActions";
import ElectionStore from "../../stores/ElectionStore";
import Helmet from "react-helmet";
import VoterStore from "../../stores/VoterStore";

export default class Location extends Component {
  static propTypes = {
      location: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {
      elections_locations_list: [],
      voter_ballot_list: []
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
    let elections_list = ElectionStore.getElectionList();
    let elections_locations_list = [];
    let voter_ballot; // A different format for much of the same data
    let voter_ballot_list = [];
    let one_ballot_location;
    let ballot_location_shortcut;
    let ballot_returned_we_vote_id;

    for (var i = 0; i < elections_list.length; i++){
      var election = elections_list[i];
      elections_locations_list.push(election);
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
      voter_ballot_list.push(voter_ballot);
    }

    this.setState({
      elections_locations_list: elections_locations_list,
      voter_ballot_list: voter_ballot_list,
    });
  }

  render () {
    // console.log("Settings/Location");
    return <div>
        <div className="container-fluid well u-stack--md u-inset--md">
          <Helmet title="Enter Your Address - We Vote" />
          <BrowserPushMessage incomingProps={this.props} />
          <h3 className="h3">
            Enter address where you are registered to vote
          </h3>
          <div>
            <AddressBox {...this.props} saveUrl="/ballot" />
          </div>
        </div>
        <div className="elections-list-container container-fluid well u-stack--md u-inset--md">
          <BallotElectionList ballotElectionList={this.state.voter_ballot_list} ballotBaseUrl="/ballot" />
        </div>
      </div>;
  }
}
