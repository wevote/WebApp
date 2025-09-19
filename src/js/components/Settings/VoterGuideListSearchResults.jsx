import styled from 'styled-components';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import BallotActions from '../../actions/BallotActions';
import OrganizationActions from '../../actions/OrganizationActions';
import { SearchTitle } from '../../common/components/Style/FilterStyles';
import { renderLog } from '../../common/utils/logging';
import BallotStore from '../../stores/BallotStore';
import voterGuideSearchPriority from '../../utils/voterGuideSearchPriority';
import SearchBar2024 from '../../common/components/Search/SearchBar2024';
import BallotItemForAddPositions from './BallotItemForAddPositions';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));
const ShowMoreItems = React.lazy(() => import(/* webpackChunkName: 'ShowMoreItems' */ '../Widgets/ShowMoreItems'));


class VoterGuideListSearchResults extends Component {
  constructor (props) {
    super(props);
    this.state = {
      ballotItemSearchResultsList: [],
      clearSearchTextNow: false,
      searchString: '',
      loadingMoreItems: false,
      numberOfItemsToDisplay: 5,
    };
    this.onScroll = this.onScroll.bind(this);
    this.searchFunction = this.searchFunction.bind(this);
    this.clearFunction = this.clearFunction.bind(this);
  }

  componentDidMount () {
    // console.log('VoterGuideListSearchResults componentDidMount, this.props.clearSearchTextNow:', this.props.clearSearchTextNow);
    this.setState({
      ballotItemSearchResultsList: BallotStore.ballotItemSearchResultsList(),
      clearSearchTextNow: this.props.clearSearchTextNow,
    });
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    // this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    window.addEventListener('scroll', this.onScroll);
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    // console.log("VoterGuideListSearchResults componentWillReceiveProps, nextProps.clearSearchTextNow:", nextProps.clearSearchTextNow);
    this.setState({
      clearSearchTextNow: nextProps.clearSearchTextNow,
    });
  }

  componentWillUnmount () {
    // console.log("VoterGuideListSearchResults componentWillUnmount");
    this.ballotStoreListener.remove();
    // this.voterGuideStoreListener.remove();
    // Cannot call in componentWillUnmount: BallotActions.ballotItemOptionsClear();
    clearTimeout(this.ballotItemTimer);
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll () {
    const showMoreItemsElement =  document.querySelector('#showMoreItemsId');
    // console.log('showMoreItemsElement: ', showMoreItemsElement);
    // console.log('loadingMoreItems: ', this.state.loadingMoreItems);
    if (showMoreItemsElement) {
      const {
        numberOfItemsToDisplay, ballotItemSearchResultsList,
      } = this.state;

      // console.log('window.height: ', window.innerHeight);
      // console.log('Bottom: ', showMoreItemsElement.getBoundingClientRect().bottom);
      // console.log('numberOfItemsToDisplay: ', numberOfItemsToDisplay);
      // console.log('totalNumberOfBallotItems: ', ballotItemSearchResultsList.length);
      if (numberOfItemsToDisplay < ballotItemSearchResultsList.length) {
        if (showMoreItemsElement.getBoundingClientRect().bottom <= window.innerHeight) {
          this.setState({ loadingMoreItems: true });
          this.increaseNumberOfItemsToDisplay();
        }
      } else {
        this.setState({ loadingMoreItems: false });
      }
    }
  }

  onBallotStoreChange () {
    // console.log("VoterGuideListSearchResults onBallotStoreChange, BallotStore.ballotProperties: ", BallotStore.ballotProperties);
    this.setState({
      ballotItemSearchResultsList: BallotStore.ballotItemSearchResultsList(),
    });
  }

  onVoterGuideStoreChange () { // eslint-disable-line
    // console.log("VoterGuideListSearchResults onVoterGuideStoreChange");
  }

  increaseNumberOfItemsToDisplay = () => {
    let { numberOfItemsToDisplay } = this.state;
    // console.log('Number of ballot items before increment: ', numberOfItemsToDisplay);

    numberOfItemsToDisplay += 5;
    // console.log('Number of ballot items after increment: ', numberOfItemsToDisplay);

    clearTimeout(this.ballotItemTimer);
    this.ballotItemTimer = setTimeout(() => {
      this.setState({
        numberOfItemsToDisplay,
      });
    }, 500);
  }

  searchFunction (searchString) {
    if (searchString && searchString !== '') {
      BallotActions.ballotItemOptionsRetrieve('', searchString);
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
      searchString: '',
    });
  }

