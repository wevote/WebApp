import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';
import Button from '@material-ui/core/esm/Button';
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

const MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW = 30;
const MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW_DESKTOP = 36;


export default class BallotElectionListWithFilters extends Component {
  static propTypes = {
    ballotBaseUrl: PropTypes.string,
    hideUpcomingElectionTitle: PropTypes.bool,
    organizationWeVoteId: PropTypes.string, // If looking at voter guide, we pass in the parent organizationWeVoteId
    showPriorElectionsList: PropTypes.bool,
    toggleFunction: PropTypes.func,
  };

  constructor (props) {
    super(props);

    this.state = {
      ballotElectionList: [],
      ballotElectionListCount: 0,
      loadingNewBallotItems: false,
      priorElectionListOpen: false,
      updatedElectionId: '',
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
    const ballotElectionList = BallotStore.ballotElectionList();
    const ballotElectionListCount = ballotElectionList.length;
    if (ballotElectionListCount === 0) {
      BallotActions.voterBallotListRetrieve();
    }
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
    if (this.state.priorElectionListOpen !== nextState.priorElectionListOpen) {
      // console.log('this.state.priorElectionListOpen', this.state.priorElectionListOpen, ', nextState.priorElectionListOpen', nextState.priorElectionListOpen);
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
    const ballotElectionList = BallotStore.ballotElectionList();
    this.setState({
      ballotElectionList,
      ballotElectionListCount: ballotElectionList.length,
    });
  }

  onVoterGuideStoreChange () {
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

  saveVoterGuideForElection = (googleCivicElectionId) => {
    BallotActions.voterBallotItemsRetrieve(googleCivicElectionId, '', '');
    VoterGuideActions.voterGuideSave(googleCivicElectionId, '');
    // When the result comes back from voterGuideSave, onVoterGuideStoreChange triggers a call to goToVoterGuideForDifferentElection
  }

  goToVoterGuideForDifferentElection = (voterGuideWeVoteId) => {
    const voterGuideBallotItems = `/vg/${voterGuideWeVoteId}/settings/positions`;
    historyPush(voterGuideBallotItems);
    if (this.props.toggleFunction) {
      this.props.toggleFunction();
    }
  }

  goToBallotForDifferentElection (ballotLocationShortcut, ballotReturnedWeVoteId, googleCivicElectionId, originalTextForMapSearch = '') {
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
    } else if (originalTextForMapSearch && originalTextForMapSearch !== '') {
      // Do we still want to be updating addresses? Maybe instead just update google_civic_election_id?
      // console.log('goToBallotForDifferentElection, originalTextForMapSearch: ', originalTextForMapSearch);
      const simpleSave = false;
      VoterActions.voterAddressSave(originalTextForMapSearch, simpleSave, googleCivicElectionId);
      destinationUrlForHistoryPush = ballotBaseUrlClean; // Used with historyPush once modal is closed
    } else if (googleCivicElectionId && googleCivicElectionId !== 0) {
      BallotActions.voterBallotItemsRetrieve(googleCivicElectionId, '', '');
      // console.log('goToBallotForDifferentElection, googleCivicElectionId: ', googleCivicElectionId);
      destinationUrlForHistoryPush = `${ballotBaseUrlClean}/election/${googleCivicElectionId}`; // Used with historyPush once modal is closed
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

  executeDifferentElection (item) {
    if (item) {
      const { ballotBaseUrl } = this.props;
      if (ballotBaseUrl) {
        this.goToBallotForDifferentElection(item.ballot_location_shortcut, item.ballot_returned_we_vote_id, item.google_civic_election_id, item.original_text_for_map_search);
      } else {
        this.saveVoterGuideForElection(item.google_civic_election_id);
      }
    }
  }

  togglePriorElectionList () {
    const { priorElectionListOpen } = this.state;
    this.setState({
      priorElectionListOpen: !priorElectionListOpen,
    });
  }

  renderUpcomingElectionList (list, currentDate) {
    const renderedList = list.map((item) => {
      // console.log('item.election_description_text: ', item.election_description_text, 'item.election_day_text: ', item.election_day_text);
      if (!item.election_description_text || item.election_description_text === '') return null;
      const electionDateTomorrowMoment = moment(item.election_day_text, 'YYYY-MM-DD').add(1, 'days');
      const electionDateTomorrow = electionDateTomorrowMoment.format('YYYY-MM-DD');
      return electionDateTomorrow > currentDate ? (
        <div key={`upcoming-election-${item.google_civic_election_id}`}>
          <dl className="list-unstyled">
            <Button
              color="primary"
              fullWidth
              href=""
              id={`ballotElectionListWithFiltersButton-${item.google_civic_election_id}`}
              onClick={() => this.executeDifferentElection(item)}
              variant="contained"
            >
              <ButtonContentsWrapper>
                <ElectionName>
                  {/* Mobile */}
                  <span className="d-block d-sm-none">
                    { item.election_description_text.length < MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW ? (
                      <span>
                        {item.election_description_text}
                        &nbsp;
                      </span>
                    ) : (
                      <span>
                        {item.election_description_text.substring(0, MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW - 3)}
                        ...&nbsp;
                      </span>
                    )}
                  </span>
                  {/* Desktop */}
                  <span className="d-none d-sm-block">
                    { item.election_description_text.length < MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW_DESKTOP ? (
                      <span>
                        {item.election_description_text}
                        &nbsp;
                      </span>
                    ) : (
                      <span>
                        {item.election_description_text.substring(0, MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW_DESKTOP - 3)}
                        ...&nbsp;
                      </span>
                    )}
                  </span>
                </ElectionName>
                <ElectionDate>
                  {moment(item.election_day_text).format('MMM Do, YYYY')}
                </ElectionDate>
              </ButtonContentsWrapper>
            </Button>
          </dl>
        </div>
      ) :
        null;
    });
    return cleanArray(renderedList);
  }

  renderPriorElectionList (list, currentDate) {
    const renderedList = list.map((item) => {
      const electionDateTomorrowMoment = moment(item.election_day_text, 'YYYY-MM-DD').add(1, 'days');
      const electionDateTomorrow = electionDateTomorrowMoment.format('YYYY-MM-DD');
      return electionDateTomorrow > currentDate ?
        null : (
          <div key={`prior-election-${item.google_civic_election_id}`}>
            <dl className="list-unstyled prior-election-list">
              <Button
                color="primary"
                fullWidth
                href=""
                id={`ballotElectionListWithFiltersButton-${item.google_civic_election_id}`}
                onClick={() => this.executeDifferentElection(item)}
                variant="contained"
              >
                <ButtonContentsWrapper>
                  <ElectionName>
                    {/* Mobile */}
                    <span className="d-block d-sm-none">
                      { item.election_description_text.length < MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW ? (
                        <span>
                          {item.election_description_text}
                          &nbsp;
                        </span>
                      ) : (
                        <span>
                          {item.election_description_text.substring(0, MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW - 3)}
                          ...&nbsp;
                        </span>
                      )}
                    </span>
                    {/* Desktop */}
                    <span className="d-none d-sm-block">
                      { item.election_description_text.length < MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW_DESKTOP ? (
                        <span>
                          {item.election_description_text}
                          &nbsp;
                        </span>
                      ) : (
                        <span>
                          {item.election_description_text.substring(0, MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW_DESKTOP - 3)}
                          ...&nbsp;
                        </span>
                      )}
                    </span>
                  </ElectionName>
                  <ElectionDate>
                    {moment(item.election_day_text).format('MMM Do, YYYY')}
                  </ElectionDate>
                </ButtonContentsWrapper>
              </Button>
            </dl>
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
    const { hideUpcomingElectionTitle, showPriorElectionsList } = this.props;
    const { priorElectionListOpen } = this.state;

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

    let priorElectionList = [];
    if (showPriorElectionsList && priorElectionListOpen) {
      const ballotElectionListPastSorted = this.state.ballotElectionList.concat();
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

    return (
      <div className="ballot-election-list__list">
        <div className="ballot-election-list__upcoming">
          {!hideUpcomingElectionTitle && (
            <DelayedLoad waitBeforeShow={2000}>
              <h4 className="h4">
                Upcoming Election
                {(upcomingElectionList && upcomingElectionList.length !== 1) ? 's' : null }
              </h4>
            </DelayedLoad>
          )}
          { upcomingElectionList && upcomingElectionList.length ?
            upcomingElectionList : (
              <DelayedLoad showLoadingText waitBeforeShow={2000}>
                <>
                  There are no upcoming elections at this time.
                </>
              </DelayedLoad>
            )
          }
        </div>
        { showPriorElectionsList && (
          <div>
            {priorElectionListOpen ? (
              <div className="ballot-election-list__prior">
                <h4 className="h4">
                  Prior Election
                  {(priorElectionList && priorElectionList.length !== 1) ? 's' : null }
                </h4>
                {priorElectionList}
              </div>
            ) : (
              <ShowPriorElectionsWrapper>
                <Button
                  color="primary"
                  fullWidth
                  href=""
                  id="ballotElectionListWithFiltersShowPriorElections"
                  onClick={() => this.togglePriorElectionList()}
                  variant="outlined"
                >
                  Show Prior Elections
                </Button>
              </ShowPriorElectionsWrapper>
            )}
          </div>
        )}
      </div>
    );
  }
}

const ButtonContentsWrapper = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;

const ElectionName = styled.div`
  margin-right: auto;
`;

const ElectionDate = styled.div`
  margin-left: auto;
  font-size: 12px;
  font-weight: 100;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 12px;
  }
`;

const ShowPriorElectionsWrapper = styled.div`
  margin-bottom: 20px;
`;
