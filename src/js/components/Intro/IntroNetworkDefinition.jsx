import React, { Component } from "react";
import PropTypes from "prop-types";
import { cordovaDot, isCordova } from "../../utils/cordovaUtils";
import { renderLog } from "../../utils/logging";

export default class IntroNetworkDefinition extends Component {
  // Oct 1, 2018: Seems to cause the compenent to initialize too early with React 16
  // static propTypes = {
  //   history: PropTypes.object,
  //   next: PropTypes.func,
  // };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    renderLog(__filename);
    return <div className="intro-story__background background--image4"
                style={isCordova() ? { backgroundImage: "url(./img/global/intro-story/slide4-working-together-698x600.jpg)" } : null} >
      <div className="intro-story__h1">We Vote Together</div>
      <div className="intro-story__h2">Your friends, and the <br />
        organizations
        you <strong>Listen</strong> to, <br />
        are your <strong>We Vote</strong> network.</div>
        <div><br /></div>
      <div><img className="center-block intro-story__img-height--extra u-bg-white" src={cordovaDot("/img/global/intro-story/intro-listen-to-friends-graphic.svg")}/></div>
      <div className="intro-story__padding-btn">
        <button type="button" className="btn btn-success btn-lg" onClick={this.props.next}>Next&nbsp;&nbsp;&gt;</button>
      </div>
    </div>;
  }
}
