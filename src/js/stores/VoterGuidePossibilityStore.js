import { ReduceStore } from 'flux/utils';
import Dispatcher from '../common/dispatcher/Dispatcher';

/**
 * Flux Store for voterGuidePossibility
 */
class VoterGuidePossibilityStore extends ReduceStore {
  // The store keeps nested attributes of voter guides in allCachedVoterGuides, whereas the followed, ignoring, to_follow are just lists of ids.
  getInitialState () {
    return {
      voterGuidePossibilityId: 0,
    };
  }

  getVoterGuidePossibility () {
    return this.getState().voterGuidePossibility || {};
  }

  getVoterGuidePossibilityId () {
    return this.getState().voterGuidePossibilityId || 0;
  }

  reduce (state, action) {
    let {
      voterGuidePossibilityId,
    } = state;
    let voterGuidePossibility = {};

    switch (action.type) {
      case 'voterGuidePossibilityRetrieve':
        // console.log('VoterGuidePossibilityStore voterGuidePossibilityRetrieve, action.res:', action.res);
        voterGuidePossibility = action.res || {};
        voterGuidePossibilityId = action.res.voter_guide_possibility_id || 0;
        return {
          ...state,
          voterGuidePossibility,
          voterGuidePossibilityId,
        };

      case 'voterGuidePossibilitySave':
        // console.log('VoterGuidePossibilityStore voterGuidePossibilitySave, action.res:', action.res);
        voterGuidePossibility = action.res || {};
        voterGuidePossibilityId = action.res.voter_guide_possibility_id || 0;
        return {
          ...state,
          voterGuidePossibility,
          voterGuidePossibilityId,
        };

      default:
        return state;
    }
  }
}

export default new VoterGuidePossibilityStore(Dispatcher);
