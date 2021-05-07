import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import uniqBy from 'lodash-es/uniqBy';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import getGroupedFilterSecondClass from './utils/grouped-filter-second-class';
import IssueStore from '../../stores/IssueStore';
import OrganizationStore from '../../stores/OrganizationStore';
import { renderLog } from '../../utils/logging';
import { convertStateCodeFilterToStateCode } from '../../utils/addressFunctions';
import { convertToInteger } from '../../utils/textFormat';


class VoterGuidePositionFilter extends Component {
  constructor (props) {
    super(props);
    this.state = {
      allItemsLength: 0,
      issues: IssueStore.getAllIssues(),
      positionUltimateElectionDateCutOffInteger: 0,
      sortedBy: '',
      thisYearInteger: 0,
    };
  }

  componentDidMount () {
    const { allItems } = this.props;
    let allItemsLength = 0;
    if (allItems) {
      allItemsLength = allItems.length || 0;
    }
    const today = new Date();
    const thisYearInteger = today.getFullYear();
    let month = today.getMonth() + 1;
    let monthDay = today.getDate();
    // We want to roll back positionUltimateElectionDateCutOffInteger by 5 so we can still see endorsements for an election in last 5 days
    if (monthDay < 6) {
      monthDay = 1;
      if (month > 1) {
        month -= 1;
      }
    } else {
      monthDay -= 5;
    }
    const monthAsString = month < 10 ? `0${month}` : `${month}`; // `${month}` for string result
    const monthDayAsString = monthDay < 10 ? `0${monthDay}` : `${monthDay}`; // `${monthDay}` for string result
    const electionDateAsString = `${thisYearInteger}${monthAsString}${monthDayAsString}`;
    const positionUltimateElectionDateCutOffInteger = convertToInteger(electionDateAsString);
    // console.log('positionUltimateElectionDateCutOffInteger:', positionUltimateElectionDateCutOffInteger);
    this.setState({
      allItemsLength,
      positionUltimateElectionDateCutOffInteger,
      thisYearInteger,
    });
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
  }

  componentDidUpdate (prevProps, prevState) {
    // console.log('VoterGuidePositionFilter componentDidUpdate:', prevProps.selectedFilters, this.props.selectedFilters);
    if ((JSON.stringify(prevProps.selectedFilters) !== JSON.stringify(this.props.selectedFilters)) ||
      (prevState.allItemsLength !== this.state.allItemsLength) ||
      (prevState.sortedBy !== this.state.sortedBy)
    ) {
      this.props.onFilteredItemsChange(this.getNewFilteredItems());
    }
    // console.log(this.state.issues);
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
  }

  onOrganizationStoreChange () {
    const { allItems } = this.props;
    const { allItemsLength } = this.state;
    let newAllItemsLength = 0;
    if (allItems) {
      newAllItemsLength = allItems.length || 0;
    }
    if (newAllItemsLength !== allItemsLength) {
      this.setState({
        allItemsLength: newAllItemsLength,
      });
    }
  }

  getFilteredItemsByLinkedIssue = (issueFilter) => {
    const { allItems } = this.props;
    return allItems.filter((item) => (item && item.issue_we_vote_ids_linked === issueFilter.issue_we_vote_id));
  };

  orderByCurrentFriendsFirst = (firstGuide, secondGuide) => {
    const secondGuideIsFromFriend = secondGuide && secondGuide.currentFriend === true ? 1 : 0;
    const firstGuideIsFromFriend = firstGuide && firstGuide.currentFriend === true ? 1 : 0;
    return secondGuideIsFromFriend - firstGuideIsFromFriend;
  };

  orderByFollowedOrgsFirst = (firstGuide, secondGuide) => secondGuide.followed - firstGuide.followed;

  orderByTwitterFollowers = (firstGuide, secondGuide) => secondGuide.twitter_followers_count - firstGuide.twitter_followers_count;

  orderByWrittenComment = (firstGuide, secondGuide) => {
    const secondGuideHasStatement = secondGuide && secondGuide.statement_text && secondGuide.statement_text.length ? 1 : 0;
    const firstGuideHasStatement = firstGuide && firstGuide.statement_text && firstGuide.statement_text.length ? 1 : 0;
    return secondGuideHasStatement - firstGuideHasStatement;
  };

