import React, { Component } from 'react';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import VoterStore from '../../stores/VoterStore';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import historyPush from '../../common/utils/historyPush';
import Cookies from '../../common/utils/js-cookie/Cookies';
import { oAuthLog, renderLog } from '../../common/utils/logging';
import { PageContentContainer } from '../../utils/pageLayoutStyles';
import { stringContains } from '../../utils/textFormat';

export default class AppleSignInProcess extends Component {
  constructor (props) {
    super(props);
    this.state = {
      hostname: '',
      redirectInProgress: false,
      voterWeVoteId: '',
    };
  }

  componentDidMount () {
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const hostname = AppObservableStore.getHostname();
    const voter = VoterStore.getVoter();
    const { we_vote_id: voterWeVoteId } = voter;
    this.setState({
      hostname,
      voterWeVoteId,
    });
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.voterStoreListener.remove();
  }

  onAppObservableStoreChange () {
    const hostname = AppObservableStore.getHostname();
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
        let signInStartFullUrl = Cookies.get('sign_in_start_full_url');
        // console.log('AppleSignInProcess signInStartFullUrl:', signInStartFullUrl);
        if (signInStartFullUrl && stringContains('applesigninprocess', signInStartFullUrl)) {
          // Do not support a redirect to applesigninprocess
          signInStartFullUrl = null;
        }
        if (signInStartFullUrl) {
          // console.log('AppleSignInProcess Executing Redirect');
          AppObservableStore.unsetStoreSignInStartFullUrl();
          Cookies.remove('sign_in_start_full_url', { path: '/' });
          Cookies.remove('sign_in_start_full_url', { path: '/', domain: 'wevote.us' });
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
          <PageContentContainer>
            <div style={{ textAlign: 'center' }}>
              Apple Sign in did not work for some reason.
              <br />
              <br />
              Please try again, or contact us using the &apos;Help&apos; icon below.
            </div>
          </PageContentContainer>
        </div>
      );
    }

    return (
      <div className="apple_sign_in_waiting_root">
        <PageContentContainer>
          <div className="u-loading-spinner__wrapper">
            <div className="u-loading-spinner">Please wait...</div>
          </div>
        </PageContentContainer>
      </div>
    );
  }
}
