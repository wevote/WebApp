import Dispatcher from '../dispatcher/Dispatcher';
import { isCordova } from '../utils/cordovaUtils'; // eslint-disable-line import/no-cycle
import AppStore from '../stores/AppStore'; // eslint-disable-line import/no-cycle

export default {
  clearEmailAddressStatus () {
    Dispatcher.dispatch({ type: 'clearEmailAddressStatus', payload: true });
  },

  clearSecretCodeVerificationStatus () {
    Dispatcher.dispatch({ type: 'clearSecretCodeVerificationStatus', payload: true });
  },

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

  removeVoterSMSPhoneNumber (smsWeVoteId) {
    Dispatcher.loadEndpoint('voterSMSPhoneNumberSave', {
      sms_we_vote_id: smsWeVoteId,
      delete_sms: true,
      hostname: AppStore.getHostname(),
    });
  },

  // Send the sign in link to their email address
  // We keep this in place for historical purposes, since people who haven't
  // updated their apps are still using this function
  sendSignInLinkEmail (voterEmailAddress) {
    Dispatcher.loadEndpoint('voterEmailAddressSave', {
      text_for_email_address: voterEmailAddress,
      send_link_to_sign_in: true,
      make_primary_email: true,
      hostname: AppStore.getHostname(),
    });
  },

  // This is for sending a 6 digit code that the voter enters in the same
  // interface where the code is requested
  sendSignInCodeEmail (voterEmailAddress) {
    Dispatcher.loadEndpoint('voterEmailAddressSave', {
      text_for_email_address: voterEmailAddress,
      send_sign_in_code_email: true,
      make_primary_email: true,
      hostname: AppStore.getHostname(),
    });
  },

  // This is for sending a 6 digit code that the voter enters in the same
  // interface where the code is requested
  sendSignInCodeSMS (voterSMSPhoneNumber) {
    Dispatcher.loadEndpoint('voterSMSPhoneNumberSave', {
      sms_phone_number: voterSMSPhoneNumber,
      send_sign_in_code_sms: true,
      make_primary_sms_phone_number: true,
      hostname: AppStore.getHostname(),
    });
  },

  sendVerificationEmail (voterEmailWeVoteId) {
    Dispatcher.loadEndpoint('voterEmailAddressSave', {
      email_we_vote_id: voterEmailWeVoteId,
      resend_verification_email: true,
      hostname: AppStore.getHostname(),
    });
  },

  setAsPrimaryEmailAddress (emailWeVoteId) {
    Dispatcher.loadEndpoint('voterEmailAddressSave', {
      email_we_vote_id: emailWeVoteId,
      make_primary_email: true,
    });
  },

  setAsPrimarySMSPhoneNumber (smsWeVoteId) {
    Dispatcher.loadEndpoint('voterSMSPhoneNumberSave', {
      sms_we_vote_id: smsWeVoteId,
      make_primary_sms_phone_number: true,
      hostname: AppStore.getHostname(),
    });
  },

  setExternalVoterId (externalVoterId) {
    Dispatcher.dispatch({ type: 'setExternalVoterId', payload: externalVoterId });
  },

  twitterRetrieveIdsIfollow () {
    Dispatcher.loadEndpoint('twitterRetrieveIdsIFollow', {});
  },

  voterAddressRetrieve (id) {
    // console.log("VoterActions, voterAddressRetrieve");
    Dispatcher.loadEndpoint('voterAddressRetrieve', { voter_device_id: id });
  },

  voterAddressSave (text, simple_save = false, google_civic_election_id = 0) {
    Dispatcher.loadEndpoint('voterAddressSave', { text_for_map_search: text, simple_save, google_civic_election_id });
  },

  voterAnalysisForJumpProcess (incomingVoterDeviceId) {
    Dispatcher.loadEndpoint('voterAnalysisForJumpProcess', {
      incoming_voter_device_id: incomingVoterDeviceId,
    });
  },

  voterEmailAddressRetrieve () {
    Dispatcher.loadEndpoint('voterEmailAddressRetrieve', {});
  },

  voterEmailAddressSave (voterEmailAddress, send_link_to_sign_in = false) {
    Dispatcher.loadEndpoint('voterEmailAddressSave', {
      text_for_email_address: voterEmailAddress,
      send_link_to_sign_in,
      make_primary_email: true,
      is_cordova: isCordova(),
      hostname: AppStore.getHostname(),
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

  voterExternalIdSave (externalVoterId, membershipOrganizationWeVoteId) {
    Dispatcher.loadEndpoint('voterUpdate',
      {
        external_voter_id: externalVoterId,
        membership_organization_we_vote_id: membershipOrganizationWeVoteId,
      });
  },

  voterFacebookSaveToCurrentAccount () {
    Dispatcher.loadEndpoint('voterFacebookSaveToCurrentAccount', {
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

  voterMergeTwoAccountsByEmailKey (emailSecretKey) {
    Dispatcher.loadEndpoint('voterMergeTwoAccounts',
      {
        email_secret_key: emailSecretKey,
        facebook_secret_key: '',
        incoming_voter_device_id: '',
        invitation_secret_key: '',
        twitter_secret_key: '',
        hostname: AppStore.getHostname(),
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
        hostname: AppStore.getHostname(),
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
        hostname: AppStore.getHostname(),
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
        hostname: AppStore.getHostname(),
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
        hostname: AppStore.getHostname(),
      });
  },

  voterNameSave (firstName, lastName) {
    Dispatcher.loadEndpoint('voterUpdate',
      {
        first_name: firstName,
        last_name: lastName,
      });
  },

  voterRetrieve () {
    Dispatcher.loadEndpoint('voterRetrieve');
  },

  voterSMSPhoneNumberRetrieve () {
    Dispatcher.loadEndpoint('voterSMSPhoneNumberRetrieve', {});
  },

  voterSMSPhoneNumberSave (smsPhoneNumber) {
    Dispatcher.loadEndpoint('voterSMSPhoneNumberSave', {
      sms_phone_number: smsPhoneNumber,
      make_primary_sms_phone_number: true,
      hostname: AppStore.getHostname(),
    });
  },

  voterSplitIntoTwoAccounts () {
    Dispatcher.loadEndpoint('voterSplitIntoTwoAccounts',
      {
        split_off_twitter: true,
      });
  },

  voterTwitterSaveToCurrentAccount () {
    Dispatcher.loadEndpoint('voterTwitterSaveToCurrentAccount', {
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

  voterVerifySecretCode (secretCode, codeSentToSMSPhoneNumber) {
    // console.log('VoterActions, voterVerifySecretCode codeSentToSMSPhoneNumber:', codeSentToSMSPhoneNumber);
    Dispatcher.loadEndpoint('voterVerifySecretCode', {
      secret_code: secretCode,
      code_sent_to_sms_phone_number: codeSentToSMSPhoneNumber,
    });
  },
};
