import React, { Component, PropTypes } from "react";

export default class BallotIntroPositionBar extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return <div className="intro-modal">
      <div className="intro-modal__h1">Nice job!</div>
      <div className="intro-modal__h2">Each position bar shows where your network stands on a
        candidate, measure or referendum.</div>
      <div className="intro-modal__position-wrap">
        <img className="intro-modal__position-img" src="/img/global/icons/position-bar-v1-265x43.png" alt="position bar" />
        <div className="intro-modal__position-description-wrap">
          <p className="intro-modal__p">Supporters in your network</p>
          <p className="intro-modal__p">Opposers in your network</p>
        </div>
      </div>
      <div className="intro-modal__button-wrap">
        <button type="button" className="btn btn-success intro-modal__button" onClick={this.props.next}>See Your Ballot&nbsp;&gt;</button>
      </div>
    </div>;
  }
}
