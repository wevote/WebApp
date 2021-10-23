import Dispatcher from '../common/dispatcher/Dispatcher';
import signInModalGlobalState from '../components/Widgets/signInModalGlobalState';
import webAppConfig from '../config';
import FacebookConstants from '../constants/FacebookConstants';
import { isWebApp } from '../utils/cordovaUtils'; // eslint-disable-line import/no-cycle
import { oAuthLog } from '../utils/logging';
import FriendActions from './FriendActions'; // eslint-disable-line import/no-cycle
import VoterActions from './VoterActions'; // eslint-disable-line import/no-cycle
import VoterSessionActions from './VoterSessionActions'; // eslint-disable-line import/no-cycle

// Including FacebookStore causes problems in the WebApp, and again in the Native App

/*
For the WebApp, see initFacebook() in Application.jsx
For Cordova we rely on the FacebookConnectPlugin4
   from https://www.npmjs.com/package/cordova-plugin-facebook4
this is the "Jeduan" fork from https://github.com/jeduan/cordova-plugin-facebook4
The "Jeduan" fork is forked from the VERY OUT OF DATE https://github.com/Wizcorp/phonegap-facebook-plugin
As of May 2018, the "Wizcorp" fork has not been maintained for 3 years, even though it
displays the (WRONG) note "This is the official plugin for Facebook in Apache Cordova/PhoneGap!"
 */

