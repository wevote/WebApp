import React, { Component } from "react";
import Helmet from "react-helmet";
import { browserHistory } from "react-router";
import FacebookSignIn from "../../components/Facebook/FacebookSignIn";
import TwitterSignIn from "../../components/Twitter/TwitterSignIn";

export default class SignIn extends Component {

  constructor (props) {
    super(props);
    this.state = {};
  }

  goToBallotLink () {
    var sampleBallotLink = "/intro/sample_ballot";
    browserHistory.push(sampleBallotLink);
  }

  render () {

    return <div>
      <Helmet title="Welcome to We Vote" />
        <div className="intro-story container-fluid well fluff-full1">
          <img src={"/img/global/icons/x-close.png"} onClick={this.goToBallotLink} className="x-close" alt={"close"}/>
          <div className="intro-story__h1 xs-text-left">Sign In</div>
          <div className="intro-story__padding--btm">It's not required but it helps<br />you get started faster.</div>
          <div className="row">
            <div className="col-md-2 col-md-offset-4 xs-block form-group"><FacebookSignIn /></div>
            <div className="col-md-2"><TwitterSignIn /></div>
          </div>
          <footer className="intro-story__footer">
              <p onClick={this.goToBallotLink}>Skip Sign In - check out We Vote first</p>
          </footer>
        </div>
      </div>;
  }
}
