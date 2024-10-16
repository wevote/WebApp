import { ReduceStore } from 'flux/utils';
import IssueActions from '../actions/IssueActions';
import VoterActions from '../actions/VoterActions'; // eslint-disable-line import/no-cycle
import VoterConstants from '../constants/VoterConstants';
import Dispatcher from '../common/dispatcher/Dispatcher';
import removeValueFromArray from '../common/utils/removeValueFromArray';
import { convertNameToSlug } from '../common/utils/textFormat';
import BallotStore from './BallotStore'; // eslint-disable-line import/no-cycle
import OrganizationStore from './OrganizationStore'; // eslint-disable-line import/no-cycle
import VoterGuideStore from './VoterGuideStore'; // eslint-disable-line import/no-cycle
import VoterStore from './VoterStore'; // eslint-disable-line import/no-cycle

class IssueStore extends ReduceStore {
  getInitialState () {
    return {
      allCachedIssues: {}, // Dictionary with key: issueWeVoteId, and value: complete issue object
      googleCivicElectionId: 0,
      issueDescriptionsRetrieveCalled: false,
      issueOpposeScoreForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: oppose_score
      issueSupportScoreForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: support_score
      issueScoreForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: calculated score
      issuesFollowedLoadedFromAPIServer: false,
      issuesUnderBallotItemsRetrieveCalled: {}, // Dictionary with key: electionId, value: true if issuesUnderBallotItems has been retrieved for that election
      issueWeVoteIdsBySlug: {}, // Dictionary with key: slug, lower case, value: issue_we_vote_id
      issueWeVoteIdsLinkedToByOrganizationDict: {}, // Dictionary with key: organizationWeVoteId, list: issueWeVoteId that the organization is linked to
      issueWeVoteIdsSupportingEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, list: issueWeVoteId
      issueWeVoteIdsToLinkToByOrganizationDict: {}, // Dictionary with key: organizationWeVoteId, list: issueWeVoteId that the organization can link to
      issueWeVoteIdsUnderEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, list: issueWeVoteId. An org with that issue has a position in this election
      issueWeVoteIdsVoterIsFollowing: [], // These are issues a particular voter is following
      issueWeVoteIdsVoterCanFollow: [], // These are issues a particular voter can follow
      organizationNameSupportListForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs supporting this ballot item
      organizationNameOpposeListForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs opposing this ballot item
      organizationWeVoteIdsLinkedToIssueDict: {}, // Dictionary with key: issueWeVoteId, list: organizationWeVoteId that is linked to this issue
      organizationWeVoteIdSupportListForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs supporting this ballot item
      organizationWeVoteIdOpposeListForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs opposing this ballot item
    };
  }

  resetState () {
    // Reset this to include all issues
    const issueWeVoteIdsVoterCanFollow = Object.keys(this.getState().allCachedIssues);
    const state = this.getState();
    return {
      ...state,
      issuesFollowedLoadedFromAPIServer: false,
      issueSupportScoreForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: support_score
      issueOpposeScoreForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: oppose_score
      organizationWeVoteIdSupportListForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs supporting this ballot item
      organizationWeVoteIdOpposeListForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs opposing this ballot item
      organizationNameSupportListForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs supporting this ballot item
      organizationNameOpposeListForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs opposing this ballot item
      issueScoreForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: calculated score
      // LEAVE DATA: issueWeVoteIdsBySlug: {}, // Dictionary with key: slug, lower case, value: issue_we_vote_id
      issueWeVoteIdsVoterIsFollowing: [], // These are issues a particular voter is following
      issueWeVoteIdsVoterCanFollow, // These are issues a particular voter can follow
      // LEAVE DATA: issueWeVoteIdsSupportingEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, list: issueWeVoteId
      issueWeVoteIdsToLinkToByOrganizationDict: {}, // Dictionary with key: organizationWeVoteId, list: issueWeVoteId that the organization can link to
      issueWeVoteIdsLinkedToByOrganizationDict: {}, // Dictionary with key: organizationWeVoteId, list: issueWeVoteId that the organization is linked to
      // LEAVE DATA: issueWeVoteIdsUnderEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, list: issueWeVoteId. An org with that issue has a position in this election
      // LEAVE DATA: organizationWeVoteIdsLinkedToIssueDict: {}, // Dictionary with key: issueWeVoteId, list: organizationWeVoteId that is linked to this issue
      // LEAVE DATA: allCachedIssues: {}, // Dictionary with key: issueWeVoteId, and value: complete issue object
      googleCivicElectionId: 0,
    };
  }

  getAllIssues (includeOrganizationsCount = false) {
    // List of all issue objects
    const allIssueKeys = Object.keys(this.getState().allCachedIssues);
    return this.getIssuesFromListOfWeVoteIds(allIssueKeys, includeOrganizationsCount);
  }

