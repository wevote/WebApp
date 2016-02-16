import FacebookConstants from '../constants/FacebookConstants';
import FacebookDispatcher from '../dispatcher/FacebookDispatcher';
import VoterStore from '../stores/VoterStore';
import {EventEmitter} from 'events';
import service from '../utils/service';

const FACEBOOK_CHANGE_EVENT = 'FACEBOOK_CHANGE_EVENT';

class FacebookStore extends EventEmitter {
    constructor() {
        super();
        this.facebookAuthData = {};
        this.faebookPictureData = {};
    }

    setFacebookAuthData(data) {
        this.facebookAuthData = data;
        this.emitChange();
    }

    get loggedIn() {
        if (!this.facebookAuthData) {
            return;
        }

        return this.facebookAuthData.status == 'connected';
    }

    get userId() {
        if (!this.facebookAuthData || !this.facebookAuthData.authResponse) {
            return;
        }

        return this.facebookAuthData.authResponse.userID;
    }

    get accessToken() {
        if (!this.facebookAuthData || !this.facebookAuthData.authResponse) {
            return;
        }

        return this.facebookAuthData.authResponse.accessToken;
    }

    get facebookPictureUrl() {
        if (!this.facebookPictureData || !this.facebookPictureData.url) {
            return;
        }

        return this.facebookPictureData.url;
    }

    setFacebookPictureData(type, data) {
        this.facebookPictureStatus = type;

        if (data) {
            this.facebookPictureData = data.data
        } else {
            this.facebookPictureData = {};
        }

        this.emitChange();
    }

    saveFacebookPictureData(data) {
        if (data) {
          FacebookAPIWorker
            .voterFacebookPhotoSave(
              data.data.url, () => this.emit(FACEBOOK_CHANGE_EVENT)
          );
        }
    }

    saveFacebookAuthData() {
        if (this.facebookAuthData) {
          FacebookAPIWorker
            .facebookSignIn(
              this.facebookAuthData.authResponse.userID, false, () => this.emit(FACEBOOK_CHANGE_EVENT)
          );
        }
    }

    disconnectFromFacebook() {
      FacebookAPIWorker
        .facebookDisconnect(
          () => this.emit(FACEBOOK_CHANGE_EVENT)
      );
    }

    emitChange() {
        this.emit(FACEBOOK_CHANGE_EVENT);
    }

    addChangeListener(callback) {
        this.on(FACEBOOK_CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(FACEBOOK_CHANGE_EVENT, callback);
    }
}

const FacebookAPIWorker = {
  voterFacebookPhotoSave: function (photo_url, success ) {
    return service.get({
      endpoint: 'voterPhotoSave',
      query: {
        facebook_profile_image_url_https: photo_url
      }, success
    });
  },

  facebookSignIn: function (facebook_id, facebook_email, success ) {
    return service.get({
      endpoint: 'facebookSignIn',
      query: {
        facebook_id: facebook_id,
        facebook_email: facebook_email
      }, success
    });
  },

  /**
   * Disconnect facebook from this account by removing the facebook_id from the db
   * @param  {String}   voter_device_id will be passed
   * @return {Boolean}  Was the disconnection successful?
   */
  facebookDisconnect: function (success ) {
    return service.get({
      endpoint: 'facebookDisconnect',
      data: success
    });
  }
};

function sleep (milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) break;
  }
}

// initialize the store as a singleton
const facebookStore = new FacebookStore();

facebookStore.dispatchToken = FacebookDispatcher.register((action) => {
    if (action.actionType == FacebookConstants.FACEBOOK_INITIALIZED) {
        facebookStore.setFacebookAuthData(action.data);
    }

    if (action.actionType == FacebookConstants.FACEBOOK_LOGGED_IN) {
        console.log("FACEBOOK_LOGGED_IN");
        facebookStore.setFacebookAuthData(action.data);
        facebookStore.saveFacebookAuthData();

        sleep(3000);
        console.log("FACEBOOK_LOGGED_IN: Trying to retrieve fresh voter data");
        var voter = VoterStore.getVoterObject();
        console.log('Before ', voter);
        VoterStore.voterRetrieveFresh((voter_object) => {
          console.log('facebookStore : FACEBOOK_INITIALIZED', voter_object);
        });

        sleep(3000);
        var voter = VoterStore.getVoterObject();
        console.log('After ', voter);
    }

    if (action.actionType == FacebookConstants.FACEBOOK_LOGGED_OUT) {
        facebookStore.setFacebookAuthData(action.data);
    }

    if (action.actionType == FacebookConstants.FACEBOOK_SIGN_IN_DISCONNECT) {
        console.log("FACEBOOK_SIGN_IN_DISCONNECT");
        facebookStore.disconnectFromFacebook();


        sleep(3000);
        console.log("FACEBOOK_SIGN_IN_DISCONNECT: Trying to retrieve fresh voter data");
        var voter = VoterStore.getVoterObject();
        console.log('Before ', voter);
        VoterStore.voterRetrieveFresh(voter.we_vote_id);

        sleep(3000);
        var voter = VoterStore.getVoterObject();
        console.log('After ', voter);
    }

    if (action.actionType == FacebookConstants.FACEBOOK_GETTING_PICTURE) {
        facebookStore.setFacebookPictureData(action.actionType, action.data)
    }

    if (action.actionType == FacebookConstants.FACEBOOK_RECEIVED_PICTURE) {
        console.log("FACEBOOK_RECEIVED_PICTURE");
        facebookStore.setFacebookPictureData(action.actionType, action.data);
        facebookStore.saveFacebookPictureData(action.data);
        facebookStore.saveFacebookAuthData();
        // VoterStore.updateVoterData(); // This would be nice to get working
    }
})

module.exports = facebookStore;
