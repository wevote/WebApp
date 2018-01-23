import React from "react";
import { render } from "react-dom";
import { browserHistory, hashHistory, Router, applyRouterMiddleware } from "react-router";
import { useScroll } from "react-router-scroll";

import routes from "./Root";
const webAppConfig = require("./config");

// polyfill
if (!Object.assign) {
  Object.assign = React.__spread;
}

function startApp() {
  // prevent keyboard scrolling our view
  // if (window.cordova && window.cordova.plugins.Keyboard) {
  //   window.cordova.plugins.Keyboard.disableScroll(true);
  //   window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
  // }

  render(<Router history={webAppConfig.IS_CORDOVA ? hashHistory : browserHistory } render={applyRouterMiddleware(useScroll(()=>true))}>
    { routes() }
  </Router>, document.getElementById("app"));
}

// wait for Apache Cordova to be ready, if cordova is available
if (window.cordova) {
  webAppConfig.IS_CORDOVA = true;
  document.addEventListener('deviceready', () => {
    startApp();
  }, false);
} else {  // browser
  startApp();
}
