import assign from 'object-assign';
import {
  $ajax, $post, deviceIdGenerate, voterLocationRetrieveFromIP
} from '../utils/service';
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

function setDeviceId (id) {
  _voter_device_id = id;
  cookies.setItem('voter_device_id', id, Infinity)
}

function setLocation (location) {
  _location = location;
  cookies.setItem('location', location, Infinity);
}

function _getLocation () {
  return _location || null;
}

const VoterStore = createStore({

  hasDeviceId: function () {
    if (_voter_device_id) return true;
    else return false;
  },
  /**
   * initialize the voter store with data, if no data
   * and callback with the voter items
   * @return {Boolean}
   */
  getDeviceId: function (callback) {
    console.log("ENTERING getDeviceId");
    if (!callback || typeof callback !== 'function')
      throw new Error('VoterStore: getDeviceId must be called with callback');

    if (this.hasDeviceId()) callback(null, false, _voter_device_id);

    else $ajax({
      endpoint: "deviceIdGenerate",
      success: (res) => {
        var { voter_device_id: id } = res;

        setDeviceId(id);
        callback(null, true, id);
      },
      error: (err) => {
        callback(err, true, null);
      }
    });
  },

  /**
   * get the Voters location
   * @return {String} location
   */
  getLocation: function (callback) {
    if (_location) callback(null, _location)
    else $ajax({
      endpoint: "voterAddressRetrieve",
      success: (res) => {
        var { text_for_map_search: location } = res;

        setLocation(location);
        callback(null, location);
      },
      error: (err) => callback(err)
    });

  },

  /**
   * save the voter's location to override API IP guess
   * @param {String} location
   * @param {Function} callback function that accepts (err,location)
   */
  saveLocation: function (location, callback) {
    if (typeof location !== "string") throw new Error('missing location to save');
    if (callback instanceof Function === false) throw new Error('missing callback function');

    $ajax({
      type: 'GET',
      data: { text_for_map_search: location },
      endpoint: 'voterAddressSave',
      success: (res) => {
        var { text_for_map_search: location } = res;

        setLocation(location);
        callback(null, location);
      },
      error: (err) => callback(err, null)
    })
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
