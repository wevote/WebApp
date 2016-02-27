import { $ajax } from "../utils/service";
import FacebookConstants from "../constants/FacebookConstants";
import FacebookDispatcher from "../dispatcher/FacebookDispatcher";
import VoterStore from "../stores/VoterStore";
import {EventEmitter} from "events";
import service from "../utils/service";

const cookies = require("../utils/cookies");
const FACEBOOK_CHANGE_EVENT = "FACEBOOK_CHANGE_EVENT";

const FacebookAPIWorker = {
  voterFacebookPhotoSave: function (photo_url, success ) {
    console.log("FacebookAPIWorker.voterFacebookPhotoSave");
    return service.get({
      endpoint: "voterPhotoSave",
      query: {
        voter_device_id: cookies.getItem("voter_device_id"),
        facebook_profile_image_url_https: photo_url
      }, success
    });
  },

  facebookSignIn: function (facebook_id, facebook_email, callback) {
    // console.log("In FacebookStore.js, FacebookAPIWorker.facebookSignIn, facebook_id: ", facebook_id);
    return $ajax({
      type: "GET",
      endpoint: "facebookSignIn",
      data: {
        facebook_id: facebook_id,
        facebook_email: facebook_email
      },
      success: (result) => {
        callback(result);
      },
      error: (err) => {
        callback(err);
      }
    });
  },

  /**
   * Disconnect facebook from this account by removing the facebook_id from the db
   * @param  {String}   voter_device_id will be passed
   * @return {Boolean}  Was the disconnection successful?
   */
  facebookDisconnect: function (callback) {
    // console.log("In FacebookStore.js, FacebookAPIWorker.facebookSignIn");
    if (callback instanceof Function === false) throw new Error("facebookDisconnect, missing callback function");

    $ajax({
      type: "GET",
      endpoint: "facebookDisconnect",
      success: (response) => {
        callback(response);
      },
      error: (err) => callback(err)
    });

  }
};

class FacebookStore extends EventEmitter {
    constructor () {
        super();
        this.facebookAuthData = {};
        this.faebookPictureData = {};
    }

    setFacebookAuthData (data) {
        this.facebookAuthData = data;
        this.emitChange();
    }

    get loggedIn () {
        if (!this.facebookAuthData) {
            return;
        }

        return this.facebookAuthData.status === "connected";
    }

    get userId () {
        if (!this.facebookAuthData || !this.facebookAuthData.authResponse) {
            return;
        }

        return this.facebookAuthData.authResponse.userID;
    }

    get accessToken () {
        if (!this.facebookAuthData || !this.facebookAuthData.authResponse) {
            return;
        }

        return this.facebookAuthData.authResponse.accessToken;
    }

    get facebookPictureUrl () {
        if (!this.facebookPictureData || !this.facebookPictureData.url) {
            return;
        }

        return this.facebookPictureData.url;
    }

    setFacebookPictureData (type, data) {
        this.facebookPictureStatus = type;

        if (data) {
            this.facebookPictureData = data.data;
        } else {
            this.facebookPictureData = {};
        }

        this.emitChange();
    }

    saveFacebookPictureData (data) {
        if (data) {
          FacebookAPIWorker
            .voterFacebookPhotoSave(
              data.data.url, () => this.emit(FACEBOOK_CHANGE_EVENT)
          );
        }
    }

    saveFacebookAuthData () {
        if (this.facebookAuthData) {
          console.log("In FacebookStore.js, saveFacebookAuthData: ", this.facebookAuthData);
          console.log("userID: ", this.facebookAuthData.authResponse.userID);
          FacebookAPIWorker
            .facebookSignIn(
              this.facebookAuthData.authResponse.userID, false, () => this.emit(FACEBOOK_CHANGE_EVENT)
          );
        }
    }

