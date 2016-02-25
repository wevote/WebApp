import OfficeConstants from "../constants/OfficeConstants";
import { createStore } from "../utils/createStore";
import { shallowClone } from "../utils/object-utils";
const AppDispatcher = require("../dispatcher/AppDispatcher");


const _offices = {};

function addItemById (id, item) {
  _offices[id] = shallowClone(item);
}

/**
 * Store for holding all Office related data
 */
const OfficeStore = createStore({

  /**
   * @param {String} id of office to send in the ADDED event
   */
  emitItem: function (id) {
    this.emit("ADDED", _offices[id]);
  },

  /**
   * @return {Object} Office items hash
   */
  getItems: function () {
    return shallowClone(_offices);
  }

});

OfficeStore.dispatchToken = AppDispatcher.register( (action) => {
  switch (action.actionType) {

    case OfficeConstants.OFFICE_ADDED:
      addItemById(action.id, action.item);
      OfficeStore.emitItem(action.id);
      break;

    default:
      break;
  }
});

export default OfficeStore;
