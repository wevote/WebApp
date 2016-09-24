import Dispatcher from "../dispatcher/Dispatcher";
import FluxMapStore from "flux/lib/FluxMapStore";
import VoterActions from "../actions/VoterActions";
import FacebookActions from "../actions/FacebookActions";
import FacebookStore from "../stores/FacebookStore";
const assign = require("object-assign");
const cookies = require("../utils/cookies");

class VoterStore extends FluxMapStore {

  currentFriends (){
    let current_friends = this.getDataFromArr(this.getState().current_friends) || {};
    return current_friends;
  }

  currentFriendsIndexed (){
    let current_friends = this.getIndexFromArr(this.getState().current_friends) || {};
    return current_friends;
  }

  isFriend (voter_we_vote_id) {
    let current_friends_index = this.currentFriendsIndexed();  // TODO DALE THIS NEEDS TO BE TESTED
    if (current_friends_index[voter_we_vote_id] != undefined) {
      return true;
    }
    return false;
  }

  getInitialState () {
    return {
      voter: {},
      address: {}
    };
  }

  getDataFromArr (arr) {
    if (arr == undefined) {
      return [];
    }
    let data_list = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      data_list.push( arr[i] );
    }
    return data_list;
  }

  getIndexFromArr (arr) {
    if (arr == undefined) {
      return [];
    }
    let indexed_data_list = [];
    let friend_voter_we_vote_id;
    for (var i = 0, len = arr.length; i < len; i++) {
      friend_voter_we_vote_id = arr[i].voter_we_vote_id;
      indexed_data_list[friend_voter_we_vote_id] = arr[i];
    }
    return indexed_data_list;
  }

  getVoter (){
    return this.getState().voter;
  }

  election_id (){
    return this.getState().address.google_civic_election_id;
  }

  getAddress (){
    return this.getState().address.text_for_map_search || "";
  }

  getTwitterHandle (){
    return this.getState().voter.twitter_handle || "";
  }

  getFacebookPhoto (){
    return this.getState().voter.facebook_profile_image_url_https;
  }

  friendInvitationsSentByMe (){
    return this.getDataFromArr(this.getState().friend_invitations_sent_by_me) || {};
  }

  friendInvitationsSentToMe (){
    return this.getDataFromArr(this.getState().friend_invitations_sent_to_me) || {};
  }

  getFullName (){
    return this.getState().voter.full_name;
  }

  // Could be either Facebook photo or Twitter photo
  getVoterPhotoUrl (){
    return this.getState().voter.voter_photo_url;
  }

  voterDeviceId () {
    return this.getState().voter.voter_device_id || cookies.getItem("voter_device_id");
  }

  setVoterDeviceIdCookie (id){
    cookies.setItem("voter_device_id", id, Infinity, "/");
  }

  reduce (state, action) {

    switch (action.type) {
      case "friendInviteResponse":
        if (!action.res.success) {
          // There was a problem
          VoterActions.friendInvitationsSentToMe();
          // console.log("VoterStore friendInviteResponse incoming data NO SUCCESS, action.res:", action.res);
          return {
            ...state
          }
        } else if (action.res.kind_of_invite_response === "ACCEPT_INVITATION") {
          // console.log("VoterStore friendInviteResponse incoming data ACCEPT_INVITATION, action.res:", action.res);
          VoterActions.friendInvitationsSentToMe();
          // We update the current_friends locally because it could be a heavy API call we don't want to call too often
          return {
            ...state,
            current_friends: assign({}, state.current_friends, { [action.res.voter_we_vote_id]: action.res.friend_voter })
          }
        } else if (action.res.kind_of_invite_response === "IGNORE_INVITATION") {
          VoterActions.friendInvitationsSentToMe();
          // console.log("VoterStore friendInviteResponse incoming data IGNORE_INVITATION, action.res:", action.res);
          return {
            ...state
          }
        } else if (action.res.kind_of_invite_response === "DELETE_INVITATION_VOTER_SENT_BY_ME") {
          VoterActions.friendInvitationsSentByMe();
          // console.log("VoterStore friendInviteResponse incoming data DELETE_INVITATION_VOTER_SENT_BY_ME, action.res:", action.res);
          return {
            ...state
          }
        } else if (action.res.kind_of_invite_response === "DELETE_INVITATION_EMAIL_SENT_BY_ME") {
          VoterActions.friendInvitationsSentByMe();
          // console.log("VoterStore friendInviteResponse incoming data DELETE_INVITATION_EMAIL_SENT_BY_ME, action.res:", action.res);
          return {
            ...state
          }
        } else if (action.res.kind_of_invite_response === "UNFRIEND_CURRENT_FRIEND") {
          // Because of the potential size of the friend list, it would be better NOT to request the entire list
          // after un-friending, but we do it for now until we can refactor this
          VoterActions.currentFriends();
          // console.log("VoterStore friendInviteResponse incoming data UNFRIEND_CURRENT_FRIEND, action.res:", action.res);
          return {
            ...state
          }
        }
        return {
          ...state
        };

      case "friendInvitationByEmailSend":
        VoterActions.friendInvitationsSentByMe();
        return {
          ...state
        };

      case "friendList":
        if (action.res.kind_of_list === "CURRENT_FRIENDS") {
          // console.log("VoterStore incoming data CURRENT_FRIENDS, action.res:", action.res);
          return {
            ...state,
            current_friends: action.res.friend_list
          }
        } else if (action.res.kind_of_list === "FRIEND_INVITATIONS_SENT_BY_ME") {
          // console.log("VoterStore incoming data FRIEND_INVITATIONS_SENT_BY_ME, action.res:", action.res);
          return {
            ...state,
            friend_invitations_sent_by_me: action.res.friend_list
          }
        } else if (action.res.kind_of_list === "FRIEND_INVITATIONS_SENT_TO_ME") {
          // console.log("VoterStore incoming data FRIEND_INVITATIONS_SENT_TO_ME, action.res:", action.res);
          return {
            ...state,
            friend_invitations_sent_to_me: action.res.friend_list
          }
        }

        return {
          ...state
        };

      case "organizationSave":
        // If an organization saves, we want to check to see if it is tied to this voter. If so,
        // refresh the voter data so we have the value linked_organization_we_vote_id in the voter object.
        if (action.res.success) {
          if (action.res.facebook_id === state.voter.facebook_id) {
            VoterActions.voterRetrieve();
          } else {
            let organization_twitter_handle = action.res.organization_twitter_handle !== undefined ? action.res.organization_twitter_handle : "";
            let twitter_screen_name = state.voter.twitter_screen_name !== undefined ? state.voter.twitter_screen_name : "";
            if (organization_twitter_handle && organization_twitter_handle.toLowerCase() === twitter_screen_name.toLowerCase()) {
              VoterActions.voterRetrieve();
            }
          }
        }
        return state;

      case "positionListForVoter":
        if (action.res.show_only_this_election) {
          var position_list_for_one_election = action.res.position_list;
          return {
            ...state,
            voter: {
              ...state.voter,
              position_list_for_one_election: position_list_for_one_election
            }
          };
        } else if (action.res.show_all_other_elections) {
          var position_list_for_all_except_one_election = action.res.position_list;
          return {
            ...state,
            voter: {
              ...state.voter,
              position_list_for_all_except_one_election: position_list_for_all_except_one_election
            }
          };
        } else {
          var position_list = action.res.position_list;
          return {
            ...state,
            voter: {
              ...state.voter,
              position_list: position_list
            }
          };
        }
        return {
          ...state
        };

      case "voterRetrieve":
        let voter_device_id = action.res.voter_device_id;
        this.setVoterDeviceIdCookie(voter_device_id);
        VoterActions.retrieveAddress(voter_device_id);
        const url = action.res.facebook_profile_image_url_https;
        if (action.res.signed_in_facebook && (url === null || url === "")){
          const userId = FacebookStore.userId;
          FacebookActions.getFacebookProfilePicture(userId);
        }

        return {
          ...state,
          voter: action.res
      };

      case "voterAddressRetrieve":
        return {
          ...state,
          address: action.res
      };

      case "voterAddressSave":
        return {
          ...state,
          address: { text_for_map_search: action.res.text_for_map_search,
                    google_civic_election_id: action.res.google_civic_election_id }
        };

      case "voterPhotoSave":
        return {
          ...state,
          voter: {...state.voter, facebook_profile_image_url_https: action.res.facebook_profile_image_url_https}
        };

      case "voterUpdate":
        const {first_name, last_name, email} = action.res;
        return {
          ...state,
          voter: {...state.voter,
            first_name: first_name ? first_name : state.voter.first_name,
            last_name: last_name ? last_name : state.voter.last_name,
            facebook_email: email ? email : state.voter.email,
          }
        };

      case "error-voterRetrieve" || "error-voterAddressRetrieve" || "error-voterAddressSave":
        console.log(action);
        return state;

      default:
        return state;
    }
  }
}

module.exports = new VoterStore(Dispatcher);
