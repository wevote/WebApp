import React, { Component } from "react";
import Helmet from "react-helmet";

export default class SampleBallot extends Component {

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {

    return <div>
      <Helmet title="Welcome to We Vote" />
        <div className="intro-story container-fluid well fluff-full1">
          <h2 className="example-header">See Sample Ballot</h2>
        </div>
      </div>;
  }
}
