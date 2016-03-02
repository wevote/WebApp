var Dispatcher = require("../dispatcher/Dispatcher");

var PositionActions = (function (_Dispatcher) {
  function _PositionActions () { }

  _PositionActions.prototype.retrieve = function retrieve (we_vote_id) {
    // _Dispatcher.loadEndpoint("positionListForBallotItem", { ballot_item_we_vote_id: we_vote_id} );
  };

  return new _PositionActions();
}(Dispatcher));

module.exports = PositionActions;
