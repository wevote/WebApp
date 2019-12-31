import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import CommentIcon from '@material-ui/icons/Comment';
import InfoIcon from '@material-ui/icons/Info';
import DelayedLoad from '../Widgets/DelayedLoad';
import { renderLog } from '../../utils/logging';
import FilterBase from '../Filter/FilterBase';
import FriendStore from '../../stores/FriendStore';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import PositionItem from './PositionItem';
import VoterGuideOrganizationFilter from '../Filter/VoterGuideOrganizationFilter';


const groupedFilters = [
  {
    filterName: 'showSupportFilter',
    icon: <ThumbUpIcon />,
    filterId: 'thumbUpFilter',
  },
  {
    filterName: 'showOpposeFilter',
    icon: <ThumbDownIcon />,
    filterId: 'thumbDownFilter',
  },
  {
    filterName: 'showInformationOnlyFilter',
    icon: <InfoIcon />,
    filterId: 'infoFilter',
  },
];

const islandFilters = [
  {
    filterName: 'showCommentFilter',
    icon: <CommentIcon />,
    filterDisplayName: 'Has Comment',
    filterId: 'islandFilterCommented',
  },
];

export default class PositionList extends Component {
  static propTypes = {
    ballotItemDisplayName: PropTypes.string.isRequired,
    incomingPositionList: PropTypes.array.isRequired,
    params: PropTypes.object,
    positionListExistsTitle: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      positionList: [],
      filteredPositionList: [],
    };
  }

  componentDidMount () {
    // console.log('PositionList componentDidMount');
    const { incomingPositionList } = this.props;
    this.setState({
      positionList: incomingPositionList,
      filteredPositionList: incomingPositionList,
    });
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));

    // Replicate in componentWillReceiveProps
    let oneOrganization = {};
    const organizationWeVoteIdsNeeded = [];
    // console.log('PositionList componentDidMount, incomingPositionList: ', incomingPositionList);
    incomingPositionList.forEach((position) => {
      oneOrganization = OrganizationStore.getOrganizationByWeVoteId(position.speaker_we_vote_id);
      if (!oneOrganization || !oneOrganization.organization_we_vote_id) {
        organizationWeVoteIdsNeeded.push(position.speaker_we_vote_id);
      }
      // Replace with bulk retrieve, since one call per organization is too expensive
      // OrganizationActions.organizationRetrieve(position.speaker_we_vote_id)
    });
    if (organizationWeVoteIdsNeeded.length) {
      // Add bulk Organization retrieve here
    }
    OrganizationActions.organizationsFollowedRetrieve();
  }

  componentWillReceiveProps (nextProps) {
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
  }

  onFriendStoreChange () {
    // console.log('PositionList onOrganizationStoreChange');
    const { filteredPositionList, positionList } = this.state;
    const organizationsVoterIsFriendsWith = FriendStore.currentFriendsOrganizationWeVoteIDList();
    // eslint-disable-next-line arrow-body-style
    const positionListWithFriendData = positionList.map((position) => {
      // console.log('PositionList onOrganizationStoreChange, position: ', position);
      return ({
        ...position,
        currentFriend: organizationsVoterIsFriendsWith.filter(organizationWeVoteId => organizationWeVoteId === position.speaker_we_vote_id).length > 0,
      });
    });
    // eslint-disable-next-line arrow-body-style
    const filteredPositionListWithFriendData = filteredPositionList.map((position) => {
      // console.log('PositionList onOrganizationStoreChange, position: ', position);
      return ({
        ...position,
        currentFriend: organizationsVoterIsFriendsWith.filter(organizationWeVoteId => organizationWeVoteId === position.speaker_we_vote_id).length > 0,
      });
    });
    this.setState({
      positionList: positionListWithFriendData,
      filteredPositionList: filteredPositionListWithFriendData,
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
        followed: organizationsVoterIsFollowing.filter(org => org.organization_we_vote_id === position.speaker_we_vote_id).length > 0,
      });
    });
    // eslint-disable-next-line arrow-body-style
    const filteredPositionListWithFollowedData = filteredPositionList.map((position) => {
      // console.log('PositionList onOrganizationStoreChange, position: ', position);
      return ({
        ...position,
        followed: organizationsVoterIsFollowing.filter(org => org.organization_we_vote_id === position.speaker_we_vote_id).length > 0,
      });
    });
    this.setState({
      positionList: positionListWithFollowedData,
      filteredPositionList: filteredPositionListWithFollowedData,
    });
  }

  onFilteredItemsChange = (filteredOrganizations) => {
    // console.log('PositionList onFilteredItemsChange, filteredOrganizations:', filteredOrganizations);
    this.setState({ filteredPositionList: filteredOrganizations });
  }

  render () {
    renderLog('PositionList');  // Set LOG_RENDER_EVENTS to log all renders
    if (!this.state.positionList) {
      // console.log('PositionList Loading...');
      return <div>Loading...</div>;
    }
    // console.log('PositionList render');
    // console.log('this.state.filteredPositionList render: ', this.state.filteredPositionList);
    let showTitle = false;
    let count;
    for (count = 0; count < this.state.positionList.length; count++) {
      showTitle = true;
    }
    const selectedFiltersDefault = ['endorsingGroup', 'newsOrganization', 'publicFigure', 'sortByMagic', 'yourFriends'];
    let positionNumber = 0;
    return (
      <div>
        { showTitle ?
          <span>{this.props.positionListExistsTitle}</span> :
          null
        }
        <FilterBase
          groupedFilters={groupedFilters}
          islandFilters={islandFilters}
          allItems={this.state.positionList}
          onFilteredItemsChange={this.onFilteredItemsChange}
          selectedFiltersDefault={selectedFiltersDefault}
        >
          {/* props get added to this component in FilterBase */}
          <VoterGuideOrganizationFilter />
        </FilterBase>
        <ul className="card-child__list-group">
          { this.state.filteredPositionList.map((onePosition) => {
            positionNumber += 1;
            if (positionNumber < 5) {
              return (
                <PositionItem
                  ballotItemDisplayName={this.props.ballotItemDisplayName}
                  key={`${onePosition.position_we_vote_id}-${onePosition.voter_guide_we_vote_id}-${onePosition.speaker_display_name}`}
                  position={onePosition}
                  params={this.props.params}
                />
              );
            } else {
              return (
                <DelayedLoad
                  key={`${onePosition.position_we_vote_id}-${onePosition.voter_guide_we_vote_id}-${onePosition.speaker_display_name}`}
                  waitBeforeShow={1000}
                >
                  <PositionItem
                    ballotItemDisplayName={this.props.ballotItemDisplayName}
                    position={onePosition}
                    params={this.props.params}
                  />
                </DelayedLoad>
              );
            }
          })
          }
        </ul>
      </div>
    );
  }
}
