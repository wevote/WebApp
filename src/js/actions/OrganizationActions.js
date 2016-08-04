import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {
  saveFromTwitter: function (twitter_handle) {
    Dispatcher.loadEndpoint("organizationSave",
      {
        organization_twitter_handle: twitter_handle,
        refresh_from_twitter: 1
      });
  },

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

  retrieveFriendsPositions: function (we_vote_id, filter_for_voter, filter_out_voter) {
    Dispatcher.loadEndpoint("positionListForOpinionMaker",
      {
        opinion_maker_we_vote_id: we_vote_id,
        filter_for_voter: filter_for_voter,
        filter_out_voter: filter_out_voter,
        friends_vs_public: "FRIENDS_ONLY",
        kind_of_opinion_maker: "ORGANIZATION"
      });
  }
};
