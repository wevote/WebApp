import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {

  retrieveAll: function (){
    Dispatcher.loadEndpoint("voterAllPositionsRetrieve");
  },

  retrieveAllCounts: function (election_id){
    Dispatcher.loadEndpoint("positionsCountForAllBallotItems", {google_civic_election_id: election_id});
  },

  voterOpposingSave: function (we_vote_id, type) {
    console.log("opposing save action");
    Dispatcher.loadEndpoint("voterOpposingSave", {ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type});
  },

  voterStopOpposingSave: function (we_vote_id, type) {
        console.log("stop opposing save action");
    Dispatcher.loadEndpoint("voterStopOpposingSave", {ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type});
  },

  voterSupportingSave: function (we_vote_id, type) {
    Dispatcher.loadEndpoint("voterSupportingSave", {ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type});
  },

  voterStopSupportingSave: function (we_vote_id, type) {
    Dispatcher.loadEndpoint("voterStopSupportingSave", {ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type});
  }
};
