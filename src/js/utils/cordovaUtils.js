import React from 'react';
// import { createBrowserHistory, createHashHistory } from 'history';
// import { useHistory } from "react-router-dom";
import webAppConfig from '../config';
import { cordovaOffsetLog, oAuthLog } from './logging';
import { dumpObjProps } from './appleSiliconUtils';

/* global $  */

let androidPixels = 0;
let androidSizeString;
let polyfillsLoaded;


export function isCordova () {
  const { isCordovaGlobal } = window;
  return isCordovaGlobal === true;
}

export function isWebApp () {
  return !isCordova();
}

// export const history = isWebApp() ? createBrowserHistory() : createHashHistory();

export function isIOS () {
  if (isWebApp()) return false;
  // console.log("<><><><> uuid:  " + window.device.uuid);
  const { platform } = window.device || '';
  return isCordova() && platform === 'iOS';  // Ignore the "Condition is always false" warning.  This line works correctly.
}

export function isIOSAppOnMac () {
  if (isWebApp()) return false;
  const { isiOSAppOnMac } = window.device;
  // Our fork of cordova-plugin-device exposes the underlying native code variable isiOSAppOnMac
  return isiOSAppOnMac;
}

export function getProcessorArchitecture () {
  const { diagnostic: { getArchitecture } } = window.cordova.plugins;
  getArchitecture((arch) => {
    console.log(`Processor Architecture: ${arch}`);
    return arch;
  }, (error) => {
    console.error('cordova.plugins.diagnostic.getArchitecture threw: ', error);
    return 'error';
  });
}

export function dumpScreenAndDeviceFields () {
  dumpObjProps('window.screen', window.screen);
  dumpObjProps('window.device', window.device);
}

export function isAndroid () {
  if (isWebApp()) return false;
  const { platform } = window.device || '';
  return isCordova() && platform === 'Android';  // Ignore the "Condition is always false" warning.  This line works correctly.
}

// If history retention is not working, see TabWithPushHistory.jsx for an example of how to do it.
// See v5: https://reactrouter.com/native/api/Hooks/usehistory
// IMPORTANT:  The HTML5 window.history, is very different from the react-router V5 history, don't use window.history!
export function historyPush (route) {
  if (webAppConfig.LOG_ROUTING) {
    console.log(`historyPush ******** ${route} *******`);
  }
  global.weVoteGlobalHistory.push(route);
}

// Webapp image paths are "absolute" relative to the running webapp cwd,
// for Cordova, we need them to include the http path to the server.
// Note: You can point WE_VOTE_IMAGE_PATH_FOR_CORDOVA to your local webapp if you need
// images that are not yet on the production servers
export function cordovaDot (path) {
  if (isCordova()) {
    const { WE_VOTE_IMAGE_PATH_FOR_CORDOVA: imgPath } = webAppConfig;
    const adjustedPath = path.replace(/(?:.*?\.us)(.*?)(?:\/img.*?$)/gi, '');
    return `${imgPath}${adjustedPath}`;
  } else {
    return path;
  }
}

