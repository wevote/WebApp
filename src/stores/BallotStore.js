import { createStore } from 'utils/createStore';
import { shallowClone } from 'utils/object-utils';

const AppDispatcher = require('dispatcher/AppDispatcher');
const BallotConstants = require('constants/BallotConstants');

import service from 'utils/service';

let _ballot_store = {};
let _ballot_order_ids = [];
let _google_civic_election_id = null;

const MEASURE = 'MEASURE';
const CANDIDATE = 'CANDIDATE';

function addItemsToBallotStore (ballot_item_list) {
  ballot_item_list.forEach( ballot_item => {
    _ballot_store[ballot_item.we_vote_id] = shallowClone(ballot_item);
  });
}

function ballotItemIsMeasure (we_vote_id) {
  return _ballot_store[we_vote_id].kind_of_ballot_item === MEASURE;
}

const BallotAPIWorker = {
  voterBallotItemsRetrieveFromGoogleCivic: function (text_for_map_search, success ) {
    return service.get({
      endpoint: 'voterBallotItemsRetrieveFromGoogleCivic',
      query: { text_for_map_search }, success
    });
  },

  candidatesRetrieve: function (office_we_vote_id, success ) {
    return service.get({
      endpoint: 'candidatesRetrieve',
      query: { office_we_vote_id },
      success
    });
  },

  // get the ballot items
  voterBallotItemsRetrieve: function ( success ) {
    return service.get({
      endpoint: 'voterBallotItemsRetrieve',
      success
    });
  },

  positionOpposeCountForBallotItem: function (ballot_item_id, kind_of_ballot_item, success ) {
    return service.get({
      endpoint: 'positionOpposeCountForBallotItem',
      query: { ballot_item_id, kind_of_ballot_item },
      success
    });
  },

  // get measure support an opposition
  positionSupportCountForBallotItem: function (ballot_item_id, kind_of_ballot_item, success ) {
    return service.get({
      endpoint: 'positionSupportCountForBallotItem',
      query: { ballot_item_id, kind_of_ballot_item },
      success
    });
  },

  voterPositionRetrieve: function (we_vote_id, success ){
    return service.get({
      endpoint: 'voterPositionRetrieve',
      query: {
         ballot_item_we_vote_id: we_vote_id,
         kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      }, success
    });
  },

  voterStarStatusRetrieve: function ( we_vote_id, success ) {
    return service.get({
      endpoint: 'voterStarStatusRetrieve',
      query: {
        ballot_item_id: _ballot_store[we_vote_id].id,
        kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      }, success
    });
  },

  voterStopOpposingSave: function (we_vote_id, success ) {
    return service.get({
      endpoint: 'voterStopOpposingSave',
      query: {
        ballot_item_id: _ballot_store[we_vote_id].id,
        kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      }, success
    });
  },

  voterStarOnSave: function (we_vote_id, success ) {
    return service.get({
      endpoint: 'voterStarOnSave',
      query: {
        ballot_item_id: _ballot_store[we_vote_id].id,
        kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      }, success
    });
  },

  voterStarOffSave: function (we_vote_id, success ) {
    return service.get({
      endpoint: 'voterStarOffSave',
      query: {
        ballot_item_id: _ballot_store[we_vote_id].id,
        kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      }, success
    });
  },

  voterSupportingSave: function (we_vote_id, success ) {
    return service.get({
      endpoint: 'voterStarOffSave',
      query: {
        ballot_item_id: _ballot_store[we_vote_id].id,
        kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      }, success
    });
  },

  voterStopSupportingSave: function (we_vote_id, success ) {
    return service.get({
      endpoint: 'voterStopSupportingSave',
      query: {
        ballot_item_id: _ballot_store[we_vote_id].id,
        kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      }, success
    });
  },

  voterOpposingSave: function (we_vote_id, success ) {
    return service.get({
      endpoint: 'voterOpposingSave',
      query: {
        ballot_item_id: _ballot_store[we_vote_id].id,
        kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      }, success
    });
  },

  voterStopOpposingSave: function (we_vote_id, success ) {
    return service.get({
      endpoint: 'voterStopOpposingSave',
      query: {
        ballot_item_id: _ballot_store[we_vote_id].id,
        kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      }, success
    });
  }

};

