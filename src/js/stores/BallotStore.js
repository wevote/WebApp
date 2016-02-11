import service from '../utils/service';
import { createStore } from '../utils/createStore';
import { shallowClone } from '../utils/object-utils';

const AppDispatcher = require('../dispatcher/AppDispatcher');
const BallotConstants = require('../constants/BallotConstants');


let _ballot_store = {};
let _ballot_order_ids = [];
let _google_civic_election_id = null;

const MEASURE = 'MEASURE';

function addItemsToBallotStore (ballot_item_list) {
  ballot_item_list.forEach( ballot_item => {
    _ballot_store[ballot_item.we_vote_id] = shallowClone(ballot_item);
    _ballot_store[ballot_item.we_vote_id].opposeCount = 0;
    _ballot_store[ballot_item.we_vote_id].supportCount = 0;
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

  positionOpposeCountForBallotItem: function (we_vote_id, success ) {
    return service.get({
      endpoint: 'positionOpposeCountForBallotItem',
      query: {
         ballot_item_id: _ballot_store[we_vote_id].id,
         kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      }, success
    });
  },

  // get measure support an opposition
  positionSupportCountForBallotItem: function (we_vote_id, success ) {
    return service.get({
      endpoint: 'positionSupportCountForBallotItem',
      query: {
         ballot_item_id: _ballot_store[we_vote_id].id,
         kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      }, success
    });
  },

  voterPositionRetrieve: function ( ballot_item_we_vote_id, success )  {
    return service.get({
      endpoint: 'voterPositionRetrieve',
      query: {
        ballot_item_we_vote_id: ballot_item_we_vote_id,
        kind_of_ballot_item: _ballot_store[ballot_item_we_vote_id].kind_of_ballot_item
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
    console.log('voterSupportingSave, we_vote_id:, ', we_vote_id);
    return service.get({
      endpoint: 'voterSupportingSave',
      query: {
        ballot_item_id: _ballot_store[we_vote_id].id,
        kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      }, success
    });
  },

  voterStopSupportingSave: function (we_vote_id, success ) {
    console.log('voterStopSupportingSave, we_vote_id:, ', we_vote_id);
    return service.get({
      endpoint: 'voterStopSupportingSave',
      query: {
        ballot_item_id: _ballot_store[we_vote_id].id,
        kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      }, success
    });
  },

  voterOpposingSave: function (we_vote_id, success ) {
    console.log('voterOpposingSave, we_vote_id:, ', we_vote_id);
    return service.get({
      endpoint: 'voterOpposingSave',
      query: {
        ballot_item_id: _ballot_store[we_vote_id].id,
        kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      }, success
    });
  },

  voterStopOpposingSave: function (we_vote_id, success ) {
    console.log('voterStopOpposingSave, we_vote_id:, ', we_vote_id);
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
              .push (
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

              promiseQueue
                .push (
                  BallotAPIWorker
                    .voterPositionRetrieve( we_vote_id )
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
                            var { we_vote_id: candidate_we_vote_id } = candidate;
                            cand_list . push (candidate_we_vote_id);
                            _ballot_store [ candidate_we_vote_id ] = shallowClone( candidate );

                            promiseQueue
                              .push (
                                BallotAPIWorker
                                  .positionOpposeCountForBallotItem (candidate_we_vote_id)
                                  .then( (res) =>
                                    _ballot_store [
                                      candidate_we_vote_id
                                    ] . opposeCount = res.count
                                  )
                            );

                            promiseQueue
                              .push (
                                BallotAPIWorker
                                  .positionSupportCountForBallotItem (candidate_we_vote_id)
                                  .then( (res) =>
                                    _ballot_store [
                                      candidate_we_vote_id
                                    ] . supportCount = res.count
                                  )
                            );

                            promiseQueue
                              .push(
                                BallotAPIWorker
                                  .voterStarStatusRetrieve(candidate_we_vote_id)
                                  .then ( (res) =>
                                    _ballot_store [
                                      candidate_we_vote_id
                                    ] . is_starred = res.is_starred
                                  )
                            );

                            promiseQueue
                              .push(
                                BallotAPIWorker
                                  .voterPositionRetrieve(candidate_we_vote_id)
                                  .then ( (res) => {
                                    _ballot_store [
                                      candidate_we_vote_id
                                    ] . is_oppose = res.is_oppose;

                                    _ballot_store [
                                      candidate_we_vote_id
                                    ] . is_support = res.is_support;
                                  })
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
                  // We are incrementing by 4 because... ???
                  count += 4;
                  counted.push(we_vote_id);
                } else
                  if ( item.candidate_list && counted.indexOf(we_vote_id) < 0 ) {
                  // We are incrementing by 2 because... ???
                    count += 2 + item.candidate_list.length * 4;
                    counted.push(we_vote_id);
                  }
              });

              if (count === promiseQueue.length && promiseQueue.length !== 0) {
                clearInterval(interval);
                Promise.all(promiseQueue).then(resolve);
              }

            }, 1000);

          }).then(() => callback(getOrderedBallotItems()));
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
   * get the number of orgs and friends that the Voter follows who support this ballot item
   * @param  {String} we_vote_id ballot items we_vote_id
   * @return {Boolean} is the item starred or not?
   */
  getSupportCount: function (we_vote_id) {
    return _ballot_store[we_vote_id].supportCount;
  },

  /**
   * get the number of orgs and friends that the Voter follows who oppose this ballot item
   * @param  {String} we_vote_id ballot items we_vote_id
   * @return {Boolean} is the item starred or not?
   */
  getOpposeCount: function (we_vote_id) {
    return _ballot_store[we_vote_id].opposeCount;
  },

  /**
   * get the ballot item by its we_vote_id, and return whether the voter opposes or not
   * @param  {String} we_vote_id for the ballot item
   * @return {Boolean} is the item supported by the voter or not?
   */
  getIsSupportState: function (we_vote_id) {
    return _ballot_store[we_vote_id].is_support;
  },

  /**
   * get the ballot item by its we_vote_id, and return whether the voter opposes or not
   * @param  {String} we_vote_id for the ballot item
   * @return {Boolean} is the item opposed by voter or not?
   */
  getIsOpposeState: function (we_vote_id) {
    return _ballot_store[we_vote_id].is_oppose;
  },

  /**
   * get the ballot item by its we_vote_id, and return whether the voter has starred it or not
   * @param  {String} we_vote_id for the ballot item
   * @return {Boolean} is the item opposed by voter or not?
   */
  getStarState: function (we_vote_id) {
    return _ballot_store[we_vote_id].is_starred;
  },

  getCandidateByWeVoteId: function (candidate_we_vote_id) {
    return shallowClone (
      _ballot_store [ candidate_we_vote_id ]
    ) || null;
  },

  getBallotItemByWeVoteId: function (ballot_item_we_vote_id) {
    return shallowClone (
      _ballot_store [ ballot_item_we_vote_id ]
    ) || null;
  },

  /**
   * return ballot item object by we_vote_id
   * @param  {String} we_vote_id for office or measure
   * @return {Object} office or measure
   */
  getCandidateById: function (office_we_vote_id, candidate_we_vote_id) {
    return _ballot_store [
        office_we_vote_id
      ] . candidate_list.indexOf(candidate_we_vote_id) > -1

    ? shallowClone( _ballot_store[candidate_we_vote_id] ) : undefined;
  },

  getCandidatesForBallot: function (office_we_vote_id) {
    return _ballot_store [
      office_we_vote_id
    ].candidate_list.map( candidate_we_vote_id => this.getCandidateById(office_we_vote_id, candidate_we_vote_id) ) || undefined;
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
 * toggle the star state of a ballot item by its we_vote_id
 * @param  {string} we_vote_id identifier for lookup in stored
 * @return {Boolean} starred or not starred
 */
function toggleStarState(we_vote_id) {
  var item = _ballot_store[we_vote_id];
  item.is_starred = ! item.is_starred;
  //console.log(_ballot_store[we_vote_id]);
  return true;
}

 /**
 * toggle the support state of a ballot item to on by its we_vote_id
 */
function setLocalSupportOnState(we_vote_id) {
  var item = _ballot_store[we_vote_id];
  //console.log('setLocalSupportOnState BEFORE, is_support:', item.is_support, ', supportCount', item.supportCount);
  if (item.is_support != true) {
    // Cheat and increase the counter without hitting the API
    item.supportCount += 1;
  }
  item.is_support = true;
  //console.log('setLocalSupportOnState AFTER, is_support:', item.is_support, ', supportCount', item.supportCount);
  return true;
}

 /**
 * toggle the support state of a ballot item to off by its we_vote_id
 */
function setLocalSupportOffState(we_vote_id) {
  var item = _ballot_store[we_vote_id];
  //console.log('setLocalSupportOffState BEFORE, is_support:', item.is_support, ', supportCount', item.supportCount);
  if (item.is_support == true) {
    // Cheat and decrease the counter without hitting the API
    item.supportCount -= 1;
  }
  item.is_support = false;
  //console.log('setLocalSupportOffState AFTER, is_support:', item.is_support, ', supportCount', item.supportCount);
  return true;
}

 /**
 * toggle the oppose state of a ballot item to On by its we_vote_id
 */
function setLocalOpposeOnState(we_vote_id) {
  var item = _ballot_store[we_vote_id];
  //console.log('setLocalOpposeOnState BEFORE, is_oppose:', item.is_oppose, ', opposeCount', item.opposeCount);
  if (item.is_oppose != true) {
    // Cheat and increase the counter without hitting the API
    item.opposeCount += 1;
  }
  item.is_oppose = true;
  //console.log('setLocalOpposeOnState AFTER, is_oppose:', item.is_oppose, ', opposeCount', item.opposeCount);
  return true;
}

 /**
 * toggle the oppose state of a ballot item to Off by its we_vote_id
 */
function setLocalOpposeOffState(we_vote_id) {
  var item = _ballot_store[we_vote_id];
  //console.log('setLocalOpposeOffState BEFORE, is_oppose:', item.is_oppose, ', opposeCount', item.opposeCount);
  if (item.is_oppose == true) {
    // Cheat and decrease the counter without hitting the API
    item.opposeCount -= 1;
  }
  item.is_oppose = false;
  //console.log('setLocalOpposeOffState AFTER, is_oppose:', item.is_oppose, ', opposeCount', item.opposeCount);
  return true;
}

AppDispatcher.register( action => {
  var { we_vote_id } = action;

  switch (action.actionType) {
    case BallotConstants.VOTER_SUPPORTING_SAVE:
      BallotAPIWorker.voterSupportingSave(
          we_vote_id, () => setLocalSupportOnState(we_vote_id)
            && setLocalOpposeOffState(we_vote_id)
            && BallotStore.emitChange()
      );
      break;
    case BallotConstants.VOTER_STOP_SUPPORTING_SAVE:
      BallotAPIWorker.voterStopSupportingSave(
          we_vote_id, () => setLocalSupportOffState(we_vote_id)
            && BallotStore.emitChange()
      );
      break;
    case BallotConstants.VOTER_OPPOSING_SAVE:
      BallotAPIWorker.voterOpposingSave(
        we_vote_id, () => setLocalOpposeOnState(we_vote_id)
          && setLocalSupportOffState(we_vote_id)
          && BallotStore.emitChange()
      );
      break;
    case BallotConstants.VOTER_STOP_OPPOSING_SAVE:
      BallotAPIWorker.voterStopOpposingSave(
          we_vote_id, () => setLocalOpposeOffState(we_vote_id)
            && BallotStore.emitChange()
      );
      break;
    case BallotConstants.VOTER_STAR_ON_SAVE:
      BallotAPIWorker
        .voterStarOnSave(
          we_vote_id, () => toggleStarState(we_vote_id)
            && BallotStore.emitChange()
      );
      break;
    case BallotConstants.VOTER_STAR_OFF_SAVE:
      BallotAPIWorker
        .voterStarOffSave(
          we_vote_id, () => toggleStarState(we_vote_id)
            && BallotStore.emitChange()
      );
      break;
  }
});

export default BallotStore;
