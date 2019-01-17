import React, { Component } from "react";
import PropTypes from "prop-types";
import BallotActions from "../../actions/BallotActions";
import BallotItemSearchResult from "./BallotItemSearchResult";
import BallotStore from "../../stores/BallotStore";
import { cordovaDot } from "../../utils/cordovaUtils";
import { renderLog } from "../../utils/logging";
import OrganizationActions from "../../actions/OrganizationActions";
import SearchBar from "../Search/SearchBar";


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

  componentWillUnmount () {
    // console.log("BallotSearchResults componentWillUnmount");
    this.ballotStoreListener.remove();
    // this.voterGuideStoreListener.remove();
    // Cannot call in componentWillUnmount: BallotActions.ballotItemOptionsClear();
  }

  onBallotStoreChange () {
    // console.log("BallotSearchResults onBallotStoreChange, BallotStore.ballotProperties: ", BallotStore.ballotProperties);
    this.setState({
      ballotItemSearchResultsList: BallotStore.ballotItemSearchResultsList(),
    });
  }

  onVoterGuideStoreChange () { // eslint-disable-line
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
      searchString,
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
    const { ballotItemSearchResultsList, searchString, clearSearchTextNow } = this.state;
    renderLog(__filename);
    if (!ballotItemSearchResultsList) {
      return null;
    }

    const iconSize = 18;
    const iconColor = "#999";
    const noSearchResultsPossibility = searchString && searchString !== "" ?
      <div>No search results found.</div> : null;

    const actionDescription = (
      <div className="u-stack--md">
        Click
        {" "}
        <span className="u-no-break">
          <span className="btn__icon">
            <img src={cordovaDot("/img/global/svg-icons/thumbs-up-icon.svg")}
                 width={iconSize}
                 height={iconSize}
                 color={iconColor}
                 alt="thumbs up"
            />
          </span>
          {" "}
          Support
        </span>
        {" "}
        or&nbsp;
        <span className="u-no-break">
          <span className="btn__icon">
            <img src={cordovaDot("/img/global/svg-icons/thumbs-down-icon.svg")}
                 width={iconSize}
                 height={iconSize}
                 color={iconColor}
                 alt="thumbs down"
            />
          </span>
          {" "}
          Oppose
        </span>
        {" "}
        to add an item to your ballot.
      </div>
    );

    // Jan 2019, Steve:  What sets the state.ballotItemSearchResultsList? (I think nothing sets it)
    const searchResults = ballotItemSearchResultsList.map(ballotItem => (
      <BallotItemSearchResult
        key={ballotItem.we_vote_id}
        allBallotItemsCount={ballotItemSearchResultsList.length}
        {...ballotItem}
      />
    ));

    return (
      <div className="ballot_search">
        <div>
          <div className="u-padding-bottom--sm">
            <SearchBar
              clearButton
              clearFunction={this.clearFunction}
              clearSearchTextNow={clearSearchTextNow}
              placeholder="Search to add Candidates or Measures"
              searchButton
              searchFunction={this.searchFunction}
              searchUpdateDelayTime={500}
            />

          </div>
          <div className="ballot_search__results_list">
            {ballotItemSearchResultsList && ballotItemSearchResultsList.length ? (
              <div>
                {actionDescription}
                {searchResults}
              </div>
            ) :
              { noSearchResultsPossibility }
            }
          </div>
        </div>
      </div>
    );
  }
}
