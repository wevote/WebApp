import React, { Component } from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import HeaderBackNavigation from "../../components/Navigation/HeaderBackNavigation";
import VoterStore from "../../stores/VoterStore";
import BallotStore from "../../stores/BallotStore";

export default class Location extends Component {
  constructor (props) {
      super(props);
      this.state = {};
  }

  componentDidMount () {
    VoterStore.getLocation( (err, location) => {
      this.setState({ location });
    });
  }

  updateLocation (e) {
    this.setState({
      location: e.target.value
    });
  }

  saveLocation () {
    var { location } = this.state;
    VoterStore.saveLocation( location, (res) => {
      if (res){
        this.props.history.push('/ballot');
      } else {
        BallotStore.initialize(function(){}); // reinitialize ballot in case old ballot items from old addresses are stored.
        this.props.history.push('/ballot/empty');
      }
    }, (err) =>{

    });
  }

  render () {
    var { location } = this.state;

    return <div>
      <div className="container-fluid well gutter-top--small fluff-full1">
        <h3 className="text-center">
          Change Location
        </h3>
        <div>
          <span className="small">
            Please enter the address (or just the city) where you registered to
            vote. The more location information you can provide, the more ballot information will
            be visible.
          </span>

          <input
            type="text"
            onChange={this.updateLocation.bind(this)}
            name="address"
            value={location}
            className="form-control"
            defaultValue="Oakland, CA"
          />

          <div className="gutter-top--small">
            <ButtonToolbar>
                <Button
                  onClick={this.saveLocation.bind(this)}
                  bsStyle="primary">Save Location</Button>

            </ButtonToolbar>
          </div>
        </div>
      </div>
    </div>;
  }
}
