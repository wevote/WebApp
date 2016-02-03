import { createStore } from 'utils/createStore';
import { shallowClone } from 'utils/object-utils';

const assign = require('object-assign');
const request = require('superagent');
const cookies = require('../utils/cookies');

<<<<<<< HEAD:src/js/stores/VoterStore.js
const VoterActions = require('../actions/VoterActions');
const VoterConstants = require('../constants/VoterConstants');
=======
const AppDispatcher = require('dispatcher/AppDispatcher');
const VoterConstants = require('constants/VoterConstants');

import service from 'utils/service';

const VoterActions = require('actions/VoterActions');
>>>>>>> origin/develop:src/stores/VoterStore.js
const EventEmitter = require('events').EventEmitter;
const dispatcher = require('../dispatcher/AppDispatcher');

const url = require('../config').url;

const CHANGE_EVENT = 'change';
const CHANGE_LOCATION = 'change_location';

let _location = cookies.getItem('location');
let _position = {};
let _voter_device_id = cookies.getItem('voter_device_id');
let _voter_photo_url = '';
let _voter_store = {};
let _voter_ids = [];
let _voter = {};

function addVoterToVoterStore (voter_incoming) {
  console.log("voter_incoming: " + voter_incoming.we_vote_id);
  _voter_store[voter_incoming.we_vote_id] = shallowClone(voter_incoming);
}

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
    var voterPromiseQueue = [];
    var getVoterList = this.getVoterList.bind(this);

    if (!callback || typeof callback !== 'function')
      throw new Error('VoterStore: initialize must be called with callback');

    // Do we have the Voter data stored in the browser?
    if (Object.keys(_voter_store).length)
      return callback(getVoterList());

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
            console.log('No voter_photo_url');

            voterPromiseQueue
                .push(
                VoterAPIWorker
                  .voterRetrieve()
                  .then((response) => {
                    addVoterToVoterStore(response);

                    _voter_ids.push( response.we_vote_id );

                    // this function polls requests for complete status.
                    new Promise((resolve) => {
                        var counted = [];
                        var count = 0;

                        var interval = setInterval(() => {

                            var { we_vote_id } = response;

                            _voter = _voter_store [we_vote_id];
                            console.log('_voter set.');
                            if ( _voter ) {
                                console.log('_voter photo: ' + _voter.facebook_profile_image_url_https);
                                _voter_photo_url = _voter.voter_photo_url;
                                console.log('_voter_photo_url: ' + _voter_photo_url);
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

                    }).then(() => callback(getVoterList()));
                })
            );
        }
    }
  },

  /**
   * get ballot ordered key array and ballots
   * @return {Object} ordered keys and store data
   */
  getVoterList: function () {
      var temp = [];
      _voter_ids
        .forEach( (id) =>
          temp
            .push(
              shallowClone( _voter_store[id] )
            )
        );

      return temp;
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
  }
});

AppDispatcher.register( action => {

  switch (action.actionType) {
    case VoterConstants.VOTER_RETRIEVE:
      VoterAPIWorker
        .voterRetrieve(
          () => VoterStore.emitChange()
      );
      break;
    case VoterConstants.VOTER_LOCATION_RETRIEVE:
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
