import React, {Component } from "react";
import GuideActions from "../actions/GuideActions";
import VoterStore from "../stores/VoterStore";
import SearchBar from "./Widgets/SearchBar";

// update provider
const updateResults = function (event) {
  let query = event.target.value;
  this.setState({ query: query });
  // Search for orgs based on query regardless of whether they have opinions on your ballot (election_id is 0)
  // If you blank out the query string, return normal results for this election
  let id = query === "" ? VoterStore.election_id() : 0;
  GuideActions.retrieveGuidesToFollow(id, query);
}

/*
export default class SearchGuidesToFollowBox extends Component {

  constructor (props){
    super(props);
    this.state = {};
  }

  componentWillUnmount (){
    //Clear search results when navigating away
    let id = VoterStore.election_id();
    GuideActions.retrieveGuidesToFollow(id);
  }
  
  render () {
    return <input type="text"
                className="form-control"
                onChange={this.updateResults.bind(this)}
                value={this.state.query}
                placeholder="Search by name or twitter handle." />;
  }
}
*/

// Just a wrapper component now
export default class SearchGuidesToFollowBox extends Component {
  render () {
    return <SearchBar clear_button search_button updateInputValue={updateResults} placeholder="Search by name or twitter handle." />;
  }
}
