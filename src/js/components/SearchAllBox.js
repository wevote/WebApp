import React, {Component, PropTypes} from "react";
import { Link } from "react-router";
import SearchAllActions from "../actions/SearchAllActions";
import SearchAllStore from "../stores/SearchAllStore";
import { enterSearch, exitSearch } from "../utils/search-functions";

export default class SearchAllBox extends Component {
  static propTypes = {
    text_from_search_field: PropTypes.string,
    voter: PropTypes.object
  };

  constructor (props){
    super(props);
    this.state = {
      search_results: ''
    };
  }

  componentDidMount (){
    this.searchAllListener = SearchAllStore.addListener(this._onSearchAllStoreChange.bind(this));
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
    this.setState(
      {
        search_results: SearchAllStore.getSearchResults(),
        text_from_search_field: SearchAllStore.getTextFromSearchField()
      }
    );
  }

  onSearchFieldTextChange (event){
    let text_from_search_field = event.target.value;
    SearchAllActions.searchAll(text_from_search_field);
    this.setState({search_results: ''});
  }

  // both of the two methods below need to have constants refactored
  onSearchFocus () {
    enterSearch();
  }

  onSearchBlur () {
    exitSearch();
  }

  render () {
    var search_results = this.state.search_results;

    return <div className="page-header__search">
        <form className="bs-navbar-form" role="search">
        <div className="bs-input-group site-search">
          <input type="text"
                 className="bs-form-control"
                 placeholder="Search We Vote"
                 name="master_search_field"
                 autoComplete="off"
                 onFocus={this.onSearchFocus.bind(this)}
                 onChange={this.onSearchFieldTextChange.bind(this)}
                 value={this.state.text_from_search_field} />
          <div className="bs-input-group-btn">
            <button className="page-header__search-button bs-btn bs-btn-default" type="submit"><i className="bs-glyphicon bs-glyphicon-search"></i></button>
          </div>
        </div>
        </form>
        <div className="search-container">
          { search_results ?
            search_results.map(function(one_result) {
            var searchLink = "/";
            switch (one_result.kind_of_owner) {
              case "CANDIDATE":
                searchLink = (one_result.twitter_handle) ? "/" + one_result.twitter_handle : "/candidate/" + one_result.we_vote_id;
                break;
              case "OFFICE":
                searchLink = "/office/" + one_result.we_vote_id;
                break;
              case "ORGANIZATION":
                searchLink = (one_result.twitter_handle) ? "/" + one_result.twitter_handle : "/organization/" + one_result.we_vote_id;
                break;
              case "MEASURE":
                searchLink = "/measure/" + one_result.we_vote_id;
                break;
              case "POLITICIAN":
                searchLink = (one_result.twitter_handle) ? "/" + one_result.twitter_handle : "/politician/" + one_result.we_vote_id;
                break;
            }
            return <Link to={searchLink} className="search-container__links">
                <div className="search-container__results">
                  {one_result.result_title}
                </div>
              </Link>;
            }) :
            <span></span>
          }
        </div>
      </div>;
  }
}
