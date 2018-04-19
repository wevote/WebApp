import Dispatcher from "../dispatcher/Dispatcher";

export default {
  officeRetrieve: function (office_we_vote_id) {
    Dispatcher.loadEndpoint("officeRetrieve", { office_we_vote_id: office_we_vote_id } );
  }
};
