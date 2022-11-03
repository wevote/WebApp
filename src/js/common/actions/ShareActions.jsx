import Dispatcher from '../dispatcher/Dispatcher';

export default {
  emailRecipientListQueuedToSave (superShareItemId, emailToAdd, emailToRemove, resetEmailRecipientList) {
    Dispatcher.dispatch({
      emailToAdd,
      emailToRemove,
      resetEmailRecipientList,
      superShareItemId,
      type: 'emailRecipientListQueuedToSave',
    });
  },

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

  sharedItemListSaveRemindContact (destinationFullUrl, emailAddressArray = '', sharedMessage = '') {
    return Dispatcher.loadEndpoint('sharedItemListSave', {
      destination_full_url: destinationFullUrl, // We must provide a destinationFullUrl, so we know what hostname to use in sharedItemRetrieve
      is_remind_contact_share: true,
      other_voter_email_address_array: emailAddressArray,
      shared_message: sharedMessage,
    });
  },

  sharedItemSaveRemindContact (destinationFullUrl, emailAddressText = '', otherVoterWeVoteId = '', sharedMessage = '', otherVoterDisplayName = '', otherVoterFirstName = '', otherVoterLastName = '') {
    return Dispatcher.loadEndpoint('sharedItemSave', {
      destination_full_url: destinationFullUrl, // We must provide a destinationFullUrl, so we know what hostname to use in sharedItemRetrieve
      is_remind_contact_share: true,
      other_voter_display_name: otherVoterDisplayName,
      other_voter_first_name: otherVoterFirstName,
      other_voter_last_name: otherVoterLastName,
      other_voter_email_address_text: emailAddressText,
      other_voter_we_vote_id: otherVoterWeVoteId,
      shared_message: sharedMessage,
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

  superShareItemEmailRecipientListSave (
    campaignXWeVoteId,
    campaignXNewsItemWeVoteId,
    emailRecipientListSerialized,
    emailRecipientListSet,
    superShareItemId,
  ) {
    // console.log('superShareItemEmailRecipientListSave: ', emailRecipientListSerialized);
    Dispatcher.loadEndpoint('superShareItemSave',
      {
        campaignx_we_vote_id: campaignXWeVoteId,
        campaignx_news_item_we_vote_id: campaignXNewsItemWeVoteId,
        email_recipient_list: emailRecipientListSerialized,
        email_recipient_list_changed: emailRecipientListSet,
        super_share_item_id: superShareItemId,
      });
  },

  superSharingSendEmail (
    superShareItemId,
  ) {
    // console.log('superShareItemSend');
    Dispatcher.loadEndpoint('superShareItemSave',
      {
        send_now: true,
        super_share_item_id: superShareItemId,
      });
  },
};
