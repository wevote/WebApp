import React, { Component } from "react";
import PropTypes from "prop-types";
import BallotActions from "../../actions/BallotActions";
import BallotItemSearchResult from "../../components/Ballot/BallotItemSearchResult";
import BallotStore from "../../stores/BallotStore";
import OrganizationActions from "../../actions/OrganizationActions";
import SearchBar from "../../components/Search/SearchBar";


export default class BallotSearchResults extends Component {
  static propTypes = {
    googleCivicElectionId: PropTypes.number,
    organizationWeVoteId: PropTypes.string,
    searchUnderwayFunction: PropTypes.func,
  };

  constructor (props){
    super(props);
    this.state = {
      ballotItemSearchResultsList: [],
      searchString: "",
    };
    this.searchFunction = this.searchFunction.bind(this);
    this.clearFunction = this.clearFunction.bind(this);
  }

  componentDidMount () {
    // console.log("BallotSearchResults componentDidMount");
    this.setState({
      ballotItemSearchResultsList: BallotStore.ballotItemSearchResultsList()
    });
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    // this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
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
    BallotActions.ballotItemOptionsRetrieve(this.props.googleCivicElectionId, searchString);
    if (searchString && searchString !== "") {
      if (this.props.searchUnderwayFunction) {
        this.props.searchUnderwayFunction(true);
      }
    }
    this.setState({ searchString: searchString });
  }

  clearFunction () {
    OrganizationActions.positionListForOpinionMaker(this.props.organizationWeVoteId, true, false, this.props.googleCivicElectionId);
    BallotActions.ballotItemOptionsClear();
    if (this.props.searchUnderwayFunction) {
      this.props.searchUnderwayFunction(false);
    }
    this.setState({ searchString: "" });
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
                     searchButton
                     placeholder="Search for Candidates or Measures to Add"
                     searchFunction={this.searchFunction}
                     clearFunction={this.clearFunction}
                     searchUpdateDelayTime={1000} />

        </div>
        <div className="ballot_search__results_list">
          {this.state.ballotItemSearchResultsList.map( ballotItem => {
            return <BallotItemSearchResult key={ballotItem.we_vote_id}
                                           allBallotItemsCount={this.state.ballotItemSearchResultsList.length}
                                           {...ballotItem} />;
            })
          }
        </div>
      </div>
    </div>;
  }
}
