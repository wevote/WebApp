import React, { Component } from "react";

export default class EmptyBallot extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
  }

  render () {
    return <div>
        <div className="bs-container-fluid bs-well gutter-top--small fluff-full1">
          <h3 className="bs-text-center">
            Your Ballot Is Not Ready Yet
          </h3>
          <div className="small">
            Our data providers don't have ballot data for your address yet.
            Please check back 1-2 weeks before your election day. Thank you for your patience.
          </div>
          <br />
          <br />
          <div className="medium">
            See We Vote in action! Copy this test address into "My Address":
          </div>
          <h4>
            2208 Ebb Tide Rd, Virginia Beach, VA 23451
          </h4>
        </div>
      </div>;
  }
}
