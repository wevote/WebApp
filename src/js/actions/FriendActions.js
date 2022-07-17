import Dispatcher from '../common/dispatcher/Dispatcher';
import AppObservableStore from '../stores/AppObservableStore'; // eslint-disable-line import/no-cycle

export default {
  acceptFriendInvite (otherVoterWeVoteId) {
    Dispatcher.loadEndpoint('friendInviteResponse', {
      voter_we_vote_id: otherVoterWeVoteId,
      kind_of_invite_response: 'ACCEPT_INVITATION',
      hostname: AppObservableStore.getHostname(),
    });
  },

  clearErrorMessageToShowVoter () {
    Dispatcher.dispatch({ type: 'clearErrorMessageToShowVoter', payload: true });
  },

  currentFriends () {
    Dispatcher.loadEndpoint('friendList',
      {
        kind_of_list: 'CURRENT_FRIENDS',
      });
  },

  // July 2021: These 6 api queries were being fired simultaneously, and prior to this, without apiCalming it was much worse.
  // They tied up all 6 http channels in the browser for 1.26 seconds -- this new API combines them all into one call.
  // 'CURRENT_FRIENDS' 'FRIEND_INVITATIONS_PROCESSED' 'FRIEND_INVITATIONS_WAITING_FOR_VERIFICATION'
  // 'FRIEND_INVITATIONS_SENT_BY_ME' 'FRIEND_INVITATIONS_SENT_TO_ME' 'SUGGESTED_FRIEND_LIST'
  getAllFriendLists () {
    Dispatcher.loadEndpoint('friendListsAll',
      {});
  },

  cancelFriendInviteVoter (otherVoterWeVoteId) {
    Dispatcher.loadEndpoint('friendInviteResponse', {
      voter_we_vote_id: otherVoterWeVoteId,
      kind_of_invite_response: 'DELETE_INVITATION_VOTER_SENT_BY_ME',
      hostname: AppObservableStore.getHostname(),
    });
  },

  cancelFriendInviteEmail (otherVoterEmailAddress) {
    Dispatcher.loadEndpoint('friendInviteResponse', {
      recipient_voter_email: otherVoterEmailAddress,
      kind_of_invite_response: 'DELETE_INVITATION_EMAIL_SENT_BY_ME',
      hostname: AppObservableStore.getHostname(),
    });
  },

  emailBallotData (emailAddressArray, firstNameArray, lastNameArray, emailAddresses,
    invitationMessage, ballotLink, senderEmailAddress, verificationEmailSent, deviceType) {
    Dispatcher.loadEndpoint('emailBallotData',
      {
        email_address_array: emailAddressArray,
        first_name_array: firstNameArray,
        last_name_array: lastNameArray,
        email_addresses_raw: emailAddresses,
        invitation_message: invitationMessage,
        ballot_link: ballotLink,
        sender_email_address: senderEmailAddress,
        verification_email_sent: verificationEmailSent,
        device_type: deviceType,
        hostname: AppObservableStore.getHostname(),
      });
  },

  friendInvitationByEmailSend (emailAddressArray, firstNameArray, lastNameArray, emailAddresses, invitationMessage, senderEmailAddress) {
    // console.log('friendInvitationByEmailSend emailAddressArray:', emailAddressArray);
    Dispatcher.loadEndpoint('friendInvitationByEmailSend',
      {
        email_address_array: emailAddressArray,
        first_name_array: firstNameArray,
        last_name_array: lastNameArray,
        email_addresses_raw: emailAddresses,
        invitation_message: invitationMessage,
        sender_email_address: senderEmailAddress,
        hostname: AppObservableStore.getHostname(),
      });
  },

  friendInvitationByFacebookSend (data) {
    // console.log('FacebookActions friendInvitationByFacebookSend', data);
    Dispatcher.loadEndpoint('friendInvitationByFacebookSend', {
      facebook_request_id: data.request_id || false,
      recipients_facebook_id_array: data.recipients_facebook_id_array || false,
      recipients_facebook_name_array: data.recipients_facebook_name_array || false,
    });
  },

  friendInvitationByWeVoteIdSend (otherVoterWeVoteId) {
    Dispatcher.loadEndpoint('friendInvitationByWeVoteIdSend',
      {
        other_voter_we_vote_id: otherVoterWeVoteId,
        hostname: AppObservableStore.getHostname(),
      });
  },

  // TODO DALE To be built on API server
  friendInvitationByTwitterHandleSend (twitterHandles, invitationMessage) {
    Dispatcher.loadEndpoint('friendInvitationByTwitterHandleSend',
      {
        twitter_handles_raw: twitterHandles,
        invitation_message: invitationMessage,
      });
  },

  friendInvitationsProcessed () {
    Dispatcher.loadEndpoint('friendList',
      {
        kind_of_list: 'FRIEND_INVITATIONS_PROCESSED',
      });
  },

  friendInvitationsWaitingForVerification () {
    Dispatcher.loadEndpoint('friendList',
      {
        kind_of_list: 'FRIEND_INVITATIONS_WAITING_FOR_VERIFICATION',
      });
  },

  friendInvitationsSentByMe () {
    Dispatcher.loadEndpoint('friendList',
      {
        kind_of_list: 'FRIEND_INVITATIONS_SENT_BY_ME',
      });
  },

  friendInvitationsSentToMe () {
    Dispatcher.loadEndpoint('friendList',
      {
        kind_of_list: 'FRIEND_INVITATIONS_SENT_TO_ME',
      });
  },

  friendInvitationInformation (invitationSecretKey) {
    Dispatcher.loadEndpoint('friendInvitationInformation', {
      invitation_secret_key: invitationSecretKey,
    });
  },

  friendInvitationByEmailVerify (invitationSecretKey, acceptanceEmailShouldBeSent = false) {
    Dispatcher.loadEndpoint('friendInvitationByEmailVerify', {
      acceptance_email_should_be_sent: acceptanceEmailShouldBeSent,
      invitation_secret_key: invitationSecretKey,
      hostname: AppObservableStore.getHostname(),
    });
  },

  friendInvitationByFacebookVerify (facebookRequestId, recipientFacebookId, senderFacebookId) {
    console.log('friendInvitationByFacebookVerify', facebookRequestId);
    Dispatcher.loadEndpoint('friendInvitationByFacebookVerify', {
      facebook_request_id: facebookRequestId,
      recipient_facebook_id: recipientFacebookId,
      sender_facebook_id: senderFacebookId,
    });
  },

  ignoreFriendInvite (otherVoterWeVoteId) {
    Dispatcher.loadEndpoint('friendInviteResponse', {
      voter_we_vote_id: otherVoterWeVoteId,
      kind_of_invite_response: 'IGNORE_INVITATION',
      hostname: AppObservableStore.getHostname(),
    });
  },

  ignoreSuggestedFriend (otherVoterWeVoteId) {
    Dispatcher.loadEndpoint('friendInviteResponse', {
      voter_we_vote_id: otherVoterWeVoteId,
      kind_of_invite_response: 'IGNORE_SUGGESTION',
      hostname: AppObservableStore.getHostname(),
    });
  },

  messageToFriendQueuedToSave (messageToFriend) {
    Dispatcher.dispatch({ type: 'messageToFriendQueuedToSave', payload: messageToFriend });
  },

  messageToFriendSend (otherVoterWeVoteId, messageToFriend, electionDateInFutureFormatted, electionDateIsToday) {
    Dispatcher.loadEndpoint('messageToFriendSend',
      {
        election_date_in_future_formatted: electionDateInFutureFormatted,
        election_date_is_today: electionDateIsToday,
        hostname: AppObservableStore.getHostname(),
        message_to_friend: messageToFriend,
        other_voter_we_vote_id: otherVoterWeVoteId,
      });
  },

  suggestedFriendList () {
    Dispatcher.loadEndpoint('friendList',
      {
        kind_of_list: 'SUGGESTED_FRIEND_LIST',
      });
  },

  unFriend (otherVoterWeVoteId) {
    Dispatcher.loadEndpoint('friendInviteResponse', {
      voter_we_vote_id: otherVoterWeVoteId,
      kind_of_invite_response: 'UNFRIEND_CURRENT_FRIEND',
      hostname: AppObservableStore.getHostname(),
    });
  },
};
