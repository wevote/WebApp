import { ReduceStore } from "flux/utils";
import Dispatcher from "../dispatcher/Dispatcher";

class ElectionStore extends ReduceStore {
  getInitialState () {
    return {
    };
  }

  getElectionList () {
    return this.getState().election_list || [];
  }

  getBallotLocationsForElection (google_civic_election_id) {
    if (this.getState().election_list_by_google_civic_election_id) {
      const google_civic_election_id_int = parseInt(google_civic_election_id, 10);
      const one_election = this.getState().election_list_by_google_civic_election_id[google_civic_election_id_int];
      // console.log("getBallotLocationsForElection, one_election.ballot_location_list:", one_election.ballot_location_list)
      if (one_election) {
        return one_election.ballot_location_list;
      }
    }
    return [];
  }

  getElectionName (google_civic_election_id) {
    if (this.getState().election_list_by_google_civic_election_id) {
      const google_civic_election_id_int = parseInt(google_civic_election_id, 10);
      const one_election = this.getState().election_list_by_google_civic_election_id[google_civic_election_id_int];
      if (one_election) {
        return one_election.election_name || "";
      }
    }
    return "";
  }

  getElectionDayText (google_civic_election_id) {
    const google_civic_election_id_int = parseInt(google_civic_election_id, 10);
    // console.log("ElectionStore, googleCivicDataExists, google_civic_election_id:", google_civic_election_id, "google_civic_election_id_int:", google_civic_election_id_int);
    if (this.getState().election_list_by_google_civic_election_id) {
      const one_election = this.getState().election_list_by_google_civic_election_id[google_civic_election_id_int];
      if (one_election) {
        return one_election.election_day_text || "";
      }
    }
    return "";
  }

  googleCivicDataExists (google_civic_election_id) {
    const google_civic_election_id_int = parseInt(google_civic_election_id, 10);
    // console.log("ElectionStore, googleCivicDataExists, google_civic_election_id:", google_civic_election_id, "google_civic_election_id_int:", google_civic_election_id_int);
    if (this.getState().election_list_by_google_civic_election_id) {
      const one_election = this.getState().election_list_by_google_civic_election_id[google_civic_election_id_int];
      if (one_election) {
        // If more than 20 ballot_returned entries exist, we assume the data came from google civic
        return one_election.ballot_returned_count > 20;
      }
    }
    return false;
  }

  isElectionUpcoming (google_civic_election_id) {
    const google_civic_election_id_int = parseInt(google_civic_election_id, 10);
    // console.log("ElectionStore, googleCivicDataExists, google_civic_election_id:", google_civic_election_id, "google_civic_election_id_int:", google_civic_election_id_int);
    // console.log("ElectionStore, isElectionUpcoming, this.getState().election_list_by_google_civic_election_id:", this.getState().election_list_by_google_civic_election_id);
    if (this.getState().election_list_by_google_civic_election_id) {
      const one_election = this.getState().election_list_by_google_civic_election_id[google_civic_election_id_int];
      if (one_election) {
        return one_election.election_is_upcoming || false;
      }
    }
    return false;
  }

  reduce (state, action) {
    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success) {
      return state;
    }

    const election_list = action.res.election_list;
    const election_list_by_google_civic_election_id = {};

    switch (action.type) {

      case "electionsRetrieve":
        // console.log("In ElectionStore, electionsRetrieve, action.res: ", action.res);
        // console.log("In ElectionStore, electionsRetrieve, election_list: ", election_list);
        election_list.forEach((election) => {
          const google_civic_election_id = parseInt(election.google_civic_election_id, 10);
          election_list_by_google_civic_election_id[google_civic_election_id] = election;
        });
        // console.log("In ElectionStore, electionsRetrieve, election_list_by_google_civic_election_id: ", election_list_by_google_civic_election_id);

        return {
          ...state,
          election_list,
          election_list_by_google_civic_election_id,
        };

      case "error-electionsRetrieve":
      default:
        return state;
    }
  }
}

export default new ElectionStore(Dispatcher);
