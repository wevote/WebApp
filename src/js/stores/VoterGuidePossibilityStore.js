import { ReduceStore } from 'flux/utils';
import Dispatcher from '../common/dispatcher/Dispatcher';
import VoterGuidePossibilityActions from '../actions/VoterGuidePossibilityActions'; // eslint-disable-line import/no-cycle


class VoterGuidePossibilityStore extends ReduceStore {
  // The store keeps nested attributes of voter guides in allCachedVoterGuides, whereas the followed, ignoring, to_follow are just lists of ids.
  getInitialState () {
    return {
      voterGuidePossibilityId: 0,
      allCachedVoterGuidePossibilityPositions: {}, // This is a dictionary with voterGuidePossibilityPositionId as key and the position as the value
      allCachedVoterGuidePossibilityPositionsByCandidate: {}, // This is a dictionary with candidateWeVoteId as key and the position as the value
    };
  }

  getVoterGuidePossibility () {
    return this.getState().voterGuidePossibility || {};
  }

  /**
   * Get a Position
   * @param voterGuidePossibilityPositionId, an integer
   * @returns {*|{}}
   */
  getVoterGuidePossibilityPositionById (voterGuidePossibilityPositionId) {
    const allCachedVoterGuidePossibilityPositions = this.getState().allCachedVoterGuidePossibilityPositions || [];
    return allCachedVoterGuidePossibilityPositions[voterGuidePossibilityPositionId] || {};
  }

  getVoterGuidePossibilityPositionByCandidateId (candidateWeVoteId) {
    // For now we assume that all values in the store relate to the same organization
    const allCachedVoterGuidePossibilityPositionsByCandidate = this.getState().allCachedVoterGuidePossibilityPositionsByCandidate || {};
    return allCachedVoterGuidePossibilityPositionsByCandidate[candidateWeVoteId] || {};
  }

  getVoterGuidePossibilityId () {
    return this.getState().voterGuidePossibilityId || 0;
  }

  reduce (state, action) {
    const {
      allCachedVoterGuidePossibilityPositionsByCandidate,
    } = state;
    let {
      voterGuidePossibilityId,
    } = state;
    let possiblePositionList = [];
    let possiblePosition = {};
    let voterGuidePossibility = {};

    switch (action.type) {
      case 'voterGuidePossibilityPositionsRetrieve':
        // console.log('VoterGuidePossibilityStore voterGuidePossibilityPositionsRetrieve, action.res:', action.res);
        voterGuidePossibilityId = action.res.voter_guide_possibility_id || 0;
        possiblePositionList = action.res.possible_position_list;
        if (possiblePositionList) {
          for (let count = 0; count < possiblePositionList.length; count++) {
            possiblePosition = possiblePositionList[count];
            if (possiblePosition.candidate_we_vote_id) {
              allCachedVoterGuidePossibilityPositionsByCandidate[possiblePosition.candidate_we_vote_id] = possiblePosition;
            }
          }
        }
        // console.log('VoterGuidePossibilityStore allCachedVoterGuidePossibilityPositionsByCandidate:', allCachedVoterGuidePossibilityPositionsByCandidate);
        return {
          ...state,
          allCachedVoterGuidePossibilityPositionsByCandidate,
          voterGuidePossibilityId,
        };

      case 'voterGuidePossibilityPositionSave':
        // console.log('VoterGuidePossibilityStore voterGuidePossibilityPositionSave, action.res:', action.res);
        voterGuidePossibilityId = action.res.voter_guide_possibility_id || 0;
        possiblePositionList = action.res.possible_position_list;
        if (possiblePositionList) {
          for (let count = 0; count < possiblePositionList.length; count++) {
            possiblePosition = possiblePositionList[count];
            if (possiblePosition.candidate_we_vote_id) {
              allCachedVoterGuidePossibilityPositionsByCandidate[possiblePosition.candidate_we_vote_id] = possiblePosition;
            }
          }
        }
        return {
          ...state,
          allCachedVoterGuidePossibilityPositionsByCandidate,
          voterGuidePossibilityId,
        };

      case 'voterGuidePossibilityRetrieve':
        // console.log('VoterGuidePossibilityStore voterGuidePossibilityRetrieve, action.res:', action.res);
        voterGuidePossibility = action.res || {};
        voterGuidePossibilityId = action.res.voter_guide_possibility_id || 0;
        if (voterGuidePossibilityId) {
          VoterGuidePossibilityActions.voterGuidePossibilityPositionsRetrieve(voterGuidePossibilityId);
        }
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
