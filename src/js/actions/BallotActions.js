import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {
  ballotItemOptionsClear: function () {
    Dispatcher.dispatch({
      type: "ballotItemOptionsClear",
      res: {
        success: true
      }
    });
  },

  ballotItemOptionsRetrieve: function (google_civic_election_id, search_string = "", state_code = "") {
    Dispatcher.loadEndpoint("ballotItemOptionsRetrieve", {
      google_civic_election_id: google_civic_election_id,
      search_string: search_string,
      state_code: state_code,
    });
  },

  voterBallotItemsRetrieve: function (google_civic_election_id = 0, ballot_returned_we_vote_id = "", ballot_location_shortcut = "") {
    Dispatcher.loadEndpoint("voterBallotItemsRetrieve", {
      use_test_election: false,
      google_civic_election_id: google_civic_election_id,
      ballot_returned_we_vote_id: ballot_returned_we_vote_id,
      ballot_location_shortcut: ballot_location_shortcut,
    });
  },

  voterBallotListRetrieve: function () {
    Dispatcher.loadEndpoint("voterBallotListRetrieve");
  },
  
  voterBallotItemOpenOrClosedSave: (ballot_item_unfurled_tracker) => {
    Dispatcher.dispatch({
      type: "voterBallotItemOpenOrClosedSave",
      res: {
        ballot_item_unfurled_tracker,
        success: true
      }
    });
  }
};
