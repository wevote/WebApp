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

  twitterRetrieveIdsIfollow: function () {
    Dispatcher.loadEndpoint("twitterRetrieveIdsIFollow", {});
  },

  voterAddressRetrieve: function (id){
    Dispatcher.loadEndpoint("voterAddressRetrieve", { voter_device_id: id});
  },

  voterEmailAddressRetrieve: function (){
    Dispatcher.loadEndpoint("voterEmailAddressRetrieve", {});
  },

  voterAddressSave: function (text, simple_save = false, google_civic_election_id = 0){
    Dispatcher.loadEndpoint("voterAddressSave", { text_for_map_search: text, simple_save: simple_save, google_civic_election_id: google_civic_election_id});
  },

  voterEmailAddressSave: function (voter_email_address, send_link_to_sign_in = false){
    Dispatcher.loadEndpoint("voterEmailAddressSave", {
      text_for_email_address: voter_email_address,
      send_link_to_sign_in: send_link_to_sign_in,
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
  },

  voterNameSave: function (first_name, last_name) {
    Dispatcher.loadEndpoint("voterUpdate",
      {
        first_name: first_name,
        last_name: last_name
      });
  },

  // Tell the server to only save this name if a name does not currently exist
  voterFullNameSoftSave: function (first_name, last_name, full_name = "") {
    Dispatcher.loadEndpoint("voterUpdate",
      {
        first_name: first_name,
        last_name: last_name,
        full_name: full_name,
        name_save_only_if_no_existing_names: true,
      });
  },

  voterUpdateInterfaceStatusFlags: function (flag_integer_to_set) {
    Dispatcher.loadEndpoint("voterUpdate",
      {
        flag_integer_to_set: flag_integer_to_set,
      });
  },

  voterUpdateNotificationSettingsFlags: function (flag_integer_to_set, flag_integer_to_unset = "") {
    Dispatcher.loadEndpoint("voterUpdate",
      {
        notification_flag_integer_to_set: flag_integer_to_set,
        notification_flag_integer_to_unset: flag_integer_to_unset,
      });
  },

  voterUpdateRefresh: function () {
    // Just make sure we have the latest voter data
    Dispatcher.loadEndpoint("voterUpdate",
      {
      });
  },

  voterRefreshDonations: function () {
    Dispatcher.loadEndpoint("voterUpdate",
      {
        send_journal_list: true
      });
  },

  voterSplitIntoTwoAccounts: function () {
    Dispatcher.loadEndpoint("voterSplitIntoTwoAccounts",
      {
        split_off_twitter: true
      });
  },
};
