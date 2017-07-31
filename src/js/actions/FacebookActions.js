import Dispatcher from "../dispatcher/Dispatcher";
// Including FacebookStore causes problems
import FriendActions from "../actions/FriendActions";
import VoterActions from "../actions/VoterActions";
import VoterSessionActions from "../actions/VoterSessionActions";

import FacebookConstants from "../constants/FacebookConstants";
const web_app_config = require("../config");

module.exports = {
  appLogout: function (){
    VoterSessionActions.voterSignOut();
    VoterActions.voterRetrieve();
    VoterActions.voterEmailAddressRetrieve();
  },

  disconnectFromFacebook: function () {
      // Removing connection between We Vote and Facebook
      Dispatcher.dispatch({
          type: FacebookConstants.FACEBOOK_SIGN_IN_DISCONNECT,
          data: true
      });
  },

  facebookDisconnect: function (){
    Dispatcher.loadEndpoint("facebookDisconnect");
  },

  facebookFriendsAction: function () {
    Dispatcher.loadEndpoint("facebookFriendsAction", {});
    FriendActions.suggestedFriendList();
  },

  getFacebookProfilePicture: function (userId) {
      if (window.FB) {
          window.FB.api(`/${userId}/picture?type=large`, (response) => {
              Dispatcher.dispatch({
                  type: FacebookConstants.FACEBOOK_RECEIVED_PICTURE,
                  data: response
              });
          });
      }
  },

  // https://developers.facebook.com/docs/graph-api/reference/v2.6/user
  getFacebookData: function (){
    window.FB.api("/me?fields=id,email,first_name,middle_name,last_name,cover",(response) => {
        Dispatcher.dispatch({
            type: FacebookConstants.FACEBOOK_RECEIVED_DATA,
            data: response
        });
    });
  },

  getFacebookInvitableFriendsList: function (picture_width, picture_height) {
    let fb_api_for_invitable_friends = `/me?fields=invitable_friends.limit(1000){name,id,picture.width(${picture_width}).height(${picture_height})}`;
    window.FB.api(fb_api_for_invitable_friends, (response) => {
      console.log("getFacebookInvitableFriendsList", response);
      Dispatcher.dispatch({
          type: FacebookConstants.FACEBOOK_RECEIVED_INVITABLE_FRIENDS,
          data: response
      });
    });
  },

  readFacebookAppRequests: function () {
    let fb_api_for_reading_app_requests = "me?fields=apprequests.limit(10){from,to,created_time,id}";
    window.FB.api(fb_api_for_reading_app_requests, (response) => {
      console.log("readFacebookAppRequests", response);
      Dispatcher.dispatch({
          type: FacebookConstants.FACEBOOK_READ_APP_REQUESTS,
          data: response
      });
    });
  },

  deleteFacebookAppRequest: function (requestId) {
    console.log("deleteFacebookAppRequest requestId: ", requestId);
    window.FB.api(requestId, "delete", (response) => {
      console.log("deleteFacebookAppRequest response", response);
       Dispatcher.dispatch({
          type: FacebookConstants.FACEBOOK_DELETE_APP_REQUEST,
          data: response
       });
    });
  },

  login: function () {
    if (!web_app_config.FACEBOOK_APP_ID) {
      console.log("Missing FACEBOOK_APP_ID from src/js/config.js");
    }
    // FB.getLoginStatus does an ajax call and when you call FB.login on it's response, the popup that would open
    // as a result of this call is blocked. A solution to this problem would be to to specify status: true in the
    // options object of FB.init and you need to be confident that login status has already loaded.
    window.FB.getLoginStatus(function (response) {
      if (response.status === "connected") {
        Dispatcher.dispatch({
            type: FacebookConstants.FACEBOOK_LOGGED_IN,
            data: response
        });
      } else {
        window.FB.login( (res) =>{
          Dispatcher.dispatch({
              type: FacebookConstants.FACEBOOK_LOGGED_IN,
              data: res
          });
        }, {scope: "public_profile,email,user_friends"});
      }
    });
  },

  logout: function () {
      window.FB.logout((response) => {
          Dispatcher.dispatch({
              type: FacebookConstants.FACEBOOK_LOGGED_OUT,
              data: response
          });
      });
  },

  // July 2017: Not called from anywhere
  savePhoto: function (url){
    Dispatcher.loadEndpoint("voterPhotoSave", { facebook_profile_image_url_https: url } );
  },

  // Save incoming auth data from Facebook
  voterFacebookSignInAuth: function (data) {
    console.log("FacebookActions voterFacebookSignInAuth");
    Dispatcher.loadEndpoint("voterFacebookSignInSave", {
      facebook_access_token: data.accessToken || false,
      facebook_user_id: data.userId || false,
      facebook_expires_in: data.expiresIn || false,
      facebook_signed_request: data.signedRequest || false,
      save_auth_data: true,
      save_profile_data: false
    });
  },

  // Save incoming data from Facebook
  voterFacebookSignInData: function (data) {
    console.log("FacebookActions voterFacebookSignInData, data:", data);
    let background = false;
    if (data.cover && data.cover.source)
      background = data.cover.source
    Dispatcher.loadEndpoint("voterFacebookSignInSave", {
      facebook_user_id: data.id || false,
      facebook_email: data.email || false,
      facebook_first_name: data.first_name || false,
      facebook_middle_name: data.middle_name || false,
      facebook_last_name: data.last_name || false,
      facebook_profile_image_url_https: data.url || false,
      facebook_background_image_url_https: background,
      save_auth_data: false,
      save_profile_data: true
    });
  },

  voterFacebookSignInPhoto: function (facebook_user_id, data) {
    console.log("FacebookActions voterFacebookSignInPhoto, data:", data);
    Dispatcher.loadEndpoint("voterFacebookSignInSave", {
      facebook_user_id: facebook_user_id || false,
      facebook_profile_image_url_https: data.url || false,
      save_photo_data: true
    });
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
