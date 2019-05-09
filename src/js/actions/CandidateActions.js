import Dispatcher from '../dispatcher/Dispatcher';

export default {
  candidateRetrieve (candidateWeVoteId) {
    Dispatcher.loadEndpoint('candidateRetrieve',
      {
        candidate_we_vote_id: candidateWeVoteId,
      });
  },

  candidatesRetrieve (officeWeVoteId) {
    Dispatcher.loadEndpoint('candidatesRetrieve',
      {
        office_we_vote_id: officeWeVoteId,
      });
  },

  positionListForBallotItemPublic (ballotItemWeVoteId) {
    // This API is always retrieved from our CDN per: WebApp/src/js/utils/service.js
    Dispatcher.loadEndpoint('positionListForBallotItem',
      {
        ballot_item_we_vote_id: ballotItemWeVoteId,
        kind_of_ballot_item: 'CANDIDATE',
      });
  },

  positionListForBallotItemPrivateIndividualsOnly (ballotItemWeVoteId) {
    // This API is always retrieved from our CDN per: WebApp/src/js/utils/service.js
    Dispatcher.loadEndpoint('positionListForBallotItem',
      {
        ballot_item_we_vote_id: ballotItemWeVoteId,
        kind_of_ballot_item: 'CANDIDATE',
        private_citizens_only: true,
      });
  },

  positionListForBallotItemForVoter (ballotItemWeVoteId) {
    Dispatcher.loadEndpoint('positionListForBallotItemForVoter',
      {
        ballot_item_we_vote_id: ballotItemWeVoteId,
        kind_of_ballot_item: 'CANDIDATE',
      });
  },
};
