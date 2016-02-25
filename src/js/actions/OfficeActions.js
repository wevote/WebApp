import OfficeConstants from "../constants/OfficeConstants";
const AppDispatcher = require("../dispatcher/AppDispatcher");


const OfficeActions = {
  /**
   * @param {String} id we_vote_id of ballot item
   * @param {Object} item ballot item as javascript object
   */
  addItemById: function (id, item) {
    AppDispatcher.dispatch({
      actionType: OfficeConstants.OFFICE_ADDED, id, item
    });
  }
};

export default OfficeActions;
