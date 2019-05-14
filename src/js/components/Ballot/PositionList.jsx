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
    filterName: 'support',
    icon: <ThumbUpIcon />,
  },
  {
    filterName: 'oppose',
    icon: <ThumbDownIcon />,
  },
  {
    filterName: 'information',
    icon: <InfoIcon />,
  },
];

const islandFilters = [
  {
    filterName: 'comment',
    icon: <CommentIcon />,
    filterDisplayName: 'Commented',
  },
];

export default class PositionList extends Component {
  static propTypes = {
    ballotItemDisplayName: PropTypes.string.isRequired,
    incomingPositionList: PropTypes.array.isRequired,
    positionListExistsTitle: PropTypes.object,
    hideSimpleSupportOrOppose: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      positionList: [],
      filteredPositionList: [],
    };
  }

  componentDidMount () {
    const { incomingPositionList } = this.props;
    this.setState({
      positionList: incomingPositionList,
      filteredPositionList: incomingPositionList,
    });
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    let oneOrganization = {};
    const organizationWeVoteIdsNeeded = [];
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

  componentWillUnmount () {
    this.organizationStoreListener.remove();
  }

  onOrganizationStoreChange () {
    const { positionList } = this.state;
    const followed = OrganizationStore.getOrganizationsVoterIsFollowing();
    let oneOrganization = {};
    const positionListWithOrganizationData = positionList.map((position) => {
      // console.log('PositionList onOrganizationStoreChange, position: ', position);
      oneOrganization = OrganizationStore.getOrganizationByWeVoteId(position.speaker_we_vote_id);
      // console.log('Organization: ', oneOrganization);
      // Rework to only add specific needed values to the position list
      // Consider sending fields we need to sort with via the positions API call instead of weaving together here
      return ({
        ...position,
        followed: followed.filter(org => org.organization_we_vote_id === position.speaker_we_vote_id).length > 0,
        ...oneOrganization,
      });
    });
    this.setState({
      positionList: positionListWithOrganizationData,
      filteredPositionList: positionListWithOrganizationData,
    });
  }

  handleFilteredOrgsChange = filteredOrgs => this.setState({ filteredPositionList: filteredOrgs });

  render () {
    // console.log('PositionList render');
    renderLog(__filename);
    if (!this.state.positionList) {
      return null;
    }
    // console.log('PositionList with positionList: ', this.state.positionList);
    let showTitle = false;
    let count;
    if (this.props.hideSimpleSupportOrOppose) {
      // Only show a position if it has a comment associated with it
      for (count = 0; count < this.state.positionList.length; count++) {
        if (this.state.positionList[count].statement_text || this.state.positionList[count].has_video) {
          showTitle = true;
        }
      }
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
          >
            <VoterGuideOrganizationFilter />
          </FilterBase>
          <ul className="card-child__list-group">
            { this.state.filteredPositionList.map(onePosition => (
              <span key={`${onePosition.position_we_vote_id}-${onePosition.voter_guide_we_vote_id}-${onePosition.speaker_display_name}`}>
                { onePosition.statement_text || onePosition.has_video ? (
                  <PositionItem
                    ballotItemDisplayName={this.props.ballotItemDisplayName}
                    position={onePosition}
                  />
                ) :
                  null }
              </span>
            ))
          }
          </ul>
        </div>
      );
    } else {
      for (count = 0; count < this.state.positionList.length; count++) {
        showTitle = true;
      }
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
          >
            <VoterGuideOrganizationFilter />
          </FilterBase>
          <ul className="card-child__list-group">
            { this.state.filteredPositionList.map(onePosition => (
              <PositionItem
                key={`${onePosition.position_we_vote_id}-${onePosition.voter_guide_we_vote_id}-${onePosition.speaker_display_name}`}
                ballotItemDisplayName={this.props.ballotItemDisplayName}
                position={onePosition}
              />
            ))
          }
          </ul>
        </div>
      );
    }
  }
}
