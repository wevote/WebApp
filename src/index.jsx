import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { isAndroid } from './js/common/utils/cordovaUtils';
// importStartCordovaToken -- Do not remove this line!

// The following line is rewritten to true by the buildSrcCordova.js node script
const isIndexCordova = false;

function redirectIfWww () {
  if (window && window.location && window.location.href && window.location.href.includes('//www.')) {
    const oldURL = window.location.href;
    const newURL = oldURL.replace('//www.', '//');
    console.log(`index.jsx redirectIfWww, redirecting from ${oldURL} to ${newURL}`);
    window.location.href = newURL;
  }
}

function startReact () {
  ReactDOM.render(
    <App />,
    document.getElementById('app'),
  );

  try {
    const { hostname } = window.location;
    if (hostname && hostname === 'localhost' && !isAndroid()) {
      module.hot.accept();   // For Webpack
    }
  } catch (e) {
    console.log('Webpack\'s module.hot.accept() threw:', e);
  }
}

// Begin inline code

if (isIndexCordova) {
  // initializeCordovaToken -- Do not remove this line!
} else {
  redirectIfWww();
  startReact();
}

