import React, { Component } from "react";
import Helmet from "react-helmet";
import AnalyticsActions from "../../actions/AnalyticsActions";
import BallotElectionList from "../../components/Ballot/BallotElectionList";
import ElectionActions from "../../actions/ElectionActions";
import ElectionStore from "../../stores/ElectionStore";
import { renderLog } from "../../utils/logging";
import VoterStore from "../../stores/VoterStore";

export default class Elections extends Component {
  constructor (props) {
    super(props);
    this.state = {
      voterBallotList: [],
    };
  }

  static getProps () {
    return {};
  }

  componentDidMount () {
    this.electionListListener = ElectionStore.addListener(this.onElectionStoreChange.bind(this));
    ElectionActions.electionsRetrieve();
    AnalyticsActions.saveActionElections(VoterStore.election_id());
  }

  componentWillUnmount () {
    this.electionListListener.remove();
  }

  onElectionStoreChange () {
    const electionsList = ElectionStore.getElectionList();
    const electionsLocationsList = [];
    let voterBallot; // A different format for much of the same data
    const voterBallotList = [];
    let oneBallotlocation;
    let ballotLocationshortcut;
    let ballotReturnedweVoteid;

    for (let i = 0; i < electionsList.length; i++) {
      const election = electionsList[i];
      electionsLocationsList.push(election);
      ballotReturnedweVoteid = "";
      ballotLocationshortcut = "";
      if (election.ballot_location_list && election.ballot_location_list.length) {
        // We want to add the shortcut and we_vote_id for the first ballot location option
        [oneBallotlocation] = election.ballot_location_list;
        ballotLocationshortcut = oneBallotlocation.ballotLocationshortcut || "";
        ballotLocationshortcut = ballotLocationshortcut.trim();
        ballotReturnedweVoteid = oneBallotlocation.ballotReturnedweVoteid || "";
        ballotReturnedweVoteid = ballotReturnedweVoteid.trim();
      }
      voterBallot = {
        google_civic_election_id: election.google_civic_election_id,
        election_description_text: election.election_name,
        election_day_text: election.election_day_text,
        original_text_for_map_search: "",
        ballotLocationshortcut,
        ballotReturnedweVoteid,
      };
      voterBallotList.push(voterBallot);
    }

    this.setState({
      voterBallotList,
    });
  }

  render () {
    renderLog(__filename);
    return (
      <div>
        <Helmet title="Elections - We Vote" />
        <h1 className="h1">Supported Elections</h1>
        <div className="elections-list-container">
          <BallotElectionList ballotElectionList={this.state.voterBallotList} ballotBaseUrl="/ballot" />
        </div>
      </div>
    );
  }
}
