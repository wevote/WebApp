import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {

  pledgeToVoteWithVoterGuide: function (voter_guide_we_vote_id, delete_pledge = false) {
    Dispatcher.loadEndpoint("pledgeToVoteWithVoterGuide", {
      voter_guide_we_vote_id: voter_guide_we_vote_id,
      delete_pledge: delete_pledge,
    });
  },

  voterGuidesToFollowRetrieve: function (election_id, search_string, add_voter_guides_not_from_election) {
    Dispatcher.loadEndpoint("voterGuidesToFollowRetrieve", {
      google_civic_election_id: election_id,
      maximum_number_to_retrieve: 150,
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
  }

};
