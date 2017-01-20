import React, { Component, PropTypes } from "react";

export default class AnimationStory3 extends Component {
  static propTypes = {
    history: PropTypes.object,
    timeline3: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

//  This will start the GreenSock animation
  componentDidMount () {
    this.props.timeline3.from(this.refs.header7, 0.50, {left: 100, autoAlpha: 0})
    .from(this.refs.header8, 0.50, {left: 100, autoAlpha: 0})
    .from(this.refs.header9, 0.50, {left: 100, autoAlpha: 0});
  }

  static getProps () {
    return {};
  }
      //<div className="row" ref="signInBtn">
        //<div className="col-xs-6 col-md-6 pull-left"><FacebookSignIn /></div>
        //<div className="col-xs-6 col-md-6 pull-right"><TwitterSignIn /></div>
      //</div>
  render () {
    return <div>
      <div ref="header7" className="example-header">Section 3</div>
      <div ref="header8" className="example-header2">Text</div>
      <div ref="header9" className="example-header">More text</div>
    </div>;
  }
}

