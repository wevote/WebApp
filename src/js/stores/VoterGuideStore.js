import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/Dispatcher';
import OrganizationActions from '../actions/OrganizationActions';
import OrganizationStore from './OrganizationStore';  // eslint-disable-line import/no-cycle
import SupportActions from '../actions/SupportActions';
import VoterGuideActions from '../actions/VoterGuideActions';
import VoterStore from './VoterStore';  // eslint-disable-line import/no-cycle
import { arrayContains, convertToInteger } from '../utils/textFormat';
import { isSpeakerTypeOrganization, isSpeakerTypePublicFigure } from '../utils/organization-functions';
import convertVoterGuideToElection from '../utils/voterGuideFunctions';

class VoterGuideStore extends ReduceStore {
  // The store keeps nested attributes of voter guides in allCachedVoterGuides, whereas the followed, ignoring, to_follow are just lists of ids.
  getInitialState () {
    return {
      allCachedVoterGuides: {}, // Dictionary with organization_we_vote_id as key and the voter_guide as value
      allCachedVoterGuidesByElection: {}, // Dictionary with organization_we_vote_id and google_civic_election_id as keys and the voter_guide as value
      allCachedVoterGuidesByOrganization: {}, // Dictionary with organization_we_vote_id as key and list of ALL voter_guides (regardless of election) as value
      allCachedVoterGuidesByVoterGuide: {}, // Dictionary with voterGuideWeVoteId as key and voter_guides as value
      ballotHasGuides: true,
      organizationWeVoteIdsByIssueWeVoteId: {}, // This is a dictionary with issue_we_vote_id as key and list of organization_we_vote_id's as value
      organizationWeVoteIdsToFollowAll: [],
      organizationWeVoteIdsToFollowBallotItemsDict: {}, // Dictionary with ballot_item_we_vote_id as key and list of organization we_vote_ids as value
      organizationWeVoteIdsToFollowForLatestBallotItem: [], // stores organization_we_vote_ids for latest ballot_item_we_vote_id
      organizationWeVoteIdsToFollowByIssuesFollowed: [],
      organizationWeVoteIdsToFollowOrganizationRecommendationDict: {}, // This is a dictionary with organization_we_vote_id as key and list of organization_we_vote_id's as value
      organizationWeVoteIdsVoterIsFollowing: [],
      voterGuidesFollowedRetrieveStopped: false, // While this is set to true, don't allow any more calls to this API
      voterGuidesToFollowRetrieveStopped: false, // While this is set to true, don't allow any more calls to this API
      voterGuidesUpcomingFromFriendsStoppedByGoogleCivicElectionId: [], // stores google_civic_election_id for elections where all voter guides from friends have been retrieved
      voterGuidesUpcomingStoppedByGoogleCivicElectionId: [], // stores google_civic_election_id for elections where all voter guides have been retrieved
    };
  }

  // Given a list of ids, retrieve the complete allCachedVoterGuides with all attributes and return as array
  returnVoterGuidesFromListOfIds (listOfOrganizationWeVoteIds) {
    const state = this.getState();
    // console.log("VoterGuideStore, returnVoterGuidesFromListOfIds listOfOrganizationWeVoteIds: ", listOfOrganizationWeVoteIds);
    // console.log("VoterGuideStore, returnVoterGuidesFromListOfIds state.allCachedVoterGuides: ", state.allCachedVoterGuides);
    const filteredVoterGuides = [];
    if (listOfOrganizationWeVoteIds) {
      // voterGuidesFollowedRetrieve API returns more than one voter guide per organization some times.
      const uniqueOrganizationWeVoteIdArray = listOfOrganizationWeVoteIds.filter((value, index, self) => self.indexOf(value) === index);
      uniqueOrganizationWeVoteIdArray.forEach((organizationWeVoteId) => {
        if (state.allCachedVoterGuides[organizationWeVoteId]) {
          filteredVoterGuides.push(state.allCachedVoterGuides[organizationWeVoteId]);
        }
      });
    }
    return filteredVoterGuides;
  }

  ballotHasGuides () {
    return this.getState().ballotHasGuides;
  }

  ballotHasGuidesForValue (issueWeVoteId) {
    const organizationWeVoteIdsByValue = this.getState().organizationWeVoteIdsByIssueWeVoteId[issueWeVoteId] || [];
    return organizationWeVoteIdsByValue.length;
  }

  sortVoterGuidesByDate (unsortedVoterGuides) { // eslint-disable-line
    // temporary array holds objects with position and sort-value
    const mapped = unsortedVoterGuides.map((item, i) => ({ index: i, value: item }));

    // sorting the mapped array based on local_ballot_order which came from the server
    mapped.sort((a, b) => +(a.value.election_day_text < b.value.election_day_text) ||
        +(a.value.election_day_text === b.value.election_day_text) - 1);

    const orderedArray = [];
    mapped.forEach(element => orderedArray.push(element.value));
    // The prior line replaces the following lines for eslint 12/1/18
    // for (const element of mapped) {
    //   orderedArray.push(element.value);
    // }

    // console.log("VoterGuideStore, sortVoterGuidesByDate, orderedArray: ", orderedArray);
    return orderedArray;
  }

