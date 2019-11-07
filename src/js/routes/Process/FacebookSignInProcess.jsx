import React, { Component } from 'react';
import AppActions from '../../actions/AppActions';
import cookies from '../../utils/cookies';
import FacebookActions from '../../actions/FacebookActions';
import FacebookStore from '../../stores/FacebookStore';
import { cordovaScrollablePaneTopPadding } from '../../utils/cordovaOffsets';
import { historyPush } from '../../utils/cordovaUtils';
import LoadingWheel from '../../components/LoadingWheel';
import { oAuthLog, renderLog } from '../../utils/logging';
import { stringContains } from '../../utils/textFormat';
import VoterActions from '../../actions/VoterActions';
import VoterStore from '../../stores/VoterStore';

export default class FacebookSignInProcess extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      facebookAuthResponse: {},
      mergingTwoAccounts: false,
      redirectInProgress: false,
      saving: false,
      yesPleaseMergeAccounts: false,
    };
  }

  componentDidMount () {
    this.facebookStoreListener = FacebookStore.addListener(this.onFacebookStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // console.log('FacebookSignInProcess, componentDidMount');
    this.voterFacebookSignInRetrieve();
  }

  componentWillUnmount () {
    this.facebookStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onFacebookStoreChange () {
    // console.log('FacebookSignInProcess onFacebookStoreChange');
    this.setState({
      facebookAuthResponse: FacebookStore.getFacebookAuthResponse(),
      saving: false,
    });
  }

  onVoterStoreChange () {
    const { redirectInProcess } = this.state;
    // console.log('FacebookSignInProcess onVoterStoreChange, redirectInProcess:', redirectInProcess);
    if (!redirectInProcess) {
      const facebookSignInStatus = VoterStore.getFacebookSignInStatus();
      // console.log('facebookSignInStatus:', facebookSignInStatus);
      // console.log('window.location:', window.location);
      const voter = VoterStore.getVoter();
      const { signed_in_facebook: voterIsSignedInFacebook } = voter;
      if (voterIsSignedInFacebook || (facebookSignInStatus && facebookSignInStatus.voter_merge_two_accounts_attempted)) {
        let redirectFullUrl = '';
        let signInStartFullUrl = cookies.getItem('sign_in_start_full_url');
        // console.log('FacebookSignInProcess signInStartFullUrl:', signInStartFullUrl);
        if (signInStartFullUrl && stringContains('facebook_sign_in', signInStartFullUrl)) {
          // Do not support a redirect to facebook_sign_in
          // console.log('FacebookSignInProcess Ignore facebook_sign_in url');
          signInStartFullUrl = null;
        }
        if (signInStartFullUrl) {
          // console.log('FacebookSignInProcess Executing Redirect');
          AppActions.unsetStoreSignInStartFullUrl();
          cookies.removeItem('sign_in_start_full_url', '/');
          cookies.removeItem('sign_in_start_full_url', '/', 'wevote.us');
          redirectFullUrl = signInStartFullUrl;
          // // The Facebook sign in delay isn't as great as Twitter, so this might not be needed.
          // if (!voterHasDataToPreserve) {
          //   redirectFullUrl += '?voter_refresh_timer_on=1';
          // }
          let useWindowLocationAssign = true;
          if (window && window.location && window.location.origin) {
            if (stringContains(window.location.origin, redirectFullUrl)) {
              // Switch to path names to reduce load on browser and API server
              useWindowLocationAssign = false;
              const newRedirectPathname = redirectFullUrl.replace(window.location.origin, '');
              // console.log('newRedirectPathname:', newRedirectPathname);
              this.setState({ redirectInProcess: true });
              historyPush({
                pathname: newRedirectPathname,
                state: {
                  message: 'You have successfully signed in with Facebook.',
                  message_type: 'success',
                },
              });
            } else {
              // console.log('window.location.origin empty');
            }
          }
          if (useWindowLocationAssign) {
            // console.log('useWindowLocationAssign:', useWindowLocationAssign);
            this.setState({ redirectInProcess: true });
            window.location.assign(redirectFullUrl);
          }
        } else {
          this.setState({ redirectInProcess: true });
          const redirectPathname = '/ballot';
          historyPush({
            pathname: redirectPathname,
            // The Facebook sign in delay isn't as great as Twitter, so this might not needed.
            // query: { voter_refresh_timer_on: voterHasDataToPreserve ? 0 : 1 },
            state: {
              message: 'You have successfully signed in with Facebook.',
              message_type: 'success',
            },
          });
        }
      }
    }
  }

  voterMergeTwoAccountsByFacebookKey (facebookSecretKey) { // , voterHasDataToPreserve = true
    // console.log('In voterMergeTwoAccountsByFacebookKey, facebookSecretKey: ', facebookSecretKey, ', voterHasDataToPreserve: ', voterHasDataToPreserve);
    const { mergingTwoAccounts } = this.state;
    if (mergingTwoAccounts) {
      // console.log('Already in process of mergingTwoAccounts');
    } else {
      // console.log('About to make voterMergeTwoAccountsByFacebookKey API call');
      VoterActions.voterMergeTwoAccountsByFacebookKey(facebookSecretKey);
      // Prevent voterMergeTwoAccountsByFacebookKey from being called multiple times
      this.setState({ mergingTwoAccounts: true });
    }
  }

  voterFacebookSaveToCurrentAccount () {
    // console.log('In voterFacebookSaveToCurrentAccount');
    VoterActions.voterFacebookSaveToCurrentAccount();
    // const signInStartFullUrl = cookies.getItem('sign_in_start_full_url');
    // if (signInStartFullUrl) {
    //   AppActions.unsetStoreSignInStartFullUrl();
    //   cookies.removeItem('sign_in_start_full_url', '/');
    //   cookies.removeItem('sign_in_start_full_url', '/', 'wevote.us');
    //   window.location.assign(signInStartFullUrl);
    // } else {
    //   const redirectPathname = '/ballot';
    //   historyPush({
    //     pathname: redirectPathname,
    //     state: {
    //       message: 'You have successfully signed in with Facebook.',
    //       message_type: 'success',
    //     },
    //   });
    // }
  }

  voterFacebookSignInRetrieve () {
    // console.log('FacebookSignInProcess voterFacebookSignInRetrieve');
    if (!this.state.saving) {
      FacebookActions.voterFacebookSignInRetrieve();
      this.setState({ saving: true });
    }
  }

  render () {
    renderLog('FacebookSignInProcess');  // Set LOG_RENDER_EVENTS to log all renders
    const { facebookAuthResponse, mergingTwoAccounts, redirectInProgress, yesPleaseMergeAccounts } = this.state;
    // console.log('FacebookSignInProcess render, redirectInProgress:', redirectInProgress);
    if (redirectInProgress) {
      return null;
    }

    if (this.state.saving ||
      !facebookAuthResponse ||
      !facebookAuthResponse.facebook_retrieve_attempted) {
      // console.log('facebookAuthResponse:', facebookAuthResponse);
      return (
        <div className="facebook_sign_in_root">
          <div className="page-content-container" style={{ paddingTop: `${cordovaScrollablePaneTopPadding()}` }}>
            <div style={{ textAlign: 'center' }}>
              Waiting for response from Facebook...
            </div>
            <div className="u-loading-spinner__wrapper">
              <div className="u-loading-spinner">Please wait...</div>
            </div>
          </div>
        </div>
      );
    }
    // console.log('=== Passed initial gate ===');
    // console.log('facebookAuthResponse:', facebookAuthResponse);
    const { facebook_secret_key: facebookSecretKey } = facebookAuthResponse;

    if (facebookAuthResponse.facebook_sign_in_failed) {
      // console.log('Facebook sign in failed - push to /settings/account');
      this.setState({ redirectInProcess: true });
      historyPush({
        pathname: '/settings/account',
        state: {
          message: 'Facebook sign in failed. Please try again.',
          message_type: 'success',
        },
      });
      return LoadingWheel;
    }

    if (yesPleaseMergeAccounts) {
      // Go ahead and merge this voter record with the voter record that the facebookSecretKey belongs to
      oAuthLog('this.voterMergeTwoAccountsByFacebookKey -- yes please merge accounts');
      this.voterMergeTwoAccountsByFacebookKey(facebookSecretKey);
      return LoadingWheel;
    }

    // This process starts when we return from attempting voterFacebookSignInRetrieve
    // If facebook_sign_in_found NOT True, go back to the sign in page to try again
    if (!facebookAuthResponse.facebook_sign_in_found) {
      // console.log('facebookAuthResponse.facebook_sign_in_found', facebookAuthResponse.facebook_sign_in_found);
      this.setState({ redirectInProcess: true });
      oAuthLog('facebookAuthResponse.facebook_sign_in_found', facebookAuthResponse.facebook_sign_in_found);
      historyPush({
        pathname: '/settings/account',
        state: {
          message: 'Facebook authentication not found. Please try again.',
          message_type: 'warning',
        },
      });
      return LoadingWheel;
    }

    // Is there a collision of two accounts?
    if (facebookAuthResponse.existing_facebook_account_found) {
      // For now are not asking to merge accounts
      // console.log('FacebookSignInProcess facebookAuthResponse.existing_facebook_account_found');
      if (!mergingTwoAccounts) {
        this.voterMergeTwoAccountsByFacebookKey(facebookSecretKey); // , facebookAuthResponse.voter_has_data_to_preserve
      }
      return (
        <div className="facebook_sign_in_root">
          <div className="page-content-container" style={{ paddingTop: `${cordovaScrollablePaneTopPadding()}` }}>
            <div style={{ textAlign: 'center' }}>
              Loading your account...
            </div>
            <div className="u-loading-spinner__wrapper">
              <div className="u-loading-spinner">Please wait...</div>
            </div>
          </div>
        </div>
      );
    } else {
      oAuthLog('Setting up new Facebook entry - voterFacebookSaveToCurrentAccount');
      this.voterFacebookSaveToCurrentAccount();
      return LoadingWheel;
    }
  }
}
