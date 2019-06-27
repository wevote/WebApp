import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Badge from '@material-ui/core/Badge';
import FilterListIcon from '@material-ui/icons/FilterList';
import { withStyles } from '@material-ui/core/styles';
import getGroupedFilterSecondClass from './utils/grouped-filter-second-class';

const sortFilters = ['sortByNetwork', 'sortByReach'];

class FilterBase extends React.Component {
  static propTypes = {
    allItems: PropTypes.array,
    children: PropTypes.node, // This is the component that updates the items displayed
    classes: PropTypes.object,
    groupedFilters: PropTypes.array,
    islandFilters: PropTypes.array,
    onFilteredItemsChange: PropTypes.func,
    selectedFiltersDefault: PropTypes.array,
  };

  constructor (props) {
    super(props);
    this.state = {
      showAllFilters: false,
      selectedFilters: [],
      filteredItems: [],
    };
  }

  componentDidMount () {
    this.setState({
      selectedFilters: this.props.selectedFiltersDefault || [],
    });
  }


  toggleShowAllFilters = () => {
    const { showAllFilters } = this.state;
    this.setState({ showAllFilters: !showAllFilters });
  }

  toggleFilter = (filterName) => {
    const { selectedFilters } = this.state;
    if (selectedFilters.indexOf(filterName) > -1) {
      // Remove this filter
      this.setState({ selectedFilters: selectedFilters.filter(filter => filter !== filterName) });
    } else {
      // Add this filter
      this.setState({ selectedFilters: [...selectedFilters, filterName]});
    }
  }

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
  }

  setFilteredItems = filteredItems => this.setState({ filteredItems }, () => this.props.onFilteredItemsChange(this.state.filteredItems));

  generateGroupedFilters = () => this.props.groupedFilters.map((item, itemIndex) => (
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
          </span>
        ) : null
      }
    </div>
  ));

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

  render () {
    const { selectedFilters, showAllFilters } = this.state;
    const { classes } = this.props;
    const selectedFiltersWithoutSorts = selectedFilters.filter(item => !sortFilters.includes(item));
    const numberOfFiltersSelected = selectedFiltersWithoutSorts.length;
    // console.log('FilterBase, selectedFilters: ', selectedFilters, ', filteredItems: ', filteredItems);
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
          {
            this.generateGroupedFilters()
          }
          {
            this.generateIslandFilters()
          }
        </FilterTop>
        {
          React.cloneElement(this.props.children, {
            allItems: this.props.allItems,
            selectedFilters: this.state.selectedFilters,
            onSelectSortByFilter: this.selectSortByFilter,
            onToggleFilter: this.toggleFilter,
            onFilteredItemsChange: this.setFilteredItems,
            showAllFilters: this.state.showAllFilters,
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
  display: flex;
  flex-flow: column;
  padding: 1rem;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
`;

const FilterTop = styled.div`
  display: flex;
  flex-flow: row nowrap;
  // overflow-x: scroll;
  padding: 0.7rem 0;
`;

export default withStyles(styles)(FilterBase);
