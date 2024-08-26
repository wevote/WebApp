import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/Dispatcher';

class ChallengeSupporterStore extends ReduceStore {
  getInitialState () {
    return {
      allCachedChallengeSupporters: {}, // Dictionary with ChallengeSupporter simple id as key and the ChallengeSupporter as value
      allCachedChallengeSupporterVoterEntries: {}, // Dictionary with challenge_we_vote_id as key and the ChallengeSupporter for this voter as value
      latestChallengeSupporters: {}, // Dict with key challenge_we_vote_id and value of List of Dicts w/ latest challenge_supporter entries, ordered newest to oldest
      latestChallengeSupportersWithText: {}, // Dict with key challenge_we_vote_id and value of List of Dicts w/ latest challenge_supporter entries with text endorsements
      shareButtonClicked: false,
      supporterEndorsementQueuedToSave: '',
      supporterEndorsementQueuedToSaveSet: false,
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
      const challengeSupporterVoterEntry = this.getChallengeSupporterVoterEntry(challengeWeVoteId);
      // console.log('voterSupporterEndorsementExists, challengeSupporterVoterEntry:', challengeSupporterVoterEntry);
      if ('chip_in_total' in challengeSupporterVoterEntry && challengeSupporterVoterEntry.chip_in_total) {
        // console.log('ChallengeSupporterStore chip_in_total: ', challengeSupporterVoterEntry.chip_in_total, ', voterChipInExists:', Boolean(challengeSupporterVoterEntry.chip_in_total !== 'none'));
        return Boolean(challengeSupporterVoterEntry.chip_in_total !== 'none');
      }
    }
    return false;
  }

  voterSupporterEndorsementExists (challengeWeVoteId) {
    if (challengeWeVoteId) {
      const challengeSupporterVoterEntry = this.getChallengeSupporterVoterEntry(challengeWeVoteId);
      // console.log('voterSupporterEndorsementExists, challengeSupporterVoterEntry:', challengeSupporterVoterEntry);
      if ('supporter_endorsement' in challengeSupporterVoterEntry && challengeSupporterVoterEntry.supporter_endorsement) {
        return Boolean(challengeSupporterVoterEntry.supporter_endorsement.length > 0);
      }
    }
    return false;
  }

  getChallengeSupporterById (challengeSupporterId) {
    return this.getState().allCachedChallengeSupporters[challengeSupporterId] || {};
  }

  getChallengeSupporterVoterEntry (challengeWeVoteId) {
    return this.getState().allCachedChallengeSupporterVoterEntries[challengeWeVoteId] || {};
  }

  // These are the most recent challenge_supporter entries, with visible signers. May or may not have text endorsements.
  getLatestChallengeSupportersList (challengeWeVoteId) {
    return this.getState().latestChallengeSupporters[challengeWeVoteId] || [];
  }

  getLatestChallengeSupportersWithTextList (challengeWeVoteId) {
    return this.getState().latestChallengeSupportersWithText[challengeWeVoteId] || [];
  }

  getShareButtonClicked () {
    return this.getState().shareButtonClicked;
  }

  getSupporterEndorsementQueuedToSave () {
    return this.getState().supporterEndorsementQueuedToSave;
  }

  getSupporterEndorsementQueuedToSaveSet () {
    return this.getState().supporterEndorsementQueuedToSaveSet;
  }

