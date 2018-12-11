import Dispatcher from "../dispatcher/Dispatcher";
import VoterActions from "./VoterActions";
import VoterSessionActions from "./VoterSessionActions";

export default {
  // TODO Convert this to sign out of just Twitter
  appLogout () {
    VoterSessionActions.voterSignOut();
    VoterActions.voterRetrieve();
  },

  twitterIdentityRetrieve (new_twitter_handle) {
    Dispatcher.loadEndpoint("twitterIdentityRetrieve",
      {
        twitter_handle: new_twitter_handle,
      });
  },

  twitterNativeSignInSave (twitter_access_token, twitter_access_token_secret) {
    Dispatcher.loadEndpoint("twitterNativeSignInSave",
      {
        twitter_access_token,
        twitter_access_token_secret,
      });
  },

  twitterSignInRetrieve () {
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
