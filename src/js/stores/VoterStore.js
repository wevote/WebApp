import Dispatcher from "../dispatcher/Dispatcher";
import BallotActions from "../actions/BallotActions";
import FacebookActions from "../actions/FacebookActions";
import FacebookStore from "../stores/FacebookStore";
import FluxMapStore from "flux/lib/FluxMapStore";
import FriendActions from "../actions/FriendActions";
import StarActions from "../actions/StarActions";
import VoterActions from "../actions/VoterActions";
const assign = require("object-assign");
const cookies = require("../utils/cookies");

class VoterStore extends FluxMapStore {

  getInitialState () {
    return {
      voter: {},
      address: {},
      email_address_status: {},
      email_sign_in_status: {},
      facebook_sign_in_status: {}
    };
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

  getEmailAddressList (){
    return this.getDataFromArr(this.getState().email_address_list) || {};
  }

  getEmailAddressStatus (){
    return this.getState().email_address_status;
  }

  getEmailSignInStatus (){
    return this.getState().email_sign_in_status;
  }

  getFacebookPhoto (){
    return this.getState().voter.facebook_profile_image_url_https;
  }

  getFacebookSignInStatus (){
    return this.getState().facebook_sign_in_status;
  }

  getFullName (){
    return this.getState().voter.full_name;
  }

  getTwitterHandle (){
    return this.getState().voter.twitter_handle || "";
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

  reduce (state, action) {

    let voter_device_id;
    switch (action.type) {
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

      case "voterEmailAddressRetrieve":
        return {
          ...state,
          email_address_list: action.res.email_address_list,
        };

      case "voterEmailAddressSave":
        VoterActions.voterRetrieve();
        return {
          ...state,
          email_address_list: action.res.email_address_list,
          email_address_status: {
            email_verify_attempted: action.res.email_verify_attempted,
            email_address_already_owned_by_other_voter: action.res.email_address_already_owned_by_other_voter,
            email_address_created: action.res.email_address_created,
            email_address_deleted: action.res.email_address_deleted,
            verification_email_sent: action.res.verification_email_sent,
            link_to_sign_in_email_sent: action.res.link_to_sign_in_email_sent,
          }
        };

      case "voterEmailAddressSignIn":
        VoterActions.voterRetrieve();
        return {
          ...state,
          email_sign_in_status: {
            email_sign_in_attempted: action.res.email_sign_in_attempted,
            email_ownership_is_verified: action.res.email_ownership_is_verified,
            email_secret_key_belongs_to_this_voter: action.res.email_secret_key_belongs_to_this_voter,
            email_address_found: action.res.email_address_found,
            yes_please_merge_accounts: action.res.yes_please_merge_accounts,
            voter_we_vote_id_from_secret_key: action.res.voter_we_vote_id_from_secret_key,
            voter_merge_two_accounts_attempted: false,
          }
        };

      case "voterEmailAddressVerify":
        VoterActions.voterRetrieve();
        return {
          ...state,
          email_address_status: {
            email_ownership_is_verified: action.res.email_ownership_is_verified,
            email_secret_key_belongs_to_this_voter: action.res.email_secret_key_belongs_to_this_voter,
            email_verify_attempted: action.res.email_verify_attempted,
            email_address_found: action.res.email_address_found,
          }
        };

      case "voterMergeTwoAccounts":
        // On the server we just switched linked this voter_device_id to a new voter record, so we want to
        //  refresh a lot of data
        voter_device_id = this.voterDeviceId();
        VoterActions.voterRetrieve(voter_device_id);
        VoterActions.voterEmailAddressRetrieve();
        StarActions.voterAllStarsStatusRetrieve();
        FriendActions.friendInvitationsSentToMe();
        return {
          ...state,
          email_sign_in_status: {
            email_ownership_is_verified: true,
            email_secret_key_belongs_to_this_voter: true,
            email_sign_in_attempted: true,
            email_address_found: true,
            yes_please_merge_accounts: false,
            voter_we_vote_id_from_secret_key: "",
            voter_merge_two_accounts_attempted: true,
          },
          facebook_sign_in_status: {
            voter_merge_two_accounts_attempted: true,
          }
        };

      case "voterPhotoSave":
        return {
          ...state,
          voter: {...state.voter, facebook_profile_image_url_https: action.res.facebook_profile_image_url_https}
        };

      case "voterRetrieve":
        voter_device_id = action.res.voter_device_id;
        this.setVoterDeviceIdCookie(voter_device_id);
        VoterActions.voterAddressRetrieve(voter_device_id);
        const url = action.res.facebook_profile_image_url_https;
        if (action.res.signed_in_facebook && (url === null || url === "")){
          const userId = FacebookStore.userId;
          FacebookActions.getFacebookProfilePicture(userId);
        }

        return {
          ...state,
          voter: action.res
      };

      case "voterSignOut":
        VoterActions.voterRetrieve();
        VoterActions.voterEmailAddressRetrieve();
        StarActions.voterAllStarsStatusRetrieve();
        FriendActions.friendInvitationsSentToMe();
        BallotActions.voterBallotItemsRetrieve();
        return {
          ...state,
          email_address_status: {
            email_ownership_is_verified: false,
            email_secret_key_belongs_to_this_voter: false,
            email_verify_attempted: false,
            email_address_found: false
          }
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
