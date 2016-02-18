import React, { Component } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import HeaderBackNavigation from '../../components/Navigation/HeaderBackNavigation';
import VoterStore from '../../stores/VoterStore';

export default class Location extends Component {
  constructor(props) {
      super(props);
      this.state = {}
  }

  componentDidMount() {
    VoterStore.getLocation( location => {
      this.setState({ location });
    })
  }

  updateLocation (e) {
    this.setState({
      location: e.target.value
    });
  }

  saveLocation (e) {
    var { location } = this.state;
    VoterStore.saveLocation ( location,  (err, location) => {
      if (err) return console.error(err);

      window.location.href="/ballot"

    });
  }

  render() {
    var { location } = this.state;

    return (
      <div>
      	<div className="container-fluid well container-fluid--paddingxl gutter-top--small">
      		<h2 className="text-center">
            Change Location
          </h2>
      		<div>
      			<span className="small">
              Please enter the address (or just the city) where you registered to
        			vote. The more location information you can provide, the more ballot information will
        			be visible.
            </span>

            <div className="input-group-lg">
              <input
                type="text"
                onChange={this.updateLocation.bind(this)}
                name="address"
                value={location}
                className="form-control"
                defaultValue="Oakland, CA" />
            </div>

            <ButtonToolbar style={{"marginTop": "10", "marginBottom": "10"}}>
                <Button
                  onClick={this.saveLocation.bind(this)}
                  bsStyle="primary">Save Location</Button>

            </ButtonToolbar>
      		</div>
      	</div>
      </div>
    );
  }
}
