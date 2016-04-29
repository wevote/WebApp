var FluxMapStore = require("flux/lib/FluxMapStore");
import FacebookConstants from "../constants/FacebookConstants";
import FacebookActions from "../actions/FacebookActions";
import Dispatcher from "../dispatcher/Dispatcher";
import VoterActions from "../actions/VoterActions";

class FacebookStore extends FluxMapStore {
  getInitialState (){
    return {
      authData: {},
      emailData: {}
    };
  }

  get facebookAuthData (){
    return this.getState().authData;
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

    reduce (state, action) {
      switch (action.type) {

        case "facebookSignIn":
          // Once we have connected to Facebook, grab a fresh version of the voter
          VoterActions.retrieveVoter();
          return state;

        case FacebookConstants.FACEBOOK_LOGGED_IN:
          FacebookActions.getFacebookEmail();
          return {
            ...state,
            authData: action.data
          };

        case FacebookConstants.FACEBOOK_RECEIVED_EMAIL:
        //TODO: this is hackish to save the email by using facebookSignIn because will cause re-fetching voter.
        //swap out with updateVoter endpoint once created.
          FacebookActions.facebookSignIn(this.facebookAuthData.authResponse.userID, action.data.email);
          return {
            ...state,
            emailData: action.data
          };

        case "voterSignOut":
          return {
            authData: {},
            pictureData: {},
            emailData: {}
          };

        case FacebookConstants.FACEBOOK_SIGN_IN_DISCONNECT:
          this.disconnectFromFacebook();
          return state;

        case FacebookConstants.FACEBOOK_RECEIVED_PICTURE:
            FacebookActions.savePhoto(action.data.data.url);
            return state;

        default:
          return state;
        }
      }
    }

module.exports = new FacebookStore(Dispatcher);
