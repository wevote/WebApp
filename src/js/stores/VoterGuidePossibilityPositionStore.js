import { ReduceStore } from 'flux/utils';
import Dispatcher from '../common/dispatcher/Dispatcher';

/**
 * Flux Store for voterGuidePossibilityPosition
 */
class VoterGuidePossibilityPositionStore extends ReduceStore {
  // The store keeps nested attributes of voter guides in allCachedVoterGuides, whereas the followed, ignoring, to_follow are just lists of ids.
  getInitialState () {
    return {
      voterGuidePossibilityId: 0,
      allCachedVoterGuidePossibilityPositionsByPositionId: {}, // This is a dictionary with voterGuidePossibilityPositionId as key and the position as the value
      allCachedVoterGuidePossibilityPositionsByCandidateId: {}, // This is a dictionary with candidateWeVoteId as key and the position as the value
    };
  }

  /**
   * Get a Position
   * @param voterGuidePossibilityPositionId, an integer
   * @returns {*|{}}
   */
  getVoterGuidePossibilityPositionByPositionId (voterGuidePossibilityPositionId) {
    const allCachedVoterGuidePossibilityPositionsByPositionId = this.getState().allCachedVoterGuidePossibilityPositionsByPositionId || [];
    const position = allCachedVoterGuidePossibilityPositionsByPositionId[voterGuidePossibilityPositionId];
    return position || {};
  }

  /**
   * Get a voterGuidePossibilityPositionID. Returns 0 if the voter guide does not contain a position for that candidate.
   * @param candidateName
   * @returns {number|*}
   */
  getVoterGuidePossibilityPositionByCandidateName (candidateName) {
    // const test = this.getState();
    const allCachedVoterGuidePossibilityPositionsByPositionId = this.getState().allCachedVoterGuidePossibilityPositionsByPositionId || [];
    // const currentVoterGuidePossibilityID = this.getState().voterGuidePossibilityId;
    // console.log('getVoterGuidePossibilityPositionByCandidateName()', allCachedVoterGuidePossibilityPositionsByPositionId);
    for (let i = 0; i < allCachedVoterGuidePossibilityPositionsByPositionId.length; i++) {
      const position = allCachedVoterGuidePossibilityPositionsByPositionId[i];
      // console.log('getVoterGuidePossibilityPositionByCandidateName');
      if (candidateName === position.ballot_item_name) {
        // console.log('getVoterGuidePossibilityPositionByCandidateName', position.possibility_position_id);
        const { possibility_position_id: possibilityPositionId } = position;
        return possibilityPositionId;
      }
    }
    // if the candidate is not in the system
    return 0;
  }

  /**
   * Get a voterGuidePossibilityPosition. Returns an object that contains all the information for that position.
   * @param candidateWeVoteId
   * @returns {*|{}}
   */
  getVoterGuidePossibilityPositionByCandidateId (candidateWeVoteId) {
    // For now, we assume that all values in the store relate to the same organization
    const allCachedVoterGuidePossibilityPositionsByCandidateId = this.getState().allCachedVoterGuidePossibilityPositionsByCandidateId || {};
    return allCachedVoterGuidePossibilityPositionsByCandidateId[candidateWeVoteId] || {};
  }

  reduce (state, action) {
    const {
      allCachedVoterGuidePossibilityPositionsByCandidateId,
      allCachedVoterGuidePossibilityPositionsByPositionId,
    } = state;
    // const {
    //   voterGuidePossibilityId,
    // } = state;
    let possiblePosition = {};
    let possiblePositionList = [];
    if ('res' in action && 'possible_position_list' in action.res) {
      ({ res: { possible_position_list: possiblePositionList } } = action);
    }

    switch (action.type) {
      case 'voterGuidePossibilityPositionsRetrieve':
        // console.log('VoterGuidePossibilityStore voterGuidePossibilityPositionsRetrieve, action.res:', action.res);
        // voterGuidePossibilityId = action.res.voter_guide_possibility_id || 0;
        // let temp = {};
        if (possiblePositionList) {
          for (let count = 0; count < possiblePositionList.length; count++) {
            possiblePosition = possiblePositionList[count];
            if (possiblePosition.candidate_we_vote_id) {
              allCachedVoterGuidePossibilityPositionsByCandidateId[possiblePosition.candidate_we_vote_id] = possiblePosition;
            }
            if (possiblePosition.possibility_position_id) {
              allCachedVoterGuidePossibilityPositionsByPositionId[possiblePosition.possibility_position_id] = possiblePosition;
            }
          }
        }
        // console.log('VoterGuidePossibilityStore allCachedVoterGuidePossibilityPositionsByPositionId:', possiblePositionList);
        return {
          ...state,
          allCachedVoterGuidePossibilityPositionsByPositionId,
          allCachedVoterGuidePossibilityPositionsByCandidateId,
          // voterGuidePossibilityId,
        };

      case 'voterGuidePossibilityPositionSave':
        // console.log('VoterGuidePossibilityStore voterGuidePossibilityPositionSave, action.res:', action.res);
        // voterGuidePossibilityId = action.res.voter_guide_possibility_id || 0;
        if (possiblePositionList) {
          for (let count = 0; count < possiblePositionList.length; count++) {
            possiblePosition = possiblePositionList[count];
            if (possiblePosition.candidate_we_vote_id) {
              allCachedVoterGuidePossibilityPositionsByCandidateId[possiblePosition.candidate_we_vote_id] = possiblePosition;
            }
            if (possiblePosition.possibility_position_id) {
              allCachedVoterGuidePossibilityPositionsByPositionId[possiblePosition.possibility_position_id] = possiblePosition;
            }
          }
        }
        return {
          ...state,
          allCachedVoterGuidePossibilityPositionsByCandidateId,
          allCachedVoterGuidePossibilityPositionsByPositionId,
        };

      default:
        return state;
    }
  }
}

export default new VoterGuidePossibilityPositionStore(Dispatcher);
