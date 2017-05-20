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
    return <div className="">
      <div className="intro-modal__h1">Your Mission</div>
      <div className="intro-modal__h2">Make the world a better place.</div>
      <div>We Vote helps you decide how to vote your values, based on advice from organizations and friends you trust.</div>
      <div>
        1. Follow Issues
        <br/>
        2. Follow Advisers
        <br/>
        3. See Position Bars
        <br/>
      </div>
      <div className="intro-modal__padding-btn">
        <button type="button" className="btn btn-success" onClick={this.props.next}>Next&nbsp;&nbsp;&gt;</button>
      </div>
    </div>;
  }
}
