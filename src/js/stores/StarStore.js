var Dispatcher = require("../dispatcher/Dispatcher");
var FluxMapStore = require("flux/lib/FluxMapStore");

class StarStore extends FluxMapStore {

  reduce (state, action) {

    if (action.res.success === false){
      console.log(action);
      return state;
    }

    var key = action.res.ballot_item_we_vote_id;

    switch (action.type) {

      case "voterStarStatusRetrieve":
        return state.set(key, action.res.is_starred);

      case "voterStarOnSave":
        return state.set(key, true);

      case "voterStarOffSave":
        return state.set(key, false);

      case "error-StarRetrieve" || "error-voterStarOnSave" || "error-voterStarOnSave":
        console.log(action.res);
        return state;

      default:
        return state;
    }

  }

}

module.exports = new StarStore(Dispatcher);
