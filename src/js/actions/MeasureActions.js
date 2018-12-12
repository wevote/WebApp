import Dispatcher from "../dispatcher/Dispatcher";

export default {
  measureRetrieve (weVoteId) {
    Dispatcher.loadEndpoint("measureRetrieve", { measure_we_vote_id: weVoteId });
  },

  positionListForBallotItem (weVoteId) {
    Dispatcher.loadEndpoint("positionListForBallotItem",
      { ballot_item_we_vote_id: weVoteId, kind_of_ballot_item: "MEASURE" });
  },
};
