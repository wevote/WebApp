// Position related functions
import IssueStore from '../stores/IssueStore';  // eslint-disable-line import/no-cycle
import CandidateStore from '../stores/CandidateStore';  // eslint-disable-line import/no-cycle
import FriendStore from '../stores/FriendStore';  // eslint-disable-line import/no-cycle
import MeasureStore from '../stores/MeasureStore';  // eslint-disable-line import/no-cycle
import OrganizationStore from '../stores/OrganizationStore';  // eslint-disable-line import/no-cycle
import SupportStore from '../stores/SupportStore';  // eslint-disable-line import/no-cycle
import { arrayContains, stringContains } from './textFormat';

export function isOrganizationInVotersNetwork (organizationWeVoteId) {
  return OrganizationStore.isVoterFollowingThisOrganization(organizationWeVoteId) ||
    FriendStore.isVoterFriendsWithThisOrganization(organizationWeVoteId) ||
    IssueStore.isOrganizationLinkedToIssueVoterIsFollowing(organizationWeVoteId);
}

export function extractFirstEndorsementFromPositionList (positionListAsArray, limitToYes, limitToNo) {
  let onePosition = {};
  let endorsementOrganization = '';
  let endorsementText = '';
  // console.log('extractFirstEndorsementFromPositionList: ', positionListAsArray);
  for (let i = 0; i < positionListAsArray.length; i++) {
    onePosition = positionListAsArray[i];
    // console.log('onePosition.statement_text: ', onePosition.statement_text, 'limitToYes:', limitToYes, 'limitToNo:', limitToNo);
    if (onePosition && onePosition.statement_text && onePosition.statement_text.length > 2 && onePosition.speaker_type !== 'I') {
      if (limitToYes && !onePosition.is_support_or_positive_rating) {
        // ignore
      } else if (limitToNo && !onePosition.is_oppose_or_negative_rating) {
        // ignore
      } else {
        endorsementOrganization = onePosition.speaker_display_name;
        endorsementText = onePosition.statement_text;
        break;
      }
    }
  }
  // console.log('endorsementText: ', endorsementText);
  return {
    endorsementOrganization,
    endorsementText,
  };
}

export function extractNumberOfPositionsFromPositionList (positionListAsArray) {
  let onePosition = {};
  let numberOfAllSupportPositions = 0;
  let numberOfAllOpposePositions = 0;
  let numberOfAllInfoOnlyPositions = 0;
  // console.log('extractNumberOfPositionsFromPositionList: ', positionListAsArray);
  for (let i = 0; i < positionListAsArray.length; i++) {
    onePosition = positionListAsArray[i];
    if (onePosition.is_support_or_positive_rating) {
      numberOfAllSupportPositions += 1;
    } else if (onePosition.is_oppose_or_negative_rating) {
      numberOfAllOpposePositions += 1;
    } else {
      numberOfAllInfoOnlyPositions += 1;
    }
  }

  return {
    numberOfAllSupportPositions,
    numberOfAllOpposePositions,
    numberOfAllInfoOnlyPositions,
  };
}

export function extractScoreFromNetworkFromPositionList (positionListAsArray) {
  let onePosition = {};
  let numberOfSupportPositionsForScore = 0;
  let numberOfOpposePositionsForScore = 0;
  let numberOfInfoOnlyPositionsForScore = 0;
  let organizationWeVoteId = '';
  let organizationInVotersNetwork = false;
  // console.log('extractNumberOfPositionsFromPositionList: ', positionListAsArray);
  for (let i = 0; i < positionListAsArray.length; i++) {
    onePosition = positionListAsArray[i];
    organizationWeVoteId = onePosition.speaker_we_vote_id;
    organizationInVotersNetwork = isOrganizationInVotersNetwork(organizationWeVoteId);
    if (!organizationInVotersNetwork) {
      // Skip this position if the organization is not part of the organizations being followed
    } else if (onePosition.is_support_or_positive_rating) {
      numberOfSupportPositionsForScore += 1;
    } else if (onePosition.is_oppose_or_negative_rating) {
      numberOfOpposePositionsForScore += 1;
    } else {
      numberOfInfoOnlyPositionsForScore += 1;
    }
  }

  return {
    numberOfSupportPositionsForScore,
    numberOfOpposePositionsForScore,
    numberOfInfoOnlyPositionsForScore,
  };
}

