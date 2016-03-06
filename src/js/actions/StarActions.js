var Dispatcher = require("../dispatcher/Dispatcher");

var StarActions = (function (_Dispatcher) {
  function _StarActions () { }

  _StarActions.prototype.retrieve = function retrieve (we_vote_id, type) {
    _Dispatcher.loadEndpoint("voterStarStatusRetrieve", { ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type });
  };

  _StarActions.prototype.voterStarOnSave = function voterStarOnSave (we_vote_id, type) {
    _Dispatcher.loadEndpoint("voterStarOnSave", { ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type });
  };

  _StarActions.prototype.voterStarOffSave = function voterStarOffSave (we_vote_id, type) {
    _Dispatcher.loadEndpoint("voterStarOffSave", { ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type });
  };

  return new _StarActions();
}(Dispatcher));

module.exports = StarActions;
