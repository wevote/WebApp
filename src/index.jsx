import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// importStartCordovaToken -- Do not remove this line!

// The following line is rewritten to true by the buildSrcCordova.js node script
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
  // initializeCordovaToken -- Do not remove this line!
} else {
  startReact();
}

