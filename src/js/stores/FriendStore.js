import { ReduceStore } from "flux/utils";
import assign from "object-assign";
import Dispatcher from "../dispatcher/Dispatcher";
import FriendActions from "../actions/FriendActions";
import VoterActions from "../actions/VoterActions";

class FriendStore extends ReduceStore {
  getInitialState () {
    return {
    };
  }

  resetState () {
    return this.getInitialState();
  }

  currentFriends () {
    const { currentFriends } = this.getState();
    return currentFriends || [];
  }

  currentFriendsIndexed () {
    const { currentFriends } = this.getState();
    return this.getIndexFromArr(currentFriends) || {};
  }

  friendInvitationsSentByMe () {
    const { friendInvitationsSentByMe } = this.getState();
    return friendInvitationsSentByMe || {};
  }

  friendInvitationsSentToMe () {
    const { friendInvitationsSentToMe } = this.getState();
    return friendInvitationsSentToMe || {};
  }

  friendInvitationsProcessed () {
    const { friendInvitationsProcessed } = this.getState();
    return friendInvitationsProcessed || {};
  }

  getErrorMessageToShowVoter () {
    const { errorMessageToShowVoter } = this.getState();
    return errorMessageToShowVoter;
  }

  getInvitationStatus () {
    return this.getState().invitationStatus;
  }

  getInvitationFromFacebookStatus () {
    return this.getState().facebookInvitationStatus;
  }

  isFriend (voterId) {
    const currentFriendsIndex = this.currentFriendsIndexed(); // TODO DALE THIS NEEDS TO BE TESTED
    return currentFriendsIndex[voterId] !== undefined;
  }

  suggestedFriendList () {
    const { suggestedFriendList } = this.getState();
    return suggestedFriendList || {};
  }

  switchToAddFriendsByEmailStep () {
    return this.getState().addFriendsByEmailStep;
  }

  switchToEmailBallotDataStep () {
    return this.getState().emailBallotDataStep;
  }

  getIndexFromArr (arr) { // eslint-disable-line
    if (!arr) return {};
    const indexed = {};
    arr.forEach((friend) => {
      indexed[friend.voter_we_vote_id] = friend.voter_we_vote_id;
    });
    return indexed;
  }

  reduce (state, action) {
    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success) return state;

