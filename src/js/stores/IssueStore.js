import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/Dispatcher';
import BallotStore from './BallotStore';
import IssueActions from '../actions/IssueActions';
import OrganizationStore from './OrganizationStore';
import VoterStore from './VoterStore';
import VoterGuideStore from './VoterGuideStore';
import VoterGuideActions from '../actions/VoterGuideActions';
import { arrayContains, removeValueFromArray } from '../utils/textFormat';

class IssueStore extends ReduceStore {
  getInitialState () {
    return {
      issueSupportScoreForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: support_score
      issueOpposeScoreForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: oppose_score
      organizationWeVoteIdSupportListForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs supporting this ballot item
      organizationWeVoteIdOpposeListForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs opposing this ballot item
      organizationNameSupportListForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs supporting this ballot item
      organizationNameOpposeListForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs opposing this ballot item
      issueScoreForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: calculated score
      issueWeVoteIdsVoterIsFollowing: [], // These are issues a particular voter is following
      issueWeVoteIdsVoterCanFollow: [], // These are issues a particular voter can follow
      issueWeVoteIdsToLinkToByOrganizationDict: {}, // Dictionary with key: organizationWeVoteId, list: issueWeVoteId that the organization can link to
      issueWeVoteIdsLinkedToByOrganizationDict: {}, // Dictionary with key: organizationWeVoteId, list: issueWeVoteId that the organization is linked to
      issueWeVoteIdsUnderEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, list: issueWeVoteId. An org with that issue has a position in this election
      organizationWeVoteIdsLinkedToIssueDict: {}, // Dictionary with key: issueWeVoteId, list: organizationWeVoteId that is linked to this issue
      allCachedIssues: {}, // Dictionary with key: issueWeVoteId, and value: complete issue object
      googleCivicElectionId: 0,
    };
  }

  resetState () {
    // Reset this to include all issues
    const issueWeVoteIdsVoterCanFollow = Object.keys(this.getState().allCachedIssues);
    const state = this.getState();
    return {
      ...state,
      issueSupportScoreForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: support_score
      issueOpposeScoreForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: oppose_score
      organizationWeVoteIdSupportListForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs supporting this ballot item
      organizationWeVoteIdOpposeListForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs opposing this ballot item
      organizationNameSupportListForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs supporting this ballot item
      organizationNameOpposeListForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs opposing this ballot item
      issueScoreForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: calculated score
      issueWeVoteIdsVoterIsFollowing: [], // These are issues a particular voter is following
      issueWeVoteIdsVoterCanFollow, // These are issues a particular voter can follow
      issueWeVoteIdsToLinkToByOrganizationDict: {}, // Dictionary with key: organizationWeVoteId, list: issueWeVoteId that the organization can link to
      issueWeVoteIdsLinkedToByOrganizationDict: {}, // Dictionary with key: organizationWeVoteId, list: issueWeVoteId that the organization is linked to
      // LEAVE DATA: issueWeVoteIdsUnderEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, list: issueWeVoteId. An org with that issue has a position in this election
      // LEAVE DATA: organizationWeVoteIdsLinkedToIssueDict: {}, // Dictionary with key: issueWeVoteId, list: organizationWeVoteId that is linked to this issue
      // LEAVE DATA: allCachedIssues: {}, // Dictionary with key: issueWeVoteId, and value: complete issue object
      googleCivicElectionId: 0,
    };
  }

  getAllIssues () {
    // List of all issue objects
    const allIssueKeys = Object.keys(this.getState().allCachedIssues);
    return this.getIssuesFromListOfWeVoteIds(allIssueKeys);
  }

  getIssuesVoterIsFollowing () {
    // List of issue objects the voter is already following
    return this.getIssuesFromListOfWeVoteIds(this.getState().issueWeVoteIdsVoterIsFollowing);
  }

  getIssuesVoterCanFollow () {
    // List of issue objects the voter can follow
    return this.getIssuesFromListOfWeVoteIds(this.getState().issueWeVoteIdsVoterCanFollow);
  }

  getIssueWeVoteIdsVoterIsFollowing () {
    return this.getState().issueWeVoteIdsVoterIsFollowing;
  }

  isVoterFollowingThisIssue (issueWeVoteId) {
    if (!issueWeVoteId) {
      return false;
    }
    return arrayContains(issueWeVoteId, this.getState().issueWeVoteIdsVoterIsFollowing);
  }

  getIssuesToLinkToByOrganization (organizationWeVoteId) {
    // These are issues that an organization can link itself to, to help Voters find the organization
    const issueWeVoteIdListToLinkForOrganization = this.getState().issueWeVoteIdsToLinkToByOrganizationDict[organizationWeVoteId];
    if (issueWeVoteIdListToLinkForOrganization === undefined) {
      return [];
    }
    // List of issue objects that an organization can link to
    return this.getIssuesFromListOfWeVoteIds(issueWeVoteIdListToLinkForOrganization);
  }

  getIssueWeVoteIdsLinkedToByOrganization (organizationWeVoteId) {
    if (!organizationWeVoteId) {
      return [];
    }
    // These are issues that an organization has linked itself to, to help Voters find the organization
    const issueWeVoteIdsLinkedToOrganization = this.getState().issueWeVoteIdsLinkedToByOrganizationDict[organizationWeVoteId];
    // console.log('getIssueWeVoteIdsLinkedToByOrganization issueWeVoteIdsLinkedToOrganization:', issueWeVoteIdsLinkedToOrganization);
    if (issueWeVoteIdsLinkedToOrganization === undefined) {
      return [];
    }
    // List of issue objects that an organization is linked to
    return issueWeVoteIdsLinkedToOrganization;
  }

