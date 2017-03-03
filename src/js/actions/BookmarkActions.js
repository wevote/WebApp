import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {

  voterAllBookmarksStatusRetrieve: function (){
    Dispatcher.loadEndpoint("voterAllBookmarksStatusRetrieve");
  },

  voterBookmarkOnSave: function (we_vote_id, type) {
    Dispatcher.loadEndpoint("voterBookmarkOnSave", { ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type });
  },

  voterBookmarkOffSave: function (we_vote_id, type) {
    Dispatcher.loadEndpoint("voterBookmarkOffSave", { ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type });
  }
};
