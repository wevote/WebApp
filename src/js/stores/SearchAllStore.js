import { ReduceStore } from 'flux/utils';
import assign from 'object-assign';
import Dispatcher from '../dispatcher/Dispatcher';

class SearchAllStore extends ReduceStore {
  getInitialState () {
    return {
    };
  }

  getSearchResults () {
    return this.getState().searchResultsNew || [];
  }

  getTextFromSearchField () {
    return this.getState().textFromSearchField || '';
  }

  getForceClosed () {
    return this.getState().forceClosed;
  }

  isRecentSearch () {
    return this.getState().searchType === 'RECENT_SEARCH';
  }

  isRelatedSearch () {
    return this.getState().searchType === 'RELATED_SEARCH';
  }

  isSearchInProgress () { // eslint-disable-line
    return true;
    // return this.getState().searchType === "SEARCH_IN_PROGRESS";
  }

  reduce (state, action) { // eslint-disable-line
    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success) return state;

    const searchResults = [];
    const alreadyFoundTwitterHandles = [];
    const alreadyFoundElectionId = [];
    let twitterHandle;
    let alreadyContains;
    let googleCivicElectionId;

    switch (action.type) {
      case 'exitSearch':
        return assign({}, state, { forceClosed: true });
      case 'searchAll':
        // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
        if (!action.res || !action.res.success) return state;

        action.res.search_results.forEach((oneSearchResult) => {
          alreadyContains = false;
          if (oneSearchResult.kind_of_owner === 'ELECTION') {
            googleCivicElectionId = oneSearchResult.google_civic_election_id || '';
            if (googleCivicElectionId && googleCivicElectionId !== '') {
              alreadyContains = alreadyFoundElectionId.indexOf(googleCivicElectionId) > -1;
            }
            if (!alreadyContains) {
              searchResults.push(oneSearchResult);
              alreadyFoundElectionId.push(googleCivicElectionId);
            }
          } else {
            twitterHandle = oneSearchResult.twitter_handle || '';
            if (twitterHandle && twitterHandle !== '') {
              alreadyContains = alreadyFoundTwitterHandles.indexOf(twitterHandle.toLowerCase()) > -1;
            }
            if (!alreadyContains) {
              searchResults.push(oneSearchResult);
              alreadyFoundTwitterHandles.push(twitterHandle.toLowerCase());
            }
          }
        });
        return {
          // textFromSearchField: action.res.text_from_search_field,
          searchResultsNew: searchResults,
        };

      case 'error-searchAll':
        console.log(action);
        return state;

      default:
        return state;
    }
  }
}

export default new SearchAllStore(Dispatcher);