// Before we try to calculate a positionListSummary, we check to see if we have certain data
export function getPositionListSummaryIncomingDataStats (ballotItemWeVoteId) {
  const isCandidate = stringContains('cand', ballotItemWeVoteId);
  const isMeasure = stringContains('meas', ballotItemWeVoteId);
  let allCachedPositionsLength = 0;
  if (isCandidate) {
    const allCachedPositions = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
    allCachedPositionsLength = allCachedPositions.length;
  } else if (isMeasure) {
    const allCachedPositions = MeasureStore.getAllCachedPositionsByMeasureWeVoteId(ballotItemWeVoteId);
    allCachedPositionsLength = allCachedPositions.length;
  }
  const allIssuesVoterIsFollowingLength = IssueStore.getIssuesVoterIsFollowingLength();
  const currentFriendsOrganizationWeVoteIdsLength = FriendStore.getCurrentFriendsOrganizationWeVoteIdsLength();
  const issueWeVoteIdsLinkedToByOrganizationDictLength = IssueStore.getIssueWeVoteIdsLinkedToByOrganizationDictLength();
  const organizationWeVoteIdsVoterIsFollowingLength = OrganizationStore.getOrganizationWeVoteIdsVoterIsFollowingLength();
  const voterOpposesListLength = SupportStore.getVoterOpposesListLength();
  const voterSupportsListLength = SupportStore.getVoterSupportsListLength();

  return {
    allCachedPositionsLength,
    allIssuesVoterIsFollowingLength,
    currentFriendsOrganizationWeVoteIdsLength,
    issueWeVoteIdsLinkedToByOrganizationDictLength,
    organizationWeVoteIdsVoterIsFollowingLength,
    voterOpposesListLength,
    voterSupportsListLength,
  };
}

export function getPositionSummaryListForBallotItem (ballotItemWeVoteId, limitToThisIssue = '', showPositionsInVotersNetwork = false, showPositionsOutOfVotersNetwork = false) {
  // If limitToThisIssue is true, ignore showPositionsInVotersNetwork and showPositionsOutOfVotersNetwork
  const positionSummaryList = [];
  let allCachedPositions = [];
  let allCachedPositionsLength = 0;
  let organizationName = '';
  let organizationOpposes = false;
  let organizationSupports = false;
  let organizationWeVoteId = '';
  let skipThisOrganization = false;
  let speakerType = '';
  let issuesInCommonBetweenOrganizationAndVoter = [];
  let voterCanFollowOrganization = false;
  let positionSummary = {};
  let voterIsFollowingOrganization = false;
  let voterIsFriendsWithThisOrganization = false;
  let organizationInVotersNetwork = false;
  let organizationWeVoteIdsLinkedToThisIssue = [];
  if (limitToThisIssue) {
    organizationWeVoteIdsLinkedToThisIssue = IssueStore.getOrganizationWeVoteIdsLinkedToOneIssue(limitToThisIssue);
  }
  const isCandidate = stringContains('cand', ballotItemWeVoteId);
  const isMeasure = stringContains('meas', ballotItemWeVoteId);
  if (isCandidate) {
    allCachedPositions = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
    allCachedPositionsLength = allCachedPositions.length;
  } else if (isMeasure) {
    allCachedPositions = MeasureStore.getAllCachedPositionsByMeasureWeVoteId(ballotItemWeVoteId);
    allCachedPositionsLength = allCachedPositions.length;
  } else {
    return [];
  }
  // console.log('getPositionSummaryListForBallotItem allCachedPositions: ', allCachedPositions);
  // console.log('organizationWeVoteIdsLinkedToThisIssue: ', organizationWeVoteIdsLinkedToThisIssue);
  // console.log('showPositionsInVotersNetwork: ', showPositionsInVotersNetwork);
  // console.log('showPositionsOutOfVotersNetwork: ', showPositionsOutOfVotersNetwork);
  for (let i = 0; i < allCachedPositionsLength; i++) {
    // Cycle through the positions for this candidate, and see if the organization endorsing is linked to this issue
    organizationInVotersNetwork = false;
    skipThisOrganization = false;
    issuesInCommonBetweenOrganizationAndVoter = [];
    voterIsFollowingOrganization = false;
    voterCanFollowOrganization = false;
    voterIsFriendsWithThisOrganization = false;
    organizationWeVoteId = allCachedPositions[i].speaker_we_vote_id;
    // if (showPositionsInVotersNetwork) {
    //   console.log('organizationWeVoteId:', organizationWeVoteId);
    // }
    if (limitToThisIssue && !arrayContains(organizationWeVoteId, organizationWeVoteIdsLinkedToThisIssue)) {
      // We want to limit to one issue, and this organization is not linked to this issue, so skip
      // console.log('getPositionSummaryListForBallotItem skipThisOrganization limitToThisIssue:', limitToThisIssue);
      skipThisOrganization = true;
    }
    if (!skipThisOrganization || showPositionsInVotersNetwork || showPositionsOutOfVotersNetwork) {
      organizationInVotersNetwork = isOrganizationInVotersNetwork(organizationWeVoteId);
      voterIsFollowingOrganization = OrganizationStore.isVoterFollowingThisOrganization(organizationWeVoteId);
      voterCanFollowOrganization = !voterIsFollowingOrganization && !limitToThisIssue;  // Only let voter follow if not looking at Issues
      voterIsFriendsWithThisOrganization = FriendStore.isVoterFriendsWithThisOrganization(organizationWeVoteId);
    }
    if (showPositionsInVotersNetwork || showPositionsOutOfVotersNetwork) {
      // console.log('organizationInVotersNetwork:', organizationInVotersNetwork);
      if (showPositionsInVotersNetwork) {
        // Skip if NOT in voter's network
        if (!organizationInVotersNetwork) {
          // console.log('getPositionSummaryListForBallotItem skipThisOrganization showPositionsInVotersNetwork');
          skipThisOrganization = true;
        } else {
          // console.log('SHOW ONE');
        }
      }
      if (showPositionsOutOfVotersNetwork) {
        // Skip if IN voter's network
        if (organizationInVotersNetwork) {
          // console.log('getPositionSummaryListForBallotItem showPositionsOutOfVotersNetwork: ', showPositionsOutOfVotersNetwork, ', organizationInVotersNetwork:', organizationInVotersNetwork);
          skipThisOrganization = true;
        } else {
          // console.log('SHOW TWO');
        }
      }
    }
    if (allCachedPositions[i].speaker_display_name && stringContains('Voter-', allCachedPositions[i].speaker_display_name)) {
      skipThisOrganization = true;
    }
    if (!skipThisOrganization) {
      organizationName = allCachedPositions[i].speaker_display_name;
      organizationOpposes = allCachedPositions[i].is_oppose_or_negative_rating;
      organizationSupports = allCachedPositions[i].is_support_or_positive_rating;
      speakerType = allCachedPositions[i].speaker_type;
      issuesInCommonBetweenOrganizationAndVoter = IssueStore.getIssuesInCommonBetweenOrganizationAndVoter(organizationWeVoteId);
      if (organizationSupports || organizationOpposes) {
        positionSummary = {
          ballotItemWeVoteId,
          organizationInVotersNetwork,
          organizationName,
          organizationOpposes,
          organizationSupports,
          organizationWeVoteId,
          positionObject: allCachedPositions[i],
          speakerType,
          issuesInCommonBetweenOrganizationAndVoter,
          voterCanFollowOrganization,
          voterIsFollowingOrganization,
          voterIsFriendsWithThisOrganization,
        };
        positionSummaryList.push(positionSummary);
      }
    }
  }
  // console.log('getPositionSummaryListForBallotItem positionSummaryList: ', positionSummaryList);
  return positionSummaryList;
}

