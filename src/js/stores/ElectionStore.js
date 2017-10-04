let Dispatcher = require("../dispatcher/Dispatcher");
let FluxMapStore = require("flux/lib/FluxMapStore");

class ElectionStore extends FluxMapStore {

  getElectionList () {
    return this.getState().election_list || [];
  }

  getBallotLocationsForElection (google_civic_election_id) {
    if (this.getState().election_list_by_google_civic_election_id) {
      let one_election = this.getState().election_list_by_google_civic_election_id[google_civic_election_id];
      if (one_election) {
        return one_election.ballot_location_list;
      }
    }
    return [];
  }

  reduce (state, action) {

    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success)
      return state;

    switch (action.type) {

      case "electionsRetrieve":
        let election_list = action.res.election_list;
        let election_list_by_google_civic_election_id = {};
        election_list.forEach(election => {
          election_list_by_google_civic_election_id[election.google_civic_election_id] = election;
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
