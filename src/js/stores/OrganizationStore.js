import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/Dispatcher';
import OrganizationActions from '../actions/OrganizationActions';
import SupportActions from '../actions/SupportActions';
import VoterGuideActions from '../actions/VoterGuideActions';
import VoterStore from './VoterStore';
import { arrayContains } from '../utils/textFormat';

// December 2018:  We want to work toward being airbnb style compliant, but for now these are disabled in this file to minimize massive changes
/* eslint no-param-reassign: 0 */

class OrganizationStore extends ReduceStore {
  getInitialState () {
    return {
      allCachedOrganizationsDict: {}, // This is a dictionary with organizationWeVoteId as key and list of organizations
      organizationWeVoteIdsFollowedByOrganizationDict: {}, // Dictionary with organizationWeVoteId as key and list of organizationWeVoteId's being followed as value
      organizationWeVoteIdsFollowingByOrganizationDict: {}, // Dictionary with organizationWeVoteId as key and list of organizationWeVoteId's following that org as value
      organizationWeVoteIdsVoterIsFollowing: [],
      organizationWeVoteIdsVoterIsIgnoring: [],
      organizationWeVoteIdsVoterIsFollowingOnTwitter: [],
      organizationSearchResults: {
        organization_search_term: '',
        organization_twitter_handle: '',
        number_of_search_results: 0,
        search_results: [],
      },
    };
  }

  resetState () {
    return this.getInitialState();
  }

  // Given a list of ids, retrieve the complete allCachedOrganizationsDict with all attributes and return as array
  returnOrganizationsFromListOfIds (listOfOrganizationWeVoteIds) {
    const state = this.getState();
    const filteredOrganizations = [];
    if (listOfOrganizationWeVoteIds) {
      // organizationsFollowedRetrieve API returns more than one voter guide per organization some times.
      const uniqueOrganizationWeVoteIdArray = listOfOrganizationWeVoteIds.filter((value, index, self) => self.indexOf(value) === index);
      uniqueOrganizationWeVoteIdArray.forEach((organizationWeVoteId) => {
        if (state.allCachedOrganizationsDict[organizationWeVoteId]) {
          filteredOrganizations.push(state.allCachedOrganizationsDict[organizationWeVoteId]);
        }
      });
    }
    return filteredOrganizations;
  }

  getOrganizationByWeVoteId (organizationWeVoteId) {
    const { allCachedOrganizationsDict } = this.getState();
    return allCachedOrganizationsDict[organizationWeVoteId] || {};
  }

  getOrganizationPositionByWeVoteId (organizationWeVoteId, ballotItemWeVoteId) {
    const { allCachedOrganizationsDict } = this.getState();
    let requestedPosition = {};
    let resultFound = false;
    // console.log('getOrganizationPositionByWeVoteId, organizationWeVoteId: ', organizationWeVoteId, ', ballotItemWeVoteId: ', ballotItemWeVoteId);
    const organization = allCachedOrganizationsDict[organizationWeVoteId] || {};
    if (organization.position_list_for_one_election) {
      organization.position_list_for_one_election.forEach((onePosition) => {
        if (onePosition.ballot_item_we_vote_id && onePosition.ballot_item_we_vote_id === ballotItemWeVoteId && !resultFound) {
          // console.log('OrganizationStore, getOrganizationPositionByWeVoteId, onePosition: ', onePosition);
          requestedPosition = onePosition;
          resultFound = true; // Once a result is found, ignore all other positions
        }
      });
    }
    return requestedPosition;
  }

  getOrganizationsVoterIsFollowing () {
    // console.log('OrganizationStore.getOrganizationsVoterIsFollowing, organizationWeVoteIdsVoterIsFollowing: ', this.getState().organizationWeVoteIdsVoterIsFollowing);
    return this.returnOrganizationsFromListOfIds(this.getState().organizationWeVoteIdsVoterIsFollowing) || [];
  }

