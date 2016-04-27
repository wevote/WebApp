var FluxMapStore = require("flux/lib/FluxMapStore");
import FacebookConstants from "../constants/FacebookConstants";
import FacebookActionCreators from "../actions/FacebookActionCreators";
import Dispatcher from "../dispatcher/Dispatcher";
import VoterActions from "../actions/VoterActions";

class FacebookStore extends FluxMapStore {
  getInitialState (){
    return {
      authData: {},
      pictureData: {},
      emailData: {}
    };
  }

  get facebookAuthData (){
    return this.getState().authData;
  }

  get facebookPictureData (){
    return this.getState().pictureData;
  }

  get facebookEmailData (){
    return this.getState().emailData;
  }

  get loggedIn () {
      if (!this.facebookAuthData) {
          return undefined;
      }

      return this.facebookAuthData.status === "connected";
  }

  get userId () {
      if (!this.facebookAuthData || !this.facebookAuthData.authResponse) {
          return undefined;
      }

      return this.facebookAuthData.authResponse.userID;
  }

  get accessToken () {
      if (!this.facebookAuthData || !this.facebookAuthData.authResponse) {
          return undefined;
      }

      return this.facebookAuthData.authResponse.accessToken;
  }

  connectWithFacebook () {
    if (this.facebookAuthData) {
      FacebookActionCreators
        .facebookSignIn(this.facebookAuthData.authResponse.userID, this.facebookEmailData.email);
    }
  }

    reduce (state, action) {
      switch (action.type) {

        case "facebookSignIn":
          console.log("signin action registered");
          // Once we have connected to Facebook, grab a fresh version of the voter
          VoterActions.retrieveVoter();
          return state;

        case FacebookConstants.FACEBOOK_INITIALIZED:
          return {
            ...state,
            authData: action.data
          };

        case FacebookConstants.FACEBOOK_LOGGED_IN:
          FacebookActionCreators.getFacebookEmail();
          return {
            ...state,
            authData: action.data
          };

        case FacebookConstants.FACEBOOK_RECEIVED_EMAIL:
          FacebookActionCreators.facebookSignIn(this.facebookAuthData.authResponse.userID, action.data.email);
          return {
            ...state,
            emailData: action.data
          };

        case FacebookConstants.FACEBOOK_LOGGED_OUT:
          return {
            ...state,
            authData: action.data
          };

        case FacebookConstants.FACEBOOK_SIGN_IN_DISCONNECT:
          this.disconnectFromFacebook();
          return state;

        case FacebookConstants.FACEBOOK_RECEIVED_PICTURE:
            console.log("FACEBOOK_RECEIVED_PICTURE");
            FacebookActionCreators.savePhoto(action.data.data.url);
            return state;

        case "voterPhotoSave":
          return {
            ...state,
            pictureData: action.res.facebook_profile_image_url_https
          };

        default:
          return state;
        }
      }
    }

module.exports = new FacebookStore(Dispatcher);
