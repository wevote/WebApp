import { createStore } from 'utils/createStore';
import {shallowClone} from 'utils/object-utils';

const AppDispatcher = require('dispatcher/AppDispatcher');
const BallotConstants = require('constants/BallotConstants');

const request = require('superagent');
const config = require('../config');

let _civic_id = null;
let _ballot_store = {};
let _ballot_order = [];
let _measure_map = []; // A summary of all measures (list of we_vote_id's)
let _ballot_item_we_vote_id_list = []; // A summary of all ballot items (list of we_vote_id's)

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

function addItemsToBallotStore (data) {
  data.ballot_item_list.forEach( item => {
    _ballot_store[item.we_vote_id] = shallowClone(item);
    _ballot_order.push(item.we_vote_id);
    item.kind_of_ballot_item === MEASURE ? _measure_map.push(item.we_vote_id) : '';
    _ballot_item_we_vote_id_list.push(item.we_vote_id);
  });

  return data;
}

function setCivicId (data) {
  _civic_id = data.google_civic_election_id;
  return data;
}

// Cycle through all measures known about locally, and request the current support count
function findMeasureSupportCounts (data) {
  var count = 0;

  return new Promise ( (resolve, reject) => _measure_map
    .forEach( measure_we_vote_id => request
      .get(`${config.url}/positionSupportCountForBallotItem/`)
      .withCredentials()
      .query({ ballot_item_id: _ballot_store[measure_we_vote_id].id })
      .query({ kind_of_ballot_item: _ballot_store[measure_we_vote_id].kind_of_ballot_item })
      .end( function (err, res) {
        if (err || !res.body.success) throw err || res.body;

        _ballot_store[measure_we_vote_id].supportCount = res.body.count;

        count ++;

        if (count === _measure_map.length)
          resolve(data);

      })
    )
  );
}

// Cycle through all measures known about locally, and request the current oppose count
function findMeasureOpposeCounts ( data ) {
  var measure_count = 0;

  return new Promise ( (resolve, reject) => _measure_map
    .forEach( measure_we_vote_id => request
      .get(`${config.url}/positionOpposeCountForBallotItem/`)
      .withCredentials()
      .query({ ballot_item_id: _ballot_store[measure_we_vote_id].id })
      .query({ kind_of_ballot_item: _ballot_store[measure_we_vote_id].kind_of_ballot_item })
      .end( function (err, res) {
        if (err || !res.body.success) throw err || res.body;

        // Add the number of organizations and people in this person's network that oppose this particular measure
        _ballot_store[measure_we_vote_id].opposeCount = res.body.count;
        printErr(measure_we_vote_id + ": local id is " + _ballot_store[measure_we_vote_id].id);

        measure_count ++;

        if (measure_count === _measure_map.length)
          resolve(data);

      })
    )
  );
}

// Cycle through all ballot_items, and request the voter's current stance
function findVoterPositions ( data ) {
  var ballot_items_count = 0;

  return new Promise ( (resolve, reject) => _ballot_item_we_vote_id_list
    .forEach( we_vote_id => request
      .get(`${config.url}/voterPositionRetrieve/`)
      .withCredentials()
      .query({ ballot_item_we_vote_id: we_vote_id })
      .query({ kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item })
      .end( function (err, res) {
        if (res.body.success) {
          // Does the voter support or oppose this particular ballot item?
          _ballot_store[we_vote_id].voterSupports = res.body.is_support ? "Yes": "No";
          _ballot_store[we_vote_id].voterOpposes = res.body.is_oppose ? "Yes": "No";
          console.log(we_vote_id + ": voterSupports is " + _ballot_store[we_vote_id].voterSupports);
          console.log(we_vote_id + ": voterOpposes is " + _ballot_store[we_vote_id].voterOpposes);
        }
        else if (err) throw err || res.body;

        ballot_items_count ++;

        if (ballot_items_count === _ballot_item_we_vote_id_list.length)
          resolve(data);
      })
    )
  );
}

