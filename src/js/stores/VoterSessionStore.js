import Dispatcher from "../dispatcher/Dispatcher";
var FluxMapStore = require("flux/lib/FluxMapStore");
import VoterActions from "../actions/VoterActions";

class VoterSessionStore extends FluxMapStore {
  getInitialState (){
    return {
    };
  }

  reduce (state, action) {
    switch (action.type) {
      case "voterSignOut":
        console.log("VoterSessionStore, response from voterSignOut");  // TODO DALE Why isn't this firing? See "voterSignOut" in VoterStore instead
        VoterActions.voterRetrieve();
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

module.exports = new VoterSessionStore(Dispatcher);
