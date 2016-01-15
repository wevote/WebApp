'use strict';
var AppDispatcher = require('../dispatcher/AppDispatcher');
var BallotConstants = require('../constants/BallotConstants');

module.exports = {
  support: function (we_vote_id) {
    AppDispatcher.dispatch({
      actionType: BallotConstants.BALLOT_SUPPORTED,
      we_vote_id
    });
  },

  oppose: function (we_vote_id) {
    AppDispatcher.dispatch({
      actionType: BallotConstants.BALLOT_OPPOSED,
      we_vote_id
    });
  }
};
