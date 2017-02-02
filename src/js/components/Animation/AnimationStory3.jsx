import React, { Component, PropTypes } from "react";

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
      <div className="intro-story__h1">We Vote Together</div>
      <div><img className="center-block intro-story__img-height--extra" src={"/img/global/intro-story/slide3-connect-friends-300x370-min.png"}/></div>
      <div className="intro-story__h2">Add friends to your<br />
        <strong>We Vote</strong> network.</div>
      <div className="intro-story__padding-btn">
        <button type="button" className="btn btn-info" onClick={this.props.next}>Next&nbsp;&nbsp;&gt;</button>
      </div>
    </div>;
  }
}

