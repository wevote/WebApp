import Dispatcher from "../dispatcher/Dispatcher";
import VoterActions from "../actions/VoterActions";
import VoterSessionActions from "../actions/VoterSessionActions";
import FacebookConstants from "../constants/FacebookConstants";
const cookies = require("../utils/cookies");
const web_app_config = require("../config");

module.exports = {
  // TODO Convert this to sign out of just Facebook
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
    window.FB.api("/me?fields=id,email,first_name,middle_name,last_name", (response) => {
        Dispatcher.dispatch({
            type: FacebookConstants.FACEBOOK_RECEIVED_DATA,
            data: response
        });
    });
  },

  login: function () {
    if (!web_app_config.FACEBOOK_APP_ID) {
      console.log("Missing FACEBOOK_APP_ID from src/js/config.js");
    }
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
        }, {scope: "public_profile,email"});
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

  savePhoto: function (url){
    Dispatcher.loadEndpoint("voterPhotoSave", { facebook_profile_image_url_https: url } );
  },

  // Save incoming auth data from Facebook
  voterFacebookSignInAuth: function (data) {
    Dispatcher.loadEndpoint("voterFacebookSignInSave", {
      facebook_access_token: data.accessToken || false,
      facebook_user_id: data.userId || false,
      facebook_expires_in: data.expiresIn || false,
      facebook_signed_request: data.signedRequest || false,
      save_auth_data: true,
      save_profile_data: false,
    });
  },

  // Save incoming data from Facebook
  voterFacebookSignInData: function (data) {
    console.log("FacebookActions voterFacebookSignInData, data:", data);
    Dispatcher.loadEndpoint("voterFacebookSignInSave", {
      facebook_user_id: data.id || false,
      facebook_email: data.email || false,
      facebook_first_name: data.first_name || false,
      facebook_middle_name: data.middle_name || false,
      facebook_last_name: data.last_name || false,
      facebook_profile_image_url_https: data.url || false,
      save_auth_data: false,
      save_profile_data: true,
    });
  },

  voterFacebookSignInRetrieve: function (facebook_id, facebook_email){
    Dispatcher.loadEndpoint("voterFacebookSignInRetrieve", {
      facebook_id: facebook_id,
      facebook_email: facebook_email,
      // yes_please_merge_accounts: false
    });
  },

  voterFacebookSignInConfirm: function (facebook_id, facebook_email){
    Dispatcher.loadEndpoint("voterFacebookSignInRetrieve", {
      facebook_id: facebook_id,
      facebook_email: facebook_email,
      // yes_please_merge_accounts: true
    });
  },
};
