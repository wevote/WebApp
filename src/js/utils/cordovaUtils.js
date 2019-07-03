import { browserHistory, hashHistory } from 'react-router';
import { cordovaOffsetLog, oAuthLog } from './logging';
import webAppConfig from '../config';

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

export function cordovaOpenSafariViewSub (requestURL, onExit) {
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

export function isDeviceMatchByUUID (deviceString) {
  const array  = webAppConfig.CORDOVA_IPHONE_UUIDS;
  for (let i = 0; i < array.length; i++) {
    if (array[i].name === deviceString) {
      if (array[i].val === window.device.uuid) {
        return 1;
      }
      return 0;
    }
  }
  // alert('CORDOVA_IPHONE_UUIDS does not contain a key for this device type');
  cordovaOffsetLog(`CORDOVA_IPHONE_UUIDS does not contain a key for the ${deviceString} device type`);
  return 0;
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
  if (isWebApp()) return false;
  // console.log("<><><><> uuid:  " + window.device.uuid);
  const { platform } = window.device || '';
  return isCordova() && platform === 'iOS';  // Ignore the "Condition is always false" warning.  This line works correctly.
}

export function isAndroid () {
  if (isWebApp()) return false;
  const { platform } = window.device || '';
  return isCordova() && platform === 'Android';  // Ignore the "Condition is always false" warning.  This line works correctly.
}

// https://www.theiphonewiki.com/wiki/Models

export function isIPhone1234 () {
  return !!(isIOS() && (
    window.device.model === 'iPhone1,1' ||  // iPhone
    window.device.model === 'iPhone1,2' ||  // iPhone 3G
    window.device.model === 'iPhone2,1' ||  // iPhone 3GS
    window.device.model === 'iPhone3,1' ||  // iPhone 4
    window.device.model === 'iPhone3,2' ||  // iPhone 4
    window.device.model === 'iPhone3,3' ||  // iPhone 4
    window.device.model === 'iPhone4,1'));  // iPhone 4S
}

export function isIPhone5sSE () {
  if (isIOS()) {
    if (window.device.model === 'iPhone5,1' ||  // iPhone 5
      window.device.model === 'iPhone5,2' ||  // iPhone 5
      window.device.model === 'iPhone5,3' ||  // iPhone 5c
      window.device.model === 'iPhone5,4' ||  // iPhone 5c
      window.device.model === 'iPhone6,1' ||  // iPhone 5s
      window.device.model === 'iPhone6,2' ||  // iPhone 5s
      window.device.model === 'iPhone8,4') { // iPhone SE
      cordovaOffsetLog('Matched ---- iPhone 5s SE by window.device.model');
      return true;
    } else if (isDeviceMatchByUUID('i5s')) {
      cordovaOffsetLog('Matched ---- iPhone 5s by uuid');
      return true;
    }
  }
  return false;
}

export function isIPhone678 () {
  if (isIOS()) {
    if (window.device.model === 'iPhone7,2' ||  // iPhone 6
      window.device.model === 'iPhone8,1' ||  // iPhone 6s
      window.device.model === 'iPhone9,1' ||  // iPhone 7
      window.device.model === 'iPhone9,3' ||  // iPhone 7
      window.device.model === 'iPhone10,1' ||  // iPhone 8
      window.device.model === 'iPhone10,4') { // iPhone 8
      cordovaOffsetLog('Matched ---- iPhone 678 by window.device.model');
      return true;
    } else if (isDeviceMatchByUUID('i6')) {
      cordovaOffsetLog('Matched ---- iPhone 6 by uuid');
      return true;
    } else if (isDeviceMatchByUUID('i6s')) {
      cordovaOffsetLog('Matched ---- iPhone 6s by uuid');
      return true;
    } else if (isDeviceMatchByUUID('i8')) {
      cordovaOffsetLog('Matched ---- iPhone 8 by uuid');
      return true;
    }
  }
  return false;
}


export function isIPhone678Plus () {
  if (isIOS()) {
    if (window.device.model === 'iPhone7,1'  ||  // iPhone 6Plus
        window.device.model === 'iPhone8,2'  ||  // iPhone 6s Plus
        window.device.model === 'iPhone9,2'  ||  // iPhone 7 Plus
        window.device.model === 'iPhone9,4'  ||  // iPhone 7 Plus
        window.device.model === 'iPhone10,2' ||  // iPhone 8 Plus
        window.device.model === 'iPhone10,5') {  // iPhone 8 Plus
      cordovaOffsetLog('Matched ---- iPhone 678 Plus by window.device.model');
      return true;
    } else if (isDeviceMatchByUUID('i8plus')) {
      cordovaOffsetLog('Matched ---- iPhone i8plus by uuid');
      return true;
    }
  }
  return false;
}

export function isIPhoneXorXS () {
  if (isIOS()) {
    if (window.device.model === 'iPhone10,3' ||  // iPhone X
        window.device.model === 'iPhone10,6' ||  // iPhone X
        window.device.model === 'iPhone11,2') {  // iPhone XS
      cordovaOffsetLog('Matched ---- iPhone X or Xs by window.device.model');
      return true;
    } else if (isDeviceMatchByUUID('iX')) {
      cordovaOffsetLog('Matched ---- iPhone X by uuid');
      return true;
    }
  }
  return false;
}

export function isIPhoneXR () {
  if (isIOS()) {
    if (window.device.model === 'iPhone11,8') { // iPhone XR
      cordovaOffsetLog('Matched ---- iPhone XR by window.device.model');
      return true;
    } else if (isDeviceMatchByUUID('iXR')) {
      cordovaOffsetLog('Matched ---- iPhone XR by uuid');
      return true;
    }
  }
  return false;
}

// Sometimes in the simulator, an XSMax reports X sized screen, which messes things up
// There is a cordova window.device.model which reports "iPhone11,6" for a physical device, but unfortunately reports "x86_64" on the simulator
export function isIPhoneXSMax () {
  if (isIOS()) {
    if (window.device.model === 'iPhone11,6') { // iPhone XS Max
      cordovaOffsetLog('Matched ---- iPhone XsMax by window.device.model');
      return true;
    } else if (isDeviceMatchByUUID('iXsMax')) {
      cordovaOffsetLog('Matched ---- iPhone iXsMax by uuid');
      return true;
    }
  }
  return false;
}

export function isIPad () {
  if (isIOS()) {
    if (window.device.model.substring(0, 4) === 'iPad') {
    // June 2019, save this, we will need it, if we need to distinguish between types of iPads
    // window.device.model === 'iPad4,1'  ||  // iPad Air
    // window.device.model === 'iPad4,2'  ||  // iPad Air
    // window.device.model === 'iPad4,3'  ||  // iPad Air
    // window.device.model === 'iPad5,3'  ||  // iPad Air 2
    // window.device.model === 'iPad5,4'  ||  // iPad Air 2
    // window.device.model === 'iPad6,7'  ||  // iPad Pro (12.9-inch)
    // window.device.model === 'iPad6,8'  ||  // iPad Pro (12.9-inch)
    // window.device.model === 'iPad6,3'  ||  // iPad Pro (9.7-inch)
    // window.device.model === 'iPad6,4'  ||  // iPad Pro (9.7-inch)
    // window.device.model === 'iPad6,11' ||  // iPad (5th generation)
    // window.device.model === 'iPad6,12' ||  // iPad (5th generation)
    // window.device.model === 'iPad7,1'  ||  // iPad Pro (12.9-inch) (2nd generation)
    // window.device.model === 'iPad7,2'  ||  // iPad Pro (12.9-inch) (2nd generation)
    // window.device.model === 'iPad7,3'  ||  // iPad Pro (10.5-inch)
    // window.device.model === 'iPad7,4'  ||  // iPad Pro (10.5-inch)
    // window.device.model === 'iPad7,5 ' ||  // iPad (6th generation)
    // window.device.model === 'iPad7,6 ' ||  // iPad (6th generation)
    // window.device.model === 'iPad8,1'  ||  // iPad Pro (11-inch)
    // window.device.model === 'iPad8,2'  ||  // iPad Pro (11-inch)
    // window.device.model === 'iPad8,3'  ||  // iPad Pro (11-inch)
    // window.device.model === 'iPad8,4'  ||  // iPad Pro (11-inch)
    // window.device.model === 'iPad8,5'  ||  // iPad Pro (11-inch)
    // window.device.model === 'iPad8,6'  ||  // iPad Pro (11-inch)
    // window.device.model === 'iPad8,5'  ||  // iPad Pro (12.9-inch) (3rd generation)
    // window.device.model === 'iPad8,7'  ||  // iPad Pro (12.9-inch) (3rd generation)
    // window.device.model === 'iPad8,8'  ||  // iPad Pro (12.9-inch) (3rd generation)
    // window.device.model === 'iPad11,3' ||  // iPad Air (3rd generation)
    // window.device.model === 'iPad11,4' ||  // iPad Air (3rd generation)
    // window.device.model === 'iPad4,7'  ||  // iPad mini 3
    // window.device.model === 'iPad4,8'  ||  // iPad mini 3
    // window.device.model === 'iPad4,9'  ||  // iPad mini 3
    // window.device.model === 'iPad5,1'  ||  // iPad mini 4
    // window.device.model === 'iPad5,2'  ||  // iPad mini 4
    // window.device.model === 'iPad11,1' ||  // iPad mini (5th generation)
    // window.device.model === 'iPad11,2')) { // iPad mini (5th generation)
      cordovaOffsetLog('Matched ---- iPad by window.device.model');
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
        cordovaOffsetLog('Matched ---- iPad by screen dimensions');
        return true;
      }
    }
  }
  return false;
}

