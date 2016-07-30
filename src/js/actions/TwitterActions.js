import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {
  twitterIdentityRetrieve: function (new_twitter_handle) {
    Dispatcher.loadEndpoint("twitterIdentityRetrieve",
      {
        twitter_handle: new_twitter_handle
      });
  }
};
