import CampaignSupporterActions from '../actions/CampaignSupporterActions';
import CampaignSupporterStore from '../stores/CampaignSupporterStore';
import historyPush from './historyPush';
import initializejQuery from './initializejQuery';

function goToNextPage (campaignXBasePath) {
  const pathToUseWhenProfileComplete = `${campaignXBasePath}why-do-you-support`;
  console.log('goToNextPage pathToUseWhenProfileComplete: ', pathToUseWhenProfileComplete);
  setTimeout(() => {
    historyPush(pathToUseWhenProfileComplete);
  }, 500);
  return null;
}

export default function saveCampaignSupportAndGoToNextPage (campaignXWeVoteId = '', campaignXBasePath = '') {
  if (!campaignXWeVoteId) {
    console.log('saveCampaignSupportAndGoToNextPage MISSING campaignXWeVoteId');
    return null;
  }
  let visibleToPublic = CampaignSupporterStore.getVisibleToPublic(campaignXWeVoteId);
  const visibleToPublicChanged = CampaignSupporterStore.getVisibleToPublicQueuedToSaveSet();
  if (visibleToPublicChanged) {
    // If it has changed, use new value
    visibleToPublic = CampaignSupporterStore.getVisibleToPublicQueuedToSave();
  }
  console.log('saveCampaignSupportAndGoToNextPage, campaignXBasePath: ', campaignXBasePath, ', visibleToPublic: ', visibleToPublic);
  const campaignSupported = true;
  const campaignSupportedChanged = true;
  const saveVisibleToPublic = true;
  if (campaignXBasePath) {
    initializejQuery(() => {
      CampaignSupporterActions.supportCampaignSave(campaignXWeVoteId, campaignSupported, campaignSupportedChanged, visibleToPublic, saveVisibleToPublic); // campaignSupporterSave
    }, goToNextPage(campaignXBasePath));
  } else {
    // If we don't have a campaignXBasePath, do not redirect
    initializejQuery(() => {
      CampaignSupporterActions.supportCampaignSave(campaignXWeVoteId, campaignSupported, campaignSupportedChanged, visibleToPublic, saveVisibleToPublic); // campaignSupporterSave
    });
  }
  return null;
}
