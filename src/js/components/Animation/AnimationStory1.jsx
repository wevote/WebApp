import React, { Component, PropTypes } from "react";

export default class AnimationStory1 extends Component {
  static propTypes = {
    history: PropTypes.object,
    timeline1: PropTypes.object,
    next: React.PropTypes.func
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return <div className="intro-story__background background--image1">
      <div className="intro-story__h1">Welcome to We Vote!</div>
      <div><img className="center-block intro-story__img-height" src={"/img/global/intro-story/slide1-blank-ballot-300x315.svg"}/></div>
      <div className="intro-story__h2">View your ballot to see<br />candidates and measures<br />for upcoming elections.</div>
      <div className="intro-story__padding-btn"><button type="button" className="btn btn-info" onClick={this.props.next}>Next</button></div>
    </div>;
  }
}

