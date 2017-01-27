import React, { Component, PropTypes } from "react";

export default class AnimationStory2 extends Component {
  static propTypes = {
    history: PropTypes.object,
    timeline6: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

//  This will start the GreenSock animation
  componentDidMount () {
    //this.props.timeline6.from(this.refs.header2, 2, {delay: 1, left: 100, autoAlpha: 0});
  }

  render () {
    return <div className="intro-story__background background--image6">
      <div className="intro-story__h1">We Vote Informed</div>
      <div ref="ballotImg1"><img className="center-block intro-story__img-height" src={"/img/global/intro-story/slide6-300x410-min.jpg"}/></div>
      <div ref="header2" className="intro-story__h2">See what your <strong>We Vote</strong> network thinks<br />about everything on your ballot.</div>
    </div>;
  }
}

