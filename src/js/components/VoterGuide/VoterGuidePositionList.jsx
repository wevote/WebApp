// import { Comment } from '@mui/icons-material';
import { Info, ThumbDown, ThumbUp } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FriendActions from '../../actions/FriendActions';
import OrganizationActions from '../../actions/OrganizationActions';
import { getStateCodesFoundInObjectList } from '../../common/utils/addressFunctions';
import apiCalming from '../../common/utils/apiCalming';
import { renderLog } from '../../common/utils/logging';
import FriendStore from '../../stores/FriendStore';
import OrganizationStore from '../../stores/OrganizationStore';
import FilterBase from '../Filter/FilterBase';
import VoterGuidePositionFilter from '../Filter/VoterGuidePositionFilter';
import NumberOfItemsFound from '../Widgets/NumberOfItemsFound';

const ShowMoreItems = React.lazy(() => import(/* webpackChunkName: 'ShowMoreItems' */ '../Widgets/ShowMoreItems'));
const VoterGuidePositionItem = React.lazy(() => import(/* webpackChunkName: 'VoterGuidePositionItem' */ './VoterGuidePositionItem'));


// Thumbs up/down needs to be fixed
const groupedFilters = [
  {
    filterDisplayName: 'pro',
    filterName: 'showSupportFilter',
    icon: <ThumbUp />,
    filterId: 'thumbUpFilter',
  },
  {
    filterDisplayName: 'con',
    filterName: 'showOpposeFilter',
    icon: <ThumbDown />,
    filterId: 'thumbDownFilter',
  },
  {
    filterDisplayName: 'info',
    filterName: 'showInformationOnlyFilter',
    icon: <Info />,
    filterId: 'infoFilter',
  },
];

// We are planning to add a sort where the comments are at the top, so a show comment button isn't needed
const islandFilters = [
  // {
  //   filterName: 'showCommentFilter',
  //   icon: <Comment />,
  //   filterDisplayName: 'Has Comment',
  //   filterId: 'islandFilterCommented',
  // },
];

const STARTING_NUMBER_OF_POSITIONS_TO_DISPLAY = 6;

