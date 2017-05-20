import React, { Component, PropTypes } from "react";

export default class BallotFollowIssues extends Component {
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
      <div className="intro-modal__h1">Follow Issues You Care About</div>
      <div className="intro-story__h2">
        Organization cards go here
      </div>
      <div className="intro-story__h2">After you follow the issues you care about, we will suggest some groups that have opinions about these issues.</div>
      <br/>
      <div className="intro-modal__padding-btn">
        <button type="button" className="btn btn-success" onClick={this.props.next}>Next&nbsp;&nbsp;&gt;</button>
      </div>
      <br/>
    </div>;
  }
}
