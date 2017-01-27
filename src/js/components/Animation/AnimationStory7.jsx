import React, { Component, PropTypes } from "react";
import { browserHistory } from "react-router";
import FacebookSignIn from "../../components/Facebook/FacebookSignIn";
import TwitterSignIn from "../../components/Twitter/TwitterSignIn";

export default class AnimationStory2 extends Component {
  static propTypes = {
    history: PropTypes.object,
    timeline7: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  goToGetStarted () {
    var getStartedNow = "/intro/get_started";
    browserHistory.push(getStartedNow);
  }

  //  This will start the GreenSock animation
  componentDidMount () {
    this.props.timeline7.from(this.refs.header1, 0.75, {left: 100, autoAlpha: 0})
    .from(this.refs.header2, 0.75, {left: 100, autoAlpha: 0})
    .from(this.refs.header3, 0.75, {left: 100, autoAlpha: 0})
    .from(this.refs.signInBtn, 0.50, {left: 100, autoAlpha: 0});
  }

  render () {
    return <div className="intro-story__background background--image7">
      <div ref="header1" className="intro-story__h1-alt">We Vote Informed</div>
      <div ref="header2" className="intro-story__h1-alt">We Vote Together</div>
      <div ref="header3" className="intro-story__h1-alt">We Vote with Confidence</div>
      <div ref="signInBtn">
        <div className="intro-story__padding"><button type="button" className="btn btn-lg btn-info" onClick={this.goToGetStarted}>Get Started</button></div>
        <div className="row">
         <div className="col-md-2 col-md-offset-4 xs-block form-group"><FacebookSignIn /></div>
         <div className="col-md-2"><TwitterSignIn /></div>
        </div>
      </div>
    </div>;
  }
}

