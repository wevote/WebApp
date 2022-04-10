import { Comment, Info, ThumbDown, ThumbUp } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import OrganizationActions from '../../actions/OrganizationActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import apiCalming from '../../common/utils/apiCalming';
import { renderLog } from '../../common/utils/logging';
import FriendStore from '../../stores/FriendStore';
import OrganizationStore from '../../stores/OrganizationStore';
import FilterBase from '../Filter/FilterBase';
import VoterGuideOrganizationFilter from '../Filter/VoterGuideOrganizationFilter';
import NumberOfItemsFound from '../Widgets/NumberOfItemsFound';

const PositionItem = React.lazy(() => import(/* webpackChunkName: 'PositionItem' */ './PositionItem'));
const ShowMoreItems = React.lazy(() => import(/* webpackChunkName: 'ShowMoreItems' */ '../Widgets/ShowMoreItems'));


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

const islandFilters = [
  {
    filterName: 'showCommentFilter',
    icon: <Comment />,
    filterDisplayName: 'Has Comment',
    filterId: 'islandFilterCommented',
  },
];

const STARTING_NUMBER_OF_POSITIONS_TO_DISPLAY = 6;
const TURN_ON_FILTERS_WHEN_MORE_THAN_THIS_NUMBER_OF_ITEMS = 10;

