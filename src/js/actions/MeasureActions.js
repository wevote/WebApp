import Dispatcher from '../common/dispatcher/Dispatcher';

export default {
  measureRetrieve (measureWeVoteId) {
    Dispatcher.loadEndpoint('measureRetrieve',
      {
        measure_we_vote_id: measureWeVoteId,
      });
  },

  positionListForBallotItemPublic (ballotItemWeVoteId) {
    // This API is always retrieved from our CDN per: WebApp/src/js/utils/service.js
    Dispatcher.loadEndpoint('positionListForBallotItem',
      {
        ballot_item_we_vote_id: ballotItemWeVoteId,
        kind_of_ballot_item: 'MEASURE',
      });
  },

  positionListForBallotItemPrivateIndividualsOnly (ballotItemWeVoteId) {
    // This API is always retrieved from our CDN per: WebApp/src/js/utils/service.js
    Dispatcher.loadEndpoint('positionListForBallotItem',
      {
        ballot_item_we_vote_id: ballotItemWeVoteId,
        kind_of_ballot_item: 'MEASURE',
        private_citizens_only: true,
      });
  },

  positionListForBallotItemFromFriends (ballotItemWeVoteId) {
    Dispatcher.loadEndpoint('positionListForBallotItemFromFriends',
      {
        ballot_item_we_vote_id: ballotItemWeVoteId,
        kind_of_ballot_item: 'MEASURE',
      });
  },
};
