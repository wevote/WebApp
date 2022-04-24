import { ReduceStore } from 'flux/utils';
import ReactionActions from '../actions/ReactionActions';
import Dispatcher from '../common/dispatcher/Dispatcher';
import removeValueFromArray from '../common/utils/removeValueFromArray';
import VoterStore from './VoterStore';

class ReactionStore extends ReduceStore {
  getInitialState () {
    return {
      allCachedReactionLikesByLikedItemWeVoteId: {}, // key == we_vote_id of liked item, value == List of ReactionLikes under one likedItemWeVoteId
      allCachedReactionLikesByActivityTidbitWeVoteId: {}, // key == we_vote_id of liked item, value == List of ReactionLikes under ActivityTidbit or comments
      allItemWeVoteIdsVoterLikes: [],
      voterWeVoteIdListForEachItemLiked: {}, // Dictionary with key: item_liked_we_vote_id, value: list of voter we_vote_id's who like
    };
  }

  allActivity () {
    return this.getState().allActivity || [];
  }

  allActivityNotices () {
    return this.getState().allActivityNotices || [];
  }

  getVoterWeVoteIdListByLikedItemWeVoteId (likedItemWeVoteId) {
    const voterWeVoteIdListForEachItemLiked = this.getState().voterWeVoteIdListForEachItemLiked || {};
    return voterWeVoteIdListForEachItemLiked[likedItemWeVoteId] || [];
  }

  getReactionLikesByParentActivityTidbitWeVoteId (parentActivityTidbitWeVoteId) {
    // Get all reaction likes for main ActivityTidbit and all comments underneath
    const allCachedReactionLikesByActivityTidbitWeVoteId = this.getState().allCachedReactionLikesByActivityTidbitWeVoteId || {};
    return allCachedReactionLikesByActivityTidbitWeVoteId[parentActivityTidbitWeVoteId] || [];
  }

  getReactionLikesByLikedItemWeVoteId (likedItemWeVoteId) {
    const allCachedReactionLikesByLikedItemWeVoteId = this.getState().allCachedReactionLikesByLikedItemWeVoteId || {};
    return allCachedReactionLikesByLikedItemWeVoteId[likedItemWeVoteId] || [];
  }

  voterLikesThisItem (likedItemWeVoteId) {
    const allItemWeVoteIdsVoterLikes = this.getState().allItemWeVoteIdsVoterLikes || [];
    // console.log('voterLikesThisItem allItemWeVoteIdsVoterLikes:', allItemWeVoteIdsVoterLikes);
    return allItemWeVoteIdsVoterLikes.includes(likedItemWeVoteId);
  }

