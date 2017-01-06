import React, { Component, PropTypes } from "react";

export default class AnimationStory1 extends Component {
  static propTypes = {
    history: PropTypes.object,
    timeline1: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

//  This will start the GreenSock animation
  componentDidMount () {
    this.props.timeline1.from(this.refs.header1, 0.50, {left: 100, autoAlpha: 0})
    .from(this.refs.header2, 0.50, {left: 100, autoAlpha: 0})
    .from(this.refs.header3, 0.50, {left: 100, autoAlpha: 0});
  }

  static getProps () {
    return {};
  }

  render () {
    return <div>
      <div ref="header1" className="example-header">Welcome to We Vote!</div>
      <div ref="header2" className="example-header2">We Vote Informed</div>
      <div ref="header3" className="example-header">This will be an image</div>
    </div>;
  }
}

