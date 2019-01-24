import React, { Component } from "react";
import PropTypes from "prop-types";
import EditAddressPopover from "./EditAddressPopover";
import { renderLog } from "../../utils/logging";
import { shortenText } from "../../utils/textFormat";

export default class EditAddress extends Component {
  static propTypes = {
    address: PropTypes.object.isRequired,
    toggleSelectAddressModal: PropTypes.func.isRequired,
    ballot_location_chosen: PropTypes.bool,
    ballot_location_display_name: PropTypes.string,
    election_day_text: PropTypes.string,
    election_is_upcoming: PropTypes.bool,
    google_civic_data_exists: PropTypes.bool,
    voter_entered_address: PropTypes.bool,
    voter_specific_ballot_from_google_civic: PropTypes.bool,
  };

  constructor (props, context) {
    super(props, context);
    this.state = {
      ballot_location_chosen: false,
      ballot_location_display_name: "",
      election_day_text: "",
      election_is_upcoming: false,
      google_civic_data_exists: false,
      show_ballot_status: true,
      text_for_map_search: "",
      voter_entered_address: false,
      voter_specific_ballot_from_google_civic: false,
    };
  }

  componentDidMount () {
    // console.log("In BallotStatusMessage componentDidMount");
    this.setState({
      ballot_location_chosen: this.props.ballot_location_chosen,
      ballot_location_display_name: this.props.ballot_location_display_name,
      election_day_text: this.props.election_day_text,
      election_is_upcoming: this.props.election_is_upcoming || false,
      google_civic_data_exists: this.props.google_civic_data_exists,
      show_ballot_status: true,
      text_for_map_search: this.props.address.text_for_map_search || "",
      voter_entered_address: this.props.voter_entered_address || false,
      voter_specific_ballot_from_google_civic: this.props.voter_specific_ballot_from_google_civic,
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
      text_for_map_search: nextProps.address.text_for_map_search || "",
      voter_entered_address: nextProps.voter_entered_address,
      voter_specific_ballot_from_google_civic: nextProps.voter_specific_ballot_from_google_civic,
    });
  }

  render () {
    renderLog(__filename);
    const noAddressMessage = "- no address entered -";
    const editAddressPopoverOn = true;
    const maximumAddressDisplayLength = 30;

    return (
      <span className="ballot__date_location">
        { editAddressPopoverOn ? (
          <EditAddressPopover
            textForMapSearch={this.state.text_for_map_search}
            placement="bottom"
            onEnterAddressClick={this.props.toggleSelectAddressModal}
            ballotLocationChosen={this.state.ballot_location_chosen}
            ballotLocationDisplayName={this.state.ballot_location_display_name}
            electionDayText={this.state.election_day_text}
            electionIsUpcoming={this.state.election_is_upcoming}
            maxAddressDisplayLength={maximumAddressDisplayLength}
            voterEnteredAddress={this.state.voter_entered_address}
            googleCivicDataExists={this.state.google_civic_data_exists}
            voterSpecificBallotFromGoogleCivic={this.state.voter_specific_ballot_from_google_civic}
          />
        ) :
          <span>{ this.state.text_for_map_search.length ? shortenText(this.state.text_for_map_search, maximumAddressDisplayLength) : noAddressMessage }</span>
        }
        <span className="d-print-none">
          (
          <a onClick={this.props.toggleSelectAddressModal}>Edit</a>
          )
        </span>
      </span>
    );
  }
}
