import React, { Component } from "react";
import PropTypes from "prop-types";
import { historyPush } from "../../utils/cordovaUtils";
import LoadingWheel from "../../components/LoadingWheel";
import { renderLog } from "../../utils/logging";
import TwitterActions from "../../actions/TwitterActions";
import TwitterStore from "../../stores/TwitterStore";
import VoterStore from "../../stores/VoterStore";
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
      saving: false,
    });
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

  voterMergeTwoAccountsByTwitterKey (twitter_secret_key, voter_has_data_to_preserve = true) {
    VoterActions.voterMergeTwoAccountsByTwitterKey(twitter_secret_key);
    if (voter_has_data_to_preserve) {
      historyPush({
        pathname: "/more/network",
        state: {
          message: "Your accounts have been merged.",
          message_type: "success",
        },
      });
    } else {
      historyPush({
        pathname: "/ballot",
        query: { wait_until_voter_sign_in_completes: 1 },
        state: {
          message: "You have successfully signed in with Twitter.",
          message_type: "success",
        },
      });
    }
  }

  // This creates the public.twitter_twitterlinktovoter entry, which is needed
  // to establish is_signed_in within the voter.voter
  voterTwitterSaveToCurrentAccount () {
    VoterActions.voterTwitterSaveToCurrentAccount();
    historyPush({
      pathname: "/more/network",
      state: {
        message: "You have successfully signed in with Twitter.",
        message_type: "success",
      },
    });
    if (VoterStore.getVoterPhotoUrlMedium().length === 0) {
      // This only fires once, for brand new users on their very first login
      VoterActions.voterRetrieve();
    }
  }

  twitterSignInRetrieve () {
    TwitterActions.twitterSignInRetrieve();
    this.setState({saving: true});
  }

  yesPleaseMergeAccounts () {
    this.setState({yes_please_merge_accounts: true});
  }

  render () {
    renderLog(__filename);
    let {twitter_auth_response, yes_please_merge_accounts} = this.state;

    // console.log("TwitterSignInProcess render, this.state.saving:", this.state.saving);
    if (this.state.saving ||
      !twitter_auth_response ||
      !twitter_auth_response.twitter_retrieve_attempted ) {
      // console.log("twitter_auth_response:", twitter_auth_response);
      return LoadingWheel;
    }
    // console.log("=== Passed initial gate ===");
    // console.log("twitter_auth_response:", twitter_auth_response);
    let { twitter_secret_key } = twitter_auth_response;

    if (twitter_auth_response.twitter_sign_in_failed) {
      // console.log("Twitter sign in failed - push to /settings/account");
      historyPush({
        pathname: "/settings/account",
        state: {
          message: "Twitter sign in failed. Please try again.",
          message_type: "success",
        },
      });
      return LoadingWheel;
    }

    if (yes_please_merge_accounts) {
      // Go ahead and merge this voter record with the voter record that the twitter_secret_key belongs to
      // console.log("this.voterMergeTwoAccountsByTwitterKey -- yes please merge accounts");
      this.voterMergeTwoAccountsByTwitterKey(twitter_secret_key);
      // return <span>this.voterMergeTwoAccountsByTwitterKey({twitter_secret_key})</span>;
      return LoadingWheel;
    }

    // This process starts when we return from attempting voterTwitterSignInRetrieve
    // If twitter_sign_in_found NOT True, go back to the sign in page to try again
    if (!twitter_auth_response.twitter_sign_in_found) {
      // console.log("twitter_auth_response.twitter_sign_in_found", twitter_auth_response.twitter_sign_in_found);
      historyPush({
        pathname: "/settings/account",
        state: {
          message: "Twitter authentication not found. Please try again.",
          message_type: "warning",
        },
      });
      return LoadingWheel;
    }

    if (twitter_auth_response.existing_twitter_account_found) {
      // Is there anything to save from this voter account?
      if (twitter_auth_response.voter_has_data_to_preserve) {
        // console.log("TwitterSignInProcess voter_has_data_to_preserve is TRUE");
        const cancel_merge_function = this.cancelMergeFunction.bind(this);
        const please_merge_accounts_function = this.yesPleaseMergeAccounts.bind(this);
        // Display the question of whether to merge accounts or not
        return <WouldYouLikeToMergeAccounts cancelMergeFunction={cancel_merge_function}
                                            pleaseMergeAccountsFunction={please_merge_accounts_function} />;
        // return <span>WouldYouLikeToMergeAccounts</span>;
      } else {
        // Go ahead and merge the accounts, which means deleting the current voter and switching to the twitter-linked account
        // console.log("TwitterSignInProcess this.voterMergeTwoAccountsByTwitterKey - No data to merge");
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
