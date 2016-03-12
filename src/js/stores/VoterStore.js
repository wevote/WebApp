import assign from "object-assign";
import { $ajax } from "../utils/service";
import { createStore } from "../utils/createStore";

import AppDispatcher from "../dispatcher/AppDispatcher";
import VoterActions from "../actions/VoterActions";
import VoterConstants from "../constants/VoterConstants";

const cookies = require("../utils/cookies");

let _voter_device_id = cookies.getItem("voter_device_id");
let _location = cookies.getItem("location");
let _voter_id = cookies.getItem("voter_id");
let _voter = {};

const VoterStore = createStore({

  deviceId: function () {
    return _voter_device_id;
  },

  hasDeviceId: function () {
    return _voter_device_id ? true : false;
  },

  hasVoterId: function () {
    return _voter_id ? true : false;
  },

  hasLocation: function () {
    return _location ? true : false;
  },

  /**
   * get the RAW JSON object from api.wevoteusa and merge
   * it with other calculated values object
   * @param {Function} callback (err, voter-object)
   */
  getVoterObject: function (callback) {
    _voter = assign({}, {
      voter_id: _voter_id,
      voter_device_id: _voter_device_id,
      location: _location
    });

    if ( _voter.status === "VOTER_FOUND")
      return callback(null, assign({}, _voter));

    return $ajax({
      endpoint: "voterRetrieve",
      success: (res) => {
        _voter = assign({}, _voter, res);
        callback(null, assign({}, _voter));
      },
      error: (err) => {
        callback(err);
      }
    });
  },

  /**
   * get a refreshed version of the RAW JSON object from api.wevoteusa and merge
   * it with other calculated values object
   * @param {Function} callback (err, voter-object)
   */
  retrieveFreshVoterObject: function (callback) {
    return $ajax({
      endpoint: "voterRetrieve",
      success: (res) => {
        _voter = assign({}, _voter, res);
        callback(null, assign({}, _voter));
      },
      error: (err) => {
        callback(err);
      }
    });
  },

  /**
   * get the RAW JSON object cached in the local _voter variable
   */
  getCachedVoterObject: function () {
    return _voter;
  },

  /**
   * initialize the voter store with data, if no data
   * and callback with the voter items
   * @param {Function} callback (err, device_id)
   */
  getDeviceId: function (callback) {
    if (callback instanceof Function === false)
      throw new Error("VoterStore: getDeviceId must be called with callback");

    if (_voter_device_id) return callback(null, _voter_device_id);

    return $ajax({
      endpoint: "deviceIdGenerate",
      success: (res) => {
        var { voter_device_id: id } = res;

        _setDeviceId(id);
        callback(null, true, id);
      },
      error: (err) => {
        callback(err, true, null);
      }
    });

  },

  /**
   * create a voter using voterCreate endpoint from api.wevoteusa
   * @param {Function} callback (err, voter_id)
   */
  createVoter: function (callback) {
    if (callback instanceof Function === false)
      throw new Error("VoterStore: getDeviceId must be called with callback");

    if (_voter_id) return callback(null, _voter_id);

    return $ajax({
      endpoint: "voterCreate",
      success: (res) => {
        var {voter_id} = res;
        _setVoterId(voter_id);
        callback(null, voter_id);
      },
      error: (err) => callback(err)
    });

  },

  /**
   * get the Voters location
   * @param {Function} callback function (error, location)
   */
  getLocation: function (callback) {
    if (callback instanceof Function === false)
      throw new Error("VoterStore: getDeviceId must be called with callback");

    if (_location) return callback(null, _location);

    return $ajax({
      endpoint: "voterAddressRetrieve",
      success: (res) => {
        var { text_for_map_search: location } = res;

        _setLocation(location);
        callback(null, location);
      },
      error: (err) => callback(err)
    });

  },

  /**
   * save the voter"s location to override API IP guess
   * @param {String} location
   * @param {Function} callback function that accepts (err,location)
   */
  saveLocation: function (location, callback) {
    if (typeof location !== "string") throw new Error("missing location to save");
    if (callback instanceof Function === false) throw new Error("missing callback function");
    var that = this;

    $ajax({
      type: "GET",
      data: { text_for_map_search: location },
      endpoint: "voterAddressSave",
      success: (res) => {
        var { text_for_map_search: savedLocation } = res;
        _setLocation(savedLocation);
        that.emitChange();
        callback(savedLocation);
      },
      error: (err) => callback(err, null)
    });
  },

  signInStatus: function (callback) {
    callback(assign({}, _voter));
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
    else callback(new Error("missing voter photo url"));
  },

  /**
   * set geographical location of voter
   */
  setGeoLocation () {
    var _position = {};

    navigator.geolocation.getCurrentPosition(function (pos) {
      _position.lat = pos.coords.latitude;
      _position.long = pos.coords.longitude;
    });
  },

  changeLocation: function (location) {
    if (!location) throw new Error("Missing voter location");

    console.log("setting initial location...");
    console.warn(`we will need to configure logic & etc. for setting up a voters location...
    `);

    cookies.setItem("location", location);
    VoterActions.ChangeLocation(location);

    return location;
  }
});


// These methods are used by the AppDispatcher code to change variables in the store
function _setLocalVoterInStore (voter) {
  _voter = voter;
}

function _setVoterId (id) {
  _voter_id = id;
  cookies.setItem("voter_id", id, Infinity);
}

function _setDeviceId (id) {
  _voter_device_id = id;
  cookies.setItem("voter_device_id", id, Infinity);
}

function _setLocation (location) {
  _location = location;
  cookies.setItem("location", location, Infinity);
}

// This block is reacting to actions triggered in BallotActions.js. We update store variables, and then emitChange
VoterStore.dispatchToken = AppDispatcher.register( action => {
  switch (action.actionType) {
    case VoterConstants.VOTER_CHANGE_LOCATION: // _setLocation
      // Update the variable value in the store
      _setLocation(action.location);
      VoterStore.emitChange();
      break;

    case VoterConstants.VOTER_RETRIEVE: // _setLocation
      // Update the variable value in the store
      _setLocalVoterInStore(action.voter);
      VoterStore.emitChange();
      break;

    default:
      break;
  }
});

export default VoterStore;
