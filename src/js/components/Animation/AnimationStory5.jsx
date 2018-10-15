import React, { Component } from "react";
import PropTypes from "prop-types";
import { cordovaDot } from "../../utils/cordovaUtils";
import { renderLog } from "../../utils/logging";

export default class AnimationStory5 extends Component {
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
    return <div className="intro-story__background background--image5">
      <div className="intro-story__h1">We Vote with Confidence</div>
      <div><img className="center-block intro-story__img-width" src={cordovaDot("/img/global/intro-story/slide5-candidate-position-300x140-min.jpg")} /></div>
      <div className="intro-story__h2">Find out what your friends<br />
        think about candidates,<br />
        including comments.
        <br />
        Share your opinions publicly<br />
        or privately.</div>
      <div className="intro-story__padding-btn">
        <button type="button" className="btn btn-success" onClick={this.props.next}>Next&nbsp;&nbsp;&gt;</button>
      </div>
    </div>;
  }
}
