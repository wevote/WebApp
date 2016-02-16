import service from '../utils/service';
import { createStore } from '../utils/createStore';
import { shallowClone } from '../utils/object-utils';

const AppDispatcher = require('../dispatcher/AppDispatcher');
const PositionConstants = require('../constants/PositionConstants');
const PositionActions = require('../actions/PositionActions');

var _position_store = {}; // All positions that have been fetched (by we_vote_ids)

function printErr (err) {
  console.error(err);
}

const POSITION_CHANGE_EVENT = 'POSITION_CHANGE_EVENT';

const PositionAPIWorker = {

  positionRetrieve: function (we_vote_id, success) {
    return service.get({
      endpoint: 'positionRetrieve',
      query: {
         position_we_vote_id: we_vote_id,
      },
      success
    });
  }

};

const PositionStore = createStore({

  emitChange: function () {
    this.emit(POSITION_CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    // console.log("Change listener added");
    this.on(POSITION_CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    // console.log("Change listener removed!");
   this.removeListener(POSITION_CHANGE_EVENT, callback);
 },

retrievePositionByWeVoteId: function(we_vote_id){
  PositionAPIWorker.positionRetrieve(we_vote_id,
    function(res){
      PositionActions.positionRetrieved(we_vote_id, res);
      console.log("Response");
      console.log(res);
    });
},

getLocalPositionByWeVoteId: function(we_vote_id){
  return shallowClone(_position_store[we_vote_id]);
}

});

function setLocalPosition(we_vote_id, position) {
  _ballot_store[we_vote_id] = position;
  return true;
}

AppDispatcher.register( action => {
  var { we_vote_id } = action;
    switch (action.actionType) {

    case PositionConstants.POSITION_RETRIEVED:
    console.log("Action Payload:");
    console.log(action.payload);
      setLocalPosition(action.we_vote_id, action.payload )
      && PositionStore.emitChange();
    break;

  }
});

export default PositionStore;
