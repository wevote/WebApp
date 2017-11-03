let Dispatcher = require("../dispatcher/Dispatcher");
let FluxMapStore = require("flux/lib/FluxMapStore");

class ElectionStore extends FluxMapStore {

  getElectionList () {
    return this.getState().election_list || [];
  }

  getBallotLocationsForElection (google_civic_election_id) {
    if (this.getState().election_list_by_google_civic_election_id) {
      let google_civic_election_id_int = parseInt(google_civic_election_id, 10);
      let one_election = this.getState().election_list_by_google_civic_election_id[google_civic_election_id_int];
      if (one_election) {
        return one_election.ballot_location_list;
      }
    }
    return [];
  }

  getElectionDayText (google_civic_election_id) {
    if (this.getState().election_list_by_google_civic_election_id) {
      let google_civic_election_id_int = parseInt(google_civic_election_id, 10);
      let one_election = this.getState().election_list_by_google_civic_election_id[google_civic_election_id_int];
      if (one_election) {
        return one_election.election_day_text || "";
      }
    }
    return "";
  }

  googleCivicDataExists (google_civic_election_id) {
    if (this.getState().election_list_by_google_civic_election_id) {
      let google_civic_election_id_int = parseInt(google_civic_election_id, 10);
      let one_election = this.getState().election_list_by_google_civic_election_id[google_civic_election_id_int];
      // console.log("googleCivicDataExists, one_election:", one_election);
      if (one_election) {
        // If more than 20 ballot_returned entries exist, we assume the data came from google civic
        return one_election.ballot_returned_count > 20;
      }
    }
    return false;
  }

  isElectionUpcoming (google_civic_election_id) {
    // console.log("ElectionStore, isElectionUpcoming, this.getState().election_list_by_google_civic_election_id:", this.getState().election_list_by_google_civic_election_id);
    if (this.getState().election_list_by_google_civic_election_id) {
      let google_civic_election_id_int = parseInt(google_civic_election_id, 10);
      // console.log("ElectionStore, isElectionUpcoming, google_civic_election_id:", google_civic_election_id);
      let one_election = this.getState().election_list_by_google_civic_election_id[google_civic_election_id_int];
      if (one_election) {
        return one_election.election_is_upcoming;
      }
    }
    return false;
  }

  reduce (state, action) {

    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success)
      return state;

    switch (action.type) {

      case "electionsRetrieve":
        let election_list = action.res.election_list;
        let election_list_by_google_civic_election_id = {};
        let google_civic_election_id;
        election_list.forEach(election => {
          google_civic_election_id = parseInt(election.google_civic_election_id, 10);
          election_list_by_google_civic_election_id[google_civic_election_id] = election;
        });
        // console.log("In ElectionStore, electionsRetrieve, election_list: ", election_list);
        // console.log("In ElectionStore, electionsRetrieve, election_list_by_google_civic_election_id: ", election_list_by_google_civic_election_id);

        return {
          ...state,
          election_list: election_list,
          election_list_by_google_civic_election_id: election_list_by_google_civic_election_id
        };

      case "error-electionsRetrieve":
      default:
        return state;
    }

  }

}

module.exports = new ElectionStore(Dispatcher);
