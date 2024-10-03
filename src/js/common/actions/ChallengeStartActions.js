import Dispatcher from '../dispatcher/Dispatcher';

export default {
  challengeDescriptionQueuedToSave (challengeDescription) {
    Dispatcher.dispatch({ type: 'challengeDescriptionQueuedToSave', payload: challengeDescription });
  },

  challengeDescriptionSave (challengeWeVoteId, challengeDescription) {
    // console.log('challengeDescriptionSave: ', challengeDescription);
    Dispatcher.loadEndpoint('challengeStartSave',
      {
        challenge_description: challengeDescription,
        challenge_description_changed: true,
        challenge_we_vote_id: challengeWeVoteId,
      });
  },

  challengeEditAllReset () {
    Dispatcher.dispatch({ type: 'challengeEditAllReset', payload: true });
  },

  challengeEditAllSave (
    challengeWeVoteId,
    challengeDescriptionQueuedToSave, challengeDescriptionQueuedToSaveSet,
    challengeInviteTextDefaultQueuedToSave, challengeInviteTextDefaultQueuedToSaveSet,
    challengePhotoQueuedToDelete, challengePhotoQueuedToDeleteSet,
    challengePhotoQueuedToSave, challengePhotoQueuedToSaveSet,
    challengePoliticianDeleteListJson,
    challengePoliticianStarterListQueuedToSave, challengePoliticianStarterListQueuedToSaveSet,
    challengeTitleQueuedToSave, challengeTitleQueuedToSaveSet,
  ) {
    Dispatcher.loadEndpoint('challengeStartSave',
      {
        challenge_description: challengeDescriptionQueuedToSave,
        challenge_description_changed: challengeDescriptionQueuedToSaveSet,
        challenge_invite_text_default: challengeInviteTextDefaultQueuedToSave,
        challenge_invite_text_default_changed: challengeInviteTextDefaultQueuedToSaveSet,
        challenge_photo_from_file_reader: challengePhotoQueuedToSave,
        challenge_photo_changed: challengePhotoQueuedToSaveSet,
        challenge_photo_delete: challengePhotoQueuedToDelete,
        challenge_photo_delete_changed: challengePhotoQueuedToDeleteSet,
        challenge_title: challengeTitleQueuedToSave,
        challenge_title_changed: challengeTitleQueuedToSaveSet,
        challenge_we_vote_id: challengeWeVoteId,
        politician_delete_list: challengePoliticianDeleteListJson,
        politician_starter_list: challengePoliticianStarterListQueuedToSave,
        politician_starter_list_changed: challengePoliticianStarterListQueuedToSaveSet,
      });
  },

  challengeInviteTextDefaultQueuedToSave (challengeInviteTextDefault) {
    Dispatcher.dispatch({ type: 'challengeInviteTextDefaultQueuedToSave', payload: challengeInviteTextDefault });
  },

  challengeInviteTextDefaultSave (challengeWeVoteId, challengeInviteTextDefault) {
    // console.log('challengeInviteTextDefaultSave: ', challengeInviteTextDefault);
    Dispatcher.loadEndpoint('challengeStartSave',
      {
        challenge_invite_text_default: challengeInviteTextDefault,
        challenge_invite_text_default_changed: true,
        challenge_we_vote_id: challengeWeVoteId,
      });
  },

  challengePhotoQueuedToDelete (deleteChallengePhoto = true) {
    Dispatcher.dispatch({ type: 'challengePhotoQueuedToDelete', payload: deleteChallengePhoto });
  },

  challengePhotoQueuedToSave (challengePhotoFromFileReader) {
    Dispatcher.dispatch({ type: 'challengePhotoQueuedToSave', payload: challengePhotoFromFileReader });
  },

  challengePhotoSave (challengeWeVoteId, challengePhotoFromFileReader) {
    Dispatcher.loadEndpoint('challengeStartSave',
      {
        challenge_photo_from_file_reader: challengePhotoFromFileReader,
        challenge_photo_changed: true,
        challenge_we_vote_id: challengeWeVoteId,
      });
  },

  challengePoliticianDeleteAddQueuedToSave (challengePoliticianId) {
    Dispatcher.dispatch({ type: 'challengePoliticianDeleteAddQueuedToSave', payload: challengePoliticianId });
  },

  challengePoliticianDeleteRemoveQueuedToSave (challengePoliticianId) {
    Dispatcher.dispatch({ type: 'challengePoliticianDeleteRemoveQueuedToSave', payload: challengePoliticianId });
  },

  challengePoliticianStarterListQueuedToSave (challengePoliticianStarterList) {
    Dispatcher.dispatch({ type: 'challengePoliticianStarterListQueuedToSave', payload: challengePoliticianStarterList });
  },

  challengePoliticianStarterListSave (challengeWeVoteId, challengePoliticianStarterListQueuedToSaveJson, challengePoliticianDeleteListJson) {
    // console.log('challengePoliticianStarterListQueuedToSaveJson: ', challengePoliticianStarterListQueuedToSaveJson);
    Dispatcher.loadEndpoint('challengeStartSave',
      {
        politician_delete_list: challengePoliticianDeleteListJson,
        politician_starter_list: challengePoliticianStarterListQueuedToSaveJson,
        politician_starter_list_changed: true,
        challenge_we_vote_id: challengeWeVoteId,
      });
  },

  challengeRetrieveAsOwner (challengeWeVoteId) {
    let { hostname } = window.location;
    hostname = hostname || '';
    Dispatcher.loadEndpoint('challengeRetrieveAsOwner',
      {
        challenge_we_vote_id: challengeWeVoteId,
        hostname,
      });
  },

  challengeTitleQueuedToSave (challengeTitle) {
    Dispatcher.dispatch({ type: 'challengeTitleQueuedToSave', payload: challengeTitle });
  },

  challengeTitleSave (challengeWeVoteId, challengeTitle) {
    console.log('challengeTitleSave: ', challengeTitle, ', challengeWeVoteId: ', challengeWeVoteId);
    Dispatcher.loadEndpoint('challengeStartSave',
      {
        challenge_title: challengeTitle,
        challenge_title_changed: true,
        challenge_we_vote_id: challengeWeVoteId,
      });
  },

  inDraftModeSave (challengeWeVoteId, inDraftMode) {
    // console.log('challengeDescriptionSave: ', challengeDescription);
    Dispatcher.loadEndpoint('challengeStartSave',
      {
        in_draft_mode: inDraftMode,
        in_draft_mode_changed: true,
        challenge_we_vote_id: challengeWeVoteId,
      });
  },
};