class PositionList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      filteredPositionList: [],
      filteredPositionListLength: 0,
      isSearching: false,
      loadingMoreItems: false,
      numberOfPositionItemsToDisplay: STARTING_NUMBER_OF_POSITIONS_TO_DISPLAY,
      positionList: [],
      positionSearchResults: [],
      searchText: '',
      totalNumberOfPositionSearchResults: 0,
    };
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount () {
    // console.log('PositionList componentDidMount');
    let { incomingPositionList } = this.props;
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));

    // Replicate onOrganizationStoreChange
    const organizationsVoterIsFollowing = OrganizationStore.getOrganizationsVoterIsFollowing();
    // eslint-disable-next-line arrow-body-style
    incomingPositionList = incomingPositionList.map((position) => {
      // console.log('PositionList onOrganizationStoreChange, position: ', position);
      return ({
        ...position,
        followed: organizationsVoterIsFollowing.filter((org) => org.organization_we_vote_id === position.speaker_we_vote_id).length > 0,
      });
    });
    // eslint-disable-next-line arrow-body-style
    // const filteredPositionListWithFollowedData = filteredPositionList.map((position) => {
    //   // console.log('PositionList onOrganizationStoreChange, position: ', position);
    //   return ({
    //     ...position,
    //     followed: organizationsVoterIsFollowing.filter(org => org.organization_we_vote_id === position.speaker_we_vote_id).length > 0,
    //   });
    // });

    // Replicate onFriendStoreChange
    const organizationsVoterIsFriendsWith = FriendStore.currentFriendsOrganizationWeVoteIDList();
    // console.log('PositionList onFriendStoreChange, organizationsVoterIsFriendsWith:', organizationsVoterIsFriendsWith);
    // eslint-disable-next-line arrow-body-style
    incomingPositionList = incomingPositionList.map((position) => {
      // console.log('PositionList componentDidMount, position: ', position);
      return ({
        ...position,
        currentFriend: organizationsVoterIsFriendsWith.filter((organizationWeVoteId) => organizationWeVoteId === position.speaker_we_vote_id).length > 0,
      });
    });

    // Replicate in componentWillReceiveProps
    // let oneOrganization = {};
    // const organizationWeVoteIdsNeeded = [];
    // // console.log('PositionList componentDidMount, incomingPositionList: ', incomingPositionList);
    // incomingPositionList.forEach((position) => {
    //   oneOrganization = OrganizationStore.getOrganizationByWeVoteId(position.speaker_we_vote_id);
    //   if (!oneOrganization || !oneOrganization.organization_we_vote_id) {
    //     organizationWeVoteIdsNeeded.push(position.speaker_we_vote_id);
    //   }
    //   // Replace with bulk retrieve, since one call per organization is too expensive
    //   // OrganizationActions.organizationRetrieve(position.speaker_we_vote_id)
    // });
    // if (organizationWeVoteIdsNeeded.length) {
    //   // Add bulk Organization retrieve here
    // }
    // console.log('PositionList componentDidMount, organizationWeVoteIdsNeeded: ', organizationWeVoteIdsNeeded);

    if (apiCalming('organizationsFollowedRetrieve', 60000)) {
      OrganizationActions.organizationsFollowedRetrieve();
    }
    if (!organizationsVoterIsFriendsWith.length > 0) {
      if (apiCalming('friendList', 1500)) {
        FriendActions.currentFriends();
      }
    }

    window.addEventListener('scroll', this.onScroll);
    this.setState({
      positionList: incomingPositionList,
      filteredPositionList: incomingPositionList,
      filteredPositionListLength: incomingPositionList.length,
    });
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    // console.log('PositionList componentWillReceiveProps');
    const { incomingPositionList } = nextProps;
    this.setState({
      positionList: incomingPositionList,
      // filteredPositionList: incomingPositionList, // Do not update
    });
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    this.organizationStoreListener.remove();
    window.removeEventListener('scroll', this.onScroll);
    if (this.positionItemTimer) clearTimeout(this.positionItemTimer);
  }

  onFriendStoreChange () {
    const { positionList } = this.state; // filteredPositionList,
    const organizationsVoterIsFriendsWith = FriendStore.currentFriendsOrganizationWeVoteIDList();
    // console.log('PositionList onFriendStoreChange, organizationsVoterIsFriendsWith:', organizationsVoterIsFriendsWith);
    // eslint-disable-next-line arrow-body-style
    const positionListWithFriendData = positionList.map((position) => {
      // console.log('PositionList onFriendStoreChange, position: ', position);
      return ({
        ...position,
        currentFriend: organizationsVoterIsFriendsWith.filter((organizationWeVoteId) => organizationWeVoteId === position.speaker_we_vote_id).length > 0,
      });
    });
    // eslint-disable-next-line arrow-body-style
    // const filteredPositionListWithFriendData = filteredPositionList.map((position) => {
    //   // console.log('PositionList onFriendStoreChange, position: ', position);
    //   return ({
    //     ...position,
    //     currentFriend: organizationsVoterIsFriendsWith.filter(organizationWeVoteId => organizationWeVoteId === position.speaker_we_vote_id).length > 0,
    //   });
    // });
    this.setState({
      positionList: positionListWithFriendData,
      // filteredPositionList: filteredPositionListWithFriendData,
      // filteredPositionListLength: filteredPositionListWithFriendData.length,
    });
  }

  onOrganizationStoreChange () {
    // console.log('PositionList onOrganizationStoreChange');
    const { filteredPositionList, positionList } = this.state;
    const organizationsVoterIsFollowing = OrganizationStore.getOrganizationsVoterIsFollowing();
    // eslint-disable-next-line arrow-body-style
    const positionListWithFollowedData = positionList.map((position) => {
      // console.log('PositionList onOrganizationStoreChange, position: ', position);
      return ({
        ...position,
        followed: organizationsVoterIsFollowing.filter((org) => org.organization_we_vote_id === position.speaker_we_vote_id).length > 0,
      });
    });
    // eslint-disable-next-line arrow-body-style
    const filteredPositionListWithFollowedData = filteredPositionList.map((position) => {
      // console.log('PositionList onOrganizationStoreChange, position: ', position);
      return ({
        ...position,
        followed: organizationsVoterIsFollowing.filter((org) => org.organization_we_vote_id === position.speaker_we_vote_id).length > 0,
      });
    });
    this.setState({
      positionList: positionListWithFollowedData,
      filteredPositionList: filteredPositionListWithFollowedData,
      filteredPositionListLength: filteredPositionListWithFollowedData.length,
    });
  }

  onFilteredItemsChange = (filteredOrganizations) => {
    // console.log('PositionList onFilteredItemsChange, filteredOrganizations:', filteredOrganizations);
    this.setState({
      filteredPositionList: filteredOrganizations,
      filteredPositionListLength: filteredOrganizations.length,
      isSearching: false,
    });
  }

  onScroll () {
    const showMoreItemsElement =  document.querySelector('#showMoreItemsId');
    // console.log('showMoreItemsElement: ', showMoreItemsElement);
    // console.log('Loading more: ', this.state.loadingMoreItems);
    if (showMoreItemsElement) {
      const {
        filteredPositionListLength, isSearching, numberOfPositionItemsToDisplay,
        totalNumberOfPositionSearchResults,
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
      } else {
        this.setState({ loadingMoreItems: false });
      }
    }
  }

  onPositionSearch = (searchText, filteredItems) => {
    window.scrollTo(0, 0);
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
    const { positionList } = this.state;
    renderLog('PositionList');  // Set LOG_RENDER_EVENTS to log all renders
    if (!positionList) {
      // console.log('PositionList Loading...');
      return LoadingWheel;
    }
    const {
      filteredPositionList, filteredPositionListLength, isSearching, loadingMoreItems,
      numberOfPositionItemsToDisplay, positionSearchResults, searchText,
      totalNumberOfPositionSearchResults,
    } = this.state;
    const { incomingPositionList, linksOpenExternalWebsite, positionListExistsTitle } = this.props;
    // console.log('PositionList render, positionListExistsTitle:', positionListExistsTitle);
    // console.log('this.state.filteredPositionList render: ', this.state.filteredPositionList);
    let showTitle = false;
    let count;
    for (count = 0; count < positionList.length; count++) {
      showTitle = true;
    }
    // console.log('showTitle:', showTitle);
    const selectedFiltersDefault = ['endorsingGroup', 'newsOrganization', 'publicFigure', 'sortByMagic', 'yourFriends'];
    let numberOfPositionItemsDisplayed = 0;
    let searchTextString = '';
    const incomingPositionListLength = (incomingPositionList) ? incomingPositionList.length : 0;
    return (
      <div>
        <FilterWrapper>
          { showTitle && (
            <span>{positionListExistsTitle}</span>
          )}
          <FilterBase
            allItems={positionList}
            groupedFilters={incomingPositionListLength > TURN_ON_FILTERS_WHEN_MORE_THAN_THIS_NUMBER_OF_ITEMS ? groupedFilters : []}
            islandFilters={incomingPositionListLength > TURN_ON_FILTERS_WHEN_MORE_THAN_THIS_NUMBER_OF_ITEMS ? islandFilters : []}
            numberOfItemsFoundNode={(
              <NumberOfItemsFound
                numberOfItemsTotal={isSearching ? totalNumberOfPositionSearchResults : filteredPositionListLength}
              />
            )}
            onFilteredItemsChange={this.onFilteredItemsChange}
            onSearch={this.onPositionSearch}
            onToggleSearch={this.handleToggleSearchBallot}
            positionSearchMode
            selectedFiltersDefault={selectedFiltersDefault}
          >
            {/* props get added to this component in FilterBase */}
            <VoterGuideOrganizationFilter />
          </FilterBase>
          {(isSearching && searchText) && (
            <SearchTitle>
              Searching for &quot;
              {searchText}
              &quot;
            </SearchTitle>
          )}
        </FilterWrapper>
        <UnorderedListWrapper className="card-child__list-group">
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
                <Suspense fallback={<></>}>
                  <PositionItem
                    // ballotItemDisplayName={this.props.ballotItemDisplayName}
                    position={onePosition}
                    linksOpenExternalWebsite={linksOpenExternalWebsite}
                    searchResultsNode={searchResultsNode}
                    params={this.props.params}
                  />
                </Suspense>
              </div>
            );
          })}
        </UnorderedListWrapper>
        <ShowMoreItemsWrapper id="showMoreItemsId" onClick={this.increaseNumberOfPositionItemsToDisplay}>
          <Suspense fallback={<></>}>
            <ShowMoreItems
              loadingMoreItemsNow={loadingMoreItems}
              numberOfItemsDisplayed={numberOfPositionItemsDisplayed}
              numberOfItemsTotal={isSearching ? totalNumberOfPositionSearchResults : filteredPositionListLength}
            />
          </Suspense>
        </ShowMoreItemsWrapper>
        {loadingMoreItems && (
          <LoadingItemsWheel>
            <CircularProgress />
          </LoadingItemsWheel>
        )}
      </div>
    );
  }
}
PositionList.propTypes = {
  incomingPositionList: PropTypes.array.isRequired,
  linksOpenExternalWebsite: PropTypes.bool,
  positionListExistsTitle: PropTypes.object,
  params: PropTypes.object,
};

const styles = () => ({
  iconButton: {
    padding: 8,
  },
});

const FilterWrapper = styled('div')`
  margin: 10px 15px;
`;

const LoadingItemsWheel = styled('div')`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70px;
`;

const SearchResultsFoundInExplanation = styled('div')(({ theme }) => (`
  background-color: #C2DCE8;
  color: #0E759F;
  padding: 12px !important;
  ${theme.breakpoints.up('sm')} {
    margin-left: 12px !important;
    margin-right: 12px !important;
  }
`));

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

const UnorderedListWrapper = styled('ul')`
  padding-inline-start: 0 !important;
`;

export default withStyles(styles)(PositionList);
