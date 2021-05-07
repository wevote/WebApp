import Dispatcher from '../dispatcher/Dispatcher';

export default {
  issueDescriptionsRetrieve () {
    Dispatcher.loadEndpoint('issueDescriptionsRetrieve', {});
  },

  issueDescriptionsRetrieveCalled () {
    Dispatcher.dispatch({ type: 'issueDescriptionsRetrieveCalled', payload: true });
  },

  issuesUnderBallotItemsRetrieveCalled (googleCivicElectionId) {
    Dispatcher.dispatch({ type: 'issuesUnderBallotItemsRetrieveCalled', payload: googleCivicElectionId });
  },

  issuesFollowedRetrieve () {
    Dispatcher.loadEndpoint('issuesFollowedRetrieve', {});
  },

  issuesUnderBallotItemsRetrieve (googleCivicElectionId, ballot_location_shortcut = '', ballot_returned_we_vote_id = '') {
    Dispatcher.loadEndpoint('issuesUnderBallotItemsRetrieve', {
      ballot_location_shortcut,
      ballot_returned_we_vote_id,
      google_civic_election_id: googleCivicElectionId,
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
