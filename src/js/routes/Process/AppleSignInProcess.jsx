import React, { Component } from 'react';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import cookies from '../../utils/cookies';
import { cordovaScrollablePaneTopPadding } from '../../utils/cordovaOffsets';
import { historyPush, isWebApp } from '../../utils/cordovaUtils';
import LoadingWheel from '../../components/LoadingWheel';
import { oAuthLog, renderLog } from '../../utils/logging';
import { stringContains } from '../../utils/textFormat';
import TwitterActions from '../../actions/TwitterActions';
import TwitterStore from '../../stores/TwitterStore';
import VoterStore from '../../stores/VoterStore';
import VoterActions from '../../actions/VoterActions';

export default class AppleSignInProcess extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      hostname: '',
      mergingTwoAccounts: false,
      redirectInProgress: false,
      twitterAuthResponse: {},
      yesPleaseMergeAccounts: false,
    };
  }

  componentDidMount () {
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.twitterStoreListener = TwitterStore.addListener(this.onTwitterStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.twitterSignInRetrieve();
    const hostname = AppStore.getHostname();
    this.setState({
      hostname,
    });
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
    this.twitterStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppStoreChange () {
    const hostname = AppStore.getHostname();
    this.setState({
      hostname,
    });
  }

  onTwitterStoreChange () {
    this.setState({
      twitterAuthResponse: TwitterStore.getTwitterAuthResponse(),
    });
  }

  onVoterStoreChange () {
    const { redirectInProcess } = this.state;
    // console.log('AppleSignInProcess onVoterStoreChange, redirectInProcess:', redirectInProcess);
    if (!redirectInProcess) {
      const twitterSignInStatus = VoterStore.getTwitterSignInStatus();
      // console.log('twitterSignInStatus:', twitterSignInStatus);
      const voter = VoterStore.getVoter();
      const { signed_in_twitter: voterIsSignedInTwitter } = voter;
      if (voterIsSignedInTwitter || (twitterSignInStatus && twitterSignInStatus.voter_merge_two_accounts_attempted)) {
        // Once the Twitter merge returns successfully, redirect to starting page
        let redirectFullUrl = '';
        let signInStartFullUrl = cookies.getItem('sign_in_start_full_url');
        // console.log('AppleSignInProcess signInStartFullUrl:', signInStartFullUrl);
        if (signInStartFullUrl && stringContains('twitter_sign_in', signInStartFullUrl)) {
          // Do not support a redirect to facebook_sign_in
          // console.log('AppleSignInProcess Ignore facebook_sign_in url');
          signInStartFullUrl = null;
        }
        if (signInStartFullUrl) {
          // console.log('AppleSignInProcess Executing Redirect');
          AppActions.unsetStoreSignInStartFullUrl();
          cookies.removeItem('sign_in_start_full_url', '/');
          cookies.removeItem('sign_in_start_full_url', '/', 'wevote.us');
          redirectFullUrl = signInStartFullUrl;
          // if (!voterHasDataToPreserve) {
          //   redirectFullUrl += '?voter_refresh_timer_on=1';
          // }
          let useWindowLocationAssign = true;
          if (window && window.location && window.location.origin) {
            if (stringContains(window.location.origin, redirectFullUrl)) {
              // Switch to path names to reduce load on browser and API server
              useWindowLocationAssign = false;
              const newRedirectPathname = isWebApp() ? redirectFullUrl.replace(window.location.origin, '') : '/ballot';
              // console.log('newRedirectPathname:', newRedirectPathname);
              this.setState({ redirectInProcess: true });
              oAuthLog(`Twitter sign in (1), onVoterStoreChange - push to ${newRedirectPathname}`);

              historyPush({
                pathname: newRedirectPathname,
                state: {
                  message: 'You have successfully signed in with Twitter.',
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
          oAuthLog(`Twitter sign in (2), onVoterStoreChange - push to ${redirectPathname}`);
          historyPush({
            pathname: redirectPathname,
            // query: {voter_refresh_timer_on: voterHasDataToPreserve ? 0 : 1},
            state: {
              message: 'You have successfully signed in with Twitter.',
              message_type: 'success',
            },
          });
        }
      }
    }
  }

  voterMergeTwoAccountsByTwitterKey (twitterSecretKey) {  // , voterHasDataToPreserve = true
    const { mergingTwoAccounts } = this.state;
    if (mergingTwoAccounts) {
      // console.log('In process of mergingTwoAccounts');
    } else {
      // console.log('About to make voterMergeTwoAccountsByTwitterKey API call');
      VoterActions.voterMergeTwoAccountsByTwitterKey(twitterSecretKey);
      // Prevent voterMergeTwoAccountsByFacebookKey from being called multiple times
      this.setState({ mergingTwoAccounts: true });
    }
  }

  // This creates the public.twitter_twitterlinktovoter entry, which is needed
  // to establish is_signed_in within the voter.voter
  voterTwitterSaveToCurrentAccount () {
    // console.log('voterTwitterSaveToCurrentAccount');
    VoterActions.voterTwitterSaveToCurrentAccount();
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
    //       message: 'You have successfully signed in with Twitter.',
    //       message_type: 'success',
    //     },
    //   });
    // }
    if (VoterStore.getVoterPhotoUrlMedium().length === 0) {
      // This only fires once, for brand new users on their very first login
      VoterActions.voterRetrieve();
    }
  }

  twitterSignInRetrieve () {
    TwitterActions.twitterSignInRetrieve();
  }

  render () {
    renderLog('AppleSignInProcess');  // Set LOG_RENDER_EVENTS to log all renders
    const { hostname, mergingTwoAccounts, redirectInProgress, twitterAuthResponse, yesPleaseMergeAccounts } = this.state;
    // console.log('AppleSignInProcess render, redirectInProgress:', redirectInProgress);
    if (redirectInProgress || !hostname || hostname === '') {
      return null;
    }

    oAuthLog('AppleSignInProcess render');
    if (!twitterAuthResponse ||
      !twitterAuthResponse.twitter_retrieve_attempted) {
      oAuthLog('STOPPED, missing twitter_retrieve_attempted: twitterAuthResponse:', twitterAuthResponse);
      return (
        <div className="twitter_sign_in_root">
          <div className="page-content-container" style={{ paddingTop: `${cordovaScrollablePaneTopPadding()}` }}>
            <div style={{ textAlign: 'center' }}>
              Waiting for response from Twitter...
            </div>
            <div className="u-loading-spinner__wrapper">
              <div className="u-loading-spinner">Please wait...</div>
            </div>
          </div>
        </div>
      );
    }
    oAuthLog('=== Passed initial gate === with twitterAuthResponse: ', twitterAuthResponse);
    const { twitter_secret_key: twitterSecretKey } = twitterAuthResponse;

    if (twitterAuthResponse.twitter_sign_in_failed) {
      oAuthLog('Twitter sign in failed - push to /settings/account');
      this.setState({ redirectInProcess: true });
      historyPush({
        pathname: '/settings/account',
        state: {
          message: 'Twitter sign in failed. Please try again.',
          message_type: 'success',
        },
      });
      return LoadingWheel;
    }

    if (yesPleaseMergeAccounts) {
      // Go ahead and merge this voter record with the voter record that the twitterSecretKey belongs to
      oAuthLog('this.voterMergeTwoAccountsByTwitterKey -- yes please merge accounts');
      this.voterMergeTwoAccountsByTwitterKey(twitterSecretKey);
      return LoadingWheel;
    }

    // This process starts when we return from attempting voterTwitterSignInRetrieve
    // If twitter_sign_in_found NOT True, go back to the sign in page to try again
    if (!twitterAuthResponse.twitter_sign_in_found) {
      this.setState({ redirectInProcess: true });
      oAuthLog('twitterAuthResponse.twitter_sign_in_found', twitterAuthResponse.twitter_sign_in_found);
      historyPush({
        pathname: '/settings/account',
        state: {
          message: 'Twitter authentication not found. Please try again.',
          message_type: 'warning',
        },
      });
      return LoadingWheel;
    }

    // Is there a collision of two accounts?
    if (twitterAuthResponse.existing_twitter_account_found) {
      // For now are not asking to merge accounts
      if (!mergingTwoAccounts) {
        oAuthLog('twitterAuthResponse voterMergeTwoAccountsByTwitterKey');
        this.voterMergeTwoAccountsByTwitterKey(twitterSecretKey);  // , twitterAuthResponse.voter_has_data_to_preserve
      } else {
        oAuthLog('twitterAuthResponse NOT CALLING voterMergeTwoAccountsByTwitterKey');
      }
      return (
        <div className="twitter_sign_in_root">
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
      oAuthLog('Setting up new Twitter entry - voterTwitterSaveToCurrentAccount');
      this.voterTwitterSaveToCurrentAccount();
      return LoadingWheel;
    }
  }
}