// Cycle through all ballot_items, and ask if the voter set a star or not?
function findVoterStarStatus ( data ) {
  var ballot_items_count = 0;

  return new Promise ( (resolve, reject) => _ballot_item_we_vote_id_list
    .forEach( we_vote_id => request
      .get(`${config.url}/voterStarStatusRetrieve/`)
      .withCredentials()
      .query({ ballot_item_id: _ballot_store[we_vote_id].id })
      .query({ kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item })
      .end( function (err, res) {
        if (res.body.success) {
          // Has the voter starred this particular ballot item?
          // is_starred is coming from API, and VoterStarred is the local variable name
          _ballot_store[we_vote_id].VoterStarred = res.body.is_starred ? "Yes": "No";
          printErr(we_vote_id + ": VoterStarred is " + _ballot_store[we_vote_id].VoterStarred);
        }
        else if (err) throw err || res.body;

        ballot_items_count ++;

        if (ballot_items_count === _ballot_item_we_vote_id_list.length)
          resolve(data);
      })
    )
  );
}

function toggleStarOn (we_vote_id) {
  console.log('toggleStarOn: ' + we_vote_id);
  return new Promise((resolve, reject) => request
    .get(`${config.url}/voterStarOnSave/`)
    .withCredentials()
    .query({ ballot_item_id: _ballot_store[we_vote_id].id })
    .query({ kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item })
    .end( function (err, res) {
      if (res.body.success) {
        _ballot_store[we_vote_id].VoterStarred = "Yes";
      }
      else if (err)
        reject(err || res.body.status);

      resolve(res.body);
    })
  );
}

function toggleStarOff (we_vote_id) {
  console.log('toggleStarOff: ' + we_vote_id);
  return new Promise((resolve, reject) => request
    .get(`${config.url}/voterStarOffSave/`)
    .withCredentials()
    .query({ ballot_item_id: _ballot_store[we_vote_id].id })
    .query({ kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item })
    .end( function (err, res) {
      if (res.body.success) {
        _ballot_store[we_vote_id].VoterStarred = "No";
      }
      else if (err)
        reject(err || res.body.status);

      resolve(res.body);
    })
  );
}

// A voter wants to show his or her support for a ballot item
function supportBallotItem (we_vote_id) {
  // TODO: Instead of incrementing this locally, request the support & oppose count via API?
  //  Or do it locally for speed, but then immediately request the count for just this ballot item
  if (typeof _ballot_store[we_vote_id] !== 'undefined')
    _ballot_store[we_vote_id].supportCount ++;

  console.log('supportBallotItem: ' + we_vote_id);
  return new Promise((resolve, reject) => request
    .get(`${config.url}/voterSupportingSave/`)
    .withCredentials()
    .query({ ballot_item_id: _ballot_store[we_vote_id].id })
    .query({ kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item })
    .end( function (err, res) {
      if (res.body.success) {
        _ballot_store[we_vote_id].VoterOpposes = "No";
        _ballot_store[we_vote_id].VoterSupports = "Yes";
        console.log(we_vote_id + ": voterSupports is " + _ballot_store[we_vote_id].voterSupports);
        console.log(we_vote_id + ": voterOpposes is " + _ballot_store[we_vote_id].voterOpposes);
      }
      else if (err)
        reject(err || res.body.status);

      resolve(res.body);
    })
  );
}

// A voter wants to rescind his or her support for a ballot item (Doesn't necessarily mean they oppose the ballot item)
function supportBallotItemOff (we_vote_id) {
  // TODO: Instead of incrementing this locally, request the support & oppose count via API?
  //  Or do it locally for speed, but then immediately request the count for just this ballot item
  if (typeof _ballot_store[we_vote_id] !== 'undefined')
    _ballot_store[we_vote_id].supportCount --;

  console.log('supportBallotItemOff: ' + we_vote_id);
  return new Promise((resolve, reject) => request
    .get(`${config.url}/voterStopSupportingSave/`)
    .withCredentials()
    .query({ ballot_item_id: _ballot_store[we_vote_id].id })
    .query({ kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item })
    .end( function (err, res) {
      if (res.body.success) {
        _ballot_store[we_vote_id].VoterSupports = "No";
        console.log(we_vote_id + ": voterSupports is " + _ballot_store[we_vote_id].voterSupports);
        console.log(we_vote_id + ": voterOpposes is " + _ballot_store[we_vote_id].voterOpposes);
      }
      else if (err)
        reject(err || res.body.status);

      resolve(res.body);
    })
  );
}

