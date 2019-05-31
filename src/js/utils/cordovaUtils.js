import { browserHistory, hashHistory } from 'react-router';
import { oAuthLog } from './logging';
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
  return isIOS() && screen.width === 750 && screen.height === 1624;
}

export function isIPhoneXSMax () {
  const ratio = window.devicePixelRatio || 1;
  const screen = {
    width: window.screen.width * ratio,
    height: window.screen.height * ratio,
  };
  // console.log("DEVICE width: " + screen.width + ",  height: " + screen.height);
  return isIOS() && (
    (screen.width === 1242 && screen.height === 2688));
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

// <Wrapper padTop={cordovaScrollablePaneTopPadding(__filename)}>
// renders approximately as ...  <div class="sc-ifAKCX kFFaGy">
export function cordovaScrollablePaneTopPadding (filePath) {
  const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
  if (isIOS()) {
    if (isIPad() || isIPhone678Plus()) {
      if (window.location.href.indexOf('/index.html#/wevoteintro/') > 0) {
        return '18px';
      } else if (window.location.href.indexOf('index.html#/candidate') > 0) {
        return '40px';
      } else  if (window.location.href.indexOf('/index.html#/values') > 0) {
        return '0px';
      } else if (window.location.href.indexOf('/index.html#/friends') > 0) {
        return '0px';
      } else if (window.location.href.indexOf('index.html#/ballot/vote') > 0) {
        return '0px';
      } else if (fileName === 'Application.jsx') {
        return '60px';
      } else if (fileName === 'Ballot.jsx') {
        return '130px';
      } else {
        return '0px';
      }
    } else if (isIPhone678()) {
      if (window.location.href.indexOf('/index.html#/wevoteintro/') > 0) {
        return '18px';
      } else if (window.location.href.indexOf('index.html#/candidate') > 0) {
        return '42px';
      } else if (window.location.href.indexOf('/index.html#/values') > 0) {
        return '0px';
      } else if (window.location.href.indexOf('/index.html#/friends') > 0) {
        return '0px';
      } else if (window.location.href.indexOf('index.html#/ballot/vote') > 0) {
        return '0px';
      } else if (fileName === 'Application.jsx') {
        return '62px';
      } else if (fileName === 'Ballot.jsx') {
        return '124px';
      } else {
        return '0px';
      }
    } else if (isIPhoneXR()) {
      if (window.location.href.indexOf('/index.html#/wevoteintro/') > 0) {
        return '32px';
      } if (window.location.href.indexOf('index.html#/candidate') > 0) {
        return '56px';
      } else if (window.location.href.indexOf('/index.html#/values') > 0) {
        return '10px';
      } else if (window.location.href.indexOf('/index.html#/friends') > 0) {
        return '0px';
      } else if (window.location.href.indexOf('index.html#/ballot/vote') > 0) {
        return '0px';
      } else if (fileName === 'Application.jsx') {
        return '80px';
      } else if (fileName === 'Ballot.jsx') {
        return '150px';
      } else {
        return '0px';
      }
    } else if (isIPhoneXSMax()) {
      if (window.location.href.indexOf('/index.html#/wevoteintro/') > 0) {
        return '32px';
      } if (window.location.href.indexOf('index.html#/candidate') > 0) {
        return '56px';
      } else if (window.location.href.indexOf('/index.html#/values') > 0) {
        return '0px';
      } else if (window.location.href.indexOf('/index.html#/friends') > 0) {
        return '0px';
      } else if (window.location.href.indexOf('index.html#/ballot/vote') > 0) {
        return '0px';
      } else if (fileName === 'Application.jsx') {
        return '80px';
      } else if (fileName === 'Ballot.jsx') {
        return '22px';
      } else {
        return '0px';
      }
    } else if (hasIPhoneNotch()) {
      if (window.location.href.indexOf('/index.html#/wevoteintro/') > 0) {
        return '32px';
      } else if (window.location.href.indexOf('index.html#/candidate') > 0) {
        return '66px';
      } else if (window.location.href.indexOf('/index.html#/values') > 0) {
        return '0px';
      } else if (window.location.href.indexOf('/index.html#/friends') > 0) {
        return '0px';
      } else if (window.location.href.indexOf('index.html#/ballot/vote') > 0) {
        return '0px';
      } else if (fileName === 'Application.jsx') {
        return '80px';
      } else if (fileName === 'Ballot.jsx') {
        return '150px';
      } else {
        return '0px';
      }
    }
  } else if (isAndroid()) {
    const sizeString = getAndroidSize();
    if (sizeString === '--xl') {
      if (window.location.href.indexOf('index.html#/office/') > 0) {
        return '40px';
      } else if (window.location.href.indexOf('index.html#/candidate') > 0) {
        return '20px';
      } else if (window.location.href.indexOf('/index.html#/values') > 0) {
        return '0px';
      } else if (window.location.href.indexOf('/index.html#/friends') > 0) {
        return '0px';
      } else if (fileName === 'Application.jsx') {
        return '45px';
      } else if (fileName === 'Ballot.jsx') {
        return '108px';
      } else {
        return '0px';
      }
    } else if (sizeString === '--lg') {
      if (window.location.href.indexOf('index.html#/office/') > 0) {
        return '40px';
      } else if (window.location.href.indexOf('index.html#/candidate') > 0) {
        return '16px';
      } else if (window.location.href.indexOf('/index.html#/values') > 0) {
        return '0px';
      } else if (window.location.href.indexOf('/index.html#/friends') > 0) {
        return '0px';
      } else if (window.location.href.indexOf('index.html#/ballot/vote') > 0) {
        return '0px';
      } else  if (window.location.href.indexOf('/index.html#/wevoteintro/') > 0) {
        return '0px';
      } else if (fileName === 'Application.jsx') {
        return '0px';
      } else if (fileName === 'Ballot.jsx') {
        return '104px';
      } else {
        return '0px';
      }
    } if (sizeString === '--md') {
      if (window.location.href.indexOf('index.html#/office/') > 0) {
        return '40px';
      } else if (window.location.href.indexOf('/index.html#/values') > 0) {
        return '0px';
      } else if (window.location.href.indexOf('/index.html#/friends') > 0) {
        return '0px';
      } else if (window.location.href.indexOf('index.html#/ballot/vote') > 0) {
        return '16px';
      } else  if (window.location.href.indexOf('/index.html#/wevoteintro/') > 0) {
        return '0px';
      } else if (fileName === 'Application.jsx') {
        return '18px';
      } else if (fileName === 'Ballot.jsx') {
        return '104px';
      } else {
        return '0px';
      }
    } else if (sizeString === '--sm') {
      if (window.location.href.indexOf('index.html#/candidate') > 0) {
        return '24px';
      } else if (window.location.href.indexOf('/index.html#/values') > 0) {
        return '0px';
      } else if (window.location.href.indexOf('/index.html#/friends') > 0) {
        return '0px';
      } else  if (window.location.href.indexOf('/index.html#/wevoteintro/') > 0) {
        return '0px';
      } else if (fileName === 'Application.jsx') {
        return '45px';
      } else if (fileName === 'Ballot.jsx') {
        return '130px';
      } else {
        return '0px';
      }
    }
  }
  return '0px';
}

// <div className="page-content-container" style={{ marginTop: `${cordovaBallotFilterTopMargin()}` }}>
export function cordovaBallotFilterTopMargin () {
  if (isIOS()) {
    if (isIPhone678Plus()) {
      if (window.location.href.indexOf('index.html#/ballot/vote') > 0) {
        return '55px';
      }
      return '53px';
    } else if (isIPhone678()) {
      return '53px';
    } else if (hasIPhoneNotch()) {
      return '74px';
    } else if (isIPad()) {
      return '54px';
    }
  } else if (isAndroid()) {
    const sizeString = getAndroidSize();
    if (sizeString === '--sm') {
      if (window.location.href.indexOf('index.html#/ballot/vote') > 0) {
        return '-12px';
      }
      return '32px';
    } else if (sizeString === '--md') {
      if (window.location.href.indexOf('index.html#/ballot/vote') > 0) {
        return '-58px';
      }
      return '32px';
    } else if (sizeString === '--lg') {
      if (window.location.href.indexOf('index.html#/ballot/vote') > 0) {
        return '-32px';
      }
      return '32px';
    } else if (sizeString === '--xl') {
      if (window.location.href.indexOf('index.html#/ballot/vote') > 0) {
        return '-10px';
      }
      return '31px';
    }
  }
  return undefined;
}

export function cordovaVoteMiniHeader () {
  if (isIOS()) {
    if (isIPhone678Plus()) {
      return {
        top: '54px',
        height: '90px',
      };
    } else if (isIPhone678()) {
      return {
        top: '56px',
        height: '90px',
      };
    } else if (hasIPhoneNotch()) {
      return {
        top: '78px',
        height: '90px',
      };
    } else if (isIPad()) {
      return {
        top: '56px',
        height: '90px',
      };
    }
  } else if (isAndroid()) {
    return {
      top: '32px',
      height: '90px',
    };
  }
  return undefined;
}

// <div className={pageHeaderStyle} style={cordovaTopHeaderTopMargin()} id="header-container">
export function cordovaTopHeaderTopMargin () {
  const style = {
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: '0',
  };

  if (isCordova()) {
    // console.log(`cordovaTopHeaderTopMargin: ${window.location.href.slice(50)}`);
    // console.log(`cordovaTopHeaderTopMargin: ${window.location.href.slice(0, 50)}`);
    if (isIOS()) {
      if (isIPhone678Plus() || isIPhone678()) {
        if (window.location.href.indexOf('index.html#/office') > 0) {
          style.marginTop = '16px';
        } else if (window.location.href.indexOf('/index.html#/values') > 0) {
          style.marginTop = '16px';
        } else if (window.location.href.indexOf('/index.html#/friends') > 0) {
          style.marginTop = '16px';
        } else if (window.location.href.indexOf('index.html#/ballot/vote') > 0) {
          style.marginTop = '19px';
        } else if (window.location.href.indexOf('index.html#/ballot') > 0) {
          style.marginTop = '19px';
        } else {
          style.marginTop = '19px';
        }
      } else if (hasIPhoneNotch()) {
        if (window.location.href.indexOf('/index.html#/values') > 0) {
          style.marginTop = '16px';
        } else if (window.location.href.indexOf('index.html#/office') > 0) {
          style.marginTop = '30px';
        } else if (window.location.href.indexOf('/index.html#/values') > 0) {
          style.marginTop = '8px';
        } else if (window.location.href.indexOf('/index.html#/friends') > 0) {
          style.marginTop = '16px';
        } else if (window.location.href.indexOf('index.html#/ballot/vote') > 0) {
          style.marginTop = '16px';
        } else if (window.location.href.indexOf('index.html#/ballot') > 0) {
          style.marginTop = '16px';
        } else {
          style.marginTop = '34px';
        }
      } else {
        style.marginTop = '20px';
      }
    } else {  // Android
      style.marginTop = '-2px';
    }
    return style;
  }

  return undefined;
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
