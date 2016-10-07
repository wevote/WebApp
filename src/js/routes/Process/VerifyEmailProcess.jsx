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

  _onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
      email_address_status: VoterStore.getEmailAddressStatus(),
      email_sign_in_status: VoterStore.getEmailSignInStatus(),
      saving: false
    });
  }

  voterMergeTwoAccounts (email_secret_key) {
    VoterActions.voterMergeTwoAccounts(email_secret_key);
    this.setState({saving: true});
  }
  voterEmailAddressVerify (email_secret_key) {
    VoterActions.voterEmailAddressVerify(email_secret_key);
    this.setState({saving: true});
  }

  render () {
    let { email_secret_key } = this.props.params;
    console.log("VerifyEmailProcess, email_secret_key:", email_secret_key);
    console.log("VerifyEmailProcess, email_secret_key:", email_secret_key);
    if (!email_secret_key
      || this.state.saving
      || !this.state.email_address_status
      || !this.state.email_address_status.email_verify_attempted) {
      return LoadingWheel;
    }

    // This process starts when we return from attempting voterEmailAddressVerify
    if (!this.state.email_address_status.email_address_found) {
      console.log("Could not find secret_key - push to /ballot");
      browserHistory.push("/ballot");
    }

    if (this.state.email_address_status.email_ownership_is_verified) {
      if (this.state.email_address_status.email_secret_key_belongs_to_this_voter) {
        // We don't need to do anything more except redirect
        console.log("secret key owned by this voter - push to /ballot");
        browserHistory.push("/ballot");
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
        //   this.voterMergeTwoAccounts(email_secret_key);
        //   return <span>this.voterMergeTwoAccounts - go ahead</span>;
        //   // return LoadingWheel;
        // }
      }
    }
    return LoadingWheel;
  }
}
