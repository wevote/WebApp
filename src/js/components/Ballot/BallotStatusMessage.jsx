import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import cookies from "../../utils/cookies";
import { renderLog } from "../../utils/logging";

export default class BallotStatusMessage extends Component {
  static propTypes = {
    ballot_location_chosen: PropTypes.bool.isRequired,
    ballot_location_display_name: PropTypes.string,
    election_day_text: PropTypes.string,
    election_is_upcoming: PropTypes.bool.isRequired,
    google_civic_data_exists: PropTypes.bool.isRequired,
    voter_entered_address: PropTypes.bool.isRequired,
    voter_specific_ballot_from_google_civic: PropTypes.bool.isRequired,
    substituted_address_nearby: PropTypes.string,
    toggleSelectBallotModal: PropTypes.func,
    google_civic_election_id: PropTypes.number,
  };

  constructor (props) {
    super(props);
    this.state = {
      ballot_location_chosen: false,
      ballot_location_display_name: "",
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

    this.setState({
      ballot_location_chosen: this.props.ballot_location_chosen,
      ballot_location_display_name: this.props.ballot_location_display_name,
      election_day_text: this.props.election_day_text,
      election_is_upcoming: this.props.election_is_upcoming,
      google_civic_data_exists: this.props.google_civic_data_exists,
      show_ballot_status: true,
      substituted_address_nearby: this.props.substituted_address_nearby,
      voter_entered_address: this.props.voter_entered_address,
      voter_specific_ballot_from_google_civic: this.props.voter_specific_ballot_from_google_civic,
      electionsWithBallotStatusMessageClosed,
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log("BallotStatusMessage componentWillReceiveProps");
    this.setState({
      ballot_location_chosen: nextProps.ballot_location_chosen,
      ballot_location_display_name: nextProps.ballot_location_display_name,
      election_day_text: nextProps.election_day_text,
      election_is_upcoming: nextProps.election_is_upcoming,
      google_civic_data_exists: nextProps.google_civic_data_exists,
      show_ballot_status: true,
      substituted_address_nearby: nextProps.substituted_address_nearby,
      voter_entered_address: nextProps.voter_entered_address,
      voter_specific_ballot_from_google_civic: nextProps.voter_specific_ballot_from_google_civic,
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
    renderLog(__filename);
    let messageString = "";
    let ballotStatusStyle;
    let today = moment(new Date());
    let isVotingDay = today.isSame(this.state.election_day_text, "day");

    if (isVotingDay) {
      ballotStatusStyle = "alert-info";
      messageString = "It is Voting Day,  " +
        moment(this.state.election_day_text).format("MMM Do, YYYY") +
        ".  If you haven't already voted, please go vote!";
      messageString += !this.state.voter_specific_ballot_from_google_civic && this.state.ballot_location_chosen && this.state.ballot_location_display_name ?
        "  Some items shown below may not have been on your official ballot." : "  Some items below may not have been on your official ballot.";
    } else if (this.state.election_is_upcoming) {
      ballotStatusStyle = "alert-info";
      if (this.state.voter_specific_ballot_from_google_civic) {
        messageString += ""; // No additional text
      } else if (this.state.ballot_location_chosen && this.state.substituted_address_nearby) {
        messageString += "This is a ballot for " + this.state.substituted_address_nearby + ". Enter your full address to see your official ballot.";
      } else {
        if (this.state.voter_entered_address) {
          messageString += "This is our best guess for what's on your ballot. ";
        }

        messageString += "Some items below may not be on your official ballot.";
      }
    } else {
      ballotStatusStyle = "alert-info";
      let messageInPastString;
      if (this.state.election_day_text) {
        messageInPastString = "This election was held on " + moment(this.state.election_day_text).format("MMM Do, YYYY") + ".";
      } else {
        messageInPastString = "This election has passed.";
      }

      if (this.state.voter_specific_ballot_from_google_civic) {
        messageString += messageInPastString; // No additional text
      } else if (this.state.ballot_location_chosen && this.state.ballot_location_display_name) {
        messageString += messageInPastString;
        messageString += " Some items shown below may not have been on your official ballot.";
      } else {
        messageString += messageInPastString + " Some items below may not have been on your official ballot.";
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
      return <div className="u-stack--sm hidden-print">
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
