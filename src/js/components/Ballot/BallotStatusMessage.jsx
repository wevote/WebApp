import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import BallotStore from "../../stores/BallotStore";
import cookies from "../../utils/cookies";
import ElectionStore from "../../stores/ElectionStore";
import { renderLog } from "../../utils/logging";
import VoterStore from "../../stores/VoterStore";

export default class BallotStatusMessage extends Component {
  static propTypes = {
    ballot_location_chosen: PropTypes.bool.isRequired,
    toggleSelectBallotModal: PropTypes.func,
    google_civic_election_id: PropTypes.number,
  };

  constructor (props) {
    super(props);
    this.state = {
      ballot_location_chosen: false,
      ballot_location_display_name: "",
      componentDidMountFinished: false,
      election_day_text: "",
      election_is_upcoming: false,
      elections_with_ballot_status_message_closed: [],
      google_civic_data_exists: false,
      show_ballot_status: true,
      substituted_address_nearby: "",
      voter_entered_address: false,
      voter_specific_ballot_from_google_civic: false,
    };
  }

  componentDidMount () {
    // console.log("In BallotStatusMessage componentDidMount");
    let electionsWithBallotStatusMessageClosedValueFromCookie = cookies.getItem("elections_with_ballot_status_message_closed");
    let electionsWithBallotStatusMessageClosed = [];
    if (electionsWithBallotStatusMessageClosedValueFromCookie) {
      electionsWithBallotStatusMessageClosed = JSON.parse(electionsWithBallotStatusMessageClosedValueFromCookie) || [];
    }

    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.electionStoreListener = ElectionStore.addListener(this.onBallotStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onBallotStoreChange.bind(this));

    this.setState({
      ballot_location_chosen: this.props.ballot_location_chosen,
      componentDidMountFinished: true,
      google_civic_election_id: this.props.google_civic_election_id,
      show_ballot_status: true,
      electionsWithBallotStatusMessageClosed,
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log("BallotStatusMessage componentWillReceiveProps");
    this.setState({
      ballot_location_chosen: nextProps.ballot_location_chosen,
      google_civic_election_id: this.props.google_civic_election_id,
      show_ballot_status: true,
    });
  }

  componentWillUnmount () {
    // console.log("Ballot componentWillUnmount");
    this.ballotStoreListener.remove();
    this.electionStoreListener.remove();
    this.voterStoreListener.remove();
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.state.componentDidMountFinished === false) {
      // console.log("shouldComponentUpdate: componentDidMountFinished === false");
      return true;
    }
    if (this.state.ballot_location_chosen !== nextState.ballot_location_chosen) {
      // console.log("shouldComponentUpdate: changed, this.state.ballot_location_chosen: ", this.state.ballot_location_chosen, ", nextState.ballot_location_chosen", nextState.ballot_location_chosen);
      return true;
    }
    if (this.state.ballot_location_display_name !== nextState.ballot_location_display_name) {
      // console.log("shouldComponentUpdate: changed, this.state.ballot_location_display_name: ", this.state.ballot_location_display_name, ", nextState.ballot_location_display_name", nextState.ballot_location_display_name);
      return true;
    }
    if (this.state.election_day_text !== nextState.election_day_text) {
      // console.log("shouldComponentUpdate: changed, this.state.election_day_text: ", this.state.election_day_text, ", nextState.election_day_text", nextState.election_day_text);
      return true;
    }
    if (this.state.election_is_upcoming !== nextState.election_is_upcoming) {
      // console.log("shouldComponentUpdate: changed, this.state.election_is_upcoming: ", this.state.election_is_upcoming, ", nextState.election_is_upcoming", nextState.election_is_upcoming);
      return true;
    }
    if (this.state.substituted_address_nearby !== nextState.substituted_address_nearby) {
      // console.log("shouldComponentUpdate: changed, this.state.substituted_address_nearby: ", this.state.substituted_address_nearby, ", nextState.substituted_address_nearby", nextState.substituted_address_nearby);
      return true;
    }
    if (this.state.voter_entered_address !== nextState.voter_entered_address) {
      // console.log("shouldComponentUpdate: changed, this.state.voter_entered_address: ", this.state.voter_entered_address, ", nextState.voter_entered_address", nextState.voter_entered_address);
      return true;
    }
    if (this.state.voter_specific_ballot_from_google_civic !== nextState.voter_specific_ballot_from_google_civic) {
      // console.log("shouldComponentUpdate: changed, this.state.voter_specific_ballot_from_google_civic: ", this.state.voter_specific_ballot_from_google_civic, ", nextState.voter_specific_ballot_from_google_civic", nextState.voter_specific_ballot_from_google_civic);
      return true;
    }
    return false;
  }

  onBallotStoreChange () {
    let ballot_location_display_name = "";
    let election_day_text = ElectionStore.getElectionDayText(this.state.google_civic_election_id);
    let election_is_upcoming = ElectionStore.isElectionUpcoming(this.state.google_civic_election_id);
    let google_civic_data_exists = ElectionStore.googleCivicDataExists(this.state.google_civic_election_id);
    let substituted_address_nearby = "";
    let voter_ballot_location = VoterStore.getBallotLocationForVoter();
    let voter_entered_address = false;
    let voter_specific_ballot_from_google_civic = false;

    if (voter_ballot_location && voter_ballot_location.voter_entered_address) {
      voter_entered_address = true;
    }

    if (voter_ballot_location && voter_ballot_location.voter_specific_ballot_from_google_civic) {
      voter_specific_ballot_from_google_civic = true;
    }

    if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_location_display_name) {
      // console.log("BallotStore.ballot_properties:", BallotStore.ballot_properties);
      ballot_location_display_name = BallotStore.ballot_properties.ballot_location_display_name;
    } else if (voter_ballot_location && voter_ballot_location.ballot_location_display_name) {
      // Get the location name from the VoterStore address object
      // console.log("voter_ballot_location:", voter_ballot_location);
      ballot_location_display_name = voter_ballot_location.ballot_location_display_name;
    }

    if (BallotStore.ballot_properties && BallotStore.ballot_properties.substituted_address_nearby) {
      if (BallotStore.ballot_properties.substituted_address_city && BallotStore.ballot_properties.substituted_address_state && BallotStore.ballot_properties.substituted_address_zip) {
        substituted_address_nearby = BallotStore.ballot_properties.substituted_address_city + ", ";
        substituted_address_nearby += BallotStore.ballot_properties.substituted_address_state + " ";
        substituted_address_nearby += BallotStore.ballot_properties.substituted_address_zip;
      } else {
        substituted_address_nearby = BallotStore.ballot_properties.substituted_address_nearby;
      }
    } else if (voter_ballot_location && voter_ballot_location.text_for_map_search) {
      // Get the location from the VoterStore address object
      substituted_address_nearby = voter_ballot_location.text_for_map_search;
    }
    // console.log("BallotStatusMessage, onBallotStoreChange, election_day_text: ", election_day_text, "election_is_upcoming: ", election_is_upcoming, "substituted_address_nearby: ", substituted_address_nearby);
    this.setState({
      ballot_location_display_name: ballot_location_display_name,
      election_day_text: election_day_text,
      election_is_upcoming: election_is_upcoming,
      google_civic_data_exists: google_civic_data_exists,
      substituted_address_nearby: substituted_address_nearby,
      voter_entered_address: voter_entered_address,
      voter_specific_ballot_from_google_civic: voter_specific_ballot_from_google_civic,
    });
  }

