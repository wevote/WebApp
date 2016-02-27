import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class EmptyBallot extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div>
        <div className="container-fluid well gutter-top--small fluff-full1">
          <h3 className="text-center">
            Your Ballot Is Not Ready Yet
          </h3>
          <div className="small">
            Our data providers don't have ballot data for your address yet.
            Please check back 1-2 weeks before your election day. Thank you for your patience.
          </div>
          <br />
          <br />
          <div className="medium">
            See We Vote in action! Copy this test address into "My Ballot Location":
          </div>
          <h4>
            2208 Ebb Tide Rd, Virginia Beach, VA 23451
          </h4>
        </div>
      </div>
    );
  }
}
