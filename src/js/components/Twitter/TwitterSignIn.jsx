import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { oAuthLog, renderLog } from '../../utils/logging';
import $ajax from '../../utils/service';
import cookies from '../../utils/cookies';
import {
  isWebApp, cordovaOpenSafariView, isIOS, isAndroid, historyPush,
} from '../../utils/cordovaUtils';
import SplitIconButton from '../Widgets/SplitIconButton';
import { shortenText, startsWith } from '../../utils/textFormat';
import TwitterActions from '../../actions/TwitterActions';
import webAppConfig from '../../config';

const returnURL = `${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}/twitter_sign_in`;

class TwitterSignIn extends Component {
  // TODO: April 17, 2018, this is used by Twitter and SignIn by Email, and should be refactored out of here.  It is really the handleOpenURL function.
  static handleTwitterOpenURL (url) {
    oAuthLog(`---------------xxxxxx-------- Application handleTwitterOpenUrl: ${url}`);
    if (startsWith('wevotetwitterscheme://', url)) {
      oAuthLog(`handleTwitterOpenURL received wevotetwitterscheme: ${url}`);
      const search = url.replace(new RegExp('&amp;', 'g'), '&');
      const urlParams = new URLSearchParams(search);

      if (urlParams.has('twitter_redirect_url')) {
        const redirectURL = urlParams.get('twitter_redirect_url');
        oAuthLog(`twitterSignIn cordova, redirecting to: ${redirectURL}`);

        if (isIOS()) {
          // eslint-disable-next-line no-undef
          SafariViewController.hide(); // Hide the previous WKWebView
          cordovaOpenSafariView(redirectURL, null, 500);
        } else {
          oAuthLog('redirectURL: ', redirectURL);
          const inAppBrowserRef = cordova.InAppBrowser.open(redirectURL, '_blank', 'toolbar=no,location=yes,hardwareback=no');
          inAppBrowserRef.addEventListener('exit', () => {
            oAuthLog('inAppBrowserRef on exit: ', redirectURL);
          });

          inAppBrowserRef.addEventListener('customscheme', (event) => {
            oAuthLog('customscheme: ', event.url);
            TwitterSignIn.handleTwitterOpenURL(event.url);
            inAppBrowserRef.close();
          });
        }
      } else if (urlParams.has('access_token_and_secret_returned')) {
        if (urlParams.get('success') === 'True') {
          oAuthLog('twitterSignIn cordova, received secret -- push /ballot');
          TwitterActions.twitterSignInRetrieve();
          historyPush('/ballot');
        } else {
          oAuthLog('twitterSignIn cordova, FAILED to receive secret -- push /twitter_sign_in');
          historyPush('/twitter_sign_in');
        }
      } else if (urlParams.has('twitter_handle_found') && urlParams.get('twitter_handle_found') === 'True') {
        oAuthLog(`twitterSignIn cordova, twitter_handle_found -- push /twitter_sign_in -- received handle = ${urlParams.get('twitter_handle')}`);

        if (isIOS()) {
          // eslint-disable-next-line no-undef
          SafariViewController.hide(); // Hide the previous WKWebView
        }

        historyPush('/twitter_sign_in');
      } else if (startsWith('wevotetwitterscheme://sign_in_email', url)) {
        oAuthLog(`twitterSignIn by email cordova, (not really twitter) -- received url = ${url}`);

        // Example url: wevotetwitterscheme://sign_in_email/1278821
        const n = url.indexOf('/');
        const payload = url.substring(n + 1);
        historyPush(payload); // Example payload: "/sign_in_email/1278821"
      } else {
        console.log('ERROR in window.handleOpenURL, NO MATCH');
      }
    } else {
      console.log(`ERROR: window.handleOpenURL received invalid url: ${url}`);
    }
  }

  constructor (props) {
    super(props);
    this.state = {
      buttonSubmittedText: '',
      twitterSignInStartSubmitted: false,
    };
  }

  componentDidMount () {
    this.setState({
      buttonSubmittedText: this.props.buttonSubmittedText || 'Signing in...',
    });
  }