export function cordovaOpenSafariViewSub (requestURL, onExit) {
  //  console.log(`cordovaOpenSafariView -0000- requestURL: ${requestURL}`);
  if (isIOS()) {
    console.log(`cordovaOpenSafariView -1- requestURL: ${requestURL}`);
    SafariViewController.isAvailable(() => { // eslint-disable-line no-undef
      oAuthLog(`cordovaOpenSafariView requestURL: ${requestURL}`);
      SafariViewController.show({ // eslint-disable-line no-undef
        url: requestURL,
      },
      (result) => {
        if (result.event === 'opened') {
          oAuthLog(`cordovaOpenSafariView opened url: ${requestURL}`);
        } else if (result.event === 'loaded') {
          oAuthLog(`cordovaOpenSafariView URL result from loading: ${JSON.stringify(result)}`);
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
  } else {
    // Prior to Sept 2020, we used SafariViewController for iOS and Android, but subsequently some upgrade of
    // a Cordova plugin or platform, started requiring ChromeCustomTabs.  ChromeCustomTabs was not being installed
    // properly by the Java packaging tools. After more than a day of fussing with it, I forked
    // EddyVerbruggen/cordova-plugin-safariviewcontroller and modified the fork to be an iOS only plugin,
    // and then made setup the InAppBrowser be the external website opener for Android.
    // This will have to be revisited, especially when EddyVerbruggen/cordova-plugin-safariviewcontroller gets upgraded.
    window.cordova.InAppBrowser.open(requestURL, '_blank', 'location=yes');
  }
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

// webapp, webapp:iOS, webapp:Android
export function deviceTypeString () {
  let deviceString = isWebApp() ? 'webapp' : 'cordova';
  const { platform } = window.device || '';
  if (isCordova() && platform) {
    deviceString += `:${platform}`;
  }

  return deviceString;
}

let matchedDevice = false;
export function logMatch (device, byModel) {
  if (!matchedDevice) {
    cordovaOffsetLog(`Matched ------------ ${device} by ${byModel ? 'window.device.model' : 'pbakondyScreenSize'}${isIOSAppOnMac() ? ', but AppleSilicon detected' : ''}`);
    matchedDevice = true;
  }
}

// https://www.theiphonewiki.com/wiki/Models
// https://gist.github.com/adamawolf/3048717
// http://socialcompare.com/en/comparison/apple-iphone-product-line-comparison

export function getIOSSizeString () {
  //    iPhone:               iPhone       3G           3GS          4            4            4            4S
  const iPhone3p5inPhones = ['iPhone1,1', 'iPhone1,2', 'iPhone2,1', 'iPhone3,1', 'iPhone3,2', 'iPhone3,3', 'iPhone4,1'];
  //    iPhone:             5            5            5C           5C           5S           5S           SE
  const iPhone4inPhones = ['iPhone5,1', 'iPhone5,2', 'iPhone5,3', 'iPhone5,4', 'iPhone6,1', 'iPhone6,2', 'iPhone8,4'];
  //    iPhone:               6            6S           7            7            8             8             SE 2nd Gen
  const iPhone4p7inPhones = ['iPhone7,2', 'iPhone8,1', 'iPhone9,1', 'iPhone9,3', 'iPhone10,1', 'iPhone10,4', 'iPhone12,8'];
  //    iPhone:                 6 Plus       6S Plus      7 Plus       7Plus        8 Plus        8 Plus
  const isIPhone5p5inPhones = ['iPhone7,1', 'iPhone8,2', 'iPhone9,2', 'iPhone9,4', 'iPhone10,2', 'iPhone10,5'];
  //    iPhone:               X             X             XS            11 Pro
  const iPhone5p8inPhones = ['iPhone10,3', 'iPhone10,6', 'iPhone11,2', 'iPhone12,3'];
  //    iPhone:               XR            11
  const iPhone6p1inPhones = ['iPhone11,8', 'iPhone12,1'];
  //    iPhone:               XS Max        XS Max        11 Pro Max
  const iPhone6p5inPhones = ['iPhone11,4', 'iPhone11,6', 'iPhone12,5'];
  if (iPhone3p5inPhones.includes(window.device.model)) {
    return 'isIPhone3p5in';
  } else if (iPhone4inPhones.includes(window.device.model)) {
    return 'isIPhone4in';
  } else if (iPhone4p7inPhones.includes(window.device.model)) {
    return 'isIPhone4p7in';
  } else if (isIPhone5p5inPhones.includes(window.device.model)) {
    return 'isIPhone5p5in';
  } else if (iPhone5p8inPhones.includes(window.device.model)) {
    return 'isIPhone5p8in';
  } else if (iPhone6p1inPhones.includes(window.device.model)) {
    return 'isIPhone6p1in';
  } else if (iPhone6p5inPhones.includes(window.device.model)) {
    return 'isIPhone6p5in';
  }
  // If we are here, we know that the window.device.model was not matched to any phones we recognize.
  // So now we calculate based on screen size
  const { pbakondyScreenSize: size } = window;
  if ((size.height === '480' && size.width === '320') ||  // iPhone Original, 3, 3GS
      (size.height === '960' && size.width === '640')) {  // iPhone 4, 4S
    return 'isIPhone3p5in';
  } else if (size.height === '1136' && size.width === '640') {  // iPhone 5, 5c, 5s, SE
    return 'isIPhone4in';
  } else if (size.height === '1334' && size.width === '750') {  // iPhone 6, 6s, 7, 8, SE (2nd Gen)
    return 'isIPhone4p7in';
  } else if ((size.height === '1920' && size.width === '1080') ||  // iPhone 6 Plus, 6s Plus, 7 Plus, 8 Plus
            (size.height === '2208' && size.width === '1242')) {   // iPhone 8 Plus in simulator
    return 'isIPhone5p5in';
  } else if (size.height === '2436' && size.width === '1125') {  // iPhone X, XS, 11 Pro
    return 'isIPhone5p8in';
  } else if ((size.height === '1792' && size.width === '828') ||  // iPhone XR, 11 (11 as described on apple.com)
    (size.height === '1624' && size.width === '750')) {   // iPhone 11 in Simulator
    return 'isIPhone6p1in';
  } else if (size.height === '2688' && size.width === '1242') {  // iPhone XS Max, 11 Pro Max
    return 'isIPhone6p5in';
  }
  return '';
}

// 3.5" screen iPhones
export function isIPhone3p5in () {
  if (isIOS()) {
    if (getIOSSizeString() === 'isIPhone3p5in') {
      logMatch('isIPhone3p5in: iPhone 5s SE (3.5")', true);
      return true;
    }
  }
  return false;
}

// 4" screen iPhones, 326 ppi pixel density
export function isIPhone4in () {
  if (isIOS()) {
    if (getIOSSizeString() === 'isIPhone4in') {
      logMatch('isIPhone4in: iPhone 5s SE (4")', true);
      return true;
    }
  }
  return false;
}

// 4.7" screen iPhones, 326 ppi pixel density
export function isIPhone4p7in () {
  if (isIOS()) {
    if (getIOSSizeString() === 'isIPhone4p7in') {
      logMatch('isIPhone4p7in: iPhone 678 & SE2 (4.7")', true);
      return true;
    }
  }
  return false;
}

// 5.5" screen iPhones, 401 ppi pixel density
export function isIPhone5p5in () {
  if (isIOS()) {
    if (getIOSSizeString() === 'isIPhone5p5in') {
      logMatch('isIPhone5p5in: iPhone 678 Plus (5.5")', true);
      return true;
    }
  }
  return false;
}

// 5.8" screen iPhones, 458 ppi pixel density
export function isIPhone5p8in () {
  if (isIOS()) {
    if (getIOSSizeString() === 'isIPhone5p8in') {
      logMatch('isIPhone5p8in: iPhone X or Xs or 11 Pro (5.8")', true);
      return true;
    }
  }
  return false;
}

// 6.1" screen iPhones, 326 ppi pixel density
export function isIPhone6p1in () {
  if (isIOS()) {
    if (getIOSSizeString() === 'isIPhone6p1in') {
      logMatch('isIPhone6p1in: iPhone XR or 11 (6.1")', true);
      return true;
    }
  }
  return false;
}

// 6.5" screen iPhones, 458 ppi pixel density
export function isIPhone6p5in () {
  if (isIOS()) {
    if (getIOSSizeString() === 'isIPhone6p5in') {
      logMatch('isIPhone6p5in: iPhone XsMax or 11 Pro Max (6.5")', true);
      return true;
    }
  }
  return false;
}

export function isIPad () {
  if (isIOS() && !isIOSAppOnMac()) {
    if (window.device.model.substring(0, 4) === 'iPad') {
      logMatch('iPad', true);
      return true;
    } else {
      const ratio = window.devicePixelRatio || 1;
      const screen = {
        width: window.screen.width * ratio,
        height: window.screen.height * ratio,
      };
      /* eslint-disable no-extra-parens */
      if ((screen.width === 768 && screen.height === 1024) ||  // iPad, 9.7" 2010 and Gen 2, 2011 and Mini 2012
          (screen.width === 1536 && screen.height === 2048) || // iPad, 9.7" Gen 3 2012, Gen 4 2013, 2018 iPad, iPad Pro 2016, iPad Air 2013, and Mini Retina 2013
          (screen.width === 1668 && screen.height === 2224) || // iPad Pro 10.5" Gen 2  2017
          (screen.width === 1668 && screen.height === 2388) || // iPad Pro 11", iPad Pro 12.9" October 2018
          (screen.width === 2048 && screen.height === 2732)) { // iPad Pro 12.9" Gen 2, 2018
        logMatch('iPad', false);
        return true;
      }
    }
  }
  return false;
}

export function isIPadGiantSize () {
  if (!isIPad()) {
    return false;
  }
  const ratio = window.devicePixelRatio || 1;
  const screen = {
    width: window.screen.width * ratio,
    height: window.screen.height * ratio,
  };
  if (screen.width === 2048 && screen.height === 2732) { // iPad Pro 12.9" Gen 2, 2018
    logMatch('iPadGiantSize', true);
    return true;
  }
  return false;
}


export function hasIPhoneNotch () {
  return isIPhone5p8in() || isIPhone6p1in() || isIPhone6p5in();
}

export function isIOsSmallerThanPlus () {
  return isIPhone3p5in() || isIPhone4in() || isIPhone4p7in();
}

export function getAndroidSize () {
  if (androidSizeString !== undefined) {
    return androidSizeString;
  }
  const ratio = window.devicePixelRatio || 1;
  const aspectRatio = window.screen.height / window.screen.width;
  const screen = {
    width: window.screen.width * ratio,
    height: window.screen.height * ratio,
  };

  androidPixels = screen.width * screen.height;
  androidSizeString = 'default';
  const ratioString = parseFloat(ratio).toFixed(2);

  /* sm   = 480*800   =   384,000     Nexus One
     md   = 1080*1920 = 2,073,600     PixelXL, Nexus5X, Moto G5
     lg   = 1440*2560 = 3,686,400     Nexus6P
     xl   = 2560*1600 = 4,096,000     Nexus10 Tablet
     xl   = 1200*1920 = 2,306,705     Galaxy Tab A 10.1", ratio = 1.3312500715255737
     xl with AndroidNotch                 (for camera)
          = 1440*3201 = 4,609,440,    Samsung Galaxy S20 Ultra, ratio = 3
     fold = 1536*2152 = 3,305,372     Galaxy Fold 7.3", ratio = 2, aspectRatio ~= 1.401
     June 2019: detecting the Galaxy Tab A by ratio, is a bit of a hack, and could bite us someday if there was an android phone with a 1.33 ratio
  */

  if (window.device.model === 'Moto G (5) Plus') {
    logMatch('Moto G (5) Plus', true);
    androidSizeString = '--md';
  } else if (androidPixels < 3.4E6 && ratioString === '2.00' && aspectRatio > 1.4) {
    androidSizeString = '--fold';
  } else if (androidPixels > 3.7E6 || ratioString === '1.33') {
    androidSizeString = '--xl';
  } else if (androidPixels > 3E6) {
    androidSizeString = '--lg';
  } else if (androidPixels > 1E6) {
    androidSizeString = '--md';
  } else {
    androidSizeString = '--sm';
  }
  cordovaOffsetLog(`getAndroidSize(): ${androidSizeString}`);

  return androidSizeString;
}

export function hasAndroidNotch () {
  if (androidPixels === 4609440) {
    logMatch('Android Samsung Galaxy S20 Ultra detected by pixel size');
    return true;
  } else if (androidPixels === 4380480) {
    logMatch('Android Samsung Galaxy S10 plus detected by pixel size');
    return true;
  }
  return false;
}

export function isAndroidSizeSM () {
  if (isAndroid()) {
    if (getAndroidSize() === '--sm') {
      logMatch('isAndroidSizeSM: sm = 480*800 = 384,000      Nexus One', true);
      return true;
    }
  }
  return false;
}

export function isAndroidSizeMD () {
  if (isAndroid()) {
    if (getAndroidSize() === '--md') {
      logMatch('isAndroidSizeMD: md = 1080*1920 = 2,073,600  PixelXL, Nexus5X, Moto G5', true);
      return true;
    }
  }
  return false;
}

export function isAndroidSizeLG () {
  if (isAndroid()) {
    if (getAndroidSize() === '--lg') {
      logMatch('isAndroidSizeLG: lg = 1440*2560 = 3,686,400  Nexus6P', true);
      return true;
    }
  }
  return false;
}

export function isAndroidSizeXL () {
  if (isAndroid()) {
    if (getAndroidSize() === '--xl') {
      logMatch('isAndroidSizeXL: xl = 2560*1600 = 4,096,000  Nexus10 Tablet', true);
      return true;
    }
  }
  return false;
}

export function isAndroidSizeFold () {
  if (isAndroid()) {
    if (getAndroidSize() === '--fold') {
      logMatch('isAndroidSizeSM: based on aspect ratio, probably a Galaxy Fold 7.3"', true);
      return true;
    }
  }
  return false;
}

export function isAndroidTablet () {
  if (isAndroid()) {
    if (window.innerWidth > 768) {
      logMatch('isAndroidTablet: based on width"', true);
      return true;
    }
  }
  return false;
}

export function isWebAppHeight0to568 () {
  if (isWebApp()) {
    if (window && window.screen && window.screen.height <= 568) {
      logMatch('isWebApp0to568: iPhone5, iPhone SE', true);
      return true;
    }
  }
  return false;
}

export function isWebAppHeight569to667 () {
  if (isWebApp()) {
    if (window && window.screen && window.screen.height >= 569 && window.screen.height <= 667) {
      logMatch('isWebApp0to568: iPhone6/7/8', true);
      return true;
    }
  }
  return false;
}

export function isWebAppHeight668to736 () {
  if (isWebApp()) {
    if (window && window.screen && window.screen.height >= 668 && window.screen.height <= 736) {
      logMatch('isWebApp0to568: iPhone8Plus', true);
      return true;
    }
  }
  return false;
}

export function isWebAppHeight737to896 () {
  if (isWebApp()) {
    if (window && window.screen && window.screen.height >= 737 && window.screen.height <= 896) {
      logMatch('isWebApp0to568: iPhoneX/iPhone11 Pro Max', true);
      return true;
    }
  }
  return false;
}

export function isAndroidSimulator () {
  return window.location.href.startsWith('file:///android');
}

export function isCordovaButNotATablet () {
  return isCordova() && !isIPad() && !(getAndroidSize() !== '--xl');
}

export function isIOsSimulator () {
  return window.location.href.startsWith('file:///Users');
}

export function isSimulator () {
  return isAndroidSimulator() || isIOsSimulator();
}

// This block of code run when cordovaUils is loaded, and is not specifically called by a function
if (isSimulator()) {
  if (isAndroidSimulator()) {
    cordovaOffsetLog(`href on entry: ${window.location.href}`);
  } else {
    cordovaOffsetLog(`href on entry (first 60): ${window.location.href.slice(0, 60)}`);
    cordovaOffsetLog(`href on entry (last 60): ${window.location.href.slice(window.location.href.length - 60)}`);
  }
}

export function getToastClass () {
  let toastClass = '';
  if (hasIPhoneNotch()) {
    toastClass = 'app-toast-cordova__iphone-notch';
  } else if (isIOS()) {
    toastClass = 'app-toast-cordova__iphone';
  }

  // No adjustment needed for Android, it doesn't consider the top hardware menu part of the application area
  // cordovaOffsetLog(`Determine the toast conditional space classname: ${  toastClass}`);
  return toastClass;
}

export function getCordovaScreenHeight () {
  const { pbakondyScreenSize: size } = window;
  return isIPad() ? `${size.height / size.scale}px` : '100%';
}

export function prepareForCordovaKeyboard (callerString) {
  if (callerString && isCordova() && !isIOSAppOnMac()) {
    const fileName = callerString.substr(callerString.lastIndexOf('/') + 1);
    console.log(`prepareForCordovaKeyboard ^^^^^^^^^^ ${fileName}`);
    cordovaOffsetLog(`prepareForCordovaKeyboard ^^^^^^^^^^ ${fileName}`);
    $('#app').removeClass('app-wrapper').addClass('app-wrapper__cordova');
    $('body').css('height', '');
    $('.footroom-wrapper').css('display', 'none');
  }
}

export function restoreStylesAfterCordovaKeyboard (callerString) {
  if (callerString && isCordova() && !isIOSAppOnMac()) {
    const fileName = callerString.substr(callerString.lastIndexOf('/') + 1);
    cordovaOffsetLog(`restoreStylesAfterCordovaKeyboard vvvvvvvvvv ${fileName}`);
    $('#app').removeClass('app-wrapper__cordova').addClass('app-wrapper');
    $('body').css('height', getCordovaScreenHeight());
    $('.footroom-wrapper').css('display', '');
  }
}

export function setGlobalScreenSize (result) {
  // this is the place to override detected screen size if needed.
  console.log(`pbakondy/cordova-plugin-screensize height: ${result.height}, width:  ${result.width}, scale: ${result.scale}`);
  window.pbakondyScreenSize = result;
}

export function focusTextFieldAndroid () {
  if (isAndroid()) {
    prepareForCordovaKeyboard('AddFriendsByEmail');
  }
}

export function blurTextFieldAndroid () {
  if (isAndroid()) {
    restoreStylesAfterCordovaKeyboard('AddFriendsByEmail');
  }
}


export function chipLabelText (fullLabel) {
  if (isWebApp() && window.innerWidth < 350) { // iPhone SE/SE2/5 in Web Browser
    if (fullLabel === 'Federal') {
      return 'Fed';
    } else if (fullLabel === 'State') {
      return 'St';
    } else if (fullLabel === 'Measure') {
      return 'Meas';
    } else if (fullLabel === 'Local') {
      return 'Loc';
    }
  } else if (isWebApp() && window.innerWidth < 400) { // iPhone 6/7/8 in Web Browser
    if (fullLabel === 'Federal') {
      return 'Fed';
    }
  } else if (isCordova() && window.innerWidth < 400) { // iPhone SE/SE2/5 in Cordova
    if (fullLabel === 'Federal') {
      return 'Fed';
    }
  }
  return fullLabel;
}

export function snackOffset () {
  let snackOffsetValue = '75px !important';
  if (isCordova()) {
    // Detecting whether the share button is on the top or the bottom or not present, and whether
    // the snack is one, or two, lines tall is just not worth it.  So just use 20% in Cordova
    snackOffsetValue = '20% !important';
  }

  return snackOffsetValue;
}

export function setIconBadgeMessageCount (count) {
  // Count can be a string or an integer
  if (isCordova()) {
    const { cordova: { plugins: { firebase: { messaging: { setBadge } } } } } = window;
    // Not sure if this would do anything in Android
    setBadge(count);
  }
}

export function getIconBadgeMessageCount () {
  if (isCordova()) {
    const { cordova: { plugins: { firebase: { messaging: { getBadge } } } } } = window;
    return getBadge();
  }
  return -1;
}

export function polyfillFixes (file) {
  if (polyfillsLoaded) {
    return;   // Only load them once
  }
  polyfillsLoaded = true;
  console.log(`Polyfills have been installed from "${file}"`);
  // November 2, 2018:  Polyfill for "Object.entries"
  //   react-bootstrap 1.0 (bootstrap 4) relies on Object.entries in splitComponentProps.js
  //   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries#Polyfill
  if (!Object.entries) {
    Object.entries = function poly (obj) {
      const localProps = Object.keys(obj);
      let i = localProps.length;
      const resArray = new Array(i); // preallocate the Array
      while (i--) resArray[i] = [localProps[i], obj[localProps[i]]];
      return resArray;
    };
  }

  // And another for ObjectAssign
  if (!Object.assign) {
    Object.assign = React.__spread;
  }

  // And another for Microsoft Internet Explorer 11
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
  if (!String.prototype.includes) {
    // eslint-disable-next-line no-extend-native,func-names
    String.prototype.includes = function (search, start) {
      // eslint-disable-next-line
      'use strict';

      if (search instanceof RegExp) {
        throw TypeError('first argument must not be a RegExp');
      }
      // eslint-disable-next-line no-param-reassign
      if (start === undefined) { start = 0; }
      return this.indexOf(search, start) !== -1;
    };
  }

  // And yet, another for Microsoft Internet Explorer 11
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
  if (!String.prototype.startsWith) {
    // eslint-disable-next-line no-extend-native
    Object.defineProperty(String.prototype, 'startsWith', {
      // eslint-disable-next-line object-shorthand, func-names
      value: function (search, rawPos) {
        // eslint-disable-next-line no-var, no-bitwise
        var pos = rawPos > 0 ? rawPos | 0 : 0;
        return this.substring(pos, pos + search.length) === search;
      },
    });
  }
}

// In-line
polyfillFixes('cordovaUtils.js'); // Possibly redundant, but its need was confirmed in the debugger.  This has to run, before any polyfill is needed.