    connectWithFacebook () {
      if (this.facebookAuthData) {
        // console.log("In FacebookStore.js, connectWithFacebook, this.facebookAuthData: ", this.facebookAuthData);
        // console.log("userID: ", this.facebookAuthData.authResponse.userID);
        FacebookAPIWorker
          .facebookSignIn(this.facebookAuthData.authResponse.userID, false, () => {
            // console.log("Call to FacebookAPIWorker.facebookSignIn has completed");
            this.emit(FACEBOOK_CHANGE_EVENT);
            // Once we have connected to Facebook, grab a fresh version of the voter
            VoterStore.getLocation( (err) => {
              if (err) handleVoterError(err);
              VoterStore.retrieveFreshVoterObject( (_err, voter_object) => {
                if (_err) {
                  handleVoterError(_err);
                } else {
                  // console.log("facebookStore.connectWithFacebook, voter: ", voter_object);
                  // Finally, update all components listening for changes in Voter Store
                  VoterStore.emitChange();
                }
              });
            });
          }
        );
      }
    }

    disconnectFromFacebook () {
      FacebookAPIWorker
        .facebookDisconnect(
          () => {
            // console.log("FacebookAPIWorker.facebookDisconnect has completed");
            this.emit(FACEBOOK_CHANGE_EVENT);
            // Once we have disconnected from Facebook, grab a fresh version of the voter
            VoterStore.getLocation( (err) => {
              if (err) handleVoterError(err);
              VoterStore.retrieveFreshVoterObject( (_err, voter_object) => {
                if (_err) {
                  handleVoterError(_err);
                } else {
                  // console.log("facebookStore.dispatchToken: FACEBOOK_SIGN_IN_DISCONNECT, voter: ", voter_object);
                  // Finally, update all components listening for changes in Voter Store
                  VoterStore.emitChange();
                }
              });
            });
          }
      );
    }

    emitChange () {
        this.emit(FACEBOOK_CHANGE_EVENT);
    }

    addChangeListener (callback) {
        this.on(FACEBOOK_CHANGE_EVENT, callback);
    }

    removeChangeListener (callback) {
        this.removeListener(FACEBOOK_CHANGE_EVENT, callback);
    }
}

function sleep (milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) break;
  }
}

function handleVoterError (err) {
  console.error("FacebookStore.js, Error initializing voter object", err);
}

// initialize the store as a singleton
const facebookStore = new FacebookStore();

facebookStore.dispatchToken = FacebookDispatcher.register((action) => {
    if (action.actionType === FacebookConstants.FACEBOOK_INITIALIZED) {
        facebookStore.setFacebookAuthData(action.data);
    }

    if (action.actionType === FacebookConstants.FACEBOOK_LOGGED_IN) {
        // console.log("facebookStore, actionType: FACEBOOK_LOGGED_IN, action.data: ", action.data);
        facebookStore.setFacebookAuthData(action.data); // TODO set this up so following functions are dependent
        facebookStore.connectWithFacebook();
    }

    if (action.actionType === FacebookConstants.FACEBOOK_LOGGED_OUT) {
        facebookStore.setFacebookAuthData(action.data);
    }

    //if (action.actionType === FacebookConstants.FACEBOOK_SIGN_IN_CONNECT) {
    //  // Dale exploring need for this vs. 'FACEBOOK_LOGGED_IN'?
    //  console.log("facebookStore.dispatchToken: FACEBOOK_SIGN_IN_CONNECT");
    //  facebookStore.connectWithFacebook();
    //}

    if (action.actionType === FacebookConstants.FACEBOOK_SIGN_IN_DISCONNECT) {
      // console.log("facebookStore.dispatchToken: FACEBOOK_SIGN_IN_DISCONNECT");
      facebookStore.disconnectFromFacebook();
    }

    if (action.actionType === FacebookConstants.FACEBOOK_GETTING_PICTURE) {
        facebookStore.setFacebookPictureData(action.actionType, action.data);
    }

    if (action.actionType === FacebookConstants.FACEBOOK_RECEIVED_PICTURE) {
        console.log("FACEBOOK_RECEIVED_PICTURE");
        facebookStore.setFacebookPictureData(action.actionType, action.data);
        facebookStore.saveFacebookPictureData(action.data);
        facebookStore.saveFacebookAuthData();
        // We could use facebookStore.connectWithFacebook() here
    }
});

module.exports = facebookStore;
