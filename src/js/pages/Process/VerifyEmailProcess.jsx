import PropTypes from 'prop-types';
import { Component } from 'react';
import VoterActions from '../../actions/VoterActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import AppObservableStore from '../../common/stores/AppObservableStore';
import VoterStore from '../../stores/VoterStore';
import historyPush from '../../common/utils/historyPush';
import Cookies from '../../common/utils/js-cookie/Cookies';
import { renderLog } from '../../common/utils/logging';

export default class VerifyEmailProcess extends Component {
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
    const { match: { params: { email_secret_key: emailSecretKey } } } = this.props;
    console.log('VerifyEmailProcess, componentDidMount, this.match.props.params.email_secret_key: ', emailSecretKey);
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
  //   // severity: "success"
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
    let redirectFullUrl = '';
    let redirectPathname = '';
    const signInStartFullUrl = Cookies.get('sign_in_start_full_url');
    if (signInStartFullUrl) {
      AppObservableStore.unsetStoreSignInStartFullUrl();
      Cookies.remove('sign_in_start_full_url', { path: '/' });
      Cookies.remove('sign_in_start_full_url', { path: '/', domain: 'wevote.us' });
      redirectFullUrl = signInStartFullUrl;
      // The Email sign in delay isn't as great as Twitter, so this isn't needed.
      // if (!voterHasDataToPreserve) {
      //   redirectFullUrl += '?voter_refresh_timer_on=1';
      // }
      window.location.assign(redirectFullUrl);
    } else {
      let message;
      if (voterHasDataToPreserve) {
        message = 'Your have signed in with email.';
        redirectPathname = '/settings/account';
      } else {
        message = 'You have successfully verified and signed in with your email.';
        redirectPathname = '/ballot';
      }
      historyPush({
        pathname: redirectPathname,   // SnackNotifier that handles this is in SettingsDashboard and Ballot
        // The Email sign in delay isn't as great as Twitter, so this isn't needed.
        // query: { voter_refresh_timer_on: voterHasDataToPreserve ? 0 : 1 },
        state: {
          message,
          severity: 'success',
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
    renderLog('VerifyEmailProcess');  // Set LOG_RENDER_EVENTS to log all renders
    const { match: { params: { email_secret_key: emailSecretKey } } } = this.props;
    console.log('VerifyEmailProcess, emailSecretKey:', emailSecretKey);
    if (!emailSecretKey ||
      this.state.saving ||
      !this.state.emailSignInStatus ||
      !this.state.emailSignInStatus.email_sign_in_attempted ||
      !this.state.voter) {
      return LoadingWheel;
    }

    // This process starts when we return from attempting voterEmailAddressVerify
    if (!this.state.emailSignInStatus.email_address_found) {
      console.log('Could not find secret_key - push to /settings/account');
      historyPush({
        pathname: '/settings/account',  // SnackNotifier that handles this is in SettingsDashboard
        state: {
          message: "Email verification did not work. Please try 'Send Verification Email' again.",
          severity: 'warning',
        },
      });
      return LoadingWheel;
    }

    if (this.state.yesPleaseMergeAccounts) {
      // Go ahead and merge this voter record with the voter record that the emailSecretKey belongs to
      console.log('this.voterMergeTwoAccountsByEmailKey emailSecretKey:', emailSecretKey);
      const { has_data_to_preserve: hasDataToPreserve } = this.state.voter;
      this.voterMergeTwoAccountsByEmailKey(emailSecretKey, hasDataToPreserve);
      // return <span>this.voterMergeTwoAccountsByEmailKey</span>;
      return LoadingWheel;
    }

    if (!this.state.emailSignInStatus.email_ownership_is_verified) {
      console.log('email_ownership_is_verified not true - push to /settings/account');
      historyPush({
        pathname: '/settings/account',  // SnackNotifier that handles this is in SettingsDashboard
      });
      return LoadingWheel;
    }

    if (this.state.emailSignInStatus.email_secret_key_belongs_to_this_voter) {
      // We don't need to do anything more except redirect
      // console.log('secret key owned by this voter - push to /ballot');
      let redirectFullUrl = '';
      const signInStartFullUrl = Cookies.get('sign_in_start_full_url');
      if (signInStartFullUrl) {
        AppObservableStore.unsetStoreSignInStartFullUrl();
        Cookies.remove('sign_in_start_full_url', { path: '/' });
        Cookies.remove('sign_in_start_full_url', { path: '/', domain: 'wevote.us' });
        redirectFullUrl = signInStartFullUrl;
        // The Email sign in delay isn't as great as Twitter, so this isn't needed.
        // if (!voterHasDataToPreserve) {
        //   redirectFullUrl += '?voter_refresh_timer_on=1';
        // }
        window.location.assign(redirectFullUrl);
      } else {
        historyPush({
          pathname: '/ballot',  // SnackNotifier that handles this is in Ballot
          // The Email sign in delay isn't as great as Twitter, so this isn't needed.
          // query: { voter_refresh_timer_on: voterHasDataToPreserve ? 0 : 1 },
          state: {
            message: 'You have successfully verified your email.',
            severity: 'success',
          },
        });
      }
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
      console.log('this.voterMergeTwoAccountsByEmailKey - go ahead, emailSecretKey:', emailSecretKey);
      this.voterMergeTwoAccountsByEmailKey(emailSecretKey, false);
      // return <span>this.voterMergeTwoAccountsByEmailKey - go ahead</span>;
      return LoadingWheel;
    }
  }
}
VerifyEmailProcess.propTypes = {
  match: PropTypes.object,
  email_secret_key: PropTypes.string,
};