  getIssuesLinkedToByOrganization (organizationWeVoteId) {
    if (!organizationWeVoteId) {
      return [];
    }
    // These are issues that an organization has linked itself to, to help Voters find the organization
    const issueWeVoteIdsLinkedToOrganization = this.getState().issueWeVoteIdsLinkedToByOrganizationDict[organizationWeVoteId];
    // console.log('getIssuesLinkedToByOrganization issueWeVoteIdsLinkedToOrganization:', issueWeVoteIdsLinkedToOrganization);
    if (issueWeVoteIdsLinkedToOrganization === undefined) {
      return [];
    }
    // List of issue objects that an organization is linked to
    return this.getIssuesFromListOfWeVoteIds(issueWeVoteIdsLinkedToOrganization);
  }

  getIssuesLinkedToByOrganizationCount (organizationWeVoteId) {
    if (!organizationWeVoteId) {
      return 0;
    }
    // These are issues that an organization has linked itself to, to help Voters find the organization
    const issueWeVoteIdsLinkedToOrganization = this.getState().issueWeVoteIdsLinkedToByOrganizationDict[organizationWeVoteId];
    if (issueWeVoteIdsLinkedToOrganization === undefined) {
      return 0;
    } else {
      return issueWeVoteIdsLinkedToOrganization.length;
    }
  }

  getIssuesFromListOfWeVoteIds (listOfIssueWeVoteIds) {
    const { allCachedIssues } = this.getState();
    // console.log('getIssuesFromListOfWeVoteIds listOfIssueWeVoteIds: ', listOfIssueWeVoteIds);
    // make sure that listOfIssueWeVoteIds has unique values
    const uniqListOfIssueWeVoteIds = listOfIssueWeVoteIds.filter((value, index, self) => self.indexOf(value) === index);

    const issuesList = [];
    uniqListOfIssueWeVoteIds.forEach((issueWeVoteId) => {
      if (allCachedIssues[issueWeVoteId]) {
        issuesList.push(allCachedIssues[issueWeVoteId]);
      }
    });
    // console.log('getIssuesFromListOfWeVoteIds issuesList: ', issuesList);

    return issuesList;
  }

  getIssuesScoreByBallotItemWeVoteId (ballotItemWeVoteId) {
    if (!ballotItemWeVoteId) {
      return 0;
    }
    // These are scores based on all of the organizations under all of the issues a voter follows
    const issueScore = this.getState().issueScoreForEachBallotItem[ballotItemWeVoteId];
    if (issueScore === undefined) {
      return 0;
    }
    //
    return issueScore;
  }

  getIssueByWeVoteId (issueWeVoteId) {
    const issue = this.getState().allCachedIssues[issueWeVoteId];
    if (issue === undefined) {
      return {};
    }
    return issue;
  }

  getOrganizationsForOneIssue (issueWeVoteId) {
    // We want a list of all organizations tagged with this issue, so we can offer organizations to follow
    // These are issues that an organization has linked itself to, to help Voters find the organization
    const organizationWeVoteIdsLinkedToIssue = this.getState().organizationWeVoteIdsLinkedToIssueDict[issueWeVoteId];
    // console.log('getOrganizationsForOneIssue: ', organizationWeVoteIdsLinkedToIssue);
    if (organizationWeVoteIdsLinkedToIssue === undefined) {
      return [];
    }
    // List of issue objects that an organization is linked to
    return OrganizationStore.returnOrganizationsFromListOfIds(organizationWeVoteIdsLinkedToIssue);
  }

  getVoterGuidesForOneIssue (issueWeVoteId) {
    // We want a list of all organizations tagged with this issue, so we can offer organizations to follow
    // These are issues that an organization has linked itself to, to help Voters find the organization
    // console.log('IssueStore, getVoterGuidesForOneIssue, this.getState().organizationWeVoteIdsLinkedToIssueDict: ', this.getState().organizationWeVoteIdsLinkedToIssueDict);
    const organizationWeVoteIdsLinkedToIssue = this.getState().organizationWeVoteIdsLinkedToIssueDict[issueWeVoteId];
    // console.log('getOrganizationsForOneIssue: ', organizationWeVoteIdsLinkedToIssue);
    if (organizationWeVoteIdsLinkedToIssue === undefined) {
      return [];
    }
    // List of issue objects that an organization is linked to
    return VoterGuideStore.returnVoterGuidesFromListOfIds(organizationWeVoteIdsLinkedToIssue);
  }

  // getPositionsForBallotItemForOneIssue (ballotItemWeVoteId, issueWeVoteId) {
  //   // We want a list of positions about this candidate or measure, where the org taking the position
  //   // is tagged with this issue
  // }

  // getVoterGuidesForElectionForOneIssue (google_civic_election_id, issueWeVoteId) {
  //   // We want a list of all voterGuides/organizations tagged with this issue that have a position in this election
  //
  // }

  getOrganizationWeVoteIdSupportListUnderThisBallotItem (ballotItemWeVoteId) {
    // What are the issues that have positions for this election under this ballot item?
    // console.log('getIssuesUnderThisBallotItem, ballotItemWeVoteId:', ballotItemWeVoteId);
    if (ballotItemWeVoteId && this.getState().organizationWeVoteIdSupportListForEachBallotItem) {
      return this.getState().organizationWeVoteIdSupportListForEachBallotItem[ballotItemWeVoteId] || [];
    } else {
      return [];
    }
  }

  getOrganizationNameSupportListUnderThisBallotItem (ballotItemWeVoteId) {
    if (ballotItemWeVoteId && this.getState().organizationNameSupportListForEachBallotItem) {
      return this.getState().organizationNameSupportListForEachBallotItem[ballotItemWeVoteId] || [];
    } else {
      return [];
    }
  }

