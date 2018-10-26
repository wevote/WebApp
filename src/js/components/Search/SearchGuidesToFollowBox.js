import React, { Component } from "react";
import { renderLog } from "../../utils/logging";
import SearchBar from "./SearchBar";
import VoterGuideActions from "../../actions/VoterGuideActions";
import VoterStore from "../../stores/VoterStore";

export default class SearchGuidesToFollowBox extends Component {

  constructor (props) {
    super(props);

    this.state = {
      searchPending: null
    };

    this.searchFunction = this.searchFunction.bind(this);
    this.clearFunction = this.clearFunction.bind(this);
  }

  searchFunction (search_query) {
    if (this.state.searchPending && this.state.searchPending.state() === "pending") {
      this.state.searchPending.abort();
    }
    let election_id = search_query === "" ? VoterStore.election_id() : 0;
    this.setState({
      searchPending: VoterGuideActions.voterGuidesToFollowRetrieve(election_id, search_query)
    });
  }

  clearFunction () {
    this.searchFunction("");
  }

  render () {
    renderLog(__filename);
    return <SearchBar clearButton
                       searchButton
                       placeholder="Search by name or Twitter handle"
                       searchFunction={this.searchFunction}
                       clearFunction={this.clearFunction}
                       searchUpdateDelayTime={100} />;
  }
}
