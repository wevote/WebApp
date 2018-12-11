import Dispatcher from "../dispatcher/Dispatcher";

export default {
  voterAllPositionsRetrieve () {
    Dispatcher.loadEndpoint("voterAllPositionsRetrieve");
  },

  positionsCountForAllBallotItems (election_id) {
    // console.log("SupportActions, positionsCountForAllBallotItems, election_id: ", election_id);
    Dispatcher.loadEndpoint("positionsCountForAllBallotItems", { google_civic_election_id: election_id });
  },

  retrievePositionsCountsForOneBallotItem (ballot_item_we_vote_id) {
    Dispatcher.loadEndpoint("positionsCountForOneBallotItem", { ballot_item_we_vote_id });
  },

  voterOpposingSave (we_vote_id, type) {
    Dispatcher.loadEndpoint("voterOpposingSave", { ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type });
  },

  voterStopOpposingSave (we_vote_id, type) {
    Dispatcher.loadEndpoint("voterStopOpposingSave", { ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type });
  },

  voterSupportingSave (we_vote_id, type) {
    Dispatcher.loadEndpoint("voterSupportingSave", { ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type });
  },

  voterStopSupportingSave (we_vote_id, type) {
    Dispatcher.loadEndpoint("voterStopSupportingSave", { ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type });
  },

  voterPositionCommentSave (we_vote_id, type, statement_text) {
    Dispatcher.loadEndpoint("voterPositionCommentSave", {
      ballot_item_we_vote_id: we_vote_id,
      kind_of_ballot_item: type,
      statement_text,
    });
  },

  voterPositionVisibilitySave (we_vote_id, type, visibility_setting) {
    Dispatcher.loadEndpoint("voterPositionVisibilitySave", {
      ballot_item_we_vote_id: we_vote_id,
      kind_of_ballot_item: type,
      visibility_setting,
    });
  },
};
