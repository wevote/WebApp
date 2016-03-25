import Dispatcher from "../dispatcher/Dispatcher";
import FluxMapStore from "flux/lib/FluxMapStore";
import VoterActions from "../actions/VoterActions";
const cookies = require("../utils/cookies");

class VoterStore extends FluxMapStore {

  getInitialState () {
    return {
      voter: {},
      address: {}
    };
  }

  voter (){
    return this.getState().voter;
  }

  getAddress (){
    return this.getState().address.text_for_map_search;
  }

  voterDeviceId () {
    return this.getState().voter.voter_device_id || cookies.getItem("voter_device_id");
  }

  setVoterDeviceIdCookie (id){
    cookies.setItem("voter_device_id", id, Infinity);
  }

  reduce (state, action) {

    switch (action.type) {

      case "voterRetrieve":
        let voter_device_id = action.res.voter_device_id;
        this.setVoterDeviceIdCookie(voter_device_id);
        VoterActions.retrieveAddress(voter_device_id);
        let voter = action.res;
        console.log("voter retrieved");
        return {
          ...state,
          voter: voter
      };

      case "voterAddressRetrieve":
        return {
          ...state,
          address: action.res
      };

      case "voterAddressSave":
        return {
          ...state,
          address: { text_for_map_search: action.res.text_for_map_search}
        };

      case "error-voterRetrieve" || "error-voterAddressRetrieve" || "error-voterAddressSave":
        console.log(action);
        return state;

      default:
        return state;
    }
  }
}

module.exports = new VoterStore(Dispatcher);
