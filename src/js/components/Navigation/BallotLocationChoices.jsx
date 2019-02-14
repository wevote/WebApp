import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import BallotActions from '../../actions/BallotActions';
import BallotStore from '../../stores/BallotStore';
import { historyPush, isCordova } from '../../utils/cordovaUtils';
import ElectionStore from '../../stores/ElectionStore';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';
import { calculateBallotBaseUrl } from '../../utils/textFormat';

// December 2018:  We want to work toward being airbnb style compliant, but for now these are disabled in this file to minimize massive changes
/* eslint no-restricted-syntax: 1 */

export default class BallotLocationChoices extends Component {
  static propTypes = {
    ballotBaseUrl: PropTypes.string,
    googleCivicElectionId: PropTypes.number.isRequired,
    pathname: PropTypes.string,
    showElectionName: PropTypes.bool,
    toggleFunction: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {
      googleCivicElectionId: 0,
      showAllBallotLocations: false,
    };

    this.goToDifferentBallot = this.goToDifferentBallot.bind(this);
    this.showAllBallotLocationsToggle = this.showAllBallotLocationsToggle.bind(this);
  }

  componentDidMount () {
    // console.log("In BallotLocationChoices componentDidMount,  this.props.googleCivicElectionId: ", this.props.googleCivicElectionId);
    this.electionStoreListener = ElectionStore.addListener(this.onElectionStoreChange.bind(this));
    this.setState({
      ballotLocationList: this.retrieveBallotLocationList(this.props.googleCivicElectionId),
      googleCivicElectionId: this.props.googleCivicElectionId,
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log("BallotLocationChoices componentWillReceiveProps, nextProps.googleCivicElectionId: ", nextProps.googleCivicElectionId);
    this.setState({
      ballotLocationList: this.retrieveBallotLocationList(nextProps.googleCivicElectionId),
      googleCivicElectionId: nextProps.googleCivicElectionId,
    });
  }

  componentWillUnmount () {
    // console.log("BallotLocationChoices componentWillUnmount");
    this.electionStoreListener.remove();
  }

  onElectionStoreChange () {
    // console.log("BallotLocationChoices, onElectionStoreChange");
    const { googleCivicElectionId } = this.state;
    this.setState({
      ballotLocationList: this.retrieveBallotLocationList(googleCivicElectionId),
    });
  }

  retrieveBallotLocationList (googleCivicElectionId) {
    // console.log("retrieveBallotLocationList, googleCivicElectionId: ", googleCivicElectionId);
    if (!googleCivicElectionId || googleCivicElectionId === 0) {
      return [];
    }
    const ballotLocationsForElectionUnsorted = ElectionStore.getBallotLocationsForElection(googleCivicElectionId) || [];
    const ballotLocationsForElectionSorted = this.sortBallotLocations(ballotLocationsForElectionUnsorted) || [];
    const ballotLocationForVoter = VoterStore.getBallotLocationForVoter();
    if (ballotLocationForVoter && ballotLocationForVoter.ballot_returned_we_vote_id) {
      let ballotLocationForVoterInList = false;
      // If the election in the ballotLocationForVoter matches the election we are looking at,
      // include the voter's displayed address
      // console.log("retrieveBallotLocationList, googleCivicElectionId: ", googleCivicElectionId, ", ballotLocationForVoter: ", ballotLocationForVoter);
      if (ballotLocationForVoter.google_civic_election_id === googleCivicElectionId) {
        // TODO: Steve remove the error suppression on the next line 12/1/18, a temporary hack
        ballotLocationsForElectionSorted.map((ballotLocation) => { // eslint-disable-line array-callback-return
          if (ballotLocation.ballot_returned_we_vote_id === ballotLocationForVoter.ballot_returned_we_vote_id) {
            ballotLocationForVoterInList = true;
          }
        });

        if (!ballotLocationForVoterInList) {
          // The this ballot isn't already in the list, add it to the start
          ballotLocationsForElectionSorted.unshift(ballotLocationForVoter); // Add to the start of the array
          // console.log("Added to start of ballotLocationsForElectionSorted: ", ballotLocationForVoter);
        }
      }
    }
    return ballotLocationsForElectionSorted;
  }

  sortBallotLocations (ballotLocationsForElectionUnsorted) {
    const orderedArray = [];
    if (ballotLocationsForElectionUnsorted) {
      // temporary array holds objects with position and sort-value
      const mapped = ballotLocationsForElectionUnsorted.map((ballotLocation, i) => ({ index: i, value: ballotLocation }));

      // sorting the mapped array based on ballot_location_order which came from the server
      mapped.sort((a, b) => +(parseInt(a.value.ballot_location_order, 10) > parseInt(b.value.ballot_location_order, 10)) ||
      +(parseInt(a.value.ballot_location_order, 10) === parseInt(b.value.ballot_location_order, 10)) - 1);

      for (const element of mapped) {
        orderedArray.push(element.value);
      }
    }
    return orderedArray;
  }

  goToDifferentBallot (ballotReturnedWeVoteId = '', ballotLocationShortcut = '') {
    const ballotBaseUrl = calculateBallotBaseUrl(this.props.ballotBaseUrl, this.props.pathname);

    // console.log("BallotLocationChoices, goToDifferentBallot, ballotReturnedWeVoteId: ", ballotReturnedWeVoteId);
    // console.log("BallotLocationChoices, goToDifferentBallot, ballotLocationShortcut: ", ballotLocationShortcut);
    if (ballotLocationShortcut !== '' && ballotLocationShortcut !== undefined) {
      BallotActions.voterBallotItemsRetrieve(0, '', ballotLocationShortcut);
      // Change the URL to match
      historyPush(`${ballotBaseUrl}/${ballotLocationShortcut}`);
    } else if (ballotReturnedWeVoteId !== '' && ballotReturnedWeVoteId !== undefined) {
      BallotActions.voterBallotItemsRetrieve(0, ballotReturnedWeVoteId, '');
      // Change the URL to match
      historyPush(`${ballotBaseUrl}/id/${ballotReturnedWeVoteId}`);
    }
    if (this.props.toggleFunction) {
      this.props.toggleFunction();
    }
  }

  showAllBallotLocationsToggle () {
    const { showAllBallotLocations } = this.state;
    this.setState({ showAllBallotLocations: !showAllBallotLocations });
  }

  render () {
    renderLog(__filename);
    // Commented out for 2018 Election
    // const default_number_of_ballot_locations_mobile = 5;
    // const default_number_of_ballot_locations_desktop = 5;
    const electionName = BallotStore.currentBallotElectionName;
    const electionDayText = BallotStore.currentBallotElectionDate;
    const electionDayTextFormatted = electionDayText ? <span>{moment(electionDayText).format('MMM Do, YYYY')}</span> : <span />;
    // console.log("In BallotLocationChoices render, ballotLocationList: ", this.state.ballotLocationList);
    if (this.state.ballotLocationList && this.state.ballotLocationList.length) {
      return (
        <div className="u-stack--sm ballot-locations d-print-none">
          { this.props.showElectionName ? (
            <h4 className={isCordova() ? 'ballot__header__title__cordova h4' : 'ballot__header__title h4'}>
              <span className="u-push--sm">
                {electionName}
                {' '}
                <span className="d-none d-sm-inline">&mdash; </span>
                <span className="u-gray-mid u-no-break">{electionDayTextFormatted}</span>
              </span>
            </h4>
          ) :
            null }
          {/* Commented out for 2018 Election
        <div className="btn-group">
          Mobile display of buttons
          <div className="d-block d-sm-none">
            {this.state.ballotLocationList.slice(0, default_number_of_ballot_locations_mobile).map((ballot_location, key) => {
              return <BallotLocationButton key={key} ballot_location={ballot_location} goToDifferentBallot={this.goToDifferentBallot} />;
            })}
            <span className={this.state.showAllBallotLocations ? "" : "u-hidden"}>
              {this.state.ballotLocationList.slice(default_number_of_ballot_locations_mobile).map((ballot_location, key) => {
                return <BallotLocationButton key={key} ballot_location={ballot_location} goToDifferentBallot={this.goToDifferentBallot} />;
              })}
            </span>
            { this.state.ballotLocationList.length > default_number_of_ballot_locations_mobile ?
              <span>
                <a onClick={this.showAllBallotLocationsToggle} className="u-no-break">
                  {this.state.showAllBallotLocations ? "Hide" : "Show more" }
                </a>
              </span> :
              null }
          </div>

          Desktop display of buttons
          <div className="d-none d-sm-block">
            {this.state.ballotLocationList.slice(0, default_number_of_ballot_locations_desktop).map((ballot_location, key) => {
              return <BallotLocationButton key={key} ballot_location={ballot_location} goToDifferentBallot={this.goToDifferentBallot} />;
            })}
            <span className={this.state.showAllBallotLocations ? "" : "u-hidden"}>
              {this.state.ballotLocationList.slice(default_number_of_ballot_locations_desktop).map((ballot_location, key) => {
                return <BallotLocationButton key={key} ballot_location={ballot_location} goToDifferentBallot={this.goToDifferentBallot} />;
              })}
            </span>
            { this.state.ballotLocationList.length > default_number_of_ballot_locations_desktop ?
              <span>
                <a onClick={this.showAllBallotLocationsToggle} className="u-no-break">
                  {this.state.showAllBallotLocations ? "Hide" : "Show " + Math.max(0, this.state.ballotLocationList.length - default_number_of_ballot_locations_desktop) + " more" }
                </a>
              </span> :
              null }
          </div>
        </div>  */}
        </div>
      );
    } else {
      return <div />;
    }
  }
}
