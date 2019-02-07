import React, { Component } from "react";
import PropTypes from "prop-types";
import { historyPush } from "../../utils/cordovaUtils";
import LoadingWheel from "../../components/LoadingWheel";
import { renderLog } from "../../utils/logging";
import VoterActions from "../../actions/VoterActions";
import VoterStore from "../../stores/VoterStore";
import WouldYouLikeToMergeAccountsOld from "../../components/WouldYouLikeToMergeAccountsOld";

export default class SignInEmailProcess extends Component {
  static propTypes = {
    params: PropTypes.object,
    email_secret_key: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      emailSignInStatus: {},
      saving: false,
      voter: VoterStore.getVoter(),
    };
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const { email_secret_key: emailSecretKey } = this.props.params;
    // console.log("SignInEmailProcess, componentDidMount, this.props.params.emailSecretKey: ", emailSecretKey);
    this.voterEmailAddressSignIn(emailSecretKey);
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
      emailSignInStatus: VoterStore.getEmailSignInStatus(),
      saving: false,
    });
  }

  voterMergeTwoAccountsByEmailKey (emailSecretKey) {
    VoterActions.voterMergeTwoAccountsByEmailKey(emailSecretKey);
    this.setState({ saving: true });
  }

  voterEmailAddressSignIn (emailSecretKey) {
    VoterActions.voterEmailAddressSignIn(emailSecretKey);
    this.setState({ saving: true });
  }

  render () {
    renderLog(__filename);
    const { email_secret_key: emailSecretKey } = this.props.params;
    // console.log("SignInEmailProcess, emailSecretKey:", emailSecretKey);
    if (!emailSecretKey ||
      this.state.saving ||
      !this.state.emailSignInStatus ||
      !this.state.emailSignInStatus.email_sign_in_attempted) {
      // console.log("this.state.emailSignInStatus:", this.state.emailSignInStatus)
      return LoadingWheel;
    }

    // We redirect after voterMergeTwoAccountsByEmailKey comes back
    if (this.state.emailSignInStatus.voter_merge_two_accounts_attempted) {
      // console.log("voterMergeTwoAccountsByEmailKey attempted - push to /settings/account");
      historyPush({
        pathname: "/ballot",
        state: {
          message: "You have successfully signed in.",
          message_type: "success",
        },
      });
      return LoadingWheel;
    }

    // This process starts when we return from attempting voterEmailAddressSignIn
    if (!this.state.emailSignInStatus.email_address_found) {
      // console.log("Could not find secret_key in database - push to /settings/account");
      historyPush("/settings/account");
      return LoadingWheel;
    }

    if (this.state.emailSignInStatus.email_ownership_is_verified) {
      // If here we know that the secret key was valid
      if (this.state.emailSignInStatus.email_secret_key_belongs_to_this_voter) {
        // We don't need to do anything more except redirect to the email management page
        // console.log("secret key owned by this voter - push to /settings/account");
        historyPush({
          pathname: "/ballot",
          state: {
            message: "You have successfully signed in.",
            message_type: "success",
          },
        });
        return LoadingWheel;
      } else if (this.state.voter.has_data_to_preserve) {
        // console.log("this.state.voter.has_data_to_preserve");
        // If so, ask if they want to connect two accounts?
        if (this.state.emailSignInStatus.yes_please_merge_accounts) {
          // Go ahead and merge this voter record with the voter record that the emailSecretKey belongs to
          // console.log("this.voterMergeTwoAccountsByEmailKey -- yes please merge accounts");
          this.voterMergeTwoAccountsByEmailKey(emailSecretKey);
        } else {
          // Display the question of whether to merge accounts or not
          // console.log("BEFORE WouldYouLikeToMergeAccountsOld, this.state.emailSignInStatus:", this.state.emailSignInStatus);
          return (
            <WouldYouLikeToMergeAccountsOld
              emailSecretKey={emailSecretKey}
            />
          );
        }
      } else {
        // Go ahead and merge the accounts, which means deleting the current voter id and switching to the email owner
        // console.log("this.voterMergeTwoAccountsByEmailKey - go ahead");
        this.voterMergeTwoAccountsByEmailKey(emailSecretKey);
      }
    } else {
      // console.log("Voter may not be verified yet, redirecting to verfiy page");
      historyPush(`/verify_email/${emailSecretKey}`);
    }

    return LoadingWheel;
  }
}
