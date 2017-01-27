import React, { Component, PropTypes } from "react";

export default class AnimationStory4 extends Component {
  static propTypes = {
    history: PropTypes.object,
    timeline4: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

//  This will start the GreenSock animation
  componentDidMount () {
    //this.props.timeline4.from(this.refs.header2, 2, {delay: 1, left: 100, autoAlpha: 0});
  }

  render () {
    return <div className="intro-story__background background--image4">
      <div className="intro-story__h1">We Vote Together</div>
      <div ref="ballotImg1"><img className="center-block intro-story__img-height" src={"/img/global/intro-story/slide4-282x282-min.png"}/></div>
      <div ref="header2" className="intro-story__h2">You control who is in<br />your <strong>We Vote</strong> network.</div>
    </div>;
  }
}

