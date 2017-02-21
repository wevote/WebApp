import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {
  organizationSuggestionTasks: function (kind_of_suggestion_task, kind_of_follow_task) {
    Dispatcher.loadEndpoint("organizationSuggestionTasks",
      {
        kind_of_suggestion_task: kind_of_suggestion_task,
        kind_of_follow_task: kind_of_follow_task
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

  // Send the sign in link to their email address
  sendSignInLinkEmail: function (voter_email_address){
    Dispatcher.loadEndpoint("voterEmailAddressSave", {
      text_for_email_address: voter_email_address,
      send_link_to_sign_in: true,
      make_primary_email: true
    });
  },

  sendVerificationEmail: function (voter_email_we_vote_id){
    Dispatcher.loadEndpoint("voterEmailAddressSave", {
      email_we_vote_id: voter_email_we_vote_id,
      resend_verification_email: true
    });
  },

  setAsPrimaryEmailAddress: function (email_we_vote_id){
    Dispatcher.loadEndpoint("voterEmailAddressSave", {
      email_we_vote_id: email_we_vote_id,
      make_primary_email: true
    });
  },

  voterAddressRetrieve: function (id){
    Dispatcher.loadEndpoint("voterAddressRetrieve", { voter_device_id: id});
  },

  voterEmailAddressRetrieve: function (){
    Dispatcher.loadEndpoint("voterEmailAddressRetrieve", {});
  },

  voterAddressSave: function (text, simple_save = false){
    Dispatcher.loadEndpoint("voterAddressSave", { text_for_map_search: text, simple_save: simple_save });
  },

  voterEmailAddressSave: function (voter_email_address){
    Dispatcher.loadEndpoint("voterEmailAddressSave", {
      text_for_email_address: voter_email_address,
      make_primary_email: true
    });
  },

  voterEmailAddressSignIn: function (email_secret_key){
    Dispatcher.loadEndpoint("voterEmailAddressSignIn", {
      email_secret_key: email_secret_key
    });
  },

  voterEmailAddressSignInConfirm: function (email_secret_key){
    Dispatcher.loadEndpoint("voterEmailAddressSignIn", {
      email_secret_key: email_secret_key,
      yes_please_merge_accounts: true
    });
  },

  voterEmailAddressVerify: function (email_secret_key){
    Dispatcher.loadEndpoint("voterEmailAddressVerify", {
      email_secret_key: email_secret_key
    });
  },

  voterFacebookSaveToCurrentAccount: function () {
    Dispatcher.loadEndpoint("voterFacebookSaveToCurrentAccount", {
    });
  },

  voterTwitterSaveToCurrentAccount: function () {
    Dispatcher.loadEndpoint("voterTwitterSaveToCurrentAccount", {
    });
  },

  voterMergeTwoAccountsByEmailKey: function (email_secret_key) {
    Dispatcher.loadEndpoint("voterMergeTwoAccounts",
      {
        email_secret_key: email_secret_key,
        facebook_secret_key: "",
        invitation_secret_key: "",
        twitter_secret_key: "",
      });
  },

  voterMergeTwoAccountsByFacebookKey: function (facebook_secret_key) {
    // console.log("VoterActions, voterMergeTwoAccountsByFacebookKey");
    Dispatcher.loadEndpoint("voterMergeTwoAccounts",
      {
        email_secret_key: "",
        facebook_secret_key: facebook_secret_key,
        invitation_secret_key: "",
        twitter_secret_key: "",
      });
  },

  voterMergeTwoAccountsByInvitationKey: function (invitation_secret_key) {
    Dispatcher.loadEndpoint("voterMergeTwoAccounts",
      {
        email_secret_key: "",
        facebook_secret_key: "",
        invitation_secret_key: invitation_secret_key,
        twitter_secret_key: "",
      });
  },

  voterMergeTwoAccountsByTwitterKey: function (twitter_secret_key) {
    Dispatcher.loadEndpoint("voterMergeTwoAccounts",
      {
        email_secret_key: "",
        facebook_secret_key: "",
        invitation_secret_key: "",
        twitter_secret_key: twitter_secret_key,
      });
  },

  voterRetrieve: function () {
    Dispatcher.loadEndpoint("voterRetrieve");
  }
};
