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
      <h1 className="h1">Welcome to We Vote!</h1>
      We Vote is building the next generation of voting tech. We're creating a digital voter guide
      informed by issues you care about and people you trust. Through this nonpartisan, open source
      platform, we'll help you become a better voter, up and down the ballot.<br />
      <br />
      This website is still a work-in-progress, but please feel free to explore.<br />
      <br />
      <button type="button" className="btn btn-sm btn-success"
                  onClick={this.goToGetStarted}>Get Started ></button><br />
      <br />
      If you are looking for more information, <a href="http://www.WeVoteUSA.org" target="_blank">our
      public website can be found here</a>.
      </div>;
  }
}