  getOrganizationNameOpposeListUnderThisBallotItem (ballotItemWeVoteId) {
    if (ballotItemWeVoteId && this.getState().organizationNameOpposeListForEachBallotItem) {
      return this.getState().organizationNameOpposeListForEachBallotItem[ballotItemWeVoteId] || [];
    } else {
      return [];
    }
  }

  getIssuesUnderThisBallotItem (ballotItemWeVoteId) {
    // What are the issues that have positions for this election under this ballot item?
    // console.log('getIssuesUnderThisBallotItem, ballotItemWeVoteId:', ballotItemWeVoteId);
    if (ballotItemWeVoteId && this.getState().issueWeVoteIdsUnderEachBallotItem) {
      const issuesForThisBallotItem = this.getState().issueWeVoteIdsUnderEachBallotItem[ballotItemWeVoteId] || [];
      // console.log('getIssuesUnderThisBallotItem, issuesForThisBallotItem: ', issuesForThisBallotItem);
      return this.getIssuesFromListOfWeVoteIds(issuesForThisBallotItem);
    } else {
      return [];
    }
  }

  getIssuesCountUnderThisBallotItem (ballotItemWeVoteId) {
    // What are the issues that have positions for this election under this ballot item?
    // console.log('getIssuesUnderThisBallotItem, ballotItemWeVoteId:', ballotItemWeVoteId);
    if (ballotItemWeVoteId && this.getState().issueWeVoteIdsUnderEachBallotItem) {
      const issuesForThisBallotItem = this.getState().issueWeVoteIdsUnderEachBallotItem[ballotItemWeVoteId] || [];
      // console.log('getIssuesUnderThisBallotItem, issuesForThisBallotItem: ', issuesForThisBallotItem);
      return issuesForThisBallotItem.length;
    } else {
      return 0;
    }
  }

  getIssuesUnderThisBallotItemVoterIsFollowing (ballotItemWeVoteId) {
    // What are the issues that have positions for this election under this ballot item?
    // console.log('getIssuesUnderThisBallotItemVoterIsFollowing, ballotItemWeVoteId:', ballotItemWeVoteId);
    // console.log('getIssuesUnderThisBallotItemVoterIsFollowing, this.getState().issueWeVoteIdsUnderEachBallotItem:', this.getState().issueWeVoteIdsUnderEachBallotItem);
    const issuesUnderThisBallotItemVoterIsFollowing = [];
    if (ballotItemWeVoteId && this.getState().issueWeVoteIdsUnderEachBallotItem && this.getState().issueWeVoteIdsVoterIsFollowing) {
      const issuesForThisBallotItem = this.getState().issueWeVoteIdsUnderEachBallotItem[ballotItemWeVoteId] || [];
      // Remove issues the voter is not following
      issuesForThisBallotItem.forEach((issueWeVoteId) => {
        if (arrayContains(issueWeVoteId, this.getState().issueWeVoteIdsVoterIsFollowing)) {
          issuesUnderThisBallotItemVoterIsFollowing.push(issueWeVoteId);
        }
      });
      // console.log('getIssuesUnderThisBallotItemVoterIsFollowing, issuesUnderThisBallotItemVoterIsFollowing: ', issuesUnderThisBallotItemVoterIsFollowing);
      return this.getIssuesFromListOfWeVoteIds(issuesUnderThisBallotItemVoterIsFollowing);
    } else {
      // console.log('getIssuesUnderThisBallotItemVoterIsFollowing missing required variables');
      return [];
    }
  }

  getIssuesCountUnderThisBallotItemVoterIsFollowing (ballotItemWeVoteId) {
    // What is the number of issues that have positions for this election under this ballot item?
    const issuesUnderThisBallotItemVoterIsFollowing = [];
    if (ballotItemWeVoteId && this.getState().issueWeVoteIdsUnderEachBallotItem && this.getState().issueWeVoteIdsVoterIsFollowing) {
      const issuesForThisBallotItem = this.getState().issueWeVoteIdsUnderEachBallotItem[ballotItemWeVoteId] || [];
      // Remove issues the voter is not following
      issuesForThisBallotItem.forEach((issueWeVoteId) => {
        if (arrayContains(issueWeVoteId, this.getState().issueWeVoteIdsVoterIsFollowing)) {
          issuesUnderThisBallotItemVoterIsFollowing.push(issueWeVoteId);
        }
      });
      return issuesUnderThisBallotItemVoterIsFollowing.length;
    } else {
      return 0;
    }
  }

  getIssuesUnderThisBallotItemVoterNotFollowing (ballotItemWeVoteId) {
    // What are the issues that have positions for this election under this ballot item?
    // console.log('getIssuesUnderThisBallotItemVoterNotFollowing, ballotItemWeVoteId:', ballotItemWeVoteId);
    // console.log('this.getState().issueWeVoteIdsVoterIsFollowing:', this.getState().issueWeVoteIdsVoterIsFollowing);
    const issuesUnderThisBallotItemVoterNotFollowing = [];
    if (ballotItemWeVoteId && this.getState().issueWeVoteIdsUnderEachBallotItem && this.getState().issueWeVoteIdsVoterIsFollowing) {
      const issuesForThisBallotItem = this.getState().issueWeVoteIdsUnderEachBallotItem[ballotItemWeVoteId] || [];
      // console.log('BEFORE getIssuesUnderThisBallotItemVoterNotFollowing, issuesForThisBallotItem:', issuesForThisBallotItem);
      // Remove issues the voter is already following
      issuesForThisBallotItem.forEach((issueWeVoteId) => {
        if (!arrayContains(issueWeVoteId, this.getState().issueWeVoteIdsVoterIsFollowing)) {
          issuesUnderThisBallotItemVoterNotFollowing.push(issueWeVoteId);
        }
      });
      // console.log('AFTER getIssuesUnderThisBallotItemVoterNotFollowing, issuesForThisBallotItem: ', issuesForThisBallotItem);
      return this.getIssuesFromListOfWeVoteIds(issuesUnderThisBallotItemVoterNotFollowing);
    } else {
      return [];
    }
  }

