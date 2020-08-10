import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Chip, FormControlLabel, Input, MenuItem, Select } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { arrayContains, removeValueFromArray } from '../../utils/textFormat';
import { convertStateCodeToStateText, convertStateTextToStateCode, stateCodeMap } from '../../utils/address-functions';
import BallotActions from '../../actions/BallotActions';
import BallotStore from '../../stores/BallotStore';
import { renderLog } from '../../utils/logging';
import { isSpeakerTypeIndividual, isSpeakerTypeOrganization, isSpeakerTypePublicFigure } from '../../utils/organization-functions';

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


class OpinionsAndBallotItemsFilter extends Component {
  static propTypes = {
    // Passed in through FilterBase
    allItems: PropTypes.array,
    classes: PropTypes.object,
    changeTrigger: PropTypes.string,
    forceChangeTrigger: PropTypes.func,
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

  componentDidUpdate (prevProps, prevState) {
    // console.log('OpinionsAndBallotItemsFilter componentDidUpdate');
    // console.log('prevProps.selectedFilters:', prevProps.selectedFilters, ', this.props.selectedFilters:', this.props.selectedFilters);
    // console.log('prevProps.selectedFilters-stringify:', JSON.stringify(prevProps.selectedFilters), ', this.props.selectedFilters-stringify:', JSON.stringify(this.props.selectedFilters));
    if (JSON.stringify(prevProps.selectedFilters) !== JSON.stringify(this.props.selectedFilters)) {
      // console.log('+++OpinionsAndBallotItemsFilter componentDidUpdate, change to selectedFilters');
      const newFilteredItems = this.getNewFilteredItems();
      this.props.onFilteredItemsChange(newFilteredItems, this.props.selectedFilters);
    } else if ((prevState.allBallotItemsLastStateCodeReceived !== this.state.allBallotItemsLastStateCodeReceived) || (prevProps.changeTrigger !== this.props.changeTrigger)) {
      // console.log('+++componentDidUpdate, change to allBallotItemsLastStateCodeReceived:', this.state.allBallotItemsLastStateCodeReceived, ', or changeTrigger:', this.props.changeTrigger);
      const newFilteredItems = this.getNewFilteredItems();
      this.props.onFilteredItemsChange(newFilteredItems, this.props.selectedFilters);
      this.props.forceChangeTrigger(this.state.allBallotItemsLastStateCodeReceived);
    } else {
      // console.log('---OpinionsAndBallotItemsFilter componentDidUpdate, no change to selectedFilters');
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

  orderByAlphabetical = (firstEntry, secondEntry) => {
    let firstEntryName;
    let secondEntryName = 'x';
    if (firstEntry && firstEntry.voter_guide_display_name) {
      firstEntryName = firstEntry.voter_guide_display_name;
    } else if (firstEntry && firstEntry.ballot_item_display_name) {
      firstEntryName = firstEntry.ballot_item_display_name;
    }
    if (secondEntry && secondEntry.voter_guide_display_name) {
      secondEntryName = secondEntry.voter_guide_display_name;
    } else if (secondEntry && secondEntry.ballot_item_display_name) {
      secondEntryName = secondEntry.ballot_item_display_name;
    }
    if (firstEntryName < secondEntryName) { return -1; }
    if (firstEntryName > secondEntryName) { return 1; }
    return 0;
  };

  // orderByTwitterFollowers = (firstGuide, secondGuide) => secondGuide.twitter_followers_count - firstGuide.twitter_followers_count;
  //
  // orderByWrittenComment = (firstGuide, secondGuide) => {
  //   const secondGuideHasStatement = secondGuide && secondGuide.statement_text && secondGuide.statement_text.length ? 1 : 0;
  //   const firstGuideHasStatement = firstGuide && firstGuide.statement_text && firstGuide.statement_text.length ? 1 : 0;
  //   return secondGuideHasStatement - firstGuideHasStatement;
  // };

  getNewFilteredItems = () => {
    const { allItems } = this.props;
    const { selectedFilters } = this.props;
    if (!selectedFilters || !selectedFilters.length) {
      // selectedFilters = ['sortByAlphabetical'];
      // this.toggleFilter('sortByAlphabetical');
      // console.log('Exiting getNewFilteredItems (1)');
      // return [];
    }
    let filteredItems = allItems; // Start with all items

    // // Remove all Candidates
    // const filterItemsSnapshot = filteredItems;
    // filteredItems = [];
    // filteredItems = [...filteredItems, ...filterItemsSnapshot.filter(item => item.kind_of_ballot_item !== 'CANDIDATE')];
    //
    // // Remove states that aren't in the selectedFilters?
    // const stateCodeList = Object.keys(stateCodeMap);
    // const stateCodesSelected = ['na', ''];
    // selectedFilters.forEach((filter) => {
    //   if (arrayContains(filter, stateCodeList)) {
    //     stateCodesSelected.push(filter.toLowerCase());
    //   }
    // });
    // console.log('stateCodesSelected:', stateCodesSelected);
    // console.log('filteredItems:', filteredItems);
    // Only show item if from the state we are looking at
    // if (stateCodesSelected.length) {
    //   filterItemsSnapshot = filteredItems;
    //   filteredItems = [];
    //   filteredItems = [...filteredItems, ...filterItemsSnapshot.filter(item => arrayContains(item.state_code, stateCodesSelected))];
    // }

    let containsOrgPublicFigureOrCandidateFilter = false;
    selectedFilters.forEach((filter) => {
      switch (filter) {
        case 'showBallotItemsFilter':
        case 'showOrganizationsFilter':
        case 'showPublicFiguresFilter':
          containsOrgPublicFigureOrCandidateFilter = true;
          break;
        default:
          break;
      }
    });
    if (containsOrgPublicFigureOrCandidateFilter) {
      const filterItemsOrgPublicFigureOrCandidateSnapshot = filteredItems;
      filteredItems = [];
      selectedFilters.forEach((filter) => {
        switch (filter) {
          case 'showBallotItemsFilter':
            filteredItems = [...filteredItems, ...filterItemsOrgPublicFigureOrCandidateSnapshot.filter((item) => {
              if (item.kind_of_ballot_item) {
                return true;
              }
              return false;
            })];
            break;
          case 'showOrganizationsFilter':
            filteredItems = [...filteredItems, ...filterItemsOrgPublicFigureOrCandidateSnapshot.filter((item) => {
              if (item.voter_guide_owner_type) {
                if (isSpeakerTypeOrganization(item.voter_guide_owner_type)) {
                  return true;
                }
              }
              return false;
            })];
            break;
          case 'showPublicFiguresFilter':
            filteredItems = [...filteredItems, ...filterItemsOrgPublicFigureOrCandidateSnapshot.filter((item) => {
              if (item.voter_guide_owner_type) {
                if (isSpeakerTypeIndividual(item.voter_guide_owner_type)) {
                  return true;
                } else if (isSpeakerTypePublicFigure(item.voter_guide_owner_type)) {
                  return true;
                }
              }
              return false;
            })];
            break;
          default:
            break;
        }
      });
    }
    // Sort Order
    selectedFilters.forEach((filter) => {
      switch (filter) {
        default:
        case 'sortByAlphabetical':
          filteredItems = filteredItems.sort(this.orderByAlphabetical);
          break;
      }
    });

    // TURNED OFF: Make sure each item in the filteredItems is unique (by we_vote_id)
    // return uniqBy(filteredItems, x => x.we_vote_id);

    // We no longer filter for a unique we_vote_id because we sometimes pass items into this routine that don't have a we_vote_id
    // console.log('filteredItems:', filteredItems);
    return filteredItems;
  };

  removeTheseFilters = (filterListToRemove) => {
    // Remove the items in filterList that are currently in selectedFilters
    // console.log('OpinionsAndBallotItemsFilter, removeTheseFilters filterListToRemove:', filterListToRemove);
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
    console.error('OpinionsAndBallotItemsFilter caught error: ', `${error} with info: `, info);
  }

  render () {
    renderLog('OpinionsAndBallotItemsFilter');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, showAllFilters, selectedFilters } = this.props;
    const { selectedStates } = this.state;
    // console.log('OpinionsAndBallotItemsFilter render')
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
            <b>Sort By</b>
            <SortByContainer>
              <SortBy selected={selectedFilters.indexOf('sortByAlphabetical') > -1} onClick={() => this.selectSortByFilter('sortByAlphabetical')}>Alphabetical</SortBy>
            </SortByContainer>
          </FilterColumn>
          <FilterColumn>
            <b>Add State(s)</b>
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

const FilterColumn = styled.div`
  display: flex;
  flex-flow: column;
  margin-right: 2rem;
`;

const FilterRow = styled.div`
  display: flex;
  flex-flow: row;
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

const SortByContainer = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
`;

const Wrapper = styled.div`
  display: ${({ showAllFilters }) => (showAllFilters ? 'flex' : 'none')};
  flex-flow: column;
  padding-top: 1rem;
`;

export default withStyles(styles)(OpinionsAndBallotItemsFilter);
