import { ReduceStore } from 'flux/utils';
import assign from 'object-assign';
import Dispatcher from '../dispatcher/Dispatcher';
import FriendActions from '../actions/FriendActions';  // eslint-disable-line import/no-cycle
import { arrayContains } from '../utils/textFormat';
import VoterActions from '../actions/VoterActions';  // eslint-disable-line import/no-cycle

class FriendStore extends ReduceStore {
  getInitialState () {
    return {
      currentFriends: [],
      currentFriendsOrganizationWeVoteIds: [],
    };
  }

  resetState () {
    return this.getInitialState();
  }

  currentFriends () {
    const { currentFriends } = this.getState();
    return currentFriends || [];
  }

  currentFriendsOrganizationWeVoteIDList () {
    // We track friendships through voter_we_vote_id (as opposed to organization_we_vote_id)
    const { currentFriendsOrganizationWeVoteIds } = this.getState();
    return currentFriendsOrganizationWeVoteIds || [];
  }

  currentFriendsWeVoteIDList () {
    // We track friendships through voter_we_vote_id (as opposed to organization_we_vote_id)
    const { currentFriends } = this.getState();
    if (currentFriends) {
      return Object.keys(currentFriends) || [];
    } else {
      return [];
    }
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
    // Exit if we don't receive a response
    if (!action.res) return state;  //  || !action.res.success // We deal with failures below
    let count = 0;
    let currentFriendsOrganizationWeVoteIds = [];

    switch (action.type) {
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
          // We update the currentFriends locally because it could be a heavy API call we don't want to call too often
          return {
            ...state,
            currentFriends: assign({}, state.currentFriends, { [action.res.voter_we_vote_id]: action.res.friend_voter }),
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

      case 'friendInvitationByEmailVerify':
        if (action.res.voter_device_id === '') {
          // The first time it was called there was no voter_device_id, so we want to call it again
          console.log('FriendStore, friendInvitationByEmailVerify, voter_device_id missing, invitation_secret_key:', action.res.invitation_secret_key);
          FriendActions.friendInvitationByEmailVerify(action.res.invitation_secret_key);
        } else {
          // console.log('FriendStore, voterDeviceId present');
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

      case 'friendInvitationByFacebookVerify':
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

      case 'friendList':
        switch (action.res.kind_of_list) {
          case 'CURRENT_FRIENDS':
            // console.log('FriendStore incoming data CURRENT_FRIENDS, action.res:', action.res);
            currentFriendsOrganizationWeVoteIds = [];
            if (action.res.friend_list) {
              for (count = 0; count < action.res.friend_list.length; count++) {
                currentFriendsOrganizationWeVoteIds.push(action.res.friend_list[count].linked_organization_we_vote_id);
              }
            }

            return {
              ...state,
              currentFriends: action.res.friend_list,
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
            if (!arrayContains(action.res.voter_guides[count].organization_we_vote_id, currentFriendsOrganizationWeVoteIds)) {
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
