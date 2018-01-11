import React, { Component, PropTypes } from "react";
import { browserHistory } from "react-router";
import LoadingWheel from "../../components/LoadingWheel";
import VoterActions from "../../actions/VoterActions";
import VoterStore from "../../stores/VoterStore";
import WouldYouLikeToMergeAccounts from "../../components/WouldYouLikeToMergeAccounts";

// This component allows us to jump from the native apps to WebApp, and preserve the sign in state
// TODO DALE: Is a work in progress
export default class SignInJumpProcess extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      incoming_voter_device_id_belongs_to_this_voter: true, // This is temporary
      jump_path: "",
      voter: {},
      yes_please_merge_accounts: false,
      saving: true
    };
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    let incoming_voter_device_id = this.props.location.query.voter_device_id;
    console.log("SignInJumpProcess, componentDidMount, this.props.location.query.voter_device_id: ", incoming_voter_device_id);
    // this.voterAnalysisForJumpProcess(incoming_voter_device_id);
    this.setState({
      incoming_voter_device_id_belongs_to_this_voter: true, // We want to actually set this in response to voterAnalysisForJumpProcess
      jump_path: this.props.location.query.jump_path,
      voter: VoterStore.getVoter(),
    })
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  cancelMergeFunction () {
    browserHistory.push({
      pathname: this.state.jump_path,
      state: {
      }
    });
  }

  _onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
      // incoming_voter_device_id_belongs_to_this_voter
      // voter_analysis_for_jump_process: VoterStore.getEmailAddressStatus(),
      // email_sign_in_status: VoterStore.getEmailSignInStatus(),
      saving: false
    });
  }

  voterMergeTwoAccountsByJumpProcess (incoming_voter_device_id, voter_has_data_to_preserve = true) {
    console.log("voterMergeTwoAccountsByJumpProcess, incoming_voter_device_id: ", incoming_voter_device_id);
    // VoterActions.voterMergeTwoAccountsByJumpProcess(incoming_voter_device_id);
    browserHistory.push({
      pathname: this.state.jump_path,
      state: {
        // message: "You have successfully verified and signed in with your email.",
        // message_type: "success"
      }
    });
  }
  voterAnalysisForJumpProcess (incoming_voter_device_id) {
    VoterActions.voterAnalysisForJumpProcess(incoming_voter_device_id);
    this.setState({saving: true});
  }

  yesPleaseMergeAccounts () {
    this.setState({yes_please_merge_accounts: true});
  }

  render () {
    let incoming_voter_device_id = this.props.location.query.voter_device_id;
    console.log("SignInJumpProcess, incoming_voter_device_id:", incoming_voter_device_id);
    if (!incoming_voter_device_id ||
      // this.state.saving ||
      !this.state.jump_path ||
      !this.state.voter) {
      console.log("SignInJumpProcess, render stopped");
      return LoadingWheel;
    }

    // // This process starts when we return from attempting voterAnalysisForJumpProcess
    // if (!this.state.email_sign_in_status.email_address_found) {
    //   console.log("Could not find secret_key - push to /more/sign_in");
    //   browserHistory.push({
    //     pathname: "/more/sign_in",
    //     state: {
    //       message: "Email verification did not work. Please try 'Send Verification Email' again.",
    //       message_type: "danger"
    //     }
    //   });
    //   return LoadingWheel;
    // }

    // if (this.state.yes_please_merge_accounts) {
    //   // Go ahead and merge this voter record with the voter record that the email_secret_key belongs to
    //   console.log("this.voterMergeTwoAccountsByJumpProcess incoming_voter_device_id:", incoming_voter_device_id);
    //   this.voterMergeTwoAccountsByJumpProcess(incoming_voter_device_id, this.state.voter.has_data_to_preserve);
    //   // return <span>this.voterMergeTwoAccountsByJumpProcess</span>;
    //   return LoadingWheel;
    // }

    if (this.state.incoming_voter_device_id_belongs_to_this_voter) {
      // We don't need to do anything more except redirect
      console.log("incoming_voter_device_id owned by this voter - push to jump_to location: ", this.state.jump_path);
      browserHistory.push({
        pathname: this.state.jump_path,
        state: {
          // message: "You have successfully verified your email.",
          // message_type: "success"
        }
      });
      return LoadingWheel;
    // } else if (this.state.voter.has_data_to_preserve) {
    //   // If so, ask if they want to connect two accounts?
    //   console.log("SignInJumpProcess this.state.voter.has_data_to_preserve:", this.state.voter.has_data_to_preserve);
    //   // Display the question of whether to merge accounts or not
    //   const cancel_merge_function = this.cancelMergeFunction.bind(this);
    //   const please_merge_accounts_function = this.yesPleaseMergeAccounts.bind(this);
    //   // Display the question of whether to merge accounts or not
    //   return <WouldYouLikeToMergeAccounts cancelMergeFunction={cancel_merge_function}
    //                                       pleaseMergeAccountsFunction={please_merge_accounts_function} />;
    //   //return <span>WouldYouLikeToMergeAccounts</span>;
    } else {
      // Go ahead and merge the accounts, which means deleting the current voter id and switching to the email owner
      console.log("this.voterMergeTwoAccountsByJumpProcess - go ahead, incoming_voter_device_id:", incoming_voter_device_id);
      this.voterMergeTwoAccountsByJumpProcess(incoming_voter_device_id, false);
      // return <span>this.voterMergeTwoAccountsByJumpProcess - go ahead</span>;
      return LoadingWheel;
    }
  }
}
