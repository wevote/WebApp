import { browserHistory, hashHistory } from 'react-router';
import { oAuthLog } from './logging';
import { stringContains } from './textFormat';
/* global $  */

export function isWebApp () {
  const { cordova } = window;
  return cordova === undefined;
}

export function isCordova () {
  const { cordova } = window;
  return cordova !== undefined;
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
    return `.${path}`;
  } else {
    return path;
  }
}

function cordovaOpenSafariViewSub (requestURL, onExit) {
  // console.log("cordovaOpenSafariView -1- requestURL: " + requestURL);
  SafariViewController.isAvailable(() => { // eslint-disable-line no-undef
    oAuthLog(`cordovaOpenSafariView requestURL: ${requestURL}`);
    SafariViewController.show({ // eslint-disable-line no-undef
      url: requestURL,
    },

    (result) => {
      if (result.event === 'opened') {
        oAuthLog(`cordovaOpenSafariView opened url: ${requestURL}`);
      } else if (result.event === 'loaded') {
        oAuthLog(`cordovaOpenSafariView loaded url: ${JSON.stringify(result)}`);
      } else if (result.event === 'closed') {
        oAuthLog(`cordovaOpenSafariView closed: ${JSON.stringify(result)}`);
        if (onExit) {
          onExit();
        }
      }
    },

    (msg) => {
      oAuthLog(`cordovaOpenSafariView KO: ${JSON.stringify(msg)}`);
    });
  });
}

/**
 * https://github.com/EddyVerbruggen/cordova-plugin-safariviewcontroller (is installed in the WeVoteCordova project)
 * https://medium.com/@jlchereau/stop-using-inappbrowser-for-your-cordova-phonegap-oauth-flow-a806b61a2dc5
 * Sample: https://github.com/primashah/RHMAP-Keycloak-Crodova-Client/blob/03f31a2a0a23fb243b3d5095cd6ca6145b69df7b/www/js/keycloak.js
 * @param requestURL, the URL to open
 * @param onExit
 * @param timeout, a hack delay before invoking, but it fails without the timeout
 */
export function cordovaOpenSafariView (requestURL, onExit, timeout) {
  setTimeout(cordovaOpenSafariViewSub, timeout, requestURL, onExit);
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
  const rect = instance.getBoundingClientRect();

  // Please don't remove this console.log line
  console.log(`${objectNameString
  } BoundingClientRect: left ${rect.left
  }, top ${rect.top
  }, right ${rect.right
  }, bottom ${rect.bottom
  }, x ${rect.x
  }, y ${rect.y
  }, width ${rect.width
  }, height ${rect.height}`);
}

// webapp, webapp:iOS, webapp:Android
export function deviceTypeString () {
  let deviceString = isWebApp() ? 'webapp' : 'cordova';
  const { platform } = window.device || '';
  if (isCordova() && platform) {
    deviceString += `:${platform}`;
  }

  return deviceString;
}

export function isIOS () {
  const { platform } = window.device || '';
  return isCordova() && platform === 'iOS';
}

export function isIPhoneXorXS () {
  // Get the device pixel ratio
  const ratio = window.devicePixelRatio || 1;

  // Define the users device screen dimensions
  const screen = {
    width: window.screen.width * ratio,
    height: window.screen.height * ratio,
  };

  // iPhone X and XS are 1125 x 2436
  return isIOS() && (screen.width === 1125 && screen.height === 2436);
}

export function isIPhone678Plus () {
  const ratio = window.devicePixelRatio || 1;
  const screen = {
    width: window.screen.width * ratio,
    height: window.screen.height * ratio,
  };
  return isIOS() && screen.width === 1242 && screen.height === 2208;
}

export function isIPhone678 () {
  const ratio = window.devicePixelRatio || 1;
  const screen = {
    width: window.screen.width * ratio,
    height: window.screen.height * ratio,
  };
  return isIOS() && screen.width === 750 && screen.height === 1334;
}

export function isIPhoneXR () {
  const ratio = window.devicePixelRatio || 1;
  const screen = {
    width: window.screen.width * ratio,
    height: window.screen.height * ratio,
  };
  return isIOS() && screen.width === 828 && screen.height === 1792;
}

export function isIPhoneXSMax () {
  const ratio = window.devicePixelRatio || 1;
  const screen = {
    width: window.screen.width * ratio,
    height: window.screen.height * ratio,
  };
  // console.log("DEVICE width: " + screen.width + ",  height: " + screen.height);
  return isIOS() && screen.width === 1242 && screen.height === 2688;
}

