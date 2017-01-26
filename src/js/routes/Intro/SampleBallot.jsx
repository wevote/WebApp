import React, { Component } from "react";
import Helmet from "react-helmet";
import { browserHistory } from "react-router";

export default class SampleBallot extends Component {

  constructor (props) {
    super(props);
    this.state = {};
  }

 goToBallotLink () {
    var goToBallot = "/ballot";
    browserHistory.push(goToBallot);
  }

  render () {

    return <div className="intro-story intro-story__background background--image3">
          <div className="intro-story__h1">See Sample Ballot</div>
          <p>On the next screen, you can interact with<br />a local ballot from the most recent US<br />
           2016 General Election.</p>
          <p>Get ready for the next election by following<br />voter guides and inviting your friends.</p>
        <div className="intro-story__padding">
          <button type="button" className="btn btn-lg btn-info" onClick={this.goToBallotLink}>See Sample Ballot</button>
        </div>
        <footer className="intro-story__footer">Stay tuned for 2017-2018 election data.</footer>
      </div>;
  }
}
