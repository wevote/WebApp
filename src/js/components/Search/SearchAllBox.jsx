/* global $ */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import BallotActions from '../../actions/BallotActions';
import { hasIPhoneNotch, historyPush, isCordova } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import SearchAllActions from '../../actions/SearchAllActions';
import SearchAllStore from '../../stores/SearchAllStore';
import makeSearchLink from '../../utils/search-functions';
import SearchResultsDisplay from './SearchResultsDisplay';

export default class SearchAllBox extends Component {
  static propTypes = {
    textFromSearchField: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      open: false,
      searchResults: [],
      selectedIndex: 0,
      textFromSearchField: '',
    };

    this.links = [];

    this.onSearchFocus = this.onSearchFocus.bind(this);
    this.onSearchBlur = this.onSearchBlur.bind(this);
    this.onSearchFieldTextChange = this.onSearchFieldTextChange.bind(this);
    this.onSearchKeyDown = this.onSearchKeyDown.bind(this);
    this.onSearchResultMouseOver = this.onSearchResultMouseOver.bind(this);
    this.onSearchResultClick = this.onSearchResultClick.bind(this);
    this.onSearchFormSubmit = this.onSearchFormSubmit.bind(this);
    this.onSearchElectionResultClick = this.onSearchElectionResultClick.bind(this);
    this.onClearSearch = this.onClearSearch.bind(this);
    this.searchHasContent = this.searchHasContent.bind(this);
    this.navigateToSelectedLink = this.navigateToSelectedLink.bind(this);
  }

  componentDidMount () { // jscs:disable requireDollarBeforejQueryAssignment
    this.siteLogoText = $('.page-logo:nth-child(1)'); // eslint-disable-line requireDollarBeforejQueryAssignment
    this.ballot = $('.header-nav__item:nth-child(1)'); // eslint-disable-line requireDollarBeforejQueryAssignment
    this.network = $('.header-nav__item:nth-child(2)'); // eslint-disable-line requireDollarBeforejQueryAssignment
    this.avatar = $('#js-header-avatar'); // eslint-disable-line requireDollarBeforejQueryAssignment
    this.about = document.getElementsByClassName('header-nav__item--about')[0]; // eslint-disable-line prefer-destructuring
    this.donate = document.getElementsByClassName('header-nav__item--donate')[0]; // eslint-disable-line prefer-destructuring

    // When we first enter we want to retrieve values to have for a click in the search box
    const { textFromSearchField } = this.props;
    if (textFromSearchField) {
      this.setState({ textFromSearchField });
    }

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

    this.onSearchAllStoreChange();

    this.searchAllStoreListener = SearchAllStore.addListener(this.onSearchAllStoreChange.bind(this));
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

  onSearchFieldTextChange (event) {
    const searchText = event.target.value;
    this.setState({
      textFromSearchField: searchText,
    });

    // If text field is empty, hide the results. If not, perform search
    if (searchText === '') {
      this.clearSearch();
    } else {
      SearchAllActions.searchAll(searchText);
      this.displayResults();
    }
  }

  onSearchFocus () {
    const input = document.getElementById('SearchAllBox-input');
    input.setSelectionRange(0, 999);

    // Hide the site name
    // TODO: convert to flux action
    // for the global nav

    // TODO:  Do not Bury parent dependencies in components.  This caused an avoidable bug in production.  PLEASE don't copy this code
    const allowParentObjectDirectAccess = true;
    if (allowParentObjectDirectAccess && !isCordova()) {
      if (this.siteLogoText) {
        this.siteLogoText.addClass('hidden');
      }

      if (this.ballot) {
        this.ballot.addClass('d-none d-sm-block');
      }

      if (this.network) {
        this.network.addClass('d-none d-sm-block');
      }

      // The SearchAllBox is used on the candidate page, that doesn't have about or donate
      if (this.about) {
        this.about.className += ' hidden';
      }

      if (this.donate) {
        this.donate.className += ' hidden';
      }

      this.displayResults();
    }
  }

  onSearchBlur () {
    if (this.clearing_search) {
      this.clearing_search = false;
      return;
    }

    // Delay closing the drop down so that a click on the Link can have time to work
    setTimeout(() => {
      if (this.siteLogoText) {
        $('.page-logo-full-size').removeClass('hidden');
      }

      if (this.ballot) {
        $('.header-nav__item--ballot').removeClass('d-none d-sm-block');
      }

      if (this.network) {
        $('.header-nav__item--network').removeClass('d-none d-sm-block');
      }

      if (this.about) {
        $('.header-nav__item--about').removeClass('hidden');
      }

      if (this.donate) {
        $('.header-nav__item--donate').removeClass('hidden');
      }

      this.hideResults();
    }, 250);
  }

  onSearchFormSubmit (e) {
    e.preventDefault();
    if (this.searchHasContent()) {
      this.updateSearchText();
      this.navigateToSelectedLink();

      // Remove focus from search bar to close it
      document.getElementById('SearchAllBox-input').blur();
    } else if (!this.state.open) {
      // Add focus from search bar, so a search logo tap opens/closes
      document.getElementById('SearchAllBox-input').focus();
    }

    return false;
  }

  onSearchKeyDown (e) {
    const keyArrowUp = e.keyCode === 38;
    const keyArrowDown = e.keyCode === 40;
    const keyEscape = e.keyCode === 27;

    // no special handling unless it's an up or down arrow
    if (!(keyArrowUp || keyArrowDown || keyEscape)) {
      return;
    }

    e.preventDefault();

    const { searchResults, selectedIndex } = this.state;
    if (keyArrowUp) {
      this.setState({
        selectedIndex: Math.max(0, selectedIndex - 1),
      });
    } else if (keyArrowDown) {
      this.setState({
        selectedIndex: Math.min(selectedIndex + 1, searchResults.length - 1),
      });
    } else if (keyEscape) {
      this.clearSearch();
    }
  }

  onSearchResultMouseOver (e) {
    const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
    this.setState({
      selectedIndex: idx,
    });
  }

  onSearchResultClick () {
    this.updateSearchText();
  }

  onSearchElectionResultClick (googleCivicElectionId) {
    const ballotBaseUrl = '/ballot';
    if (googleCivicElectionId && googleCivicElectionId !== 0) {
      BallotActions.voterBallotItemsRetrieve(googleCivicElectionId, '', '');

      // console.log("onSearchElectionResultClick, googleCivicElectionId: ", googleCivicElectionId);
      historyPush(`${ballotBaseUrl}/election/${googleCivicElectionId}`);
    }

    this.updateSearchText();
  }

  onClearSearch (e) {
    // Close up the search box and reset the navigation
    this.onSearchBlur();

    this.clearing_search = true;

    e.preventDefault();
    e.stopPropagation();

    this.setState({
      textFromSearchField: '',
      open: true,
      selectedIndex: 0,
      searchResults: [],
    });

    // setTimeout(() => {
    //   this.refs.searchAllBox.focus();
    // }, 0);
  }

  navigateToSelectedLink () {
    historyPush(this.links[this.state.selectedIndex]);
    this.hideResults();
  }

  updateSearchText () {
    const selectedResultElement = this.state.searchResults[this.state.selectedIndex];
    let selectedResultText = '';

    if (selectedResultElement) {
      selectedResultText = selectedResultElement.result_title;
    } else {
      return;
    }

    this.setState({
      textFromSearchField: selectedResultText,
      open: false,
    });

    // Update the search results to the selected query
    SearchAllActions.searchAll(selectedResultText);
  }

  searchHasContent () {
    return this.state.searchResults.length > 0;
  }

  clearSearch () {
    setTimeout(() => {
      this.setState({
        open: false,
        textFromSearchField: '',
        selectedIndex: 0,
        searchResults: [],
      });
    }, 0);
  }

  hideResults () {
    this.setState({
      open: false,
    });
  }

  displayResults () {
    this.setState({
      open: true,
    });
  }

  render () {
    renderLog(__filename);
    const searchContainerClasses = classNames({
      'search-container__hidden': !this.state.open,
      'search-container': true,
      'search-container--cordova': isCordova(),
    });
    const clearButtonClasses = classNames({
      'site-search__clear': true,
      'btn': true, // eslint-disable-line quote-props
      'btn-default': true,
      'site-search__clear__hidden': !this.state.textFromSearchField.length,
    });

    let searchStyle = 'page-header__search';
    if (hasIPhoneNotch()) {
      searchStyle += ' search-cordova-iphonex';
    } else if (isCordova()) {
      searchStyle += ' search-cordova';
    }

    return (
      <div className={searchStyle}>
        <form onSubmit={this.onSearchFormSubmit} role="search">
          <div className="input-group site-search">
            <input
              type="text"
              id="SearchAllBox-input"
              className="form-control site-search__input-field"
              placeholder="Search We Vote…"
              name="master_search_field"
              autoComplete="off"
              onFocus={this.onSearchFocus}
              onBlur={this.onSearchBlur}
              onChange={this.onSearchFieldTextChange}
              onKeyDown={this.onSearchKeyDown}
              value={this.state.textFromSearchField}
              ref="searchAllBox"
            />
            <div className="input-group-btn">
              {' '}
              {/* Oct 2018: input-group-btn defined in the old bootstrap.css */}
              <button className={clearButtonClasses} onClick={this.onClearSearch} type="button">
                {/* October 2018:  The bootstrap glyphicon has been eliminated in bootstrap 4, this line won't work */}
                <i className="glyphicon glyphicon-remove-circle u-gray-light" />
              </button>
              <button className="site-search__button btn btn-default" type="submit">
                <i className="fa fa-search" />
              </button>
            </div>
          </div>
        </form>
        <div className={searchContainerClasses} ref="searchContainer">
          <SearchResultsDisplay
            searchResults={this.state.searchResults}
            selectedIndex={this.state.selectedIndex}
            textFromSearchField={this.state.textFromSearchField}
            onSearchElectionResultClick={this.onSearchElectionResultClick}
            onSearchResultMouseOver={this.onSearchResultMouseOver}
            onSearchResultClick={this.onSearchResultClick}
            links={this.links}
          />
        </div>
      </div>
    );
  }
}
