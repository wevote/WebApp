'use strict';
const assign = require('object-assign');
const request = require('superagent');
const EventEmitter = require('events').EventEmitter;

const dispatcher = require('../dispatcher/AppDispatcher');
const BallotConstants = require('../constants/BallotConstants');
const BallotActions = require('../actions/BallotActions');

const config = require('../config');

const CHANGE_EVENT = 'change';
const MEASURE = 'MEASURE';

let _civic_id = null;
let _ballot_store = {};
let _candidate_store = {};
let _ballot_order = [];

function shallowClone (obj) {
    let target = {};
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            target[i] = obj[i];
        }
    }
    return target;
}

function cloneWithCandidates (obj) {
    let target = {};
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            if (i === 'candidate_list') {
                target[i] = [];
                obj[i].forEach(c =>
                    target[i].push(shallowClone(_candidate_store[c]))
                )
            } else {
                target[i] = obj[i];
            }
        }
    }
    return target;
}

function printErr (err) {
    console.error(err);
}

function getBallotItemsFromGoogle (text_for_map_search) {
    return new Promise((resolve, reject) => request
        .get(`${config.url}/voterBallotItemsRetrieveFromGoogleCivic/`)
        .withCredentials()
        .query(config.test)
        .query({ text_for_map_search })
        .end( function (err, res) {
            if (err || !res.body.success)
                reject(err || res.body.status);
            else
                resolve(res.body);

        })
    );
}

function getBallotItems () {
    return new Promise( (resolve, reject) => request
        .get(`${config.url}/voterBallotItemsRetrieve/`)
        .withCredentials()
        .query(config.test)
        .end( function (err, res) {
            if (err || !res.body.success)
                reject(err || res.body.status);
            else
                resolve(res.body);
        })
    )
}

function addItemsToStore (data) {
    data.ballot_item_list.forEach( item => {
        _ballot_store[item.we_vote_id] = shallowClone(item);
        _ballot_order.push(item.we_vote_id);
    });

    return data;
}

function setCivicId (data) {
    _civic_id = data.google_civic_election_id;
    return data;
}

function getBallotItemsInfo (callback) {
    let count = 0;

    return function (data) {
        new Promise ( (resolve, reject) => {
            data.ballot_item_list.forEach( item => new Promise(
                (_resolve, _reject) => request
                    .get(`${config.url}/ballotItemRetrieve/`)
                    .withCredentials()
                    .query({ ballot_item_we_vote_id: item.we_vote_id })
                    .query({ kind_of_ballot_item: item.kind_of_ballot_item })
                    .query({ ballot_item_id: '' })
                    .end( (err, res) => {
                        if (err || !res.body.success)
                          _reject(err || res.body.status);

                        _resolve(res.body);
                    })
                )
                .then( function (value) {
                    callback(value);
                    count++;
                    if (count === data.ballot_item_list.length) {
                        BallotActions.AllItemsAdded({
                            actionType: BallotConstants.BALLOT_ALL_ITEMS_ADDED,
                            _ballot_store
                        })
                    }
                })
                .catch(printErr)
            )
            resolve(data);
        })
        .catch(printErr);

        return data;
    }
}

function addBallotItemToStore (data) {
    _ballot_store[data.we_vote_id] = shallowClone(data);
    return data;
}

function getCandidatesById (callback) {
    let count = 0;

    return function (data) {
        new Promise ( (resolve, reject) => {
            data.ballot_item_list.forEach( (item, index) => {

                // don't retrieve candidates for measures
                if ( item.kind_of_ballot_item === MEASURE )
                    return count ++ ;

                new Promise( (_resolve, _reject) => request
                    .get(`${config.url}/candidatesRetrieve/`)
                    .withCredentials()
                    .query({ office_we_vote_id: item.we_vote_id })
                    .query({ office_id: ''})
                    .end( (err, res) => {
                        if (err || !res.body.success)
                          _reject(err || res.body.status);

                        _resolve(res.body);

                    })
                )
                .then ( getSupporters )
                .then ( getOpposition )
                .then( function (value) {
                    callback(value);
                    count ++;
                    if (count === data.ballot_item_list.length) {
                        BallotActions.AllCandidatesAdded({
                            actionType: BallotConstants.BALLOT_ALL_CANDIDATES_ADDED,
                            _candidate_store
                        })
                    }
                })
                .catch( err => {
                    console.error(err);
                })
            })
            resolve(data);
        })
        .catch(printErr);

        return data;
    }
}

