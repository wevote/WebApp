import React, { Component } from "react";
// import PropTypes from "prop-types";
import { cordovaDot } from "../../utils/cordovaUtils";
import { renderLog } from "../../utils/logging";

export default class AnimationStory2 extends Component {
  // Oct 1, 2018: Seems to cause the component to initialize too early with Slider under React 16
  // static propTypes = {
  //   history: PropTypes.object,
  //   next: PropTypes.func,
  // };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    renderLog(__filename);
    return <div className="intro-story__background background--image2">
      <div className="intro-story__h1">We Vote in Safety</div>
      <div><img className="center-block intro-story__img-height" src={cordovaDot("/img/global/intro-story/slide2-ignore-troll-282x282-min.png")} /></div>
      <div className="intro-story__h2">You control who is in<br />
        your <strong>We Vote</strong> network.</div>
      <div className="intro-story__padding-btn">
        <button type="button" className="btn btn-success" onClick={this.props.next}>Next&nbsp;&nbsp;&gt;</button>
      </div>
    </div>;
  }
}

