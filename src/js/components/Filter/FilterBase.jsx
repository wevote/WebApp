import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Badge from '@material-ui/core/Badge';
import FilterListIcon from '@material-ui/icons/FilterList';
import { withStyles } from '@material-ui/core/styles';
import getGroupedFilterSecondClass from './utils/grouped-filter-second-class';
import BallotSearch from '../Ballot/BallotSearch';
import { renderLog } from '../../utils/logging';

const sortFilters = ['sortByMagic', 'sortByNetwork', 'sortByReach'];

class FilterBase extends React.Component {
  static propTypes = {
    allItems: PropTypes.array,
    children: PropTypes.node, // This is the component that updates the items displayed
    classes: PropTypes.object,
    groupedFilters: PropTypes.array,
    islandFilters: PropTypes.array,
    onSearch: PropTypes.func,
    onFilteredItemsChange: PropTypes.func,
    onToggleSearch: PropTypes.func,
    selectedFiltersDefault: PropTypes.array,
  };

  constructor (props) {
    super(props);
    this.state = {
      changeTrigger: '',
      // componentDidMount: false,
      isSearching: false,
      lastFilterAdded: '',
      showAllFilters: false,
      selectedFilters: [],
      // fullWidth: PropTypes.bool,
    };
  }

  componentDidMount () {
    // console.log('FilterBase componentDidMount, selectedFiltersDefault:', this.props.selectedFiltersDefault);
    this.setState({
      // componentDidMount: true,
      selectedFilters: this.props.selectedFiltersDefault || [],
    });
  }

  toggleShowAllFilters = () => {
    const { showAllFilters } = this.state;
    this.setState({ showAllFilters: !showAllFilters });
  };

  updateSelectedFilters = (freshSelectedFilters) => {
    // console.log('FilterBase updateSelectedFilters freshSelectedFilters:', freshSelectedFilters);
    this.setState({
      selectedFilters: freshSelectedFilters,
    });
  };

  toggleFilter = (filterName) => {
    const { selectedFilters } = this.state;
    if (selectedFilters.indexOf(filterName) > -1) {
      // Remove this filter
      this.setState({ selectedFilters: selectedFilters.filter(filter => filter !== filterName) });
    } else {
      // Add this filter
      this.setState({
        lastFilterAdded: filterName,
        selectedFilters: [...selectedFilters, filterName],
      });
    }
    // And finally, cancel any search that might be underway
    this.setState({ isSearching: false });
    if (this.props.onToggleSearch) {
      this.props.onToggleSearch(false);
    }
    if (this.props.onSearch) {
      this.props.onSearch('', []);
    }
  };

  selectSortByFilter = (filterName) => {
    const { selectedFilters } = this.state;
    let updatedFilters = selectedFilters;
    // Figure out which other filters to remove when we switch to a new sortBy filter
    const remainingSortFiltersToRemove = sortFilters.filter(item => item !== filterName);

    if (updatedFilters.indexOf(filterName) > -1) {
      // Sort-by already selected. Do nothing.
    } else {
      updatedFilters = [...updatedFilters, filterName];
    }
    this.setState({ selectedFilters: updatedFilters.filter(item => !remainingSortFiltersToRemove.includes(item)) });
  };

  onFilteredItemsChange = (filteredItems, currentSelectedBallotFilters) => {
    // console.log('FilterBase currentSelectedBallotFilters:', currentSelectedBallotFilters);
    this.setState({
    }, () => this.props.onFilteredItemsChange(filteredItems, currentSelectedBallotFilters));
  };

  forceChangeTrigger = (changeTrigger) => {
    // There are cases where we receive data in the Filter.jsx file (like SettingsAddBallotItemsFilter.jsx)
    // and we want to tell FilterBase to re-render, and then subsequently tell the Filter.jsx file to rerender too.
    // console.log('forceChangeTrigger:', changeTrigger);
    this.setState({ changeTrigger });
  };

  getGroupedFilterCountsFromFilteredItems = () => {
    const { allItems, groupedFilters } = this.props;
    let allItemsWithoutCandidates = [];
    allItemsWithoutCandidates = [...allItemsWithoutCandidates, ...allItems.filter(item => item.kind_of_ballot_item !== 'CANDIDATE')];
    const resultsDict = {};
    let oneRaceOfficeLevelItems = [];
    groupedFilters.forEach((oneFilter) => {
      oneRaceOfficeLevelItems = [];
      // console.log('getGroupedFilterCountsFromFilteredItems oneFilter.filterDisplayName:', oneFilter.filterDisplayName);
      oneRaceOfficeLevelItems = [...oneRaceOfficeLevelItems, ...allItemsWithoutCandidates.filter(item => item.race_office_level === oneFilter.filterDisplayName)];
      resultsDict[oneFilter.filterName] = oneRaceOfficeLevelItems.length;
    });
    // console.log('resultsDict:', resultsDict);
    return resultsDict;
  };

