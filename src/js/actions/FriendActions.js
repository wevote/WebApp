import Dispatcher from '../dispatcher/Dispatcher';
import AppStore from '../stores/AppStore'; // eslint-disable-line import/no-cycle

export default {
  acceptFriendInvite (otherVoterWeVoteId) {
    Dispatcher.loadEndpoint('friendInviteResponse', {
      voter_we_vote_id: otherVoterWeVoteId,
      kind_of_invite_response: 'ACCEPT_INVITATION',
      hostname: AppStore.getHostname(),
    });
  },

  currentFriends () {
    Dispatcher.loadEndpoint('friendList',
      {
        kind_of_list: 'CURRENT_FRIENDS',
      });
  },

  cancelFriendInviteVoter (otherVoterWeVoteId) {
    Dispatcher.loadEndpoint('friendInviteResponse', {
      voter_we_vote_id: otherVoterWeVoteId,
      kind_of_invite_response: 'DELETE_INVITATION_VOTER_SENT_BY_ME',
      hostname: AppStore.getHostname(),
    });
  },

  cancelFriendInviteEmail (otherVoterEmailAddress) {
    Dispatcher.loadEndpoint('friendInviteResponse', {
      recipient_voter_email: otherVoterEmailAddress,
      kind_of_invite_response: 'DELETE_INVITATION_EMAIL_SENT_BY_ME',
      hostname: AppStore.getHostname(),
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
        hostname: AppStore.getHostname(),
      });
  },

  friendInvitationByEmailSend (emailAddressArray, firstNameArray, lastNameArray, emailAddresses,
    invitationMessage, senderEmailAddress) {
    Dispatcher.loadEndpoint('friendInvitationByEmailSend',
      {
        email_address_array: emailAddressArray,
        first_name_array: firstNameArray,
        last_name_array: lastNameArray,
        email_addresses_raw: emailAddresses,
        invitation_message: invitationMessage,
        sender_email_address: senderEmailAddress,
        hostname: AppStore.getHostname(),
      });
  },

  friendInvitationByFacebookSend (data) {
    console.log('FacebookActions friendInvitationByFacebookSend', data);
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
        hostname: AppStore.getHostname(),
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

  friendInvitationByEmailVerify (invitationSecretKey) {
    Dispatcher.loadEndpoint('friendInvitationByEmailVerify', {
      invitation_secret_key: invitationSecretKey,
      hostname: AppStore.getHostname(),
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
      hostname: AppStore.getHostname(),
    });
  },

  ignoreSuggestedFriend (otherVoterWeVoteId) {
    Dispatcher.loadEndpoint('friendInviteResponse', {
      voter_we_vote_id: otherVoterWeVoteId,
      kind_of_invite_response: 'IGNORE_SUGGESTION',
      hostname: AppStore.getHostname(),
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
      hostname: AppStore.getHostname(),
    });
  },
};
