import React, { Component, PropTypes } from "react";

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
    this.props.timeline1.from(this.refs.header2, 3, {delay: 1, left: 100, autoAlpha: 0});
    }

  render () {
    return <div className="intro-story__background background--image1">
      <div className="intro-story__h1">We Vote Informed</div>
      <div ref="ballotImg1"><img className="center-block intro-story__img-height" src={"/img/global/animations/slide1.svg"}/></div>
      <div ref="header2" className="intro-story__h2">View your ballot to see<br />candidates and measures<br />for upcoming elections.</div>
    </div>;
  }
}

