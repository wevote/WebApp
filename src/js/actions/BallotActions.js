import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {

  retrieve: function () {
    console.log("BallotActions, calling voterBallotItemsRetrieve");
    Dispatcher.loadEndpoint("voterBallotItemsRetrieve", { use_test_election: false });
  }

};
