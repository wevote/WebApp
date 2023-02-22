import Dispatcher from '../common/dispatcher/Dispatcher';
import { isCordova } from '../common/utils/isCordovaOrWebApp'; // eslint-disable-line import/no-cycle
import AppObservableStore from '../common/stores/AppObservableStore'; // eslint-disable-line import/no-cycle
import arrayContains from '../common/utils/arrayContains';

export default {
  clearEmailAddressStatus () {
    Dispatcher.dispatch({ type: 'clearEmailAddressStatus', payload: true });
  },

  clearSecretCodeVerificationStatus () {
    Dispatcher.dispatch({ type: 'clearSecretCodeVerificationStatus', payload: true });
  },

  clearSecretCodeVerificationStatusAndEmail () {
    Dispatcher.dispatch({ type: 'clearSecretCodeVerificationStatusAndEmail', payload: true });
  },

  clearSecretCodeVerificationStatusAndPhone () {
    Dispatcher.dispatch({ type: 'clearSecretCodeVerificationStatusAndPhone', payload: true });
  },

  clearSMSPhoneNumberStatus () {
    Dispatcher.dispatch({ type: 'clearSMSPhoneNumberStatus', payload: true });
  },

  clearVoterElectionId () {
    Dispatcher.dispatch({ type: 'clearVoterElectionId', payload: true });
  },

  clearVoterContactEmailImportVariables () {
    Dispatcher.dispatch({ type: 'clearVoterContactEmailImportVariables', payload: true });
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
      hostname: AppObservableStore.getHostname(),
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
      hostname: AppObservableStore.getHostname(),
    });
  },

  // This is for sending a 6 digit code that the voter enters in the same
  // interface where the code is requested
  sendSignInCodeEmail (voterEmailAddress) {
    Dispatcher.loadEndpoint('voterEmailAddressSave', {
      text_for_email_address: voterEmailAddress,
      send_sign_in_code_email: true,
      hostname: AppObservableStore.getHostname(),
    });
  },

  // This is for sending a 6 digit code that the voter enters in the same
  // interface where the code is requested
  sendSignInCodeSMS (voterSMSPhoneNumber) {
    Dispatcher.loadEndpoint('voterSMSPhoneNumberSave', {
      sms_phone_number: voterSMSPhoneNumber,
      send_sign_in_code_sms: true,
      make_primary_sms_phone_number: true,
      hostname: AppObservableStore.getHostname(),
    });
  },

  sendVerificationEmail (voterEmailWeVoteId) {
    Dispatcher.loadEndpoint('voterEmailAddressSave', {
      email_we_vote_id: voterEmailWeVoteId,
      resend_verification_email: true,
      hostname: AppObservableStore.getHostname(),
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
      hostname: AppObservableStore.getHostname(),
    });
  },

  setExternalVoterId (externalVoterId) {
    Dispatcher.dispatch({ type: 'setExternalVoterId', payload: externalVoterId });
  },

  twitterRetrieveIdsIfollow () {
    Dispatcher.loadEndpoint('twitterRetrieveIdsIFollow', {});
  },

  voterAccountDelete (deleteVoterAccount = false) {
    Dispatcher.loadEndpoint('voterUpdate', {
      delete_voter_account: deleteVoterAccount,
    });
  },

  voterAddressRetrieve (id) {
    // console.log("VoterActions, voterAddressRetrieve");
    Dispatcher.loadEndpoint('voterAddressRetrieve', { voter_device_id: id });
  },

  voterAddressOnlyRetrieve (id) {
    // console.log("VoterActions, voterAddressOnlyRetrieve");
    // Note:  This calls the voterAddressRetrieve API without the cascading requests that have been added to the root voterAddressRetrieve endpoint.
    // See Dispatcher.js at endpointAdjusted
    Dispatcher.loadEndpoint('voterAddressOnlyRetrieve', { voter_device_id: id });
  },

  voterAddressSave (text, simple_save = false, google_civic_election_id = 0) {
    // console.log('VoterActions voterAddressSave, text:', text);
    Dispatcher.loadEndpoint('voterAddressSave', { text_for_map_search: text, simple_save, google_civic_election_id });
  },

  voterAnalysisForJumpProcess (incomingVoterDeviceId) {
    Dispatcher.loadEndpoint('voterAnalysisForJumpProcess', {
      incoming_voter_device_id: incomingVoterDeviceId,
    });
  },

  voterCompleteYourProfileSave (firstName = '', firstNameChanged = false, lastName = '', lastNameChanged = false, voterPhotoQueuedToSave = '', voterPhotoQueuedToSaveSet = false) {
    Dispatcher.loadEndpoint('voterUpdate',
      {
        first_name: firstName,
        first_name_changed: firstNameChanged,
        last_name: lastName,
        last_name_changed: lastNameChanged,
        voter_photo_from_file_reader: voterPhotoQueuedToSave,
        voter_photo_changed: voterPhotoQueuedToSaveSet,
      });
  },

  voterContactIgnore (emailAddressText, otherVoterWeVoteId = '') {
    Dispatcher.loadEndpoint('voterContactSave', {
      email_address_text: emailAddressText,
      ignore_voter_contact: true,
      other_voter_we_vote_id: otherVoterWeVoteId,
    });
  },

  voterContactStopIgnoring (emailAddressText, otherVoterWeVoteId = '') {
    Dispatcher.loadEndpoint('voterContactSave', {
      email_address_text: emailAddressText,
      stop_ignoring_voter_contact: true,
      other_voter_we_vote_id: otherVoterWeVoteId,
    });
  },

  voterContactListAugmentWithLocation (augmentWithLocation = false) {
    Dispatcher.loadEndpoint('voterContactListSave', {
      augment_voter_contact_emails_with_location: augmentWithLocation,
    });
  },

  voterContactListAugmentWithWeVoteData (augmentWithWeVoteData = false) {
    Dispatcher.loadEndpoint('voterContactListSave', {
      augment_voter_contact_emails_with_we_vote_data: augmentWithWeVoteData,
    });
  },

  voterContactListDelete (deleteAllVoterContactEmails = false) {
    Dispatcher.loadEndpoint('voterContactListSave', {
      delete_all_voter_contact_emails: deleteAllVoterContactEmails,
    });
  },

  voterContactListRetrieve () {
    Dispatcher.loadEndpoint('voterContactListRetrieve', {});
  },

  voterContactListSave (contacts, fromGooglePeopleApi = false) {
    const contactsString = JSON.stringify(contacts);
    // console.log('voterContactListSave contacts: ', contactsString);
    Dispatcher.loadEndpoint('voterContactListSave', {
      contacts: contactsString,
      from_google_people_api: fromGooglePeopleApi,
      google_api_key_type: 'ballot',
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
      hostname: AppObservableStore.getHostname(),
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

  voterEmailAddressVerify (emailSecretKey, firstName = '', lastName = '', fullName = '') {
    Dispatcher.loadEndpoint('voterEmailAddressVerify', {
      email_secret_key: emailSecretKey,
      first_name: firstName,
      first_name_changed: firstName && firstName !== '',
      last_name: lastName,
      last_name_changed: lastName && lastName !== '',
      full_name: fullName,
      full_name_changed: fullName && fullName !== '',
      name_save_only_if_no_existing_names: true,
    });
  },

  voterEmailQueuedToSave (voterEmail) {
    Dispatcher.dispatch({ type: 'voterEmailQueuedToSave', payload: voterEmail });
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

  voterFirstNameQueuedToSave (firstName) {
    Dispatcher.dispatch({ type: 'voterFirstNameQueuedToSave', payload: firstName });
  },

  // Tell the server to only save this name if a name does not currently exist
  voterFullNameSoftSave (firstName, lastName, fullName = '') {
    Dispatcher.loadEndpoint('voterUpdate',
      {
        first_name: firstName,
        first_name_changed: firstName && firstName !== '',
        last_name: lastName,
        last_name_changed: lastName && lastName !== '',
        full_name: fullName,
        full_name_changed: fullName && fullName !== '',
        name_save_only_if_no_existing_names: true,
      });
  },

  voterLastNameQueuedToSave (lastName) {
    Dispatcher.dispatch({ type: 'voterLastNameQueuedToSave', payload: lastName });
  },

  voterMergeTwoAccountsByEmailKey (emailSecretKey, doNotMergeIfCurrentlySignedIn = false) {
    Dispatcher.loadEndpoint('voterMergeTwoAccounts',
      {
        do_not_merge_if_currently_signed_in: doNotMergeIfCurrentlySignedIn,
        email_secret_key: emailSecretKey,
        facebook_secret_key: '',
        incoming_voter_device_id: '',
        invitation_secret_key: '',
        twitter_secret_key: '',
        hostname: AppObservableStore.getHostname(),
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
        hostname: AppObservableStore.getHostname(),
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
        hostname: AppObservableStore.getHostname(),
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
        hostname: AppObservableStore.getHostname(),
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
        hostname: AppObservableStore.getHostname(),
      });
  },

  voterNameSave (firstName, lastName) {
    Dispatcher.loadEndpoint('voterUpdate',
      {
        first_name: firstName,
        first_name_changed: true,
        last_name: lastName,
        last_name_changed: true,
      });
  },

  voterPhotoDelete () {
    Dispatcher.loadEndpoint('voterUpdate',
      {
        voter_photo_from_file_reader: '',
        voter_photo_changed: true,
      });
  },

  voterPhotoQueuedToSave (voterPhotoFromFileReader) {
    Dispatcher.dispatch({ type: 'voterPhotoQueuedToSave', payload: voterPhotoFromFileReader });
  },

  voterPhotoSave (voterPhotoQueuedToSave = '', voterPhotoQueuedToSaveSet = false, profileImageTypeCurrentlyActive = '') {
    // console.log('VoterActions voterPhotoSave');
    const profileImageTypeCurrentlyActiveSet = arrayContains(profileImageTypeCurrentlyActive, ['FACEBOOK', 'TWITTER', 'UPLOADED']);
    Dispatcher.loadEndpoint('voterUpdate',
      {
        profile_image_type_currently_active: profileImageTypeCurrentlyActive,
        profile_image_type_currently_active_changed: profileImageTypeCurrentlyActiveSet,
        voter_photo_from_file_reader: voterPhotoQueuedToSave,
        voter_photo_changed: voterPhotoQueuedToSaveSet,
      });
  },

  voterPhotoTooBigReset () {
    Dispatcher.dispatch({ type: 'voterPhotoTooBigReset', payload: true });
  },

  voterRetrieve (mergeFromVoterWeVoteId = '', mergeToVoterWeVoteId = '') {
    // console.log('VoterActions, voterRetrieve mergeFromVoterWeVoteId:', mergeFromVoterWeVoteId, ', mergeToVoterWeVoteId:', mergeToVoterWeVoteId);
    if (mergeFromVoterWeVoteId && mergeToVoterWeVoteId) {
      Dispatcher.loadEndpoint('voterRetrieve', {
        merge_from_voter_we_vote_id: mergeFromVoterWeVoteId,
        merge_to_voter_we_vote_id: mergeToVoterWeVoteId,
      });
    } else {
      Dispatcher.loadEndpoint('voterRetrieve');
    }
  },

  voterSignOut (signOutAllDevices = false) {
    Dispatcher.loadEndpoint('voterSignOut', {
      sign_out_all_devices: signOutAllDevices,
    });
  },

  voterSMSPhoneNumberRetrieve () {
    Dispatcher.loadEndpoint('voterSMSPhoneNumberRetrieve', {});
  },

  voterSMSPhoneNumberSave (smsPhoneNumber) {
    Dispatcher.loadEndpoint('voterSMSPhoneNumberSave', {
      sms_phone_number: smsPhoneNumber,
      make_primary_sms_phone_number: true,
      hostname: AppObservableStore.getHostname(),
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

  voterUpdateNotificationSettingsFlags (flagIntegerToSet, flagIntegerToUnset = '') {
    Dispatcher.loadEndpoint('voterUpdate',
      {
        notification_flag_integer_to_set: flagIntegerToSet,
        notification_flag_integer_to_unset: flagIntegerToUnset,
      });
  },

  voterNotificationSettingsUpdateFromSecretKey (emailSubscriptionSecretKey = '', smsSubscriptionSecretKey = '', flagIntegerToSet = 0, flagIntegerToSetChanged = false, flagIntegerToUnset = 0, flagIntegerToUnsetChanged = false) {
    Dispatcher.loadEndpoint('voterNotificationSettingsUpdate',
      {
        email_subscription_secret_key: emailSubscriptionSecretKey,
        sms_subscription_secret_key: smsSubscriptionSecretKey,
        notification_flag_integer_to_set: flagIntegerToSet,
        notification_flag_integer_to_set_changed: flagIntegerToSetChanged,
        notification_flag_integer_to_unset: flagIntegerToUnset,
        notification_flag_integer_to_unset_changed: flagIntegerToUnsetChanged,
      });
  },

  voterVerifySecretCode (secretCode, codeSentToSMSPhoneNumber) {
    // console.log('VoterActions, voterVerifySecretCode codeSentToSMSPhoneNumber:', codeSentToSMSPhoneNumber);
    Dispatcher.loadEndpoint('voterVerifySecretCode', {
      secret_code: secretCode,
      code_sent_to_sms_phone_number: codeSentToSMSPhoneNumber,
    });
  },

  voterAppleSignInSave (email, givenName, middleName, familyName, user, identityToken) {
    // eslint-disable-next-line camelcase
    const { device: { platform: apple_platform, version: apple_os_version, model: apple_model } } = window;
    Dispatcher.loadEndpoint('appleSignInSave', {
      email,
      first_name: givenName,
      middle_name: middleName,
      last_name: familyName,
      user_code: user,
      apple_platform,
      apple_os_version,
      apple_model,
      identity_token: identityToken,
    });
  },

  deviceStoreFirebaseCloudMessagingToken (firebaseFCMToken) {
    Dispatcher.loadEndpoint('deviceStoreFirebaseCloudMessagingToken', {
      firebase_fcm_token: firebaseFCMToken,
    });
  },

};
