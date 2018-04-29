import React, { Component } from "react";
import PropTypes from "prop-types";
import BallotActions from "../../actions/BallotActions";
import BallotItemSearchResult from "../../components/Ballot/BallotItemSearchResult";
import BallotStore from "../../stores/BallotStore";
import Icon from "react-svg-icons";
import { renderLog } from "../../utils/logging";
import OrganizationActions from "../../actions/OrganizationActions";
import SearchBar from "../../components/Search/SearchBar";


export default class BallotSearchResults extends Component {
  static propTypes = {
    clearSearchTextNow: PropTypes.bool,
    googleCivicElectionId: PropTypes.number,
    organizationWeVoteId: PropTypes.string,
    searchUnderwayFunction: PropTypes.func,
  };

  constructor (props) {
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
      clearSearchTextNow: this.props.clearSearchTextNow,
    });
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    // this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
  }

  componentWillReceiveProps (nextProps) {
    // console.log("BallotSearchResults componentWillReceiveProps, nextProps.clearSearchTextNow:", nextProps.clearSearchTextNow);
    this.setState({
      clearSearchTextNow: nextProps.clearSearchTextNow,
    });
  }

  componentWillUnmount (){
    // console.log("BallotSearchResults componentWillUnmount");
    this.ballotStoreListener.remove();
    // this.voterGuideStoreListener.remove();
    // Cannot call in componentWillUnmount: BallotActions.ballotItemOptionsClear();
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
      searchString: searchString,
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
      searchString: "",
    });
  }

  render () {
    renderLog(__filename);
    if (!this.state.ballotItemSearchResultsList) {
      return null;
    }

    const icon_size = 18;
    let icon_color = "#999";

    let actionDescription = <div className="u-stack--md">
        Click <span className="u-no-break"><span className="btn__icon"><Icon name="thumbs-up-icon"
                                                                             width={icon_size} height={icon_size} color={icon_color} /></span> Support</span> or&nbsp;
        <span className="u-no-break"><span className="btn__icon"><Icon name="thumbs-down-icon"
                                                                       width={icon_size} height={icon_size} color={icon_color} /></span> Oppose</span> to
        add an item to your ballot.
      </div>;

    let searchResults = this.state.ballotItemSearchResultsList.map( ballotItem => {
            return <BallotItemSearchResult key={ballotItem.we_vote_id}
                                           allBallotItemsCount={this.state.ballotItemSearchResultsList.length}
                                           {...ballotItem} />;
            });

    return <div className="ballot_search">
      <div>
        <div className="u-padding-bottom--sm">
          <SearchBar clearButton
                     clearFunction={this.clearFunction}
                     clearSearchTextNow={this.state.clearSearchTextNow}
                     placeholder="Search to add Candidates or Measures"
                     searchButton
                     searchFunction={this.searchFunction}
                     searchUpdateDelayTime={500} />

        </div>
        <div className="ballot_search__results_list">
          {this.state.ballotItemSearchResultsList && this.state.ballotItemSearchResultsList.length ?
            <div>
              {actionDescription}
              {searchResults}
            </div> :
            this.state.searchString && this.state.searchString !== "" ?
              <div>No search results found.</div> :
              null
          }
        </div>
      </div>
    </div>;
  }
}
