const dispatcher = require('dispatcher/AppDispatcher');
const CandidateConstants = require('constants/CandidateConstants');

const CandidateActions = {
  support: function (id) {
    dispatcher.dispatch({
      actionType: CandidateConstants.CANDIDATE_SUPPORTED,
      id: id
    });
  },

  oppose: function (id) {
    dispatcher.dispatch({
      actionType: CandidateConstants.CANDIDATE_OPPOSED,
      id: id
    })
  }
}

export default CandidateActions;
