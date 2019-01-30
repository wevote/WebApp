import { ReduceStore } from "flux/utils";
import BallotActions from "../actions/BallotActions";
import cookies from "../utils/cookies";
import Dispatcher from "../dispatcher/Dispatcher";
import FacebookActions from "../actions/FacebookActions";
import FriendActions from "../actions/FriendActions";
import SupportActions from "../actions/SupportActions";
import VoterActions from "../actions/VoterActions";
import VoterGuideActions from "../actions/VoterGuideActions";

class VoterStore extends ReduceStore {
  getInitialState () {
    return {
      voter: {
        interface_status_flags: 0,
        state_code_from_ip_address: "",
      },
      address: {},
      emailAddressStatus: {},
      emailSignInStatus: {},
      emailAddressList: [],
      facebookSignInStatus: {},
      facebookPhotoRetrieveLoopCount: 0,
      voterFound: false,
      latestGoogleCivicElectionId: 0,
    };
  }

  resetState () {
    return this.getInitialState();
  }

  getVoter () {
    return this.getState().voter;
  }

  electionId () {
    return this.getState().latestGoogleCivicElectionId;
  }

  getTextForMapSearch () {
    return this.getState().address.text_for_map_search || "";
  }

  getAddressObject () {
    return this.getState().address || {};
  }

  getBallotLocationForVoter () {
    // console.log("getBallotLocationForVoter this.getState().address:", this.getState().address);
    if (this.getState().address) {
      return {
        text_for_map_search: this.getState().address.text_for_map_search,
        ballot_returned_we_vote_id: this.getState().address.ballot_returned_we_vote_id,
        polling_location_we_vote_id: "",
        ballot_location_order: 0,
        ballot_location_display_name: this.getState().address.ballot_location_display_name,
        ballot_location_shortcut: "",
        google_civic_election_id: this.getState().address.google_civic_election_id,
        voter_entered_address: this.getState().address.voter_entered_address || false, // Did the voter save an address?
        voter_specific_ballot_from_google_civic: this.getState().address.voter_specific_ballot_from_google_civic || false, // Did this ballot come back for this specific address?
      };
    }
    return null;
  }

  getEmailAddressList () {
    const { emailAddressList } = this.getState();
    return emailAddressList;
  }

  getEmailAddressStatus () {
    return this.getState().emailAddressStatus;
  }

  getEmailSignInStatus () {
    return this.getState().emailSignInStatus;
  }

  getFacebookPhoto () {
    return this.getState().voter.facebook_profile_image_url_https || "";
  }

  getFacebookSignInStatus () {
    return this.getState().facebookSignInStatus;
  }

  getFirstName () {
    return this.getState().voter.first_name || "";
  }

  getLastName () {
    return this.getState().voter.last_name || "";
  }

  getFullName () {
    return this.getState().voter.full_name || "";
  }

  getStateCodeFromIPAddress () {
    return this.getState().voter.state_code_from_ip_address || "";
  }

  getTwitterHandle () {
    return this.getState().voter.twitter_handle || "";
  }

  getVoterIsSignedIn () {
    return this.getState().voter.is_signed_in || false;
  }

  // Could be either Facebook photo or Twitter photo
  getVoterPhotoUrlLarge () {
    return this.getState().voter.voter_photo_url_large || "";
  }

  // Could be either Facebook photo or Twitter photo
  getVoterPhotoUrlMedium () {
    return this.getState().voter.voter_photo_url_medium || "";
  }

  // Could be either Facebook photo or Twitter photo
  getVoterPhotoUrlTiny () {
    return this.getState().voter.voter_photo_url_tiny || "";
  }

  // Voter's donation history
  getVoterDonationHistory () {
    return this.getState().voter.voter_donation_history_list;
  }

  voterDeviceId () {
    return this.getState().voter.voter_device_id || cookies.getItem("voter_device_id");
  }