  getOrganizationsFollowedByVoterOnTwitter () {
    return this.returnOrganizationsFromListOfIds(this.getState().organizationWeVoteIdsVoterIsFollowingOnTwitter) || [];
  }

  doesOrganizationHavePositionOnCandidate (organizationWeVoteId, candidateWeVoteId) {
    const state = this.getState();
    const organization = state.allCachedOrganizationsDict[organizationWeVoteId];
    if (organization) {
      // console.log('OrganizationStore, doesOrganizationHavePositionOnCandidate, organization found');
      const positionListForOneElection = organization.position_list_for_one_election || [];
      // let positionListForAllExceptOneElection = organization.position_list_for_all_except_one_election || [];
      let onePosition = null;
      if (positionListForOneElection.length) {
        const candidateWeVoteIdsExtracted = [];
        for (let i = 0, len = positionListForOneElection.length; i < len; i++) {
          onePosition = positionListForOneElection[i];
          candidateWeVoteIdsExtracted.push(onePosition.ballot_item_we_vote_id);
        }
        return arrayContains(candidateWeVoteId, candidateWeVoteIdsExtracted);
      } else {
        // console.log('OrganizationStore, isVoterFollowingThisOrganization: NO organizationWeVoteIdsVoterIsFollowing, org_we_vote_id: ', organizationWeVoteId);
        return false;
      }
    } else {
      return false;
    }
  }

  doesOrganizationHavePositionOnOffice (organizationWeVoteId, contestOfficeWeVoteId) {
    const state = this.getState();
    const organization = state.allCachedOrganizationsDict[organizationWeVoteId];
    if (organization) {
      const positionListForOneElection = organization.position_list_for_one_election || [];
      // let positionListForAllExceptOneElection = organization.position_list_for_all_except_one_election || [];
      // console.log('OrganizationStore, doesOrganizationHavePositionOnOffice, organization found');
      let onePosition = null;
      if (positionListForOneElection.length) {
        const contestOfficeWeVoteIdsExtracted = [];
        for (let i = 0, len = positionListForOneElection.length; i < len; i++) {
          onePosition = positionListForOneElection[i];
          contestOfficeWeVoteIdsExtracted.push(onePosition.contestOfficeWeVoteId);
        }
        return arrayContains(contestOfficeWeVoteId, contestOfficeWeVoteIdsExtracted);
      } else {
        // console.log('OrganizationStore, isVoterFollowingThisOrganization: NO organizationWeVoteIdsVoterIsFollowing, org_we_vote_id: ', organizationWeVoteId);
        return false;
      }
    } else {
      return false;
    }
  }

  isVoterFollowingThisOrganization (organizationWeVoteId) {
    const { organizationWeVoteIdsVoterIsFollowing } = this.getState();
    // console.log('OrganizationStore, isVoterFollowingThisOrganization, organizationWeVoteIdsVoterIsFollowing: ', organizationWeVoteIdsVoterIsFollowing);
    if (organizationWeVoteIdsVoterIsFollowing.length) {
      const isFollowing = arrayContains(organizationWeVoteId, organizationWeVoteIdsVoterIsFollowing);
      // console.log('OrganizationStore, isVoterFollowingThisOrganization:', isFollowing, ', organizationWeVoteId:', organizationWeVoteId);
      return isFollowing;
    } else {
      // console.log('OrganizationStore, isVoterFollowingThisOrganization: NO organizationWeVoteIdsVoterIsFollowing, org_we_vote_id: ', organizationWeVoteId);
      return false;
    }
  }

  isVoterIgnoringThisOrganization (organizationWeVoteId) {
    const { organizationWeVoteIdsVoterIsIgnoring } = this.getState();
    // console.log('OrganizationStore, isVoterIgnoringThisOrganization, organizationWeVoteIdsVoterIsIgnoring: ', organizationWeVoteIdsVoterIsIgnoring);
    if (organizationWeVoteIdsVoterIsIgnoring.length) {
      const isIgnoring = arrayContains(organizationWeVoteId, organizationWeVoteIdsVoterIsIgnoring);
      // console.log('OrganizationStore, isVoterIgnoringThisOrganization:', isIgnoring, ', organizationWeVoteId:', organizationWeVoteId);
      return isIgnoring;
    } else {
      // console.log('OrganizationStore, isVoterIgnoringThisOrganization: NO organizationWeVoteIdsVoterIsIgnoring, org_we_vote_id: ', organizationWeVoteId);
      return false;
    }
  }

