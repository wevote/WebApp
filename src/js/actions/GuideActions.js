import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {
  organizationFollow: function (organization_we_vote_id) {
    Dispatcher.loadEndpoint("organizationFollow", { organization_we_vote_id: organization_we_vote_id} );
  },

  organizationFollowIgnore: function (organization_we_vote_id) {
    Dispatcher.loadEndpoint("organizationFollowIgnore", { organization_we_vote_id: organization_we_vote_id} );
  },

  organizationStopFollowing: function (organization_we_vote_id) {
    Dispatcher.loadEndpoint("organizationStopFollowing", { organization_we_vote_id: organization_we_vote_id} );
  },

  retrieveGuidesToFollow: function (election_id, search_string) {
    Dispatcher.loadEndpoint("voterGuidesToFollowRetrieve", { google_civic_election_id: election_id,
      maximum_number_to_retrieve: 15, search_string: search_string || "" });
  },

  retrieveGuidesToFollowByBallotItem: function (ballot_item_we_vote_id, kind_of_ballot_item) {
    Dispatcher.loadEndpoint("voterGuidesToFollowRetrieve", {
      ballot_item_we_vote_id: ballot_item_we_vote_id, kind_of_ballot_item: kind_of_ballot_item
    });
  },

  voterGuidesFollowedRetrieve: function () {
    Dispatcher.loadEndpoint("voterGuidesFollowedRetrieve");
  }
};
