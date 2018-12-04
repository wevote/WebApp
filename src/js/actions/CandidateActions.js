import Dispatcher from "../dispatcher/Dispatcher";

export default {
  candidateRetrieve (candidateWeVoteId) {
    Dispatcher.loadEndpoint("candidateRetrieve", { candidateWeVoteId });
  },

  candidatesRetrieve (officeWeVoteId) {
    Dispatcher.loadEndpoint("candidatesRetrieve", { officeWeVoteId });
  },

  positionListForBallotItem (weVoteId) {
    Dispatcher.loadEndpoint("positionListForBallotItem", { ballot_item_we_vote_id: weVoteId, kind_of_ballot_item: "CANDIDATE" });
  },
};
