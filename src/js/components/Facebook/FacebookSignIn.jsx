import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { oAuthLog, renderLog } from '../../utils/logging';
import AppStore from '../../stores/AppStore';
import FacebookActions from '../../actions/FacebookActions';
import FacebookStore from '../../stores/FacebookStore';
import signInModalGlobalState from '../Widgets/signInModalGlobalState';
import SplitIconButton from '../Widgets/SplitIconButton';
import VoterStore from '../../stores/VoterStore';
import VoterActions from '../../actions/VoterActions';


class FacebookSignIn extends Component {
  constructor (props) {
    super(props);
    this.state = {
      buttonSubmittedText: '',
      deferredFacebookSignInRetrieve: false,
      facebookAuthResponse: {},
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
    this.appStoreListener = AppStore.addListener(this.onVoterStoreChange.bind(this));
    // console.log('FacebookSignIn, componentDidMount');
    this.setState({
      buttonSubmittedText: this.props.buttonSubmittedText || 'Signing in...',
    });

    if (!signInModalGlobalState.getBool('waitingForFacebookApiCompletion')) {
      signInModalGlobalState.set('waitingForFacebookApiCompletion', true);
      this.voterFacebookSignInRetrieve();
    }
  }

  componentWillUnmount () {
    this.facebookStoreListener.remove();
    this.voterStoreListener.remove();
    this.appStoreListener.remove();
    signInModalGlobalState.set('startFacebookSignInSequence', false);
    signInModalGlobalState.set('waitingForFacebookApiCompletion', false);
  }

  onAppStoreChange () {
    if (this.state.deferredFacebookSignInRetrieve) {
      this.setState({
        deferredFacebookSignInRetrieve: false,
      });
      this.voterFacebookSignInRetrieve();
    }
  }

  onFacebookStoreChange () {
    // console.log('FacebookSignIn onFacebookStoreChange');

    this.setState({
      facebookAuthResponse: FacebookStore.getFacebookAuthResponse(),
      retrievingSignIn: false,
      saving: false,
    });

    const { facebookIsLoggedIn, facebook_sign_in_failed: facebookSignInFailed,
      facebook_sign_in_found: facebookSignInFound, facebook_sign_in_verified: facebookSignInVerified,
      facebook_secret_key: facebookSecretKey } = this.state.facebookAuthResponse;

    if (facebookIsLoggedIn && !facebookSignInFailed && facebookSignInFound && facebookSignInVerified) {
      this.setState({ redirectInProcess: false });
      // console.log('FacebookSignIn calling voterMergeTwoAccountsByFacebookKey, since the voter is authenticated with facebook');
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
    FacebookActions.login();
  };

  closeSignInModalLocal = () => {
    if (this.props.closeSignInModal) {
      console.log('FacebookSignIn closeSignInModalLocal closing dialog ---------------');
      signInModalGlobalState.set('startFacebookSignInSequence', false);
      signInModalGlobalState.set('waitingForFacebookApiCompletion', false);
      this.props.closeSignInModal();
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
    const { buttonSubmittedText, facebookAuthResponse, facebookSignInSequenceStarted, mergingTwoAccounts, redirectInProgress, waitingForMergeTwoAccounts } = this.state;
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
      oAuthLog('facebookAuthResponse.facebook_sign_in_failed , setting "Facebook sign in process." message.');
      statusMessage = 'Facebook sign in process.';
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
        oAuthLog('FacebookSignIn internal error ---------------');
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
          icon={<span className="fab fa-facebook-square" />}
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
              <div className="u-loading-spinner__wrapper">
                <div className="u-loading-spinner">Please wait...</div>
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

const FacebookErrorContainer  = styled.h3`
  margin-top: 8px;
  background-color: #fff;
  box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
`;
