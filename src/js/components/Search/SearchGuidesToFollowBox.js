import React, {Component } from "react";
import VoterGuideActions from "../../actions/VoterGuideActions";
import VoterStore from "../../stores/VoterStore";
import SearchBar from "./SearchBar";

// update provider
const updateResults = function (event) {
  let query = event.target.value;
  this.setState({ query: query,
    id: query === "" ? VoterStore.election_id() : 0
  });
  // Search for orgs based on query regardless of whether they have opinions on your ballot (election_id is 0)
  // If you blank out the query string, return normal results for this election
};

const delay_before_retrieve_guides_api_call = 500;
const handleKeyPress = function () {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      VoterGuideActions.retrieveGuidesToFollow(this.state.id, this.state.query);
    }, delay_before_retrieve_guides_api_call);
};

// Just a wrapper component now
export default class SearchGuidesToFollowBox extends Component {
  render () {
    return <SearchBar clear_button search_button updateInputValue={updateResults}
                                                 handleKeyPress={handleKeyPress}
                                                 placeholder="Search by name or Twitter handle" />;
  }
}