    switch (action.type) {
      case "friendInviteResponse":
        if (!action.res.success) {
          // There was a problem
          FriendActions.friendInvitationsSentToMe();
          // console.log("FriendStore friendInviteResponse incoming data NO SUCCESS, action.res:", action.res);
          return {
            ...state,
          };
        } else if (action.res.kind_of_invite_response === "ACCEPT_INVITATION") {
          // console.log("FriendStore friendInviteResponse incoming data ACCEPT_INVITATION, action.res:", action.res);
          FriendActions.friendInvitationsSentToMe();
          // We update the currentFriends locally because it could be a heavy API call we don't want to call too often
          return {
            ...state,
            currentFriends: assign({}, state.currentFriends, { [action.res.voter_we_vote_id]: action.res.friend_voter }),
          };
        } else if (action.res.kind_of_invite_response === "IGNORE_INVITATION") {
          FriendActions.friendInvitationsSentToMe();
          // console.log("FriendStore friendInviteResponse incoming data IGNORE_INVITATION, action.res:", action.res);
          return {
            ...state,
          };
        } else if (action.res.kind_of_invite_response === "DELETE_INVITATION_VOTER_SENT_BY_ME") {
          FriendActions.friendInvitationsSentByMe();
          // console.log("FriendStore friendInviteResponse incoming data DELETE_INVITATION_VOTER_SENT_BY_ME, action.res:", action.res);
          return {
            ...state,
          };
        } else if (action.res.kind_of_invite_response === "DELETE_INVITATION_EMAIL_SENT_BY_ME") {
          FriendActions.friendInvitationsSentByMe();
          // console.log("FriendStore friendInviteResponse incoming data DELETE_INVITATION_EMAIL_SENT_BY_ME, action.res:", action.res);
          return {
            ...state,
          };
        } else if (action.res.kind_of_invite_response === "UNFRIEND_CURRENT_FRIEND") {
          // Because of the potential size of the friend list, it would be better NOT to request the entire list
          // after un-friending, but we do it for now until we can refactor this
          FriendActions.currentFriends();
          // console.log("FriendStore friendInviteResponse incoming data UNFRIEND_CURRENT_FRIEND, action.res:", action.res);
          return {
            ...state,
          };
        }
        return {
          ...state,
        };

      case "friendInvitationByEmailSend":
        if (action.res.sender_voter_email_address_missing) {
          // Return the person to the form where they can fill in their email address
          return {
            ...state,
            addFriendsByEmailStep: "on_collect_email_step",
            errorMessageToShowVoter: action.res.error_message_to_show_voter,
          };
        } else {
          // Reset the invitation form
        }
        FriendActions.friendInvitationsSentByMe();
        return {
          ...state,
        };

      case "emailBallotData":
        if (action.res.sender_voter_email_address_missing) {
          // Return the person to the form where they can fill in their email address
          return {
            ...state,
            emailBallotDataStep: "on_collect_email_step",
            errorMessageToShowVoter: action.res.error_message_to_show_voter,
          };
        } else {
          // Reset the invitation form
        }
        return {
          ...state,
        };

      case "friendInvitationByTwitterHandleSend":
        FriendActions.friendInvitationsSentByMe();
        return {
          ...state,
        };

      case "friendInvitationByWeVoteIdSend":
        FriendActions.suggestedFriendList();
        FriendActions.friendInvitationsSentByMe();
        return {
          ...state,
        };

      case "friendInvitationByEmailVerify":
        if (action.res.voter_device_id === "") {
          // The first time it was called there was no voter_device_id, so we want to call it again
          // console.log("FriendStore, friendInvitationByEmailVerify, voter_device_id missing, invitation_secret_key:", action.res.invitation_secret_key);
          FriendActions.friendInvitationByEmailVerify(action.res.invitation_secret_key);
        } else {
          // console.log("FriendStore, voterDeviceId present");
          FriendActions.friendInvitationsSentToMe();
          VoterActions.voterRetrieve(); // We need to update the indicator that the person has a verified email
        }
        return {
          ...state,
          invitationStatus: {
            voterDeviceId: action.res.voter_device_id,
            voterHasDataToPreserve: action.res.voter_has_data_to_preserve,
            invitationFound: action.res.invitation_found,
            attemptedToApproveOwnInvitation: action.res.attempted_to_approve_own_invitation,
            invitationSecretKeyBelongsToThisVoter: action.res.invitation_secret_key_belongs_to_this_voter,
          },
        };

      case "friendInvitationByFacebookVerify":
        return {
          ...state,
          facebookInvitationStatus: {
            voterDeviceId: action.res.voter_device_id,
            voterHasDataToPreserve: action.res.voter_has_data_to_preserve,
            invitationFound: action.res.invitation_found,
            attemptedToApproveOwnInvitation: action.res.attempted_to_approve_own_invitation,
            facebookRequestId: action.res.facebook_request_id,
          },
        };

      case "friendList":
        if (action.res.kind_of_list === "CURRENT_FRIENDS") {
          // console.log("FriendStore incoming data CURRENT_FRIENDS, action.res:", action.res);
          return {
            ...state,
            currentFriends: action.res.friend_list,
          };
        } else if (action.res.kind_of_list === "FRIEND_INVITATIONS_SENT_BY_ME") {
          // console.log("FriendStore incoming data FRIEND_INVITATIONS_SENT_BY_ME, action.res:", action.res);
          return {
            ...state,
            friendInvitationsSentByMe: action.res.friend_list,
          };
        } else if (action.res.kind_of_list === "FRIEND_INVITATIONS_SENT_TO_ME") {
          // console.log("FriendStore incoming data FRIEND_INVITATIONS_SENT_TO_ME, action.res:", action.res);
          return {
            ...state,
            friendInvitationsSentToMe: action.res.friend_list,
          };
        } else if (action.res.kind_of_list === "FRIEND_INVITATIONS_PROCESSED") {
          // console.log("FriendStore incoming data FRIEND_INVITATIONS_PROCESSED, action.res:", action.res);
          return {
            ...state,
            friendInvitationsProcessed: action.res.friend_list,
          };
        } else if (action.res.kind_of_list === "suggestedFriendList") {
          // console.log("FriendStore incoming data suggestedFriendList, action.res:", action.res);
          return {
            ...state,
            suggestedFriendList: action.res.friend_list,
          };
        }

        return {
          ...state,
        };

      case "voterSignOut":
        // console.log("resetting FriendStore");
        FriendActions.currentFriends();
        FriendActions.friendInvitationsSentByMe();
        FriendActions.friendInvitationsSentToMe();
        FriendActions.friendInvitationsProcessed();
        return this.resetState();

      default:
        return state;
    }
  }
}

export default new FriendStore(Dispatcher);