  getVisibleToPublic (challengeWeVoteId) {
    if (challengeWeVoteId) {
      const challengeSupporterVoterEntry = this.getChallengeSupporterVoterEntry(challengeWeVoteId);
      // console.log('voterSupporterEndorsementExists, challengeSupporterVoterEntry:', challengeSupporterVoterEntry);
      if ('visible_to_public' in challengeSupporterVoterEntry) {
        return Boolean(challengeSupporterVoterEntry.visible_to_public);
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

  updateChallengeSupporterGenericList (challengeSupporterGenericListIncoming, challengeSupporterFromAPIResponse) {
    const challengeSupporterGenericList = challengeSupporterGenericListIncoming;
    // console.log('challengeSupporterGenericListIncoming:', challengeSupporterGenericListIncoming);
    // console.log('Incoming challengeSupporterFromAPIResponse:', challengeSupporterFromAPIResponse);
    if (!(challengeSupporterFromAPIResponse.challenge_we_vote_id in challengeSupporterGenericList)) {
      // console.log('challenge_we_vote_id not in challengeSupporterGenericList, adding: ', challengeSupporterFromAPIResponse.challenge_we_vote_id);
      challengeSupporterGenericList[challengeSupporterFromAPIResponse.challenge_we_vote_id] = [];
    }
    const tempChallengeSupporterGenericList = challengeSupporterGenericList[challengeSupporterFromAPIResponse.challenge_we_vote_id] || [];
    let alreadyExists = false;
    // Make sure we don't already show support from this speaker (i.e. "organization", which could also be a voter)
    for (let i = 0; i < tempChallengeSupporterGenericList.length; ++i) {
      if (tempChallengeSupporterGenericList[i].organization_we_vote_id === challengeSupporterFromAPIResponse.organization_we_vote_id) {
        tempChallengeSupporterGenericList[i] = challengeSupporterFromAPIResponse;
        alreadyExists = true;
      }
    }
    if (!alreadyExists) {
      tempChallengeSupporterGenericList.unshift(challengeSupporterFromAPIResponse);
    }
    challengeSupporterGenericList[challengeSupporterFromAPIResponse.challenge_we_vote_id] = tempChallengeSupporterGenericList;
    return challengeSupporterGenericList;
  }

  reduce (state, action) {
    const {
      allCachedChallengeSupporters, allCachedChallengeSupporterVoterEntries,
    } = state;
    let {
      latestChallengeSupportersWithText, latestChallengeSupporters,
    } = state;
    let challengeList;
    let challengeSupporter;
    let challengeSupporterWithText;

    let revisedState;
    switch (action.type) {
      case 'challengeListRetrieve':
        // See ChallengeStore for code to take in the following challenge values:
        // - challenge_owner_list
        // - challenge_politician_list
        // - seo_friendly_path_list

        // console.log('ChallengeSupporterStore challengeListRetrieve');
        if (!action.res || !action.res.success) return state;
        revisedState = state;
        challengeList = action.res.challenge_list || [];
        // console.log('challengeListRetrieve latestChallengeSupporters before:', latestChallengeSupporters);
        // console.log('challengeListRetrieve latestChallengeSupportersWithText before:', latestChallengeSupportersWithText);
        challengeList.forEach((oneChallenge) => {
          // if (!(oneChallenge.seo_friendly_path in allCachedChallengeWeVoteIdsBySEOFriendlyPath)) {
          //   allCachedChallengeWeVoteIdsBySEOFriendlyPath[oneChallenge.seo_friendly_path] = oneChallenge.challenge_we_vote_id;
          // }
          if ('latest_challenge_supporter_endorsement_list' in oneChallenge) {
            for (let i = 0; i < oneChallenge.latest_challenge_supporter_endorsement_list.length; ++i) {
              challengeSupporterWithText = oneChallenge.latest_challenge_supporter_endorsement_list[i];
              allCachedChallengeSupporters[challengeSupporterWithText.id] = challengeSupporterWithText;
              latestChallengeSupportersWithText = this.updateChallengeSupporterGenericList(latestChallengeSupportersWithText, challengeSupporterWithText);
            }
          }
          if ('latest_challenge_supporter_list' in oneChallenge) {
            for (let i = 0; i < oneChallenge.latest_challenge_supporter_list.length; ++i) {
              challengeSupporter = oneChallenge.latest_challenge_supporter_list[i];
              allCachedChallengeSupporters[challengeSupporter.id] = challengeSupporter;
              latestChallengeSupporters = this.updateChallengeSupporterGenericList(latestChallengeSupporters, challengeSupporter);
            }
          }
          if ('voter_challenge_supporter' in oneChallenge) {
            if ('challenge_we_vote_id' in oneChallenge.voter_challenge_supporter) {
              allCachedChallengeSupporterVoterEntries[oneChallenge.challenge_we_vote_id] = oneChallenge.voter_challenge_supporter;
              allCachedChallengeSupporters[oneChallenge.voter_challenge_supporter.id] = oneChallenge.voter_challenge_supporter;
            }
          }
        });
        // console.log('challengeListRetrieve latestChallengeSupporters after:', latestChallengeSupporters);
        // console.log('challengeListRetrieve latestChallengeSupportersWithText after:', latestChallengeSupportersWithText);
        revisedState = { ...revisedState, allCachedChallengeSupporters };
        revisedState = { ...revisedState, allCachedChallengeSupporterVoterEntries };
        revisedState = { ...revisedState, latestChallengeSupporters };
        revisedState = { ...revisedState, latestChallengeSupportersWithText };
        return revisedState;

      case 'challengeRetrieve':
        // See ChallengeStore for code to take in the following challenge values:
        // - challenge_owner_list
        // - challenge_politician_list
        // - seo_friendly_path_list

        // console.log('ChallengeSupporterStore challengeRetrieve action.res:', action.res);
        if (!action.res || !action.res.success) return state;
        revisedState = state;
        if (action.res.challenge_we_vote_id) {
          if ('latest_challenge_supporter_endorsement_list' in action.res) {
            for (let i = 0; i < action.res.latest_challenge_supporter_endorsement_list.length; ++i) {
              challengeSupporterWithText = action.res.latest_challenge_supporter_endorsement_list[i];
              allCachedChallengeSupporters[challengeSupporterWithText.id] = challengeSupporterWithText;
              latestChallengeSupportersWithText = this.updateChallengeSupporterGenericList(latestChallengeSupportersWithText, challengeSupporterWithText);
            }
          }
          if ('latest_challenge_supporter_list' in action.res) {
            for (let i = 0; i < action.res.latest_challenge_supporter_list.length; ++i) {
              challengeSupporter = action.res.latest_challenge_supporter_list[i];
              allCachedChallengeSupporters[challengeSupporter.id] = challengeSupporter;
              latestChallengeSupporters = this.updateChallengeSupporterGenericList(latestChallengeSupporters, challengeSupporter);
            }
          }
          if ('voter_challenge_supporter' in action.res) {
            if ('challenge_we_vote_id' in action.res.voter_challenge_supporter) {
              allCachedChallengeSupporterVoterEntries[action.res.challenge_we_vote_id] = action.res.voter_challenge_supporter;
              allCachedChallengeSupporters[action.res.voter_challenge_supporter.id] = action.res.voter_challenge_supporter;
            }
          }
        }
        // console.log('allCachedChallengeSupporters:', allCachedChallengeSupporters);
        revisedState = { ...revisedState, allCachedChallengeSupporters };
        revisedState = { ...revisedState, allCachedChallengeSupporterVoterEntries };
        revisedState = { ...revisedState, latestChallengeSupporters };
        revisedState = { ...revisedState, latestChallengeSupportersWithText };
        return revisedState;

      case 'challengeSupporterSave':
        // console.log('ChallengeSupporterStore challengeSupporterSave');
        if (action.res.challenge_we_vote_id && action.res.success) {
          allCachedChallengeSupporterVoterEntries[action.res.challenge_we_vote_id] = action.res;
        }
        // console.log('challengeSupporterSave latestChallengeSupporters before:', latestChallengeSupporters);
        if (action.res.supporter_endorsement) {
          latestChallengeSupportersWithText = this.updateChallengeSupporterGenericList(latestChallengeSupportersWithText, action.res);
        }
        latestChallengeSupporters = this.updateChallengeSupporterGenericList(latestChallengeSupporters, action.res);
        // console.log('challengeSupporterSave latestChallengeSupporters after:', latestChallengeSupporters);
        return {
          ...state,
          allCachedChallengeSupporterVoterEntries,
          latestChallengeSupporters,
          latestChallengeSupportersWithText,
          voterSignedInWithEmail: Boolean(action.res.voter_signed_in_with_email),
        };

      case 'shareButtonClicked':
        // console.log('ChallengeSupporterStore shareButtonClicked: ', action.payload);
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

      case 'supporterEndorsementQueuedToSave':
        // console.log('ChallengeSupporterStore supporterEndorsementQueuedToSave: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            supporterEndorsementQueuedToSave: '',
            supporterEndorsementQueuedToSaveSet: false,
          };
        } else {
          return {
            ...state,
            supporterEndorsementQueuedToSave: action.payload,
            supporterEndorsementQueuedToSaveSet: true,
          };
        }

      case 'visibleToPublicQueuedToSave':
        // console.log('ChallengeSupporterStore visibleToPublicQueuedToSave: ', action.payload);
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
        // console.log('ChallengeSupporterStore voterSignOut, state:', state);
        return this.resetState();

      default:
        return state;
    }
  }
}

export default new ChallengeSupporterStore(Dispatcher);
