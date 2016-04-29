const web_app_config = require("../config");
import Dispatcher from "../dispatcher/Dispatcher";
import VoterActions from "../actions/VoterActions";
import FacebookConstants from "../constants/FacebookConstants";
const cookies = require("../utils/cookies");

module.exports = {

  initFacebook: function () {
      window.fbAsyncInit = function () {
          window.FB.init({
            appId: web_app_config.FACEBOOK_APP_ID,
            xfbml: true,
            version: "v2.5"
          });
      };

    (function (d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, "script", "facebook-jssdk"));
  },

  facebookSignIn: function (facebook_id, facebook_email){
    Dispatcher.loadEndpoint("facebookSignIn", {
      facebook_id: facebook_id,
      facebook_email: facebook_email
    });
  },

  facebookDisconnect: function (){
    Dispatcher.loadEndpoint("facebookDisconnect");
  },

  appLogout: function (){
    cookies.setItem("voter_device_id", "", -1, "/");
    VoterActions.signOut();
    VoterActions.retrieveVoter();
  },

  login: function () {
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

  disconnectFromFacebook: function () {
      // Removing connection between We Vote and Facebook
      Dispatcher.dispatch({
          type: FacebookConstants.FACEBOOK_SIGN_IN_DISCONNECT,
          data: true
      });
  },

  getFacebookProfilePicture: function (userId) {
      window.FB.api(`/${userId}/picture?type=large`, (response) => {
          Dispatcher.dispatch({
              type: FacebookConstants.FACEBOOK_RECEIVED_PICTURE,
              data: response
          });
      });
  },

  getFacebookEmail: function (){
    window.FB.api("/me?fields=id,email", (response) => {
        Dispatcher.dispatch({
            type: FacebookConstants.FACEBOOK_RECEIVED_EMAIL,
            data: response
        });
    });
  },

  savePhoto: function (url){
    Dispatcher.loadEndpoint("voterPhotoSave", { facebook_profile_image_url_https: url } );
  },
};
