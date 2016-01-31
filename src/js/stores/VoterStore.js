'use strict'
const assign = require('object-assign');
const request = require('superagent');
const cookies = require('../utils/cookies');

const VoterActions = require('../actions/VoterActions');
const VoterConstants = require('../constants/VoterConstants');
const EventEmitter = require('events').EventEmitter;
const dispatcher = require('../dispatcher/AppDispatcher');

const url = require('../config').url;

const CHANGE_EVENT = 'change';
const CHANGE_LOCATION = 'change_location';

let _voter_device_id = cookies.getItem('voter_device_id');
let _location = cookies.getItem('location');
let _position = {};

function generateVoterDeviceId () {
    console.log('generating device id...');

    return new Promise ( (resolve, reject) => request
        .get(`${url}/deviceIdGenerate/`).withCredentials()
        .end( function (err, res) {
            if (err) reject(err);
            else {
                var {voter_device_id} = res.body;

                _voter_device_id = voter_device_id;
                cookies.setItem('voter_device_id', voter_device_id, Infinity); // Set to never expire

                resolve(voter_device_id);
            }
        })
    ).catch(console.error);
}

function createVoter () {
    console.log('creating voter id');

    return new Promise ( (resolve, reject) => request
      .get(`${url}/voterCreate/`).withCredentials()
      .end( (err, res) => {
        if (err) reject(err);
        else {
          resolve(res.body.status);
        }
      })
    ).catch(console.error);
}

/**
 * guess users location using backend service
 * @return {Promise}
 */
function guessLocation (value) {
  return new Promise ((resolve,reject) => {
    _location = 'Oakland, CA';
    cookies.setItem('location', _location);

  })
}

const VoterStore = assign({}, EventEmitter.prototype, {
  get voter_device_id() { return _voter_device_id; },
  get position() { return _position; },

  /**
   * initialize the voter when the application begins
   * @return {undefined}
   */
  initialize: function (location) {
    var promise = new Promise(resolve=> resolve());

    if (! _voter_device_id )
      promise = promise
        .then(generateVoterDeviceId)
        .then(createVoter);

    if (! _location )
      promise
        .then(guessLocation);

    return promise;
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
    console.warn(`we will need to configure logic & etc. for setting up a
voters location...
    `);

    cookies.setItem('location', location);
    VoterActions.ChangeLocation(location)

    return location;
  },

  /**
   * get the Voters location
   * @return {String} location
   */
  getLocation: function () {
    return _location;
  },

  /**
   * @param  {Function} callback
   */
  _emitChange: function (callback) {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param  {Function} callback subscribe to changes
   */
  _addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param  {Function} callback unsubscribe to changes
   */
  _removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
});

dispatcher.register( action => {
    switch(action.actionType) {
        case VoterConstants.VOTER_LOCATION_SET:
            VoterStore._emitChange();
            break;
        default:
            break;
    }
})

export default VoterStore;
