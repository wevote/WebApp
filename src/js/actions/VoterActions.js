"use strict";
var AppDispatcher = require("../dispatcher/AppDispatcher");
var VoterConstants = require("../constants/VoterConstants");

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
