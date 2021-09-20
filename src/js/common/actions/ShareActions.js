import Dispatcher from '../../dispatcher/Dispatcher';

export default {
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
};
