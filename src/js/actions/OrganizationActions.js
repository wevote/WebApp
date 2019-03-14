import Dispatcher from '../dispatcher/Dispatcher';

export default {
  organizationSearch (organizationSearchTerm, organization_twitter_handle = '', exact_match = false) {
    // console.log("OrganizationActions.organizationSearch, organizationSearchTerm: ", organizationSearchTerm);
    Dispatcher.loadEndpoint('organizationSearch', {
      exact_match,
      organization_search_term: organizationSearchTerm,
      organization_twitter_handle,
    });
  },

  organizationFollow (organizationWeVoteId, organization_twitter_handle = '', organization_follow_based_on_issue = false) {
    // console.log("OrganizationActions.organizationFollow, organization_twitter_handle: ", organization_twitter_handle);
    Dispatcher.loadEndpoint('organizationFollow', {
      organization_we_vote_id: organizationWeVoteId,
      organization_twitter_handle,
      organization_follow_based_on_issue,
    });
  },

  organizationFollowIgnore (organizationWeVoteId) {
    Dispatcher.loadEndpoint('organizationFollowIgnore', { organization_we_vote_id: organizationWeVoteId });
  },

  organizationStopFollowing (organizationWeVoteId) {
    Dispatcher.loadEndpoint('organizationStopFollowing', { organization_we_vote_id: organizationWeVoteId });
  },

  organizationsFollowedRetrieve (autoFollowedFromTwitterSuggestion) {
    Dispatcher.loadEndpoint('organizationsFollowedRetrieve', { auto_followed_from_twitter_suggestion: autoFollowedFromTwitterSuggestion });
  },

  saveFromFacebook (facebookId, facebookEmail, facebookProfileImageUrlHttps, organizationName) {
    Dispatcher.loadEndpoint('organizationSave',
      {
        facebook_id: facebookId,
        facebook_email: facebookEmail,
        facebook_profile_image_url_https: facebookProfileImageUrlHttps,
        organization_name: organizationName,
      });
  },

  saveFromTwitter (twitterHandle) {
    Dispatcher.loadEndpoint('organizationSave',
      {
        organization_twitter_handle: twitterHandle,
        refresh_from_twitter: 1,
      });
  },

  organizationRetrieve (weVoteId) {
    Dispatcher.loadEndpoint('organizationRetrieve',
      {
        organization_we_vote_id: weVoteId,
      });
  },

  organizationDescriptionSave (organizationWeVoteId, organizationDescription) {
    Dispatcher.loadEndpoint('organizationSave',
      {
        organization_description: organizationDescription,
        organization_we_vote_id: organizationWeVoteId,
      });
  },

  organizationGetStartedSave (organizationWeVoteId, organizationName, organizationWebsite) {
    Dispatcher.loadEndpoint('organizationSave',
      {
        organization_name: organizationName,
        organization_we_vote_id: organizationWeVoteId,
        organization_website: organizationWebsite,
      });
  },

  organizationNameSave (organizationWeVoteId, organizationName) {
    Dispatcher.loadEndpoint('organizationSave',
      {
        organization_name: organizationName,
        organization_we_vote_id: organizationWeVoteId,
      });
  },

  organizationTypeSave (organizationWeVoteId, organizationType) {
    Dispatcher.loadEndpoint('organizationSave',
      {
        organization_type: organizationType,
        organization_we_vote_id: organizationWeVoteId,
      });
  },

  organizationWebsiteSave (organizationWeVoteId, organizationWebsite) {
    Dispatcher.loadEndpoint('organizationSave',
      {
        organization_we_vote_id: organizationWeVoteId,
        organization_website: organizationWebsite,
      });
  },

  positionListForOpinionMaker (organizationWeVoteId, filterForVoter, filterOutVoter, google_civic_election_id = 0) { // Calls positionListForOpinionMaker endpoint
    Dispatcher.loadEndpoint('positionListForOpinionMaker',
      {
        opinion_maker_we_vote_id: organizationWeVoteId,
        filter_for_voter: filterForVoter,
        filter_out_voter: filterOutVoter,
        google_civic_election_id,
        kind_of_opinion_maker: 'ORGANIZATION',
      });
  },

  positionListForOpinionMakerForFriends (weVoteId, filterForVoter, filterOutVoter) { // Calls positionListForOpinionMaker endpoint
    Dispatcher.loadEndpoint('positionListForOpinionMaker',
      {
        opinion_maker_we_vote_id: weVoteId,
        filter_for_voter: filterForVoter,
        filter_out_voter: filterOutVoter,
        friends_vs_public: 'FRIENDS_ONLY',
        kind_of_opinion_maker: 'ORGANIZATION',
      });
  },
};
