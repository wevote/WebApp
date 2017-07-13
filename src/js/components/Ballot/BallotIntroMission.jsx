import React, { Component, PropTypes } from "react";

export default class BallotIntroMission extends Component {
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
      <div className="intro-modal__h1">Your Mission:</div>
      <div className="intro-modal__h2">Make the world a better place.</div>
      <div className="intro-modal-features">
        <div className="intro-modal-features__block">
          <img className="intro-modal-features__image" src="/img/welcome/benefits/learn-from-orgs.png" width="50%" height="50%" />
          <h3 className="intro-modal-features__text">Follow Organizations</h3>
        </div>
        <div className="intro-modal-features__block">
          <img className="intro-modal-features__image" src="/img/welcome/benefits/choose-friends.png" width="50%" height="50%" />
          <h3 className="intro-modal-features__text">Follow Friends</h3>
        </div>
      </div>
      <p className="intro-modal__p">We Vote helps you decide how to vote your values, based on advice from organizations and friends you trust.</p>
      <div className="intro-modal__button-wrap">
        <button type="button" className="btn btn-success intro-modal__button" onClick={this.props.next}>
          <span>Next ></span>
        </button>
      </div>
    </div>;
  }
}
