import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/Dispatcher';

class ChallengeStartStore extends ReduceStore {
  getInitialState () {
    return {
      challengeDescription: '',
      challengeDescriptionQueuedToSave: '',
      challengeDescriptionQueuedToSaveSet: false,
      challengePhotoLargeUrl: '',
      challengePhotoQueuedToDelete: false,
      challengePhotoQueuedToDeleteSet: false,
      challengePhotoQueuedToSave: '',
      challengePhotoQueuedToSaveSet: false,
      challengePoliticianDeleteList: [],
      challengePoliticianList: [],
      challengePoliticianListExists: false,
      challengePoliticianStarterList: [],
      challengePoliticianStarterListQueuedToSave: [],
      challengePoliticianStarterListQueuedToSaveSet: false,
      challengeTitle: '',
      challengeTitleQueuedToSave: '',
      challengeTitleQueuedToSaveSet: false,
      challengeOwnerList: [],
      challengeWeVoteId: '',
      voterSignedInWithEmail: false,
    };
  }

  resetState () {
    return this.getInitialState();
  }

  challengeDescriptionExists () {
    if (this.getState().challengeDescription) {
      return Boolean(this.getState().challengeDescription.length > 0);
    } else {
      return false;
    }
  }

  challengePhotoExists () {
    if (this.getState().challengePhotoLargeUrl) {
      return Boolean(this.getState().challengePhotoLargeUrl.length > 10);
    } else {
      return false;
    }
  }

  challengePoliticianListExists () {
    if (this.getState().challengePoliticianList) {
      return Boolean(this.getState().challengePoliticianList.length > 0);
    } else {
      return false;
    }
  }

  challengePoliticianStarterListExists () {
    if (this.getState().challengePoliticianStarterList) {
      return Boolean(this.getState().challengePoliticianStarterList.length > 0);
    } else {
      return false;
    }
  }

  challengeTitleExists () {
    if (this.getState().challengeTitle) {
      return Boolean(this.getState().challengeTitle.length > 0);
    } else {
      return false;
    }
  }

  getChallengeDescription () {
    return this.getState().challengeDescription || '';
  }

  getChallengeDescriptionQueuedToSave () {
    return this.getState().challengeDescriptionQueuedToSave;
  }

  getChallengeDescriptionQueuedToSaveSet () {
    return this.getState().challengeDescriptionQueuedToSaveSet;
  }

  getChallengeInviteTextDefault () {
    return this.getState().challengeInviteTextDefault || '';
  }

  getChallengeInviteTextDefaultQueuedToSave () {
    return this.getState().challengeInviteTextDefaultQueuedToSave;
  }

  getChallengeInviteTextDefaultQueuedToSaveSet () {
    return this.getState().challengeInviteTextDefaultQueuedToSaveSet;
  }

  getChallengePhotoLargeUrl () {
    return this.getState().challengePhotoLargeUrl || '';
  }

  getChallengePhotoQueuedToDelete () {
    return this.getState().challengePhotoQueuedToDelete;
  }

  getChallengePhotoQueuedToDeleteSet () {
    return this.getState().challengePhotoQueuedToDeleteSet;
  }

  getChallengePhotoQueuedToSave () {
    return this.getState().challengePhotoQueuedToSave;
  }

  getChallengePhotoQueuedToSaveSet () {
    return this.getState().challengePhotoQueuedToSaveSet;
  }

  getChallengePoliticianList () {
    return this.getState().challengePoliticianList || [];
  }

  getChallengePoliticianDeleteList () {
    return this.getState().challengePoliticianDeleteList || [];
  }

  getChallengePoliticianStarterList () {
    return this.getState().challengePoliticianStarterList || [];
  }

  getChallengePoliticianStarterListQueuedToSave () {
    return this.getState().challengePoliticianStarterListQueuedToSave || [];
  }

  getChallengePoliticianStarterListQueuedToSaveSet () {
    return this.getState().challengePoliticianStarterListQueuedToSaveSet || false;
  }

  getChallengeTitle () {
    return this.getState().challengeTitle || '';
  }

  getChallengeTitleQueuedToSave () {
    return this.getState().challengeTitleQueuedToSave;
  }

  getChallengeTitleQueuedToSaveSet () {
    return this.getState().challengeTitleQueuedToSaveSet;
  }

  getChallengeWeVoteId () {
    return this.getState().challengeWeVoteId || '';
  }

  getInDraftMode () {
    return this.getState().inDraftMode;
  }

  getVoterSignedInWithEmail () {
    return this.getState().voterSignedInWithEmail || false;
  }

  reduce (state, action) {
    const { challengePoliticianDeleteList } = state;
    switch (action.type) {
      case 'challengeDescriptionQueuedToSave':
        // console.log('ChallengeStartStore challengeDescriptionQueuedToSave: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            challengeDescriptionQueuedToSave: '',
            challengeDescriptionQueuedToSaveSet: false,
          };
        } else {
          return {
            ...state,
            challengeDescriptionQueuedToSave: action.payload,
            challengeDescriptionQueuedToSaveSet: true,
          };
        }

      case 'challengeEditAllReset':
        // console.log('challengeEditAllReset');
        return {
          ...state,
          challengeDescriptionQueuedToSave: '',
          challengeDescriptionQueuedToSaveSet: false,
          challengeInviteTextDefaultQueuedToSave: '',
          challengeInviteTextDefaultQueuedToSaveSet: false,
          challengePhotoQueuedToDelete: false,
          challengePhotoQueuedToDeleteSet: false,
          challengePhotoQueuedToSave: '',
          challengePhotoQueuedToSaveSet: false,
          challengePoliticianStarterListQueuedToSave: [],
          challengePoliticianStarterListQueuedToSaveSet: false,
          challengeTitleQueuedToSave: '',
          challengeTitleQueuedToSaveSet: false,
        };

