import { oAuthLog } from '../common/utils/logging';

const initializeAppleSDK = (afterFunction) => {
  if (document.documentMode) {
    //  https://gs.statcounter.com/browser-market-share/all/united-states-of-america                                           48%     35%      4%     5%      0.06%
    document.getElementById('loadingMessage').innerHTML = "We're sorry, we no longer support Internet Explorer. We recommend Chrome, Safari, Firefox, Edge or Chromium.";
    console.log('NOT LOADING appleid.auth.js for those who still are using Internet Explorer');
  } else if (window.AppleID) {
    // console.log('Apple API ALREADY LOADED, SO NOT RELOADING');
    oAuthLog('Apple API ALREADY LOADED, SO NOT RELOADING');
    if (afterFunction) {
      afterFunction();
    }
  } else {
    new Promise((resolve) => {
      oAuthLog('Initializing AppleID API Library');
      const scriptElementForAppleIdAuth = document.createElement('script');
      scriptElementForAppleIdAuth.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
      scriptElementForAppleIdAuth.type = 'text/javascript';
      const firstExistingScript = document.getElementsByTagName('script')[0];
      firstExistingScript.parentNode.insertBefore(scriptElementForAppleIdAuth, firstExistingScript);
      console.log('Loaded appleid.auth.js');
      resolve(() => {
        oAuthLog('Initialized AppleID API Library');
        if (afterFunction) afterFunction();
      });
    }).catch((error) => console.error('An error occurred while loading Apple API', error));
  }
};

export default initializeAppleSDK;
