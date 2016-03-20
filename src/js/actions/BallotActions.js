import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {
  init: function () {
    Dispatcher.loadEndpoint("voterBallotItemsRetrieve", { use_test_election: false });
  }
};
