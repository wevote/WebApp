import { ReduceStore } from "flux/utils";
import Dispatcher from "../dispatcher/Dispatcher";

class ElectionStore extends ReduceStore {
  getInitialState () {
    return {
    };
  }

  getElectionList () {
    return this.getState().electionList || [];
  }

  getElectionByGoogleCivicElectionId (id) {
    const { electionListByGoogleCivicElectionId } = this.getState();
    const idInt = parseInt(id, 10);
    if (!electionListByGoogleCivicElectionId) return {};
    const election = electionListByGoogleCivicElectionId[idInt];
    if (election) return election;
    return {};
  }

  getBallotLocationsForElection (googleCivicElectionId) {
    const election = this.getElectionByGoogleCivicElectionId(googleCivicElectionId);
    if (election) return election.ballot_location_list;
    return [];
  }

  getElectionName (googleCivicElectionId) {
    const election = this.getElectionByGoogleCivicElectionId(googleCivicElectionId);
    if (election) return election.election_name;
    return '';
  }

  getElectionDayText (googleCivicElectionId) {
    const election = this.getElectionByGoogleCivicElectionId(googleCivicElectionId);
    if (election) return election.election_day_text;
    return '';
  }

  googleCivicDataExists (googleCivicElectionId) {
    const election = this.getElectionByGoogleCivicElectionId(googleCivicElectionId);
    if (election) return election.ballot_returned_count > 20;
    return false;
  }

  isElectionUpcoming (googleCivicElectionId) {
    const election = this.getElectionByGoogleCivicElectionId(googleCivicElectionId);
    if (election) return election.election_is_upcoming;
    return false;
  }

  reduce (state, action) { // eslint-disable-line
    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success) {
      return state;
    }

    const electionList = action.res.election_list;
    const electionListByGoogleCivicElectionId = {};

    switch (action.type) {
      case "electionsRetrieve":
        // console.log("In ElectionStore, electionsRetrieve, action.res: ", action.res);
        // console.log("In ElectionStore, electionsRetrieve, electionList: ", electionList);
        electionList.forEach((election) => {
          const googleCivicElectionId = parseInt(election.google_civic_election_id, 10);
          electionListByGoogleCivicElectionId[googleCivicElectionId] = election;
        });
        // console.log("In ElectionStore, electionsRetrieve, electionListByGoogleCivicElectionId: ", electionListByGoogleCivicElectionId);

        return {
          ...state,
          electionList,
          electionListByGoogleCivicElectionId,
        };

      case "error-electionsRetrieve":
      default:
        return state;
    }
  }
}

export default new ElectionStore(Dispatcher);
