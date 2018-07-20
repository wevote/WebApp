import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import IssueActions from "../../actions/IssueActions";
import IssueFollowToggleSquare from "../Issues/IssueFollowToggleSquare";
import IssueStore from "../../stores/IssueStore";
import { renderLog } from "../../utils/logging";

const NEXT_BUTTON_TEXT = "Next >";
const SKIP_BUTTON_TEXT = "Skip >";
// const NEXT_SCREEN_PROMPT_TEXT = "On the next screen, we'll help you find organizations that share your values.";

export default class BallotIntroFollowIssues extends Component {
  static propTypes = {
    history: PropTypes.object,
    next: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      // description_text: null,
      followed_issues: [],
      issues: [],
      next_button_text: NEXT_BUTTON_TEXT,
      number_of_required_issues: 3,
    };
    this.onIssueFollow = this.onIssueFollow.bind(this);
    this.onIssueStopFollowing = this.onIssueStopFollowing.bind(this);
    this.onNext = this.onNext.bind(this);
    this.onIssueStoreChange = this.onIssueStoreChange.bind(this);
  }

  componentWillMount () {
    if (IssueStore.getPreviousGoogleCivicElectionId() < 1) {
      IssueActions.issuesRetrieve();
    }
  }

  componentDidMount () {
    this.onIssueStoreChange();
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange);
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
  }

  onIssueStoreChange () {
    // update followed_issues only for first time, subsequent updates will be made locally
    if (this.state.followed_issues.length) {
      this.setState({
        issues: IssueStore.getIssuesVoterCanFollow()
      },
      this.updateNextState
      );
    } else {
      this.setState({
        issues: IssueStore.getIssuesVoterCanFollow(),
        followed_issues: IssueStore.getIssuesVoterIsFollowing(),
      },
      this.updateNextState
      );
    }
  }

  remainingIssues () {
    var actual = this.state.number_of_required_issues - this.state.followed_issues.length;

    return actual >= 0 ? actual : 0;
  }

  updateNextState () {
    if (this.remainingIssues()) {
      this.setState({ next_button_text: "Pick " + this.remainingIssues() + " more!" });
    } else {
      this.setState({ next_button_text: NEXT_BUTTON_TEXT });
    }
  }

  onIssueFollow (issue_we_vote_id) {
    let index = this.state.followed_issues.indexOf(issue_we_vote_id);
    // let description_text;
    if (index === -1) {
      var new_followed_issues = this.state.followed_issues;
      new_followed_issues.push(issue_we_vote_id);
      // if (this.state.followed_issues.length >= this.state.number_of_required_issues) {
      //   description_text = NEXT_SCREEN_PROMPT_TEXT;
      // } else {
      //   description_text = null;
      // }
      this.setState({
        // description_text: description_text,
        followed_issues: new_followed_issues,
        next_button_text: NEXT_BUTTON_TEXT
      });

      this.updateNextState();
    }
  }

  onIssueStopFollowing (issue_we_vote_id) {
    let index = this.state.followed_issues.indexOf(issue_we_vote_id);
    // let description_text;
    if (index > -1) {
      var new_followed_issues = this.state.followed_issues;
      new_followed_issues.splice(index, 1);
      // if (this.state.followed_issues.length >= this.state.number_of_required_issues) {
      //   description_text = NEXT_SCREEN_PROMPT_TEXT;
      // } else {
      //   description_text = null;
      // }
      if (new_followed_issues.length) {
        this.setState({
          followed_issues: new_followed_issues,
        });
      } else {
        this.setState({
          // description_text: description_text,
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
    renderLog(__filename);
    let issue_list = this.state.issues;
    let remaining_issues = this.remainingIssues();

    let edit_mode = true;
    let issues_shown_count = 0;
    let maximum_number_of_issues_to_show = 36; // Only show the first 6 * 6 = 36 issues so as to not overwhelm voter
    // NOTE: We might want to show political parties at the top
    const issue_list_for_display = issue_list.map((issue) => {
      if (issues_shown_count < maximum_number_of_issues_to_show) {
        issues_shown_count++;
        return <IssueFollowToggleSquare
          key={issue.issue_we_vote_id}
          issue_we_vote_id={issue.issue_we_vote_id}
          issue_name={issue.issue_name}
          issue_description={issue.issue_description}
          issue_image_url={issue.issue_image_url}
          on_issue_follow={this.onIssueFollow}
          on_issue_stop_following={this.onIssueStopFollowing}
          edit_mode={edit_mode}
          grid="col-4 col-sm-2" />;
      } else {
        return null;
      }
    });

    return (
    <div className="intro-modal">
      <div className="intro-modal__h1">
        What do you care about?
      </div>
      <div className="intro-modal__top-description">
        { remaining_issues ?
          "Pick " + remaining_issues + " or more issues!" :
          "Feel free to pick as many issues as you would like."
        }
      </div>
      <div className="intro-modal-vertical-scroll-contain">
        <div className="intro-modal-vertical-scroll card">
          <div className="row intro-modal__grid">
            { issue_list.length ? issue_list_for_display : <h4 className="intro-modal__default-text">Loading issues...</h4> }
          </div>
        </div>
      </div>
      <div className="intro-modal-shadow-wrap">
        <div className="intro-modal-shadow" />
      </div>
      {/* {this.state.description_text ?
        <div className="intro-modal__description-text">
          {this.state.description_text}
        </div> :
        null } */}
      <div className="intro-modal__button-wrap">
        <Button type="submit"
          className={ this.remainingIssues() ? "btn intro-modal__button disabled btn-secondary" : "btn btn-success intro-modal__button"}
          onClick={this.onNext}>
          <span>{this.state.next_button_text}</span>
        </Button>
      </div>
    </div>
    );
  }
}