  getNewFilteredItems = () => {
    const { allItems, selectedFilters } = this.props;
    const { positionUltimateElectionDateCutOffInteger, thisYearInteger } = this.state;
    // console.log('getNewFilteredItems allItems:', allItems, ', selectedFilters:', selectedFilters);
    let filteredItems = [];
    if (!selectedFilters || !selectedFilters.length) return allItems;
    // First, bring in only the race levels to show
    // const selectedFiltersDefault = ['sortByAlphabetical', 'thisYear', 'federalRaces', 'stateRaces', 'measureRaces', 'localRaces'];
    let containsAtLeastOneRaceFilter = false;
    selectedFilters.forEach((filter) => {
      switch (filter) {
        case 'federalRaces':
        case 'stateRaces':
        case 'measureRaces':
        case 'localRaces':
          containsAtLeastOneRaceFilter = true;
          break;
        default:
          break;
      }
    });
    // console.log('containsAtLeastOneRaceFilter:', containsAtLeastOneRaceFilter);
    if (containsAtLeastOneRaceFilter) {
      let federalRacesFilterUsed = false;
      let stateRacesFilterUsed = false;
      let localRacesFilterUsed = false;
      selectedFilters.forEach((filter) => {
        switch (filter) {
          case 'federalRaces':
            filteredItems = [...filteredItems, ...allItems.filter((item) => (item && item.race_office_level === 'Federal'))];
            federalRacesFilterUsed = true;
            break;
          case 'stateRaces':
            filteredItems = [...filteredItems, ...allItems.filter((item) => (item && item.race_office_level === 'State'))];
            stateRacesFilterUsed = true;
            break;
          case 'measureRaces':
            filteredItems = [...filteredItems, ...allItems.filter((item) => (item && item.kind_of_ballot_item === 'MEASURE'))];
            break;
          case 'localRaces':
            filteredItems = [...filteredItems, ...allItems.filter((item) => (item && item.race_office_level === 'Local'))];
            localRacesFilterUsed = true;
            break;
          default:
            break;
        }
      });
      // Now add in candidate items that might have been left out from bad data
      if (federalRacesFilterUsed && stateRacesFilterUsed && localRacesFilterUsed) {
        filteredItems = [...filteredItems, ...allItems.filter((item) => (item && (!item.race_office_level && item.kind_of_ballot_item === 'CANDIDATE')))];
      }
    } else {
      filteredItems = allItems;
    }
    // upcomingOnly, thisYear, priorYears, battlegroundRaces
    let containsAtLeastOneYear = false;
    selectedFilters.forEach((filter) => {
      switch (filter) {
        case 'upcomingOnly':
          containsAtLeastOneYear = true;
          break;
        case 'thisYear':
          containsAtLeastOneYear = true;
          break;
        case 'priorYears':
          containsAtLeastOneYear = true;
          break;
        default:
          break;
      }
    });
    if (containsAtLeastOneYear) {
      const filterItemsSnapshot = filteredItems;
      filteredItems = [];
      selectedFilters.forEach((filter) => {
        switch (filter) {
          case 'upcomingOnly':
            filteredItems = [...filteredItems, ...filterItemsSnapshot.filter((item) => (item && item.position_ultimate_election_date > positionUltimateElectionDateCutOffInteger))];
            break;
          case 'thisYear':
            filteredItems = [...filteredItems, ...filterItemsSnapshot.filter((item) => (item && item.position_year === thisYearInteger))];
            break;
          case 'priorYears':
            filteredItems = [...filteredItems, ...filterItemsSnapshot.filter((item) => (item && item.position_year < thisYearInteger))];
            break;
          default:
            break;
        }
      });
    }
    // Which showSupportFilter/showOpposeFilter/showCommentFilter to show?
    // Make sure one of them is chosen. If not, do not limit by support/oppose/comment
    let containsAtLeastOneSupportOpposeComment = false;
    selectedFilters.forEach((filter) => {
      switch (filter) {
        case 'showSupportFilter':
        case 'showOpposeFilter':
        case 'showInformationOnlyFilter':
          containsAtLeastOneSupportOpposeComment = true;
          break;
        default:
          break;
      }
    });
    if (containsAtLeastOneSupportOpposeComment) {
      const filterItemsSnapshot = filteredItems;
      filteredItems = [];
      selectedFilters.forEach((filter) => {
        switch (filter) {
          case 'showSupportFilter':
            filteredItems = [...filteredItems, ...filterItemsSnapshot.filter((item) => (item && item.is_support_or_positive_rating))];
            break;
          case 'showOpposeFilter':
            filteredItems = [...filteredItems, ...filterItemsSnapshot.filter((item) => (item && item.is_oppose_or_negative_rating))];
            break;
          case 'showInformationOnlyFilter':
            filteredItems = [...filteredItems, ...filterItemsSnapshot.filter((item) => (item && item.is_information_only))];
            break;
          default:
            break;
        }
      });
    }
    // Is at least one state chosen? If not, do not limit by state code.
    let containsAtLeastOneStateCode = false;
    let oneStateCode;
    const stateCodesToShow = [];
    selectedFilters.forEach((filter) => {
      oneStateCode = convertStateCodeFilterToStateCode(filter);
      if (oneStateCode) {
        stateCodesToShow.push(oneStateCode);
        containsAtLeastOneStateCode = true;
      }
    });
    if (containsAtLeastOneStateCode) {
      const filterItemsSnapshot = filteredItems;
      filteredItems = [];
      stateCodesToShow.forEach((stateCode) => {
        filteredItems = [...filteredItems, ...filterItemsSnapshot.filter((item) => (item && item.state_code.toLowerCase() === stateCode.toLowerCase()))];
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
            filteredItems = [...filteredItems, ...filterItemsCommentSnapshot.filter((item) => (item && item.statement_text && item.statement_text.length))];
            break;
          default:
            break;
        }
      });
    }
    // Sort Order
    selectedFilters.forEach((filter) => {
      switch (filter) {
        case 'sortByAlphabetical':
          // console.log('sortByAlphabetical');
          this.setState({
            sortedBy: 'sortByAlphabetical',
          });
          break;
        default:
          // Skip over all other filters
          // console.log('sort by default, filter:', filter);
          // if (typeof filter === 'object') {
          //   // console.log('sort by object');
          //   filteredItems = [...filteredItems, ...this.getFilteredItemsByLinkedIssue(filter)];
          // }
          break;
      }
    });
    return uniqBy(filteredItems, (x) => x.position_we_vote_id);
  }

  toggleFilter = (name) => {
    this.props.onToggleFilter(name);
  }

  toggleUpcomingOnly = (upcomingOnlyChecked, thisYearChecked, priorYearsChecked) => {
    const filterNameList = [];
    if (upcomingOnlyChecked) {
      // If here, we are unchecking 'Upcoming Only'
      // Goal: Toggle ON thisYear
      if (!thisYearChecked) {
        filterNameList.push('thisYear');
      }
      filterNameList.push('upcomingOnly');
    } else {
      // Goal: Toggle OFF thisYear and priorYears
      if (thisYearChecked) {
        filterNameList.push('thisYear');
      }
      if (priorYearsChecked) {
        filterNameList.push('priorYears');
      }
      filterNameList.push('upcomingOnly');
    }
    if (this.props.onToggleMultipleFilters && filterNameList && filterNameList.length > 0) {
      this.props.onToggleMultipleFilters(filterNameList);
    }
  }

  toggleThisYear = (upcomingOnlyChecked, thisYearChecked, priorYearsChecked) => {
    const filterNameList = [];
    filterNameList.push('thisYear');
    if (thisYearChecked) {
      // Goal: Since we are unchecking thisYear, IF priorYears is NOT checked, Toggle ON upcomingOnly
      if (!priorYearsChecked && !upcomingOnlyChecked) {
        filterNameList.push('upcomingOnly');
      }
    } else if (upcomingOnlyChecked) filterNameList.push('upcomingOnly'); // Goal: If upcomingOnly is currently checked, Toggle OFF upcomingOnly
    if (this.props.onToggleMultipleFilters && filterNameList && filterNameList.length > 0) {
      this.props.onToggleMultipleFilters(filterNameList);
    }
  }

  togglePriorYears = (upcomingOnlyChecked, thisYearChecked, priorYearsChecked) => {
    const filterNameList = [];
    filterNameList.push('priorYears');
    if (priorYearsChecked) {
      // Goal: Since we are unchecking priorYears, IF thisYear is NOT checked, Toggle ON upcomingOnly
      if (!thisYearChecked && !upcomingOnlyChecked) {
        filterNameList.push('upcomingOnly');
      }
    } else if (upcomingOnlyChecked) filterNameList.push('upcomingOnly'); // Goal: Since we are check the Prior Years box, if upcomingOnly is currently checked, Toggle OFF upcomingOnly
    if (this.props.onToggleMultipleFilters && filterNameList && filterNameList.length > 0) {
      this.props.onToggleMultipleFilters(filterNameList);
    }
  }

  selectSortByFilter = (name) => {
    this.props.onSelectSortByFilter(name);
  }

  generateIssuesFilters = () => this.state.issues.slice(0, 1).map((item, itemIndex) => (
    <div
        key={item.filterName}
        className={`groupedFilter ${getGroupedFilterSecondClass(itemIndex, this.state.issues.length)} ${this.props.selectedFilters.indexOf(item.issue_we_vote_id) > -1 ? 'listFilterSelected' : ''}`}
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
    renderLog('VoterGuidePositionFilter');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, showAllFilters, selectedFilters } = this.props;
    // console.log('VoterGuidePositionFilter render');

    return (
      <Wrapper showAllFilters={showAllFilters}>
        <FilterRow>
          <FilterColumn>
            <b>Sort By</b>
            <SortByContainer>
              <SortBy selected={selectedFilters.indexOf('sortByAlphabetical') > -1} onClick={() => this.selectSortByFilter('sortByAlphabetical')}>Alphabetical</SortBy>
            </SortByContainer>
          </FilterColumn>
          <FilterColumn>
            <b>Endorsements From...</b>
            <FormControlLabel
              classes={{ label: classes.formControlLabel }}
              control={(
                <Checkbox
                  checked={selectedFilters.indexOf('upcomingOnly') > -1}
                  onChange={() => this.toggleUpcomingOnly(selectedFilters.indexOf('upcomingOnly') > -1, selectedFilters.indexOf('thisYear') > -1, selectedFilters.indexOf('priorYears') > -1)}
                  value="upcomingOnly"
                  color="primary"
                />
              )}
              label="Upcoming Only"
            />
            <FormControlLabel
              classes={{ label: classes.formControlLabel }}
              control={(
                <Checkbox
                  checked={selectedFilters.indexOf('thisYear') > -1}
                  onChange={() => this.toggleThisYear(selectedFilters.indexOf('upcomingOnly') > -1, selectedFilters.indexOf('thisYear') > -1, selectedFilters.indexOf('priorYears') > -1)}
                  value="thisYear"
                  color="primary"
                />
              )}
              label="This Year"
            />
            <FormControlLabel
              classes={{ label: classes.formControlLabel }}
              control={(
                <Checkbox
                  checked={selectedFilters.indexOf('priorYears') > -1}
                  onChange={() => this.togglePriorYears(selectedFilters.indexOf('upcomingOnly') > -1, selectedFilters.indexOf('thisYear') > -1, selectedFilters.indexOf('priorYears') > -1)}
                  value="priorYears"
                  color="primary"
                />
              )}
              label="Prior Years"
            />
            {/* <FormControlLabel */}
            {/*  classes={{ label: classes.formControlLabel }} */}
            {/*  control={( */}
            {/*    <Checkbox */}
            {/*      checked={selectedFilters.indexOf('battlegroundRaces') > -1} */}
            {/*      onChange={() => this.toggleFilter('battlegroundRaces')} */}
            {/*      value="battlegroundRaces" */}
            {/*      color="primary" */}
            {/*    /> */}
            {/*  )} */}
            {/*  label="Battleground Races" */}
            {/* /> */}
          </FilterColumn>
          <FilterColumn className="u-show-desktop-tablet">
            <b>Race Level</b>
            <FormControlLabel
              classes={{ label: classes.formControlLabel }}
              control={(
                <Checkbox
                  checked={selectedFilters.indexOf('federalRaces') > -1}
                  onChange={() => this.toggleFilter('federalRaces')}
                  value="federalRaces"
                  color="primary"
                />
              )}
              label="Federal"
            />
            <FormControlLabel
              classes={{ label: classes.formControlLabel }}
              control={(
                <Checkbox
                  checked={selectedFilters.indexOf('stateRaces') > -1}
                  onChange={() => this.toggleFilter('stateRaces')}
                  value="stateRaces"
                  color="primary"
                />
              )}
              label="State"
            />
            <FormControlLabel
              classes={{ label: classes.formControlLabel }}
              control={(
                <Checkbox
                  checked={selectedFilters.indexOf('measureRaces') > -1}
                  onChange={() => this.toggleFilter('measureRaces')}
                  value="measureRaces"
                  color="primary"
                />
              )}
              label="Measure"
            />
            <FormControlLabel
              classes={{ label: classes.formControlLabel }}
              control={(
                <Checkbox
                  checked={selectedFilters.indexOf('localRaces') > -1}
                  onChange={() => this.toggleFilter('localRaces')}
                  value="localRaces"
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
VoterGuidePositionFilter.propTypes = {
  allItems: PropTypes.array,
  onFilteredItemsChange: PropTypes.func,
  onSelectSortByFilter: PropTypes.func,
  onToggleFilter: PropTypes.func,
  onToggleMultipleFilters: PropTypes.func,
  selectedFilters: PropTypes.array,
  showAllFilters: PropTypes.bool,
  classes: PropTypes.object,
};

const styles = (theme) => ({
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

const SortByContainer = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
`;

const SortBy = styled.p`
  font-size: ${({ selected }) => (selected ? '.95rem' : '.875rem')};
  margin: 8px 0 0 0;
  cursor: pointer;
  color: ${({ selected, theme }) => (selected ? theme.colors.brandBlue : '#555')};
  font-weight: ${({ selected }) => (selected ? '800' : '400')};
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 14px;
  }
  &:hover {
    filter: opacity(0.7);
  }
`;

export default withStyles(styles)(VoterGuidePositionFilter);
