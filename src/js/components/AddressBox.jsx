/* global google */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import BallotStore from "../stores/BallotStore";
import { historyPush } from "../utils/cordovaUtils";
import { isCordova } from "../utils/cordovaUtils";
import LoadingWheel from "../components/LoadingWheel";
import { renderLog } from "../utils/logging";
import VoterActions from "../actions/VoterActions";
import VoterStore from "../stores/VoterStore";

export default class AddressBox extends Component {
  static propTypes = {
    cancelEditAddress: PropTypes.func,
    disableAutoFocus: PropTypes.bool,
    manualFocus: PropTypes.bool,
    toggleSelectAddressModal: PropTypes.func,
    saveUrl: PropTypes.string.isRequired,
    waitingMessage: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      loading: false,
      text_for_map_search: "",
      ballotCaveat: "",
    };

    this.updateVoterAddress = this.updateVoterAddress.bind(this);
    this.voterAddressSave = this.voterAddressSave.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount () {
    this.setState({
      text_for_map_search: VoterStore.getTextForMapSearch(),
      ballotCaveat: BallotStore.getBallotCaveat(),
    });
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    let addressAutocomplete = new google.maps.places.Autocomplete(this.refs.autocomplete);
    addressAutocomplete.setComponentRestrictions({ country: "us" });
    this.googleAutocompleteListener = addressAutocomplete.addListener("place_changed", this._placeChanged.bind(this, addressAutocomplete));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    this.ballotStoreListener.remove();
    if (this.googleAutocompleteListener !== undefined){  // Temporary fix until google maps key is fixed.
      this.googleAutocompleteListener.remove();
    } else {
      console.log("Google Maps Error: DeletedApiProjectMapError");
    }
  }

  componentDidUpdate () {
    // If we're in the slide with this component, autofocus the address box, otherwise defocus.
    if (this.props.manualFocus !== undefined && !this.state.loading) {
      let address_box = this.refs.autocomplete;
      if (address_box) {
        if (this.props.manualFocus) {
          address_box.focus();
        } else {
          address_box.blur();
        }
      }
    }
  }

  onVoterStoreChange () {
    // console.log("AddressBox, onVoterStoreChange, this.state:", this.state);
    if (this.props.toggleSelectAddressModal) {
      this.props.toggleSelectAddressModal();
    }

    if (this.state.text_for_map_search) {
      historyPush(this.props.saveUrl);
    } else {
      this.setState({
        text_for_map_search: VoterStore.getTextForMapSearch(),
        loading: false,
      });
    }
  }

  onBallotStoreChange () {
    // console.log("AddressBox, onBallotStoreChange, this.state:", this.state);
    this.setState({
      ballotCaveat: BallotStore.getBallotCaveat()
    });
  }

  _placeChanged (addressAutocomplete) {
    let place = addressAutocomplete.getPlace();
    if (place.formatted_address) {
      this.setState({
        text_for_map_search: place.formatted_address,
      });
    } else {
      this.setState({
        text_for_map_search: place.name,
      });
    }
  }

  updateVoterAddress (event) {
    this.setState({ text_for_map_search: event.target.value });
  }

  handleKeyPress (event) {
    const ENTER_KEY_CODE = 13;
    if (event.keyCode === ENTER_KEY_CODE) {
      event.preventDefault();
      setTimeout(() => {
        VoterActions.voterAddressSave(this.state.text_for_map_search);
        this.setState({ loading: true });
      }, 250);
    }
  }

  voterAddressSave (event) {
    event.preventDefault();
    VoterActions.voterAddressSave(this.state.text_for_map_search);
    this.setState({ loading: true });
  }

  render () {
    renderLog(__filename);
    if (this.state.loading) {
      let waitingMessage = "Please wait a moment while we find your ballot...";
      if (this.props.waitingMessage) {
        waitingMessage = this.props.waitingMessage;
      }
      return <div>
            <h2>{waitingMessage}</h2>
            {LoadingWheel}
          </div>;
    }

    return <div>
        <form onSubmit={this.voterAddressSave}>
          <input
            type="text"
            value={this.state.text_for_map_search}
            onKeyDown={this.handleKeyPress}
            onChange={this.updateVoterAddress}
            name="address"
            className="form-control"
            ref="autocomplete"
            placeholder="Enter address where you are registered to vote"
            autoFocus={!isCordova() && !this.props.disableAutoFocus}
          />
        </form>
        <div>
        <br/>
          <Button
            className="pull-right"
            onClick={this.voterAddressSave}
            bsStyle="primary">
            Save</Button>
          { this.props.cancelEditAddress ?
            <span className="pull-right u-f5 u-push--md"><a href="#" onClick={this.props.cancelEditAddress}>cancel</a> </span> :
            null }
        </div>
      <p/><h4>{this.state.ballotCaveat}</h4>
      </div>;
  }
}
