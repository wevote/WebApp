import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import isEqual from 'lodash-es/isEqual';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import { arrayContains, removeValueFromArray } from '../../utils/textFormat';
import { convertStateCodeToStateText, convertStateTextToStateCode, stateCodeMap } from '../../utils/address-functions';
import BallotActions from '../../actions/BallotActions';
import BallotStore from '../../stores/BallotStore';
import { renderLog } from '../../utils/logging';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


class SettingsAddBallotItemsFilter extends Component {
  static propTypes = {
    // Passed in through FilterBase
    allItems: PropTypes.array,
    classes: PropTypes.object,
    changeTrigger: PropTypes.string,
    forceChangeTrigger: PropTypes.func,
    lastFilterAdded: PropTypes.string,
    onFilteredItemsChange: PropTypes.func,
    onSelectSortByFilter: PropTypes.func,
    onToggleFilter: PropTypes.func,
    selectedFilters: PropTypes.array,
    showAllFilters: PropTypes.bool,
    updateSelectedFilters: PropTypes.func,
    // Passed in directly
    filtersPassedInOnce: PropTypes.array,
    googleCivicElectionId: PropTypes.number,
  };

  constructor (props) {
    super(props);
    this.state = {
      allBallotItemsLastStateCodeReceived: '',
      componentDidMount: false,
      filtersAlreadyPassedInOnce: [],
      localAllBallotItemsHaveBeenRetrieved: {},
      selectedStates: [],
    };
  }

  componentDidMount () {
    const { selectedFilters } = this.props;
    const { selectedStates } = this.state;
    let selectedStateFound = false;
    const stateCodeList = Object.keys(stateCodeMap);
    // console.log('componentDidMount selectedFilters:', selectedFilters);
    // console.log('componentDidMount stateCodeList:', stateCodeList);
    selectedFilters.forEach((filter) => {
      // console.log('componentDidMount filter:', filter);
      if (arrayContains(filter, stateCodeList)) {
        selectedStates.push(filter);
        selectedStateFound = true;
      }
    });
    // console.log('componentDidMount selectedStates:', selectedStates);
    if (selectedStateFound) {
      this.setState({
        selectedStates,
      });
    }
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
  }

