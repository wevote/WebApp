import React, { Component, PropTypes } from "react";
import { cordovaDot } from "../../utils/cordovaUtils";

export default class AnimationStory3 extends Component {
  static propTypes = {
    history: PropTypes.object,
    next: React.PropTypes.func
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return <div className="intro-story__background background--image3">
      <div className="intro-story__h1">We Vote Informed</div>
      <div><img className="center-block intro-story__img-width" src={cordovaDot("/img/global/intro-story/slide3-organization-follow-322x124.svg")} /></div>
      <div className="intro-story__h2">Follow groups you trust<br />
        to add them to<br />
        your <strong>We Vote</strong> network.<br />
        See what they support or oppose.</div>
      <div className="intro-story__padding-btn">
        <button type="button" className="btn btn-success" onClick={this.props.next}>Next&nbsp;&nbsp;&gt;</button>
      </div>
    </div>;
  }
}

