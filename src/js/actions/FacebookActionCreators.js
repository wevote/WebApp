const web_app_config = require('../config');
import FacebookDispatcher from '../dispatcher/FacebookDispatcher';
import FacebookConstants from '../constants/FacebookConstants'

const FacebookActionCreators = {
    initFacebook: function() {
        window.fbAsyncInit = function() {
            FB.init({
              appId      : web_app_config.FACEBOOK_APP_ID,
              xfbml      : true,
              version    : 'v2.5'
            });

            // after initialization, get the login status
            FacebookActionCreators.getLoginStatus();
        },

        (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));
    },

    getLoginStatus: function() {
        window.FB.getLoginStatus((response) => {
            FacebookDispatcher.dispatch({
                actionType: FacebookConstants.FACEBOOK_INITIALIZED,
                data: response
            })
        });
    },

    login: () => {
      try {
        window.FB.login((response) => {
            if (response.status === 'connected') {
                // Logged into We Vote and Facebook
                FacebookDispatcher.dispatch({
                    actionType: FacebookConstants.FACEBOOK_LOGGED_IN,
                    data: response
                })
            } else if (response.status === 'not_authorized') {
                // The person is logged into Facebook, but not We Vote
            } else {
                // The person is not logged into Facebook
            }
        });
      } catch (e) {
        // If FB already logged in, carry on
      }
    },

    logout: () => {
        window.FB.logout((response) => {
            FacebookDispatcher.dispatch({
                actionType: FacebookConstants.FACEBOOK_LOGGED_OUT,
                data: response
            })
        })
    },

    disconnectFromFacebook: () => {
        // Removing connection between We Vote and Facebook
        FacebookDispatcher.dispatch({
            actionType: FacebookConstants.FACEBOOK_SIGN_IN_DISCONNECT,
            data: true
        })
    },

    getFacebookProfilePicture: (userId) => {
        FacebookDispatcher.dispatch({
            actionType: FacebookConstants.FACEBOOK_GETTING_PICTURE,
            data: null
        })
        
        window.FB.api(`/${userId}/picture?type=large`, (response) => {
            FacebookDispatcher.dispatch({
                actionType: FacebookConstants.FACEBOOK_RECEIVED_PICTURE,
                data: response
            })
        })
    }
}

module.exports = FacebookActionCreators;