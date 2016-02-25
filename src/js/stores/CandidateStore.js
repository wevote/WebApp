import CandidateConstants from "../constants/CandidateConstants";
import { createStore } from "../utils/createStore";
import { shallowClone } from "../utils/object-utils";
const AppDispatcher = require("../dispatcher/AppDispatcher");


const _candidates = {};

function addItemById (id, item) {
  _candidates[id] = shallowClone(item);
}

/**
 * Store for holding all candidate related data
 */
const CandidateStore = createStore({

  /**
   * @param {String} id of candidate to send in the ADDED event
   */
  emitItem: function (id) {
    this.emit("ADDED", _candidates[id]);
  }

});

CandidateStore.dispatchToken = AppDispatcher.register( (action) => {
  switch (action.actionType) {

    case CandidateConstants.CANDIDATE_ADDED:
      addItemById(action.id, action.item);
      CandidateStore.emitItem(action.id);
      break;

    default:
      break;
  }
});

export default CandidateStore;
