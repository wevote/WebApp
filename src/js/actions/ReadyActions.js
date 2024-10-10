import Dispatcher from '../common/dispatcher/Dispatcher';

export default {
  voterPlansForVoterRetrieve (year = 0, month = 0, googleCivicElectionId = 0, stateCode = '') {
    // Retrieve the click statistics for all the items you have shared
    return Dispatcher.loadEndpoint('voterPlansForVoterRetrieve', {
      google_civic_election_id: googleCivicElectionId,
      month,
      state_code: stateCode,
      year,
    });
  },

  voterPlanListRetrieve (googleCivicElectionId = 0, stateCode = '') {
    return Dispatcher.loadEndpoint('voterPlanListRetrieve', {
      google_civic_election_id: googleCivicElectionId,
      state_code: stateCode,
    });
  },

  voterPlanSave (googleCivicElectionId = 0, showToPublic = '', stateCode = '', voterPlanDataSerialized = '', voterPlanText = '') {
    // Look up siteOwnerOrganizationWeVoteId
    return Dispatcher.loadEndpoint('voterPlanSave', {
      google_civic_election_id: googleCivicElectionId,
      show_to_public: showToPublic,
      state_code: stateCode,
      voter_plan_data_serialized: voterPlanDataSerialized,
      voter_plan_text: voterPlanText,
    });
  },
};
