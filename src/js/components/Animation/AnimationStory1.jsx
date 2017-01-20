import React, { Component, PropTypes } from "react";
import FacebookSignIn from "../../components/Facebook/FacebookSignIn";
import TwitterSignIn from "../../components/Twitter/TwitterSignIn";

export default class AnimationStory1 extends Component {
  static propTypes = {
    history: PropTypes.object,
    timeline1: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

//  This will start the GreenSock animation
  componentDidMount () {
    this.props.timeline1.from(this.refs.header1, 2, {left: 100, autoAlpha: 0}).duration(4)
    .to(this.refs.header1, 1, {left: 100, autoAlpha: 0, paddingBottom: 0})
    .from(this.refs.header2, 2, {left: 100, autoAlpha: 0, paddingBottom: 40})
    .from(this.refs.ballotImg1, 1, {autoAlpha: 0, paddingTop: 20}).duration(4)
    }
//TODO onComplete: this.props.next executes continuously; figure out work-around


  render () {
    return <div className="intro-story__background-image">
      <div className="h1">We Vote Informed</div>
      <div ref="ballotImg1"><img className="center-block" src={"/img/global/animations/3.1/3.1.3.png"}/></div>
      <div ref="header1" className="h2">View your ballot to see candidates and measures for upcoming elections.</div>
      <div ref="header2" className="h2">Follow groups you trust. See their views.</div>
    </div>;
  }
}

