import React, { Component, PropTypes } from "react";

export default class BallotIntroFollowAdvisers extends Component {
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
      <div className="intro-modal__h1">Follow Organizations or People</div>
      <div className="intro-story__h2">Great work! Based on your issues, these are organizations or people that might share your values. Follow them to see their recommendations.</div>
      <br/>
      <div className="intro-story__h2">
        Organization cards go here
      </div>
      <div className="intro-modal__padding-btn">
        <button type="button" className="btn btn-success" onClick={this.props.next}>Next&nbsp;&nbsp;&gt;</button>
      </div>
      <br/>
    </div>;
  }
}
