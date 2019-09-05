import Dispatcher from '../dispatcher/Dispatcher';

export default {
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

  organizationStopIgnoring (organizationWeVoteId) {
    Dispatcher.loadEndpoint('organizationStopIgnoring', { organization_we_vote_id: organizationWeVoteId });
  },

  organizationsFollowedRetrieve (autoFollowedFromTwitterSuggestion) {
    Dispatcher.loadEndpoint('organizationsFollowedRetrieve', { auto_followed_from_twitter_suggestion: autoFollowedFromTwitterSuggestion });
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

  organizationChosenGoogleAnalyticsTrackerSave (organizationWeVoteId, organizationChosenGoogleAnalyticsTracker) {
    Dispatcher.loadEndpoint('organizationSave',
      {
        chosen_google_analytics_account_number: organizationChosenGoogleAnalyticsTracker,
        organization_we_vote_id: organizationWeVoteId,
      });
  },

  organizationChosenFaviconDelete (organizationWeVoteId) {
    Dispatcher.loadEndpoint('organizationPhotosSave',
      {
        delete_chosen_favicon: true,
        organization_we_vote_id: organizationWeVoteId,
      });
  },

  organizationChosenFaviconSave (organizationWeVoteId, chosenFaviconFromFileReader) {
    Dispatcher.loadEndpoint('organizationPhotosSave',
      {
        chosen_favicon_from_file_reader: chosenFaviconFromFileReader,
        organization_we_vote_id: organizationWeVoteId,
      });
  },

  organizationChosenLogoDelete (organizationWeVoteId) {
    Dispatcher.loadEndpoint('organizationPhotosSave',
      {
        delete_chosen_logo: true,
        organization_we_vote_id: organizationWeVoteId,
      });
  },

  organizationChosenLogoSave (organizationWeVoteId, chosenLogoFromFileReader) {
    Dispatcher.loadEndpoint('organizationPhotosSave',
      {
        chosen_logo_from_file_reader: chosenLogoFromFileReader,
        organization_we_vote_id: organizationWeVoteId,
      });
  },

  organizationChosenSocialShareMasterImageDelete (organizationWeVoteId) {
    Dispatcher.loadEndpoint('organizationPhotosSave',
      {
        delete_chosen_social_share_master_image: true,
        organization_we_vote_id: organizationWeVoteId,
      });
  },

  organizationChosenSocialShareMasterImageSave (organizationWeVoteId, chosenSocialShareMasterImageFromFileReader) {
    Dispatcher.loadEndpoint('organizationPhotosSave',
      {
        chosen_social_share_master_image_from_file_reader: chosenSocialShareMasterImageFromFileReader,
        organization_we_vote_id: organizationWeVoteId,
      });
  },

  organizationChosenHtmlVerificationSave (organizationWeVoteId, organizationChosenHtmlVerificationString) {
    Dispatcher.loadEndpoint('organizationSave',
      {
        chosen_html_verification_string: organizationChosenHtmlVerificationString,
        organization_we_vote_id: organizationWeVoteId,
      });
  },

  organizationChosenSubDomainSave (organizationWeVoteId, organizationChosenSubDomainName) {
    Dispatcher.loadEndpoint('organizationSave',
      {
        chosen_sub_domain_string: organizationChosenSubDomainName,
        organization_we_vote_id: organizationWeVoteId,
      });
  },

  organizationChosenDomainNameSave (organizationWeVoteId, organizationChosenDomainName) {
    Dispatcher.loadEndpoint('organizationSave',
      {
        chosen_domain_string: organizationChosenDomainName,
        organization_we_vote_id: organizationWeVoteId,
      });
  },

  organizationChosenHideWeVoteLogoSave (organizationWeVoteId, organizationChosenHideWeVoteLogo) {
    Dispatcher.loadEndpoint('organizationSave',
      {
        chosen_hide_we_vote_logo: organizationChosenHideWeVoteLogo,
        organization_we_vote_id: organizationWeVoteId,
      });
  },

  organizationNameSave (organizationWeVoteId, organizationName) {
    Dispatcher.loadEndpoint('organizationSave',
      {
        organization_name: organizationName,
        organization_we_vote_id: organizationWeVoteId,
      });
  },

  organizationSearch (organizationSearchTerm, organization_twitter_handle = '', exact_match = false) {
    // console.log("OrganizationActions.organizationSearch, organizationSearchTerm: ", organizationSearchTerm);
    Dispatcher.loadEndpoint('organizationSearch', {
      exact_match,
      organization_search_term: organizationSearchTerm,
      organization_twitter_handle,
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
};
