var FluxMapStore = require("flux/lib/FluxMapStore");
import Dispatcher from "../dispatcher/Dispatcher";
import VoterActions from "../actions/VoterActions";

class FacebookStore extends FluxMapStore {
  getInitialState (){
    return {
    };
  }

  reduce (state, action) {
    switch (action.type) {
      
      case "voterSignOut":
        return {
          authData: {},
          pictureData: {},
          emailData: {}
        };

      default:
        return state;
      }
    }
  }

module.exports = new FacebookStore(Dispatcher);
