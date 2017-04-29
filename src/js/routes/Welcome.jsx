import React, { Component } from "react";
import { browserHistory } from "react-router";
import Helmet from "react-helmet";

export default class Intro extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  static getProps () {
    return {};
  }

  componentDidMount () {
  }

  goToGetStarted () {
    var getStartedNow = "/intro/sample_ballot";
    browserHistory.push(getStartedNow);
  }

  render () {

    return <div>
      <Helmet title="Welcome to We Vote" />
      <div className="u-f1">Heading One</div>
      <div className="u-f2">Heading Two</div>
      <div className="u-f3">Heading Three</div>
      <div className="u-f4">Heading Four</div>
      <div className="u-f5">Heading Five</div>
      <div className="u-f6">Heading Six</div>


      <h1 className="h1">Welcome to We Vote!</h1>
      <p>We Vote is building the next generation of voting tech. We're creating a digital voter guide
      informed by issues you care about and people you trust. Through this nonpartisan, open source
      platform, we'll help you become a better voter, up and down the ballot.</p>
      <p><strong>This website is still a work-in-progress, but please feel free to explore.</strong></p>

      <button type="button" className="btn btn-sm btn-success u-stack--md"
                  onClick={this.goToGetStarted}>Get Started</button>
      <p>If you are looking for more information, <a href="http://www.WeVoteUSA.org" target="_blank">our
      public website can be found here</a>.</p>
    </div>;
  }
}
