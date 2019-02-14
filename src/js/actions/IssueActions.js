import Dispatcher from '../dispatcher/Dispatcher';

export default {
  retrieveIssuesToFollow () {
    Dispatcher.loadEndpoint('retrieveIssuesToFollow');
  },

  issuesRetrieve () {
    Dispatcher.loadEndpoint('issuesRetrieve', {
      include_voter_follow_status: true,
      voter_issues_only: false,
    });
  },

  // June 15, 2018:  There is no functional difference in the JSON retured with this API, than with issuesRetrieve, and before today's change, we called the two API's 11 times
  // in 3 seconds when navigating between Ballot and Candidate (and each time receiving the exact same return)
  issuesRetrieveForElection (googleCivicElectionId, ballot_location_shortcut = '', ballot_returned_we_vote_id = '') {
    Dispatcher.loadEndpoint('issuesRetrieve', {
      ballot_location_shortcut,
      ballot_returned_we_vote_id,
      google_civic_election_id: googleCivicElectionId,
      include_voter_follow_status: true,
      voter_issues_only: false,
    });
  },

  issueFollow (issueWeVoteId, googleCivicElectionId = 0) {
    Dispatcher.loadEndpoint('issueFollow', {
      issue_we_vote_id: issueWeVoteId,
      google_civic_election_id: googleCivicElectionId,
      follow: true,
      ignore: false,
    });
  },

  issueStopFollowing (issueWeVoteId, googleCivicElectionId = 0) {
    Dispatcher.loadEndpoint('issueFollow', {
      issue_we_vote_id: issueWeVoteId,
      google_civic_election_id: googleCivicElectionId,
      follow: false,
      ignore: false,
    });
  },

  issueLinkForOrganization (organizationWeVoteId, issueWeVoteId) {
    Dispatcher.loadEndpoint('organizationLinkToIssue',
      {
        organization_we_vote_id: organizationWeVoteId,
        issue_we_vote_id: issueWeVoteId,
        organization_linked_to_issue: true,
      });
  },

  issueUnLinkForOrganization (organizationWeVoteId, issueWeVoteId) {
    Dispatcher.loadEndpoint('organizationLinkToIssue',
      {
        organization_we_vote_id: organizationWeVoteId,
        issue_we_vote_id: issueWeVoteId,
        organization_linked_to_issue: false,
      });
  },

  removeBallotItemIssueScoreFromCache: (ballotItemWeVoteId) => {
    Dispatcher.dispatch({
      type: 'removeBallotItemIssueScoreFromCache',
      res: {
        ballot_item_we_vote_id: ballotItemWeVoteId,
        success: true,
      },
    });
  },

  retrieveIssuesToLinkForOrganization (organizationWeVoteId) {
    Dispatcher.loadEndpoint('issuesToLinkToForOrganization',
      {
        organization_we_vote_id: organizationWeVoteId,
      });
  },

  retrieveIssuesLinkedForOrganization (organizationWeVoteId) {
    Dispatcher.loadEndpoint('issuesLinkedToOrganization',
      {
        organization_we_vote_id: organizationWeVoteId,
      });
  },
};
