import { ReduceStore } from "flux/utils";
import assign from "object-assign";
import Dispatcher from "../dispatcher/Dispatcher";

class SearchAllStore extends ReduceStore {
  getInitialState () {
    return {
    };
  }

  getSearchResults () {
    return this.getState().search_results_new || [];
  }

  getTextFromSearchField () {
    return this.getState().text_from_search_field || "";
  }

  getForceClosed () {
    return this.getState().force_closed;
  }

  isRecentSearch () {
    return this.getState().search_type === "RECENT_SEARCH";
  }

  isRelatedSearch () {
    return this.getState().search_type === "RELATED_SEARCH";
  }

  isSearchInProgress () {
    return true;
    // return this.getState().search_type === "SEARCH_IN_PROGRESS";
  }

  reduce (state, action) {
    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success) return state;

    const searchResults = [];
    const alreadyFoundTwitterHandles = [];
    const alreadyFoundElectionId = [];
    let twitter_handle;
    let alreadyContains;
    let google_civic_election_id;

    switch (action.type) {
      case "exitSearch":
        return assign({}, state, { forceClosed: true });
      case "searchAll":
        // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
        if (!action.res || !action.res.success) return state;

        action.res.search_results.forEach((one_search_result) => {
          alreadyContains = false;
          if (one_search_result.kind_of_owner === "ELECTION") {
            google_civic_election_id = one_search_result.google_civic_election_id || "";
            if (google_civic_election_id && google_civic_election_id !== "") {
              alreadyContains = alreadyFoundElectionId.indexOf(google_civic_election_id) > -1;
            }
            if (!alreadyContains) {
              searchResults.push(one_search_result);
              alreadyFoundElectionId.push(google_civic_election_id);
            }
          } else {
            twitter_handle = one_search_result.twitter_handle || "";
            if (twitter_handle && twitter_handle !== "") {
              alreadyContains = alreadyFoundTwitterHandles.indexOf(twitter_handle.toLowerCase()) > -1;
            }
            if (!alreadyContains) {
              searchResults.push(one_search_result);
              alreadyFoundTwitterHandles.push(twitter_handle.toLowerCase());
            }
          }
        });
        return {
          // text_from_search_field: action.res.text_from_search_field,
          search_results_new: searchResults,
        };

      case "error-searchAll":
        console.log(action);
        return state;

      default:
        return state;
    }
  }
}

export default new SearchAllStore(Dispatcher);
