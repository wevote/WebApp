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
          <div className="intro-story__h1">See Your Ballot</div>
          <div ref="header2" className="intro-story__h2">On the next screen,<br />
           you'll see your ballot from the<br />
           2016 General Election.</div>
          <div ref="header2" className="intro-story__h2">Get ready for the next election now<br />
            by following voter guides<br />
            and inviting your friends.</div>
        <div className="intro-story__padding">
          <button type="button" className="btn btn-lg btn-info" onClick={this.goToBallotLink}>Go to Your Ballot</button>
        </div>
        <footer className="intro-story__footer">Stay tuned for 2017-2018 election data!</footer>
      </div>;
  }
}