const BallotStore = createStore({
  /**
   * initialize the ballot store with data, if no data
   * and callback with the ordered items
   * @return {Boolean}
   */
  initialize: function (callback) {
    var promiseQueue = [];
    var getOrderedBallotItems = this.getOrderedBallotItems.bind(this);

    if (!callback || typeof callback !== 'function')
      throw new Error('initialize must be called with callback');

    // Do we have the Ballot data stored in the browser?
    if (Object.keys(_ballot_store).length)
      return callback(getOrderedBallotItems());

    else {

      BallotAPIWorker
        .voterBallotItemsRetrieve ()
        .then( (res) => {

          addItemsToBallotStore (
            res.ballot_item_list
          );

          _ballot_order_ids = res.ballot_item_list.map( (ballot) => ballot.we_vote_id );
          _google_civic_election_id = res.google_civic_election_id;

          console.log( 'BallotStore:', _ballot_store );
          console.log( 'BallotOrder:', _ballot_order_ids );

          _ballot_order_ids.forEach( we_vote_id => {

            console.log('is', we_vote_id, 'measure?', ballotItemIsMeasure(we_vote_id));

            promiseQueue
              .push(
                BallotAPIWorker
                  .voterStarStatusRetrieve(we_vote_id)
                  .then ( (res) => _ballot_store[we_vote_id].is_starred = res.is_starred )
            );

            if ( ballotItemIsMeasure(we_vote_id) ) {
              promiseQueue
                .push (
                  BallotAPIWorker
                    .positionOpposeCountForBallotItem( we_vote_id )
              );

              promiseQueue
                .push (
                  BallotAPIWorker
                    .positionSupportCountForBallotItem( we_vote_id )
              );

            } else {

              promiseQueue
                .push(

                  BallotAPIWorker
                    .candidatesRetrieve ( we_vote_id )
                    .then( (response) => {
                      var cand_list = _ballot_store [
                        response.office_we_vote_id
                      ] . candidate_list = [];

                      response
                        .candidate_list
                          .forEach( (candidate) => {
                            var { we_vote_id: candidate_id } = candidate;
                            cand_list . push (candidate_id);
                            _ballot_store [ candidate_id ] = shallowClone( candidate );


                            promiseQueue
                              .push (
                                BallotAPIWorker
                                  .positionOpposeCountForBallotItem (
                                    candidate.id, CANDIDATE
                                  )
                                  .then( (res) =>
                                    _ballot_store [
                                      candidate.we_vote_id
                                    ] . opposeCount = res.count
                                  )
                            );

                            promiseQueue
                              .push (
                                BallotAPIWorker
                                  .positionSupportCountForBallotItem (
                                    candidate.id, CANDIDATE
                                  )
                                  .then( (res) =>
                                    _ballot_store [
                                      candidate.we_vote_id
                                    ] . supportCount = res.count
                                  )
                            );

                            promiseQueue
                              .push(
                                BallotAPIWorker
                                  .voterStarStatusRetrieve(candidate.we_vote_id)
                                  .then ( (res) => _ballot_store [
                                      candidate.we_vote_id
                                    ] . is_starred = res.is_starred
                                  )
                            );
                          });
                    })
                );
            }
          });

          // this function polls requests for complete status.
          new Promise ( (resolve) => {
            var counted = [];
            var count = 0;

            var interval = setInterval ( () => {

              res.ballot_item_list.forEach( (item) => {
                var { we_vote_id } = item;

                item = _ballot_store [we_vote_id];

                if ( ballotItemIsMeasure(we_vote_id) && counted.indexOf(we_vote_id) < 0 ) {
                  count += 3;
                  counted.push(we_vote_id);
                } else
                  if ( item.candidate_list && counted.indexOf(we_vote_id) < 0 ) {
                    count += 2 + item.candidate_list.length * 3;
                    counted.push(we_vote_id);
                  }
              });

              if (count === promiseQueue.length && promiseQueue.length !== 0) {
                clearInterval(interval);
                resolve(getOrderedBallotItems());
              }

            }, 1000);

          }).then(callback);
        });
    }
  },

  /**
   * get ballot ordered key array and ballots
   * @return {Object} ordered keys and store data
   */
  getOrderedBallotItems: function () {
      var temp = [];
      _ballot_order_ids
        .forEach( (id) =>
          temp
            .push(
              shallowClone( _ballot_store[id] )
            )
        );

      return temp;
  },

  /**
   * get the star state of a ballot item by its id
   * @param  {String} id ballot items we_vote_id
   * @return {Boolean}    is the item starred or not
   */
  getStarState: function (id) {
    return _ballot_store[id].is_starred;
  },

  /**
   * return ballot item object by we_vote_id
   * @param  {String} we_vote_id for office or measure
   * @return {Object} office or measure
   */
  getCandidateById: function (ballot_id, cand_id) {
    return _ballot_store [
        ballot_id
      ] . candidate_list.indexOf(cand_id) > -1

    ? shallowClone( _ballot_store[cand_id] ) : undefined;
  },

  getCandidatesForBallot: function (ballot_id) {
    return _ballot_store [
      ballot_id
    ].candidate_list.map( id => this.getCandidateById(ballot_id, id) ) || undefined;
  },

  /**
   * return google_civic_election_id
   * @return {String} google_civic_election_id
   */
  getGoogleCivicElectionId: function () {
     return _google_civic_election_id;
  }
});

 /**
 * toggle the star state of a ballot item by its id and return the state
 * @param  {string} we_vote_id identifier for lookup in stored
 * @return {Boolean} starred or not starred
 */
function toggleStarState(we_vote_id) {
  var item = _ballot_store[we_vote_id];
  item.is_starred = ! item.is_starred;
  console.log(_ballot_store[we_vote_id]);
  return true;
}

AppDispatcher.register( action => {
  var { we_vote_id: id } = action;

  switch (action.actionType) {
    case BallotConstants.VOTER_SUPPORTING_SAVE:
      BallotAPIWorker
        .voterSupportingSave(
          id, () => BallotStore.emitChange()
      );
      break;
    case BallotConstants.VOTER_STOP_SUPPORTING_SAVE:
      BallotAPIWorker.voterStopSupportingSave(id);
      BallotStore.emitChange();
      break;
    case BallotConstants.VOTER_OPPOSING_SAVE:
      BallotAPIWorker.voterOpposingSave(id);
      BallotStore.emitChange();
      break;
    case BallotConstants.VOTER_STOP_OPPOSING_SAVE:
      BallotAPIWorker.voterStopOpposingSave(id);
      BallotStore.emitChange();
      break;
    case BallotConstants.VOTER_STAR_ON_SAVE:
      BallotAPIWorker
        .voterStarOnSave(
          id, () => toggleStarState(id) && BallotStore.emitChange()
      );
      break;
    case BallotConstants.VOTER_STAR_OFF_SAVE:
      BallotAPIWorker
        .voterStarOffSave(
          id, () => BallotStore.emitChange()
      );
    ;
      break;
  }
})

export default BallotStore;
