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

  deleteFriendInvite: function (other_voter_we_vote_id) {
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

  friendInvitationByEmailSend: function (email_addresses, invitation_message) {
    Dispatcher.loadEndpoint("friendInvitationByEmailSend",
      {
        email_addresses_raw: email_addresses,
        invitation_message: invitation_message
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

  // TODO DALE 2016-9-20 To be built
  ignoreFriendInvite: function (other_voter_we_vote_id) {
    Dispatcher.loadEndpoint("friendInviteResponse", {
      voter_we_vote_id: other_voter_we_vote_id,
      kind_of_invite_response: "IGNORE_INVITATION"
    } );
  },

  positionListForVoter: function (show_only_this_election, show_all_other_elections) {
    Dispatcher.loadEndpoint("positionListForVoter",
      {
        show_only_this_election: show_only_this_election,
        show_all_other_elections: show_all_other_elections
      });
  },

  retrieveAddress: function (id){
    Dispatcher.loadEndpoint("voterAddressRetrieve", { voter_device_id: id});
  },

  saveAddress: function (text){
    Dispatcher.loadEndpoint("voterAddressSave", { text_for_map_search: text });
  },

  signOut: function (){
    Dispatcher.loadEndpoint("voterSignOut", {sign_out_all_devices: false});
  },

  updateVoter: function (data){
    let attributes = {
      facebook_email: data.email || false,
      first_name: data.first_name || false,
      middle_name: data.middle_name || false,
      last_name: data.last_name || false,
      twitter_profile_image_url_https: false
    };
    Dispatcher.loadEndpoint("voterUpdate", attributes );
  },

  unFriend: function (other_voter_we_vote_id) {
    Dispatcher.loadEndpoint("friendInviteResponse", {
      voter_we_vote_id: other_voter_we_vote_id,
      kind_of_invite_response: "UNFRIEND_CURRENT_FRIEND"
    } );
  },

  voterRetrieve: function () {
    Dispatcher.loadEndpoint("voterRetrieve");
  }
};
