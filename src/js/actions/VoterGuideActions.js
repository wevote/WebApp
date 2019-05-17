import Dispatcher from '../dispatcher/Dispatcher';

export default {

  pledgeToVoteWithVoterGuide (voterGuideWeVoteId, delete_pledge = false) {
    Dispatcher.loadEndpoint('pledgeToVoteWithVoterGuide', {
      voter_guide_we_vote_id: voterGuideWeVoteId,
      delete_pledge,
    });
  },

  voterGuidesRetrieve (organizationWeVoteId) {
    Dispatcher.loadEndpoint('voterGuidesRetrieve', {
      organization_we_vote_id: organizationWeVoteId,
    });
  },

  voterGuidesToFollowRetrieve (electionId, searchString, addVoterGuidesNotFromElection, startRetrieveAtThisNumber = 0) {
    // We have migrated to a newer API call that we cache by CDN: voterGuidesUpcomingRetrieve
    const maximumNumberToRetrieve = 50;
    return Dispatcher.loadEndpoint('voterGuidesToFollowRetrieve', {
      google_civic_election_id: electionId,
      start_retrieve_at_this_number: startRetrieveAtThisNumber,
      maximum_number_to_retrieve: maximumNumberToRetrieve,
      search_string: searchString || '',
      add_voter_guides_not_from_election: addVoterGuidesNotFromElection || false,
    });
  },

  voterGuidesToFollowRetrieveByBallotItem (ballotItemWeVoteId, kindOfBallotItem) {
    Dispatcher.loadEndpoint('voterGuidesToFollowRetrieve', {
      ballot_item_we_vote_id: ballotItemWeVoteId,
      kind_of_ballot_item: kindOfBallotItem,
    });
  },

  voterGuidesToFollowRetrieveByIssuesFollowed () {
    Dispatcher.loadEndpoint('voterGuidesToFollowRetrieve', {
      filter_voter_guides_by_issue: true,
    });
  },

  voterFollowAllOrganizationsFollowedByOrganization (organizationWeVoteId) {
    Dispatcher.loadEndpoint('voterFollowAllOrganizationsFollowedByOrganization', {
      organization_we_vote_id: organizationWeVoteId,
    });
  },

  voterGuidesFollowedRetrieve () {
    Dispatcher.loadEndpoint('voterGuidesFollowedRetrieve', {
      maximum_number_to_retrieve: 0,
    });
  },

  voterGuidesFollowedByOrganizationRetrieve (organizationWeVoteId) {
    Dispatcher.loadEndpoint('voterGuidesFollowedByOrganizationRetrieve', {
      organization_we_vote_id: organizationWeVoteId,
    });
  },

  voterGuidesRecommendedByOrganizationRetrieve (organizationWeVoteId, googleCivicElectionId) {
    Dispatcher.loadEndpoint('voterGuidesFollowedByOrganizationRetrieve', {
      organization_we_vote_id: organizationWeVoteId,
      filter_by_this_google_civic_election_id: googleCivicElectionId,
    });
  },

  voterGuideFollowersRetrieve (organizationWeVoteId) {
    Dispatcher.loadEndpoint('voterGuideFollowersRetrieve', {
      organization_we_vote_id: organizationWeVoteId,
      maximum_number_to_retrieve: 200,
    });
  },

  voterGuidesIgnoredRetrieve () {
    // We do not currently limit the maximumNumberToRetrieve
    Dispatcher.loadEndpoint('voterGuidesIgnoredRetrieve');
  },

  voterGuideSave (googleCivicElectionId, voterGuideWeVoteId) {
    Dispatcher.loadEndpoint('voterGuideSave', {
      google_civic_election_id: googleCivicElectionId,
      voter_guide_we_vote_id: voterGuideWeVoteId,
    });
  },

  voterGuidesUpcomingRetrieve (googleCivicElectionId = 0) {
    // This API is always retrieved from our CDN per: WebApp/src/js/utils/service.js

    // let maximumNumberToRetrieve = 500;
    // For now, just pass one googleCivicElectionId into list. If we want multiple, we will need to dispatch
    // with multiple "google_civic_election_id_list" entries (or comma separate)?
    Dispatcher.loadEndpoint('voterGuidesUpcomingRetrieve', {
      google_civic_election_id_list: googleCivicElectionId,
      // maximum_number_to_retrieve: maximumNumberToRetrieve,
    });
  },
};
