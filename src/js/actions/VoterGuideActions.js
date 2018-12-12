import Dispatcher from "../dispatcher/Dispatcher";

export default {

  pledgeToVoteWithVoterGuide (voter_guide_we_vote_id, delete_pledge = false) {
    Dispatcher.loadEndpoint("pledgeToVoteWithVoterGuide", {
      voter_guide_we_vote_id,
      delete_pledge,
    });
  },

  voterGuidesRetrieve (organization_we_vote_id) {
    Dispatcher.loadEndpoint("voterGuidesRetrieve", {
      organization_we_vote_id,
    });
  },

  voterGuidesToFollowRetrieve (election_id, search_string, add_voter_guides_not_from_election, start_retrieve_at_this_number = 0) {
    // We have migrated to a newer API call that we cache by CDN: voterGuidesUpcomingRetrieve
    const maximum_number_to_retrieve = 50;
    return Dispatcher.loadEndpoint("voterGuidesToFollowRetrieve", {
      google_civic_election_id: election_id,
      start_retrieve_at_this_number,
      maximum_number_to_retrieve,
      search_string: search_string || "",
      add_voter_guides_not_from_election: add_voter_guides_not_from_election || false,
    });
  },

  voterGuidesToFollowRetrieveByBallotItem (ballot_item_we_vote_id, kind_of_ballot_item) {
    Dispatcher.loadEndpoint("voterGuidesToFollowRetrieve", {
      ballot_item_we_vote_id,
      kind_of_ballot_item,
    });
  },

  voterGuidesToFollowRetrieveByIssuesFollowed () {
    Dispatcher.loadEndpoint("voterGuidesToFollowRetrieve", {
      filter_voter_guides_by_issue: true,
    });
  },

  voterFollowAllOrganizationsFollowedByOrganization (organization_we_vote_id) {
    Dispatcher.loadEndpoint("voterFollowAllOrganizationsFollowedByOrganization", {
      organization_we_vote_id,
    });
  },

  voterGuidesFollowedRetrieve () {
    Dispatcher.loadEndpoint("voterGuidesFollowedRetrieve", {
      maximum_number_to_retrieve: 0,
    });
  },

  voterGuidesFollowedByOrganizationRetrieve (organization_we_vote_id) {
    Dispatcher.loadEndpoint("voterGuidesFollowedByOrganizationRetrieve", {
      organization_we_vote_id,
    });
  },

  voterGuidesRecommendedByOrganizationRetrieve (organization_we_vote_id, google_civic_election_id) {
    Dispatcher.loadEndpoint("voterGuidesFollowedByOrganizationRetrieve", {
      organization_we_vote_id,
      filter_by_this_google_civic_election_id: google_civic_election_id,
    });
  },

  voterGuideFollowersRetrieve (organization_we_vote_id) {
    Dispatcher.loadEndpoint("voterGuideFollowersRetrieve", {
      organization_we_vote_id,
      maximum_number_to_retrieve: 200,
    });
  },

  voterGuidesIgnoredRetrieve () {
    // We do not currently limit the maximum_number_to_retrieve
    Dispatcher.loadEndpoint("voterGuidesIgnoredRetrieve");
  },

  voterGuideSave (google_civic_election_id, voter_guide_we_vote_id) {
    Dispatcher.loadEndpoint("voterGuideSave", {
      google_civic_election_id,
      voter_guide_we_vote_id,
    });
  },

  voterGuidesUpcomingRetrieve (google_civic_election_id = 0) {
    // let maximum_number_to_retrieve = 500;
    // For now, just pass one google_civic_election_id into list. If we want multiple, we will need to dispatch
    // with multiple "google_civic_election_id_list" entries (or comma separate)?
    Dispatcher.loadEndpoint("voterGuidesUpcomingRetrieve", {
      google_civic_election_id_list: google_civic_election_id,
      // maximum_number_to_retrieve: maximum_number_to_retrieve,
    });
  },
};
