'use strict';
var AppDispatcher = require('../dispatcher/AppDispatcher');
var BallotConstants = require('../constants/BallotConstants');

// In the stores, there are AppDispatcher blocks that listen for these actionType constants (ex/ VOTER_SUPPORTING_SAVE)
//  When action calls one of these functions, we are telling the code in the AppDispatcher block to run
module.exports = {

  positionsRetrieved: function (we_vote_id, payload) {
    AppDispatcher.dispatch({
      actionType: BallotConstants.POSITIONS_RETRIEVED,
      payload: payload,
      we_vote_id: we_vote_id
    });
  },

  voterSupportingSave: function (we_vote_id) {  // VOTER_SUPPORTING_SAVE
    AppDispatcher.dispatch({
      actionType: BallotConstants.VOTER_SUPPORTING_SAVE,
      we_vote_id
    });
  },

  voterSupportingSave: function (we_vote_id) {  // VOTER_SUPPORTING_SAVE
    AppDispatcher.dispatch({
      actionType: BallotConstants.VOTER_SUPPORTING_SAVE,
      we_vote_id
    });
  },

  voterSupportingSave: function (we_vote_id) {  // VOTER_SUPPORTING_SAVE
    AppDispatcher.dispatch({
      actionType: BallotConstants.VOTER_SUPPORTING_SAVE,
      we_vote_id
    });
  },

  voterStopSupportingSave: function (we_vote_id) {  // VOTER_STOP_SUPPORTING_SAVE
    AppDispatcher.dispatch({
      actionType: BallotConstants.VOTER_STOP_SUPPORTING_SAVE,
      we_vote_id
    });
  },

  voterOpposingSave: function (we_vote_id) {  // VOTER_OPPOSING_SAVE
    AppDispatcher.dispatch({
      actionType: BallotConstants.VOTER_OPPOSING_SAVE,
      we_vote_id
    });
  },

  voterStopOpposingSave: function (we_vote_id) {  // VOTER_STOP_OPPOSING_SAVE
    AppDispatcher.dispatch({
      actionType: BallotConstants.VOTER_STOP_OPPOSING_SAVE,
      we_vote_id
    });
  },

  voterStarOnSave: function (we_vote_id) {  // VOTER_STAR_ON_SAVE
    AppDispatcher.dispatch({
      actionType: BallotConstants.VOTER_STAR_ON_SAVE,
      we_vote_id
    });
  },

  voterStarOffSave: function (we_vote_id) {  // VOTER_STAR_OFF_SAVE
    AppDispatcher.dispatch({
      actionType: BallotConstants.VOTER_STAR_OFF_SAVE,
      we_vote_id
    });
  }
};