export function isIPad () {
  const ratio = window.devicePixelRatio || 1;
  const screen = {
    width: window.screen.width * ratio,
    height: window.screen.height * ratio,
  };

  /* eslint-disable no-extra-parens */
  return isIOS() && (
    (screen.width === 768 && screen.height === 1024) ||  // iPad, 9.7" 2010 and Gen 2, 2011 and Mini 2012
    (screen.width === 1536 && screen.height === 2048) || // iPad, 9.7" Gen 3 2012, Gen 4 2013, 2018 iPad, iPad Pro 2016, iPad Air 2013, and Mini Retina 2013
    (screen.width === 1668 && screen.height === 2224) || // iPad Pro 10.5" Gen 2  2017
    (screen.width === 1668 && screen.height === 2388) || // iPad Pro 11", iPad Pro 12.9" October 2018
    (screen.width === 2048 && screen.height === 2732)    // iPad Pro 12.9" Gen 2, 2018
  );
}

export function hasIPhoneNotch () {
  return isIPhoneXorXS() || isIPhoneXR() || isIPhoneXSMax();
}

export function isAndroid () {
  const { platform } = window.device || '';
  return isCordova() && platform === 'Android';
}

export function getAndroidSize () {
  const ratio = window.devicePixelRatio || 1;
  const screen = {
    width: window.screen.width * ratio,
    height: window.screen.height * ratio,
  };

  const size = screen.width * screen.height;
  let sizeString = 'default';

  /* sm = 480*800 = 384,000      Nexus One
     md = 1080*1920 = 2,073,600  PixelXL, Nexus5X, Moto G5
     lg = 1440*2560 = 3,686,400  Nexus6P
     xl = 2560*1600 = 4,096,000  Nexus10 Tablet   */

  if (size > 3.7E6) {
    sizeString = '--xl';
  } else if (size > 3E6) {
    sizeString = '--lg';
  } else if (size > 1E6) {
    sizeString = '--md';
  } else {
    sizeString = '--sm';
  }
  return sizeString;
}

/**
 * Determine the headroom space at the top of the scrollable pane for the Application.jsx
 * This is not related to headroom.js
 * @param pathname
 * @returns {string}
 */
export function getAppBaseClass (pathname) {
  // console.log("Determine the headroom space pathname:" + pathname);
  let appBaseClass = 'app-base';
  if (isWebApp()) {
    appBaseClass += ' headroom-webapp';
  } else {
    appBaseClass += ' cordova-base';
    if (isIOS()) {
      appBaseClass += ' headroom-ios';
      if (hasIPhoneNotch()) {
        appBaseClass += '--notch';
      } else if (isIPhone678()) {
        appBaseClass += '--678';
      } else if (isIPhone678Plus()) {
        appBaseClass += '--678plus';
      } else { // iPad
        appBaseClass += '--ipad';
      }
    } else {
      appBaseClass += ' headroom-android';
      appBaseClass += getAndroidSize();
    }
  }
  if (stringContains('/ballot', pathname)) {
    appBaseClass += '--secondary';
  } else if (stringContains('/candidate/', pathname) ||
    (stringContains('/settings/', pathname) && isCordova()) ||
     stringContains('/measure/', pathname)) {
    appBaseClass += '--backto';
  } else {
    appBaseClass += '--full';
  }

  // console.log("Determine the headroom space classname:" + appBaseClass);
  return appBaseClass;
}

export function getToastClass () {
  let toastClass = '';
  if (hasIPhoneNotch()) {
    toastClass = 'app-toast-cordova__iphone-notch';
  } else if (isIOS()) {
    toastClass = 'app-toast-cordova__iphone';
  }

  // No adjustment needed for Android, it doesn't consider the top hardware menu part of the application area
  // console.log(`Determine the toast conditional space classname: ${  toastClass}`);
  return toastClass;
}

export function prepareForCordovaKeyboard (callerString) {
  if (callerString && isCordova()) {
    const fileName = callerString.substr(callerString.lastIndexOf('/') + 1);
    console.log(`prepareForCordovaKeyboard ^^^^^^^^^^ ${fileName}`);
    $('#app').removeClass('app-wrapper').addClass('app-wrapper__cordova');
    $('body').css('height', '');
    $('.footroom-wrapper').css('display', 'none');
  }
}

export function restoreStylesAfterCordovaKeyboard (callerString) {
  if (callerString && isCordova()) {
    const fileName = callerString.substr(callerString.lastIndexOf('/') + 1);
    console.log(`restoreStylesAfterCordovaKeyboard vvvvvvvvvv ${fileName}`);
    $('#app').removeClass('app-wrapper__cordova').addClass('app-wrapper');
    $('body').css('height', '100%');
    $('.footroom-wrapper').css('display', '');
  }
}
