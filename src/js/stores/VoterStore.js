import assign from 'object-assign';
import service from '../utils/service';
import { createStore } from '../utils/createStore';

import AppDispatcher from '../dispatcher/AppDispatcher';
import VoterActions from '../actions/VoterActions';
import VoterConstants from '../constants/VoterConstants';

const cookies = require('../utils/cookies');
const CHANGE_EVENT = 'change';

let _voter_device_id = cookies.getItem('voter_device_id');
let _location = cookies.getItem('location');
let _voter = {};

const VoterAPIWorker = {

};

const VoterStore = createStore({

  /**
   * initialize the voter store with data, if no data
   * and callback with the voter items
   * @return {Boolean}
   */
  initialize: function (callback) {
    console.log("VoterStore.initialize");
    var voterPromiseQueue = [];
    var getVoterObject = this.getVoterObject.bind(this);

    if (!callback || typeof callback !== 'function')
      throw new Error('VoterStore: initialize must be called with callback');

    // Do we have the Voter data stored in the browser?
    if (Object.keys(_voter).length)
      return callback(getVoterObject());

    else {
      if ( ! _voter_device_id ) {
        VoterAPIWorker
          .deviceIdGenerate( (res, a) => {
            console.log(res, a);
            debugger;
          })
          .then ( (response) => {
            debugger;
            _voter_device_id = response.voter_device_id;

            cookies.setItem('voter_device_id', _voter_device_id, Infinity); // Set to never expire
          })
          .catch( (err) => {
            debugger;
            console.log(err);
          })
        }
      //
      //   VoterAPIWorker
      //     .createVoter()
      // }
      //
      // if (! _location ) {
      //   VoterAPIWorker
      //     .voterLocationRetrieveFromIP()
      //       .then ( (response) => {
      //         _location = response.voter_location;
      //
      //         cookies.setItem('location', _location);
      //       })
      // }
      //
      // if (! _voter_photo_url ) {
      //
      //   VoterAPIWorker
      //     .voterRetrieve()
      //     .then((response) => {
      //       //addVoterToVoterStore(response);
      //
      //       //_voter_ids.push( response.we_vote_id );
      //       _voter = assign({}, response);
      //   })
      // }
    }
  },

  getVoterObject: function () {
      //console.log("VoterStore getVoterObject");
      //for (var key in _voter_store) {
      //    _voter = _voter_store[key];
      //}
      //return _voter;
      return assign({}, _voter);
  },

  /**
   * get the signed in state of the voter
   * @return {Boolean}    is the item signed in or not
   */
  getVoterSignedInState: function () {
    //console.log("VoterStore getVoterSignedInState, _voter_store: " + _voter_store);
    return _voter.signed_in_personal;
  },

  getVoterPhotoURL: function () {
      console.log("VoterStore getVoterPhotoURL");
      return _voter_photo_url;
  },

  /**
   * set geographical location of voter
   */
  setGeoLocation() {
    navigator.geolocation.getCurrentPosition(function (pos) {
      _position.lat = pos.coords.latitude;
      _position.long = pos.coords.longitude;
    });
  },

  changeLocation: function (location) {
    if (!location) throw new Error('Missing voter location');

    console.log('setting initial location...');
    console.warn(`we will need to configure logic & etc. for setting up a voters location...
    `);

    cookies.setItem('location', location);
    VoterActions.ChangeLocation(location);

    return location;
  },

  /**
   * get the Voters location
   * @return {String} location
   */
  getLocation: function () {
    return _location;
  }
});

AppDispatcher.register( action => {

  switch (action.actionType) {
    case VoterConstants.VOTER_CHANGE_LOCATION: // ChangeLocation
      VoterAPIWorker
        .voterLocationRetrieveFromIP(
          () => VoterStore.emitChange()
      );
      break;
    default:
      break;
  }
});

export default VoterStore;
