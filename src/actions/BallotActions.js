'use strict';
var AppDispatcher = require('../dispatcher/AppDispatcher');
var BallotConstants = require('../constants/BallotConstants');

module.exports = {
  support: function (id) {
    AppDispatcher.dispatch({
      actionType: BallotConstants.BALLOT_SUPPORTED,
      id
    });
  },

  oppose: function (id) {
    AppDispatcher.dispatch({
      actionType: BallotConstants.BALLOT_OPPOSED,
      id
    });
  }
};
