const Dispatcher = require("../dispatcher/Dispatcher");

const BallotActions = (function (_Dispatcher) {
  function _BallotActions () { }

  _BallotActions.prototype.init = function init () {
    _Dispatcher.loadEndpoint("voterBallotItemsRetrieve");
  };

  return new _BallotActions();

}(Dispatcher));

module.exports = BallotActions;
