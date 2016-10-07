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
      this.state = { loading: false };
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

  updateVoterAddress (e) {
    this.setState({
      voter_address: e.target.value
    });
  }

  voterAddressSave (e) {
    e.preventDefault();
    var { voter_address } = this.state;
    VoterActions.voterAddressSave(voter_address);
    this.setState({loading: true});
  }

  render () {
    var { loading, voter_address } = this.state;
    if (loading){
      return LoadingWheel;
    }
    return <div>
        <form onSubmit={this.voterAddressSave.bind(this)}>
        <input
          type="text"
          onChange={this.updateVoterAddress.bind(this)}
          name="address"
          value={voter_address}
          className="form-control"
          placeholder="Enter address where you are registered to vote"
        />
        </form>

        <div className="u-gutter__top--small">
          <Button
            onClick={this.voterAddressSave.bind(this)}
            bsStyle="primary">
            Save</Button>
        </div>
      </div>;
  }
}
