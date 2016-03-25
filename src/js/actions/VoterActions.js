import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {

  retrieveVoter: function () {
    Dispatcher.loadEndpoint("voterRetrieve");
  },

  retrieveAddress: function (id){
    Dispatcher.loadEndpoint("voterAddressRetrieve", { voter_device_id: id});
  },

  saveAddress: function (text){
    Dispatcher.loadEndpoint("voterAddressSave", { text_for_map_search: text });
  }
};
