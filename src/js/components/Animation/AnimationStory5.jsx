import React, { Component, PropTypes } from "react";

export default class AnimationStory5 extends Component {
  static propTypes = {
    history: PropTypes.object,
    next: React.PropTypes.func
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return <div className="intro-story__background background--image5">
      <div className="intro-story__h1">We Vote with Confidence</div>
      <div><img className="center-block intro-story__img-width" src={"/img/global/intro-story/slide5-candidate-position-300x140-min.jpg"}/></div>
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
