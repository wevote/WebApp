import Dispatcher from '../dispatcher/Dispatcher';

export default {
  reactionLikeStatusRetrieve (likedItemWeVoteIdList) {
    // console.log('reactionLikeStatusRetrieve');
    Dispatcher.loadEndpoint('reactionLikeStatusRetrieve',
      {
        liked_item_we_vote_id_list: likedItemWeVoteIdList,
      });
  },
  voterReactionLikeOffSave (likedItemWeVoteId = '', reactionLikeId = 0) {
    // console.log('voterReactionLikeOffSave');
    Dispatcher.loadEndpoint('voterReactionLikeOffSave',
      {
        reaction_like_id: reactionLikeId,
        liked_item_we_vote_id: likedItemWeVoteId,
      });
  },
  voterReactionLikeOnSave (likedItemWeVoteId = '', reactionLikeId = 0) {
    // console.log('voterReactionLikeOnSave');
    Dispatcher.loadEndpoint('voterReactionLikeOnSave',
      {
        reaction_like_id: reactionLikeId,
        liked_item_we_vote_id: likedItemWeVoteId,
      });
  },
};
