import React, {Component, PropTypes} from "react";
import { Link } from "react-router";
import SearchAllActions from "../actions/SearchAllActions";
import SearchAllStore from "../stores/SearchAllStore";

export default class SearchAllBox extends Component {
  static propTypes = {
    text_from_search_field: PropTypes.string,
    voter: PropTypes.object
  };

  constructor (props){
    super(props);
    this.state = {};
  }

  componentDidMount (){
    console.log("Entering SearchAllBox, componentDidMount");
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
    console.log("_onSearchAllStoreChange");
    this.setState(
      {
        search_results: SearchAllStore.getSearchResults(),
        text_from_search_field: SearchAllStore.getTextFromSearchField()
      }
    );
  }

  onSearchFieldTextChange (event){
    let text_from_search_field = event.target.value;
    console.log("onSearchFieldTextChange: " + text_from_search_field);
    SearchAllActions.searchAll(text_from_search_field);
  }

  render () {
    var search_results = this.state.search_results;

    return <span>
        <form className="bs-navbar-form" role="search">
        <div className="bs-input-group">
          <input type="text"
                 className="bs-form-control"
                 placeholder="Search We Vote"
                 name="master_search_field"
                 onChange={this.onSearchFieldTextChange.bind(this)}
                 value={this.state.text_from_search_field} />
          <div className="bs-input-group-btn">
            <button className="bs-btn bs-btn-primary" type="submit"><i className="bs-glyphicon bs-glyphicon-search"></i></button>
          </div>
        </div>
        </form>
      { search_results ?
        search_results.map(function(one_result) {
          var searchLink = "/";
          if (one_result.kind_of_owner === "CANDIDATE") {
            searchLink = (one_result.twitter_handle) ? "/" + one_result.twitter_handle : "/candidate/" + one_result.we_vote_id;
          } else if (one_result.kind_of_owner === "OFFICE") {
            searchLink = "/office/" + one_result.we_vote_id;
          } else if (one_result.kind_of_owner === "ORGANIZATION") {
            searchLink = (one_result.twitter_handle) ? "/" + one_result.twitter_handle : "/organization/" + one_result.we_vote_id;
          } else if (one_result.kind_of_owner === "MEASURE") {
            searchLink = "/measure/" + one_result.we_vote_id;
          } else if (one_result.kind_of_owner === "POLITICIAN") {
            searchLink = (one_result.twitter_handle) ? "/" + one_result.twitter_handle : "/politician/" + one_result.we_vote_id;
          }

          return <div className="candidate-card__container">
            <Link to={searchLink}>
            {one_result.result_title}
            </Link>
          </div>;
          }) :
          <span></span> }
      </span>;
  }
}
