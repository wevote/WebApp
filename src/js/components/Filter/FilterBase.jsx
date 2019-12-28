import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Badge from '@material-ui/core/esm/Badge';
import FilterListIcon from '@material-ui/icons/FilterList';
import { withStyles } from '@material-ui/core/esm/styles';
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
    onFilteredItemsChange: PropTypes.func,
    selectedFiltersDefault: PropTypes.array,
    totalNumberOfItemsFound: PropTypes.number,
  };

  constructor (props) {
    super(props);
    this.state = {
      changeTrigger: '',
      // componentDidMount: false,
      filteredItems: [],
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

  // shouldComponentUpdate (nextProps, nextState) {
  //   // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
  //   // console.log('FilterBase this.props:', this.props);
  //   // console.log('FilterBase nextProps:', nextProps);
  //   // console.log('FilterBase this.state:', this.state);
  //   // console.log('FilterBase nextState:', nextState);
  //   // console.log('shouldComponentUpdate START');
  //   if (this.state.componentDidMount !== nextState.componentDidMount) {
  //     // console.log('this.state.componentDidMount:', this.state.componentDidMount, ', nextState.componentDidMount:', nextState.componentDidMount);
  //     return true;
  //   }
  //   if (this.state.changeTrigger !== nextState.changeTrigger) {
  //     // console.log('this.state.changeTrigger:', this.state.changeTrigger, ', nextState.changeTrigger:', nextState.changeTrigger);
  //     return true;
  //   }
  //   if (this.state.lastFilterAdded !== nextState.lastFilterAdded) {
  //     // console.log('this.state.lastFilterAdded:', this.state.lastFilterAdded, ', nextState.lastFilterAdded:', nextState.lastFilterAdded);
  //     return true;
  //   }
  //   if (this.state.showAllFilters !== nextState.showAllFilters) {
  //     // console.log('this.state.showAllFilters:', this.state.showAllFilters, ', nextState.showAllFilters:', nextState.showAllFilters);
  //     return true;
  //   }
  //   if (JSON.stringify(this.state.selectedFilters) !== JSON.stringify(nextState.selectedFilters)) {
  //     // console.log('this.state.selectedFilters:', JSON.stringify(this.state.selectedFilters), ', nextState.selectedFilters:', JSON.stringify(nextState.selectedFilters));
  //     return true;
  //   }
  //   if (JSON.stringify(this.state.filteredItems) !== JSON.stringify(nextState.filteredItems)) {
  //     // console.log('this.state.filteredItems:', this.state.filteredItems, ', nextState.filteredItems:', nextState.filteredItems);
  //     return true;
  //   }
  //   // console.log('shouldComponentUpdate no change');
  //   return false;
  // }

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
      filteredItems,
    }, () => this.props.onFilteredItemsChange(this.state.filteredItems, currentSelectedBallotFilters));
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

  handleIsSearchingToggle = () => {
    const { isSearching } = this.state;
    this.setState({ isSearching: !isSearching });
  };

  onSearch = (filteredItems) => {
    this.setState({
      filteredItems,
    }, () => this.props.onFilteredItemsChange(this.state.filteredItems, this.state.selectedFilters));
  };

  render () {
    renderLog('FilterBase');  // Set LOG_RENDER_EVENTS to log all renders
    const { isSearching, selectedFilters, showAllFilters } = this.state;
    const { allItems, classes, totalNumberOfItemsFound } = this.props;
    const selectedFiltersWithoutSorts = selectedFilters.filter(item => !sortFilters.includes(item));
    const numberOfFiltersSelected = selectedFiltersWithoutSorts.length;
    return (
      <Wrapper>
        <FilterTop>
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
          <BallotSearch
            addVoterGuideMode
            isSearching={isSearching}
            items={allItems}
            onBallotSearch={this.onSearch}
            onToggleSearch={this.handleIsSearchingToggle}
          />
          {
            this.generateGroupedFilters()
          }
          {
            this.generateIslandFilters()
          }
          {totalNumberOfItemsFound > 0 && (
            <NumberFound>
              {totalNumberOfItemsFound > 1 ? `${totalNumberOfItemsFound} Items Found` : `${totalNumberOfItemsFound} Item Found`}
            </NumberFound>
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
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  flex-flow: column;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
`;

const FilterTop = styled.div`
  display: flex;
  flex-flow: row wrap;
  // overflow-x: scroll;
  padding: 0.7rem 0;
`;

const NumberFound = styled.div`
  font-size: 16px;
  font-weight: bold;
  padding-top: 8px;
`;

export default withStyles(styles)(FilterBase);
