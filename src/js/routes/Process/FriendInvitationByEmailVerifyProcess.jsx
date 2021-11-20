import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import FriendActions from '../../actions/FriendActions';
import VoterActions from '../../actions/VoterActions';
import LoadingWheel from '../../components/LoadingWheel';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import FriendStore from '../../stores/FriendStore';
import { historyPush } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../components/Widgets/DelayedLoad'));


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
    const { match: { params: { invitation_secret_key: invitationSecretKey } } } = this.props;
    // console.log('FriendInvitationByEmailVerifyProcess, componentDidMount, params.invitation_secret_key: ', invitationSecretKey);
    const hostname = AppObservableStore.getHostname();
    if (invitationSecretKey && hostname && hostname !== '') {
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
  }

  onAppObservableStoreChange () {
    const { match: { params: { invitation_secret_key: invitationSecretKey } } } = this.props;
    const { friendInvitationByEmailVerifyCalled, friendInvitationInformationCalled } = this.state;
    const hostname = AppObservableStore.getHostname();
    if (!friendInvitationByEmailVerifyCalled && invitationSecretKey && hostname && hostname !== '') {
      // console.log('onAppObservableStoreChange, calling friendInvitationByEmailVerify');
      this.friendInvitationByEmailVerify(invitationSecretKey);
      this.setState({
        friendInvitationByEmailVerifyCalled: true,
        hostname,
      });
    }
    // If we know the verification API call has been called...
    if (friendInvitationByEmailVerifyCalled && !friendInvitationInformationCalled && invitationSecretKey && hostname && hostname !== '') {
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
    if (friendInvitationByEmailVerifyCalled && !friendInvitationInformationCalled && invitationSecretKey && hostname && hostname !== '') {
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

  cancelMergeFunction = () => {
    historyPush({
      pathname: '/ready',
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
            <DelayedLoad waitBeforeShow={1000}>
              <div>
                Verifying invitation code...
                {' '}
              </div>
            </DelayedLoad>
            <DelayedLoad waitBeforeShow={3000}>
              <div>
                Setting up your account...
              </div>
            </DelayedLoad>
            <DelayedLoad waitBeforeShow={5000}>
              <div>
                Preparing your ballot based on our best guess of your location...
              </div>
            </DelayedLoad>
            {LoadingWheel}
          </div>
        </Suspense>
      );
    } else if (!invitationSecretKey) {
      historyPush({
        pathname: '/ready',
        state: {
          message: 'Invitation secret key not found. Invitation not accepted.',
          message_type: 'warning',
        },
      });
      return LoadingWheel;
    }

    // This process starts when we return from attempting friendInvitationByEmailVerify
    if (!invitationStatus.voterDeviceId) {
      // console.log('voterDeviceId Missing');
      return LoadingWheel;
    } else if (invitationStatus.attemptedToApproveOwnInvitation) {
      historyPush({
        pathname: '/friends',
        state: {
          message: 'You are not allowed to approve your own invitation.',
          message_type: 'danger',
        },
      });
      return LoadingWheel;
    } else if (friendInvitationInformation.invitationSecretKeyBelongsToThisVoter) {
      // We don't need to do anything more except redirect to the introduction page
      historyPush({
        pathname: `/wevoteintro/newfriend/${invitationSecretKey}`,
        state: {
          message: 'You have accepted your friend\'s invitation. See what your friends are supporting or opposing!',
          message_type: 'success',
        },
      });
      return LoadingWheel;
    } else if (!invitationStatus.invitationThatCanBeAcceptedFound) {
      historyPush({
        pathname: '/ready',
        state: {
          message: 'You may have already accepted this invitation. Invitation links may only be used once.',
          message_type: 'warning',
        },
      });
      return LoadingWheel;
    // 2020-08-05 At this point we always want to proceed below, so no need to respond to voterHasDataToPreserve.
    // } else if (invitationStatus.voterHasDataToPreserve) {
    //   // If so, ask if they want to connect two accounts?
    //   // console.log('FriendInvitationByEmailVerifyProcess yesPleaseMergeAccounts is FALSE');
    //   // Display the question of whether to merge accounts or not
    //   return (
    //     <WouldYouLikeToMergeAccounts
    //       cancelMergeFunction={this.cancelMergeFunction}
    //       pleaseMergeAccountsFunction={this.setYesPleaseMergeAccounts}
    //     />
    //   );
    //   // return <span>WouldYouLikeToMergeAccounts</span>;
    } else {
      // Go ahead and merge the accounts, which means deleting the current voter and switching to the invitation owner
      // console.log('FriendInvitationByEmailVerifyProcess - voterHasDataToPreserve is FALSE');
      this.voterMergeTwoAccountsByInvitationKey(invitationSecretKey);
      // return <span>this.voterMergeTwoAccountsByInvitationKey - go ahead</span>;
      return (
        <Suspense fallback={<></>}>
          <div>
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
