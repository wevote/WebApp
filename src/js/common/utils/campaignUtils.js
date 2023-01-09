import CampaignActions from '../actions/CampaignActions';
import CampaignStore from '../stores/CampaignStore';
import VoterStore from '../../stores/VoterStore';
import initializejQuery from './initializejQuery';

export function getCampaignXValuesFromIdentifiers (campaignSEOFriendlyPath, campaignXWeVoteId) {
  // console.log('getCampaignXValuesFromIdentifiers campaignSEOFriendlyPath: ', campaignSEOFriendlyPath, ', campaignXWeVoteId: ', campaignXWeVoteId);
  let campaignX = {};
  let campaignDescription = '';
  let campaignPhotoLargeUrl = '';
  let campaignPhotoMediumUrl = '';
  let campaignPhotoSmallUrl = '';
  let campaignTitle = '';
  let campaignSEOFriendlyPathFromObject = '';
  let campaignXWeVoteIdFromObject = '';
  let campaignXPoliticianList = [];
  let finalElectionDateInPast = false;
  let isBlockedByWeVote = false;
  let isBlockedByWeVoteReason = '';
  let isSupportersCountMinimumExceeded = false;
  let voterIsCampaignXOwner = false;
  if (campaignSEOFriendlyPath) {
    campaignX = CampaignStore.getCampaignXBySEOFriendlyPath(campaignSEOFriendlyPath);
  } else if (campaignXWeVoteId) {
    campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
    ({ seo_friendly_path: campaignSEOFriendlyPathFromObject } = campaignX);
  }
  if (campaignX.constructor === Object && campaignX.campaignx_we_vote_id) {
    ({
      campaign_description: campaignDescription,
      campaign_title: campaignTitle,
      campaignx_we_vote_id: campaignXWeVoteIdFromObject,
      final_election_date_in_past: finalElectionDateInPast,
      is_blocked_by_we_vote: isBlockedByWeVote,
      is_blocked_by_we_vote_reason: isBlockedByWeVoteReason,
      is_supporters_count_minimum_exceeded: isSupportersCountMinimumExceeded,
      voter_is_campaignx_owner: voterIsCampaignXOwner,
      we_vote_hosted_campaign_photo_large_url: campaignPhotoLargeUrl,
      we_vote_hosted_campaign_photo_medium_url: campaignPhotoMediumUrl,
      we_vote_hosted_campaign_photo_small_url: campaignPhotoSmallUrl,
    } = campaignX);
    campaignXPoliticianList = CampaignStore.getCampaignXPoliticianList(campaignXWeVoteIdFromObject);
  }
  return {
    campaignDescription,
    campaignPhotoLargeUrl,
    campaignPhotoMediumUrl,
    campaignPhotoSmallUrl,
    campaignSEOFriendlyPath: campaignSEOFriendlyPathFromObject,
    campaignTitle,
    campaignXPoliticianList,
    campaignXWeVoteId: campaignXWeVoteIdFromObject,
    finalElectionDateInPast,
    isBlockedByWeVote,
    isBlockedByWeVoteReason,
    isSupportersCountMinimumExceeded,
    voterIsCampaignXOwner,
  };
}

export function retrieveCampaignXFromIdentifiers (campaignSEOFriendlyPath, campaignXWeVoteId) {
  // console.log('retrieveCampaignXFromIdentifiersIfNeeded campaignSEOFriendlyPath: ', campaignSEOFriendlyPath, ', campaignXWeVoteId: ', campaignXWeVoteId);
  if (campaignSEOFriendlyPath) {
    initializejQuery(() => {
      CampaignActions.campaignRetrieveBySEOFriendlyPath(campaignSEOFriendlyPath);
    });
    return false;
  } else if (campaignXWeVoteId) {
    initializejQuery(() => {
      CampaignActions.campaignRetrieve(campaignXWeVoteId);
    });
    return true;
  } else {
    return false;
  }
}

export function retrieveCampaignXFromIdentifiersIfNeeded (campaignSEOFriendlyPath, campaignXWeVoteId) {
  // console.log('retrieveCampaignXFromIdentifiersIfNeeded campaignSEOFriendlyPath: ', campaignSEOFriendlyPath, ', campaignXWeVoteId: ', campaignXWeVoteId);
  let campaignX = {};
  let mustRetrieveCampaign = false;
  const voter = VoterStore.getVoter();
  if (!('we_vote_id' in voter) || voter.we_vote_id.length < 0) {
    // Calling campaignRetrieve before we have a voter, is useless
    return false;
  }

  // console.log('retrieveCampaignXFromIdentifiersIfNeeded voter:', voter);
  if (campaignSEOFriendlyPath) {
    campaignX = CampaignStore.getCampaignXBySEOFriendlyPath(campaignSEOFriendlyPath);
    // console.log('retrieveCampaignXFromIdentifiersIfNeeded campaignX:', campaignX);
    if (campaignX.constructor === Object) {
      if (!campaignX.campaignx_we_vote_id) {
        mustRetrieveCampaign = true;
      }
    } else {
      mustRetrieveCampaign = true;
    }
    // console.log('retrieveCampaignXFromIdentifiersIfNeeded mustRetrieveCampaign:', mustRetrieveCampaign, ', campaignSEOFriendlyPath:', campaignSEOFriendlyPath);
    if (mustRetrieveCampaign) {
      initializejQuery(() => {
        CampaignActions.campaignRetrieveBySEOFriendlyPath(campaignSEOFriendlyPath);
      });
    }
  } else if (campaignXWeVoteId) {
    campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
    if (campaignX.constructor === Object) {
      if (!campaignX.campaignx_we_vote_id) {
        mustRetrieveCampaign = true;
      }
    } else {
      mustRetrieveCampaign = true;
    }
    // console.log('retrieveCampaignXFromIdentifiersIfNeeded mustRetrieveCampaign:', mustRetrieveCampaign, ', campaignXWeVoteId:', campaignXWeVoteId);
    if (mustRetrieveCampaign) {
      initializejQuery(() => {
        CampaignActions.campaignRetrieve(campaignXWeVoteId);
      });
    }
  }
  return true;
}

export function retrieveCampaignXFromIdentifiersIfNotAlreadyRetrieved (campaignSEOFriendlyPath, campaignXWeVoteId) {
  if (
    (campaignSEOFriendlyPath && CampaignStore.getCampaignXBySEOFriendlyPath() !== {}) &&
    (campaignXWeVoteId && CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId) !== {})
  ) {
    return false;
  }
  return retrieveCampaignXFromIdentifiersIfNeeded(campaignSEOFriendlyPath, campaignXWeVoteId);
}


