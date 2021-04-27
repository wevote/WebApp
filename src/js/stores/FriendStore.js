import { ReduceStore } from 'flux/utils';
import FriendActions from '../actions/FriendActions'; // eslint-disable-line import/no-cycle
import VoterActions from '../actions/VoterActions'; // eslint-disable-line import/no-cycle
import Dispatcher from '../dispatcher/Dispatcher';
import { arrayContains } from '../utils/textFormat';

class FriendStore extends ReduceStore {
  getInitialState () {
    return {
      currentFriendList: [],
      currentFriendsByVoterWeVoteIdDict: {},  // key == voterWeVoteId, value = friend data dict
      currentFriendsOrganizationWeVoteIds: [],
      friendInvitationsSentByMe: [],
      friendInvitationsSentToMe: [],
      friendInvitationsWaitingForVerification: [],
    };
  }

  resetState () {
    return this.getInitialState();
  }

  currentFriends () {
    const { currentFriendList } = this.getState();
    return currentFriendList || [];
  }

  currentFriendsOrganizationWeVoteIDList () {
    // We track friendships through voter_we_vote_id (as opposed to organization_we_vote_id)
    const { currentFriendsOrganizationWeVoteIds } = this.getState();
    return currentFriendsOrganizationWeVoteIds || [];
  }

  friendInvitationsSentByMe () {
    const { friendInvitationsSentByMe } = this.getState();
    return friendInvitationsSentByMe || [];
  }

  friendInvitationsSentToMe () {
    const { friendInvitationsSentToMe } = this.getState();
    return friendInvitationsSentToMe || [];
  }

  friendInvitationsProcessed () {
    const { friendInvitationsProcessed } = this.getState();
    return friendInvitationsProcessed || [];
  }

  friendInvitationsWaitingForVerification () {
    const { friendInvitationsWaitingForVerification } = this.getState();
    return friendInvitationsWaitingForVerification || [];
  }

  getCurrentFriendsOrganizationWeVoteIdsLength () {
    // console.log('OrganizationStore.getCurrentFriendsOrganizationWeVoteIdsLength, currentFriendsOrganizationWeVoteIds: ', this.getState().currentFriendsOrganizationWeVoteIds);
    if (this.getState().currentFriendsOrganizationWeVoteIds) {
      return this.getState().currentFriendsOrganizationWeVoteIds.length;
    }
    return 0;
  }

  getErrorMessageToShowVoter () {
    const { errorMessageToShowVoter } = this.getState();
    return errorMessageToShowVoter;
  }

  getFriendInvitationInformation () {
    return this.getState().friendInvitationInformation;
  }

  getInvitationStatus () {
    return this.getState().invitationStatus;
  }

  getInvitationFromFacebookStatus () {
    return this.getState().facebookInvitationStatus;
  }

  isFriend (voterWeVoteId) {
    const { currentFriendsByVoterWeVoteIdDict } = this.getState();
    if (currentFriendsByVoterWeVoteIdDict) {
      return currentFriendsByVoterWeVoteIdDict[voterWeVoteId] !== undefined;
    }
    return false;
  }

  isVoterFriendsWithThisOrganization (organizationWeVoteId) {
    const { currentFriendsOrganizationWeVoteIds } = this.getState();
    // console.log('FriendStore, isVoterFriendsWithThisOrganization, currentFriendsOrganizationWeVoteIds: ', currentFriendsOrganizationWeVoteIds);
    if (currentFriendsOrganizationWeVoteIds.length) {
      const isFriend = arrayContains(organizationWeVoteId, currentFriendsOrganizationWeVoteIds);
      // console.log('FriendStore, isVoterFriendsWithThisOrganization:', isFriend, ', organizationWeVoteId:', organizationWeVoteId);
      return isFriend;
    } else {
      // console.log('FriendStore, isVoterFriendsWithThisOrganization: NO currentFriendsOrganizationWeVoteIds, organizationWeVoteId: ', organizationWeVoteId);
      return false;
    }
  }

  suggestedFriendList () {
    const { suggestedFriendList } = this.getState();
    return suggestedFriendList || [];
  }

  switchToAddFriendsByEmailStep () {
    return this.getState().addFriendsByEmailStep;
  }

  switchToEmailBallotDataStep () {
    return this.getState().emailBallotDataStep;
  }

