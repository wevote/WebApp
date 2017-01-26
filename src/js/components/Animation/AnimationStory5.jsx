import React, { Component, PropTypes } from "react";

//const imgUrl = "/img/global/animations/3.1/american-bicycle-sm.png";
// const divStyle = {
// backgroundImage: "url(" + imgUrl + ")",
//};

export default class AnimationStory2 extends Component {
  static propTypes = {
    history: PropTypes.object,
    timeline5: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

//  This will start the GreenSock animation
  componentDidMount () {
    this.props.timeline5.from(this.refs.header2, 2, {delay: 1, left: 100, autoAlpha: 0});
  }

  render () {
    return <div className="intro-story__background background--image2">
      <div className="intro-story__h1">We Vote with Confidence</div>
      <div ref="ballotImg1"><img className="center-block intro-story__img-width" src={"/img/global/animations/slide5.svg"}/></div>
      <div ref="header2" className="intro-story__h2">See what your <strong>We Vote</strong><br />network supports or opposes.</div>
    </div>;
  }
}

