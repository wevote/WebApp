'use strict';
var AppDispatcher = require('../dispatcher/AppDispatcher');
var PositionConstants = require('../constants/PositionConstants');

// In the stores, there are AppDispatcher blocks that listen for these actionType constants (ex/ VOTER_SUPPORTING_SAVE)
//  When action calls one of these functions, we are telling the code in the AppDispatcher block to run
module.exports = {

  positionRetrieved: function( we_vote_id, payload) {
    AppDispatcher.dispatch({
      actionType: PositionConstants.POSITION_RETRIEVED,
      payload: payload,
      we_vote_id: we_vote_id
    });
  },

};
