import { createStore } from 'utils/createStore';
import {shallowClone} from 'utils/object-utils';

const AppDispatcher = require('dispatcher/AppDispatcher');
const BallotConstants = require('constants/BallotConstants');

const request = require('superagent');
const config = require('../config');

let _civic_id = null;
let _ballot_store = {};
let _ballot_order = [];
let _measure_map = [];

const MEASURE = 'MEASURE';

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
    item.kind_of_ballot_item === MEASURE ? _measure_map.push(item.we_vote_id) : '';
  });

  return data;
}

function setCivicId (data) {
  _civic_id = data.google_civic_election_id;
  return data;
}

function findMeasureSupport (data) {
  var count = 0;

  return new Promise ( (resolve, reject) => _measure_map
    .forEach( measure_id => request
      .get(`${config.url}/positionSupportCountForBallotItem/`)
      .withCredentials()
      .query({ measure_id: _ballot_store[measure_id].id })
      .end( function (err, res) {
        if (err || !res.body.success) throw err || res.body;

        _ballot_store[measure_id].supportCount = res.body.count;

        count ++;

        if (count === _measure_map.length)
          resolve(data);

      })
    )
  );
}

function findMeasureOppose ( data ) {
  var count = 0;

  return new Promise ( (resolve, reject) => _measure_map
    .forEach( measure_id => request
      .get(`${config.url}/positionOpposeCountForBallotItem/`)
      .withCredentials()
      .query({ measure_id: _ballot_store[measure_id].id })
      .end( function (err, res) {
        if (err || !res.body.success) throw err || res.body;

        _ballot_store[measure_id].opposeCount = res.body.count;

        count ++;

        if (count === _measure_map.length)
          resolve(data);

      })
    )
  );
}

const BallotStore = createStore({
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
        .then(findMeasureSupport)
        .then(findMeasureOppose)
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
  getBallotItemById: function (id, callback) {
     callback(shallowClone(_ballot_store[id]));
  }
});

function opposeBallotItem (id) {
  _ballot_store[id].opposeCount ++;
}

function supportBallotItem (id) {
  _ballot_store[id].supportCount ++;
}

AppDispatcher.register( action => {
  switch (action.actionType) {
    case BallotConstants.BALLOT_SUPPORTED:
      supportBallotItem(action.id);
      BallotStore.emitChange();
      break;
    case BallotConstants.BALLOT_OPPOSED:
      opposeBallotItem(action.id);
      BallotStore.emitChange();
      break;
  }
})

export default BallotStore;
