import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {

  voterAllPositionsRetrieve: function (){
    Dispatcher.loadEndpoint("voterAllPositionsRetrieve");
  },

  positionsCountForAllBallotItems: function (election_id){
    // console.log("SupportActions, positionsCountForAllBallotItems, election_id: ", election_id);
    Dispatcher.loadEndpoint("positionsCountForAllBallotItems", {google_civic_election_id: election_id});
  },

  retrievePositionsCountsForOneBallotItem: function (ballot_item_we_vote_id){
    Dispatcher.loadEndpoint("positionsCountForOneBallotItem", {ballot_item_we_vote_id: ballot_item_we_vote_id});
  },

  voterOpposingSave: function (we_vote_id, type) {
    Dispatcher.loadEndpoint("voterOpposingSave", {ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type});
  },

  voterStopOpposingSave: function (we_vote_id, type) {
    Dispatcher.loadEndpoint("voterStopOpposingSave", {ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type});
  },

  voterSupportingSave: function (we_vote_id, type) {
    Dispatcher.loadEndpoint("voterSupportingSave", {ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type});
  },

  voterStopSupportingSave: function (we_vote_id, type) {
    Dispatcher.loadEndpoint("voterStopSupportingSave", {ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type});
  },

  voterPositionCommentSave: function (we_vote_id, type, statement_text) {
    Dispatcher.loadEndpoint("voterPositionCommentSave", {
      ballot_item_we_vote_id: we_vote_id,
      kind_of_ballot_item: type,
      statement_text: statement_text});
  },

  voterPositionVisibilitySave: function (we_vote_id, type, visibility_setting) {
    Dispatcher.loadEndpoint("voterPositionVisibilitySave", {
      ballot_item_we_vote_id: we_vote_id,
      kind_of_ballot_item: type,
      visibility_setting: visibility_setting
    });
  },
};
