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
  return isCordova() && platform === 'iOS';  // Ignore the "Condition is always false" warning.  This line works correctly.
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

// Sometimes in the simulator, an XSMax reports X sized screen, which messes things up
// There is a cordova window.device.model which reports "iPhone11,6" for a physical device, but unfortunately reports "x86_64" on the simulator
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
  return isCordova() && platform === 'Android';  // Ignore the "Condition is always false" warning.  This line works correctly.
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
    console.log(`cordovaScrollablePaneTopPadding: ${window.location.href}`);
  } else {
    console.log(`cordovaScrollablePaneTopPadding: ${window.location.href.slice(0, 50)}`);
    console.log(`cordovaScrollablePaneTopPadding: ${window.location.href.slice(50)}`);
  }
}

const enums = {
  ballotVote: 1,
  moreAbout: 2,
  moreHamburger: 3,
  valuesList: 4,
  officeWild: 100,
  settingsWild: 101,
  wevoteintroWild: 102,
  ballotSmHdrWild: 103,
  ballotLgHdrWild: 104,
  measureWild: 105,
  candidate: 200,
  friends: 201,
  opinions: 202,
  values: 203,
  defaultVal: 1000,
};

function pageEnumeration () {
  // second level paths must be tried first
  if (window.location.href.indexOf('/index.html#/ballot/vote') > 0) {
    return enums.ballotVote;
  } else if (window.location.href.indexOf('/index.html#/more/about') > 0) {
    return enums.moreAbout;
  } else if (window.location.href.indexOf('/index.html#/more/hamburger') > 0) {
    return enums.moreHamburger;
  } else if (window.location.href.indexOf('/index.html#/values/list') > 0) {
    return enums.valuesList;

  // then wildcarded second level paths
  } else if (window.location.href.indexOf('/index.html#/office/') > 0) {
    return enums.officeWild;
  } else if (window.location.href.indexOf('/index.html#/settings/') > 0) {
    return enums.settingsWild;
  } else if (window.location.href.indexOf('/index.html#/wevoteintro/') > 0) {
    return enums.wevoteintroWild;
  } else if (window.location.href.indexOf('/index.html#/ballot') > 0) {
    if ($('#allItemsCompletionLevelTab').length > 0) {
      return enums.ballotLgHdrWild;
    } else {
      return enums.ballotSmHdrWild;
    }
  } else if (window.location.href.indexOf('/index.html#/measure/') > 0) {
    return enums.measureWild;

    // then specific first level paths
  } if (window.location.href.indexOf('/index.html#/candidate') > 0) {
    return enums.candidate;
  } else if (window.location.href.indexOf('/index.html#/friends') > 0) {
    return enums.friends;
  } else if (window.location.href.indexOf('/index.html#/opinions') > 0) {
    return enums.opinions;
  } else if (window.location.href.indexOf('/index.html#/values') > 0) {
    return enums.values;
  }
  return enums.defaultVal;
}

