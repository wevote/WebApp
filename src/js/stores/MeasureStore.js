// import MeasureConstants from "../constants/MeasureConstants";
// Zach: "not sure what the purpose of MeasureConstants is, no similar constants for candidates"
import { createStore } from "../utils/createStore";
// import { shallowClone } from "../utils/object-utils";
const AppDispatcher = require("../dispatcher/AppDispatcher");

// Zach: "not sure of purpose of addItemById.  appears here and in MeasureActions,
//      but no similar method associated with candidates"

// const _measures = {};

// function addItemById (id, item) {
//   _measures[id] = shallowClone(item);
// }

const MeasureStore = createStore({});

MeasureStore.dispatchToken = AppDispatcher.register( (action) => {
  switch (action.actionType) {

    // case MeasureConstants.OFFICE_ADDED:
    //   addItemById(action.id, action.item);
    //   MeasureStore.emitChange();
    //   break;
    // Zach: "see note above: not sure of purpose of MeasureConstants.  also,
    // not sure why 'OFFICE_ADDED' would be relevant since measures aren't offices"

    default:
      break;
  }
});

export default MeasureStore;
