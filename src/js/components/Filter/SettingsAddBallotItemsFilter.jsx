import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import _ from 'lodash';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';


class SettingsAddBallotItemsFilter extends Component {
  static propTypes = {
    allItems: PropTypes.array,
    classes: PropTypes.object,
    lastFilterAdded: PropTypes.string,
    onFilteredItemsChange: PropTypes.func,
    onSelectSortByFilter: PropTypes.func,
    onToggleFilter: PropTypes.func,
    selectedFilters: PropTypes.array,
    showAllFilters: PropTypes.bool,
    updateSelectedFilters: PropTypes.func,
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
    if (this.props.lastFilterAdded !== nextProps.lastFilterAdded) {
      // console.log('this.props.lastFilterAdded:', this.props.lastFilterAdded, ', nextProps.lastFilterAdded:', nextProps.lastFilterAdded);
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
    // console.log('prevProps.selectedFilters:', prevProps.selectedFilters, ', this.props.selectedFilters:', this.props.selectedFilters);
    // console.log('prevProps.selectedFilters-stringify:', JSON.stringify(prevProps.selectedFilters), ', this.props.selectedFilters-stringify:', JSON.stringify(this.props.selectedFilters));
    if (JSON.stringify(prevProps.selectedFilters) !== JSON.stringify(this.props.selectedFilters)) {
      // console.log('+++SettingsAddBallotItemsFilter componentDidUpdate, change to selectedFilters');
      const newFilteredItems = this.getNewFilteredItems();
      this.props.onFilteredItemsChange(newFilteredItems, this.props.selectedFilters);
    } else {
      // console.log('---SettingsAddBallotItemsFilter componentDidUpdate, no change to selectedFilters');
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
    const { allItems, lastFilterAdded } = this.props;
    let { selectedFilters } = this.props;
    if (!selectedFilters || !selectedFilters.length) {
      // We always want to make sure there is at least on race filter on
      selectedFilters = ['showFederalRaceFilter'];
      this.toggleFilter('showFederalRaceFilter');
      // console.log('Exiting getNewFilteredItems (1)');
      return [];
    }
    let filteredItems = allItems; // Start with all items

    // Which showFederalRaceFilter/showOpposeFilter/showCommentFilter to show?
    // Make sure one of them is chosen. If not, do not limit by race level
    let containsAtLeastOneRaceFilter = false;
    let raceFilterCount = 0;
    const filtersToRemove = []; // We only want to support one race filter at a time
    // console.log('SettingsAddBallotItemsFilter lastFilterAdded:', lastFilterAdded);
    selectedFilters.forEach((filter) => {
      // console.log('SettingsAddBallotItemsFilter filter:', filter);
      switch (filter) {
        case 'showFederalRaceFilter':
          containsAtLeastOneRaceFilter = true;
          if (lastFilterAdded && !_.isEqual(lastFilterAdded, 'showFederalRaceFilter')) {
            // Only add to filtersToRemove if it wasn't the last race filter selected
            raceFilterCount += 1;
            filtersToRemove.push('showFederalRaceFilter');
          }
          break;
        case 'showStateRaceFilter':
          containsAtLeastOneRaceFilter = true;
          raceFilterCount += 1;
          if (lastFilterAdded && !_.isEqual(lastFilterAdded, 'showStateRaceFilter')) {
            raceFilterCount += 1;
            filtersToRemove.push('showStateRaceFilter');
          }
          break;
        case 'showMeasureRaceFilter':
          containsAtLeastOneRaceFilter = true;
          raceFilterCount += 1;
          if (lastFilterAdded && !_.isEqual(lastFilterAdded, 'showMeasureRaceFilter')) {
            raceFilterCount += 1;
            filtersToRemove.push('showMeasureRaceFilter');
          }
          break;
        case 'showLocalRaceFilter':
          containsAtLeastOneRaceFilter = true;
          raceFilterCount += 1;
          if (lastFilterAdded && !_.isEqual(lastFilterAdded, 'showLocalRaceFilter')) {
            raceFilterCount += 1;
            filtersToRemove.push('showLocalRaceFilter');
          }
          break;
        default:
          break;
      }
    });
    // console.log('SettingsAddBallotItemsFilter, filtersToRemove:', filtersToRemove);
    if (!containsAtLeastOneRaceFilter) {
      // We always want to make sure there is at least on race filter on
      selectedFilters.push('showFederalRaceFilter');
      this.toggleFilter('showFederalRaceFilter');
      // console.log('Exiting getNewFilteredItems (2) - this.toggleFilter(\'showFederalRaceFilter\');');
      return [];
    }
    if (raceFilterCount > 1) {
      // We only want to support one raceFilter at a time, because otherwise there are too many items to render
      // console.log('SettingsAddBallotItemsFilter, raceFilterCount > 1 filtersToRemove:', filtersToRemove);
      this.removeTheseFilters(filtersToRemove);
      return [];
    }
    if (containsAtLeastOneRaceFilter) {
      // console.log('After containsAtLeastOneRaceFilter, filteredItems:', filteredItems);
      let filterItemsSnapshot = filteredItems;
      filteredItems = [];
      // Remove all candidates
      filteredItems = [...filteredItems, ...filterItemsSnapshot.filter(item => item.kind_of_ballot_item !== 'CANDIDATE')];
      filterItemsSnapshot = filteredItems;
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
    // return _.uniqBy(filteredItems, x => x.we_vote_id);

    // We no longer filter for a unique we_vote_id because we sometimes pass items into this routine that don't have a we_vote_id
    // console.log('filteredItems:', filteredItems);
    return filteredItems;
  }

  removeTheseFilters = (filterListToRemove) => {
    // Remove the items in filterList that are currently in selectedFilters
    // console.log('SettingsAddBallotItemsFilter, removeTheseFilters filterListToRemove:', filterListToRemove);
    const newFilteredItems = this.props.selectedFilters.filter(oneItem => !filterListToRemove.includes(oneItem));
    this.props.updateSelectedFilters(newFilteredItems);
  }

  toggleFilter = (filterName) => {
    this.props.onToggleFilter(filterName);
  }

  selectSortByFilter = (name) => {
    this.props.onSelectSortByFilter(name);
  }

  render () {
    const { classes, showAllFilters, selectedFilters } = this.props;
    // console.log('SettingsAddBallotItemsFilter render selectedFilters:', selectedFilters);

    return (
      <Wrapper showAllFilters={showAllFilters}>
        <FilterRow>
          <FilterColumn>
            <b>Ballot Item Type</b>
            <FormControlLabel
              classes={{ label: classes.formControlLabel }}
              control={(
                <Radio
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
                <Radio
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
                <Radio
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
                <Radio
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

export default withStyles(styles)(SettingsAddBallotItemsFilter);
