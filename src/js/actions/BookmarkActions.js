import Dispatcher from "../dispatcher/Dispatcher";

export default {
  voterAllBookmarksStatusRetrieve () {
    Dispatcher.loadEndpoint("voterAllBookmarksStatusRetrieve");
  },

  voterBookmarkOnSave (weVoteId, type) {
    Dispatcher.loadEndpoint("voterBookmarkOnSave", { ballot_item_we_vote_id: weVoteId, kind_of_ballot_item: type });
  },

  voterBookmarkOffSave (weVoteId, type) {
    Dispatcher.loadEndpoint("voterBookmarkOffSave", { ballot_item_we_vote_id: weVoteId, kind_of_ballot_item: type });
  },
};
