import { ReduceStore } from "flux/utils";
import Dispatcher from "../dispatcher/Dispatcher";
import IssueActions from "../actions/IssueActions";
import OrganizationStore from "../stores/OrganizationStore";
import VoterGuideStore from "../stores/VoterGuideStore";
import VoterGuideActions from "../actions/VoterGuideActions";
import { arrayContains } from "../utils/textFormat";

class IssueStore extends ReduceStore {

  getInitialState () {
    return {
    };
  }

  getInitialState () {
    return {
      issue_support_score_for_each_ballot_item: {}, // Dictionary with key: candidate or measure we_vote_id, value: support_score
      issue_oppose_score_for_each_ballot_item: {}, // Dictionary with key: candidate or measure we_vote_id, value: oppose_score
      organization_we_vote_id_support_list_for_each_ballot_item: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs supporting this ballot item
      organization_we_vote_id_oppose_list_for_each_ballot_item: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs opposing this ballot item
      organization_name_support_list_for_each_ballot_item: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs supporting this ballot item
      organization_name_oppose_list_for_each_ballot_item: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs opposing this ballot item
      issue_score_for_each_ballot_item: {}, // Dictionary with key: candidate or measure we_vote_id, value: calculated score
      issue_we_vote_ids_voter_is_following: [], // These are issues a particular voter is following
      issue_we_vote_ids_voter_can_follow: [], // These are issues a particular voter can follow
      issue_we_vote_ids_to_link_to_by_organization_dict: {}, // Dictionary with key: organization_we_vote_id, list: issue_we_vote_id that the organization can link to
      issue_we_vote_ids_linked_to_by_organization_dict: {}, // Dictionary with key: organization_we_vote_id, list: issue_we_vote_id that the organization is linked to
      issue_we_vote_ids_under_each_ballot_item: {}, // Dictionary with key: candidate or measure we_vote_id, list: issue_we_vote_id. An org with that issue has a position in this election
      organization_we_vote_ids_linked_to_issue_dict: {}, // Dictionary with key: issue_we_vote_id, list: organization_we_vote_id that is linked to this issue
      all_cached_issues: {}, // Dictionary with key: issue_we_vote_id, and value: complete issue object
    };
  }

  getAllIssues () {
    // List of all issue objects
    return this.getState().all_cached_issues;
  }

  getIssuesVoterIsFollowing () {
    // List of issue objects the voter is already following
    return this.getIssuesFromListOfWeVoteIds(this.getState().issue_we_vote_ids_voter_is_following);
  }

  getIssuesVoterCanFollow () {
    // List of issue objects the voter can follow
    return this.getIssuesFromListOfWeVoteIds(this.getState().issue_we_vote_ids_voter_can_follow);
  }

  getIssueWeVoteIdsVoterIsFollowing () {
    return this.getState().issue_we_vote_ids_voter_is_following;
  }

  isVoterFollowingThisIssue (issue_we_vote_id) {
    if (!issue_we_vote_id) {
      return false;
    }
    return arrayContains(issue_we_vote_id, this.getState().issue_we_vote_ids_voter_is_following);
  }

  getIssuesToLinkToByOrganization (organization_we_vote_id) {
    // These are issues that an organization can link itself to, to help Voters find the organization
    let issue_we_vote_id_list_to_link_for_organization = this.getState().issue_we_vote_ids_to_link_to_by_organization_dict[organization_we_vote_id];
    if (issue_we_vote_id_list_to_link_for_organization === undefined) {
      return [];
    }
    // List of issue objects that an organization can link to
    return this.getIssuesFromListOfWeVoteIds(issue_we_vote_id_list_to_link_for_organization);
  }

  getIssueWeVoteIdsLinkedToByOrganization (organization_we_vote_id) {
    if (!organization_we_vote_id) {
      return [];
    }
    // These are issues that an organization has linked itself to, to help Voters find the organization
    let issue_we_vote_ids_linked_to_organization = this.getState().issue_we_vote_ids_linked_to_by_organization_dict[organization_we_vote_id];
    // console.log("getIssueWeVoteIdsLinkedToByOrganization issue_we_vote_ids_linked_to_organization:", issue_we_vote_ids_linked_to_organization);
    if (issue_we_vote_ids_linked_to_organization === undefined) {
      return [];
    }
    // List of issue objects that an organization is linked to
    return issue_we_vote_ids_linked_to_organization;
  }

