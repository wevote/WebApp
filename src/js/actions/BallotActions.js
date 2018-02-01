import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {

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
  voterBallotOfficeOpenOrClosedSave: (google_civic_election_id = 0, we_vote_id = "", display_raccoon_details_flag = false) => {
    Dispatcher.dispatch({
      type: "voterBallotOfficeOpenOrClosedSave", 
      res: {
        google_civic_election_id,
        we_vote_id,
        display_raccoon_details_flag,
        success: true
      }
    });
    // console.log("Ballot action triggered")
  }
};
