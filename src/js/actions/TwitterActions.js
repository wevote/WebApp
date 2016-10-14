const cookies = require("../utils/cookies");
import Dispatcher from "../dispatcher/Dispatcher";
import VoterActions from "../actions/VoterActions";
import VoterSessionActions from "../actions/VoterSessionActions";

module.exports = {
  // TODO Convert this to sign out of just Twitter
  appLogout: function (){
    VoterSessionActions.voterSignOut();
    VoterActions.voterRetrieve();
  },

  twitterIdentityRetrieve: function (new_twitter_handle) {
    Dispatcher.loadEndpoint("twitterIdentityRetrieve",
      {
        twitter_handle: new_twitter_handle
      });
  }
};