  setVoterDeviceIdCookie (id) { // eslint-disable-line
    cookies.removeItem("voter_device_id");
    cookies.removeItem("voter_device_id", "/");
    cookies.setItem("voter_device_id", id, Infinity, "/");
  }

  // Airbnb doesnt like bitwise operators in JavaScript
  getInterfaceFlagState (flag) {
    // Look in js/Constants/VoterConstants.js for list of flag constant definitions
    // console.log("VoterStore getInterfaceFlagState flag: ", flag);
    if (!this.getState().voter) {
      return false;
    }

    const interfaceStatusFlags = this.getState().voter.interface_status_flags || 0;
    // console.log("VoterStore getInterfaceFlagState interfaceStatusFlags: ", interfaceStatusFlags);
    // return True if bit specified by the flag is also set in interfaceStatusFlags (voter.interface_status_flags)
    // Eg: if interfaceStatusFlags = 5, then we can confirm that bits representing 1 and 4 are set (i.e., 0101)
    // so for value of flag = 1 and 4, we return a positive integer,
    // but, the bit representing 2 and 8 are not set, so for flag = 2 and 8, we return zero
    const flagIsSet = interfaceStatusFlags & flag;  // eslint-disable-line no-bitwise
    // console.log("VoterStore getInterfaceFlagState flagIsSet: ", flagIsSet);
    return flagIsSet;
  }

  getNotificationSettingsFlagState (flag) {
    // Look in js/Constants/VoterConstants.js for list of flag constant definitions
    if (!this.getState().voter) {
      return false;
    }
    const notificationSettingsFlags = this.getState().voter.notification_settings_flags || 0;
    // return True if bit specified by the flag is also set
    //  in notificationSettingsFlags (voter.notification_settings_flags)
    // Eg: if interfaceStatusFlags = 5, then we can confirm that bits representing 1 and 4 are set (i.e., 0101)
    // so for value of flag = 1 and 4, we return a positive integer,
    // but, the bit representing 2 and 8 are not set, so for flag = 2 and 8, we return zero
    return notificationSettingsFlags & flag; // eslint-disable-line no-bitwise
  }

  isVoterFound () {
    return this.getState().voterFound;
  }

  // isVerificationEmailSent () {
  //   return this.getState().emailAddressStatus.verification_email_sent;
  // }

