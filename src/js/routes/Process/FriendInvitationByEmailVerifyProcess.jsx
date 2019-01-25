import React, { Component } from "react";
import PropTypes from "prop-types";
import FriendActions from "../../actions/FriendActions";
import FriendStore from "../../stores/FriendStore";
import { historyPush } from "../../utils/cordovaUtils";
import LoadingWheel from "../../components/LoadingWheel";
import { renderLog } from "../../utils/logging";
import VoterActions from "../../actions/VoterActions";
import WouldYouLikeToMergeAccounts from "../../components/WouldYouLikeToMergeAccounts";

export default class FriendInvitationByEmailVerifyProcess extends Component {
  static propTypes = {
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      saving: false,
      yesPleaseMergeAccounts: false,
    };
  }

  componentDidMount () {
    this.friendStoreListener = FriendStore.addListener(this._onFriendStoreChange.bind(this));
    const { invitation_secret_key: invitationSecretKey } = this.props.params;
    // console.log("FriendInvitationByEmailVerifyProcess, componentDidMount, this.props.params.invitation_secret_key: ", invitationSecretKey);
    this.friendInvitationByEmailVerify(invitationSecretKey);
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
  }

  cancelMergeFunction () {
    historyPush({
      pathname: "/more/network",
      state: {
      },
    });
    // message: "You have chosen to NOT merge your two accounts.",
    // message_type: "success"
  }

  friendInvitationByEmailVerify (invitationSecretKey) {
    FriendActions.friendInvitationByEmailVerify(invitationSecretKey);
    this.setState({ saving: true });
  }

  yesPleaseMergeAccounts () {
    this.setState({ yesPleaseMergeAccounts: true });
  }

  voterMergeTwoAccountsByInvitationKey (invitationSecretKey) {
    VoterActions.voterMergeTwoAccountsByInvitationKey(invitationSecretKey);
    historyPush({
      pathname: "/more/network",
      state: {
        message: "You have successfully signed in.",
        message_type: "success",
      },
    });
  }

  _onFriendStoreChange () {
    // let voter_device_id_echo= FriendStore.getVoterDeviceIdEcho();
    // voter_device_id =
    this.setState({
      invitationStatus: FriendStore.getInvitationStatus(),
      saving: false,
    });
  }

  render () {
    renderLog(__filename);
    const { invitation_secret_key: invitationSecretKey } = this.props.params;

    if (this.state.yesPleaseMergeAccounts) {
      // If yesPleaseMergeAccounts is true, it doesn't matter what is happening with invitationStatus
      // Go ahead and merge this voter record with the voter record that the email_secret_key belongs to
      // console.log("this.voterMergeTwoAccountsByInvitationKey yesPleaseMergeAccounts is TRUE");
      this.voterMergeTwoAccountsByInvitationKey(invitationSecretKey);
      // return <span>this.voterMergeTwoAccountsByInvitationKey</span>;
      return LoadingWheel;
    }

    // console.log("VerifyEmailProcess, email_secret_key:", invitationSecretKey);
    // console.log("VerifyEmailProcess, this.state:", this.state);
    if (!invitationSecretKey || this.state.saving || !this.state.invitationStatus || !this.state.invitationStatus.voterDeviceId) {
      return LoadingWheel;
    }

    // This process starts when we return from attempting friendInvitationByEmailVerify
    if (!this.state.invitationStatus.invitationFound) {
      historyPush({
        pathname: "/more/network/friends",
        state: {
          message: "Invitation not found. You may have already accepted this invitation. Invitation links may only be used once.",
          message_type: "warning",
        },
      });
      return LoadingWheel;
    }

    if (this.state.invitationStatus.attemptedToApproveOwnInvitation) {
      historyPush({
        pathname: "/more/network/friends",
        state: {
          message: "You are not allowed to approve your own invitation.",
          message_type: "danger",
        },
      });
      return LoadingWheel;
    }

    if (this.state.invitationStatus.invitationSecretKeyBelongsToThisVoter) {
      // We don't need to do anything more except redirect to the email management page
      historyPush({
        pathname: "/more/network/friends",
        state: {
          message: "You have accepted your friend's invitation. Visit your ballot to see what your friends are supporting or opposing.",
          message_type: "success",
        },
      });
      return LoadingWheel;
    } else if (this.state.invitationStatus.voterHasDataToPreserve) {
      // If so, ask if they want to connect two accounts?
      console.log("FriendInvitationByEmailVerifyProcess yesPleaseMergeAccounts is FALSE");
      const cancelMergeFunction = this.cancelMergeFunction.bind(this);
      const pleaseMergeAccountsFunction = this.yesPleaseMergeAccounts.bind(this);
      // Display the question of whether to merge accounts or not
      return (
        <WouldYouLikeToMergeAccounts
          cancelMergeFunction={cancelMergeFunction}
          pleaseMergeAccountsFunction={pleaseMergeAccountsFunction}
        />
      );
      // return <span>WouldYouLikeToMergeAccounts</span>;
    } else {
      // Go ahead and merge the accounts, which means deleting the current voter and switching to the invitation owner
      console.log("FriendInvitationByEmailVerifyProcess - voterHasDataToPreserve is FALSE");
      this.voterMergeTwoAccountsByInvitationKey(invitationSecretKey);
      // return <span>this.voterMergeTwoAccountsByInvitationKey - go ahead</span>;
      return LoadingWheel;
    }
  }
}
