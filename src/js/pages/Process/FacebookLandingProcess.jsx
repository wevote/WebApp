import { Component } from 'react';
import FacebookActions from '../../actions/FacebookActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import FacebookStore from '../../stores/FacebookStore';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';


export default class FacebookLandingProcess extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.onFacebookStoreChange();
    this.facebookStoreListener = FacebookStore.addListener(this.onFacebookStoreChange.bind(this));
    this.onFriendStoreChange();
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    this.facebookStoreListener.remove();
    this.friendStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  onFacebookStoreChange () {
    console.log('onFacebookStoreChange appRequestAlreadyProcessed', FacebookStore.facebookAppRequestAlreadyProcessed());
    this.setState({
      appRequestAlreadyProcessed: FacebookStore.facebookAppRequestAlreadyProcessed(),
    });
  }

  onFriendStoreChange () {
    console.log('onFriendStoreChange facebookInvitationStatus', FriendStore.getInvitationFromFacebookStatus());
    this.setState({
      facebookInvitationStatus: FriendStore.getInvitationFromFacebookStatus(),
      saving: false,
    });
  }

  readFacebookAppRequests () {
    FacebookActions.readFacebookAppRequests();
    this.setState({ saving: true });
  }

  render () {
    renderLog('FacebookLandingProcess');  // Set LOG_RENDER_EVENTS to log all renders

    if (this.state.appRequestAlreadyProcessed) {
      historyPush({
        pathname: '/ready',
      });
      return LoadingWheel;
    }

    if (!this.state.voter || this.state.saving) {
      return LoadingWheel;
    }

    console.log('Got voter', this.state.voter);
    if (!this.state.voter.signed_in_facebook) {
      console.log('Voter is not logged in through facebook');
      FacebookActions.login();
      return LoadingWheel;
    } else {
      console.log('Voter is signed in through facebook and app_already_processed:', this.state.appRequestAlreadyProcessed);
      if (!this.state.appRequestAlreadyProcessed &&
        (!this.state.facebookInvitationStatus || !this.state.facebookInvitationStatus.voterDeviceId)) {
        // If facebook log in finished successfully then read all app requests
        console.log('Reading facebook app request and accepting the same');
        this.readFacebookAppRequests();
        return LoadingWheel;
      }
    }

    console.log('Invitation status:', this.state.facebookInvitationStatus);
    // This process starts when we return from attempting friendInvitationByFacebookVerify
    if (!this.state.facebookInvitationStatus.invitationThatCanBeAcceptedFound) {
      historyPush({
        pathname: '/ready',
        state: {
          message: 'Invitation not found. You may have already accepted this invitation. Invitation links may only be used once.',
          message_type: 'warning',
        },
      });
      return LoadingWheel;
    }

    if (this.state.facebookInvitationStatus.attemptedToApproveOwnInvitation) {
      historyPush({
        pathname: '/friends',
        state: {
          message: 'You are not allowed to approve your own invitation.',
          message_type: 'danger',
        },
      });
      return LoadingWheel;
    }

    if (this.state.facebookInvitationStatus.invitationThatCanBeAcceptedFound) {
      FacebookActions.deleteFacebookAppRequest(this.state.facebookInvitationStatus.facebookRequestId);
      historyPush({
        pathname: '/ready',
        state: {
          message: "You have accepted your friend's invitation. Visit your ballot to see what your friends are supporting or opposing.",
          message_type: 'success',
        },
      });
      return LoadingWheel;
    }

    return LoadingWheel;
  }
}
