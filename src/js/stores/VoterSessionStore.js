import { ReduceStore } from "flux/utils";
import Dispatcher from "../dispatcher/Dispatcher";
// import VoterActions from "../actions/VoterActions";

class VoterSessionStore extends ReduceStore {
  getInitialState () {
    return {
    };
  }

  reduce (state, action) { // eslint-disable-line
    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success) {
      console.log("VoterSessionStore, problem with action.res or action.res.success. action: ", action);
      return state;
    }

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