  areIssuesFollowedLoadedFromAPIServer () {
    return this.getState().issuesFollowedLoadedFromAPIServer;
  }

  areIssuesLoadedFromAPIServer () {
    const allIssueKeys = Object.keys(this.getState().allCachedIssues);
    return (allIssueKeys && allIssueKeys.length);
  }

  getIssuesVoterIsFollowing () {
    // List of issue objects the voter is already following
    return this.getIssuesFromListOfWeVoteIds(this.getState().issueWeVoteIdsVoterIsFollowing);
  }

  getIssuesVoterIsFollowingLength () {
    // console.log('IssueStore.getIssuesVoterIsFollowingLength, issueWeVoteIdsVoterIsFollowing: ', this.getState().issueWeVoteIdsVoterIsFollowing);
    if (this.getState().issueWeVoteIdsVoterIsFollowing) {
      return this.getState().issueWeVoteIdsVoterIsFollowing.length || 0;
    }
    return 0;
  }

  getIssuesVoterCanFollow () {
    // List of issue objects the voter can follow
    return this.getIssuesFromListOfWeVoteIds(this.getState().issueWeVoteIdsVoterCanFollow);
  }

  getIssueWeVoteIdsVoterIsFollowing () {
    return this.getState().issueWeVoteIdsVoterIsFollowing;
  }

  issueDescriptionsRetrieveCalled () {
    return this.getState().issueDescriptionsRetrieveCalled || false;
  }

  isVoterFollowingThisIssue (issueWeVoteId) {
    if (!issueWeVoteId) {
      return false;
    }
    return this.getState().issueWeVoteIdsVoterIsFollowing.includes(issueWeVoteId);
  }

