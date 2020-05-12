import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { renderLog } from '../../utils/logging';
import BallotActions from '../../actions/BallotActions';
import BallotStore from '../../stores/BallotStore';
import ballotSearchPriority from '../../utils/ballotSearchPriority';
import BallotItemForAddPositions from './BallotItemForAddPositions';
import DelayedLoad from '../Widgets/DelayedLoad';
import OrganizationActions from '../../actions/OrganizationActions';
import SearchBar from '../Search/SearchBar';


class VoterGuideListSearchResults extends Component {
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
      searchString: '',
    };
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
  }

  componentWillReceiveProps (nextProps) {
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

  searchFunction (searchString) {
    if (searchString && searchString !== '') {
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
      searchString: '',
    });
  }

  render () {
    renderLog('VoterGuideListSearchResults.jsx');  // Set LOG_RENDER_EVENTS to log all renders
    const { ballotItemSearchResultsList, searchString, clearSearchTextNow } = this.state;

    let searchTextString = '';

    if (!ballotItemSearchResultsList) {
      return null;
    }

    const noSearchResultsPossibility = searchString && searchString !== '' ?
      <DelayedLoad waitBeforeShow={2000}><div>No search results found.</div></DelayedLoad> : null;

    // const searchResults = ballotItemSearchResultsList.map(ballotItem => (
    //   <BallotItemSearchResult
    //     key={ballotItem.we_vote_id}
    //     we_vote_id={ballotItem.we_vote_id}
    //     allBallotItemsCount={ballotItemSearchResultsList.length}
    //     {...ballotItem}
    //   />
    // ));
    let ballotItemDisplayNameForPosition;
    let ballotItemWeVoteIdForPosition;
    let candidateListForPosition;

    return (
      <div className="ballot_search">
        <div>
          <div className="u-padding-bottom--sm">
            <SearchBar
              clearButton
              clearFunction={this.clearFunction}
              clearSearchTextNow={clearSearchTextNow}
              placeholder="Search for Candidates"
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
                      // is_oppose: item.is_oppose,
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
                  // eslint-disable-next-line no-param-reassign
                  item.candidate_list = candidateListForPosition; // comes in handy for ballotSearchPriority
                  let foundInArray = [];
                  let searchPriority = 0;
                  const candidatesToShowForSearchResults = [];
                  // console.log('VoterGuideListSearchResults > item', item);
                  const results = ballotSearchPriority(searchString, item, false);
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
                  ballotItemWeVoteIdForPosition = (item.kind_of_ballot_item === 'CANDIDATE') ? item.contest_office_we_vote_id : item.ballot_item_we_vote_id;
                  if (!ballotItemDisplayNameForPosition || !ballotItemWeVoteIdForPosition) {
                    return null;
                  }
                  return (
                    <>
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
                        })
                        }
                      </SearchResultsFoundInExplanation>
                      )}
                      { searchPriority > 0  && (
                      <BallotItemForAddPositions
                        externalUniqueId={`addNewPositionKey-${item.we_vote_id}`}
                        allBallotItemsCount={2}
                        // ref={(ref) => { this.ballotItems[oneBallotItem.we_vote_id] = ref; }}
                        ballotItemDisplayName={ballotItemDisplayNameForPosition}
                        candidateList={candidateListForPosition}
                        candidatesToShowForSearchResults={candidatesToShowForSearchResults}
                        kindOfBallotItem={item.kind_of_ballot_item}
                        ballotItemWeVoteId={item.we_vote_id}
                      />
                      )}
                    </>
                  );
                })
                }
              </CardChildListGroup>
            ) : (
              <span>{ noSearchResultsPossibility }</span>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const CardChildListGroup = styled.ul`
  padding: 0;
`;

const SearchTitle = styled.div`
  font-size: 20px;
  margin-top: 12px;
  margin-bottom: 12px;
`;

const SearchResultsFoundInExplanation = styled.div`
  background-color: #C2DCE8;
  color: #0E759F;
  padding: 12px !important;
`;

export default (VoterGuideListSearchResults);

