import { browserHistory, hashHistory } from "react-router";

export function isWebApp () {
  return window.cordova === undefined;
}

export function isCordova () {
  return window.cordova !== undefined;
}

// see https://github.com/ReactTraining/react-router/blob/v3/docs/guides/Histories.md
export function historyPush (route) {
  // console.log("historyPush, route:", route);
  if (isCordova()) {
    hashHistory.push(route);
  } else {
    browserHistory.push(route);
  }
}

export function cordovaDot (path) {
  if (isCordova()) {
    return "." + path;
  } else {
    return path;
  }
}

function cordovaOpenSafariViewSub (requestURL) {
  SafariViewController.isAvailable(function () {                      // eslint-disable-line no-undef
    console.log("cordovaOpenSafariView requestURL: " + requestURL);
    SafariViewController.show({                                       // eslint-disable-line no-undef
        url: requestURL,
      },

      function (result) {
        if (result.event === "opened") {
          console.log("cordovaOpenSafariView opened url " + requestURL);
        } else if (result.event === "loaded") {
          console.log("cordovaOpenSafariView loaded url " + JSON.stringify(result));
        } else if (result.event === "closed") {
          console.log("cordovaOpenSafariView closed" + JSON.stringify(result));
        }
      },

      function (msg) {
        console.log("cordovaOpenSafariView KO: " + JSON.stringify(msg));
      }
    );
  });
}

/**
 * https://github.com/EddyVerbruggen/cordova-plugin-safariviewcontroller (is installed in the WeVoteCordova project)
 * https://medium.com/@jlchereau/stop-using-inappbrowser-for-your-cordova-phonegap-oauth-flow-a806b61a2dc5
 * Sample: https://github.com/primashah/RHMAP-Keycloak-Crodova-Client/blob/03f31a2a0a23fb243b3d5095cd6ca6145b69df7b/www/js/keycloak.js
 * @param requestURL, the URL to open
 * @param timeout, a hack delay before invoking, but it fails without the timeout
 */
export function cordovaOpenSafariView (requestURL, timeout) {
  setTimeout(cordovaOpenSafariViewSub, timeout, requestURL);
}

/*
  bottom, Set or retrieves the bottom coordinate of the rectangle surrounding the object content. (relative to top of screen)
  height, Gets the height of the rectangle that surrounds the object content.
  left, Sets or retrieves the left coordinate of the rectangle surrounding the object content. (relative to left of screen)
  length, Sets or retrieves the number of objects in a collection.
  right, Sets or retrieves the right coordinate of the rectangle surrounding the object content. (relative to left of screen)
  top, Sets or retrieves the top coordinate of the rectangle surrounding the object content. (relative to top of screen)
  width, Gets the width of the rectangle that surrounds the object content.
  ----
  Needed in div you want to get the rectangle info from:
       <div className={profilePopUpOpen} ref={ (el) => (this.instance = el) }>
  Then ...
    componentDidMount () {
      enclosingRectangle("HeaderBarProfilePopUp, ", this.instance);
    }
*/
export function enclosingRectangle (objectNameString, instance) {
  let rect = instance.getBoundingClientRect();
  // console.log(objectNameString +
  //   " BoundingClientRect: left " + rect.left +
  //   ", top " + rect.top +
  //   ", right " + rect.right +
  //   ", bottom " + rect.bottom +
  //   ", x " + rect.x +
  //   ", y " + rect.y +
  //   ", width " + rect.width +
  //   ", height " + rect.height);
}

// webapp, webapp:iOS, webapp:Android
export function deviceTypeString () {
  let deviceString = isWebApp() ? "webapp" : "cordova";
  if (isCordova() && window.device) {
    deviceString += ":" + device.platform;
  }

  return deviceString;
}