  getOrganizationSearchResultsOrganization () {
    // if only one organization is found, return the organization_twitter_handle
    const { organizationSearchResults } = this.getState();
    const numberOfSearchResults = organizationSearchResults.number_of_search_results || 0;
    if (numberOfSearchResults === 1) {
      const organizationsList = organizationSearchResults.organizations_list;
      return organizationsList[0];
    }
    return {};
  }

  getOrganizationSearchResultsOrganizationName () {
    const organization = this.getOrganizationSearchResultsOrganization();
    if (organization && organization.organization_name) {
      return organization.organization_name;
    }
    return '';
  }

  getOrganizationSearchResultsTwitterHandle () {
    const organization = this.getOrganizationSearchResultsOrganization();
    if (organization && organization.organization_twitter_handle) {
      return organization.organization_twitter_handle;
    }
    return '';
  }

  getOrganizationSearchResultsWebsite () {
    const organization = this.getOrganizationSearchResultsOrganization();
    if (organization && organization.organization_website) {
      return organization.organization_website;
    }
    return '';
  }

  _copyListsToNewOrganization (newOrganization, priorCopyOfOrganization) { // eslint-disable-line
    // console.log('newOrganization (_copyListsToNewOrganization): ', newOrganization);
    // console.log('priorCopyOfOrganization (_copyListsToNewOrganization): ', priorCopyOfOrganization);
    newOrganization.friends_position_list_for_one_election = priorCopyOfOrganization.friends_position_list_for_one_election;
    newOrganization.friends_position_list_for_all_except_one_election = priorCopyOfOrganization.friends_position_list_for_all_except_one_election;
    newOrganization.friends_position_list = priorCopyOfOrganization.friends_position_list;
    // The following line was removed because it prevented the rendering of an organization's banner. Issue #1582
    // newOrganization.organization_banner_url = priorCopyOfOrganization.organization_banner_url;
    newOrganization.position_list_for_one_election = priorCopyOfOrganization.position_list_for_one_election;
    newOrganization.position_list_for_all_except_one_election = priorCopyOfOrganization.position_list_for_all_except_one_election;
    newOrganization.position_list = priorCopyOfOrganization.position_list;
    return newOrganization;
  }

  reduce (state, action) {
    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success) return state;
    const {
      organizationWeVoteIdsFollowedByOrganizationDict, organizationWeVoteIdsFollowingByOrganizationDict,
      allCachedOrganizationsDict,
    } = state;
    let {
      organizationWeVoteIdsVoterIsFollowing, organizationWeVoteIdsVoterIsIgnoring,
    } = state;
    // let add_voterGuides_not_from_election;
    let organizationWeVoteId;
    let organization;
    let priorCopyOfOrganization;
    let organizationsFollowedOnTwitterList;
    // let search_string;
    let voterLinkedOrganizationWeVoteId;
    let voterGuides;
    const organizationsList = action.res.organizations_list || [];
    const numberOfSearchResults = organizationsList.length;
    const organizationWeVoteIdForVoterGuideOwner = action.res.organization_we_vote_id;

