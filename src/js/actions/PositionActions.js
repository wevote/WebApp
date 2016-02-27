"use strict";
var AppDispatcher = require("../dispatcher/AppDispatcher");
var PositionConstants = require("../constants/PositionConstants");

module.exports = {

  positionRetrieved: function (payload) {
    AppDispatcher.dispatch({
      actionType: PositionConstants.POSITION_RETRIEVED,
      payload: payload,
      we_vote_id: payload.position_we_vote_id
    });
  },

};
