import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/Dispatcher';

class ChallengeParticipantStore extends ReduceStore {
  getInitialState () {
    return {
      allCachedChallengeParticipants: {}, // Dictionary with ChallengeParticipant simple id as key and the ChallengeParticipant as value
      allCachedChallengeParticipantVoterEntries: {}, // Dictionary with challenge_we_vote_id as key and the ChallengeParticipant for this voter as value
      latestChallengeParticipants: {}, // Dict with key challenge_we_vote_id and value of List of Dicts w/ latest challenge_participant entries, ordered newest to oldest
      latestChallengeParticipantsWithText: {}, // Dict with key challenge_we_vote_id and value of List of Dicts w/ latest challenge_participant entries with text endorsements
      shareButtonClicked: false,
      participantEndorsementQueuedToSave: '',
      participantEndorsementQueuedToSaveSet: false,
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
      const challengeParticipantVoterEntry = this.getChallengeParticipantVoterEntry(challengeWeVoteId);
      // console.log('voterSupporterEndorsementExists, challengeParticipantVoterEntry:', challengeParticipantVoterEntry);
      if ('chip_in_total' in challengeParticipantVoterEntry && challengeParticipantVoterEntry.chip_in_total) {
        // console.log('ChallengeParticipantStore chip_in_total: ', challengeParticipantVoterEntry.chip_in_total, ', voterChipInExists:', Boolean(challengeParticipantVoterEntry.chip_in_total !== 'none'));
        return Boolean(challengeParticipantVoterEntry.chip_in_total !== 'none');
      }
    }
    return false;
  }

  voterSupporterEndorsementExists (challengeWeVoteId) {
    if (challengeWeVoteId) {
      const challengeParticipantVoterEntry = this.getChallengeParticipantVoterEntry(challengeWeVoteId);
      // console.log('voterSupporterEndorsementExists, challengeParticipantVoterEntry:', challengeParticipantVoterEntry);
      if ('participant_endorsement' in challengeParticipantVoterEntry && challengeParticipantVoterEntry.participant_endorsement) {
        return Boolean(challengeParticipantVoterEntry.participant_endorsement.length > 0);
      }
    }
    return false;
  }

  getChallengeParticipantById (challengeParticipantId) {
    return this.getState().allCachedChallengeParticipants[challengeParticipantId] || {};
  }

  getChallengeParticipantVoterEntry (challengeWeVoteId) {
    return this.getState().allCachedChallengeParticipantVoterEntries[challengeWeVoteId] || {};
  }

  // These are the most recent challenge_participant entries, with visible signers. May or may not have text endorsements.
  getLatestChallengeParticipantsList (challengeWeVoteId) {
    return this.getState().latestChallengeParticipants[challengeWeVoteId] || [];
  }

  getLatestChallengeParticipantsWithTextList (challengeWeVoteId) {
    return this.getState().latestChallengeParticipantsWithText[challengeWeVoteId] || [];
  }

  getShareButtonClicked () {
    return this.getState().shareButtonClicked;
  }

  getSupporterEndorsementQueuedToSave () {
    return this.getState().participantEndorsementQueuedToSave;
  }

  getSupporterEndorsementQueuedToSaveSet () {
    return this.getState().participantEndorsementQueuedToSaveSet;
  }

