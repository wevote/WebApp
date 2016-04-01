import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {
  retrieve: function (we_vote_id) {
    Dispatcher.loadEndpoint("organizationRetrieve", { organization_we_vote_id: we_vote_id });
  },

  retrievePositions: function (we_vote_id) {
    Dispatcher.loadEndpoint("positionListForOpinionMaker", { opinion_maker_we_vote_id: we_vote_id, kind_of_opinion_maker: "ORGANIZATION" });
  },

};
