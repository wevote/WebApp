import React, { Component, PropTypes } from "react";

//const imgUrl = "/img/global/animations/3.1/american-boy-sm.png";
// const divStyle = {
// backgroundImage: "url(" + imgUrl + ")",
//};

export default class AnimationStory3 extends Component {
  static propTypes = {
    history: PropTypes.object,
    timeline3: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

//  This will start the GreenSock animation
  componentDidMount () {
    this.props.timeline3.from(this.refs.header2, 2, {delay: 1, left: 100, autoAlpha: 0});
  }

  render () {
    return <div className="intro-story__background background--image2">
      <div className="intro-story__h1">We Vote Together</div>
      <div ref="ballotImg1"><img className="center-block intro-story__img-height" src={"/img/global/animations/slide3.png"}/></div>
      <div ref="header2" className="intro-story__h2">Add friends and learn together.<br />Share your opinions privately.</div>
    </div>;
  }
}

