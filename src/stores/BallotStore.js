'use strict';
const assign = require('object-assign');
const request = require('superagent');

const config = require('../config');

let _civic_id = null;
let _ballot_store = {};
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

const BallotStore = {
    /**
     * initialize the ballot store with data, if no data
     * and callback with the ordered items
     * @return {Boolean}
     */
    initialize: function (callback) {
      var getItems = this.getOrderedBallotItems.bind(this);

      if (!callback || typeof callback !== 'function')
        throw new Error('initialize must be called with callback');

      if (Object.keys(_ballot_store).length)
        callback(getItems());

      else
        getBallotItemsFromGoogle('2201 Wilson Blvd, Arlingon VA, 22201')
          .then(getBallotItems)
          .then(addItemsToStore)
          .then(setCivicId)
          .then(data => callback(getItems()))
          .catch(err => console.error(err));
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
     * return candidate object by id
     * @param  {Number} id candidate's we_vote_id
     * @return {Object}    candidate
     */
    getBallotItemById: function (id) {
        return shallowClone(_ballot_store[id]);
    }
};

module.exports = BallotStore;
