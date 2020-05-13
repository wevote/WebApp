import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import BallotIcon from '@material-ui/icons/Ballot';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import AppActions from '../../actions/AppActions';
import BallotItemForAddPositions from './BallotItemForAddPositions';
import BallotActions from '../../actions/BallotActions';
import BallotStore from '../../stores/BallotStore';
import { renderLog } from '../../utils/logging';
import FilterBase from '../Filter/FilterBase';
import { historyPush } from '../../utils/cordovaUtils';
import LoadingWheel from '../LoadingWheel';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import SettingsAddBallotItemsFilter from '../Filter/SettingsAddBallotItemsFilter';
import SettingsSeePositionsFilter from '../Filter/SettingsSeePositionsFilter';
import ShowMoreItems from '../Widgets/ShowMoreItems';
import { isProperlyFormattedVoterGuideWeVoteId } from '../../utils/textFormat';
import VoterStore from '../../stores/VoterStore';
import VoterGuideStore from '../../stores/VoterGuideStore';


const groupedFilters = [
  {
    filterName: 'showFederalRaceFilter',
    filterDisplayName: 'Federal',
    filterId: 'federalRaceFilter',  // thumbUpFilter
  },
  {
    filterName: 'showStateRaceFilter',
    filterDisplayName: 'State',
    filterId: 'stateRaceFilter',
  },
  {
    filterName: 'showMeasureRaceFilter',
    filterDisplayName: 'Measure',
    filterId: 'measureRaceFilter',
  },
  {
    filterName: 'showLocalRaceFilter',
    filterDisplayName: 'Local',
    filterId: 'localRaceFilter',
  },
];

const islandFilters = [
  // {
  //   filterName: 'showCommentFilter',
  //   icon: <CommentIcon />,
  //   filterDisplayName: 'Commented',
  //   filterId: 'islandFilterCommented',
  // },
];

