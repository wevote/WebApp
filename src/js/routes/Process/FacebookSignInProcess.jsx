import React, { Component, PropTypes } from "react";
import { browserHistory } from "react-router";
import FacebookActions from "../../actions/FacebookActions";
import FacebookStore from "../../stores/FacebookStore";
import LoadingWheel from "../../components/LoadingWheel";
import VoterActions from "../../actions/VoterActions";
import WouldYouLikeToMergeAccounts from "../../components/WouldYouLikeToMergeAccounts";

export default class FacebookSignInProcess extends Component {
  static propTypes = {
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      facebook_auth_response: {},
      saving: false,
      voter: {},
      yes_please_merge_accounts: false,
      merging_two_accounts: false
    };
  }

  componentDidMount () {
    this.facebookStoreListener = FacebookStore.addListener(this._onFacebookStoreChange.bind(this));
    // console.log("FacebookSignInProcess, componentDidMount");
    this.voterFacebookSignInRetrieve();
  }

  componentWillUnmount () {
    this.facebookStoreListener.remove();
  }

  _onFacebookStoreChange () {
    this.setState({
      facebook_auth_response: FacebookStore.getFacebookAuthResponse(),
      saving: false
    });
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

  voterMergeTwoAccountsByFacebookKey (facebook_secret_key, voter_has_data_to_preserve = true) {
    // console.log("In voterMergeTwoAccountsByFacebookKey, facebook_secret_key: ", facebook_secret_key, ", voter_has_data_to_preserve: ", voter_has_data_to_preserve);
    if (this.state.merging_two_accounts) {
      // console.log("In process of merging_two_accounts");
    } else {
      // console.log("About to make API call");
      VoterActions.voterMergeTwoAccountsByFacebookKey(facebook_secret_key);
      // Prevent voterMergeTwoAccountsByFacebookKey from being called multiple times
      this.setState({merging_two_accounts: true});
    }
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
          message: "You have successfully signed in with Facebook.",
          message_type: "success"
        }
      });
    }
  }

  voterFacebookSaveToCurrentAccount () {
    // console.log("In voterFacebookSaveToCurrentAccount");
    VoterActions.voterFacebookSaveToCurrentAccount();
    browserHistory.push({
      pathname: "/more/sign_in",
      state: {
        message: "Your have successfully signed into Facebook.",
        message_type: "success"
      }
    });
  }

  voterFacebookSignInRetrieve () {
    // console.log("FacebookSignInProcess voterFacebookSignInRetrieve");
    if (!this.state.saving) {
      FacebookActions.voterFacebookSignInRetrieve();
      this.setState({saving: true});
    }
  }

  yesPleaseMergeAccounts () {
    this.setState({yes_please_merge_accounts: true});
  }

  render () {
    let {facebook_auth_response, yes_please_merge_accounts} = this.state;

    // console.log("FacebookSignInProcess render, this.state.saving:", this.state.saving);
    if (this.state.saving ||
      !facebook_auth_response ||
      !facebook_auth_response.facebook_retrieve_attempted ) {
      // console.log("facebook_auth_response:", facebook_auth_response);
      return LoadingWheel;
    }
    // console.log("=== Passed initial gate ===");
    // console.log("facebook_auth_response:", facebook_auth_response);
    let { facebook_secret_key } = facebook_auth_response;

    if (facebook_auth_response.facebook_sign_in_failed) {
      // console.log("Facebook sign in failed - push to /more/sign_in");
      browserHistory.push({
        pathname: "/more/sign_in",
        state: {
          message: "Facebook sign in failed. Please try again.",
          message_type: "success"
        }
      });
      return LoadingWheel;
    }

    if (yes_please_merge_accounts) {
      // Go ahead and merge this voter record with the voter record that the facebook_secret_key belongs to
      // console.log("this.voterMergeTwoAccountsByFacebookKey -- yes please merge accounts");
      this.voterMergeTwoAccountsByFacebookKey(facebook_secret_key);
      return LoadingWheel;
      // return <span>this.voterMergeTwoAccountsByFacebookKey({facebook_secret_key})</span>;
    }

    // This process starts when we return from attempting voterFacebookSignInRetrieve
    // If facebook_sign_in_found NOT True, go back to the sign in page to try again
    if (!facebook_auth_response.facebook_sign_in_found) {
      // console.log("facebook_auth_response.facebook_sign_in_found", facebook_auth_response.facebook_sign_in_found);
      browserHistory.push({
        pathname: "/more/sign_in",
        state: {
          message: "Facebook authentication not found. Please try again.",
          message_type: "warning"
        }
      });
      return LoadingWheel;
    }

    // Is there a collision of two accounts?
    if (facebook_auth_response.existing_facebook_account_found) {
      // Is there anything to save from this voter account?
      if (facebook_auth_response.voter_has_data_to_preserve) {
        // console.log("FacebookSignInProcess voter_has_data_to_preserve is TRUE");
        const cancel_merge_function = this.cancelMergeFunction.bind(this);
        const please_merge_accounts_function = this.yesPleaseMergeAccounts.bind(this);
        // Display the question of whether to merge accounts or not
        return <WouldYouLikeToMergeAccounts cancelMergeFunction={cancel_merge_function}
                                            pleaseMergeAccountsFunction={please_merge_accounts_function} />;
        // return <span>WouldYouLikeToMergeAccounts</span>;
      } else {
        // Go ahead and merge the accounts, which means deleting the current voter and switching to the facebook-linked account
        // console.log("FacebookSignInProcess this.voterMergeTwoAccountsByFacebookKey - No data to merge");
        this.voterMergeTwoAccountsByFacebookKey(facebook_secret_key, facebook_auth_response.voter_has_data_to_preserve);
        return LoadingWheel;
        // return <span>this.voterMergeTwoAccountsByFacebookKey({facebook_secret_key}); - No data to merge</span>;
      }
    } else {
      // console.log("Setting up new Facebook entry - voterFacebookSaveToCurrentAccount");
      this.voterFacebookSaveToCurrentAccount();
      return LoadingWheel;
      // return <span>Setting up new Facebook entry - voterFacebookSaveToCurrentAccount</span>;
    }
  }
}
