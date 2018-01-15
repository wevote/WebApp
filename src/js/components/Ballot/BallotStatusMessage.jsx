import React, { PropTypes, Component } from "react";
import moment from "moment";
import cookies from "../../utils/cookies";

export default class BallotStatusMessage extends Component {
  static propTypes = {
    ballot_location_chosen: PropTypes.bool.isRequired,
    ballot_location_display_name: PropTypes.string,
    election_day_text: PropTypes.string,
    election_is_upcoming: PropTypes.bool.isRequired,
    google_civic_data_exists: PropTypes.bool.isRequired,
    voter_entered_address: PropTypes.bool.isRequired,
    voter_specific_ballot_from_google_civic: PropTypes.bool.isRequired,
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
      google_civic_data_exists: false,
      show_ballot_status: true,
      voter_entered_address: false,
      voter_specific_ballot_from_google_civic: false,
      elections_with_ballot_status_message_closed: [],
    };
  }

  componentDidMount () {
    // console.log("In BallotStatusMessage componentDidMount");
    let elections_with_ballot_status_message_closed_value_from_cookie = cookies.getItem("elections_with_ballot_status_message_closed");
    let elections_with_ballot_status_message_closed = [];
    if (elections_with_ballot_status_message_closed_value_from_cookie) {
      elections_with_ballot_status_message_closed = JSON.parse(elections_with_ballot_status_message_closed_value_from_cookie) || []
    }
    this.setState({
      ballot_location_chosen: this.props.ballot_location_chosen,
      ballot_location_display_name: this.props.ballot_location_display_name,
      election_day_text: this.props.election_day_text,
      election_is_upcoming: this.props.election_is_upcoming,
      google_civic_data_exists: this.props.google_civic_data_exists,
      show_ballot_status: true,
      voter_entered_address: this.props.voter_entered_address,
      voter_specific_ballot_from_google_civic: this.props.voter_specific_ballot_from_google_civic,
      elections_with_ballot_status_message_closed
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
      voter_entered_address: nextProps.voter_entered_address,
      voter_specific_ballot_from_google_civic: nextProps.voter_specific_ballot_from_google_civic,
    });
  }

  handleMessageClose () {
    //setting cookie to track the elections where user has closed the warning messages for them
    if (this.props.google_civic_election_id) {
      let elections_with_ballot_status_message_closed_updated = [...this.state.elections_with_ballot_status_message_closed, this.props.google_civic_election_id];
      let elections_with_ballot_status_message_closed_for_cookie = JSON.stringify(elections_with_ballot_status_message_closed_updated);
      cookies.setItem("elections_with_ballot_status_message_closed", elections_with_ballot_status_message_closed_for_cookie, Infinity, "/");
      this.setState({
        elections_with_ballot_status_message_closed: elections_with_ballot_status_message_closed_updated
      });
    }
  }

  render () {
    // console.log("In BallotStatusMessage render");
    let message_string = "";
    let ballot_status_style;
    // this.state.google_civic_data_exists
    if (this.state.election_is_upcoming) {
      ballot_status_style = "alert-info";
      if (this.state.voter_specific_ballot_from_google_civic) {
        message_string += ""; // No additional text
      // } else if (this.state.voter_entered_address) {
      //   message_string += ""; // No additional text
      } else if (this.state.ballot_location_chosen && this.state.ballot_location_display_name) {
        message_string += "You are looking at the ballot for " + this.state.ballot_location_display_name + ". Some items below may not be on your official ballot.";
      } else {
        if (this.state.voter_entered_address) {
          message_string += "This is a ballot near you. ";
        }
        message_string += "Some items below may not be on your official ballot.";
      }
    } else {
      ballot_status_style = "alert-info";
      let message_in_past_string;
      if (this.state.election_day_text) {
        message_in_past_string = "This election was held on " + moment(this.state.election_day_text).format("MMM Do, YYYY") + ".";
      } else {
        message_in_past_string = "This election has passed.";
      }
      if (this.state.voter_specific_ballot_from_google_civic) {
        message_string += message_in_past_string; // No additional text
      // } else if (this.state.voter_entered_address) {
      //   message_string += message_in_past_string; // No additional text
      } else if (this.state.ballot_location_chosen && this.state.ballot_location_display_name) {
        message_string += message_in_past_string;
        // message_string += " You are looking at the ballot for " + this.state.ballot_location_display_name + ".";
        message_string += " Some items shown below may not have been on your official ballot.";
      } else {
        // if (this.state.voter_entered_address) {
        //   message_string += " This was a ballot near you. ";
        // }
        message_string += message_in_past_string + " Some items below may not have been on your official ballot.";
      }
    }

    let message_string_length = 0;
    if (message_string) {
      message_string_length = message_string.length;
    }
    let election_ballot_status_message_should_be_closed = false;
    if (this.props.google_civic_election_id) {
      election_ballot_status_message_should_be_closed = this.state.elections_with_ballot_status_message_closed.includes(this.props.google_civic_election_id);
    }
    if (election_ballot_status_message_should_be_closed) {
      return null;
    } else if (this.state.show_ballot_status && message_string_length > 0) {
      return <div className="u-stack--sm hidden-print">
        <div className={"alert " + ballot_status_style}>
          <a href="#" className="close" data-dismiss="alert">
            <div id="ballot-status-message-close-container" onClick={this.handleMessageClose.bind(this)}>
              &times;
            </div>
          </a>
          {message_string}
        </div>
      </div>;
    } else {
      return <div />;
    }
  }
}
