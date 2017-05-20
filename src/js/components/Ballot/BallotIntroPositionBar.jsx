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
    return <div className="">
      <div className="intro-modal__h1">Congratulations!</div>
      <div className="intro-story__h2">Now that you have a network of advisers, you will see a position bar next to ballot items..</div>
      <div className="intro-story__h2">Position Bar</div>
      <div className="intro-story__h2">
        Position Bar Goes here
      </div>
      <div className="intro-modal__padding-btn">
        <button type="button" className="btn btn-success" onClick={this.props.next}>See Your Ballot &nbsp;&nbsp;&gt;</button>
      </div>
      <br/>
    </div>;
  }
}
