import { ReduceStore } from "flux/utils";
import assign from "object-assign";
import Dispatcher from "../dispatcher/Dispatcher";
import OfficeActions from "../actions/OfficeActions";

class OfficeStore extends ReduceStore {
  getInitialState () {
    return {
      offices: {}, // Dictionary with office_we_vote_id as key and the office as value
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
    let office_we_vote_id;

    switch (action.type) {

      case "officeRetrieve":
        let office = action.res;
        let new_offices = {};
        new_offices[office.we_vote_id] = office;
        return {
          ...state,
          offices: assign({}, state.offices, new_offices )
        };

      case "organizationFollow":
        // Go through all of the offices currently on this voter's ballot and update their positions
        if (state.offices && state.offices.length) {
          // console.log("OfficeStore organizationFollow, state.offices.length:", state.offices.length);
          for (office_we_vote_id in state.offices) {
            OfficeActions.positionListForBallotItem(office_we_vote_id);
          }
        }
        return state;

      case "organizationStopFollowing":
        // Go through all of the offices currently on this voter's ballot and update their positions
        if (state.offices) {
          console.log("OfficeStore organizationStopFollowing, state.offices.length:", state.offices.length);
          for (office_we_vote_id in state.offices) {
            OfficeActions.positionListForBallotItem(office_we_vote_id);
          }
        }
        return state;

      case "organizationFollowIgnore":
        // Go through all of the offices currently on this voter's ballot and update their positions
        if (state.offices) {
          console.log("OfficeStore organizationFollowIgnore, state.offices.length:", state.offices.length);
          for (office_we_vote_id in state.offices) {
            OfficeActions.positionListForBallotItem(office_we_vote_id);
          }
        }
        return state;

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
