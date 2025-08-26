import CampaignStore from '../stores/CampaignStore';
import VoterStore from '../../stores/VoterStore';
import PoliticianStore from '../stores/PoliticianStore';
import arrayContains from './arrayContains';

export default function voterCanEditPolitician (politicianWeVoteId, campaignXWeVoteId) {
  const publicEmailsFromPolitician = PoliticianStore.getPoliticianAllEmails(politicianWeVoteId);
  const voterVerifiedEmailAddressList = VoterStore.getEmailAddressesVerifiedList(); // ['test3@wevote.info']; // [];
  // console.log('voterCanEditPolitician voterVerifiedEmailAddressList:', voterVerifiedEmailAddressList);
  const hasMatchingEmail = voterVerifiedEmailAddressList.some((voterEmail) => publicEmailsFromPolitician.some((politicianEmail) => voterEmail.toLowerCase() === politicianEmail.toLowerCase()));
  if (hasMatchingEmail) {
    return true;
  }
  const voterOrganizationWeVoteId = VoterStore.getLinkedOrganizationWeVoteId();
  if (campaignXWeVoteId) {
    const campaignXStaffOrganizationWeVoteIds = CampaignStore.getAllStaffOrganizationWeVoteIds(campaignXWeVoteId);
    // console.log('Header campaignXStaffOrganizationWeVoteIds:', campaignXStaffOrganizationWeVoteIds);
    if (arrayContains(voterOrganizationWeVoteId, campaignXStaffOrganizationWeVoteIds, false)) {
      return true;
    }
  }
  return false;
}