  reduce (state, action) {
    // Exit if we don't have a response. "success" is not required though -- we should deal with error conditions below.
    if (!action.res) {
      console.log("VoterStore, no action.res received. action: ", action);
      return state;
    }

    const { facebookPhotoRetrieveLoopCount } = state;
    let { address } = action.res;

    let voterDeviceId;
    let googleCivicElectionId;
    let incomingVoter;
    let currentVoterDeviceId;

    switch (action.type) {
      case "organizationSave":
        // If an organization saves, we want to check to see if it is tied to this voter. If so,
        // refresh the voter data so we have the value linked_organization_we_vote_id in the voter object.
        if (action.res.success) {
          if (action.res.facebook_id === state.voter.facebook_id) {
            VoterActions.voterRetrieve();
          } else {
            const organizationTwitterHandle = action.res.organization_twitter_handle || "";
            const twitterScreenName = state.voter.twitter_screen_name !== undefined ? state.voter.twitter_screen_name : "";
            if (organizationTwitterHandle && organizationTwitterHandle.toLowerCase() === twitterScreenName.toLowerCase()) {
              VoterActions.voterRetrieve();
            }
          }
        }
        return state;

      case "organizationSuggestionTasks":
        if (action.res.success) {
          if (action.res.kind_of_follow_task === "FOLLOW_SUGGESTIONS_FROM_TWITTER_IDS_I_FOLLOW") {
            // console.log("organizationSuggestionTasks FOLLOW_SUGGESTIONS_FROM_TWITTER_IDS_I_FOLLOW");
            SupportActions.positionsCountForAllBallotItems(this.election_id());
            // VoterGuideActions.voterGuidesToFollowRetrieve(this.election_id());
            VoterGuideActions.voterGuidesFollowedRetrieve(this.election_id());
          } else if (action.res.kind_of_suggestion_task === "UPDATE_SUGGESTIONS_FROM_TWITTER_IDS_I_FOLLOW") {
            // console.log("organizationSuggestionTasks UPDATE_SUGGESTIONS_FROM_TWITTER_IDS_I_FOLLOW");
            // VoterGuideActions.voterGuidesToFollowRetrieve(this.election_id());
            VoterGuideActions.voterGuidesFollowedRetrieve(this.election_id());
          }
        }
        return state;

      case "positionListForVoter":
        if (action.res.show_only_this_election) {
          const positionListForOneElection = action.res.position_list;
          return {
            ...state,
            voter: {
              ...state.voter,
              positionListForOneElection,
            },
          };
        } else if (action.res.show_all_other_elections) {
          const positionListForAllExceptOneElection = action.res.position_list;
          return {
            ...state,
            voter: {
              ...state.voter,
              positionListForAllExceptOneElection,
            },
          };
        } else {
          const positionList = action.res.position_list;
          return {
            ...state,
            voter: {
              ...state.voter,
              positionList,
            },
          };
        }

      case "twitterRetrieveIdsIFollow":
        // console.log("twitterRetrieveIdsIFollow")
        if (action.res.success) {
          VoterActions.organizationSuggestionTasks("UPDATE_SUGGESTIONS_FROM_TWITTER_IDS_I_FOLLOW",
            "FOLLOW_SUGGESTIONS_FROM_TWITTER_IDS_I_FOLLOW");
        }

        return state;

      case "voterAnalysisForJumpProcess":
        VoterActions.voterRetrieve();
        return {
          ...state,
          emailAddressStatus: {
            email_ownership_is_verified: action.res.email_ownership_is_verified,
            email_secret_key_belongs_to_this_voter: action.res.email_secret_key_belongs_to_this_voter,
            email_verify_attempted: action.res.email_verify_attempted,
            email_address_found: action.res.email_address_found,
          },
          emailSignInStatus: {
            email_ownership_is_verified: action.res.email_ownership_is_verified,
            email_secret_key_belongs_to_this_voter: action.res.email_secret_key_belongs_to_this_voter,
            email_sign_in_attempted: action.res.email_verify_attempted,
            email_address_found: action.res.email_address_found,
          },
        };

      case "voterAddressRetrieve":
        // console.log("VoterStore, voterAddressRetrieve, address:", action.res);
        return {
          ...state,
          address: action.res,
        };

      case "voterAddressSave":
        // console.log("VoterStore, voterAddressSave, action.res:", action.res);
        if (action.res.status === "SIMPLE_ADDRESS_SAVE") {
          // Don't do any other refreshing
        } else {
          BallotActions.voterBallotItemsRetrieve();
          SupportActions.positionsCountForAllBallotItems(action.res.google_civic_election_id);
        }

        if (!address) {
          address = {
            text_for_map_search: "",
            google_civic_election_id: 0,
            ballot_returned_we_vote_id: "",
            ballot_location_display_name: "",
            voter_entered_address: "",
            voter_specific_ballot_from_google_civic: null,
          };
        }

        return {
          ...state,
          address: {
            text_for_map_search: address.text_for_map_search,
            google_civic_election_id: address.google_civic_election_id,
            ballot_returned_we_vote_id: address.ballot_returned_we_vote_id,
            ballot_location_display_name: address.ballot_location_display_name,
            voter_entered_address: address.voter_entered_address,
            voter_specific_ballot_from_google_civic: address.voter_specific_ballot_from_google_civic,
          },
        };

      case "voterBallotItemsRetrieve":
        // console.log("VoterStore voterBallotItemsRetrieve latestGoogleCivicElectionId: ", action.res.google_civic_election_id);
        googleCivicElectionId = action.res.google_civic_election_id || 0;
        if (googleCivicElectionId !== 0) {
          return {
            ...state,
            latestGoogleCivicElectionId: googleCivicElectionId,
          };
        }

        return state;

      case "voterEmailAddressRetrieve":
        // console.log("VoterStore  voterEmailAddressRetrieve: ", action.res.email_address_list);
        return {
          ...state,
          emailAddressList: action.res.email_address_list,
        };

      case "voterEmailAddressSave":
        VoterActions.voterRetrieve();
        return {
          ...state,
          emailAddressList: action.res.email_address_list,
          emailAddressStatus: {
            email_verify_attempted: action.res.email_verify_attempted,
            email_address_already_owned_by_other_voter: action.res.email_address_already_owned_by_other_voter,
            email_address_created: action.res.email_address_created,
            email_address_deleted: action.res.email_address_deleted,
            verification_email_sent: action.res.verification_email_sent,
            link_to_sign_in_email_sent: action.res.link_to_sign_in_email_sent,
          },
        };

      case "voterEmailAddressSignIn":
        VoterActions.voterRetrieve();
        return {
          ...state,
          emailSignInStatus: {
            email_sign_in_attempted: action.res.email_sign_in_attempted,
            email_ownership_is_verified: action.res.email_ownership_is_verified,
            email_secret_key_belongs_to_this_voter: action.res.email_secret_key_belongs_to_this_voter,
            email_address_found: action.res.email_address_found,
            yes_please_merge_accounts: action.res.yes_please_merge_accounts,
            voter_we_vote_id_from_secret_key: action.res.voter_we_vote_id_from_secret_key,
            voter_merge_two_accounts_attempted: false,
          },
        };

      case "voterEmailAddressVerify":
        VoterActions.voterRetrieve();
        return {
          ...state,
          emailAddressStatus: {
            email_ownership_is_verified: action.res.email_ownership_is_verified,
            email_secret_key_belongs_to_this_voter: action.res.email_secret_key_belongs_to_this_voter,
            email_verify_attempted: action.res.email_verify_attempted,
            email_address_found: action.res.email_address_found,
          },
          emailSignInStatus: {
            email_ownership_is_verified: action.res.email_ownership_is_verified,
            email_secret_key_belongs_to_this_voter: action.res.email_secret_key_belongs_to_this_voter,
            email_sign_in_attempted: action.res.email_verify_attempted,
            email_address_found: action.res.email_address_found,
          },
        };

      case "voterFacebookSaveToCurrentAccount":
        VoterActions.voterRetrieve();
        return {
          ...state,
          facebookSignInStatus: {
            facebook_account_created: action.res.facebook_account_created,
          },
        };

      case "voterMergeTwoAccounts":
        // On the server we just switched linked this voterDeviceId to a new voter record, so we want to
        //  refresh a lot of data
        VoterActions.voterRetrieve();
        VoterActions.voterEmailAddressRetrieve();
        FriendActions.currentFriends();
        FriendActions.friendInvitationsSentByMe();
        FriendActions.friendInvitationsSentToMe();
        FriendActions.friendInvitationsProcessed();
        BallotActions.voterBallotItemsRetrieve();
        SupportActions.positionsCountForAllBallotItems();
        return {
          ...state,
          emailSignInStatus: {
            email_ownership_is_verified: true,
            email_secret_key_belongs_to_this_voter: true,
            email_sign_in_attempted: true,
            email_address_found: true,
            yes_please_merge_accounts: false,
            voter_we_vote_id_from_secret_key: "",
            voter_merge_two_accounts_attempted: true,
          },
          facebookSignInStatus: {
            voter_merge_two_accounts_attempted: true, // TODO DALE is this needed?
          },
          twitter_sign_in_status: {
            voter_merge_two_accounts_attempted: true, // TODO DALE is this needed?
          },
        };

      case "voterPhotoSave":
        return {
          ...state,
          voter: { ...state.voter, facebook_profile_image_url_https: action.res.facebook_profile_image_url_https },
        };

      case "voterRetrieve":
        // console.log("VoterStore, voterRetrieve state on entry: ",  state);
        // console.log("VoterStore, voterRetrieve state on entry: ",  state.voter);

        // Preserve address within voter
        incomingVoter = action.res;

        currentVoterDeviceId = cookies.getItem("voter_device_id");
        if (!action.res.voter_found) {
          console.log(`This voter_device_id is not in the db and is invalid, so delete it: ${
            cookies.getItem("voter_device_id")}`);

          cookies.removeItem("voter_device_id");
          cookies.removeItem("voter_device_id", "/");

          // ...and then ask for a new voter. When it returns a voter with a new voter_device_id, we will set new cookie
          if (!cookies.getItem("voter_device_id")) {
            // console.log("voter_device_id gone -- calling voterRetrieve");
            VoterActions.voterRetrieve();
          } else {
            // console.log("voter_device_id still exists -- did not call voterRetrieve");
          }
        } else {
          voterDeviceId = action.res.voter_device_id;
          if (voterDeviceId) {
            if (currentVoterDeviceId !== voterDeviceId) {
              // console.log("Setting new voter_device_id");
              this.setVoterDeviceIdCookie(voterDeviceId);
            }

            VoterActions.voterAddressRetrieve(voterDeviceId);

            // FriendsInvitationList.jsx is choking on this because calling this
            // results in an infinite loop cycling between voterRetrieve and getFaceProfilePicture which
            // resolves to FACEBOOK_RECEIVED_PICTURE which then attempts to save using voterFacebookSignInPhoto
            // which in turn resolves to voterFacebookSignInSave which finally attempts to call
            // voterRetrieve again
            const url = action.res.facebook_profile_image_url_https;
            // console.log("VoterStore, voterRetrieve, action.res: ", action.res);

            if (action.res.signed_in_facebook && (url === null || url === "") && facebookPhotoRetrieveLoopCount < 10) {
              FacebookActions.getFacebookProfilePicture();
            }
          } else {
            // console.log("voter_device_id not returned by voterRetrieve");
          }
        }

        return {
          ...state,
          facebookPhotoRetrieveLoopCount: facebookPhotoRetrieveLoopCount + 1,
          voter: incomingVoter,
          voterFound: action.res.voter_found,
        };

      case "voterSignOut":
        // console.log("resetting voterStore");
        VoterActions.voterRetrieve();
        VoterActions.voterEmailAddressRetrieve();
        return this.resetState();

      case "voterSplitIntoTwoAccounts":
        VoterActions.voterRetrieve();
        return state;

      case "voterTwitterSaveToCurrentAccount":
        VoterActions.voterRetrieve();
        return {
          ...state,
          twitter_sign_in_status: {
            twitter_account_created: action.res.twitter_account_created,
          },
        };

      case "voterUpdate":
        return {
          ...state,
          voter: {
            ...state.voter,
            // With this we are only updating the values we change with a voterUpdate call.
            first_name: action.res.first_name || state.voter.first_name,
            last_name: action.res.last_name || state.voter.last_name,
            facebook_email: action.res.email || state.voter.email,
            interface_status_flags: action.res.interface_status_flags || state.voter.interface_status_flags,
            notification_settings_flags: action.res.notification_settings_flags || state.voter.notification_settings_flags,
            voter_donation_history_list: action.res.voter_donation_history_list || state.voter.voter_donation_history_list,
          },
        };

      case "error-voterRetrieve" || "error-voterAddressRetrieve" || "error-voterAddressSave":
        console.log(action);
        return state;

      default:
        return state;
    }
  }
}

export default new VoterStore(Dispatcher);
