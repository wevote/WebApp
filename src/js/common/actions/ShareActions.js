import Dispatcher from '../../dispatcher/Dispatcher';

export default {
  personalizedMessageQueuedToSave (superShareItemId, personalizedMessage) {
    Dispatcher.dispatch({
      personalizedMessage,
      superShareItemId,
      type: 'personalizedMessageQueuedToSave',
    });
  },

  personalizedSubjectQueuedToSave (superShareItemId, personalizedSubject) {
    Dispatcher.dispatch({
      personalizedSubject,
      superShareItemId,
      type: 'personalizedSubjectQueuedToSave',
    });
  },

  sharedItemListRetrieve (year = 0, month = 0, googleCivicElectionId = 0, stateCode = '') {
    // Retrieve the click statistics for all of the items you have shared
    return Dispatcher.loadEndpoint('sharedItemListRetrieve', {
      google_civic_election_id: googleCivicElectionId,
      month,
      state_code: stateCode,
      year,
    });
  },

  sharedItemRetrieveByCode (sharedItemCode) {
    return Dispatcher.loadEndpoint('sharedItemRetrieve', {
      shared_item_clicked: true,
      shared_item_code: sharedItemCode,
    });
  },

  sharedItemRetrieveByFullUrl (destinationFullUrl) {
    return Dispatcher.loadEndpoint('sharedItemRetrieve', {
      shared_item_clicked: false,
      destination_full_url: destinationFullUrl,
    });
  },

  sharedItemSave (destinationFullUrl, kindOfShare = 'BALLOT', ballotItemWeVoteId = '', googleCivicElectionId = 0, organizationWeVoteId = '') {
    // Look up siteOwnerOrganizationWeVoteId
    return Dispatcher.loadEndpoint('sharedItemSave', {
      ballot_item_we_vote_id: ballotItemWeVoteId,
      destination_full_url: destinationFullUrl,
      google_civic_election_id: googleCivicElectionId,
      is_ballot_share: (kindOfShare === 'BALLOT'),
      is_candidate_share: (kindOfShare === 'CANDIDATE'),
      is_measure_share: (kindOfShare === 'MEASURE'),
      is_office_share: (kindOfShare === 'OFFICE'),
      is_organization_share: (kindOfShare === 'ORGANIZATION'),
      is_ready_share: (kindOfShare === 'READY'),
      organization_we_vote_id: organizationWeVoteId,
    });
  },

  superShareItemRetrieve (
    campaignXWeVoteId,
    superShareItemId = 0,
  ) {
    // If there is still a SuperShareItem in draft mode for this campaign, return the superShareItemId, and if not generate a new SuperShareItem
    // console.log('superShareItemRetrieve: ', campaignXWeVoteId, superShareItemId);
    Dispatcher.loadEndpoint('superShareItemSave',
      {
        campaignx_we_vote_id: campaignXWeVoteId,
        super_share_item_id: superShareItemId,
      });
  },

  superShareItemSave (
    campaignXWeVoteId,
    campaignXNewsItemWeVoteId,
    personalizedSubject,
    personalizedSubjectSet,
    personalizedMessage,
    personalizedMessageSet,
    superShareItemId,
  ) {
    // console.log('superShareItemSave: ', personalizedMessage);
    Dispatcher.loadEndpoint('superShareItemSave',
      {
        campaignx_we_vote_id: campaignXWeVoteId,
        campaignx_news_item_we_vote_id: campaignXNewsItemWeVoteId,
        personalized_subject: personalizedSubject,
        personalized_subject_changed: personalizedSubjectSet,
        personalized_message: personalizedMessage,
        personalized_message_changed: personalizedMessageSet,
        super_share_item_id: superShareItemId,
      });
  },

  superShareItemSend (
    campaignXWeVoteId,
    sendNow,
    superShareItemId,
  ) {
    // console.log('superShareItemSend');
    Dispatcher.loadEndpoint('superShareItemSave',
      {
        campaignx_we_vote_id: campaignXWeVoteId,
        in_draft_mode: false,
        in_draft_mode_changed: true,
        send_now: sendNow,
        super_share_item_id: superShareItemId,
      });
  },
};
