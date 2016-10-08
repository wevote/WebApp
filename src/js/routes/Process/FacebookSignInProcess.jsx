import React, { Component, PropTypes } from "react";
import { browserHistory } from "react-router";
import FacebookActions from "../../actions/FacebookActions";
import FacebookStore from "../../stores/FacebookStore";
import LoadingWheel from "../../components/LoadingWheel";
import VoterActions from "../../actions/VoterActions";
import VoterStore from "../../stores/VoterStore";
import WouldYouLikeToMergeAccounts from "../../components/WouldYouLikeToMergeAccounts";

export default class FacebookSignInProcess extends Component {
  static propTypes = {
    params: PropTypes.object,
    email_secret_key: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = {
      voter: {},
      facebook_auth_response: {},
      facebook_sign_in_status: {},
      creating_account: false,
      saving: false
    };
  }

  componentDidMount () {
    this.facebookStoreListener = FacebookStore.addListener(this._onFacebookStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    this.voterFacebookSignInRetrieve();
    this._onVoterStoreChange();
  }

  componentWillUnmount () {
    this.facebookStoreListener.remove();
    this.voterStoreListener.remove();
  }

  _onFacebookStoreChange () {
    this.setState({
      facebook_auth_response: FacebookStore.getFacebookState(),
      saving: false
    });
  }

  _onVoterStoreChange () {
    let facebook_sign_in_status = VoterStore.getFacebookSignInStatus();
    let local_creating_account;
    if (this.state.creating_account) {
      local_creating_account = true;
      // If already set, don't let creating_account get un-set until facebook_account_created is true
      if (facebook_sign_in_status.facebook_account_created) {
        local_creating_account = false;
      }
    } else {
      local_creating_account = false;
    }

    this.setState({
      voter: VoterStore.getVoter(),
      facebook_sign_in_status: VoterStore.getFacebookSignInStatus(),
      creating_account: local_creating_account,
      saving: false
    });
  }

  voterMergeTwoAccounts (email_secret_key, facebook_secret_key) {
    VoterActions.voterMergeTwoAccounts(email_secret_key, facebook_secret_key);
    this.setState({saving: true});
  }

  voterFacebookSaveToCurrentAccount () {
    VoterActions.voterFacebookSaveToCurrentAccount();
    this.setState({creating_account: true});
  }

  voterFacebookSignInRetrieve () {
    FacebookActions.voterFacebookSignInRetrieve();
    this.setState({saving: true});
  }

  render () {
    let {facebook_auth_response, facebook_sign_in_status} = this.state;
    console.log("FacebookSignInProcess render, this.state.saving:", this.state.saving, ", this.state.creating_account:", this.state.creating_account);
    if (this.state.saving
      || this.state.creating_account
      || !facebook_auth_response
      || !facebook_auth_response.facebook_retrieve_attempted
      || !facebook_sign_in_status ) {
      console.log("facebook_auth_response:", facebook_auth_response);
      console.log("facebook_sign_in_status:", facebook_sign_in_status);
      return LoadingWheel;
    }
    console.log("=== Passed initial gate ===");
    console.log("facebook_auth_response:", facebook_auth_response);
    console.log("facebook_sign_in_status:", facebook_sign_in_status);

    // We redirect after voterMergeTwoAccounts comes back
    if (facebook_sign_in_status.voter_merge_two_accounts_attempted) {
      // console.log("voterMergeTwoAccounts attempted - push to /ballot");
      browserHistory.push("/ballot");
    }

    // We redirect after voterFacebookSaveToCurrentAccount comes back
    if (facebook_sign_in_status.facebook_account_created) {
      console.log("voterFacebookSaveToCurrentAccount - push to /ballot");
      browserHistory.push("/ballot");
    }

    if (facebook_auth_response.facebook_sign_in_failed) {
      // console.log("Facebook sign in failed - push to /more/sign_in");
      browserHistory.push("/more/sign_in");
    }

    // Is there a collision of two accounts?
    let there_are_two_accounts_related_to_this_facebook_account = false;
    if (facebook_auth_response.voter_we_vote_id_attached_to_facebook
      && facebook_auth_response.voter_we_vote_id_attached_to_facebook != ""
      && facebook_auth_response.voter_we_vote_id_attached_to_facebook_email
      && facebook_auth_response.voter_we_vote_id_attached_to_facebook_email != "") {
      // We know we have values for both variables
      if (facebook_auth_response.voter_we_vote_id_attached_to_facebook
        != facebook_auth_response.voter_we_vote_id_attached_to_facebook_email) {
        // TODO Think about what choice (if any) to give the voter if they have two accounts related to Facebook account
        there_are_two_accounts_related_to_this_facebook_account = true;
      }
    }

    let { facebook_secret_key } = facebook_auth_response;
    if (facebook_auth_response.voter_we_vote_id_attached_to_facebook
      && facebook_auth_response.voter_we_vote_id_attached_to_facebook != "") {
        // Is there anything to save from this voter account?
        if (this.state.voter.has_data_to_preserve) {
          // console.log("FacebookSignInProcess, this.state.voter.has_data_to_preserve");
          // If so, ask if they want to connect two accounts?
          if (facebook_auth_response.yes_please_merge_accounts) {
            // Go ahead and merge this voter record with the voter record that the facebook_secret_key belongs to
            // console.log("this.voterMergeTwoAccounts -- yes please merge accounts");
            this.voterMergeTwoAccounts('', facebook_secret_key)
            // return <span>this.voterMergeTwoAccounts('', {facebook_secret_key})</span>;
          } else {
            // Display the question of whether to merge accounts or not
            // console.log("BEFORE WouldYouLikeToMergeAccounts, facebook_sign_in_status:", facebook_sign_in_status);
            return <WouldYouLikeToMergeAccounts
              currentVoterWeVoteId={this.state.voter.we_vote_id}
              mergeIntoVoterWeVoteId={facebook_auth_response.voter_we_vote_id_attached_to_facebook}
              facebookSecretKey={facebook_secret_key}
            />;
          }
        } else {
          // Go ahead and merge the accounts, which means deleting the current voter id and switching to the email owner
          // console.log("FacebookSignInProcess this.voterMergeTwoAccounts - nothing to save, go ahead");
          this.voterMergeTwoAccounts('', facebook_secret_key);
          // return <span>this.voterMergeTwoAccounts('', {facebook_secret_key});</span>;
        }
    } else if (facebook_auth_response.voter_we_vote_id_attached_to_facebook_email
      && facebook_auth_response.voter_we_vote_id_attached_to_facebook_email != "") {
      return <span>You haven't signed in with this Facebook account yet, but you have signed in with your Facebook email.
        Please go back to the Sign In page.</span>
    } else {
      console.log("Setting up new Facebook entry");
      this.voterFacebookSaveToCurrentAccount();
      return <span>Setting up new Facebook entry</span>;
    }
    console.log("Hanging out by last LoadingWheel");
    return LoadingWheel;
  }
}
