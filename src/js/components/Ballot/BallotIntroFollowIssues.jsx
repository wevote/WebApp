import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import IssueActions from '../../actions/IssueActions';
import IssueFollowToggleSquare from '../Issues/IssueFollowToggleSquare';
import IssueStore from '../../stores/IssueStore';
import { renderLog } from '../../utils/logging';

const NEXT_BUTTON_TEXT = 'Next';
const SKIP_BUTTON_TEXT = 'Skip';

export default class BallotIntroFollowIssues extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      allIssues: [],
      followedIssues: [],
      // issuesVoterCanFollow: [],
      nextButtonText: NEXT_BUTTON_TEXT,
      numRequiredIssues: 3,
    };
    this.isVoterFollowingThisIssueLocal = this.isVoterFollowingThisIssueLocal.bind(this);
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
    this.setState({
      allIssues: IssueStore.getAllIssues(),
      // issuesVoterCanFollow: IssueStore.getIssuesVoterCanFollow(),
      followedIssues: IssueStore.getIssuesVoterIsFollowing(),
    });
    this.updateNextState();
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange);
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
  }

  onIssueStoreChange () {
    // update followedIssues only for first time, subsequent updates will be made locally
    if (this.state.followedIssues.length) {
      /*
      this.setState({
        issuesVoterCanFollow: IssueStore.getIssuesVoterCanFollow(),
      },
      this.updateNextState);
      */
    } else {
      this.setState({
        allIssues: IssueStore.getAllIssues(),
        // issuesVoterCanFollow: IssueStore.getIssuesVoterCanFollow(),
        followedIssues: IssueStore.getIssuesVoterIsFollowing(),
      },
      this.updateNextState);
    }
  }

  onIssueFollow (issueWeVoteId) {
    const { followedIssues } = this.state;
    const index = followedIssues.indexOf(issueWeVoteId);
    // let description_text;
    if (index === -1) {
      this.setState({
        // description_text: description_text,
        followedIssues: [...followedIssues, issueWeVoteId],
        nextButtonText: NEXT_BUTTON_TEXT,
      });

      this.updateNextState();
    }
  }

  onIssueStopFollowing (issueWeVoteId) {
    const { followedIssues } = this.state;
    const index = followedIssues.indexOf(issueWeVoteId);
    // let description_text;
    if (index > -1) {
      const newFollowedIssues = this.state.followedIssues;
      newFollowedIssues.splice(index, 1);
      if (newFollowedIssues.length) {
        this.setState({
          followedIssues: newFollowedIssues,
        });
      } else {
        this.setState({
          // description_text: description_text,
          followedIssues: newFollowedIssues,
          nextButtonText: NEXT_BUTTON_TEXT,
        });
      }

      this.updateNextState(issueWeVoteId);
    }
  }

  onNext () {
    const issuesFollowedLength = this.state.followedIssues.length;
    if (
      this.remainingIssues() < 1 &&
      (issuesFollowedLength > 0 || this.state.nextButtonText === SKIP_BUTTON_TEXT)) {
      this.props.next();
    }
  }

  isVoterFollowingThisIssueLocal (issueWeVoteId) {
    let voterIsFollowing = false;
    if (this.state.followedIssues) {
      this.state.followedIssues.map((followedIssue) => {
        if (followedIssue.issueWeVoteId === issueWeVoteId) {
          voterIsFollowing = true;
        }
        return voterIsFollowing;   // Added steve 11/1/18, looked like a bug
      });
      return voterIsFollowing;
    } else {
      return false;
    }
  }

  updateNextState () {
    if (this.remainingIssues()) {
      this.setState({ nextButtonText: `Pick ${this.remainingIssues()} more!` });
    } else {
      this.setState({ nextButtonText: NEXT_BUTTON_TEXT });
    }
  }

  remainingIssues () {
    const actual = this.state.numRequiredIssues - this.state.followedIssues.length;

    return actual >= 0 ? actual : 0;
  }

  render () {
    renderLog(__filename);
    const issueList = this.state.allIssues;
    const remaining = this.remainingIssues();
    let issuesShownCount = 0;
    const maxNumberOfIssuesToShow = 36; // Only show the first 6 * 6 = 36 issues so as to not overwhelm voter
    const issueListForDisplay = issueList.map((issue) => {
      if (issuesShownCount < maxNumberOfIssuesToShow) {
        issuesShownCount++;
        return (
          <IssueFollowToggleSquare
            key={issue.issue_we_vote_id}
            isFollowing={this.isVoterFollowingThisIssueLocal(issue.issue_we_vote_id)}
            issueWeVoteId={issue.issue_we_vote_id}
            issueName={issue.issue_name}
            issueDescription={issue.issue_description}
            issueImageUrl={issue.issue_image_url}
            issueIconLocalPath={issue.issue_icon_local_path}
            onIssueFollow={this.onIssueFollow}
            onIssueStopFollowing={this.onIssueStopFollowing}
            editMode
            grid="col-4 col-sm-3"
          />
        );
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
          { remaining ?
            `Pick ${remaining} or more issues!` :
            'Feel free to pick as many issues as you would like.'
        }
        </div>
        <div className="intro-modal-vertical-scroll-contain">
          <div className="intro-modal-vertical-scroll card">
            <div className="row intro-modal__grid">
              { issueList.length ? issueListForDisplay : <h4 className="intro-modal__default-text">Loading issues...</h4> }
            </div>
          </div>
        </div>
        <div className="intro-modal-shadow-wrap">
          <div className="intro-modal-shadow" />
        </div>
        <div className="u-flex-auto" />
        <div className="intro-modal__button-wrap">
          <Button
            variant="contained"
            color="secondary"
            onClick={this.onNext}
          >
            <span>{this.state.nextButtonText}</span>
          </Button>
        </div>
      </div>
    );
  }
}
