import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {

  retrieveIssuesToFollow: function () {
    Dispatcher.loadEndpoint("retrieveIssuesToFollow");
  },

  issuesRetrieve: function () {
    Dispatcher.loadEndpoint("issuesRetrieve", {
      include_voter_follow_status: true,
      voter_issues_only: true, 
    });
  },

  issuesRetrieveForElection: function (google_civic_election_id) {
    Dispatcher.loadEndpoint("issuesRetrieve", {
      google_civic_election_id: google_civic_election_id,
      include_voter_follow_status: true,
      voter_issues_only: true, 
    });
  },

  issueFollow: function (issue_we_vote_id ) {
    Dispatcher.loadEndpoint("issueFollow", {issue_we_vote_id: issue_we_vote_id, follow: true, ignore: false} );
  },

  issueStopFollowing: function (issue_we_vote_id) {
    Dispatcher.loadEndpoint("issueFollow", {issue_we_vote_id: issue_we_vote_id, follow: false, ignore: false} );
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

  retrieveIssuesToLinkForOrganization: function (organization_we_vote_id) {
    Dispatcher.loadEndpoint("issuesToLinkToForOrganization", {organization_we_vote_id: organization_we_vote_id});
  },

  retrieveIssuesLinkedForOrganization: function (organization_we_vote_id) {
    Dispatcher.loadEndpoint("issuesLinkedToOrganization", {organization_we_vote_id: organization_we_vote_id});
  },
};
