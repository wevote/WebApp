import React, { Component, PropTypes } from "react";

export default class BallotIntroVote extends Component {
  static propTypes = {
    history: PropTypes.object,
    next: PropTypes.func.isRequired,
    close: PropTypes.func
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return <div className="intro-modal">
      <div className="intro-modal__close">
        <a onClick={this.props.close} className="intro-modal__close-anchor">
          <img src="/img/global/icons/x-close.png" alt="close" />
        </a>
      </div>
      <div className="intro-modal__h1">Vote!</div>
      <div className="intro-modal__h2">Text text text text.</div>
      <p className="intro-modal__p">We Vote helps you decide how to vote your values, based on advice from organizations and friends you trust.</p>
      <div className="intro-modal__padding-btn">
        <button type="button" className="btn btn-success" onClick={this.props.next}>Next&nbsp;&nbsp;&gt;</button>
      </div>
    </div>;
  }
}