  getAllVoterGuidesOwnedByVoter () {
    const allCachedVoterGuidesByOrganization = this.getState().allCachedVoterGuidesByOrganization || {};
    const voter = VoterStore.getVoter();
    const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log("VoterGuideStore getAllVoterGuidesOwnedByVoter, linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId, ", allCachedVoterGuidesByOrganization: ", allCachedVoterGuidesByOrganization);
    const unsortedVoterGuides = allCachedVoterGuidesByOrganization[linkedOrganizationWeVoteId] || [];
    return this.sortVoterGuidesByDate(unsortedVoterGuides);
  }

  getVoterGuidesToFollowAll (limit = 100, limitToPublicFigures = false, limitToOrganizations = false) {
    // Start with the full list of we_vote_ids that can be followed
    let organizationWeVoteIdsToFollow = this.getState().organizationWeVoteIdsToFollowAll || [];
    // Take the list that we are already following
    const organizationWeVoteIdsFollowed = this.getState().organizationWeVoteIdsVoterIsFollowing || [];
    // Remove organizationWeVoteIdsVoterIsFollowing
    organizationWeVoteIdsToFollow = organizationWeVoteIdsToFollow.filter(organizationWeVoteId => !organizationWeVoteIdsFollowed.includes(organizationWeVoteId));
    let organizationWeVoteIdsToFollowWithLimit = [];
    if (limitToPublicFigures) {
      const listToFilter1 = this.returnVoterGuidesFromListOfIds(organizationWeVoteIdsToFollow) || [];
      let voterGuidesFound = 0;
      let step;
      for (step = 0; step < listToFilter1.length; step++) {
        // console.log('listToFilter1[step].voter_guide_owner_type:', listToFilter1[step].voter_guide_owner_type);
        if (isSpeakerTypePublicFigure(listToFilter1[step].voter_guide_owner_type)) {
          organizationWeVoteIdsToFollowWithLimit.push(listToFilter1[step].organization_we_vote_id);
          voterGuidesFound++;
          if (voterGuidesFound >= limit) {
            break;
          }
        }
      }
    } else if (limitToOrganizations) {
      const listToFilter2 = this.returnVoterGuidesFromListOfIds(organizationWeVoteIdsToFollow) || [];
      let voterGuidesFound = 0;
      let step;
      for (step = 0; step < listToFilter2.length; step++) {
        if (isSpeakerTypeOrganization(listToFilter2[step].voter_guide_owner_type)) {
          organizationWeVoteIdsToFollowWithLimit.push(listToFilter2[step].organization_we_vote_id);
          voterGuidesFound++;
          if (voterGuidesFound >= limit) {
            break;
          }
        }
      }
    } else {
      organizationWeVoteIdsToFollowWithLimit = organizationWeVoteIdsToFollow.slice(0, limit);
    }
    return this.returnVoterGuidesFromListOfIds(organizationWeVoteIdsToFollowWithLimit) || [];
  }

  getVoterGuidesForValue (issueWeVoteId) {
    const organizationWeVoteIdsByValue = this.getState().organizationWeVoteIdsByIssueWeVoteId[issueWeVoteId] || [];
    return this.returnVoterGuidesFromListOfIds(organizationWeVoteIdsByValue) || [];
  }

  getVoterGuidesToFollowForLatestBallotItem () {
    return this.returnVoterGuidesFromListOfIds(this.getState().organizationWeVoteIdsToFollowForLatestBallotItem) || [];
  }

  getVoterGuideForOrganizationId (organizationWeVoteId) {
    return this.getState().allCachedVoterGuides[organizationWeVoteId] || [];
  }

  getVoterGuideForOrganizationIdAndElection (organizationWeVoteId, googleCivicElectionId) {
    const allCachedVoterGuidesByElection = this.getState().allCachedVoterGuidesByElection || [];
    const organizationList = allCachedVoterGuidesByElection[organizationWeVoteId] || [];
    return organizationList[googleCivicElectionId] || {};
  }

  getVoterGuidesForOrganizationId (organizationWeVoteId) {
    const allCachedVoterGuidesByOrganization = this.getState().allCachedVoterGuidesByOrganization || {};
    return allCachedVoterGuidesByOrganization[organizationWeVoteId] || [];
  }

  getVoterGuideByVoterGuideId (voterGuideWeVoteId) {
    const allCachedVoterGuidesByVoterGuide = this.getState().allCachedVoterGuidesByVoterGuide || {};
    return allCachedVoterGuidesByVoterGuide[voterGuideWeVoteId] || {};
  }

  getVoterGuideElectionList (organizationWeVoteId) {
    // Return a list of elections that this organization has voter guides for
    if (this.getState().voterGuideElectionListByOrganization) {
      return this.getState().voterGuideElectionListByOrganization[organizationWeVoteId] || [];
    }
    return [];
  }

  getVoterGuidesToFollowForBallotItemId (ballotItemWeVoteId) {
    return this.returnVoterGuidesFromListOfIds(this.getState().organizationWeVoteIdsToFollowBallotItemsDict[ballotItemWeVoteId]) || [];
  }

  getVoterGuidesToFollowForBallotItemIdSupports (ballotItemWeVoteId) {
    // Start with the full list of we_vote_ids that can be followed
    let organizationWeVoteIdsToFollow = this.getState().organizationWeVoteIdsToFollowBallotItemsDict[ballotItemWeVoteId] || [];
    // Take the list that we are already following
    const organizationWeVoteIdsFollowed = this.getState().organizationWeVoteIdsVoterIsFollowing || [];
    // Remove organizationWeVoteIdsVoterIsFollowing
    organizationWeVoteIdsToFollow = organizationWeVoteIdsToFollow.filter(el => !organizationWeVoteIdsFollowed.includes(el));

    const voterGuidesToFollow = this.returnVoterGuidesFromListOfIds(organizationWeVoteIdsToFollow) || [];
    const voterGuidesToFollowSupport = [];
    voterGuidesToFollow.forEach((voterGuide) => {
      // console.log("voter_guide:", voter_guide);
      if (arrayContains(ballotItemWeVoteId, voterGuide.ballot_item_we_vote_ids_this_org_supports)) {
        voterGuidesToFollowSupport.push(voterGuide);
      }
    });
    return voterGuidesToFollowSupport;
  }

  getVoterGuidesToFollowForBallotItemIdOpposes (ballotItemWeVoteId) {
    const voterGuidesToFollow = this.returnVoterGuidesFromListOfIds(this.getState().organizationWeVoteIdsToFollowBallotItemsDict[ballotItemWeVoteId]) || [];
    const voterGuidesToFollowOppose = [];
    voterGuidesToFollow.forEach((voterGuide) => {
      // console.log("voter_guide:", voter_guide);
      if (arrayContains(ballotItemWeVoteId, voterGuide.ballot_item_we_vote_ids_this_org_opposes)) {
        voterGuidesToFollowOppose.push(voterGuide);
      }
    });
    return voterGuidesToFollowOppose;
  }

  getVoterGuidesToFollowByIssuesFollowed () {
    return this.returnVoterGuidesFromListOfIds(this.getState().organizationWeVoteIdsToFollowByIssuesFollowed) || [];
  }

  getVoterGuidesToFollowByOrganizationRecommendation (recommendingOrganizationWeVoteId) {
    return this.returnVoterGuidesFromListOfIds(this.getState().organizationWeVoteIdsToFollowOrganizationRecommendationDict[recommendingOrganizationWeVoteId]) || [];
  }

  getVoterGuidesVoterIsFollowing () {
    return this.returnVoterGuidesFromListOfIds(OrganizationStore.getState().organizationWeVoteIdsVoterIsFollowing) || [];
  }

  getVoterGuidesFollowedByOrganization (organizationWeVoteId) {
    return this.returnVoterGuidesFromListOfIds(OrganizationStore.getState().organizationWeVoteIdsFollowedByOrganizationDict[organizationWeVoteId]) || [];
  }

  getVoterGuidesFollowingOrganization (organizationWeVoteId) {
    return this.returnVoterGuidesFromListOfIds(OrganizationStore.getState().organizationWeVoteIdsFollowingByOrganizationDict[organizationWeVoteId]) || [];
  }

  getVoterGuidesVoterIsIgnoring () {
    return this.returnVoterGuidesFromListOfIds(OrganizationStore.getState().organizationWeVoteIdsVoterIsIgnoring) || [];
  }

  getVoterGuideSaveResults () {
    return this.getState().voterGuideSaveResults;
  }

  voterGuidesFollowedRetrieveStopped () {
    // While this is set to true, don't allow any more calls to this API
    return this.getState().voterGuidesFollowedRetrieveStopped;
  }

  voterGuidesToFollowRetrieveStopped () {
    // While this is set to true, don't allow any more calls to this API
    return this.getState().voterGuidesToFollowRetrieveStopped;
  }

  voterGuidesUpcomingFromFriendsStopped (googleCivicElectionId) {
    // While this is set to true, don't allow any more calls to this API
    const googleCivicElectionIdInteger = convertToInteger(googleCivicElectionId);
    // console.log('voterGuidesUpcomingFromFriendsStoppedByGoogleCivicElectionId:', this.getState().voterGuidesUpcomingFromFriendsStoppedByGoogleCivicElectionId);
    // console.log('voterGuidesUpcomingFromFriendsStoppedByGoogleCivicElectionId, googleCivicElectionId:', googleCivicElectionIdInteger, arrayContains(googleCivicElectionIdInteger, this.getState().voterGuidesUpcomingFromFriendsStoppedByGoogleCivicElectionId));
    return arrayContains(googleCivicElectionIdInteger, this.getState().voterGuidesUpcomingFromFriendsStoppedByGoogleCivicElectionId);
  }

  voterGuidesUpcomingStopped (googleCivicElectionId) {
    // While this is set to true, don't allow any more calls to this API
    const googleCivicElectionIdInteger = convertToInteger(googleCivicElectionId);
    // console.log('voterGuidesUpcomingStoppedByGoogleCivicElectionId:', this.getState().voterGuidesUpcomingStoppedByGoogleCivicElectionId);
    // console.log('voterGuidesUpcomingStopped, googleCivicElectionIdInteger:', googleCivicElectionIdInteger, (googleCivicElectionId in this.getState().voterGuidesUpcomingStoppedByGoogleCivicElectionId));
    return this.getState().voterGuidesUpcomingStoppedByGoogleCivicElectionId.includes(googleCivicElectionIdInteger);
  }

  reduce (state, action) {
    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success) return state;
    const {
      allCachedVoterGuides, allCachedVoterGuidesByElection, organizationWeVoteIdsByIssueWeVoteId,
      organizationWeVoteIdsToFollowOrganizationRecommendationDict, organizationWeVoteIdsToFollowBallotItemsDict,
    } = state;
    let {
      voterGuidesUpcomingFromFriendsStoppedByGoogleCivicElectionId,
      voterGuidesUpcomingStoppedByGoogleCivicElectionId,
    } = state;
    let allCachedVoterGuidesByOrganization;
    let allCachedVoterGuidesByVoterGuide;
    let convertedElection = {};
    let electionAlreadyStored = false;
    // let is_empty;
    let googleCivicElectionId;
    let organizationWeVoteId;
    let organizationWeVoteIdListFromVoterGuidesReturned;
    let replacedExistingVoterGuide;
    let revisedState;
    let tempCachedVoterGuideElectionListForOrganization;
    let tempCachedVoterGuidesForOrganization;
    let voterGuideElectionListByOrganization;
    let voterGuideWithPledgeInfo;
    let voterGuides;
    let voterLinkedOrganizationWeVoteId;
    const searchTermExists = action.res.search_string !== '';
    const electionIdExists = convertToInteger(action.res.google_civic_election_id) !== 0;
    const ballotItemWeVoteIdExists = action.res.ballot_item_we_vote_id !== '';
    const filterVoterGuidesByIssue = action.res.filter_voter_guides_by_issue;
    const ballotHasGuides = voterGuides && voterGuides.length !== 0;
    let ballotItemsWeAreTracking  = organizationWeVoteIdsToFollowBallotItemsDict ? Object.keys(organizationWeVoteIdsToFollowBallotItemsDict) : [];
    let currentList = [];
    let newList = [];
    const updatedVoterGuideIdsForOneBallotItem = [];
    const organizationWeVoteIdsToFollowByIssuesFollowed = [];
    const organizationWeVoteIdsVoterIsFollowing = [];
    const organizationWeVoteIdForVoterGuideOwner = action.res.organization_we_vote_id;
    // We might want to only use one of these following variables...
    // ...although a recommendation might only want to include voter guides from this election
    const voterGuideSaveResults = action.res;

    switch (action.type) {
      case 'pledgeToVoteWithVoterGuide':
        if (action.res.pledge_statistics_found) {
          // console.log("VoterGuideStore pledgeToVoteWithVoterGuide, action.res: ", action.res);
          voterGuideWithPledgeInfo = allCachedVoterGuides[action.res.organization_we_vote_id] || {};
          voterGuideWithPledgeInfo.pledge_goal = action.res.pledge_goal;
          voterGuideWithPledgeInfo.pledge_count = action.res.pledge_count;
          voterGuideWithPledgeInfo.voter_has_pledged = action.res.voter_has_pledged;
          allCachedVoterGuides[action.res.organization_we_vote_id] = voterGuideWithPledgeInfo;

          if (allCachedVoterGuidesByElection[action.res.organization_we_vote_id] === undefined) {
            allCachedVoterGuidesByElection[action.res.organization_we_vote_id] = [];
          }
          voterGuideWithPledgeInfo = allCachedVoterGuidesByElection[action.res.organization_we_vote_id][convertToInteger(action.res.google_civic_election_id)] || {};
          voterGuideWithPledgeInfo.pledge_goal = action.res.pledge_goal;
          voterGuideWithPledgeInfo.pledge_count = action.res.pledge_count;
          voterGuideWithPledgeInfo.voter_has_pledged = action.res.voter_has_pledged;
          allCachedVoterGuidesByElection[action.res.organization_we_vote_id][convertToInteger(action.res.google_civic_election_id)] = voterGuideWithPledgeInfo;
          OrganizationActions.organizationsFollowedRetrieve();
          SupportActions.voterAllPositionsRetrieve();
          // VoterGuideActions.voterGuidesToFollowRetrieve(action.res.google_civic_election_id); // DEBUG=1
          VoterGuideActions.voterGuidesFollowedRetrieve(action.res.google_civic_election_id);

          return {
            ...state,
            allCachedVoterGuides,
            allCachedVoterGuidesByElection,
          };
        } else {
          return state;
        }

      case 'voterAddressSave':
        if (action.res.status === 'SIMPLE_ADDRESS_SAVE') {
          return state;
        } else {
          revisedState = state;
          googleCivicElectionId = convertToInteger(action.res.google_civic_election_id);
          if (!this.voterGuidesUpcomingFromFriendsStopped(googleCivicElectionId)) {
            VoterGuideActions.voterGuidesFromFriendsUpcomingRetrieve(googleCivicElectionId);
            voterGuidesUpcomingFromFriendsStoppedByGoogleCivicElectionId = state.voterGuidesUpcomingFromFriendsStoppedByGoogleCivicElectionId || [];
            voterGuidesUpcomingFromFriendsStoppedByGoogleCivicElectionId.push(googleCivicElectionId);
            revisedState = Object.assign({}, revisedState, { voterGuidesUpcomingFromFriendsStoppedByGoogleCivicElectionId });
          }
          if (!this.voterGuidesUpcomingStopped(googleCivicElectionId)) {
            VoterGuideActions.voterGuidesUpcomingRetrieve(googleCivicElectionId);
            voterGuidesUpcomingStoppedByGoogleCivicElectionId = state.voterGuidesUpcomingStoppedByGoogleCivicElectionId || [];
            voterGuidesUpcomingStoppedByGoogleCivicElectionId.push(googleCivicElectionId);
            revisedState = Object.assign({}, revisedState, { voterGuidesUpcomingStoppedByGoogleCivicElectionId });
          }

          VoterGuideActions.voterGuidesFollowedRetrieve(googleCivicElectionId);
          return revisedState;
        }

      case 'voterAddressRetrieve': // refresh guides when you change address
        googleCivicElectionId = convertToInteger(action.res.google_civic_election_id);
        revisedState = state;
        // This is to prevent the same call from going out multiple times
        if (!this.voterGuidesUpcomingFromFriendsStopped(googleCivicElectionId)) {
          VoterGuideActions.voterGuidesFromFriendsUpcomingRetrieve(googleCivicElectionId);
          voterGuidesUpcomingFromFriendsStoppedByGoogleCivicElectionId = state.voterGuidesUpcomingFromFriendsStoppedByGoogleCivicElectionId || [];
          voterGuidesUpcomingFromFriendsStoppedByGoogleCivicElectionId.push(googleCivicElectionId);
          revisedState = Object.assign({}, revisedState, { voterGuidesUpcomingFromFriendsStoppedByGoogleCivicElectionId });
        }
        if (!this.voterGuidesUpcomingStopped(googleCivicElectionId)) {
          VoterGuideActions.voterGuidesUpcomingRetrieve(googleCivicElectionId);
          voterGuidesUpcomingStoppedByGoogleCivicElectionId = state.voterGuidesUpcomingStoppedByGoogleCivicElectionId || [];
          voterGuidesUpcomingStoppedByGoogleCivicElectionId.push(googleCivicElectionId);
          revisedState = Object.assign({}, revisedState, { voterGuidesUpcomingStoppedByGoogleCivicElectionId });
        }
        if (!this.voterGuidesFollowedRetrieveStopped()) {
          VoterGuideActions.voterGuidesFollowedRetrieve(googleCivicElectionId);
          voterGuidesUpcomingStoppedByGoogleCivicElectionId = state.voterGuidesUpcomingStoppedByGoogleCivicElectionId || [];
          voterGuidesUpcomingStoppedByGoogleCivicElectionId.push(googleCivicElectionId);
          revisedState = Object.assign({}, revisedState, { voterGuidesUpcomingStoppedByGoogleCivicElectionId });
        }
        return revisedState;

      case 'voterBallotItemsRetrieve':
        // console.log("VoterGuideStore, voterBallotItemsRetrieve response received.");
        googleCivicElectionId = convertToInteger(action.res.google_civic_election_id) || 0;
        googleCivicElectionId = parseInt(googleCivicElectionId, 10);
        revisedState = state;
        if (googleCivicElectionId !== 0) {
          if (!this.voterGuidesUpcomingFromFriendsStopped(googleCivicElectionId)) {
            VoterGuideActions.voterGuidesFromFriendsUpcomingRetrieve(googleCivicElectionId);
            voterGuidesUpcomingFromFriendsStoppedByGoogleCivicElectionId = state.voterGuidesUpcomingFromFriendsStoppedByGoogleCivicElectionId || [];
            voterGuidesUpcomingFromFriendsStoppedByGoogleCivicElectionId.push(googleCivicElectionId);
            revisedState = Object.assign({}, revisedState, { voterGuidesUpcomingFromFriendsStoppedByGoogleCivicElectionId });
          }
          if (!this.voterGuidesUpcomingStopped(googleCivicElectionId)) {
            VoterGuideActions.voterGuidesUpcomingRetrieve(googleCivicElectionId);
            voterGuidesUpcomingStoppedByGoogleCivicElectionId = state.voterGuidesUpcomingStoppedByGoogleCivicElectionId || [];
            voterGuidesUpcomingStoppedByGoogleCivicElectionId.push(googleCivicElectionId);
            revisedState = Object.assign({}, revisedState, { voterGuidesUpcomingStoppedByGoogleCivicElectionId });
          }
          if (!this.voterGuidesFollowedRetrieveStopped()) {
            VoterGuideActions.voterGuidesFollowedRetrieve(googleCivicElectionId);
            revisedState = Object.assign({}, revisedState, { voterGuidesFollowedRetrieveStopped: true });
          }
        }
        VoterGuideActions.voterGuidesIgnoredRetrieve();
        return revisedState;

      case 'voterFollowAllOrganizationsFollowedByOrganization':
        // console.log('VoterGuideStore voterFollowAllOrganizationsFollowedByOrganization');
        // Following one org can change the support/oppose count for many ballot items for the voter
        voterLinkedOrganizationWeVoteId = VoterStore.getVoter().linked_organization_we_vote_id;
        // organization_we_vote_id is the organization that was just followed
        organizationWeVoteId = action.res.organization_we_vote_id;
        // VoterGuideActions.voterGuidesToFollowRetrieve(VoterStore.electionId());  // Whenever a voter follows a new org, update list
        // Update "who I am following" for the voter: voterLinkedOrganizationWeVoteId
        VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(voterLinkedOrganizationWeVoteId);
        // Update who the organization is followed by
        VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(organizationWeVoteId);
        VoterGuideActions.voterGuidesRecommendedByOrganizationRetrieve(organizationWeVoteId, VoterStore.electionId());
        // Update the guides the voter is following
        VoterGuideActions.voterGuidesFollowedRetrieve();
        // Update the followers of the organization that was just followed: organization_we_vote_id
        VoterGuideActions.voterGuideFollowersRetrieve(organizationWeVoteId);
        // Retrieve the organizations followed by voter
        OrganizationActions.organizationsFollowedRetrieve();
        return state;

      case 'voterGuidesToFollowRetrieve':
        voterGuides = action.res.voter_guides;
        // is_empty = voter_guides.length === 0;
        // If no voter guides found , and it's not a search query, retrieve results for all elections
        // DALE 2018-10-16 We are reducing the role of voterGuidesToFollowRetrieve
        // if (is_empty && electionIdExists && !searchTermExists ) {
        //   // console.log("VoterGuideStore CALLING voterGuidesToFollowRetrieve again");
        //   VoterGuideActions.voterGuidesToFollowRetrieve(0);
        //   return state;
        // }

        organizationWeVoteIdListFromVoterGuidesReturned = [];
        voterGuides.forEach((oneVoterGuide) => {
          // console.log("VoterGuideStore voterGuidesToFollowRetrieve oneVoterGuide.google_civic_election_id: ", oneVoterGuide.google_civic_election_id);
          allCachedVoterGuides[oneVoterGuide.organization_we_vote_id] = oneVoterGuide;
          if (allCachedVoterGuidesByElection[oneVoterGuide.organization_we_vote_id] === undefined) {
            allCachedVoterGuidesByElection[oneVoterGuide.organization_we_vote_id] = [];
          }
          allCachedVoterGuidesByElection[oneVoterGuide.organization_we_vote_id][convertToInteger(oneVoterGuide.google_civic_election_id)] = oneVoterGuide;
          organizationWeVoteIdListFromVoterGuidesReturned.push(oneVoterGuide.organization_we_vote_id);
        });

        // Now store the voter_guide information by ballot_item (i.e., which organizations have positions on each ballot_item)
        // let existing_voter_guide_ids_for_one_ballot_item;
        // Start with previous list
        if (ballotItemWeVoteIdExists) {
          // Go through each of the voter_guides that was just returned. If the existing_voter_guides does not contain
          //  that voter_guide organization_we_vote_id, then add it.
          voterGuides.forEach((oneVoterGuide) => {
            // Add voter guides if they don't already exist
            if (!updatedVoterGuideIdsForOneBallotItem.includes(oneVoterGuide.organization_we_vote_id)) {
              updatedVoterGuideIdsForOneBallotItem.push(oneVoterGuide.organization_we_vote_id);
            }
          });
          // And finally update new_ballot_items with all voter guide ids that can be followed
          organizationWeVoteIdsToFollowBallotItemsDict[action.res.ballot_item_we_vote_id] = updatedVoterGuideIdsForOneBallotItem;
          // console.log("updatedVoterGuideIdsForOneBallotItem: ", updatedVoterGuideIdsForOneBallotItem);

          return {
            ...state,
            ballotHasGuides: searchTermExists || electionIdExists,
            organizationWeVoteIdsToFollowForLatestBallotItem: updatedVoterGuideIdsForOneBallotItem,
            organizationWeVoteIdsToFollowBallotItemsDict,
            allCachedVoterGuides,
            allCachedVoterGuidesByElection,
            voterGuidesToFollowRetrieveStopped: false,
          };
        } else {
          // Go voter_guide-by-voter_guide and add them to each ballot_item
          // We assume here that we have a complete set of voter guides, so for every ballot_item we_vote_id
          //  we bring in, we clear out all earlier organization we_vote_id's at start
          // console.log("Object.keys: ", Object.keys(organizationWeVoteIdsToFollowBallotItemsDict));
          const guideWeVoteIdsProcessed = [];

          voterGuides.forEach((oneVoterGuide) => {
            if (oneVoterGuide.ballot_item_we_vote_ids_this_org_supports) {
              oneVoterGuide.ballot_item_we_vote_ids_this_org_supports.forEach((oneBallotItemWeVoteId) => {
                if (ballotItemsWeAreTracking.includes(oneBallotItemWeVoteId)) {
                  currentList = organizationWeVoteIdsToFollowBallotItemsDict[oneBallotItemWeVoteId];
                  currentList.push(oneVoterGuide.organization_we_vote_id);
                  organizationWeVoteIdsToFollowBallotItemsDict[oneBallotItemWeVoteId] = currentList;
                } else {
                  newList = [];
                  newList.push(oneVoterGuide.organization_we_vote_id);
                  organizationWeVoteIdsToFollowBallotItemsDict[oneBallotItemWeVoteId] = newList;
                }
                ballotItemsWeAreTracking = Object.keys(organizationWeVoteIdsToFollowBallotItemsDict);
              });
            }
            if (oneVoterGuide.ballot_item_we_vote_ids_this_org_info_only) {
              oneVoterGuide.ballot_item_we_vote_ids_this_org_info_only.forEach((oneBallotItemWeVoteId) => {
                if (ballotItemsWeAreTracking.includes(oneBallotItemWeVoteId)) {
                  currentList = organizationWeVoteIdsToFollowBallotItemsDict[oneBallotItemWeVoteId];
                  currentList.push(oneVoterGuide.organization_we_vote_id);
                  organizationWeVoteIdsToFollowBallotItemsDict[oneBallotItemWeVoteId] = currentList;
                } else {
                  newList = [];
                  newList.push(oneVoterGuide.organization_we_vote_id);
                  organizationWeVoteIdsToFollowBallotItemsDict[oneBallotItemWeVoteId] = newList;
                }
                ballotItemsWeAreTracking = Object.keys(organizationWeVoteIdsToFollowBallotItemsDict);
              });
            }
            if (oneVoterGuide.ballot_item_we_vote_ids_this_org_opposes) {
              oneVoterGuide.ballot_item_we_vote_ids_this_org_opposes.forEach((oneBallotItemWeVoteId) => {
                if (ballotItemsWeAreTracking.includes(oneBallotItemWeVoteId)) {
                  currentList = organizationWeVoteIdsToFollowBallotItemsDict[oneBallotItemWeVoteId];
                  currentList.push(oneVoterGuide.organization_we_vote_id);
                  organizationWeVoteIdsToFollowBallotItemsDict[oneBallotItemWeVoteId] = currentList;
                } else {
                  newList = [];
                  newList.push(oneVoterGuide.organization_we_vote_id);
                  organizationWeVoteIdsToFollowBallotItemsDict[oneBallotItemWeVoteId] = newList;
                }
                ballotItemsWeAreTracking = Object.keys(organizationWeVoteIdsToFollowBallotItemsDict);
              });
            }

            if (filterVoterGuidesByIssue) {
              organizationWeVoteId = oneVoterGuide.organization_we_vote_id;
              if (guideWeVoteIdsProcessed.indexOf(organizationWeVoteId) === -1) {
                if (!organizationWeVoteIdsToFollowByIssuesFollowed.includes(oneVoterGuide.organization_we_vote_id)) {
                  organizationWeVoteIdsToFollowByIssuesFollowed.push(oneVoterGuide.organization_we_vote_id);
                }
                if (!guideWeVoteIdsProcessed.includes(organizationWeVoteId)) {
                  guideWeVoteIdsProcessed.push(organizationWeVoteId);
                }
              }
            }
          });

          if (filterVoterGuidesByIssue) {
            return {
              ...state,
              ballotHasGuides: searchTermExists || electionIdExists,
              organizationWeVoteIdsToFollowBallotItemsDict,
              organizationWeVoteIdsToFollowByIssuesFollowed,
              allCachedVoterGuides,
              voterGuidesToFollowRetrieveStopped: false,
            };
          } else {
            // DALE 2018-10-16 We don't want to use pagination for voterGuidesToFollowRetrieve any more.
            // let retrieveAnotherPageOfResults;
            // let maximum_number_to_retrieve = 350; // This needs to match the variable in VoterGuideActions
            // let start_retrieve_at_this_number = action.res.start_retrieve_at_this_number + maximum_number_to_retrieve;
            // let received_maximum_possible_voter_guides = action.res.number_retrieved && action.res.number_retrieved === maximum_number_to_retrieve;
            // if (action.res.google_civic_election_id && received_maximum_possible_voter_guides) {
            //   retrieveAnotherPageOfResults = true;
            // }
            // if (retrieveAnotherPageOfResults) {
            //   VoterGuideActions.voterGuidesToFollowRetrieve(action.res.google_civic_election_id, 0, false, start_retrieve_at_this_number);
            // }
            return {
              ...state,
              ballotHasGuides: searchTermExists || electionIdExists,
              organizationWeVoteIdsToFollowAll: organizationWeVoteIdListFromVoterGuidesReturned,
              organizationWeVoteIdsToFollowBallotItemsDict,
              allCachedVoterGuides,
              voterGuidesToFollowRetrieveStopped: false,
            };
          }
        }

      case 'voterGuidesUpcomingRetrieve': // List of all public voter guides from CDN
      case 'voterGuidesFromFriendsUpcomingRetrieve': // List of all friends-only voter guides
        voterGuides = action.res.voter_guides;
        // is_empty = voter_guides.length === 0;
        organizationWeVoteIdListFromVoterGuidesReturned = state.organizationWeVoteIdsToFollowAll;
        voterGuidesUpcomingStoppedByGoogleCivicElectionId = state.voterGuidesUpcomingStoppedByGoogleCivicElectionId || [];
        voterGuidesUpcomingFromFriendsStoppedByGoogleCivicElectionId = state.voterGuidesUpcomingFromFriendsStoppedByGoogleCivicElectionId || [];
        voterGuides.forEach((oneVoterGuide) => {
          // console.log("VoterGuideStore voterGuidesToFollowRetrieve oneVoterGuide.google_civic_election_id: ", oneVoterGuide.google_civic_election_id);
          allCachedVoterGuides[oneVoterGuide.organization_we_vote_id] = oneVoterGuide;
          if (allCachedVoterGuidesByElection[oneVoterGuide.organization_we_vote_id] === undefined) {
            allCachedVoterGuidesByElection[oneVoterGuide.organization_we_vote_id] = [];
          }
          allCachedVoterGuidesByElection[oneVoterGuide.organization_we_vote_id][convertToInteger(oneVoterGuide.google_civic_election_id)] = oneVoterGuide;
          if (!arrayContains(oneVoterGuide.organization_we_vote_id, organizationWeVoteIdListFromVoterGuidesReturned)) {
            // console.log('Adding to organizationWeVoteIdsToFollowAll');
            organizationWeVoteIdListFromVoterGuidesReturned.push(oneVoterGuide.organization_we_vote_id);
          }
        });

        // Start with previous list
        // Go voter_guide-by-voter_guide and add them to each ballot_item
        // We assume here that we have a complete set of voter guides, so for every ballot_item we_vote_id
        //  we bring in, we clear out all earlier organization we_vote_id's at start
        // console.log("Object.keys: ", Object.keys(organizationWeVoteIdsToFollowBallotItemsDict));

        voterGuides.forEach((oneVoterGuide) => {
          if (oneVoterGuide.ballot_item_we_vote_ids_this_org_supports) {
            oneVoterGuide.ballot_item_we_vote_ids_this_org_supports.forEach((oneBallotItemWeVoteId) => {
              if (ballotItemsWeAreTracking.includes(oneBallotItemWeVoteId)) {
                currentList = organizationWeVoteIdsToFollowBallotItemsDict[oneBallotItemWeVoteId];
                currentList.push(oneVoterGuide.organization_we_vote_id);
                organizationWeVoteIdsToFollowBallotItemsDict[oneBallotItemWeVoteId] = currentList;
              } else {
                newList = [];
                newList.push(oneVoterGuide.organization_we_vote_id);
                organizationWeVoteIdsToFollowBallotItemsDict[oneBallotItemWeVoteId] = newList;
              }
              ballotItemsWeAreTracking = Object.keys(organizationWeVoteIdsToFollowBallotItemsDict);
            });
          }
          if (oneVoterGuide.ballot_item_we_vote_ids_this_org_info_only) {
            oneVoterGuide.ballot_item_we_vote_ids_this_org_info_only.forEach((oneBallotItemWeVoteId) => {
              if (ballotItemsWeAreTracking.includes(oneBallotItemWeVoteId)) {
                currentList = organizationWeVoteIdsToFollowBallotItemsDict[oneBallotItemWeVoteId];
                currentList.push(oneVoterGuide.organization_we_vote_id);
                organizationWeVoteIdsToFollowBallotItemsDict[oneBallotItemWeVoteId] = currentList;
              } else {
                newList = [];
                newList.push(oneVoterGuide.organization_we_vote_id);
                organizationWeVoteIdsToFollowBallotItemsDict[oneBallotItemWeVoteId] = newList;
              }
              ballotItemsWeAreTracking = Object.keys(organizationWeVoteIdsToFollowBallotItemsDict);
            });
          }
          if (oneVoterGuide.ballot_item_we_vote_ids_this_org_opposes) {
            oneVoterGuide.ballot_item_we_vote_ids_this_org_opposes.forEach((oneBallotItemWeVoteId) => {
              if (ballotItemsWeAreTracking.includes(oneBallotItemWeVoteId)) {
                currentList = organizationWeVoteIdsToFollowBallotItemsDict[oneBallotItemWeVoteId];
                currentList.push(oneVoterGuide.organization_we_vote_id);
                organizationWeVoteIdsToFollowBallotItemsDict[oneBallotItemWeVoteId] = currentList;
              } else {
                newList = [];
                newList.push(oneVoterGuide.organization_we_vote_id);
                organizationWeVoteIdsToFollowBallotItemsDict[oneBallotItemWeVoteId] = newList;
              }
              ballotItemsWeAreTracking = Object.keys(organizationWeVoteIdsToFollowBallotItemsDict);
            });
          }
          if (oneVoterGuide.issue_we_vote_ids_linked && oneVoterGuide.organization_we_vote_id) {
            oneVoterGuide.issue_we_vote_ids_linked.forEach((oneVoterGuideIssueWeVoteId) => {
              if (organizationWeVoteIdsByIssueWeVoteId[oneVoterGuideIssueWeVoteId] === undefined) {
                organizationWeVoteIdsByIssueWeVoteId[oneVoterGuideIssueWeVoteId] = [];
              }
              organizationWeVoteIdsByIssueWeVoteId[oneVoterGuideIssueWeVoteId].push(oneVoterGuide.organization_we_vote_id);
            });
          }
          if (oneVoterGuide.google_civic_election_id) {
            if (action.type === 'voterGuidesUpcomingRetrieve') {
              if (!arrayContains(convertToInteger(oneVoterGuide.google_civic_election_id), voterGuidesUpcomingStoppedByGoogleCivicElectionId)) {
                voterGuidesUpcomingStoppedByGoogleCivicElectionId.push(convertToInteger(oneVoterGuide.google_civic_election_id));
              }
            } else if (action.type === 'voterGuidesFromFriendsUpcomingRetrieve') {
              if (!arrayContains(convertToInteger(oneVoterGuide.google_civic_election_id), voterGuidesUpcomingFromFriendsStoppedByGoogleCivicElectionId)) {
                voterGuidesUpcomingFromFriendsStoppedByGoogleCivicElectionId.push(convertToInteger(oneVoterGuide.google_civic_election_id));
              }
            }
          }
        });

        return {
          ...state,
          allCachedVoterGuides,
          ballotHasGuides,
          organizationWeVoteIdsByIssueWeVoteId,
          organizationWeVoteIdsToFollowAll: organizationWeVoteIdListFromVoterGuidesReturned,
          organizationWeVoteIdsToFollowBallotItemsDict,
          voterGuidesUpcomingFromFriendsStoppedByGoogleCivicElectionId,
          voterGuidesUpcomingStoppedByGoogleCivicElectionId,
        };

      case 'voterGuidesFollowedRetrieve':
        // In OrganizationStore, we listen for a response to "organizationsFollowedRetrieve" instead of "voterGuidesFollowedRetrieve"
        // and update organizationWeVoteIdsVoterIsFollowing
        voterGuides = action.res.voter_guides;
        voterGuides.forEach((oneVoterGuide) => {
          // console.log("VoterGuideStore voterGuidesFollowedRetrieve oneVoterGuide.google_civic_election_id: ", oneVoterGuide.google_civic_election_id);
          allCachedVoterGuides[oneVoterGuide.organization_we_vote_id] = oneVoterGuide;
          if (allCachedVoterGuidesByElection[oneVoterGuide.organization_we_vote_id] === undefined) {
            allCachedVoterGuidesByElection[oneVoterGuide.organization_we_vote_id] = [];
          }
          allCachedVoterGuidesByElection[oneVoterGuide.organization_we_vote_id][convertToInteger(oneVoterGuide.google_civic_election_id)] = oneVoterGuide;
          organizationWeVoteIdsVoterIsFollowing.push(oneVoterGuide.organization_we_vote_id);
        });
        return {
          ...state,
          organizationWeVoteIdsVoterIsFollowing,
          allCachedVoterGuides,
          allCachedVoterGuidesByElection,
          voterGuidesFollowedRetrieveStopped: false,
        };

      case 'voterGuideFollowersRetrieve':
        // In OrganizationStore, we also listen for a response to "voterGuideFollowersRetrieve" and update organizationWeVoteIdsFollowingByOrganizationDict
        voterGuides = action.res.voter_guides;
        voterGuides.forEach((oneVoterGuide) => {
          // console.log("VoterGuideStore voterGuideFollowersRetrieve oneVoterGuide.google_civic_election_id: ", oneVoterGuide.google_civic_election_id);
          allCachedVoterGuides[oneVoterGuide.organization_we_vote_id] = oneVoterGuide;
          if (allCachedVoterGuidesByElection[oneVoterGuide.organization_we_vote_id] === undefined) {
            allCachedVoterGuidesByElection[oneVoterGuide.organization_we_vote_id] = [];
          }
          allCachedVoterGuidesByElection[oneVoterGuide.organization_we_vote_id][convertToInteger(oneVoterGuide.google_civic_election_id)] = oneVoterGuide;
        });
        return {
          ...state,
          allCachedVoterGuides,
          allCachedVoterGuidesByElection,
        };

      case 'voterGuidesIgnoredRetrieve':
        // In OrganizationStore, we also listen for a response to "voterGuidesIgnoredRetrieve" and update organizationWeVoteIdsVoterIsIgnoring
        voterGuides = action.res.voter_guides;
        voterGuides.forEach((oneVoterGuide) => {
          allCachedVoterGuides[oneVoterGuide.organization_we_vote_id] = oneVoterGuide;
          if (allCachedVoterGuidesByElection[oneVoterGuide.organization_we_vote_id] === undefined) {
            allCachedVoterGuidesByElection[oneVoterGuide.organization_we_vote_id] = [];
          }
          allCachedVoterGuidesByElection[oneVoterGuide.organization_we_vote_id][convertToInteger(oneVoterGuide.google_civic_election_id)] = oneVoterGuide;
        });
        return {
          ...state,
          allCachedVoterGuides,
          allCachedVoterGuidesByElection,
        };

      case 'voterGuidesFollowedByOrganizationRetrieve':
        // In OrganizationStore we listen for "voterGuidesFollowedByOrganizationRetrieve" so we can update OrganizationStore.getState().organizationWeVoteIdsFollowedByOrganizationDict
        voterGuides = action.res.voter_guides;
        // Clear prior recommendations
        organizationWeVoteIdsToFollowOrganizationRecommendationDict[organizationWeVoteIdForVoterGuideOwner] = [];
        if (action.res.filter_by_this_google_civic_election_id && action.res.filter_by_this_google_civic_election_id !== '') {
          // console.log("voterGuidesFollowedByOrganizationRetrieve filter_by_this_google_civic_election_id, organizationWeVoteIdForVoterGuideOwner: ", organizationWeVoteIdForVoterGuideOwner);
          voterGuides.forEach((oneVoterGuide) => {
            organizationWeVoteIdsToFollowOrganizationRecommendationDict[organizationWeVoteIdForVoterGuideOwner].push(oneVoterGuide.organization_we_vote_id);
          });
          return {
            ...state,
            organizationWeVoteIdsToFollowOrganizationRecommendationDict,
          };
        } else {
          // console.log("voterGuidesFollowedByOrganizationRetrieve NO election_id, organizationWeVoteIdForVoterGuideOwner: ", organizationWeVoteIdForVoterGuideOwner);
          voterGuides.forEach((oneVoterGuide) => {
            // console.log("VoterGuideStore voterGuidesFollowedByOrganizationRetrieve oneVoterGuide.google_civic_election_id: ", oneVoterGuide.google_civic_election_id);
            allCachedVoterGuides[oneVoterGuide.organization_we_vote_id] = oneVoterGuide;
            if (allCachedVoterGuidesByElection[oneVoterGuide.organization_we_vote_id] === undefined) {
              allCachedVoterGuidesByElection[oneVoterGuide.organization_we_vote_id] = [];
            }
            allCachedVoterGuidesByElection[oneVoterGuide.organization_we_vote_id][convertToInteger(oneVoterGuide.google_civic_election_id)] = oneVoterGuide;
            organizationWeVoteIdsToFollowOrganizationRecommendationDict[organizationWeVoteIdForVoterGuideOwner].push(oneVoterGuide.organization_we_vote_id);
          });
          return {
            ...state,
            allCachedVoterGuides,
            allCachedVoterGuidesByElection,
            organizationWeVoteIdsToFollowOrganizationRecommendationDict,
          };
        }

      case 'voterGuidesRetrieve':
        voterGuides = action.res.voter_guides;
        allCachedVoterGuidesByOrganization = state.allCachedVoterGuidesByOrganization || {};
        allCachedVoterGuidesByVoterGuide = state.allCachedVoterGuidesByVoterGuide || {};
        voterGuideElectionListByOrganization = state.voterGuideElectionListByOrganization || {};
        voterGuides.forEach((oneVoterGuide) => {
          // Store them by organization
          if (allCachedVoterGuidesByOrganization[oneVoterGuide.organization_we_vote_id] === undefined) {
            allCachedVoterGuidesByOrganization[oneVoterGuide.organization_we_vote_id] = [];
          }
          replacedExistingVoterGuide = false;
          tempCachedVoterGuidesForOrganization = allCachedVoterGuidesByOrganization[oneVoterGuide.organization_we_vote_id];
          for (let count = 0; count < tempCachedVoterGuidesForOrganization.length; count++) {
            if (tempCachedVoterGuidesForOrganization[count].we_vote_id === oneVoterGuide.we_vote_id) {
              // Replace the former voter_guide with the new one
              tempCachedVoterGuidesForOrganization[count] = oneVoterGuide;
              replacedExistingVoterGuide = true;
            }
          }
          if (!replacedExistingVoterGuide) {
            tempCachedVoterGuidesForOrganization.push(oneVoterGuide);
          }
          allCachedVoterGuidesByOrganization[oneVoterGuide.organization_we_vote_id] = tempCachedVoterGuidesForOrganization;
          // Store them by voter guide
          allCachedVoterGuidesByVoterGuide[oneVoterGuide.we_vote_id] = oneVoterGuide;

          // Now add to voterGuideElectionListByOrganization after converting to Election format
          if (voterGuideElectionListByOrganization[oneVoterGuide.organization_we_vote_id] === undefined) {
            voterGuideElectionListByOrganization[oneVoterGuide.organization_we_vote_id] = [];
          }
          electionAlreadyStored = false;
          tempCachedVoterGuideElectionListForOrganization = voterGuideElectionListByOrganization[oneVoterGuide.organization_we_vote_id];
          for (let count = 0; count < tempCachedVoterGuideElectionListForOrganization.length; count++) {
            if (convertToInteger(tempCachedVoterGuideElectionListForOrganization[count].google_civic_election_id) === convertToInteger(oneVoterGuide.google_civic_election_id)) {
              // Election already stored - no need to update
              electionAlreadyStored = true;
            }
          }
          if (!electionAlreadyStored) {
            convertedElection = convertVoterGuideToElection(oneVoterGuide);
            if (convertedElection !== false) {
              tempCachedVoterGuideElectionListForOrganization.push(convertedElection);
            }
          }
          voterGuideElectionListByOrganization[oneVoterGuide.organization_we_vote_id] = tempCachedVoterGuideElectionListForOrganization;
        });
        // console.log('voterGuideElectionListByOrganization:', voterGuideElectionListByOrganization);
        return {
          ...state,
          allCachedVoterGuidesByOrganization,
          allCachedVoterGuidesByVoterGuide,
          voterGuideElectionListByOrganization,
        };

      case 'voterGuideSave':
        allCachedVoterGuidesByOrganization = state.allCachedVoterGuidesByOrganization || {};
        allCachedVoterGuidesByVoterGuide = state.allCachedVoterGuidesByVoterGuide || {};

        // Store it by organization
        if (allCachedVoterGuidesByOrganization[voterGuideSaveResults.organization_we_vote_id] === undefined) {
          allCachedVoterGuidesByOrganization[voterGuideSaveResults.organization_we_vote_id] = [];
        }
        replacedExistingVoterGuide = false;
        tempCachedVoterGuidesForOrganization = allCachedVoterGuidesByOrganization[voterGuideSaveResults.organization_we_vote_id];
        for (let count = 0; count < tempCachedVoterGuidesForOrganization.length; count++) {
          if (tempCachedVoterGuidesForOrganization[count].we_vote_id === voterGuideSaveResults.we_vote_id) {
            // Replace the former voter_guide with the new one
            tempCachedVoterGuidesForOrganization[count] = voterGuideSaveResults;
            replacedExistingVoterGuide = true;
          }
        }
        if (!replacedExistingVoterGuide) {
          tempCachedVoterGuidesForOrganization.push(voterGuideSaveResults);
        }
        allCachedVoterGuidesByOrganization[voterGuideSaveResults.organization_we_vote_id] = tempCachedVoterGuidesForOrganization;
        // Store them by voter guide
        allCachedVoterGuidesByVoterGuide[voterGuideSaveResults.we_vote_id] = voterGuideSaveResults;

        return {
          ...state,
          allCachedVoterGuidesByOrganization,
          allCachedVoterGuidesByVoterGuide,
          voterGuideSaveResults,
        };

      case 'organizationFollow':
        // The heavy lift of the reaction to "organizationFollow" is in OrganizationStore
        VoterGuideActions.voterGuidesIgnoredRetrieve();

        // voterLinkedOrganizationWeVoteId is the voter who clicked the Follow button
        voterLinkedOrganizationWeVoteId = action.res.voter_linked_organization_we_vote_id;
        // organization_we_vote_id is the organization that was just followed
        organizationWeVoteId = action.res.organization_we_vote_id;
        return {
          ...state,
          organizationWeVoteIdsToFollowAll: state.organizationWeVoteIdsToFollowAll.filter(existingOrgWeVoteId => existingOrgWeVoteId !== organizationWeVoteId),
          organizationWeVoteIdsToFollowForLatestBallotItem: state.organizationWeVoteIdsToFollowForLatestBallotItem.filter(existingOrgWeVoteId => existingOrgWeVoteId !== organizationWeVoteId),
        };

      case 'organizationStopFollowing':
        // The heavy lift of the reaction to "organizationStopFollowing" is in OrganizationStore

        // organization_we_vote_id is the organization that was just followed
        organizationWeVoteId = action.res.organization_we_vote_id;
        return {
          ...state,
          organizationWeVoteIdsToFollowAll: state.organizationWeVoteIdsToFollowAll.concat(organizationWeVoteId),
        };

      case 'organizationFollowIgnore':
        // The heavy lift of the reaction to "organizationFollowIgnore" is in OrganizationStore
        VoterGuideActions.voterGuidesIgnoredRetrieve();

        // organization_we_vote_id is the organization that was just followed
        organizationWeVoteId = action.res.organization_we_vote_id;
        return {
          ...state,
          organizationWeVoteIdsToFollowAll: state.organizationWeVoteIdsToFollowAll.filter(existingOrgWeVoteId => existingOrgWeVoteId !== organizationWeVoteId),
          organizationWeVoteIdsToFollowForLatestBallotItem: state.organizationWeVoteIdsToFollowForLatestBallotItem.filter(existingOrgWeVoteId => existingOrgWeVoteId !== organizationWeVoteId),
        };

      case 'twitterNativeSignInSave':
      case 'twitterSignInRetrieve':
      case 'voterEmailAddressSignIn':
      case 'voterFacebookSignInRetrieve':
      case 'voterMergeTwoAccounts':
      case 'voterVerifySecretCode':
        // Voter is signing in
        // console.log('VoterGuideStore resetVoterSpecificState action.type:', action.type);
        revisedState = state;
        revisedState = Object.assign({}, revisedState, {
          voterGuidesFollowedRetrieveStopped: false, // While this is set to true, don't allow any more calls to this API
          voterGuidesToFollowRetrieveStopped: false, // While this is set to true, don't allow any more calls to this API
          voterGuidesUpcomingFromFriendsStoppedByGoogleCivicElectionId: [], // stores google_civic_election_id for elections where all voter guides have been retrieved
        });
        return revisedState;

      default:
        return state;
    }
  }
}

export default new VoterGuideStore(Dispatcher);
