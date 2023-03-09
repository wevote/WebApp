import { ReduceStore } from 'flux/utils';
import assign from 'object-assign';
import Dispatcher from '../common/dispatcher/Dispatcher';

class OfficeHeldStore extends ReduceStore {
  getInitialState () {
    return {
      officesHeld: {}, // Dictionary with office_we_vote_id as key and the office_held as value
      success: true,
    };
  }

  getOfficeHeld (officeHeldWeVoteId) {
    // console.log('in getOfficeHeld----');
    // if (!this.isLoaded()){ return undefined; }
    const officeList = this.getState().officesHeld;
    if (officeList) {
      return officeList[officeHeldWeVoteId];
    } else {
      return undefined;
    }
  }

  reduce (state, action) { // eslint-disable-line
    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success) return state;

    // let arrayOfOfficeHeldWeVoteIds;
    let representativeList;
    let officeHeldWeVoteId = '';
    let officeHeld;
    let officeList;
    let newOfficesHeld = {};

    switch (action.type) {
      case 'representativesRetrieve':
        // Make sure we have information for the office_held the representative is running for
        if (!action.res.contest_office_we_vote_id) {
          return {
            ...state,
          };
        }
        officeHeldWeVoteId = action.res.contest_office_we_vote_id;
        officeList = state.officesHeld;
        if (officeList) {
          officeHeld = officeList[officeHeldWeVoteId];
        }
        if (!officeHeld || !officeHeld.ballot_item_display_name) {
          return {
            ...state,
          };
        }

        representativeList = action.res.representative_list;
        if (representativeList && representativeList.length) {
          officeHeld.representative_list = representativeList;
          newOfficesHeld = {};
          newOfficesHeld[officeHeld.we_vote_id] = officeHeld;
          return {
            ...state,
            officesHeld: assign({}, state.officesHeld, newOfficesHeld),
          };
        } else {
          return {
            ...state,
          };
        }

      case 'officeHeldRetrieve':
        if (action.res.office_held && action.res.office_held.we_vote_id) {
          newOfficesHeld[action.res.office_held.we_vote_id] = action.res.office_held;
          return {
            ...state,
            officesHeld: assign({}, state.officesHeld, newOfficesHeld),
          };
        } else {
          return state;
        }

      case 'error-officeRetrieve':
        console.log(action);
        return state;

      default:
        return state;
    }
  }
}

export default new OfficeHeldStore(Dispatcher);
