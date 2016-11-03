import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {
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
    } );
  },

  deleteFriendInviteEmail: function (other_voter_email_address) {
    Dispatcher.loadEndpoint("friendInviteResponse", {
      recipient_voter_email: other_voter_email_address,
      kind_of_invite_response: "DELETE_INVITATION_EMAIL_SENT_BY_ME"
    } );
  },

  friendInvitationByEmailSend: function (email_addresses, invitation_message, sender_email_address) {
    Dispatcher.loadEndpoint("friendInvitationByEmailSend",
      {
        email_addresses_raw: email_addresses,
        invitation_message: invitation_message,
        sender_email_address: sender_email_address
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
