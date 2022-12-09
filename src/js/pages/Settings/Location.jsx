import React, { Component } from 'react';
import Helmet from 'react-helmet';
import AnalyticsActions from '../../actions/AnalyticsActions';
import BallotActions from '../../actions/BallotActions';
import apiCalming from '../../common/utils/apiCalming';
import BallotStore from '../../stores/BallotStore';
import ElectionActions from '../../actions/ElectionActions';
import AddressBox from '../../components/AddressBox';
import BallotElectionListWithFilters from '../../components/Ballot/BallotElectionListWithFilters';
import BrowserPushMessage from '../../components/Widgets/BrowserPushMessage';
import ElectionStore from '../../stores/ElectionStore';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../common/utils/logging';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';

export default class Location extends Component {
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
    this.ballotStoreListener = BallotStore.addListener(this.onElectionStoreChange.bind(this));
    this.electionListListener = ElectionStore.addListener(this.onElectionStoreChange.bind(this));
    if (apiCalming('voterBallotListRetrieve', 10000)) {
      BallotActions.voterBallotListRetrieve();
    }
    ElectionActions.electionsRetrieve();
    AnalyticsActions.saveActionElections(VoterStore.electionId());
    window.scrollTo(0, 0);
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
    this.electionListListener.remove();
  }

  onElectionStoreChange () {
    const electionsList = ElectionStore.getElectionList();
    let voterBallot; // A different format for much of the same data
    const voterBallotList = [];
    let oneBallotLocation;
    let ballotLocationShortcut;
    let ballotReturnedWeVoteId;

    for (let i = 0; i < electionsList.length; i++) {
      const election = electionsList[i];
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
      voterBallotList,
    });
  }

  render () {
    renderLog('Location');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <PageContentContainer>
        <div className="container-fluid well u-stack--md u-inset--md">
          <Helmet title="Enter Your Address - We Vote" />
          <BrowserPushMessage incomingProps={this.props} />
          <div>
            <AddressBox
              introductionHtml={(
                <h3 className="h3 row">
                  Enter address where you are registered to vote
                </h3>
              )}
              saveUrl="/ballot"
            />
          </div>
        </div>
        <div className="elections-list-container container-fluid well u-stack--md u-inset--md">
          <BallotElectionListWithFilters ballotElectionList={this.state.voterBallotList} ballotBaseUrl="/ballot" stateToShow="all" />
        </div>
      </PageContentContainer>
    );
  }
}
