import Dispatcher from "../dispatcher/Dispatcher";
import VoterActions from "../actions/VoterActions";
import VoterSessionActions from "../actions/VoterSessionActions";

export default {
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
  },

  twitterNativeSignInSave: function (twitter_access_token, twitter_access_token_secret) {
    Dispatcher.loadEndpoint("twitterNativeSignInSave",
      {
        twitter_access_token: twitter_access_token,
        twitter_access_token_secret: twitter_access_token_secret
      });
  },

  twitterSignInRetrieve: function () {
    Dispatcher.loadEndpoint("twitterSignInRetrieve", {
    });
  },

  //
  // twitterSignInStart: function (return_url) {
  //   Dispatcher.loadEndpoint("twitterSignInStart",
  //     {
  //       return_url: return_url
  //     });
  // },

};
