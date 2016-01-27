'use strict';
var AppDispatcher = require('dispatcher/AppDispatcher');
var BallotConstants = require('constants/BallotConstants');

// In the stores, there are AppDispatcher blocks that listen for these actionType constants (ex/ BALLOT_SUPPORT_ON)
//  When action calls one of these functions, we are telling the code in the AppDispatcher block to run
module.exports = {
  voterSupportingSave: function (we_vote_id) {
    AppDispatcher.dispatch({
      actionType: BallotConstants.VOTER_SUPPORTING_SAVE,
      we_vote_id
    });
  },

  voterStopSupportingSave: function (we_vote_id) {
    AppDispatcher.dispatch({
      actionType: BallotConstants.VOTER_STOP_SUPPORTING_SAVE,
      we_vote_id
    });
  },

  voterOpposingSave: function (we_vote_id) {
    AppDispatcher.dispatch({
      actionType: BallotConstants.VOTER_OPPOSING_SAVE,
      we_vote_id
    });
  },

  voterStopOpposingSave: function (we_vote_id) {  // BALLOT_OPPOSE_OFF, opposeOffToAPI
    AppDispatcher.dispatch({
      actionType: BallotConstants.VOTER_STOP_OPPOSING_SAVE,
      we_vote_id
    });
  },

  voterStarOnSave: function (we_vote_id) {  // STAR_ON, starOnToAPI
    AppDispatcher.dispatch({
      actionType: BallotConstants.VOTER_STAR_ON_SAVE,
      we_vote_id
    });
  },

  voterStarOffSave: function (we_vote_id) {  // STAR_OFF, starOffToAPI
    AppDispatcher.dispatch({
      actionType: BallotConstants.STAR_OFF,
      we_vote_id
    });
  }
};
