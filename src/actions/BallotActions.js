'use strict';
var AppDispatcher = require('../dispatcher/AppDispatcher');
var BallotConstants = require('../constants/BallotConstants');

// In the stores, there are AppDispatcher blocks that listen for these actionType constants (ex/ BALLOT_SUPPORT_ON)
//  When action calls one of these functions, we are telling the code in the AppDispatcher block to run
module.exports = {
  supportOn: function (we_vote_id) {  // BALLOT_SUPPORT_ON, supportOnToAPI
    AppDispatcher.dispatch({
      actionType: BallotConstants.BALLOT_SUPPORT_ON,
      we_vote_id
    });
  },

  supportOff: function (we_vote_id) {  // BALLOT_SUPPORT_OFF, supportOffToAPI
    AppDispatcher.dispatch({
      actionType: BallotConstants.BALLOT_SUPPORT_OFF,
      we_vote_id
    });
  },

  opposeOn: function (we_vote_id) {  // BALLOT_OPPOSE_ON, opposeOnToAPI
    AppDispatcher.dispatch({
      actionType: BallotConstants.BALLOT_OPPOSE_ON,
      we_vote_id
    });
  },

  opposeOff: function (we_vote_id) {  // BALLOT_OPPOSE_OFF, opposeOffToAPI
    AppDispatcher.dispatch({
      actionType: BallotConstants.BALLOT_OPPOSE_OFF,
      we_vote_id
    });
  },

  starOn: function (we_vote_id) {  // STAR_ON, starOnToAPI
    AppDispatcher.dispatch({
      actionType: BallotConstants.STAR_ON,
      we_vote_id
    });
  },

  starOff: function (we_vote_id) {  // STAR_OFF, starOffToAPI
    AppDispatcher.dispatch({
      actionType: BallotConstants.STAR_OFF,
      we_vote_id
    });
  }
};
