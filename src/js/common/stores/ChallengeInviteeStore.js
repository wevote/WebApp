import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/Dispatcher';

class ChallengeInviteeStore extends ReduceStore {
  getInitialState () {
    return {
      // TODO: Not quite right
      allCachedChallengeInvitees: {}, // Dictionary with ChallengeInvitee simple id as key and the ChallengeInvitee as value
      allCachedChallengeInviteeVoterEntries: {}, // Dictionary with challenge_we_vote_id and voter_we_vote_id as keys and the ChallengeInvitee for this voter as value
      allChallengeInviteeLists: {}, // Dict with key challenge_we_vote_id and value of List of Dicts w/ challenge_invitee entries, ordered highest rank to lowest
      latestChallengeInvitees: {}, // Dict with key challenge_we_vote_id and value of List of Dicts w/ latest challenge_invitee entries, ordered newest to oldest
      shareButtonClicked: false,
      inviteeEndorsementQueuedToSave: '',
      inviteeEndorsementQueuedToSaveSet: false,
      visibleToPublic: true, // Default setting
      visibleToPublicQueuedToSave: true, // Default setting
      visibleToPublicQueuedToSaveSet: false,
      voterSignedInWithEmail: false,
    };
  }

  resetState () {
    return this.getInitialState();
  }

  voterChipInExists (challengeWeVoteId) {
    if (challengeWeVoteId) {
      const challengeInviteeVoterEntry = this.getChallengeInviteeVoterEntry(challengeWeVoteId);
      // console.log('voterSupporterEndorsementExists, challengeInviteeVoterEntry:', challengeInviteeVoterEntry);
      if ('chip_in_total' in challengeInviteeVoterEntry && challengeInviteeVoterEntry.chip_in_total) {
        // console.log('ChallengeInviteeStore chip_in_total: ', challengeInviteeVoterEntry.chip_in_total, ', voterChipInExists:', Boolean(challengeInviteeVoterEntry.chip_in_total !== 'none'));
        return Boolean(challengeInviteeVoterEntry.chip_in_total !== 'none');
      }
    }
    return false;
  }

  voterSupporterEndorsementExists (challengeWeVoteId) {
    if (challengeWeVoteId) {
      const challengeInviteeVoterEntry = this.getChallengeInviteeVoterEntry(challengeWeVoteId);
      // console.log('voterSupporterEndorsementExists, challengeInviteeVoterEntry:', challengeInviteeVoterEntry);
      if ('invitee_endorsement' in challengeInviteeVoterEntry && challengeInviteeVoterEntry.invitee_endorsement) {
        return Boolean(challengeInviteeVoterEntry.invitee_endorsement.length > 0);
      }
    }
    return false;
  }

  getChallengeInviteeById (challengeInviteeId) {
    return this.getState().allCachedChallengeInvitees[challengeInviteeId] || {};
  }

  getChallengeInviteeList (challengeWeVoteId) {
    return this.getState().allChallengeInviteeLists[challengeWeVoteId] || [];
  }

  getChallengeInviteeVoterEntry (challengeWeVoteId) {
    return this.getState().allCachedChallengeInviteeVoterEntries[challengeWeVoteId] || {};
  }

  getShareButtonClicked () {
    return this.getState().shareButtonClicked;
  }

  getSupporterEndorsementQueuedToSave () {
    return this.getState().inviteeEndorsementQueuedToSave;
  }

  getSupporterEndorsementQueuedToSaveSet () {
    return this.getState().inviteeEndorsementQueuedToSaveSet;
  }

  getVisibleToPublic (challengeWeVoteId) {
    if (challengeWeVoteId) {
      const challengeInviteeVoterEntry = this.getChallengeInviteeVoterEntry(challengeWeVoteId);
      // console.log('voterSupporterEndorsementExists, challengeInviteeVoterEntry:', challengeInviteeVoterEntry);
      if ('visible_to_public' in challengeInviteeVoterEntry) {
        return Boolean(challengeInviteeVoterEntry.visible_to_public);
      }
    }
    return true;
  }

  getVisibleToPublicQueuedToSave () {
    return Boolean(this.getState().visibleToPublicQueuedToSave);
  }

  getVisibleToPublicQueuedToSaveSet () {
    return this.getState().visibleToPublicQueuedToSaveSet;
  }

  getVoterSignedInWithEmail () {
    return this.getState().voterSignedInWithEmail || false;
  }

