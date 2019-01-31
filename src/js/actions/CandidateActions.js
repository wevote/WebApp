import Dispatcher from "../dispatcher/Dispatcher";

export default {
  candidateRetrieve (candidateWeVoteId) {
    Dispatcher.loadEndpoint("candidateRetrieve",
      {
        candidate_we_vote_id: candidateWeVoteId,
      });
  },

  candidatesRetrieve (officeWeVoteId) {
    Dispatcher.loadEndpoint("candidatesRetrieve",
      {
        office_we_vote_id: officeWeVoteId,
      });
  },

  positionListForBallotItem (ballotItemWeVoteId) {
    Dispatcher.loadEndpoint("positionListForBallotItem",
      {
        ballot_item_we_vote_id: ballotItemWeVoteId,
        kind_of_ballot_item: "CANDIDATE",
      });
  },
};
