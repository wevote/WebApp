var Dispatcher = require("../dispatcher/Dispatcher");

var GuideActions = (function (_Dispatcher) {
  function _GuideActions () { }

  _GuideActions.prototype.ignore = function ignore (we_vote_id) {
    _Dispatcher.loadEndpoint("organizationFollowIgnore", { organization_we_vote_id: we_vote_id} );
  };

  _GuideActions.prototype.follow = function follow (we_vote_id) {
    _Dispatcher.loadEndpoint("organizationFollow", { organization_we_vote_id: we_vote_id} );
  };

  _GuideActions.prototype.stopFollowing = function stopFollowing (we_vote_id) {
    _Dispatcher.loadEndpoint("organizationStopFollowing", { organization_we_vote_id: we_vote_id} );
  };

  _GuideActions.prototype.retrieveGuidesToFollow = function retrieveGuidesToFollow (election_id){
    _Dispatcher.loadEndpoint("voterGuidesToFollowRetrieve", { google_civic_election_id: election_id });
  };

  _GuideActions.prototype.retrieveGuidesFollowed = function retrieveGuidesFollowed (){
    _Dispatcher.loadEndpoint("voterGuidesFollowedRetrieve");
  };

  return new _GuideActions();
}(Dispatcher));

module.exports = GuideActions;
