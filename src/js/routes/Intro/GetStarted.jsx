import React, { Component } from "react";
import Helmet from "react-helmet";
import { browserHistory } from "react-router";
import FacebookSignIn from "../../components/Facebook/FacebookSignIn";
import FacebookStore from "../../stores/FacebookStore";
import LoadingWheel from "../../components/LoadingWheel";
import TwitterSignIn from "../../components/Twitter/TwitterSignIn";
import VoterStore from "../../stores/VoterStore";

export default class SignIn extends Component {

  constructor (props) {
    super(props);
    this.state = {
      facebook_auth_response: {}
    };
  }

  goToBallotLink () {
    var sampleBallotLink = "/intro/sample_ballot";
    browserHistory.push(sampleBallotLink);
  }

  componentWillMount () {
    document.body.style.backgroundColor = "#A3A3A3";
    document.body.className = "story-view";
  }

  componentDidMount () {
    this._onVoterStoreChange();
    this.facebookListener = FacebookStore.addListener(this._onFacebookChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    document.body.style.backgroundColor = null;
    document.body.className = "";
  }

  _onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter()
    });
  }

  _onFacebookChange () {
    this.setState({
      facebook_auth_response: FacebookStore.getFacebookAuthResponse(),
    });
  }

  goToGetStarted () {
    var getStartedNow = "/intro/get_started";
    browserHistory.push(getStartedNow);
  }

  render () {
    if (!this.state.voter){
      return LoadingWheel;
    }

    // console.log("SignIn.jsx this.state.facebook_auth_response:", this.state.facebook_auth_response);
    if (!this.state.voter.signed_in_facebook && this.state.facebook_auth_response && this.state.facebook_auth_response.facebook_retrieve_attempted) {
      console.log("GetStarted.jsx facebook_retrieve_attempted");
      browserHistory.push("/facebook_sign_in");
      // return <span>SignIn.jsx facebook_retrieve_attempted</span>;
      return LoadingWheel;
    }

    return <div>
      <Helmet title="Welcome to We Vote" />
        <div className="intro-story container-fluid well fluff-full1">
          <img src={"/img/global/icons/x-close.png"} onClick={this.goToBallotLink} className="x-close" alt={"close"}/>
          <div className="intro-story__h1 xs-text-left">Sign In</div>
          <div className="intro-story__padding--btm">It's not required but it helps<br />you get started faster.</div>
          <div className="row">
            <div className="col-md-2 col-md-offset-4 xs-block form-group">
              {this.state.voter.signed_in_facebook ?
                null :
                <FacebookSignIn />
              }</div>
            <div className="col-md-2">
              {this.state.voter.signed_in_twitter ?
                null :
                <TwitterSignIn />
              }</div>
          </div>
          <footer className="intro-story__footer">
              <span role="button"><p onClick={this.goToBallotLink}><strong>Skip Sign In - check out We Vote first</strong></p></span>
          </footer>
        </div>
      </div>;
  }
}
