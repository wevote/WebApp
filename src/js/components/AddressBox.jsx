import React, { Component, PropTypes } from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import VoterStore from "../stores/VoterStore";
import LoadingWheel from "../components/LoadingWheel";
import VoterActions from "../actions/VoterActions";
import { browserHistory } from 'react-router';

export default class AddressBox extends Component {
  static propTypes = {
    saveUrl: PropTypes.string.isRequired
  };

  constructor (props) {
      super(props);
      this.state = { loading: false };
  }

  componentDidMount () {
    this.setState({ location: VoterStore.getAddress() });
    this.listener = VoterStore.addListener(this._onChange.bind(this));
  }

  componentWillUnmount (){
    this.listener.remove();
  }

  _onChange () {
    if (this.state.location){
      browserHistory.push(this.props.saveUrl);
    } else {
      this.setState({ location: VoterStore.getAddress(), loading: false });
    }
  }

  _ballotLoaded (){
    console.log("ballotLoaded");
    browserHistory.push(this.props.saveUrl);
  }

  updateLocation (e) {
    this.setState({
      location: e.target.value
    });
  }

  saveLocation (e) {
    e.preventDefault();
    var { location } = this.state;
    console.log("Saving location", location);
    VoterActions.saveAddress(location);
    this.setState({loading: true});
  }

  render () {
    var { loading, location } = this.state;
    if (loading){
      return LoadingWheel;
    }
    var floatRight = {
        float: "right"
    };
    return <div>
        <form onSubmit={this.saveLocation.bind(this)}>
        <input
          type="text"
          onChange={this.updateLocation.bind(this)}
          name="address"
          value={location}
          className="bs-form-control"
          defaultValue=""
          placeholder="Enter address where you are registered to vote"
        />
        </form>

        <div className="u-gutter-top--small">
          <ButtonToolbar bsClass="bs-btn-toolbar">
            <span style={floatRight}>
              <Button
                bsClass="bs-btn"
                onClick={this.saveLocation.bind(this)}
                bsStyle="primary">
                Save My Address</Button>
            </span>
          </ButtonToolbar>
        </div>
      </div>;
  }
}
