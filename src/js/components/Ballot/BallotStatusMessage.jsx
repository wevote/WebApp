import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';
import BallotStore from '../../stores/BallotStore';
import cookies from '../../utils/cookies';
import ElectionStore from '../../stores/ElectionStore';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';

const styles = theme => ({
  anchorOriginBottomCenter: {
    bottom: 54,
    [theme.breakpoints.up('md')]: {
      bottom: 20,
    },
  },
});

class BallotStatusMessage extends Component {
  static propTypes = {
    ballotLocationChosen: PropTypes.bool.isRequired,
    googleCivicElectionId: PropTypes.number,
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      ballotLocationChosen: false,
      ballotLocationDisplayName: '',
      componentDidMountFinished: false,
      electionDayText: '',
      electionIsUpcoming: false,
      electionsWithBallotStatusMessageClosed: [],
      googleCivicElectionId: 0,
      showBallotStatus: true,
      substitutedAddressNearby: '',
      voterEnteredAddress: false,
      voterSpecificBallotFromGoogleCivic: false,
      open: true,
    };

    this.handleMessageClose = this.handleMessageClose.bind(this);
  }

  componentDidMount () {
    // console.log("In BallotStatusMessage componentDidMount");
    const electionsWithBallotStatusMessageClosedValueFromCookie = cookies.getItem('elections_with_ballot_status_message_closed');
    let electionsWithBallotStatusMessageClosed = [];
    if (electionsWithBallotStatusMessageClosedValueFromCookie) {
      electionsWithBallotStatusMessageClosed = JSON.parse(electionsWithBallotStatusMessageClosedValueFromCookie) || [];
    }

    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.electionStoreListener = ElectionStore.addListener(this.onBallotStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onBallotStoreChange.bind(this));

    this.setState({
      ballotLocationChosen: this.props.ballotLocationChosen,
      componentDidMountFinished: true,
      googleCivicElectionId: this.props.googleCivicElectionId,
      showBallotStatus: true,
      electionsWithBallotStatusMessageClosed,
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log("BallotStatusMessage componentWillReceiveProps");
    this.setState({
      ballotLocationChosen: nextProps.ballotLocationChosen,
      googleCivicElectionId: this.props.googleCivicElectionId,
      showBallotStatus: true,
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.state.componentDidMountFinished === false) {
      // console.log("shouldComponentUpdate: componentDidMountFinished === false");
      return true;
    }
    if (this.state.ballotLocationChosen !== nextState.ballotLocationChosen) {
      // console.log("shouldComponentUpdate: changed, this.state.ballotLocationChosen: ", this.state.ballotLocationChosen, ", nextState.ballotLocationChosen", nextState.ballotLocationChosen);
      return true;
    }
    if (this.state.ballotLocationDisplayName !== nextState.ballotLocationDisplayName) {
      // console.log("shouldComponentUpdate: changed, this.state.ballotLocationDisplayName: ", this.state.ballotLocationDisplayName, ", nextState.ballotLocationDisplayName", nextState.ballotLocationDisplayName);
      return true;
    }
    if (this.state.electionDayText !== nextState.electionDayText) {
      // console.log("shouldComponentUpdate: changed, this.state.electionDayText: ", this.state.electionDayText, ", nextState.electionDayText", nextState.electionDayText);
      return true;
    }
    if (this.state.electionIsUpcoming !== nextState.electionIsUpcoming) {
      // console.log("shouldComponentUpdate: changed, this.state.electionIsUpcoming: ", this.state.electionIsUpcoming, ", nextState.electionIsUpcoming", nextState.electionIsUpcoming);
      return true;
    }
    if (this.state.substitutedAddressNearby !== nextState.substitutedAddressNearby) {
      // console.log("shouldComponentUpdate: changed, this.state.substitutedAddressNearby: ", this.state.substitutedAddressNearby, ", nextState.substitutedAddressNearby", nextState.substitutedAddressNearby);
      return true;
    }
    if (this.state.voterEnteredAddress !== nextState.voterEnteredAddress) {
      // console.log("shouldComponentUpdate: changed, this.state.voterEnteredAddress: ", this.state.voterEnteredAddress, ", nextState.voterEnteredAddress", nextState.voterEnteredAddress);
      return true;
    }
    if (this.state.voterSpecificBallotFromGoogleCivic !== nextState.voterSpecificBallotFromGoogleCivic) {
      // console.log("shouldComponentUpdate: changed, this.state.voterSpecificBallotFromGoogleCivic: ", this.state.voterSpecificBallotFromGoogleCivic, ", nextState.voterSpecificBallotFromGoogleCivic", nextState.voterSpecificBallotFromGoogleCivic);
      return true;
    }
    if (this.state.open !== nextState.open) {
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    // console.log("Ballot componentWillUnmount");
    this.ballotStoreListener.remove();
    this.electionStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onBallotStoreChange () {
    let ballotLocationDisplayName = '';
    const { googleCivicElectionId } = this.state;
    const electionDayText = ElectionStore.getElectionDayText(googleCivicElectionId);
    const electionIsUpcoming = ElectionStore.isElectionUpcoming(googleCivicElectionId);
    let substitutedAddressNearby = '';
    const voterBallotLocation = VoterStore.getBallotLocationForVoter();
    let voterEnteredAddress = false;
    let voterSpecificBallotFromGoogleCivic = false;

    if (voterBallotLocation && voterBallotLocation.voter_entered_address) {
      voterEnteredAddress = true;
    }

    if (voterBallotLocation && voterBallotLocation.voter_specific_ballot_from_google_civic) {
      voterSpecificBallotFromGoogleCivic = true;
    }

    if (BallotStore.ballotProperties && BallotStore.ballotProperties.ballot_location_display_name) {
      // console.log("BallotStore.ballotProperties:", BallotStore.ballotProperties);
      ballotLocationDisplayName = BallotStore.ballotProperties.ballot_location_display_name;
    } else if (voterBallotLocation && voterBallotLocation.ballot_location_display_name) {
      // Get the location name from the VoterStore address object
      // console.log("voterBallotLocation:", voterBallotLocation);
      ballotLocationDisplayName = voterBallotLocation.ballot_location_display_name;
    }

    if (BallotStore.ballotProperties && BallotStore.ballotProperties.substituted_address_nearby) {
      if (BallotStore.ballotProperties.substituted_address_city && BallotStore.ballotProperties.substituted_address_state && BallotStore.ballotProperties.substituted_address_zip) {
        substitutedAddressNearby = `${BallotStore.ballotProperties.substituted_address_city}, `;
        substitutedAddressNearby += `${BallotStore.ballotProperties.substituted_address_state} `;
        substitutedAddressNearby += BallotStore.ballotProperties.substituted_address_zip;
      } else {
        substitutedAddressNearby = BallotStore.ballotProperties.substituted_address_nearby;
      }
    } else if (voterBallotLocation && voterBallotLocation.text_for_map_search) {
      // Get the location from the VoterStore address object
      substitutedAddressNearby = voterBallotLocation.text_for_map_search;
    }
    // console.log("BallotStatusMessage, onBallotStoreChange, electionDayText: ", electionDayText, "electionIsUpcoming: ", electionIsUpcoming, "substitutedAddressNearby: ", substitutedAddressNearby);
    this.setState({
      ballotLocationDisplayName,
      electionDayText,
      electionIsUpcoming,
      substitutedAddressNearby,
      voterEnteredAddress,
      voterSpecificBallotFromGoogleCivic,
    });
  }

  handleMessageClose () {
    // setting cookie to track the elections where user has closed the warning messages for them
    if (this.props.googleCivicElectionId) {
      const { electionsWithBallotStatusMessageClosed } = this.state;
      const electionsWithBallotStatusMessageClosedUpdated = [...electionsWithBallotStatusMessageClosed, this.props.googleCivicElectionId];
      const electionsWithBallotStatusMessageClosedForCookie = JSON.stringify(electionsWithBallotStatusMessageClosedUpdated);
      cookies.setItem('elections_with_ballot_status_message_closed', electionsWithBallotStatusMessageClosedForCookie, Infinity, '/');
      this.setState({
        electionsWithBallotStatusMessageClosed: electionsWithBallotStatusMessageClosedUpdated,
        open: false,
      });
    }
  }

  render () {
    // console.log("BallotStatusMessage render");
    renderLog(__filename);
    const { classes } = this.props;
    let messageString = '';
    const today = moment(new Date());
    const isVotingDay = today.isSame(this.state.electionDayText, 'day');

    if (isVotingDay) {
      messageString = `It is Voting Day,  ${
        moment(this.state.electionDayText).format('MMM Do, YYYY')
      }.  If you haven't already voted, please go vote!`;
      // I don't think this is necessary on election day.
      // messageString += !this.state.voterSpecificBallotFromGoogleCivic && this.state.ballotLocationChosen && this.state.ballotLocationDisplayName ?
      //   "  Some items shown below may not have been on your official ballot." : "  Some items below may not have been on your official ballot.";
    } else if (this.state.electionIsUpcoming) {
      if (this.state.voterSpecificBallotFromGoogleCivic) {
        // We do not have an equivalent flag when we retrieve a ballot from Ballotpedia
        messageString += ''; // No additional text
      } else if (this.state.ballotLocationChosen && this.state.substitutedAddressNearby) {
        messageString += `This is a ballot for ${this.state.substitutedAddressNearby}.`;
        // This does not make sense when using Ballotpedia, since we don't know if voter entered a full address:  Enter your full address to see your official ballot.
      } else if (this.state.voterEnteredAddress) {
        messageString += "This is our best guess for what's on your ballot.";
        // I'm not sure we need to introduce doubt, expecially since sometime this appears after someone enters their full address.
        // messageString += "Some items below may not be on your official ballot.";
      }
    } else {
      let messageInPastString;
      if (this.state.electionDayText) {
        messageInPastString = `This election was held on ${moment(this.state.electionDayText).format('MMM Do, YYYY')}.`;
      } else {
        messageInPastString = ''; // Was "This election has passed." but it showed up inaccurately.
      }

      if (this.state.voterSpecificBallotFromGoogleCivic) {
        messageString += messageInPastString; // No additional text
      } else if (this.state.ballotLocationChosen && this.state.ballotLocationDisplayName) {
        messageString += messageInPastString;
        // Not sure the benefit of adding this doubt. messageString += " Some items shown below may not have been on your official ballot.";
      } else {
        messageString += messageInPastString;
        // Not sure the benefit of adding this doubt. + " Some items below may not have been on your official ballot.";
      }
    }

    let messageStringLength = 0;
    if (messageString) {
      messageStringLength = messageString.length;
    }

    let electionBallotStatusMessageShouldBeClosed = false;
    if (this.props.googleCivicElectionId) {
      electionBallotStatusMessageShouldBeClosed = this.state.electionsWithBallotStatusMessageClosed.includes(this.props.googleCivicElectionId);
    }

    if (electionBallotStatusMessageShouldBeClosed) {
      return null;
    } else if (this.state.showBallotStatus && messageStringLength > 0) {
      return (
        <Snackbar
          classes={{ anchorOriginBottomCenter: classes.anchorOriginBottomCenter }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.open && messageStringLength > 0}
          autoHideDuration={5000}
          onClose={this.handleMessageClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{messageString}</span>}
        />
      );
    } else {
      return <React.Fragment />;
    }
  }
}

export default withStyles(styles)(BallotStatusMessage);
