import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import IssueActions from "../../actions/IssueActions";
import IssueFollowToggle from "./IssueFollowToggle";
import IssueStore from "../../stores/IssueStore";

const NEXT_BUTTON_TEXT = "Next >";
const SKIP_BUTTON_TEXT = "Skip >";
const INITIAL_DESCRIPTION_TEXT = "After you follow five issues you care about, we will suggest some groups that have opinions about these issues.";
const NEXT_SCREEN_PROMPT_TEXT = "On the next screen, we will help you find organizations that share your values.";

export default class BallotIntroFollowIssues extends Component {
  static propTypes = {
    history: PropTypes.object,
    next: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      description_text: INITIAL_DESCRIPTION_TEXT,
      followed_issues: [],
      issues: [],
      next_button_text: NEXT_BUTTON_TEXT,
      number_of_required_issues: 5,
    };
  }

  componentDidMount () {
    IssueActions.retrieveIssuesForVoter();
    IssueActions.retrieveIssuesToFollow();
    this._onIssueStoreChange();
    this.onIssueFollow = this.onIssueFollow.bind(this);
    this.onIssueStopFollowing = this.onIssueStopFollowing.bind(this);
    this.onNext = this.onNext.bind(this);
    this.issueStoreListener = IssueStore.addListener(this._onIssueStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
  }

  _onIssueStoreChange () {
    // update followed_issues only for first time, subsequent updates will be made locally
    if (this.state.followed_issues.length) {
      this.setState({ issues: IssueStore.getIssuesVoterCanFollow() });
    } else {
      this.setState({
        issues: IssueStore.getIssuesVoterCanFollow(),
        followed_issues: IssueStore.getIssuesVoterIsFollowing(),
      });
    }

    this.updateNextState();
  }

  remainingIssues () {
    var actual = this.state.number_of_required_issues - this.state.followed_issues.length;

    return actual >= 0 ? actual : 0;
  }

  updateNextState () {
    if (this.remainingIssues()) {
      this.setState({ next_button_text: "Please Follow " + this.remainingIssues() + " More" });
    } else {
      this.setState({ next_button_text: NEXT_BUTTON_TEXT });
    }
  }

  onIssueFollow (issue_we_vote_id) {
    let index = this.state.followed_issues.indexOf(issue_we_vote_id);
    let description_text;
    if (index === -1) {
      var new_followed_issues = this.state.followed_issues;
      new_followed_issues.push(issue_we_vote_id);
      if (this.state.followed_issues.length >= this.state.number_of_required_issues) {
        description_text = NEXT_SCREEN_PROMPT_TEXT;
      } else {
        description_text = INITIAL_DESCRIPTION_TEXT;
      }
      this.setState({
        description_text: description_text,
        followed_issues: new_followed_issues,
        next_button_text: NEXT_BUTTON_TEXT
      });

      this.updateNextState();
    }
  }

  onIssueStopFollowing (issue_we_vote_id) {
    let index = this.state.followed_issues.indexOf(issue_we_vote_id);
    let description_text;
    if (index > -1) {
      var new_followed_issues = this.state.followed_issues;
      new_followed_issues.splice(index, 1);
      if (this.state.followed_issues.length >= this.state.number_of_required_issues) {
        description_text = NEXT_SCREEN_PROMPT_TEXT;
      } else {
        description_text = INITIAL_DESCRIPTION_TEXT;
      }
      if (new_followed_issues.length) {
        this.setState({
          followed_issues: new_followed_issues,
        });
      } else {
        this.setState({
          description_text: description_text,
          followed_issues: new_followed_issues,
          next_button_text: NEXT_BUTTON_TEXT,
        });
      }

      this.updateNextState();
    }
  }

  onNext () {
    var issues_followed_length = this.state.followed_issues.length;
    if (
        this.remainingIssues() < 1 &&
        issues_followed_length > 0 ||
        this.state.next_button_text === SKIP_BUTTON_TEXT
    ) {
      this.props.next();
    }
  }

  render () {
    let issue_list = this.state.issues || [];
    let remaining_issues = this.remainingIssues();

    let edit_mode = true;
    const issue_list_for_display = issue_list.map((issue) => {
      return <IssueFollowToggle
        key={issue.issue_we_vote_id}
        issue_we_vote_id={issue.issue_we_vote_id}
        issue_name={issue.issue_name}
        issue_description={issue.issue_description}
        issue_image_url={issue.issue_photo_url_medium}
        on_issue_follow={this.onIssueFollow}
        on_issue_stop_following={this.onIssueStopFollowing}
        edit_mode={edit_mode} />;
    });

    return (
    <div className="intro-modal">
      <div className="intro-modal__h1">
        Follow{ remaining_issues ? " " + remaining_issues : null }
        &nbsp;Issue{ remaining_issues !== 1 ? "s" : null } You Care About
      </div>
      <div className="intro-modal-vertical-scroll-contain">
        <div className="intro-modal-vertical-scroll card">
          { issue_list.length ? issue_list_for_display : <h4>No issues to display</h4> }
        </div>
      </div>
      <div className="intro-modal__description-text">
        {this.state.description_text}
      </div>
      <br/>
      <div className="intro-modal__button-wrap">
        <Button type="submit"
          className={ this.remainingIssues() ? "btn intro-modal__button intro-modal__button-disabled disabled btn-secondary btn-block" : "btn btn-success intro-modal__button intro-modal__button-follow"}
          onClick={this.onNext}>
          <span>{this.state.next_button_text}</span>
        </Button>
      </div>
      <br/>
    </div>
    );
  }
}
