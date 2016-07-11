import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {
  retrieve: function (we_vote_id) {
    Dispatcher.loadEndpoint("organizationRetrieve", 
      { 
        organization_we_vote_id: we_vote_id 
      });
  },

  retrievePositions: function (we_vote_id, filter_for_voter, filter_out_voter) {
    Dispatcher.loadEndpoint("positionListForOpinionMaker", 
      { 
        opinion_maker_we_vote_id: we_vote_id, 
        filter_for_voter: filter_for_voter, 
        filter_out_voter: filter_out_voter, 
        kind_of_opinion_maker: "ORGANIZATION" 
      });
  },

};
