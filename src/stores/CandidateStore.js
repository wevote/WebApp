const assign = require('object-assign');
const request = require('superagent');

const config = require('../config');

// super private store holders
let _candidate_store = {};
let _ballot_candidate_map = {};

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

function getCandidatesById (office_we_vote_id, callback) {
    let count = 0;

    new Promise( (resolve, reject) => request
      .get(`${config.url}/candidatesRetrieve/`)
      .withCredentials()
      .query({ office_we_vote_id })
      .query({ office_id: ''})
      .end( (err, res) => {
        if (err || !res.body.success)
          reject(err);

        resolve(res.body);
      })
    )
    .then ( getSupporters )
    .then ( getOpposition )
    .then( function (value) {
      callback(value);
    })
    .catch( err => {
        console.error(err);
    })
}

function getSupporters (value) {
  let count = 0;

  return new Promise ( (resolve, reject) => value
    .candidate_list.forEach( candidate => request
      .get(`${config.url}/positionSupportCountForBallotItem/`)
        .withCredentials()
        .query({ candidate_id: candidate.id})
        .end( (err, res) => {
          if (err)
            reject(err);

          value.candidate_list[count ++].supportCount = res.body.count;

          if (count === value.candidate_list.length)
            resolve(value);

        })
      )
  );
}

function getOpposition (value) {
  let count = 0;

  return new Promise ( (resolve, reject) => value
    .candidate_list.forEach( candidate => request
      .get(`${config.url}/positionOpposeCountForBallotItem/`)
        .withCredentials()
        .query({ candidate_id: candidate.id })
        .end( (err, res) => {
          if (err)
            reject(err);

          value.candidate_list[count ++].opposeCount = res.body.count;

          if (count === value.candidate_list.length)
            resolve(value);

        })
      )
  );
}

const CandidateStore = {
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
  getCandidatesByBallotId: function (id, callback) {
    if (typeof id !== 'string')
      throw new Error('getCandidateByBallotId takes string id');

    if (typeof callback !== 'function')
      throw new Error('getCandidatesByBallotId takes callback function')

    return _ballot_candidate_map[id] ?
      callback(_ballot_candidate_map[id]) : getCandidatesById(id, callback);
  }
};

export default CandidateStore;