export function sortCandidateList (newCandidateList) {
  let sortedCandidateList = {};
  const unsortedCandidateList = newCandidateList ? newCandidateList.slice(0) : {};
  const unsortedCandidateListModified = [];
  let ballotItemStatSheet;
  let candidateModified;
  let numberOfOpposePositionsForScore = 0;
  let numberOfSupportPositionsForScore = 0;
  let voterSupportsBallotItem;

  // Prepare an array of candidate names that are supported by voter
  unsortedCandidateList.forEach((candidate) => {
    ballotItemStatSheet = SupportStore.getBallotItemStatSheet(candidate.we_vote_id);
    // console.log('ballotItemStatSheet:', ballotItemStatSheet);
    if (ballotItemStatSheet) {
      ({ numberOfOpposePositionsForScore, numberOfSupportPositionsForScore, voterSupportsBallotItem } = ballotItemStatSheet);
      // voterIssuesScoreForCandidate = IssueStore.getIssuesScoreByBallotItemWeVoteId(candidate.we_vote_id);
      candidateModified = { ...candidate };
      candidateModified.voterNetworkScoreForCandidate = Math.abs(numberOfSupportPositionsForScore - numberOfOpposePositionsForScore);
      candidateModified.voterSupportsBallotItem = voterSupportsBallotItem;
      // console.log('candidateModified:', candidateModified);
      unsortedCandidateListModified.push(candidateModified);
    } else {
      unsortedCandidateListModified.push(candidate);
    }
  });

  sortedCandidateList = unsortedCandidateListModified;
  // Start by ordering by twitter_followers_count
  sortedCandidateList.sort((optionA, optionB) => optionB.twitter_followers_count - optionA.twitter_followers_count);
  // Move candidates with the highest personal score to the top of the list
  sortedCandidateList.sort((optionA, optionB) => optionB.voterNetworkScoreForCandidate - optionA.voterNetworkScoreForCandidate);
  // Move candidates supported by the voter to the top of list
  sortedCandidateList.sort((optionA, optionB) => (optionB.voterSupportsBallotItem ? 1 : 0) - (optionA.voterSupportsBallotItem ? 1 : 0));
  // Move withdrawn candidates to the bottom of list
  sortedCandidateList.sort((optionA, optionB) => (optionB.withdrawn_from_election ? 0 : 1) - (optionA.withdrawn_from_election ? 0 : 1));
  // console.log('sortedCandidateList:', sortedCandidateList);
  return sortedCandidateList;
}
