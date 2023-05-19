import CampaignSupporterActions from '../actions/CampaignSupporterActions';
import CampaignSupporterStore from '../stores/CampaignSupporterStore';
import historyPush from './historyPush';
import initializejQuery from './initializejQuery';

function goToNextPage (campaignXBaseBath) {
  const pathToUseWhenProfileComplete = `${campaignXBaseBath}/why-do-you-support`;
  console.log('goToNextPage pathToUseWhenProfileComplete: ', pathToUseWhenProfileComplete);
  setTimeout(() => {
    historyPush(pathToUseWhenProfileComplete);
  }, 500);
  return null;
}

export default function saveCampaignSupportAndGoToNextPage (campaignXWeVoteId = '', campaignXBaseBath = '') {
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
  console.log('saveCampaignSupportAndGoToNextPage visibleToPublic: ', visibleToPublic);
  const campaignSupported = true;
  const campaignSupportedChanged = true;
  const saveVisibleToPublic = true;
  initializejQuery(() => {
    CampaignSupporterActions.supportCampaignSave(campaignXWeVoteId, campaignSupported, campaignSupportedChanged, visibleToPublic, saveVisibleToPublic); // campaignSupporterSave
  }, goToNextPage(campaignXBaseBath));
  return null;
}
