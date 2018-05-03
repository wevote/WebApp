import Dispatcher from "../dispatcher/Dispatcher";
import FacebookConstants from "../constants/FacebookConstants";
import FriendActions from "../actions/FriendActions";
import VoterActions from "../actions/VoterActions";
import VoterSessionActions from "../actions/VoterSessionActions";
import webAppConfig from "../config";
// Including FacebookStore causes problems in the WebApp, and again in the Native App


export default {
  appLogout: function (){
    VoterSessionActions.voterSignOut();  // This deletes the device_id cookie
    VoterActions.voterRetrieve();
    VoterActions.voterEmailAddressRetrieve();
  },

  disconnectFromFacebook: function () {
    // Removing connection between We Vote and Facebook
    Dispatcher.dispatch({
      type: FacebookConstants.FACEBOOK_SIGN_IN_DISCONNECT,
      data: true,
    });
  },

  facebookDisconnect: function (){
    Dispatcher.loadEndpoint("facebookDisconnect");
  },

  // Sept 2017, We now use the Facebook "games" api "invitable_friends" data on the fly from the webapp for the "Choose Friends" feature.
  // We use the more limited "friends" api call from the server to find Facebook profiles of friends already using We Vote.
  facebookFriendsAction: function () {
    Dispatcher.loadEndpoint("facebookFriendsAction", {});
    FriendActions.suggestedFriendList();
  },

  // https://developers.facebook.com/docs/graph-api/reference/v2.6/user
  getFacebookData: function (){
    window.FB.api("/me?fields=id,email,first_name,middle_name,last_name,cover", (response) => {
      Dispatcher.dispatch({
        type: FacebookConstants.FACEBOOK_RECEIVED_DATA,
        data: response,
      });
    });
  },

  // Save incoming data from Facebook
  // For offsets, see https://developers.facebook.com/docs/graph-api/reference/cover-photo/
  voterFacebookSignInData: function (data) {
    // console.log("FacebookActions voterFacebookSignInData, data:", data);
    let background = false;
    let offset_x = false;
    let offset_y = false;
    if (data.cover && data.cover.source) {
      background = data.cover.source;
      offset_x = data.cover.offset_x;  // zero is a valid value so can't use the short-circuit operation " || false"
      offset_y = data.cover.offset_y;  // zero is a valid value so can't use the short-circuit operation " || false"
    }

    Dispatcher.loadEndpoint("voterFacebookSignInSave", {
      facebook_user_id: data.id || false,
      facebook_email: data.email || false,
      facebook_first_name: data.first_name || false,
      facebook_middle_name: data.middle_name || false,
      facebook_last_name: data.last_name || false,
      facebook_profile_image_url_https: data.url || false,
      facebook_background_image_url_https: background,
      facebook_background_image_offset_x: offset_x,
      facebook_background_image_offset_y: offset_y,
      save_auth_data: false,
      save_profile_data: true,
    });
  },

  getFacebookProfilePicture: function (userId) {
    if (window.FB) {
      window.FB.api(
        '/me?fields=picture.type(large)', 'GET', {},
        function(response) {
          Dispatcher.dispatch({
            type: FacebookConstants.FACEBOOK_RECEIVED_PICTURE,
            data: response,
          });
        });
    }
  },

  getFacebookInvitableFriendsList: function (picture_width, picture_height) {
    let fb_api_for_invitable_friends = `/me?fields=invitable_friends.limit(1000){name,id,picture.width(${picture_width}).height(${picture_height})}`;
    window.FB.api(fb_api_for_invitable_friends, (response) => {
      // console.log("getFacebookInvitableFriendsList", response);
      Dispatcher.dispatch({
        type: FacebookConstants.FACEBOOK_RECEIVED_INVITABLE_FRIENDS,
        data: response,
      });
    });
  },

  readFacebookAppRequests: function () {
    let fb_api_for_reading_app_requests = "me?fields=apprequests.limit(10){from,to,created_time,id}";
    window.FB.api(fb_api_for_reading_app_requests, (response) => {
      console.log("readFacebookAppRequests", response);
      Dispatcher.dispatch({
        type: FacebookConstants.FACEBOOK_READ_APP_REQUESTS,
        data: response,
      });
    });
  },

  deleteFacebookAppRequest: function (requestId) {
    console.log("deleteFacebookAppRequest requestId: ", requestId);
    window.FB.api(requestId, "delete", (response) => {
      console.log("deleteFacebookAppRequest response", response);
      Dispatcher.dispatch({
        type: FacebookConstants.FACEBOOK_DELETE_APP_REQUEST,
        data: response,
      });
    });
  },

  login: function () {
    if (!webAppConfig.FACEBOOK_APP_ID) {
      console.log("Missing FACEBOOK_APP_ID from src/js/config.js");
    }
    // FB.getLoginStatus does an ajax call and when you call FB.login on it's response, the popup that would open
    // as a result of this call is blocked. A solution to this problem would be to to specify status: true in the
    // options object of FB.init and you need to be confident that login status has already loaded.
    if (window.FB) {
      window.FB.getLoginStatus(function (response) {
        if (response.status === "connected") {
          Dispatcher.dispatch({
            type: FacebookConstants.FACEBOOK_LOGGED_IN,
            data: response,
          });
        } else {
          window.FB.login((res) => {
            Dispatcher.dispatch({
              type: FacebookConstants.FACEBOOK_LOGGED_IN,
              data: res,
            });
          }, { scope: "public_profile,email,user_friends" });
        }
      });
    }
  },

  logout: function () {
    window.FB.logout((response) => {
      Dispatcher.dispatch({
        type: FacebookConstants.FACEBOOK_LOGGED_OUT,
        data: response,
      });
    });
  },

  // July 2017: Not called from anywhere
  savePhoto: function (url){
    Dispatcher.loadEndpoint("voterPhotoSave", { facebook_profile_image_url_https: url } );
  },

  // Save incoming auth data from Facebook
  voterFacebookSignInAuth: function (data) {
    // console.log("FacebookActions voterFacebookSignInAuth");
    Dispatcher.loadEndpoint("voterFacebookSignInSave", {
      facebook_access_token: data.accessToken || false,
      facebook_user_id: data.userId || false,
      facebook_expires_in: data.expiresIn || false,
      facebook_signed_request: data.signedRequest || false,
      save_auth_data: true,
      save_profile_data: false,
    });
  },

  voterFacebookSignInPhoto: function (facebook_user_id, data) {
    // console.log("FacebookActions voterFacebookSignInPhoto, data:", data);
    if (data) {
      Dispatcher.loadEndpoint("voterFacebookSignInSave", {
        facebook_user_id: facebook_user_id || false,
        facebook_profile_image_url_https: data.url || false,
        save_photo_data: true,
      });
    }
  },

  voterFacebookSignInRetrieve: function (){
    Dispatcher.loadEndpoint("voterFacebookSignInRetrieve", {
    });
  },

  voterFacebookSignInConfirm: function (){
    Dispatcher.loadEndpoint("voterFacebookSignInRetrieve", {
    });
  },
};
