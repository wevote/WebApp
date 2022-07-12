/* eslint-disable object-property-newline */
import { Add, Check, NotInterested } from '@mui/icons-material';
import { Button } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled as muiStyled } from '@mui/styles';
import withTheme from '@mui/styles/withTheme';
import withStyles from '@mui/styles/withStyles';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import OrganizationActions from '../../actions/OrganizationActions';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import FriendStore from '../../stores/FriendStore';
import IssueStore from '../../stores/IssueStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import { openSnackbar } from './SnackNotifier';


function AlreadyFollowingOrIgnoringButton (params) {
  const { handleClick } = params;
  const { classes, isFollowing, isFriend, isIgnoring } = params.params;

  return (
    <ButtonStyled
      aria-controls="simple-menu"
      aria-haspopup="true"
      classes={{ root: classes.followToggleCheckPlusRoot }}
      onClick={(event) => handleClick(event)}
    >
      <span>
        { (isFollowing || isFriend) && <CheckStyled /> }
        { isIgnoring && <NotInterestedStyled /> }
      </span>
    </ButtonStyled>
  );
}

function UnfollowFollowLine (params) {
  const { followInstantly, followFunction, stopFollowingInstantly, stopFollowingFunc } = params;
  const { platformType, organizationWeVoteId, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId, hideStopFollowingButton, isFollowing } = params.params;
  return (
    <>
      { isFollowing ? (
        <span className="d-print-none">
          { hideStopFollowingButton ?
            null : (
              <Button
                id={`positionItemFollowToggleUnfollow-${platformType}-${organizationWeVoteId} organizationOrPublicFigureUnfollow`}
                type="button"
                className="dropdown-item issues-follow-btn issues-follow-btn__menu-item"
                onClick={() => stopFollowingInstantly(stopFollowingFunc, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId)}
              >
                Unfollow
              </Button>
            )}
        </span>
      ) : (
        <Button
          id={`positionItemFollowToggleFollowDropDown-${platformType}-${organizationWeVoteId} organizationOrPublicFigureDropDown`}
          className="dropdown-item issues-follow-btn issues-follow-btn__menu-item"
          onClick={() => followInstantly(followFunction, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId)}
          type="button"
        >
          Follow
        </Button>
      )}
    </>
  );
}

function FollowButton (params) {
  const { followInstantly, followFunction } = params;
  const {
    ballotItemWeVoteId, classes, currentBallotIdInUrl,
    speakerDisplayName, organizationWeVoteId, platformType,
    urlWithoutHash,
  } = params.params;

  let followOrganizationCheckPlusPopOverText = 'Click to trust';
  if (speakerDisplayName) {
    followOrganizationCheckPlusPopOverText += ` ${speakerDisplayName},`;
  }
  followOrganizationCheckPlusPopOverText += ' and add opinion to your score.';
  // console.log('followOrganizationCheckPlusPopOverText:', followOrganizationCheckPlusPopOverText);
  const followOrganizationCheckPlusPopOverTooltip = (
    <Tooltip className="u-z-index-9020" id={`followOrganizationCheckPlusPopOver-${ballotItemWeVoteId}-${organizationWeVoteId}`}>
      {followOrganizationCheckPlusPopOverText}
    </Tooltip>
  );
  return (
    <div>
      <OverlayTrigger placement="bottom" overlay={followOrganizationCheckPlusPopOverTooltip}>
        <Button
          classes={{ root: classes.followToggleCheckPlusRoot }}
          id={`followToggleCheckPlush-${platformType}-${organizationWeVoteId}`}
          onClick={() => followInstantly(followFunction, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId)}
          size="small"
          type="button"
          variant="text"
        >
          <AddStyled />
        </Button>
      </OverlayTrigger>
    </div>
  );
}

// -----------------------------------------------------------------------------

