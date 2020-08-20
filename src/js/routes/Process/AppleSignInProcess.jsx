import React, { Component } from 'react';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import cookies from '../../utils/cookies';
import { cordovaScrollablePaneTopPadding } from '../../utils/cordovaOffsets';
import { historyPush, isWebApp } from '../../utils/cordovaUtils';
import { oAuthLog, renderLog } from '../../utils/logging';
import { stringContains } from '../../utils/textFormat';
import VoterStore from '../../stores/VoterStore';

export default class AppleSignInProcess extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      hostname: '',
      redirectInProgress: false,
      voterWeVoteId: '',
    };
  }

  componentDidMount () {
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const hostname = AppStore.getHostname();
    const voter = VoterStore.getVoter();
    const { we_vote_id: voterWeVoteId } = voter;
    this.setState({
      hostname,
      voterWeVoteId,
    });
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppStoreChange () {
    const hostname = AppStore.getHostname();
    this.setState({
      hostname,
    });
  }

  onVoterStoreChange () {
    const { redirectInProcess, voterWeVoteId } = this.state;
    // console.log('AppleSignInProcess onVoterStoreChange, redirectInProcess:', redirectInProcess);
    if (!redirectInProcess) {
      // console.log('twitterSignInStatus:', twitterSignInStatus);
      const voter = VoterStore.getVoter();
      if (!voterWeVoteId) {
        const { we_vote_id: voterWeVoteIdFromVoter } = voter;
        this.setState({
          voterWeVoteId: voterWeVoteIdFromVoter,
        });
      }
      const { signed_in_with_apple: voterIsSignedInWithApple } = voter;
      this.setState({
        voterIsSignedInWithApple,
      });
      if (voterIsSignedInWithApple) {
        // Once the voter data returns successfully, redirect to starting page
        let redirectFullUrl = '';
        let signInStartFullUrl = cookies.getItem('sign_in_start_full_url');
        // console.log('AppleSignInProcess signInStartFullUrl:', signInStartFullUrl);
        if (signInStartFullUrl && stringContains('applesigninprocess', signInStartFullUrl)) {
          // Do not support a redirect to applesigninprocess
          signInStartFullUrl = null;
        }
        if (signInStartFullUrl) {
          // console.log('AppleSignInProcess Executing Redirect');
          AppActions.unsetStoreSignInStartFullUrl();
          cookies.removeItem('sign_in_start_full_url', '/');
          cookies.removeItem('sign_in_start_full_url', '/', 'wevote.us');
          redirectFullUrl = signInStartFullUrl;
          let useWindowLocationAssign = true;
          if (window && window.location && window.location.origin) {
            if (stringContains(window.location.origin, redirectFullUrl)) {
              // Switch to path names to reduce load on browser and API server
              useWindowLocationAssign = false;
              const newRedirectPathname = isWebApp() ? redirectFullUrl.replace(window.location.origin, '') : '/ballot';
              // console.log('newRedirectPathname:', newRedirectPathname);
              this.setState({ redirectInProcess: true });
              oAuthLog(`Apple sign in (1), onVoterStoreChange - push to ${newRedirectPathname}`);

              historyPush({
                pathname: newRedirectPathname,
                state: {
                  message: 'You have successfully signed in with Apple.',
                  message_type: 'success',
                },
              });
            } else {
              console.log('window.location.origin empty');
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
          oAuthLog(`Apple sign in (2), onVoterStoreChange - push to ${redirectPathname}`);
          historyPush({
            pathname: redirectPathname,
            // query: {voter_refresh_timer_on: voterHasDataToPreserve ? 0 : 1},
            state: {
              message: 'You have successfully signed in with your Apple Id.',
              message_type: 'success',
            },
          });
        }
      }
    }
  }

  render () {
    renderLog('AppleSignInProcess');  // Set LOG_RENDER_EVENTS to log all renders
    const { hostname, redirectInProgress, voterIsSignedInWithApple, voterWeVoteId } = this.state;
    // console.log('AppleSignInProcess render, redirectInProgress:', redirectInProgress);
    if (redirectInProgress || !hostname || hostname === '' || !voterWeVoteId) {
      return null;
    }

    oAuthLog('AppleSignInProcess render');
    if (!voterIsSignedInWithApple) {
      oAuthLog('STOPPED, voterIsSignedInWithApple is FALSE');
      return (
        <div className="apple_sign_in_root">
          <div className="page-content-container" style={{ paddingTop: `${cordovaScrollablePaneTopPadding()}` }}>
            <div style={{ textAlign: 'center' }}>
              Apple Sign in did not work for some reason.
              <br />
              <br />
              Please try again, or contact us using the &apos;Help&apos; icon below.
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="apple_sign_in_waiting_root">
        <div className="page-content-container" style={{ paddingTop: `${cordovaScrollablePaneTopPadding()}` }}>
          <div className="u-loading-spinner__wrapper">
            <div className="u-loading-spinner">Please wait...</div>
          </div>
        </div>
      </div>
    );
  }
}
