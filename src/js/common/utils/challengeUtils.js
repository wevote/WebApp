import ChallengeActions from '../actions/ChallengeActions';
import ChallengeStore from '../stores/ChallengeStore';
import VoterStore from '../../stores/VoterStore';
import initializejQuery from './initializejQuery';


export function getChallengeValuesFromIdentifiers (challengeSEOFriendlyPath, challengeWeVoteId) {
  // console.log('getChallengeValuesFromIdentifiers challengeSEOFriendlyPath: ', challengeSEOFriendlyPath, ', challengeWeVoteId: ', challengeWeVoteId);
  let challenge = {};
  let challengeDescription = '';
  let challengeInviteTextDefault = '';
  let challengePhotoLargeUrl = '';
  let challengePhotoMediumUrl = '';
  let challengePhotoSmallUrl = '';
  let challengeTitle = '';
  let challengeSEOFriendlyPathFromObject = '';
  let challengeWeVoteIdFromObject = '';
  let challengePoliticianList = [];
  let finalElectionDateInPast = false;
  let isBlockedByWeVote = false;
  let isBlockedByWeVoteReason = '';
  let isSupportersCountMinimumExceeded = false;
  let linkedPoliticianWeVoteId = '';
  let voterIsChallengeOwner = false;
  let weVoteHostedProfileImageUrlLarge = '';
  if (challengeSEOFriendlyPath) {
    challenge = ChallengeStore.getChallengeBySEOFriendlyPath(challengeSEOFriendlyPath);
  } else if (challengeWeVoteId) {
    challenge = ChallengeStore.getChallengeByWeVoteId(challengeWeVoteId);
    ({ seo_friendly_path: challengeSEOFriendlyPathFromObject } = challenge);
  }
  if (challenge.constructor === Object && challenge.challenge_we_vote_id) {
    ({
      challenge_description: challengeDescription,
      challenge_invite_text_default: challengeInviteTextDefault,
      challenge_title: challengeTitle,
      challenge_we_vote_id: challengeWeVoteIdFromObject,
      final_election_date_in_past: finalElectionDateInPast,
      is_blocked_by_we_vote: isBlockedByWeVote,
      is_blocked_by_we_vote_reason: isBlockedByWeVoteReason,
      is_supporters_count_minimum_exceeded: isSupportersCountMinimumExceeded,
      linked_politician_we_vote_id: linkedPoliticianWeVoteId,
      voter_is_challenge_owner: voterIsChallengeOwner,
      we_vote_hosted_challenge_photo_large_url: challengePhotoLargeUrl,
      we_vote_hosted_challenge_photo_medium_url: challengePhotoMediumUrl,
      we_vote_hosted_challenge_photo_small_url: challengePhotoSmallUrl,
      we_vote_hosted_profile_image_url_large: weVoteHostedProfileImageUrlLarge,
    } = challenge);
    // console.log('getChallengeValuesFromIdentifiers, challenge:', challenge);
    challengePoliticianList = ChallengeStore.getChallengePoliticianList(challengeWeVoteIdFromObject);
  }
  // console.log('getChallengeValuesFromIdentifiers, challenge: ', challenge, ', challengeWeVoteIdFromObject:', challengeWeVoteIdFromObject, ', challengeTitle:', challengeTitle);
  return {
    challengeDescription,
    challengeInviteTextDefault,
    challengePhotoLargeUrl,
    challengePhotoMediumUrl,
    challengePhotoSmallUrl,
    challengeSEOFriendlyPath: challengeSEOFriendlyPathFromObject,
    challengeTitle,
    challengePoliticianList,
    challengeWeVoteId: challengeWeVoteIdFromObject,
    finalElectionDateInPast,
    isBlockedByWeVote,
    isBlockedByWeVoteReason,
    isSupportersCountMinimumExceeded,
    linkedPoliticianWeVoteId,
    voterIsChallengeOwner,
    weVoteHostedProfileImageUrlLarge,
  };
}

