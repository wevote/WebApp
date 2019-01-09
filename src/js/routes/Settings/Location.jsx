import React, { Component } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import AddressBox from "../../components/AddressBox";
import AnalyticsActions from "../../actions/AnalyticsActions";
import BrowserPushMessage from "../../components/Widgets/BrowserPushMessage";
import BallotElectionList from "../../components/Ballot/BallotElectionList";
import ElectionActions from "../../actions/ElectionActions";
import ElectionStore from "../../stores/ElectionStore";
import { renderLog } from "../../utils/logging";
import VoterStore from "../../stores/VoterStore";

export default class Location extends Component {
  static propTypes = {
    location: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      electionLocationList: [],
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
    const electionList = ElectionStore.getElectionList();
    const electionLocationList = [];
    let voterBallot; // A different format for much of the same data
    const voterBallotList = [];
    let oneBallotLocation;
    letballotLocationShortcut;
    let ballotReturnedWeVoteId;

    for (let i = 0; i < electionList.length; i++) {
      const election = electionList[i];
      electionLocationList.push(election);
      ballotReturnedWeVoteId = "";
     ballotLocationShortcut = "";
      if (election.ballot_location_list && election.ballot_location_list.length) {
        // We want to add the shortcut and we_vote_id for the first ballot location option
        oneBallotLocation = election.ballot_location_list[0];
       ballotLocationShortcut = oneBallotLocation.ballot_location_shortcut || "";
       ballotLocationShortcut =ballotLocationShortcut.trim();
        ballotReturnedWeVoteId = oneBallotLocation.ballot_returned_we_vote_id || "";
        ballotReturnedWeVoteId = ballotReturnedWeVoteId.trim();
      }
      voterBallot = {
        googleCivicElectionId: election.google_civic_election_id,
        electionDescriptionText: election.election_name,
        electionDayText: election.election_day_text,
        originalTextForMapSearch: "",
       ballotLocationShortcut,
        ballotReturnedWeVoteId,
      };
      voterBallotList.push(voterBallot);
    }

    this.setState({
      electionLocationList,
      voterBallotList,
    });
  }

  render () {
    renderLog(__filename);
    return (
      <div>
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
          <BallotElectionList ballotElectionList={this.state.voterBallotList} ballotBaseUrl="/ballot" />
        </div>
      </div>
    );
  }
}
