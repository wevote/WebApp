import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/Dispatcher';

class ChallengeInviteeStore extends ReduceStore {
  getInitialState () {
    return {
      // TODO: Not quite right
      allCachedChallengeInvitees: {}, // Dictionary with ChallengeInviteeListRoot simple id as key and the ChallengeInviteeListRoot as value
      allCachedChallengeInviteeVoterEntries: {}, // Dictionary with challenge_we_vote_id and voter_we_vote_id as keys and the ChallengeInviteeListRoot for this voter as value
      allChallengeInviteeLists: {}, // Dict with key challenge_we_vote_id and value of List of Dicts w/ challenge_invitee entries, ordered highest rank to lowest
      latestChallengeInvitees: {}, // Dict with key challenge_we_vote_id and value of List of Dicts w/ latest challenge_invitee entries, ordered newest to oldest
      shareButtonClicked: false,
      inviteeEndorsementQueuedToSave: '',
      inviteeEndorsementQueuedToSaveSet: false,
      nextInviteeUrlCode: '',
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

  // Note that these are only invitees invited by the viewing voter, not ALL invitees for the challenge
  getNumberOfInviteesInChallenge (challengeWeVoteId) {
    const inviteeList = this.getChallengeInviteeList(challengeWeVoteId) || [];
    return inviteeList.length;
  }

  getChallengeInviteeList (challengeWeVoteId) {
    return this.getState().allChallengeInviteeLists[challengeWeVoteId] || [];
  }

  getChallengeInviteeVoterEntry (challengeWeVoteId) {
    return this.getState().allCachedChallengeInviteeVoterEntries[challengeWeVoteId] || {};
  }

  getInviteTextFromInviter (challengeInviteeId) {
    const challengeInvitee = this.getChallengeInviteeById(challengeInviteeId);
    if ('invite_text_from_inviter' in challengeInvitee) {
      return challengeInvitee.invite_text_from_inviter;
    } else {
      return '';
    }
  }

  getNextInviteeUrlCode () {
    return this.getState().nextInviteeUrlCode || '--';
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

  mostRecentDateFromChallengeInvitee (challengeInvitee) {
    let mostRecentDate = challengeInvitee.date_invite_sent;
    if (challengeInvitee.date_invite_viewed > mostRecentDate) {
      mostRecentDate = challengeInvitee.date_invite_viewed;
    }
    if (challengeInvitee.date_challenge_joined > mostRecentDate) {
      mostRecentDate = challengeInvitee.date_challenge_joined;
    }
    return mostRecentDate;
  }

  orderByMostRecentDate = (firstItem, secondItem) => new Date(secondItem.most_recent_date) - new Date(firstItem.most_recent_date);

  reduce (state, action) {
    const {
      allCachedChallengeInvitees,
      allChallengeInviteeLists,
    } = state;
    let {
      latestChallengeInvitees, nextInviteeUrlCode,
    } = state;
    let challengeList;
    let challengeInvitee;
    let challengeInviteeTemp;
    let challengeInviteeList;
    let challengeInviteeListTemp = [];
    let alreadyInList;
    let mostRecentDate;

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
          if ('latest_challenge_invitee_list' in oneChallenge) {
            for (let i = 0; i < oneChallenge.latest_challenge_invitee_list.length; ++i) {
              challengeInvitee = oneChallenge.latest_challenge_invitee_list[i];
              allCachedChallengeInvitees[challengeInvitee.id] = challengeInvitee;
              latestChallengeInvitees = this.updateChallengeInviteeGenericList(latestChallengeInvitees, challengeInvitee);
            }
          }
        });
        // console.log('challengeListRetrieve latestChallengeInvitees after:', latestChallengeInvitees);
        revisedState = { ...revisedState, latestChallengeInvitees };
        return revisedState;

      case 'challengeInviteeListRetrieve':
        // console.log('ChallengeInviteeStore challengeInviteeListRetrieve');
        if (!action.res || !action.res.success) return state;
        revisedState = state;
        challengeInviteeList = action.res.challenge_invitee_list || [];
        // console.log('challengeInviteeListRetrieve challenge_invitee_list:', challengeInviteeList);
        challengeInviteeListTemp = [];
        challengeInviteeList.forEach((oneChallengeInvitee) => {
          mostRecentDate = this.mostRecentDateFromChallengeInvitee(oneChallengeInvitee);
          challengeInviteeTemp = oneChallengeInvitee;
          challengeInviteeTemp.most_recent_date = mostRecentDate;
          challengeInviteeListTemp.push(challengeInviteeTemp);
          if (oneChallengeInvitee.invitee_id) {
            allCachedChallengeInvitees[oneChallengeInvitee.invitee_id] = challengeInviteeTemp;
          }
        });
        // console.log('challengeInviteeListRetrieve challengeInviteeListTemp:', challengeInviteeListTemp);
        challengeInviteeListTemp = challengeInviteeListTemp.sort(this.orderByMostRecentDate);
        allChallengeInviteeLists[action.res.challenge_we_vote_id] = challengeInviteeListTemp;
        if (action.res.next_invitee_url_code) {
          nextInviteeUrlCode = action.res.next_invitee_url_code;
          revisedState = { ...revisedState, nextInviteeUrlCode };
        }
        revisedState = { ...revisedState, allCachedChallengeInvitees };
        revisedState = { ...revisedState, allChallengeInviteeLists };
        return revisedState;

      case 'challengeInviteeSave':
        if (!action.res || !action.res.success) return state;
        revisedState = state;
        challengeInvitee = action.res;
        if (challengeInvitee.challenge_we_vote_id) {
          if (challengeInvitee.invitee_id) {
            mostRecentDate = this.mostRecentDateFromChallengeInvitee(challengeInvitee);
            challengeInvitee.most_recent_date = mostRecentDate;
            allCachedChallengeInvitees[challengeInvitee.invitee_id] = challengeInvitee;
            revisedState = { ...revisedState, allCachedChallengeInvitees };
          }
        }
        if (challengeInvitee.invitee_id) {
          alreadyInList = false;
          challengeInviteeListTemp = [];
          challengeInviteeList = allChallengeInviteeLists[challengeInvitee.challenge_we_vote_id];
          challengeInviteeList.forEach((oneChallengeInvitee) => {
            if (oneChallengeInvitee.invitee_id === challengeInvitee.invitee_id) {
              alreadyInList = true;
              // Swap for new challengeInvitee
              challengeInviteeListTemp.push(challengeInvitee);
            } else {
              // Keep using previous challengeInvitee
              challengeInviteeListTemp.push(oneChallengeInvitee);
            }
          });
          if (!alreadyInList) {
            challengeInviteeListTemp.unshift(challengeInvitee);
          }
          allChallengeInviteeLists[challengeInvitee.challenge_we_vote_id] = [...challengeInviteeListTemp];
          revisedState = { ...revisedState, allChallengeInviteeLists };
        }
        if (action.res.next_invitee_url_code) {
          nextInviteeUrlCode = action.res.next_invitee_url_code;
          revisedState = { ...revisedState, nextInviteeUrlCode };
        }
        return revisedState;

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
