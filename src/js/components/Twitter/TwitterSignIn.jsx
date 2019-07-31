import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { shortenText } from '../../utils/textFormat';
import { oAuthLog, renderLog } from '../../utils/logging';
import $ajax from '../../utils/service';
import cookies from '../../utils/cookies';
import {
  isWebApp, cordovaOpenSafariView, isIOS, isAndroid, historyPush,
} from '../../utils/cordovaUtils';
import webAppConfig from '../../config';
import TwitterActions from '../../actions/TwitterActions';
import SplitIconButton from '../Widgets/SplitIconButton';

const returnURL = `${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}/twitter_sign_in`;

class TwitterSignIn extends Component {
  static propTypes = {
    buttonText: PropTypes.string,
  };

  // TODO: April 17, 2018, this is used by Twitter and SignIn by Email, and should be refactored out of here.  It is really the handleOpenURL function.
  static handleTwitterOpenURL (url) {
    oAuthLog(`---------------xxxxxx-------- Application handleTwitterOpenUrl: ${url}`);
    if (url.startsWith('wevotetwitterscheme://')) {
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
      } else if (url.startsWith('wevotetwitterscheme://sign_in_email')) {
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
    };
  }

  twitterSignInWebApp () {
    const brandingOff = cookies.getItem('we_vote_branding_off') || 0;
    oAuthLog(`twitterSignInWebApp isWebApp(): ${isWebApp()},  returnURL: ${returnURL}`);
    $ajax({
      endpoint: 'twitterSignInStart',
      data: { return_url: returnURL },
      success: (res) => {
        console.log('twitterSignInWebApp success, res:', res);
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

  twitterSignInWebAppCordova () {
    const requestURL = `${webAppConfig.WE_VOTE_SERVER_API_ROOT_URL}twitterSignInStart` +
      `?cordova=true&voter_device_id=${cookies.getItem('voter_device_id')}&return_url=http://nonsense.com`;
    oAuthLog(`twitterSignInWebAppCordova requestURL: ${requestURL}`);
    if (isIOS()) {
      cordovaOpenSafariView(requestURL, null, 50);
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
      });
    }
  }

  render () {
    const { buttonText } = this.props;
    renderLog(__filename);
    return (
      // <Button
      //   className="split-button split-button__left"
      //   color="primary"
      //   variant="contained"
      //   onClick={isWebApp() ? this.twitterSignInWebApp : this.twitterSignInWebAppCordova}
      //   style={{
      //     backgroundColor: '#55acee',
      //   }}
      //   title="Sign in to find voter guides"
      // >
      //   <span className="split-button__icon">
      //     <i className="fab fa-twitter" />
      //   </span>
      //   <div className="split-button__seperator split-button__seperator--left" />
      //   <span className="split-button__text">
      //     {shortenText(buttonText, 22)}
      //   </span>
      // </Button>
      <SplitIconButton
        backgroundColor="#55acee"
        seperatorColor="rgba(250, 250, 250, .6)"
        title="Sign in to find voter guides"
        onClick={isWebApp() ? this.twitterSignInWebApp : this.twitterSignInWebAppCordova}
        icon={<i className="fab fa-twitter" />}
        buttonText={shortenText(buttonText, 22)}
      />
    );
  }
}

export default TwitterSignIn;

