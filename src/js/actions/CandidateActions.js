import Dispatcher from "../dispatcher/Dispatcher";

export default {
  candidateRetrieve: function (candidate_we_vote_id) {
    Dispatcher.loadEndpoint("candidateRetrieve", {candidate_we_vote_id: candidate_we_vote_id});
  },

  candidatesRetrieve: function (office_we_vote_id) {
    Dispatcher.loadEndpoint("candidatesRetrieve", {office_we_vote_id: office_we_vote_id});
  },

  positionListForBallotItem: function (we_vote_id) {
    Dispatcher.loadEndpoint("positionListForBallotItem", { ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: "CANDIDATE"} );
  }
};
