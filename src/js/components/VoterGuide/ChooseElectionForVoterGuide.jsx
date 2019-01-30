import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import BallotStore from "../../stores/BallotStore";
import { cordovaDot } from "../../utils/cordovaUtils";
import ElectionActions from "../../actions/ElectionActions";
import ElectionStore from "../../stores/ElectionStore";
import { renderLog } from "../../utils/logging";
import VoterGuideActions from "../../actions/VoterGuideActions";
import VoterGuideStore from "../../stores/VoterGuideStore";
import VoterStore from "../../stores/VoterStore";
import { cleanArray } from "../../utils/textFormat";

const MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW = 32;

export default class ChooseElectionForVoterGuide extends Component {
  static propTypes = {
    destinationFunction: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      voterBallotList: [],
    };
  }

  componentDidMount () {
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.electionListListener = ElectionStore.addListener(this.onElectionStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    ElectionActions.electionsRetrieve();
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
    this.electionListListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onBallotStoreChange () {
    console.log("ChooseElectionForVoterGuide onBallotStoreChange");
    if (BallotStore.ballotProperties && BallotStore.ballotProperties.ballot_found && BallotStore.ballot && BallotStore.ballot.length === 0) {
      // Ballot is found but ballot is empty. We want to stay put.
      console.log("onBallotStoreChange: ballot_with_all_items is empty");
    }
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
      ballotReturnedWeVoteId = "";
      ballotLocationShortcut = "";
      if (election.ballot_location_list && election.ballot_location_list.length) {
        // We want to add the shortcut and we_vote_id for the first ballot location option
        [oneBallotLocation] = election.ballot_location_list;
        ballotLocationShortcut = oneBallotLocation.ballot_location_shortcut || "";
        ballotLocationShortcut = ballotLocationShortcut.trim();
        ballotReturnedWeVoteId = oneBallotLocation.ballot_returned_we_vote_id || "";
        ballotReturnedWeVoteId = ballotReturnedWeVoteId.trim();
      }
      voterBallot = {
        google_civic_election_id: election.google_civic_election_id,
        election_description_text: election.election_name,
        election_day_text: election.election_day_text,
        original_text_for_map_search: "",
        ballot_location_shortcut: ballotLocationShortcut,
        ballot_returned_we_vote_id: ballotReturnedWeVoteId,
      };
      voterBallotList.push(voterBallot);
    }

    this.setState({
      voterBallotList,
    });
  }

  onVoterGuideStoreChange () {
    const voter = VoterStore.getVoter();
    const voterGuideSaveResults = VoterGuideStore.getVoterGuideSaveResults();
    if (voterGuideSaveResults && voter && voterGuideSaveResults.organization_we_vote_id === voter.linked_organization_we_vote_id) {
      this.props.destinationFunction(voterGuideSaveResults.we_vote_id);
    }
  }

  saveVoterGuideForElection (googleCivicElectionId) {
    VoterGuideActions.voterGuideSave(googleCivicElectionId, "");
  }

  render () {
    renderLog(__filename);
    if (!this.state.voterBallotList) {
      console.log("Elections list missing");
      return null;
    }

    const currentDate = moment().format("YYYY-MM-DD");
    // console.log("currentDate: ", currentDate);
    let electionDateTomorrow;
    let electionDateTomorrowMoment;
    const ballotElectionListUpcomingSorted = this.state.voterBallotList;
    // We want to sort ascending so the next upcoming election is first
    ballotElectionListUpcomingSorted.sort((a, b) => {
      const electionDayTextA = a.election_day_text.toLowerCase();
      const electionDayTextB = b.election_day_text.toLowerCase();
      if (electionDayTextA < electionDayTextB) { // sort string ascending
        return -1;
      }
      if (electionDayTextA > electionDayTextB) return 1;
      return 0; // default return value (no sorting)
    });
    let upcomingElectionList = ballotElectionListUpcomingSorted.map((item) => {
      electionDateTomorrowMoment = moment(item.election_day_text, "YYYY-MM-DD").add(1, "days");
      electionDateTomorrow = electionDateTomorrowMoment.format("YYYY-MM-DD");
      // console.log("electionDateTomorrow: ", electionDateTomorrow);
      return electionDateTomorrow > currentDate ? (
        <div key={`choose-election-${item.google_civic_election_id}`}>
          <dl className="list-unstyled text-center">
            <button
              type="button"
              className="btn btn-success ballot-election-list__button"
              onClick={this.saveVoterGuideForElection.bind(this, item.google_civic_election_id)}
            >
              {/* Mobile */}
              { item.election_description_text.length < MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW ? (
                <span className="d-block d-sm-none">
                  {item.election_description_text}
                  &nbsp;
                  <img
                    src={cordovaDot("/img/global/icons/Circle-Arrow.png")}
                  />
                </span>
              ) : (
                <span
                  className="d-block d-sm-none"
                >
                  {item.election_description_text.substring(0, MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW - 3)}
                  ...&nbsp;
                  <img src={cordovaDot("/img/global/icons/Circle-Arrow.png")} />
                </span>
              )}
              {/* Desktop */}
              <span className="d-none d-sm-block">
                {item.election_description_text}
                &nbsp;
                <img
                  src={cordovaDot("/img/global/icons/Circle-Arrow.png")}
                />
              </span>
              <div className="ballot-election-list__h2">{moment(item.election_day_text).format("MMMM Do, YYYY")}</div>
            </button>
          </dl>
        </div>
      ) :
        null;
    });
    upcomingElectionList = cleanArray(upcomingElectionList);

    const ballotElectionListPastSorted = this.state.voterBallotList;
    // We want to sort descending so the most recent election is first
    ballotElectionListPastSorted.sort((a, b) => {
      const electionDayTextA = a.election_day_text.toLowerCase();
      const electionDayTextB = b.election_day_text.toLowerCase();
      if (electionDayTextA < electionDayTextB) { // sort string descending
        return 1;
      }
      if (electionDayTextA > electionDayTextB) return -1;
      return 0; // default return value (no sorting)
    });

    return (
      <div>
        {upcomingElectionList}
      </div>
    );
  }
}