// A voter wants to show his or her opposition to a ballot item
function opposeBallotItem (we_vote_id) {
  if (typeof _ballot_store[we_vote_id] !== 'undefined')
    _ballot_store[we_vote_id].opposeCount ++;

  console.log('opposeBallotItem: ' + we_vote_id);
  return new Promise((resolve, reject) => request
    .get(`${config.url}/voterOpposingSave/`)
    .withCredentials()
    .query({ ballot_item_id: _ballot_store[we_vote_id].id })
    .query({ kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item })
    .end( function (err, res) {
      if (res.body.success) {
        _ballot_store[we_vote_id].VoterOpposes = "Yes";
        _ballot_store[we_vote_id].VoterSupports = "No";
        console.log(we_vote_id + ": voterSupports is " + _ballot_store[we_vote_id].voterSupports);
        console.log(we_vote_id + ": voterOpposes is " + _ballot_store[we_vote_id].voterOpposes);
      }
      else if (err)
        reject(err || res.body.status);

      resolve(res.body);
    })
  );
}

// A voter wants to rescind his or her opposition for a ballot item (Doesn't necessarily mean they support)
function opposeBallotItemOff (we_vote_id) {
  if (typeof _ballot_store[we_vote_id] !== 'undefined')
    _ballot_store[we_vote_id].opposeCount --;

  console.log('opposeBallotItemOff: ' + we_vote_id);
  return new Promise((resolve, reject) => request
    .get(`${config.url}/voterStopOpposingSave/`)
    .withCredentials()
    .query({ ballot_item_id: _ballot_store[we_vote_id].id })
    .query({ kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item })
    .end( function (err, res) {
      if (res.body.success) {
        _ballot_store[we_vote_id].VoterOpposes = "No";
        console.log(we_vote_id + ": voterSupports is " + _ballot_store[we_vote_id].voterSupports);
        console.log(we_vote_id + ": voterOpposes is " + _ballot_store[we_vote_id].voterOpposes);
      }
      else if (err)
        reject(err || res.body.status);

      resolve(res.body);
    })
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

    // Do we have the Ballot data stored in the browser?
    if (Object.keys(_ballot_store).length)
      callback(getItems());

    else
      // If here, we don't have any ballot items stored in the browser
      // TODO Update logic to see if there are ballot items in the We Vote DB

      // TODO If ballot items in We Vote DB...
      //getBallotItems()
      //  .then(addItemsToBallotStore)
      //  .then(setCivicId)
      //  .then(findMeasureSupportCounts)
      //  .then(findMeasureOpposeCounts)
      //  .then(data => callback(getItems()))
      //  .catch(err => console.error(err));
      //findVoterPositions()
      //  .catch(err => console.error(err))

      // TODO If no ballot items in We Vote DB, reach out to google and get fresh ballot
      // VoterStore.getLocation()
      getBallotItemsFromGoogle('2201 Wilson Blvd, Arlingon VA, 22201')
        .then(getBallotItems)
        .then(addItemsToBallotStore)
        .then(setCivicId) // setCivicId returns google_civic_election_id, which must be passed
        .then(findMeasureSupportCounts)
        .then(findMeasureOpposeCounts)
        .then(findVoterPositions)
        .then(findVoterStarStatus)
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
   * return ballot item object by we_vote_id
   * @param  {String} we_vote_id for office or measure
   * @return {Object} office or measure
   */
  getBallotItemByWeVoteId: function (we_vote_id, callback) {
     callback(shallowClone(_ballot_store[we_vote_id]));
  }
});

AppDispatcher.register( action => {
  switch (action.actionType) {
    case BallotConstants.BALLOT_SUPPORT_ON:  // supportBallotItem
      supportBallotItem(action.we_vote_id);
      BallotStore.emitChange();
      break;
    case BallotConstants.BALLOT_SUPPORT_OFF:  // supportBallotItemOff
      supportBallotItemOff(action.we_vote_id);
      BallotStore.emitChange();
      break;
    case BallotConstants.BALLOT_OPPOSE_ON:  // opposeBallotItem
      opposeBallotItem(action.we_vote_id);
      BallotStore.emitChange();
      break;
    case BallotConstants.BALLOT_OPPOSE_OFF:  // opposeBallotItemOff
      opposeBallotItemOff(action.we_vote_id);
      BallotStore.emitChange();
      break;
    case BallotConstants.STAR_ON:  // toggleStarOn
      toggleStarOn(action.we_vote_id);
      BallotStore.emitChange();
      break;
    case BallotConstants.STAR_OFF:  // toggleStarOff
      toggleStarOff(action.we_vote_id);
      BallotStore.emitChange();
      break;
  }
})

export default BallotStore;
