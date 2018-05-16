import React, { Component } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { isCordova } from "../../utils/cordovaUtils";
import { makeSearchLink } from "../../utils/search-functions";
import { renderLog } from "../../utils/logging";
import SearchAllActions from "../../actions/SearchAllActions";
import SearchAllStore from "../../stores/SearchAllStore";
import SearchResultsDisplay from "../../components/Search/SearchResultsDisplay";

export default class SearchPage extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      searchString: "",
      searchResults: []
    };
  }

  componentDidMount () {
    // When we first enter we want to retrieve values to have for a click in the search box
    let textFromSearchField = this.props.params.encoded_search_string;
    this.setState({ textFromSearchField: textFromSearchField });

    // Search type one - Recent searches
    if (SearchAllStore.isRecentSearch()) {
      SearchAllActions.retrieveRecentSearches();
    } else if (SearchAllStore.isRelatedSearch()) {
      // Search type two - Related searches (for when we are on a specific candidate or other page)
      SearchAllActions.retrieveRelatedSearches();
    } else if (SearchAllStore.isSearchInProgress()) {
      // Search type three - Search in progress
      SearchAllActions.searchAll(textFromSearchField);
    }

    this.searchAllStoreListener = SearchAllStore.addListener(this._onSearchAllStoreChange.bind(this));
  }

  componentWillReceiveProps (nextProps) {
    this._onSearchAllStoreChange();
    if (nextProps.params.encoded_search_string) {
      this.setState({ searchString: nextProps.params.encoded_search_string });
    }
  }

  componentWillUnmount () {
    this.searchAllStoreListener.remove();
  }

  _onSearchAllStoreChange () {
    let newState = {};

    if (SearchAllStore.getSearchResults()) {
      newState.searchResults = SearchAllStore.getSearchResults();
      if (isCordova()) {
        if (window.screen.height < 500) {   // iPhone 4, show two results
          newState.searchResults = newState.searchResults.slice(0, 2);
        } else if (window.screen.height < 600) {   // iPhone 5, show four results
          newState.searchResults = newState.searchResults.slice(0, 4);
        } else if (window.screen.height < 700) {   // iPhone 8, show five results
          newState.searchResults = newState.searchResults.slice(0, 5);
        } else if (window.screen.height < 800) {   // iPhone 6p, 7p, 8p show six results
          newState.searchResults = newState.searchResults.slice(0, 6);
        }
      }

      this.links = newState.searchResults.map(r => makeSearchLink(r.twitter_handle, r.we_vote_id, r.kind_of_owner, r.link_internal, r.google_civic_election_id));
    }

    if (SearchAllStore.getForceClosed()) {
      newState.open = false;
    }

    if (SearchAllStore.getTextFromSearchField()) {
      newState.textFromSearchField = SearchAllStore.getTextFromSearchField();
    }

    this.setState(newState);
  }

  render () {
    renderLog(__filename);
    return <span>
      <SearchResultsDisplay links={this.links} 
                            searchResults={this.state.searchResults} 
                            textFromSearchField={this.state.searchString}/>
        </span>;
  }
}
