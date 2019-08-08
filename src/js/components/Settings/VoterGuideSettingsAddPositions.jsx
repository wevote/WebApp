import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import CommentIcon from '@material-ui/icons/Comment';
import InfoIcon from '@material-ui/icons/Info';
import BallotItemForAddPositions from './BallotItemForAddPositions';
import BallotStore from '../../stores/BallotStore';
import { renderLog } from '../../utils/logging';
import FilterBase from '../Filter/FilterBase';
import VoterGuideSettingsBallotFilter from '../Filter/VoterGuideSettingsBallotFilter';


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
    filterDisplayName: 'Commented',
    filterId: 'islandFilterCommented',
  },
];

class VoterGuideSettingsAddPositions extends Component {
  static propTypes = {
    classes: PropTypes.object,
    voterGuideWeVoteId: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      ballotItemList: [],
      filteredBallotItemList: [],
    };
  }

  componentDidMount () {
    const incomingBallotItemList = BallotStore.ballot;
    // console.log('VoterGuideSettingsAddPositions, incomingBallotItemList:', incomingBallotItemList);
    this.setState({
      ballotItemList: incomingBallotItemList,
      filteredBallotItemList: incomingBallotItemList,
    });
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
  }

  onBallotStoreChange () {
    // const {filteredBallotItemList, ballotItemList} = this.state;
    const incomingBallotItemList = BallotStore.ballot;
    console.log('VoterGuideSettingsAddPositions, onBallotStoreChange incomingBallotItemList:', incomingBallotItemList);
    this.setState({
      ballotItemList: incomingBallotItemList,
      filteredBallotItemList: incomingBallotItemList,
    });
  }

  handleFilteredBallotItemsChange = filteredBallotItems => this.setState({ filteredBallotItemList: filteredBallotItems });

  render () {
    // console.log('PositionList render');
    renderLog(__filename);
    if (!this.state.ballotItemList) {
      return null;
    }
    // const { classes } = this.props;
    // console.log('PositionList with ballotItemList: ', this.state.ballotItemList);
    const selectedFiltersDefault = [];
    return (
      <div>
        <FilterBase
          groupedFilters={groupedFilters}
          islandFilters={islandFilters}
          allItems={this.state.ballotItemList}
          onFilteredItemsChange={this.handleFilteredBallotItemsChange}
          selectedFiltersDefault={selectedFiltersDefault}
        >
          {/* props get added to this component in FilterBase */}
          <VoterGuideSettingsBallotFilter />
        </FilterBase>
        <ul className="card-child__list-group">
          { this.state.filteredBallotItemList.map(oneBallotItem => (
            <BallotItemForAddPositions
              key={oneBallotItem.we_vote_id}
              allBallotItemsCount={2}
              // ref={(ref) => { this.ballotItems[oneBallotItem.we_vote_id] = ref; }}
              ballot_item_display_name={oneBallotItem.ballot_item_display_name}
              candidate_list={oneBallotItem.candidate_list}
              kind_of_ballot_item={oneBallotItem.kind_of_ballot_item}
              we_vote_id={oneBallotItem.we_vote_id}
            />
          ))
        }
        </ul>
      </div>
    );
  }
}

const styles = theme => ({
  ballotIconRoot: {
    width: 150,
    height: 150,
    color: 'rgb(171, 177, 191)',
  },
  ballotButtonIconRoot: {
    marginRight: 8,
  },
  ballotButtonRoot: {
    width: 250,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

export default withStyles(styles)(VoterGuideSettingsAddPositions);
