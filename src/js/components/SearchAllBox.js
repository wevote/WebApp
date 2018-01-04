/* global $ */
import React, {Component, PropTypes} from "react";
import classNames from "classnames";
import { browserHistory, Link } from "react-router";
import SearchAllActions from "../actions/SearchAllActions";
import SearchAllStore from "../stores/SearchAllStore";
import { makeSearchLink } from "../utils/search-functions";
import { capitalizeString } from "../utils/textFormat";
import ImageHandler from "../components/ImageHandler";

export default class SearchAllBox extends Component {
  static propTypes = {
    text_from_search_field: PropTypes.string,
    voter: PropTypes.object,
    selected_index: PropTypes.number,
    open: PropTypes.bool
  };

  constructor (props){
    super(props);

    this.state = {
      open: false,
      selected_index: 0,
      search_results: [],
      text_from_search_field: ""
    };

    this.links = [];

    this.onSearchFocus = this.onSearchFocus.bind(this);
    this.onSearchBlur = this.onSearchBlur.bind(this);
    this.onSearchFieldTextChange = this.onSearchFieldTextChange.bind(this);
    this.onSearchKeyDown = this.onSearchKeyDown.bind(this);
    this.onSearchResultMouseOver = this.onSearchResultMouseOver.bind(this);
    this.onSearchResultClick = this.onSearchResultClick.bind(this);
    this.onSearchFormSubmit = this.onSearchFormSubmit.bind(this);
    this.onClearSearch = this.onClearSearch.bind(this);
    this.searchHasContent = this.searchHasContent.bind(this);
    this.navigateToSelectedLink = this.navigateToSelectedLink.bind(this);
  }

  componentDidMount (){
    this.siteLogoText = $(".page-logo:nth-child(1)");
    this.ballot = $(".header-nav__item:nth-child(1)");
    this.network = $(".header-nav__item:nth-child(2)");
    this.avatar = $("#js-header-avatar");
    this.about = document.getElementsByClassName("header-nav__item--about")[0];
    this.donate = document.getElementsByClassName("header-nav__item--donate")[0];
    // When we first enter we want to retrieve values to have for a click in the search box
    let text_from_search_field = this.props.text_from_search_field;

    // Search type one - Recent searches
    if (SearchAllStore.isRecentSearch()) {
      SearchAllActions.retrieveRecentSearches();
    } else if (SearchAllStore.isRelatedSearch()) {
      // Search type two - Related searches (for when we are on a specific candidate or other page)
      SearchAllActions.retrieveRelatedSearches();
    } else if (SearchAllStore.isSearchInProgress()) {
      // Search type three - Search in progress
      SearchAllActions.searchAll(text_from_search_field);
    }
    this.searchAllStoreListener = SearchAllStore.addListener(this._onSearchAllStoreChange.bind(this));
  }

  componentWillReceiveProps (){
    this._onSearchAllStoreChange();
  }

  componentWillUnmount (){
    this.searchAllStoreListener.remove();
  }

  _onSearchAllStoreChange (){
    var new_state = {};

    if (SearchAllStore.getSearchResults()) {
      new_state.search_results = SearchAllStore.getSearchResults();
      this.links = new_state.search_results.map((r) => makeSearchLink(r.twitter_handle, r.we_vote_id, r.kind_of_owner,
        r.link_internal, r.google_civic_election_id));
    }

    if (SearchAllStore.getForceClosed()) {
      new_state.open = false;
    }

    if (SearchAllStore.getTextFromSearchField()) {
      new_state.text_from_search_field = SearchAllStore.getTextFromSearchField();
    }

    this.setState(new_state);
  }

  onSearchFieldTextChange (event){
    let search_text = event.target.value;
    this.setState({text_from_search_field: search_text});
    //If text field is empty, hide the results. If not, perform search
    if (search_text === "") {
      this.clearSearch();
    } else {
      SearchAllActions.searchAll(search_text);
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
      this.setState({selected_index: Math.max(0, this.state.selected_index - 1)});
    } else if (keyArrowDown) {
      this.setState({selected_index: Math.min(this.state.selected_index + 1, this.state.search_results.length - 1)});
    } else if (keyEscape) {
      this.clearSearch();
    }
  }