  componentWillReceiveProps (nextProps) {
    const { filtersAlreadyPassedInOnce, selectedStates } = this.state;
    const { filtersPassedInOnce, selectedFilters } = nextProps;
    // console.log('componentWillReceiveProps selectedFilters at start:', selectedFilters);
    let newFilterPassedIn = false;
    filtersPassedInOnce.forEach((incomingFilter) => {
      if (!arrayContains(incomingFilter, filtersAlreadyPassedInOnce)) {
        newFilterPassedIn = true;
        filtersAlreadyPassedInOnce.push(incomingFilter);
        if (!arrayContains(incomingFilter, selectedFilters)) {
          selectedFilters.push(incomingFilter);
        }
      }
    });
    if (newFilterPassedIn) {
      // console.log('newFilterPassedIn TRUE, selectedFilters:', selectedFilters);
      this.setState({
        filtersAlreadyPassedInOnce,
      });
      // Now see if any of these need to be added to the selectedStates
      let selectedStateFound = false;
      const stateCodeList = Object.keys(stateCodeMap);
      // console.log('componentDidMount stateCodeList:', stateCodeList);
      selectedFilters.forEach((filter) => {
        // console.log('componentDidMount filter:', filter);
        if (arrayContains(filter, stateCodeList) && !arrayContains(filter, selectedStates)) {
          selectedStates.push(filter);
          selectedStateFound = true;
        }
      });
      // console.log('componentDidMount selectedStates:', selectedStates);
      if (selectedStateFound) {
        this.setState({
          selectedStates,
        });
      }
      // And finally, end by resetting all filters in FilterBase with the updated set
      this.props.updateSelectedFilters(selectedFilters);
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.state.allBallotItemsLastStateCodeReceived !== nextState.allBallotItemsLastStateCodeReceived) {
      // console.log('this.state.allBallotItemsLastStateCodeReceived:', this.state.allBallotItemsLastStateCodeReceived, ', nextState.allBallotItemsLastStateCodeReceived:', nextState.allBallotItemsLastStateCodeReceived);
      return true;
    }
    if (this.state.componentDidMount !== nextState.componentDidMount) {
      // console.log('this.state.componentDidMount:', this.state.componentDidMount, ', nextState.componentDidMount:', nextState.componentDidMount);
      return true;
    }
    if (JSON.stringify(this.state.selectedStates) !== JSON.stringify(nextState.selectedStates)) {
      // console.log('this.state.selectedStates:', this.state.selectedStates, ', nextState.selectedStates:', nextState.selectedStates);
      return true;
    }
    if (this.props.changeTrigger !== nextProps.changeTrigger) {
      // console.log('this.props.changeTrigger:', this.props.changeTrigger, ', nextProps.changeTrigger:', nextProps.changeTrigger);
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

  componentDidUpdate (prevProps, prevState) {
    // console.log('SettingsAddBallotItemsFilter componentDidUpdate');
    // console.log('prevProps.selectedFilters:', prevProps.selectedFilters, ', this.props.selectedFilters:', this.props.selectedFilters);
    // console.log('prevProps.selectedFilters-stringify:', JSON.stringify(prevProps.selectedFilters), ', this.props.selectedFilters-stringify:', JSON.stringify(this.props.selectedFilters));
    if (JSON.stringify(prevProps.selectedFilters) !== JSON.stringify(this.props.selectedFilters)) {
      // console.log('+++SettingsAddBallotItemsFilter componentDidUpdate, change to selectedFilters');
      const newFilteredItems = this.getNewFilteredItems();
      this.props.onFilteredItemsChange(newFilteredItems, this.props.selectedFilters);
    } else if ((prevState.allBallotItemsLastStateCodeReceived !== this.state.allBallotItemsLastStateCodeReceived) || (prevProps.changeTrigger !== this.props.changeTrigger)) {
      // console.log('+++componentDidUpdate, change to allBallotItemsLastStateCodeReceived:', this.state.allBallotItemsLastStateCodeReceived, ', or changeTrigger:', this.props.changeTrigger);
      const newFilteredItems = this.getNewFilteredItems();
      this.props.onFilteredItemsChange(newFilteredItems, this.props.selectedFilters);
      this.props.forceChangeTrigger(this.state.allBallotItemsLastStateCodeReceived);
    } else {
      // console.log('---SettingsAddBallotItemsFilter componentDidUpdate, no change to selectedFilters');
    }
    // If a stateCode has been added that hasn't been retrieved from the API server, retrieve it now
    const { googleCivicElectionId } = this.props;
    let { selectedFilters } = this.props;
    const { localAllBallotItemsHaveBeenRetrieved, selectedStates: newSelectedStates } = this.state;
    if (googleCivicElectionId && JSON.stringify(prevState.selectedStates) !== JSON.stringify(newSelectedStates)) {
      // console.log('componentDidUpdate change in selectedStates found');
      // Find new states just added
      this.state.selectedStates.forEach((stateCodeToRetrieve) => {
        // Is there a state in this list that is NOT in the previous list?
        if (!arrayContains(stateCodeToRetrieve, prevState.selectedStates)) {
          // console.log('New stateCode found:', stateCodeToRetrieve);
          if (!localAllBallotItemsHaveBeenRetrieved[googleCivicElectionId]) {
            localAllBallotItemsHaveBeenRetrieved[googleCivicElectionId] = {};
          }
          if (!localAllBallotItemsHaveBeenRetrieved[googleCivicElectionId][stateCodeToRetrieve]) {
            localAllBallotItemsHaveBeenRetrieved[googleCivicElectionId][stateCodeToRetrieve] = false;
          }
          const doNotRetrieveAllBallotItems = localAllBallotItemsHaveBeenRetrieved[googleCivicElectionId][stateCodeToRetrieve] || BallotStore.allBallotItemsHaveBeenRetrievedForElection(googleCivicElectionId, stateCodeToRetrieve);
          // console.log('doNotRetrieveAllBallotItems:', doNotRetrieveAllBallotItems);
          if (!doNotRetrieveAllBallotItems) {
            localAllBallotItemsHaveBeenRetrieved[googleCivicElectionId][stateCodeToRetrieve] = true;
            this.setState({
              localAllBallotItemsHaveBeenRetrieved,
            });
            BallotActions.allBallotItemsRetrieve(googleCivicElectionId, stateCodeToRetrieve);
          }
        }
      });
      let stateCodeRemoved = false;
      prevState.selectedStates.forEach((stateCode) => {
        // Is there a state in the previous selectedStates that is not in the current list? If so, trigger re-render
        if (!arrayContains(stateCode, newSelectedStates)) {
          // console.log('stateCodeRemoved: ', stateCodeRemoved, ', stateCode:', stateCode);
          selectedFilters = removeValueFromArray(stateCode, selectedFilters);
          // console.log('Updated selectedFilters:', selectedFilters);
          stateCodeRemoved = true;
        }
      });
      if (stateCodeRemoved) {
        this.props.updateSelectedFilters(selectedFilters);
      }
    }
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
  }

  onBallotStoreChange () {
    const allBallotItemsLastStateCodeReceived = BallotStore.getAllBallotItemsLastStateCodeReceived;
    // console.log('onBallotStoreChange allBallotItemsLastStateCodeReceived:', allBallotItemsLastStateCodeReceived);
    this.setState({
      allBallotItemsLastStateCodeReceived,
    });
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

    // Remove all Candidates
    let filterItemsSnapshot = filteredItems;
    filteredItems = [];
    filteredItems = [...filteredItems, ...filterItemsSnapshot.filter(item => item.kind_of_ballot_item !== 'CANDIDATE')];

    // Remove states that aren't in the selectedFilters?
    const stateCodeList = Object.keys(stateCodeMap);
    const stateCodesSelected = ['na', ''];
    selectedFilters.forEach((filter) => {
      if (arrayContains(filter, stateCodeList)) {
        stateCodesSelected.push(filter.toLowerCase());
      }
    });
    // console.log('stateCodesSelected:', stateCodesSelected);
    // console.log('filteredItems:', filteredItems);
    if (stateCodesSelected.length) {
      filterItemsSnapshot = filteredItems;
      filteredItems = [];
      filteredItems = [...filteredItems, ...filterItemsSnapshot.filter(item => arrayContains(item.state_code, stateCodesSelected))];
    }

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
          if (lastFilterAdded && !isEqual(lastFilterAdded, 'showFederalRaceFilter')) {
            // Only add to filtersToRemove if it wasn't the last race filter selected
            raceFilterCount += 1;
            filtersToRemove.push('showFederalRaceFilter');
          }
          break;
        case 'showStateRaceFilter':
          containsAtLeastOneRaceFilter = true;
          raceFilterCount += 1;
          if (lastFilterAdded && !isEqual(lastFilterAdded, 'showStateRaceFilter')) {
            raceFilterCount += 1;
            filtersToRemove.push('showStateRaceFilter');
          }
          break;
        case 'showMeasureRaceFilter':
          containsAtLeastOneRaceFilter = true;
          raceFilterCount += 1;
          if (lastFilterAdded && !isEqual(lastFilterAdded, 'showMeasureRaceFilter')) {
            raceFilterCount += 1;
            filtersToRemove.push('showMeasureRaceFilter');
          }
          break;
        case 'showLocalRaceFilter':
          containsAtLeastOneRaceFilter = true;
          raceFilterCount += 1;
          if (lastFilterAdded && !isEqual(lastFilterAdded, 'showLocalRaceFilter')) {
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

    // Now limit to one kind of race level
    if (containsAtLeastOneRaceFilter) {
      // console.log('After containsAtLeastOneRaceFilter, filteredItems:', filteredItems);
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
    // return uniqBy(filteredItems, x => x.we_vote_id);

    // We no longer filter for a unique we_vote_id because we sometimes pass items into this routine that don't have a we_vote_id
    // console.log('filteredItems:', filteredItems);
    return filteredItems;
  };

  removeTheseFilters = (filterListToRemove) => {
    // Remove the items in filterList that are currently in selectedFilters
    // console.log('SettingsAddBallotItemsFilter, removeTheseFilters filterListToRemove:', filterListToRemove);
    const newFilteredItems = this.props.selectedFilters.filter(oneItem => !filterListToRemove.includes(oneItem));
    this.props.updateSelectedFilters(newFilteredItems);
  };

  toggleFilter = (filterName) => {
    this.props.onToggleFilter(filterName);
  };

  selectSortByFilter = (name) => {
    this.props.onSelectSortByFilter(name);
  };

  // getStyles(name, personName, theme) {
  //   return {
  //     fontWeight:
  //       personName.indexOf(name) === -1
  //         ? theme.typography.fontWeightRegular
  //         : theme.typography.fontWeightMedium,
  //   };
  // }

  onSelectedStatesChange = (event, index) => {
    const { selectedFilters } = this.props;
    const { selectedStates: priorValues } = this.state;
    const newValue = index.key;
    // console.log('onSelectedStatesChange newValue:', newValue);
    if (newValue) {
      let newSelectedFilters = [];
      if (arrayContains(newValue, priorValues)) {
        // Remove newValue
        const newValues = removeValueFromArray(newValue, priorValues);
        this.setState({
          selectedStates: newValues,
        });
        // And finally, end by resetting all filters in FilterBase with the updated set
        newSelectedFilters = removeValueFromArray(newValue, selectedFilters);
        // console.log('onSelectedStatesChange, REMOVE selectedFilters:', newSelectedFilters);
        this.props.updateSelectedFilters(newSelectedFilters);
        this.props.forceChangeTrigger('REMOVE-STATE');
      } else {
        // Add newValue
        this.setState({
          selectedStates: [...priorValues, newValue],
        });
        // And finally, end by resetting all filters in FilterBase with the updated set
        selectedFilters.push(newValue);
        // console.log('onSelectedStatesChange, ADD new selectedFilters:', selectedFilters);
        this.props.updateSelectedFilters(selectedFilters);
        this.props.forceChangeTrigger('ADD-STATE');
      }
    }
  };

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('SettingsAddBallotItemsFilter caught error: ', `${error} with info: `, info);
  }

  render () {
    renderLog('SettingsAddBallotItemsFilter');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, showAllFilters, selectedFilters } = this.props;
    const { selectedStates } = this.state;

    // console.log('selectedStates:', selectedStates);
    // console.log('stateCodeMap:', stateCodeMap);
    const stateNameList = Object.values(stateCodeMap);
    // console.log('stateNameList:', stateNameList);
    let stateAlreadySelected = false;
    let tempStateCode = '';
    let tempStateName = '';
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
          <FilterColumn>
            <b>State(s)</b>
            <FormControlLabel
              classes={{ label: classes.formControlLabel }}
              control={(
                <Select
                  multiple
                  value={selectedStates}
                  onChange={this.onSelectedStatesChange}
                  input={<Input id="select-multiple-chip" />}
                  renderValue={() => (
                    <div className={classes.chips}>
                      {selectedStates.map((thisStateCode) => {
                        tempStateName = convertStateCodeToStateText(thisStateCode);
                        // console.log('thisStateCode:', thisStateCode, ', tempStateName:', tempStateName);
                        return <Chip key={thisStateCode} label={tempStateName} className={classes.chip} component="div" />;
                      })}
                    </div>
                  )}
                  MenuProps={MenuProps}
                >
                  {stateNameList.map((stateName) => {
                    tempStateCode = convertStateTextToStateCode(stateName);
                    stateAlreadySelected = arrayContains(tempStateCode, selectedStates);
                    // console.log('tempStateCode:', tempStateCode, ', stateAlreadySelected:', stateAlreadySelected);
                    return (
                      <MenuItem key={tempStateCode} value={tempStateCode}>
                        {stateAlreadySelected ? <strong>{stateName}</strong> : <span>{stateName}</span>}
                      </MenuItem>
                    );
                  })}
                </Select>
              )}
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
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
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