export function hasIPhoneNotch () {
  return isIPhoneXorXS() || isIPhoneXR() || isIPhoneXSMax();
}

export function isIOsSmallerThanPlus () {
  return isIPhone1234() || isIPhone5sSE() || isIPhone678();
}

export function getAndroidSize () {
  const ratio = window.devicePixelRatio || 1;
  const screen = {
    width: window.screen.width * ratio,
    height: window.screen.height * ratio,
  };

  const size = screen.width * screen.height;
  let sizeString = 'default';
  const ratioString = parseFloat(ratio).toFixed(2);

  /* sm = 480*800 = 384,000      Nexus One
     md = 1080*1920 = 2,073,600  PixelXL, Nexus5X, Moto G5
     lg = 1440*2560 = 3,686,400  Nexus6P
     xl = 2560*1600 = 4,096,000  Nexus10 Tablet
     xl = 1200 x 1920 = 2,306,705 Galaxy Tab A 10.1", ratio = 1.3312500715255737
     June 2019: detecting the Galaxy Tab A by ratio, is a bit of a hack, and could bite us someday if there was an android phone with a 1.33 ratio */

  if (window.device.model === 'Moto G (5) Plus') {
    cordovaOffsetLog('Matched ---- Moto G (5) Plus by window.device.model');
    return '--md';
  } else if (size > 3.7E6 || ratioString === '1.33') {
    sizeString = '--xl';
  } else if (size > 3E6) {
    sizeString = '--lg';
  } else if (size > 1E6) {
    sizeString = '--md';
  } else {
    sizeString = '--sm';
  }
  cordovaOffsetLog(`getAndroidSize(): ${sizeString}`);

  return sizeString;
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

if (isSimulator()) {
  if (isAndroidSimulator()) {
    cordovaOffsetLog(`cordovaScrollablePaneTopPadding: ${window.location.href}`);
  } else {
    cordovaOffsetLog(`cordovaScrollablePaneTopPadding: ${window.location.href.slice(0, 40)}`);
    cordovaOffsetLog(`cordovaScrollablePaneTopPadding: ${window.location.href.slice(window.location.href.indexOf('WeVoteCordova.app') - 1)}`);
  }
}

export const enums = {
  ballotVote: 1,
  moreAbout: 2,
  moreHamburger: 3,
  moreTools: 4,
  moreTerms: 5,
  valuesList: 6,
  officeWild: 100,
  settingsWild: 101,
  wevoteintroWild: 102,
  ballotSmHdrWild: 103,
  ballotLgHdrWild: 104,
  measureWild: 105,
  welcomeWild: 106,
  candidate: 200,
  friends: 201,
  opinions: 202,
  values: 203,
  defaultVal: 1000,
};

export function pageEnumeration () {
  const { href } = window.location;

  // second level paths must be tried first
  if (href.indexOf('/index.html#/ballot/vote') > 0) {
    return enums.ballotVote;
  } else if (href.indexOf('/index.html#/more/about') > 0) {
    return enums.moreAbout;
  } else if (href.indexOf('/index.html#/more/privacy') > 0 ||
             href.indexOf('/index.html#/more/terms') > 0) {
    return enums.moreTerms;
  } else if (href.indexOf('/index.html#/more/hamburger') > 0) {
    return enums.moreHamburger;
  } else if (href.indexOf('/index.html#/settings/tools') > 0) {
    return enums.moreTools;
  } else if (href.indexOf('/index.html#/values/list') > 0) {
    return enums.valuesList;

  // then wildcarded second level paths
  } else if (href.indexOf('/index.html#/office/') > 0) {
    return enums.officeWild;
  } else if (href.indexOf('/index.html#/settings/') > 0) {
    return enums.settingsWild;
  } else if (href.indexOf('/index.html#/wevoteintro/') > 0) {
    return enums.wevoteintroWild;
  } else if (href.indexOf('/index.html#/ballot') > 0) {
    if ($('#allItemsCompletionLevelTab').length > 0) {
      return enums.ballotLgHdrWild;
    } else {
      return enums.ballotSmHdrWild;
    }
  } else if (href.indexOf('/index.html#/measure/') > 0) {
    return enums.measureWild;

    // then specific first level paths
  } if (href.indexOf('/index.html#/candidate') > 0) {
    return enums.candidate;
  } else if (href.indexOf('/index.html#/friends') > 0) {
    return enums.friends;
  } else if (href.indexOf('/index.html#/opinions') > 0) {
    return enums.opinions;
  } else if (href.indexOf('/index.html#/values') > 0) {
    return enums.values;
  } else if (href.indexOf('/index.html#/welcome') > 0 ||
             href.indexOf('/index.html#/for-organizations') > 0 ||
             href.indexOf('/index.html#/for-campaigns') > 0 ||
             href.indexOf('/index.html#/more/pricing') > 0 ||
             href.indexOf('/index.html#/how') > 0) {
    return enums.welcomeWild;
  }
  return enums.defaultVal;
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

export function prepareForCordovaKeyboard (callerString) {
  if (callerString && isCordova()) {
    const fileName = callerString.substr(callerString.lastIndexOf('/') + 1);
    cordovaOffsetLog(`prepareForCordovaKeyboard ^^^^^^^^^^ ${fileName}`);
    $('#app').removeClass('app-wrapper').addClass('app-wrapper__cordova');
    $('body').css('height', '');
    $('.footroom-wrapper').css('display', 'none');
  }
}

export function restoreStylesAfterCordovaKeyboard (callerString) {
  if (callerString && isCordova()) {
    const fileName = callerString.substr(callerString.lastIndexOf('/') + 1);
    cordovaOffsetLog(`restoreStylesAfterCordovaKeyboard vvvvvvvvvv ${fileName}`);
    $('#app').removeClass('app-wrapper__cordova').addClass('app-wrapper');
    $('body').css('height', '100%');
    $('.footroom-wrapper').css('display', '');
  }
}

