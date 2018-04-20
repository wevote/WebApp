import Dispatcher from "../dispatcher/Dispatcher";

export default {
  acceptFriendInvite: function (other_voter_we_vote_id) {
    Dispatcher.loadEndpoint("friendInviteResponse", {
      voter_we_vote_id: other_voter_we_vote_id,
      kind_of_invite_response: "ACCEPT_INVITATION"
    } );
  },

  currentFriends: function () {
    Dispatcher.loadEndpoint("friendList",
      {
        kind_of_list: "CURRENT_FRIENDS"
      });
  },

  deleteFriendInviteVoter: function (other_voter_we_vote_id) {
    Dispatcher.loadEndpoint("friendInviteResponse", {
      voter_we_vote_id: other_voter_we_vote_id,
      kind_of_invite_response: "DELETE_INVITATION_VOTER_SENT_BY_ME"
    });
  },

  deleteFriendInviteEmail: function (other_voter_email_address) {
    Dispatcher.loadEndpoint("friendInviteResponse", {
      recipient_voter_email: other_voter_email_address,
      kind_of_invite_response: "DELETE_INVITATION_EMAIL_SENT_BY_ME"
    });
  },

  emailBallotData: function ( email_address_array, first_name_array, last_name_array, email_addresses,
                              invitation_message, ballot_link, sender_email_address, verification_email_sent, deviceType) {
    Dispatcher.loadEndpoint("emailBallotData",
      {
        email_address_array: email_address_array,
        first_name_array: first_name_array,
        last_name_array: last_name_array,
        email_addresses_raw: email_addresses,
        invitation_message: invitation_message,
        ballot_link: ballot_link,
        sender_email_address: sender_email_address,
        verification_email_sent: verification_email_sent,
        device_type: deviceType,
      });
  },

  friendInvitationByEmailSend: function ( email_address_array, first_name_array, last_name_array, email_addresses,
                                          invitation_message, sender_email_address) {
    Dispatcher.loadEndpoint("friendInvitationByEmailSend",
      {
        email_address_array: email_address_array,
        first_name_array: first_name_array,
        last_name_array: last_name_array,
        email_addresses_raw: email_addresses,
        invitation_message: invitation_message,
        sender_email_address: sender_email_address,
      });
  },

  friendInvitationByFacebookSend: function (data) {
    console.log("FacebookActions friendInvitationByFacebookSend", data);
    Dispatcher.loadEndpoint("friendInvitationByFacebookSend", {
      facebook_request_id: data.request_id || false,
      recipients_facebook_id_array: data.recipients_facebook_id_array || false,
      recipients_facebook_name_array: data.recipients_facebook_name_array || false,
    });
  },

  friendInvitationByWeVoteIdSend: function (other_voter_we_vote_id) {
    Dispatcher.loadEndpoint("friendInvitationByWeVoteIdSend",
      {
        other_voter_we_vote_id: other_voter_we_vote_id,
      });
  },

  // TODO DALE To be built on API server
  friendInvitationByTwitterHandleSend: function (twitter_handles, invitation_message) {
    Dispatcher.loadEndpoint("friendInvitationByTwitterHandleSend",
      {
        twitter_handles_raw: twitter_handles,
        invitation_message: invitation_message
      });
  },

  friendInvitationsProcessed: function () {
    Dispatcher.loadEndpoint("friendList",
      {
        kind_of_list: "FRIEND_INVITATIONS_PROCESSED"
      });
  },

  friendInvitationsSentByMe: function () {
    Dispatcher.loadEndpoint("friendList",
      {
        kind_of_list: "FRIEND_INVITATIONS_SENT_BY_ME"
      });
  },

  friendInvitationsSentToMe: function () {
    Dispatcher.loadEndpoint("friendList",
      {
        kind_of_list: "FRIEND_INVITATIONS_SENT_TO_ME"
      });
  },

  friendInvitationByEmailVerify: function (invitation_secret_key){
    Dispatcher.loadEndpoint("friendInvitationByEmailVerify", {
      invitation_secret_key: invitation_secret_key
    });
  },

  friendInvitationByFacebookVerify: function (facebook_request_id, recipient_facebook_id, sender_facebook_id){
    console.log("friendInvitationByFacebookVerify", facebook_request_id);
    Dispatcher.loadEndpoint("friendInvitationByFacebookVerify", {
      facebook_request_id: facebook_request_id,
      recipient_facebook_id: recipient_facebook_id,
      sender_facebook_id: sender_facebook_id
    });
  },

  // TODO DALE 2016-9-20 To be built
  ignoreFriendInvite: function (other_voter_we_vote_id) {
    Dispatcher.loadEndpoint("friendInviteResponse", {
      voter_we_vote_id: other_voter_we_vote_id,
      kind_of_invite_response: "IGNORE_INVITATION"
    } );
  },

  // TODO DALE 2016-11-3 To be built
  ignoreSuggestedFriend: function (other_voter_we_vote_id) {
    Dispatcher.loadEndpoint("friendInviteResponse", {
      voter_we_vote_id: other_voter_we_vote_id,
      kind_of_invite_response: "IGNORE_SUGGESTION"
    } );
  },

  suggestedFriendList: function () {
    Dispatcher.loadEndpoint("friendList",
      {
        kind_of_list: "SUGGESTED_FRIEND_LIST"
      });
  },

  unFriend: function (other_voter_we_vote_id) {
    Dispatcher.loadEndpoint("friendInviteResponse", {
      voter_we_vote_id: other_voter_we_vote_id,
      kind_of_invite_response: "UNFRIEND_CURRENT_FRIEND"
    } );
  },
};
