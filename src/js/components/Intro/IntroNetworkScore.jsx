import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import { isCordova } from "../../utils/cordovaUtils";

export default class IntroNetworkScore extends Component {
  static propTypes = {
    history: PropTypes.object,
    next: React.PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return <div className="intro-story__background background--image5"
                style={isCordova() ? { backgroundImage: "url(./img/global/intro-story/slide5-flagpole-698x600.jpg)" } : null} >
      <div className="intro-story__h1">We Keep Score</div>
      <div className="intro-story__h2">
        <Button bsStyle="success" bsSize="xsmall" >
          <span>Listen</span>
        </Button> to an organization<br />
        to add their opinions<br />
        to your <strong>We Vote</strong> network.<br />
        <br />
        A candidate's<br />
        <strong>Score in Your Network</strong><br />
        shows support from friends and<br />
        the organizations you listen to.
      </div>
      <div className="intro-story__padding-btn">
        <button type="button" className="btn btn-success" onClick={this.props.next}>Next&nbsp;&nbsp;&gt;</button>
      </div>
    </div>;
  }
}
