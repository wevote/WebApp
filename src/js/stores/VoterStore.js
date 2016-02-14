import assign from 'object-assign';
import { deviceIdGenerate, voterLocationRetrieveFromIP } from '../utils/service';
import { createStore } from '../utils/createStore';

import AppDispatcher from '../dispatcher/AppDispatcher';
import VoterActions from '../actions/VoterActions';
import VoterConstants from '../constants/VoterConstants';

const cookies = require('../utils/cookies');
const CHANGE_EVENT = 'change';

let _voter_device_id = cookies.getItem('voter_device_id');
let _location = cookies.getItem('location');
let _voter = {};

function error (err) {
  console.error('WVError:', err.message);
}

function setVoterDeviceId (id) {
  _voter_device_id = id;
  cookies.setItem('voter_device_id', id, Infinity)
}

function setVoterLocation (location) {
  _location = location;
  cookies.setItem('location', location, Infinity);
}

const VoterStore = createStore({

  /**
   * initialize the voter store with data, if no data
   * and callback with the voter items
   * @return {Boolean}
   */
  getDeviceId: function (callback) {
    if (!callback || typeof callback !== 'function')
      throw new Error('VoterStore: getDeviceId must be called with callback');

    if ( !_voter_device_id ) deviceIdGenerate()
        .then ( res => {
          var {voter_device_id: id} = res;
          setVoterDeviceId(id);
          callback(true, id);
        })
        .catch( error );

    else callback( false, _voter_device_id );
  },

  signInStatus: function (callback) {
    callback(assign({}, _voter))
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

  getVoterPhotoURL: function (callback) {
      console.log("VoterStore getVoterPhotoURL");
      if ( _voter_photo_url ) callback(_voter_photo_url);
      else callback(new Error('missing voter photo url'));
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

  saveLocation: function (location) {
    cookies.setItem('location', location);
    VoterActions.ChangeLocation(location);
  },

  /**
   * get the Voters location
   * @return {String} location
   */
  getLocation: function (callback) {
    if (_location) callback(_location)
    else voterLocationRetrieveFromIP()
      .then( response => {
        var { voter_location: location } = response;
        setVoterLocation(location);
        callback(location);
      });
  }
});

AppDispatcher.register( action => {

  switch (action.actionType) {
    case VoterConstants.VOTER_CHANGE_LOCATION: // ChangeLocation
      VoterStore.emitChange();
      break;
    default:
      break;
  }
});

export default VoterStore;
