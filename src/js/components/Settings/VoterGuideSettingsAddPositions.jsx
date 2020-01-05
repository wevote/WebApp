import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/esm/styles';
import CircularProgress from '@material-ui/core/esm/CircularProgress';
import Card from '@material-ui/core/esm/Card';
import BallotIcon from '@material-ui/icons/Ballot';
import Button from '@material-ui/core/esm/Button';
import styled from 'styled-components';
import BallotItemForAddPositions from './BallotItemForAddPositions';
import BallotActions from '../../actions/BallotActions';
import BallotStore from '../../stores/BallotStore';
import { renderLog } from '../../utils/logging';
import FilterBase from '../Filter/FilterBase';
import SettingsAddBallotItemsFilter from '../Filter/SettingsAddBallotItemsFilter';
import SettingsSeePositionsFilter from '../Filter/SettingsSeePositionsFilter';
import LoadingWheel from '../LoadingWheel';
import AppActions from '../../actions/AppActions';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterStore from '../../stores/VoterStore';
import OrganizationActions from '../../actions/OrganizationActions';
import VoterGuideStore from '../../stores/VoterGuideStore';
import { historyPush } from '../../utils/cordovaUtils';
import { isProperlyFormattedVoterGuideWeVoteId } from '../../utils/textFormat';


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
      currentSelectedBallotFilters: [], // So we know when the ballot filters change
      currentSelectedPositionFilters: [], // So we know when the position filters change
      filteredBallotItems: [],
      filteredPositionListForOneElection: [],
      localAllBallotItemsHaveBeenRetrieved: {},
      localPositionListHasBeenRetrieved: {},
      numberOfBallotItemsToDisplay: 5,
      numberOfPositionItemsToDisplay: 5,
      positionListForOneElection: [],
      stateCodeFromIpAddress: '',
      stateCodeFromVoterGuide: '',
      stateCodeToRetrieve: '',
      loadingMoreItems: false,
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

  // getPosition = (el) => {
  //   let xPos = 0;
  //   let yPos = 0;

  //   while (el) {
  //     if (el.tagName === 'BODY') {
  //       // deal with browser quirks with body/window/document and page scroll
  //       const xScroll = el.scrollLeft || document.documentElement.scrollLeft;
  //       const yScroll = el.scrollTop || document.documentElement.scrollTop;

  //       xPos += (el.offsetLeft - xScroll + el.clientLeft);
  //       yPos += (el.offsetTop - yScroll + el.clientTop);
  //     } else {
  //       // for all other non-BODY elements
  //       xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
  //       yPos += (el.offsetTop - el.scrollTop + el.clientTop);
  //     }

  //     el = el.offsetParent;
  //   }
  //   return {
  //     x: xPos,
  //     y: yPos,
  //   };
  // }

  componentWillReceiveProps (nextProps) {
    // console.log('componentWillReceiveProps addNewPositionsMode:', nextProps.addNewPositionsMode, ', nextProps.voterGuideWeVoteId:', nextProps.voterGuideWeVoteId);
    this.setState({
      addNewPositionsMode: nextProps.addNewPositionsMode,
      voterGuideWeVoteId: nextProps.voterGuideWeVoteId,
    });
    let voterGuide;
    if (nextProps.voterGuideWeVoteId && isProperlyFormattedVoterGuideWeVoteId(nextProps.voterGuideWeVoteId)) {
      voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(nextProps.voterGuideWeVoteId);
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
    const { addNewPositionsMode: previousAddNewPositionsMode, currentSelectedBallotFilters: previousSelectedBallotFilters, currentSelectedPositionFilters: previousSelectedPositionFilters } = prevState;
    // console.log('componentDidUpdate addNewPositionsMode:', addNewPositionsMode, ', previousAddNewPositionsMode:', previousAddNewPositionsMode);
    // If previously we were in addNewPositionsMode, and now we are NOT, update the positionListForOpinionMaker
    if (previousAddNewPositionsMode && !addNewPositionsMode) {
      // console.log('We should retrieve positionListForOpinionMaker');
      const { linkedOrganizationWeVoteId, voterGuide } = this.state;
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
  }

  // NOTE FROM DALE 2019-08-12 shouldComponentUpdate gets in the way of the filtering system
  // shouldComponentUpdate (nextProps, nextState) {
  //   if (this.state.addNewPositionsMode !== nextState.addNewPositionsMode) {
  //     // console.log('this.state.addNewPositionsMode: ', this.state.addNewPositionsMode, ', nextState.addNewPositionsMode: ', nextState.addNewPositionsMode);
  //     return true;
  //   }
  //   if (this.state.linkedOrganizationWeVoteId !== nextState.linkedOrganizationWeVoteId) {
  //     // console.log('this.state.linkedOrganizationWeVoteId: ', this.state.linkedOrganizationWeVoteId, ', nextState.linkedOrganizationWeVoteId: ', nextState.linkedOrganizationWeVoteId);
  //     return true;
  //   }
  //   if (this.state.localGoogleCivicElectionId !== nextState.localGoogleCivicElectionId) {
  //     // console.log('this.state.localGoogleCivicElectionId: ', this.state.localGoogleCivicElectionId, ', nextState.localGoogleCivicElectionId: ', nextState.localGoogleCivicElectionId);
  //     return true;
  //   }
  //   if (this.state.voterGuideWeVoteId !== nextState.voterGuideWeVoteId) {
  //     // console.log('this.state.voterGuideWeVoteId: ', this.state.voterGuideWeVoteId, ', nextState.voterGuideWeVoteId: ', nextState.voterGuideWeVoteId);
  //     return true;
  //   }
  //   if (JSON.stringify(this.state.filteredPositionListForOneElection) !== JSON.stringify(nextState.filteredPositionListForOneElection)) {
  //     console.log('this.state.filteredPositionListForOneElection:', this.state.filteredPositionListForOneElection, ', nextState.filteredPositionListForOneElection:', nextState.filteredPositionListForOneElection);
  //     return true;
  //   }
  //   if (JSON.stringify(this.state.filteredBallotItems) !== JSON.stringify(nextState.filteredBallotItems)) {
  //     console.log('this.state.filteredBallotItems:', this.state.filteredBallotItems, ', nextState.filteredBallotItems:', nextState.filteredBallotItems);
  //     return true;
  //   }
  //   console.log('shouldComponentUpdate no change');
  //   return false;
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
  }

  onBallotStoreChange () {
    const { localGoogleCivicElectionId } = this.state;
    const allBallotItemsFlattened = BallotStore.getAllBallotItemsFlattened(localGoogleCivicElectionId);
    // console.log('VoterGuideSettingsAddPositions, onBallotStoreChange incomingBallotItemList:', incomingBallotItemList);
    this.setState({
      allBallotItems: allBallotItemsFlattened,
      filteredBallotItems: allBallotItemsFlattened,
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
      this.setState({
        positionListForOneElection: organization.position_list_for_one_election,
        filteredPositionListForOneElection: organization.position_list_for_one_election,
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
    const element =  document.querySelector('#show_more_indicator');
    if (element) {
      const { numberOfBallotItemsToDisplay, numberOfPositionItemsToDisplay, totalNumberOfBallotItems, totalNumberOfPositionItems } = this.state;
      const yPosition = element.offsetTop - element.scrollTop + element.clientTop;

      // console.log('Window Scroll: ', window.scrollY);
      // console.log('Element Scroll: ', yPosition);

      if (numberOfBallotItemsToDisplay < totalNumberOfBallotItems) {
        if (window.scrollY > yPosition - 500) {
          this.setState({ loadingMoreItems: true });
          this.increaseNumberOfBallotItemsToDisplay();
        }
      } else {
        this.setState({ loadingMoreItems: false });
      }

      if (numberOfPositionItemsToDisplay < totalNumberOfPositionItems) {
        if (window.scrollY > yPosition - 500) {
          this.setState({ loadingMoreItems: true });
          this.increaseNumberOfPositionItemsToDisplay();
        }
      } else {
        this.setState({ loadingMoreItems: false });
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
    // console.log('onFilteredItemsChangeFromBallotItemsFilterBase, currentSelectedBallotFilters: ', currentSelectedBallotFilters);
    this.setState({ currentSelectedBallotFilters, filteredBallotItems });
  }

  onFilteredItemsChangeFromPositionItemsFilterBase = (filteredPositionListForOneElection, currentSelectedPositionFilters) => {
    // console.log('onFilteredItemsChangeFromPositionItemsFilterBase, currentSelectedPositionFilters: ', currentSelectedPositionFilters);
    this.setState({ currentSelectedPositionFilters, filteredPositionListForOneElection });
  }

  increaseNumberOfBallotItemsToDisplay = () => {
    let { numberOfBallotItemsToDisplay } = this.state;
    numberOfBallotItemsToDisplay += 5;

    this.ballotItemTimer = setTimeout(() => {
      this.setState({
        numberOfBallotItemsToDisplay,
      });
    }, 500);
  }

  increaseNumberOfPositionItemsToDisplay = () => {
    let { numberOfPositionItemsToDisplay } = this.state;
    numberOfPositionItemsToDisplay += 5;

    this.positionItemTimer = setTimeout(() => {
      this.setState({
        numberOfPositionItemsToDisplay,
      });
    }, 500);
  }

  goToDifferentVoterGuideSettingsDashboardTab (dashboardEditMode = '') {
    AppActions.setVoterGuideSettingsDashboardEditMode(dashboardEditMode);
  }

  render () {
    renderLog('VoterGuideSettingsAddPositions');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { addNewPositionsMode, localGoogleCivicElectionId, stateCodeToRetrieve, loadingMoreItems } = this.state;
    // console.log('VoterGuideSettingsAddPositions render, addNewPositionsMode:', addNewPositionsMode);
    if (!addNewPositionsMode) {
      // ////////////////////////
      // Current Positions - First Tab
      const selectedFiltersCurrentDefault = [];
      const { filteredPositionListForOneElection, numberOfPositionItemsToDisplay, positionListForOneElection } = this.state;
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
            key="currentPositionsFilterBase"
            groupedFilters={groupedFilters}
            islandFilters={islandFilters}
            allItems={positionListForOneElection}
            onFilteredItemsChange={this.onFilteredItemsChangeFromPositionItemsFilterBase}
            selectedFiltersDefault={selectedFiltersCurrentDefault}
            totalNumberOfItemsFound={totalNumberOfPositionItems}
          >
            {/* props get added to this component in FilterBase */}
            <SettingsSeePositionsFilter />
          </FilterBase>
          <CardChildListGroup className="card-child__list-group">
            {filteredPositionListForOneElection.map((onePosition) => {
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
          <ShowMoreItems id="show_more_indicator">
            Displaying
            {' '}
            {numberOfPositionItemsDisplayed}
            {' '}
            of
            {' '}
            {totalNumberOfPositionItems}
          </ShowMoreItems>
          <LoadingItemsWheel>
            {loadingMoreItems ? (
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
      );
    } else {
      // ////////////////////////
      // Add New Positions - Second Tab
      const selectedFiltersAddDefault = ['showFederalRaceFilter'];
      const { allBallotItems, filteredBallotItems, numberOfBallotItemsToDisplay } = this.state;
      if (!allBallotItems) {
        return LoadingWheel;
      }
      const atLeastOnePositionFoundWithTheseFilters = filteredBallotItems && filteredBallotItems.length !== 0;
      let numberOfBallotItemsDisplayed = 0;
      let totalNumberOfBallotItems = 0;
      if (atLeastOnePositionFoundWithTheseFilters) {
        totalNumberOfBallotItems = filteredBallotItems.length;
      }
      // const { classes } = this.props;
      // console.log('allBallotItems: ', allBallotItems);
      return (
        <div className="container">
          <FilterBase
            key="addPositionsFilterBase"
            groupedFilters={groupedFilters}
            islandFilters={islandFilters}
            allItems={allBallotItems}
            onFilteredItemsChange={this.onFilteredItemsChangeFromBallotItemsFilterBase}
            selectedFiltersDefault={selectedFiltersAddDefault}
            totalNumberOfItemsFound={totalNumberOfBallotItems}
          >
            {/* props get added to this component in FilterBase */}
            <SettingsAddBallotItemsFilter
              filtersPassedInOnce={stateCodeToRetrieve ? [stateCodeToRetrieve.toUpperCase()] : []}
              googleCivicElectionId={localGoogleCivicElectionId}
            />
          </FilterBase>
          {atLeastOnePositionFoundWithTheseFilters ? (
            <div>
              <CardChildListGroup className="card-child__list-group">
                {filteredBallotItems.map((oneBallotItem) => {
                  // console.log('oneBallotItem: ', oneBallotItem);
                  if (!oneBallotItem.we_vote_id) {
                    return null;
                  }
                  if (numberOfBallotItemsDisplayed >= numberOfBallotItemsToDisplay) {
                    return null;
                  }
                  numberOfBallotItemsDisplayed += 1;
                  // console.log('numberOfBallotItemsDisplayed: ', numberOfBallotItemsDisplayed);
                  return (
                    <BallotItemForAddPositions
                      key={`addNewPositionKey-${oneBallotItem.we_vote_id}`}
                      externalUniqueId={`addNewPositionKey-${oneBallotItem.we_vote_id}`}
                      allBallotItemsCount={2}
                      // ref={(ref) => { this.ballotItems[oneBallotItem.we_vote_id] = ref; }}
                      ballotItemDisplayName={oneBallotItem.ballot_item_display_name}
                      candidateList={oneBallotItem.candidate_list}
                      kindOfBallotItem={oneBallotItem.kind_of_ballot_item}
                      ballotItemWeVoteId={oneBallotItem.we_vote_id}
                    />
                  );
                })
                }
              </CardChildListGroup>
              <ShowMoreItems id="show_more_indicator">
                Displaying
                {' '}
                {numberOfBallotItemsDisplayed}
                {' '}
                of
                {' '}
                {totalNumberOfBallotItems}
              </ShowMoreItems>
              <LoadingItemsWheel>
                {loadingMoreItems ? (
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
                <EmptyBallotText>No results found. Try selecting different filters to see results.</EmptyBallotText>
              </EmptyBallotMessageContainer>
            </Card>
          )
          }
        </div>
      );
    }
  }
}

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

const ShowMoreItems = styled.div`
  font-size: 18px;
  text-align: right;
  user-select: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding-top: 5px;
    padding-bottom: 3px;
  }
  @media print{
    display: none;
  }
`;

const CardChildListGroup = styled.ul`
  padding: 0;
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
