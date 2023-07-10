import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import SearchAllActions from '../../actions/SearchAllActions';
import SearchAllStore from '../../stores/SearchAllStore';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import { makeSearchLink } from '../../utils/searchFunctions';

import SearchResultsDisplay from '../../components/Search/SearchResultsDisplay';

export default class SearchPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      textFromSearchField: '',
      searchResults: [],
    };
  }

  componentDidMount () {
    // When we first enter we want to retrieve values to have for a click in the search box
    const { match: { params } } = this.props;
    const textFromSearchField = params.encoded_search_string || '';
    this.setState({ textFromSearchField });

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

    this.searchAllStoreListener = SearchAllStore.addListener(this.onSearchAllStoreChange.bind(this));
    window.scrollTo(0, 0);
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    this.onSearchAllStoreChange();
    const { match: { params: nextParams } } = nextProps;
    if (nextParams.encoded_search_string) {
      this.setState({ textFromSearchField: nextParams.encoded_search_string || '' });
    }
  }

  componentWillUnmount () {
    this.searchAllStoreListener.remove();
  }

  onSearchAllStoreChange () {
    const newState = {};

    if (SearchAllStore.getSearchResults()) {
      newState.searchResults = SearchAllStore.getSearchResults();
      if (isCordova()) {
        if (window.screen.height < 500) { // iPhone 4, show two results
          newState.searchResults = newState.searchResults.slice(0, 2);
        } else if (window.screen.height < 600) { // iPhone 5, show four results
          newState.searchResults = newState.searchResults.slice(0, 4);
        } else if (window.screen.height < 700) { // iPhone 8, show five results
          newState.searchResults = newState.searchResults.slice(0, 5);
        } else if (window.screen.height < 800) { // iPhone 6p, 7p, 8p show six results
          newState.searchResults = newState.searchResults.slice(0, 6);
        }
      }

      this.links = newState.searchResults.map((r) => makeSearchLink(r.twitter_handle, r.we_vote_id, r.kind_of_owner, r.link_internal, r.google_civic_election_id));
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
    renderLog('SearchPage');  // Set LOG_RENDER_EVENTS to log all renders
    const { searchResults, textFromSearchField } = this.state;
    if (!textFromSearchField) {
      return null;
    }
    return (
      <span>
        <Helmet title="Search Results - We Vote" />
        <SearchResultsDisplay
          links={this.links}
          searchResults={searchResults}
          textFromSearchField={textFromSearchField}
        />
      </span>
    );
  }
}
SearchPage.propTypes = {
  match: PropTypes.object.isRequired,
};
