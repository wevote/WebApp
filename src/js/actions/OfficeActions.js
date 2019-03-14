import Dispatcher from '../dispatcher/Dispatcher';

export default {
  officeRetrieve (officeWeVoteId) {
    Dispatcher.loadEndpoint('officeRetrieve',
      {
        office_we_vote_id: officeWeVoteId,
      });
  },

  positionListForBallotItem (officeWeVoteId) {
    Dispatcher.loadEndpoint('positionListForBallotItem',
      {
        ballot_item_we_vote_id: officeWeVoteId,
        kind_of_ballot_item: 'OFFICE',
      });
  },
};
