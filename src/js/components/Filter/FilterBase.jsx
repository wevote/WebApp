import { FilterList } from '@mui/icons-material';
import { Badge } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import { getAllStateCodeFilters } from '../../common/utils/addressFunctions';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import StateDropDown from './StateDropDown';
import getGroupedFilterSecondClass from './utils/grouped-filter-second-class';

const FilterBaseSearch = React.lazy(() => import(/* webpackChunkName: 'FilterBaseSearch' */ './FilterBaseSearch'));


const defaultSortFilters = ['sortByMagic', 'sortByNetwork', 'sortByReach'];

class FilterBase extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      changeTrigger: '',
      isSearching: false,
      lastFilterAdded: '',
      showAllFilters: false,
      selectedFilters: [],
    };
  }

  componentDidMount () {
    // console.log('FilterBase componentDidMount');
    this.setState({
      // componentDidMount: true,
      selectedFilters: this.props.selectedFiltersDefault || [],
      sortFilters: this.props.sortFilters || defaultSortFilters,
    });
    const { searchTextDefault } = this.props;
    if (searchTextDefault) {
      this.setState({ isSearching: true });
    }
  }

  changeToDifferentStateCodeFilter = (stateCodeFilter) => {
    const { selectedFilters } = this.state;
    let updatedFilters = selectedFilters;
    // console.log('FilterBase changeToDifferentStateCodeFilter, stateCodeFilter: ', stateCodeFilter);
    // Figure out which other filters to remove when we switch to a new stateCode filter
    const allStateCodeFilters = getAllStateCodeFilters();
    // Get all other stateCode filters, minus the one we want to switch to
    const stateCodeFiltersToRemove = allStateCodeFilters.filter((stateCode) => stateCodeFilter !== stateCode);
    // console.log('selectedFilters: ', selectedFilters);
    // console.log('stateCodeFiltersToRemove: ', stateCodeFiltersToRemove);

    if (updatedFilters.indexOf(stateCodeFilter) > -1) {
      // stateCode already selected. Do nothing.
    } else {
      // console.log('Adding stateCodeFilter:', stateCodeFilter);
      updatedFilters = [...updatedFilters, stateCodeFilter];
    }
    // Only include state filters that aren't in stateCodeFiltersToRemove
    const updatedSelectedFilters = updatedFilters.filter((item) => !stateCodeFiltersToRemove.includes(item));
    // console.log('updatedSelectedFilters:', updatedSelectedFilters);
    this.setState({ selectedFilters: updatedSelectedFilters });
  };

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
      this.setState({ selectedFilters: selectedFilters.filter((filter) => filter !== filterName) });
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
      this.props.onToggleSearch(true);
    }
    if (this.props.onSearch) {
      this.props.onSearch('', []);
    }
  };

  onToggleMultipleFilters = (filterNameList) => {
    let { selectedFilters } = this.state;
    let lastFilterAdded;
    filterNameList.forEach((filterName) => {
      if (selectedFilters.indexOf(filterName) > -1) {
        // Remove this filter
        selectedFilters = selectedFilters.filter((filter) => filter !== filterName);
        // this.setState({ selectedFilters: selectedFilters.filter(filter => filter !== filterName) });
      } else {
        // Add this filter
        selectedFilters = [...selectedFilters, filterName];
        lastFilterAdded = filterName;
      }
    });
    if (lastFilterAdded) {
      this.setState({
        lastFilterAdded,
      });
    }
    this.setState({
      selectedFilters,
    });
    // And finally, cancel any search that might be underway
    this.setState({ isSearching: false });
    if (this.props.onToggleSearch) {
      this.props.onToggleSearch(true);
    }
    if (this.props.onSearch) {
      this.props.onSearch('', []);
    }
  };

  selectSortByFilter = (filterName) => {
    const { selectedFilters, sortFilters } = this.state;
    let updatedFilters = selectedFilters;
    // Figure out which other filters to remove when we switch to a new sortBy filter
    const remainingSortFiltersToRemove = sortFilters.filter((item) => item !== filterName);

    if (updatedFilters.indexOf(filterName) > -1) {
      // Sort-by already selected. Do nothing.
    } else {
      updatedFilters = [...updatedFilters, filterName];
    }
    this.setState({ selectedFilters: updatedFilters.filter((item) => !remainingSortFiltersToRemove.includes(item)) });
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
    allItemsWithoutCandidates = [...allItemsWithoutCandidates, ...allItems.filter((item) => (item && item.kind_of_ballot_item !== 'CANDIDATE'))];
    const resultsDict = {};
    let oneRaceOfficeLevelItems = [];
    groupedFilters.forEach((oneFilter) => {
      oneRaceOfficeLevelItems = [];
      // console.log('getGroupedFilterCountsFromFilteredItems oneFilter.filterDisplayName:', oneFilter.filterDisplayName);
      oneRaceOfficeLevelItems = [...oneRaceOfficeLevelItems, ...allItemsWithoutCandidates.filter((item) => (item && item.race_office_level === oneFilter.filterDisplayName))];
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
              ) : null}
            </span>
          ) : null
        }
      </div>
    ));
  };

  generateIslandFilters = () => this.props.islandFilters.map((item) => (
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
    // console.log('FilterBase handleToggleSearchBallot prior isSearching:', isSearching);
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

  onStateDropDownChange = (stateCode) => {
    this.changeToDifferentStateCodeFilter(`stateCode${stateCode}`);
  }

  render () {
    renderLog('FilterBase');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('FilterBase render');
    const { isSearching, selectedFilters, showAllFilters, sortFilters } = this.state;
    const {
      allItems, classes, filteredPositionListLength, opinionsAndBallotItemsSearchMode, positionSearchMode,
      numberOfItemsFoundNode, searchOnOwnLine, searchTextDefault, searchTextLarge,
      stateCodesToDisplay, voterGuidePositionSearchMode,
    } = this.props;
    const selectedFiltersWithoutSorts = selectedFilters.filter((item) => !sortFilters.includes(item));
    const numberOfFiltersSelected = selectedFiltersWithoutSorts.length;
    const filterBaseSearch = (
      <Suspense fallback={<></>}>
        <FilterBaseSearch
          addVoterGuideMode
          allItems={allItems}
          alwaysOpen={voterGuidePositionSearchMode}
          isSearching={isSearching}
          onFilterBaseSearch={this.onSearch}
          onToggleSearch={this.handleToggleSearchBallot}
          opinionsAndBallotItemsSearchMode={opinionsAndBallotItemsSearchMode}
          positionSearchMode={positionSearchMode}
          searchTextDefault={searchTextDefault}
          searchTextLarge={searchTextLarge}
          voterGuidePositionSearchMode={voterGuidePositionSearchMode}
        />
      </Suspense>
    );

    return (
      <Wrapper>
        {(searchOnOwnLine && filteredPositionListLength > 5) && filterBaseSearch}
        <FilterTop>
          {(!searchOnOwnLine && filteredPositionListLength > 5) && filterBaseSearch}
          {!isSearching && this.generateGroupedFilters()}
          {!isSearching && this.generateIslandFilters()}
          {(!isSearching && stateCodesToDisplay && stateCodesToDisplay.length > 0) && (
            <StateDropDown
              onStateDropDownChange={this.onStateDropDownChange}
              stateCodesToDisplay={stateCodesToDisplay}
            />
          )}
          {/* TODO: Mar 2022 we need to remove " && isWebApp()" or else voters can't get to endorsements for prior years */}
          {!isSearching && isWebApp() && (     // TODO: November 9, 2021: This feature needs work, and is temporarily out of Cordova
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
                <FilterList />
                &nbsp;
                <span className="listFilter__text">Filters</span>
              </div>
            </Badge>
          )}
          <NumberOfItemsFoundWrapper>
            {numberOfItemsFoundNode}
          </NumberOfItemsFoundWrapper>
        </FilterTop>
        {!isSearching && (
          React.cloneElement(this.props.children, {
            allItems: this.props.allItems,
            changeTrigger: this.state.changeTrigger,
            forceChangeTrigger: this.forceChangeTrigger,
            lastFilterAdded: this.state.lastFilterAdded,
            onSelectSortByFilter: this.selectSortByFilter,
            onToggleFilter: this.toggleFilter,
            onToggleMultipleFilters: this.onToggleMultipleFilters,
            onFilteredItemsChange: this.onFilteredItemsChange,
            selectedFilters: this.state.selectedFilters,
            showAllFilters: this.state.showAllFilters,
            updateSelectedFilters: this.updateSelectedFilters,
          })
        )}
      </Wrapper>
    );
  }
}
FilterBase.propTypes = {
  allItems: PropTypes.array,
  children: PropTypes.node, // This is the component that updates the items displayed
  classes: PropTypes.object,
  filteredPositionListLength: PropTypes.number,
  groupedFilters: PropTypes.array,
  islandFilters: PropTypes.array,
  numberOfItemsFoundNode: PropTypes.node,
  onSearch: PropTypes.func,
  onFilteredItemsChange: PropTypes.func,
  onToggleSearch: PropTypes.func,
  opinionsAndBallotItemsSearchMode: PropTypes.bool,
  positionSearchMode: PropTypes.bool,
  searchOnOwnLine: PropTypes.bool,
  searchTextDefault: PropTypes.string,
  searchTextLarge: PropTypes.bool,
  selectedFiltersDefault: PropTypes.array,
  sortFilters: PropTypes.array,
  stateCodesToDisplay: PropTypes.array,
  voterGuidePositionSearchMode: PropTypes.bool,
};

const styles = (theme) => ({
  badge: {
    right: '1rem',
    background: theme.palette.primary.main,
    [theme.breakpoints.down('sm')]: {
      right: '.8rem',
    },
  },
});

const FilterTop = styled('div')`
  display: flex;
  flex-flow: row wrap;
  padding: 0.5rem 0;
`;

const NumberOfItemsFoundWrapper = styled('div')`
  // float: right;
`;

const Wrapper = styled('div')`
  display: flex;
  flex-flow: column;
`;

export default withStyles(styles)(FilterBase);
