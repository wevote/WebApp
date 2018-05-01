import React, { Component } from "react";
import PropTypes from "prop-types";
import FriendActions from "../../actions/FriendActions";
import FriendStore from "../../stores/FriendStore";
import { historyPush } from "../../utils/cordovaUtils";
import LoadingWheel from "../../components/LoadingWheel";
import { renderLog } from "../../utils/logging";
import VoterActions from "../../actions/VoterActions";
import VoterStore from "../../stores/VoterStore";
import WouldYouLikeToMergeAccounts from "../../components/WouldYouLikeToMergeAccounts";

export default class FriendInvitationByEmailVerifyProcess extends Component {
  static propTypes = {
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      saving: false,
      voter: VoterStore.getVoter(),
      yes_please_merge_accounts: false
    };
  }

  componentDidMount () {
    this.friendStoreListener = FriendStore.addListener(this._onFriendStoreChange.bind(this));
    let { invitation_secret_key } = this.props.params;
    // console.log("FriendInvitationByEmailVerifyProcess, componentDidMount, this.props.params.invitation_secret_key: ", invitation_secret_key);
    this.friendInvitationByEmailVerify(invitation_secret_key);
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
  friendInvitationByEmailVerify (invitation_secret_key) {
    FriendActions.friendInvitationByEmailVerify(invitation_secret_key);
    this.setState({saving: true});
  }

  yesPleaseMergeAccounts () {
    this.setState({yes_please_merge_accounts: true});
  }

  voterMergeTwoAccountsByInvitationKey (invitation_secret_key) {
    VoterActions.voterMergeTwoAccountsByInvitationKey(invitation_secret_key);
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
      invitation_status: FriendStore.getInvitationStatus(),
      saving: false,
    });
  }

  render () {
    renderLog(__filename);
    let { invitation_secret_key } = this.props.params;

    if (this.state.yes_please_merge_accounts) {
      // If yes_please_merge_accounts is true, it doesn't matter what is happening with invitation_status
      // Go ahead and merge this voter record with the voter record that the email_secret_key belongs to
      // console.log("this.voterMergeTwoAccountsByInvitationKey yes_please_merge_accounts is TRUE");
      this.voterMergeTwoAccountsByInvitationKey(invitation_secret_key);
      // return <span>this.voterMergeTwoAccountsByInvitationKey</span>;
      return LoadingWheel;
    }

    // console.log("VerifyEmailProcess, email_secret_key:", invitation_secret_key);
    // console.log("VerifyEmailProcess, this.state:", this.state);
    if (!invitation_secret_key || this.state.saving || !this.state.invitation_status || !this.state.invitation_status.voter_device_id) {
      return LoadingWheel;
    }

    // This process starts when we return from attempting friendInvitationByEmailVerify
    if (!this.state.invitation_status.invitation_found) {
      historyPush({
        pathname: "/more/network/friends",
        state: {
          message: "Invitation not found. You may have already accepted this invitation. Invitation links may only be used once.",
          message_type: "warning",
        },
      });
      return LoadingWheel;
    }

    if (this.state.invitation_status.attempted_to_approve_own_invitation) {
      historyPush({
        pathname: "/more/network/friends",
        state: {
          message: "You are not allowed to approve your own invitation.",
          message_type: "danger",
        },
      });
      return LoadingWheel;
    }

    if (this.state.invitation_status.invitation_secret_key_belongs_to_this_voter) {
      // We don't need to do anything more except redirect to the email management page
      historyPush({
        pathname: "/more/network/friends",
        state: {
          message: "You have accepted your friend's invitation. Visit your ballot to see what your friends are supporting or opposing.",
          message_type: "success",
        },
      });
      return LoadingWheel;
    } else if (this.state.invitation_status.voter_has_data_to_preserve) {
      // If so, ask if they want to connect two accounts?
      console.log("FriendInvitationByEmailVerifyProcess yes_please_merge_accounts is FALSE");
      const cancel_merge_function = this.cancelMergeFunction.bind(this);
      const please_merge_accounts_function = this.yesPleaseMergeAccounts.bind(this);
      // Display the question of whether to merge accounts or not
      return <WouldYouLikeToMergeAccounts cancelMergeFunction={cancel_merge_function}
                                          pleaseMergeAccountsFunction={please_merge_accounts_function} />;
      // return <span>WouldYouLikeToMergeAccounts</span>;
    } else {
      // Go ahead and merge the accounts, which means deleting the current voter and switching to the invitation owner
      console.log("FriendInvitationByEmailVerifyProcess - voter_has_data_to_preserve is FALSE");
      this.voterMergeTwoAccountsByInvitationKey(invitation_secret_key);
      // return <span>this.voterMergeTwoAccountsByInvitationKey - go ahead</span>;
      return LoadingWheel;
    }
  }
}
