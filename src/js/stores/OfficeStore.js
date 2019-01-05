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

  getOffice (officeWeVoteId) {
    console.log("in getOffice----");
    // if (!this.isLoaded()){ return undefined; }
    const officeList = this.getState().offices;
    if (officeList) {
      return officeList[officeWeVoteId];
    } else {
      return undefined;
    }
  }

  reduce (state, action) {
    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success) return state;

    let googleCivicElectionId;
    let officeWeVoteId;
    const office = action.res;
    const newOffices = {};

    switch (action.type) {
      case "officeRetrieve":
        newOffices[office.weVoteId] = office;
        return {
          ...state,
          offices: assign({}, state.offices, newOffices ),
        };

      case "organizationFollow":
        // Go through all of the offices currently on this voter's ballot and update their positions
        if (state.offices && state.offices.length) {
          // console.log("OfficeStore organizationFollow, state.offices.length:", state.offices.length);
          for (let i = 0; i < state.offices.length; i++) {
            OfficeActions.positionListForBallotItem(officeWeVoteId);
          }
        }
        return state;

      case "organizationStopFollowing":
        // Go through all of the offices currently on this voter's ballot and update their positions
        if (state.offices) {
          console.log("OfficeStore organizationStopFollowing, state.offices.length:", state.offices.length);
          for (let i = 0; i < state.offices.length; i++) {
            OfficeActions.positionListForBallotItem(officeWeVoteId);
          }
        }
        return state;

      case "organizationFollowIgnore":
        // Go through all of the offices currently on this voter's ballot and update their positions
        if (state.offices) {
          console.log("OfficeStore organizationFollowIgnore, state.offices.length:", state.offices.length);
          for (let i = 0; i < state.offices.length; i++) {
            OfficeActions.positionListForBallotItem(officeWeVoteId);
          }
        }
        return state;

      case "voterBallotItemsRetrieve":
        googleCivicElectionId = action.res.google_civic_election_id || 0;
        if (googleCivicElectionId !== 0) {
          const offices = {};
          action.res.ballot_item_list.forEach((oneBallotItem) => {
            if (oneBallotItem.kind_of_ballot_item === "OFFICE") {
              offices[oneBallotItem.we_vote_id] = oneBallotItem;
            }
          });

          return {
            ...state,
            offices: assign({}, state.offices, offices),
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
