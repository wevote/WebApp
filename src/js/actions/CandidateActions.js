var Dispatcher = require("../dispatcher/Dispatcher");

var CandidateActions = (function (_Dispatcher) {
  function _CandidateActions () { }

  _CandidateActions.prototype.retrieve = function retrieve (we_vote_id) {
    _Dispatcher.loadEndpoint("candidateRetrieve", { candidate_we_vote_id: we_vote_id} );
    _Dispatcher.loadEndpoint("positionListForBallotItem", { ballot_item_id: '736', kind_of_ballot_item: 'CANDIDATE'} );
    //HARDCODED, replace with below:
        // _Dispatcher.loadEndpoint("positionListForBallotItem", { ballot_item_we_vote_id: we_vote_id} );
  };

  return new _CandidateActions();
}(Dispatcher));

module.exports = CandidateActions;