  navigateToSelectedLink () {
    browserHistory.push(this.links[this.state.selected_index]);
    this.hideResults();
  }

  onSearchResultMouseOver (e) {
    let idx = parseInt(e.currentTarget.getAttribute("data-idx"), 10);
    this.setState({selected_index: idx});
  }

  onSearchResultClick () {
    this.updateSearchText();
  }

  onClearSearch (e) {
    // Close up the search box and reset the navigation
    this.onSearchBlur();

    this.clearing_search = true;

    e.preventDefault();
    e.stopPropagation();

    this.setState({text_from_search_field: "", open: true, selected_index: 0, search_results: []});

    //setTimeout(() => {
    //   this.refs.searchAllBox.focus();
    // }, 0);
  }

  updateSearchText () {
    let selectedResultElement = this.state.search_results[this.state.selected_index];
    let selectedResultText = "";

    if (selectedResultElement) {
      selectedResultText = selectedResultElement.result_title;
    } else {
      return;
    }

    this.setState({text_from_search_field: selectedResultText, open: false});
    //Update the search results to the selected query
    SearchAllActions.searchAll(selectedResultText);
  }

  searchHasContent () {
    return this.state.search_results.length > 0;
  }

  clearSearch () {
    setTimeout(() => {
      this.setState({open: false, text_from_search_field: "", selected_index: 0, search_results: []});
    }, 0);
  }

  hideResults () {
    this.setState({open: false});
  }

  displayResults () {
    this.setState({open: true});
  }

  render () {
    let search_results = this.state.search_results;
    let search_container_classes = classNames({
      "search-container__hidden": !this.state.open,
      "search-container": true
    });
    let clear_button_classes = classNames({
      "site-search__clear": true,
      "btn": true,
      "btn-default": true,
      "site-search__clear__hidden": !this.state.text_from_search_field.length
    });

    return <div className="page-header__search">
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
                   value={this.state.text_from_search_field}
                   ref="searchAllBox" />
            <div className="input-group-btn">
              <button className={clear_button_classes} onClick={this.onClearSearch}><i className="glyphicon glyphicon-remove-circle u-gray-light" /></button>
              <button className="site-search__button btn btn-default" type="submit"><i className="glyphicon glyphicon-search" /></button>
            </div>
          </div>
        </form>
        <div className={search_container_classes}
             ref="searchContainer">
           { search_results.map((one_result, idx) => {
              let capitalized_title = capitalizeString(one_result.result_title);
              let search_result_classes = classNames({
                "search-container__results": true,
                "search-container__results--highlighted": idx === this.state.selected_index
              });
              if (one_result.kind_of_owner === "ELECTION") {
                let election_day = one_result.result_summary.split(" ").splice(-1);
                let today = new Date();
                let election_date = new Date(election_day + " 0:00:00");
                let past_election = today > election_date ? " IN PAST" : "";
                console.log("Election election_date ", election_date);
                return <Link key={one_result.local_id}
                             data-idx={idx}
                             to={this.links[idx]}
                             onMouseOver={this.onSearchResultMouseOver}
                             className="search-container__links"
                             onClick={this.onSearchResultClick}>
                  <div className={search_result_classes}>
                    {capitalized_title}
                    {election_day}
                    <span style={{float: "right"}}>{past_election}</span>
                  </div>
                </Link>;
              } else {
                return <Link key={one_result.we_vote_id}
                             data-idx={idx}
                             to={this.links[idx]}
                             onMouseOver={this.onSearchResultMouseOver}
                             className="search-container__links"
                             onClick={this.onSearchResultClick}>
                  <div className={search_result_classes}>
                  <span>
                    <ImageHandler imageUrl={one_result.result_image}
                                  kind_of_ballot_item={one_result.kind_of_owner}
                                  sizeClassName="search-image "
                                  className={one_result.kind_of_owner} />
                  </span>
                    {capitalized_title}
                  </div>
                </Link>;
              }
          }) }
        </div>
      </div>;
  }
}
