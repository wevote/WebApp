var Dispatcher = require("../dispatcher/Dispatcher");

var OfficeActions = (function (_Dispatcher) {
  function _OfficeActions () { }

  _OfficeActions.prototype.retrieve = function retrieve (we_vote_id) {
    _Dispatcher.loadEndpoint("officeRetrieve", { office_we_vote_id: we_vote_id } );
  };

  return new _OfficeActions();
}(Dispatcher));

module.exports = OfficeActions;
