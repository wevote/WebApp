import React, { Component } from "react";
import PropTypes from "prop-types";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { isCordova } from "../../utils/cordovaUtils";
import { renderLog } from "../../utils/logging";
import { shortenText } from "../../utils/textFormat";

export default class EditAddressPopover extends Component {
  static propTypes = {
    // ballotLocationChosen: PropTypes.bool,
    // ballotLocationDisplayName: PropTypes.string,
    // electionDayText: PropTypes.string,
    electionIsUpcoming: PropTypes.bool,
    googleCivicDataExists: PropTypes.bool,
    maxAddressDisplayLength: PropTypes.number,
    onEnterAddressClick: PropTypes.func.isRequired,
    placement: PropTypes.string.isRequired,
    textForMapSearch: PropTypes.string.isRequired,
    voterEnteredAddress: PropTypes.bool,
    voterSpecificBallotFromGoogleCivic: PropTypes.bool,
  };

  constructor (props, context) {
    super(props, context);
    this.state = {
      // ballotLocationChosen: false,
      // ballotLocationDisplayName: "",
      // electionDayText: "",
      electionIsUpcoming: false,
      googleCivicDataExists: false,
      maxAddressDisplayLength: 0,
      // show_ballot_status: true,
      textForMapSearch: "",
      voterEnteredAddress: false,
      voterSpecificBallotFromGoogleCivic: false,
    };
    this.closePopover = this.closePopover.bind(this);
  }

  componentDidMount () {
    // console.log("In EditAddressPopover componentDidMount");
    this.setState({
      // ballotLocationChosen: this.props.ballotLocationChosen,
      // ballotLocationDisplayName: this.props.ballotLocationDisplayName,
      // electionDayText: this.props.electionDayText,
      electionIsUpcoming: this.props.electionIsUpcoming,
      googleCivicDataExists: this.props.googleCivicDataExists,
      maxAddressDisplayLength: this.props.maxAddressDisplayLength,
      // show_ballot_status: true,
      textForMapSearch: this.props.textForMapSearch,
      voterEnteredAddress: this.props.voterEnteredAddress,
      voterSpecificBallotFromGoogleCivic: this.props.voterSpecificBallotFromGoogleCivic,
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log("EditAddressPopover componentWillReceiveProps");
    this.setState({
      // ballotLocationChosen: nextProps.ballotLocationChosen,
      // ballotLocationDisplayName: nextProps.ballotLocationDisplayName,
      // electionDayText: nextProps.electionDayText,
      electionIsUpcoming: nextProps.electionIsUpcoming,
      googleCivicDataExists: nextProps.googleCivicDataExists,
      maxAddressDisplayLength: nextProps.maxAddressDisplayLength,
      // show_ballot_status: true,
      textForMapSearch: nextProps.textForMapSearch,
      voterEnteredAddress: nextProps.voterEnteredAddress,
      voterSpecificBallotFromGoogleCivic: nextProps.voterSpecificBallotFromGoogleCivic,
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
    if (this.state.electionIsUpcoming) {
      if (this.state.voterSpecificBallotFromGoogleCivic) {
        // messageString += ""; // No additional text
        addressPopoverOn = false;
        addressPopoverEnterAddressOn = false;
      } else if (this.state.googleCivicDataExists) {
        messageString += "Want to make sure these are your ballot items? Enter the full address where you are registered to vote.";
        addressPopoverEnterAddressOn = true;
      } else {
        messageString += "We are showing you the closest match to your official ballot.";
      }
    } else if (this.state.voterEnteredAddress) {
      messageString += "We are showing you the closest match to your official ballot.";
      addressPopoverEnterAddressOn = false;
    } else if (this.state.googleCivicDataExists) {
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
    const maximumAddressDisplayLength = this.state.maxAddressDisplayLength !== 0 ? this.state.maxAddressDisplayLength : 30;

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
              { this.state.textForMapSearch.length ? shortenText(this.state.textForMapSearch, maximumAddressDisplayLength) : noAddressMessage }
              <span className="position-rating__source with-popover">
                &nbsp;&nbsp;
                <i className="fa fa-exclamation-circle" aria-hidden="true" style={{ color: "#fc0d1b" }} />
                &nbsp;&nbsp;
              </span>
            </span>
          </OverlayTrigger>
        ) : (
          <span onClick={this.props.onEnterAddressClick} className="u-cursor--pointer">
            { this.state.textForMapSearch.length ? shortenText(this.state.textForMapSearch, maximumAddressDisplayLength) : noAddressMessage }
            <span className="position-rating__source with-popover">&nbsp;&nbsp;</span>
          </span>
        )}
      </span>
    );
  }
}
