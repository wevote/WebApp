import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import CommentIcon from '@material-ui/icons/Comment';
import InfoIcon from '@material-ui/icons/Info';
import { renderLog } from '../../utils/logging';
import PositionItem from './PositionItem';
import FilterBase from '../Filter/FilterBase';
import VoterGuideOrganizationFilter from '../Filter/VoterGuideOrganizationFilter';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';


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
    this.organizationStoreListener.remove();
  }

  onOrganizationStoreChange () {
    // console.log('PositionList onOrganizationStoreChange');
    const { filteredPositionList, positionList } = this.state;
    const followed = OrganizationStore.getOrganizationsVoterIsFollowing();
    // eslint-disable-next-line arrow-body-style
    const positionListWithFollowedData = positionList.map((position) => {
      // console.log('PositionList onOrganizationStoreChange, position: ', position);
      return ({
        ...position,
        followed: followed.filter(org => org.organization_we_vote_id === position.speaker_we_vote_id).length > 0,
      });
    });
    // eslint-disable-next-line arrow-body-style
    const filteredPositionListWithFollowedData = filteredPositionList.map((position) => {
      // console.log('PositionList onOrganizationStoreChange, position: ', position);
      return ({
        ...position,
        followed: followed.filter(org => org.organization_we_vote_id === position.speaker_we_vote_id).length > 0,
      });
    });
    this.setState({
      positionList: positionListWithFollowedData,
      filteredPositionList: filteredPositionListWithFollowedData,
    });
  }

  handleFilteredOrgsChange = filteredOrgs => this.setState({ filteredPositionList: filteredOrgs });

  render () {
    renderLog('PositionList');  // Set LOG_RENDER_EVENTS to log all renders
    if (!this.state.positionList) {
      return null;
    }
    // console.log('PositionList with positionList: ', this.state.positionList);
    let showTitle = false;
    let count;
    for (count = 0; count < this.state.positionList.length; count++) {
      showTitle = true;
    }
    const selectedFiltersDefault = ['endorsingGroup', 'newsOrganization', 'publicFigure', 'sortByReach'];
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
          onFilteredItemsChange={this.handleFilteredOrgsChange}
          selectedFiltersDefault={selectedFiltersDefault}
        >
          {/* props get added to this component in FilterBase */}
          <VoterGuideOrganizationFilter />
        </FilterBase>
        <ul className="card-child__list-group">
          { this.state.filteredPositionList.map(onePosition => (
            <PositionItem
              key={`${onePosition.position_we_vote_id}-${onePosition.voter_guide_we_vote_id}-${onePosition.speaker_display_name}`}
              ballotItemDisplayName={this.props.ballotItemDisplayName}
              position={onePosition}
              params={this.props.params}
            />
          ))
          }
        </ul>
      </div>
    );
  }
}
