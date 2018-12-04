import Dispatcher from "../dispatcher/Dispatcher";
import { isCordova } from "../utils/cordovaUtils";

export default {
  organizationSuggestionTasks (kind_of_suggestion_task, kind_of_follow_task) {
    Dispatcher.loadEndpoint("organizationSuggestionTasks",
      {
        kind_of_suggestion_task,
        kind_of_follow_task,
      });
  },

  positionListForVoter (show_only_this_election, show_all_other_elections) {
    Dispatcher.loadEndpoint("positionListForVoter",
      {
        show_only_this_election,
        show_all_other_elections,
      });
  },

  removeVoterEmailAddress (email_we_vote_id) {
    Dispatcher.loadEndpoint("voterEmailAddressSave", {
      email_we_vote_id,
      delete_email: true,
    });
  },

  // Send the sign in link to their email address
  sendSignInLinkEmail (voter_email_address) {
    Dispatcher.loadEndpoint("voterEmailAddressSave", {
      text_for_email_address: voter_email_address,
      send_link_to_sign_in: true,
      make_primary_email: true,
    });
  },

  sendVerificationEmail (voter_email_we_vote_id) {
    Dispatcher.loadEndpoint("voterEmailAddressSave", {
      email_we_vote_id: voter_email_we_vote_id,
      resend_verification_email: true,
    });
  },

  setAsPrimaryEmailAddress (email_we_vote_id) {
    Dispatcher.loadEndpoint("voterEmailAddressSave", {
      email_we_vote_id,
      make_primary_email: true,
    });
  },

  twitterRetrieveIdsIfollow () {
    Dispatcher.loadEndpoint("twitterRetrieveIdsIFollow", {});
  },

  voterAddressRetrieve (id) {
    // console.log("VoterActions, voterAddressRetrieve");
    Dispatcher.loadEndpoint("voterAddressRetrieve", { voter_device_id: id });
  },

  voterEmailAddressRetrieve () {
    Dispatcher.loadEndpoint("voterEmailAddressRetrieve", {});
  },

  voterAddressSave (text, simple_save = false, google_civic_election_id = 0) {
    Dispatcher.loadEndpoint("voterAddressSave", { text_for_map_search: text, simple_save, google_civic_election_id });
  },

  voterAnalysisForJumpProcess (incoming_voter_device_id) {
    Dispatcher.loadEndpoint("voterAnalysisForJumpProcess", {
      incoming_voter_device_id,
    });
  },

  voterEmailAddressSave (voter_email_address, send_link_to_sign_in = false) {
    Dispatcher.loadEndpoint("voterEmailAddressSave", {
      text_for_email_address: voter_email_address,
      send_link_to_sign_in,
      make_primary_email: true,
      is_cordova: isCordova(),
    });
  },

  voterEmailAddressSignIn (email_secret_key) {
    Dispatcher.loadEndpoint("voterEmailAddressSignIn", {
      email_secret_key,
    });
  },

  voterEmailAddressSignInConfirm (email_secret_key) {
    Dispatcher.loadEndpoint("voterEmailAddressSignIn", {
      email_secret_key,
      yes_please_merge_accounts: true,
    });
  },

  voterEmailAddressVerify (email_secret_key) {
    Dispatcher.loadEndpoint("voterEmailAddressVerify", {
      email_secret_key,
    });
  },

  voterFacebookSaveToCurrentAccount () {
    Dispatcher.loadEndpoint("voterFacebookSaveToCurrentAccount", {
    });
  },

  voterTwitterSaveToCurrentAccount () {
    Dispatcher.loadEndpoint("voterTwitterSaveToCurrentAccount", {
    });
  },

  voterMergeTwoAccountsByEmailKey (email_secret_key) {
    Dispatcher.loadEndpoint("voterMergeTwoAccounts",
      {
        email_secret_key,
        facebook_secret_key: "",
        incoming_voter_device_id: "",
        invitation_secret_key: "",
        twitter_secret_key: "",
      });
  },

  voterMergeTwoAccountsByFacebookKey (facebook_secret_key) {
    // console.log("VoterActions, voterMergeTwoAccountsByFacebookKey");
    Dispatcher.loadEndpoint("voterMergeTwoAccounts",
      {
        email_secret_key: "",
        facebook_secret_key,
        incoming_voter_device_id: "",
        invitation_secret_key: "",
        twitter_secret_key: "",
      });
  },

  voterMergeTwoAccountsByInvitationKey (invitation_secret_key) {
    Dispatcher.loadEndpoint("voterMergeTwoAccounts",
      {
        email_secret_key: "",
        facebook_secret_key: "",
        incoming_voter_device_id: "",
        invitation_secret_key,
        twitter_secret_key: "",
      });
  },

  voterMergeTwoAccountsByJumpProcess (incoming_voter_device_id) {
    // TODO DALE 2018-01-10 voterMergeTwoAccounts doesn't support incoming_voter_device_id yet
    Dispatcher.loadEndpoint("voterMergeTwoAccounts",
      {
        email_secret_key: "",
        facebook_secret_key: "",
        incoming_voter_device_id,
        invitation_secret_key: "",
        twitter_secret_key: "",
      });
  },

  voterMergeTwoAccountsByTwitterKey (twitter_secret_key) {
    Dispatcher.loadEndpoint("voterMergeTwoAccounts",
      {
        email_secret_key: "",
        facebook_secret_key: "",
        incoming_voter_device_id: "",
        invitation_secret_key: "",
        twitter_secret_key,
      });
  },

  voterRetrieve () {
    Dispatcher.loadEndpoint("voterRetrieve");
  },

  voterNameSave (first_name, last_name) {
    Dispatcher.loadEndpoint("voterUpdate",
      {
        first_name,
        last_name,
      });
  },

  // Tell the server to only save this name if a name does not currently exist
  voterFullNameSoftSave (first_name, last_name, full_name = "") {
    Dispatcher.loadEndpoint("voterUpdate",
      {
        first_name,
        last_name,
        full_name,
        name_save_only_if_no_existing_names: true,
      });
  },

  voterUpdateInterfaceStatusFlags (flag_integer_to_set) {
    Dispatcher.loadEndpoint("voterUpdate",
      {
        flag_integer_to_set,
      });
  },

  voterUpdateNotificationSettingsFlags (flag_integer_to_set, flag_integer_to_unset = "") {
    Dispatcher.loadEndpoint("voterUpdate",
      {
        notification_flag_integer_to_set: flag_integer_to_set,
        notification_flag_integer_to_unset: flag_integer_to_unset,
      });
  },

  voterUpdateRefresh () {
    // Just make sure we have the latest voter data
    Dispatcher.loadEndpoint("voterUpdate",
      {
      });
  },

  voterRefreshDonations () {
    Dispatcher.loadEndpoint("voterUpdate",
      {
        send_journal_list: true,
      });
  },

  voterSplitIntoTwoAccounts () {
    Dispatcher.loadEndpoint("voterSplitIntoTwoAccounts",
      {
        split_off_twitter: true,
      });
  },
};
