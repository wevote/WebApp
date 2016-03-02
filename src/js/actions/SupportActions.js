var Dispatcher = require("../dispatcher/Dispatcher");

var SupportActions = (function (_Dispatcher) {
  function _SupportActions () { }

  _SupportActions.prototype.retrieve = function retrieve (we_vote_id) {

    _Dispatcher.loadEndpoint("voterPositionRetrieve", {ballot_item_we_vote_id: we_vote_id} );
    //Note: hardcoded for now. TODO: replace query with just we_vote_id once the API is updated
    _Dispatcher.loadEndpoint('positionSupportCountForBallotItem', {ballot_item_id: '736', kind_of_ballot_item: 'CANDIDATE'});
    _Dispatcher.loadEndpoint('positionOpposeCountForBallotItem', {ballot_item_id: '736', kind_of_ballot_item: 'CANDIDATE'});
  };

  return new _SupportActions();
}(Dispatcher));

module.exports = SupportActions;
