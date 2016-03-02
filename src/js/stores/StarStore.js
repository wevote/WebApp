var Dispatcher = require("../dispatcher/Dispatcher");
var FluxMapStore = require("flux/lib/FluxMapStore");
const assign = require("object-assign");

class StarStore extends FluxMapStore {

  reduce (state, action) {

    if (action.res.success === false)
      return state;

    switch (action.type) {

      case "voterStarStatusRetrieve":
        // var key = action.res.we_vote_id;
        var key = 'wv02cand3'; //HARDCODED until API returns we_vote_id
        return state.set(key, action.res.is_starred);

      case "voterStarOnSave":
        // var key = action.res.we_vote_id;
        var key = 'wv02cand3'; //HARDCODED until API returns we_vote_id
        return state.set(key, true);

      case "voterStarOffSave":
        // var key = action.res.we_vote_id;
        var key = 'wv02cand3'; //HARDCODED until API returns we_vote_id
        return state.set(key, false);

      case "error-StarRetrieve":
      default:
        return state;
    }

  }

}

module.exports = new StarStore(Dispatcher);
