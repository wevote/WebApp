import { Component } from "react";
import PropTypes from "prop-types";
import { historyPush } from "../../utils/cordovaUtils";
import LoadingWheel from "../../components/LoadingWheel";
import { renderLog } from "../../utils/logging";
import VoterActions from "../../actions/VoterActions";
import VoterStore from "../../stores/VoterStore";
// This will be needed in the future
// import WouldYouLikeToMergeAccounts from "../../components/WouldYouLikeToMergeAccounts";

export default class VerifyEmailProcess extends Component {
  static propTypes = {
    params: PropTypes.object,
    email_secret_key: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      emailSignInStatus: {},
      voter: VoterStore.getVoter(),
      // yesPleaseMergeAccounts: false,
      saving: true,
    };
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const { email_secret_key: emailSecretKey } = this.props.params;
    console.log("VerifyEmailProcess, componentDidMount, this.props.params.email_secret_key: ", emailSecretKey);
    this.voterEmailAddressVerify(emailSecretKey);
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  // cancelMergeFunction () {
  //   historyPush({
  //     pathname: "/settings/account",
  //     state: {
  //     },
  //   });
  //   // message: "You have chosen to NOT merge your two accounts.",
  //   // message_type: "success"
  // }

  onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
      emailSignInStatus: VoterStore.getEmailSignInStatus(),
      saving: false,
    });
  }

  voterMergeTwoAccountsByEmailKey (emailSecretKey, voterHasDataToPreserve = true) {
    VoterActions.voterMergeTwoAccountsByEmailKey(emailSecretKey);
    if (voterHasDataToPreserve) {
      historyPush({
        pathname: "/settings/account",
        state: {
          message: "Your accounts have been merged.",
          message_type: "success",
        },
      });
    } else {
      historyPush({
        pathname: "/ballot",
        state: {
          message: "You have successfully verified and signed in with your email.",
          message_type: "success",
        },
      });
    }
  }

  voterEmailAddressVerify (emailSecretKey) {
    VoterActions.voterEmailAddressVerify(emailSecretKey);
    this.setState({ saving: true });
  }

  // yesPleaseMergeAccounts () {
  //   this.setState({ yesPleaseMergeAccounts: true });
  // }

  render () {
    renderLog(__filename);
    const { email_secret_key: emailSecretKey } = this.props.params;
    console.log("VerifyEmailProcess, emailSecretKey:", emailSecretKey);
    if (!emailSecretKey ||
      this.state.saving ||
      !this.state.emailSignInStatus ||
      !this.state.emailSignInStatus.email_sign_in_attempted ||
      !this.state.voter) {
      return LoadingWheel;
    }

    // This process starts when we return from attempting voterEmailAddressVerify
    if (!this.state.emailSignInStatus.email_address_found) {
      console.log("Could not find secret_key - push to /settings/account");
      historyPush({
        pathname: "/settings/account",
        state: {
          message: "Email verification did not work. Please try 'Send Verification Email' again.",
          message_type: "danger",
        },
      });
      return LoadingWheel;
    }

    if (this.state.yesPleaseMergeAccounts) {
      // Go ahead and merge this voter record with the voter record that the emailSecretKey belongs to
      console.log("this.voterMergeTwoAccountsByEmailKey emailSecretKey:", emailSecretKey);
      this.voterMergeTwoAccountsByEmailKey(emailSecretKey, this.state.voter.has_data_to_preserve);
      // return <span>this.voterMergeTwoAccountsByEmailKey</span>;
      return LoadingWheel;
    }

    if (!this.state.emailSignInStatus.email_ownership_is_verified) {
      console.log("email_ownership_is_verified not true - push to /settings/account");
      historyPush({
        pathname: "/settings/account",
      });
      return LoadingWheel;
    }

    if (this.state.emailSignInStatus.email_secret_key_belongs_to_this_voter) {
      // We don't need to do anything more except redirect
      console.log("secret key owned by this voter - push to /ballot");
      historyPush({
        pathname: "/ballot",
        state: {
          message: "You have successfully verified your email.",
          message_type: "success",
        },
      });
      return LoadingWheel;
    // } else if (this.state.voter.has_data_to_preserve) {
    //   // If so, ask if they want to connect two accounts?
    //   console.log("VerifyEmailProcess this.state.voter.has_data_to_preserve:", this.state.voter.has_data_to_preserve);
    //   // Display the question of whether to merge accounts or not
    //   const cancelMergeFunction = this.cancelMergeFunction.bind(this);
    //   const pleaseMergeAccountsFunction = this.yesPleaseMergeAccounts.bind(this);
    //   // Display the question of whether to merge accounts or not
    //   return (
    //     <WouldYouLikeToMergeAccounts
    //       cancelMergeFunction={cancelMergeFunction}
    //       pleaseMergeAccountsFunction={pleaseMergeAccountsFunction}
    //     />
    //   );
    //   // return <span>WouldYouLikeToMergeAccounts</span>;
    } else {
      // Go ahead and merge the accounts, which means deleting the current voter id and switching to the email owner
      console.log("this.voterMergeTwoAccountsByEmailKey - go ahead, emailSecretKey:", emailSecretKey);
      this.voterMergeTwoAccountsByEmailKey(emailSecretKey, false);
      // return <span>this.voterMergeTwoAccountsByEmailKey - go ahead</span>;
      return LoadingWheel;
    }
  }
}
