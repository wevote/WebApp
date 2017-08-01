import React, { Component, PropTypes } from "react";
import { browserHistory } from "react-router";
import LoadingWheel from "../../components/LoadingWheel";
import VoterActions from "../../actions/VoterActions";
import VoterStore from "../../stores/VoterStore";
import WouldYouLikeToMergeAccountsOld from "../../components/WouldYouLikeToMergeAccountsOld";

export default class SignInEmailProcess extends Component {
  static propTypes = {
    params: PropTypes.object,
    email_secret_key: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = {
      voter: VoterStore.getVoter(),
      saving: false
    };
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    let { email_secret_key } = this.props.params;
    // console.log("SignInEmailProcess, componentDidMount, this.props.params.email_secret_key: ", email_secret_key);
    this.voterEmailAddressSignIn(email_secret_key);
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
      email_sign_in_status: VoterStore.getEmailSignInStatus(),
      saving: false
    });
  }

  voterMergeTwoAccountsByEmailKey (email_secret_key) {
    VoterActions.voterMergeTwoAccountsByEmailKey(email_secret_key);
    this.setState({saving: true});
  }

  voterEmailAddressSignIn (email_secret_key) {
    VoterActions.voterEmailAddressSignIn(email_secret_key);
    this.setState({saving: true});
  }

  render () {
    let { email_secret_key } = this.props.params;
    // console.log("SignInEmailProcess, email_secret_key:", email_secret_key);
    if (!email_secret_key ||
      this.state.saving ||
      !this.state.email_sign_in_status ||
      !this.state.email_sign_in_status.email_sign_in_attempted) {
      // console.log("this.state.email_sign_in_status:", this.state.email_sign_in_status)
      return LoadingWheel;
    }

    // We redirect after voterMergeTwoAccountsByEmailKey comes back
    if (this.state.email_sign_in_status.voter_merge_two_accounts_attempted) {
      // console.log("voterMergeTwoAccountsByEmailKey attempted - push to /more/sign_in");
      browserHistory.push({
        pathname: "/ballot",
        state: {
          message: "You have successfully signed in.",
          message_type: "success"
        }
      });
      return LoadingWheel;
    }

    // This process starts when we return from attempting voterEmailAddressSignIn
    if (!this.state.email_sign_in_status.email_address_found) {
      // console.log("Could not find secret_key in database - push to /more/sign_in");
      browserHistory.push("/more/sign_in");
      return LoadingWheel;
    }

    if (this.state.email_sign_in_status.email_ownership_is_verified) {
      // If here we know that the secret key was valid
      if (this.state.email_sign_in_status.email_secret_key_belongs_to_this_voter) {
        // We don't need to do anything more except redirect to the email management page
        // console.log("secret key owned by this voter - push to /more/sign_in");
        browserHistory.push({
          pathname: "/ballot",
          state: {
            message: "You have successfully signed in.",
            message_type: "success"
          }
        });
        return LoadingWheel;
      } else if (this.state.voter.has_data_to_preserve) {
        // console.log("this.state.voter.has_data_to_preserve");
        // If so, ask if they want to connect two accounts?
        if (this.state.email_sign_in_status.yes_please_merge_accounts) {
          // Go ahead and merge this voter record with the voter record that the email_secret_key belongs to
          // console.log("this.voterMergeTwoAccountsByEmailKey -- yes please merge accounts");
          this.voterMergeTwoAccountsByEmailKey(email_secret_key);
        } else {
          // Display the question of whether to merge accounts or not
          // console.log("BEFORE WouldYouLikeToMergeAccountsOld, this.state.email_sign_in_status:", this.state.email_sign_in_status);
          return <WouldYouLikeToMergeAccountsOld
            currentVoterWeVoteId={this.state.voter.we_vote_id}
            mergeIntoVoterWeVoteId={this.state.email_sign_in_status.voter_we_vote_id_from_secret_key}
            emailSecretKey={email_secret_key}
          />;
        }
      } else {
        // Go ahead and merge the accounts, which means deleting the current voter id and switching to the email owner
        // console.log("this.voterMergeTwoAccountsByEmailKey - go ahead");
        this.voterMergeTwoAccountsByEmailKey(email_secret_key);
      }
    } else {
      // console.log("Voter may not be verified yet, redirecting to verfiy page");
      browserHistory.push("/verify_email/" + email_secret_key);
    }
    return LoadingWheel;
  }
}
