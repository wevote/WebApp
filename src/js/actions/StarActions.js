import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {
  retrieve: function (we_vote_id, type) {
    Dispatcher.loadEndpoint("voterStarStatusRetrieve", { ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type });
  },

  voterStarOnSave: function (we_vote_id, type) {
    Dispatcher.loadEndpoint("voterStarOnSave", { ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type });
  },

  voterStarOffSave: function (we_vote_id, type) {
    Dispatcher.loadEndpoint("voterStarOffSave", { ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type });
  }
};
