var Dispatcher = require("../dispatcher/Dispatcher");
var CandidateStore = require("../stores/CandidateStore");
var OfficeActions = require("../actions/OfficeActions");
var FluxMapStore = require("flux/lib/FluxMapStore");
const assign = require("object-assign");

class OfficeStore extends FluxMapStore {

  reduce (state, action) {

    if (action.res.success === false)
      return state;

    switch (action.type) {

      case "officeRetrieve":
        var key = action.res.we_vote_id;
        var office = action.res || {};
        this.__we_vote_id = key;
        return state.set(key, office);

      case "error-officeRetrieve":
        console.log(action);
        return;
        
      default:
        return state;
    }

  }

}

module.exports = new OfficeStore(Dispatcher);