      case 'challengeInviteTextDefaultQueuedToSave':
        // console.log('ChallengeStartStore challengeInviteTextDefaultQueuedToSave: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            challengeInviteTextDefaultQueuedToSave: '',
            challengeInviteTextDefaultQueuedToSaveSet: false,
          };
        } else {
          return {
            ...state,
            challengeInviteTextDefaultQueuedToSave: action.payload,
            challengeInviteTextDefaultQueuedToSaveSet: true,
          };
        }

      case 'challengePhotoQueuedToDelete':
        console.log('ChallengeStartStore challengePhotoQueuedToDelete: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            challengePhotoQueuedToDelete: false,
            challengePhotoQueuedToDeleteSet: false,
          };
        } else {
          return {
            ...state,
            challengePhotoQueuedToDelete: action.payload,
            challengePhotoQueuedToDeleteSet: true,
          };
        }

      case 'challengePhotoQueuedToSave':
        // console.log('ChallengeStartStore challengePhotoQueuedToSave: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            challengePhotoQueuedToSave: '',
            challengePhotoQueuedToSaveSet: false,
          };
        } else {
          return {
            ...state,
            challengePhotoQueuedToSave: action.payload,
            challengePhotoQueuedToSaveSet: true,
          };
        }

      case 'challengePoliticianDeleteAddQueuedToSave':
        // console.log('ChallengeStartStore challengePoliticianDeleteAddQueuedToSave: ', action.payload);
        if (challengePoliticianDeleteList.indexOf(action.payload) === -1) {
          challengePoliticianDeleteList.push(action.payload);
        }
        // console.log('challengePoliticianDeleteList:', challengePoliticianDeleteList);
        return {
          ...state,
          challengePoliticianDeleteList,
        };

      case 'challengePoliticianDeleteRemoveQueuedToSave':
        // console.log('ChallengeStartStore challengePoliticianDeleteRemoveQueuedToSave: ', action.payload);
        if (challengePoliticianDeleteList.indexOf(action.payload) !== -1) {
          challengePoliticianDeleteList.splice(challengePoliticianDeleteList.indexOf(action.payload), 1);
        }
        // console.log('challengePoliticianDeleteList:', challengePoliticianDeleteList);
        return {
          ...state,
          challengePoliticianDeleteList,
        };

      case 'challengePoliticianStarterListQueuedToSave':
        // console.log('ChallengeStartStore challengePoliticianStarterListQueuedToSave: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            challengePoliticianStarterListQueuedToSave: [],
            challengePoliticianStarterListQueuedToSaveSet: false,
          };
        } else {
          return {
            ...state,
            challengePoliticianStarterListQueuedToSave: action.payload,
            challengePoliticianStarterListQueuedToSaveSet: true,
          };
        }

      // case 'challengeRetrieve':
      case 'challengeRetrieveAsOwner':
        // console.log('ChallengeStartStore challengeRetrieveAsOwner, action.res:', action.res);
        return {
          ...state,
          challengeDescription: action.res.challenge_description,
          challengeInviteTextDefault: action.res.challenge_invite_text_default,
          challengePhotoLargeUrl: action.res.we_vote_hosted_challenge_photo_large_url,
          challengePhotoMediumUrl: action.res.we_vote_hosted_challenge_photo_medium_url,
          challengePhotoSmallUrl: action.res.we_vote_hosted_challenge_photo_small_url,
          challengePoliticianList: action.res.challenge_politician_list,
          challengePoliticianListExists: action.res.challenge_politician_list_exists,
          challengePoliticianStarterList: action.res.challenge_politician_starter_list,
          challengeTitle: action.res.challenge_title,
          challengeOwnerList: action.res.challenge_owner_list,
          challengeWeVoteId: action.res.challenge_we_vote_id,
          inDraftMode: action.res.in_draft_mode,
          voterSignedInWithEmail: action.res.voter_signed_in_with_email,
        };

      case 'challengeStartSave':
        // console.log('ChallengeStartStore challengeStartSave, action.res:', action.res);
        return {
          ...state,
          challengeDescription: action.res.challenge_description,
          challengeInviteTextDefault: action.res.challenge_invite_text_default,
          challengePhotoLargeUrl: action.res.we_vote_hosted_challenge_photo_large_url,
          challengePhotoMediumUrl: action.res.we_vote_hosted_challenge_photo_medium_url,
          challengePhotoSmallUrl: action.res.we_vote_hosted_challenge_photo_small_url,
          challengePoliticianList: action.res.challenge_politician_list,
          challengePoliticianListExists: action.res.challenge_politician_list_exists,
          challengePoliticianStarterList: action.res.challenge_politician_starter_list,
          challengeTitle: action.res.challenge_title,
          challengeOwnerList: action.res.challenge_owner_list,
          challengeWeVoteId: action.res.challenge_we_vote_id,
          inDraftMode: action.res.in_draft_mode,
          voterSignedInWithEmail: action.res.voter_signed_in_with_email,
        };

      case 'challengeTitleQueuedToSave':
        // console.log('ChallengeStartStore challengeTitleQueuedToSave: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            challengeTitleQueuedToSave: '',
            challengeTitleQueuedToSaveSet: false,
          };
        } else {
          return {
            ...state,
            challengeTitleQueuedToSave: action.payload,
            challengeTitleQueuedToSaveSet: true,
          };
        }

      case 'voterSignOut':
        // console.log("resetting Challenge");
        return this.resetState();

      default:
        return state;
    }
  }
}

export default new ChallengeStartStore(Dispatcher);
