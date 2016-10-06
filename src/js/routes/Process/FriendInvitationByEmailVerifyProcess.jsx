import React, { Component, PropTypes } from "react";
import { browserHistory } from "react-router";
import FriendActions from "../../actions/FriendActions";
import FriendStore from "../../stores/FriendStore";
import LoadingWheel from "../../components/LoadingWheel";
import VoterStore from "../../stores/VoterStore";

export default class FriendInvitationByEmailVerifyProcess extends Component {
  static propTypes = {
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      voter: VoterStore.getVoter(),
      saving: false
    };
  }

  componentDidMount () {
    this.friendStoreListener = FriendStore.addListener(this._onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    let { invitation_secret_key } = this.props.params;
    console.log("FriendInvitationByEmailVerifyProcess, componentDidMount, this.props.params.invitation_secret_key: ", invitation_secret_key);
    this.friendInvitationByEmailVerify(invitation_secret_key);
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
  }

  friendInvitationByEmailVerify(invitation_secret_key) {
    FriendActions.friendInvitationByEmailVerify(invitation_secret_key);
    this.setState({saving: true});
  }

  _onFriendStoreChange () {
    this.setState({
      invitation_status: FriendStore.getInvitationStatus(),
      saving: false
    });
  }

  _onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
      email_address_status: VoterStore.getEmailAddressStatus(),
      saving: false
    });
  }

  render () {
    let { invitation_secret_key } = this.props.params;
    console.log("VerifyEmailProcess, email_secret_key:", invitation_secret_key);
    if (!invitation_secret_key || this.state.saving || !this.state.email_address_status || !this.state.invitation_status) {
      return LoadingWheel;
    }

    // TODO DALE Not ready to use
    //return LoadingWheel;

    // This process starts when we return from attempting friendInvitationByEmailVerify
    if (!this.state.invitation_status.invitation_found) {
      console.log("Could not find secret_key - push to /requests");
      browserHistory.push("/requests");
    }

    if (this.state.email_address_status.email_ownership_is_verified) {
      if (this.state.email_address_status.email_secret_key_belongs_to_this_voter) {
        // We don't need to do anything more except redirect to the email management page
        console.log("secret key owned by this voter - push to /more/sign_in");
        browserHistory.push("/more/sign_in");
      } else {
        return <div>The email you just verified belongs to another account.
          Perhaps you used We Vote from another browser?</div>;
        // Is there anything to save from this voter account?
        // if (this.state.voter.has_data_to_preserve) {
        //   // If so, ask if they want to connect two accounts?
        //   if (this.state.yes_please_merge_accounts) {
        //     // Go ahead and merge this voter record with the voter record that the email_secret_key belongs to
        //     console.log("this.voterMergeTwoAccounts");
        //     //this.voterMergeTwoAccounts(email_secret_key)
        //     return <span>this.voterMergeTwoAccounts</span>;
        //     // return LoadingWheel;
        //   } else {
        //     // Display the question of whether to merge accounts or not
        //     //return <WouldYouLikeToMergeAccounts />;
        //     return <span>WouldYouLikeToMergeAccounts</span>;
        //   }
        // } else {
        //   // Go ahead and merge the accounts, which means deleting the current voter id and switching to the email owner
        //   console.log("this.voterMergeTwoAccounts - go ahead");
        //   //this.voterMergeTwoAccounts(email_secret_key)
        //   return <span>this.voterMergeTwoAccounts - go ahead</span>;
        //   // return LoadingWheel;
        // }
      }
    }
    return LoadingWheel;
  }
}
