import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {
  saveFromFacebook: function (facebook_id, facebook_email, facebook_profile_image_url_https, organization_name) {
    Dispatcher.loadEndpoint("organizationSave",
      {
        facebook_id: facebook_id,
        facebook_email: facebook_email,
        facebook_profile_image_url_https: facebook_profile_image_url_https,
        organization_name: organization_name
      });
  },

  saveFromTwitter: function (twitter_handle) {
    Dispatcher.loadEndpoint("organizationSave",
      {
        organization_twitter_handle: twitter_handle,
        refresh_from_twitter: 1
      });
  },

  organizationRetrieve: function (we_vote_id) {
    Dispatcher.loadEndpoint("organizationRetrieve",
      {
        organization_we_vote_id: we_vote_id
      });
  },

  retrievePositions: function (we_vote_id, filter_for_voter, filter_out_voter) { // Calls positionListForOpinionMaker endpoint
    Dispatcher.loadEndpoint("positionListForOpinionMaker",
      {
        opinion_maker_we_vote_id: we_vote_id,
        filter_for_voter: filter_for_voter,
        filter_out_voter: filter_out_voter,
        kind_of_opinion_maker: "ORGANIZATION"
      });
  },

  retrieveFriendsPositions: function (we_vote_id, filter_for_voter, filter_out_voter) { // Calls positionListForOpinionMaker endpoint
    Dispatcher.loadEndpoint("positionListForOpinionMaker",
      {
        opinion_maker_we_vote_id: we_vote_id,
        filter_for_voter: filter_for_voter,
        filter_out_voter: filter_out_voter,
        friends_vs_public: "FRIENDS_ONLY",
        kind_of_opinion_maker: "ORGANIZATION"
      });
  },
};
