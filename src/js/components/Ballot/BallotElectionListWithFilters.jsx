/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import BallotActions from '../../actions/BallotActions';
import BallotStore from '../../stores/BallotStore';
import DelayedLoad from '../Widgets/DelayedLoad';
import { historyPush } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import LoadingWheel from '../LoadingWheel';
import OrganizationActions from '../../actions/OrganizationActions';
import VoterActions from '../../actions/VoterActions';
import VoterStore from '../../stores/VoterStore';
import { cleanArray } from '../../utils/textFormat';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterGuideActions from '../../actions/VoterGuideActions';


export default class BallotElectionListWithFilters extends Component {
  static propTypes = {
    ballotBaseUrl: PropTypes.string,
    displayElectionsForOrganizationVoterGuidesMode: PropTypes.bool,
    hideUpcomingElectionsList: PropTypes.bool,
    hideUpcomingElectionTitle: PropTypes.bool,
    organizationWeVoteId: PropTypes.string, // If looking at voter guide, we pass in the parent organizationWeVoteId
    showPriorElectionsList: PropTypes.bool,
    stateToShow: PropTypes.string,
    toggleFunction: PropTypes.func,
  };

  constructor (props) {
    super(props);

    this.state = {
      ballotElectionList: [],
      ballotElectionListCount: 0,
      loadingNewBallotItems: false,
      updatedElectionId: '',
      voterBallotListHasBeenRetrievedOnce: false,
      voterGuideHasBeenRetrievedOnce: {},
    };
    this.executeDifferentElection = this.executeDifferentElection.bind(this);
    this.goToBallotForDifferentElection = this.goToBallotForDifferentElection.bind(this);
  }

