import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import CheckCircle from '@material-ui/icons/CheckCircle';
import IssueActions from '../../actions/IssueActions';
import IssueStore from '../../stores/IssueStore';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';
import { historyPush } from '../../utils/cordovaUtils';
import { openSnackbar } from '../Widgets/SnackNotifier';


export default class IssueFollowToggleButton extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    currentBallotIdInUrl: PropTypes.string,
    issueWeVoteId: PropTypes.string.isRequired,
    issueName: PropTypes.string.isRequired,
    onIssueFollowFunction: PropTypes.func,
    onIssueStopFollowingFunction: PropTypes.func,
    urlWithoutHash: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      isFollowing: false,
    };
    this.onIssueFollow = this.onIssueFollow.bind(this);
    this.onIssueStopFollowing = this.onIssueStopFollowing.bind(this);
  }

  componentDidMount () {
    const isFollowing = IssueStore.isVoterFollowingThisIssue(this.props.issueWeVoteId);
    this.setState({
      isFollowing,
      visibilityChange: false,
    });
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if not needed
    if (this.state.isFollowing !== nextState.isFollowing) {
      // console.log('this.state.isFollowing: ', this.state.isFollowing, ', nextState.isFollowing', nextState.isFollowing);
      return true;
    }
    if (this.state.visibilityChange !== nextState.visibilityChange) {
      // console.log('this.state.visibilityChange: ', this.state.visibilityChange, ', nextState.visibilityChange', nextState.visibilityChange);
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
  }

  onIssueStoreChange () {
    const isFollowing = IssueStore.isVoterFollowingThisIssue(this.props.issueWeVoteId);
    this.setState({
      isFollowing,
      visibilityChange: false,
    });
  }

  onIssueFollow () {
    // This check is necessary as we enable follow when user clicks on Issue text
    if (!this.state.isFollowing) {
      this.setState({
        isFollowing: true,
        visibilityChange: true,
      });
      IssueActions.issueFollow(this.props.issueWeVoteId, VoterStore.electionId());
      if (this.props.onIssueFollowFunction) {
        this.props.onIssueFollowFunction(this.props.issueWeVoteId);
      }
      openSnackbar({ message: `Now following ${this.props.issueName}!` });
    }

    const { currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId } = this.props;
    if (currentBallotIdInUrl !== ballotItemWeVoteId) {
      historyPush(`${urlWithoutHash}#${this.props.ballotItemWeVoteId}`);
    }
  }

  onIssueStopFollowing (e) {
    if (this.state.isFollowing) {
      if (e.target.classList.contains('MuiButton-label-44')) {
        e.target.parentElement.parentElement.parentElement.classList.remove('show');
      } else if (e.target.classList.contains('issues-follow-btn__menu-item')) {
        e.target.parentElement.parentElement.classList.remove('show');
      }
    }
    this.setState({ isFollowing: false });
    IssueActions.issueStopFollowing(this.props.issueWeVoteId, VoterStore.electionId());
    // console.log("IssueFollowToggleButton, this.props.ballotItemWeVoteId:", this.props.ballotItemWeVoteId);
    if (this.props.ballotItemWeVoteId) {
      IssueActions.removeBallotItemIssueScoreFromCache(this.props.ballotItemWeVoteId);
    }
    if (this.props.onIssueStopFollowingFunction) {
      this.props.onIssueStopFollowingFunction(this.props.issueWeVoteId);
    }
    openSnackbar({ message: `You've stopped following ${this.props.issueName}.` });
    const { currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId } = this.props;
    if (currentBallotIdInUrl !== ballotItemWeVoteId) {
      historyPush(`${urlWithoutHash}#${this.props.ballotItemWeVoteId}`);
    }

    if (document.getElementById('dropdown-toggle')) {
      document.getElementById('dropdown-toggle').style.visibility = 'hidden';
    }
    // Force render
    this.setState({
      visibilityChange: true,
    });
  }

  render () {
    // console.log('IssueFollowToggleButton render');
    renderLog(__filename);
    if (!this.state) { return <div />; }

    return (
      <div className="issues-follow-container">
        {this.state.isFollowing ? (
          <Button
            type="button"
            className="issues-follow-btn issues-follow-btn__main issues-follow-btn__icon issues-follow-btn--white issues-followed-btn--disabled"
            disabled
          >
            <span>
              { this.state.isFollowing &&
                <CheckCircle className="following-icon" /> }
            </span>
          </Button>
        ) : (
          <Button
            type="button"
            className="issues-follow-btn issues-follow-btn__main issues-follow-btn__main--radius issues-follow-btn--blue"
            onClick={this.onIssueFollow}
          >
            Follow
          </Button>
        )}
        {this.state.isFollowing ? (
          <React.Fragment>
            <div className="issues-follow-btn__seperator" />
            <Button
              type="button"
              id="dropdown-toggle"
              className="dropdown-toggle dropdown-toggle-split issues-follow-btn issues-follow-btn__dropdown issues-follow-btn--white"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span className="sr-only">Toggle Dropdown</span>
            </Button>
          </React.Fragment>
        ) : (
          null
        )}
        <div id="issues-follow-btn__menu" className="dropdown-menu dropdown-menu-right issues-follow-btn__menu">
          {this.state.isFollowing ? (
            <span className="d-print-none">
              <Button type="button" className="dropdown-item issues-follow-btn issues-follow-btn__menu-item" onClick={this.onIssueStopFollowing}>
                Unfollow
              </Button>
            </span>
          ) : (
            <Button type="button" className="dropdown-item issues-follow-btn issues-follow-btn__menu-item" onClick={this.onIssueFollow}>
              Follow
            </Button>
          )}
        </div>
      </div>
    );
  }
}
