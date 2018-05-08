import React, { Component } from "react";
import PropTypes from "prop-types";
import IssuesFollowedDisplayList from "../Issues/IssuesFollowedDisplayList";
import IssueStore from "../../stores/IssueStore";
import { renderLog } from "../../utils/logging";

export default class BallotIntroIssuesSuccess extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      followedIssues: [],
    };
    this.followedIssuesCount = this.followedIssuesCount.bind(this);
    this.onIssueStoreChange = this.onIssueStoreChange.bind(this);
  }

  componentDidMount () {
    this.onIssueStoreChange();
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange);
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
  }

  onIssueStoreChange () {
    this.setState({
      followedIssues: IssueStore.getIssuesVoterIsFollowing(),
    });
  }

  followedIssuesCount () {
    let followedIssuesCount = this.state.followedIssues.length;

    return followedIssuesCount >= 0 ? followedIssuesCount : 0;
  }

  render () {
    renderLog(__filename);

    return <div className="intro-modal">
      {this.followedIssuesCount() ?
        <span>
          <div className="intro-modal__h1">Nice job following issues!</div>
          <div className="intro-modal__h2">Watch for your issues under each candidate or measure.</div>
          <span className=""><IssuesFollowedDisplayList /></span>
        </span> :
        <div className="intro-modal__h1">You can follow issues on your ballot.</div>
      }
      <div className="intro-modal__h2">By clicking on an issue image,<br />
        you will find advisers<br />
        related to that issue<br />
        that you can <strong>Listen</strong> to.</div>
      <div className="intro-modal__h2"><br /></div>
      <div className="intro-modal__button-wrap">
        <button type="button" className="btn btn-success intro-modal__button" onClick={this.props.next}>See Your Ballot&nbsp;&gt;</button>
      </div>
    </div>;
  }
}
