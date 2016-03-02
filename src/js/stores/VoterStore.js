const Dispatcher = require("../dispatcher/Dispatcher");
const Immutable = require("immutable");
const FluxReduceStore = require("flux/lib/FluxReduceStore");

const getCookie = require("../utils/cookies").getItem;

class VoterStore extends FluxReduceStore {
  get id () {
    return this.getState().get("id");
  }

  get deviceid () {
    return this.getState().get("deviceid");
  }

  get location () {
    return this.getState().get("location");
  }

  getInitialState () {
    return Immutable.fromJS({
      "id": getCookie("voter_id"),
      "deviceid": getCookie("voter_device_id"),
      "location": getCookie("location")
    });
  }

  reduce (state, action) {
    switch (action.type) {
      case "deviceIdGenerate":
        return state;

      case "error-deviceIdGenerate":
      default:
        return state;
    }
  }

}

module.exports = new VoterStore(Dispatcher);
