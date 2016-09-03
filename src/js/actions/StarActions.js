import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {

  voterAllStarsStatusRetrieve: function (){
    Dispatcher.loadEndpoint("voterAllStarsStatusRetrieve");
  },

  voterStarOnSave: function (we_vote_id, type) {
    Dispatcher.loadEndpoint("voterStarOnSave", { ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type });
  },

  voterStarOffSave: function (we_vote_id, type) {
    Dispatcher.loadEndpoint("voterStarOffSave", { ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type });
  }
};
