import React, { Component, PropTypes } from "react";
import { browserHistory } from "react-router";
import TwitterActions from "../../actions/TwitterActions";
import TwitterStore from "../../stores/TwitterStore";
import LoadingWheel from "../../components/LoadingWheel";
import VoterActions from "../../actions/VoterActions";
import WouldYouLikeToMergeAccounts from "../../components/WouldYouLikeToMergeAccounts";

export default class TwitterSignInProcess extends Component {
  static propTypes = {
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      twitter_auth_response: {},
      saving: false,
      voter: {},
      yes_please_merge_accounts: false
    };
  }

  componentDidMount () {
    this.twitterStoreListener = TwitterStore.addListener(this._onTwitterStoreChange.bind(this));
    this.twitterSignInRetrieve();
  }

  componentWillUnmount () {
    this.twitterStoreListener.remove();
  }

  _onTwitterStoreChange () {
    this.setState({
      twitter_auth_response: TwitterStore.getTwitterAuthResponse(),
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

  voterMergeTwoAccountsByTwitterKey (twitter_secret_key, voter_has_data_to_preserve = true) {
    VoterActions.voterMergeTwoAccountsByTwitterKey(twitter_secret_key);
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
          message: "You have successfully signed in with Twitter.",
          message_type: "success"
        }
      });
    }
  }

  voterTwitterSaveToCurrentAccount () {
    VoterActions.voterTwitterSaveToCurrentAccount();
    browserHistory.push({
      pathname: "/more/sign_in",
      state: {
        message: "Your have successfully signed into Twitter.",
        message_type: "success"
      }
    });
  }

  twitterSignInRetrieve () {
    TwitterActions.twitterSignInRetrieve();
    this.setState({saving: true});
  }

  yesPleaseMergeAccounts () {
    this.setState({yes_please_merge_accounts: true});
  }

  render () {
    let {twitter_auth_response, yes_please_merge_accounts} = this.state;

    console.log("TwitterSignInProcess render, this.state.saving:", this.state.saving);
    if (this.state.saving ||
      !twitter_auth_response ||
      !twitter_auth_response.twitter_retrieve_attempted ) {
      // console.log("twitter_auth_response:", twitter_auth_response);
      return LoadingWheel;
    }
    console.log("=== Passed initial gate ===");
    console.log("twitter_auth_response:", twitter_auth_response);
    let { twitter_secret_key } = twitter_auth_response;

    if (twitter_auth_response.twitter_sign_in_failed) {
      console.log("Twitter sign in failed - push to /more/sign_in");
      browserHistory.push({
        pathname: "/more/sign_in",
        state: {
          message: "Twitter sign in failed. Please try again.",
          message_type: "success"
        }
      });
      return LoadingWheel;
    }

    if (yes_please_merge_accounts) {
      // Go ahead and merge this voter record with the voter record that the twitter_secret_key belongs to
      console.log("this.voterMergeTwoAccountsByTwitterKey -- yes please merge accounts");
      this.voterMergeTwoAccountsByTwitterKey(twitter_secret_key);
      // return <span>this.voterMergeTwoAccountsByTwitterKey({twitter_secret_key})</span>;
      return LoadingWheel;
    }

    // This process starts when we return from attempting voterTwitterSignInRetrieve
    // If twitter_sign_in_found NOT True, go back to the sign in page to try again
    if (!twitter_auth_response.twitter_sign_in_found) {
      // console.log("twitter_auth_response.twitter_sign_in_found", twitter_auth_response.twitter_sign_in_found);
      browserHistory.push({
        pathname: "/more/sign_in",
        state: {
          message: "Twitter authentication not found. Please try again.",
          message_type: "warning"
        }
      });
      return LoadingWheel;
    }

    if (twitter_auth_response.existing_twitter_account_found) {
      // Is there anything to save from this voter account?
      if (twitter_auth_response.voter_has_data_to_preserve) {
        console.log("TwitterSignInProcess voter_has_data_to_preserve is TRUE");
        const cancel_merge_function = this.cancelMergeFunction.bind(this);
        const please_merge_accounts_function = this.yesPleaseMergeAccounts.bind(this);
        // Display the question of whether to merge accounts or not
        return <WouldYouLikeToMergeAccounts cancelMergeFunction={cancel_merge_function}
                                            pleaseMergeAccountsFunction={please_merge_accounts_function} />;
        // return <span>WouldYouLikeToMergeAccounts</span>;
      } else {
        // Go ahead and merge the accounts, which means deleting the current voter and switching to the twitter-linked account
        console.log("TwitterSignInProcess this.voterMergeTwoAccountsByTwitterKey - No data to merge");
        this.voterMergeTwoAccountsByTwitterKey(twitter_secret_key, twitter_auth_response.voter_has_data_to_preserve);
        // return <span>this.voterMergeTwoAccountsByTwitterKey({twitter_secret_key}); - No data to merge</span>;
        return LoadingWheel;
      }
    } else {
      console.log("Setting up new Twitter entry - voterTwitterSaveToCurrentAccount");
      this.voterTwitterSaveToCurrentAccount();
      //return <span>Setting up new Twitter entry - voterTwitterSaveToCurrentAccount</span>;
      return LoadingWheel;
    }
  }
}
