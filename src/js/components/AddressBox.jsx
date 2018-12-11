/* global google */
import React, { Component } from "react";
import PropTypes from "prop-types";
import BallotStore from "../stores/BallotStore";
import { historyPush, isCordova, prepareForCordovaKeyboard, restoreStylesAfterCordovaKeyboard } from "../utils/cordovaUtils";
import LoadingWheel from "./LoadingWheel";
import { renderLog } from "../utils/logging";
import VoterActions from "../actions/VoterActions";
import VoterStore from "../stores/VoterStore";

// December 2018:  We want to work toward being airbnb style compliant, but for now these are disabled in this file to minimize massive changes
/* eslint react/sort-comp: 0 */
/* eslint class-methods-use-this: 0 */
/* eslint react/jsx-indent-props: 0 */
/* eslint jsx-a11y/no-static-element-interactions: 0 */
/* eslint jsx-a11y/no-noninteractive-element-to-interactive-role: 0 */
/* eslint jsx-a11y/click-events-have-key-events: 0 */
/* eslint jsx-a11y/anchor-is-valid: 0 */
/* eslint no-param-reassign: 0 */


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

    // this.autocomplete = React.createRef();

    this.updateVoterAddress = this.updateVoterAddress.bind(this);
    this.voterAddressSave = this.voterAddressSave.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentWillMount () {
    prepareForCordovaKeyboard(__filename);
  }

  componentDidMount () {
    this.setState({
      text_for_map_search: VoterStore.getTextForMapSearch(),
      ballotCaveat: BallotStore.getBallotCaveat(),
    });
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    const addressAutocomplete = new google.maps.places.Autocomplete(this.refs.autocomplete);
    addressAutocomplete.setComponentRestrictions({ country: "us" });
    this.googleAutocompleteListener = addressAutocomplete.addListener("place_changed", this._placeChanged.bind(this, addressAutocomplete));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    this.ballotStoreListener.remove();
    if (this.googleAutocompleteListener !== undefined) { // Temporary fix until google maps key is fixed.
      this.googleAutocompleteListener.remove();
    } else {
      console.log("Google Maps Error: DeletedApiProjectMapError");
    }
    restoreStylesAfterCordovaKeyboard(__filename);
  }

  componentDidUpdate () {
    // If we're in the slide with this component, autofocus the address box, otherwise defocus.
    if (this.props.manualFocus !== undefined) {
      const addressBox = this.refs.autocomplete;
      if (addressBox) {
        if (this.props.manualFocus) {
          addressBox.focus();
        } else {
          addressBox.blur();
        }
      }
    }
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error("AddressBox caught error: ", `${error} with info: `, info);
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
      ballotCaveat: BallotStore.getBallotCaveat(),
    });
  }

  _placeChanged (addressAutocomplete) {
    const place = addressAutocomplete.getPlace();
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

      return (
        <div>
          <h2>{waitingMessage}</h2>
          {LoadingWheel}
        </div>
      );
    }

    return (
      <div className="container">
        <form onSubmit={this.voterAddressSave} className="row">
          <input
            type="text"
            value={this.state.text_for_map_search}
            onKeyDown={this.handleKeyPress}
            onChange={this.updateVoterAddress}
            name="address"
            className="form-control col-sm-9"
            ref="autocomplete"
            placeholder="Enter address where you are registered to vote"
            autoFocus={!isCordova() && !this.props.disableAutoFocus}
          />
          <div className="col-sm-3 text-right pr-0 mt-sm-0 mt-3">
            <button
              onClick={this.voterAddressSave}
              className="btn btn-primary"
            >
              Save
            </button>
            <br />
            { this.props.cancelEditAddress ? (
              <span className="u-f5">
                <a href="#" onClick={this.props.cancelEditAddress}>cancel</a>
              </span>
            ) : null
            }
          </div>
        </form>
        <p />
        <h4>{this.state.ballotCaveat}</h4>
      </div>
    );
  }
}
