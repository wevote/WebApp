import React, { Component } from 'react';
import Helmet from 'react-helmet';
import FacebookSignIn from '../../components/Facebook/FacebookSignIn';
import FacebookStore from '../../stores/FacebookStore';
import { cordovaDot, historyPush } from '../../utils/cordovaUtils';
import LoadingWheel from '../../components/LoadingWheel';
import { renderLog } from '../../utils/logging';
import TwitterSignIn from '../../components/Twitter/TwitterSignIn';
import VoterStore from '../../stores/VoterStore';
import closeIcon from "../../../img/global/icons/x-close.png";

export default class GetStarted extends Component {
  constructor (props) {
    super(props);
    this.state = {
      facebook_auth_response: {},
    };
  }

  componentWillMount () {
    document.body.style.backgroundColor = '#A3A3A3';
    document.body.className = 'story-view';
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.facebookStoreListener = FacebookStore.addListener(this.onFacebookStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    document.body.style.backgroundColor = null;
    document.body.className = '';
    this.facebookStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
    });
  }

  onFacebookStoreChange () {
    this.setState({
      facebook_auth_response: FacebookStore.getFacebookAuthResponse(),
    });
  }

  goToBallotLink () {
    const sampleBallotLink = '/intro/sample_ballot';
    historyPush(sampleBallotLink);
  }

  render () {
    renderLog(__filename);
    if (!this.state.voter) {
      return LoadingWheel;
    }

    if (this.state.voter.signed_in_facebook && this.state.voter.signed_in_twitter) {
      historyPush('/intro/sample_ballot');
      return LoadingWheel;
    }

    if (!this.state.voter.signed_in_facebook && this.state.facebook_auth_response &&
        this.state.facebook_auth_response.facebook_retrieve_attempted) {
      console.log('GetStarted.jsx facebook_retrieve_attempted');
      historyPush('/facebook_sign_in');
      return LoadingWheel;
    }

    return (
      <div>
        <Helmet title="Welcome to We Vote" />
        <div className="intro-story container-fluid well u-inset--md">
          <img src={cordovaDot(closeIcon)} onClick={this.goToBallotLink} className="x-close" alt="close" />
          <div className="intro-story__h1 xs-text-left">Sign In</div>
          <div className="intro-story__padding--btm">
            It&apos;s not required but it helps
            <br />
            you get started faster.
          </div>
          {this.state.voter.signed_in_facebook ?
            null : (
              <div className="row">
                <div className="facebook-intro-connect col-md-4 col-md-offset-4 xs-block form-group">
                  <FacebookSignIn />
                  <br />
                  Sign in with Facebook so you can
                  <br />
                  ask your friends for voting advice.
                  <br />
                  <br />
                </div>
              </div>
            )
          }
          {this.state.voter.signed_in_twitter ?
            null : (
              <div className="row">
                <div className="twitter-intro-connect col-md-4 col-md-offset-4 xs-block form-group">
                  <TwitterSignIn />
                  <br />
                Sign in with Twitter to see
                  <br />
                the voter guides of everyone
                  <br />
                you follow on Twitter.
                  <br />
                  <br />
                </div>
              </div>
            )
          }
          <footer className="intro-story__footer">
            <button
              type="button"
              className="btn btn-lg btn-success"
              onClick={this.goToBallotLink}
            >
              Skip Sign In&nbsp;&nbsp;&gt;
            </button>
            <br />
            Check out We Vote first
          </footer>
        </div>
      </div>
    );
  }
}
