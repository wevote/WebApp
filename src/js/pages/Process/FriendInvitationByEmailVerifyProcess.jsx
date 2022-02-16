import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Button } from '@material-ui/core';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import VoterActions from '../../actions/VoterActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));


export default class FriendInvitationByEmailVerifyProcess extends Component {
  constructor (props) {
    super(props);
    this.state = {
      friendInvitationByEmailVerifyCalled: false,
      friendInvitationInformationCalled: false,
      friendInvitationInformation: undefined,
      hostname: '',
      invitationStatus: undefined,
      saving: false,
      yesPleaseMergeAccounts: false,
    };
  }

  componentDidMount () {
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const { match: { params: { invitation_secret_key: invitationSecretKey } } } = this.props;
    // console.log('FriendInvitationByEmailVerifyProcess, componentDidMount, params.invitation_secret_key: ', invitationSecretKey);
    const hostname = AppObservableStore.getHostname();
    const voterDeviceId = VoterStore.voterDeviceId();
    // console.log('FriendInvitationByEmailVerifyProcess, componentDidMount, hostname: ', hostname);
    if (voterDeviceId && invitationSecretKey && hostname && hostname !== '') {
      // console.log('componentDidMount, calling friendInvitationByEmailVerify');
      FriendActions.friendInvitationInformation(invitationSecretKey); // Get data flowing but don't set friendInvitationInformationCalled: true yet
      this.friendInvitationByEmailVerify(invitationSecretKey);
      this.setState({
        friendInvitationByEmailVerifyCalled: true,
        hostname,
      });
    }
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppObservableStoreChange () {
    const { match: { params: { invitation_secret_key: invitationSecretKey } } } = this.props;
    const { friendInvitationByEmailVerifyCalled, friendInvitationInformationCalled } = this.state;
    const hostname = AppObservableStore.getHostname();
    const voterDeviceId = VoterStore.voterDeviceId();
    // console.log('FriendInvitationByEmailVerifyProcess, onAppObservableStoreChange, hostname: ', hostname, 'voterDeviceId:', voterDeviceId);
    if (voterDeviceId && !friendInvitationByEmailVerifyCalled && invitationSecretKey && hostname && hostname !== '') {
      // console.log('onAppObservableStoreChange, calling friendInvitationByEmailVerify');
      this.friendInvitationByEmailVerify(invitationSecretKey);
      this.setState({
        friendInvitationByEmailVerifyCalled: true,
        hostname,
      });
    }
    // If we know the verification API call has been called...
    if (voterDeviceId && friendInvitationByEmailVerifyCalled && !friendInvitationInformationCalled && invitationSecretKey && hostname && hostname !== '') {
      // console.log('onAppObservableStoreChange, calling friendInvitationInformation');
      FriendActions.friendInvitationInformation(invitationSecretKey);
      this.setState({
        friendInvitationInformationCalled: true,
        hostname,
      });
    }
  }

  onFriendStoreChange () {
    const { match: { params: { invitation_secret_key: invitationSecretKey } } } = this.props;
    const { friendInvitationByEmailVerifyCalled, friendInvitationInformationCalled } = this.state;
    const hostname = AppObservableStore.getHostname();
    const voterDeviceId = VoterStore.voterDeviceId();
    // console.log('FriendInvitationByEmailVerifyProcess, onFriendStoreChange, hostname: ', hostname, 'voterDeviceId:', voterDeviceId);
    if (voterDeviceId && friendInvitationByEmailVerifyCalled && !friendInvitationInformationCalled && invitationSecretKey && hostname && hostname !== '') {
      // console.log('onFriendStoreChange, calling friendInvitationInformation');
      FriendActions.friendInvitationInformation(invitationSecretKey);
      this.setState({
        friendInvitationInformationCalled: true,
        hostname,
      });
    }
    if (friendInvitationByEmailVerifyCalled) {
      // console.log('onFriendStoreChange, listening to getInvitationStatus');
      this.setState({
        invitationStatus: FriendStore.getInvitationStatus(),
        saving: false,
      });
    }
    if (friendInvitationInformationCalled) {
      // console.log('onFriendStoreChange, listening to getFriendInvitationInformation');
      this.setState({
        friendInvitationInformation: FriendStore.getFriendInvitationInformation(),
      });
    }
  }

  onVoterStoreChange () {
    // console.log('onVoterStoreChange');
    this.onAppObservableStoreChange();
  }

  cancelMergeFunction = () => {
    historyPush({
      pathname: '/ready',  // SnackNotifier that handles this is in Ready
      state: {
      },
    });
    // message: 'You have chosen to NOT merge your two accounts.',
    // message_type: 'success'
  }

  setYesPleaseMergeAccounts = () => {
    this.setState({ yesPleaseMergeAccounts: true });
  }

  voterMergeTwoAccountsByInvitationKey = (invitationSecretKey) => {
    VoterActions.voterMergeTwoAccountsByInvitationKey(invitationSecretKey);
    console.log('You have successfully signed in.');
    historyPush({
      pathname: `/wevoteintro/newfriend/${invitationSecretKey}`,
      state: {
        message: 'You have successfully signed in.',
        message_type: 'success',
      },
    });
  };

  friendInvitationByEmailVerify (invitationSecretKey) {
    FriendActions.friendInvitationByEmailVerify(invitationSecretKey);
    this.setState({ saving: true });
  }

  render () {
    renderLog('FriendInvitationByEmailVerifyProcess');  // Set LOG_RENDER_EVENTS to log all renders
    const { match: { params: { invitation_secret_key: invitationSecretKey } } } = this.props;
    const { friendInvitationInformation, hostname, invitationStatus, saving, yesPleaseMergeAccounts } = this.state;
    // console.log('FriendInvitationByEmailVerifyProcess, invitationStatus:', invitationStatus);

    if (yesPleaseMergeAccounts) {
      // If yesPleaseMergeAccounts is true, it doesn't matter what is happening with invitationStatus
      // Go ahead and merge this voter record with the voter record that the email_secret_key belongs to
      // console.log('this.voterMergeTwoAccountsByInvitationKey yesPleaseMergeAccounts is TRUE');
      this.voterMergeTwoAccountsByInvitationKey(invitationSecretKey);
      // return <span>this.voterMergeTwoAccountsByInvitationKey</span>;
      return LoadingWheel;
    }

    // console.log('FriendInvitationByEmailVerifyProcess, invitation_secret_key:', invitationSecretKey);
    // console.log('FriendInvitationByEmailVerifyProcess, invitationStatus:', invitationStatus);
    // console.log('friendInvitationInformation:', friendInvitationInformation);
    if (saving || !invitationStatus || !friendInvitationInformation || !hostname || hostname === '') {
      // console.log('FriendInvitationByEmailVerifyProcess, saving:', saving, ', or waiting for invitationStatus:', invitationStatus);
      return (
        <Suspense fallback={<></>}>
          <div>
            <CenteredText>
              <DelayedLoad waitBeforeShow={1000}>
                <div>
                  Verifying invitation code...
                  <br />
                </div>
              </DelayedLoad>
              <DelayedLoad waitBeforeShow={3000}>
                <div>
                  Setting up your account...
                  <br />
                </div>
              </DelayedLoad>
              <DelayedLoad waitBeforeShow={5000}>
                <div>
                  Preparing your ballot based on our best guess of your location...
                  <br />
                </div>
              </DelayedLoad>
            </CenteredText>
            {LoadingWheel}
            <CenteredText>
              <DelayedLoad waitBeforeShow={8000}>
                <Button
                  color="primary"
                  id="setYesPleaseMergeAccounts"
                  onClick={this.setYesPleaseMergeAccounts}
                  variant="contained"
                  // classes={showCancelEditAddressButton ? { root: classes.saveButton } : { root: classes.fullWidthSaveButton }}
                >
                  Continue
                </Button>
              </DelayedLoad>
            </CenteredText>
          </div>
        </Suspense>
      );
    } else if (!invitationSecretKey) {
      console.log('Invitation secret key not found. Invitation not accepted.');
      historyPush({
        pathname: '/ready',  // SnackNotifier that handles this is in Ready
        state: {
          message: 'Invitation secret key not found. Invitation not accepted.',
          message_type: 'warning',
        },
      });
      return LoadingWheel;
    }

    // This process starts when we return from attempting friendInvitationByEmailVerify
    if (!invitationStatus.voterDeviceId) {
      console.log('voterDeviceId Missing');
      return LoadingWheel;
    } else if (invitationStatus.attemptedToApproveOwnInvitation) {
      console.log('You are not allowed to approve your own invitation.');
      historyPush({
        pathname: '/friends',   // SnackNotifier that handles this is in Friends
        state: {
          message: 'You are not allowed to approve your own invitation.',
          message_type: 'danger',
        },
      });
      return LoadingWheel;
    } else if (friendInvitationInformation.invitationSecretKeyBelongsToThisVoter) {
      // We don't need to do anything more except redirect to the introduction page
      console.log('You have accepted your friend\'s invitation. See what your friends are supporting or opposing!');
      historyPush({
        pathname: `/wevoteintro/newfriend/${invitationSecretKey}`,
        state: {
          message: 'You have accepted your friend\'s invitation. See what your friends are supporting or opposing!',
          message_type: 'success',
        },
      });
      return LoadingWheel;
    } else if (!invitationStatus.invitationThatCanBeAcceptedFound) {
      console.log('You may have already accepted this invitation. Invitation links may only be used once.');
      historyPush({
        pathname: '/ready',   // SnackNotifier that handles this is in Ready
        state: {
          message: 'You may have already accepted this invitation. Invitation links may only be used once.',
          message_type: 'warning',
        },
      });
      return LoadingWheel;
    } else {
      // Go ahead and merge the accounts, which means deleting the current voter and switching to the invitation owner
      console.log('FriendInvitationByEmailVerifyProcess - voterMergeTwoAccountsByInvitationKey has been called.');
      this.voterMergeTwoAccountsByInvitationKey(invitationSecretKey);
      // return <span>this.voterMergeTwoAccountsByInvitationKey - go ahead</span>;
      return (
        <Suspense fallback={<></>}>
          <div>
            <CenteredText>
              <DelayedLoad waitBeforeShow={1000}>
                <div>
                  Verifying invitation code.
                  {' '}
                </div>
              </DelayedLoad>
              <DelayedLoad waitBeforeShow={3000}>
                <div>
                  Setting up your account.
                </div>
              </DelayedLoad>
              <DelayedLoad waitBeforeShow={5000}>
                <div>
                  Preparing your ballot based on our best guess of your location.
                </div>
              </DelayedLoad>
            </CenteredText>
            {LoadingWheel}
          </div>
        </Suspense>
      );
    }
  }
}
FriendInvitationByEmailVerifyProcess.propTypes = {
  match: PropTypes.object,
};

const CenteredText = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 70px;
  padding: 15px;
`;
