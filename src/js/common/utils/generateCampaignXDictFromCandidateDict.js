
export default function generateCampaignXDictFromCandidateDict (candidateDict = {}) {
  // console.log('campaignUtils generateCampaignXDictFromCandidateDict, candidateDict:', candidateDict);
  let campaignX = {};
  const finalElectionDateInPast = false;
  if (candidateDict.constructor === Object && candidateDict.linked_campaignx_we_vote_id) {
    (campaignX = {
      // campaign_description: campaignDescription,
      campaign_title: candidateDict.ballot_item_display_name,
      campaignx_we_vote_id: candidateDict.linked_campaignx_we_vote_id,
      final_election_date_as_integer: candidateDict.candidate_ultimate_election_date,
      final_election_date_in_past: finalElectionDateInPast,
      linked_politician_we_vote_id: candidateDict.politician_we_vote_id,
      supporters_count: candidateDict.supporters_count,
      // voter_is_campaignx_owner: false,
      we_vote_hosted_campaign_photo_large_url: candidateDict.candidate_photo_url_large,
      we_vote_hosted_campaign_photo_medium_url: candidateDict.candidate_photo_url_medium,
      we_vote_hosted_campaign_photo_small_url: candidateDict.candidate_photo_url_tiny,
      we_vote_hosted_profile_image_url_large: candidateDict.candidate_photo_url_large,
    });
  }
  // console.log('generateCampaignXDictFromCandidateDict, campaignX:', campaignX);
  return campaignX;
}
