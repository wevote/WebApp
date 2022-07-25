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
      allCachedVoterGuidePossibilityPositions: {}, // This is a dictionary with voterGuidePossibilityPositionId as key and the position as the value
      allCachedVoterGuidePossibilityPositionsByCandidate: {}, // This is a dictionary with candidateWeVoteId as key and the position as the value
    };
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

  /**
   * Get a voterGuidePossibilityPosition. Returns 0 if the voter guide does not contain a position for that candidate.
   * @param candidateName
   * @param endorsementPageUrl
   * @returns {number|*}
   */
  getVoterGuidePossibilityPositionByCandidateName (candidateName, endorsementPageUrl) {
    // const test = this.getState();
    const allCachedVoterGuidePossibilityPositions = this.getState().allCachedVoterGuidePossibilityPositions || [];
    // const currentVoterGuidePossibilityID = this.getState().voterGuidePossibilityId;
    // console.log('getVoterGuidePossibilityPositionByCandidateName()', allCachedVoterGuidePossibilityPositions);
    for (let i = 0; i < allCachedVoterGuidePossibilityPositions.length; i++) {
      const position = allCachedVoterGuidePossibilityPositions[i];
      // console.log('getVoterGuidePossibilityPositionByCandidateName');
      if (candidateName === position.ballot_item_name && endorsementPageUrl === position.more_info_url) {
        // console.log('getVoterGuidePossibilityPositionByCandidateName', position.possibility_position_id);
        const { possibility_position_id: possibilityPositionId } = position;
        return possibilityPositionId;
      }
    }
    // if the candidate is not in the system
    return 0;
  }

  getVoterGuidePossibilityPositionByCandidateId (candidateWeVoteId) {
    // For now, we assume that all values in the store relate to the same organization
    const allCachedVoterGuidePossibilityPositionsByCandidate = this.getState().allCachedVoterGuidePossibilityPositionsByCandidate || {};
    return allCachedVoterGuidePossibilityPositionsByCandidate[candidateWeVoteId] || {};
  }

  reduce (state, action) {
    const {
      allCachedVoterGuidePossibilityPositionsByCandidate,
      // allCachedVoterGuidePossibilityPositions,
    } = state;
    // const {
    //   voterGuidePossibilityId,
    // } = state;
    let possiblePosition = {};
    const { possible_position_list: possiblePositionList } = action.res;

    switch (action.type) {
      case 'voterGuidePossibilityPositionsRetrieve':
        // console.log('VoterGuidePossibilityStore voterGuidePossibilityPositionsRetrieve, action.res:', action.res);
        // voterGuidePossibilityId = action.res.voter_guide_possibility_id || 0;
        // let temp = {};
        if (possiblePositionList) {
          for (let count = 0; count < possiblePositionList.length; count++) {
            possiblePosition = possiblePositionList[count];
            if (possiblePosition.candidate_we_vote_id) {
              allCachedVoterGuidePossibilityPositionsByCandidate[possiblePosition.candidate_we_vote_id] = possiblePosition;
            }
          }
        }
        // console.log('VoterGuidePossibilityStore allCachedVoterGuidePossibilityPositions:', possiblePositionList);
        return {
          ...state,
          allCachedVoterGuidePossibilityPositions: possiblePositionList,
          allCachedVoterGuidePossibilityPositionsByCandidate,
          // voterGuidePossibilityId,
        };

      case 'voterGuidePossibilityPositionSave':
        // console.log('VoterGuidePossibilityStore voterGuidePossibilityPositionSave, action.res:', action.res);
        // voterGuidePossibilityId = action.res.voter_guide_possibility_id || 0;
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
          // voterGuidePossibilityId,
        };

      default:
        return state;
    }
  }
}

export default new VoterGuidePossibilityPositionStore(Dispatcher);