export function retrieveChallengeFromIdentifiers (challengeSEOFriendlyPath, challengeWeVoteId, retrieveAsOwner) {
  // console.log('retrieveChallengeFromIdentifiersIfNeeded challengeSEOFriendlyPath: ', challengeSEOFriendlyPath, ', challengeWeVoteId: ', challengeWeVoteId);
  if (challengeSEOFriendlyPath) {
    if (retrieveAsOwner) {
      initializejQuery(() => {
        ChallengeActions.challengeRetrieveBySEOFriendlyPathAsOwner(challengeSEOFriendlyPath);
      });
    } else {
      initializejQuery(() => {
        ChallengeActions.challengeRetrieveBySEOFriendlyPath(challengeSEOFriendlyPath);
      });
    }
    return false;
  } else if (challengeWeVoteId) {
    if (retrieveAsOwner) {
      initializejQuery(() => {
        ChallengeActions.challengeRetrieveAsOwner(challengeWeVoteId);
      });
    } else {
      initializejQuery(() => {
        ChallengeActions.challengeRetrieve(challengeWeVoteId);
      });
    }
    return true;
  } else {
    return false;
  }
}

export function retrieveChallengeFromIdentifiersIfNeeded (challengeSEOFriendlyPath, challengeWeVoteId) {
  // console.log('retrieveChallengeFromIdentifiersIfNeeded challengeSEOFriendlyPath: ', challengeSEOFriendlyPath, ', challengeWeVoteId: ', challengeWeVoteId);
  let challenge = {};
  let mustRetrieveChallenge = false;
  const voter = VoterStore.getVoter();
  if (!('we_vote_id' in voter) || voter.we_vote_id.length < 0) {
    // Calling challengeRetrieve before we have a voter, is useless
    // return false;
    // DALE 2024-08-31 I don't think this is true any more
  }

  // console.log('retrieveChallengeFromIdentifiersIfNeeded voter:', voter);
  if (challengeSEOFriendlyPath) {
    challenge = ChallengeStore.getChallengeBySEOFriendlyPath(challengeSEOFriendlyPath);
    // console.log('retrieveChallengeFromIdentifiersIfNeeded challenge:', challenge);
    if (challenge.constructor === Object) {
      if (!challenge.challenge_we_vote_id) {
        mustRetrieveChallenge = true;
      }
    } else {
      mustRetrieveChallenge = true;
    }
    // console.log('retrieveChallengeFromIdentifiersIfNeeded mustRetrieveChallenge:', mustRetrieveChallenge, ', challengeSEOFriendlyPath:', challengeSEOFriendlyPath);
    if (mustRetrieveChallenge) {
      initializejQuery(() => {
        ChallengeActions.challengeRetrieveBySEOFriendlyPath(challengeSEOFriendlyPath);
      });
    }
  } else if (challengeWeVoteId) {
    challenge = ChallengeStore.getChallengeByWeVoteId(challengeWeVoteId);
    if (challenge.constructor === Object) {
      if (!challenge.challenge_we_vote_id) {
        mustRetrieveChallenge = true;
      }
    } else {
      mustRetrieveChallenge = true;
    }
    // console.log('retrieveChallengeFromIdentifiersIfNeeded mustRetrieveChallenge:', mustRetrieveChallenge, ', challengeWeVoteId:', challengeWeVoteId);
    if (mustRetrieveChallenge) {
      initializejQuery(() => {
        ChallengeActions.challengeRetrieve(challengeWeVoteId);
      });
    }
  }
  return true;
}

export function retrieveChallengeFromIdentifiersIfNotAlreadyRetrieved (challengeSEOFriendlyPath, challengeWeVoteId) {
  if (
    (challengeSEOFriendlyPath && ChallengeStore.getChallengeBySEOFriendlyPath() !== {}) &&
    (challengeWeVoteId && ChallengeStore.getChallengeByWeVoteId(challengeWeVoteId) !== {})
  ) {
    return false;
  }
  return retrieveChallengeFromIdentifiersIfNeeded(challengeSEOFriendlyPath, challengeWeVoteId);
}
