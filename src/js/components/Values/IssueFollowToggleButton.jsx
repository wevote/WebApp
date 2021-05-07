import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CheckCircle, ArrowDropDown } from '@material-ui/icons';
import { Menu, MenuItem, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import IssueActions from '../../actions/IssueActions';
import IssueStore from '../../stores/IssueStore';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';
import { historyPush } from '../../utils/cordovaUtils';
import { shortenText } from '../../utils/textFormat';
import { openSnackbar } from '../Widgets/SnackNotifier';


class IssueFollowToggleButton extends Component {
  constructor (props) {
    super(props);
    this.state = {
      error: false,
      errorInfo: null,
      isFollowing: false,
      isFollowingLocalValue: false,
      open: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
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
    if (this.state.isFollowing !== nextState.isFollowing) return true;
    if (this.state.open !== nextState.open) return true;
    return false;
  }

  componentDidCatch (error, errorInfo) {
    // console.log('Error in IssueFollowToggleButton, errorInfo:', errorInfo);
    this.setState({
      error,
      errorInfo,
    });
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

  handleClick (event) {
    this.setState({ anchorEl: event.currentTarget, open: true });
  }

  handleClose () {
    this.setState({ anchorEl: null, open: false });
  }

  render () {
    renderLog('IssueFollowToggleButton');  // Set LOG_RENDER_EVENTS to log all renders
    if (!this.state) { return <div />; }

    if (this.state.error) {
      // console.log('error');
      return <div>{this.state.errorInfo}</div>;
    }
    const { classes, issueName, issueWeVoteId, lightModeOn, showFollowingButtonText, showIssueNameOnFollowButton } = this.props;
    const { isFollowing } = this.state;
    let followButtonText = 'Follow';
    if (showIssueNameOnFollowButton) {
      followButtonText = shortenText(`Follow ${issueName}`, 27);
    }
    return (
      <div className="issues-follow-container" id="issues-follow-container">
        {isFollowing ? (
          <>
            <Button
              type="button"
              className="issues-follow-btn issues-follow-btn__main issues-follow-btn__icon issues-follow-btn--white issues-followed-btn--disabled"
              disabled
            >
              {showFollowingButtonText && (
                <span>Following&nbsp;</span>
              )}
              <span>
                <CheckCircle className="issue-following-icon" />
              </span>
            </Button>
            <div className="issues-follow-btn__separator" />
            <Button
              className="dropdown-toggle-split issues-follow-btn issues-follow-btn__dropdown issues-follow-btn--white"
              aria-controls="follow-menu"
              aria-haspopup="true"
              onClick={this.handleClick}
              id="toggle-button"
            >
              <ArrowDropDown />
              <span className="sr-only">Toggle Dropdown</span>
            </Button>
            <Menu
              id="follow-menu"
              className="u-z-index-5020"
              classes={{ list: classes.list, paper: classes.paper }}
              open={this.state.open}
              onClose={this.handleClose}
              elevation={2}
              getContentAnchorEl={null}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                horizontal: 'right',
                vertical: 'top',
              }}
            >
              <MenuItem
                className={classes.menuItem}
                id="unfollowValue"
                // data-toggle="dropdown"
                onClick={this.onIssueStopFollowing}
              >
                Unfollow
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            type="button"
            id={`issueFollowButton-${issueWeVoteId}`}
            className={`issues-follow-btn issues-follow-btn__main issues-follow-btn__main--radius${lightModeOn ? '' : ' issues-follow-btn--blue'}`}
            onClick={this.onIssueFollow}
          >
            {followButtonText}
          </Button>
        )}
      </div>
    );
  }
}
IssueFollowToggleButton.propTypes = {
  ballotItemWeVoteId: PropTypes.string,
  currentBallotIdInUrl: PropTypes.string,
  issueWeVoteId: PropTypes.string.isRequired,
  issueName: PropTypes.string.isRequired,
  onIssueFollowFunction: PropTypes.func,
  onIssueStopFollowingFunction: PropTypes.func,
  showFollowingButtonText: PropTypes.bool,
  showIssueNameOnFollowButton: PropTypes.bool,
  urlWithoutHash: PropTypes.string,
  lightModeOn: PropTypes.bool,
  classes: PropTypes.object,
};

const styles = () => ({
  paper: {
    fontSize: '12.5px !important',
    width: '140px !important',
    minWidth: '0 !important',
    maxWidth: '140px !important',
    padding: '0 !important',
    border: 'none !important',
    boxShadow: '1px 1px 4px 0 #ddd',
  },
  list: {
    padding: '0 !important',
  },
  menuItem: {
    padding: '7px 0 !important',
    borderRadius: '0 !important',
    textAlign: 'center',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
});

export default withStyles(styles)(IssueFollowToggleButton);
