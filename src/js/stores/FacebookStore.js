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

  get facebookUserId (){
    return this.getState().userId;
  }

  getFacebookAuthResponse () {
    return {
      accessToken: this.accessToken,
      facebookIsLoggedIn: this.loggedIn,
      userId: this.userId,
      // facebookPictureStatus: this.getState().facebookPictureStatus,
      // facebookPictureUrl: this.getState().facebookPictureUrl,
      facebook_retrieve_attempted: this.getState().facebook_retrieve_attempted,
      facebook_sign_in_found: this.getState().facebook_sign_in_found,
      facebook_sign_in_verified: this.getState().facebook_sign_in_verified,
      facebook_sign_in_failed: this.getState().facebook_sign_in_failed,
      facebook_secret_key: this.getState().facebook_secret_key,
      facebook_profile_image_url_https: this.getState().facebook_profile_image_url_https,
      voter_has_data_to_preserve: this.getState().voter_has_data_to_preserve,
      existing_facebook_account_found: this.getState().existing_facebook_account_found,
      voter_we_vote_id_attached_to_facebook: this.getState().voter_we_vote_id_attached_to_facebook,
      voter_we_vote_id_attached_to_facebook_email: this.getState().voter_we_vote_id_attached_to_facebook_email,
      // yes_please_merge_accounts: this.getState().yes_please_merge_accounts,
    };
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

      case FacebookConstants.FACEBOOK_LOGGED_IN:
        // console.log("FACEBOOK_LOGGED_IN action.data:", action.data);
        FacebookActions.voterFacebookSignInAuth(action.data.authResponse);
        FacebookActions.getFacebookData();
        return {
          ...state,
          authData: action.data
        };

      case FacebookConstants.FACEBOOK_RECEIVED_DATA:
        // Cache the data in the API server
        // console.log("FACEBOOK_RECEIVED_DATA action.data:", action.data);
        FacebookActions.voterFacebookSignInData(action.data);
        FacebookActions.getFacebookProfilePicture(action.data.id);
        return {
          ...state,
          emailData: action.data
        };

      case "voterFacebookSignInRetrieve":
        // console.log("FacebookStore voterFacebookSignInRetrieve, facebook_sign_in_verified: ", action.res.facebook_sign_in_verified);
        if (action.res.facebook_sign_in_verified) {
          VoterActions.voterRetrieve();
        }
        return {
          ...state,
          voter_device_id: action.res.voter_device_id,
          voter_has_data_to_preserve: action.res.voter_has_data_to_preserve,
          facebook_retrieve_attempted: action.res.facebook_retrieve_attempted,
          facebook_sign_in_found: action.res.facebook_sign_in_found,
          facebook_sign_in_verified: action.res.facebook_sign_in_verified,
          facebook_sign_in_failed: action.res.facebook_sign_in_failed,
          facebook_secret_key: action.res.facebook_secret_key,
          // yes_please_merge_accounts: action.res.yes_please_merge_accounts,
          existing_facebook_account_found: action.res.existing_facebook_account_found,
          voter_we_vote_id_attached_to_facebook: action.res.voter_we_vote_id_attached_to_facebook,
          voter_we_vote_id_attached_to_facebook_email: action.res.voter_we_vote_id_attached_to_facebook_email,
          // facebook_email: action.res.facebook_email,
          // facebook_first_name: action.res.facebook_first_name,
          // facebook_middle_name: action.res.facebook_middle_name,
          // facebook_last_name: action.res.facebook_last_name,
          facebook_profile_image_url_https: action.res.facebook_profile_image_url_https,
        };

      case "voterFacebookSignInSave":
        // console.log("FacebookStore voterFacebookSignInSave, minimum_data_saved: ", action.res.minimum_data_saved);
        if (action.res.minimum_data_saved) {
          // Only reach out for the Facebook Sign In information if the save_profile_data call has completed
          // TODO: We need a check here to prevent an infinite loop if the local voter_device_id isn't recognized by server
          // console.log("FacebookStore voterFacebookSignInSave, voter exists");
          FacebookActions.voterFacebookSignInRetrieve();
        }
        return state;

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
        let facebook_user_id = this.userId;
        FacebookActions.voterFacebookSignInPhoto(facebook_user_id, action.data.data);
        return {
          ...state,
          facebook_profile_image_url_https: action.data.data.url
        };

      default:
        return state;
      }
    }
  }

module.exports = new FacebookStore(Dispatcher);
