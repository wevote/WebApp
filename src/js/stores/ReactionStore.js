import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/Dispatcher';
import ReactionActions from '../actions/ReactionActions';
import { arrayContains, removeValueFromArray } from '../utils/textFormat';
import VoterStore from './VoterStore';

class ReactionStore extends ReduceStore {
  getInitialState () {
    return {
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

  getReactionLikeListByWeVoteId (likedItemWeVoteId) {
    const voterWeVoteIdListForEachItemLiked = this.getState().voterWeVoteIdListForEachItemLiked || {};
    return voterWeVoteIdListForEachItemLiked[likedItemWeVoteId] || [];
  }

  voterLikesThisItem (likedItemWeVoteId) {
    const allItemWeVoteIdsVoterLikes = this.getState().allItemWeVoteIdsVoterLikes || [];
    return arrayContains(likedItemWeVoteId, allItemWeVoteIdsVoterLikes);
  }

  reduce (state, action) {
    const voterWeVoteId = VoterStore.getVoterWeVoteId();
    let { allItemWeVoteIdsVoterLikes, voterWeVoteIdListForEachItemLiked } = state;
    let incomingReactionLikeList = [];
    let likedItemWeVoteId = '';
    let likedItemWeVoteIdList = [];
    let likedItemWeVoteIdReturnedList = [];
    switch (action.type) {
      case 'reactionLikeStatusRetrieve':
        if (!action.res || !action.res.success) return state;
        incomingReactionLikeList = action.res.reaction_like_list || [];
        likedItemWeVoteIdList = action.res.liked_item_we_vote_id_list || [];
        likedItemWeVoteIdReturnedList = [];
        incomingReactionLikeList.forEach((reactionLike) => {
          if (!arrayContains(reactionLike.liked_item_we_vote_id, likedItemWeVoteIdReturnedList)) {
            likedItemWeVoteIdReturnedList.push(reactionLike.liked_item_we_vote_id);
          }
          if (!voterWeVoteIdListForEachItemLiked) {
            voterWeVoteIdListForEachItemLiked = {};
          }
          if (!voterWeVoteIdListForEachItemLiked[reactionLike.liked_item_we_vote_id]) {
            voterWeVoteIdListForEachItemLiked[reactionLike.liked_item_we_vote_id] = [];
          }
          if (!arrayContains(reactionLike.voter_we_vote_id, voterWeVoteIdListForEachItemLiked[reactionLike.liked_item_we_vote_id])) {
            voterWeVoteIdListForEachItemLiked[reactionLike.liked_item_we_vote_id].push(reactionLike.voter_we_vote_id);
          }
          if (reactionLike.voter_we_vote_id === voterWeVoteId) {
            if (!arrayContains(reactionLike.liked_item_we_vote_id, allItemWeVoteIdsVoterLikes)) {
              allItemWeVoteIdsVoterLikes.push(reactionLike.liked_item_we_vote_id);
            }
          }
        });
        likedItemWeVoteIdList.forEach((oneLikedItemWeVoteId) => {
          if (!arrayContains(oneLikedItemWeVoteId, likedItemWeVoteIdReturnedList)) {
            voterWeVoteIdListForEachItemLiked[oneLikedItemWeVoteId] = [];
          }
        });
        return {
          ...state,
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
        if (!arrayContains(likedItemWeVoteId, allItemWeVoteIdsVoterLikes)) {
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
