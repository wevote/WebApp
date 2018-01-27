import React, { Component, PropTypes } from "react";
import { cordovaDot } from "../../utils/cordovaUtils";

export default class AnimationStory6 extends Component {
  static propTypes = {
    history: PropTypes.object,
    next: React.PropTypes.func
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return <div className="intro-story__background background--image6">
      <div className="intro-story__h1">We Vote</div>
      <div><img className="center-block intro-story__img-height--extra" src={cordovaDot("/img/global/intro-story/slide6-ballot-positions-300x410-min.jpg")} /></div>
      <div className="intro-story__h2">See what your <strong>We Vote</strong> <br />
         network thinks about<br />
        everything on your ballot.</div>
      <div className="intro-story__padding-btn">
        <button type="button" className="btn btn-success" onClick={this.props.next}>Next&nbsp;&nbsp;&gt;</button>
      </div>
    </div>;
  }
}

