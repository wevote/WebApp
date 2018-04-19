import { ReduceStore } from "flux/utils";
import assign from "object-assign";
import Dispatcher from "../dispatcher/Dispatcher";

class OfficeStore extends ReduceStore {
  getInitialState () {
    return {
      success: true,
    };
  }

  getOffice (office_we_vote_id) {
    // if (!this.isLoaded()){ return undefined; }
    let office_list = this.getState().offices;
    if (office_list) {
      return office_list[office_we_vote_id];
    } else {
      return undefined;
    }
  }

  reduce (state, action) {
    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success)
      return state;

    let google_civic_election_id;

    switch (action.type) {

      case "officeRetrieve":
        let office = action.res;
        let new_offices = {};
        new_offices[office.we_vote_id] = office;
        return {
          ...state,
          offices: assign({}, state.offices, new_offices )
        };


      case "voterBallotItemsRetrieve":
        google_civic_election_id = action.res.google_civic_election_id || 0;
        if (google_civic_election_id !== 0) {
          let offices = {};
          action.res.ballot_item_list.forEach(one_ballot_item => {
            if (one_ballot_item.kind_of_ballot_item === "OFFICE") {
              offices[one_ballot_item.we_vote_id] = one_ballot_item;
            }
          });

          return {
            ...state,
            offices: assign({}, state.offices, offices)
          };
        }
        return state;

      case "error-officeRetrieve":
        console.log(action);
        return state;

      default:
        return state;
    }

  }

}

export default new OfficeStore(Dispatcher);
