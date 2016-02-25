import MeasureConstants from "../constants/MeasureConstants";
const AppDispatcher = require("../dispatcher/AppDispatcher");


const MeasureActions = {
  /**
   * @param {String} id we_vote_id of ballot item
   * @param {Object} item ballot item as javascript object
   */
  addItemById: function (id, item) {
    AppDispatcher.dispatch({
      actionType: MeasureConstants.MEASURE_ADDED, id, item
    });
  }
};

export default MeasureActions;
