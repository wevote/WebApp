import { Component } from "react";
import PropTypes from "prop-types";
import { historyPush } from "../../utils/cordovaUtils";
import LoadingWheel from "../../components/LoadingWheel";
import { renderLog } from "../../utils/logging";
import VoterActions from "../../actions/VoterActions";
import VoterStore from "../../stores/VoterStore";
// This will be needed in the future
// import WouldYouLikeToMergeAccounts from "../../components/WouldYouLikeToMergeAccounts";

// This component allows us to jump from the native apps to WebApp, and preserve the sign in state
export default class SignInJumpProcess extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      incomingVoterDeviceIdBelongsToThisVoter: true, // This is temporary
      jumpPath: "",
      voter: {},
      // yesPleaseMergeAccounts: false,
      // saving: true,
    };
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const incomingVoterDeviceId = this.props.location.query.voter_device_id;
    console.log("SignInJumpProcess, componentDidMount, this.props.location.query.voter_device_id: ", incomingVoterDeviceId);
    // this.voterAnalysisForJumpProcess(incomingVoterDeviceId);
    this.setState({
      incomingVoterDeviceIdBelongsToThisVoter: true, // We want to actually set this in response to voterAnalysisForJumpProcess
      jumpPath: this.props.location.query.jump_path,
      voter: VoterStore.getVoter(),
    });
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
      // incomingVoterDeviceIdBelongsToThisVoter
      // voter_analysis_for_jump_process: VoterStore.getEmailAddressStatus(),
      // email_sign_in_status: VoterStore.getEmailSignInStatus(),
      // saving: false,
    });
  }

  cancelMergeFunction () {
    historyPush({
      pathname: this.state.jumpPath,
      state: {
      },
    });
  }

  voterMergeTwoAccountsByJumpProcess (incomingVoterDeviceId, voter_has_data_to_preserve = true) {
    console.log("voterMergeTwoAccountsByJumpProcess, incomingVoterDeviceId: ", incomingVoterDeviceId, voter_has_data_to_preserve);
    // VoterActions.voterMergeTwoAccountsByJumpProcess(incomingVoterDeviceId);
    historyPush({
      pathname: this.state.jumpPath,
      state: {
        // message: "You have successfully verified and signed in with your email.",
        // message_type: "success"
      },
    });
  }

  voterAnalysisForJumpProcess (incomingVoterDeviceId) {
    VoterActions.voterAnalysisForJumpProcess(incomingVoterDeviceId);
    // this.setState({ saving: true });
  }

  // yesPleaseMergeAccounts () {
  //   this.setState({ yesPleaseMergeAccounts: true });
  // }

  render () {
    renderLog(__filename);
    const incomingVoterDeviceId = this.props.location.query.voter_device_id;
    console.log("SignInJumpProcess, incomingVoterDeviceId:", incomingVoterDeviceId);
    if (!incomingVoterDeviceId ||
      // this.state.saving ||
      !this.state.jumpPath ||
      !this.state.voter) {
      console.log("SignInJumpProcess, render stopped");
      return LoadingWheel;
    }

    // // This process starts when we return from attempting voterAnalysisForJumpProcess
    // if (!this.state.email_sign_in_status.email_address_found) {
    //   console.log("Could not find secret_key - push to /more/sign_in");
    //  historyPush({
    //     pathname: "/more/sign_in",
    //     state: {
    //       message: "Email verification did not work. Please try 'Send Verification Email' again.",
    //       message_type: "danger"
    //     }
    //   });
    //   return LoadingWheel;
    // }

    // if (this.state.yesPleaseMergeAccounts) {
    //   // Go ahead and merge this voter record with the voter record that the email_secret_key belongs to
    //   console.log("this.voterMergeTwoAccountsByJumpProcess incomingVoterDeviceId:", incomingVoterDeviceId);
    //   this.voterMergeTwoAccountsByJumpProcess(incomingVoterDeviceId, this.state.voter.has_data_to_preserve);
    //   // return <span>this.voterMergeTwoAccountsByJumpProcess</span>;
    //   return LoadingWheel;
    // }

    if (this.state.incomingVoterDeviceIdBelongsToThisVoter) {
      // We don't need to do anything more except redirect
      console.log("incoming_voter_device_id owned by this voter - push to jump_to location: ", this.state.jumpPath);
      historyPush({
        pathname: this.state.jumpPath,
        state: {
          // message: "You have successfully verified your email.",
          // message_type: "success"
        },
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
      console.log("this.voterMergeTwoAccountsByJumpProcess - go ahead, incomingVoterDeviceId:", incomingVoterDeviceId);
      this.voterMergeTwoAccountsByJumpProcess(incomingVoterDeviceId, false);
      // return <span>this.voterMergeTwoAccountsByJumpProcess - go ahead</span>;
      return LoadingWheel;
    }
  }
}
