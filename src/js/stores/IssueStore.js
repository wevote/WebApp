var Dispatcher = require("../dispatcher/Dispatcher");
var FluxMapStore = require("flux/lib/FluxMapStore");
import GuideActions from "../actions/GuideActions";
import IssueActions from "../actions/IssueActions";

class IssueStore extends FluxMapStore {

  // The store keeps nested attributes of issues in all_cached_voter_guides, whereas the followed,
  // ignoring, to_follow are just lists of issue_we_vote_id.
  getInitialState () {
    return {
      following: [],
      ignoring: [],
      to_follow: [],
      all_cached_issues: {},
    };
  }

  getAllIssues () {
    let all_issue_we_vote_id_list = Object.keys(this.getState().all_cached_issues);
    var issues_to_follow = this.getIssuesFromListOfWeVoteIds(all_issue_we_vote_id_list);
    return issues_to_follow;
  }

  followingList () {
    var following_issue_list = this.getIssuesFromListOfWeVoteIds(this.getState().following);
    return following_issue_list;
  }

  toFollowList () {
    var to_follow_list = this.getIssuesFromListOfWeVoteIds(this.getState().to_follow);
    return to_follow_list;
  }

  getIssuesFromListOfWeVoteIds (list_of_issue_we_vote_ids) {
    let all_cached_issues = this.getState().all_cached_issues;
    // make sure that list_of_issue_we_vote_ids has unique values
    let uniq_list_of_issue_we_vote_ids = list_of_issue_we_vote_ids.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });

    let issues_list = [];
    uniq_list_of_issue_we_vote_ids.forEach(issue_we_vote_id => {
      issues_list.push(all_cached_issues[issue_we_vote_id]);
    });

    return issues_list;
  }

  reduce (state, action) {

  // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success)
      return state;

    switch (action.type) {

      case "issueFollow":
        // When a voter follows or unfollows an issue on the ballot intro modal screen, update the voter guide list
        GuideActions.retrieveGuidesToFollowByIssueFilter();
        IssueActions.retrieveIssuesForVoter();
        return state;

      case "retrieveIssuesToFollow":
        let issues = action.res.issue_list;
        var all_cached_issues = state.all_cached_issues;
        var to_follow = [];
        issues.forEach( issue => {
          all_cached_issues[issue.issue_we_vote_id] = issue;
          to_follow.push(issue.issue_we_vote_id);
        });

        // if a issue_we_vote_id in following list is also in ignoring list, then remove the id from ignoring list
        var ignoring = state.ignoring;
        ignoring = ignoring.filter(issue_we_vote_id => !to_follow.includes(issue_we_vote_id));

        return {
          ...state,
          all_cached_issues: all_cached_issues,
          to_follow: to_follow,
          ignoring: ignoring,
        };

      case "issuesRetrieve":
        issues = action.res.issue_list;
        var following = [];
        all_cached_issues = state.all_cached_issues;
        // Update following if voter_issues_only flag is set, else update the all_cached_issues
        if (action.res.voter_issues_only) {
          issues.forEach(issue => {
            all_cached_issues[issue.issue_we_vote_id] = issue;
            following.push(issue.issue_we_vote_id);
          });
          ignoring = state.ignoring;
          ignoring = ignoring.filter(issue_we_vote_id => !following.includes(issue_we_vote_id));
          return {
            ...state,
            all_cached_issues: all_cached_issues,
            following: following,
            ignoring: ignoring,
          };
        } else {
          issues.forEach(issue => {
            all_cached_issues[issue.issue_we_vote_id] = issue;
          });
          return {
            ...state,
            all_cached_issues: all_cached_issues,
          };
        }

      default:
        return state;
    }
  }

}

module.exports = new IssueStore(Dispatcher);