  getIssuesLinkedToByOrganization (organization_we_vote_id) {
    if (!organization_we_vote_id) {
      return [];
    }
    // These are issues that an organization has linked itself to, to help Voters find the organization
    let issue_we_vote_ids_linked_to_organization = this.getState().issue_we_vote_ids_linked_to_by_organization_dict[organization_we_vote_id];
    // console.log("getIssuesLinkedToByOrganization issue_we_vote_ids_linked_to_organization:", issue_we_vote_ids_linked_to_organization);
    if (issue_we_vote_ids_linked_to_organization === undefined) {
      return [];
    }
    // List of issue objects that an organization is linked to
    return this.getIssuesFromListOfWeVoteIds(issue_we_vote_ids_linked_to_organization);
  }

  getIssuesLinkedToByOrganizationCount (organization_we_vote_id) {
    if (!organization_we_vote_id) {
      return 0;
    }
    // These are issues that an organization has linked itself to, to help Voters find the organization
    let issue_we_vote_ids_linked_to_organization = this.getState().issue_we_vote_ids_linked_to_by_organization_dict[organization_we_vote_id];
    if (issue_we_vote_ids_linked_to_organization === undefined) {
      return 0;
    } else {
      return issue_we_vote_ids_linked_to_organization.length;
    }
  }

