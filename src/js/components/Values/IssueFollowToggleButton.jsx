import { ArrowDropDown, CheckCircle } from '@mui/icons-material';
import { Button, Menu, MenuItem } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import IssueActions from '../../actions/IssueActions';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import shortenText from '../../common/utils/shortenText';
import IssueStore from '../../stores/IssueStore';
import VoterStore from '../../stores/VoterStore';
import { openSnackbar } from '../../common/components/Widgets/SnackNotifier';


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
    this.slugifyIssueName = this.slugifyIssueName.bind(this);
  }

  componentDidMount () {
    const { issueWeVoteId } = this.props;
    const isFollowing = IssueStore.isVoterFollowingThisIssue(issueWeVoteId);
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    this.setState({
      isFollowing,
      isFollowingLocalValue: isFollowing,
      wasSignedIn: voterIsSignedIn,
    });
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
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
    this.voterStoreListener.remove();
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

  onIssueStoreChange () {
    const { issueWeVoteId } = this.props;
    const { isFollowingLocalValue } = this.state;
    const isFollowingApiValue = IssueStore.isVoterFollowingThisIssue(issueWeVoteId);
    const apiServerHasCaughtUpWithLocalValue = isFollowingLocalValue === isFollowingApiValue;
    this.setState({
      isFollowing: apiServerHasCaughtUpWithLocalValue ? isFollowingApiValue : isFollowingLocalValue,
    });
  }

  onVoterStoreChange () {
    const { wasSignedIn } = this.state;
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    if (wasSignedIn && !voterIsSignedIn) {
      // Unset when voter signs out
      this.setState({
        isFollowing: false,
        isFollowingLocalValue: false,
      });
    }
    this.setState({
      wasSignedIn: voterIsSignedIn,
    });
  }

  onIssueFollow () {
    const { issueWeVoteId } = this.props;
    // This check is necessary as we enable follow when user clicks on Issue text
    IssueActions.issueFollow(issueWeVoteId, VoterStore.electionId());
    if (this.props.onIssueFollowFunction) {
      this.props.onIssueFollowFunction(issueWeVoteId);
    }
    openSnackbar({ id: `${this.props.issueName}_follow`, message: `Now following ${this.props.issueName}!` });

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
    // openSnackbar({id: `${issueName}_unfollow, message: `You've stopped following ${issueName}.`, severity: 'success' });
    openSnackbar({
      id: `${issueName}_unfollow`,
      message: `You've stopped following ${issueName}.`,
      severity: 'success',
    });

    if (currentBallotIdInUrl !== ballotItemWeVoteId) {
      historyPush(`${urlWithoutHash}#${ballotItemWeVoteId}`);
    }

    this.setState({
      isFollowing: false,
      isFollowingLocalValue: false,
      open: false,
      anchorEl: null,
    });
  }

  slugifyIssueName () {
    const { issueName } = this.props;
    const result = issueName.toLowerCase().split(' ').join('-');
    return result;
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
      followButtonText = shortenText(`Follow ${issueName}`, 24);
    }
    return (
      <div className="issues-follow-container" id="issues-follow-container">
        {isFollowing ? (
          <>
            <Button
              id="checkCircleIconFollowTopic"
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
              id={`toggleFollowMenuButton-${issueWeVoteId}`}
            >
              <ArrowDropDown />
              <span id="arrowIconFollowTopic" className="sr-only">Toggle Dropdown</span>
            </Button>
            <Menu
              id="follow-menu"
              className="u-z-index-5020"
              classes={{ list: classes.list, paper: classes.paper }}
              open={this.state.open}
              onClose={this.handleClose}
              elevation={2}
              // getContentAnchorEl={null}
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
                id={`issueUnfollowButton-${issueWeVoteId}-${this.slugifyIssueName()}`}
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
            id={`issueFollowButton-${issueWeVoteId}-${this.slugifyIssueName()}`}
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
