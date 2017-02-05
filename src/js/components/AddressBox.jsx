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
        voter_address: ""
      };

    this.updateVoterAddress = this.updateVoterAddress.bind(this);
    this.voterAddressSave = this.voterAddressSave.bind(this);
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

  updateVoterAddress (event) {
    this.setState({
      voter_address: event.target.value
    });
  }

  voterAddressSave (e) {
    e.preventDefault();
    var { voter_address } = this.state;
    VoterActions.voterAddressSave(voter_address);
    this.setState({loading: true});
  }

  render () {
    var { loading } = this.state;
    if (loading){
      return LoadingWheel;
    }
    return <div>
        <form onSubmit={this.voterAddressSave}>
        <input
          type="text"
          onChange={this.updateVoterAddress}
          name="address"
          value={this.state.voter_address}
          className="form-control"
          placeholder="Enter address where you are registered to vote"
        />
        </form>

        <div>
          <Button
            onClick={this.voterAddressSave}
            bsStyle="primary">
            Save</Button>
        </div>
      </div>;
  }
}