  reduce (state, action) {
    const voterWeVoteId = VoterStore.getVoterWeVoteId();
    const { allCachedReactionLikesByActivityTidbitWeVoteId } = state;
    let {
      allCachedReactionLikesByLikedItemWeVoteId,
      allItemWeVoteIdsVoterLikes, voterWeVoteIdListForEachItemLiked,
    } = state;
    let incomingReactionLikeList = [];
    let likedItemWeVoteId = '';
    let likedItemWeVoteIdList = [];
    let likedItemWeVoteIdReturnedList = [];
    switch (action.type) {
      case 'reactionLikeStatusRetrieve':
        if (!action.res || !action.res.success) return state;
        incomingReactionLikeList = action.res.reaction_like_list || [];
        likedItemWeVoteIdList = action.res.liked_item_we_vote_id_list || [];
        if (!allCachedReactionLikesByLikedItemWeVoteId) {
          allCachedReactionLikesByLikedItemWeVoteId = {};
        }
        // Cycle through likedItemWeVoteIdList so we can wipe out prior likes and reset
        likedItemWeVoteIdList.forEach((oneLikedItemWeVoteId) => {
          allCachedReactionLikesByLikedItemWeVoteId[oneLikedItemWeVoteId] = [];
        });

        likedItemWeVoteIdReturnedList = [];
        incomingReactionLikeList.forEach((reactionLike) => {
          // Capture all likes under each liked_item
          allCachedReactionLikesByLikedItemWeVoteId[reactionLike.liked_item_we_vote_id].push(reactionLike);
          if (!likedItemWeVoteIdReturnedList.includes(reactionLike.liked_item_we_vote_id)) {
            likedItemWeVoteIdReturnedList.push(reactionLike.liked_item_we_vote_id);
          }
          // Capture all likes under the parent activity_tidbit
          if (reactionLike.activity_tidbit_we_vote_id) {
            if (!allCachedReactionLikesByActivityTidbitWeVoteId[reactionLike.activity_tidbit_we_vote_id]) {
              allCachedReactionLikesByActivityTidbitWeVoteId[reactionLike.activity_tidbit_we_vote_id] = [];
            }
            allCachedReactionLikesByActivityTidbitWeVoteId[reactionLike.activity_tidbit_we_vote_id].push(reactionLike);
          }
          if (!voterWeVoteIdListForEachItemLiked) {
            voterWeVoteIdListForEachItemLiked = {};
          }
          if (!voterWeVoteIdListForEachItemLiked[reactionLike.liked_item_we_vote_id]) {
            voterWeVoteIdListForEachItemLiked[reactionLike.liked_item_we_vote_id] = [];
          }
          if (!voterWeVoteIdListForEachItemLiked[reactionLike.liked_item_we_vote_id].includes(reactionLike.voter_we_vote_id)) {
            voterWeVoteIdListForEachItemLiked[reactionLike.liked_item_we_vote_id].push(reactionLike.voter_we_vote_id);
          }
          if (reactionLike.voter_we_vote_id === voterWeVoteId) {
            if (!allItemWeVoteIdsVoterLikes.includes(reactionLike.liked_item_we_vote_id)) {
              allItemWeVoteIdsVoterLikes.push(reactionLike.liked_item_we_vote_id);
            }
          }
        });
        likedItemWeVoteIdList.forEach((oneLikedItemWeVoteId) => {
          if (!likedItemWeVoteIdReturnedList.includes(oneLikedItemWeVoteId)) {
            voterWeVoteIdListForEachItemLiked[oneLikedItemWeVoteId] = [];
          }
        });
        return {
          ...state,
          allCachedReactionLikesByActivityTidbitWeVoteId,
          allCachedReactionLikesByLikedItemWeVoteId,
          allItemWeVoteIdsVoterLikes,
          voterWeVoteIdListForEachItemLiked,
        };

      case 'voterReactionLikeOffSave':
        if (!action.res || !action.res.success) return state;
        likedItemWeVoteId = action.res.liked_item_we_vote_id || '';
        allItemWeVoteIdsVoterLikes = removeValueFromArray(likedItemWeVoteId, allItemWeVoteIdsVoterLikes);
        likedItemWeVoteIdList = [likedItemWeVoteId];
        ReactionActions.reactionLikeStatusRetrieve(likedItemWeVoteIdList);
        return {
          ...state,
          allItemWeVoteIdsVoterLikes,
        };

      case 'voterReactionLikeOnSave':
        if (!action.res || !action.res.success) return state;
        likedItemWeVoteId = action.res.liked_item_we_vote_id || '';
        if (!allItemWeVoteIdsVoterLikes.includes(likedItemWeVoteId)) {
          allItemWeVoteIdsVoterLikes.push(likedItemWeVoteId);
        }
        likedItemWeVoteIdList = [likedItemWeVoteId];
        ReactionActions.reactionLikeStatusRetrieve(likedItemWeVoteIdList);
        return {
          ...state,
          allItemWeVoteIdsVoterLikes,
        };

      case 'voterSignOut':
        return this.getInitialState();

      default:
        return state;
    }
  }
}

export default new ReactionStore(Dispatcher);
