import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import cookies from '../../utils/cookies';
import VoterActions from '../../actions/VoterActions';
import webAppConfig from '../../config';
import { isAndroid, isIOS, isWebApp } from '../../utils/cordovaUtils';
import { openSnackbar } from '../Widgets/SnackNotifier';
import { oAuthLog, renderLog } from '../../utils/logging';

class AppleSignIn extends Component {
  constructor (props) {
    super(props);
    this.signInToAppleIOS = this.signInToAppleIOS.bind(this);
    this.signInToAppleWebApp = this.signInToAppleWebApp.bind(this);
    this.signInClicked = this.signInClicked.bind(this);
    this.onSignInSuccess = this.onSignInSuccess.bind(this);
    this.onSignInFailure = this.onSignInFailure.bind(this);
  }

  componentDidMount () {
    if (isWebApp()) {
      const { AppleID } = window;
      const state = JSON.stringify({
        voter_device_id: cookies.getItem('voter_device_id'),
        return_url: window.location.href,
      });
      if (AppleID) {
        console.log('voter_device_id from cookie', cookies.getItem('voter_device_id'));
        AppleID.auth.init({
          clientId: 'us.wevote.webapp',
          scope: 'name email',
          redirectURI: `${webAppConfig.WE_VOTE_SERVER_API_ROOT_URL}appleSignInOauthRedirectDestination`,
          state,
          popup: true,
        });
      } else {
        console.log('ERROR in AppleSignIn, the Sign In with Apple client did not load');
      }
      document.addEventListener('AppleIDSignInOnSuccess', (data) => {
        console.log('AppleIDSignInOnSuccessListener  data:', data);
      });
      document.addEventListener('AppleIDSignInOnFailure', (error) => {
        console.log('AppleIDSignInOnFailureListener ERROR:', error);
      });
    }
  }

  componentWillUnmount () {
    if (isWebApp()) {
      // document.removeEventListener('AppleIDSignInOnSuccess', this.onSignInSuccess());
      // document.removeEventListener('AppleIDSignInOnFailure', this.onSignInFailure());
    }
  }

  onSignInSuccess (data) {
    console.log('onSignInSuccess  data:', data);
  }

  onSignInFailure (data) {
    console.log('onSignInFailure  data:', data);
  }

  signInToAppleIOS () {
    console.log('SignInWithApple signInToAppleIOS: Button clicked');
    const { SignInWithApple: { signin } } = window.cordova.plugins;

    signin(
      { requestedScopes: [0, 1]},
      (response) => {
        console.log(`SignInWithApple: ${JSON.stringify(response)}`);
        const { user, email, identityToken, fullName: { givenName, middleName, familyName } } = response;
        console.log('AppleSignInSave called with email:', email);
        // In August 2020, Apple stopped returning the name and address on first signin, and email on subsequent signins
        // So it seems that we have no way to determine if they use an alias email, found notes that dropbox and others have
        // trouble with alias emails (probably since they match siwa sign ins with previous signins by email).  This will be trouble for us
        // unless it is a short term bug on the Apple API servers.
        // if (!email || email.length === 0) {
        //   openSnackbar({
        //     message: 'We Vote does not support "Hide My Email" at this time.',
        //     duration: 7000,
        //   });
        //   oAuthLog('We Vote does not support "Hide My Email" at this time.');
        // } else {
        VoterActions.voterAppleSignInSave(email, givenName, middleName, familyName, user, identityToken);
        oAuthLog('Sign in with Apple successful signin for: ', email);
        // }
        if (this.props.closeSignInModal) {
          this.props.closeSignInModal();
        }
      },
      (err) => {
        // console.error(err);
        console.log(`SignInWithApple: ${JSON.stringify(err)}`);
        oAuthLog(`SignInWithApple: ${JSON.stringify(err)}`);
        if (err.code === '1000') {
          // SignInWithApple: {"code":"1000","localizedFailureReason":"","error":"ASAUTHORIZATION_ERROR","localizedDescription":"The operation couldn’t be completed. (com.apple.AuthenticationServices.AuthorizationError error 1000.)"}
          // iOS takes over and the voter will be taking a break to go to settings to setup AppleID or login to iCloud for the first time on this device.
          // Super edge case outside of testing situations
          openSnackbar({
            message: `You may need to open Settings, and login to iCloud before proceeding. (code: ${err.code})`,
            duration: 7000,
          });
          if (this.props.closeSignInModal) {
            this.props.closeSignInModal();
          }
        }
      },
    );
  }

  signInToAppleWebApp () {  // https://i.stack.imgur.com/Le6Jf.png  https://stackoverflow.com/questions/61071848/sign-in-with-apple-js-returns-invalid-request-in
    oAuthLog('AppleSignIn signInToAppleWebApp button pressed');
    try {
      const { auth } = window.AppleID;
      auth.signIn();
    } catch (error) {
      oAuthLog('signInToAppleWebApp exception ERROR:', error);
    }
  }

  // eslint-disable-next-line consistent-return
  signInClicked (enabled) {
    if (!enabled) {
      return null;
    }
    if (isWebApp()) {
      this.signInToAppleWebApp();
    } else {
      this.signInToAppleIOS();
    }
  }