  isOrganizationLinkedToIssueVoterIsFollowing (organizationWeVoteId) {
    // See also getIssuesInCommonBetweenOrganizationAndVoter
    const issueWeVoteIdsLinkedToByOrganizationDict = this.getState().issueWeVoteIdsLinkedToByOrganizationDict[organizationWeVoteId];
    // console.log('issueWeVoteIdsLinkedToByOrganizationDict:', issueWeVoteIdsLinkedToByOrganizationDict);
    if (issueWeVoteIdsLinkedToByOrganizationDict === undefined) {
      // The organization is not linked to any Issues, so no, the organization is not linked to any Issues the voter is following
      return false;
    }
    let organizationIsLinkedToIssueVoterIsFollowing = false;
    issueWeVoteIdsLinkedToByOrganizationDict.forEach((issueWeVoteId) => {
      if (this.isVoterFollowingThisIssue(issueWeVoteId)) {
        organizationIsLinkedToIssueVoterIsFollowing = true;
        // console.log('organizationIsLinkedToIssueVoterIsFollowing:', organizationIsLinkedToIssueVoterIsFollowing);
      }
    });
    return organizationIsLinkedToIssueVoterIsFollowing;
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

  getIssueWeVoteIdsLinkedToByOrganizationDictLength () {
    // console.log('IssueStore.getIssueWeVoteIdsLinkedToByOrganizationDictLength, issueWeVoteIdsLinkedToByOrganizationDict: ', this.getState().issueWeVoteIdsLinkedToByOrganizationDict);
    if (this.getState().issueWeVoteIdsLinkedToByOrganizationDict) {
      return Object.keys(this.getState().issueWeVoteIdsLinkedToByOrganizationDict).length;
    }
    return 0;
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

  getIssuesInCommonBetweenOrganizationAndVoter (organizationWeVoteId) {
    // See also isOrganizationLinkedToIssueVoterIsFollowing
    if (!organizationWeVoteId) {
      return [];
    }
    // These are issues that an organization has linked itself to, to help Voters find the organization
    const issueWeVoteIdsLinkedToByOrganizationDict = this.getState().issueWeVoteIdsLinkedToByOrganizationDict[organizationWeVoteId];
    // console.log('getIssuesInCommonBetweenOrganizationAndVoter issueWeVoteIdsLinkedToByOrganizationDict:', issueWeVoteIdsLinkedToByOrganizationDict);
    if (issueWeVoteIdsLinkedToByOrganizationDict === undefined) {
      return [];
    }
    const issueWeVoteIdsInCommonBetweenOrganizationAndVoter = [];
    issueWeVoteIdsLinkedToByOrganizationDict.forEach((issueWeVoteId) => {
      if (this.isVoterFollowingThisIssue(issueWeVoteId)) {
        issueWeVoteIdsInCommonBetweenOrganizationAndVoter.push(issueWeVoteId);
        // console.log('issueWeVoteId shared:', issueWeVoteId);
      }
    });

    // List of issue objects that an organization is linked to
    return this.getIssuesFromListOfWeVoteIds(issueWeVoteIdsInCommonBetweenOrganizationAndVoter);
  }

  getIssuesFromListOfWeVoteIds (listOfIssueWeVoteIds, includeOrganizationsCount = false) {
    const { allCachedIssues } = this.getState();
    // console.log('getIssuesFromListOfWeVoteIds listOfIssueWeVoteIds: ', listOfIssueWeVoteIds);
    // make sure that listOfIssueWeVoteIds has unique values
    const uniqListOfIssueWeVoteIds = listOfIssueWeVoteIds.filter((value, index, self) => self.indexOf(value) === index);

    const issuesList = [];
    let oneIssue;
    uniqListOfIssueWeVoteIds.forEach((issueWeVoteId) => {
      if (allCachedIssues[issueWeVoteId]) {
        oneIssue = allCachedIssues[issueWeVoteId];
        if (includeOrganizationsCount) {
          oneIssue.organizations_under_this_issue_count = VoterGuideStore.getVoterGuidesForValue(issueWeVoteId).length;
        }
        issuesList.push(oneIssue);
      }
    });
    // console.log('getIssuesFromListOfWeVoteIds issuesList: ', issuesList);

    return issuesList;
  }

  // getIssuesScoreByBallotItemWeVoteId (ballotItemWeVoteId) {
  //   if (!ballotItemWeVoteId) {
  //     return 0;
  //   }
  //   // These are scores based on all the organizations under all the issues a voter follows
  //   const issueScore = this.getState().issueScoreForEachBallotItem[ballotItemWeVoteId];
  //   if (issueScore === undefined) {
  //     return 0;
  //   }
  //   //
  //   return issueScore;
  // }

  getIssueBySlug (issueSlug) {
    if (issueSlug === undefined) {
      return {};
    }
    const issueSlugLowerCase = issueSlug.toLowerCase();
    const issueWeVoteId = this.getState().issueWeVoteIdsBySlug[issueSlugLowerCase];
    const issue = this.getState().allCachedIssues[issueWeVoteId];
    if (issue === undefined) {
      return {};
    }
    return issue;
  }

  getIssueByWeVoteId (issueWeVoteId) {
    const issue = this.getState().allCachedIssues[issueWeVoteId];
    if (issue === undefined) {
      return {};
    }
    return issue;
  }

  getOrganizationWeVoteIdsLinkedToOneIssue (issueWeVoteId) {
    // We want a list of all organizations tagged with this issue, so we can offer organizations to follow
    // These are issues that an organization has linked itself to, to help Voters find the organization
    const organizationWeVoteIdsLinkedToIssue = this.getState().organizationWeVoteIdsLinkedToIssueDict[issueWeVoteId];
    // console.log('getOrganizationsForOneIssue: ', organizationWeVoteIdsLinkedToIssue);
    if (organizationWeVoteIdsLinkedToIssue === undefined) {
      return [];
    }
    // List of issue objects that an organization is linked to
    return organizationWeVoteIdsLinkedToIssue;
  }

  getOrganizationsForOneIssue (issueWeVoteId) {
    // We want a list of all organizations tagged with this issue, so we can offer organizations to follow
    // These are issues that an organization has linked itself to, to help Voters find the organization
    const organizationWeVoteIdsLinkedToIssue = this.getState().organizationWeVoteIdsLinkedToIssueDict[issueWeVoteId];
    // console.log('getOrganizationsForOneIssue: ', organizationWeVoteIdsLinkedToIssue, ', issueWeVoteId:', issueWeVoteId);
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

  getIssuesUnderThisBallotItemVoterIsFollowing (ballotItemWeVoteId) {
    // What are the issues that have positions for this election under this ballot item?
    // console.log('getIssuesUnderThisBallotItemVoterIsFollowing, ballotItemWeVoteId:', ballotItemWeVoteId);
    // console.log('getIssuesUnderThisBallotItemVoterIsFollowing, this.getState().issueWeVoteIdsUnderEachBallotItem:', this.getState().issueWeVoteIdsUnderEachBallotItem);
    const issuesUnderThisBallotItemVoterIsFollowing = [];
    if (ballotItemWeVoteId && this.getState().issueWeVoteIdsUnderEachBallotItem && this.getState().issueWeVoteIdsVoterIsFollowing) {
      const issuesForThisBallotItem = this.getState().issueWeVoteIdsUnderEachBallotItem[ballotItemWeVoteId] || [];
      // Remove issues the voter is not following
      issuesForThisBallotItem.forEach((issueWeVoteId) => {
        if (this.getState().issueWeVoteIdsVoterIsFollowing.includes(issueWeVoteId)) {
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
        if (!this.getState().issueWeVoteIdsVoterIsFollowing.includes(issueWeVoteId)) {
          issuesUnderThisBallotItemVoterNotFollowing.push(issueWeVoteId);
        }
      });
      // console.log('AFTER getIssuesUnderThisBallotItemVoterNotFollowing, issuesForThisBallotItem: ', issuesForThisBallotItem);
      return this.getIssuesFromListOfWeVoteIds(issuesUnderThisBallotItemVoterNotFollowing);
    } else {
      return [];
    }
  }

  getIssuesSupportingThisBallotItemVoterIsFollowing (ballotItemWeVoteId) {
    // What are the issues that have positions for this election under this ballot item?
    // console.log('getIssuesSupportingThisBallotItemVoterIsFollowing, ballotItemWeVoteId:', ballotItemWeVoteId);
    // console.log('getIssuesSupportingThisBallotItemVoterIsFollowing, this.getState().issueWeVoteIdsSupportingEachBallotItem:', this.getState().issueWeVoteIdsSupportingEachBallotItem);
    const issuesSupportingThisBallotItemVoterIsFollowing = [];
    if (ballotItemWeVoteId && this.getState().issueWeVoteIdsSupportingEachBallotItem && this.getState().issueWeVoteIdsVoterIsFollowing) {
      const issuesForThisBallotItem = this.getState().issueWeVoteIdsSupportingEachBallotItem[ballotItemWeVoteId] || [];
      // Remove issues the voter is not following
      issuesForThisBallotItem.forEach((issueWeVoteId) => {
        if (this.getState().issueWeVoteIdsVoterIsFollowing.includes(issueWeVoteId)) {
          issuesSupportingThisBallotItemVoterIsFollowing.push(issueWeVoteId);
        }
      });
      // console.log('getIssuesSupportingThisBallotItemVoterIsFollowing, issuesSupportingThisBallotItemVoterIsFollowing: ', issuesSupportingThisBallotItemVoterIsFollowing);
      return this.getIssuesFromListOfWeVoteIds(issuesSupportingThisBallotItemVoterIsFollowing);
    } else {
      // console.log('getIssuesSupportingThisBallotItemVoterIsFollowing missing required variables');
      return [];
    }
  }

  getIssuesSupportingThisBallotItemVoterNotFollowing (ballotItemWeVoteId) {
    // What are the issues that have positions for this election under this ballot item?
    // console.log('getIssuesSupportingThisBallotItemVoterNotFollowing, ballotItemWeVoteId:', ballotItemWeVoteId);
    // console.log('this.getState().issueWeVoteIdsVoterIsFollowing:', this.getState().issueWeVoteIdsVoterIsFollowing);
    const issuesSupportingThisBallotItemVoterNotFollowing = [];
    if (ballotItemWeVoteId && this.getState().issueWeVoteIdsSupportingEachBallotItem && this.getState().issueWeVoteIdsVoterIsFollowing) {
      const issuesForThisBallotItem = this.getState().issueWeVoteIdsSupportingEachBallotItem[ballotItemWeVoteId] || [];
      // console.log('BEFORE getIssuesSupportingThisBallotItemVoterNotFollowing, issuesForThisBallotItem:', issuesForThisBallotItem);
      // Remove issues the voter is already following
      issuesForThisBallotItem.forEach((issueWeVoteId) => {
        if (!this.getState().issueWeVoteIdsVoterIsFollowing.includes(issueWeVoteId)) {
          issuesSupportingThisBallotItemVoterNotFollowing.push(issueWeVoteId);
        }
      });
      // console.log('AFTER getIssuesSupportingThisBallotItemVoterNotFollowing, issuesForThisBallotItem: ', issuesForThisBallotItem);
      return this.getIssuesFromListOfWeVoteIds(issuesSupportingThisBallotItemVoterNotFollowing);
    } else {
      return [];
    }
  }

  getPreviousGoogleCivicElectionId () {
    return this.getState().googleCivicElectionId;
  }

  issuesUnderBallotItemsRetrieveCalled (electionId) {
    return this.getState().issuesUnderBallotItemsRetrieveCalled[electionId] || false;
  }

  reduce (state, action) {
    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success) return state;
    const { allCachedIssues, issueScoreForEachBallotItem } = state;
    let { issueWeVoteIdsSupportingEachBallotItem, issueWeVoteIdsUnderEachBallotItem, issueWeVoteIdsVoterCanFollow, issueWeVoteIdsLinkedToByOrganizationDict } = state;
    const { issueWeVoteIdsBySlug, issueWeVoteIdsToLinkToByOrganizationDict } = state;
    let { issueWeVoteIdsVoterIsFollowing } = state;
    let ballotItemWeVoteId;
    let issueList;
    // let issueScoreList;
    let issueSlug;
    let issuesUnderBallotItemsList;
    let issuesUnderBallotItemsRetrieveCalled; // Dict. Key is the election_id once the issues for that election have been retrieved
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
    let tempAllIssues;
    let tempSupportIssues;
    const toLinkToIssueListForOneOrganization = [];

    switch (action.type) {
      case 'issueFollow':
        // // When a voter follows or unfollows an issue on the ballot intro modal screen, update the voter guide list
        // VoterGuideActions.voterGuidesToFollowRetrieveByIssuesFollowed(); // DALE 2019-12-26 Testing without this
        IssueActions.issuesFollowedRetrieve(VoterStore.getVoterWeVoteId());
        if (action.res.google_civic_election_id && action.res.google_civic_election_id > 0) {
          voterElectionId = action.res.google_civic_election_id;
        } else {
          voterElectionId = VoterStore.electionId();
        }
        issuesUnderBallotItemsRetrieveCalled = state.issuesUnderBallotItemsRetrieveCalled || {};
        if (voterElectionId && !this.issuesUnderBallotItemsRetrieveCalled(voterElectionId)) {
          IssueActions.issuesUnderBallotItemsRetrieve(voterElectionId);
          issuesUnderBallotItemsRetrieveCalled[voterElectionId] = true;
        }
        // Update quickly the list of issues we want to offer to the voter to follow
        if (action.res.issue_we_vote_id) {
          if (action.res.follow_value === true) {
            issueWeVoteIdsVoterCanFollow = removeValueFromArray(action.res.issue_we_vote_id, issueWeVoteIdsVoterCanFollow);
            if (!issueWeVoteIdsVoterIsFollowing.includes(action.res.issue_we_vote_id)) {
              issueWeVoteIdsVoterIsFollowing.push(action.res.issue_we_vote_id);
            }
            // console.log('VALUES_INTRO_COMPLETED: ', VoterStore.getInterfaceFlagState(VoterConstants.VALUES_INTRO_COMPLETED));
            if (!VoterStore.getInterfaceFlagState(VoterConstants.VALUES_INTRO_COMPLETED)) {
              // console.log('Set VALUES_INTRO_COMPLETED');
              VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.VALUES_INTRO_COMPLETED);
            }
          } else if (action.res.follow_value === false) {
            if (action.res.ignore_value === false) {
              // As long as the value is not ignored, it can be followed
              if (!issueWeVoteIdsVoterCanFollow.includes(action.res.issue_we_vote_id)) {
                issueWeVoteIdsVoterCanFollow.push(action.res.issue_we_vote_id);
              }
            }
            issueWeVoteIdsVoterIsFollowing = removeValueFromArray(action.res.issue_we_vote_id, issueWeVoteIdsVoterIsFollowing);
          }
        }
        return {
          ...state,
          issuesUnderBallotItemsRetrieveCalled,
          issueWeVoteIdsVoterCanFollow,
          issueWeVoteIdsVoterIsFollowing,
        };

      case 'issueDescriptionsRetrieve':
        issueList = action.res.issue_list;
        revisedState = state;

        // Dictionary with key: issueWeVoteId, list: organizationWeVoteId that is linked to this issue
        organizationWeVoteIdsLinkedToIssueDict = state.organizationWeVoteIdsLinkedToIssueDict || {};
        // Dictionary with key: organizationWeVoteId, list: issueWeVoteId that the organization is linked to
        issueWeVoteIdsLinkedToByOrganizationDict = state.issueWeVoteIdsLinkedToByOrganizationDict || {};

        // console.log('action.res.voter_issues_only:', action.res.voter_issues_only);
        issueList.forEach((issue) => {
          allCachedIssues[issue.issue_we_vote_id] = issue;
          issueSlug = convertNameToSlug(issue.issue_name);
          issueWeVoteIdsBySlug[issueSlug] = issue.issue_we_vote_id;
          if (!issueWeVoteIdsVoterIsFollowing.includes(issue.issue_we_vote_id) && !issueWeVoteIdsVoterCanFollow.includes(issue.issue_we_vote_id)) {
            issueWeVoteIdsVoterCanFollow.push(issue.issue_we_vote_id);
          }
          if (issue.linked_organization_preview_list) {
            issue.linked_organization_preview_list.forEach((linkedOrganizationPreview) => {
              linkedIssueListForOneOrganization = issueWeVoteIdsLinkedToByOrganizationDict[linkedOrganizationPreview.organization_we_vote_id] || [];
              // console.log('IssueStore, case issueDescriptionsRetrieve, issueWeVoteIdsLinked:', issueWeVoteIdsLinked);
              organizationWeVoteIdsForIssue = organizationWeVoteIdsLinkedToIssueDict[issue.issue_we_vote_id] || [];
              organizationWeVoteIdsForIssue.push(linkedOrganizationPreview.organization_we_vote_id);
              organizationWeVoteIdsLinkedToIssueDict[issue.issue_we_vote_id] = organizationWeVoteIdsForIssue;
              if (!linkedIssueListForOneOrganization.includes(issue.issue_we_vote_id)) {
                linkedIssueListForOneOrganization.push(issue.issue_we_vote_id);
              }
              // Add the 'issues linked to orgs' to the master dict, with the organizationWeVoteId as the key
              issueWeVoteIdsLinkedToByOrganizationDict[linkedOrganizationPreview.organization_we_vote_id] = linkedIssueListForOneOrganization;
            });
          }
        });
        // console.log('organizationWeVoteIdsLinkedToIssueDict:', organizationWeVoteIdsLinkedToIssueDict);
        revisedState = { ...revisedState,
          allCachedIssues,
          issueWeVoteIdsLinkedToByOrganizationDict,
          issueWeVoteIdsVoterCanFollow,
          issueWeVoteIdsBySlug,
          organizationWeVoteIdsLinkedToIssueDict,
        };
        return revisedState;

      case 'issueDescriptionsRetrieveCalled':
        // Make note that issueDescriptionsRetrieveCalled has been called - do not call again
        return { ...state, issueDescriptionsRetrieveCalled: action.payload };

      case 'issueOrganizationsRetrieve':
        issueList = action.res.issue_list;
        revisedState = state;

        // Dictionary with key: issueWeVoteId, list: organizationWeVoteId that is linked to this issue
        organizationWeVoteIdsLinkedToIssueDict = state.organizationWeVoteIdsLinkedToIssueDict || {};
        // Dictionary with key: organizationWeVoteId, list: issueWeVoteId that the organization is linked to
        issueWeVoteIdsLinkedToByOrganizationDict = state.issueWeVoteIdsLinkedToByOrganizationDict || {};

        // console.log('action.res.voter_issues_only:', action.res.voter_issues_only);
        issueList.forEach((issue) => {
          if (issue.linked_organization_we_vote_id_list) {
            organizationWeVoteIdsForIssue = issue.linked_organization_we_vote_id_list || [];
            organizationWeVoteIdsLinkedToIssueDict[issue.issue_we_vote_id] = organizationWeVoteIdsForIssue;
            organizationWeVoteIdsForIssue.forEach((linkedOrganizationWeVoteId) => {
              linkedIssueListForOneOrganization = issueWeVoteIdsLinkedToByOrganizationDict[linkedOrganizationWeVoteId] || [];
              // console.log('IssueStore, case issueDescriptionsRetrieve, issueWeVoteIdsLinked:', issueWeVoteIdsLinked);
              if (!linkedIssueListForOneOrganization.includes(issue.issue_we_vote_id)) {
                linkedIssueListForOneOrganization.push(issue.issue_we_vote_id);
              }
              // Add the 'issues linked to orgs' to the master dict, with the organizationWeVoteId as the key
              issueWeVoteIdsLinkedToByOrganizationDict[linkedOrganizationWeVoteId] = linkedIssueListForOneOrganization;
            });
          }
        });
        // console.log('issueOrganizationsRetrieve organizationWeVoteIdsLinkedToIssueDict:', organizationWeVoteIdsLinkedToIssueDict);
        revisedState = { ...revisedState,
          issueWeVoteIdsLinkedToByOrganizationDict,
          organizationWeVoteIdsLinkedToIssueDict,
        };
        return revisedState;

      case 'issuesFollowedRetrieve':
        issueList = action.res.issues_followed_list;
        revisedState = state;

        // console.log('action.res.voter_issues_only:', action.res.voter_issues_only);
        issueList.forEach((issue) => {
          if (issue.is_issue_ignored === true) {
            issueWeVoteIdsVoterCanFollow = removeValueFromArray(issue.issue_we_vote_id, issueWeVoteIdsVoterCanFollow);
            issueWeVoteIdsVoterIsFollowing = removeValueFromArray(issue.issue_we_vote_id, issueWeVoteIdsVoterIsFollowing);
          } else if (issue.is_issue_followed === true) {
            if (!issueWeVoteIdsVoterIsFollowing.includes(issue.issue_we_vote_id)) {
              issueWeVoteIdsVoterIsFollowing.push(issue.issue_we_vote_id);
            }
            issueWeVoteIdsVoterCanFollow = removeValueFromArray(issue.issue_we_vote_id, issueWeVoteIdsVoterCanFollow);
          } else {
            issueWeVoteIdsVoterIsFollowing = removeValueFromArray(issue.issue_we_vote_id, issueWeVoteIdsVoterIsFollowing);
            if (!issueWeVoteIdsVoterCanFollow.includes(issue.issue_we_vote_id) && issue.is_issue_ignored === false) {
              issueWeVoteIdsVoterCanFollow.push(issue.issue_we_vote_id);
            }
          }
        });
        revisedState = { ...revisedState,
          issuesFollowedLoadedFromAPIServer: true,
          issueWeVoteIdsVoterCanFollow,
          issueWeVoteIdsVoterIsFollowing };
        return revisedState;

      case 'issuesUnderBallotItemsRetrieve':
        revisedState = state;
        googleCivicElectionId = action.res.google_civic_election_id === false ? state.googleCivicElectionId : action.res.google_civic_election_id;
        issuesUnderBallotItemsRetrieveCalled = state.issuesUnderBallotItemsRetrieveCalled || {};
        if (action.res.issues_under_ballot_items_list) {
          // console.log('IssueStore, issuesUnderBallotItemsRetrieve, issues_under_ballot_items_list found');
          issuesUnderBallotItemsList = action.res.issues_under_ballot_items_list;
          issueWeVoteIdsSupportingEachBallotItem = {}; // Reset
          if (issuesUnderBallotItemsList.length) {
            issuesUnderBallotItemsList.forEach((issueBlock) => {
              issueWeVoteIdsSupportingEachBallotItem[issueBlock.ballot_item] = issueBlock.support;
              issueWeVoteIdsUnderEachBallotItem[issueBlock.ballot_item] = [...new Set([...issueBlock.support, ...issueBlock.oppose])];
            });
            // Now loop through the offices to populate them with issues assembled from the issues for every candidate under the office
            const topLevelBallotItems = BallotStore.getTopLevelBallotItemWeVoteIds();
            if (topLevelBallotItems) {
              topLevelBallotItems.forEach((localBallotItemWeVoteId) => {
                if (!issueWeVoteIdsSupportingEachBallotItem[localBallotItemWeVoteId]) {
                  issueWeVoteIdsSupportingEachBallotItem[localBallotItemWeVoteId] = [];
                }
                if (!issueWeVoteIdsUnderEachBallotItem[localBallotItemWeVoteId]) {
                  issueWeVoteIdsUnderEachBallotItem[localBallotItemWeVoteId] = [];
                }
                candidatesUnderThisOffice = BallotStore.getCandidateWeVoteIdsForOfficeWeVoteId(localBallotItemWeVoteId);
                candidatesUnderThisOffice.forEach((candidateWeVoteId) => {
                  tempSupportIssues = issueWeVoteIdsSupportingEachBallotItem[candidateWeVoteId] || [];
                  tempSupportIssues.forEach((possibleNewIssueWeVoteId) => {
                    if (issueWeVoteIdsSupportingEachBallotItem[localBallotItemWeVoteId].indexOf(possibleNewIssueWeVoteId) === -1) {
                      issueWeVoteIdsSupportingEachBallotItem[localBallotItemWeVoteId].push(possibleNewIssueWeVoteId);
                    }
                  });
                  tempAllIssues = issueWeVoteIdsUnderEachBallotItem[candidateWeVoteId] || [];
                  tempAllIssues.forEach((possibleNewIssueWeVoteId) => {
                    if (issueWeVoteIdsUnderEachBallotItem[localBallotItemWeVoteId].indexOf(possibleNewIssueWeVoteId) === -1) {
                      issueWeVoteIdsUnderEachBallotItem[localBallotItemWeVoteId].push(possibleNewIssueWeVoteId);
                    }
                  });
                });
              });
            }
            if (action.res.google_civic_election_id && action.res.google_civic_election_id > 0) {
              issuesUnderBallotItemsRetrieveCalled[action.res.google_civic_election_id] = true;
            }
          }
        }
        revisedState = { ...revisedState,
          issueWeVoteIdsSupportingEachBallotItem,
          issuesUnderBallotItemsRetrieveCalled,
          issueWeVoteIdsUnderEachBallotItem,
          googleCivicElectionId };
        return revisedState;

      case 'issuesUnderBallotItemsRetrieveCalled':
        // Make note that issuesUnderBallotItemsRetrieveCalled has been called - do not call again
        issuesUnderBallotItemsRetrieveCalled = state.issuesUnderBallotItemsRetrieveCalled || {};
        issuesUnderBallotItemsRetrieveCalled[action.payload] = true;
        return { ...state, issuesUnderBallotItemsRetrieveCalled };

      case 'issuesToLinkToForOrganization':
        // console.log('IssueStore issuesToLinkToForOrganization');
        organizationWeVoteId = action.res.organization_we_vote_id;
        issueList = action.res.issue_list;
        issueList.forEach((issue) => {
          toLinkToIssueListForOneOrganization.push(issue.issue_we_vote_id);
        });
        // Add the 'issues to link to' to the master dict, with the organizationWeVoteId as the key
        issueWeVoteIdsToLinkToByOrganizationDict[organizationWeVoteId] = toLinkToIssueListForOneOrganization;

        return {
          ...state,
          issueWeVoteIdsToLinkToByOrganizationDict,
        };

      case 'issuesLinkedToOrganization':
        // console.log('IssueStore issuesLinkedToOrganization');
        organizationWeVoteId = action.res.organization_we_vote_id;
        issueList = action.res.issue_list;
        // console.log('IssueStore, issuesLinkedToOrganization: ', issueList);
        issueList.forEach((issue) => {
          linkedIssueListForOneOrganization.push(issue.issue_we_vote_id);
        });
        // Add the 'issues linked to orgs' to the master dict, with the organizationWeVoteId as the key
        issueWeVoteIdsLinkedToByOrganizationDict[organizationWeVoteId] = linkedIssueListForOneOrganization;

        return {
          ...state,
          issueWeVoteIdsLinkedToByOrganizationDict,
        };

      case 'organizationLinkToIssue':
        // When an organization is linked/unlinked to an issue, we need to refresh the linked and to_link issue lists
        organizationWeVoteId = action.res.organization_we_vote_id;
        IssueActions.retrieveIssuesToLinkForOrganization(organizationWeVoteId);
        IssueActions.retrieveIssuesLinkedForOrganization(organizationWeVoteId);
        return state;

      case 'positionListForBallotItem':
      case 'positionListForBallotItemFromFriends':
        if (action.res.count === 0) return state;
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
                    if (!issueWeVoteIdsUnderEachBallotItem[ballotItemWeVoteId].includes(oneIssue)) {
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

      case 'voterAddressSave':
      case 'voterBallotItemsRetrieve':
        // When a new ballot is retrieved, update the Issues so that we get the summary of issues related to each ballot item
        if (action.res.google_civic_election_id && action.res.google_civic_election_id > 0) {
          voterElectionId = action.res.google_civic_election_id;
        } else {
          voterElectionId = VoterStore.electionId();
        }
        issuesUnderBallotItemsRetrieveCalled = state.issuesUnderBallotItemsRetrieveCalled || {};
        if (voterElectionId && !this.issuesUnderBallotItemsRetrieveCalled(voterElectionId)) {
          // TODO: We really don't want to be calling actions from a Store, especially something this inefficient
          // TODO: July 2021, For a national election --This fetches 34,868 rows of data and executes in the range of 500ms to 10 seconds against the CDN, 25+ secs against postgres on a Mac
          IssueActions.issuesUnderBallotItemsRetrieve(voterElectionId);
          issuesUnderBallotItemsRetrieveCalled[voterElectionId] = true;
        }
        return {
          ...state,
          issuesUnderBallotItemsRetrieveCalled,
        };

      case 'voterGuidesToFollowRetrieve':
        // Collect all the issues an organization is tagged with
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
            const { issue_we_vote_ids_linked: issueWeVoteIdsLinked } = voterGuide;
            linkedIssueListForOneOrganization = issueWeVoteIdsLinkedToByOrganizationDict[voterGuide.organization_we_vote_id] || [];
            // console.log('IssueStore, case voterGuidesToFollowRetrieve, issueWeVoteIdsLinked:', issueWeVoteIdsLinked);
            if (issueWeVoteIdsLinked) {
              issueWeVoteIdsLinked.forEach((issueWeVoteId) => {
                organizationWeVoteIdsForIssue = organizationWeVoteIdsLinkedToIssueDict[issueWeVoteId] || [];
                organizationWeVoteIdsForIssue.push(voterGuide.organization_we_vote_id);
                organizationWeVoteIdsLinkedToIssueDict[issueWeVoteId] = organizationWeVoteIdsForIssue;
                if (!linkedIssueListForOneOrganization.includes(issueWeVoteId)) {
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
                      if (!issueWeVoteIdsUnderEachBallotItem[ballotItemWeVoteId].includes(oneIssue)) {
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
                            if (!issueWeVoteIdsUnderEachBallotItem[ballotItemWeVoteIdFromList].includes(oneIssue)) {
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

      case 'voterGuidesUpcomingRetrieve': // List of all public voter guides from CDN
        // Collect all the issues an organization is tagged with
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
            const { issue_we_vote_ids_linked: issueWeVoteIdsLinked } = voterGuide;
            linkedIssueListForOneOrganization = issueWeVoteIdsLinkedToByOrganizationDict[voterGuide.organization_we_vote_id] || [];
            // console.log('IssueStore, case voterGuidesToFollowRetrieve, issueWeVoteIdsLinked:', issueWeVoteIdsLinked);
            if (issueWeVoteIdsLinked) {
              issueWeVoteIdsLinked.forEach((issueWeVoteId) => {
                organizationWeVoteIdsForIssue = organizationWeVoteIdsLinkedToIssueDict[issueWeVoteId] || [];
                organizationWeVoteIdsForIssue.push(voterGuide.organization_we_vote_id);
                organizationWeVoteIdsLinkedToIssueDict[issueWeVoteId] = organizationWeVoteIdsForIssue;
                if (!linkedIssueListForOneOrganization.includes(issueWeVoteId)) {
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
                            if (!issueWeVoteIdsUnderEachBallotItem[ballotItemWeVoteIdFromList].includes(oneIssue)) {
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
      case 'twitterSignInRetrieve':
      case 'voterEmailAddressSignIn':
      case 'voterFacebookSignInRetrieve':
      case 'voterMergeTwoAccounts':
      case 'voterVerifySecretCode':
        IssueActions.issuesFollowedRetrieve(VoterStore.getVoterWeVoteId());
        return this.resetState();

      case 'voterSignOut':
        // console.log('resetting IssueStore');
        // IssueActions.issuesFollowedRetrieve(VoterStore.getVoterWeVoteId());
        return this.resetState();

      default:
        return state;
    }
  }
}

export default new IssueStore(Dispatcher);
