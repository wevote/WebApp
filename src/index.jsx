import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { isIOS, isIPad, getCordovaScreenHeight } from './js/utils/cordovaUtils';

function startReactApp () {
  // console.log('STARTED index.jsx');
  ReactDOM.render(
    <App />,
    document.getElementById('app'),
  );

  module.hot.accept();
}

// If in Cordova, need this function before cordovaUtils might be loaded
function localIsCordova () {
  const { cordova } = window;
  window.isCordovaGlobal = cordova !== undefined;    // So now we set a global
  return cordova !== undefined;
}

function iOSCordovaSetup () {
  // http://harrymoreno.com/2015/07/14/Deploying-a-React-App-to-Cordova.html
  // console.log('Cordova startApp entry');
  // eslint-disable-next-line no-undef
  if (window.device && window.device.platform === 'iOS') {
    const { device, Keyboard, Keyboard: { shrinkView, disableScrollingInShrinkView }, screen } = window;
    // eslint-disable-next-line no-undef
    console.log('cordova startup device: ', device);
    console.log('cordova startup window.screen: ', screen);
    // dumpObjProps(window.device);

    // eslint-disable-next-line global-require
    window.$ = require('jquery');
    // console.log('cordova startup after require(\'jquery\')');

    // prevent keyboard scrolling our view, https://www.npmjs.com/package/cordova-plugin-keyboard
    if (Keyboard) {
      console.log('Cordova startupApp keyboard plugin found');
      shrinkView(true); // eslint-disable-line no-undef
      disableScrollingInShrinkView(true); // eslint-disable-line no-undef
    } else console.log('ERROR: Cordova index.js startApp keyboard plugin WAS NOT found');
  }
}

// >>>>>>>>>>>>>> beginning of inline startup code <<<<<<<<<<
console.log('index.jsx loaded');

// ServiceWorker setup for Workbox Progressive Web App (PWA)
// if ('ENABLE_WORKBOX_SERVICE_WORKER' in webAppConfig &&
//   webAppConfig.ENABLE_WORKBOX_SERVICE_WORKER &&
//   'serviceWorker' in navigator) {
//   // console.log('Cordova index.js ENABLE_WORKBOX_SERVICE_WORKER');
//
//   window.addEventListener('load', () => {
//     // Preload /ballot/vote so that it will be in cache even if the first visit is while offline
//     caches.open('WeVoteSVGCache').then((cache) => {
//       cache.match('/ballot/vote').then((response) => {
//         if (!response) {
//           cache.add('/ballot/vote');
//         }
//       });
//     });
//     navigator.serviceWorker.register('/sw.js');
//   });
// }
//
// NOT NEEDED if (isWebApp()) {
//   document.addEventListener('AppleIDSignInOnSuccess', (data) => {
//     console.log('AppleIDSignInOnSuccessListener index.js data:', data);
//   });
//   document.addEventListener('AppleIDSignInOnFailure', (error) => {
//     console.log('AppleIDSignInOnFailureListener index.js ERROR:', error);
//   });
// }

// If Apache Cordova is available, wait for it to be ready, otherwise start the WebApp
if (localIsCordova()) {
  document.addEventListener('deviceready', (id) => {
    window.isDeviceReady = true;
    console.log('Received Cordova Event: ', id.type);
    const { splashscreen } = navigator;
    splashscreen.hide();
    const { plugins: { screensize } } = window;
    screensize.get((result) => {
      console.log('screensize.get: ', result);
      // dumpObjProps('window.device', window.device);
      window.pbakondyScreenSize = result;
      if (isIPad()) {
        document.querySelector('body').style.height = getCordovaScreenHeight();
        console.log('------------Initial "body" height for iPad = ', result.height  / result.scale);
      } else if (isIOS()) {
        iOSCordovaSetup();
      }
      startReactApp();
    }, (result) => {
      console.log('pbakondy/cordova-plugin-screensize FAILURE result: ', result);
    });
  }, false);
} else { // browser
  // console.log('startApp for the WebApp (not for Cordova)');
  startReactApp();
}