  updateChallengeInviteeGenericList (challengeInviteeGenericListIncoming, challengeInviteeFromAPIResponse) {
    const challengeInviteeGenericList = challengeInviteeGenericListIncoming;
    // console.log('challengeInviteeGenericListIncoming:', challengeInviteeGenericListIncoming);
    // console.log('Incoming challengeInviteeFromAPIResponse:', challengeInviteeFromAPIResponse);
    if (!(challengeInviteeFromAPIResponse.challenge_we_vote_id in challengeInviteeGenericList)) {
      // console.log('challenge_we_vote_id not in challengeInviteeGenericList, adding: ', challengeInviteeFromAPIResponse.challenge_we_vote_id);
      challengeInviteeGenericList[challengeInviteeFromAPIResponse.challenge_we_vote_id] = [];
    }
    const tempChallengeInviteeGenericList = challengeInviteeGenericList[challengeInviteeFromAPIResponse.challenge_we_vote_id] || [];
    let alreadyExists = false;
    // Make sure we don't already show support from this speaker (i.e. "organization", which could also be a voter)
    for (let i = 0; i < tempChallengeInviteeGenericList.length; ++i) {
      if (tempChallengeInviteeGenericList[i].organization_we_vote_id === challengeInviteeFromAPIResponse.organization_we_vote_id) {
        tempChallengeInviteeGenericList[i] = challengeInviteeFromAPIResponse;
        alreadyExists = true;
      }
    }
    if (!alreadyExists) {
      tempChallengeInviteeGenericList.unshift(challengeInviteeFromAPIResponse);
    }
    challengeInviteeGenericList[challengeInviteeFromAPIResponse.challenge_we_vote_id] = tempChallengeInviteeGenericList;
    return challengeInviteeGenericList;
  }

