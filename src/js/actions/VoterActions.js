import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {

  signOut: function (){
    Dispatcher.loadEndpoint("voterSignOut", {sign_out_all_devices: false});
  },

  voterRetrieve: function () {
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

  positionListForVoter: function (show_only_this_election, show_all_other_elections) {
    Dispatcher.loadEndpoint("positionListForVoter",
      {
        show_only_this_election: show_only_this_election,
        show_all_other_elections: show_all_other_elections
      });
  },

  saveAddress: function (text){
    Dispatcher.loadEndpoint("voterAddressSave", { text_for_map_search: text });
  }
};
