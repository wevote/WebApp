import { ReduceStore } from 'flux/utils';
// import OfficeActions from '../actions/OfficeActions';
import Dispatcher from '../common/dispatcher/Dispatcher';

// import normalizedImagePath from '../common/utils/normalizedImagePath'; // eslint-disable-line import/no-cycle
// import stringContains from '../common/utils/stringContains';
// import OfficeStore from './OfficeStore';

class RepresentativeStore extends ReduceStore {
  getInitialState () {
    return {
      allCachedRepresentatives: {}, // Dictionary with representative_we_vote_id as key and representative as value
      allCachedRepresentativeWeVoteIdsByPolitician: {}, // Dictionary with politician_we_vote_id as key and list of representatives as value
      numberOfRepresentativesRetrievedByOfficeHeld: {}, // Dictionary with office_we_vote_id as key and number of representatives as value
      representativeListsByOfficeHeldWeVoteId: {}, // Dictionary with office_we_vote_id as key and list of representatives in the office as value
    };
  }

  getRepresentativeByWeVoteId (representativeWeVoteId) {
    return this.getState().allCachedRepresentatives[representativeWeVoteId] || {};
  }

  getRepresentativeListByOfficeHeldWeVoteId (officeWeVoteId) {
    // console.log('officeWeVoteId:', officeWeVoteId, ', this.getState().representativeListsByOfficeHeldWeVoteId:', this.getState().representativeListsByOfficeHeldWeVoteId);
    const representativeListsDict = this.getState().representativeListsByOfficeHeldWeVoteId;
    if (representativeListsDict) {
      return representativeListsDict[officeWeVoteId] || [];
    } else {
      return [];
    }
  }

  getRepresentativeList () {
    const representativeList = Object.values(this.getState().allCachedRepresentatives);
    return representativeList || [];
  }

  getRepresentativeName (representativeWeVoteId) {
    const representative = this.getState().allCachedRepresentatives[representativeWeVoteId] || {};
    if (representative && representative.ballot_item_display_name) {
      return representative.ballot_item_display_name;
    }
    return '';
  }

  getNumberOfRepresentativesRetrievedByOffice (officeWeVoteId) {
    return this.getState().numberOfRepresentativesRetrievedByOfficeHeld[officeWeVoteId] || 0;
  }

  getVoterCanEditThisRepresentative (representativeWeVoteId = '') {
    console.log('representativeWeVoteId:', representativeWeVoteId);
    return false;
  }

  isRepresentativeInStore (representativeId) {
    const representative = this.getState().allCachedRepresentatives[representativeId] || {};
    return !!(representative.we_vote_id);
  }

  reduce (state, action) {
    const {
      allCachedRepresentatives, allCachedRepresentativeWeVoteIdsByPolitician,
      numberOfRepresentativesRetrievedByOfficeHeld,
    } = state;
    let {
      representativeListsByOfficeHeldWeVoteId,
    } = state;
    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success) return state;

    let politician;
    let revisedState;
    let representative;
    let representativeList;
    let representativeWeVoteIds;

    switch (action.type) {
      case 'politicianRetrieve':
      case 'politicianRetrieveAsOwner':
        if (!action.res || !action.res.success) return state;
        revisedState = state;
        politician = action.res;
        // console.log('PoliticianStore politicianRetrieve, politician:', politician);
        if ('representative_list' in politician) {
          representativeWeVoteIds = [];
          for (let i = 0; i < politician.representative_list.length; ++i) {
            representative = politician.representative_list[i];
            allCachedRepresentatives[representative.we_vote_id] = representative;
            representativeWeVoteIds.push(representative.we_vote_id);
          }
          if (representativeWeVoteIds.length > 0) {
            allCachedRepresentativeWeVoteIdsByPolitician[politician.politician_we_vote_id] = representativeWeVoteIds;
          }
        }
        revisedState = { ...revisedState, allCachedRepresentatives };
        revisedState = { ...revisedState, allCachedRepresentativeWeVoteIdsByPolitician };
        return revisedState;

      case 'representativeRetrieve':
        representative = action.res;
        allCachedRepresentatives[representative.we_vote_id] = representative;
        return {
          ...state,
          allCachedRepresentatives,
        };

      case 'representativesQuery':
      case 'representativesRetrieve':
        // Make sure we have information for the office the representative is running for
        console.log(action);
        if (action.type === 'representativesQuery') {
          representativeList = action.res.representatives || [];
        } else {
          representativeList = action.res.representative_list || [];
        }
        // console.log('RepresentativeStore representativesQuery representativeList:', representativeList);
        if (!representativeListsByOfficeHeldWeVoteId) {
          representativeListsByOfficeHeldWeVoteId = {};
        }
        representativeList.forEach((one) => {
          // console.log('representative:', one);
          allCachedRepresentatives[one.we_vote_id] = one;
          if (one.office_held_we_vote_id) {
            if (!(one.office_held_we_vote_id in representativeListsByOfficeHeldWeVoteId)) {
              representativeListsByOfficeHeldWeVoteId[one.office_held_we_vote_id] = [];
            }
            representativeListsByOfficeHeldWeVoteId[one.office_held_we_vote_id].push(one);
            numberOfRepresentativesRetrievedByOfficeHeld[one.office_held_we_vote_id] = representativeListsByOfficeHeldWeVoteId[one.office_held_we_vote_id].length;
          }
        });

        return {
          ...state,
          allCachedRepresentatives,
          representativeListsByOfficeHeldWeVoteId,
          numberOfRepresentativesRetrievedByOfficeHeld,
        };

      default:
        return state;
    }
  }
}

export default new RepresentativeStore(Dispatcher);
