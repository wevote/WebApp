import CandidateConstants from "../constants/CandidateConstants";
const AppDispatcher = require("../dispatcher/AppDispatcher");


const CandidateActions = {

  /**
   * @param {String} id we_vote_id of candidate to add to the store
   * @param {Object} item candidate as plain javascript object
   */
  addItemById: function (id, item) {
    AppDispatcher.dispatch({
      actionType: CandidateConstants.CANDIDATE_ADDED, id, item
    });

  }
};

export default CandidateActions;
