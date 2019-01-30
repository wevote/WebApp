import Dispatcher from "../dispatcher/Dispatcher";

export default {
  voterAllPositionsRetrieve () {
    Dispatcher.loadEndpoint("voterAllPositionsRetrieve");
  },

  positionsCountForAllBallotItems (electionId) {
    // console.log("SupportActions, positionsCountForAllBallotItems, electionId: ", electionId);
    Dispatcher.loadEndpoint("positionsCountForAllBallotItems", { google_civic_election_id: electionId });
  },

  retrievePositionsCountsForOneBallotItem (ballotItemWeVoteId) {
    Dispatcher.loadEndpoint("positionsCountForOneBallotItem", { ballot_item_we_vote_id: ballotItemWeVoteId });
  },

  voterOpposingSave (weVoteId, type) {
    Dispatcher.loadEndpoint("voterOpposingSave", { ballot_item_we_vote_id: weVoteId, kind_of_ballot_item: type });
  },

  voterStopOpposingSave (weVoteId, type) {
    Dispatcher.loadEndpoint("voterStopOpposingSave", { ballot_item_we_vote_id: weVoteId, kind_of_ballot_item: type });
  },

  voterSupportingSave (weVoteId, type) {
    Dispatcher.loadEndpoint("voterSupportingSave", { ballot_item_we_vote_id: weVoteId, kind_of_ballot_item: type });
  },

  voterStopSupportingSave (weVoteId, type) {
    Dispatcher.loadEndpoint("voterStopSupportingSave", { ballot_item_we_vote_id: weVoteId, kind_of_ballot_item: type });
  },

  voterPositionCommentSave (weVoteId, type, statementText) {
    Dispatcher.loadEndpoint("voterPositionCommentSave", {
      ballot_item_we_vote_id: weVoteId,
      kind_of_ballot_item: type,
      statement_text: statementText,
    });
  },

  voterPositionVisibilitySave (weVoteId, type, visibilitySetting) {
    Dispatcher.loadEndpoint("voterPositionVisibilitySave", {
      ballot_item_we_vote_id: weVoteId,
      kind_of_ballot_item: type,
      visibility_setting: visibilitySetting,
    });
  },
};