// <Wrapper padTop={cordovaScrollablePaneTopPadding(__filename)}>
// renders approximately as ...  <div className="Ballot__Wrapper-sc-11u8kf3-0 dYbfmq"><div>
export function cordovaScrollablePaneTopPadding () {
  if (isSimulator()) {
    if (isAndroidSimulator()) {
      console.log(`cordovaScrollablePaneTopPadding android: ${window.location.href}`);
    } else {
      console.log(`cordovaScrollablePaneTopPadding iOS: ${window.location.href.slice(0, 50)}`);
      console.log(`cordovaScrollablePaneTopPadding iOS: ${window.location.href.slice(50)}`);
    }
  }

  if (isIOS()) {
    if (isIPad() || isIPhone678Plus()) {
      if (isSimulator()) {
        console.log('cordovaScrollablePaneTopPadding: is IPad or isIPhone678Plus');
      }
      switch (pageEnumeration()) {
        case enums.wevoteintroWild: return '18px';
        case enums.measureWild:     return '58px';
        case enums.candidate:       return '40px';
        case enums.ballotVote:      return '18px';
        case enums.officeWild:      return '64px';
        case enums.ballotSmHdrWild: return '130px';
        case enums.ballotLgHdrWild: return '4px';
        case enums.moreAbout:       return '22px';
        case enums.moreHamburger:   return isIPad() ? '15px' : '10px';
        case enums.settingsWild:    return isIPad() ? '15px' : '16px';
        default:                    return '0px';
      }
    } else if (isIPhone678()) {
      if (isSimulator()) {
        console.log('cordovaScrollablePaneTopPadding: isIPhone678');
      }
      switch (pageEnumeration()) {
        case enums.wevoteintroWild: return '18px';
        case enums.measureWild:     return '58px';
        case enums.candidate:       return '42px';
        case enums.ballotVote:      return '10px';
        case enums.officeWild:      return '62px';
        case enums.ballotSmHdrWild: return '126px';
        case enums.ballotLgHdrWild: return '5px';
        case enums.moreAbout:       return '22px';
        case enums.moreHamburger:   return '10px';
        case enums.settingsWild:    return '16px';
        default:                    return '0px';
      }
    } else if (isIPhoneXR()) {
      if (isSimulator()) {
        console.log('cordovaScrollablePaneTopPadding: isIPhoneXR');
      }
      switch (pageEnumeration()) {
        case enums.wevoteintroWild: return '32px';
        case enums.measureWild:     return '58px';
        case enums.candidate:       return '56px';
        case enums.officeWild:      return '76px';
        case enums.values:          return '10px';
        case enums.ballotVote:      return '30px';
        case enums.ballotSmHdrWild: return '150px';
        case enums.ballotLgHdrWild: return '18px';
        case enums.moreAbout:       return '22px';
        case enums.moreHamburger:   return '35px';
        case enums.settingsWild:    return '32px';
        default:                    return '0px';
      }
    } else if (isIPhoneXSMax()) {
      if (isSimulator()) {
        console.log('cordovaScrollablePaneTopPadding: isIPhoneXSMax');
      }
      switch (pageEnumeration()) {
        case enums.wevoteintroWild: return '32px';
        case enums.measureWild:     return '56px';
        case enums.candidate:       return '56px';
        case enums.officeWild:      return '76px';
        case enums.ballotVote:      return '18px';
        case enums.ballotSmHdrWild: return '22px';
        case enums.ballotLgHdrWild: return '22px';
        case enums.moreAbout:       return '22px';
        case enums.moreHamburger:   return '35px';
        case enums.settingsWild:    return '32px';
        default:                    return '0px';
      }
    } else if (hasIPhoneNotch()) {
      if (isSimulator()) {
        console.log('cordovaScrollablePaneTopPadding: hasIPhoneNotch');
      }
      switch (pageEnumeration()) {
        case enums.wevoteintroWild: return '32px';
        case enums.measureWild:     return '72px';
        case enums.candidate:       return '66px';
        case enums.opinions:        return '10px';
        case enums.officeWild:      return '76px';
        case enums.ballotVote:      return '30px';
        case enums.ballotSmHdrWild: return '150px';
        case enums.ballotLgHdrWild: return '16px';
        case enums.moreAbout:       return '22px';
        case enums.moreHamburger:   return '35px';
        case enums.settingsWild:    return '32px';
        default:                    return '0px';
      }
    }
  } else if (isAndroid()) {
    const sizeString = getAndroidSize();
    if (sizeString === '--xl') {
      if (isSimulator()) {
        console.log(`cordovaScrollablePaneTopPadding sizeString: ${sizeString}`);
      }
      switch (pageEnumeration()) {
        case enums.officeWild:      return '40px';
        case enums.measureWild:     return '40px';
        case enums.candidate:       return '20px';
        case enums.ballotSmHdrWild: return '108px';
        default:                    return '0px';
      }
    } else if (sizeString === '--lg') {
      switch (pageEnumeration()) {
        case enums.officeWild:      return '40px';
        case enums.measureWild:     return '40px';
        case enums.candidate:       return '16px';
        case enums.ballotSmHdrWild: return '104px';
        default:                    return '0px';
      }
    } if (sizeString === '--md') {
      switch (pageEnumeration()) {
        case enums.officeWild:      return '40px';
        case enums.measureWild:     return '40px';
        case enums.candidate:       return '22px';
        case enums.ballotSmHdrWild: return '108px';
        case enums.ballotVote:      return '16px';
        case enums.moreAbout:       return '22px';
        default:                    return '0px';
      }
    } else if (sizeString === '--sm') {
      switch (pageEnumeration()) {
        case enums.officeWild:      return '42px';
        case enums.measureWild:     return '42px';
        case enums.candidate:       return '24px';
        case enums.ballotSmHdrWild: return '130px';
        case enums.moreAbout:       return '22px';
        default:                    return '0px';
      }
    }
  }
  return '0px';
}

