import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import { browserHistory } from "react-router";
import LoadingWheel from "../components/LoadingWheel";
import VoterActions from "../actions/VoterActions";
import VoterStore from "../stores/VoterStore";

export default class AddressBox extends Component {
  static propTypes = {
    saveUrl: PropTypes.string.isRequired
  };

  constructor (props) {
      super(props);
      this.state = {
        loading: false,
        voter_address: "",
        //value: ""
      };

    this.updateVoterAddress = this.updateVoterAddress.bind(this);
    this.voterAddressSave = this.voterAddressSave.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.clear = this.clear.bind(this);
  }

  componentDidMount () {
    this.setState({ voter_address: VoterStore.getAddress() });
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentWillUnmount (){
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    if (this.state.voter_address){
      browserHistory.push(this.props.saveUrl);
    } else {
      this.setState({ voter_address: VoterStore.getAddress(), loading: false });
    }
  }

  _ballotLoaded (){
    browserHistory.push(this.props.saveUrl);
  }

  _placeChanged (addressAutocomplete) {

    let place = addressAutocomplete.getPlace();

    if (place.formatted_address) {
      this.setState({
        voter_address: place.formatted_address
      });
      //console.log("place.formatted_address: " + place.formatted_address);
      //console.log("formatted address state change: " + this.state.voter_address);
    } else {
      this.setState({
        voter_address: place.name
      });
      //console.log("place.name: " + place.name);
      //console.log("place.name state change: " + this.state.voter_address);
    }
  }

  updateVoterAddress (event) {
    this.setState({value: event.target.value});

    let addressAutocomplete = new google.maps.places.Autocomplete(this.refs.autocomplete);

    addressAutocomplete.addListener("place_changed", this._placeChanged.bind(this, addressAutocomplete));
  }

  handleKeyPress (event) {
    if (event.keyCode === 13) {

      event.preventDefault();
      setTimeout(() => {
        var { voter_address } = this.state;
        VoterActions.voterAddressSave(voter_address);
        this.setState({loading: true});
      }, 250);
    }
  }

  clear () {
    this.setState({value: event.target.value});
  }

  voterAddressSave (event) {
    event.preventDefault();
    var { voter_address } = this.state;
    VoterActions.voterAddressSave(voter_address);
    this.setState({loading: true});
  }
 // this was removed because the value was sometimes not letting me type a new address in the input {/*this.state.voter_address*/}

  render () {
    var { loading } = this.state;
    if (loading){
      return LoadingWheel;
    }
    return <div>
        <form onSubmit={this.voterAddressSave}>
        <input
          type="text"
          onKeyDown={this.handleKeyPress}
          onChange={this.updateVoterAddress}
          name="address"
          className="form-control"
          ref="autocomplete"
          placeholder="Enter address where you are registered to vote"
        />
        </form>

        <div className="u-gutter__top--small">
          <Button
            className="pull-right"
            onClick={this.voterAddressSave}
            bsStyle="primary">
            Save</Button>
        </div>
      </div>;
  }
}
