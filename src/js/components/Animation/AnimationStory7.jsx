import React, { Component, PropTypes } from "react";
import { browserHistory } from "react-router";
import FacebookStore from "../../stores/FacebookStore";
import LoadingWheel from "../../components/LoadingWheel";
import VoterStore from "../../stores/VoterStore";

export default class AnimationStory7 extends Component {
  static propTypes = {
    history: PropTypes.object,
    timeline: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {
      facebook_auth_response: {},
      animation_complete: false
    };
  }

  goToGetStarted () {
    var getStartedNow = "/intro/get_started";
    browserHistory.push(getStartedNow);
  }

  componentDidMount () {
    this._onVoterStoreChange();
    this.facebookListener = FacebookStore.addListener(this._onFacebookChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentDidUpdate () {
    //  This will start the GreenSock animation
    if (this.state.voter && !this.state.animation_complete) {
      this.props.timeline.from(this.refs.header1, 0.75, {left: 100, autoAlpha: 0})
      .from(this.refs.header2, 0.75, {left: 100, autoAlpha: 0})
      .from(this.refs.header3, 0.75, {left: 100, autoAlpha: 0})
      .from(this.refs.signInBtn, 0.50, {left: 100, autoAlpha: 0, onComplete: this.setState({animation_complete: true})});
    }
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
    return <div className="intro-story__background background--image7">
      <div ref="header1" className="intro-story__h1--alt">We Vote Informed</div>
      <div ref="header2" className="intro-story__h1--alt">We Vote Together</div>
      <div ref="header3" className="intro-story__h1--alt">We Vote with Confidence</div>
      <div ref="signInBtn">
        <div className="intro-story__padding-btn">
          <button type="button" className="btn btn-lg btn-success"
                  onClick={this.goToGetStarted}>Get Started&nbsp;&nbsp;&gt;</button>
        </div>
      </div>
    </div>;
  }
}

