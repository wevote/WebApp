import React, { Component, PropTypes } from "react";

export default class AnimationStory2 extends Component {
  static propTypes = {
    history: PropTypes.object,
    next: React.PropTypes.func
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return <div className="intro-story__background background--image2">
      <div className="intro-story__h1">We Vote Informed</div>
      <div><img className="center-block intro-story__img-width" src={"/img/global/intro-story/slide2-organization-follow-322x124.svg"}/></div>
      <div className="intro-story__h2">Follow groups you trust.<br />
        They become part of<br />
        your <strong>We Vote</strong> network.<br />
        See what they support or oppose.</div>
      <div className="intro-story__padding-btn">
        <button type="button" className="btn btn-info" onClick={this.props.next}>Next&nbsp;&nbsp;&gt;</button>
      </div>
    </div>;
  }
}

