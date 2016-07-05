var Dispatcher = require("../dispatcher/Dispatcher");
var FluxMapStore = require("flux/lib/FluxMapStore");
const assign = require("object-assign");
import SearchAllActions from "../actions/SearchAllActions";

class SearchAllStore extends FluxMapStore {

  // getInitialState () {
  //   return {
  //     search_type: "",
  //     text_from_search_field: "",
  //     search_results: [],
  //   };
  // }

  // getGroomedSearchResults (search_results) {
  //   const state = this.getState();
  //   let search_results_groomed = [];
  //   // searchAll API returns search results with candidates that may be the same politician multiple times
  //   //  We want to only return one entry per candidate
  //   let uniq_arr = search_results.filter( (value, index, self) => { return self.indexOf(value) === index; });
  //   uniq_arr.forEach( we_vote_id => {
  //     search_results_groomed.push( state.data[we_vote_id] );
  //   });
  //   console.log("SearchAllStore, getGroomedSearchResults, search_results_groomed: " + search_results_groomed);
  //   return search_results_groomed;
  // }
  //
  // getSearchResultsOld (){
  //   console.log("SearchAllStore, getSearchResults, this.getState().search_results: " + this.getState().search_results);
  //   return this.getGroomedSearchResults(this.getState().search_results);
  // }

  getSearchResults (){
    // console.log("SearchAllStore, getSearchResults, this.getState().search_results: " + this.getState().search_results);
    // console.log("SearchAllStore, getSearchResults, this.getState().search_results_new: " + this.getState().search_results_new);
    // return this.getState().search_results;
    // console.log("SearchAllStore, getSearchResults, this.getState().search_results_new: " + this.getState().search_results_new);
    return this.getState().search_results_new;
  }

  getTextFromSearchField (){
    console.log("getTextFromSearchField: " + this.getState().text_from_search_field);
    return this.getState().text_from_search_field;
  }

  isRecentSearch (){
    console.log("isRecentSearch: " + this.getState().search_type);
    return this.getState().search_type === "RECENT_SEARCH";
  }

  isRelatedSearch (){
    console.log("isRelatedSearch: " + this.getState().search_type);
    return this.getState().search_type === "RELATED_SEARCH";
  }

  isSearchInProgress (){
    console.log("isSearchInProgress, true");
    return true;
    // return this.getState().search_type === "SEARCH_IN_PROGRESS";
  }

  reduce (state, action) {
    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success)
      return state;

    switch (action.type) {
      case "searchAll":
        let searchResults = [];
        let alreadyFoundTwitterHandles = [];
        let twitter_handle;
        let alreadyContains;
        action.res.search_results.forEach(one_search_result =>{
          twitter_handle = one_search_result.twitter_handle || "";
          alreadyContains = alreadyFoundTwitterHandles.indexOf(twitter_handle.toLowerCase()) > -1;
          if (!alreadyContains) {
            searchResults.push(one_search_result);
            alreadyFoundTwitterHandles.push(twitter_handle.toLowerCase())
          }
        });
        return {
          //text_from_search_field: action.res.text_from_search_field,
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

module.exports = new SearchAllStore(Dispatcher);
