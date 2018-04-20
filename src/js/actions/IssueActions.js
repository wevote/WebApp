import Dispatcher from "../dispatcher/Dispatcher";

export default {

  retrieveIssuesToFollow: function () {
    Dispatcher.loadEndpoint("retrieveIssuesToFollow");
  },

  issuesRetrieve: function () {
    Dispatcher.loadEndpoint("issuesRetrieve", {
      include_voter_follow_status: true,
      voter_issues_only: false,
    });
  },

  issuesRetrieveForElection: function (google_civic_election_id, ballot_location_shortcut = "", ballot_returned_we_vote_id = "") {
    Dispatcher.loadEndpoint("issuesRetrieve", {
      ballot_location_shortcut: ballot_location_shortcut,
      ballot_returned_we_vote_id: ballot_returned_we_vote_id,
      google_civic_election_id: google_civic_election_id,
      include_voter_follow_status: true,
      voter_issues_only: false,
    });
  },

  issueFollow: function (issue_we_vote_id, google_civic_election_id = 0) {
    Dispatcher.loadEndpoint("issueFollow", {
      issue_we_vote_id: issue_we_vote_id,
      google_civic_election_id: google_civic_election_id,
      follow: true,
      ignore: false
    });
  },

  issueStopFollowing: function (issue_we_vote_id, google_civic_election_id = 0) {
    Dispatcher.loadEndpoint("issueFollow", {
      issue_we_vote_id: issue_we_vote_id,
      google_civic_election_id: google_civic_election_id,
      follow: false,
      ignore: false
    });
  },

  issueLinkForOrganization: function (organization_we_vote_id, issue_we_vote_id) {
    Dispatcher.loadEndpoint("organizationLinkToIssue",
      {
        organization_we_vote_id: organization_we_vote_id,
        issue_we_vote_id: issue_we_vote_id,
        organization_linked_to_issue: true,
      });
  },

  issueUnLinkForOrganization: function (organization_we_vote_id, issue_we_vote_id) {
    Dispatcher.loadEndpoint("organizationLinkToIssue",
      {
        organization_we_vote_id: organization_we_vote_id,
        issue_we_vote_id: issue_we_vote_id,
        organization_linked_to_issue: false,
      });
  },

  removeBallotItemIssueScoreFromCache: (ballot_item_we_vote_id) => {
    Dispatcher.dispatch({
      type: "removeBallotItemIssueScoreFromCache",
      res: {
        ballot_item_we_vote_id: ballot_item_we_vote_id,
        success: true
      }
    });
  },

  retrieveIssuesToLinkForOrganization: function (organization_we_vote_id) {
    Dispatcher.loadEndpoint("issuesToLinkToForOrganization", {organization_we_vote_id: organization_we_vote_id});
  },

  retrieveIssuesLinkedForOrganization: function (organization_we_vote_id) {
    Dispatcher.loadEndpoint("issuesLinkedToOrganization", {organization_we_vote_id: organization_we_vote_id});
  },
};
