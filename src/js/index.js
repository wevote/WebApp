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

  // http://harrymoreno.com/2015/07/14/Deploying-a-React-App-to-Cordova.html
  if (window.device && device.platform === "iOS") {   // eslint-disable-line no-undef
    console.log("cordova startup device: " + device); // eslint-disable-line no-undef
    console.log("cordova startup window.screen: ", window.screen);

    window.$ = require("jquery");

  // March 22, 2018, maybe not needed anymore after today's Cordova install refresh?
  //   // prevent keyboard scrolling our view, https://www.npmjs.com/package/cordova-plugin-keyboard
  //   if (window.Keyboard) {
  //     console.log("Cordova startupApp keyboard plugin found");
  //     Keyboard.shrinkView(true);
  //
  //     window.addEventListener("keyboardDidShow", function () {
  //       document.activeElement.scrollIntoView();
  //     });
  //   } else console.log("ERROR: Cordova index.js startApp keyboard plugin WAS NOT found");
  }

  render(<Router history={isCordova() ? hashHistory : browserHistory}
                 render={applyRouterMiddleware(useScroll(() => true))}>
    {routes()}
  </Router>, document.getElementById("app"));
}

// If Apache Cordova is available, wait for it to be ready, otherwise start the WebApp
if (isCordova()) {
  document.addEventListener("deviceready", (id) => {
    console.log('Received Cordova Event: ', id.type);
    startApp();
  }, false);
} else {  // browser
  startApp();
}
