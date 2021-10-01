import React from 'react';
import ReactDOM from 'react-dom';
import { getCordovaScreenHeight, isIPad } from './js/utils/cordovaUtils';
import App from './App';

const isIndexCordova = false;

function startReact () {
  ReactDOM.render(
    <App />,
    document.getElementById('app'),
  );

  module.hot.accept();
}

// Begin inline code

if (isIndexCordova) {
  document.addEventListener('deviceready', (id) => {
    window.isDeviceReady = true;
    console.log('Cordova:  Received Cordova Event: ', id.type);
    console.log(`Cordova:  Running cordova-${window.cordova.platformId}@${window.cordova.version}`);
    const { splashscreen } = navigator;
    splashscreen.hide();
    const { plugins: { screensize } } = window;
    screensize.get((result) => {
      console.log('screensize.get: ', result);
      // dumpObjProps('window.device', window.device);
      window.pbakondyScreenSize = result;
      if (isIPad()) {
        document.querySelector('body').style.height = getCordovaScreenHeight();
        console.log('Cordova: Initial "body" height for iPad = ', result.height / result.scale);
      }
      startReact();
    }, (result) => {
      console.log('Cordova: pbakondy/cordova-plugin-screensize FAILURE result: ', result);
    });
  }, false);
} else {
  startReact();
}

