import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import IssueActions from "../../actions/issueActions";
import IssueFollowToggle from "./IssueFollowToggle";
import IssueStore from "../../stores/issueStore";

const NEXT_BUTTON_TEXT = "Next >";
const SKIP_BUTTON_TEXT = "Skip >";
const INITIAL_DESCRIPTION_TEXT = "After you follow the issues you care about, we will suggest some groups that have opinions about these issues.";
const SELECT_ISSUES_PROMPT_TEXT= "Are you sure you don't want to choose an issue or two (above)? Choosing issues will help you find organizations that share your values.";
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
      next_button_text: NEXT_BUTTON_TEXT
    };
  }

  componentDidMount () {
    IssueActions.issuesRetrieve();
    this._onIssueStoreChange();
    this.onIssueFollow = this.onIssueFollow.bind(this);
    this.onIssueUnfollow = this.onIssueUnfollow.bind(this);
    this.onNext = this.onNext.bind(this);
    this.issueStoreListener = IssueStore.addListener(this._onIssueStoreChange.bind(this));
  }

  componentWillUnmount() {
    this.issueStoreListener.remove();
  }

  _onIssueStoreChange () {
    this.setState({ issues: IssueStore.getIssues() });
  }

  onIssueFollow (issue_we_vote_id) {
    let index = this.state.followed_issues.indexOf(issue_we_vote_id);
    if (index === -1) {
      var new_followed_issues = this.state.followed_issues;
      new_followed_issues.push(issue_we_vote_id);
      this.setState({
        description_text: NEXT_SCREEN_PROMPT_TEXT,
        followed_issues: new_followed_issues,
        next_button_text: NEXT_BUTTON_TEXT
      });
    }
  }

  onIssueUnfollow (issue_we_vote_id) {
    let index = this.state.followed_issues.indexOf(issue_we_vote_id);
    if (index > -1) {
      var new_followed_issues = this.state.followed_issues;
      new_followed_issues.splice(index, 1);
      if (new_followed_issues.length === 0) {
        this.setState({
          description_text: INITIAL_DESCRIPTION_TEXT,
          followed_issues: new_followed_issues,
          next_button_text: NEXT_BUTTON_TEXT,
        });
      } else {
        this.setState({
          followed_issues: new_followed_issues,
        });
      }
    }
  }

  onNext() {
    var issues_followed_length = this.state.followed_issues.length;
    if (issues_followed_length  > 0 || this.state.next_button_text === SKIP_BUTTON_TEXT) {
      this.props.next();
    } else if (issues_followed_length === 0) {
      this.setState({
        description_text: SELECT_ISSUES_PROMPT_TEXT,
        next_button_text: SKIP_BUTTON_TEXT,
      })
    }
  }

  render () {
    var issue_list = [];
    if (this.state.issues) {
      issue_list = this.state.issues;
    }

    const issue_list_for_display = issue_list.map((issue) => {
      return <div key={issue.issue_we_vote_id}>
        <IssueFollowToggle
          issue_we_vote_id={issue.issue_we_vote_id}
          issue_name={issue.issue_name}
          on_follow={this.onIssueFollow}
          on_unfollow={this.onIssueUnfollow}
        />
        <br />
      </div>;
    });

    return <div className="">
      <div className="intro-modal__h1">Follow Issues You Care About</div>
      <div className="intro-modal-vertical-scroll-contain">
        <div className="intro-modal-vertical-scroll">
          { issue_list.length > 0 ?
            issue_list_for_display :
            <h4>No issues to display</h4>
          }
        </div>
      </div>
      <div className="intro-story__h2">
        { this.state.description_text }
      </div>
      <br/>
      <div className="intro-modal__padding-btn__btn-center">
        <Button type="submit" className="btn btn-success" onClick={this.onNext}>
          <span>{this.state.next_button_text}</span>
        </Button>
      </div>
      <br/>
    </div>;
  }
}
