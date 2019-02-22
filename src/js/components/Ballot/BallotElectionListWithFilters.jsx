import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import BallotActions from '../../actions/BallotActions';
import BallotStore from '../../stores/BallotStore';
// import Button from '@material-ui/core/Button';
import { cordovaDot, historyPush } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import LoadingWheel from '../LoadingWheel';
import OrganizationActions from '../../actions/OrganizationActions';
import VoterActions from '../../actions/VoterActions';
import VoterStore from '../../stores/VoterStore';
import { cleanArray } from '../../utils/textFormat';
import convertStateCodeToStateText from '../../utils/address-functions';

const MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW = 36;

export default class BallotElectionListWithFilters extends Component {
  static propTypes = {
    ballotElectionList: PropTypes.array.isRequired,
    ballotBaseUrl: PropTypes.string,
    organization_we_vote_id: PropTypes.string, // If looking at voter guide, we pass in the parent organization_we_vote_id
    showRelevantElections: PropTypes.bool,
    toggleFunction: PropTypes.func,
  };

  constructor (props) {
    super(props);
    let priorElectionId = '';
    if (BallotStore.ballotProperties) {
      priorElectionId = BallotStore.ballotProperties.google_civic_election_id;
    } else if (VoterStore.electionId()) {
      priorElectionId = VoterStore.electionId();
    }
    const stateCode = VoterStore.getStateCodeFromIPAddress();

    this.state = {
      loadingNewBallotItems: false,
      priorElectionId,
      showMoreUpcomingElections: false,
      showMorePriorElections: false,
      showPriorElectionsList: true,
      stateName: convertStateCodeToStateText(stateCode),
      updatedElectionId: '',
    };

    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onBallotStoreChange () {
    // console.log("BallotElectionList.jsx onBallotStoreChange, priorElectionId: ", this.state.priorElectionId, ", updatedElectionId: ", this.state.updatedElectionId);
    // console.log("BallotStore.ballotProperties: ", BallotStore.ballotProperties);
    if (BallotStore.ballotProperties && BallotStore.ballotProperties.ballot_found && BallotStore.ballot && BallotStore.ballot.length === 0) {
      // Ballot is found but ballot is empty. We want to stay put.
      // console.log("onBallotStoreChange: ballot_with_all_items is empty");
    }
    if (this.state.priorElectionId !== this.state.updatedElectionId && this.state.loadingNewBallotItems && this.props.toggleFunction) {
      // console.log("onBallotStoreChange--------- loadingNewBallotItems:", this.state.loadingNewBallotItems);
      this.setState({
        loadingNewBallotItems: false,
        updatedElectionId: BallotStore.ballotProperties.google_civic_election_id,
      });
      // console.log("onBallotStoreChange--------- this.props.toggleFunction()");
      this.props.toggleFunction(this.state.destinationUrlForHistoryPush);
    }
  }

  onVoterStoreChange () {
    // console.log("BallotElectionList.jsx onVoterStoreChange, VoterStore.electionId(): ", VoterStore.electionId(), ", priorElectionId: ", this.state.priorElectionId, ", updatedElectionId: ", this.state.updatedElectionId);
    // if (BallotStore.ballotProperties && BallotStore.ballotProperties.ballot_found && BallotStore.ballot && BallotStore.ballot.length !== 0) {
    if (VoterStore.electionId() && VoterStore.electionId() !== this.state.priorElectionId) {
      if (this.state.loadingNewBallotItems && this.props.toggleFunction) {
        // console.log("onVoterStoreChange--------- loadingNewBallotItems:", this.state.loadingNewBallotItems);
        const stateCode = VoterStore.getStateCodeFromIPAddress();
        this.setState({
          loadingNewBallotItems: false,
          stateName: convertStateCodeToStateText(stateCode),
          updatedElectionId: VoterStore.electionId(),
        });
        // console.log("onVoterStoreChange--------- this.props.toggleFunction()");
        this.props.toggleFunction(this.state.destinationUrlForHistoryPush);
      }
    }
  }

  goToDifferentElection (ballotLocationShortcut, ballotReturnedWeVoteId, googleCivicElectionId, originalTextForMapSearch = '') {
    const ballotBaseurl = this.props.ballotBaseUrl || '/ballot';
    let destinationUrlForHistoryPush = '';
    if (ballotLocationShortcut && ballotLocationShortcut !== '' && ballotLocationShortcut !== 'none') {
      // console.log("goToDifferentElection, ballotLocationShortcut: ", ballotLocationShortcut);
      BallotActions.voterBallotItemsRetrieve(0, '', ballotLocationShortcut);
      destinationUrlForHistoryPush = `${ballotBaseurl}/${ballotLocationShortcut}`; // Used with historyPush once modal is closed
    } else if (ballotReturnedWeVoteId && ballotReturnedWeVoteId !== '' && ballotReturnedWeVoteId !== 'none') {
      // console.log("goToDifferentElection, ballotReturnedWeVoteId: ", ballotReturnedWeVoteId);
      BallotActions.voterBallotItemsRetrieve(0, ballotReturnedWeVoteId, '');
      destinationUrlForHistoryPush = `${ballotBaseurl}/id/${ballotReturnedWeVoteId}`; // Used with historyPush once modal is closed
    } else if (originalTextForMapSearch && originalTextForMapSearch !== '') {
      // Do we still want to be updating addresses? Maybe instead just update google_civic_election_id?
      // console.log("goToDifferentElection, originalTextForMapSearch: ", originalTextForMapSearch);
      const simpleSave = false;
      VoterActions.voterAddressSave(originalTextForMapSearch, simpleSave, googleCivicElectionId);
      destinationUrlForHistoryPush = ballotBaseurl; // Used with historyPush once modal is closed
    } else if (googleCivicElectionId && googleCivicElectionId !== 0) {
      BallotActions.voterBallotItemsRetrieve(googleCivicElectionId, '', '');
      // console.log("goToDifferentElection, googleCivicElectionId: ", googleCivicElectionId);
      destinationUrlForHistoryPush = `${ballotBaseurl}/election/${googleCivicElectionId}`; // Used with historyPush once modal is closed
    }

    // Request positions for the different election
    if (this.props.organization_we_vote_id && this.props.organization_we_vote_id !== '') {
      // console.log("BallotElectionList calling positionListForOpinionMaker, this.props.organization_we_vote_id: ", this.props.organization_we_vote_id, ", googleCivicElectionId:", googleCivicElectionId);
      OrganizationActions.positionListForOpinionMaker(this.props.organization_we_vote_id, true, false, googleCivicElectionId);
    }

    if (this.props.toggleFunction) {
      // console.log("goToDifferentElection, loadingNewBallotItems: ", this.state.loadingNewBallotItems);
      // console.log("goToDifferentElection, priorElectionId: ", this.state.priorElectionId, ", updatedElectionId: ", this.state.updatedElectionId);
      this.setState({
        destinationUrlForHistoryPush,
        loadingNewBallotItems: true,
        priorElectionId: BallotStore.ballotProperties.google_civic_election_id || VoterStore.electionId() || 0,
        updatedElectionId: 0,
      });
    } else {
      historyPush(destinationUrlForHistoryPush);
    }
  }

  filterElectionsInState (electionList) {
    // return electionList.filter(election => this.isElectionInState(election));
    return electionList; // this is just a temporary solution
  }

  // filterElectionsOutsideState (electionList) {
  //   return electionList.filter(election => !this.isElectionInState(election));
  // }

  isElectionInState (election) {
    const electionName = election.election_description_text;
    if (this.state.stateName.length && electionName.includes(this.state.stateName)) {
      return true;
    }
    // show all national elections regardless of state
    // return election.is_national;
    return electionName.includes('U.S.') ||
           electionName.includes('US') ||
           electionName.includes('United States');
  }


  toggleShowMoreUpcomingElections () {
    this.setState(prevState => ({ showMoreUpcomingElections: !prevState.showMoreUpcomingElections }));
  }

  toggleShowMorePriorElections () {
    this.setState(prevState => ({ showMorePriorElections: !prevState.showMorePriorElections }));
  }

  toggleShowPriorElectionsList () {
    this.setState(prevState => ({ showPriorElectionsList: !prevState.showPriorElectionsList }));
  }

  renderUpcomingElectionList (list, currentDate) {
    const renderedList = list.map((item) => {
      const electionDateTomorrowMoment = moment(item.election_day_text, 'YYYY-MM-DD').add(1, 'days');
      const electionDateTomorrow = electionDateTomorrowMoment.format('YYYY-MM-DD');
      return electionDateTomorrow > currentDate ? (
        <div key={`upcoming-election-${item.google_civic_election_id}`}>
          <dl className="list-unstyled text-center">
            <button
              type="button"
              className="btn btn-success ballot-election-list__button"
              onClick={this.goToDifferentElection.bind(this, item.ballot_location_shortcut, item.ballot_returned_we_vote_id, item.google_civic_election_id, item.original_text_for_map_search)}
            >
              {/* Mobile */}
              { item.election_description_text.length < MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW ? (
                <span className="d-block d-sm-none">
                  {item.election_description_text}
                  &nbsp;
                  <img
                    src={cordovaDot('/img/global/icons/Circle-Arrow.png')}
                  />
                </span>
              ) : (
                <span
                  className="d-block d-sm-none"
                >
                  {item.election_description_text.substring(0, MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW - 3)}
                  ...&nbsp;
                  <img src={cordovaDot('/img/global/icons/Circle-Arrow.png')} alt="circle arrow" />
                </span>
              )}
              {/* Desktop */}
              <span className="d-none d-sm-block">
                {moment(item.election_day_text).format('MMMM Do, YYYY')}
                {' '}
                -
                {' '}
                {item.election_description_text}
                &nbsp;
                <img
                  src={cordovaDot('/img/global/icons/Circle-Arrow.png')}
                />
              </span>

              <div className="d-block d-sm-none ballot-election-list__h2">{moment(item.election_day_text).format('MMMM Do, YYYY')}</div>
            </button>
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
            <dl className="list-unstyled text-center">
              <button
                type="button"
                className="btn btn-success ballot-election-list__button"
                onClick={this.goToDifferentElection.bind(this, item.ballot_location_shortcut, item.ballot_returned_we_vote_id, item.google_civic_election_id, item.original_text_for_map_search)}
              >
                {/* Mobile */}
                { item.election_description_text.length < MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW ? (
                  <span className="d-block d-sm-none">
                    {item.election_description_text}
                    &nbsp;
                    <img
                      src={cordovaDot('/img/global/icons/Circle-Arrow.png')}
                    />
                  </span>
                ) : (
                  <span
                    className="d-block d-sm-none"
                  >
                    {item.election_description_text.substring(0, MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW - 3)}
                    ...&nbsp;
                    <img src={cordovaDot('/img/global/icons/Circle-Arrow.png')} alt="circle arrow" />
                  </span>
                )}
                {/* Desktop */}
                <span className="d-none d-sm-block">
                  {moment(item.election_day_text).format('MMMM Do, YYYY')}
                  {' '}
                  -
                  {' '}
                  {item.election_description_text}
                  &nbsp;
                  <img
                    src={cordovaDot('/img/global/icons/Circle-Arrow.png')}
                  />
                </span>

                <div className="d-block d-sm-none ballot-election-list__h2">{moment(item.election_day_text).format('MMMM Do, YYYY')}</div>
              </button>
            </dl>
          </div>
        );
    });
    return cleanArray(renderedList);
  }

  render () {
    renderLog(__filename);
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

    const ballotElectionListUpcomingSorted = this.props.ballotElectionList.concat();
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

    const ballotElectionListPastSorted = this.props.ballotElectionList.concat();
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

    const upcomingElectionList = this.renderUpcomingElectionList(ballotElectionListUpcomingSorted, currentDate);
    const priorElectionList = this.renderPriorElectionList(ballotElectionListPastSorted, currentDate);

    if (this.props.showRelevantElections) {
      const upcomingBallotElectionListInState = this.filterElectionsInState(ballotElectionListUpcomingSorted);
      const priorBallotElectionListInState = this.filterElectionsInState(ballotElectionListPastSorted);

      const upcomingElectionListInState = this.renderUpcomingElectionList(upcomingBallotElectionListInState, currentDate);
      const priorElectionListInState = this.renderPriorElectionList(priorBallotElectionListInState, currentDate);

      // If there are no upcoming elections and no prior elections (anywhere in the country), return empty div
      if (!upcomingElectionList.length && !priorElectionList.length) {
        return (
          <div />
        );
      }

      // December 2018, these nested ternary expression should get fixed at some point

      return (
        <div className="ballot-election-list__list">
          <div className="ballot-election-list__upcoming">
            <h4 className="h4">
            Upcoming Election
              { (upcomingElectionListInState && upcomingElectionListInState.length !== 1 && !this.state.showMoreUpcomingElections) ||
                (upcomingElectionList && upcomingElectionList.length !== 1 && this.state.showMoreUpcomingElections) ? 's' : null
              }
              { this.state.stateName && this.state.stateName.length && !this.state.showMoreUpcomingElections ?
                ` in ${this.state.stateName}` :
                null
              }
            </h4>
            { this.state.showMoreUpcomingElections ?    // eslint-disable-line no-nested-ternary
              upcomingElectionList && upcomingElectionList.length ?
                upcomingElectionList :
                'There are no upcoming elections at this time.' :
              upcomingElectionListInState && upcomingElectionListInState.length ?
                upcomingElectionListInState :
                'There are no upcoming elections in the state you are in at this time.'
            }
          </div>
          { this.state.showPriorElectionsList ? (
            <div className="ballot-election-list__prior">
              { priorElectionListInState && priorElectionListInState.length ? (
                <h4 className="h4">
                Prior Election
                  { (priorElectionListInState.length > 1 ||
                    (priorElectionList && priorElectionList.length > 1)) ?
                    's' :
                    null
                  }
                  { this.state.stateName && this.state.stateName.length && !this.state.showMorePriorElections ?
                    ` in ${this.state.stateName}` :
                    null
                  }
                </h4>
              ) : null
              }
              { this.state.showMorePriorElections ?    // eslint-disable-line no-nested-ternary
                priorElectionList && priorElectionList.length ?
                  priorElectionList :
                  null :
                priorElectionListInState && priorElectionListInState.length ?
                  priorElectionListInState :
                  null
              }
            </div>
          ) : (
            <div className="ballot-election-list__prior">
              <a className="ballot-election-list__toggle-link" onClick={this.toggleShowPriorElectionsList.bind(this)}>
                Show prior elections
              </a>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="ballot-election-list__list">
          <div className="ballot-election-list__upcoming">
            { upcomingElectionList && upcomingElectionList.length ? (
              <h4 className="h4">
                Upcoming Election
                { upcomingElectionList.length > 1 ? 's' : null }
              </h4>
            ) :
              null
            }
            { upcomingElectionList && upcomingElectionList.length ? upcomingElectionList : null }
          </div>

          <div className="ballot-election-list__prior">
            { priorElectionList && priorElectionList.length ? (
              <h4 className="h4">
                Prior Election
                { priorElectionList.length > 1 ? 's' : null }
              </h4>
            ) :
              null
            }
            { priorElectionList && priorElectionList.length ? priorElectionList : null }
          </div>
        </div>
      );
    }
  }
}
