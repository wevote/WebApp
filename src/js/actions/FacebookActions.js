import Dispatcher from '../common/dispatcher/Dispatcher';
import { isWebApp } from '../common/utils/isCordovaOrWebApp'; // eslint-disable-line import/no-cycle
import { oAuthLog } from '../common/utils/logging';
import FacebookSignedInData from '../components/Facebook/FacebookSignedInData';
import signInModalGlobalState from '../common/components/Widgets/signInModalGlobalState';
import webAppConfig from '../config';
import FacebookConstants from '../constants/FacebookConstants';
import facebookApi from '../utils/facebookApi';
import FriendActions from './FriendActions'; // eslint-disable-line import/no-cycle
import VoterActions from './VoterActions'; // eslint-disable-line import/no-cycle
import VoterSessionActions from './VoterSessionActions'; // eslint-disable-line import/no-cycle

// Including FacebookStore causes problems in the WebApp, and again in the Native App

/*
For the WebApp, see initFacebook() in Application.jsx
For Cordova in 2022 we switched to a new plugin cordova-plugin-fbsdk
   from https://github.com/MaximBelov/cordova-plugin-fbsdk
*/

export default {
  appLogout () {
    signInModalGlobalState.set('waitingForFacebookApiCompletion', false);
    VoterSessionActions.voterSignOut(); // This deletes the device_id cookie
    // console.log('VoterActions.voterRetrieve() in FacebookActions at l 29');
    VoterActions.voterRetrieve();
    VoterActions.voterEmailAddressRetrieve();
    VoterActions.voterSMSPhoneNumberRetrieve();
  },

  disconnectFromFacebook () {
    // Removing connection between We Vote and Facebook
    FacebookSignedInData.clearFacebookSignedInData();
    Dispatcher.dispatch({
      type: FacebookConstants.FACEBOOK_SIGN_IN_DISCONNECT,
      data: true,
    });
  },

  // December 2022: not called from anywhere
  // facebookDisconnect () {
  //   Dispatcher.loadEndpoint('facebookDisconnect');
  // },

  // Sept 2017, We now use the Facebook "games" api "invitable_friends" data on the fly from the webapp for the "Choose Friends" feature.
  // We use the more limited "friends" api call from the server to find Facebook profiles of friends already using We Vote.
  facebookFriendsAction () {
    Dispatcher.loadEndpoint('facebookFriendsAction', {});
    FriendActions.friendListSuggested();
  },

  getFBDataResponse (response, failure) {
    const failureStr = failure ? 'FAILURE' : '';
    // console logging in this callback at this line does not work, but putting a native log line in FacebookConnectPlugin.m at about line 705 after the "// If we have permissions to request" comment will get you the data
    oAuthLog(`getFacebookData ${failureStr} response`, response);
    Dispatcher.dispatch({
      type: FacebookConstants.FACEBOOK_RECEIVED_DATA,
      data: response,
    });
  },

  // https://developers.facebook.com/docs/graph-api/reference/v2.6/user
  getFacebookData () {
    if (!webAppConfig.ENABLE_FACEBOOK) {
      console.log('FacebookActions.getFacebookData was not invoked, see ENABLE_FACEBOOK in config.js');
      return;
    }
    // console.log('FacebookActions.getFacebookData invocation');
    if (facebookApi()) {
      if (isWebApp()) {
        facebookApi().api('/me?fields=id,email,first_name,middle_name,last_name,cover',
          (response) => this.getFBDataResponse(response, false));
      } else {
        facebookApi().api('/me?fields=id,email,first_name,middle_name,last_name,cover', ['public_profile', 'email'],
          (response) => this.getFBDataResponse(response, false),
          (response) => this.getFBDataResponse(response, true));
      }
    } else {
      console.log('FacebookActions.getFacebookProfilePicture was not invoked, facebookApi() undefined');
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

  // Save incoming data from Facebook 2022 version
  // For offsets, see https://developers.facebook.com/docs/graph-api/reference/cover-photo/
  voterFacebookSignInSave (fbData, doMerge) {
    oAuthLog('FacebookActions voterFacebookSignInSave, fbData:', fbData, doMerge);
    let background = false;
    let offsetX = false;
    let offsetY = false;
    if (fbData.cover && fbData.cover.source) {
      background = fbData.cover.source;
      offsetX = fbData.cover.offset_x;  // zero is a valid value so can't use the short-circuit operation " || false"
      offsetY = fbData.cover.offset_y;  // zero is a valid value so can't use the short-circuit operation " || false"
    }

    Dispatcher.loadEndpoint('voterFacebookSignInSave', {
      facebook_user_id: fbData.id || false,
      facebook_email: fbData.email || false,
      facebook_first_name: fbData.firstName || false,
      facebook_middle_name: fbData.middleName || false,
      facebook_last_name: fbData.lastName || false,
      facebook_profile_image_url_https: fbData.url || false,
      facebook_background_image_url_https: background,
      facebook_background_image_offset_x: offsetX,
      facebook_background_image_offset_y: offsetY,
      save_auth_data: false,
      save_profile_data: true,
      save_photo_data: true,
      duration: fbData.duration,
      merge_two_accounts: fbData.mergeTwoAccounts || false,
    });
  },

  getPictureResponse (response, failure) {
    const failureStr = failure ? 'FAILURE' : '';
    oAuthLog(`getFacebookProfilePicture ${failureStr} response`, response);
    Dispatcher.dispatch({
      type: FacebookConstants.FACEBOOK_RECEIVED_PICTURE,
      data: response,
    });
  },

  getPicture () {
    if (isWebApp()) {
      facebookApi().api('/me?fields=picture.type(large)&redirect=false',
        (response) => this.getPictureResponse(response, false));
    } else {
      facebookApi().api('/me?fields=picture.type(large)&redirect=false', ['public_profile', 'email'],
        (response) => this.getPictureResponse(response, false),
        (response) => this.getPictureResponse(response, true));
    }
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
    if (facebookApi()) {
      this.getPicture();
    } else {
      console.log('FacebookActions.getFacebookProfilePicture was not invoked, facebookApi() undefined');
    }
  },

  getInvitableFriendsListResponse (response, failure) {
    const failureStr = failure ? 'FAILURE' : '';
    oAuthLog('getFacebookInvitableFriendsList ', failureStr, response);
    Dispatcher.dispatch({
      type: FacebookConstants.FACEBOOK_RECEIVED_INVITABLE_FRIENDS,
      data: response,
    });
  },


  getFacebookInvitableFriendsList (pictureWidth, pictureHeight) {
    const pictureWidthVerified = pictureWidth || 50;
    const pictureHeightVerified = pictureHeight || 50;
    if (!webAppConfig.ENABLE_FACEBOOK) {
      console.log('FacebookActions.getFacebookInvitableFriendsList was not invoked, see ENABLE_FACEBOOK in config.js');
      return;
    }

    if (facebookApi()) {
      const fbApiForInvitableFriends = `/me?fields=invitable_friends.limit(1000){name,id,picture.width(${pictureWidthVerified}).height(${pictureHeightVerified})`;
      if (isWebApp()) {
        facebookApi().api(fbApiForInvitableFriends,
          (response) => this.getInvitableFriendsListResponse(response, false));
      } else {
        facebookApi().api(fbApiForInvitableFriends, ['public_profile', 'email'],
          (response) => this.getInvitableFriendsListResponse(response, false),
          (response) => this.getInvitableFriendsListResponse(response, true));
      }
    } else {
      console.log('FacebookActions.getFacebookInvitableFriendsList was not invoked, facebookApi() undefined');
    }
  },

  readFBAppRequestsResponse (response, failure) {
    const failureStr = failure ? 'FAILURE' : '';
    oAuthLog('readFacebookAppRequests ', failureStr, response);
    Dispatcher.dispatch({
      type: FacebookConstants.FACEBOOK_READ_APP_REQUESTS,
      data: response,
    });
  },

  readFacebookAppRequests () {
    if (!webAppConfig.ENABLE_FACEBOOK) {
      console.log('FacebookActions.readFacebookAppRequests was not invoked, see ENABLE_FACEBOOK in config.js');
      return;
    }

    if (facebookApi()) {
      const fbApiForReadingAppRequests = 'me?fields=apprequests.limit(10){from,to,created_time,id}';
      if (isWebApp()) {
        facebookApi().api(
          fbApiForReadingAppRequests,
          (response) => this.readFBAppRequestsResponse(response, false),
        );
      } else {
        facebookApi().api(
          fbApiForReadingAppRequests, ['public_profile', 'email'],
          (response) => this.readFBAppRequestsResponse(response, false),
          (response) => this.readFBAppRequestsResponse(response, true),
        );
      }
    } else {
      console.log('FacebookActions.readFacebookAppRequests was not invoked, facebookApi() undefined');
    }
  },

  deleteFBAppRequestsResponse (response, failure) {
    const failureStr = failure ? 'FAILURE' : '';
    oAuthLog('deleteFacebookAppRequest response', failureStr, response);
    Dispatcher.dispatch({
      type: FacebookConstants.FACEBOOK_DELETE_APP_REQUEST,
      data: response,
    });
  },

  deleteFacebookAppRequest (requestId) {
    if (!webAppConfig.ENABLE_FACEBOOK) {
      console.log('FacebookActions.deleteFacebookAppRequest was not invoked, see ENABLE_FACEBOOK in config.js');
      return;
    }

    if (facebookApi()) {
      console.log('deleteFacebookAppRequest requestId: ', requestId);
      if (isWebApp()) {
        facebookApi().api(requestId, 'delete',
          (response) => this.deleteFBAppRequestsResponse(response, false));
      } else {
        facebookApi().api(requestId, ['public_profile', 'email'], 'delete',
          (response) => this.deleteFBAppRequestsResponse(response, false),
          (response) => this.deleteFBAppRequestsResponse(response, true));
      }
    } else {
      console.log('FacebookActions.deleteFacebookAppRequest was not invoked, facebookApi() undefined');
    }
  },

  logout () {
    if (!webAppConfig.ENABLE_FACEBOOK) {
      console.log('FacebookActions.logout was not invoked, see ENABLE_FACEBOOK in config.js');
      return;
    }

    if (facebookApi()) {
      facebookApi().logout(
        (response) => {
          oAuthLog('FacebookActions logout response: ', response);
          Dispatcher.dispatch({
            type: FacebookConstants.FACEBOOK_LOGGED_OUT,
            data: response,
          });
        },
      );
    } else {
      console.log('FacebookActions.logout was not invoked, facebookApi() undefined');
    }
  },

  loginSuccess (successResponse) {
    signInModalGlobalState.set('waitingForFacebookApiCompletion', false);
    if (successResponse.authResponse) {
      oAuthLog('FacebookActions loginSuccess userData: ', successResponse);
      // const { authResponse: { accessToken } } = successResponse;
      // console.log('FacebookActions loginSuccess accessToken: ', accessToken);
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

  loginResponse (response, innerThis, failure) {
    const failureStr = failure ? 'FAILURE' : '';
    oAuthLog('FacebookActions facebookApi().getLoginStatus() response: ', failureStr, response);
    // dumpObjProps('FacebookActions facebookApi().getLoginStatus() response:', response);
    if (response.status === 'connected') {
      Dispatcher.dispatch({
        type: FacebookConstants.FACEBOOK_LOGGED_IN,
        data: response,
      });
    } else {
      if (isWebApp()) { // eslint-disable-line no-lonely-if
        console.log('Trying again with innerThis values, window.FB.login()');
        window.FB.login(innerThis.loginSuccess, innerThis.loginFailure, innerThis.getPermissions());
      } else {
        console.log('Trying again with innerThis values, window.facebookConnectPlugin.login()');
        window.facebookConnectPlugin.login(innerThis.getPermissions(), innerThis.loginSuccess, innerThis.loginFailure);
      }
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
    // as a result of this call is blocked. A solution to this problem would be to specify status: true in the
    // options object of FB.init and you need to be confident that login status has already loaded.
    oAuthLog('FacebookActions facebookApi().login');
    if (facebookApi()) {
      const innerThis = this;
      try {
        // console.log('FacebookActions facebookApi().getLoginStatus()');
        if (isWebApp()) {
          facebookApi().getLoginStatus(
            (response) => this.loginResponse(response, innerThis, false),
          );
        } else {
          facebookApi().getLoginStatus(true,
            (response) => this.loginResponse(response, innerThis, false),
            (response) => this.loginResponse(response, innerThis, true));
        }
      } catch (error) {
        console.log('FacebookActions.login() try/catch error: ', error);
      }
    } else {
      console.log('FacebookActions.login was not invoked, facebookApi() undefined');
    }
  },

  // Save incoming auth data from Facebook
  saveFacebookSignInAuth (data) {
    // console.log('saveFacebookSignInAuth voterFacebookSignInSave, data:', data);
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
