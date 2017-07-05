import React, { Component, PropTypes } from "react";

export default class BallotIntroPositionBar extends Component {
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
      <div className="intro-modal__h1">Congratulations!</div>
      <div className="intro-story__h2">Now that you have a network of advisers, you will see a position bar next to ballot items..</div>
      <div className="intro-modal__position-wrap">
        <img className="intro-modal__position-img" src="/img/global/icons/position-bar-v1-265x43.png" alt="position bar" />
        <div className="intro-modal__position-description-wrap">
          <p className="intro-modal__p">Supporters in your network</p>
          <p className="intro-modal__p">Opposers in your network</p>
        </div>
      </div>
      <div className="intro-modal__padding-btn__btn-center intro-modal__button-wrap">
        <button type="button" className="btn btn-success intro-modal__button" onClick={this.props.next}>See Your Ballot &nbsp;&nbsp;&gt;</button>
      </div>
    </div>;
  }
}
