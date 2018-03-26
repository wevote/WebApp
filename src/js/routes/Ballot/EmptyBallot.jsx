import React, { Component } from "react";
import { renderLog } from "../../utils/logging";

export default class EmptyBallot extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
  }

  render () {
    renderLog(__filename);
    return <div>
        <div className="container-fluid well u-stack--md u-inset--md">
          <h3 className="text-center">
            We Cannot Find Your Ballot
          </h3>
          <div className="small">
            Please try entering a full address. If no ballot data is found for your full address, we may not have data for this election.
          </div>
          <br />
          <br />
          <div className="medium">
            See We Vote in action! Copy this test address into "Your Address":
          </div>
          <h4 className="h4">
            1717 Clemens Rd, Oakland CA 94602
          </h4>
        </div>
      </div>;
  }
}
