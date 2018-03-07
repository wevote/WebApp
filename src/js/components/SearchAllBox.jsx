/* global $ */
import React, { Component, PropTypes } from "react";
import BallotActions from "../actions/BallotActions";
import classNames from "classnames";
import { Link } from "react-router";
import { historyPush, isWebApp } from "../utils/cordovaUtils";
import SearchAllActions from "../actions/SearchAllActions";
import SearchAllStore from "../stores/SearchAllStore";
import { makeSearchLink } from "../utils/search-functions";
import { capitalizeString } from "../utils/textFormat";
import ImageHandler from "../components/ImageHandler";

export default class SearchAllBox extends Component {
  static propTypes = {
    open: PropTypes.bool,
    selected_index: PropTypes.number,
    text_from_search_field: PropTypes.string,
    voter: PropTypes.object,
  };

  constructor (props) {
    super(props);

    this.state = {
      open: false,
      searchResults: [],
      selectedIndex: 0,
      textFromSearchField: "",
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

  componentDidMount () {
    this.siteLogoText = $(".page-logo:nth-child(1)");
    this.ballot = $(".header-nav__item:nth-child(1)");
    this.network = $(".header-nav__item:nth-child(2)");
    this.avatar = $("#js-header-avatar");
    this.about = document.getElementsByClassName("header-nav__item--about")[0];
    this.donate = document.getElementsByClassName("header-nav__item--donate")[0];

    // When we first enter we want to retrieve values to have for a click in the search box
    let textFromSearchField = this.props.text_from_search_field;

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

  componentWillReceiveProps () {
    this._onSearchAllStoreChange();
  }

  componentWillUnmount () {
    this.searchAllStoreListener.remove();
  }

  _onSearchAllStoreChange () {
    let newState = {};

    if (SearchAllStore.getSearchResults()) {
      newState.searchResults = SearchAllStore.getSearchResults();
      this.links = newState.searchResults.map((r) => makeSearchLink(r.twitter_handle, r.we_vote_id, r.kind_of_owner,
        r.link_internal, r.google_civic_election_id));
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
    let searchText = event.target.value;
    this.setState({
      textFromSearchField: searchText,
    });

    //If text field is empty, hide the results. If not, perform search
    if (searchText === "") {
      this.clearSearch();
    } else {
      SearchAllActions.searchAll(searchText);
      this.displayResults();
    }
  }

  onSearchFocus () {

    this.refs.searchAllBox.setSelectionRange(0, 999);

    // Hide the site name
    // TODO: convert to flux action
    // for the global nav

    this.siteLogoText.addClass("hidden");
    this.ballot.addClass("hidden-xs");
    this.network.addClass("hidden-xs");
    this.about.className += " hidden";
    this.donate.className += " hidden";
    this.displayResults();
  }

  onSearchBlur () {
    if (this.clearing_search) {
      this.clearing_search = false;
      return;
    }

    // Delay closing the drop down so that a click on the Link can have time to work
    setTimeout(() => {
      $(".page-logo-full-size").removeClass("hidden");
      $(".header-nav__item--ballot").removeClass("hidden-xs");
      $(".header-nav__item--network").removeClass("hidden-xs");
      $(".header-nav__item--about").removeClass("hidden");
      $(".header-nav__item--donate").removeClass("hidden");
      this.hideResults();
    }, 250);
  }

  onSearchFormSubmit (e) {
    e.preventDefault();
    if (this.searchHasContent()) {
      this.updateSearchText();
      this.navigateToSelectedLink();

      //Remove focus from search bar to close it
      document.getElementById("SearchAllBox-input").blur();
    } else if (!this.state.open) {
      //add focus from search bar, so a search logo tap opens/closes
      document.getElementById("SearchAllBox-input").focus();
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

    if (keyArrowUp) {
      this.setState({
        selectedIndex: Math.max(0, this.state.selectedIndex - 1),
      });
    } else if (keyArrowDown) {
      this.setState({
        selectedIndex: Math.min(this.state.selectedIndex + 1, this.state.searchResults.length - 1),
      });
    } else if (keyEscape) {
      this.clearSearch();
    }
  }

  navigateToSelectedLink () {
    historyPush(this.links[this.state.selectedIndex]);
    this.hideResults();
  }

  onSearchResultMouseOver (e) {
    let idx = parseInt(e.currentTarget.getAttribute("data-idx"), 10);
    this.setState({
      selectedIndex: idx,
    });
  }

  onSearchResultClick () {
    this.updateSearchText();
  }

  onSearchElectionResultClick (googleCivicElectionId) {
    let ballotBaseUrl = "/ballot";
    if (googleCivicElectionId && googleCivicElectionId !== 0) {
      BallotActions.voterBallotItemsRetrieve(googleCivicElectionId, "", "");

      // console.log("onSearchElectionResultClick, googleCivicElectionId: ", googleCivicElectionId);
      historyPush(ballotBaseUrl + "/election/" + googleCivicElectionId);
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
      textFromSearchField: "",
      open: true,
      selectedIndex: 0,
      searchResults: [],
    });

    //setTimeout(() => {
    //   this.refs.searchAllBox.focus();
    // }, 0);
  }

  updateSearchText () {
    let selectedResultElement = this.state.searchResults[this.state.selectedIndex];
    let selectedResultText = "";

    if (selectedResultElement) {
      selectedResultText = selectedResultElement.result_title;
    } else {
      return;
    }

    this.setState({
      textFromSearchField: selectedResultText,
      open: false,
    });

    //Update the search results to the selected query
    SearchAllActions.searchAll(selectedResultText);
  }

  searchHasContent () {
    return this.state.searchResults.length > 0;
  }

  clearSearch () {
    setTimeout(() => {
      this.setState({
        open: false,
        textFromSearchField: "",
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
    let searchResults = this.state.searchResults;
    let searchContainerClasses = classNames({
      "search-container__hidden": !this.state.open,
      "search-container": true,
    });
    let clearButtonClasses = classNames({
      "site-search__clear": true,
      "btn": true,
      "btn-default": true,
      "site-search__clear__hidden": !this.state.textFromSearchField.length,
    });

    let searchStyle = isWebApp() ? "page-header__search" : "page-header__search search-cordova";

    return <div className={searchStyle}>
        <form onSubmit={this.onSearchFormSubmit} role="search">
          <div className="input-group site-search">

            <input type="text"
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
                   ref="searchAllBox" />
            <div className="input-group-btn">
              <button className={clearButtonClasses} onClick={this.onClearSearch}>
                <i className="glyphicon glyphicon-remove-circle u-gray-light" />
              </button>
              <button className="site-search__button btn btn-default" type="submit">
                <i className="glyphicon glyphicon-search" />
              </button>
            </div>
          </div>
        </form>
        <div className={searchContainerClasses}
             ref="searchContainer">
           { searchResults.map((oneResult, idx) => {
              let capitalizedTitle = capitalizeString(oneResult.result_title);
              if (oneResult.kind_of_owner === "ELECTION") {
                let searchResultClasses = classNames({
                  "search-container__election_results": true,
                  "search-container__election_results--highlighted": idx === this.state.selectedIndex,
                  "u-flex u-align-start u-justify-between": true,
                });
                let electionDay = oneResult.result_summary.split(" ").splice(-1);
                let today = new Date();
                let electionDate = new Date(electionDay + " 0:00:00");
                let pastElection = today > electionDate ? " IN PAST" : "UPCOMING ELECTION";
                return <Link key={oneResult.local_id}
                             data-idx={idx}
                             onMouseOver={this.onSearchResultMouseOver}
                             className="search-container__links"
                             onClick={() => this.onSearchElectionResultClick(oneResult.google_civic_election_id)}>
                  <div className={searchResultClasses}>
                      <div className="search-container__election-title">{capitalizedTitle}</div>
                      <div className="search-container__election-details">{electionDay}<br />{pastElection}</div>
                  </div>
                </Link>;
              } else {
                let searchResultClasses = classNames({
                  "search-container__results": true,
                  "search-container__results--highlighted": idx === this.state.selectedIndex,
                });

                return <Link key={oneResult.we_vote_id}
                             data-idx={idx}
                             to={this.links[idx]}
                             onMouseOver={this.onSearchResultMouseOver}
                             className="search-container__links"
                             onClick={this.onSearchResultClick}>
                  <div className={searchResultClasses}>
                  <span>
                    <ImageHandler imageUrl={oneResult.result_image}
                                  kind_of_ballot_item={oneResult.kind_of_owner}
                                  sizeClassName="search-image "
                                  className={oneResult.kind_of_owner} />
                  </span>
                    {capitalizedTitle}
                  </div>
                </Link>;
              }
            })
          }
        </div>
      </div>;
  }
}
