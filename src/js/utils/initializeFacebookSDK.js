import { isWebApp } from '../common/utils/isCordovaOrWebApp';
import FacebookSignedInData from '../components/Facebook/FacebookSignedInData';
import webAppConfig from '../config';

const initializeFacebookSDK = () => {
  console.log('initializeFacebookSDK called');
  if (webAppConfig.ENABLE_FACEBOOK) {
    if (isWebApp()) {
      (function (d, s, id) { // eslint-disable-line
        let js;
        const fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
          return;
        }

        js = d.createElement(s);    // eslint-disable-line prefer-const
        js.id = id;
        js.async = true;
        js.src = 'https://connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
        console.log('https://connect.facebook.net/en_US/sdk.js loaded for webApp ------------');
      }(document, 'script', 'facebook-jssdk'));
    }

    window.fbAsyncInit = function () {  // eslint-disable-line func-names
      console.log('window.fbAsyncInit = function () ------------');

      const { FB } = window;
      console.log('const { FB } = window ------------ FB:', FB);
      if (webAppConfig.ENABLE_FACEBOOK) {
        FB.init({
          appId: webAppConfig.FACEBOOK_APP_ID,
          autoLogAppEvents: true,
          xfbml: true,
          version: 'v15.0', // Facebook JavaScript SDK - Facebook Version
          status: true, // set this status to true, this will fix the popup blocker issue
        });
        console.log('initializeFacebookSDK FB.init has been called');
        // This initial call simply pre-loads the current facebook login status to local FacebookSignedInData object
        FacebookSignedInData.setConnectedStatus(false, false, false, null);
      }
    };
  }
};

export default initializeFacebookSDK;
