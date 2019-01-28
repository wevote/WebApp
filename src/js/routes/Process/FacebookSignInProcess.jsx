import { Component } from "react";
import FacebookActions from "../../actions/FacebookActions";
import FacebookStore from "../../stores/FacebookStore";
import { historyPush } from "../../utils/cordovaUtils";
import LoadingWheel from "../../components/LoadingWheel";
import { renderLog } from "../../utils/logging";
import VoterActions from "../../actions/VoterActions";
// This will be needed in the future
// import WouldYouLikeToMergeAccounts from "../../components/WouldYouLikeToMergeAccounts";

export default class FacebookSignInProcess extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      facebookAuthResponse: {},
      saving: false,
      yesPleaseMergeAccounts: false,
      mergingTwoAccounts: false,
    };
    // These will be needed in the future
    // this.cancelMergeFunction = this.cancelMergeFunction.bind(this);
    // this.yesPleaseMergeAccounts = this.yesPleaseMergeAccounts.bind(this);
  }

  componentDidMount () {
    this.facebookStoreListener = FacebookStore.addListener(this.onFacebookStoreChange.bind(this));
    // console.log("FacebookSignInProcess, componentDidMount");
    this.voterFacebookSignInRetrieve();
  }

  componentWillUnmount () {
    this.facebookStoreListener.remove();
  }

  onFacebookStoreChange () {
    this.setState({
      facebookAuthResponse: FacebookStore.getFacebookAuthResponse(),
      saving: false,
    });
  }

  // This will be needed in the future
  // cancelMergeFunction () {
  //   historyPush({
  //     pathname: "/more/network",
  //     state: {
  //     },
  //   });
  //   // message: "You have chosen to NOT merge your two accounts.",
  //   // message_type: "success"
  // }

  voterMergeTwoAccountsByFacebookKey (facebookSecretKey, voterHasDataToPreserve = true) {
    // console.log("In voterMergeTwoAccountsByFacebookKey, facebookSecretKey: ", facebookSecretKey, ", voterHasDataToPreserve: ", voterHasDataToPreserve);
    if (this.state.mergingTwoAccounts) {
      // console.log("In process of mergingTwoAccounts");
    } else {
      // console.log("About to make voterMergeTwoAccountsByFacebookKey API call");
      VoterActions.voterMergeTwoAccountsByFacebookKey(facebookSecretKey);
      // Prevent voterMergeTwoAccountsByFacebookKey from being called multiple times
      this.setState({ mergingTwoAccounts: true });
    }
    if (voterHasDataToPreserve) {
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
          message: "You have successfully signed in with Facebook.",
          message_type: "success",
        },
      });
    }
  }

  voterFacebookSaveToCurrentAccount () {
    // console.log("In voterFacebookSaveToCurrentAccount");
    VoterActions.voterFacebookSaveToCurrentAccount();
    historyPush({
      pathname: "/more/network/friends",
      state: {
        message: "You have successfully signed in with Facebook.",
        message_type: "success",
      },
    });
  }

  voterFacebookSignInRetrieve () {
    // console.log("FacebookSignInProcess voterFacebookSignInRetrieve");
    if (!this.state.saving) {
      FacebookActions.voterFacebookSignInRetrieve();
      this.setState({ saving: true });
    }
  }

  // This will be needed in the future
  // yesPleaseMergeAccounts () {
  //   this.setState({ yesPleaseMergeAccounts: true });
  // }

  render () {
    renderLog(__filename);
    const { facebookAuthResponse, yesPleaseMergeAccounts } = this.state;

    // console.log("FacebookSignInProcess render, this.state.saving:", this.state.saving);
    if (this.state.saving ||
      !facebookAuthResponse ||
      !facebookAuthResponse.facebook_retrieve_attempted) {
      // console.log("facebookAuthResponse:", facebookAuthResponse);
      return LoadingWheel;
    }
    // console.log("=== Passed initial gate ===");
    // console.log("facebookAuthResponse:", facebookAuthResponse);
    const { facebook_secret_key: facebookSecretKey } = facebookAuthResponse;

    if (facebookAuthResponse.facebook_sign_in_failed) {
      // console.log("Facebook sign in failed - push to /settings/account");
      historyPush({
        pathname: "/settings/account",
        state: {
          message: "Facebook sign in failed. Please try again.",
          message_type: "success",
        },
      });
      return LoadingWheel;
    }

    if (yesPleaseMergeAccounts) {
      // Go ahead and merge this voter record with the voter record that the facebookSecretKey belongs to
      console.log("this.voterMergeTwoAccountsByFacebookKey -- yes please merge accounts");
      this.voterMergeTwoAccountsByFacebookKey(facebookSecretKey);
      return LoadingWheel;
    }

    // This process starts when we return from attempting voterFacebookSignInRetrieve
    // If facebook_sign_in_found NOT True, go back to the sign in page to try again
    if (!facebookAuthResponse.facebook_sign_in_found) {
      // console.log("facebookAuthResponse.facebook_sign_in_found", facebookAuthResponse.facebook_sign_in_found);
      historyPush({
        pathname: "/settings/account",
        state: {
          message: "Facebook authentication not found. Please try again.",
          message_type: "warning",
        },
      });
      return LoadingWheel;
    }

    // Is there a collision of two accounts?
    if (facebookAuthResponse.existing_facebook_account_found) {
      // For now are not asking to merge accounts
      this.voterMergeTwoAccountsByFacebookKey(facebookSecretKey, facebookAuthResponse.voter_has_data_to_preserve);
      return LoadingWheel;

      // In the future we want to use the following code to ask people before we merge their current account into
      //  their account that they previously signed into Facebook with

      // // Is there anything to save from this voter account?
      // if (facebookAuthResponse.voter_has_data_to_preserve) {
      //   console.log("FacebookSignInProcess voterHasDataToPreserve is TRUE");
      //   const cancelMergeFunction = this.cancelMergeFunction;
      //   const pleaseMergeAccountsFunction = this.yesPleaseMergeAccounts;
      //   // Display the question of whether to merge accounts or not
      //   return (
      //     <WouldYouLikeToMergeAccounts
      //       cancelMergeFunction={cancelMergeFunction}
      //       pleaseMergeAccountsFunction={pleaseMergeAccountsFunction}
      //     />
      //   );
      //   // return <span>WouldYouLikeToMergeAccounts</span>;
      // } else {
      //   // Go ahead and merge the accounts, which means deleting the current voter and switching to the facebook-linked account
      //   console.log("FacebookSignInProcess this.voterMergeTwoAccountsByFacebookKey - No data to merge");
      //   this.voterMergeTwoAccountsByFacebookKey(facebookSecretKey, facebookAuthResponse.voter_has_data_to_preserve);
      //   return LoadingWheel;
      // }
    } else {
      // console.log("Setting up new Facebook entry - voterFacebookSaveToCurrentAccount");
      this.voterFacebookSaveToCurrentAccount();
      return LoadingWheel;
    }
  }
}
