"use strict";
var AppDispatcher = require("../dispatcher/AppDispatcher");
var PositionConstants = require("../constants/PositionConstants");

module.exports = {

  positionRetrieved: function (we_vote_id, payload) {
    AppDispatcher.dispatch({
      actionType: PositionConstants.POSITION_RETRIEVED,
      payload: payload,
      we_vote_id: we_vote_id
    });
  },

};