  generateGroupedFilters = () => {
    const groupedFilterCounts = this.getGroupedFilterCountsFromFilteredItems();
    return this.props.groupedFilters.map((item, itemIndex) => (
      <div
        key={item.filterName}
        className={`groupedFilter ${getGroupedFilterSecondClass(itemIndex, this.props.groupedFilters.length)} ${this.state.selectedFilters.indexOf(item.filterName) > -1 ? 'listFilterSelected' : ''}`}
        onClick={() => this.toggleFilter(item.filterName)}
        id={item.filterId}
      >
        {
          item.icon ? item.icon : null
        }
        {
          item.filterDisplayName ? (
            <span className="listFilter__text">
              &nbsp;
              {item.filterDisplayName}
              {(groupedFilterCounts[item.filterName] && groupedFilterCounts[item.filterName] > 0) ? (
                <span>
                  {' '}
                  (
                  {groupedFilterCounts[item.filterName]}
                  )
                </span>
              ) : null
              }
            </span>
          ) : null
        }
      </div>
    ));
  };

  generateIslandFilters = () => this.props.islandFilters.map(item => (
    <div
      key={item.filterName}
      className={`listFilter ${this.state.selectedFilters.indexOf(item.filterName) > -1 ? 'listFilterSelected' : ''}`}
      onClick={() => this.toggleFilter(item.filterName)}
      id={item.filterId}
    >
      {
          item.icon ? item.icon : null
      }
      {
        item.filterDisplayName ? (
          <span className="listFilter__text">
            &nbsp;
            {item.filterDisplayName}
          </span>
        ) : null
      }
    </div>
  ));

  handleToggleSearchBallot = (isSearching) => {
    // console.log('FilterBase handleToggleSearchBallot isSearching:', isSearching);
    this.setState({ isSearching: !isSearching });
    if (this.props.onToggleSearch) {
      this.props.onToggleSearch(isSearching);
    }
  };

  onSearch = (searchText, filteredItems) => {
    if (this.props.onSearch) {
      this.setState({
      }, () => this.props.onSearch(searchText, filteredItems));
    }
  };

  render () {
    renderLog('FilterBase');  // Set LOG_RENDER_EVENTS to log all renders
    const { isSearching, selectedFilters, showAllFilters } = this.state;
    const { allItems, classes } = this.props;
    const selectedFiltersWithoutSorts = selectedFilters.filter(item => !sortFilters.includes(item));
    const numberOfFiltersSelected = selectedFiltersWithoutSorts.length;
    return (
      <Wrapper>
        <FilterTop>
          <BallotSearch
            addVoterGuideMode
            isSearching={isSearching}
            items={allItems}
            onBallotSearch={this.onSearch}
            onToggleSearch={this.handleToggleSearchBallot}
          />
          {!isSearching && this.generateGroupedFilters()}
          {!isSearching && this.generateIslandFilters()}
          {!isSearching && (
            <Badge
              classes={{ badge: classes.badge }}
              badgeContent={numberOfFiltersSelected}
              invisible={numberOfFiltersSelected === 0}
              color="primary"
            >
              <div
                className={`listFilter ${showAllFilters ? 'listFilterSelected' : ''}`}
                id="filterBaseFilters"
                onClick={this.toggleShowAllFilters}
              >
                <FilterListIcon />
                &nbsp;
                <span className="listFilter__text">Filters</span>
              </div>
            </Badge>
          )}
        </FilterTop>
        {
          React.cloneElement(this.props.children, {
            allItems: this.props.allItems,
            changeTrigger: this.state.changeTrigger,
            forceChangeTrigger: this.forceChangeTrigger,
            lastFilterAdded: this.state.lastFilterAdded,
            onSelectSortByFilter: this.selectSortByFilter,
            onToggleFilter: this.toggleFilter,
            onFilteredItemsChange: this.onFilteredItemsChange,
            selectedFilters: this.state.selectedFilters,
            showAllFilters: this.state.showAllFilters,
            updateSelectedFilters: this.updateSelectedFilters,
          })
        }
      </Wrapper>
    );
  }
}

const styles = theme => ({
  badge: {
    right: '1rem',
    background: theme.palette.primary.main,
    [theme.breakpoints.down('sm')]: {
      right: '.8rem',
    },
  },
});

const Wrapper = styled.div`
  padding-top: 10px;
  display: flex;
  flex-flow: column;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
`;

const FilterTop = styled.div`
  display: flex;
  flex-flow: row wrap;
  padding: 0.5rem 0;
`;

export default withStyles(styles)(FilterBase);
