import Dispatcher from "../dispatcher/Dispatcher";

export default {
  retrieveIssuesToFollow () {
    Dispatcher.loadEndpoint("retrieveIssuesToFollow");
  },

  issuesRetrieve () {
    Dispatcher.loadEndpoint("issuesRetrieve", {
      include_voter_follow_status: true,
      voter_issues_only: false,
    });
  },

  // June 15, 2018:  There is no functional difference in the JSON retured with this API, than with issuesRetrieve, and before today's change, we called the two API's 11 times
  // in 3 seconds when navigating between Ballot and Candidate (and each time receiving the exact same return)
  issuesRetrieveForElection (google_civic_election_id, ballot_location_shortcut = "", ballot_returned_we_vote_id = "") {
    Dispatcher.loadEndpoint("issuesRetrieve", {
      ballot_location_shortcut,
      ballot_returned_we_vote_id,
      google_civic_election_id,
      include_voter_follow_status: true,
      voter_issues_only: false,
    });
  },

  issueFollow (issue_we_vote_id, google_civic_election_id = 0) {
    Dispatcher.loadEndpoint("issueFollow", {
      issue_we_vote_id,
      google_civic_election_id,
      follow: true,
      ignore: false,
    });
  },

  issueStopFollowing (issue_we_vote_id, google_civic_election_id = 0) {
    Dispatcher.loadEndpoint("issueFollow", {
      issue_we_vote_id,
      google_civic_election_id,
      follow: false,
      ignore: false,
    });
  },

  issueLinkForOrganization (organization_we_vote_id, issue_we_vote_id) {
    Dispatcher.loadEndpoint("organizationLinkToIssue",
      {
        organization_we_vote_id,
        issue_we_vote_id,
        organization_linked_to_issue: true,
      });
  },

  issueUnLinkForOrganization (organization_we_vote_id, issue_we_vote_id) {
    Dispatcher.loadEndpoint("organizationLinkToIssue",
      {
        organization_we_vote_id,
        issue_we_vote_id,
        organization_linked_to_issue: false,
      });
  },

  removeBallotItemIssueScoreFromCache: (ballot_item_we_vote_id) => {
    Dispatcher.dispatch({
      type: "removeBallotItemIssueScoreFromCache",
      res: {
        ballot_item_we_vote_id,
        success: true,
      },
    });
  },

  retrieveIssuesToLinkForOrganization (organization_we_vote_id) {
    Dispatcher.loadEndpoint("issuesToLinkToForOrganization", { organization_we_vote_id });
  },

  retrieveIssuesLinkedForOrganization (organization_we_vote_id) {
    Dispatcher.loadEndpoint("issuesLinkedToOrganization", { organization_we_vote_id });
  },
};
