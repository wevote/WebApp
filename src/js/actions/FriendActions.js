import Dispatcher from "../dispatcher/Dispatcher";

export default {
  acceptFriendInvite (other_voter_we_vote_id) {
    Dispatcher.loadEndpoint("friendInviteResponse", {
      voter_we_vote_id: other_voter_we_vote_id,
      kind_of_invite_response: "ACCEPT_INVITATION",
    });
  },

  currentFriends () {
    Dispatcher.loadEndpoint("friendList",
      {
        kind_of_list: "CURRENT_FRIENDS",
      });
  },

  deleteFriendInviteVoter (other_voter_we_vote_id) {
    Dispatcher.loadEndpoint("friendInviteResponse", {
      voter_we_vote_id: other_voter_we_vote_id,
      kind_of_invite_response: "DELETE_INVITATION_VOTER_SENT_BY_ME",
    });
  },

  deleteFriendInviteEmail (other_voter_email_address) {
    Dispatcher.loadEndpoint("friendInviteResponse", {
      recipient_voter_email: other_voter_email_address,
      kind_of_invite_response: "DELETE_INVITATION_EMAIL_SENT_BY_ME",
    });
  },

  emailBallotData (email_address_array, first_name_array, last_name_array, email_addresses,
    invitation_message, ballot_link, sender_email_address, verification_email_sent, deviceType) {
    Dispatcher.loadEndpoint("emailBallotData",
      {
        email_address_array,
        first_name_array,
        last_name_array,
        email_addresses_raw: email_addresses,
        invitation_message,
        ballot_link,
        sender_email_address,
        verification_email_sent,
        device_type: deviceType,
      });
  },

  friendInvitationByEmailSend (email_address_array, first_name_array, last_name_array, email_addresses,
    invitation_message, sender_email_address) {
    Dispatcher.loadEndpoint("friendInvitationByEmailSend",
      {
        email_address_array,
        first_name_array,
        last_name_array,
        email_addresses_raw: email_addresses,
        invitation_message,
        sender_email_address,
      });
  },

  friendInvitationByFacebookSend (data) {
    console.log("FacebookActions friendInvitationByFacebookSend", data);
    Dispatcher.loadEndpoint("friendInvitationByFacebookSend", {
      facebook_request_id: data.request_id || false,
      recipients_facebook_id_array: data.recipients_facebook_id_array || false,
      recipients_facebook_name_array: data.recipients_facebook_name_array || false,
    });
  },

  friendInvitationByWeVoteIdSend (other_voter_we_vote_id) {
    Dispatcher.loadEndpoint("friendInvitationByWeVoteIdSend",
      {
        other_voter_we_vote_id,
      });
  },

  // TODO DALE To be built on API server
  friendInvitationByTwitterHandleSend (twitter_handles, invitation_message) {
    Dispatcher.loadEndpoint("friendInvitationByTwitterHandleSend",
      {
        twitter_handles_raw: twitter_handles,
        invitation_message,
      });
  },

  friendInvitationsProcessed () {
    Dispatcher.loadEndpoint("friendList",
      {
        kind_of_list: "FRIEND_INVITATIONS_PROCESSED",
      });
  },

  friendInvitationsSentByMe () {
    Dispatcher.loadEndpoint("friendList",
      {
        kind_of_list: "FRIEND_INVITATIONS_SENT_BY_ME",
      });
  },

  friendInvitationsSentToMe () {
    Dispatcher.loadEndpoint("friendList",
      {
        kind_of_list: "FRIEND_INVITATIONS_SENT_TO_ME",
      });
  },

  friendInvitationByEmailVerify (invitation_secret_key) {
    Dispatcher.loadEndpoint("friendInvitationByEmailVerify", {
      invitation_secret_key,
    });
  },

  friendInvitationByFacebookVerify (facebook_request_id, recipient_facebook_id, sender_facebook_id) {
    console.log("friendInvitationByFacebookVerify", facebook_request_id);
    Dispatcher.loadEndpoint("friendInvitationByFacebookVerify", {
      facebook_request_id,
      recipient_facebook_id,
      sender_facebook_id,
    });
  },

  // TODO DALE 2016-9-20 To be built
  ignoreFriendInvite (other_voter_we_vote_id) {
    Dispatcher.loadEndpoint("friendInviteResponse", {
      voter_we_vote_id: other_voter_we_vote_id,
      kind_of_invite_response: "IGNORE_INVITATION",
    });
  },

  // TODO DALE 2016-11-3 To be built
  ignoreSuggestedFriend (other_voter_we_vote_id) {
    Dispatcher.loadEndpoint("friendInviteResponse", {
      voter_we_vote_id: other_voter_we_vote_id,
      kind_of_invite_response: "IGNORE_SUGGESTION",
    });
  },

  suggestedFriendList () {
    Dispatcher.loadEndpoint("friendList",
      {
        kind_of_list: "SUGGESTED_FRIEND_LIST",
      });
  },

  unFriend (other_voter_we_vote_id) {
    Dispatcher.loadEndpoint("friendInviteResponse", {
      voter_we_vote_id: other_voter_we_vote_id,
      kind_of_invite_response: "UNFRIEND_CURRENT_FRIEND",
    });
  },
};