  twitterSignInWebAppCordova = () => {
    const requestURL = `${webAppConfig.WE_VOTE_SERVER_API_ROOT_URL}twitterSignInStart` +
      `?cordova=true&voter_device_id=${cookies.getItem('voter_device_id')}&return_url=http://nonsense.com`;
    oAuthLog(`twitterSignInWebAppCordova requestURL: ${requestURL}`);
    const { inModal } = this.props;
    this.setState({
      twitterSignInStartSubmitted: true,
    });
    if (isIOS()) {
      cordovaOpenSafariView(requestURL, null, 50);
      if (inModal) {
        if (this.props.closeSignInModal) {
          this.props.closeSignInModal();
        }
      }
    } else if (isAndroid()) {
      // April 6, 2018: Needs Steve's PR to handle customscheme
      // https://github.com/apache/cordova-plugin-inappbrowser/pull/263
      /* global cordova */
      /* eslint no-undef: ["error", { "typeof": true }] */
      const inAppBrowserRef = cordova.InAppBrowser.open(requestURL, '_blank', 'toolbar=no,location=yes,hardwareback=no');
      inAppBrowserRef.addEventListener('exit', () => {
        oAuthLog('inAppBrowserRef on exit: ', requestURL);
      });

      inAppBrowserRef.addEventListener('customscheme', (event) => {
        oAuthLog('customscheme: ', event.url);
        TwitterSignIn.handleTwitterOpenURL(event.url);

        // inAppBrowserRef.close();
        if (inModal) {
          if (this.props.closeSignInModal) {
            this.props.closeSignInModal();
          }
        }
      });
    }
  };

  twitterSignInWebApp = () => {
    const brandingOff = cookies.getItem('we_vote_branding_off') || 0;
    oAuthLog(`twitterSignInWebApp isWebApp(): ${isWebApp()},  returnURL: ${returnURL}`);
    this.setState({
      twitterSignInStartSubmitted: true,
    });
    $ajax({
      endpoint: 'twitterSignInStart',
      data: { return_url: returnURL },
      success: (res) => {
        // console.log('twitterSignInWebApp success, res:', res);
        if (res.twitter_redirect_url) {
          if (brandingOff) {
            window.open(res.twitter_redirect_url);
          } else {
            window.location.assign(res.twitter_redirect_url);
          }
        } else {
          // There is a problem signing in
          console.log('twitterSignInWebApp ERROR res: ', res);

          // When we visit this page and delete the voter_device_id cookie, we can get an error that requires
          // reloading the browser page. This is how we do it:
          window.location.assign('');
        }
      },

      error: (res) => {
        console.log('twitterSignInWebApp error: ', res);

        // Try reloading the page
        window.location.assign('');
      },
    });
  }

  render () {
    let { buttonText } = this.props;
    const { buttonSubmittedText, twitterSignInStartSubmitted } = this.state;
    let disabled = twitterSignInStartSubmitted;
    if (isIOS()) {
      const { device: { version } } = window;
      if (version) {
        const floatVersion = parseFloat(version);
        if (floatVersion < 13.0) {
          console.log('Sign in with Twitter is not available on iOS < 13, this phone is running: ', floatVersion);
          disabled = true;
          buttonText = '(Requires iOS 13)';
        }
      }
    }

    renderLog('TwitterSignIn');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <SplitIconButton
        backgroundColor="#55acee"
        fontColor={disabled ? 'gray' : 'white'}
        buttonText={twitterSignInStartSubmitted ? shortenText(buttonSubmittedText, 32) : shortenText(buttonText, 32)}
        disabled={disabled}
        externalUniqueId="twitterSignIn"
        icon={<i className="fab fa-twitter" />}
        id="twitterSignIn"
        onClick={isWebApp() ? this.twitterSignInWebApp : this.twitterSignInWebAppCordova}
        separatorColor="rgba(250, 250, 250, .6)"
        title="Sign in to find voter guides"
      />
    );
  }
}
TwitterSignIn.propTypes = {
  buttonText: PropTypes.string,
  buttonSubmittedText: PropTypes.string,
  closeSignInModal: PropTypes.func,
  inModal: PropTypes.bool,
};

export default TwitterSignIn;

