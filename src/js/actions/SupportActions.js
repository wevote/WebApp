var Dispatcher = require("../dispatcher/Dispatcher");

var SupportActions = (function (_Dispatcher) {
  function _SupportActions () { }

  _SupportActions.prototype.retrieve = function retrieve (we_vote_id, type) {
    _Dispatcher.loadEndpoint("voterPositionRetrieve", {ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type } );
    _Dispatcher.loadEndpoint("positionSupportCountForBallotItem", {ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type});
    _Dispatcher.loadEndpoint("positionOpposeCountForBallotItem", {ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type});
  };

  _SupportActions.prototype.voterOpposingSave = function voterOpposingSave (we_vote_id, type) {
    _Dispatcher.loadEndpoint("voterOpposingSave", {ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type});
  };

  _SupportActions.prototype.voterStopOpposingSave = function (we_vote_id, type) {
    _Dispatcher.loadEndpoint("voterStopOpposingSave", {ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type});
  };

  _SupportActions.prototype.voterSupportingSave = function (we_vote_id, type) {
    _Dispatcher.loadEndpoint("voterSupportingSave", {ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type});
  };

  _SupportActions.prototype.voterStopSupportingSave = function (we_vote_id, type) {
    _Dispatcher.loadEndpoint("voterStopSupportingSave", {ballot_item_we_vote_id: we_vote_id, kind_of_ballot_item: type});
  };

  return new _SupportActions();
}(Dispatcher));

module.exports = SupportActions;
