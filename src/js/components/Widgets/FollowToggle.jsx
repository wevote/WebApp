import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CheckCircle from '@material-ui/icons/CheckCircle';
import NotInterested from '@material-ui/icons/NotInterested';
import { historyPush } from '../../utils/cordovaUtils';
import VoterGuideStore from '../../stores/VoterGuideStore';
import { renderLog } from '../../utils/logging';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import { showToastError, showToastSuccess } from '../../utils/showToast';
import VoterStore from '../../stores/VoterStore';

export default class FollowToggle extends Component {
  static propTypes = {
    currentBallotIdInUrl: PropTypes.string,
    handleIgnore: PropTypes.func,
    hideStopFollowingButton: PropTypes.bool,
    ballotItemWeVoteId: PropTypes.string,
    showFollowingText: PropTypes.bool,
    urlWithoutHash: PropTypes.string,
    organizationWeVoteId: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      componentDidMountFinished: false,
      isFollowing: false,
      isIgnoring: false,
      organization: {},
      voter: {
        we_vote_id: '',
      },
    };

    this.followInstantly = this.followInstantly.bind(this);
    this.handleIgnoreLocal = this.handleIgnoreLocal.bind(this);
    this.stopFollowingInstantly = this.stopFollowingInstantly.bind(this);
  }

  componentDidMount () {
    // console.log('componentDidMount, this.props: ', this.props);
    if (this.props.organizationWeVoteId) {
      this.setState({
        componentDidMountFinished: true,
        isFollowing: OrganizationStore.isVoterFollowingThisOrganization(this.props.organizationWeVoteId),
        isIgnoring: OrganizationStore.isVoterIgnoringThisOrganization(this.props.organizationWeVoteId),
        organization: OrganizationStore.getOrganizationByWeVoteId(this.props.organizationWeVoteId),
        organizationWeVoteId: this.props.organizationWeVoteId,
      });
    }
    this.onVoterStoreChange();

    // We need the voterGuideStoreListener until we take the follow functions out of OrganizationActions and VoterGuideStore
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillReceiveProps (nextProps) {
    // console.log('itemActionBar, RELOAD componentWillReceiveProps');
    if (nextProps.organizationWeVoteId !== undefined && nextProps.organizationWeVoteId && nextProps.organizationWeVoteId !== this.state.organizationWeVoteId) {
      this.setState({
        componentDidMountFinished: true,
        isFollowing: OrganizationStore.isVoterFollowingThisOrganization(nextProps.organizationWeVoteId),
        isIgnoring: OrganizationStore.isVoterIgnoringThisOrganization(nextProps.organizationWeVoteId),
        organization: OrganizationStore.getOrganizationByWeVoteId(nextProps.organizationWeVoteId),
        organizationWeVoteId: nextProps.organizationWeVoteId,
      });
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.state.componentDidMountFinished === false) {
      // console.log('shouldComponentUpdate: componentDidMountFinished === false');
      return true;
    }

    if (this.state.organizationWeVoteId !== nextState.organizationWeVoteId) {
      // console.log('shouldComponentUpdate: this.state.organizationWeVoteId', this.state.organizationWeVoteId, ', nextState.organizationWeVoteId', nextState.organizationWeVoteId);
      return true;
    }

    if (this.state.isFollowing !== nextState.isFollowing) {
      // console.log('shouldComponentUpdate: this.state.isFollowing', this.state.isFollowing, ', nextState.isFollowing', nextState.isFollowing);
      return true;
    }

    if (this.state.isIgnoring !== nextState.isIgnoring) {
      // console.log('shouldComponentUpdate: this.state.isIgnoring', this.state.isIgnoring, ', nextState.isIgnoring', nextState.isIgnoring);
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    // console.log('componentWillUnmount, this.state.organizationWeVoteId: ', this.state.organizationWeVoteId);
    this.voterGuideStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onVoterGuideStoreChange () {
    // console.log('FollowToggle, onVoterGuideStoreChange, organization_we_vote_id: ', this.state.organizationWeVoteId);
    if (this.state.organizationWeVoteId) {
      const { organizationWeVoteId } = this.state;
      this.setState({
        isFollowing: OrganizationStore.isVoterFollowingThisOrganization(organizationWeVoteId),
        isIgnoring: OrganizationStore.isVoterIgnoringThisOrganization(organizationWeVoteId),
        organization: OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId),
      });
    }
  }

  onOrganizationStoreChange () {
    // console.log('FollowToggle, onOrganizationStoreChange, organization_we_vote_id: ', this.state.organizationWeVoteId);
    if (this.state.organizationWeVoteId) {
      const { organizationWeVoteId } = this.state;
      this.setState({
        isFollowing: OrganizationStore.isVoterFollowingThisOrganization(organizationWeVoteId),
        isIgnoring: OrganizationStore.isVoterIgnoringThisOrganization(organizationWeVoteId),
        organization: OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId),
      });
    }
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
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

  stopFollowingInstantly (stopFollowingFunc, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId) {
    if (currentBallotIdInUrl && urlWithoutHash && urlWithoutHash) {
      if (currentBallotIdInUrl !== ballotItemWeVoteId) {
        historyPush(`${this.props.urlWithoutHash}#${this.props.ballotItemWeVoteId}`);
      }
    }

    let toastMessage = "You've stopped following this organization's opinions.";

    if (this.state.organization && this.state.organization.organization_name) {
      const organizationName = this.state.organization.organization_name;
      toastMessage = `You've stopped following ${organizationName}'s opinions!`;
    }

    stopFollowingFunc();
    showToastError(toastMessage);
    this.stopFollowingLocalState();
  }

  followInstantly (followFunction, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId) {
    if (currentBallotIdInUrl && urlWithoutHash && urlWithoutHash) {
      if (currentBallotIdInUrl !== ballotItemWeVoteId) {
        historyPush(`${this.props.urlWithoutHash}#${this.props.ballotItemWeVoteId}`);
      }
    }

    let toastMessage = "Now following this organization's opinions!";

    if (this.state.organization && this.state.organization.organization_name) {
      const organizationName = this.state.organization.organization_name;
      toastMessage = `Now following ${organizationName}'s opinions!`;
    }

    followFunction();
    showToastSuccess(toastMessage);
    this.startFollowingLocalState();
  }

  handleIgnoreLocal () {
    // Some parent components need to react with this organization is ignored
    if (this.props.handleIgnore) {
      this.props.handleIgnore();
    }
  }

  ignoreInstantly (ignoreFunction, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId) {
    if (currentBallotIdInUrl && urlWithoutHash && urlWithoutHash) {
      if (currentBallotIdInUrl !== ballotItemWeVoteId) {
        historyPush(`${this.props.urlWithoutHash}#${this.props.ballotItemWeVoteId}`);
      }
    }

    let toastMessage = "Now ignoring this organization's opinions.";

    if (this.state.organization && this.state.organization.organization_name) {
      const organizationName = this.state.organization.organization_name;
      toastMessage = `Now ignoring ${organizationName}'s opinions.`;
    }

    ignoreFunction();
    this.handleIgnoreLocal();
    showToastError(toastMessage);
    this.startIgnoringLocalState();
  }

  render () {
    // console.log('FollowToggle render');
    renderLog(__filename);
    if (!this.state || !this.state.organizationWeVoteId) { return <div />; }

    const { organizationWeVoteId } = this.state;
    const isLookingAtSelf = this.state.voter.linked_organization_we_vote_id === organizationWeVoteId;

    // You should not be able to follow yourself
    if (isLookingAtSelf) { return <div />; }

    const { currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId, showFollowingText } = this.props;
    const followFunction = OrganizationActions.organizationFollow.bind(this, organizationWeVoteId);
    const ignoreFunction = OrganizationActions.organizationFollowIgnore.bind(this, organizationWeVoteId);
    const stopFollowingFunc = OrganizationActions.organizationStopFollowing.bind(this, organizationWeVoteId);

    return (
      <div className="issues-follow-container">
        {this.state.isFollowing || this.state.isIgnoring ? (
          <Button type="button" className="issues-follow-btn issues-follow-btn__main issues-follow-btn__icon issues-follow-btn--white issues-followed-btn--disabled" disabled>
            {showFollowingText ? (
              <span>
                { this.state.isFollowing && (
                  <span>
                    <CheckCircle className="following-icon" />
                    <span className="pl-2">Following</span>
                  </span>
                )}
                { this.state.isIgnoring && (
                  <span>
                    <NotInterested className="ignoring-icon" />
                    <span className="pl-2">Ignoring</span>
                  </span>
                )}
              </span>
            ) : (
              <span>
                { this.state.isFollowing &&
                  <CheckCircle className="following-icon" /> }
                { this.state.isIgnoring &&
                  <NotInterested className="ignoring-icon" /> }
              </span>
            )}
          </Button>
        ) : (
          <Button type="button" className="issues-follow-btn issues-follow-btn__main issues-follow-btn--blue" onClick={() => this.followInstantly(followFunction, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId)}>
            Follow
          </Button>
        )}
        {this.props.hideDropdownButtonUntilFollowing ? (
          <div>
            {this.state.isFollowing || this.state.isIgnoring ? (
              <React.Fragment>
                <div className="issues-follow-btn__seperator" />
                <Button type="button" className="dropdown-toggle dropdown-toggle-split issues-follow-btn issues-follow-btn__dropdown issues-follow-btn--white" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span className="sr-only">Toggle Dropdown</span>
                </Button>
                <div className="dropdown-menu dropdown-menu-right issues-follow-btn__menu">
                  {this.state.isFollowing ? (
                    <span className="d-print-none">
                      { this.props.hideStopFollowingButton ?
                        null : (
                          <Button type="button" className="dropdown-item issues-follow-btn issues-follow-btn__menu-item" onClick={() => this.stopFollowingInstantly(stopFollowingFunc, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId)}>
                            Unfollow
                          </Button>
                        )}
                    </span>
                  ) : (
                    <Button type="button" className="dropdown-item issues-follow-btn issues-follow-btn__menu-item" onClick={() => this.followInstantly(followFunction, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId)}>
                      Follow
                    </Button>
                  )}
                  <div className="dropdown-divider" />
                  <Button
                    type="button"
                    className="dropdown-item issues-follow-btn issues-follow-btn__menu-item"
                    onClick={() => this.ignoreInstantly(ignoreFunction, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId)}
                  >
                    Ignore
                  </Button>
                </div>
              </React.Fragment>
            ) : (
              null
            )}
          </div>
        ) : (
          <div>
            {this.state.isFollowing || this.state.isIgnoring ? (
              <React.Fragment>
                <div className="issues-follow-btn__seperator" />
                <Button type="button" className="dropdown-toggle dropdown-toggle-split issues-follow-btn issues-follow-btn__dropdown issues-follow-btn--white" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span className="sr-only">Toggle Dropdown</span>
                </Button>
                <div className="dropdown-menu dropdown-menu-right issues-follow-btn__menu">
                  {this.state.isFollowing ? (
                    <span className="d-print-none">
                      { this.props.hideStopFollowingButton ?
                        null : (
                          <Button type="button" className="dropdown-item issues-follow-btn issues-follow-btn__menu-item" onClick={() => this.stopFollowingInstantly(stopFollowingFunc, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId)}>
                            Unfollow
                          </Button>
                        )}
                    </span>
                  ) : (
                    <Button type="button" className="dropdown-item issues-follow-btn issues-follow-btn__menu-item" onClick={() => this.followInstantly(followFunction, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId)}>
                      Follow
                    </Button>
                  )}
                  <div className="dropdown-divider" />
                  <Button
                    type="button"
                    className="dropdown-item issues-follow-btn issues-follow-btn__menu-item"
                    onClick={() => this.ignoreInstantly(ignoreFunction, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId)}
                  >
                    Ignore
                  </Button>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className="issues-follow-btn__seperator" />
                <Button type="button" className="dropdown-toggle dropdown-toggle-split issues-follow-btn issues-follow-btn__dropdown issues-follow-btn--blue" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span className="sr-only">Toggle Dropdown</span>
                </Button>
                <div className="dropdown-menu dropdown-menu-right issues-follow-btn__menu">
                  {this.state.isFollowing ? (
                    <span className="d-print-none">
                      { this.props.hideStopFollowingButton ?
                        null : (
                          <Button type="button" className="dropdown-item issues-follow-btn issues-follow-btn__menu-item" onClick={() => this.stopFollowingInstantly(stopFollowingFunc, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId)}>
                            Unfollow
                          </Button>
                        )}
                    </span>
                  ) : (
                    <Button type="button" className="dropdown-item issues-follow-btn issues-follow-btn__menu-item" onClick={() => this.followInstantly(followFunction, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId)}>
                      Follow
                    </Button>
                  )}
                  <div className="dropdown-divider" />
                  <Button
                    type="button"
                    className="dropdown-item issues-follow-btn issues-follow-btn__menu-item"
                    onClick={() => this.ignoreInstantly(ignoreFunction, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId)}
                  >
                    Ignore
                  </Button>
                </div>
              </React.Fragment>
            )}
          </div>
        )}
      </div>
    );
  }
}
