var Dispatcher = require("../dispatcher/Dispatcher");
var FluxMapStore = require("flux/lib/FluxMapStore");

class PositionStore extends FluxMapStore {

  reduce (state, action) {

    if (action.res.success === false)
      return state;

    switch (action.type) {
      case "posiitonListForBallotItem":
        console.log('positionList in positionStore', action.res);
        return res;

      case "error-positionRetrieve":
        console.log(action);
        return;
        
      default:
        return state;
    }

  }

}

module.exports = new PositionStore(Dispatcher);
