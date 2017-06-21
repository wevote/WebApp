var Dispatcher = require("../dispatcher/Dispatcher");
var FluxMapStore = require("flux/lib/FluxMapStore");
const assign = require("object-assign");

class IssueStore extends FluxMapStore {

  getIssues () {
    var issues = this.getDataFromArr(this.getState().issues);
    return issues;
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

      case "issuesRetrieve":
        let issues = action.res.issue_list;
        return {
          ...state,
          issues: assign([], state.issues, issues )
        };

      case "error-issuesRetrieve":
        return state;

      default:
        return state;
    }
  }

}

module.exports = new IssueStore(Dispatcher);
