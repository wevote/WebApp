import React, { Component } from 'react';
import Helmet from 'react-helmet';
import AnalyticsActions from '../../actions/AnalyticsActions';
import BrowserPushMessage from '../Widgets/BrowserPushMessage';
import BallotElectionList from '../Ballot/BallotElectionList';
import ElectionActions from '../../actions/ElectionActions';
import ElectionStore from '../../stores/ElectionStore';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';

export default class SettingsElection extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      // electionsLocationsList: [],
      voterBallotList: [],
    };
  }

  static getProps () {
    return {};
  }

  componentDidMount () {
    this.electionListListener = ElectionStore.addListener(this.onElectionStoreChange.bind(this));
    ElectionActions.electionsRetrieve();
    AnalyticsActions.saveActionElections(VoterStore.electionId());
  }

  componentWillUnmount () {
    this.electionListListener.remove();
  }

  onElectionStoreChange () {
    const electionsList = ElectionStore.getElectionList();
    const electionsLocationsList = [];
    let voterBallot; // A different format for much of the same data
    const voterBallotList = [];
    let oneBallotLocation;
    let ballotLocationShortcut;
    let ballotReturnedWeVoteId;

    for (let i = 0; i < electionsList.length; i++) {
      const election = electionsList[i];
      electionsLocationsList.push(election);
      ballotReturnedWeVoteId = '';
      ballotLocationShortcut = '';
      if (election.ballot_location_list && election.ballot_location_list.length) {
        // We want to add the shortcut and we_vote_id for the first ballot location option
        [oneBallotLocation] = election.ballot_location_list;
        ballotLocationShortcut = oneBallotLocation.ballot_location_shortcut || '';
        ballotLocationShortcut = ballotLocationShortcut.trim();
        ballotReturnedWeVoteId = oneBallotLocation.ballot_returned_we_vote_id || '';
        ballotReturnedWeVoteId = ballotReturnedWeVoteId.trim();
      }
      voterBallot = {
        google_civic_election_id: election.google_civic_election_id,
        election_description_text: election.election_name,
        election_day_text: election.election_day_text,
        original_text_for_map_search: '',
        ballot_location_shortcut: ballotLocationShortcut,
        ballot_returned_we_vote_id: ballotReturnedWeVoteId,
      };
      voterBallotList.push(voterBallot);
    }

    this.setState({
      // electionsLocationsList,
      voterBallotList,
    });
  }

  render () {
    renderLog(__filename);
    return (
      <div>
        <div className="elections-list-container">
          <Helmet title="Choose Election - We Vote" />
          <BrowserPushMessage incomingProps={this.props} />
          <div className="card">
            <div className="card-main">
              <BallotElectionList ballotElectionList={this.state.voterBallotList} ballotBaseUrl="/ballot" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
