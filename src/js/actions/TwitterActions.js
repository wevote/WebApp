import Dispatcher from '../dispatcher/Dispatcher';
import VoterActions from './VoterActions';
import VoterSessionActions from './VoterSessionActions';

export default {
  // TODO Convert this to sign out of just Twitter
  appLogout () {
    VoterSessionActions.voterSignOut();
    VoterActions.voterRetrieve();
  },

  twitterIdentityRetrieve (newTwitterHandle) {
    Dispatcher.loadEndpoint('twitterIdentityRetrieve',
      {
        twitter_handle: newTwitterHandle,
      });
  },

  twitterNativeSignInSave (twitterAccessToken, twitterAccessTokenSecret) {
    Dispatcher.loadEndpoint('twitterNativeSignInSave',
      {
        twitter_access_token: twitterAccessToken,
        twitter_access_token_secret: twitterAccessTokenSecret,
      });
  },

  twitterSignInRetrieve () {
    Dispatcher.loadEndpoint('twitterSignInRetrieve', {
    });
  },

  twitterSignInStart (returnUrl) {
    Dispatcher.loadEndpoint('twitterSignInStart',
      {
        return_url: returnUrl,
      });
  },

};
