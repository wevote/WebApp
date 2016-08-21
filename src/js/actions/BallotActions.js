import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {

  retrieve: function () {
    Dispatcher.loadEndpoint("voterBallotItemsRetrieve", { use_test_election: false });
  }

};