  getVisibleToPublic (challengeWeVoteId) {
    if (challengeWeVoteId) {
      const challengeParticipantVoterEntry = this.getChallengeParticipantVoterEntry(challengeWeVoteId);
      // console.log('voterSupporterEndorsementExists, challengeParticipantVoterEntry:', challengeParticipantVoterEntry);
      if ('visible_to_public' in challengeParticipantVoterEntry) {
        return Boolean(challengeParticipantVoterEntry.visible_to_public);
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

  updateChallengeParticipantGenericList (challengeParticipantGenericListIncoming, challengeParticipantFromAPIResponse) {
    const challengeParticipantGenericList = challengeParticipantGenericListIncoming;
    // console.log('challengeParticipantGenericListIncoming:', challengeParticipantGenericListIncoming);
    // console.log('Incoming challengeParticipantFromAPIResponse:', challengeParticipantFromAPIResponse);
    if (!(challengeParticipantFromAPIResponse.challenge_we_vote_id in challengeParticipantGenericList)) {
      // console.log('challenge_we_vote_id not in challengeParticipantGenericList, adding: ', challengeParticipantFromAPIResponse.challenge_we_vote_id);
      challengeParticipantGenericList[challengeParticipantFromAPIResponse.challenge_we_vote_id] = [];
    }
    const tempChallengeParticipantGenericList = challengeParticipantGenericList[challengeParticipantFromAPIResponse.challenge_we_vote_id] || [];
    let alreadyExists = false;
    // Make sure we don't already show support from this speaker (i.e. "organization", which could also be a voter)
    for (let i = 0; i < tempChallengeParticipantGenericList.length; ++i) {
      if (tempChallengeParticipantGenericList[i].organization_we_vote_id === challengeParticipantFromAPIResponse.organization_we_vote_id) {
        tempChallengeParticipantGenericList[i] = challengeParticipantFromAPIResponse;
        alreadyExists = true;
      }
    }
    if (!alreadyExists) {
      tempChallengeParticipantGenericList.unshift(challengeParticipantFromAPIResponse);
    }
    challengeParticipantGenericList[challengeParticipantFromAPIResponse.challenge_we_vote_id] = tempChallengeParticipantGenericList;
    return challengeParticipantGenericList;
  }

  reduce (state, action) {
    const {
      allCachedChallengeParticipants, allCachedChallengeParticipantVoterEntries,
    } = state;
    let {
      latestChallengeParticipantsWithText, latestChallengeParticipants,
    } = state;
    let challengeList;
    let challengeParticipant;
    let challengeParticipantWithText;

    let revisedState;
    switch (action.type) {
      case 'challengeListRetrieve':
        // See ChallengeStore for code to take in the following challenge values:
        // - challenge_owner_list
        // - challenge_politician_list
        // - seo_friendly_path_list

        // console.log('ChallengeParticipantStore challengeListRetrieve');
        if (!action.res || !action.res.success) return state;
        revisedState = state;
        challengeList = action.res.challenge_list || [];
        // console.log('challengeListRetrieve latestChallengeParticipants before:', latestChallengeParticipants);
        // console.log('challengeListRetrieve latestChallengeParticipantsWithText before:', latestChallengeParticipantsWithText);
        challengeList.forEach((oneChallenge) => {
          // if (!(oneChallenge.seo_friendly_path in allCachedChallengeWeVoteIdsBySEOFriendlyPath)) {
          //   allCachedChallengeWeVoteIdsBySEOFriendlyPath[oneChallenge.seo_friendly_path] = oneChallenge.challenge_we_vote_id;
          // }
          if ('latest_challenge_participant_endorsement_list' in oneChallenge) {
            for (let i = 0; i < oneChallenge.latest_challenge_participant_endorsement_list.length; ++i) {
              challengeParticipantWithText = oneChallenge.latest_challenge_participant_endorsement_list[i];
              allCachedChallengeParticipants[challengeParticipantWithText.id] = challengeParticipantWithText;
              latestChallengeParticipantsWithText = this.updateChallengeParticipantGenericList(latestChallengeParticipantsWithText, challengeParticipantWithText);
            }
          }
          if ('latest_challenge_participant_list' in oneChallenge) {
            for (let i = 0; i < oneChallenge.latest_challenge_participant_list.length; ++i) {
              challengeParticipant = oneChallenge.latest_challenge_participant_list[i];
              allCachedChallengeParticipants[challengeParticipant.id] = challengeParticipant;
              latestChallengeParticipants = this.updateChallengeParticipantGenericList(latestChallengeParticipants, challengeParticipant);
            }
          }
          if ('voter_challenge_participant' in oneChallenge) {
            if ('challenge_we_vote_id' in oneChallenge.voter_challenge_participant) {
              allCachedChallengeParticipantVoterEntries[oneChallenge.challenge_we_vote_id] = oneChallenge.voter_challenge_participant;
              allCachedChallengeParticipants[oneChallenge.voter_challenge_participant.id] = oneChallenge.voter_challenge_participant;
            }
          }
        });
        // console.log('challengeListRetrieve latestChallengeParticipants after:', latestChallengeParticipants);
        // console.log('challengeListRetrieve latestChallengeParticipantsWithText after:', latestChallengeParticipantsWithText);
        revisedState = { ...revisedState, allCachedChallengeParticipants };
        revisedState = { ...revisedState, allCachedChallengeParticipantVoterEntries };
        revisedState = { ...revisedState, latestChallengeParticipants };
        revisedState = { ...revisedState, latestChallengeParticipantsWithText };
        return revisedState;

      case 'challengeRetrieve':
      case 'challengeRetrieveAsOwner':
        // See ChallengeStore for code to take in the following challenge values:
        // - challenge_owner_list
        // - challenge_politician_list
        // - seo_friendly_path_list

        // console.log('ChallengeParticipantStore challengeRetrieve action.res:', action.res);
        if (!action.res || !action.res.success) return state;
        revisedState = state;
        if (action.res.challenge_we_vote_id) {
          if ('latest_challenge_participant_endorsement_list' in action.res) {
            for (let i = 0; i < action.res.latest_challenge_participant_endorsement_list.length; ++i) {
              challengeParticipantWithText = action.res.latest_challenge_participant_endorsement_list[i];
              allCachedChallengeParticipants[challengeParticipantWithText.id] = challengeParticipantWithText;
              latestChallengeParticipantsWithText = this.updateChallengeParticipantGenericList(latestChallengeParticipantsWithText, challengeParticipantWithText);
            }
          }
          if ('latest_challenge_participant_list' in action.res) {
            for (let i = 0; i < action.res.latest_challenge_participant_list.length; ++i) {
              challengeParticipant = action.res.latest_challenge_participant_list[i];
              allCachedChallengeParticipants[challengeParticipant.id] = challengeParticipant;
              latestChallengeParticipants = this.updateChallengeParticipantGenericList(latestChallengeParticipants, challengeParticipant);
            }
          }
          if ('voter_challenge_participant' in action.res) {
            if ('challenge_we_vote_id' in action.res.voter_challenge_participant) {
              allCachedChallengeParticipantVoterEntries[action.res.challenge_we_vote_id] = action.res.voter_challenge_participant;
              allCachedChallengeParticipants[action.res.voter_challenge_participant.id] = action.res.voter_challenge_participant;
            }
          }
        }
        // console.log('allCachedChallengeParticipants:', allCachedChallengeParticipants);
        revisedState = { ...revisedState, allCachedChallengeParticipants };
        revisedState = { ...revisedState, allCachedChallengeParticipantVoterEntries };
        revisedState = { ...revisedState, latestChallengeParticipants };
        revisedState = { ...revisedState, latestChallengeParticipantsWithText };
        return revisedState;

      case 'challengeParticipantSave':
        // console.log('ChallengeParticipantStore challengeParticipantSave');
        if (action.res.challenge_we_vote_id && action.res.success) {
          allCachedChallengeParticipantVoterEntries[action.res.challenge_we_vote_id] = action.res;
        }
        // console.log('challengeParticipantSave latestChallengeParticipants before:', latestChallengeParticipants);
        if (action.res.participant_endorsement) {
          latestChallengeParticipantsWithText = this.updateChallengeParticipantGenericList(latestChallengeParticipantsWithText, action.res);
        }
        latestChallengeParticipants = this.updateChallengeParticipantGenericList(latestChallengeParticipants, action.res);
        // console.log('challengeParticipantSave latestChallengeParticipants after:', latestChallengeParticipants);
        return {
          ...state,
          allCachedChallengeParticipantVoterEntries,
          latestChallengeParticipants,
          latestChallengeParticipantsWithText,
          voterSignedInWithEmail: Boolean(action.res.voter_signed_in_with_email),
        };

      case 'shareButtonClicked':
        // console.log('ChallengeParticipantStore shareButtonClicked: ', action.payload);
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

      case 'participantEndorsementQueuedToSave':
        // console.log('ChallengeParticipantStore participantEndorsementQueuedToSave: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            participantEndorsementQueuedToSave: '',
            participantEndorsementQueuedToSaveSet: false,
          };
        } else {
          return {
            ...state,
            participantEndorsementQueuedToSave: action.payload,
            participantEndorsementQueuedToSaveSet: true,
          };
        }

      case 'visibleToPublicQueuedToSave':
        // console.log('ChallengeParticipantStore visibleToPublicQueuedToSave: ', action.payload);
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
        // console.log('ChallengeParticipantStore voterSignOut, state:', state);
        return this.resetState();

      default:
        return state;
    }
  }
}

export default new ChallengeParticipantStore(Dispatcher);
