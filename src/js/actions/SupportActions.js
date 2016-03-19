import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {
  retrieve: function (we_vote_id, type) {
    Dispatcher.loadEndpoint("voterPositionRetrieve", {ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type } );
    Dispatcher.loadEndpoint("positionSupportCountForBallotItem", {ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type});
    Dispatcher.loadEndpoint("positionOpposeCountForBallotItem", {ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type});
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
  }
};