class VoterGuideSettingsAddPositions extends Component {
  static propTypes = {
    addNewPositionsMode: PropTypes.bool,
    classes: PropTypes.object,
    voterGuideWeVoteId: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      addNewPositionsMode: true,
      allBallotItems: [],
      ballotSearchResults: [],
      currentSelectedBallotFilters: [], // So we know when the ballot filters change
      currentSelectedPositionFilters: [], // So we know when the position filters change
      filteredBallotItems: [],
      filteredPositionListForOneElection: [],
      isSearching: false,
      loadingMoreBallotItems: false,
      loadingMorePositionItems: false,
      localAllBallotItemsHaveBeenRetrieved: {},
      localPositionListHasBeenRetrieved: {},
      numberOfBallotItemsToDisplay: 5,
      numberOfPositionItemsToDisplay: 5,
      positionListForOneElection: [],
      positionSearchResults: [],
      searchText: '',
      stateCodeFromIpAddress: '',
      stateCodeFromVoterGuide: '',
      stateCodeToRetrieve: '',
      totalNumberOfBallotItems: 0,
      totalNumberOfBallotSearchResults: 0,
      totalNumberOfPositionItems: 0,
      totalNumberOfPositionSearchResults: 0,
    };
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount () {
    // console.log('componentDidMount addNewPositionsMode:', this.props.addNewPositionsMode, ', this.props.voterGuideWeVoteId:', this.props.voterGuideWeVoteId);
    this.setState({
      addNewPositionsMode: this.props.addNewPositionsMode,
      voterGuideWeVoteId: this.props.voterGuideWeVoteId,
    });
    let voterGuide;
    if (this.props.voterGuideWeVoteId && isProperlyFormattedVoterGuideWeVoteId(this.props.voterGuideWeVoteId)) {
      voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(this.props.voterGuideWeVoteId);
      if (voterGuide && voterGuide.we_vote_id) {
        this.setState({
          localGoogleCivicElectionId: parseInt(voterGuide.google_civic_election_id, 10),
          voterGuide,
        });
      }
    }
    this.onBallotStoreChange();
    this.onVoterStoreChange();
    this.onOrganizationStoreChange();
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));

    window.addEventListener('scroll', this.onScroll);
  }

  componentWillReceiveProps (nextProps) {
    // console.log('componentWillReceiveProps addNewPositionsMode:', nextProps.addNewPositionsMode, ', nextProps.voterGuideWeVoteId:', nextProps.voterGuideWeVoteId);
    this.setState({
      addNewPositionsMode: nextProps.addNewPositionsMode,
      voterGuideWeVoteId: nextProps.voterGuideWeVoteId,
    });
    let voterGuide;
    if (nextProps.voterGuideWeVoteId && isProperlyFormattedVoterGuideWeVoteId(nextProps.voterGuideWeVoteId)) {
      voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(nextProps.voterGuideWeVoteId);
      // console.log('componentWillReceiveProps voterGuide.google_civic_election_id:', voterGuide.google_civic_election_id);
      if (voterGuide && voterGuide.we_vote_id) {
        this.setState({
          localGoogleCivicElectionId: parseInt(voterGuide.google_civic_election_id, 10),
          voterGuide,
        });
      }
    }
    this.onBallotStoreChange();
    this.onVoterStoreChange();
    this.onOrganizationStoreChange();
  }

  componentDidUpdate (prevProps, prevState) {
    // console.log('VoterGuideSettingsAddPositions componentDidUpdate');
    // Whenever a voter goes from "Add Endorsements" to "Endorsed or Opposed" we want to refresh the position list
    const { addNewPositionsMode, currentSelectedBallotFilters, currentSelectedPositionFilters } = this.state;
    const { stateCodeToRetrieve } = this.state;
    const { addNewPositionsMode: previousAddNewPositionsMode, currentSelectedBallotFilters: previousSelectedBallotFilters, currentSelectedPositionFilters: previousSelectedPositionFilters } = prevState;
    // console.log('componentDidUpdate addNewPositionsMode:', addNewPositionsMode, ', previousAddNewPositionsMode:', previousAddNewPositionsMode);
    // If previously we were in addNewPositionsMode, and now we are NOT, update the positionListForOpinionMaker
    const { localAllBallotItemsHaveBeenRetrieved, voterGuide } = this.state;
    if (previousAddNewPositionsMode && !addNewPositionsMode) {
      // console.log('We should retrieve positionListForOpinionMaker');
      const { linkedOrganizationWeVoteId } = this.state;
      const organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
      if (voterGuide && voterGuide.google_civic_election_id && organization && organization.organization_we_vote_id) {
        // console.log('componentDidUpdate we have what we need');
        OrganizationActions.positionListForOpinionMaker(organization.organization_we_vote_id, false, true, voterGuide.google_civic_election_id);
        OrganizationActions.positionListForOpinionMaker(organization.organization_we_vote_id, true, false, voterGuide.google_civic_election_id);
      }
    }
    // If the position filters have changed, reset the numberOfPositionItemsToDisplay
    if (currentSelectedPositionFilters && previousSelectedPositionFilters) {
      if (JSON.stringify(currentSelectedPositionFilters) !== JSON.stringify(previousSelectedPositionFilters)) {
        this.setState({
          numberOfPositionItemsToDisplay: 5,
        });
      }
    }
    // If the ballot filters have changed, reset the numberOfBallotItemsToDisplay
    if (currentSelectedBallotFilters && previousSelectedBallotFilters) {
      if (JSON.stringify(currentSelectedBallotFilters) !== JSON.stringify(previousSelectedBallotFilters)) {
        this.setState({
          numberOfBallotItemsToDisplay: 5,
        });
      }
    }
    // console.log('componentDidUpdate stateCodeToRetrieve:', stateCodeToRetrieve);
    if (voterGuide && voterGuide.google_civic_election_id && stateCodeToRetrieve) {
      if (!localAllBallotItemsHaveBeenRetrieved[voterGuide.google_civic_election_id]) {
        localAllBallotItemsHaveBeenRetrieved[voterGuide.google_civic_election_id] = {};
      }
      if (!localAllBallotItemsHaveBeenRetrieved[voterGuide.google_civic_election_id][stateCodeToRetrieve]) {
        localAllBallotItemsHaveBeenRetrieved[voterGuide.google_civic_election_id][stateCodeToRetrieve] = false;
      }
      const doNotRetrieveAllBallotItems = localAllBallotItemsHaveBeenRetrieved[voterGuide.google_civic_election_id][stateCodeToRetrieve] || BallotStore.allBallotItemsHaveBeenRetrievedForElection(voterGuide.google_civic_election_id, stateCodeToRetrieve);
      if (!doNotRetrieveAllBallotItems) {
        localAllBallotItemsHaveBeenRetrieved[voterGuide.google_civic_election_id][stateCodeToRetrieve] = true;
        this.setState({
          localAllBallotItemsHaveBeenRetrieved,
        });
        // console.log('componentDidUpdate BallotActions.allBallotItemsRetrieve:', voterGuide.google_civic_election_id, stateCodeToRetrieve);
        BallotActions.allBallotItemsRetrieve(voterGuide.google_civic_election_id, stateCodeToRetrieve);
      }
    }
  }

  // NOTE FROM DALE 2019-08-12 shouldComponentUpdate gets in the way of the filtering system
  // shouldComponentUpdate (nextProps, nextState) {
  // }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.voterStoreListener.remove();
    if (this.ballotItemTimer) {
      clearTimeout(this.ballotItemTimer);
      this.ballotItemTimer = null;
    }
    if (this.positionItemTimer) {
      clearTimeout(this.positionItemTimer);
      this.positionItemTimer = null;
    }
    window.removeEventListener('scroll', this.onScroll);
  }

  onBallotStoreChange () {
    const { localGoogleCivicElectionId } = this.state;
    const allBallotItemsFlattened = BallotStore.getAllBallotItemsFlattened(localGoogleCivicElectionId);
    // console.log('VoterGuideSettingsAddPositions, onBallotStoreChange allBallotItemsFlattened:', allBallotItemsFlattened);
    this.setState({
      allBallotItems: allBallotItemsFlattened,
      filteredBallotItems: allBallotItemsFlattened,
      totalNumberOfBallotItems: allBallotItemsFlattened.length,
    });
  }

  onOrganizationStoreChange () {
    const { linkedOrganizationWeVoteId, localAllBallotItemsHaveBeenRetrieved, localPositionListHasBeenRetrieved, stateCodeFromVoterGuide, voterGuide } = this.state;
    let { stateCodeFromIpAddress } = this.state;
    // console.log('onOrganizationStoreChange, linkedOrganizationWeVoteId: ', linkedOrganizationWeVoteId);
    if (!linkedOrganizationWeVoteId) {
      const voter = VoterStore.getVoter();
      // console.log('onOrganizationStoreChange, voter: ', voter);
      if (voter && voter.we_vote_id) {
        const newLinkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
        // console.log('onOrganizationStoreChange, newLinkedOrganizationWeVoteId: ', newLinkedOrganizationWeVoteId);
        if (newLinkedOrganizationWeVoteId) {
          this.setState({
            linkedOrganizationWeVoteId: newLinkedOrganizationWeVoteId,
          });
          OrganizationActions.organizationRetrieve(newLinkedOrganizationWeVoteId);
        }
      }
      if (voter && voter.state_code_from_ip_address) {
        stateCodeFromIpAddress = voter.state_code_from_ip_address;
        if (stateCodeFromIpAddress) {
          this.setState({
            stateCodeFromIpAddress,
          });
        }
      }
    } else {
      const organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
      let totalNumberOfPositionItems = 0;
      if (organization && organization.position_list_for_one_election) {
        totalNumberOfPositionItems = organization.position_list_for_one_election.length;
      }
      this.setState({
        positionListForOneElection: organization.position_list_for_one_election,
        filteredPositionListForOneElection: organization.position_list_for_one_election,
        totalNumberOfPositionItems,
      });
      // Positions for this organization, for this election
      // console.log('onOrganizationStoreChange, voterGuide: ', voterGuide, ', organization:', organization);
      if (voterGuide && voterGuide.google_civic_election_id && organization && organization.organization_we_vote_id) {
        const doNotRetrievePositionList = localPositionListHasBeenRetrieved[voterGuide.google_civic_election_id] || OrganizationStore.positionListForOpinionMakerHasBeenRetrievedOnce(voterGuide.google_civic_election_id, organization.organization_we_vote_id);
        if (!doNotRetrievePositionList) {
          // console.log('CALLING positionListForOpinionMaker');
          localPositionListHasBeenRetrieved[voterGuide.google_civic_election_id] = true;
          this.setState({
            localPositionListHasBeenRetrieved,
          });
          OrganizationActions.positionListForOpinionMaker(organization.organization_we_vote_id, false, true, voterGuide.google_civic_election_id);
          OrganizationActions.positionListForOpinionMaker(organization.organization_we_vote_id, true, false, voterGuide.google_civic_election_id);
        }
      }
    }
    // console.log('VoterGuideSettingsAddPositions onOrganizationStoreChange voterGuide:', voterGuide);
    let stateCodeToRetrieve = '';
    if (stateCodeFromVoterGuide) {
      stateCodeToRetrieve = stateCodeFromVoterGuide.toLowerCase();
    }
    if (!stateCodeToRetrieve && stateCodeFromIpAddress) {
      stateCodeToRetrieve = stateCodeFromIpAddress.toLowerCase();
    }
    if (stateCodeToRetrieve) {
      this.setState({
        stateCodeToRetrieve,
      });
    }
    // console.log('onOrganizationStoreChange stateCodeToRetrieve:', stateCodeToRetrieve);
    if (voterGuide && voterGuide.google_civic_election_id && stateCodeToRetrieve) {
      if (!localAllBallotItemsHaveBeenRetrieved[voterGuide.google_civic_election_id]) {
        localAllBallotItemsHaveBeenRetrieved[voterGuide.google_civic_election_id] = {};
      }
      if (!localAllBallotItemsHaveBeenRetrieved[voterGuide.google_civic_election_id][stateCodeToRetrieve]) {
        localAllBallotItemsHaveBeenRetrieved[voterGuide.google_civic_election_id][stateCodeToRetrieve] = false;
      }
      const doNotRetrieveAllBallotItems = localAllBallotItemsHaveBeenRetrieved[voterGuide.google_civic_election_id][stateCodeToRetrieve] || BallotStore.allBallotItemsHaveBeenRetrievedForElection(voterGuide.google_civic_election_id, stateCodeToRetrieve);
      if (!doNotRetrieveAllBallotItems) {
        localAllBallotItemsHaveBeenRetrieved[voterGuide.google_civic_election_id][stateCodeToRetrieve] = true;
        this.setState({
          localAllBallotItemsHaveBeenRetrieved,
        });
        BallotActions.allBallotItemsRetrieve(voterGuide.google_civic_election_id, stateCodeToRetrieve);
      }
    }
    if (voterGuide && voterGuide.google_civic_election_id) {
      this.setState({
        localGoogleCivicElectionId: parseInt(voterGuide.google_civic_election_id, 10),
      });
    }
  }

  onVoterGuideStoreChange () {
    // console.log('VoterGuideSettingsAddPositions onVoterGuideStoreChange');
    if (this.state.voterGuideWeVoteId && isProperlyFormattedVoterGuideWeVoteId(this.state.voterGuideWeVoteId)) {
      const voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(this.state.voterGuideWeVoteId);
      if (voterGuide && voterGuide.we_vote_id) {
        this.setState({
          voterGuide,
        });
      }
      if (voterGuide && voterGuide.google_civic_election_id) {
        this.setState({
          localGoogleCivicElectionId: parseInt(voterGuide.google_civic_election_id, 10),
        });
      }
      if (voterGuide && voterGuide.state_code) {
        const stateCodeFromVoterGuide = voterGuide.state_code;
        this.setState({
          stateCodeFromVoterGuide,
        });
      }
    }
  }

  onVoterStoreChange () {
    // Get Voter and Voter's Organization
    const voter = VoterStore.getVoter();
    let linkedOrganizationWeVoteId;
    // console.log('onVoterStoreChange, voter:', voter);
    if (voter && voter.we_vote_id) {
      linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
      if (linkedOrganizationWeVoteId) {
        this.setState({
          linkedOrganizationWeVoteId,
        });
        const organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
        if (organization && organization.organization_we_vote_id) {
          this.onOrganizationStoreChange();
        } else {
          OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
          // if (voterGuide && voterGuide.google_civic_election_id) {
          // OrganizationActions.positionListForOpinionMaker(linkedOrganizationWeVoteId, true, false); // , voterGuide.google_civic_election_id
          // }
        }
      }
    }
    if (voter && voter.state_code_from_ip_address) {
      const stateCodeFromIpAddress = voter.state_code_from_ip_address;
      if (stateCodeFromIpAddress) {
        this.setState({
          stateCodeFromIpAddress,
        });
      }
    }
    // console.log('onVoterStoreChange, linkedOrganizationWeVoteId: ', linkedOrganizationWeVoteId);
  }

  onScroll () {
    const showMoreItemsElement =  document.querySelector('#showMoreItemsId');
    // console.log('showMoreItemsElement: ', showMoreItemsElement);
    // console.log('loadingMoreBallotItems: ', this.state.loadingMoreBallotItems);
    // console.log('loadingMorePositionItems: ', this.state.loadingMorePositionItems);
    if (showMoreItemsElement) {
      const {
        numberOfBallotItemsToDisplay, totalNumberOfBallotItems,
        numberOfPositionItemsToDisplay, totalNumberOfPositionItems,
      } = this.state;

      // console.log('window.height: ', window.innerHeight);
      // console.log('Window Scroll: ', window.scrollY);
      // console.log('Bottom: ', showMoreItemsElement.getBoundingClientRect().bottom);
      // console.log('numberOfBallotItemsToDisplay: ', numberOfBallotItemsToDisplay);
      // console.log('totalNumberOfBallotItems: ', totalNumberOfBallotItems);
      // console.log('numberOfPositionItemsToDisplay: ', numberOfPositionItemsToDisplay);
      // console.log('totalNumberOfPositionItems: ', totalNumberOfPositionItems);
      if (numberOfBallotItemsToDisplay < totalNumberOfBallotItems) {
        if (showMoreItemsElement.getBoundingClientRect().bottom <= window.innerHeight) {
          this.setState({ loadingMoreBallotItems: true });
          this.increaseNumberOfBallotItemsToDisplay();
        }
      } else {
        this.setState({ loadingMoreBallotItems: false });
      }

      if (numberOfPositionItemsToDisplay < totalNumberOfPositionItems) {
        if (showMoreItemsElement.getBoundingClientRect().bottom <= window.innerHeight) {
          this.setState({ loadingMorePositionItems: true });
          this.increaseNumberOfPositionItemsToDisplay();
        }
      } else {
        this.setState({ loadingMorePositionItems: false });
      }
    }
  }

  goToVoterGuideDisplay = () => {
    let voterGuideDisplay = '/ballot';
    if (this.state.voterGuide) {
      voterGuideDisplay = `/voterguide/${this.state.voterGuide.organization_we_vote_id}/ballot/election/${this.state.voterGuide.google_civic_election_id}/positions`;
    }
    historyPush(voterGuideDisplay);
  }

  onFilteredItemsChangeFromBallotItemsFilterBase = (filteredBallotItems, currentSelectedBallotFilters) => {
    // console.log('onFilteredItemsChangeFromBallotItemsFilterBase, filteredBallotItems: ', filteredBallotItems);
    this.setState({
      currentSelectedBallotFilters,
      filteredBallotItems,
      isSearching: false,
    });
  }

  onFilteredItemsChangeFromPositionItemsFilterBase = (filteredPositionListForOneElection, currentSelectedPositionFilters) => {
    // console.log('onFilteredItemsChangeFromPositionItemsFilterBase, currentSelectedPositionFilters: ', currentSelectedPositionFilters);
    this.setState({ currentSelectedPositionFilters, filteredPositionListForOneElection });
  }

  onBallotSearch = (searchText, filteredItems) => {
    window.scrollTo(0, 0);
    const totalNumberOfBallotSearchResults = filteredItems.length || 0;
    this.setState({
      ballotSearchResults: filteredItems,
      searchText,
      totalNumberOfBallotSearchResults,
    });
  };

  onPositionSearch = (searchText, filteredItems) => {
    window.scrollTo(0, 0);
    const totalNumberOfPositionSearchResults = filteredItems.length || 0;
    this.setState({
      positionSearchResults: filteredItems,
      searchText,
      totalNumberOfPositionSearchResults,
    });
  };

  handleToggleSearchBallot = (isSearching) => {
    // console.log('VoterGuideSettingsAddPositions handleToggleSearchBallot isSearching:', isSearching);
    // const { ballotWithItemsFromCompletionFilterType } = this.state;
    // let totalNumberOfBallotItems;
    this.setState({
      isSearching: !isSearching,
    });
  };

  increaseNumberOfBallotItemsToDisplay = () => {
    let { numberOfBallotItemsToDisplay } = this.state;
    // console.log('Number of ballot items before increment: ', numberOfBallotItemsToDisplay);

    numberOfBallotItemsToDisplay += 5;
    // console.log('Number of ballot items after increment: ', numberOfBallotItemsToDisplay);

    this.ballotItemTimer = setTimeout(() => {
      this.setState({
        numberOfBallotItemsToDisplay,
      });
    }, 500);
  }

  increaseNumberOfPositionItemsToDisplay = () => {
    let { numberOfPositionItemsToDisplay } = this.state;
    // console.log('Number of position items before increment: ', numberOfPositionItemsToDisplay);

    numberOfPositionItemsToDisplay += 5;
    // console.log('Number of position items after increment: ', numberOfPositionItemsToDisplay);

    this.positionItemTimer = setTimeout(() => {
      this.setState({
        numberOfPositionItemsToDisplay,
      });
    }, 500);
  }

  goToDifferentVoterGuideSettingsDashboardTab (dashboardEditMode = '') {
    AppActions.setVoterGuideSettingsDashboardEditMode(dashboardEditMode);
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('VoterGuideSettingsAddPositions caught error: ', `${error} with info: `, info);
  }

  render () {
    renderLog('VoterGuideSettingsAddPositions');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { addNewPositionsMode, isSearching, loadingMoreBallotItems, loadingMorePositionItems, localGoogleCivicElectionId, searchText, stateCodeToRetrieve } = this.state;
    // console.log('VoterGuideSettingsAddPositions render');
    if (!addNewPositionsMode) {
      // ////////////////////////
      // Current Positions - First Tab
      const selectedFiltersCurrentDefault = [];
      const { filteredPositionListForOneElection, numberOfPositionItemsToDisplay, positionListForOneElection, positionSearchResults, totalNumberOfPositionSearchResults } = this.state;
      // console.log('VoterGuideSettingsAddPositions render, filteredPositionListForOneElection:', filteredPositionListForOneElection);
      const atLeastOnePositionFoundWithTheseFilters = positionListForOneElection && positionListForOneElection.length !== 0;
      let numberOfPositionItemsDisplayed = 0;
      let totalNumberOfPositionItems = 0;
      if (atLeastOnePositionFoundWithTheseFilters) {
        totalNumberOfPositionItems = positionListForOneElection.length;
      }
      if (!atLeastOnePositionFoundWithTheseFilters) {
        return (
          <div className="container">
            <Card>
              <EmptyBallotMessageContainer>
                <BallotIcon classes={{ root: classes.ballotIconRoot }} />
                <EmptyBallotText>You haven&apos;t endorsed any candidates or measures yet. Click &quot;Add Endorsements&quot; to help people who trust you make better voting decisions.</EmptyBallotText>
                <Button
                  classes={{ root: classes.ballotButtonRoot }}
                  color="primary"
                  variant="contained"
                  onClick={() => this.goToDifferentVoterGuideSettingsDashboardTab('addpositions')}
                >
                  <BallotIcon classes={{ root: classes.ballotButtonIconRoot }} />
                  Add Endorsements
                </Button>
              </EmptyBallotMessageContainer>
            </Card>
          </div>
        );
      }
      // const { classes } = this.props;
      // console.log('filteredPositionListForOneElection: ', filteredPositionListForOneElection);
      let ballotItemDisplayNameForPosition;
      let ballotItemWeVoteIdForPosition;
      let candidateListForPosition;
      let kindOfBallotItemForPosition;
      return (
        <div className="container">
          <FilterBase
            allItems={positionListForOneElection}
            groupedFilters={groupedFilters}
            islandFilters={islandFilters}
            key="currentPositionsFilterBase"
            onFilteredItemsChange={this.onFilteredItemsChangeFromPositionItemsFilterBase}
            onSearch={this.onPositionSearch}
            onToggleSearch={this.handleToggleSearchBallot}
            selectedFiltersDefault={selectedFiltersCurrentDefault}
            totalNumberOfItemsFound={totalNumberOfPositionItems}
          >
            {/* props get added to this component in FilterBase */}
            <SettingsSeePositionsFilter />
          </FilterBase>
          {((!isSearching && atLeastOnePositionFoundWithTheseFilters && filteredPositionListForOneElection && filteredPositionListForOneElection.length) || (isSearching && positionSearchResults && positionSearchResults.length)) ? (
            <div>
              <CardChildListGroup className="card-child__list-group">
                {(isSearching ? positionSearchResults : filteredPositionListForOneElection).map((onePosition) => {
                  // console.log('onePosition:', onePosition);
                  ballotItemDisplayNameForPosition = (onePosition.kind_of_ballot_item === 'CANDIDATE') ? onePosition.contest_office_name : onePosition.ballot_item_display_name;
                  ballotItemWeVoteIdForPosition = (onePosition.kind_of_ballot_item === 'CANDIDATE') ? onePosition.contest_office_we_vote_id : onePosition.ballot_item_we_vote_id;
                  if (!ballotItemDisplayNameForPosition || !ballotItemWeVoteIdForPosition) {
                    return null;
                  }
                  if (numberOfPositionItemsDisplayed >= numberOfPositionItemsToDisplay) {
                    return null;
                  }
                  numberOfPositionItemsDisplayed += 1;
                  if (onePosition.kind_of_ballot_item === 'CANDIDATE') {
                    // We create a simulated candidateList from the positionList
                    candidateListForPosition = [{
                      ballot_item_display_name: onePosition.ballot_item_display_name,
                      candidate_photo_url_large: onePosition.ballot_item_image_url_https_large,
                      candidate_photo_url_medium: onePosition.ballot_item_image_url_https_medium,
                      candidate_photo_url_tiny: onePosition.ballot_item_image_url_https_tiny,
                      contest_office_id: onePosition.contest_office_id,
                      contest_office_name: onePosition.contest_office_name,
                      contest_office_we_vote_id: onePosition.contest_office_we_vote_id,
                      google_civic_election_id: onePosition.google_civic_election_id,
                      is_oppose: onePosition.is_oppose,
                      is_support: onePosition.is_support,
                      kind_of_ballot_item: onePosition.kind_of_ballot_item,
                      party: onePosition.ballot_item_political_party,
                      state_code: onePosition.state_code,
                      twitter_followers_count: onePosition.twitter_followers_count,
                      we_vote_id: onePosition.ballot_item_we_vote_id,
                    }];
                  } else {
                    candidateListForPosition = [];
                  }
                  kindOfBallotItemForPosition = (onePosition.kind_of_ballot_item === 'CANDIDATE') ? 'OFFICE' : 'MEASURE';
                  // console.log('kindOfBallotItemForPosition:', kindOfBallotItemForPosition, ', ballotItemWeVoteIdForPosition:', ballotItemWeVoteIdForPosition, ', ballotItemDisplayNameForPosition:', ballotItemDisplayNameForPosition);
                  return (
                    <BallotItemForAddPositions
                      key={`currentPositionKey-${ballotItemWeVoteIdForPosition}-${onePosition.position_we_vote_id}`}
                      allBallotItemsCount={2}
                      ballotItemDisplayName={ballotItemDisplayNameForPosition}
                      ballotItemWeVoteId={ballotItemWeVoteIdForPosition}
                      candidateList={candidateListForPosition}
                      kindOfBallotItem={kindOfBallotItemForPosition}
                      externalUniqueId={`currentPositionKey-${ballotItemWeVoteIdForPosition}-${onePosition.position_we_vote_id}`}
                    />
                  );
                })
                }
              </CardChildListGroup>
              <ShowMoreItemsWrapper id="showMoreItemsId" onClick={this.increaseNumberOfPositionItemsToDisplay}>
                <ShowMoreItems
                  loadingMoreItemsNow={loadingMorePositionItems}
                  numberOfItemsDisplayed={numberOfPositionItemsDisplayed}
                  numberOfItemsTotal={isSearching ? totalNumberOfPositionSearchResults : totalNumberOfPositionItems}
                />
              </ShowMoreItemsWrapper>
              <LoadingItemsWheel>
                {loadingMorePositionItems ? (
                  <CircularProgress />
                ) : null}
              </LoadingItemsWheel>
            </div>
          ) : (
            <Card>
              <EmptyBallotMessageContainer>
                <BallotIcon classes={{ root: classes.ballotIconRoot }} />
                <EmptyBallotText>
                  No results found.
                  {' '}
                  {isSearching ? (
                    <span>
                      Enter new search terms to find your existing positions.
                    </span>
                  ) : (
                    <span>
                      Try different filters to see your existing positions.
                    </span>
                  )}
                </EmptyBallotText>
              </EmptyBallotMessageContainer>
            </Card>
          )}
          <PreviewButtonWrapper>
            <Button
              color="primary"
              id="voterGuideSettingsPositionsSeeFullBallot"
              onClick={this.goToVoterGuideDisplay}
              variant="contained"
            >
              See Preview&nbsp;&nbsp;&gt;
            </Button>
          </PreviewButtonWrapper>
        </div>
      );
    } else {
      // ////////////////////////
      // Add New Positions - Second Tab
      const selectedFiltersAddDefault = ['showFederalRaceFilter'];
      const { allBallotItems, ballotSearchResults, filteredBallotItems, numberOfBallotItemsToDisplay, totalNumberOfBallotSearchResults } = this.state;
      if (!allBallotItems) {
        return LoadingWheel;
      }
      const atLeastOnePositionFoundWithTheseFilters = (filteredBallotItems && filteredBallotItems.length);
      let numberOfBallotItemsDisplayed = 0;
      let totalNumberOfBallotItems = 0;
      if (atLeastOnePositionFoundWithTheseFilters) {
        totalNumberOfBallotItems = filteredBallotItems.length;
      }
      // let totalNumberOfBallotSearchResults = 0;
      // if (ballotSearchResults && ballotSearchResults.length) {
      //   totalNumberOfBallotSearchResults = ballotSearchResults.length;
      // }
      let searchTextString = '';
      // const { classes } = this.props;
      // console.log('filteredBallotItems: ', filteredBallotItems);
      // console.log('atLeastOnePositionFoundWithTheseFilters: ', atLeastOnePositionFoundWithTheseFilters);
      return (
        <div className="container">
          <FilterBase
            key="addPositionsFilterBase"
            groupedFilters={groupedFilters}
            islandFilters={islandFilters}
            allItems={allBallotItems}
            onSearch={this.onBallotSearch}
            onFilteredItemsChange={this.onFilteredItemsChangeFromBallotItemsFilterBase}
            onToggleSearch={this.handleToggleSearchBallot}
            selectedFiltersDefault={selectedFiltersAddDefault}
            totalNumberOfItemsFound={totalNumberOfBallotItems}
          >
            {/* props get added to this component in FilterBase */}
            <SettingsAddBallotItemsFilter
              filtersPassedInOnce={stateCodeToRetrieve ? [stateCodeToRetrieve.toUpperCase()] : []}
              googleCivicElectionId={localGoogleCivicElectionId}
            />
          </FilterBase>
          {(isSearching && searchText) && (
            <SearchTitle>
              Searching for &quot;
              {searchText}
              &quot;
            </SearchTitle>
          )}
          {((!isSearching && atLeastOnePositionFoundWithTheseFilters && filteredBallotItems && filteredBallotItems.length) || (isSearching && ballotSearchResults && ballotSearchResults.length)) ? (
            <div>
              <CardChildListGroup className="card-child__list-group">
                {(isSearching ? ballotSearchResults : filteredBallotItems).map((oneBallotItem) => {
                  // console.log('oneBallotItem: ', oneBallotItem);
                  if (!oneBallotItem.we_vote_id) {
                    return null;
                  }
                  if (isSearching) {
                    if (numberOfBallotItemsDisplayed >= totalNumberOfBallotSearchResults) {
                      return null;
                    }
                    numberOfBallotItemsDisplayed += 1;
                  } else {
                    if (numberOfBallotItemsDisplayed >= numberOfBallotItemsToDisplay) {
                      return null;
                    }
                    numberOfBallotItemsDisplayed += 1;
                  }
                  // console.log('numberOfBallotItemsDisplayed: ', numberOfBallotItemsDisplayed);
                  let foundInItemsAlreadyShown = 0;
                  let searchWordAlreadyShown = 0;
                  if (searchText) {
                    const wordsArray = searchText.split(' ');
                    searchTextString = wordsArray.map((oneItem) => {
                      const foundInStringItem = `${searchWordAlreadyShown ? ' or ' : ''}"${oneItem}"`;
                      searchWordAlreadyShown += 1;
                      return foundInStringItem;
                    });
                  }
                  return (
                    <div key={`addNewPositionKey-${oneBallotItem.we_vote_id}`}>
                      {!!(isSearching && searchTextString && oneBallotItem.foundInArray && oneBallotItem.foundInArray.length) && (
                        <SearchResultsFoundInExplanation>
                          {searchTextString}
                          {' '}
                          found in
                          {' '}
                          {oneBallotItem.foundInArray.map((oneItem) => {
                            const foundInStringItem = (
                              <span key={foundInItemsAlreadyShown}>
                                {foundInItemsAlreadyShown ? ', ' : ''}
                                {oneItem}
                              </span>
                            );
                            foundInItemsAlreadyShown += 1;
                            return foundInStringItem;
                          })
                          }
                        </SearchResultsFoundInExplanation>
                      )}
                      <BallotItemForAddPositions
                        externalUniqueId={`addNewPositionKey-${oneBallotItem.we_vote_id}`}
                        allBallotItemsCount={2}
                        // ref={(ref) => { this.ballotItems[oneBallotItem.we_vote_id] = ref; }}
                        ballotItemDisplayName={oneBallotItem.ballot_item_display_name}
                        candidateList={oneBallotItem.candidate_list}
                        candidatesToShowForSearchResults={oneBallotItem.candidatesToShowForSearchResults}
                        kindOfBallotItem={oneBallotItem.kind_of_ballot_item}
                        ballotItemWeVoteId={oneBallotItem.we_vote_id}
                      />
                    </div>
                  );
                })
                }
              </CardChildListGroup>
              <ShowMoreItemsWrapper id="showMoreItemsId" onClick={this.increaseNumberOfBallotItemsToDisplay}>
                <ShowMoreItems
                  loadingMoreItemsNow={loadingMoreBallotItems}
                  numberOfItemsDisplayed={numberOfBallotItemsDisplayed}
                  numberOfItemsTotal={isSearching ? totalNumberOfBallotSearchResults : totalNumberOfBallotItems}
                />
              </ShowMoreItemsWrapper>
              <LoadingItemsWheel>
                {loadingMoreBallotItems ? (
                  <CircularProgress />
                ) : null}
              </LoadingItemsWheel>
              <PreviewButtonWrapper>
                <Button
                  color="primary"
                  id="voterGuideSettingsPositionsSeeFullBallot"
                  onClick={this.goToVoterGuideDisplay}
                  variant="contained"
                >
                  See Preview&nbsp;&nbsp;&gt;
                </Button>
              </PreviewButtonWrapper>
            </div>
          ) : (
            <Card>
              <EmptyBallotMessageContainer>
                <BallotIcon classes={{ root: classes.ballotIconRoot }} />
                <EmptyBallotText>
                  No results found.
                  {' '}
                  {isSearching ? (
                    <span>
                      Please enter new search terms to find results.
                    </span>
                  ) : (
                    <span>
                      Try selecting different filters to see results.
                    </span>
                  )}
                </EmptyBallotText>
              </EmptyBallotMessageContainer>
            </Card>
          )
          }
        </div>
      );
    }
  }
}

const CardChildListGroup = styled.ul`
  padding: 0;
`;

const EmptyBallotMessageContainer = styled.div`
  padding: 1em 2em;
  display: flex;
  flex-flow: column;
  align-items: center;
`;

const EmptyBallotText = styled.p`
  font-size: 16px;
  text-align: center;
  margin: 1em 2em;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 1em;
  }
`;

const PreviewButtonWrapper = styled.div`
  text-align: right;
  margin: 20px 0;
`;

const LoadingItemsWheel = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchResultsFoundInExplanation = styled.div`
  background-color: #C2DCE8;
  color: #0E759F;
  padding: 12px !important;
`;

const SearchTitle = styled.div`
  font-size: 24px;
  margin-top: 12px;
  margin-bottom: 12px;
`;

const ShowMoreItemsWrapper = styled.div`
`;

const styles = theme => ({
  ballotIconRoot: {
    width: 150,
    height: 150,
    color: 'rgb(171, 177, 191)',
  },
  ballotButtonIconRoot: {
    marginRight: 8,
  },
  ballotButtonRoot: {
    width: 250,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

export default withStyles(styles)(VoterGuideSettingsAddPositions);
