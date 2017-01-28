import React, { Component, PropTypes } from "react";
import { browserHistory } from "react-router";
import LoadingWheel from "../../components/LoadingWheel";
import VoterActions from "../../actions/VoterActions";
import VoterStore from "../../stores/VoterStore";
import WouldYouLikeToMergeAccounts from "../../components/WouldYouLikeToMergeAccounts";

export default class VerifyEmailProcess extends Component {
  static propTypes = {
    params: PropTypes.object,
    email_secret_key: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = {
      voter: VoterStore.getVoter(),
      yes_please_merge_accounts: false,
      saving: true
    };
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    let { email_secret_key } = this.props.params;
    console.log("VerifyEmailProcess, componentDidMount, this.props.params.email_secret_key: ", email_secret_key);
    this.voterEmailAddressVerify(email_secret_key);
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  cancelMergeFunction () {
    browserHistory.push({
      pathname: "/more/sign_in",
      state: {
      }
    });
    // message: "You have chosen to NOT merge your two accounts.",
    // message_type: "success"
  }

  _onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
      email_address_status: VoterStore.getEmailAddressStatus(),
      email_sign_in_status: VoterStore.getEmailSignInStatus(),
      saving: false
    });
  }

  voterMergeTwoAccountsByEmailKey (email_secret_key, voter_has_data_to_preserve = true) {
    VoterActions.voterMergeTwoAccountsByEmailKey(email_secret_key);
    if (voter_has_data_to_preserve) {
      browserHistory.push({
        pathname: "/more/sign_in",
        state: {
          message: "Your accounts have been merged.",
          message_type: "success"
        }
      });
    } else {
      browserHistory.push({
        pathname: "/ballot",
        state: {
          message: "You have successfully verified and signed in with your email.",
          message_type: "success"
        }
      });
    }
  }
  voterEmailAddressVerify (email_secret_key) {
    VoterActions.voterEmailAddressVerify(email_secret_key);
    this.setState({saving: true});
  }

  yesPleaseMergeAccounts () {
    this.setState({yes_please_merge_accounts: true});
  }

  render () {
    let { email_secret_key } = this.props.params;
    console.log("VerifyEmailProcess, email_secret_key:", email_secret_key);
    if (!email_secret_key ||
      this.state.saving ||
      !this.state.email_sign_in_status ||
      !this.state.email_sign_in_status.email_sign_in_attempted ||
      !this.state.voter) {
      return LoadingWheel;
    }

    // This process starts when we return from attempting voterEmailAddressVerify
    if (!this.state.email_sign_in_status.email_address_found) {
      console.log("Could not find secret_key - push to /more/sign_in");
      browserHistory.push({
        pathname: "/more/sign_in",
        state: {
          message: "Email verification did not work. Please try 'Send Verification Email' again.",
          message_type: "danger"
        }
      });
      return LoadingWheel;
    }

    if (this.state.yes_please_merge_accounts) {
      // Go ahead and merge this voter record with the voter record that the email_secret_key belongs to
      console.log("this.voterMergeTwoAccountsByEmailKey email_secret_key:", email_secret_key);
      this.voterMergeTwoAccountsByEmailKey(email_secret_key, this.state.voter.has_data_to_preserve);
      // return <span>this.voterMergeTwoAccountsByEmailKey</span>;
      return LoadingWheel;
    }

    if (!this.state.email_sign_in_status.email_ownership_is_verified) {
      console.log("email_ownership_is_verified not true - push to /more/sign_in");
      browserHistory.push({
        pathname: "/more/sign_in",
        state: {
          message: "Your email could not be verified.",
          message_type: "warning"
        }
      });
      return LoadingWheel;
    }

    if (this.state.email_sign_in_status.email_secret_key_belongs_to_this_voter) {
      // We don't need to do anything more except redirect
      console.log("secret key owned by this voter - push to /ballot");
      browserHistory.push({
        pathname: "/ballot",
        state: {
          message: "Your have successfully verified your email.",
          message_type: "success"
        }
      });
      return LoadingWheel;
    } else if (this.state.voter.has_data_to_preserve) {
      // If so, ask if they want to connect two accounts?
      console.log("VerifyEmailProcess this.state.voter.has_data_to_preserve:", this.state.voter.has_data_to_preserve);
      // Display the question of whether to merge accounts or not
      const cancel_merge_function = this.cancelMergeFunction.bind(this);
      const please_merge_accounts_function = this.yesPleaseMergeAccounts.bind(this);
      // Display the question of whether to merge accounts or not
      return <WouldYouLikeToMergeAccounts cancelMergeFunction={cancel_merge_function}
                                          pleaseMergeAccountsFunction={please_merge_accounts_function} />;
      //return <span>WouldYouLikeToMergeAccounts</span>;
    } else {
      // Go ahead and merge the accounts, which means deleting the current voter id and switching to the email owner
      console.log("this.voterMergeTwoAccountsByEmailKey - go ahead, email_secret_key:", email_secret_key);
      this.voterMergeTwoAccountsByEmailKey(email_secret_key, false);
      // return <span>this.voterMergeTwoAccountsByEmailKey - go ahead</span>;
      return LoadingWheel;
    }
  }
}
