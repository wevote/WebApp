import React, { Component, PropTypes } from "react";

export default class AnimationStory4 extends Component {
  static propTypes = {
    history: PropTypes.object,
    next: React.PropTypes.func
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return <div className="intro-story__background background--image4">
      <div className="intro-story__h1">We Vote in Safety</div>
      <div><img className="center-block intro-story__img-height" src={"/img/global/intro-story/slide4-ignore-troll-282x282-min.png"}/></div>
      <div className="intro-story__h2">You control who is in<br />your <strong>We Vote</strong> network.</div>
      <div className="intro-story__padding-btn"><button type="button" className="btn btn-info" onClick={this.props.next}>Next</button></div>
    </div>;
  }
}

