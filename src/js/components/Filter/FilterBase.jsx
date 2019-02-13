import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Badge from "@material-ui/core/Badge";
import { withStyles } from "@material-ui/core/styles";
import getGroupedFilterSecondClass from "./utils/grouped-filter-second-class";

const styles = theme => ({
  badge: {
    right: 2,
    background: theme.palette.primary,
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
  overflow-x: scroll;
  padding: 0.7rem 0;
`;

class FilterBase extends React.Component {
  static propTypes = {
    groupedFilters: PropTypes.array,
    islandFilters: PropTypes.array,
    allItems: PropTypes.array,
    onFilteredItemsChange: PropTypes.func,
    children: PropTypes.node,
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      showAllFilters: false,
      selectedFilters: [],
      filteredItems: [],
    };
  }

  toggleShowAllFilters = () => {
    const { showAllFilters } = this.state;
    this.setState({ showAllFilters: !showAllFilters });
  }

  toggleFilter = (filterName) => {
    const { selectedFilters } = this.state;
    if (selectedFilters.indexOf(filterName) > -1) {
      this.setState({ selectedFilters: selectedFilters.filter(filter => filter !== filterName) });
    } else {
      this.setState({ selectedFilters: [...selectedFilters, filterName]});
    }
  }

  setFilteredItems = filteredItems => this.setState({ filteredItems }, () => this.props.onFilteredItemsChange(this.state.filteredItems));

  generateGroupedFilters = () => this.props.groupedFilters.map((item, itemIndex) => (
    <div
        key={item.filterName}
        className={`groupedFilter ${getGroupedFilterSecondClass(itemIndex, this.props.groupedFilters.length)} ${this.state.selectedFilters.indexOf(item.filterName) > -1 ? "listFilterSelected" : ""}`}
        onClick={() => this.toggleFilter(item.filterName)}
    >
      {
          item.iconName ? (
            <div>
              <ion-icon name={item.iconName} />
            </div>
          ) : null
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
      className={`listFilter ${this.state.selectedFilters.indexOf(item.filterName) > -1 ? "listFilterSelected" : ""}`}
      onClick={() => this.toggleFilter(item.filterName)}
    >
      {
          item.iconName ? (
            <div>
              <ion-icon className="ion" name={item.iconName} />
            </div>
          ) : null
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
    const { showAllFilters, selectedFilters } = this.state;
    const { classes } = this.props;
    return (
      <Wrapper>
        <FilterTop>
          <Badge
            classes={{ badge: classes.badge }}
            badgeContent={selectedFilters.length}
            invisible={selectedFilters.length === 0}
            color="primary"
          >
            <div
              className={`listFilter ${showAllFilters ? "listFilterSelected" : ""}`}
              onClick={this.toggleShowAllFilters}
            >
              <ion-icon className="ion" name="options" />
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
            onToggleFilter: this.toggleFilter,
            onFilteredItemsChange: this.setFilteredItems,
            showAllFilters: this.state.showAllFilters,
          })
        }
      </Wrapper>
    );
  }
}

export default withStyles(styles)(FilterBase);