  handleMessageClose () {
    //setting cookie to track the elections where user has closed the warning messages for them
    if (this.props.google_civic_election_id) {
      let electionsWithBallotStatusMessageClosedUpdated = [...this.state.elections_with_ballot_status_message_closed, this.props.google_civic_election_id];
      let electionsWithBallotStatusMessageClosedForCookie = JSON.stringify(electionsWithBallotStatusMessageClosedUpdated);
      cookies.setItem("elections_with_ballot_status_message_closed", electionsWithBallotStatusMessageClosedForCookie, Infinity, "/");
      this.setState({
        elections_with_ballot_status_message_closed: electionsWithBallotStatusMessageClosedUpdated,
      });
    }
  }

  render () {
    // console.log("BallotStatusMessage render");
    renderLog(__filename);
    let ballotStatusStyle;
    let messageString = "";
    let today = moment(new Date());
    let isVotingDay = today.isSame(this.state.election_day_text, "day");

    if (isVotingDay) {
      ballotStatusStyle = "alert-info";
      messageString = "It is Voting Day,  " +
        moment(this.state.election_day_text).format("MMM Do, YYYY") +
        ".  If you haven't already voted, please go vote!";
      // I don't think this is necessary on election day.
      // messageString += !this.state.voter_specific_ballot_from_google_civic && this.state.ballot_location_chosen && this.state.ballot_location_display_name ?
      //   "  Some items shown below may not have been on your official ballot." : "  Some items below may not have been on your official ballot.";
    } else if (this.state.election_is_upcoming) {
      ballotStatusStyle = "alert-info";
      if (this.state.voter_specific_ballot_from_google_civic) {
        // We do not have an equivalent flag when we retrieve a ballot from Ballotpedia
        messageString += ""; // No additional text
      } else if (this.state.ballot_location_chosen && this.state.substituted_address_nearby) {
        messageString += "This is a ballot for " + this.state.substituted_address_nearby + ".";
        // This does not make sense when using Ballotpedia, since we don't know if voter entered a full address:  Enter your full address to see your official ballot.
      } else {
        if (this.state.voter_entered_address) {
          messageString += "This is our best guess for what's on your ballot.";
        }

        // I'm not sure we need to introduce doubt, expecially since sometime this appears after someone enters their full address.
        // messageString += "Some items below may not be on your official ballot.";
      }
    } else {
      ballotStatusStyle = "alert-info";
      let messageInPastString;
      if (this.state.election_day_text) {
        messageInPastString = "This election was held on " + moment(this.state.election_day_text).format("MMM Do, YYYY") + ".";
      } else {
        messageInPastString = ""; // Was "This election has passed." but it showed up inaccurately.
      }

      if (this.state.voter_specific_ballot_from_google_civic) {
        messageString += messageInPastString; // No additional text
      } else if (this.state.ballot_location_chosen && this.state.ballot_location_display_name) {
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
    if (this.props.google_civic_election_id) {
      electionBallotStatusMessageShouldBeClosed = this.state.elections_with_ballot_status_message_closed.includes(this.props.google_civic_election_id);
    }

    if (electionBallotStatusMessageShouldBeClosed) {
      return null;
    } else if (this.state.show_ballot_status && messageStringLength > 0) {
      return <div className="u-stack--sm d-print-none">
        <div className={"alert " + ballotStatusStyle}>
          <a href="#" className="close" data-dismiss="alert">
            <div id="ballot-status-message-close-container" onClick={this.handleMessageClose.bind(this)}>
              &times;
            </div>
          </a>
          {messageString}
        </div>
      </div>;
    } else {
      return <div />;
    }
  }
}
