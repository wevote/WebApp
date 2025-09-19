import React, { Component } from 'react';
import VoterGuideActions from '../../actions/VoterGuideActions';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../common/utils/logging';
import SearchBar2024 from '../../common/components/Search/SearchBar2024';

export default class SearchGuidesToFollowBox extends Component {
  constructor (props) {
    super(props);

    this.state = {
      searchPending: null,
    };

    this.searchFunction = this.searchFunction.bind(this);
    this.clearFunction = this.clearFunction.bind(this);
  }

  componentWillUnmount () {
    this.clearFunction();
  }

  searchFunction (searchQuery) {
    if (this.state.searchPending && this.state.searchPending.state() === 'pending') {
      this.state.searchPending.abort();
    }
    const electionId = searchQuery === '' ? VoterStore.electionId() : 0;
    this.setState({
      searchPending: VoterGuideActions.voterGuidesToFollowRetrieve(electionId, searchQuery),
    });
  }

  clearFunction () {
    this.searchFunction('');
  }

  render () {
    renderLog('SearchGuidesToFollowBox');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <SearchBar2024
        clearButton
        searchButton
        placeholder="Search by name or Twitter handle"
        searchFunction={this.searchFunction}
        clearFunction={this.clearFunction}
        searchUpdateDelayTime={100}
      />
    );
  }
}
