'use strict'
const request = require('superagent');
const cookies = require('./utils/cookies');

const url = require('config').url;

let _device_id = cookies.getItem('voter_device_id');
let _voter_id = cookies.getItem('voter_id');
let _location = cookies.getItem('location');
let _position = {};

function newVoter ( ) {
    generateDeviceId()
        .then( createVoterId )
        .then( setInitialLocation )
        .catch( console.error );
}

function generateDeviceId () {
    console.log('generating device id...');

    return new Promise ( (resolve, reject) => request
        .get(`${url}/deviceIdGenerate/`).withCredentials()
        .end( function (err, res) {
            if (err) reject(err);
            else {
                var {voter_device_id} = res.body;

                _device_id = voter_device_id;
                cookies.setItem('voter_device_id', voter_device_id);

                resolve(voter_device_id);
            }
        })
    ).catch(console.error);
}

function createVoterId (device_id) {
    console.log('creating voter id');

    return new Promise ( (resolve, reject) => request
        .get(`${url}/voterCreate/`).withCredentials()
        .end( (err, res) => {
            if (err) reject(err);
            else {
                var {voter_id} = res.body;

                _voter_id = voter_id;
                cookies.setItem('voter_id', voter_id);

                resolve(res.body.status);
            }
        })
    ).catch(console.error);
}

function setInitialLocation () {
    console.log('setting initial location...');
    console.warn(`
        we will need to configure logic & etc. for setting up a voters
        location...
    `);
    cookies.setItem('location', 'Oakland, CA');
}

function Voter () {
    if (! _device_id ) newVoter();

    this.setGeoLocation();
    return this;
}

Voter.prototype = {
    get device_id() { return _device_id; },
    get voter_id() { return _voter_id; },
    get position() { return _position; },

    /**
     * set geographical location of voter
     */
    setGeoLocation() {
        navigator.geolocation.getCurrentPosition(function (pos) {
            _position.lat = pos.coords.latitude;
            _position.long = pos.coords.longitude;
        });
    }
}

module.exports = new Voter();
