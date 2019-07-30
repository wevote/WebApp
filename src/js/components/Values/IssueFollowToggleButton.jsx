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
      error: false,
      errorInfo: null,
      isFollowing: false,
      isFollowingLocalValue: false,
    };
    this.onIssueFollow = this.onIssueFollow.bind(this);
    this.onIssueStopFollowing = this.onIssueStopFollowing.bind(this);
  }

  componentDidMount () {
    const isFollowing = IssueStore.isVoterFollowingThisIssue(this.props.issueWeVoteId);
    this.setState({
      isFollowing,
      isFollowingLocalValue: isFollowing,
    });
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if not needed
    if (this.state.isFollowing !== nextState.isFollowing) {
      // console.log('this.state.isFollowing: ', this.state.isFollowing, ', nextState.isFollowing', nextState.isFollowing);
      return true;
    }
    // console.log('shouldComponentUpdate no change');
    return false;
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
  }

  onIssueStoreChange () {
    const { isFollowingLocalValue } = this.state;
    const isFollowingApiValue = IssueStore.isVoterFollowingThisIssue(this.props.issueWeVoteId);
    const apiServerHasCaughtUpWithLocalValue = isFollowingLocalValue === isFollowingApiValue;
    this.setState({
      isFollowing: apiServerHasCaughtUpWithLocalValue ? isFollowingApiValue : isFollowingLocalValue,
    });
  }

  onIssueFollow () {
    // This check is necessary as we enable follow when user clicks on Issue text
    IssueActions.issueFollow(this.props.issueWeVoteId, VoterStore.electionId());
    if (this.props.onIssueFollowFunction) {
      this.props.onIssueFollowFunction(this.props.issueWeVoteId);
    }
    openSnackbar({ message: `Now following ${this.props.issueName}!` });

    this.setState({
      isFollowing: true,
      isFollowingLocalValue: true,
    });

    const { currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId } = this.props;
    if (currentBallotIdInUrl !== ballotItemWeVoteId) {
      historyPush(`${urlWithoutHash}#${this.props.ballotItemWeVoteId}`);
    }
  }

  onIssueStopFollowing () {
    // console.log('onIssueStopFollowing');
    const { currentBallotIdInUrl, issueName, issueWeVoteId, urlWithoutHash, ballotItemWeVoteId } = this.props;

    IssueActions.issueStopFollowing(issueWeVoteId, VoterStore.electionId());
    // console.log("IssueFollowToggleButton, this.props.ballotItemWeVoteId:", this.props.ballotItemWeVoteId);
    if (ballotItemWeVoteId) {
      IssueActions.removeBallotItemIssueScoreFromCache(ballotItemWeVoteId);
    }
    if (this.props.onIssueStopFollowingFunction) {
      this.props.onIssueStopFollowingFunction(issueWeVoteId);
    }
    openSnackbar({ message: `You've stopped following ${issueName}.` });
    if (currentBallotIdInUrl !== ballotItemWeVoteId) {
      historyPush(`${urlWithoutHash}#${ballotItemWeVoteId}`);
    }

    this.setState({
      isFollowing: false,
      isFollowingLocalValue: false,
    });
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a 'Oh snap' page
    // console.log('getDerivedStateFromError IssueFollowToggleButton, error:', error);
    return { hasError: true };
  }

  componentDidCatch (error, errorInfo) {
    // console.log('Error in IssueFollowToggleButton, errorInfo:', errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render () {
    // console.log('IssueFollowToggleButton render');
    renderLog(__filename);
    if (!this.state) { return <div />; }

    if (this.state.error) {
      // console.log('error');
      return <div>{this.state.errorInfo}</div>;
    }

    const { isFollowing } = this.state;
    return (
      <div className="issues-follow-container">
        {isFollowing ? (
          <React.Fragment>
            <Button
              type="button"
              className="issues-follow-btn issues-follow-btn__main issues-follow-btn__icon issues-follow-btn--white issues-followed-btn--disabled"
              disabled
            >
              <span>
                <CheckCircle className="following-icon" />
              </span>
            </Button>
            <div className="issues-follow-btn__seperator" />
            <Button
              type="button"
              id="dropdown-toggle-id"
              className="dropdown-toggle dropdown-toggle-split issues-follow-btn issues-follow-btn__dropdown issues-follow-btn--white"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              data-reference="parent"
            >
              <span className="sr-only">Toggle Dropdown</span>
            </Button>
            <div id="issues-follow-btn__menu" className="dropdown-menu issues-follow-btn__menu" aria-labelledby="dropdown-toggle-id">
              <Button
                type="button"
                id="dropdown-item-id"
                className="dropdown-item issues-follow-btn issues-follow-btn__menu-item"
                // data-toggle="dropdown"
                onClick={this.onIssueStopFollowing}
              >
                Unfollow
              </Button>
            </div>
          </React.Fragment>
        ) : (
          <Button
            type="button"
            className="issues-follow-btn issues-follow-btn__main issues-follow-btn__main--radius issues-follow-btn--blue"
            onClick={this.onIssueFollow}
          >
            Follow
          </Button>
        )}
      </div>
    );
  }
}