  render () {
    renderLog('AppleSignIn');  // Set LOG_RENDER_EVENTS to log all renders
    const isWeb = isWebApp();
    const { signedIn } = this.props;
    let enabled = true;
    const tinyScreen = isWeb && window.innerWidth < 300;  // Galaxy fold, folded

    if (isAndroid()) {
      // console.log('Sign in with Apple is not available on Android');
      return null;
    } else if (isIOS()) {
      const { device: { version } } = window;
      const floatVersion = parseFloat(version);
      if (floatVersion < 13.0) {
        console.log('Sign in with Apple is not available on iOS < 13, this phone is running: ', floatVersion);
        enabled = false;
      }
    }

    if (signedIn) {
      return (
        <AppleSignedInContainer>
          <AppleLogo signedIn={signedIn} enabled={enabled} />
        </AppleSignedInContainer>
      );
    } else {
      return (
        <AppleSignInContainer enabled={enabled}>
          <AppleSignInButton type="submit"
                             isWeb={isWeb}
                             tinyScreen={tinyScreen}
                             onClick={() => this.signInClicked(enabled)}
          >
            <AppleLogo signedIn={signedIn} enabled={enabled} />
            <AppleSignInText id="appleSignInText" enabled={enabled}>
              {enabled ? 'Sign in with Apple' : '(REQUIRES iOS 13)'}
            </AppleSignInText>
          </AppleSignInButton>
        </AppleSignInContainer>
      );
    }
  }
}
AppleSignIn.propTypes = {
  closeSignInModal: PropTypes.func,
  signedIn: PropTypes.bool,
};

export default AppleSignIn;

export function AppleLogo (parameters) {
  return (
    <AppleLogoSvg viewBox="0 0 170 170"
                  fill="currentColor"
                  preserveAspectRatio="xMinYMin meet"
                  focusable="false"
                  aria-hidden="true"
                  id="appleLogo"
                  signedIn={parameters.signedIn}
                  enabled={parameters.enabled}
    >
      <title>Apple Logo</title>
      <path
        d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48
        4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.197-2.12-9.973-3.17-14.34-3.17-4.58
        0-9.492 1.05-14.746 3.17-5.262 2.13-9.501 3.24-12.742
        3.35-4.929.21-9.842-1.96-14.746-6.52-3.13-2.73-7.045-7.41-11.735-14.04-5.032-7.08-9.169-15.29-12.41-24.65-3.471-10.11-5.211-19.9-5.211-29.378
        0-10.857 2.346-20.221 7.045-28.068 3.693-6.303 8.606-11.275 14.755-14.925s12.793-5.51 19.948-5.629c3.915
        0 9.049 1.211 15.429 3.591 6.362 2.388 10.447 3.599 12.238 3.599 1.339 0 5.877-1.416 13.57-4.239
        7.275-2.618 13.415-3.702 18.445-3.275 13.63 1.1 23.87 6.473 30.68 16.153-12.19 7.386-18.22
        17.731-18.1 31.002.11 10.337 3.86 18.939 11.23 25.769 3.34 3.17 7.07 5.62 11.22 7.36-.9 2.61-1.85
        5.11-2.86 7.51zM119.11 7.24c0 8.102-2.96 15.667-8.86 22.669-7.12 8.324-15.732 13.134-25.071
        12.375a25.222 25.222 0 0 1-.188-3.07c0-7.778 3.386-16.102 9.399-22.908 3.002-3.446 6.82-6.311
        11.45-8.597 4.62-2.252 8.99-3.497 13.1-3.71.12 1.083.17 2.166.17 3.24z"
      />
    </AppleLogoSvg>
  );
}

/*
Note, May 21, 2020: Before making changes to these styles, be sure you are compliant with
https://developer.apple.com/design/resources/ or we risk getting rejected by Apple
*/
const AppleLogoSvg = styled.svg`
  position: absolute;
  left: ${({ signedIn }) => (signedIn ? '29%' : '5%')};
  top: 11px;
  height: 20px;
  color: ${({ enabled }) => (enabled ? '#fff' : 'grey')};
`;

/*
Note, May 21, 2020: Before making changes to these styles, be sure you are compliant with
https://developer.apple.com/design/resources/ or we risk getting rejected by Apple
*/
const AppleSignInText = styled.span`
  font-size: 18px;
  padding: 0;
  border: none;
  color: ${({ enabled }) => (enabled ? '#fff' : 'grey')};
`;

/*
Note, May 21, 2020: Before making changes to these styles, be sure you are compliant with
https://developer.apple.com/design/resources/ or we risk getting rejected by Apple
*/
const AppleSignInButton = styled.button`
  margin-top: ${({ isWeb }) => (isWeb ? '8px' : '10px')};
  border: none;
  padding-left: ${({ tinyScreen }) => (tinyScreen ? '20px' : '40px')};
  background-color: #000;
  color: #fff;
`;

/*
Note, May 21, 2020: Before making changes to these styles, be sure you are compliant with
https://developer.apple.com/design/resources/ or we risk getting rejected by Apple
*/
const AppleSignInContainer  = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: #000;
  border-color: #000;
  color: ${({ enabled }) => (enabled ? '#fff' : 'grey')};
  display: block;
  margin: 0 auto 11px;
  height: 46px;
  border-radius: 4px;
  overflow: hidden;
  padding: 0 40px;
  position: relative;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`;

/*
Note, May 21, 2020: Before making changes to these styles, be sure you are compliant with
https://developer.apple.com/design/resources/ or we risk getting rejected by Apple
*/
const AppleSignedInContainer  = styled.div`
  background-color: #000;
  border-color: #000;
  color: #fff;
  margin: 0 auto 11px;
  height: 46px;
  border-radius: 4px;
  max-width: 408px;
  overflow: hidden;
  position: relative;
  width: 46px;
`;
