import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import IssuesFollowedDisplayList from "../Issues/IssuesFollowedDisplayList";
import { renderLog } from "../../utils/logging";

export default class BallotIntroIssuesSuccess extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    renderLog(__filename);
    return <div className="intro-modal">
      <div className="intro-modal__h1">Nice job!</div>
      <div className="intro-modal__h2">Watch for your issues under each candidate or measure.</div>
      <span className=""><IssuesFollowedDisplayList /></span>
      <div className="intro-modal__h2">By clicking on an issue image,<br />
        you will find advisers<br />
        related to that issue<br />
        that you can <Button bsStyle="success"
                            bsSize="xsmall"
                            >
                      <span>Listen</span>
                    </Button> to.</div>
      <div className="intro-modal__h2"><br /></div>
      <div className="intro-modal__button-wrap">
        <button type="button" className="btn btn-success intro-modal__button" onClick={this.props.next}>See Your Ballot&nbsp;&gt;</button>
      </div>
    </div>;
  }
}
