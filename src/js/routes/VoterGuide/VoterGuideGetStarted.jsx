import React, { Component } from "react";
import Helmet from "react-helmet";
import AnalyticsActions from "../../actions/AnalyticsActions";
import FacebookSignIn from "../../components/Facebook/FacebookSignIn";
import FacebookStore from "../../stores/FacebookStore";
import { cordovaDot, historyPush } from "../../utils/cordovaUtils";
import LoadingWheel from "../../components/LoadingWheel";
import TwitterSignIn from "../../components/Twitter/TwitterSignIn";
import VoterStore from "../../stores/VoterStore";

export default class VoterGuideGetStarted extends Component {
  constructor (props) {
    super(props);
    this.state = {
      facebook_auth_response: {},
    };
  }

  goToBallotLink () {
    let sampleBallotLink = "/ballot";
    historyPush(sampleBallotLink);
  }

  componentWillMount () {
    document.body.style.backgroundColor = "#A3A3A3";
    document.body.className = "story-view";
  }

  componentDidMount () {
    this._onVoterStoreChange();
    this.facebookListener = FacebookStore.addListener(this._onFacebookChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    AnalyticsActions.saveActionVoterGuideGetStarted(VoterStore.election_id());
  }

  componentWillUnmount () {
    document.body.style.backgroundColor = null;
    document.body.className = "";
    this.facebookListener.remove();
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
    });
  }

  _onFacebookChange () {
    this.setState({
      facebook_auth_response: FacebookStore.getFacebookAuthResponse(),
    });
  }

  render () {
    if (!this.state.voter) {
      return LoadingWheel;
    }

    if (this.state.voter.signed_in_facebook || this.state.voter.signed_in_twitter) {
      historyPush("/yourpage");
      return LoadingWheel;
    }

    if (!this.state.voter.signed_in_facebook && this.state.facebook_auth_response &&
        this.state.facebook_auth_response.facebook_retrieve_attempted) {
      console.log("GetStarted.jsx facebook_retrieve_attempted");
      historyPush("/facebook_sign_in");
      return LoadingWheel;
    }

    return <div>
      <Helmet title="Welcome to We Vote" />
        <div className="intro-story container-fluid well u-inset--md">
          <img src={cordovaDot("/img/global/icons/x-close.png")} onClick={this.goToBallotLink} className="x-close" alt={"close"}/>
          <div className="intro-story__h1 xs-text-left">Sign in to create a voter guide</div>
          <div className="intro-story__padding--btm">Once you sign in, you will be able to create your voter guide in your profile, in the upper right corner.</div>
          {this.state.voter.signed_in_facebook ?
            null :
            <div className="row">
              <div className="facebook-intro-connect col-md-4 col-md-offset-4 xs-block form-group">
                <FacebookSignIn /><br />
                <br />
              </div>
            </div> }
          {this.state.voter.signed_in_twitter ?
            null :
            <div className="row">
              <div className="twitter-intro-connect col-md-4 col-md-offset-4 xs-block form-group">
                <TwitterSignIn /><br />
                <br />
              </div>
            </div> }
          <footer className="intro-story__footer">
            <button type="button" className="btn btn-lg btn-success"
                    onClick={this.goToBallotLink}>Skip Sign In&nbsp;&nbsp;&gt;</button><br />
            Check out We Vote first
          </footer>
        </div>
      </div>;
  }
}