function getSupporters (value) {
  let count = 0;

  return new Promise ( function (resolve, reject) {
    value.candidate_list.forEach( (candidate, id) => {
      request.get(`${config.url}/positionSupportCountForBallotItem/`)
        .withCredentials()
        .query({ candidate_id: candidate.id})
        .end( (err, res) => {
            if (err)
              reject(err);

            value.candidate_list[count ++].supportCount = res.body.count;

            if (count === value.candidate_list.length) {
              resolve(value);
            }

        })
    })
  }).catch( value );
}

function getOpposition (value) {
  let count = 0;

  return new Promise ( function (resolve, reject) {
    value.candidate_list.forEach( (candidate, id) => {
      request.get(`${config.url}/positionOpposeCountForBallotItem/`)
        .withCredentials()
        .query({ candidate_id: candidate.id })
        .end( (err, res) => {
            if (err)
              reject(err);

            value.candidate_list[count ++].opposeCount = res.body.count;

            if (count === value.candidate_list.length)
              resolve(value);


        })
    })
  })
}

function addCandidatesToStore(data) {
    var store = _ballot_store[data.office_we_vote_id];
    store.candidate_list = [];

    data.candidate_list.forEach(candidate => {
        var candidate_id = candidate.we_vote_id;
        store.candidate_list.push(candidate_id);
        _candidate_store[candidate_id] = shallowClone(candidate);
    });

    return data;
}

const BallotStore = assign({}, EventEmitter.prototype, {
    /**
     * initialize the ballot store with data
     * @return {Boolean}
     */
    initialize: function (location) {
        return new Promise( resolve => {
            getBallotItemsFromGoogle(location)
                .then(getBallotItems)
                .then(addItemsToStore)
                .then(setCivicId)
                .then(getBallotItemsInfo(addBallotItemToStore))
                .then(getCandidatesById(addCandidatesToStore))
                .catch(err => console.error(err));

            resolve(location);
        }).catch(err => console.error(err))
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

    /**
     * get ballot ordered key array and ballots
     * @return {Object} ordered keys and store data
     */
    getOrderedBallotItems: function () {
        var temp = [];
        _ballot_order.forEach(we_vote_id => temp
            .push(shallowClone(_ballot_store[we_vote_id]))
        )
        return temp;
    },

    /**
     * return list of all candidates
     * @return {Array} array of candidates
     */
    getCandidateById: function (id) {
      return _candidate_store[id];
    },

    /**
     * return candidate object by id
     * @param  {Number} id candidate's we_vote_id
     * @return {Object}    candidate
     */
    getCandidateByBallotId: function (id) {
        var temp = [];

        if ( _ballot_store[id].kind_of_ballot_item === MEASURE )
            return temp;

        _ballot_store[id].candidate_list.forEach( candidate_id =>
            temp.push(_candidate_store[candidate_id])
        );

        return temp;
    },

    /**
     * return candidate object by id
     * @param  {Number} id candidate's we_vote_id
     * @return {Object}    candidate
     */
    getBallotItemById: function (id) {
        return shallowClone(_ballot_store[id]);
    }
});

dispatcher.register( action => {
    switch (action.actionType) {
        case BallotConstants.BALLOT_ALL_CANDIDATES_ADDED:
            BallotStore._emitChange();
            break;
        case BallotConstants.BALLOT_ALL_ITEMS_ADDED:
            //BallotStore._emitChange();
            break;
        default:
            console.warn('default');
            break;
    }
});

module.exports = BallotStore;
