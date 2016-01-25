import { createStore } from 'utils/createStore';
import {shallowClone} from 'utils/object-utils';

const AppDispatcher = require('dispatcher/AppDispatcher');
const BallotConstants = require('constants/BallotConstants');
import { factory } from 'utils/promise-utils';

import service from 'utils/service';

const request = require('superagent');
const config = require('../config');

let _civic_id = null;
let _ballot_store = {};
let _ballot_order = [];

const MEASURE = 'MEASURE';

function printErr (err) {
  console.error(err);
}

function setCivicId (data) {
  _civic_id = data.google_civic_election_id;
  return data;
}



function addItemsToBallotStore (ballot_item_list) {
  ballot_item_list.forEach( ballot_item => {
    _ballot_store[ballot_item.we_vote_id] = shallowClone(ballot_item);
    _ballot_order.push(ballot_item.we_vote_id);
  });
}

function ballotItemIsMeasure (we_vote_id) {
  return _ballot_store[we_vote_id].kind_of_ballot_item === MEASURE;
}

const BallotAPIWorker = {
  voterBallotItemsRetrieveFromGoogleCivic: function (options) {
    return service.get({
      endpoint: 'voterBallotItemsRetrieveFromGoogleCivic',
      query: {
        text_for_map_search: options.address
      },
      success: options.success,
      error: options.error
    })
  },

  // get the ballot items
  voterBallotItemsRetrieve: function (options) {
    return service.get({
      endpoint: 'voterBallotItemsRetrieve',
      success: options.success,
      error: options.error
    });
  },

  positionOpposeCountForBallotItem: function (we_vote_id, options) {
    return service.get({
      endpoint: 'positionOpposeCountForBallotItem',
      query: {
        ballot_item_id: _ballot_store[we_vote_id].id,
        kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      },
      success: options.success,
      error: options.error
    });
  },

  // get measure support an opposition
  positionSupportCountForBallotItem: function (we_vote_id, options) {
    return service.get({
      endpoint: 'positionSupportCountForBallotItem',
      query: {
        ballot_item_id: _ballot_store[we_vote_id].id,
        kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      },
      success: options.success,
      error: options.error
    });
  },

  voterPositionRetrieve: function (we_vote_id, options){
    return service.get({
      endpoint: 'voterPositionRetrieve',
      query: {
         ballot_item_we_vote_id: we_vote_id,
         kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      },
      success: options.success,
      error : options.error
    });
  },

  voterStarStatusRetrieve: function ( we_vote_id, options ) {
    return service.get({
      endpoint: 'voterStarStatusRetrieve',
      query: {
        ballot_item_id: _ballot_store[we_vote_id].id,
        kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      },
      success: options.succes,
      error: options.error

      // this is premature success function
      //
      //_ballot_store[we_vote_id].VoterStarred = res.body.is_starred ? "Yes": "No";
      // console.log(we_vote_id + ": VoterStarred is " + _ballot_store[we_vote_id].VoterStarred);
    });
  },

  voterStopOpposingSave: function (we_vote_id, options) {
    return service.get({
      endpoint: 'voterStopOpposingSave',
      query: {
        ballot_item_id: _ballot_store[we_vote_id].id,
        kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      },
      success: options.succes,
      error: options.error
    });
  },

  voterStarOnSave: function (we_vote_id, options) {
    return service.get({
      endpoint: 'voterStarOnSave',
      query: {
        ballot_item_id: _ballot_store[we_vote_id].id,
        kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      },
      success: options.succes,
      error: options.error
    });
  },

  voterStarOffSave: function (we_vote_id, options) {
    return service.get({
      endpoint: 'voterStarOffSave',
      query: {
        ballot_item_id: _ballot_store[we_vote_id].id,
        kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      },
      success: options.succes,
      error: options.error
    });
  },

  voterSupportingSave: function (we_vote_id, options) {
    return service.get({
      endpoint: 'voterStarOffSave',
      query: {
        ballot_item_id: _ballot_store[we_vote_id].id,
        kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      },
      success: options.succes,
      error: options.error
    });

    // old success logic
    //   if (res.body.success) {
      //   _ballot_store[we_vote_id].VoterOpposes = "No";
      //   _ballot_store[we_vote_id].VoterSupports = "Yes";
      //   console.log(we_vote_id + ": voterSupports is " + _ballot_store[we_vote_id].voterSupports);
      //   console.log(we_vote_id + ": voterOpposes is " + _ballot_store[we_vote_id].voterOpposes);
      // }
  },

  voterStopSupportingSave: function (we_vote_id, options) {
    return service.get({
      endpoint: 'voterStopSupportingSave',
      query: {
        ballot_item_id: _ballot_store[we_vote_id].id,
        kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      },
      success: options.succes,
      error: options.error
    });
    // old success logic
    //
    // if (res.body.success) {
    //   _ballot_store[we_vote_id].VoterSupports = "No";
    //   console.log(we_vote_id + ": voterSupports is " + _ballot_store[we_vote_id].voterSupports);
    //   console.log(we_vote_id + ": voterOpposes is " + _ballot_store[we_vote_id].voterOpposes);
    // }
  },

  voterOpposingSave: function (we_vote_id, options) {
    return service.get({
      endpoint: 'voterOpposingSave',
      query: {
        ballot_item_id: _ballot_store[we_vote_id].id,
        kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      },
      success: options.succes,
      error: options.error
    });
    // old success logic
    // if (res.body.success) {
    //   _ballot_store[we_vote_id].VoterOpposes = "Yes";
    //   _ballot_store[we_vote_id].VoterSupports = "No";
    //   console.log(we_vote_id + ": voterSupports is " + _ballot_store[we_vote_id].voterSupports);
    //   console.log(we_vote_id + ": voterOpposes is " + _ballot_store[we_vote_id].voterOpposes);
    // }
  },

  voterStopOpposingSave: function (we_vote_id, options) {
    return service.get({
      endpoint: 'voterStopOpposingSave',
      query: {
        ballot_item_id: _ballot_store[we_vote_id].id,
        kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      },
      success: options.succes,
      error: options.error
    });
    // old success logic
    //
    // if (res.body.success) {
    //   _ballot_store[we_vote_id].VoterOpposes = "No";
    //   console.log(we_vote_id + ": voterSupports is " + _ballot_store[we_vote_id].voterSupports);
    //   console.log(we_vote_id + ": voterOpposes is " + _ballot_store[we_vote_id].voterOpposes);
    // }
  }

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
      return callback.call(getItems());
      // If here, we don't have any ballot items stored in the browser
      // TODO Update logic to see if there are ballot items in the We Vote DB

      // TODO If ballot items in We Vote DB... Do not fetch from Google Civic
    else {
        BallotAPIWorker.voterBallotItemsRetrieveFromGoogleCivic({
          address: '2201 Wilson Blvd, Arlington VA, 22201',
          success: res => console.log('voterBallotItemsRetrieveFromGoogleCivic:', res),
          error: err => console.error('voterBallotItemsRetrieveFromGoogleCivic:', err)
        })
        .then(googleResponse => BallotAPIWorker.voterBallotItemsRetrieve({
          success: function (res) {
            console.log('voterBallotItemsRetrieve', res);
            addItemsToBallotStore(res.ballot_item_list);
            console.log('done adding items to store')
          },
          error: err => console.log('voterBallotItemsRetrieve', err),
        }))
        .then( ballotItemsResponse => {
          var promiseQueue = [];

          console.log(_ballot_store)
          console.log(_ballot_order);
          _ballot_order.forEach(we_vote_id => {
            console.log(ballotItemIsMeasure(we_vote_id))
            if (ballotItemIsMeasure(we_vote_id)) {
              promiseQueue.push(
                BallotAPIWorker.positionOpposeCountForBallotItem( we_vote_id, {
                  succes: function (res) {
                    console.log(res);
                  },
                  error: err => console.error(err)
                })
              );
              promiseQueue.push(
                BallotAPIWorker.positionSupportCountForBallotItem( we_vote_id, {
                  succes: function (res) {
                    console.log(res);
                  },
                  error: err => console.error(err)
                })
              )
            }
            else {
              promiseQueue.push(
                BallotAPIWorker.voterPositionRetrieve( we_vote_id, {
                  succes: function (res) {
                    console.log(res);
                  },
                  error: err => console.error(err)
                })
              )
              promiseQueue.push(
                BallotAPIWorker.voterStarStatusRetrieve( we_vote_id, {
                  succes: function (res) {
                    console.log(res);
                  },
                  error: err => console.error(err)
                })
              )
            }
          });

          console.log(promiseQueue)


        });
    }
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
  },

  /**
   * return google_civic_election_id
   * @return {String} google_civic_election_id
   */
  getCivicId: function () {
     return _civic_id;
  },
});

AppDispatcher.register( action => {
  switch (action.actionType) {
    case BallotConstants.BALLOT_SUPPORT_ON:  // supportOnToAPI
      supportOnToAPI(action.we_vote_id);
      BallotStore.emitChange();
      break;
    case BallotConstants.BALLOT_SUPPORT_OFF:  // supportOffToAPI
      supportOffToAPI(action.we_vote_id);
      BallotStore.emitChange();
      break;
    case BallotConstants.BALLOT_OPPOSE_ON:  // opposeOnToAPI
      opposeOnToAPI(action.we_vote_id);
      BallotStore.emitChange();
      break;
    case BallotConstants.BALLOT_OPPOSE_OFF:  // opposeOffToAPI
      opposeOffToAPI(action.we_vote_id);
      BallotStore.emitChange();
      break;
    case BallotConstants.STAR_ON:  // starOnToAPI
      starOnToAPI(action.we_vote_id);
      BallotStore.emitChange();
      break;
    case BallotConstants.STAR_OFF:  // starOffToAPI
      starOffToAPI(action.we_vote_id);
      BallotStore.emitChange();
      break;
  }
})

export default BallotStore;
