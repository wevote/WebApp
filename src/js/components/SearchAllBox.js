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
    this.onSearchFormSubmit = this.onSearchFormSubmit.bind(this);
    this.navigateToSelectedLink = this.navigateToSelectedLink.bind(this);

    this.searchAllListener = SearchAllStore.addListener(this._onSearchAllStoreChange.bind(this));
  }

  componentDidMount (){
    this.siteLogoText = $('.page-logo:nth-child(1)');
    this.ballot = $('.header-nav__item:nth-child(1)');
    this.requests = $('.header-nav__item:nth-child(2)');
    this.connect = $('.header-nav__item:nth-child(3)');
    this.avatar = $("#avatarContainer");
    this.about = document.getElementsByClassName('header-nav__item')[3];
    this.donate = document.getElementsByClassName('header-nav__item')[4];
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
  }

  componentWillReceiveProps (){
    this._onSearchAllStoreChange();
  }

  componentWillUnmount (){
    this.searchAllListener.remove();
  }

  _onSearchAllStoreChange (){
    console.log("_onSearchAllStoreChange");
    var new_state = {};

    if (SearchAllStore.getSearchResults()) {
      new_state.search_results = SearchAllStore.getSearchResults();
      this.links = new_state.search_results.map((r) => makeSearchLink(r.twitter_handle, r.we_vote_id, r.kind_of_owner));
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

    // Hide the hamburger navigation and site name
    // TODO: convert to flux action
    // for the global nav
   
    this.siteLogoText.addClass("hide");
    this.ballot.addClass("deskOnly");
    this.requests.addClass("deskOnly");
    this.connect.addClass("deskOnly");
    this.donate.className += " hide";
    this.about.className += " hide";
    this.displayResults();
  }

  onSearchBlur () {
    // Delay closing the drop down so that a click on the Link can have time to work
    setTimeout(() => {
      $(".deskOnly").removeClass("deskOnly");
      $(".hide").removeClass("hide");
      this.hideResults();
    }, 250);
  }

  onSearchFormSubmit (e) {
    e.preventDefault();
    //Remove focus from search bar
    document.getElementById("SearchAllBox-input").blur();
    this.navigateToSelectedLink();
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
                "search-container__results__highlighted": idx === this.state.selected_index
              });

              return <Link key={one_result.we_vote_id}
                           data-idx={idx}
                           to={this.links[idx]}
                           onMouseOver={this.onSearchResultMouseOver}
                           className="search-container__links">
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
          }) }
        </div>
      </div>;
  }
}
