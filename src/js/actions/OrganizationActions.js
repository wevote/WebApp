import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {

  organizationFollow: function (organization_we_vote_id, organization_twitter_handle = "", organization_follow_based_on_issue = false) {
    // console.log("OrganizationActions.organizationFollow, organization_twitter_handle: ", organization_twitter_handle);
    Dispatcher.loadEndpoint("organizationFollow", {
      organization_we_vote_id: organization_we_vote_id,
      organization_twitter_handle: organization_twitter_handle,
      organization_follow_based_on_issue: organization_follow_based_on_issue
    });
  },

  organizationFollowIgnore: function (organization_we_vote_id) {
    Dispatcher.loadEndpoint("organizationFollowIgnore", { organization_we_vote_id: organization_we_vote_id});
  },

  organizationStopFollowing: function (organization_we_vote_id) {
    Dispatcher.loadEndpoint("organizationStopFollowing", { organization_we_vote_id: organization_we_vote_id});
  },

  organizationsFollowedRetrieve: function (auto_followed_from_twitter_suggestion) {
    Dispatcher.loadEndpoint("organizationsFollowedRetrieve", {
      auto_followed_from_twitter_suggestion: auto_followed_from_twitter_suggestion} );
  },

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

  positionListForOpinionMaker: function (we_vote_id, filter_for_voter, filter_out_voter, google_civic_election_id=0) { // Calls positionListForOpinionMaker endpoint
    Dispatcher.loadEndpoint("positionListForOpinionMaker",
      {
        opinion_maker_we_vote_id: we_vote_id,
        filter_for_voter: filter_for_voter,
        filter_out_voter: filter_out_voter,
        google_civic_election_id: google_civic_election_id,
        kind_of_opinion_maker: "ORGANIZATION"
      });
  },

  positionListForOpinionMakerForFriends: function (we_vote_id, filter_for_voter, filter_out_voter) { // Calls positionListForOpinionMaker endpoint
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
