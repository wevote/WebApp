import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {

  voterBallotItemsRetrieve: function (google_civic_election_id = 0) {
    Dispatcher.loadEndpoint("voterBallotItemsRetrieve", { use_test_election: false, google_civic_election_id: google_civic_election_id });
  },

  voterBallotListRetrieve: function () {
    Dispatcher.loadEndpoint("voterBallotListRetrieve");
  }
};
