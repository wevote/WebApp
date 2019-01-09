import React from "react";
import { render } from "react-dom";
import {
  browserHistory, hashHistory, Router, applyRouterMiddleware,
} from "react-router";
import { MuiThemeProvider } from '@material-ui/core/styles';
import { useScroll } from "react-router-scroll";
import { isCordova } from "./utils/cordovaUtils";
import routes from "./Root";
import theme from './mui-theme';

// December 2018:  We want to work toward being airbnb style compliant, but for now these are disabled in this file to minimize massive changes
/* eslint global-require: 1 */
/* eslint no-undef: 1 */
/* eslint react/jsx-filename-extension: 1 */

// polyfill
if (!Object.assign) {
  Object.assign = React.__spread;
}

function startApp () {
  // http://harrymoreno.com/2015/07/14/Deploying-a-React-App-to-Cordova.html
  if (window.device && device.platform === "iOS") {
    console.log(`cordova startup device: ${device}`);
    console.log("cordova startup window.screen: ", window.screen);

    window.$ = require("jquery");

    // prevent keyboard scrolling our view, https://www.npmjs.com/package/cordova-plugin-keyboard
    if (window.Keyboard) {
      console.log("Cordova startupApp keyboard plugin found");
      Keyboard.shrinkView(true); // eslint-disable-line no-undef
      Keyboard.disableScrollingInShrinkView(true); // eslint-disable-line no-undef
    } else console.log("ERROR: Cordova index.js startApp keyboard plugin WAS NOT found");
  }

  render(
    <MuiThemeProvider theme={theme}>
      <Router
        history={isCordova() ? hashHistory : browserHistory}
        render={applyRouterMiddleware(useScroll(() => true))}
      >
        {routes()}
      </Router>
    </MuiThemeProvider>, document.getElementById("app"),
  );
}

// If Apache Cordova is available, wait for it to be ready, otherwise start the WebApp
if (isCordova()) {
  document.addEventListener("deviceready", (id) => {
    console.log("Received Cordova Event: ", id.type);
    navigator.splashscreen.hide();
    startApp();
  }, false);
} else { // browser
  startApp();
}
