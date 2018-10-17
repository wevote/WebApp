import Dispatcher from "../dispatcher/Dispatcher";

export default {

  pledgeToVoteWithVoterGuide: function (voter_guide_we_vote_id, delete_pledge = false) {
    Dispatcher.loadEndpoint("pledgeToVoteWithVoterGuide", {
      voter_guide_we_vote_id: voter_guide_we_vote_id,
      delete_pledge: delete_pledge,
    });
  },

  voterGuidesRetrieve: function (organization_we_vote_id) {
    Dispatcher.loadEndpoint("voterGuidesRetrieve", {
      organization_we_vote_id: organization_we_vote_id
    });
  },

  voterGuidesToFollowRetrieve: function (election_id, search_string, add_voter_guides_not_from_election, start_retrieve_at_this_number = 0) {
    let maximum_number_to_retrieve = 50;
    Dispatcher.loadEndpoint("voterGuidesToFollowRetrieve", {
      google_civic_election_id: election_id,
      start_retrieve_at_this_number: start_retrieve_at_this_number,
      maximum_number_to_retrieve: maximum_number_to_retrieve,
      search_string: search_string || "",
      add_voter_guides_not_from_election: add_voter_guides_not_from_election || false,
    });
  },

  voterGuidesToFollowRetrieveByBallotItem: function (ballot_item_we_vote_id, kind_of_ballot_item) {
    Dispatcher.loadEndpoint("voterGuidesToFollowRetrieve", {
      ballot_item_we_vote_id: ballot_item_we_vote_id,
      kind_of_ballot_item: kind_of_ballot_item
    });
  },

  voterGuidesToFollowRetrieveByIssuesFollowed: function () {
    Dispatcher.loadEndpoint("voterGuidesToFollowRetrieve", {
      filter_voter_guides_by_issue: true
    });
  },

  voterFollowAllOrganizationsFollowedByOrganization: function (organization_we_vote_id) {
    Dispatcher.loadEndpoint("voterFollowAllOrganizationsFollowedByOrganization", {
      organization_we_vote_id: organization_we_vote_id
    });
  },

  voterGuidesFollowedRetrieve: function () {
    Dispatcher.loadEndpoint("voterGuidesFollowedRetrieve", {
      maximum_number_to_retrieve: 0
    } );
  },

  voterGuidesFollowedByOrganizationRetrieve: function (organization_we_vote_id) {
    Dispatcher.loadEndpoint("voterGuidesFollowedByOrganizationRetrieve", {
      organization_we_vote_id: organization_we_vote_id
    });
  },

  voterGuidesRecommendedByOrganizationRetrieve: function (organization_we_vote_id, google_civic_election_id) {
    Dispatcher.loadEndpoint("voterGuidesFollowedByOrganizationRetrieve", {
      organization_we_vote_id: organization_we_vote_id,
      filter_by_this_google_civic_election_id: google_civic_election_id
    } );
  },

  voterGuideFollowersRetrieve: function (organization_we_vote_id) {
    Dispatcher.loadEndpoint("voterGuideFollowersRetrieve", {
      organization_we_vote_id: organization_we_vote_id,
      maximum_number_to_retrieve: 200
    } );
  },

  voterGuidesIgnoredRetrieve: function () {
    // We do not currently limit the maximum_number_to_retrieve
    Dispatcher.loadEndpoint("voterGuidesIgnoredRetrieve");
  },

  voterGuideSave: function (google_civic_election_id, voter_guide_we_vote_id) {
    Dispatcher.loadEndpoint("voterGuideSave", {
      google_civic_election_id: google_civic_election_id,
      voter_guide_we_vote_id: voter_guide_we_vote_id
    } );
  },

  voterGuidesUpcomingRetrieve: function (google_civic_election_id=0) {
    let maximum_number_to_retrieve = 350; // This needs to match the variable in VoterGuideStore
    let google_civic_election_id_list = [];
    if (google_civic_election_id !== 0) {
      google_civic_election_id_list.push(google_civic_election_id);
    }
    // The CDN only (currently) works without any URL variables. Testing changes.
    Dispatcher.loadEndpoint("voterGuidesUpcomingRetrieve", {
      google_civic_election_id_list: google_civic_election_id_list,
      // maximum_number_to_retrieve: maximum_number_to_retrieve,
    });
  },
};
