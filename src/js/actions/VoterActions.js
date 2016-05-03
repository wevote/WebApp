import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {

  signOut: function (){
    Dispatcher.loadEndpoint("voterSignOut", {sign_out_all_devices: false});
  },

  retrieveVoter: function () {
    Dispatcher.loadEndpoint("voterRetrieve");
  },

  updateVoter: function (data){
    let attrs = {facebook_email: data.email || false,
                    first_name: data.first_name || false,
                    middle_name: data.middle_name || false,
                    last_name: data.last_name || false,
                    twitter_profile_image_url_https: false};
    Dispatcher.loadEndpoint("voterUpdate", attrs );
  },

  retrieveAddress: function (id){
    Dispatcher.loadEndpoint("voterAddressRetrieve", { voter_device_id: id});
  },

  saveAddress: function (text){
    Dispatcher.loadEndpoint("voterAddressSave", { text_for_map_search: text });
  }
};
