import React, { Component, PropTypes } from "react";

export default class AnimationStory2 extends Component {
  static propTypes = {
    history: PropTypes.object,
    timeline2: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

//  This will start the GreenSock animation
  componentDidMount () {
    this.props.timeline2.from(this.refs.header4, 0.50, {left: 100, autoAlpha: 0})
    .from(this.refs.header5, 0.50, {left: 100, autoAlpha: 0})
    .from(this.refs.header6, 0.50, {left: 100, autoAlpha: 0});
  }

  static getProps () {
    return {};
  }

  render () {
    return <div>
      <div className="example-header" ref="header4">Section 2</div>
      <div className="example-header" ref="header5">Text</div>
      <div className="example-header" ref="header6">More Text</div>
    </div>;
  }
}

