import Dispatcher from '../dispatcher/Dispatcher';

export default {
  campaignDescriptionQueuedToSave (campaignDescription) {
    Dispatcher.dispatch({ type: 'campaignDescriptionQueuedToSave', payload: campaignDescription });
  },

  campaignDescriptionSave (campaignWeVoteId, campaignDescription) {
    // console.log('campaignDescriptionSave: ', campaignDescription);
    Dispatcher.loadEndpoint('campaignStartSave',
      {
        campaign_description: campaignDescription,
        campaign_description_changed: true,
        campaignx_we_vote_id: campaignWeVoteId,
      });
  },

  campaignEditAllReset () {
    Dispatcher.dispatch({ type: 'campaignEditAllReset', payload: true });
  },

  campaignEditAllSave (
    campaignXWeVoteId,
    campaignDescriptionQueuedToSave, campaignDescriptionQueuedToSaveSet,
    campaignPhotoQueuedToDelete, campaignPhotoQueuedToDeleteSet,
    campaignPhotoQueuedToSave, campaignPhotoQueuedToSaveSet,
    campaignPoliticianDeleteListJson,
    campaignPoliticianStarterListQueuedToSave, campaignPoliticianStarterListQueuedToSaveSet,
    campaignTitleQueuedToSave, campaignTitleQueuedToSaveSet,
  ) {
    Dispatcher.loadEndpoint('campaignStartSave',
      {
        campaign_description: campaignDescriptionQueuedToSave,
        campaign_description_changed: campaignDescriptionQueuedToSaveSet,
        campaign_photo_from_file_reader: campaignPhotoQueuedToSave,
        campaign_photo_changed: campaignPhotoQueuedToSaveSet,
        campaign_photo_delete: campaignPhotoQueuedToDelete,
        campaign_photo_delete_changed: campaignPhotoQueuedToDeleteSet,
        campaign_title: campaignTitleQueuedToSave,
        campaign_title_changed: campaignTitleQueuedToSaveSet,
        campaignx_we_vote_id: campaignXWeVoteId,
        politician_delete_list: campaignPoliticianDeleteListJson,
        politician_starter_list: campaignPoliticianStarterListQueuedToSave,
        politician_starter_list_changed: campaignPoliticianStarterListQueuedToSaveSet,
      });
  },

  campaignPhotoQueuedToDelete (deleteCampaignPhoto = true) {
    Dispatcher.dispatch({ type: 'campaignPhotoQueuedToDelete', payload: deleteCampaignPhoto });
  },

  campaignPhotoQueuedToSave (campaignPhotoFromFileReader) {
    Dispatcher.dispatch({ type: 'campaignPhotoQueuedToSave', payload: campaignPhotoFromFileReader });
  },

  campaignPhotoSave (campaignWeVoteId, campaignPhotoFromFileReader) {
    Dispatcher.loadEndpoint('campaignStartSave',
      {
        campaign_photo_from_file_reader: campaignPhotoFromFileReader,
        campaign_photo_changed: true,
        campaignx_we_vote_id: campaignWeVoteId,
      });
  },

  campaignPoliticianDeleteAddQueuedToSave (campaignXPoliticianId) {
    Dispatcher.dispatch({ type: 'campaignPoliticianDeleteAddQueuedToSave', payload: campaignXPoliticianId });
  },

  campaignPoliticianDeleteRemoveQueuedToSave (campaignXPoliticianId) {
    Dispatcher.dispatch({ type: 'campaignPoliticianDeleteRemoveQueuedToSave', payload: campaignXPoliticianId });
  },

  campaignPoliticianStarterListQueuedToSave (campaignPoliticianStarterList) {
    Dispatcher.dispatch({ type: 'campaignPoliticianStarterListQueuedToSave', payload: campaignPoliticianStarterList });
  },

  campaignPoliticianStarterListSave (campaignWeVoteId, campaignPoliticianStarterListQueuedToSaveJson, campaignPoliticianDeleteListJson) {
    // console.log('campaignPoliticianStarterListQueuedToSaveJson: ', campaignPoliticianStarterListQueuedToSaveJson);
    Dispatcher.loadEndpoint('campaignStartSave',
      {
        politician_delete_list: campaignPoliticianDeleteListJson,
        politician_starter_list: campaignPoliticianStarterListQueuedToSaveJson,
        politician_starter_list_changed: true,
        campaignx_we_vote_id: campaignWeVoteId,
      });
  },

  campaignRetrieveAsOwner (campaignWeVoteId) {
    let { hostname } = window.location;
    hostname = hostname || '';
    Dispatcher.loadEndpoint('campaignRetrieveAsOwner',
      {
        campaignx_we_vote_id: campaignWeVoteId,
        hostname,
      });
  },

  campaignTitleQueuedToSave (campaignTitle) {
    Dispatcher.dispatch({ type: 'campaignTitleQueuedToSave', payload: campaignTitle });
  },

  campaignTitleSave (campaignWeVoteId, campaignTitle) {
    // console.log('campaignTitleSave: ', campaignTitle);
    Dispatcher.loadEndpoint('campaignStartSave',
      {
        campaign_title: campaignTitle,
        campaign_title_changed: true,
        campaignx_we_vote_id: campaignWeVoteId,
      });
  },

  inDraftModeSave (campaignWeVoteId, inDraftMode) {
    // console.log('campaignDescriptionSave: ', campaignDescription);
    Dispatcher.loadEndpoint('campaignStartSave',
      {
        in_draft_mode: inDraftMode,
        in_draft_mode_changed: true,
        campaignx_we_vote_id: campaignWeVoteId,
      });
  },
};