  reduce (state, action) {
    // Exit if we don't receive a response
    if (!action.res) return state;  //  || !action.res.success // We deal with failures below
    let { currentFriendsByVoterWeVoteIdDict } = state;
    let count = 0;
    let currentFriendsOrganizationWeVoteIds = [];

    switch (action.type) {
      case 'clearErrorMessageToShowVoter':
        // console.log('FriendStore clearErrorMessageToShowVoter');
        return { ...state, errorMessageToShowVoter: '' };
      case 'friendInviteResponse':
        if (!action.res.success) {
          // There was a problem
          // FriendActions.friendInvitationsSentToMe();
          // console.log('FriendStore friendInviteResponse incoming data NO SUCCESS, action.res:', action.res);
          return {
            ...state,
          };
        } else if (action.res.kind_of_invite_response === 'ACCEPT_INVITATION') {
          // console.log('FriendStore friendInviteResponse incoming data ACCEPT_INVITATION, action.res:', action.res);
          FriendActions.friendInvitationsSentToMe();
          FriendActions.currentFriends();
          return {
            ...state,
          };
        } else if (action.res.kind_of_invite_response === 'IGNORE_INVITATION') {
          FriendActions.friendInvitationsSentToMe();
          // console.log('FriendStore friendInviteResponse incoming data IGNORE_INVITATION, action.res:', action.res);
          return {
            ...state,
          };
        } else if (action.res.kind_of_invite_response === 'IGNORE_SUGGESTION') {
          FriendActions.suggestedFriendList();
          // console.log('FriendStore friendInviteResponse incoming data IGNORE_SUGGESTION, action.res:', action.res);
          return {
            ...state,
          };
        } else if (action.res.kind_of_invite_response === 'DELETE_INVITATION_VOTER_SENT_BY_ME') {
          FriendActions.friendInvitationsSentByMe();
          FriendActions.suggestedFriendList();
          // console.log('FriendStore friendInviteResponse incoming data DELETE_INVITATION_VOTER_SENT_BY_ME, action.res:', action.res);
          return {
            ...state,
          };
        } else if (action.res.kind_of_invite_response === 'DELETE_INVITATION_EMAIL_SENT_BY_ME') {
          FriendActions.friendInvitationsSentByMe();
          // console.log('FriendStore friendInviteResponse incoming data DELETE_INVITATION_EMAIL_SENT_BY_ME, action.res:', action.res);
          return {
            ...state,
          };
        } else if (action.res.kind_of_invite_response === 'UNFRIEND_CURRENT_FRIEND') {
          // Because of the potential size of the friend list, it would be better NOT to request the entire list
          // after un-friending, but we do it for now until we can refactor this
          FriendActions.currentFriends();
          // console.log('FriendStore friendInviteResponse incoming data UNFRIEND_CURRENT_FRIEND, action.res:', action.res);
          return {
            ...state,
          };
        }
        return {
          ...state,
        };

      case 'friendInvitationByEmailSend':
        // console.log('FriendStore friendInvitationByEmailSend, action.res:', action.res);
        FriendActions.friendInvitationsSentByMe();
        FriendActions.friendInvitationsWaitingForVerification();
        return {
          ...state,
          errorMessageToShowVoter: action.res.error_message_to_show_voter,
        };

      case 'emailBallotData':
        if (action.res.sender_voter_email_address_missing) {
          // Return the person to the form where they can fill in their email address
          return {
            ...state,
            emailBallotDataStep: 'on_collect_email_step',
            errorMessageToShowVoter: action.res.error_message_to_show_voter,
          };
        } else {
          // Reset the invitation form
        }
        return {
          ...state,
        };

      case 'friendInvitationByTwitterHandleSend':
        FriendActions.friendInvitationsSentByMe();
        return {
          ...state,
        };

      case 'friendInvitationByWeVoteIdSend':
        FriendActions.suggestedFriendList();
        FriendActions.friendInvitationsSentByMe();
        return {
          ...state,
        };

      case 'friendInvitationInformation':
        if (action.res.voter_device_id === '') {
          // The first time it was called there was no voter_device_id, so we want to call it again
          // console.log('FriendStore, friendInvitationInformation, voter_device_id missing, invitation_secret_key:', action.res.invitation_secret_key);
          FriendActions.friendInvitationInformation(action.res.invitation_secret_key);
        }
        return {
          ...state,
          friendInvitationInformation: {
            friendFirstName: action.res.friend_first_name,
            friendLastName: action.res.friend_last_name,
            friendImageUrlHttpsTiny: action.res.friend_image_url_https_tiny,
            friendIssueWeVoteIdList: action.res.friend_issue_we_vote_id_list,
            friendOrganizationWeVoteId: action.res.friend_organization_we_vote_id,
            friendWeVoteId: action.res.friend_we_vote_id,
            invitationSecretKeyBelongsToThisVoter: action.res.invitation_secret_key_belongs_to_this_voter,
            invitationFound: action.res.invitation_found,
            invitationMessage: action.res.invitation_message,
          },
        };

      case 'friendInvitationByEmailVerify':
        if (action.res.voter_device_id === '') {
          // The first time it was called there was no voter_device_id, so we want to call it again
          // console.log('FriendStore, friendInvitationByEmailVerify, voter_device_id missing, invitation_secret_key:', action.res.invitation_secret_key);
          FriendActions.friendInvitationByEmailVerify(action.res.invitation_secret_key);
        } else {
          // console.log('FriendStore, voterDeviceId present');
          FriendActions.friendInvitationsSentToMe();
          VoterActions.voterRetrieve(); // We need to update the indicator that the person has a verified email
        }
        return {
          ...state,
          invitationStatus: {
            attemptedToApproveOwnInvitation: action.res.attempted_to_approve_own_invitation,
            invitationThatCanBeAcceptedFound: action.res.invitation_found,
            voterDeviceId: action.res.voter_device_id,
            voterHasDataToPreserve: action.res.voter_has_data_to_preserve,
          },
        };

      case 'friendInvitationByFacebookVerify':
        return {
          ...state,
          facebookInvitationStatus: {
            attemptedToApproveOwnInvitation: action.res.attempted_to_approve_own_invitation,
            facebookRequestId: action.res.facebook_request_id,
            invitationThatCanBeAcceptedFound: action.res.invitation_found,
            voterDeviceId: action.res.voter_device_id,
            voterHasDataToPreserve: action.res.voter_has_data_to_preserve,
          },
        };

      case 'friendList':
        switch (action.res.kind_of_list) {
          case 'CURRENT_FRIENDS':
            // console.log('FriendStore incoming data CURRENT_FRIENDS, action.res:', action.res);
            currentFriendsOrganizationWeVoteIds = [];
            if (action.res.friend_list) {
              // Reset currentFriendsByVoterWeVoteIdDict so we don't leave in place old friends
              currentFriendsByVoterWeVoteIdDict = {};
              for (count = 0; count < action.res.friend_list.length; count++) {
                // console.log('action.res.friend_list[count]:', action.res.friend_list[count]);
                currentFriendsByVoterWeVoteIdDict[action.res.friend_list[count].voter_we_vote_id] = action.res.friend_list[count];
                currentFriendsOrganizationWeVoteIds.push(action.res.friend_list[count].linked_organization_we_vote_id);
              }
            }
            return {
              ...state,
              currentFriendList: action.res.friend_list,
              currentFriendsByVoterWeVoteIdDict,
              currentFriendsOrganizationWeVoteIds,
            };
          case 'FRIEND_INVITATIONS_SENT_BY_ME':
            // console.log('FriendStore incoming data FRIEND_INVITATIONS_SENT_BY_ME, action.res:', action.res);
            return {
              ...state,
              friendInvitationsSentByMe: action.res.friend_list,
            };
          case 'FRIEND_INVITATIONS_SENT_TO_ME':
            // console.log('FriendStore incoming data FRIEND_INVITATIONS_SENT_TO_ME, action.res:', action.res);
            return {
              ...state,
              friendInvitationsSentToMe: action.res.friend_list,
            };
          case 'FRIEND_INVITATIONS_PROCESSED':
            // console.log('FriendStore incoming data FRIEND_INVITATIONS_PROCESSED, action.res:', action.res);
            return {
              ...state,
              friendInvitationsProcessed: action.res.friend_list,
            };
          case 'FRIEND_INVITATIONS_WAITING_FOR_VERIFICATION':
            // console.log('FriendStore incoming data FRIEND_INVITATIONS_PROCESSED, action.res:', action.res);
            return {
              ...state,
              friendInvitationsWaitingForVerification: action.res.friend_list,
            };
          case 'SUGGESTED_FRIEND_LIST':
            // console.log('FriendStore incoming data suggestedFriendList, action.res:', action.res);
            return {
              ...state,
              suggestedFriendList: action.res.friend_list,
            };
          default:
            return {
              ...state,
            };
        }

      case 'voterGuidesFromFriendsUpcomingRetrieve':
        // console.log('FriendStore voterGuidesFromFriendsUpcomingRetrieve, action.res:', action.res);
        ({ currentFriendsOrganizationWeVoteIds } = state);
        if (action.res.voter_guides) {
          for (count = 0; count < action.res.voter_guides.length; count++) {
            if (action.res.voter_guides[count].from_shared_item) {
              // Do not store in currentFriendsOrganizationWeVoteIds
            } else if (!arrayContains(action.res.voter_guides[count].organization_we_vote_id, currentFriendsOrganizationWeVoteIds)) {
              // console.log('NOT arrayContains');
              currentFriendsOrganizationWeVoteIds.push(action.res.voter_guides[count].organization_we_vote_id);
            }
          }
        }
        // console.log('currentFriendsOrganizationWeVoteIds:', currentFriendsOrganizationWeVoteIds);

        return {
          ...state,
          currentFriendsOrganizationWeVoteIds,
        };

      case 'twitterNativeSignInSave':
      case 'twitterSignInRetrieve':
      case 'voterEmailAddressSignIn':
      case 'voterFacebookSignInRetrieve':
      case 'voterMergeTwoAccounts':
      case 'voterVerifySecretCode':
        // console.log('resetting FriendStore from sign in process');
        FriendActions.currentFriends();
        FriendActions.friendInvitationsSentByMe();
        FriendActions.friendInvitationsSentToMe();
        FriendActions.friendInvitationsProcessed();
        return this.resetState();

      case 'voterSignOut':
        // console.log('resetting FriendStore from voterSignOut');
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