class FollowToggleCheckPlus extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isFollowing: false,
      isIgnoring: false,
      linkedToIssueVoterIsFollowing: false,
      organizationName: '',
      voterIsFriendsWithThisOrganization: false,
    };

    this.followInstantly = this.followInstantly.bind(this);
    this.handleIgnoreLocal = this.handleIgnoreLocal.bind(this);
    this.ignoreInstantly = this.ignoreInstantly.bind(this);
    this.stopFollowingInstantly = this.stopFollowingInstantly.bind(this);
    this.stopIgnoringInstantly = this.stopIgnoringInstantly.bind(this);
    // this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount () {
    // console.log('componentDidMount, this.props: ', this.props);
    const { organizationWeVoteId } = this.props;

    if (organizationWeVoteId) {
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      let organizationName = '';
      if (organization) {
        ({
          organization_name: organizationName,
        } = organization);
      }
      this.setState({
        // componentDidMountFinished: true,
        isFollowing: OrganizationStore.isVoterFollowingThisOrganization(organizationWeVoteId),
        isIgnoring: OrganizationStore.isVoterIgnoringThisOrganization(organizationWeVoteId),
        linkedToIssueVoterIsFollowing: IssueStore.isOrganizationLinkedToIssueVoterIsFollowing(organizationWeVoteId),
        organizationName,
        voterIsFriendsWithThisOrganization: FriendStore.isVoterFriendsWithThisOrganization(organizationWeVoteId),
      });
    }
    this.onVoterStoreChange();

    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    // We need the voterGuideStoreListener until we take the follow functions out of OrganizationActions and VoterGuideStore
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    // console.log('componentWillUnmount, this.props.organizationWeVoteId: ', this.props.organizationWeVoteId);
    this.friendStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.voterStoreListener.remove();
  }

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleIgnoreLocal () {
    // Some parent components need to react with this organization is ignored
    if (this.props.handleIgnore) {
      this.props.handleIgnore();
    }
  }

  onFriendStoreChange () {
    const { organizationWeVoteId } = this.props;
    this.setState({
      voterIsFriendsWithThisOrganization: FriendStore.isVoterFriendsWithThisOrganization(organizationWeVoteId),
    });
  }

  onOrganizationStoreChange () {
    const { organizationWeVoteId } = this.props;
    // console.log('FollowToggleCheckPlus, onOrganizationStoreChange, organizationWeVoteId: ', organizationWeVoteId);
    if (organizationWeVoteId) {
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      // console.log('organization:', organization);
      let organizationName = '';
      if (organization) {
        ({
          organization_name: organizationName,
        } = organization);
      }
      // console.log('organizationName: ', organizationName);
      this.setState({
        isFollowing: OrganizationStore.isVoterFollowingThisOrganization(organizationWeVoteId),
        isIgnoring: OrganizationStore.isVoterIgnoringThisOrganization(organizationWeVoteId),
        linkedToIssueVoterIsFollowing: IssueStore.isOrganizationLinkedToIssueVoterIsFollowing(organizationWeVoteId),
        organizationName,
        voterIsFriendsWithThisOrganization: FriendStore.isVoterFriendsWithThisOrganization(organizationWeVoteId),
      });
    }
  }

  onVoterStoreChange () {
    const { organizationWeVoteId } = this.props;
    const voter = VoterStore.getVoter();
    let voterLinkedOrganizationWeVoteId = '';
    if (voter && voter.linked_organization_we_vote_id) {
      voterLinkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    }
    this.setState({
      voterIsFriendsWithThisOrganization: FriendStore.isVoterFriendsWithThisOrganization(organizationWeVoteId),
      voterLinkedOrganizationWeVoteId,
    });
  }

  onVoterGuideStoreChange () {
    // console.log('FollowToggleCheckPlus, onVoterGuideStoreChange, organizationWeVoteId: ', this.props.organizationWeVoteId);
    const { organizationWeVoteId } = this.props;
    if (organizationWeVoteId) {
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      let organizationName = '';
      if (organization && organization.organization_name) {
        organizationName = organization.organization_name;
      }
      this.setState({
        isFollowing: OrganizationStore.isVoterFollowingThisOrganization(organizationWeVoteId),
        isIgnoring: OrganizationStore.isVoterIgnoringThisOrganization(organizationWeVoteId),
        linkedToIssueVoterIsFollowing: IssueStore.isOrganizationLinkedToIssueVoterIsFollowing(organizationWeVoteId),
        organizationName,
        voterIsFriendsWithThisOrganization: FriendStore.isVoterFriendsWithThisOrganization(organizationWeVoteId),
      });
    }
  }

  startFollowingLocalState () {
    this.setState({
      isFollowing: true,
      isIgnoring: false,
    });
  }

  startIgnoringLocalState () {
    this.setState({
      isFollowing: false,
      isIgnoring: true,
    });
  }

  stopFollowingLocalState () {
    this.setState({
      isFollowing: false,
      isIgnoring: false,
    });
  }

  stopIgnoringLocalState () {
    this.setState({
      isFollowing: false,
      isIgnoring: false,
    });
  }

  stopFollowingInstantly (stopFollowingFunc, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId) {
    const { organizationName } = this.state;
    if (currentBallotIdInUrl && urlWithoutHash && urlWithoutHash) {
      if (currentBallotIdInUrl !== ballotItemWeVoteId) {
        historyPush(`${urlWithoutHash}#${ballotItemWeVoteId}`);
      }
    }

    let toastMessage = "You've stopped following this organization's opinions.";
    if (organizationName) {
      toastMessage = `You've stopped following ${organizationName}'s opinions!`;
    }

    stopFollowingFunc();
    openSnackbar({ message: toastMessage });
    this.stopFollowingLocalState();
  }

  stopIgnoringInstantly (stopIgnoringFunc, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId) {
    const { organizationName } = this.state;
    if (currentBallotIdInUrl && urlWithoutHash && urlWithoutHash) {
      if (currentBallotIdInUrl !== ballotItemWeVoteId) {
        historyPush(`${urlWithoutHash}#${ballotItemWeVoteId}`);
      }
    }

    let toastMessage = "You've stopped ignoring this organization's opinions.";
    if (organizationName) {
      toastMessage = `You've stopped ignoring ${organizationName}'s opinions!`;
    }

    stopIgnoringFunc();
    openSnackbar({ message: toastMessage });
    this.stopIgnoringLocalState();
  }

  followInstantly (followFunction, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId) {
    const { organizationName } = this.state;
    if (currentBallotIdInUrl && urlWithoutHash && urlWithoutHash) {
      if (currentBallotIdInUrl !== ballotItemWeVoteId) {
        historyPush(`${urlWithoutHash}#${ballotItemWeVoteId}`);
      }
    }

    let toastMessage = "Now following this organization's opinions!";
    if (organizationName) {
      toastMessage = `Now following ${organizationName}'s opinions!`;
    }

    followFunction();
    openSnackbar({ message: toastMessage });
    this.startFollowingLocalState();
  }

  ignoreInstantly (ignoreFunction, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId) {
    const { organizationName } = this.state;
    if (currentBallotIdInUrl && urlWithoutHash && urlWithoutHash) {
      if (currentBallotIdInUrl !== ballotItemWeVoteId) {
        historyPush(`${urlWithoutHash}#${ballotItemWeVoteId}`);
      }
    }

    let toastMessage = "Now ignoring this organization's opinions.";
    if (organizationName) {
      toastMessage = `Now ignoring ${organizationName}'s opinions.`;
    }

    ignoreFunction();
    this.handleIgnoreLocal();
    openSnackbar({ message: toastMessage });
    this.startIgnoringLocalState();
  }

  render () {
    renderLog('FollowToggleCheckPlus');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      addToScoreLabelFullWidth, addToScoreLabelOn,
      anchorLeft, ballotItemWeVoteId, classes, currentBallotIdInUrl, hideDropdownButtonUntilFollowing,
      hideStopFollowingButton, hideStopIgnoringButton, lightModeOn, organizationWeVoteId,
      platformType, showFollowingText, speakerDisplayName, urlWithoutHash,
    } = this.props;
    if (!organizationWeVoteId) { return <div />; }

    const { isFollowing, isFriend, isIgnoring, linkedToIssueVoterIsFollowing, organizationName, voterIsFriendsWithThisOrganization, voterLinkedOrganizationWeVoteId } = this.state;
    const isLookingAtSelf = voterLinkedOrganizationWeVoteId === organizationWeVoteId;
    // You should not be able to follow yourself
    if (isLookingAtSelf) { return <div><CheckStyled /></div>; }

    const followFunction = () => OrganizationActions.organizationFollow(organizationWeVoteId);
    const stopFollowingFunc = () => OrganizationActions.organizationStopFollowing(organizationWeVoteId);
    const isFollowingFriendOrIgnoring = isFollowing || isFriend || isIgnoring || voterIsFriendsWithThisOrganization;
    const lineParams = {
      anchorLeft, ballotItemWeVoteId, classes, currentBallotIdInUrl, hideDropdownButtonUntilFollowing,
      hideStopFollowingButton, hideStopIgnoringButton, isFollowing, isFriend, isIgnoring, lightModeOn,
      organizationName, organizationWeVoteId, platformType,
      showFollowingText, speakerDisplayName, urlWithoutHash,
    };

    return (
      <FollowToggleCheckPlusWrapper>
        {(voterIsFriendsWithThisOrganization || linkedToIssueVoterIsFollowing) ? (
          <FriendOrLinkedToIssue>
            <div>
              <CheckStyled />
            </div>
          </FriendOrLinkedToIssue>
        ) : (
          <>
            {isFollowingFriendOrIgnoring ? (
              <>
                <AlreadyFollowingOrIgnoringButton handleClick={this.handleClick} params={lineParams} />
                <Menu
                  id="simple-menu"
                  anchorEl={this.state.anchorEl}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  keepMounted
                  open={Boolean(this.state.anchorEl)}
                  onClose={this.handleClose}
                >
                  <MenuItemStyled onClick={this.handleClose}>
                    <UnfollowFollowLine
                      followFunction={followFunction}
                      followInstantly={this.followInstantly}
                      stopFollowingFunc={stopFollowingFunc}
                      stopFollowingInstantly={this.stopFollowingInstantly}
                      params={lineParams}
                    />
                  </MenuItemStyled>
                </Menu>
              </>
            ) : (
              <FollowButton
                addToScoreLabelFullWidth={addToScoreLabelFullWidth}
                addToScoreLabelOn={addToScoreLabelOn}
                followFunction={followFunction}
                followInstantly={this.followInstantly}
                params={lineParams}
              />
            )}
          </>
        )}
      </FollowToggleCheckPlusWrapper>
    );
  }
}
FollowToggleCheckPlus.propTypes = {
  addToScoreLabelFullWidth: PropTypes.bool,
  addToScoreLabelOn: PropTypes.bool,
  anchorLeft: PropTypes.bool,
  ballotItemWeVoteId: PropTypes.string,
  classes: PropTypes.object,
  currentBallotIdInUrl: PropTypes.string,
  handleIgnore: PropTypes.func,
  hideDropdownButtonUntilFollowing: PropTypes.bool,
  hideStopFollowingButton: PropTypes.bool,
  hideStopIgnoringButton: PropTypes.bool,
  lightModeOn: PropTypes.bool,
  organizationWeVoteId: PropTypes.string,
  platformType: PropTypes.string,
  showFollowingText: PropTypes.bool,
  speakerDisplayName: PropTypes.string,
  urlWithoutHash: PropTypes.string,
};

const styles = () => ({
  followToggleCheckPlusRoot: {
    height: 40,
    margin: '0 !important',
    minWidth: 0,
    padding: '0 !important',
    width: 32,
  },
});


const AddStyled = muiStyled(Add)({
  fill: '#ccc',
  height: 32,
  width: 32,
});

const CheckStyled = muiStyled(Check)({
  fill: 'rgb(31, 192, 111)',
  height: 32,
  width: 32,
});

const ButtonStyled = muiStyled(Button)({
  // border: '1px solid rgb(204, 204, 204)',
  height: 18,
  width: 18,
});

const FollowToggleCheckPlusWrapper = styled('div')`
`;

const FriendOrLinkedToIssue = styled('div')`
  align-items: center;
  display: flex;
  height: 40px;
  margin: '0 !important';
  min-width: 0;
  padding: '0 !important';
  width: 32px;
`;

const NotInterestedStyled = muiStyled(NotInterested)({
  fill: 'rgb(13, 84, 111)',
  height: 18,
  width: 18,
});

const MenuItemStyled = muiStyled(MenuItem)({
  // height: 48,
});

export default withTheme(withStyles(styles)(FollowToggleCheckPlus));
