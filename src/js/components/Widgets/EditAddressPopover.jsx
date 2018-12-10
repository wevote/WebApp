import React, { Component } from "react";
import PropTypes from "prop-types";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { isCordova } from "../../utils/cordovaUtils";
import { renderLog } from "../../utils/logging";
import { shortenText } from "../../utils/textFormat";

export default class EditAddressPopover extends Component {
  static propTypes = {
    ballot_location_chosen: PropTypes.bool,
    ballot_location_display_name: PropTypes.string,
    election_day_text: PropTypes.string,
    election_is_upcoming: PropTypes.bool,
    google_civic_data_exists: PropTypes.bool,
    maxAddressDisplayLength: PropTypes.number,
    onEnterAddressClick: PropTypes.func.isRequired,
    placement: PropTypes.string.isRequired,
    text_for_map_search: PropTypes.string.isRequired,
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
      max_address_display_length: 0,
      show_ballot_status: true,
      text_for_map_search: "",
      voter_entered_address: false,
      voter_specific_ballot_from_google_civic: false,
    };
    this.closePopover = this.closePopover.bind(this);
  }

  componentDidMount () {
    // console.log("In EditAddressPopover componentDidMount");
    this.setState({
      ballot_location_chosen: this.props.ballot_location_chosen,
      ballot_location_display_name: this.props.ballot_location_display_name,
      election_day_text: this.props.election_day_text,
      election_is_upcoming: this.props.election_is_upcoming,
      google_civic_data_exists: this.props.google_civic_data_exists,
      max_address_display_length: this.props.maxAddressDisplayLength,
      show_ballot_status: true,
      text_for_map_search: this.props.text_for_map_search,
      voter_entered_address: this.props.voter_entered_address,
      voter_specific_ballot_from_google_civic: this.props.voter_specific_ballot_from_google_civic,
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log("EditAddressPopover componentWillReceiveProps");
    this.setState({
      ballot_location_chosen: nextProps.ballot_location_chosen,
      ballot_location_display_name: nextProps.ballot_location_display_name,
      election_day_text: nextProps.election_day_text,
      election_is_upcoming: nextProps.election_is_upcoming,
      google_civic_data_exists: nextProps.google_civic_data_exists,
      max_address_display_length: nextProps.maxAddressDisplayLength,
      show_ballot_status: true,
      text_for_map_search: nextProps.text_for_map_search,
      voter_entered_address: nextProps.voter_entered_address,
      voter_specific_ballot_from_google_civic: nextProps.voter_specific_ballot_from_google_civic,
    });
  }

  closePopover () {
    this.refs.overlay.hide();
  }

  render () {
    renderLog(__filename);

    // TODO STEVE March 2018:  As we use EditAddress today, the next 30 lines do nothing.  Same for their associated props here, and in EditAddress
    // let exclamation_circle_red = "#fc0d1b"; // I tried to replace literal string below with this variable. Didn't work.
    const messageTitle = "This is our best guess";
    let messageString = "";
    let addressPopoverOn = true;
    let addressPopoverEnterAddressOn = true;

    // TODO DALE: Deal with the situation where you are in one state (ex "NC") and you link to a NY ballot
    // The EditAddressPopover message should update
    if (this.state.election_is_upcoming) {
      if (this.state.voter_specific_ballot_from_google_civic) {
        // messageString += ""; // No additional text
        addressPopoverOn = false;
        addressPopoverEnterAddressOn = false;
      } else if (this.state.google_civic_data_exists) {
        messageString += "Want to make sure these are your ballot items? Enter the full address where you are registered to vote.";
        addressPopoverEnterAddressOn = true;
      } else {
        messageString += "We are showing you the closest match to your official ballot.";
      }
    } else if (this.state.voter_entered_address) {
      messageString += "We are showing you the closest match to your official ballot.";
      addressPopoverEnterAddressOn = false;
    } else if (this.state.google_civic_data_exists) {
      messageString += "This election is in the past. We are showing you the closest match to your official ballot.";
      addressPopoverEnterAddressOn = false;
    } else {
      messageString += "This election is in the past. We are showing you the closest match to your official ballot.";
      addressPopoverEnterAddressOn = false;
    }

    const AddressPopover = (
      <Popover id="popover-trigger-click-root-close" onClick={this.closePopover}>
        <div style={{ textAlign: "center" }}>
          <p>
            <span style={{ color: "#ef1e26" }}>{messageTitle}</span>
            {/* This is the "x" to close the popover */}
            <i className={`fa fa-times pull-right u-cursor--pointer ${isCordova() && "u-mobile-x"} `} aria-hidden="true" />
          </p>
          <p>{messageString}</p>
          { addressPopoverEnterAddressOn ?
            <button className="btn btn-success" onClick={this.props.onEnterAddressClick}>Enter Address &gt;&gt;</button> :
            null
          }
        </div>
      </Popover>
    );

    const noAddressMessage = "- no address entered -";
    const maximumAddressDisplayLength = this.state.max_address_display_length !== 0 ? this.state.max_address_display_length : 30;

    return (
      <span>
        { addressPopoverOn ? (
          <OverlayTrigger
            trigger="click"
            ref="overlay"
            onExit={this.closePopover}
            rootClose
            placement={this.props.placement}
            overlay={AddressPopover}
          >
            <span className="u-cursor--pointer">
              { this.state.text_for_map_search.length ? shortenText(this.state.text_for_map_search, maximumAddressDisplayLength) : noAddressMessage }
              <span className="position-rating__source with-popover">
                &nbsp;&nbsp;
                <i className="fa fa-exclamation-circle" aria-hidden="true" style={{ color: "#fc0d1b" }} />
                &nbsp;&nbsp;
              </span>
            </span>
          </OverlayTrigger>
        ) : (
          <span onClick={this.props.onEnterAddressClick} className="u-cursor--pointer">
            { this.state.text_for_map_search.length ? shortenText(this.state.text_for_map_search, maximumAddressDisplayLength) : noAddressMessage }
            <span className="position-rating__source with-popover">&nbsp;&nbsp;</span>
          </span>
        )}
      </span>
    );
  }
}