export default {
  facebookApi () {
    return isWebApp() ? window.FB : window.facebookConnectPlugin; // eslint-disable-line no-undef
  },

  appLogout () {
    signInModalGlobalState.set('waitingForFacebookApiCompletion', false);
    VoterSessionActions.voterSignOut(); // This deletes the device_id cookie
    VoterActions.voterRetrieve();
    VoterActions.voterEmailAddressRetrieve();
    VoterActions.voterSMSPhoneNumberRetrieve();
  },

  disconnectFromFacebook () {
    // Removing connection between We Vote and Facebook
    Dispatcher.dispatch({
      type: FacebookConstants.FACEBOOK_SIGN_IN_DISCONNECT,
      data: true,
    });
  },

  facebookDisconnect () {
    Dispatcher.loadEndpoint('facebookDisconnect');
  },

  // Sept 2017, We now use the Facebook "games" api "invitable_friends" data on the fly from the webapp for the "Choose Friends" feature.
  // We use the more limited "friends" api call from the server to find Facebook profiles of friends already using We Vote.
  facebookFriendsAction () {
    Dispatcher.loadEndpoint('facebookFriendsAction', {});
    FriendActions.suggestedFriendList();
  },

  // https://developers.facebook.com/docs/graph-api/reference/v2.6/user
  getFacebookData () {
    if (!webAppConfig.ENABLE_FACEBOOK) {
      console.log('FacebookActions.getFacebookData was not invoked, see ENABLE_FACEBOOK in config.js');
      return;
    }
    // console.log('FacebookActions.getFacebookData invocation');
    if (this.facebookApi()) {
      this.facebookApi().api(
        '/me?fields=id,email,first_name,middle_name,last_name,cover', (response) => {
          // console.log('FacebookActions.getFacebookData response ', response);
          oAuthLog('getFacebookData response', response);
          Dispatcher.dispatch({
            type: FacebookConstants.FACEBOOK_RECEIVED_DATA,
            data: response,
          });
        },
      );
    } else {
      console.log('FacebookActions.getFacebookProfilePicture was not invoked, this.facebookApi() undefined');
    }
  },

  // Save incoming data from Facebook
  // For offsets, see https://developers.facebook.com/docs/graph-api/reference/cover-photo/
  voterFacebookSignInData (data) {
  /**
   * Save incoming data from Facebook
   * For offsets, see https://developers.facebook.com/docs/graph-api/reference/cover-photo/
   * @param data
   * @param data.cover.offset_x
   * @param data.cover.offset_y
   */
    // console.log("FacebookActions voterFacebookSignInData, data:", data);
    let background = false;
    let offsetX = false;
    let offsetY = false;
    if (data.cover && data.cover.source) {
      background = data.cover.source;
      offsetX = data.cover.offset_x;  // zero is a valid value so can't use the short-circuit operation " || false"
      offsetY = data.cover.offset_y;  // zero is a valid value so can't use the short-circuit operation " || false"
    }

    Dispatcher.loadEndpoint('voterFacebookSignInSave', {
      facebook_user_id: data.id || false,
      facebook_email: data.email || false,
      facebook_first_name: data.first_name || false,
      facebook_middle_name: data.middle_name || false,
      facebook_last_name: data.last_name || false,
      facebook_profile_image_url_https: data.url || false,
      facebook_background_image_url_https: background,
      facebook_background_image_offset_x: offsetX,
      facebook_background_image_offset_y: offsetY,
      save_auth_data: false,
      save_profile_data: true,
    });
  },

  getPicture () {
    this.facebookApi().api(
      '/me?fields=picture.type(large)&redirect=false', ['public_profile', 'email'],
      (response) => {
        oAuthLog('getFacebookProfilePicture response', response);
        Dispatcher.dispatch({
          type: FacebookConstants.FACEBOOK_RECEIVED_PICTURE,
          data: response,
        });
      },
    );
  },

  getFacebookProfilePicture () {
    if (!webAppConfig.ENABLE_FACEBOOK) {
      console.log('FacebookActions.getFacebookProfilePicture was not invoked, see ENABLE_FACEBOOK in config.js');
      return;
    }
    oAuthLog('getFacebookProfilePicture before fields request');

    // Our "signed_in_facebook" field in the postgres database does not mean the user is actually signed in to facebook, it
    // means that at some point in the past, the voter has logged into facebook and they *might* still be logged into facebook,
    // but regardless of whether they are actually logged into facebook at this moment, we consider them "logged in to WeVote"
    // having using facebook auth in the past.  That is ok for our authentication methodology, but if you assume you are really
    // logged into facebook in Cordova, and your're not, you get a distracting login dialog that comes from the facebook native
    // package everytime we refresh the avatar in the header in this function -- so first check if the voter is really logged in.
    if (this.facebookApi()) {
      this.getPicture();
    } else {
      console.log('FacebookActions.getFacebookProfilePicture was not invoked, this.facebookApi() undefined');
    }
  },

  getFacebookInvitableFriendsList (pictureWidth, pictureHeight) {
    const pictureWidthVerified = pictureWidth || 50;
    const pictureHeightVerified = pictureHeight || 50;
    if (!webAppConfig.ENABLE_FACEBOOK) {
      console.log('FacebookActions.getFacebookInvitableFriendsList was not invoked, see ENABLE_FACEBOOK in config.js');
      return;
    }

    if (this.facebookApi()) {
      const fbApiForInvitableFriends = `/me?fields=invitable_friends.limit(1000){name,id,picture.width(${pictureWidthVerified}).height(${pictureHeightVerified})`;
      this.facebookApi().api(
        fbApiForInvitableFriends,
        (response) => {
          oAuthLog('getFacebookInvitableFriendsList', response);
          Dispatcher.dispatch({
            type: FacebookConstants.FACEBOOK_RECEIVED_INVITABLE_FRIENDS,
            data: response,
          });
        },
      );
    } else {
      console.log('FacebookActions.getFacebookInvitableFriendsList was not invoked, this.facebookApi() undefined');
    }
  },

  readFacebookAppRequests () {
    if (!webAppConfig.ENABLE_FACEBOOK) {
      console.log('FacebookActions.readFacebookAppRequests was not invoked, see ENABLE_FACEBOOK in config.js');
      return;
    }

    if (this.facebookApi()) {
      const fbApiForReadingAppRequests = 'me?fields=apprequests.limit(10){from,to,created_time,id}';
      this.facebookApi().api(
        fbApiForReadingAppRequests,
        (response) => {
          oAuthLog('readFacebookAppRequests', response);
          Dispatcher.dispatch({
            type: FacebookConstants.FACEBOOK_READ_APP_REQUESTS,
            data: response,
          });
        },
      );
    } else {
      console.log('FacebookActions.readFacebookAppRequests was not invoked, this.facebookApi() undefined');
    }
  },

  deleteFacebookAppRequest (requestId) {
    if (!webAppConfig.ENABLE_FACEBOOK) {
      console.log('FacebookActions.deleteFacebookAppRequest was not invoked, see ENABLE_FACEBOOK in config.js');
      return;
    }

    if (this.facebookApi()) {
      console.log('deleteFacebookAppRequest requestId: ', requestId);
      this.facebookApi().api(
        requestId,
        'delete',
        (response) => {
          oAuthLog('deleteFacebookAppRequest response', response);
          Dispatcher.dispatch({
            type: FacebookConstants.FACEBOOK_DELETE_APP_REQUEST,
            data: response,
          });
        },
      );
    } else {
      console.log('FacebookActions.deleteFacebookAppRequest was not invoked, this.facebookApi() undefined');
    }
  },

  logout () {
    if (!webAppConfig.ENABLE_FACEBOOK) {
      console.log('FacebookActions.logout was not invoked, see ENABLE_FACEBOOK in config.js');
      return;
    }

    if (this.facebookApi()) {
      this.facebookApi().logout(
        (response) => {
          oAuthLog('FacebookActions logout response: ', response);
          Dispatcher.dispatch({
            type: FacebookConstants.FACEBOOK_LOGGED_OUT,
            data: response,
          });
        },
      );
    } else {
      console.log('FacebookActions.logout was not invoked, this.facebookApi() undefined');
    }
  },

  loginSuccess (successResponse) {
    signInModalGlobalState.set('waitingForFacebookApiCompletion', false);
    if (successResponse.authResponse) {
      oAuthLog('FacebookActions loginSuccess userData: ', successResponse);
      Dispatcher.dispatch({
        type: FacebookConstants.FACEBOOK_LOGGED_IN,
        data: successResponse,
      });
    } else {
      // Check if successResponse.authResponse is null indicating cancelled login attempt
      oAuthLog('FacebookActions null authResponse indicating cancelled login attempt: ', successResponse);
    }
  },

  loginFailure (errorResponse) {
    signInModalGlobalState.set('waitingForFacebookApiCompletion', false);
    oAuthLog('FacebookActions loginFailure error response: ', errorResponse);
  },

  getPermissions () {
    if (isWebApp()) {
      return {
        scope: 'public_profile, email',   // was 'public_profile, email, user_friends', prior to Oct 2020
      };
    } else {
      return ['public_profile', 'email'];  // was ['public_profile', 'email', 'user_friends']; prior to Oct 2020
    }
  },

  login () {
    if (!webAppConfig.FACEBOOK_APP_ID) {
      console.log('ERROR: Missing FACEBOOK_APP_ID from src/js/config.js'); // DO NOT REMOVE THIS!
    }

    if (!webAppConfig.ENABLE_FACEBOOK) {
      console.log('FacebookActions.login was not invoked, see ENABLE_FACEBOOK in config.js'); // DO NOT REMOVE THIS!
      return;
    }

    // FB.getLoginStatus does an ajax call and when you call FB.login on it's response, the popup that would open
    // as a result of this call is blocked. A solution to this problem would be to to specify status: true in the
    // options object of FB.init and you need to be confident that login status has already loaded.
    oAuthLog('FacebookActions this.facebookApi().login');

    if (this.facebookApi()) {
      const innerThis = this;
      this.facebookApi().getLoginStatus(
        (response) => {
          oAuthLog('FacebookActions this.facebookApi().getLoginStatus response: ', response);
          // dumpObjProps('facebookApi().getLoginStatus()', response);
          if (response.status === 'connected') {
            Dispatcher.dispatch({
              type: FacebookConstants.FACEBOOK_LOGGED_IN,
              data: response,
            });
          } else {
            if (isWebApp()) { // eslint-disable-line no-lonely-if
              window.FB.login(innerThis.loginSuccess, innerThis.loginFailure, innerThis.getPermissions());
            } else {
              window.facebookConnectPlugin.login(innerThis.getPermissions(), innerThis.loginSuccess, innerThis.loginFailure);
            }
          }
        },
      );
    } else {
      console.log('FacebookActions.login was not invoked, this.facebookApi() undefined');
    }
  },

  // July 2017: Not called from anywhere
  savePhoto (url) {
    Dispatcher.loadEndpoint('voterPhotoSave', { facebook_profile_image_url_https: url });
  },

  // Save incoming auth data from Facebook
  saveFacebookSignInAuth (data) {
    // console.log('saveFacebookSignInAuth (result of incoming data from the FB API) kicking off an api server voterFacebookSignInSave');
    Dispatcher.loadEndpoint('voterFacebookSignInSave', {
      facebook_access_token: data.accessToken || false,
      facebook_user_id: data.userID || false,
      facebook_expires_in: data.expiresIn || false,
      facebook_signed_request: data.signedRequest || false,
      save_auth_data: true,
      save_profile_data: false,
    });
  },

  voterFacebookSignInPhoto (facebookUserId, data) {
    // console.log("FacebookActions voterFacebookSignInPhoto, data:", data);
    if (data) {
      Dispatcher.loadEndpoint('voterFacebookSignInSave', {
        facebook_user_id: facebookUserId || false,
        facebook_profile_image_url_https: data.url || false,
        save_photo_data: true,
      });
    }
  },

  voterFacebookSignInRetrieve () {
    Dispatcher.loadEndpoint('voterFacebookSignInRetrieve', {
    });
  },

  voterFacebookSignInConfirm () {
    Dispatcher.loadEndpoint('voterFacebookSignInRetrieve', {
    });
  },
};
