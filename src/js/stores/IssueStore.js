var Dispatcher = require("../dispatcher/Dispatcher");
var FluxMapStore = require("flux/lib/FluxMapStore");
import GuideActions from "../actions/GuideActions";
const assign = require("object-assign");

class IssueStore extends FluxMapStore {

  getIssues () {
    var issues_to_follow = this.getDataFromArr(this.getState().issues_to_follow);
    return issues_to_follow;
  }

  getVoterFollowIssueWeVoteIdList () {
    var voter_issues = this.getDataFromArr(this.getState().voter_issues);
    var voter_we_vote_id_list = [];
    for (var voter_issue of voter_issues) {
      voter_we_vote_id_list.push(voter_issue.issue_we_vote_id);
    }
    return voter_we_vote_id_list;
  }

  getDataFromArr (arr) {
    if (arr === undefined) {
      return [];
    }
    let data_list = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      data_list.push( arr[i] );
    }
    return data_list;
  }

  reduce (state, action) {

  // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success)
      return state;

    switch (action.type) {

      case "issueFollow":
        // Whenever a voter follows or unfollows an issue, update the voter guide list
        GuideActions.retrieveGuidesToFollowByIssueFilter();
        return state;

      case "retrieveIssuesToFollow":
        let issues_to_follow = action.res.issue_list;
        return {
          ...state,
          issues_to_follow: assign([], state.issues_to_follow, issues_to_follow )
        };

      case "issuesRetrieve":
        // Update voter_issues if voter_issues_only flag is set, else update the issue_list
        if (action.res.voter_issues_only) {
          let voter_issues = action.res.issue_list;
          return {
            ...state,
            voter_issues: assign([], state.voter_issues, voter_issues )
          };
        } else {
          let issues = action.res.issue_list;
          return {
            ...state,
            issues: assign([], state.issues, issues)
          };
        }

      case "error-issuesRetrieve":
        return state;

      default:
        return state;
    }
  }

}

module.exports = new IssueStore(Dispatcher);
