import MeasureConstants from "../constants/MeasureConstants";
import { createStore } from "../utils/createStore";
import { shallowClone } from "../utils/object-utils";
const AppDispatcher = require("../dispatcher/AppDispatcher");


const _measures = {};

function addItemById (id, item) {
  _measures[id] = shallowClone(item);
}

const MeasureStore = createStore({});

MeasureStore.dispatchToken = AppDispatcher.register( (action) => {
  switch (action.actionType) {

    case MeasureConstants.OFFICE_ADDED:
      addItemById(action.id, action.item);
      MeasureStore.emitChange();
      break;

    default:
      break;
  }
});

export default MeasureStore;
