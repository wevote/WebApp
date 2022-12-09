import PropTypes from 'prop-types';
import React, { Component } from 'react';
import VoterActions from '../../actions/VoterActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import WouldYouLikeToMergeAccountsOld from '../../components/WouldYouLikeToMergeAccountsOld';
import AppObservableStore from '../../common/stores/AppObservableStore';
import VoterStore from '../../stores/VoterStore';
import historyPush from '../../common/utils/historyPush';
import Cookies from '../../common/utils/js-cookie/Cookies';
import { oAuthLog, renderLog } from '../../common/utils/logging';

export default class SignInEmailProcess extends Component {
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
    const { match: { params: { email_secret_key: emailSecretKey } } } = this.props;
    oAuthLog('SignInEmailProcess, componentDidMount, this.props.params.emailSecretKey: ', emailSecretKey);
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
    renderLog('SignInEmailProcess');  // Set LOG_RENDER_EVENTS to log all renders
    const { match: { params: { email_secret_key: emailSecretKey } } } = this.props;
    const voterIsSignedIn = this.state.voter && this.state.voter.is_signed_in;
    oAuthLog('SignInEmailProcess, emailSecretKey:', emailSecretKey);
    if (!emailSecretKey ||
      this.state.saving ||
      !this.state.emailSignInStatus ||
      !this.state.emailSignInStatus.email_sign_in_attempted) {
      oAuthLog('this.state.emailSignInStatus:', this.state.emailSignInStatus);
      return LoadingWheel;
    }

    let redirectFullUrl = '';
    const signInStartFullUrl = Cookies.get('sign_in_start_full_url');

    // We redirect after voterMergeTwoAccountsByEmailKey comes back
    if (this.state.emailSignInStatus.voter_merge_two_accounts_attempted) {
      oAuthLog('voterMergeTwoAccountsByEmailKey attempted - push to /settings/account');
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
            message: 'You have successfully signed in.',
            severity: 'success',
          },
        });
      }
      return LoadingWheel;
    }

    // This process starts when we return from attempting voterEmailAddressSignIn
    if (!this.state.emailSignInStatus.email_address_found) {
      oAuthLog('Could not find secret_key in database - push to /settings/account');
      if (voterIsSignedIn) {
        // Key isn't found in database, but they are already signed in and are
        //  probably following a link in their email that has already been used
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
            pathname: '/settings/account',    // SnackNotifier that handles this is in SettingsDashboard
            // The Email sign in delay isn't as great as Twitter, so this isn't needed.
            // query: { voter_refresh_timer_on: voterHasDataToPreserve ? 0 : 1 },
            state: {
              message: 'You have successfully signed in.',
              severity: 'success',
            },
          });
        }
      } else {
        AppObservableStore.unsetStoreSignInStartFullUrl();
        Cookies.remove('sign_in_start_full_url', { path: '/' });
        Cookies.remove('sign_in_start_full_url', { path: '/', domain: 'wevote.us' });
        historyPush({
          pathname: '/settings/account',  // SnackNotifier that handles this is in SettingsDashboard
          state: {
            message: 'Could not find your email key code in the database.',
            severity: 'error',
          },
        });
      }
      return LoadingWheel;
    }

    if (this.state.emailSignInStatus.email_ownership_is_verified) {
      // If here we know that the secret key was valid
      if (this.state.emailSignInStatus.email_secret_key_belongs_to_this_voter) {
        // We don't need to do anything more except redirect to the email management page
        oAuthLog('secret key owned by this voter - push to /settings/account');
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
            pathname: '/ballot',
            // The Email sign in delay isn't as great as Twitter, so this isn't needed.
            // query: { voter_refresh_timer_on: voterHasDataToPreserve ? 0 : 1 },
            state: {
              message: 'You have successfully signed in.',
              severity: 'success',
            },
          });
        }
        return LoadingWheel;
      } else if (this.state.voter.has_data_to_preserve) {
        // console.log("this.state.voter.has_data_to_preserve");
        // If so, ask if they want to connect two accounts?
        if (this.state.emailSignInStatus.yes_please_merge_accounts) {
          // Go ahead and merge this voter record with the voter record that the emailSecretKey belongs to
          oAuthLog('this.voterMergeTwoAccountsByEmailKey -- yes please merge accounts');
          this.voterMergeTwoAccountsByEmailKey(emailSecretKey);
        } else {
          // Display the question of whether to merge accounts or not
          oAuthLog('BEFORE WouldYouLikeToMergeAccountsOld, this.state.emailSignInStatus:', this.state.emailSignInStatus);
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
      oAuthLog('Voter may not be verified yet, redirecting to verify page');
      historyPush(`/verify_email/${emailSecretKey}`);
    }

    return LoadingWheel;
  }
}
SignInEmailProcess.propTypes = {
  match: PropTypes.object,
  email_secret_key: PropTypes.string,
};
