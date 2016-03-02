var Dispatcher = require("../dispatcher/Dispatcher");
var FluxMapStore = require("flux/lib/FluxMapStore");

class OfficeStore extends FluxMapStore {

  reduce (state, action) {

    if (action.res.success === false)
      return state;

    switch (action.type) {

      case "officeRetrieve":
        var key = action.res.we_vote_id;
        var office = action.res || {};
        return state.set(key, office);

      case "error-officeRetrieve":
        console.log(action);
        return state;

      default:
        return state;
    }

  }

}

module.exports = new OfficeStore(Dispatcher);
