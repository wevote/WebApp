import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { CheckCircle, NotInterested } from '@material-ui/icons';
import FriendStore from '../../stores/FriendStore';
import { historyPush } from '../../utils/cordovaUtils';
import VoterGuideStore from '../../stores/VoterGuideStore';
import { renderLog } from '../../utils/logging';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterStore from '../../stores/VoterStore';
import { openSnackbar } from './SnackNotifier';

export default class FollowToggle extends Component {
  static propTypes = {
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

  constructor (props) {
    super(props);
    this.state = {
      componentDidMountFinished: false,
      isFollowing: false,
      isIgnoring: false,
      otherVoterWeVoteId: '',
    };

    this.followInstantly = this.followInstantly.bind(this);
    this.handleIgnoreLocal = this.handleIgnoreLocal.bind(this);
    this.stopFollowingInstantly = this.stopFollowingInstantly.bind(this);
    this.stopIgnoringInstantly = this.stopIgnoringInstantly.bind(this);
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
        componentDidMountFinished: true,
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

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.state.componentDidMountFinished === false) {
      // console.log('shouldComponentUpdate: componentDidMountFinished === false');
      return true;
    }

    if (this.props.organizationWeVoteId !== nextProps.organizationWeVoteId) {
      // console.log('shouldComponentUpdate: this.props.organizationWeVoteId', this.props.organizationWeVoteId, ', nextProps.organizationWeVoteId', nextProps.organizationWeVoteId);
      return true;
    }

    if (this.state.isFollowing !== nextState.isFollowing) {
      // console.log('shouldComponentUpdate: this.state.isFollowing', this.state.isFollowing, ', nextState.isFollowing', nextState.isFollowing);
      return true;
    }

    if (this.state.isFriend !== nextState.isFriend) {
      // console.log('shouldComponentUpdate: this.state.isFriend', this.state.isFriend, ', nextState.isFriend', nextState.isFriend);
      return true;
    }

    if (this.state.isIgnoring !== nextState.isIgnoring) {
      // console.log('shouldComponentUpdate: this.state.isIgnoring', this.state.isIgnoring, ', nextState.isIgnoring', nextState.isIgnoring);
      return true;
    }

    if (this.state.otherVoterWeVoteId !== nextState.otherVoterWeVoteId) {
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    // console.log('componentWillUnmount, this.props.organizationWeVoteId: ', this.props.organizationWeVoteId);
    this.friendStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.voterStoreListener.remove();
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

  handleIgnoreLocal () {
    // Some parent components need to react with this organization is ignored
    if (this.props.handleIgnore) {
      this.props.handleIgnore();
    }
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
      anchorLeft, ballotItemWeVoteId, currentBallotIdInUrl,
      hideDropdownButtonUntilFollowing, hideStopFollowingButton, hideStopIgnoringButton,
      lightModeOn, organizationWeVoteId, showFollowingText, urlWithoutHash, platformType,
    } = this.props;
    if (!organizationWeVoteId) { return <div />; }

    const { isFollowing, isFriend, isIgnoring, voterLinkedOrganizationWeVoteId } = this.state;
    const isLookingAtSelf = voterLinkedOrganizationWeVoteId === organizationWeVoteId;
    // You should not be able to follow yourself
    if (isLookingAtSelf) { return <div />; }

    const followFunction = OrganizationActions.organizationFollow.bind(this, organizationWeVoteId);
    const ignoreFunction = OrganizationActions.organizationFollowIgnore.bind(this, organizationWeVoteId);
    const stopFollowingFunc = OrganizationActions.organizationStopFollowing.bind(this, organizationWeVoteId);
    const stopIgnoringFunc = OrganizationActions.organizationStopIgnoring.bind(this, organizationWeVoteId);

    return (
      <div className="issues-follow-container">
        {isFollowing || isFriend || isIgnoring ? (
          <>
            <Button
              type="button"
              className={`issues-follow-btn issues-follow-btn__main issues-follow-btn__icon issues-follow-btn--white issues-followed-btn--disabled ${isFriend ? ' dropdown-toggle dropdown-toggle-split issues-follow-btn__main--radius' : ''}`}
              disabled
            >
              {showFollowingText ? (
                <span>
                  { (isFollowing || isFriend) && (
                    <span>
                      <CheckCircle className="following-icon" />
                      <span className="pl-2">Following</span>
                    </span>
                  )}
                  { isIgnoring && (
                    <span>
                      <NotInterested className="ignoring-icon" />
                      <span className="pl-2">Ignoring</span>
                    </span>
                  )}
                </span>
              ) : (
                <span>
                  { (isFollowing || isFriend) &&
                    <CheckCircle className="following-icon" /> }
                  { isIgnoring &&
                    <NotInterested className="ignoring-icon" /> }
                </span>
              )}
            </Button>
            {!isFriend && (
              <>
                <div className="issues-follow-btn__separator" />
                <Button
                  id={`positionItemFollowToggleDropdown-${platformType}-${organizationWeVoteId} organizationOrPublicFigureDropDown`}
                  type="button"
                  className="dropdown-toggle dropdown-toggle-split issues-follow-btn issues-follow-btn__dropdown issues-follow-btn--white"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <span className="sr-only">Toggle Dropdown</span>
                </Button>
                <div className={anchorLeft ? (
                  'dropdown-menu dropdown-menu-left issues-follow-btn__menu'
                ) : (
                  'dropdown-menu dropdown-menu-right issues-follow-btn__menu'
                )}
                >
                  {isFollowing ? (
                    <span className="d-print-none">
                      { hideStopFollowingButton ?
                        null : (
                          <Button
                            id={`positionItemFollowToggleUnfollow-${platformType}-${organizationWeVoteId} organizationOrPublicFigureUnfollow`}
                            type="button"
                            className="dropdown-item issues-follow-btn issues-follow-btn__menu-item"
                            onClick={() => this.stopFollowingInstantly(stopFollowingFunc, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId)}
                          >
                            Unfollow
                          </Button>
                        )}
                    </span>
                  ) : (
                    <Button
                      id={`positionItemFollowToggleFollowDropDown-${platformType}-${organizationWeVoteId} organizationOrPublicFigureDropDown`}
                      className="dropdown-item issues-follow-btn issues-follow-btn__menu-item"
                      onClick={() => this.followInstantly(followFunction, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId)}
                      type="button"
                    >
                      Follow
                    </Button>
                  )}
                  <div className="dropdown-divider" />
                  {isIgnoring ? (
                    <span className="d-print-none">
                      { hideStopIgnoringButton ?
                        null : (
                          <Button
                            id={`positionItemFollowToggleStopIgnoring-${platformType}-${organizationWeVoteId} organizationOrPublicFigureUnignore`}
                            type="button"
                            className="dropdown-item issues-follow-btn issues-follow-btn__menu-item"
                            onClick={() => this.stopIgnoringInstantly(stopIgnoringFunc, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId)}
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
                      onClick={() => this.ignoreInstantly(ignoreFunction, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId)}
                    >
                      Ignore
                    </Button>
                  )}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <Button
              id={`positionItemFollowToggleFollow-${platformType}-${organizationWeVoteId} organizationOrPublicFigureFollowDropDown`}
              type="button"
              className={`issues-follow-btn issues-follow-btn__main ${hideDropdownButtonUntilFollowing ? ' dropdown-toggle dropdown-toggle-split issues-follow-btn__main--radius' : ''} ${lightModeOn ? ' issues-follow-btn--white' : ' issues-follow-btn--blue'}`}
              onClick={() => this.followInstantly(followFunction, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId)}
            >
              Follow
            </Button>
            {!hideDropdownButtonUntilFollowing && (
              <>
                <div className="issues-follow-btn__separator" />
                <Button
                  id={`positionItemFollowToggleDropdown-${platformType}-${organizationWeVoteId} organizationOrPublicFigureDropDown`}
                  type="button"
                  className={`dropdown-toggle dropdown-toggle-split issues-follow-btn issues-follow-btn__dropdown ${lightModeOn ? ' issues-follow-btn--white' : ' issues-follow-btn--blue'}`}
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <span className="sr-only">Toggle Dropdown</span>
                </Button>
                <div className={`dropdown-menu issues-follow-btn__menu ${anchorLeft ? ' dropdown-menu-left' : ' dropdown-menu-right'}`}>
                  <Button
                    id={`positionItemFollowToggleFollow-${platformType}-${organizationWeVoteId} organizationOrPublicFigureFollowDropDown`}
                    type="button"
                    className="dropdown-item issues-follow-btn issues-follow-btn__menu-item"
                    onClick={() => this.followInstantly(followFunction, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId)}
                  >
                    Follow
                  </Button>
                  <div className="dropdown-divider" />
                  {isIgnoring ? (
                    <span className="d-print-none">
                      { !hideStopIgnoringButton && (
                        <Button
                          id={`positionItemFollowToggleStopIgnoring-${platformType}-${organizationWeVoteId} organizationOrPublicFigureUnignore`}
                          type="button"
                          className="dropdown-item issues-follow-btn issues-follow-btn__menu-item"
                          onClick={() => this.stopIgnoringInstantly(stopIgnoringFunc, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId)}
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
                      onClick={() => this.ignoreInstantly(ignoreFunction, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId)}
                    >
                      Ignore
                    </Button>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    );
  }
}
