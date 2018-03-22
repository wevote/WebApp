import React, { Component } from "react";
import PropTypes from "prop-types";
import BallotActions from "../../actions/BallotActions";
import BallotItemSearchResult from "../../components/Ballot/BallotItemSearchResult";
import BallotStore from "../../stores/BallotStore";
import OrganizationActions from "../../actions/OrganizationActions";
import SearchBar from "../../components/Search/SearchBar";


export default class BallotSearchResults extends Component {
  static propTypes = {
    clearSearchTextNow: PropTypes.bool,
    googleCivicElectionId: PropTypes.number,
    organizationWeVoteId: PropTypes.string,
    searchUnderwayFunction: PropTypes.func,
  };

  constructor (props){
    super(props);
    this.state = {
      ballotItemSearchResultsList: [],
      clearSearchTextNow: false,
      searchString: "",
    };
    this.searchFunction = this.searchFunction.bind(this);
    this.clearFunction = this.clearFunction.bind(this);
  }

  componentDidMount () {
    // console.log("BallotSearchResults componentDidMount, this.props.clearSearchTextNow:", this.props.clearSearchTextNow);
    this.setState({
      ballotItemSearchResultsList: BallotStore.ballotItemSearchResultsList(),
      clearSearchTextNow: this.props.clearSearchTextNow
    });
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    // this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
  }

  componentWillReceiveProps (nextProps) {
    // console.log("BallotSearchResults componentWillReceiveProps, nextProps.clearSearchTextNow:", nextProps.clearSearchTextNow);
    this.setState({
      clearSearchTextNow: nextProps.clearSearchTextNow
    });
  }

  componentWillUnmount (){
    // console.log("BallotSearchResults componentWillUnmount");
    this.ballotStoreListener.remove();
    // this.voterGuideStoreListener.remove();
    BallotActions.ballotItemOptionsClear();
  }

  onBallotStoreChange (){
    // console.log("BallotSearchResults onBallotStoreChange, BallotStore.ballot_properties: ", BallotStore.ballot_properties);
    this.setState({
      ballotItemSearchResultsList: BallotStore.ballotItemSearchResultsList()
    });
  }

  onVoterGuideStoreChange (){
    // console.log("BallotSearchResults onVoterGuideStoreChange");
  }

  searchFunction (searchString) {
    if (searchString && searchString !== "") {
      BallotActions.ballotItemOptionsRetrieve(this.props.googleCivicElectionId, searchString);
      if (this.props.searchUnderwayFunction) {
        this.props.searchUnderwayFunction(true);
      }
    } else {
      BallotActions.ballotItemOptionsClear();
    }
    this.setState({
      clearSearchTextNow: false,
      searchString: searchString
    });
  }

  clearFunction () {
    OrganizationActions.positionListForOpinionMaker(this.props.organizationWeVoteId, true, false, this.props.googleCivicElectionId);
    BallotActions.ballotItemOptionsClear();
    if (this.props.searchUnderwayFunction) {
      this.props.searchUnderwayFunction(false);
    }
    this.setState({
      clearSearchTextNow: false,
      searchString: ""
    });
  }

  render () {
    //console.log("BallotSearchResults render, this.state: ", this.state);
    if (!this.state.ballotItemSearchResultsList) {
      return null;
    }

    return <div className="ballot_search">
      <div>
        <div className="u-padding-bottom--sm">
          <SearchBar clearButton
                     clearFunction={this.clearFunction}
                     clearSearchTextNow={this.state.clearSearchTextNow}
                     placeholder="Search for Candidates or Measures to Add"
                     searchButton
                     searchFunction={this.searchFunction}
                     searchUpdateDelayTime={1000} />

        </div>
        <div className="ballot_search__results_list">
          {this.state.ballotItemSearchResultsList && this.state.ballotItemSearchResultsList.length ?
            this.state.ballotItemSearchResultsList.map( ballotItem => {
            return <BallotItemSearchResult key={ballotItem.we_vote_id}
                                           allBallotItemsCount={this.state.ballotItemSearchResultsList.length}
                                           {...ballotItem} />;
            }) :
            this.state.searchString && this.state.searchString !== "" ?
              <div>No search results found.</div> :
              null
          }
        </div>
      </div>
    </div>;
  }
}
