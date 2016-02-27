import { get } from "../utils/service";
import { createStore } from "../utils/createStore";
import { shallowClone } from "../utils/object-utils";

const AppDispatcher = require("../dispatcher/AppDispatcher");
const PositionConstants = require("../constants/PositionConstants");
const PositionActions = require("../actions/PositionActions");

var _position_store = {}; // All positions that have been fetched (by we_vote_ids)

const PositionAPIWorker = {

  positionRetrieve: function (we_vote_id, success) {
    return get({
      endpoint: "positionRetrieve",
      query: {
         position_we_vote_id: we_vote_id,
      },
      success: success
    });
  }

};

const PositionStore = createStore({

retrievePositionByWeVoteId: function (we_vote_id){
  PositionAPIWorker.positionRetrieve(we_vote_id,
    function (res){
      PositionActions.positionRetrieved(res);
    }.bind(this));
},

getLocalPositionByWeVoteId: function (we_vote_id){
  return shallowClone(_position_store[we_vote_id]);
}

});

function setLocalPosition (we_vote_id, position) {
  _position_store[we_vote_id] = position;
  return true;
}

AppDispatcher.register(action => {
    switch (action.actionType) {

    case PositionConstants.POSITION_RETRIEVED:
      setLocalPosition(action.we_vote_id, action.payload );
      PositionStore.emitChange();
    break;

  }

});

export default PositionStore;
