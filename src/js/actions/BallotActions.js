import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {

  voterBallotItemsRetrieve: function () {
    Dispatcher.loadEndpoint("voterBallotItemsRetrieve", { use_test_election: false });
  },

  voterBallotListRetrieve: function () {
    Dispatcher.loadEndpoint("voterBallotListRetrieve");
  }
};
