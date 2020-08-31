import Dispatcher from '../dispatcher/Dispatcher';

export default {
  reactionLikeStatusRetrieve (likedItemWeVoteIdList) {
    // console.log('reactionLikeStatusRetrieve');
    Dispatcher.loadEndpoint('reactionLikeStatusRetrieve',
      {
        liked_item_we_vote_id_list: likedItemWeVoteIdList,
      });
  },
  voterReactionLikeOffSave (likedItemWeVoteId = '') {
    // console.log('voterReactionLikeOffSave');
    Dispatcher.loadEndpoint('voterReactionLikeOffSave',
      {
        liked_item_we_vote_id: likedItemWeVoteId,
      });
  },
  voterReactionLikeOnSave (likedItemWeVoteId = '', activityTidbitWeVoteId = '') {
    // console.log('voterReactionLikeOnSave');
    Dispatcher.loadEndpoint('voterReactionLikeOnSave',
      {
        activity_tidbit_we_vote_id: activityTidbitWeVoteId,
        liked_item_we_vote_id: likedItemWeVoteId,
      });
  },
};
