"use strict";
var AppDispatcher = require("../dispatcher/AppDispatcher");
var VoterConstants = require("../constants/VoterConstants");

// In the stores, there are AppDispatcher blocks that listen for these actionType constants (ex/ VOTER_SUPPORTING_SAVE)
//  When action calls one of these functions, we are telling the code in the AppDispatcher block to run
module.exports = {
  ChangeLocation: function (location) {  // VOTER_LOCATION_RETRIEVE
    AppDispatcher.dispatch({
      actionType: VoterConstants.VOTER_LOCATION_RETRIEVE,
      location
    });
  },

  voterRetrieve: function (we_vote_id) {  // VOTER_RETRIEVE
    AppDispatcher.dispatch({
      actionType: VoterConstants.VOTER_RETRIEVE,
      we_vote_id
    });

  }
};