  getPreviousGoogleCivicElectionId () {
    return this.getState().googleCivicElectionId;
  }

  reduce (state, action) {
    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success) return state;
    let {
      issueSupportScoreForEachBallotItem, issueOpposeScoreForEachBallotItem, issueWeVoteIdsUnderEachBallotItem,
      organizationWeVoteIdSupportListForEachBallotItem, organizationWeVoteIdOpposeListForEachBallotItem,
      organizationNameSupportListForEachBallotItem, organizationNameOpposeListForEachBallotItem,
      issueScoreForEachBallotItem, issueWeVoteIdsVoterCanFollow, issueWeVoteIdsLinkedToByOrganizationDict,
    } = state;
    const { allCachedIssues, issueWeVoteIdsVoterIsFollowing, issueWeVoteIdsToLinkToByOrganizationDict } = state;
    let ballotItemWeVoteId;
    let issueList;
    let issueScoreList;
    let issuesUnderBallotItemsList;
    let organizationWeVoteIdsForIssue;
    let linkedIssueListForOneOrganization = [];
    let listOfIssuesForThisOrg;
    let newPositionList;
    let organizationWeVoteId;
    let organizationWeVoteIdsLinkedToIssueDict;
    let revisedState;
    let voterElectionId;
    let voterGuides;
    let googleCivicElectionId;

    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success) return state;

    let candidatesUnderThisOffice;
    let tempNewIssues;
    const toLinkToIssueListForOneOrganization = [];

    switch (action.type) {
      case 'issueFollow':
        // When a voter follows or unfollows an issue on the ballot intro modal screen, update the voter guide list
        VoterGuideActions.voterGuidesToFollowRetrieveByIssuesFollowed();
        if (action.res.google_civic_election_id && action.res.google_civic_election_id > 0) {
          IssueActions.issuesRetrieveForElection(action.res.google_civic_election_id);
        } else {
          voterElectionId = VoterStore.electionId();
          if (voterElectionId && voterElectionId > 0) {
            IssueActions.issuesRetrieveForElection(voterElectionId);
          } else {
            IssueActions.issuesRetrieve();
          }
        }
        // Update quickly the list of issues we want to offer to the voter to follow
        if (action.res.issue_we_vote_id) {
          issueWeVoteIdsVoterCanFollow = removeValueFromArray(issueWeVoteIdsVoterCanFollow, action.res.issue_we_vote_id);
        }
        return {
          ...state,
          issueWeVoteIdsVoterCanFollow,
        };

      case 'issuesRetrieve':
        issueList = action.res.issue_list;
        revisedState = state;
        googleCivicElectionId = action.res.google_civic_election_id === false ? state.googleCivicElectionId : action.res.google_civic_election_id;

        if (action.res.issue_score_list) {
          issueScoreList = action.res.issue_score_list;
          if (issueScoreList.length) {
            issueScoreList.forEach((issueScoreBlock) => {
              issueSupportScoreForEachBallotItem[issueScoreBlock.ballot_item_we_vote_id] = issueScoreBlock.issue_support_score;
              issueOpposeScoreForEachBallotItem[issueScoreBlock.ballot_item_we_vote_id] = issueScoreBlock.issue_oppose_score;
              organizationWeVoteIdSupportListForEachBallotItem[issueScoreBlock.ballot_item_we_vote_id] = issueScoreBlock.organizationWeVoteId_support_list;
              organizationWeVoteIdOpposeListForEachBallotItem[issueScoreBlock.ballot_item_we_vote_id] = issueScoreBlock.organizationWeVoteId_oppose_list;
              organizationNameSupportListForEachBallotItem[issueScoreBlock.ballot_item_we_vote_id] = issueScoreBlock.organization_name_support_list;
              organizationNameOpposeListForEachBallotItem[issueScoreBlock.ballot_item_we_vote_id] = issueScoreBlock.organization_name_oppose_list;
              issueScoreForEachBallotItem[issueScoreBlock.ballot_item_we_vote_id] = issueScoreBlock.issue_support_score - issueScoreBlock.issue_oppose_score;
            });
          } else {
            // Since there is an empty list and we retrieved this for the voter, reset all issue score dicts
            issueSupportScoreForEachBallotItem = {};
            issueOpposeScoreForEachBallotItem = {};
            organizationWeVoteIdSupportListForEachBallotItem = {};
            organizationWeVoteIdOpposeListForEachBallotItem = {};
            organizationNameSupportListForEachBallotItem = {};
            organizationNameOpposeListForEachBallotItem = {};
            issueScoreForEachBallotItem = {};
          }
        }
        if (action.res.issues_under_ballot_items_list && action.res.voter_issues_only !== true && action.res.voter_issues_only !== 'true') {
          // console.log('IssueStore, issuesRetrieve, issues_under_ballot_items_list found');
          issuesUnderBallotItemsList = action.res.issues_under_ballot_items_list;
          if (issuesUnderBallotItemsList.length) {
            issuesUnderBallotItemsList.forEach((issueBlock) => {
              issueWeVoteIdsUnderEachBallotItem[issueBlock.ballot_item_we_vote_id] = issueBlock.issue_we_vote_id_list;
            });
            // Now loop through the offices to populate them with issues assembled from the issues for every candidate under the office
            const topLevelBallotItems = BallotStore.getTopLevelBallotItemWeVoteIds();
            if (topLevelBallotItems) {
              topLevelBallotItems.forEach((localBallotItemWeVoteId) => {
                // issueWeVoteIdsUnderEachBallotItem
                if (!issueWeVoteIdsUnderEachBallotItem[localBallotItemWeVoteId]) {
                  issueWeVoteIdsUnderEachBallotItem[localBallotItemWeVoteId] = [];
                }
                candidatesUnderThisOffice = BallotStore.getCandidateWeVoteIdsForOfficeWeVoteId(localBallotItemWeVoteId);
                candidatesUnderThisOffice.forEach((candidateWeVoteId) => {
                  tempNewIssues = issueWeVoteIdsUnderEachBallotItem[candidateWeVoteId] || [];
                  tempNewIssues.forEach((possibleNewIssueWeVoteId) => {
                    if (issueWeVoteIdsUnderEachBallotItem[localBallotItemWeVoteId].indexOf(possibleNewIssueWeVoteId) === -1) {
                      issueWeVoteIdsUnderEachBallotItem[localBallotItemWeVoteId].push(possibleNewIssueWeVoteId);
                    }
                  });
                });
              });
            }
          }
        }
        // Update issueWeVoteIdsVoterIsFollowing if voter_issues_only flag is set, else update the allCachedIssues
        revisedState = Object.assign({}, revisedState, {
          issueSupportScoreForEachBallotItem,
          issueOpposeScoreForEachBallotItem,
          issueWeVoteIdsUnderEachBallotItem,
          organizationWeVoteIdSupportListForEachBallotItem,
          organizationWeVoteIdOpposeListForEachBallotItem,
          organizationNameSupportListForEachBallotItem,
          organizationNameOpposeListForEachBallotItem,
          issueScoreForEachBallotItem,
          googleCivicElectionId,
        });

        // console.log('action.res.voter_issues_only:', action.res.voter_issues_only);
        if (action.res.voter_issues_only === true || action.res.voter_issues_only === 'true') {
          issueList.forEach((issue) => {
            allCachedIssues[issue.issue_we_vote_id] = issue;
            issueWeVoteIdsVoterIsFollowing.push(issue.issue_we_vote_id);
          });
        } else {
          issueList.forEach((issue) => {
            allCachedIssues[issue.issue_we_vote_id] = issue;
            if (issue.is_issue_followed === true) {
              issueWeVoteIdsVoterIsFollowing.push(issue.issue_we_vote_id);
            }
          });
        }
        revisedState = Object.assign({}, revisedState, {
          allCachedIssues,
          issueWeVoteIdsVoterIsFollowing,
        });
        // console.log('IssueStore issuesRetrieve, issueWeVoteIdsVoterIsFollowing: ', issueWeVoteIdsVoterIsFollowing);
        // console.log('IssueStore, issuesRetrieve, issueWeVoteIdsUnderEachBallotItem:', issueWeVoteIdsUnderEachBallotItem);
        return revisedState;

      case 'issuesToLinkToForOrganization':
        // console.log('IssueStore issuesToLinkToForOrganization');
        organizationWeVoteId = action.res.organization_we_vote_id;
        issueList = action.res.issue_list;
        // We accumulate all issue objects in the allCachedIssues variable
        issueList.forEach((issue) => {
          // allCachedIssues[issue.issue_we_vote_id] = issue;
          toLinkToIssueListForOneOrganization.push(issue.issue_we_vote_id);
        });
        // Add the 'issues to link to' to the master dict, with the organizationWeVoteId as the key
        issueWeVoteIdsToLinkToByOrganizationDict[organizationWeVoteId] = toLinkToIssueListForOneOrganization;

        return {
          ...state,
          // allCachedIssues,
          issueWeVoteIdsToLinkToByOrganizationDict,
        };

      case 'issuesLinkedToOrganization':
        // console.log('IssueStore issuesLinkedToOrganization');
        organizationWeVoteId = action.res.organization_we_vote_id;
        issueList = action.res.issue_list;
        // console.log('IssueStore, issuesLinkedToOrganization: ', issueList);
        // We accumulate all issue objects in the allCachedIssues variable
        issueList.forEach((issue) => {
          // allCachedIssues[issue.issue_we_vote_id] = issue;
          linkedIssueListForOneOrganization.push(issue.issue_we_vote_id);
        });
        // Add the 'issues linked to orgs' to the master dict, with the organizationWeVoteId as the key
        issueWeVoteIdsLinkedToByOrganizationDict[organizationWeVoteId] = linkedIssueListForOneOrganization;

        return {
          ...state,
          // allCachedIssues,
          issueWeVoteIdsLinkedToByOrganizationDict,
        };

      case 'organizationLinkToIssue':
        // When an organization is linked/unlinked to an issue, we need to refresh the linked and to_link issue lists
        organizationWeVoteId = action.res.organization_we_vote_id;
        IssueActions.retrieveIssuesToLinkForOrganization(organizationWeVoteId);
        IssueActions.retrieveIssuesLinkedForOrganization(organizationWeVoteId);
        return state;

      case 'positionListForBallotItem':
        // We want to create an entry in this.state.issueWeVoteIdsUnderEachBallotItem for this ballotItemWeVoteId
        // with a list of the issues connected to this position
        // issueWeVoteIdsUnderEachBallotItem[ballotItemWeVoteId] = list of issues that have positions under this ballot item

        // Also:
        // issue_support_by_ballot_item[ballotItemWeVoteId][issueWeVoteId] = list of organizations that support
        // issue_oppose_by_ballot_item[ballotItemWeVoteId][issueWeVoteId] = list of organizations that support

        // Note, this function only organizes the organizations the voter is already following

        // console.log('positionListForBallotItem action.res.ballot_item_we_vote_id:', action.res.ballot_item_we_vote_id);
        ballotItemWeVoteId = action.res.ballot_item_we_vote_id;
        newPositionList = action.res.position_list;
        // console.log('newPositionList: ', newPositionList);
        // console.log('state.issueWeVoteIdsLinkedToByOrganizationDict: ', state.issueWeVoteIdsLinkedToByOrganizationDict);
        if (ballotItemWeVoteId && newPositionList && state.issueWeVoteIdsLinkedToByOrganizationDict) {
          issueWeVoteIdsUnderEachBallotItem = state.issueWeVoteIdsUnderEachBallotItem || {};
          if (!issueWeVoteIdsUnderEachBallotItem) {
            issueWeVoteIdsUnderEachBallotItem = {};
          }
          if (!issueWeVoteIdsUnderEachBallotItem[ballotItemWeVoteId]) {
            issueWeVoteIdsUnderEachBallotItem[ballotItemWeVoteId] = [];
          }
          newPositionList.forEach((onePosition) => {
            // console.log('onePosition.speaker_we_vote_id: ', onePosition.speaker_we_vote_id);
            if (onePosition.speaker_we_vote_id) {
              // Loop through the issues associated with this speaker.
              if (state.issueWeVoteIdsLinkedToByOrganizationDict[onePosition.speaker_we_vote_id]) {
                // console.log('state.issueWeVoteIdsLinkedToByOrganizationDict[onePosition.speaker_we_vote_id] FOUND');
                listOfIssuesForThisOrg = state.issueWeVoteIdsLinkedToByOrganizationDict[onePosition.speaker_we_vote_id];
                // console.log('listOfIssuesForThisOrg:', listOfIssuesForThisOrg);
                if (listOfIssuesForThisOrg) {
                  listOfIssuesForThisOrg.forEach((oneIssue) => {
                    if (!arrayContains(oneIssue, issueWeVoteIdsUnderEachBallotItem[ballotItemWeVoteId])) {
                      issueWeVoteIdsUnderEachBallotItem[ballotItemWeVoteId].push(oneIssue);
                    }
                  });
                }
              }
            }
          });
          // console.log('positionListForBallotItem issueWeVoteIdsUnderEachBallotItem:', issueWeVoteIdsUnderEachBallotItem);
          return {
            ...state,
            issueWeVoteIdsUnderEachBallotItem,
          };
        } else {
          return state;
        }

      case 'removeBallotItemIssueScoreFromCache':
        ballotItemWeVoteId = action.res.ballot_item_we_vote_id;
        issueScoreForEachBallotItem[ballotItemWeVoteId] = 0;
        return {
          ...state,
          issueScoreForEachBallotItem,
        };

      case 'retrieveIssuesToFollow':
        issueList = action.res.issue_list;
        issueWeVoteIdsVoterCanFollow = [];
        issueList.forEach((issue) => {
          // allCachedIssues[issue.issue_we_vote_id] = issue;
          issueWeVoteIdsVoterCanFollow.push(issue.issue_we_vote_id);
        });

        return {
          ...state,
          // allCachedIssues,
          issueWeVoteIdsVoterCanFollow,
        };

      case 'voterGuidesToFollowRetrieve':
        // Collect all of the issues an organization is tagged with
        // console.log('IssueStore, case voterGuidesToFollowRetrieve');
        voterGuides = action.res.voter_guides;
        if (!voterGuides || voterGuides.length === 0) {
          // If no voterGuides returned, exit
          return {
            ...state,
          };
        }

        // Dictionary with key: issueWeVoteId, list: organizationWeVoteId that is linked to this issue
        organizationWeVoteIdsLinkedToIssueDict = state.organizationWeVoteIdsLinkedToIssueDict || {};
        // Dictionary with key: organizationWeVoteId, list: issueWeVoteId that the organization is linked to
        issueWeVoteIdsLinkedToByOrganizationDict = state.issueWeVoteIdsLinkedToByOrganizationDict || {};
        if (voterGuides) {
          voterGuides.forEach((voterGuide) => {
            const { issueWeVoteIdsLinked } = voterGuide;
            linkedIssueListForOneOrganization = issueWeVoteIdsLinkedToByOrganizationDict[voterGuide.organization_we_vote_id] || [];
            // console.log('IssueStore, case voterGuidesToFollowRetrieve, issueWeVoteIdsLinked:', issueWeVoteIdsLinked);
            if (issueWeVoteIdsLinked) {
              issueWeVoteIdsLinked.forEach((issueWeVoteId) => {
                organizationWeVoteIdsForIssue = organizationWeVoteIdsLinkedToIssueDict[issueWeVoteId] || [];
                organizationWeVoteIdsForIssue.push(voterGuide.organization_we_vote_id);
                organizationWeVoteIdsLinkedToIssueDict[issueWeVoteId] = organizationWeVoteIdsForIssue;
                if (!arrayContains(issueWeVoteId, linkedIssueListForOneOrganization)) {
                  linkedIssueListForOneOrganization.push(issueWeVoteId);
                }
              });
            }
            // Add the 'issues linked to orgs' to the master dict, with the organizationWeVoteId as the key
            issueWeVoteIdsLinkedToByOrganizationDict[voterGuide.organization_we_vote_id] = linkedIssueListForOneOrganization;
          });
        }
        // console.log('IssueStore, case voterGuidesToFollowRetrieve, organizationWeVoteIdsLinkedToIssueDict:', organizationWeVoteIdsLinkedToIssueDict);

        // We want to start a fresh loop after issueWeVoteIdsLinkedToByOrganizationDict has been updated
        // console.log('voterGuidesToFollowRetrieve action.res.ballot_item_we_vote_id:', action.res.ballot_item_we_vote_id);
        ballotItemWeVoteId = action.res.ballot_item_we_vote_id;
        voterGuides = action.res.voter_guides;
        // console.log('voterGuides: ', voterGuides);
        // console.log('issueWeVoteIdsLinkedToByOrganizationDict: ', issueWeVoteIdsLinkedToByOrganizationDict);
        issueWeVoteIdsUnderEachBallotItem = state.issueWeVoteIdsUnderEachBallotItem || {};
        if (ballotItemWeVoteId && voterGuides && issueWeVoteIdsLinkedToByOrganizationDict) {
          // This captures the issues under one particular ballot item from voterGuidesToFollowRetrieve responses dedicated to one ballotItemWeVoteId
          // console.log('IssueStore voterGuidesToFollowRetrieve, voterGuides for one ballotItemWeVoteId:', ballotItemWeVoteId);
          if (!issueWeVoteIdsUnderEachBallotItem) {
            issueWeVoteIdsUnderEachBallotItem = {};
          }
          if (!issueWeVoteIdsUnderEachBallotItem[ballotItemWeVoteId]) {
            issueWeVoteIdsUnderEachBallotItem[ballotItemWeVoteId] = [];
          }
          if (voterGuides) {
            voterGuides.forEach((oneVoterGuide) => {
              // console.log('oneVoterGuide.organization_we_vote_id: ', oneVoterGuide.organization_we_vote_id);
              if (oneVoterGuide.organization_we_vote_id) {
                // Loop through the issues associated with this organization
                if (issueWeVoteIdsLinkedToByOrganizationDict[oneVoterGuide.organization_we_vote_id]) {
                  // console.log('issueWeVoteIdsLinkedToByOrganizationDict[oneVoterGuide.organization_we_vote_id] FOUND');
                  listOfIssuesForThisOrg = issueWeVoteIdsLinkedToByOrganizationDict[oneVoterGuide.organization_we_vote_id];
                  // console.log('listOfIssuesForThisOrg:', listOfIssuesForThisOrg);
                  if (listOfIssuesForThisOrg) {
                    listOfIssuesForThisOrg.forEach((oneIssue) => {
                      if (!arrayContains(oneIssue, issueWeVoteIdsUnderEachBallotItem[ballotItemWeVoteId])) {
                        issueWeVoteIdsUnderEachBallotItem[ballotItemWeVoteId].push(oneIssue);
                      }
                    });
                  }
                }
              }
            });
          }
        } else if (voterGuides && issueWeVoteIdsLinkedToByOrganizationDict) {
          // This captures the issues under each ballot item from any voterGuidesToFollowRetrieve response
          // console.log('IssueStore voterGuidesToFollowRetrieve, voterGuides for multiple ballotItemWeVoteIds.');
          if (!issueWeVoteIdsUnderEachBallotItem) {
            issueWeVoteIdsUnderEachBallotItem = {};
          }
          let ballotItemWeVoteIdsThisOrgSupports;
          if (voterGuides) {
            voterGuides.forEach((oneVoterGuide) => {
              // console.log('oneVoterGuide.organization_we_vote_id: ', oneVoterGuide.organization_we_vote_id);
              if (oneVoterGuide.organization_we_vote_id) {
                // Loop through the issues associated with this organization
                if (issueWeVoteIdsLinkedToByOrganizationDict[oneVoterGuide.organization_we_vote_id]) {
                  // console.log('issueWeVoteIdsLinkedToByOrganizationDict[oneVoterGuide.organization_we_vote_id] FOUND');
                  listOfIssuesForThisOrg = issueWeVoteIdsLinkedToByOrganizationDict[oneVoterGuide.organization_we_vote_id];
                  // console.log('listOfIssuesForThisOrg:', listOfIssuesForThisOrg);
                  if (listOfIssuesForThisOrg) {
                    ballotItemWeVoteIdsThisOrgSupports = oneVoterGuide.ballot_item_we_vote_ids_this_org_supports;
                    if (ballotItemWeVoteIdsThisOrgSupports) {
                      // Cycle through the ballot_items this org supports
                      ballotItemWeVoteIdsThisOrgSupports.forEach((ballotItemWeVoteIdFromList) => {
                        // Cycle through the issues this voterGuide is tagged with
                        if (listOfIssuesForThisOrg) {
                          listOfIssuesForThisOrg.forEach((oneIssue) => {
                            if (!issueWeVoteIdsUnderEachBallotItem[ballotItemWeVoteIdFromList]) {
                              issueWeVoteIdsUnderEachBallotItem[ballotItemWeVoteIdFromList] = [];
                            }
                            if (!arrayContains(oneIssue, issueWeVoteIdsUnderEachBallotItem[ballotItemWeVoteIdFromList])) {
                              issueWeVoteIdsUnderEachBallotItem[ballotItemWeVoteIdFromList].push(oneIssue);
                            }
                          });
                        }
                      });
                    }
                  }
                }
              }
            });
          }
        }
        // console.log('voterGuidesToFollowRetrieve issueWeVoteIdsUnderEachBallotItem:', issueWeVoteIdsUnderEachBallotItem);

        return {
          ...state,
          issueWeVoteIdsLinkedToByOrganizationDict,
          issueWeVoteIdsUnderEachBallotItem,
          organizationWeVoteIdsLinkedToIssueDict,
        };

      case 'voterGuidesUpcomingRetrieve':
        // Collect all of the issues an organization is tagged with
        // console.log('IssueStore, case voterGuidesToFollowRetrieve');
        voterGuides = action.res.voter_guides;
        if (!voterGuides || voterGuides.length === 0) {
          // If no voterGuides returned, exit
          return {
            ...state,
          };
        }

        // Dictionary with key: issueWeVoteId, list: organizationWeVoteId that is linked to this issue
        organizationWeVoteIdsLinkedToIssueDict = state.organizationWeVoteIdsLinkedToIssueDict || {};
        // Dictionary with key: organizationWeVoteId, list: issueWeVoteId that the organization is linked to
        issueWeVoteIdsLinkedToByOrganizationDict = state.issueWeVoteIdsLinkedToByOrganizationDict || {};
        if (voterGuides) {
          voterGuides.forEach((voterGuide) => {
            const { issueWeVoteIdsLinked } = voterGuide;
            linkedIssueListForOneOrganization = issueWeVoteIdsLinkedToByOrganizationDict[voterGuide.organization_we_vote_id] || [];
            // console.log('IssueStore, case voterGuidesToFollowRetrieve, issueWeVoteIdsLinked:', issueWeVoteIdsLinked);
            if (issueWeVoteIdsLinked) {
              issueWeVoteIdsLinked.forEach((issueWeVoteId) => {
                organizationWeVoteIdsForIssue = organizationWeVoteIdsLinkedToIssueDict[issueWeVoteId] || [];
                organizationWeVoteIdsForIssue.push(voterGuide.organization_we_vote_id);
                organizationWeVoteIdsLinkedToIssueDict[issueWeVoteId] = organizationWeVoteIdsForIssue;
                if (!arrayContains(issueWeVoteId, linkedIssueListForOneOrganization)) {
                  linkedIssueListForOneOrganization.push(issueWeVoteId);
                }
              });
            }
            // Add the 'issues linked to orgs' to the master dict, with the organizationWeVoteId as the key
            issueWeVoteIdsLinkedToByOrganizationDict[voterGuide.organization_we_vote_id] = linkedIssueListForOneOrganization;
          });
        }
        // console.log('IssueStore, case voterGuidesToFollowRetrieve, organizationWeVoteIdsLinkedToIssueDict:', organizationWeVoteIdsLinkedToIssueDict);

        // We want to start a fresh loop after issueWeVoteIdsLinkedToByOrganizationDict has been updated
        // console.log('voterGuidesToFollowRetrieve action.res.ballot_item_we_vote_id:', action.res.ballot_item_we_vote_id);
        ballotItemWeVoteId = action.res.ballot_item_we_vote_id;
        voterGuides = action.res.voter_guides;
        // console.log('voterGuides: ', voterGuides);
        // console.log('issueWeVoteIdsLinkedToByOrganizationDict: ', issueWeVoteIdsLinkedToByOrganizationDict);
        issueWeVoteIdsUnderEachBallotItem = state.issueWeVoteIdsUnderEachBallotItem || {};
        if (voterGuides && issueWeVoteIdsLinkedToByOrganizationDict) {
          // This captures the issues under each ballot item from any voterGuidesToFollowRetrieve response
          // console.log('IssueStore voterGuidesToFollowRetrieve, voterGuides for multiple ballotItemWeVoteIds.');
          if (!issueWeVoteIdsUnderEachBallotItem) {
            issueWeVoteIdsUnderEachBallotItem = {};
          }
          let ballotItemWeVoteIdsThisOrgSupports;
          if (voterGuides) {
            voterGuides.forEach((oneVoterGuide) => {
              // console.log('oneVoterGuide.organization_we_vote_id: ', oneVoterGuide.organization_we_vote_id);
              if (oneVoterGuide.organization_we_vote_id) {
                // Loop through the issues associated with this organization
                if (issueWeVoteIdsLinkedToByOrganizationDict[oneVoterGuide.organization_we_vote_id]) {
                  // console.log('issueWeVoteIdsLinkedToByOrganizationDict[oneVoterGuide.organization_we_vote_id] FOUND');
                  listOfIssuesForThisOrg = issueWeVoteIdsLinkedToByOrganizationDict[oneVoterGuide.organization_we_vote_id];
                  // console.log('listOfIssuesForThisOrg:', listOfIssuesForThisOrg);
                  if (listOfIssuesForThisOrg) {
                    ballotItemWeVoteIdsThisOrgSupports = oneVoterGuide.ballot_item_we_vote_ids_this_org_supports;
                    if (ballotItemWeVoteIdsThisOrgSupports) {
                      // Cycle through the ballot_items this org supports
                      ballotItemWeVoteIdsThisOrgSupports.forEach((ballotItemWeVoteIdFromList) => {
                        // Cycle through the issues this voterGuide is tagged with
                        if (listOfIssuesForThisOrg) {
                          listOfIssuesForThisOrg.forEach((oneIssue) => {
                            if (!issueWeVoteIdsUnderEachBallotItem[ballotItemWeVoteIdFromList]) {
                              issueWeVoteIdsUnderEachBallotItem[ballotItemWeVoteIdFromList] = [];
                            }
                            if (!arrayContains(oneIssue, issueWeVoteIdsUnderEachBallotItem[ballotItemWeVoteIdFromList])) {
                              issueWeVoteIdsUnderEachBallotItem[ballotItemWeVoteIdFromList].push(oneIssue);
                            }
                          });
                        }
                      });
                    }
                  }
                }
              }
            });
          }
        }
        // console.log('voterGuidesToFollowRetrieve issueWeVoteIdsUnderEachBallotItem:', issueWeVoteIdsUnderEachBallotItem);

        return {
          ...state,
          issueWeVoteIdsLinkedToByOrganizationDict,
          issueWeVoteIdsUnderEachBallotItem,
          organizationWeVoteIdsLinkedToIssueDict,
        };

      case 'voterSignOut':
        // console.log('resetting IssueStore');
        return this.resetState();

      default:
        return state;
    }
  }
}

export default new IssueStore(Dispatcher);