  reduce (state, action) {
    const {
      allCachedChallengeInvitees, allCachedChallengeInviteeVoterEntries,
      allChallengeInviteeLists,
    } = state;
    let {
      latestChallengeInvitees,
    } = state;
    let challengeList;
    let challengeInvitee;
    let challengeInviteeList;

    let revisedState;
    switch (action.type) {
      case 'challengeListRetrieve':
        // See ChallengeStore for code to take in the following challenge values:
        // - challenge_owner_list
        // - challenge_politician_list
        // - seo_friendly_path_list

        // console.log('ChallengeInviteeStore challengeListRetrieve');
        if (!action.res || !action.res.success) return state;
        revisedState = state;
        challengeList = action.res.challenge_list || [];
        // console.log('challengeListRetrieve latestChallengeInvitees before:', latestChallengeInvitees);
        challengeList.forEach((oneChallenge) => {
          // if (!(oneChallenge.seo_friendly_path in allCachedChallengeWeVoteIdsBySEOFriendlyPath)) {
          //   allCachedChallengeWeVoteIdsBySEOFriendlyPath[oneChallenge.seo_friendly_path] = oneChallenge.challenge_we_vote_id;
          // }
          if ('latest_challenge_invitee_list' in oneChallenge) {
            for (let i = 0; i < oneChallenge.latest_challenge_invitee_list.length; ++i) {
              challengeInvitee = oneChallenge.latest_challenge_invitee_list[i];
              allCachedChallengeInvitees[challengeInvitee.id] = challengeInvitee;
              latestChallengeInvitees = this.updateChallengeInviteeGenericList(latestChallengeInvitees, challengeInvitee);
            }
          }
          if ('voter_challenge_invitee' in oneChallenge) {
            if ('challenge_we_vote_id' in oneChallenge.voter_challenge_invitee) {
              allCachedChallengeInviteeVoterEntries[oneChallenge.challenge_we_vote_id] = oneChallenge.voter_challenge_invitee;
              allCachedChallengeInvitees[oneChallenge.voter_challenge_invitee.id] = oneChallenge.voter_challenge_invitee;
            }
          }
        });
        // console.log('challengeListRetrieve latestChallengeInvitees after:', latestChallengeInvitees);
        revisedState = { ...revisedState, allCachedChallengeInvitees };
        revisedState = { ...revisedState, allCachedChallengeInviteeVoterEntries };
        revisedState = { ...revisedState, latestChallengeInvitees };
        return revisedState;

      case 'challengeInviteeListRetrieve':
        // console.log('ChallengeInviteeStore challengeInviteeListRetrieve');
        if (!action.res || !action.res.success) return state;
        revisedState = state;
        challengeInviteeList = action.res.challenge_invitee_list || [];
        // console.log('challengeInviteeListRetrieve challenge_invitee_list:', challengeInviteeList);
        allChallengeInviteeLists[action.res.challenge_we_vote_id] = challengeInviteeList;
        challengeInviteeList.forEach((oneInvitee) => {
          if (!(oneInvitee.voter_we_vote_id in allCachedChallengeInvitees)) {
            allCachedChallengeInvitees[oneInvitee.voter_we_vote_id] = {};
          }
          allCachedChallengeInvitees[oneInvitee.voter_we_vote_id][oneInvitee.challenge_we_vote_id] = oneInvitee;
        });
        revisedState = { ...revisedState, allCachedChallengeInvitees };
        revisedState = { ...revisedState, allChallengeInviteeLists };
        return revisedState;

      case 'challengeRetrieve':
      case 'challengeRetrieveAsOwner':
        // See ChallengeStore for code to take in the following challenge values:
        // - challenge_owner_list
        // - challenge_politician_list
        // - seo_friendly_path_list

        // console.log('ChallengeInviteeStore challengeRetrieve action.res:', action.res);
        if (!action.res || !action.res.success) return state;
        revisedState = state;
        if (action.res.challenge_we_vote_id) {
          if ('latest_challenge_invitee_list' in action.res) {
            for (let i = 0; i < action.res.latest_challenge_invitee_list.length; ++i) {
              challengeInvitee = action.res.latest_challenge_invitee_list[i];
              allCachedChallengeInvitees[challengeInvitee.id] = challengeInvitee;
              latestChallengeInvitees = this.updateChallengeInviteeGenericList(latestChallengeInvitees, challengeInvitee);
            }
          }
          if ('voter_challenge_invitee' in action.res) {
            if ('challenge_we_vote_id' in action.res.voter_challenge_invitee) {
              allCachedChallengeInviteeVoterEntries[action.res.challenge_we_vote_id] = action.res.voter_challenge_invitee;
              allCachedChallengeInvitees[action.res.voter_challenge_invitee.id] = action.res.voter_challenge_invitee;
            }
          }
        }
        // console.log('allCachedChallengeInvitees:', allCachedChallengeInvitees);
        revisedState = { ...revisedState, allCachedChallengeInvitees };
        revisedState = { ...revisedState, allCachedChallengeInviteeVoterEntries };
        revisedState = { ...revisedState, latestChallengeInvitees };
        return revisedState;

      case 'challengeInviteeSave':
        // console.log('ChallengeInviteeStore challengeInviteeSave');
        if (action.res.challenge_we_vote_id && action.res.success) {
          allCachedChallengeInviteeVoterEntries[action.res.challenge_we_vote_id] = action.res;
        }
        // console.log('challengeInviteeSave latestChallengeInvitees before:', latestChallengeInvitees);
        latestChallengeInvitees = this.updateChallengeInviteeGenericList(latestChallengeInvitees, action.res);
        // console.log('challengeInviteeSave latestChallengeInvitees after:', latestChallengeInvitees);
        return {
          ...state,
          allCachedChallengeInviteeVoterEntries,
          latestChallengeInvitees,
          voterSignedInWithEmail: Boolean(action.res.voter_signed_in_with_email),
        };

      case 'shareButtonClicked':
        // console.log('ChallengeInviteeStore shareButtonClicked: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            shareButtonClicked: false,
          };
        } else {
          return {
            ...state,
            shareButtonClicked: action.payload,
          };
        }

      case 'inviteeEndorsementQueuedToSave':
        // console.log('ChallengeInviteeStore inviteeEndorsementQueuedToSave: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            inviteeEndorsementQueuedToSave: '',
            inviteeEndorsementQueuedToSaveSet: false,
          };
        } else {
          return {
            ...state,
            inviteeEndorsementQueuedToSave: action.payload,
            inviteeEndorsementQueuedToSaveSet: true,
          };
        }

      case 'visibleToPublicQueuedToSave':
        // console.log('ChallengeInviteeStore visibleToPublicQueuedToSave: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            visibleToPublicQueuedToSave: true,
            visibleToPublicQueuedToSaveSet: false,
          };
        } else {
          return {
            ...state,
            visibleToPublicQueuedToSave: Boolean(action.payload),
            visibleToPublicQueuedToSaveSet: true,
          };
        }

      case 'voterSignOut':
        // console.log("resetting Challenge");
        // console.log('ChallengeInviteeStore voterSignOut, state:', state);
        return this.resetState();

      default:
        return state;
    }
  }
}

export default new ChallengeInviteeStore(Dispatcher);
