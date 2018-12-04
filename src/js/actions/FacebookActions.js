import { isWebApp } from "../utils/cordovaUtils";
import Dispatcher from "../dispatcher/Dispatcher";
import FacebookConstants from "../constants/FacebookConstants";
import FriendActions from "./FriendActions";
import { oAuthLog } from "../utils/logging";
import VoterActions from "./VoterActions";
import VoterSessionActions from "./VoterSessionActions";
import webAppConfig from "../config";

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
    VoterSessionActions.voterSignOut(); // This deletes the device_id cookie
    VoterActions.voterRetrieve();
    VoterActions.voterEmailAddressRetrieve();
  },

  disconnectFromFacebook () {
    // Removing connection between We Vote and Facebook
    Dispatcher.dispatch({
      type: FacebookConstants.FACEBOOK_SIGN_IN_DISCONNECT,
      data: true,
    });
  },

  facebookDisconnect () {
    Dispatcher.loadEndpoint("facebookDisconnect");
  },

  // Sept 2017, We now use the Facebook "games" api "invitable_friends" data on the fly from the webapp for the "Choose Friends" feature.
  // We use the more limited "friends" api call from the server to find Facebook profiles of friends already using We Vote.
  facebookFriendsAction () {
    Dispatcher.loadEndpoint("facebookFriendsAction", {});
    FriendActions.suggestedFriendList();
  },

  // https://developers.facebook.com/docs/graph-api/reference/v2.6/user
  getFacebookData () {
    if (!webAppConfig.ENABLE_FACEBOOK) {
      console.log("FacebookActions.getFacebookData was not invoked, see ENABLE_FACEBOOK in config.js");
      return;
    }

    this.facebookApi().api(
      "/me?fields=id,email,first_name,middle_name,last_name,cover", (response) => {
        oAuthLog("getFacebookData response", response);
        Dispatcher.dispatch({
          type: FacebookConstants.FACEBOOK_RECEIVED_DATA,
          data: response,
        });
      },
    );
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

    Dispatcher.loadEndpoint("voterFacebookSignInSave", {
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

  getFacebookProfilePicture () {
    if (!webAppConfig.ENABLE_FACEBOOK) {
      console.log("FacebookActions.getFacebookProfilePicture was not invoked, see ENABLE_FACEBOOK in config.js");
      return;
    }

    if (this.facebookApi()) {
      this.facebookApi().api(
        "/me?fields=picture.type(large)", ["public_profile", "email"],
        (response) => {
          oAuthLog("getFacebookProfilePicture response", response);
          Dispatcher.dispatch({
            type: FacebookConstants.FACEBOOK_RECEIVED_PICTURE,
            data: response,
          });
        },
      );
    }
  },

  getFacebookInvitableFriendsList (pictureWidth, pictureHeight) {
    if (!webAppConfig.ENABLE_FACEBOOK) {
      console.log("FacebookActions.getFacebookInvitableFriendsList was not invoked, see ENABLE_FACEBOOK in config.js");
      return;
    }

    const fbApiForInvitableFriends = `/me?fields=invitable_friends.limit(1000){name,id,picture.width(${pictureWidth}).height(${pictureHeight})}`;
    this.facebookApi().api(
      fbApiForInvitableFriends,
      (response) => {
        oAuthLog("getFacebookInvitableFriendsList", response);
        Dispatcher.dispatch({
          type: FacebookConstants.FACEBOOK_RECEIVED_INVITABLE_FRIENDS,
          data: response,
        });
      },
    );
  },

  readFacebookAppRequests () {
    if (!webAppConfig.ENABLE_FACEBOOK) {
      console.log("FacebookActions.readFacebookAppRequests was not invoked, see ENABLE_FACEBOOK in config.js");
      return;
    }

    const fbApiForReadingAppRequests = "me?fields=apprequests.limit(10){from,to,created_time,id}";
    this.facebookApi().api(
      fbApiForReadingAppRequests,
      (response) => {
        oAuthLog("readFacebookAppRequests", response);
        Dispatcher.dispatch({
          type: FacebookConstants.FACEBOOK_READ_APP_REQUESTS,
          data: response,
        });
      },
    );
  },

  deleteFacebookAppRequest (requestId) {
    if (!webAppConfig.ENABLE_FACEBOOK) {
      console.log("FacebookActions.deleteFacebookAppRequest was not invoked, see ENABLE_FACEBOOK in config.js");
      return;
    }

    console.log("deleteFacebookAppRequest requestId: ", requestId);
    this.facebookApi().api(
      requestId,
      "delete",
      (response) => {
        oAuthLog("deleteFacebookAppRequest response", response);
        Dispatcher.dispatch({
          type: FacebookConstants.FACEBOOK_DELETE_APP_REQUEST,
          data: response,
        });
      },
    );
  },

  logout () {
    if (!webAppConfig.ENABLE_FACEBOOK) {
      console.log("FacebookActions.logout was not invoked, see ENABLE_FACEBOOK in config.js");
      return;
    }

    this.facebookApi().logout(
      (response) => {
        oAuthLog("FacebookActions logout response: ", response);
        Dispatcher.dispatch({
          type: FacebookConstants.FACEBOOK_LOGGED_OUT,
          data: response,
        });
      },
    );
  },

  loginSuccess (successResponse) {
    if (successResponse.authResponse) {
      oAuthLog("FacebookActions loginSuccess userData: ", successResponse);
      Dispatcher.dispatch({
        type: FacebookConstants.FACEBOOK_LOGGED_IN,
        data: successResponse,
      });
    } else {
      // Check if successResponse.authResponse is null indicating cancelled login attempt
      oAuthLog("FacebookActions null authResponse indicating cancelled login attempt: ", successResponse);
    }
  },

  loginFailure (errorResponse) {
    oAuthLog("FacebookActions loginFailure error response: ", errorResponse);
  },

  getPermissions () {
    if (isWebApp()) {
      return {
        scope: "public_profile, email, user_friends",
      };
    } else {
      return ["public_profile", "email", "user_friends"];
    }
  },

  // November 2018: To debug login from Cordova, you may have to switch from our main facebook id,
  // to the test environment id, which allows http connections.

  login () {
    if (!webAppConfig.FACEBOOK_APP_ID) {
      console.log("ERROR: Missing FACEBOOK_APP_ID from src/js/config.js"); // DO NOT REMOVE THIS!
    }

    if (!webAppConfig.ENABLE_FACEBOOK) {
      console.log("FacebookActions.login was not invoked, see ENABLE_FACEBOOK in config.js"); // DO NOT REMOVE THIS!
      return;
    }

    // FB.getLoginStatus does an ajax call and when you call FB.login on it's response, the popup that would open
    // as a result of this call is blocked. A solution to this problem would be to to specify status: true in the
    // options object of FB.init and you need to be confident that login status has already loaded.
    oAuthLog("this.facebookApi().login");

    if (this.facebookApi()) {
      const innerThis = this;
      this.facebookApi().getLoginStatus(
        (response) => {
          if (response.status === "connected") {
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
    }
  },

  // July 2017: Not called from anywhere
  savePhoto (url) {
    Dispatcher.loadEndpoint("voterPhotoSave", { facebook_profile_image_url_https: url });
  },

  // Save incoming auth data from Facebook
  voterFacebookSignInAuth (data) {
    // console.log("FacebookActions voterFacebookSignInAuth");
    Dispatcher.loadEndpoint("voterFacebookSignInSave", {
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
      Dispatcher.loadEndpoint("voterFacebookSignInSave", {
        facebook_user_id: facebookUserId || false,
        facebook_profile_image_url_https: data.url || false,
        save_photo_data: true,
      });
    }
  },

  voterFacebookSignInRetrieve () {
    Dispatcher.loadEndpoint("voterFacebookSignInRetrieve", {
    });
  },

  voterFacebookSignInConfirm () {
    Dispatcher.loadEndpoint("voterFacebookSignInRetrieve", {
    });
  },
};
