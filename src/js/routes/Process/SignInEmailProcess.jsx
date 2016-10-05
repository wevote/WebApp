import React, { Component, PropTypes } from "react";
import { browserHistory } from "react-router";
import LoadingWheel from "../../components/LoadingWheel";
import VoterActions from "../../actions/VoterActions";
import VoterStore from "../../stores/VoterStore";

export default class SignInEmailProcess extends Component {
  static propTypes = {
    params: PropTypes.object,
    email_secret_key: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = {
      voter: VoterStore.getVoter(),
      yes_please_merge_accounts: false,
      saving: false
    };
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    let { email_secret_key } = this.props.params;
    console.log("SignInEmailProcess, componentDidMount, this.props.params.email_secret_key: ", email_secret_key);
    this.voterEmailAddressSignIn(email_secret_key);
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
      email_address_status: VoterStore.getEmailAddressStatus(),
      saving: false
    });
  }

  voterMergeTwoAccounts (current_voter_device_id, email_secret_key) {
    VoterActions.voterMergeTwoAccounts(current_voter_device_id, email_secret_key);
    this.setState({saving: true});
  }

  voterEmailAddressSignIn (email_secret_key) {
    VoterActions.voterEmailAddressSignIn(email_secret_key);
    this.setState({saving: true});
  }

  render () {
    let { email_secret_key } = this.props.params;
    console.log("VerifyEmailProcess, email_secret_key:", email_secret_key);
    if (!email_secret_key || this.state.saving || !this.state.email_address_status) {
      return LoadingWheel;
    }

    // This process starts when we return from attempting voterEmailAddressSignIn
    if (!this.state.email_address_status.email_address_found) {
      console.log("Could not find secret_key - push to /more/sign_in");
      browserHistory.push("/more/sign_in");
    }

    let current_voter_device_id = VoterStore.voterDeviceId();
    if (this.state.email_address_status.email_ownership_is_verified) {
      if (this.state.email_address_status.email_secret_key_belongs_to_this_voter) {
        // We don't need to do anything more except redirect to the email management page
        console.log("secret key owned by this voter - push to /more/sign_in");
        browserHistory.push("/more/sign_in");
      } else {
        //return <div>The email link you clicked comes from an email that belongs to another We Vote account.
        //  Perhaps you used We Vote from another browser?</div>;

        // Is there anything to save from this voter account?
        // if (this.state.voter.has_data_to_preserve) {
        //   // If so, ask if they want to connect two accounts?
        //   if (this.state.yes_please_merge_accounts) {
            // Go ahead and merge this voter record with the voter record that the email_secret_key belongs to
            console.log("this.voterMergeTwoAccounts");
            //this.voterMergeTwoAccounts(current_voter_device_id, this.state.email_secret_key)
            return <span>this.voterMergeTwoAccounts</span>;
        //     // return LoadingWheel;
        //   } else {
        //     // Display the question of whether to merge accounts or not
        //     //return <WouldYouLikeToMergeAccounts />;
        //     return <span>WouldYouLikeToMergeAccounts</span>;
        //   }
        // } else {
        //   // Go ahead and merge the accounts, which means deleting the current voter id and switching to the email owner
        //   console.log("this.voterMergeTwoAccounts - go ahead");
        //   this.voterMergeTwoAccounts(current_voter_device_id, this.state.email_secret_key);
        //   return <span>this.voterMergeTwoAccounts - go ahead</span>;
        //   // return LoadingWheel;
        // }
      }
    }
    return LoadingWheel;
  }
}