  render () {
    renderLog('VoterGuideListSearchResults.jsx');  // Set LOG_RENDER_EVENTS to log all renders
    const { ballotItemSearchResultsList, searchString, clearSearchTextNow, loadingMoreItems, numberOfItemsToDisplay } = this.state;

    let searchTextString = '';
    let numberOfItemsDisplayed = 0;

    if (!ballotItemSearchResultsList) {
      return null;
    }

    const noSearchResultsPossibility = searchString && searchString !== '' ?
      <DelayedLoad waitBeforeShow={2000}><div>No search results found.</div></DelayedLoad> : null;

    // const searchResults = ballotItemSearchResultsList.map(ballotItem => (
    //   <BallotItemSearchResult
    //     key={ballotItem.we_vote_id}
    //     allBallotItemsCount={ballotItemSearchResultsList.length}
    //     ballotItemWeVoteId={ballotItem.we_vote_id}
    //     kindOfBallotItem={ballotItem.kind_of_ballot_item}
    //   />
    // ));
    let ballotItemDisplayNameForPosition;
    let ballotItemWeVoteId;
    let candidateListForPosition;

    return (
      <div className="ballot_search">
        <div>
          <div className="u-padding-bottom--sm">
            <SearchBar2024
              clearButton
              clearFunction={this.clearFunction}
              clearSearchTextNow={clearSearchTextNow}
              placeholder="Search for Candidates or Measures"
              searchButton
              searchFunction={this.searchFunction}
              searchUpdateDelayTime={500}
            />

          </div>
          <div className="ballot_search__results_list">
            {(this.props.searchUnderwayFunction && searchString) && (
            <SearchTitle>
              Searching for &quot;
              {searchString}
              &quot;
            </SearchTitle>
            )}
            {ballotItemSearchResultsList && ballotItemSearchResultsList.length ? (
              <CardChildListGroup className="card-child__list-group">
                {(ballotItemSearchResultsList).map((item) => {
                  if (item.kind_of_ballot_item === 'CANDIDATE') {
                    candidateListForPosition = [{
                      ballot_item_display_name: item.ballot_item_display_name,
                      candidate_photo_url_large: item.candidate_photo_url_large,
                      candidate_photo_url_medium: item.candidate_photo_url_medium,
                      candidate_photo_url_tiny: item.candidate_photo_url_tiny,
                      contest_office_id: item.contest_office_id,
                      contest_office_name: item.contest_office_name,
                      contest_office_we_vote_id: item.contest_office_we_vote_id,
                      google_civic_election_id: item.google_civic_election_id,
                      twitter_handle: item.twitter_handle,
                      kind_of_ballot_item: item.kind_of_ballot_item,
                      party: item.party,
                      state_code: item.state_code,
                      twitter_followers_count: item.twitter_followers_count,
                      we_vote_id: item.we_vote_id,
                      twitter_description: item.twitter_description,
                      ballotpedia_candidate_summary: item.ballotpedia_candidate_summary,
                    }];
                  } else {
                    candidateListForPosition = [];
                  }
                  // item.candidate_list = candidateListForPosition; necessary only for ballotsearchpriority
                  let foundInArray = [];
                  let searchPriority = 0;
                  const candidatesToShowForSearchResults = [];
                  // console.log('VoterGuideListSearchResults > item', item);

                  const results = voterGuideSearchPriority(searchString, item, false);
                  ({ searchPriority } = results);
                  ({ foundInArray } = results);
                  // console.log('VoterGuideListSearchResults > results', results);

                  let foundInItemsAlreadyShown = 0;
                  let searchWordAlreadyShown = 0;
                  if (searchString) {
                    const wordsArray = searchString.split(' ');
                    searchTextString = wordsArray.map((oneItem) => {
                      const foundInStringItem = `${searchWordAlreadyShown ? ' or ' : ''}"${oneItem}"`;
                      searchWordAlreadyShown += 1;
                      return foundInStringItem;
                    });
                  }

                  candidatesToShowForSearchResults.push(item.we_vote_id);
                  ballotItemDisplayNameForPosition = (item.kind_of_ballot_item === 'CANDIDATE') ? item.contest_office_name : item.ballot_item_display_name;
                  ballotItemWeVoteId = (item.kind_of_ballot_item === 'CANDIDATE') ? item.we_vote_id : item.measure_we_vote_id;
                  if (!ballotItemDisplayNameForPosition || !ballotItemWeVoteId) {
                    return null;
                  }
                  if (item) {
                    if (numberOfItemsDisplayed >= numberOfItemsToDisplay) {
                      return null;
                    }
                    numberOfItemsDisplayed += 1;
                  }
                  // console.log('render', numberOfItemsDisplayed, numberOfItemsToDisplay);
                  return (
                    <div key={`candidate-list-${ballotItemWeVoteId}`}>
                      {!!(searchString && foundInArray && foundInArray.length && searchPriority > 0) && (
                      <SearchResultsFoundInExplanation>
                        {searchTextString}
                        {' '}
                        found in
                        {' '}
                        {foundInArray.map((oneItem) => {
                          const foundInStringItem = (
                            <span key={foundInItemsAlreadyShown}>
                              {foundInItemsAlreadyShown ? ', ' : ''}
                              {oneItem}
                            </span>
                          );
                          foundInItemsAlreadyShown += 1;
                          return foundInStringItem;
                        })}
                      </SearchResultsFoundInExplanation>
                      )}
                      { searchPriority > 0  && (
                      <BallotItemForAddPositions
                        externalUniqueId={`voterGuideKey-${ballotItemWeVoteId}`}
                        allBallotItemsCount={2}
                        // ref={(ref) => { this.ballotItems[oneBallotItem.we_vote_id] = ref; }}
                        ballotItemDisplayName={ballotItemDisplayNameForPosition}
                        candidateList={candidateListForPosition}
                        candidatesToShowForSearchResults={candidatesToShowForSearchResults}
                        kindOfBallotItem={item.kind_of_ballot_item}
                        // ballotItemWeVoteId={item.we_vote_id} will not work for measures
                        ballotItemWeVoteId={ballotItemWeVoteId}
                      />
                      )}
                    </div>
                  );
                })}
              </CardChildListGroup>
            ) : (
              <span>
                <Suspense fallback={<></>}>
                  { noSearchResultsPossibility }
                </Suspense>
              </span>
            )}
            {ballotItemSearchResultsList.length > 0 && (
            <ShowMoreItemsWrapper id="showMoreItemsId" onClick={this.increaseNumberOfItemsToDisplay}>
              <ShowMoreItems
                loadingMoreItemsNow={loadingMoreItems}
                numberOfItemsDisplayed={numberOfItemsDisplayed}
                numberOfItemsTotal={ballotItemSearchResultsList.length}
              />
            </ShowMoreItemsWrapper>
            )}
          </div>
        </div>
      </div>
    );
  }
}
VoterGuideListSearchResults.propTypes = {
  clearSearchTextNow: PropTypes.bool,
  googleCivicElectionId: PropTypes.number,
  organizationWeVoteId: PropTypes.string,
  searchUnderwayFunction: PropTypes.func,
};

const CardChildListGroup = styled('ul')`
  padding: 0;
`;

const SearchResultsFoundInExplanation = styled('div')`
  background-color: #C2DCE8;
  color: #0E759F;
  padding: 12px !important;
`;

const ShowMoreItemsWrapper = styled('div')`
`;

export default (VoterGuideListSearchResults);

