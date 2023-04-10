import Dispatcher from '../dispatcher/Dispatcher';

export default {
  officeHeldRetrieve (officeHeldWeVoteId) {
    Dispatcher.loadEndpoint('officeHeldRetrieve',
      {
        office_held_we_vote_id: officeHeldWeVoteId,
      });
  },
};
