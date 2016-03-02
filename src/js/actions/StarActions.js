var Dispatcher = require("../dispatcher/Dispatcher");

var StarActions = (function (_Dispatcher) {
  function _StarActions () { }

  _StarActions.prototype.retrieve = function retrieve (we_vote_id) {
    _Dispatcher.loadEndpoint('voterStarStatusRetrieve', {ballot_item_id: '736', kind_of_ballot_item: 'CANDIDATE'});
  };

  _StarActions.prototype.voterStarOnSave = function voterStarOnSave (we_vote_id) {
    _Dispatcher.loadEndpoint('voterStarOnSave', {ballot_item_id: '736', kind_of_ballot_item: 'CANDIDATE'});
  };

  _StarActions.prototype.voterStarOffSave = function voterStarOffSave (we_vote_id) {
    _Dispatcher.loadEndpoint('voterStarOffSave', {ballot_item_id: '736', kind_of_ballot_item: 'CANDIDATE'});
  };

  return new _StarActions();
}(Dispatcher));

module.exports = StarActions;
