import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {
  mergeTwoVoterAccountsByEmailSecretKey: function (current_voter_device_id, email_secret_key) {
    // TODO DALE Set up this API Endpoint
    Dispatcher.loadEndpoint("mergeTwoVoterAccounts",
      {
        current_voter_device_id: current_voter_device_id,
        email_secret_key: email_secret_key
      });
  },

  positionListForVoter: function (show_only_this_election, show_all_other_elections) {
    Dispatcher.loadEndpoint("positionListForVoter",
      {
        show_only_this_election: show_only_this_election,
        show_all_other_elections: show_all_other_elections
      });
  },

  removeVoterEmailAddress: function (email_we_vote_id){
    Dispatcher.loadEndpoint("voterEmailAddressSave", {
      email_we_vote_id: email_we_vote_id,
      delete_email: true
    });
  },

  retrieveAddress: function (id){
    Dispatcher.loadEndpoint("voterAddressRetrieve", { voter_device_id: id});
  },

  retrieveEmailAddress: function (){
    Dispatcher.loadEndpoint("voterEmailAddressRetrieve", {});
  },

  retrieveEmailAddressBySecretKey: function (email_secret_key){
    Dispatcher.loadEndpoint("voterEmailAddressRetrieve", {
      email_secret_key: email_secret_key
    });
  },

  saveAddress: function (text){
    Dispatcher.loadEndpoint("voterAddressSave", { text_for_map_search: text });
  },

  sendVerificationEmail: function (voter_email_we_vote_id){
    Dispatcher.loadEndpoint("voterEmailAddressSave", {
      email_we_vote_id: voter_email_we_vote_id,
      resend_verification_email: true
    });
  },

  signOut: function (){
    Dispatcher.loadEndpoint("voterSignOut", {sign_out_all_devices: false});
  },

  updateVoter: function (data){
    let attributes = {
      facebook_email: data.email || false,
      first_name: data.first_name || false,
      middle_name: data.middle_name || false,
      last_name: data.last_name || false,
      twitter_profile_image_url_https: false
    };
    Dispatcher.loadEndpoint("voterUpdate", attributes );
  },

  voterEmailAddressSave: function (voter_email_address){
    Dispatcher.loadEndpoint("voterEmailAddressSave", {
      text_for_email_address: voter_email_address,
      make_primary_email: true
    });
  },

  voterEmailAddressVerify: function (email_secret_key){
    Dispatcher.loadEndpoint("voterEmailAddressVerify", {
      email_secret_key: email_secret_key
    });
  },

  voterRetrieve: function () {
    Dispatcher.loadEndpoint("voterRetrieve");
  }
};
