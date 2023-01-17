/* eslint-disable object-property-newline */
import { CheckCircle, NotInterested } from '@mui/icons-material';
import { Button } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import styled from 'styled-components';
import { styled as muiStyled } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import OrganizationActions from '../../actions/OrganizationActions';
import historyPush from '../../common/utils/historyPush';
import Cookies from '../../common/utils/js-cookie/Cookies';
import { renderLog } from '../../common/utils/logging';
import FriendStore from '../../stores/FriendStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import { openSnackbar } from '../../common/components/Widgets/SnackNotifier';

const SignInModal = React.lazy(() => import(/* webpackChunkName: 'SignInModal' */ '../../common/components/SignIn/SignInModal'));


function AlreadyFollowingOrIgnoringButton (params) {
  const { handleClick } = params;
  const { showFollowingText, isFollowing, isFriend, isIgnoring } = params.params;

  return (
    <ButtonStyled
      aria-controls="simple-menu"
      aria-haspopup="true"
      onClick={(event) => handleClick(event)}
    >
      {showFollowingText ? (
        <span>
          { (isFollowing || isFriend) && (
            <span>
              <CheckCircleStyled className="following-icon" />
              <span style={{ paddingLeft: '4px' }}>Following</span>
            </span>
          )}
          { isIgnoring && (
            <span>
              <NotInterestedStyled className="ignoring-icon" />
              <span className="pl-2">Ignoring</span>
            </span>
          )}
        </span>
      ) : (
        <span>
          { (isFollowing || isFriend) && <CheckCircleStyled className="following-icon" /> }
          { isIgnoring && <NotInterestedStyled className="ignoring-icon" /> }
        </span>
      )}
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

function IgnoreLine (params) {
  const { stopIgnoringInstantly, stopIgnoringFunc, ignoreInstantly, ignoreFunction  } = params;
  const { isIgnoring, hideStopIgnoringButton, platformType, organizationWeVoteId, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId } = params.params;
  return (
    <>
      {isIgnoring ? (
        <span className="d-print-none">
          { hideStopIgnoringButton ?
            null : (
              <Button
                id={`positionItemFollowToggleStopIgnoring-${platformType}-${organizationWeVoteId} organizationOrPublicFigureUnignore`}
                type="button"
                className="dropdown-item issues-follow-btn issues-follow-btn__menu-item"
                onClick={() => stopIgnoringInstantly(stopIgnoringFunc, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId)}
              >
                Stop Ignoring
              </Button>
            )}
        </span>
      ) : (
        <Button
          id={`positionItemFollowToggleIgnore-${platformType}-${organizationWeVoteId} organizationOrPublicFigureIgnore`}
          type="button"
          className="dropdown-item issues-follow-btn issues-follow-btn__menu-item"
          onClick={() => ignoreInstantly(ignoreFunction, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId)}
        >
          Ignore
        </Button>
      )}
    </>
  );
}

function NotFollowingFriendOrIgnoringFollowLine (params) {
  const { addToScoreLabelFullWidth, addToScoreLabelOn, followInstantly, followFunction } = params;
  const {
    ballotItemWeVoteId, currentBallotIdInUrl,
    hideDropdownButtonUntilFollowing, lightModeOn, organizationWeVoteId, platformType,
    urlWithoutHash,
  } = params.params;
  return (
    <Button
      id={`positionItemFollowToggleFollow-${platformType}-${organizationWeVoteId} organizationOrPublicFigureFollowDropDown`}
      type="button"
      className={`issues-follow-btn issues-follow-btn__main ${hideDropdownButtonUntilFollowing ? ' dropdown-toggle dropdown-toggle-split issues-follow-btn__main--radius' : ''} ${lightModeOn ? ' issues-follow-btn--white' : ' issues-follow-btn--blue'}`}
      onClick={() => followInstantly(followFunction, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId)}
    >
      {addToScoreLabelOn ? (
        <>
          {addToScoreLabelFullWidth ? (
            <AddToScoreWrapper>
              Add to score
            </AddToScoreWrapper>
          ) : (
            <AddToScoreWrapper>
              <AddToScoreLabelTop>
                Add
              </AddToScoreLabelTop>
              <AddToScoreLabelBottom>
                to score
              </AddToScoreLabelBottom>
            </AddToScoreWrapper>
          )}
        </>
      ) : (
        <>
          Follow
        </>
      )}
    </Button>
  );
}

function NotFollowingFriendOrIgnoringIgnoreStopIgnoreLine (params) {
  const { ignoreInstantly, ignoreFunction,  stopIgnoringInstantly, stopIgnoringFunc } = params;
  const { isIgnoring, hideStopIgnoringButton, hideDropdownButtonUntilFollowing, platformType, organizationWeVoteId, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId,
  } = params.params;

  if (hideDropdownButtonUntilFollowing) {
    return null;
  }

  return (
    <>
      {isIgnoring ? (
        <span className="d-print-none">
          { !hideStopIgnoringButton && (
            <Button
              id={`positionItemFollowToggleStopIgnoring-${platformType}-${organizationWeVoteId} organizationOrPublicFigureUnignore`}
              type="button"
              className="dropdown-item issues-follow-btn issues-follow-btn__menu-item"
              onClick={() => stopIgnoringInstantly(stopIgnoringFunc, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId)}
            >
              Stop Ignoring
            </Button>
          )}
        </span>
      ) : (
        <Button
          id={`positionItemFollowToggleIgnore-${platformType}-${organizationWeVoteId} organizationOrPublicFigureIgnore`}
          type="button"
          className="dropdown-item issues-follow-btn issues-follow-btn__menu-item"
          onClick={() => ignoreInstantly(ignoreFunction, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId)}
        >
          Ignore
        </Button>
      )}
    </>
  );
}

// -----------------------------------------------------------------------------

export default class FollowToggle extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isFollowing: false,
      isIgnoring: false,
      otherVoterWeVoteId: '',
      showSignInModal: false,
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
      let otherVoterWeVoteId = '';
      if (organization) {
        ({
          organization_name: organizationName,
          linked_voter_we_vote_id: otherVoterWeVoteId,
        } = organization);
      }
      this.setState({
        isFollowing: OrganizationStore.isVoterFollowingThisOrganization(organizationWeVoteId),
        isIgnoring: OrganizationStore.isVoterIgnoringThisOrganization(organizationWeVoteId),
        organizationName,
      });
      if (otherVoterWeVoteId) {
        this.setState({
          isFriend: FriendStore.isFriend(otherVoterWeVoteId),
          otherVoterWeVoteId,
        });
      }
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
    const { otherVoterWeVoteId } = this.state;
    if (otherVoterWeVoteId) {
      this.setState({
        isFriend: FriendStore.isFriend(otherVoterWeVoteId),
      });
    }
  }

  onOrganizationStoreChange () {
    const { organizationWeVoteId } = this.props;
    // console.log('FollowToggle, onOrganizationStoreChange, organizationWeVoteId: ', organizationWeVoteId);
    if (organizationWeVoteId) {
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      let organizationName = '';
      let otherVoterWeVoteId = '';
      if (organization) {
        ({
          organization_name: organizationName,
          linked_voter_we_vote_id: otherVoterWeVoteId,
        } = organization);
      }
      // console.log('organizationName: ', organizationName);
      this.setState({
        isFollowing: OrganizationStore.isVoterFollowingThisOrganization(organizationWeVoteId),
        isIgnoring: OrganizationStore.isVoterIgnoringThisOrganization(organizationWeVoteId),
        organizationName,
      });
      if (otherVoterWeVoteId) {
        this.setState({
          isFriend: FriendStore.isFriend(otherVoterWeVoteId),
          otherVoterWeVoteId,
        });
      }
    }
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    let voterLinkedOrganizationWeVoteId = '';
    if (voter && voter.linked_organization_we_vote_id) {
      voterLinkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    }
    this.setState({ voterLinkedOrganizationWeVoteId });
  }

  onVoterGuideStoreChange () {
    // console.log('FollowToggle, onVoterGuideStoreChange, organizationWeVoteId: ', this.props.organizationWeVoteId);
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
        organizationName,
      });
    }
  }

  toggleShowSignInModal = () => {
    const { showSignInModal } = this.state;
    this.setState({
      showSignInModal: !showSignInModal,
    });
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

    // We are reusing the cookie sign_in_opened_from_issue_follow instead of having an organization-specific cookie
    //  so we don't annoy the voter with too many requests to sign in.
    const signInOpenedFromPreviousIssueFollow = Cookies.get('sign_in_opened_from_issue_follow') || 0;
    if (!signInOpenedFromPreviousIssueFollow) {
      Cookies.set('sign_in_opened_from_issue_follow', '1', { expires: 1, path: '/' });
      this.toggleShowSignInModal();
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
    renderLog('FollowToggle');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      addToScoreLabelFullWidth, addToScoreLabelOn,
      anchorLeft, ballotItemWeVoteId, currentBallotIdInUrl, hideDropdownButtonUntilFollowing,
      hideStopFollowingButton, hideStopIgnoringButton, lightModeOn, organizationWeVoteId,
      showFollowingText, urlWithoutHash, platformType,
    } = this.props;
    const { showSignInModal } = this.state;
    if (!organizationWeVoteId) { return <div />; }

    const { isFollowing, isFriend, isIgnoring, voterLinkedOrganizationWeVoteId, organizationName } = this.state;
    const isLookingAtSelf = voterLinkedOrganizationWeVoteId === organizationWeVoteId;
    // You should not be able to follow yourself
    if (isLookingAtSelf) { return <div />; }

    const followFunction = () => OrganizationActions.organizationFollow(organizationWeVoteId);
    const ignoreFunction = () => OrganizationActions.organizationFollowIgnore(organizationWeVoteId);
    const stopFollowingFunc = () => OrganizationActions.organizationStopFollowing(organizationWeVoteId);
    const stopIgnoringFunc = () => OrganizationActions.organizationStopIgnoring(organizationWeVoteId);
    const isFollowingFriendOrIgnoring = isFollowing || isFriend || isIgnoring;
    const lineParams = { ballotItemWeVoteId, currentBallotIdInUrl, hideDropdownButtonUntilFollowing, hideStopFollowingButton,
      isFollowing, isFriend, isIgnoring, organizationWeVoteId, platformType, showFollowingText, urlWithoutHash, organizationName,
      lightModeOn, anchorLeft, hideStopIgnoringButton,
    };

    return (
      <div className="issues-follow-container">
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
                {isFollowingFriendOrIgnoring ? (
                  <UnfollowFollowLine
                    followFunction={followFunction}
                    followInstantly={this.followInstantly}
                    stopFollowingFunc={stopFollowingFunc}
                    stopFollowingInstantly={this.stopFollowingInstantly}
                    params={lineParams}
                  />
                ) : (
                  <NotFollowingFriendOrIgnoringFollowLine
                    followFunction={followFunction}
                    followInstantly={this.followInstantly}
                    params={lineParams}
                  />
                )}
              </MenuItemStyled>
              <MenuItemStyled onClick={this.handleClose}>
                {isFollowingFriendOrIgnoring ? (
                  <IgnoreLine
                    ignoreFunction={ignoreFunction}
                    ignoreInstantly={this.ignoreInstantly}
                    stopIgnoringFunc={stopIgnoringFunc}
                    stopIgnoringInstantly={this.stopIgnoringInstantly}
                    params={lineParams}
                  />
                ) : (
                  <NotFollowingFriendOrIgnoringIgnoreStopIgnoreLine
                    ignoreFunction={ignoreFunction}
                    ignoreInstantly={this.ignoreInstantly}
                    stopIgnoringFunc={stopIgnoringFunc}
                    stopIgnoringInstantly={this.stopIgnoringInstantly}
                    params={lineParams}
                  />
                )}
              </MenuItemStyled>
            </Menu>
          </>
        ) : (
          <NotFollowingFriendOrIgnoringFollowLine
            addToScoreLabelFullWidth={addToScoreLabelFullWidth}
            addToScoreLabelOn={addToScoreLabelOn}
            followFunction={followFunction}
            followInstantly={this.followInstantly}
            params={lineParams}
          />
        )}
        {(showSignInModal && !VoterStore.getVoterIsSignedIn()) && (
          <Suspense fallback={<></>}>
            <SignInModal
              signInTitle="Sign in to save who you follow."
              signInSubTitle=""
              toggleOnClose={this.toggleShowSignInModal}
              uponSuccessfulSignIn={this.toggleShowSignInModal}
            />
          </Suspense>
        )}
      </div>
    );
  }
}
FollowToggle.propTypes = {
  addToScoreLabelFullWidth: PropTypes.bool,
  addToScoreLabelOn: PropTypes.bool,
  currentBallotIdInUrl: PropTypes.string,
  handleIgnore: PropTypes.func,
  hideStopFollowingButton: PropTypes.bool,
  hideStopIgnoringButton: PropTypes.bool,
  ballotItemWeVoteId: PropTypes.string,
  showFollowingText: PropTypes.bool,
  urlWithoutHash: PropTypes.string,
  organizationWeVoteId: PropTypes.string,
  hideDropdownButtonUntilFollowing: PropTypes.bool,
  lightModeOn: PropTypes.bool,
  anchorLeft: PropTypes.bool,
  platformType: PropTypes.string,
};


const AddToScoreLabelTop = styled('div')`
  font-size: 16px;
  margin-top: 0;
`;

const AddToScoreLabelBottom = styled('div')`
  font-size: 12px;
  margin-top: -12px;
`;

const AddToScoreWrapper = styled('div')`
  align-items: center;
  display: flex;
  flex-flow: column;
`;

const CheckCircleStyled = muiStyled(CheckCircle)({
  fill: 'rgb(13, 84, 111)',
  height: 18,
  width: 18,
});

const ButtonStyled = muiStyled(Button)({
  border: '1px solid rgb(204, 204, 204)',
  // height: 32,
  width: '100%',
});

const NotInterestedStyled = muiStyled(NotInterested)({
  fill: 'rgb(13, 84, 111)',
  height: 18,
  width: 18,
});

const MenuItemStyled = muiStyled(MenuItem)({
  // height: 48,
});
