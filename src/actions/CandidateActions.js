const dispatcher = require('dispatcher/AppDispatcher');
const CandidateConstants = require('constants/CandidateConstants');

const CandidateActions = {
  support: function (id) {
    dispatcher.dispatch({
      actionType: CandidateConstants.SUPPORT_CANDIDATE,
      id: id
    });
  },

  oppose: function (id) {
    dispatcher.dispatch({
      actionType: CandidateConstants.OPPOSE_CANDIDATE,
      id: id
    })
  }
}

export default CandidateActions;
