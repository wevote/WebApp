import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { isAndroid } from './js/common/utils/cordovaUtils';
// importStartCordovaToken -- Do not remove this line!

// The following line is rewritten to true by the buildSrcCordova.js node script
const isIndexCordova = false;

function redirectToStandardizedWeVoteUrl () {
  if (window && window.location && window.location.href) {
    console.log(window.location);
    const oldURL = window.location.href;
    let changeFound = false;
    // hostname we can take down to all lower case, but we don't want to take href down to all lower case
    let newHostname = window.location.hostname.toLowerCase();
    // For testing
    // if (window.location.hostname.toLowerCase().includes('localhost')) {
    //   newHostname = newHostname.replace('localhost', 'localhost2');
    //   changeFound = true;
    // }
    if (window.location.hostname.toLowerCase().includes('//www.')) {
      newHostname = newHostname.replace('//www.', '//');
      changeFound = true;
    }
    if (window.location.hostname.toLowerCase().includes('wevote.org')) {
      newHostname = newHostname.replace('wevote.org', 'wevote.us');
      changeFound = true;
    }
    if (changeFound) {
      // Take hostname to all lower case, but leave the rest of the URL with original case
      const newURL = oldURL.replace(window.location.hostname, newHostname);
      console.log(`index.jsx redirectToStandardizedWeVoteUrl, redirecting from ${oldURL} to ${newURL}`);
      window.location.replace(newURL);
    }
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
  redirectToStandardizedWeVoteUrl();
  startReact();
}

