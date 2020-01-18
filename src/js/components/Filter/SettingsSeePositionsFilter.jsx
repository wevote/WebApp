import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import { renderLog } from '../../utils/logging';


class SettingsSeePositionsFilter extends Component {
  static propTypes = {
    allItems: PropTypes.array,
    classes: PropTypes.object,
    onFilteredItemsChange: PropTypes.func,
    onSelectSortByFilter: PropTypes.func,
    onToggleFilter: PropTypes.func,
    selectedFilters: PropTypes.array,
    showAllFilters: PropTypes.bool,
    // updateSelectedFilters: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {
      componentDidMount: false,
    };
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.state.componentDidMount !== nextState.componentDidMount) {
      // console.log('this.state.componentDidMount:', this.state.componentDidMount, ', nextState.componentDidMount:', nextState.componentDidMount);
      return true;
    }
    if (this.props.showAllFilters !== nextProps.showAllFilters) {
      // console.log('this.props.showAllFilters:', this.props.showAllFilters, ', nextProps.showAllFilters:', nextProps.showAllFilters);
      return true;
    }
    if (JSON.stringify(this.props.selectedFilters) !== JSON.stringify(nextProps.selectedFilters)) {
      // console.log('this.props.selectedFilters:', this.props.selectedFilters, ', nextProps.selectedFilters:', nextProps.selectedFilters);
      return true;
    }
    // console.log('shouldComponentUpdate no change');
    return false;
  }

  componentDidUpdate (prevProps) {
    // console.log('SettingsSeePositionsFilter componentDidUpdate');
    // console.log('prevProps.selectedFilters:', prevProps.selectedFilters, ', this.props.selectedFilters:', this.props.selectedFilters);
    // console.log('prevProps.selectedFilters-stringify:', JSON.stringify(prevProps.selectedFilters), ', this.props.selectedFilters-stringify:', JSON.stringify(this.props.selectedFilters));
    if (JSON.stringify(prevProps.selectedFilters) !== JSON.stringify(this.props.selectedFilters)) {
      // console.log('+++SettingsSeePositionsFilter componentDidUpdate, change to selectedFilters');
      const newFilteredItems = this.getNewFilteredItems();
      this.props.onFilteredItemsChange(newFilteredItems, this.props.selectedFilters);
    } else {
      // console.log('---SettingsSeePositionsFilter componentDidUpdate, no change to selectedFilters');
    }
  }

  getFilteredItemsByLinkedIssue = (issueFilter) => {
    const { allItems } = this.props;
    return allItems.filter(item => item.issue_we_vote_ids_linked === issueFilter.issue_we_vote_id);
  };

  orderByFollowedOrgsFirst = (firstGuide, secondGuide) => secondGuide.followed - firstGuide.followed;

  orderByTwitterFollowers = (firstGuide, secondGuide) => secondGuide.twitter_followers_count - firstGuide.twitter_followers_count;

  orderByWrittenComment = (firstGuide, secondGuide) => {
    const secondGuideHasStatement = secondGuide && secondGuide.statement_text && secondGuide.statement_text.length ? 1 : 0;
    const firstGuideHasStatement = firstGuide && firstGuide.statement_text && firstGuide.statement_text.length ? 1 : 0;
    return secondGuideHasStatement - firstGuideHasStatement;
  };

  getNewFilteredItems = () => {
    const { allItems } = this.props;
    const { selectedFilters } = this.props;
    let filteredItems = allItems; // Start with all items
    // First, bring in only the kinds of organizations with checkmark
    // selectedFilters.forEach((filter) => {
    //   switch (filter) {
    //     case 'newsOrganization':
    //       filteredItems = [...filteredItems, ...allItems.filter(item => item.speaker_type === 'NW')];
    //       break;
    //     case 'endorsingGroup':
    //       filteredItems = [...filteredItems, ...allItems.filter(item => groupTypeIdentifiers.includes(item.speaker_type))];
    //       break;
    //     case 'publicFigure':
    //       filteredItems = [...filteredItems, ...allItems.filter(item => item.speaker_type === 'PF')];
    //       break;
    //     case 'individualVoter':
    //       filteredItems = [...filteredItems, ...allItems.filter(item => privateCitizenIdentifiers.includes(item.speaker_type))];
    //       break;
    //     default:
    //       break;
    //   }
    // });

    // Which showFederalRaceFilter/showOpposeFilter/showCommentFilter to show?
    // Make sure one of them is chosen. If not, do not limit by race level
    let containsAtLeastOneRaceFilter = false;
    selectedFilters.forEach((filter) => {
      // console.log('SettingsSeePositionsFilter filter:', filter);
      switch (filter) {
        case 'showFederalRaceFilter':
          containsAtLeastOneRaceFilter = true;
          break;
        case 'showStateRaceFilter':
          containsAtLeastOneRaceFilter = true;
          break;
        case 'showMeasureRaceFilter':
          containsAtLeastOneRaceFilter = true;
          break;
        case 'showLocalRaceFilter':
          containsAtLeastOneRaceFilter = true;
          break;
        default:
          break;
      }
    });
    if (containsAtLeastOneRaceFilter) {
      // console.log('After containsAtLeastOneRaceFilter, filteredItems:', filteredItems);
      const filterItemsSnapshot = filteredItems;
      filteredItems = [];
      selectedFilters.forEach((filter) => {
        switch (filter) {
          case 'showFederalRaceFilter':
            filteredItems = [...filteredItems, ...filterItemsSnapshot.filter(item => item.race_office_level === 'Federal')];
            break;
          case 'showStateRaceFilter':
            filteredItems = [...filteredItems, ...filterItemsSnapshot.filter(item => item.race_office_level === 'State')];
            break;
          case 'showMeasureRaceFilter':
            filteredItems = [...filteredItems, ...filterItemsSnapshot.filter(item => item.kind_of_ballot_item === 'MEASURE')];
            break;
          case 'showLocalRaceFilter':
            filteredItems = [...filteredItems, ...filterItemsSnapshot.filter(item => item.race_office_level === 'Local')];
            break;
          default:
            break;
        }
      });
    }
    // Comment or no comment?
    let containsCommentFilter = false;
    selectedFilters.forEach((filter) => {
      switch (filter) {
        case 'showCommentFilter':
          containsCommentFilter = true;
          break;
        default:
          break;
      }
    });
    if (containsCommentFilter) {
      const filterItemsCommentSnapshot = filteredItems;
      filteredItems = [];
      selectedFilters.forEach((filter) => {
        switch (filter) {
          case 'showCommentFilter':
            filteredItems = [...filteredItems, ...filterItemsCommentSnapshot.filter(item => item.statement_text && item.statement_text.length)];
            break;
          default:
            break;
        }
      });
    }
    // Sort Order
    // selectedFilters.forEach((filter) => {
    //   switch (filter) {
    //     case 'sortByReach':
    //       // Put written comments on top, and then within those two separations, move Twitter followers to the top
    //       filteredItems = filteredItems.sort(this.orderByTwitterFollowers);
    //       filteredItems = filteredItems.sort(this.orderByWrittenComment);
    //       break;
    //     case 'sortByNetwork':
    //       filteredItems = filteredItems.sort(this.orderByTwitterFollowers);
    //       filteredItems = filteredItems.sort(this.orderByWrittenComment);
    //       filteredItems = filteredItems.sort(this.orderByFollowedOrgsFirst);
    //       break;
    //     default:
    //       if (typeof filter === 'object') {
    //         filteredItems = [...filteredItems, ...this.getFilteredItemsByLinkedIssue(filter)];
    //       }
    //       break;
    //   }
    // });

    // TURNED OFF: Make sure each item in the filteredItems is unique (by we_vote_id)
    // return uniqBy(filteredItems, x => x.we_vote_id);

    // We no longer filter for a unique we_vote_id because we sometimes pass items into this routine that don't have a we_vote_id
    return filteredItems;
  };

  toggleFilter = (filterName) => {
    this.props.onToggleFilter(filterName);
  };

  selectSortByFilter = (name) => {
    this.props.onSelectSortByFilter(name);
  };

  render () {
    renderLog('SettingsSeePositionsFilter');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, showAllFilters, selectedFilters } = this.props;
    // console.log(' render selectedFilters:', selectedFilters);

    return (
      <Wrapper showAllFilters={showAllFilters}>
        <FilterRow>
          <FilterColumn>
            <b>Ballot Item Type</b>
            <FormControlLabel
              classes={{ label: classes.formControlLabel }}
              control={(
                <Checkbox
                  checked={selectedFilters.indexOf('showFederalRaceFilter') > -1}
                  onChange={() => this.toggleFilter('showFederalRaceFilter')}
                  value="showFederalRaceFilter"
                  color="primary"
                />
              )}
              label="Federal"
            />
            <FormControlLabel
              classes={{ label: classes.formControlLabel }}
              control={(
                <Checkbox
                  checked={selectedFilters.indexOf('showStateRaceFilter') > -1}
                  onChange={() => this.toggleFilter('showStateRaceFilter')}
                  value="showStateRaceFilter"
                  color="primary"
                />
              )}
              label="State"
            />
            <FormControlLabel
              classes={{ label: classes.formControlLabel }}
              control={(
                <Checkbox
                  checked={selectedFilters.indexOf('showMeasureRaceFilter') > -1}
                  onChange={() => this.toggleFilter('showMeasureRaceFilter')}
                  value="showMeasureRaceFilter"
                  color="primary"
                />
              )}
              label="Measure"
            />
            <FormControlLabel
              classes={{ label: classes.formControlLabel }}
              control={(
                <Checkbox
                  checked={selectedFilters.indexOf('showLocalRaceFilter') > -1}
                  onChange={() => this.toggleFilter('showLocalRaceFilter')}
                  value="showLocalRaceFilter"
                  color="primary"
                />
              )}
              label="Local"
            />
          </FilterColumn>
        </FilterRow>
      </Wrapper>
    );
  }
}

const styles = theme => ({
  formControlLabel: {
    [theme.breakpoints.down('lg')]: {
      fontSize: 14,
    },
  },
});

const Wrapper = styled.div`
  display: ${({ showAllFilters }) => (showAllFilters ? 'flex' : 'none')};
  flex-flow: column;
  padding-top: 1rem;
`;

const FilterRow = styled.div`
  display: flex;
  flex-flow: row;
`;

const FilterColumn = styled.div`
  display: flex;
  flex-flow: column;
  margin-right: 2rem;
`;

export default withStyles(styles)(SettingsSeePositionsFilter);
