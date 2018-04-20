import { ReduceStore } from "flux/utils";
import Dispatcher from "../dispatcher/Dispatcher";
// import VoterActions from "../actions/VoterActions";

class VoterSessionStore extends ReduceStore {
  getInitialState () {
    return {
    };
  }

  reduce (state, action) {
    switch (action.type) {
      // case "voterSignOut":
      //   console.log("VoterSessionStore, response from voterSignOut");  // TODO DALE Why isn't this firing? See "voterSignOut" in VoterStore instead
      //   VoterActions.voterRetrieve();
      //   return {
      //     authData: {},
      //     pictureData: {},
      //     emailData: {},
      //   };

      default:
        return state;
    }
  }
}

export default new VoterSessionStore(Dispatcher);
