import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {
  officeRetrieve: function (we_vote_id) {
    Dispatcher.loadEndpoint("officeRetrieve", { office_we_vote_id: we_vote_id } );
  }
};
