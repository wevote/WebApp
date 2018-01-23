import React, { Component, PropTypes } from "react";
import { cordovaDot } from "../../utils/cordovaUtils";

export default class AnimationStory1 extends Component {
  static propTypes = {
    history: PropTypes.object,
    timeline1: PropTypes.object,
    next: React.PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return <div className="intro-story__background background--image1">
      <div className="intro-story__h1">Welcome to We&nbsp;Vote!</div>
      <div><img className="center-block intro-story__img-height" src={cordovaDot("/img/global/intro-story/slide1-blank-ballot-300x315.svg")}/></div>
      <div className="intro-story__h2"><strong>We Vote</strong> is the place to find<br />
        your network's opinions<br />
        on candidates and measures<br />
        before you vote.</div>
      <div className="intro-story__padding-btn">
        <button type="button" className="btn btn-success" onClick={this.props.next}>Next&nbsp;&nbsp;&gt;</button>
      </div>
    </div>;
  }
}

