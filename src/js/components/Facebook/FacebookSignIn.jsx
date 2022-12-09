import { Facebook } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import FacebookActions from '../../actions/FacebookActions';
import VoterActions from '../../actions/VoterActions';
import SplitIconButton from '../../common/components/Widgets/SplitIconButton';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { oAuthLog, renderLog } from '../../common/utils/logging';
import webAppConfig from '../../config';
import { messageService } from '../../common/stores/AppObservableStore';
import FacebookStore from '../../stores/FacebookStore';
import VoterStore from '../../stores/VoterStore';
import initializeFacebookSDK from '../../utils/initializeFacebookSDK';
import signInModalGlobalState from '../Widgets/signInModalGlobalState';


class FacebookSignIn extends Component {
  constructor (props) {
    super(props);
    this.state = {
      buttonSubmittedText: '',
      deferredFacebookSignInRetrieve: false,
      facebookAuthResponse: {},
      facebookConnectionInitialized: false,
      facebookSignInSequenceStarted: false,
      mergingTwoAccounts: false,
      redirectInProgress: false,
      retrievingSignIn: false,
      saving: false,
      waitingForMergeTwoAccounts: false,
    };

    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount () {
    this.facebookStoreListener = FacebookStore.addListener(this.onFacebookStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    // console.log('FacebookSignIn, componentDidMount');
    this.setState({
      buttonSubmittedText: this.props.buttonSubmittedText || 'Signing in...',
    });

    if (!signInModalGlobalState.getBool('waitingForFacebookApiCompletion')) {
      signInModalGlobalState.set('waitingForFacebookApiCompletion', true);
      this.voterFacebookSignInRetrieve();
    }

    if (this.failedSignInTimer) clearTimeout(this.failedSignInTimer);
    if (!webAppConfig.ENABLE_FACEBOOK) {
      const { FB } = window;
      if (FB) {
        // NOTE 2022-11-08 Dale: I Haven't seen proof this is working
        if (FB.Event) {
          FB.Event.subscribe('auth.statusChange', this.onFacebookStatusChange);
        }
        try {
          FB.getLoginStatus((response) => {
            const { authResponse, status } = response;
            console.log(`FacebookSignIn FB.getLoginStatus response: ${authResponse}, status: ${status}`);
            if (response.status === 'connected') {
              this.setState({
                facebookConnectionInitialized: true,
              });
            }
          });
        } catch (error) {
          console.log('FacebookSignIn FB.getLoginStatus error:', error);
        }
      }
    }
  }

  componentWillUnmount () {
    const { FB } = window;
    if (FB && webAppConfig.ENABLE_FACEBOOK) {
      if (FB.Event) {
        FB.Event.unsubscribe('auth.statusChange', this.onFacebookStatusChange);
      }
    }
    this.facebookStoreListener.remove();
    this.voterStoreListener.remove();
    this.appStateSubscription.unsubscribe();
    signInModalGlobalState.set('startFacebookSignInSequence', false);
    signInModalGlobalState.set('waitingForFacebookApiCompletion', false);
  }

  onAppObservableStoreChange () {
    if (this.state.deferredFacebookSignInRetrieve) {
      this.setState({
        deferredFacebookSignInRetrieve: false,
      });
      this.voterFacebookSignInRetrieve();
    }
  }

  onFacebookStatusChange = (response) => {
    // NOTE 2022-11-08 Dale: I Haven't seen proof this is working
    console.log('onFacebookStatusChange, response:', response);
    if (response.status === 'connected') {
      this.setState({
        facebookConnectionInitialized: true,
      });
    }
  }

  onFacebookStoreChange () {
    // console.log('FacebookSignIn onFacebookStoreChange');

    this.setState({
      facebookAuthResponse: FacebookStore.getFacebookAuthResponse(),
      retrievingSignIn: false,
      saving: false,
    });

    // NOTE: November 2021,  facebookSignInFailed is confusingly named, it is ONLY false if a query has been made to facebook, and it returns unsuccessfully.
    // If we pull facebook credentials from our db without attempting a new authentication with Facebook it will return true.
    const { facebookIsLoggedIn, facebook_sign_in_failed: facebookSignInFailed,
      facebook_sign_in_found: facebookSignInFound, facebook_sign_in_verified: facebookSignInVerified,
      facebook_secret_key: facebookSecretKey } = this.state.facebookAuthResponse;

    // console.log(`FacebookSignIn facebookIsLoggedIn ${facebookIsLoggedIn} facebookSignInFailed: ${facebookSignInFailed} facebookSignInFound: ${facebookSignInFound} facebookSignInVerified: ${facebookSignInVerified}`);

    if (facebookIsLoggedIn && !facebookSignInFailed && facebookSignInFound && facebookSignInVerified) {
      // console.log('FacebookSignIn setting redirectInProcess: false');
      this.setState({ redirectInProcess: false });
      oAuthLog('FacebookSignIn calling voterMergeTwoAccountsByFacebookKey, since the voter is authenticated with facebook');
      VoterActions.voterMergeTwoAccountsByFacebookKey(facebookSecretKey);
      this.setState({ waitingForMergeTwoAccounts: true });
    }
  }

  onVoterStoreChange () {
    // console.log('FacebookSignIn onVoterStoreChange');
    const { redirectInProcess, waitingForMergeTwoAccounts } = this.state;
    const voter = VoterStore.getVoter();
    const { signed_in_facebook: voterIsSignedInFacebook } = voter;
    if (voterIsSignedInFacebook) {
      signInModalGlobalState.set('startFacebookSignInSequence', false);
    }

    if (!redirectInProcess && !waitingForMergeTwoAccounts) {
      const facebookSignInStatus = VoterStore.getFacebookSignInStatus();
      // console.log('facebookSignInStatus:', facebookSignInStatus);
      // console.log('FacebookSignIn onVoterStoreChange, voterIsSignedInFacebook:', voterIsSignedInFacebook);
      if (voterIsSignedInFacebook || (facebookSignInStatus && facebookSignInStatus.voter_merge_two_accounts_attempted)) {
        const newRedirectPathname = '/ballot';
        oAuthLog('Redirecting to newRedirectPathname:', newRedirectPathname);
        signInModalGlobalState.set('startFacebookSignInSequence', false);
        this.closeSignInModalLocal();
      }
    }
  }

  onKeyDown = (event) => {
    const enterAndSpaceKeyCodes = [13, 32];
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      this.didClickFacebookSignInButton();
    }
  };

  didClickFacebookSignInButton = () => {
    this.setState({
      facebookSignInSequenceStarted: true,
    });
    signInModalGlobalState.set('startFacebookSignInSequence', true);
    let { FB, facebookConnectPlugin } = window;
    if (FB) {
      console.log('FB FacebookActions.login, first try');
      FacebookActions.login();
    } else if (facebookConnectPlugin) {
      console.log('facebookConnectPlugin FacebookActions.login, first try');
      FacebookActions.login();
    } else {
      // Initialize Facebook SDK again, and then start login
      console.log('window.FB missing. Trying to initializeFacebookSDK again - 1500 millisecond pause');
      initializeFacebookSDK();
      this.timer = setTimeout(() => {
        ({ FB, facebookConnectPlugin } = window);
        if (FB) {
          console.log('FB FacebookActions.login, second try');
          FacebookActions.login();
        } else if (facebookConnectPlugin) {
          console.log('facebookConnectPlugin FacebookActions.login, second try');
          FacebookActions.login();
        } else {
          console.log('Could not initializeFacebookSDK in 1500 milliseconds');
        }
      }, 1500);
    }
  };

  closeSignInModalLocal = () => {
    if (this.props.closeSignInModal) {
      console.log('FacebookSignIn closeSignInModalLocal closing dialog ---------------');
      this.props.closeSignInModal();
      signInModalGlobalState.set('startFacebookSignInSequence', false);
      signInModalGlobalState.set('waitingForFacebookApiCompletion', false);
    }
  };

  voterFacebookSaveToCurrentAccount () {
    // console.log('In voterFacebookSaveToCurrentAccount');
    VoterActions.voterFacebookSaveToCurrentAccount();
  }

  voterFacebookSignInRetrieve () {
    oAuthLog('FacebookSignIn voterFacebookSignInRetrieve');
    if (!this.state.saving) {
      FacebookActions.voterFacebookSignInRetrieve();
      this.setState({
        saving: true,
        retrievingSignIn: true,
      });
    }
  }

  render () {
    renderLog('FacebookSignIn');  // Set LOG_RENDER_EVENTS to log all renders
    const { buttonText } = this.props;
    const { buttonSubmittedText, facebookAuthResponse, facebookConnectionInitialized, facebookSignInSequenceStarted, mergingTwoAccounts, redirectInProgress, waitingForMergeTwoAccounts } = this.state;
    // As of late 2022, Facebook will only allow sign ins from secure (https) connections.  This is possible to setup on your local server.
    // See the doc file https://github.com/wevote/WebApp/blob/develop/docs/working/SECURE_CERTIFICATE.md
    // Preventing a behind the scenes automatic re-login by facebook is difficult...
    // See the doc file https://github.com/wevote/WebApp/blob/develop/docs/working/SECURE_CERTIFICATE.md#really-really-signing-out-of-facebook
    if (isWebApp() && !facebookConnectionInitialized) {
      // Steve 12/2/22: This "return null" was breaking signing in with facebook in webapp (and Cordova) if you had "never" been signed in before in the browser
      // console.log('FacebookSignIn: (disabled) Do not offer Facebook button if we aren\'t getting status back');
      // return null;  12/2/22, see note above
    }
    if (redirectInProgress) {
      return null;
    }

    let statusMessage = '';
    let showWheel = true;

    if (!signInModalGlobalState.getBool('startFacebookSignInSequence')) {
      // console.log('FacebookSignIn top of checks, no action yet, facebookAuthResponse', (facebookAuthResponse || 'no auth obj'));
    } else if (signInModalGlobalState.getBool('waitingForFacebookApiCompletion') ||
        this.state.saving ||
        this.state.retrievingSignIn ||
        !facebookAuthResponse) {
      // console.log('Waiting for a response from Facebook this.state.saving: ', this.state.saving, 'this.state.retrievingSignIn', this.state.retrievingSignIn,
      //   '!facebookAuthResponse', !facebookAuthResponse, 'signInModalGlobalState.getBool(waitingForFacebookApiCompletion)', signInModalGlobalState.getBool('waitingForFacebookApiCompletion'));
      statusMessage = 'Waiting for a response from Facebook...';
    } else if (facebookAuthResponse.facebook_sign_in_failed) {
      oAuthLog('facebookAuthResponse.facebook_sign_in_failed , setting "Facebook sign in process starting..." message.');
      statusMessage = 'Facebook sign in process starting...';
    } else if (waitingForMergeTwoAccounts) {
      statusMessage = 'Loading your account information...';
    } else if (!facebookAuthResponse.facebook_sign_in_found) {
      // This process starts when we return from attempting voterFacebookSignInRetrieve.  If facebook_sign_in_found NOT True, try again
      oAuthLog('facebookAuthResponse.facebook_sign_in_found with no authentication');
      statusMessage = 'Facebook authentication not found. Please try again.';
      showWheel = false;
    } else if (facebookAuthResponse.existing_facebook_account_found) {  // Is there a collision of two accounts?
      oAuthLog('FacebookSignIn facebookAuthResponse.existing_facebook_account_found');
      if (mergingTwoAccounts) {
        oAuthLog('FacebookSignIn merging two accounts by facebook key');
        statusMessage = 'Loading your account...';
      } else {
        oAuthLog('FacebookSignIn merge internal error ---------------');
        statusMessage = 'Internal error...';
      }
    } else {
      oAuthLog('Setting up new Facebook entry - voterFacebookSaveToCurrentAccount');
      this.voterFacebookSaveToCurrentAccount();
      statusMessage = 'Saving your account...';
    }

    return (
      <div>
        <SplitIconButton
          buttonText={facebookSignInSequenceStarted ? buttonSubmittedText : buttonText}
          backgroundColor="#3b5998"
          disabled={facebookSignInSequenceStarted}
          externalUniqueId="facebookSignIn"
          icon={<Facebook />}
          id="facebookSignIn"
          onClick={this.didClickFacebookSignInButton}
          onKeyDown={this.onKeyDown}
          separatorColor="rgba(250, 250, 250, .6)"
        />
        { statusMessage.length ? (
          <FacebookErrorContainer>
            <div style={{ textAlign: 'center' }}>
              {statusMessage}
            </div>
            { showWheel ? (
              <div style={{ padding: '30px' }}>
                <CircularProgress />
              </div>
            ) : null}
          </FacebookErrorContainer>
        ) : null}
      </div>
    );
  }
}
FacebookSignIn.propTypes = {
  closeSignInModal: PropTypes.func,
  buttonSubmittedText: PropTypes.string,
  buttonText: PropTypes.string,
};

export default FacebookSignIn;

const FacebookErrorContainer  = styled('h3')`
  margin-top: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
`;
