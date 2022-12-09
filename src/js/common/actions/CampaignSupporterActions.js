import Dispatcher from '../dispatcher/Dispatcher';

export default {
  campaignSupporterRetrieve (campaignXWeVoteId) {
    Dispatcher.loadEndpoint('campaignSupporterRetrieve',
      {
        campaignx_we_vote_id: campaignXWeVoteId,
      });
  },

  supportCampaignSave (campaignXWeVoteId, campaignSupported, campaignSupportedChanged, visibleToPublic, visibleToPublicChanged) {
    // console.log('supportCampaignSave');
    Dispatcher.loadEndpoint('campaignSupporterSave',
      {
        campaign_supported: campaignSupported,
        campaign_supported_changed: campaignSupportedChanged,
        campaignx_we_vote_id: campaignXWeVoteId,
        visible_to_public: visibleToPublic,
        visible_to_public_changed: visibleToPublicChanged,
      });
  },

  shareButtonClicked (value) {
    Dispatcher.dispatch({ type: 'shareButtonClicked', payload: value });
  },

  supporterEndorsementQueuedToSave (supporterEndorsement) {
    Dispatcher.dispatch({ type: 'supporterEndorsementQueuedToSave', payload: supporterEndorsement });
  },

  visibleToPublicQueuedToSave (visibleToPublic) {
    Dispatcher.dispatch({ type: 'visibleToPublicQueuedToSave', payload: visibleToPublic });
  },

  supporterEndorsementSave (campaignWeVoteId, supporterEndorsement, visibleToPublic, visibleToPublicChanged) {
    // console.log('supporterEndorsementSave: ', supporterEndorsement);
    Dispatcher.loadEndpoint('campaignSupporterSave',
      {
        campaignx_we_vote_id: campaignWeVoteId,
        supporter_endorsement: supporterEndorsement,
        supporter_endorsement_changed: true,
        visible_to_public: visibleToPublic,
        visible_to_public_changed: visibleToPublicChanged,
      });
  },
};
