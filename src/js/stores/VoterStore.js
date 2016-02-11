import { createStore } from '../utils/createStore';
import { shallowClone } from '../utils/object-utils';
import service from '../utils/service';

const AppDispatcher = require('../dispatcher/AppDispatcher');
const assign = require('object-assign');
const CHANGE_EVENT = 'change';
const CHANGE_LOCATION = 'change_location';
const cookies = require('../utils/cookies');
const EventEmitter = require('events').EventEmitter;
const url = require('../config').url;
const VoterActions = require('../actions/VoterActions');
const VoterConstants = require('../constants/VoterConstants');

let _location = cookies.getItem('location');
let _position = {};
let _voter_device_id = cookies.getItem('voter_device_id');
let _voter_photo_url = '';
let _voter_ids = [];
let _voter = {};

const VoterAPIWorker = {
  generateVoterDeviceId: function ( results ) {
    console.log('generating device id...');

    return service.get({
      endpoint: 'deviceIdGenerate',
      results
    });
  },

  createVoter: function ( results ) {
    console.log('creating voter id');

    return service.get({
      endpoint: 'voterCreate',
      results
    });
  },

  voterLocationRetrieveFromIP: function ( results ) {
    console.log('retrieve location from IP');

    return service.get({
      endpoint: 'voterLocationRetrieveFromIP',
      results
    });
  },

  voterRetrieve: function ( results ) {
    return service.get({
      endpoint: 'voterRetrieve',
      results
    });
  }
};

const VoterStore = createStore({
  get position() { return _position; },
  get voter_device_id() { return _voter_device_id; },
  get voter_photo_url() { return _voter_photo_url; },

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
        voterPromiseQueue
          .push (
            VoterAPIWorker
                .generateVoterDeviceId()
                .then ( (response) => {
                  _voter_device_id = response.voter_device_id;

                  cookies.setItem('voter_device_id', _voter_device_id, Infinity); // Set to never expire
                })
          );

        voterPromiseQueue
          .push (
            VoterAPIWorker
                .createVoter()
          );
        }

        if (! _location ) {
          voterPromiseQueue
            .push (
              VoterAPIWorker
                .voterLocationRetrieveFromIP()
                  .then ( (response) => {
                    _location = response.voter_location;

                    cookies.setItem('location', _location);
                  })
              );
        }

        if (! _voter_photo_url ) {

            voterPromiseQueue
                .push(
                VoterAPIWorker
                  .voterRetrieve()
                  .then((response) => {
                    //addVoterToVoterStore(response);

                    //_voter_ids.push( response.we_vote_id );
                    _voter = assign({}, response);

                    // this function polls requests for complete status.
                    new Promise((resolve) => {
                        var counted = [];
                        var count = 0;

                        var interval = setInterval(() => {

                            var { we_vote_id } = response;

                            //_voter = _voter_store [we_vote_id];
                            // TODO: Deprecate this?
                            if ( _voter ) {
                                _voter_photo_url = _voter.voter_photo_url;
                            }

                            if (counted.indexOf(we_vote_id) < 0) {
                                count += 1;  // TODO Why was this 4?
                                counted.push(we_vote_id);
                            }

                            if (count === voterPromiseQueue.length && voterPromiseQueue.length !== 0) {
                                clearInterval(interval);
                                Promise.all(voterPromiseQueue).then(resolve);
                            }

                        }, 1000);

                    }).then(() => callback(getVoterObject()));
                })
            );
        }
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
  },

  voterRetrieveFresh: function (callback) {
    console.log('voterRetrieveFresh ');
    var voterPromiseQueue = [];
    var getVoterObject = this.getVoterObject.bind(this);

    if (!callback || typeof callback !== 'function')
      throw new Error('VoterStore: voterRetrieveFresh must be called with callback');

    voterPromiseQueue
        .push(
        VoterAPIWorker
          .voterRetrieve()
          .then((response) => {
            //addVoterToVoterStore(response);
            //
            //_voter_ids.push( response.we_vote_id );
            _voter = assign({}, response);

            // this function polls requests for complete status.
            new Promise((resolve) => {
                var counted = [];
                var count = 0;

                var interval = setInterval(() => {

                    var { we_vote_id } = response;

                    if (counted.indexOf(we_vote_id) < 0) {
                        count += 1;
                        counted.push(we_vote_id);
                    }

                    if (count === voterPromiseQueue.length && voterPromiseQueue.length !== 0) {
                        clearInterval(interval);
                        Promise.all(voterPromiseQueue).then(resolve);
                    }

                }, 1000);

            }).then(() => callback(getVoterObject()));
        })
    );
  },

  /**
   */
  emitChange: function () {
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
  }
});

AppDispatcher.register( action => {

  switch (action.actionType) {
    case VoterConstants.VOTER_LOCATION_RETRIEVE: // ChangeLocation
      VoterAPIWorker
        .voterLocationRetrieveFromIP(
          () => VoterStore.emitChange()
      );
      break;
    case VoterConstants.VOTER_RETRIEVE: // voterRetrieve
      VoterAPIWorker
        .voterRetrieve(
          () => VoterStore.emitChange()
      );
      break;
    default:
      break;
  }
});

export default VoterStore;
