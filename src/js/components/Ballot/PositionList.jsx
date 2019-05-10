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
    this.setState({
      positionList: this.props.incomingPositionList,
      filteredPositionList: this.props.incomingPositionList,
    });
  }

  componentWillReceiveProps (nextProps) {
    const { positionList, filteredPositionList } = this.state;
    this.setState({
      positionList: nextProps.incomingPositionList,
      filteredPositionList: positionList.length ? filteredPositionList : nextProps.incomingPositionList,
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
            allItems={this.props.incomingPositionList}
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
            allItems={this.props.incomingPositionList}
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
