import Dispatcher from "../dispatcher/Dispatcher";

export default {
  measureRetrieve (measureWeVoteId) {
    Dispatcher.loadEndpoint("measureRetrieve",
      {
        measure_we_vote_id: measureWeVoteId,
      });
  },

  positionListForBallotItem (ballotItemWeVoteId) {
    Dispatcher.loadEndpoint("positionListForBallotItem",
      {
        ballot_item_we_vote_id: ballotItemWeVoteId,
        kind_of_ballot_item: "MEASURE",
      });
  },
};
