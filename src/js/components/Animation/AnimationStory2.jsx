import React, { Component, PropTypes } from "react";

export default class AnimationStory2 extends Component {
  static propTypes = {
    history: PropTypes.object,
    timeline2: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

//  This will start the GreenSock animation
  componentDidMount () {
    //this.props.timeline2.from(this.refs.header2, 2, {delay: 1, left: 100, autoAlpha: 0});
  }

  render () {
    return <div className="intro-story__background background--image2">
      <div className="intro-story__h1">We Vote Informed</div>
      <div ref="ballotImg1"><img className="center-block intro-story__img-width" src={"/img/global/intro-story/slide2-322x124.svg"}/></div>
      <div ref="header2" className="intro-story__h2">Follow groups you trust.<br />See what they support or oppose.</div>
    </div>;
  }
}