// <div className="page-content-container" style={{ marginTop: `${cordovaBallotFilterTopMargin()}` }}>
export function cordovaBallotFilterTopMargin () {
  if (isIOS()) {
    if (isIPhone678Plus()) {
      if (window.location.href.indexOf('/index.html#/ballot/vote') > 0) {
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
      if (window.location.href.indexOf('/index.html#/ballot/vote') > 0) {
        return '-12px';
      }
      return '32px';
    } else if (sizeString === '--md') {
      if (window.location.href.indexOf('/index.html#/ballot/vote') > 0) {
        return '-58px';
      }
      return '32px';
    } else if (sizeString === '--lg') {
      if (window.location.href.indexOf('/index.html#/ballot/vote') > 0) {
        return '-32px';
      }
      return '32px';
    } else if (sizeString === '--xl') {
      if (window.location.href.indexOf('/index.html#/ballot/vote') > 0) {
        return '-10px';
      }
      return '31px';
    }
  }
  return undefined;
}

// <div className="footer-container u-show-mobile-tablet" style={{ height: `${cordovaFooterHeight()}` }}>
export function cordovaFooterHeight () {
  if (isIOS()) {
    if (hasIPhoneNotch()) {
      return '67px';
    }
  }

  return undefined;
}

// URLs that end with a twitter handle...
// <div id="the styled div that follows is the wrapper for voter guide mode">
//   <Wrapper padTop={cordovaVoterGuideTopPadding()}>
export function cordovaVoterGuideTopPadding () {
  if (isIOS()) {
    if (isIPhone678Plus()) {
      return '0px';
    } else if (isIPhone678()) {
      return '0px';
    } else if (hasIPhoneNotch()) {
      return '18px';
    } else if (isIPad()) {
      return '8px';
    }
  } else if (isAndroid()) {
    return '0px';
  }
  return '0px';
}

// <div className="ballot__heading-vote-section " style="top: 112px; height: 90px;">
export function cordovaVoteMiniHeader () {
  if (isIOS()) {
    if (isIPhone678Plus()) {
      return {
        top: '94px',
        height: '90px',
      };
    } else if (isIPhone678()) {
      return {
        top: '92px',
        height: '90px',
      };
    } else if (hasIPhoneNotch()) {
      return {
        top: '112px',
        height: '90px',
      };
    } else if (isIPad()) {
      return {
        top: '94px',
        height: '90px',
      };
    }
  } else if (isAndroid()) {
    return {
      top: '72px',  // 72 for the one, was 32
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
    if (isSimulator()) {
      if (isAndroidSimulator()) {
        console.log(`cordovaTopHeaderTopMargin android: ${window.location.href}`);
      } else {
        console.log(`cordovaTopHeaderTopMargin iOS: ${window.location.href.slice(0, 50)}`);
        console.log(`cordovaTopHeaderTopMargin iOS: ${window.location.href.slice(50)}`);
      }
    }

    if (isIOS()) {
      if (isIPhone678Plus() || isIPhone678()) {
        switch (pageEnumeration()) {
          case enums.officeWild:      style.marginTop = '16px'; break;
          case enums.measureWild:     style.marginTop = '22px'; break;
          case enums.values:          style.marginTop = '16px'; break;
          case enums.friends:         style.marginTop = '16px'; break;
          case enums.ballot:          style.marginTop = '19px'; break;
          case enums.ballotVote:      style.marginTop = '19px'; break;
          case enums.settingsWild:    style.marginTop = '22px'; break;
          default:                    style.marginTop = '19px'; break;
        }
      } else if (hasIPhoneNotch()) {
        switch (pageEnumeration()) {
          case enums.officeWild:      style.marginTop = '30px'; break;
          case enums.measureWild:     style.marginTop = '34px'; break;
          case enums.candidate:       style.marginTop = '35px'; break;
          case enums.valuesList:      style.marginTop = '38px'; break;
          case enums.values:          style.marginTop = '12px'; break;
          case enums.opinions:        style.marginTop = '36px'; break;
          case enums.friends:         style.marginTop = '16px'; break;
          case enums.ballot:          style.marginTop = '16px'; break;
          case enums.ballotVote:      style.marginTop = '16px'; break;
          case enums.settingsWild:    style.marginTop = '38px'; break;
          default:                    style.marginTop = '16px'; break;
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

// <Wrapper cordovaPaddingTop={cordovaStickyHeaderPaddingTop()}>
export function cordovaStickyHeaderPaddingTop () {
  if (isIOS()) {
    if (isIPhone678Plus()) {
      return '62px';
    } else if (isIPhone678()) {
      return '62px';
    } else if (hasIPhoneNotch()) {
      return '76px';
    } else if (isIPad()) {
      return '62px';
    }
  } else if (isAndroid()) {
    const sizeString = getAndroidSize();
    if (isSimulator()) {
      console.log(`cordovaStickyHeaderPaddingTop sizeString: >${sizeString}<`);
    }
    if (sizeString === '--sm') {
      return '42px';
    } else if (sizeString === '--md') {
      return '40px';
    } else if (sizeString === '--lg') {
      return '38px';
    } else if (sizeString === '--xl') {
      return '31px';
    }
  }
  return '';
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