    switch (action.type) {
      case 'organizationFollow':
        // Following one org can change the support/oppose count for many ballot items for the voter
        SupportActions.positionsCountForAllBallotItems(VoterStore.electionId());
        // We also listen to 'organizationFollow' in VoterGuideStore so we can alter organizationWeVoteIds_to_follow_all and organizationWeVoteIds_to_follow_for_latest_ballot_item
        // voterLinkedOrganizationWeVoteId is the voter who clicked the Follow button
        voterLinkedOrganizationWeVoteId = action.res.voter_linked_organization_we_vote_id;
        // organizationWeVoteId is the organization that was just followed
        organizationWeVoteId = action.res.organization_we_vote_id;
        if (action.res.organization_follow_based_on_issue) {
          VoterGuideActions.voterGuidesToFollowRetrieveByIssuesFollowed(); // Whenever a voter follows a new org, update list
        } else {
          // search_string = "";
          // add_voterGuides_not_from_election = false;
          // Whenever a voter follows a new org, update list
          // VoterGuideActions.voterGuidesToFollowRetrieve(VoterStore.electionId(), search_string, add_voterGuides_not_from_election);  // DEBUG=1
        }
        // Update "who I am following" for the voter: voterLinkedOrganizationWeVoteId
        VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(voterLinkedOrganizationWeVoteId);
        // Update who the organization is followed by
        // 2018-05-02 NOT calling this for optimization (not critical)
        // VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(organizationWeVoteId);
        // 2018-05-02 NOT calling this for optimization (not critical)
        // VoterGuideActions.voterGuidesRecommendedByOrganizationRetrieve(organizationWeVoteId, VoterStore.electionId());
        // Update the guides the voter is following
        // 2018-05-02 NOT calling this for optimization (not critical)
        // VoterGuideActions.voterGuidesFollowedRetrieve();
        // Update the followers of the organization that was just followed: organizationWeVoteId
        // 2018-05-02 NOT calling this for optimization (not critical)
        // VoterGuideActions.voterGuideFollowersRetrieve(organizationWeVoteId);
        // Retrieve the organizations followed by voter
        OrganizationActions.organizationsFollowedRetrieve();
        if (!arrayContains(organizationWeVoteId, organizationWeVoteIdsVoterIsFollowing)) {
          organizationWeVoteIdsVoterIsFollowing = state.organizationWeVoteIdsVoterIsFollowing.concat(organizationWeVoteId);
        }
        return {
          ...state,
          organizationWeVoteIdsVoterIsFollowing,
          organizationWeVoteIdsVoterIsIgnoring: state.organizationWeVoteIdsVoterIsIgnoring.filter(
            existingOrgWeVoteId => existingOrgWeVoteId !== voterLinkedOrganizationWeVoteId,
          ),
        };

      case 'organizationSearch':
        return {
          ...state,
          organizationSearchResults: {
            organization_search_term: action.res.organization_search_term,
            organization_twitter_handle: action.res.organization_twitter_handle,
            number_of_search_results: numberOfSearchResults,
            organizations_list: organizationsList,
          },
        };

      case 'organizationStopFollowing':
        // We also listen to "organizationStopFollowing" in VoterGuideStore so we can alter organizationWeVoteIds_to_follow_all

        // Un-Following one org can change the support/oppose count for many ballot items for the voter
        SupportActions.positionsCountForAllBallotItems(VoterStore.electionId());
        // voterLinkedOrganizationWeVoteId is the voter who clicked the Follow button
        voterLinkedOrganizationWeVoteId = action.res.voter_linked_organization_we_vote_id;
        // organizationWeVoteId is the organization that was just followed
        organizationWeVoteId = action.res.organization_we_vote_id;
        // search_string = "";
        // add_voterGuides_not_from_election = false;
        // Whenever a voter follows a new org, update list
        // 2018-05-02 NOT calling this for optimization (not critical)
        // VoterGuideActions.voterGuidesToFollowRetrieve(VoterStore.electionId(), search_string, add_voterGuides_not_from_election);
        // Update "who I am following" for the voter: voterLinkedOrganizationWeVoteId
        // 2018-05-02 NOT calling this for optimization (not critical)
        // VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(voterLinkedOrganizationWeVoteId);
        // Update who the organization is followed by
        // 2018-05-02 NOT calling this for optimization (not critical)
        // VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(organizationWeVoteId);
        // VoterGuideActions.voterGuidesRecommendedByOrganizationRetrieve(organizationWeVoteId, VoterStore.electionId());
        // Update the guides the voter is following
        VoterGuideActions.voterGuidesFollowedRetrieve();
        // Update the followers of the organization that was just un-followed: organizationWeVoteId
        // 2018-05-02 NOT calling this for optimization (not critical)
        // VoterGuideActions.voterGuideFollowersRetrieve(organizationWeVoteId);
        // Retrieve the organizations followed by voter
        OrganizationActions.organizationsFollowedRetrieve();
        return {
          ...state,
          organizationWeVoteIdsVoterIsFollowing: state.organizationWeVoteIdsVoterIsFollowing.filter(existingOrgWeVoteId => existingOrgWeVoteId !== organizationWeVoteId),
        };

      case 'organizationFollowIgnore':
        // We also listen to "organizationFollowIgnore" in VoterGuideStore so we can alter organizationWeVoteIds_to_follow_all and organizationWeVoteIds_to_follow_for_latest_ballot_item

        // Ignoring one org can change the support/oppose count for many ballot items for the voter
        SupportActions.positionsCountForAllBallotItems(VoterStore.electionId());
        // voterLinkedOrganizationWeVoteId is the voter who clicked the Follow button
        voterLinkedOrganizationWeVoteId = action.res.voter_linked_organization_we_vote_id;
        // organizationWeVoteId is the organization that was just followed
        organizationWeVoteId = action.res.organization_we_vote_id;
        // search_string = "";
        // add_voterGuides_not_from_election = false;
        // Whenever a voter follows a new org, update list
        // VoterGuideActions.voterGuidesToFollowRetrieve(VoterStore.electionId(), search_string, add_voterGuides_not_from_election); // DEBUG=1
        // Update "who I am following" for the voter: voterLinkedOrganizationWeVoteId
        // 2018-05-02 NOT calling this for optimization (not critical)
        // VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(voterLinkedOrganizationWeVoteId);
        // Update who the organization is followed by
        // 2018-05-02 NOT calling this for optimization (not critical)
        // VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(organizationWeVoteId);
        // VoterGuideActions.voterGuidesRecommendedByOrganizationRetrieve(organizationWeVoteId, VoterStore.electionId());
        // Update the guides the voter is following
        // 2018-05-02 NOT calling this for optimization (not critical)
        // VoterGuideActions.voterGuidesFollowedRetrieve();
        // Update the followers of the organization that was just ignored: organizationWeVoteId
        // 2018-05-02 NOT calling this for optimization (not critical)
        // VoterGuideActions.voterGuideFollowersRetrieve(organizationWeVoteId);
        // Go through all of the candidates currently on the ballot and update their positions
        // candidateWeVoteId = "wv01cand5887"; // TODO TEMP
        // CandidateActions.positionListForBallotItem(candidateWeVoteId);
        // Retrieve the organizations followed by voter
        OrganizationActions.organizationsFollowedRetrieve();
        if (!arrayContains(organizationWeVoteId, organizationWeVoteIdsVoterIsIgnoring)) {
          organizationWeVoteIdsVoterIsIgnoring = state.organizationWeVoteIdsVoterIsIgnoring.concat(organizationWeVoteId);
        }
        return {
          ...state,
          organizationWeVoteIdsVoterIsIgnoring,
          organizationWeVoteIdsVoterIsFollowing: state.organizationWeVoteIdsVoterIsFollowing.filter(
            existingOrgWeVoteId => existingOrgWeVoteId !== organizationWeVoteId,
          ),
        };

      case 'error-organizationFollowIgnore' || 'error-organizationFollow':
        console.log('error: ', action);
        return state;

      // After an organization is created, return it
      case 'organizationSave':
        if (action.res.success) {
          organizationWeVoteId = action.res.organization_we_vote_id;
          organization = action.res;
          // Make sure to maintain the lists we attach to the organization from other API calls
          if (allCachedOrganizationsDict[organizationWeVoteId]) {
            priorCopyOfOrganization = allCachedOrganizationsDict[organizationWeVoteId];
            organization = this._copyListsToNewOrganization(organization, priorCopyOfOrganization);
          }
          allCachedOrganizationsDict[organizationWeVoteId] = organization;
          return {
            ...state,
            allCachedOrganizationsDict,
          };
        }
        return state;

      case 'organizationsFollowedRetrieve':
        // console.log('OrganizationStore organizationsFollowedRetrieve, action.res: ', action.res);
        if (action.res.success) {
          if (action.res.auto_followed_from_twitter_suggestion) {
            organizationsFollowedOnTwitterList = action.res.organization_list;
            const organizationWeVoteIdsVoterIsFollowingOnTwitter = [];
            organizationsFollowedOnTwitterList.forEach((oneOrganization) => {
              allCachedOrganizationsDict[organization.organization_we_vote_id] = oneOrganization;
              organizationWeVoteIdsVoterIsFollowingOnTwitter.push(oneOrganization.organization_we_vote_id);
            });
            return {
              ...state,
              organizationWeVoteIdsVoterIsFollowingOnTwitter,
              allCachedOrganizationsDict,
            };
          } else {
            const organizationList = action.res.organization_list;
            organizationWeVoteIdsVoterIsFollowing = [];
            let revisedOrganization;
            organizationList.forEach((oneOrganization) => {
              organizationWeVoteId = oneOrganization.organization_we_vote_id;
              // Make sure to maintain the lists we attach to the organization from other API calls
              if (allCachedOrganizationsDict[organizationWeVoteId]) {
                priorCopyOfOrganization = allCachedOrganizationsDict[organizationWeVoteId];
                revisedOrganization = this._copyListsToNewOrganization(oneOrganization, priorCopyOfOrganization);
                allCachedOrganizationsDict[organizationWeVoteId] = revisedOrganization;
              } else {
                allCachedOrganizationsDict[organizationWeVoteId] = oneOrganization;
              }
              if (!arrayContains(oneOrganization.organization_we_vote_id, organizationWeVoteIdsVoterIsFollowing)) {
                organizationWeVoteIdsVoterIsFollowing.push(oneOrganization.organization_we_vote_id);
              }
            });
            // console.log('organizationWeVoteIdsVoterIsFollowing:', organizationWeVoteIdsVoterIsFollowing);
            // console.log('allCachedOrganizationsDict:', allCachedOrganizationsDict);
            return {
              ...state,
              organizationWeVoteIdsVoterIsFollowing,
              allCachedOrganizationsDict,
            };
          }
        }
        return state;

      case 'organizationRetrieve':
        organizationWeVoteId = action.res.organization_we_vote_id;
        organization = action.res;

        // Make sure to maintain the lists we attach to the organization from other API calls
        if (allCachedOrganizationsDict[organizationWeVoteId]) {
          priorCopyOfOrganization = allCachedOrganizationsDict[organizationWeVoteId];
          organization = this._copyListsToNewOrganization(organization, priorCopyOfOrganization);
        }
        allCachedOrganizationsDict[organizationWeVoteId] = organization;
        return {
          ...state,
          allCachedOrganizationsDict,
        };

      case 'positionListForOpinionMaker': // ...and positionListForOpinionMakerForFriends
        // console.log('OrganizationStore, positionListForOpinionMaker response');
        // TODO: position_list *might* include positions from multiple elections
        organizationWeVoteId = action.res.opinion_maker_we_vote_id;
        if (action.res.friends_vs_public === 'FRIENDS_ONLY') { // positionListForOpinionMakerForFriends
          if (action.res.filter_for_voter) {
            const friendsPositionListForOneElection = action.res.position_list;
            organization = allCachedOrganizationsDict[organizationWeVoteId] || {};

            // Make sure to maintain the lists we attach to the organization from other API calls
            if (allCachedOrganizationsDict[organizationWeVoteId]) {
              priorCopyOfOrganization = allCachedOrganizationsDict[organizationWeVoteId];
              organization = this._copyListsToNewOrganization(organization, priorCopyOfOrganization);
            }
            // And now update the friendsPositionListForOneElection
            organization.friends_position_list_for_one_election = friendsPositionListForOneElection;
            // console.log('organization-FRIENDS_ONLY-filter_for_voter: ', organization);
            allCachedOrganizationsDict[organizationWeVoteId] = organization;
            return {
              ...state,
              allCachedOrganizationsDict,
            };
          } else if (action.res.filter_out_voter) {
            const friendsPositionListForAllExceptOneElection = action.res.position_list;
            organization = allCachedOrganizationsDict[organizationWeVoteId] || {};

            // Make sure to maintain the lists we attach to the organization from other API calls
            if (allCachedOrganizationsDict[organizationWeVoteId]) {
              priorCopyOfOrganization = allCachedOrganizationsDict[organizationWeVoteId];
              organization = this._copyListsToNewOrganization(organization, priorCopyOfOrganization);
            }
            // And now update the friendsPositionListForAllExceptOneElection
            organization.friends_position_list_for_all_except_one_election = friendsPositionListForAllExceptOneElection;
            // console.log('organization-FRIENDS_ONLY-filter_out_voter: ', organization);
            allCachedOrganizationsDict[organizationWeVoteId] = organization;
            return {
              ...state,
              allCachedOrganizationsDict,
            };
          } else {
            const friendsPositionList = action.res.position_list;
            organization = allCachedOrganizationsDict[organizationWeVoteId] || {};

            // Make sure to maintain the lists we attach to the organization from other API calls
            if (allCachedOrganizationsDict[organizationWeVoteId]) {
              priorCopyOfOrganization = allCachedOrganizationsDict[organizationWeVoteId];
              organization = this._copyListsToNewOrganization(organization, priorCopyOfOrganization);
            }
            // And now update the friendsPositionList
            organization.friends_position_list = friendsPositionList;
            // console.log('organization-FRIENDS_ONLY-first else: ', organization);
            allCachedOrganizationsDict[organizationWeVoteId] = organization;
            return {
              ...state,
              allCachedOrganizationsDict,
            };
          }
        } else // positionListForOpinionMaker, else for action.res.friends_vs_public === "FRIENDS_ONLY"
        if (action.res.filter_for_voter) {
          const positionListForOneElection = action.res.position_list;
          organization = allCachedOrganizationsDict[organizationWeVoteId] || {};

          // Make sure to maintain the lists we attach to the organization from other API calls
          if (allCachedOrganizationsDict[organizationWeVoteId]) {
            priorCopyOfOrganization = allCachedOrganizationsDict[organizationWeVoteId];
            organization = this._copyListsToNewOrganization(organization, priorCopyOfOrganization);
          }
          organization.position_list_for_one_election = positionListForOneElection;
          // console.log('organization-NOT FRIENDS_ONLY-filter_for_voter: ', organization);
          allCachedOrganizationsDict[organizationWeVoteId] = organization;
          return {
            ...state,
            allCachedOrganizationsDict,
          };
        } else if (action.res.filter_out_voter) {
          const positionListForAllExceptOneElection = action.res.position_list;
          organization = allCachedOrganizationsDict[organizationWeVoteId] || {};

          // Make sure to maintain the lists we attach to the organization from other API calls
          if (allCachedOrganizationsDict[organizationWeVoteId]) {
            priorCopyOfOrganization = allCachedOrganizationsDict[organizationWeVoteId];
            organization = this._copyListsToNewOrganization(organization, priorCopyOfOrganization);
          }
          organization.position_list_for_all_except_one_election = positionListForAllExceptOneElection;
          // console.log('organization-NOT FRIENDS_ONLY-filter_out_voter: ', organization);
          allCachedOrganizationsDict[organizationWeVoteId] = organization;
          return {
            ...state,
            allCachedOrganizationsDict,
          };
        } else {
          const positionList = action.res.position_list;
          organization = allCachedOrganizationsDict[organizationWeVoteId] || {};

          // Make sure to maintain the lists we attach to the organization from other API calls
          if (allCachedOrganizationsDict[organizationWeVoteId]) {
            priorCopyOfOrganization = allCachedOrganizationsDict[organizationWeVoteId];
            organization = this._copyListsToNewOrganization(organization, priorCopyOfOrganization);
          }
          organization.position_list = positionList;
          // console.log('organization-NOT FRIENDS_ONLY-no filter: ', organization);
          allCachedOrganizationsDict[organizationWeVoteId] = organization;
          return {
            ...state,
            allCachedOrganizationsDict,
          };
        }

      case 'voterGuidesFollowedByOrganizationRetrieve':
        // In VoterGuideStore we listen for "voterGuidesFollowedByOrganizationRetrieve" so we can update
        //  all_cached_voterGuides and organizationWeVoteIds_to_follow_organization_recommendation_dict
        voterGuides = action.res.voter_guides;
        // We want to show *all* organizations followed by the organization on the "Following" tab
        if (action.res.filter_by_this_google_civic_election_id && action.res.filter_by_this_google_civic_election_id !== '') {
          // Ignore the results if filtered by google_civic_election_id
          return {
            ...state,
          };
        } else {
          // console.log('voterGuidesFollowedByOrganizationRetrieve NO election_id, organizationWeVoteIdForVoterGuideOwner: ', organizationWeVoteIdForVoterGuideOwner);
          organizationWeVoteIdsFollowedByOrganizationDict[organizationWeVoteIdForVoterGuideOwner] = [];
          voterGuides.forEach((oneVoterGuide) => {
            organizationWeVoteIdsFollowedByOrganizationDict[organizationWeVoteIdForVoterGuideOwner].push(oneVoterGuide.organization_we_vote_id);
          });
          return {
            ...state,
            organizationWeVoteIdsFollowedByOrganizationDict,
          };
        }

      case 'voterGuideFollowersRetrieve':
        // In VoterGuideStore, we also listen for a response to "voterGuideFollowersRetrieve" and update all_cached_voterGuides
        voterGuides = action.res.voter_guides;
        // Reset the followers for this organization
        organizationWeVoteIdsFollowingByOrganizationDict[action.res.organization_we_vote_id] = [];
        voterGuides.forEach((oneVoterGuide) => {
          organizationWeVoteIdsFollowingByOrganizationDict[action.res.organization_we_vote_id].push(oneVoterGuide.organization_we_vote_id);
        });
        return {
          ...state,
          organizationWeVoteIdsFollowingByOrganizationDict,
        };

        // case 'voterGuidesFollowedRetrieve':
        //   // In VoterGuideStore, we listen for a response to "voterGuidesFollowedRetrieve" and update all_cached_voterGuides
        //   // In OrganizationStore, we listen for a response to "organizationsFollowedRetrieve" instead of "voterGuidesFollowedRetrieve"

      case 'voterGuidesIgnoredRetrieve':
        // In OrganizationStore, we also listen for a response to "voterGuidesIgnoredRetrieve" and update organizationWeVoteIdsVoterIsIgnoring
        voterGuides = action.res.voter_guides;
        organizationWeVoteIdsVoterIsIgnoring = [];
        voterGuides.forEach((oneVoterGuide) => {
          if (!arrayContains(oneVoterGuide.organization_we_vote_id, organizationWeVoteIdsVoterIsIgnoring)) {
            organizationWeVoteIdsVoterIsIgnoring.push(oneVoterGuide.organization_we_vote_id);
          }
        });
        return {
          ...state,
          organizationWeVoteIdsVoterIsIgnoring,
        };

      case 'voterSignOut':
        // console.log('resetting OrganizationStore');
        return this.resetState();

      default:
        return state;
    }
  }
}

export default new OrganizationStore(Dispatcher);
