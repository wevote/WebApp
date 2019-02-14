import Dispatcher from '../dispatcher/Dispatcher';
import { isCordova } from '../utils/cordovaUtils';

export default {
  organizationSuggestionTasks (kindOfSuggestionTask, kindOfFollowTask) {
    Dispatcher.loadEndpoint('organizationSuggestionTasks',
      {
        kind_of_suggestion_task: kindOfSuggestionTask,
        kind_of_follow_task: kindOfFollowTask,
      });
  },

  positionListForVoter (showOnlyThisElection, showAllOtherElections) {
    Dispatcher.loadEndpoint('positionListForVoter',
      {
        show_only_this_election: showOnlyThisElection,
        show_all_other_elections: showAllOtherElections,
      });
  },

  removeVoterEmailAddress (emailWeVoteId) {
    Dispatcher.loadEndpoint('voterEmailAddressSave', {
      email_we_vote_id: emailWeVoteId,
      delete_email: true,
    });
  },

  // Send the sign in link to their email address
  sendSignInLinkEmail (voterEmailAddress) {
    Dispatcher.loadEndpoint('voterEmailAddressSave', {
      text_for_email_address: voterEmailAddress,
      send_link_to_sign_in: true,
      make_primary_email: true,
    });
  },

  sendVerificationEmail (voterEmailWeVoteId) {
    Dispatcher.loadEndpoint('voterEmailAddressSave', {
      email_we_vote_id: voterEmailWeVoteId,
      resend_verification_email: true,
    });
  },

  setAsPrimaryEmailAddress (emailWeVoteId) {
    Dispatcher.loadEndpoint('voterEmailAddressSave', {
      email_we_vote_id: emailWeVoteId,
      make_primary_email: true,
    });
  },

  twitterRetrieveIdsIfollow () {
    Dispatcher.loadEndpoint('twitterRetrieveIdsIFollow', {});
  },

  voterAddressRetrieve (id) {
    // console.log("VoterActions, voterAddressRetrieve");
    Dispatcher.loadEndpoint('voterAddressRetrieve', { voter_device_id: id });
  },

  voterEmailAddressRetrieve () {
    Dispatcher.loadEndpoint('voterEmailAddressRetrieve', {});
  },

  voterAddressSave (text, simple_save = false, google_civic_election_id = 0) {
    Dispatcher.loadEndpoint('voterAddressSave', { text_for_map_search: text, simple_save, google_civic_election_id });
  },

  voterAnalysisForJumpProcess (incomingVoterDeviceId) {
    Dispatcher.loadEndpoint('voterAnalysisForJumpProcess', {
      incoming_voter_device_id: incomingVoterDeviceId,
    });
  },

  voterEmailAddressSave (voterEmailAddress, send_link_to_sign_in = false) {
    Dispatcher.loadEndpoint('voterEmailAddressSave', {
      text_for_email_address: voterEmailAddress,
      send_link_to_sign_in,
      make_primary_email: true,
      is_cordova: isCordova(),
    });
  },

  voterEmailAddressSignIn (emailSecretKey) {
    Dispatcher.loadEndpoint('voterEmailAddressSignIn', {
      email_secret_key: emailSecretKey,
    });
  },

  voterEmailAddressSignInConfirm (emailSecretKey) {
    Dispatcher.loadEndpoint('voterEmailAddressSignIn', {
      email_secret_key: emailSecretKey,
      yes_please_merge_accounts: true,
    });
  },

  voterEmailAddressVerify (emailSecretKey) {
    Dispatcher.loadEndpoint('voterEmailAddressVerify', {
      email_secret_key: emailSecretKey,
    });
  },

  voterFacebookSaveToCurrentAccount () {
    Dispatcher.loadEndpoint('voterFacebookSaveToCurrentAccount', {
    });
  },

  voterTwitterSaveToCurrentAccount () {
    Dispatcher.loadEndpoint('voterTwitterSaveToCurrentAccount', {
    });
  },

  voterMergeTwoAccountsByEmailKey (emailSecretKey) {
    Dispatcher.loadEndpoint('voterMergeTwoAccounts',
      {
        email_secret_key: emailSecretKey,
        facebook_secret_key: '',
        incoming_voter_device_id: '',
        invitation_secret_key: '',
        twitter_secret_key: '',
      });
  },

  voterMergeTwoAccountsByFacebookKey (facebookSecretKey) {
    // console.log("VoterActions, voterMergeTwoAccountsByFacebookKey");
    Dispatcher.loadEndpoint('voterMergeTwoAccounts',
      {
        email_secret_key: '',
        facebook_secret_key: facebookSecretKey,
        incoming_voter_device_id: '',
        invitation_secret_key: '',
        twitter_secret_key: '',
      });
  },

  voterMergeTwoAccountsByInvitationKey (invitationSecretKey) {
    Dispatcher.loadEndpoint('voterMergeTwoAccounts',
      {
        email_secret_key: '',
        facebook_secret_key: '',
        incoming_voter_device_id: '',
        invitation_secret_key: invitationSecretKey,
        twitter_secret_key: '',
      });
  },

  voterMergeTwoAccountsByJumpProcess (incomingVoterDeviceId) {
    // TODO DALE 2018-01-10 voterMergeTwoAccounts doesn't support incomingVoterDeviceId yet
    Dispatcher.loadEndpoint('voterMergeTwoAccounts',
      {
        email_secret_key: '',
        facebook_secret_key: '',
        incoming_voter_device_id: incomingVoterDeviceId,
        invitation_secret_key: '',
        twitter_secret_key: '',
      });
  },

  voterMergeTwoAccountsByTwitterKey (twitterSecretKey) {
    Dispatcher.loadEndpoint('voterMergeTwoAccounts',
      {
        email_secret_key: '',
        facebook_secret_key: '',
        incoming_voter_device_id: '',
        invitation_secret_key: '',
        twitter_secret_key: twitterSecretKey,
      });
  },

  voterRetrieve () {
    Dispatcher.loadEndpoint('voterRetrieve');
  },

  voterNameSave (firstName, lastName) {
    Dispatcher.loadEndpoint('voterUpdate',
      {
        first_name: firstName,
        last_name: lastName,
      });
  },

  // Tell the server to only save this name if a name does not currently exist
  voterFullNameSoftSave (firstName, lastName, full_name = '') {
    Dispatcher.loadEndpoint('voterUpdate',
      {
        first_name: firstName,
        last_name: lastName,
        full_name,
        name_save_only_if_no_existing_names: true,
      });
  },

  voterUpdateInterfaceStatusFlags (flagIntegerToSet) {
    Dispatcher.loadEndpoint('voterUpdate',
      {
        flag_integer_to_set: flagIntegerToSet,
      });
  },

  voterUpdateNotificationSettingsFlags (flagIntegerToSet, flag_integer_to_unset = '') {
    Dispatcher.loadEndpoint('voterUpdate',
      {
        notification_flag_integer_to_set: flagIntegerToSet,
        notification_flag_integer_to_unset: flag_integer_to_unset,
      });
  },

  voterUpdateRefresh () {
    // Just make sure we have the latest voter data
    Dispatcher.loadEndpoint('voterUpdate',
      {
      });
  },

  voterRefreshDonations () {
    Dispatcher.loadEndpoint('voterUpdate',
      {
        send_journal_list: true,
      });
  },

  voterSplitIntoTwoAccounts () {
    Dispatcher.loadEndpoint('voterSplitIntoTwoAccounts',
      {
        split_off_twitter: true,
      });
  },
};