  getIssuesFromListOfWeVoteIds (list_of_issue_we_vote_ids) {
    // console.log("getIssuesFromListOfWeVoteIds list_of_issue_we_vote_ids: ", list_of_issue_we_vote_ids);
    let all_cached_issues = this.getState().all_cached_issues;
    // make sure that list_of_issue_we_vote_ids has unique values
    let uniq_list_of_issue_we_vote_ids = list_of_issue_we_vote_ids.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });

    let issues_list = [];
    uniq_list_of_issue_we_vote_ids.forEach(issue_we_vote_id => {
      issues_list.push(all_cached_issues[issue_we_vote_id]);
    });
    // console.log("getIssuesFromListOfWeVoteIds issues_list: ", issues_list);

    return issues_list;
  }

  getIssuesScoreByBallotItemWeVoteId (ballot_item_we_vote_id) {
    if (!ballot_item_we_vote_id) {
      return 0;
    }
    // These are scores based on all of the organizations under all of the issues a voter follows
    let issue_score = this.getState().issue_score_for_each_ballot_item[ballot_item_we_vote_id];
    if (issue_score === undefined) {
      return 0;
    }
    //
    return issue_score;
  }

  getOrganizationsForOneIssue (issue_we_vote_id) {
    // We want a list of all organizations tagged with this issue, so we can offer organizations to listen to
    // These are issues that an organization has linked itself to, to help Voters find the organization
    let organization_we_vote_ids_linked_to_issue = this.getState().organization_we_vote_ids_linked_to_issue_dict[issue_we_vote_id];
    // console.log("getOrganizationsForOneIssue: ", organization_we_vote_ids_linked_to_issue);
    if (organization_we_vote_ids_linked_to_issue === undefined) {
      return [];
    }
    // List of issue objects that an organization is linked to
    return OrganizationStore.returnOrganizationsFromListOfIds(organization_we_vote_ids_linked_to_issue);
  }

  getVoterGuidesForOneIssue (issue_we_vote_id) {
    // We want a list of all organizations tagged with this issue, so we can offer organizations to listen to
    // These are issues that an organization has linked itself to, to help Voters find the organization
    // console.log("IssueStore, getVoterGuidesForOneIssue, this.getState().organization_we_vote_ids_linked_to_issue_dict: ", this.getState().organization_we_vote_ids_linked_to_issue_dict);
    let organization_we_vote_ids_linked_to_issue = this.getState().organization_we_vote_ids_linked_to_issue_dict[issue_we_vote_id];
    // console.log("getOrganizationsForOneIssue: ", organization_we_vote_ids_linked_to_issue);
    if (organization_we_vote_ids_linked_to_issue === undefined) {
      return [];
    }
    // List of issue objects that an organization is linked to
    return VoterGuideStore.returnVoterGuidesFromListOfIds(organization_we_vote_ids_linked_to_issue);
  }

  getPositionsForBallotItemForOneIssue (ballot_item_we_vote_id, issue_we_vote_id) {
    // We want a list of positions about this candidate or measure, where the org taking the position
    // is tagged with this issue
  }

  getVoterGuidesForElectionForOneIssue (google_civic_election_id, issue_we_vote_id) {
    // We want a list of all voter_guides/organizations tagged with this issue that have a position in this election

  }

  getOrganizationWeVoteIdSupportListUnderThisBallotItem (ballot_item_we_vote_id) {
    // What are the issues that have positions for this election under this ballot item?
    // console.log("getIssuesUnderThisBallotItem, ballot_item_we_vote_id:", ballot_item_we_vote_id);
    if (ballot_item_we_vote_id && this.getState().organization_we_vote_id_support_list_for_each_ballot_item) {
      return this.getState().organization_we_vote_id_support_list_for_each_ballot_item[ballot_item_we_vote_id] || [];
    } else {
      return [];
    }
  }

  getOrganizationNameSupportListUnderThisBallotItem (ballot_item_we_vote_id) {
    if (ballot_item_we_vote_id && this.getState().organization_name_support_list_for_each_ballot_item) {
      return this.getState().organization_name_support_list_for_each_ballot_item[ballot_item_we_vote_id] || [];
    } else {
      return [];
    }
  }

  getOrganizationNameOpposeListUnderThisBallotItem (ballot_item_we_vote_id) {
    if (ballot_item_we_vote_id && this.getState().organization_name_oppose_list_for_each_ballot_item) {
      return this.getState().organization_name_oppose_list_for_each_ballot_item[ballot_item_we_vote_id] || [];
    } else {
      return [];
    }
  }

  getIssuesUnderThisBallotItem (ballot_item_we_vote_id) {
    // What are the issues that have positions for this election under this ballot item?
    // console.log("getIssuesUnderThisBallotItem, ballot_item_we_vote_id:", ballot_item_we_vote_id);
    if (ballot_item_we_vote_id && this.getState().issue_we_vote_ids_under_each_ballot_item) {
      let issues_for_this_ballot_item = this.getState().issue_we_vote_ids_under_each_ballot_item[ballot_item_we_vote_id] || [];
      // console.log("getIssuesUnderThisBallotItem, issues_for_this_ballot_item: ", issues_for_this_ballot_item);
      return this.getIssuesFromListOfWeVoteIds(issues_for_this_ballot_item);
    } else {
      return [];
    }
  }

  getIssuesCountUnderThisBallotItem (ballot_item_we_vote_id) {
    // What are the issues that have positions for this election under this ballot item?
    // console.log("getIssuesUnderThisBallotItem, ballot_item_we_vote_id:", ballot_item_we_vote_id);
    if (ballot_item_we_vote_id && this.getState().issue_we_vote_ids_under_each_ballot_item) {
      let issues_for_this_ballot_item = this.getState().issue_we_vote_ids_under_each_ballot_item[ballot_item_we_vote_id] || [];
      // console.log("getIssuesUnderThisBallotItem, issues_for_this_ballot_item: ", issues_for_this_ballot_item);
      return issues_for_this_ballot_item.length;
    } else {
      return 0;
    }
  }

  getIssuesUnderThisBallotItemVoterIsFollowing (ballot_item_we_vote_id) {
    // What are the issues that have positions for this election under this ballot item?
    // console.log("getIssuesUnderThisBallotItemVoterIsFollowing, ballot_item_we_vote_id:", ballot_item_we_vote_id);
    // console.log("getIssuesUnderThisBallotItemVoterIsFollowing, this.getState().issue_we_vote_ids_under_each_ballot_item:", this.getState().issue_we_vote_ids_under_each_ballot_item);
    let issues_under_this_ballot_item_voter_is_following = [];
    if (ballot_item_we_vote_id && this.getState().issue_we_vote_ids_under_each_ballot_item) {
      let issues_for_this_ballot_item = this.getState().issue_we_vote_ids_under_each_ballot_item[ballot_item_we_vote_id] || [];
      // Remove issues the voter is not following
      issues_for_this_ballot_item.forEach( issue_we_vote_id => {
        if (arrayContains(issue_we_vote_id, this.getState().issue_we_vote_ids_voter_is_following)) {
          issues_under_this_ballot_item_voter_is_following.push(issue_we_vote_id);
        }
      });
      // console.log("getIssuesUnderThisBallotItemVoterIsFollowing, issues_under_this_ballot_item_voter_is_following: ", issues_under_this_ballot_item_voter_is_following);
      return this.getIssuesFromListOfWeVoteIds(issues_under_this_ballot_item_voter_is_following);
    } else {
      // console.log("getIssuesUnderThisBallotItemVoterIsFollowing missing required variables");
      return [];
    }
  }

  getIssuesCountUnderThisBallotItemVoterIsFollowing (ballot_item_we_vote_id) {
    // What is the number of issues that have positions for this election under this ballot item?
    let issues_under_this_ballot_item_voter_is_following = [];
    if (ballot_item_we_vote_id && this.getState().issue_we_vote_ids_under_each_ballot_item) {
      let issues_for_this_ballot_item = this.getState().issue_we_vote_ids_under_each_ballot_item[ballot_item_we_vote_id] || [];
      // Remove issues the voter is not following
      issues_for_this_ballot_item.forEach( issue_we_vote_id => {
        if (arrayContains(issue_we_vote_id, this.getState().issue_we_vote_ids_voter_is_following)) {
          issues_under_this_ballot_item_voter_is_following.push(issue_we_vote_id);
        }
      });
      return issues_under_this_ballot_item_voter_is_following.length;
    } else {
      return 0;
    }
  }

  getIssuesUnderThisBallotItemVoterNotFollowing (ballot_item_we_vote_id) {
    // What are the issues that have positions for this election under this ballot item?
    // console.log("getIssuesUnderThisBallotItemVoterNotFollowing, ballot_item_we_vote_id:", ballot_item_we_vote_id)
    let issues_under_this_ballot_item_voter_not_following = [];
    if (ballot_item_we_vote_id && this.getState().issue_we_vote_ids_under_each_ballot_item) {
      let issues_for_this_ballot_item = this.getState().issue_we_vote_ids_under_each_ballot_item[ballot_item_we_vote_id] || [];
      // Remove issues the voter is already following
      issues_for_this_ballot_item.forEach( issue_we_vote_id => {
        if (!arrayContains(issue_we_vote_id, this.getState().issue_we_vote_ids_voter_is_following)) {
          issues_under_this_ballot_item_voter_not_following.push(issue_we_vote_id);
        }
      });
      // console.log("getIssuesUnderThisBallotItemVoterNotFollowing, issues_for_this_ballot_item: ", issues_for_this_ballot_item);
      return this.getIssuesFromListOfWeVoteIds(issues_under_this_ballot_item_voter_not_following);
    } else {
      return [];
    }
  }

  reduce (state, action) {
    let all_cached_issues;
    let ballot_item_we_vote_id;
    let issue_list;
    let issue_score_list;
    let issue_score_for_each_ballot_item;
    let issue_support_score_for_each_ballot_item;
    let issue_oppose_score_for_each_ballot_item;
    let organization_we_vote_id_support_list_for_each_ballot_item;
    let organization_we_vote_id_oppose_list_for_each_ballot_item;
    let organization_name_support_list_for_each_ballot_item;
    let organization_name_oppose_list_for_each_ballot_item;
    let issue_we_vote_ids_linked_to_by_organization_dict;
    let issue_we_vote_ids_to_link_to_by_organization_dict;
    let issue_we_vote_ids_under_each_ballot_item;
    let linked_issue_list_for_one_organization = [];
    let list_of_issues_for_this_org;
    let new_position_list;
    let organization_we_vote_id;
    let organization_we_vote_ids_linked_to_issue_dict;
    let voter_guides;

    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success)
      return state;

    switch (action.type) {
      case "issueFollow":
        // When a voter follows or unfollows an issue on the ballot intro modal screen, update the voter guide list
        VoterGuideActions.voterGuidesToFollowRetrieveByIssuesFollowed();
        if (action.res.google_civic_election_id) {
          IssueActions.issuesRetrieveForElection(action.res.google_civic_election_id);
        } else {
          IssueActions.issuesRetrieve();
        }
        return state;

      case "issuesRetrieve":
        issue_list = action.res.issue_list;
        let issue_we_vote_ids_voter_is_following = [];
        all_cached_issues = state.all_cached_issues;
        issue_support_score_for_each_ballot_item = state.issue_support_score_for_each_ballot_item;
        issue_oppose_score_for_each_ballot_item = state.issue_oppose_score_for_each_ballot_item;
        organization_we_vote_id_support_list_for_each_ballot_item = state.organization_we_vote_id_support_list_for_each_ballot_item;
        organization_we_vote_id_oppose_list_for_each_ballot_item = state.organization_we_vote_id_oppose_list_for_each_ballot_item;
        organization_name_support_list_for_each_ballot_item = state.organization_name_support_list_for_each_ballot_item;
        organization_name_oppose_list_for_each_ballot_item = state.organization_name_oppose_list_for_each_ballot_item;
        issue_score_for_each_ballot_item = state.issue_score_for_each_ballot_item;
        if (action.res.issue_score_list) {
          issue_score_list = action.res.issue_score_list;
          issue_score_list.forEach(issue_score_block => {
            issue_support_score_for_each_ballot_item[issue_score_block.ballot_item_we_vote_id] = issue_score_block.issue_support_score;
            issue_oppose_score_for_each_ballot_item[issue_score_block.ballot_item_we_vote_id] = issue_score_block.issue_oppose_score;
            organization_we_vote_id_support_list_for_each_ballot_item[issue_score_block.ballot_item_we_vote_id] = issue_score_block.organization_we_vote_id_support_list;
            organization_we_vote_id_oppose_list_for_each_ballot_item[issue_score_block.ballot_item_we_vote_id] = issue_score_block.organization_we_vote_id_oppose_list;
            organization_name_support_list_for_each_ballot_item[issue_score_block.ballot_item_we_vote_id] = issue_score_block.organization_name_support_list;
            organization_name_oppose_list_for_each_ballot_item[issue_score_block.ballot_item_we_vote_id] = issue_score_block.organization_name_oppose_list;
            issue_score_for_each_ballot_item[issue_score_block.ballot_item_we_vote_id] = issue_score_block.issue_support_score - issue_score_block.issue_oppose_score;
          });
        }
        // Update issue_we_vote_ids_voter_is_following if voter_issues_only flag is set, else update the all_cached_issues
        if (action.res.voter_issues_only) {
          issue_list.forEach(issue => {
            all_cached_issues[issue.issue_we_vote_id] = issue;
            issue_we_vote_ids_voter_is_following.push(issue.issue_we_vote_id);
          });
          return {
            ...state,
            all_cached_issues: all_cached_issues,
            issue_we_vote_ids_voter_is_following: issue_we_vote_ids_voter_is_following,
            issue_support_score_for_each_ballot_item: issue_support_score_for_each_ballot_item,
            issue_oppose_score_for_each_ballot_item: issue_oppose_score_for_each_ballot_item,
            organization_we_vote_id_support_list_for_each_ballot_item: organization_we_vote_id_support_list_for_each_ballot_item,
            organization_we_vote_id_oppose_list_for_each_ballot_item: organization_we_vote_id_oppose_list_for_each_ballot_item,
            organization_name_support_list_for_each_ballot_item: organization_name_support_list_for_each_ballot_item,
            organization_name_oppose_list_for_each_ballot_item: organization_name_oppose_list_for_each_ballot_item,
            issue_score_for_each_ballot_item: issue_score_for_each_ballot_item
          };
        } else {
          issue_list.forEach(issue => {
            all_cached_issues[issue.issue_we_vote_id] = issue;
          });
          return {
            ...state,
            all_cached_issues: all_cached_issues,
            issue_support_score_for_each_ballot_item: issue_support_score_for_each_ballot_item,
            issue_oppose_score_for_each_ballot_item: issue_oppose_score_for_each_ballot_item,
            organization_we_vote_id_support_list_for_each_ballot_item: organization_we_vote_id_support_list_for_each_ballot_item,
            organization_we_vote_id_oppose_list_for_each_ballot_item: organization_we_vote_id_oppose_list_for_each_ballot_item,
            organization_name_support_list_for_each_ballot_item: organization_name_support_list_for_each_ballot_item,
            organization_name_oppose_list_for_each_ballot_item: organization_name_oppose_list_for_each_ballot_item,
            issue_score_for_each_ballot_item: issue_score_for_each_ballot_item
          };
        }

      case "issuesToLinkToForOrganization":
        // console.log("IssueStore issuesToLinkToForOrganization");
        organization_we_vote_id = action.res.organization_we_vote_id;
        issue_list = action.res.issue_list;
        issue_we_vote_ids_to_link_to_by_organization_dict = state.issue_we_vote_ids_to_link_to_by_organization_dict;
        let to_link_to_issue_list_for_one_organization = [];
        // We accumulate all issue objects in the all_cached_issues variable
        all_cached_issues = state.all_cached_issues;
        issue_list.forEach(issue => {
          all_cached_issues[issue.issue_we_vote_id] = issue;
          to_link_to_issue_list_for_one_organization.push(issue.issue_we_vote_id);
        });
        // Add the "issues to link to" to the master dict, with the organization_we_vote_id as the key
        issue_we_vote_ids_to_link_to_by_organization_dict[organization_we_vote_id] = to_link_to_issue_list_for_one_organization;

        return {
          ...state,
          all_cached_issues: all_cached_issues,
          issue_we_vote_ids_to_link_to_by_organization_dict: issue_we_vote_ids_to_link_to_by_organization_dict,
        };

      case "issuesLinkedToOrganization":
        //console.log("IssueStore issuesLinkedToOrganization");
        organization_we_vote_id = action.res.organization_we_vote_id;
        issue_list = action.res.issue_list;
        // console.log("IssueStore, issuesLinkedToOrganization: ", issue_list);
        issue_we_vote_ids_linked_to_by_organization_dict = state.issue_we_vote_ids_linked_to_by_organization_dict;
        // We accumulate all issue objects in the all_cached_issues variable
        all_cached_issues = state.all_cached_issues;
        issue_list.forEach(issue => {
          all_cached_issues[issue.issue_we_vote_id] = issue;
          linked_issue_list_for_one_organization.push(issue.issue_we_vote_id);
        });
        // Add the "issues linked to orgs" to the master dict, with the organization_we_vote_id as the key
        issue_we_vote_ids_linked_to_by_organization_dict[organization_we_vote_id] = linked_issue_list_for_one_organization;

        return {
          ...state,
          all_cached_issues: all_cached_issues,
          issue_we_vote_ids_linked_to_by_organization_dict: issue_we_vote_ids_linked_to_by_organization_dict,
        };

      case "organizationLinkToIssue":
        // When an organization is linked/unlinked to an issue, we need to refresh the linked and to_link issue lists
        organization_we_vote_id = action.res.organization_we_vote_id;
        IssueActions.retrieveIssuesToLinkForOrganization(organization_we_vote_id);
        IssueActions.retrieveIssuesLinkedForOrganization(organization_we_vote_id);
        return state;

      case "positionListForBallotItem":
        // We want to create an entry in this.state.issue_we_vote_ids_under_each_ballot_item for this ballot_item_we_vote_id
        // with a list of the issues connected to this position
        // issue_we_vote_ids_under_each_ballot_item[ballot_item_we_vote_id] = list of issues that have positions under this ballot item

        // Also:
        // issue_support_by_ballot_item[ballot_item_we_vote_id][issue_we_vote_id] = list of organizations that support
        // issue_oppose_by_ballot_item[ballot_item_we_vote_id][issue_we_vote_id] = list of organizations that support

        // Note, this function only organizes the organizations the voter is already following

        // console.log("positionListForBallotItem action.res.ballot_item_we_vote_id:", action.res.ballot_item_we_vote_id);
        ballot_item_we_vote_id = action.res.ballot_item_we_vote_id;
        new_position_list = action.res.position_list;
        // console.log("new_position_list: ", new_position_list);
        // console.log("state.issue_we_vote_ids_linked_to_by_organization_dict: ", state.issue_we_vote_ids_linked_to_by_organization_dict);
        if (ballot_item_we_vote_id && new_position_list && state.issue_we_vote_ids_linked_to_by_organization_dict) {
          issue_we_vote_ids_under_each_ballot_item = state.issue_we_vote_ids_under_each_ballot_item || {};
          if (!issue_we_vote_ids_under_each_ballot_item) {
            issue_we_vote_ids_under_each_ballot_item = {};
          }
          if (!issue_we_vote_ids_under_each_ballot_item[ballot_item_we_vote_id]) {
            issue_we_vote_ids_under_each_ballot_item[ballot_item_we_vote_id] = [];
          }
          new_position_list.forEach( one_position => {
            // console.log("one_position.speaker_we_vote_id: ", one_position.speaker_we_vote_id);
            if (one_position.speaker_we_vote_id) {
              // Loop through the issues associated with this speaker.
              if (state.issue_we_vote_ids_linked_to_by_organization_dict[one_position.speaker_we_vote_id]) {
                // console.log("state.issue_we_vote_ids_linked_to_by_organization_dict[one_position.speaker_we_vote_id] FOUND");
                list_of_issues_for_this_org = state.issue_we_vote_ids_linked_to_by_organization_dict[one_position.speaker_we_vote_id];
                // console.log("list_of_issues_for_this_org:", list_of_issues_for_this_org);
                if (list_of_issues_for_this_org) {
                  list_of_issues_for_this_org.forEach( one_issue => {
                    if (!arrayContains(one_issue, issue_we_vote_ids_under_each_ballot_item[ballot_item_we_vote_id])) {
                      issue_we_vote_ids_under_each_ballot_item[ballot_item_we_vote_id].push(one_issue);
                    }
                  });
                }
              }
            }
          });
          // console.log("positionListForBallotItem issue_we_vote_ids_under_each_ballot_item:", issue_we_vote_ids_under_each_ballot_item);
          return {
            ...state,
            issue_we_vote_ids_under_each_ballot_item: issue_we_vote_ids_under_each_ballot_item,
          };
        } else {
          return state;
        }

      case "removeBallotItemIssueScoreFromCache":
        ballot_item_we_vote_id = action.res.ballot_item_we_vote_id;
        issue_score_for_each_ballot_item = state.issue_score_for_each_ballot_item;
        issue_score_for_each_ballot_item[ballot_item_we_vote_id] = 0;
        return {
          ...state,
          issue_score_for_each_ballot_item: issue_score_for_each_ballot_item,
        };

      case "retrieveIssuesToFollow":
        issue_list = action.res.issue_list;
        all_cached_issues = state.all_cached_issues;
        let issue_we_vote_ids_voter_can_follow = [];
        issue_list.forEach( issue => {
          all_cached_issues[issue.issue_we_vote_id] = issue;
          issue_we_vote_ids_voter_can_follow.push(issue.issue_we_vote_id);
        });

        return {
          ...state,
          all_cached_issues: all_cached_issues,
          issue_we_vote_ids_voter_can_follow: issue_we_vote_ids_voter_can_follow,
        };

      case "voterGuidesToFollowRetrieve":
        // Collect all of the issues an organization is tagged with
        // console.log("IssueStore, case voterGuidesToFollowRetrieve");
        voter_guides = action.res.voter_guides;
        let issue_we_vote_ids_linked;
        let organization_we_vote_ids_for_issue;
        // Dictionary with key: issue_we_vote_id, list: organization_we_vote_id that is linked to this issue
        organization_we_vote_ids_linked_to_issue_dict = state.organization_we_vote_ids_linked_to_issue_dict || {};
        // Dictionary with key: organization_we_vote_id, list: issue_we_vote_id that the organization is linked to
        issue_we_vote_ids_linked_to_by_organization_dict = state.issue_we_vote_ids_linked_to_by_organization_dict || {};
        voter_guides.forEach( voter_guide => {
          issue_we_vote_ids_linked = voter_guide.issue_we_vote_ids_linked;
          linked_issue_list_for_one_organization = issue_we_vote_ids_linked_to_by_organization_dict[voter_guide.organization_we_vote_id] || [];
          // console.log("IssueStore, case voterGuidesToFollowRetrieve, issue_we_vote_ids_linked:", issue_we_vote_ids_linked);
          issue_we_vote_ids_linked.forEach( issue_we_vote_id => {
            organization_we_vote_ids_for_issue = organization_we_vote_ids_linked_to_issue_dict[issue_we_vote_id] || [];
            organization_we_vote_ids_for_issue.push(voter_guide.organization_we_vote_id);
            organization_we_vote_ids_linked_to_issue_dict[issue_we_vote_id] = organization_we_vote_ids_for_issue;
            if (!arrayContains(issue_we_vote_id, linked_issue_list_for_one_organization)) {
              linked_issue_list_for_one_organization.push(issue_we_vote_id);
            }
          });
          // Add the "issues linked to orgs" to the master dict, with the organization_we_vote_id as the key
          issue_we_vote_ids_linked_to_by_organization_dict[voter_guide.organization_we_vote_id] = linked_issue_list_for_one_organization;
        });
        // console.log("IssueStore, case voterGuidesToFollowRetrieve, organization_we_vote_ids_linked_to_issue_dict:", organization_we_vote_ids_linked_to_issue_dict);

        // We want to start a fresh loop after issue_we_vote_ids_linked_to_by_organization_dict has been updated
        // console.log("voterGuidesToFollowRetrieve action.res.ballot_item_we_vote_id:", action.res.ballot_item_we_vote_id);
        ballot_item_we_vote_id = action.res.ballot_item_we_vote_id;
        voter_guides = action.res.voter_guides;
        // console.log("voter_guides: ", voter_guides);
        // console.log("issue_we_vote_ids_linked_to_by_organization_dict: ", issue_we_vote_ids_linked_to_by_organization_dict);
        issue_we_vote_ids_under_each_ballot_item = state.issue_we_vote_ids_under_each_ballot_item || {};
        if (ballot_item_we_vote_id && voter_guides && issue_we_vote_ids_linked_to_by_organization_dict) {
          if (!issue_we_vote_ids_under_each_ballot_item) {
            issue_we_vote_ids_under_each_ballot_item = {};
          }
          if (!issue_we_vote_ids_under_each_ballot_item[ballot_item_we_vote_id]) {
            issue_we_vote_ids_under_each_ballot_item[ballot_item_we_vote_id] = [];
          }
          voter_guides.forEach(one_voter_guide => {
            // console.log("one_voter_guide.organization_we_vote_id: ", one_voter_guide.organization_we_vote_id);
            if (one_voter_guide.organization_we_vote_id) {
              // Loop through the issues associated with this organization
              if (issue_we_vote_ids_linked_to_by_organization_dict[one_voter_guide.organization_we_vote_id]) {
                // console.log("issue_we_vote_ids_linked_to_by_organization_dict[one_voter_guide.organization_we_vote_id] FOUND");
                list_of_issues_for_this_org = issue_we_vote_ids_linked_to_by_organization_dict[one_voter_guide.organization_we_vote_id];
                // console.log("list_of_issues_for_this_org:", list_of_issues_for_this_org);
                if (list_of_issues_for_this_org) {
                  list_of_issues_for_this_org.forEach(one_issue => {
                    if (!arrayContains(one_issue, issue_we_vote_ids_under_each_ballot_item[ballot_item_we_vote_id])) {
                      issue_we_vote_ids_under_each_ballot_item[ballot_item_we_vote_id].push(one_issue);
                    }
                  });
                }
              }
            }
          });
        }
        // console.log("voterGuidesToFollowRetrieve issue_we_vote_ids_under_each_ballot_item:", issue_we_vote_ids_under_each_ballot_item);

        return {
          ...state,
          issue_we_vote_ids_linked_to_by_organization_dict: issue_we_vote_ids_linked_to_by_organization_dict,
          issue_we_vote_ids_under_each_ballot_item: issue_we_vote_ids_under_each_ballot_item,
          organization_we_vote_ids_linked_to_issue_dict: organization_we_vote_ids_linked_to_issue_dict,
        };

      default:
        return state;
    }
  }
}

module.exports = new IssueStore(Dispatcher);
