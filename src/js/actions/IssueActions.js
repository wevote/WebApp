import Dispatcher from '../common/dispatcher/Dispatcher';
import Cookies from '../common/utils/js-cookie/Cookies';

let uniqueKeyIssuesDescriptionRetrieve = '';
let uniqueKeyIssuesFollowedRetrieve = '';

export default {
  issueDescriptionsRetrieve (voterWeVoteId) {
    /*
    April 2021: We were firing off issueDescriptionsRetrieve four times upon loading the Ready page.
    As of today we are calling this API in 19 places in the code, including two from within stores.
    Calling Actions from Stores is highly discouraged, it just makes a tangle that is tons of work
    to fix at a later time.
    Rather than untangle the reason for all those API calls, we now save the current voterWeVoteID, and
    ignore the call if that ID has not changed.  If we really want to call this more than once for the same
    login, just pass in a unique string, like a timestamp, and the api will fire.
    */
    const uniqueKey = voterWeVoteId && voterWeVoteId.length ? voterWeVoteId : Cookies.get('voter_device_id');
    if (uniqueKey !== uniqueKeyIssuesDescriptionRetrieve) {
      uniqueKeyIssuesDescriptionRetrieve = uniqueKey;
      Dispatcher.loadEndpoint('issueDescriptionsRetrieve', {});
    }
  },

  issueDescriptionsRetrieveCalled () {
    Dispatcher.dispatch({ type: 'issueDescriptionsRetrieveCalled', payload: true });
  },

  issuesUnderBallotItemsRetrieveCalled (googleCivicElectionId) {
    Dispatcher.dispatch({ type: 'issuesUnderBallotItemsRetrieveCalled', payload: googleCivicElectionId });
  },

  issuesFollowedRetrieve (voterWeVoteId) {
    /*
    April 2021: We were firing off issuesFollowedRetrieve five times upon loading the Ready page.
    Part of the problem was that we had copied similar classes without thinking through exactly
    how often we actually needed to call this API.  API calls are expensive and precious, especially
    if they are called on the first page load -- that is how the Google Lighthouse measures performance.
    As of today we are calling this API in 19 places in the code, including two from within stores.
    Calling Actions from Stores is highly discouraged, it just makes a tangle that is tons of work
    to fix at a later time.
    Rather than untangle the reason for all those API calls, we now save the current voterWeVoteID, and
    ignore the call if that ID has not changed.  If we really want to call this more than once for the same
    login, just pass in a unique string, like a timestamp, and the api will fire.
    */
    const uniqueKey = voterWeVoteId.length ? voterWeVoteId : Cookies.get('voter_device_id');
    if (uniqueKey !== uniqueKeyIssuesFollowedRetrieve) {
      uniqueKeyIssuesFollowedRetrieve = uniqueKey;
      Dispatcher.loadEndpoint('issuesFollowedRetrieve', {});
    }
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
