import React, { Component } from "react";
import PropTypes from "prop-types";

export default class BallotIntroShare extends Component {
  static propTypes = {
    history: PropTypes.object,
    next: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return <div className="intro-modal">
      <div className="intro-modal__h1">Share Your Voice</div>
      <div className="intro-modal__h2">Text text text text.</div>
      <p className="intro-modal__p">We Vote helps you decide how to vote your values, based on advice from organizations and friends you trust.</p>
      <div className="intro-modal__padding-btn">
        <button type="button" className="btn btn-success" onClick={this.props.next}>Next&nbsp;&nbsp;&gt;</button>
      </div>
    </div>;
  }
}