  componentDidMount () {
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    let priorElectionId = '';
    if (BallotStore.ballotProperties) {
      priorElectionId = BallotStore.ballotProperties.google_civic_election_id;
    } else if (VoterStore.electionId()) {
      priorElectionId = VoterStore.electionId();
    }
    const { voterBallotListHasBeenRetrievedOnce, voterGuideHasBeenRetrievedOnce } = this.state;
    let ballotElectionList;
    let ballotElectionListCount = 0;
    const { displayElectionsForOrganizationVoterGuidesMode, organizationWeVoteId } = this.props;
    if (displayElectionsForOrganizationVoterGuidesMode) {
      ballotElectionList = VoterGuideStore.getVoterGuideElectionList(organizationWeVoteId);
      ballotElectionListCount = ballotElectionList.length;
      if (ballotElectionListCount === 0 && !this.localVoterGuideHasBeenRetrievedOnce(organizationWeVoteId)) {
        VoterGuideActions.voterGuidesRetrieve(organizationWeVoteId);
        voterGuideHasBeenRetrievedOnce[organizationWeVoteId] = true;
        this.setState({
          voterGuideHasBeenRetrievedOnce,
        });
      }
    } else {
      ballotElectionList = BallotStore.ballotElectionList();
      ballotElectionListCount = ballotElectionList.length;
      if (ballotElectionListCount === 0 && !voterBallotListHasBeenRetrievedOnce) {
        BallotActions.voterBallotListRetrieve();
        this.setState({
          voterBallotListHasBeenRetrievedOnce: true,
        });
      }
    }
    // console.log('componentDidMount displayElectionsForOrganizationVoterGuidesMode:', displayElectionsForOrganizationVoterGuidesMode, ', organizationWeVoteId:', organizationWeVoteId);
    this.setState({
      ballotElectionList,
      ballotElectionListCount,
      priorElectionId,
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.ballotElectionListCount !== nextState.ballotElectionListCount) {
      // console.log('this.state.ballotElectionListCount', this.state.ballotElectionListCount, ', nextState.ballotElectionListCount', nextState.ballotElectionListCount);
      return true;
    }
    if (this.props.stateToShow !== nextProps.stateToShow) {
      return true;
    }
    if (this.props.hideUpcomingElectionsList !== nextProps.hideUpcomingElectionsList) return true;
    if (this.props.showPriorElectionsList !== nextProps.showPriorElectionsList) return true;
    if (this.state.destinationUrlForHistoryPush !== nextState.destinationUrlForHistoryPush) {
      // console.log('this.state.destinationUrlForHistoryPush', this.state.destinationUrlForHistoryPush, ', nextState.destinationUrlForHistoryPush', nextState.destinationUrlForHistoryPush);
      return true;
    }
    if (this.state.loadingNewBallotItems !== nextState.loadingNewBallotItems) {
      // console.log('this.state.loadingNewBallotItems', this.state.loadingNewBallotItems, ', nextState.loadingNewBallotItems', nextState.loadingNewBallotItems);
      return true;
    }
    if (this.state.priorElectionId !== nextState.priorElectionId) {
      // console.log('this.state.priorElectionId', this.state.priorElectionId, ', nextState.priorElectionId', nextState.priorElectionId);
      return true;
    }
    if (this.state.updatedElectionId !== nextState.updatedElectionId) {
      // console.log('this.state.updatedElectionId', this.state.updatedElectionId, ', nextState.updatedElectionId', nextState.updatedElectionId);
      return true;
    }
    // ////////////////// Props ////////////////////
    if (this.props.ballotBaseUrl !== nextProps.ballotBaseUrl) {
      // console.log('this.props.ballotBaseUrl', this.props.ballotBaseUrl, ', nextProps.ballotBaseUrl', nextProps.ballotBaseUrl);
      return true;
    }
    if (this.props.organizationWeVoteId !== nextProps.organizationWeVoteId) {
      // console.log('this.props.organizationWeVoteId', this.props.organizationWeVoteId, ', nextProps.organizationWeVoteId', nextProps.organizationWeVoteId);
      return true;
    }
    // console.log('shouldComponentUpdate false');
    return false;
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
    this.voterStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onBallotStoreChange () {
    // console.log('BallotElectionListWithFilters.jsx onBallotStoreChange, priorElectionId: ', this.state.priorElectionId, ', updatedElectionId: ', this.state.updatedElectionId);
    // console.log('BallotStore.ballotProperties: ', BallotStore.ballotProperties);
    if (BallotStore.ballotProperties && BallotStore.ballotProperties.ballot_found && BallotStore.ballot && BallotStore.ballot.length === 0) {
      // Ballot is found but ballot is empty. We want to stay put.
      // console.log('onBallotStoreChange: ballot_with_all_items is empty');
    }
    if (this.state.priorElectionId !== this.state.updatedElectionId && this.state.loadingNewBallotItems) {
      // console.log('onBallotStoreChange--------- loadingNewBallotItems:', this.state.loadingNewBallotItems);
      this.setState({
        loadingNewBallotItems: false,
        updatedElectionId: BallotStore.ballotProperties.google_civic_election_id,
      });
      // console.log('onBallotStoreChange--------- this.props.toggleFunction()');
      this.incomingToggleFunction(this.state.destinationUrlForHistoryPush);
    }
    let ballotElectionList;
    let ballotElectionListCount;
    const { displayElectionsForOrganizationVoterGuidesMode, organizationWeVoteId } = this.props;
    const { voterBallotListHasBeenRetrievedOnce, voterGuideHasBeenRetrievedOnce } = this.state;
    if (displayElectionsForOrganizationVoterGuidesMode) {
      ballotElectionList = VoterGuideStore.getVoterGuideElectionList(organizationWeVoteId);
      ballotElectionListCount = ballotElectionList.length;
      if (ballotElectionListCount === 0 && !this.localVoterGuideHasBeenRetrievedOnce(organizationWeVoteId)) {
        VoterGuideActions.voterGuidesRetrieve(organizationWeVoteId);
        voterGuideHasBeenRetrievedOnce[organizationWeVoteId] = true;
        this.setState({
          voterGuideHasBeenRetrievedOnce,
        });
      }
    } else {
      ballotElectionList = BallotStore.ballotElectionList();
      ballotElectionListCount = ballotElectionList.length;
      if (ballotElectionListCount === 0 && !voterBallotListHasBeenRetrievedOnce) {
        BallotActions.voterBallotListRetrieve();
        this.setState({
          voterBallotListHasBeenRetrievedOnce: true,
        });
      }
    }
    this.setState({
      ballotElectionList,
      ballotElectionListCount,
    });
  }

  onVoterGuideStoreChange () {
    const { displayElectionsForOrganizationVoterGuidesMode, organizationWeVoteId } = this.props;
    // console.log('onVoterGuideStoreChange displayElectionsForOrganizationVoterGuidesMode:', displayElectionsForOrganizationVoterGuidesMode, ', organizationWeVoteId:', organizationWeVoteId);
    if (displayElectionsForOrganizationVoterGuidesMode) {
      const ballotElectionList = VoterGuideStore.getVoterGuideElectionList(organizationWeVoteId);
      const ballotElectionListCount = ballotElectionList.length;
      this.setState({
        ballotElectionList,
        ballotElectionListCount,
      });
    }
    const voter = VoterStore.getVoter();
    const voterGuideSaveResults = VoterGuideStore.getVoterGuideSaveResults();
    if (voterGuideSaveResults && voter && voterGuideSaveResults.organization_we_vote_id === voter.linked_organization_we_vote_id) {
      this.goToVoterGuideForDifferentElection(voterGuideSaveResults.we_vote_id);
    }
  }

  onVoterStoreChange () {
    // console.log('BallotElectionListWithFilters.jsx onVoterStoreChange, VoterStore.electionId(): ', VoterStore.electionId(), ', priorElectionId: ', this.state.priorElectionId, ', updatedElectionId: ', this.state.updatedElectionId);
    // if (BallotStore.ballotProperties && BallotStore.ballotProperties.ballot_found && BallotStore.ballot && BallotStore.ballot.length !== 0) {
    if (VoterStore.electionId() && VoterStore.electionId() !== this.state.priorElectionId) {
      if (this.state.loadingNewBallotItems) {
        // console.log('onVoterStoreChange--------- loadingNewBallotItems:', this.state.loadingNewBallotItems);
        this.setState({
          loadingNewBallotItems: false,
          updatedElectionId: VoterStore.electionId(),
        });
        // console.log('onVoterStoreChange--------- this.props.toggleFunction()');
        this.incomingToggleFunction(this.state.destinationUrlForHistoryPush);
      }
    }
  }

  incomingToggleFunction = (destinationUrlForHistoryPush) => {
    if (this.props.toggleFunction) {
      this.props.toggleFunction(destinationUrlForHistoryPush);
    }
  }

  localVoterGuideHasBeenRetrievedOnce = (organizationWeVoteId) => {
    if (organizationWeVoteId) {
      const { voterGuideHasBeenRetrievedOnce } = this.state;
      return voterGuideHasBeenRetrievedOnce[organizationWeVoteId] || false;
    }
    return false;
  }

  saveVoterGuideForElection = (googleCivicElectionId) => {
    BallotActions.voterBallotItemsRetrieve(googleCivicElectionId, '', '');
    VoterGuideActions.voterGuideSave(googleCivicElectionId, '');
    // When the result comes back from voterGuideSave, onVoterGuideStoreChange triggers a call to goToVoterGuideForDifferentElection
  }

  switchElectionBehindTheScenes = (googleCivicElectionId) => {
    // Load new election
    const { organizationWeVoteId } = this.props;
    // console.log('switchElectionBehindTheScenes, googleCivicElectionId:', googleCivicElectionId);
    BallotActions.voterBallotItemsRetrieve(googleCivicElectionId, '', '');
    OrganizationActions.positionListForOpinionMaker(organizationWeVoteId, true, false, googleCivicElectionId);
    if (this.props.toggleFunction) {
      this.props.toggleFunction();
    }
  }

  goToVoterGuideForDifferentElection = (voterGuideWeVoteId) => {
    const voterGuideBallotItems = `/vg/${voterGuideWeVoteId}/settings/positions`;
    historyPush(voterGuideBallotItems);
    if (this.props.toggleFunction) {
      this.props.toggleFunction();
    }
  }

  goToBallotForDifferentElection (originalTextForMapSearch, googleCivicElectionId, ballotLocationShortcut = '', ballotReturnedWeVoteId = '') {
    // console.log('BallotElectionListWithFilters, goToBallotForDifferentElection');
    const ballotBaseUrlClean = this.props.ballotBaseUrl || '/ballot';
    const { organizationWeVoteId } = this.props;
    let destinationUrlForHistoryPush = '';
    if (ballotLocationShortcut && ballotLocationShortcut !== '' && ballotLocationShortcut !== 'none') {
      // console.log('goToBallotForDifferentElection, ballotLocationShortcut: ', ballotLocationShortcut);
      BallotActions.voterBallotItemsRetrieve(0, '', ballotLocationShortcut);
      destinationUrlForHistoryPush = `${ballotBaseUrlClean}/${ballotLocationShortcut}`; // Used with historyPush once modal is closed
    } else if (ballotReturnedWeVoteId && ballotReturnedWeVoteId !== '' && ballotReturnedWeVoteId !== 'none') {
      // console.log('goToBallotForDifferentElection, ballotReturnedWeVoteId: ', ballotReturnedWeVoteId);
      BallotActions.voterBallotItemsRetrieve(0, ballotReturnedWeVoteId, '');
      destinationUrlForHistoryPush = `${ballotBaseUrlClean}/id/${ballotReturnedWeVoteId}`; // Used with historyPush once modal is closed
    } else if (googleCivicElectionId && googleCivicElectionId !== 0) {
      BallotActions.voterBallotItemsRetrieve(googleCivicElectionId, '', '');
      // console.log('goToBallotForDifferentElection, googleCivicElectionId: ', googleCivicElectionId);
      destinationUrlForHistoryPush = `${ballotBaseUrlClean}/election/${googleCivicElectionId}`; // Used with historyPush once modal is closed
    } else if (originalTextForMapSearch && originalTextForMapSearch !== '') {
      // Do we still want to be updating addresses? Maybe instead just update google_civic_election_id?
      // console.log('goToBallotForDifferentElection, originalTextForMapSearch: ', originalTextForMapSearch);
      const simpleSave = false;
      VoterActions.voterAddressSave(originalTextForMapSearch, simpleSave, googleCivicElectionId);
      destinationUrlForHistoryPush = ballotBaseUrlClean; // Used with historyPush once modal is closed
    }
    // Request positions for the different election
    if (organizationWeVoteId && organizationWeVoteId !== '') {
      // console.log('BallotElectionListWithFilters calling positionListForOpinionMaker, this.props.organizationWeVoteId: ', this.props.organizationWeVoteId, ', googleCivicElectionId:', googleCivicElectionId);
      // if (!OrganizationStore.positionListForOpinionMakerHasBeenRetrievedOnce(googleCivicElectionId, organizationWeVoteId)) {
      OrganizationActions.positionListForOpinionMaker(organizationWeVoteId, true, false, googleCivicElectionId);
      // }
    }

    if (this.props.toggleFunction) {
      // console.log('goToBallotForDifferentElection, loadingNewBallotItems: ', this.state.loadingNewBallotItems);
      // console.log('goToBallotForDifferentElection, priorElectionId: ', this.state.priorElectionId, ', updatedElectionId: ', this.state.updatedElectionId, ', destinationUrlForHistoryPush: ', destinationUrlForHistoryPush, ', BallotStore.ballotProperties.google_civic_election_id: ', BallotStore.ballotProperties.google_civic_election_id, ', VoterStore.electionId():', VoterStore.electionId());
      let ballotPropertiesGoogleCivicElectionId = 0;
      if (BallotStore.ballotProperties) {
        ballotPropertiesGoogleCivicElectionId = BallotStore.ballotProperties.google_civic_election_id;
      }
      this.setState({
        destinationUrlForHistoryPush,
        loadingNewBallotItems: true,
        priorElectionId: ballotPropertiesGoogleCivicElectionId || VoterStore.electionId() || 0,
        updatedElectionId: 0,
      });
    } else {
      // console.log('destinationUrlForHistoryPush: ', destinationUrlForHistoryPush);
      historyPush(destinationUrlForHistoryPush);
    }
  }

  executeDifferentElection (election) {
    if (election) {
      const { ballotBaseUrl, displayElectionsForOrganizationVoterGuidesMode } = this.props;
      // console.log('executeDifferentElection ballotBaseUrl:', ballotBaseUrl, ', displayElectionsForOrganizationVoterGuidesMode:', displayElectionsForOrganizationVoterGuidesMode);
      if (displayElectionsForOrganizationVoterGuidesMode) {
        this.switchElectionBehindTheScenes(election.google_civic_election_id);
      } else if (ballotBaseUrl) {
        this.goToBallotForDifferentElection(election.original_text_for_map_search, election.google_civic_election_id); // Removing for now: , election.ballot_location_shortcut, election.ballot_returned_we_vote_id
      } else {
        this.saveVoterGuideForElection(election.google_civic_election_id);
      }
    }
  }

  renderUpcomingElectionList (list, currentDate) {
    if (!list || !Array.isArray(list)) {
      return null;
    }
    const renderedList = list.map((election) => {
      // console.log('election: ', election);
      if (!election.election_description_text || election.election_description_text === '') return null;
      const electionDateTomorrowMoment = moment(election.election_day_text, 'YYYY-MM-DD').add(1, 'days');
      const electionDateTomorrow = electionDateTomorrowMoment.format('YYYY-MM-DD');
      let electionStateCodeList = [];
      if (election && election.state_code_list) {
        electionStateCodeList = election.state_code_list || [];
      }
      const electionId = election.google_civic_election_id || 0;
      return (electionDateTomorrow > currentDate) && (
        <div key={`upcoming-election-${election.google_civic_election_id}`}>
          <div className="list-unstyled">
            <ElectionButton
              color="primary"
              fullWidth
              href=""
              id={`ballotElectionListWithFiltersButton-${election.google_civic_election_id}`}
              onClick={() => this.executeDifferentElection(election)}
              variant="contained"
            >
              <ButtonContentsWrapper>
                <ElectionTitle>
                  {moment(election.election_day_text).format('MMM Do, YYYY')}
                  {' - '}
                  {election.election_description_text.split(' in')[0]}
                </ElectionTitle>
                <ElectionStates>
                  {electionStateCodeList.map((stateAbbrev, index) => {
                    if (index < 5) {
                      return (
                        <ElectionState key={`upcomingElection-${electionId}-${stateAbbrev}`}>{stateAbbrev}</ElectionState>
                      );
                    } else if (index === 6) {
                      return (
                        <span key="upcomingElectionPlus">{`+${electionStateCodeList.length - 6}`}</span>
                      );
                    } else {
                      return null;
                    }
                  })}
                </ElectionStates>
              </ButtonContentsWrapper>
            </ElectionButton>
          </div>
        </div>
      );
    });
    return cleanArray(renderedList);
  }

  renderUpcomingElectionListByState (list, currentDate) {
    if (!list || !Array.isArray(list)) {
      return null;
    }
    const renderedList = list.filter(filterItem => filterItem.state_code_list && filterItem.state_code_list.includes(this.props.stateToShow)).map((election) => {
      // console.log('election.election_description_text: ', election.election_description_text, 'election.election_day_text: ', election.election_day_text);
      if (!election.election_description_text || election.election_description_text === '') return null;
      const electionDateTomorrowMoment = moment(election.election_day_text, 'YYYY-MM-DD').add(1, 'days');
      const electionDateTomorrow = electionDateTomorrowMoment.format('YYYY-MM-DD');
      let electionStateCodeList = [];
      if (election && election.state_code_list) {
        electionStateCodeList = election.state_code_list || [];
      }
      const electionId = election.google_civic_election_id || 0;
      return electionDateTomorrow > currentDate ? (
        <div key={`upcoming-election-${electionId}`}>
          <div className="list-unstyled">
            <ElectionButton
              color="primary"
              fullWidth
              href=""
              id={`ballotElectionListWithFiltersButton-${electionId}`}
              onClick={() => this.executeDifferentElection(election)}
              variant="contained"
            >
              <ButtonContentsWrapper>
                <ElectionTitle>
                  {moment(election.election_day_text).format('MMM Do, YYYY')}
                  {' - '}
                  {election.election_description_text.split(' in')[0]}
                </ElectionTitle>
                <ElectionStates>
                  {electionStateCodeList.map((stateAbbrev, index) => {
                    if (index < 5) {
                      return (
                        <ElectionState key={`upcomingElectionByState-${electionId}-${stateAbbrev}`}>{stateAbbrev}</ElectionState>
                      );
                    } else if (index === 6) {
                      return (
                        <span key="upcomingElectionByStatePlus">{`+${electionStateCodeList.length - 6}`}</span>
                      );
                    } else {
                      return null;
                    }
                  })}
                </ElectionStates>
              </ButtonContentsWrapper>
            </ElectionButton>
          </div>
        </div>
      ) :
        null;
    });
    return cleanArray(renderedList);
  }

  renderPriorElectionList (list, currentDate) {
    if (!list || !Array.isArray(list)) {
      return null;
    }
    const renderedList = list.map((election) => {
      const electionDateTomorrowMoment = moment(election.election_day_text, 'YYYY-MM-DD').add(1, 'days');
      const electionDateTomorrow = electionDateTomorrowMoment.format('YYYY-MM-DD');
      let electionStateCodeList = [];
      if (election && election.state_code_list) {
        electionStateCodeList = election.state_code_list || [];
      }
      const electionId = election.google_civic_election_id || 0;
      return electionDateTomorrow > currentDate ?
        null : (
          <div key={`prior-election-${electionId}`}>
            <div className="list-unstyled prior-election-list">
              <ElectionButton
                color="primary"
                fullWidth
                href=""
                id={`ballotElectionListWithFiltersButton-${electionId}`}
                onClick={() => this.executeDifferentElection(election)}
                variant="contained"
              >
                <ButtonContentsWrapper>
                  <ElectionTitle>
                    {moment(election.election_day_text).format('MMM Do, YYYY')}
                    {' - '}
                    {election.election_description_text.split(' in')[0]}
                  </ElectionTitle>
                  <ElectionStates>
                    {electionStateCodeList.map((stateAbbrev, index) => {
                      if (index < 5) {
                        return (
                          <ElectionState key={`priorElection-${electionId}-${stateAbbrev}`}>{stateAbbrev}</ElectionState>
                        );
                      } else if (index === 6) {
                        return (
                          <span key="priorElectionPlus">{`+${electionStateCodeList.length - 6}`}</span>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </ElectionStates>
                </ButtonContentsWrapper>
              </ElectionButton>
            </div>
          </div>
        );
    });
    return cleanArray(renderedList);
  }

  renderPriorElectionListByState (list, currentDate) {
    if (!list || !Array.isArray(list)) {
      return null;
    }
    const renderedList = list.filter(filterItem => filterItem.state_code_list && filterItem.state_code_list.includes(this.props.stateToShow)).map((election) => {
      const electionDateTomorrowMoment = moment(election.election_day_text, 'YYYY-MM-DD').add(1, 'days');
      const electionDateTomorrow = electionDateTomorrowMoment.format('YYYY-MM-DD');
      let electionStateCodeList = [];
      if (election && election.state_code_list) {
        electionStateCodeList = election.state_code_list || [];
      }
      const electionId = election.google_civic_election_id || 0;
      return electionDateTomorrow > currentDate ?
        null : (
          <div key={`prior-election-${electionId}`}>
            <div className="list-unstyled prior-election-list">
              <ElectionButton
                color="primary"
                fullWidth
                href=""
                id={`ballotElectionListWithFiltersButton-${electionId}`}
                onClick={() => this.executeDifferentElection(election)}
                variant="contained"
              >
                {' '}
                <ButtonContentsWrapper>
                  <ElectionTitle>
                    {moment(election.election_day_text).format('MMM Do, YYYY')}
                    {' - '}
                    {election.election_description_text.split(' in')[0]}
                  </ElectionTitle>
                  <ElectionStates>
                    {electionStateCodeList.map((stateAbbrev, index) => {
                      if (index < 5) {
                        return (
                          <ElectionState key={`priorElectionByState-${electionId}-${stateAbbrev}`}>{stateAbbrev}</ElectionState>
                        );
                      } else if (index === 6) {
                        return (
                          <span key="priorElectionByStatePlus">{`+${electionStateCodeList.length - 6}`}</span>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </ElectionStates>
                </ButtonContentsWrapper>
              </ElectionButton>
            </div>
          </div>
        );
    });
    return cleanArray(renderedList);
  }

  render () {
    renderLog('BallotElectionListWithFilters');  // Set LOG_RENDER_EVENTS to log all renders
    if (this.state.loadingNewBallotItems) {
      return (
        <div>
          <h1 className="h1">Switching ballot data now...</h1>
          <br />
          {LoadingWheel}
        </div>
      );
    }
    const currentDate = moment().format('YYYY-MM-DD');
    const { hideUpcomingElectionTitle } = this.props;
    let { showPriorElectionsList, hideUpcomingElectionsList } = this.props;
    // console.log('this.state.ballotElectionList:', this.state.ballotElectionList);

    const ballotElectionListUpcomingSorted = this.state.ballotElectionList.concat();
    // We want to sort ascending so the next upcoming election is first
    ballotElectionListUpcomingSorted.sort((a, b) => {
      const electionDayTextA = a.election_day_text.toLowerCase();
      const electionDayTextB = b.election_day_text.toLowerCase();
      if (electionDayTextA < electionDayTextB) { // sort string ascending
        return -1;
      }
      if (electionDayTextA > electionDayTextB) return 1;
      return 0; // default return value (no sorting)
    });
    const upcomingElectionList = this.renderUpcomingElectionList(ballotElectionListUpcomingSorted, currentDate);

    const upcomingElectionListByState = this.renderUpcomingElectionListByState(ballotElectionListUpcomingSorted, currentDate);

    let priorElectionList = [];
    const ballotElectionListPastSorted = this.state.ballotElectionList.concat();
    if (showPriorElectionsList) {
      // We want to sort descending so the most recent election is first
      ballotElectionListPastSorted.sort((a, b) => {
        const electionDayTextA = a.election_day_text.toLowerCase();
        const electionDayTextB = b.election_day_text.toLowerCase();
        if (electionDayTextA < electionDayTextB) { // sort string descending
          return 1;
        }
        if (electionDayTextA > electionDayTextB) return -1;
        return 0; // default return value (no sorting)
      });
      priorElectionList = this.renderPriorElectionList(ballotElectionListPastSorted, currentDate);
    }

    const priorElectionListByState = this.renderPriorElectionListByState(ballotElectionListPastSorted, currentDate);


    if (priorElectionList && !priorElectionList.length) {
      showPriorElectionsList = false; // Override to hide
    }
    if ((upcomingElectionList && !upcomingElectionList.length) && (priorElectionList && priorElectionList.length)) {
      // If there aren't any upcoming elections, but there are prior elections, hide the whole upcoming elections block
      hideUpcomingElectionsList = true; // Override to hide
    }

    // console.log('hideUpcomingElectionsList: ', hideUpcomingElectionsList, ', showPriorElectionsList: ', showPriorElectionsList);

    return (
      <div className="ballot-election-list__list">
        { !hideUpcomingElectionsList && (
          <div className="ballot-election-list__upcoming">
            {!hideUpcomingElectionTitle && (
              <PriorOrUpcomingElectionsWrapper>
                <strong>
                  <h4 className="h4">
                    Upcoming Election
                    {(upcomingElectionList && upcomingElectionList.length !== 1) ? 's' : null }
                  </h4>
                </strong>
              </PriorOrUpcomingElectionsWrapper>
            )}
            { upcomingElectionList && upcomingElectionList.length ?
              (
                <>
                  {this.props.stateToShow === 'all' ? upcomingElectionList :
                    upcomingElectionListByState.length > 0 ? upcomingElectionListByState :
                      'There are no upcoming elections for this state.'
                  }
                </>
              ) : (
                <DelayedLoad showLoadingText waitBeforeShow={2000}>
                  <div>
                    {this.props.stateToShow !== 'all' ? 'There are no upcoming elections at this time for this state.' : 'There are no upcoming elections at this time.'}
                  </div>
                </DelayedLoad>
              )
            }
          </div>
        )}
        {(!hideUpcomingElectionsList && showPriorElectionsList) && (
          <SpaceBetweenElections>
            &nbsp;
          </SpaceBetweenElections>
        )}
        { showPriorElectionsList && (
          <div>
            { priorElectionList && priorElectionList.length ?
              (
                <PriorOrUpcomingElectionsWrapper>
                  <strong><h4 className="h4">Prior Elections</h4></strong>
                  {this.props.stateToShow === 'all' ? priorElectionList :
                    priorElectionListByState.length > 0 ? priorElectionListByState :
                      'There are no prior elections for this state.'
                  }
                </PriorOrUpcomingElectionsWrapper>
              ) : (
                <DelayedLoad showLoadingText waitBeforeShow={2000}>
                  <div>
                    {this.props.stateToShow !== 'all' ? 'There are no prior elections at this time for this state.' : 'There are no prior elections at this time.'}
                  </div>
                </DelayedLoad>
              )
            }
          </div>
        )}
      </div>
    );
  }
}

const ElectionButton = styled(Button)`
  background: white !important;
  border: 1px solid #555 !important;
  box-shadow: none !important;
  color:#2e3c5d !important;
  text-transform: none !important;
  margin: 8px 0 !important;
  padding: 10px !important;
`;

const ElectionTitle = styled.h3`
  margin: 0 !important;
  font-size: 15px;
  font-weight: 600;
  text-align: left !important;
  margin-bottom: 6px !important;
`;

const ButtonContentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  align-items: flex-start;
`;

const ElectionStates = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 4px;
`;

const ElectionState = styled.div`
  border-radius: 50px;
  height: 20px;
  width: fit-content;
  padding: 2px 8px;
  background: #e8e8e8;
  display: flex;
  align-items: center;
  margin: 0 2px;
`;

const PriorOrUpcomingElectionsWrapper = styled.div`
  margin-top: 20px;
`;

const SpaceBetweenElections = styled.div`
  margin-bottom: 20px;
`;
