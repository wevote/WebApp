import React, { Component } from "react";
import PropTypes from "prop-types";
import { cordovaDot } from "../../utils/cordovaUtils";
import { renderLog } from "../../utils/logging";

export default class AnimationStory4 extends Component {
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
    return <div className="intro-story__background background--image4">
      <div className="intro-story__h1">We Vote Together</div>
      <div><img className="center-block intro-story__img-height--extra" src={cordovaDot("/img/global/intro-story/slide4-connect-friends-300x370-min.png")} /></div>
      <div className="intro-story__h2">Add friends to your<br />
        <strong>We Vote</strong> network so you can<br />
        team up to cover all the issues.</div>
      <div className="intro-story__padding-btn">
        <button type="button" className="btn btn-success" onClick={this.props.next}>Next&nbsp;&nbsp;&gt;</button>
      </div>
    </div>;
  }
}

