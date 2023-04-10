import { ReduceStore } from 'flux/utils';
import assign from 'object-assign';
import Dispatcher from '../dispatcher/Dispatcher';

class OfficeHeldStore extends ReduceStore {
  getInitialState () {
    return {
      allCachedOfficeHeldItems: {}, // Dictionary with office_held_we_vote_id as key and the office_held as value
      allCachedOfficeHeldWeVoteIdsByPolitician: {}, // Dictionary with politician_we_vote_id as key and the office_held we_vote_ids as value
      officesHeld: {}, // Dictionary with office_we_vote_id as key and the office_held as value
      success: true,
    };
  }

  getOfficeHeldByWeVoteId (officeHeldWeVoteId) {
    const { allCachedOfficeHeldItems } = this.getState();
    if (allCachedOfficeHeldItems) {
      return allCachedOfficeHeldItems[officeHeldWeVoteId];
    } else {
      return undefined;
    }
  }

  getOfficeHeldListByPoliticianWeVoteId (politicianWeVoteId) {
    const { allCachedOfficeHeldWeVoteIdsByPolitician } = this.getState();
    const officeHeldList = [];

    if (allCachedOfficeHeldWeVoteIdsByPolitician) {
      const officeHeldWeVoteIdList = allCachedOfficeHeldWeVoteIdsByPolitician[politicianWeVoteId] || [];
      officeHeldWeVoteIdList.forEach((officeHeldWeVoteId) => {
        officeHeldList.push(this.getOfficeHeldByWeVoteId(officeHeldWeVoteId));
      });
    }
    return officeHeldList;
  }

  reduce (state, action) { // eslint-disable-line
    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success) return state;

    const { allCachedOfficeHeldItems, allCachedOfficeHeldWeVoteIdsByPolitician } = state;

    let newOfficesHeld = {};
    let officeHeld;
    let officeHeldWeVoteId = '';
    let officeHeldWeVoteIds;
    let officeList;
    let politician;
    let representativeList;
    let revisedState;

    switch (action.type) {
      case 'politicianRetrieve':
      case 'politicianRetrieveAsOwner':
        if (!action.res || !action.res.success) return state;
        revisedState = state;
        politician = action.res;
        // console.log('PoliticianStore politicianRetrieve, politician:', politician);
        if ('office_held_list' in politician) {
          officeHeldWeVoteIds = [];
          for (let i = 0; i < politician.office_held_list.length; ++i) {
            officeHeld = politician.office_held_list[i];
            allCachedOfficeHeldItems[officeHeld.office_held_we_vote_id] = officeHeld;
            officeHeldWeVoteIds.push(officeHeld.office_held_we_vote_id);
          }
          if (officeHeldWeVoteIds.length > 0) {
            allCachedOfficeHeldWeVoteIdsByPolitician[politician.politician_we_vote_id] = officeHeldWeVoteIds;
          }
        }
        revisedState = { ...revisedState, allCachedOfficeHeldItems };
        revisedState = { ...revisedState, allCachedOfficeHeldWeVoteIdsByPolitician };
        return revisedState;

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
