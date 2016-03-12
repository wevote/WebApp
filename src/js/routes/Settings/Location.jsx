import React, { Component } from "react";
import { ButtonToolbar } from "react-bootstrap";
import VoterStore from "../../stores/VoterStore";

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

  saveLocation (e) {
    e.preventDefault();
    var { location } = this.state;
    console.log("Saving location", location);
    VoterStore.saveLocation( location,
        (res) => { this.props.history.push("/ballot"); },
        (err) =>{ console.log(err);}
      );
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
          <form onSubmit={this.saveLocation.bind(this)}>
          <input
            type="text"
            onChange={this.updateLocation.bind(this)}
            name="address"
            value={location}
            className="form-control"
            defaultValue=""
          />
          </form>
          <br />
          <br />
          <div className="medium">
            See We Vote in action! Copy and paste this address above:
          </div>
          <h4>
            2208 Ebb Tide Rd, Virginia Beach, VA 23451
          </h4>

          <div className="gutter-top--small">
            <ButtonToolbar>
                <button
                  onClick={this.saveLocation.bind(this)}
                  bsStyle="primary">
                  Save Location</button>
            </ButtonToolbar>
          </div>
        </div>
      </div>
    </div>;
  }
}
