import React from "react";
import { render } from "react-dom";
import { browserHistory, hashHistory, Router, applyRouterMiddleware } from "react-router";
import { useScroll } from "react-router-scroll";
import { isCordova } from "./utils/cordovaUtils";
import routes from "./Root";

// polyfill
if (!Object.assign) {
  Object.assign = React.__spread;
}

function startApp () {
  // prevent keyboard scrolling our view
  // if (window.cordova && window.cordova.plugins.Keyboard) {
  //   window.cordova.plugins.Keyboard.disableScroll(true);
  //   window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
  // }

  // http://harrymoreno.com/2015/07/14/Deploying-a-React-App-to-Cordova.html
  if (window.device && device.platform === "iOS") {   // eslint-disable-line no-undef
    console.log("cordova startup device: " + device); // eslint-disable-line no-undef
    console.log("cordova startup window.screen: ", window.screen);

    //styles.base.paddingTop = '20px';
  }

  render(<Router history={isCordova() ? hashHistory : browserHistory } render={applyRouterMiddleware(useScroll(()=>true))}>
    { routes() }
  </Router>, document.getElementById("app"));
}

// If Apache Cordova is available, wait for it to be ready, otherwise start the WebApp
if (isCordova()) {
  document.addEventListener("deviceready", () => {
    startApp();
  }, false);
} else {  // browser
  startApp();
}