class VoterGuidePositionList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      atLeastOneFriendAdded: false,
      filteredPositionList: [],
      filteredPositionListLength: 0,
      isSearching: false,
      loadingMoreItems: false,
      numberOfPositionItemsDisplayed: 0,
      numberOfPositionItemsToDisplay: STARTING_NUMBER_OF_POSITIONS_TO_DISPLAY,
      positionList: [],
      positionSearchResults: [],
      searchText: '',
      stateCodesToDisplay: [],
      totalNumberOfPositionSearchResults: 0,
    };
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount () {
    // console.log('VoterGuidePositionList componentDidMount');
    const { incomingPositionList } = this.props;
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));

    // console.log('START componentDidMount incomingPositionList:', incomingPositionList);
    const candidateAlreadySeenThisYear = {};

    // Replicate onOrganizationStoreChange
    const organizationsVoterIsFollowing = OrganizationStore.getOrganizationsVoterIsFollowing();
    // eslint-disable-next-line arrow-body-style
    const positionListModified1 = incomingPositionList.map((position) => {
      // console.log('VoterGuidePositionList componentDidMount positionListModified1, position: ', position);
      if (!position.position_we_vote_id) {
        // console.log('MISSING position.position_we_vote_id');
        return null;
      }
      if (candidateAlreadySeenThisYear[position.ballot_item_we_vote_id] && candidateAlreadySeenThisYear[position.ballot_item_we_vote_id].includes(position.position_year)) {
        // console.log('componentDidMount already seen');
        return null;
      } else if (candidateAlreadySeenThisYear[position.ballot_item_we_vote_id]) {
        candidateAlreadySeenThisYear[position.ballot_item_we_vote_id].push(position.position_year);
      } else {
        candidateAlreadySeenThisYear[position.ballot_item_we_vote_id] = [];
        candidateAlreadySeenThisYear[position.ballot_item_we_vote_id].push(position.position_year);
      }
      return ({
        ...position,
        followed: organizationsVoterIsFollowing.filter((org) => (position && org.organization_we_vote_id === position.speaker_we_vote_id)).length > 0,
      });
    });
    const positionListModified1Filtered = positionListModified1.filter((position) => position != null);

    // Replicate onFriendStoreChange
    const organizationsVoterIsFriendsWith = FriendStore.currentFriendsOrganizationWeVoteIDList();
    // console.log('VoterGuidePositionList onFriendStoreChange, organizationsVoterIsFriendsWith:', organizationsVoterIsFriendsWith);
    // eslint-disable-next-line arrow-body-style
    const positionListModified2 = positionListModified1Filtered.map((position) => {
      // console.log('VoterGuidePositionList componentDidMount positionListModified2, position: ', position);
      return ({
        ...position,
        currentFriend: organizationsVoterIsFriendsWith.filter((organizationWeVoteId) => (position && organizationWeVoteId === position.speaker_we_vote_id)).length > 0,
      });
    });
    const positionListModified2Filtered = positionListModified2.filter((position) => position != null);

    OrganizationActions.organizationsFollowedRetrieve();
    if (!organizationsVoterIsFriendsWith.length > 0) {
      if (apiCalming('friendList', 1500)) {
        FriendActions.currentFriends();
      }
    }

    const stateCodesToDisplay = getStateCodesFoundInObjectList(incomingPositionList);
    // console.log('stateCodesToDisplay:', stateCodesToDisplay);

    window.addEventListener('scroll', this.onScroll);
    this.setState({
      positionList: positionListModified2Filtered,
      filteredPositionList: positionListModified2Filtered,
      filteredPositionListLength: positionListModified2Filtered.length,
      stateCodesToDisplay,
      numberOfPositionItemsToDisplay: this.props.startingNumberOfPositionsToDisplay || STARTING_NUMBER_OF_POSITIONS_TO_DISPLAY,
    });
  }

  // UNSAFE_componentWillReceiveProps (nextProps) {
  //   let { incomingPositionList } = nextProps;
  //   console.log('VoterGuidePositionList componentWillReceiveProps, incomingPositionList:', incomingPositionList);
  //   const candidateAlreadySeenThisYear = {};
  //
  //   // Replicate onOrganizationStoreChange
  //   const organizationsVoterIsFollowing = OrganizationStore.getOrganizationsVoterIsFollowing();
  //   // eslint-disable-next-line arrow-body-style
  //   incomingPositionList = incomingPositionList.map((position) => {
  //     // console.log('VoterGuidePositionList onOrganizationStoreChange, position: ', position);
  //     if (!position) {
  //       return null;
  //     }
  //     if (candidateAlreadySeenThisYear[position.ballot_item_we_vote_id] && candidateAlreadySeenThisYear[position.ballot_item_we_vote_id].includes(position.position_year)) {
  //       // console.log('componentWillReceiveProps already seen');
  //       return null;
  //     } else if (candidateAlreadySeenThisYear[position.ballot_item_we_vote_id]) {
  //       candidateAlreadySeenThisYear[position.ballot_item_we_vote_id].push(position.position_year);
  //     } else {
  //       candidateAlreadySeenThisYear[position.ballot_item_we_vote_id] = [];
  //       candidateAlreadySeenThisYear[position.ballot_item_we_vote_id].push(position.position_year);
  //     }
  //     return ({
  //       ...position,
  //       followed: organizationsVoterIsFollowing.filter(org => (org && position && org.organization_we_vote_id === position.speaker_we_vote_id)).length > 0,
  //     });
  //   });
  //
  //   const stateCodesToDisplay = getStateCodesFoundInObjectList(incomingPositionList);
  //   this.setState({
  //     positionList: incomingPositionList,
  //     // filteredPositionList: incomingPositionList, // Do not update
  //     stateCodesToDisplay,
  //   });
  //   // }
  // }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if not needed
    if (this.state.atLeastOneFriendAdded !== nextState.atLeastOneFriendAdded) {
      return true;
    }
    if (this.state.filteredPositionListLength !== nextState.filteredPositionListLength) {
      return true;
    }
    if (this.state.isSearching !== nextState.isSearching) {
      return true;
    }
    if (this.state.loadingMoreItems !== nextState.loadingMoreItems) {
      return true;
    }
    if (this.state.numberOfPositionItemsDisplayed !== nextState.numberOfPositionItemsDisplayed) {
      return true;
    }
    if (this.state.numberOfPositionItemsToDisplay !== nextState.numberOfPositionItemsToDisplay) {
      return true;
    }
    if (this.state.searchText !== nextState.searchText) {
      return true;
    }
    if (this.state.totalNumberOfPositionSearchResults !== nextState.totalNumberOfPositionSearchResults) {
      return true;
    }

    const { incomingPositionList } = nextProps;
    const { incomingPositionList: priorPositionList } = this.props;
    const incomingPositionListLength = incomingPositionList ? incomingPositionList.length : 0;
    const priorPositionListLength = priorPositionList ? priorPositionList.length : 0;
    if (incomingPositionListLength !== priorPositionListLength) {
      return true;
    }
    if (JSON.stringify(this.state.filteredPositionList) !== JSON.stringify(nextState.filteredPositionList)) {
      return true;
    }
    if (JSON.stringify(this.state.stateCodesToDisplay) !== JSON.stringify(nextState.stateCodesToDisplay)) {
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    this.organizationStoreListener.remove();
    window.removeEventListener('scroll', this.onScroll);
    if (this.positionItemTimer) clearTimeout(this.positionItemTimer);
  }

  onFriendStoreChange () {
    // console.log('onFriendStoreChange');
    const { positionList } = this.state; // filteredPositionList,
    const organizationsVoterIsFriendsWith = FriendStore.currentFriendsOrganizationWeVoteIDList();
    // console.log('VoterGuidePositionList onFriendStoreChange, organizationsVoterIsFriendsWith:', organizationsVoterIsFriendsWith);
    // eslint-disable-next-line arrow-body-style
    let currentFriend;
    let atLeastOneFriendAdded = false;
    const positionListWithFriendData = positionList.map((position) => {
      // console.log('VoterGuidePositionList onFriendStoreChange, position: ', position);
      currentFriend = organizationsVoterIsFriendsWith.filter((organizationWeVoteId) => (position && organizationWeVoteId === position.speaker_we_vote_id)).length > 0;
      if (currentFriend) {
        atLeastOneFriendAdded = true;
      }
      return ({
        ...position,
        atLeastOneFriendAdded,
        currentFriend,
      });
    });
    if (atLeastOneFriendAdded) {
      this.setState({
        positionList: positionListWithFriendData,
      });
    }
  }

  onOrganizationStoreChange () {
    // console.log('VoterGuidePositionList onOrganizationStoreChange');
    const { filteredPositionList, positionList } = this.state;
    const organizationsVoterIsFollowing = OrganizationStore.getOrganizationsVoterIsFollowing();
    // eslint-disable-next-line arrow-body-style
    const positionListWithFollowedData = positionList.map((position) => {
      // console.log('VoterGuidePositionList onOrganizationStoreChange, position: ', position);
      return ({
        ...position,
        followed: organizationsVoterIsFollowing.filter((org) => (org && position && org.organization_we_vote_id === position.speaker_we_vote_id)).length > 0,
      });
    });
    // eslint-disable-next-line arrow-body-style
    const filteredPositionListWithFollowedData = filteredPositionList.map((position) => {
      // console.log('VoterGuidePositionList onOrganizationStoreChange, position: ', position);
      return ({
        ...position,
        followed: organizationsVoterIsFollowing.filter((org) => (org && position && org.organization_we_vote_id === position.speaker_we_vote_id)).length > 0,
      });
    });
    this.setState({
      positionList: positionListWithFollowedData,
      filteredPositionList: filteredPositionListWithFollowedData,
      filteredPositionListLength: filteredPositionListWithFollowedData.length,
    });
  }

  onFilteredItemsChange = (filteredPositions) => {
    // console.log('onFilteredItemsChange, filteredPositions:', filteredPositions);
    this.setState({
      filteredPositionList: filteredPositions,
      filteredPositionListLength: filteredPositions.length,
      isSearching: false,
    });
  }

  onScroll () {
    if (this.props.turnOffOnScroll) {
      return null;
    }

    const showMoreItemsElement =  document.querySelector('#showMoreItemsId');
    // console.log('showMoreItemsElement: ', showMoreItemsElement);
    // console.log('Loading more: ', this.state.loadingMoreItems);
    if (showMoreItemsElement) {
      // console.log('onScroll');
      const {
        filteredPositionListLength, isSearching, loadingMoreItems,
        numberOfPositionItemsToDisplay, totalNumberOfPositionSearchResults,
      } = this.state;

      // console.log('window.height: ', window.innerHeight);
      // console.log('Window Scroll: ', window.scrollY);
      // console.log('Bottom: ', showMoreItemsElement.getBoundingClientRect().bottom);
      // console.log('filteredPositionListLength: ', filteredPositionListLength);
      // console.log('numberOfPositionItemsToDisplay: ', numberOfPositionItemsToDisplay);

      if ((isSearching && (numberOfPositionItemsToDisplay < totalNumberOfPositionSearchResults)) ||
          (!isSearching && (numberOfPositionItemsToDisplay < filteredPositionListLength))) {
        if (showMoreItemsElement.getBoundingClientRect().bottom <= window.innerHeight) {
          this.setState({ loadingMoreItems: true });
          this.increaseNumberOfPositionItemsToDisplay();
        } else {
          this.setState({ loadingMoreItems: false });
        }
      } else if (loadingMoreItems) {
        this.setState({ loadingMoreItems: false });
      }
    }
    return null;
  }

  onPositionSearch = (searchText, filteredItems) => {
    // console.log('onPositionSearch');
    // window.scrollTo(0, 0); // This causes unpleasant jump in mobile
    const totalNumberOfPositionSearchResults = filteredItems.length || 0;
    this.setState({
      positionSearchResults: filteredItems,
      searchText,
      totalNumberOfPositionSearchResults,
    });
  };

  handleToggleSearchBallot = (isSearching) => {
    // console.log('VoterGuideSettingsAddPositions handleToggleSearchBallot isSearching:', isSearching);
    // When we toggle, reset numberOfPositionItemsToDisplay
    this.setState({
      isSearching: !isSearching,
      loadingMoreItems: false,
      numberOfPositionItemsToDisplay: STARTING_NUMBER_OF_POSITIONS_TO_DISPLAY,
    });
  };

  increaseNumberOfPositionItemsToDisplay = () => {
    let { numberOfPositionItemsToDisplay } = this.state;
    // console.log('Number of position items before increment: ', numberOfPositionItemsToDisplay);

    numberOfPositionItemsToDisplay += 5;
    // console.log('Number of position items after increment: ', numberOfPositionItemsToDisplay);

    if (this.positionItemTimer) clearTimeout(this.positionItemTimer);
    this.positionItemTimer = setTimeout(() => {
      this.setState({
        numberOfPositionItemsToDisplay,
      });
    }, 500);
  }

  render () {
    const { positionList, stateCodesToDisplay } = this.state;
    renderLog('VoterGuidePositionList');  // Set LOG_RENDER_EVENTS to log all renders
    if (!positionList) {
      // console.log('VoterGuidePositionList Loading...');
      return <div>Loading...</div>;
    }
    const { organizationWeVoteId } = this.props;
    const {
      filteredPositionList, filteredPositionListLength, isSearching, loadingMoreItems,
      numberOfPositionItemsToDisplay, positionSearchResults, searchText,
      totalNumberOfPositionSearchResults,
    } = this.state;
    // console.log('VoterGuidePositionList render');
    // console.log('this.state.positionList render: ', this.state.positionList);
    // console.log('this.state.filteredPositionList render: ', this.state.filteredPositionList);
    let showTitle = false;
    let count;
    for (count = 0; count < positionList.length; count++) {
      showTitle = true;
    }
    const selectedFiltersDefault = ['sortByAlphabetical', 'upcomingOnly', 'federalRaces', 'stateRaces', 'measureRaces', 'localRaces'];
    let numberOfPositionItemsDisplayed = 0;
    let searchTextString = '';
    return (
      <div>
        <FilterWrapper>
          { showTitle ?
            <span>{this.props.positionListExistsTitle}</span> :
            null}
          <FilterBase
            allItems={positionList}
            filteredPositionListLength={filteredPositionListLength}
            groupedFilters={filteredPositionListLength > 10 ? groupedFilters : []}
            islandFilters={islandFilters}
            numberOfItemsFoundNode={(
              <NumberOfItemsFound
                numberOfItemsTotal={isSearching ? totalNumberOfPositionSearchResults : filteredPositionListLength}
              />
            )}
            onFilteredItemsChange={this.onFilteredItemsChange}
            onSearch={this.onPositionSearch}
            onToggleSearch={this.handleToggleSearchBallot}
            voterGuidePositionSearchMode
            selectedFiltersDefault={selectedFiltersDefault}
            sortFilters={['sortByAlphabetical']}
            stateCodesToDisplay={filteredPositionListLength > 20 ? stateCodesToDisplay : []}
          >
            {/* props get added to this component in FilterBase */}
            <VoterGuidePositionFilter />
          </FilterBase>
          {(isSearching && searchText) && (
            <SearchTitle>
              Searching for &quot;
              {searchText}
              &quot;
            </SearchTitle>
          )}
        </FilterWrapper>
        <ul className="card-child__list-group">
          {isSearching ? (
            <>
              {(positionSearchResults && !positionSearchResults.length) && (
                <NoResultsText>
                  {searchText ? (
                    <>
                      We couldn&apos;t find any endorsements containing the search term &quot;
                      {searchText}
                      &quot;.
                    </>
                  ) : (
                    <>
                      Please enter a search term.
                    </>
                  )}
                </NoResultsText>
              )}
            </>
          ) : (
            <>
              {(filteredPositionList && !filteredPositionListLength) && (
                <NoResultsText>
                  Please change the filters to see past or other endorsements.
                </NoResultsText>
              )}
            </>
          )}
          {(isSearching ? positionSearchResults : filteredPositionList).map((onePosition) => {
            // console.log('numberOfPositionItemsDisplayed:', numberOfPositionItemsDisplayed);
            if (isSearching) {
              if (numberOfPositionItemsDisplayed >= numberOfPositionItemsToDisplay) {
                return null;
              }
              numberOfPositionItemsDisplayed += 1;
            } else {
              if (numberOfPositionItemsDisplayed >= numberOfPositionItemsToDisplay) {
                return null;
              }
              numberOfPositionItemsDisplayed += 1;
            }
            // console.log('numberOfBallotItemsDisplayed: ', numberOfBallotItemsDisplayed);
            let foundInItemsAlreadyShown = 0;
            let searchWordAlreadyShown = 0;
            if (searchText) {
              const wordsArray = searchText.split(' ');
              searchTextString = wordsArray.map((oneItem) => {
                const foundInStringItem = `${searchWordAlreadyShown ? ' or ' : ''}"${oneItem}"`;
                searchWordAlreadyShown += 1;
                return foundInStringItem;
              });
            }
            const searchResultsNode = (isSearching && searchTextString && onePosition.foundInArray && onePosition.foundInArray.length) ? (
              <SearchResultsFoundInExplanation>
                {searchTextString}
                {' '}
                found in
                {' '}
                {onePosition.foundInArray.map((oneItem) => {
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
            ) : null;
            return (
              <div key={`${onePosition.position_we_vote_id}-${onePosition.voter_guide_we_vote_id}-${onePosition.speaker_display_name}`}>
                <VoterGuidePositionItem
                  ballotItemWeVoteId={onePosition.ballot_item_we_vote_id}
                  // ballotItemDisplayName={onePosition.ballot_item_display_name}
                  organizationWeVoteId={organizationWeVoteId}
                  positionWeVoteId={onePosition.position_we_vote_id}
                  searchResultsNode={searchResultsNode}
                />
              </div>
            );
          })}
        </ul>
        <ShowMoreItemsWrapper id="showMoreItemsId" onClick={this.increaseNumberOfPositionItemsToDisplay}>
          <ShowMoreItems
            loadingMoreItemsNow={loadingMoreItems}
            numberOfItemsDisplayed={numberOfPositionItemsDisplayed}
            numberOfItemsTotal={isSearching ? totalNumberOfPositionSearchResults : filteredPositionListLength}
          />
        </ShowMoreItemsWrapper>
        <LoadingItemsWheel>
          {(loadingMoreItems) && (
            <CircularProgress />
          )}
        </LoadingItemsWheel>
      </div>
    );
  }
}
VoterGuidePositionList.propTypes = {
  incomingPositionList: PropTypes.array.isRequired,
  organizationWeVoteId: PropTypes.string.isRequired,
  positionListExistsTitle: PropTypes.object,
  startingNumberOfPositionsToDisplay: PropTypes.string,
  turnOffOnScroll: PropTypes.bool,
};

const styles = () => ({
  iconButton: {
    padding: 8,
  },
});

const FilterWrapper = styled('div')`
  margin: 0 15px;
`;

const LoadingItemsWheel = styled('div')`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NoResultsText = styled('div')`
  margin: 15px;
`;

const SearchResultsFoundInExplanation = styled('div')`
  background-color: #C2DCE8;
  border-radius: 4px;
  color: #0E759F;
  margin-left: 0 !important;
  margin-right: 0 !important;
  padding: 8px !important;
`;

const SearchTitle = styled('div')`
  font-size: 24px;
  margin-top: 12px;
  margin-bottom: 12px;
`;

const ShowMoreItemsWrapper = styled('div')(({ theme }) => (`
  margin-bottom: 16px;
  padding-left: 16px;
  padding-right: 26px;
  ${theme.breakpoints.down('sm')} {
    padding-right: 16px;
  }
  @media print{
    display: none;
  }
`));

export default withStyles(styles)(VoterGuidePositionList);
