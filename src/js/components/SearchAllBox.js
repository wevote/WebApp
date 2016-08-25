import React, {Component, PropTypes} from "react";
import { browserHistory, Link } from "react-router";
import SearchAllActions from "../actions/SearchAllActions";
import SearchAllStore from "../stores/SearchAllStore";
import { enterSearch, exitSearch, makeSearchLink } from "../utils/search-functions";

export default class SearchAllBox extends Component {
  static propTypes = {
    text_from_search_field: PropTypes.string,
    voter: PropTypes.object
  };

  constructor (props){
    super(props);
    this.state = {
      search_results: ""
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
    this.setState({search_results: ""});
  }

  // both of the two methods below need to have constants refactored
  onSearchFocus () {
    enterSearch();
  }

  onSearchBlur () {
    exitSearch();
  }

  //handle pressing Enter in search field
  onSearchFormSubmit (event){
    var search_results = this.state.search_results;
    var first_result;
    if (search_results !== undefined) {
     first_result = search_results[0];
    }
    if (first_result === undefined || first_result === null) {
      event.preventDefault();
      return false;
    } else {
      event.preventDefault();
      var searchLink = makeSearchLink(first_result.twitter_handle, first_result.we_vote_id, first_result.kind_of_owner);
      browserHistory.push(searchLink);
      return false;
    }
  }

  render () {
    var search_results = this.state.search_results;

    return <div className="page-header__search">
        <form onSubmit={this.onSearchFormSubmit.bind(this)} className="navbar-form" role="search">
        <div className="input-group site-search">
          <input type="text"
                 className="form-control"
                 placeholder="Search We Vote"
                 name="master_search_field"
                 autoComplete="off"
                 onFocus={this.onSearchFocus.bind(this)}
                 onChange={this.onSearchFieldTextChange.bind(this)}
                 value={this.state.text_from_search_field} />
          <div className="input-group-btn">
            <button className="page-header__search-button btn btn-default" type="submit"><i className="glyphicon glyphicon-search"></i></button>
          </div>
        </div>
        </form>
        <div className="search-container">
          { search_results ?
            search_results.map(function (one_result) {
            return <Link key={one_result.we_vote_id} to={makeSearchLink(one_result.twitter_handle, one_result.we_vote_id, one_result.kind_of_owner)} className="search-container__links">
                <div className="search-container__results">
                  {one_result.result_title}
                </div>
              </Link>;
            }) :
            null
          }
        </div>
      </div>;
  }
}
