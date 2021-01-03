import CordovaPageConstants from '../constants/CordovaPageConstants';
import { cordovaOffsetLog } from './logging';
import { pageEnumeration } from './cordovaUtilsPageEnumeration';
import {
  getAndroidSize, hasIPhoneNotch,
  isAndroid, isAndroidSimulator, isIOSAppOnMac, isCordova, isIOS, isIPad,
  isIPhone4in, isIPhone4p7in, isIPhone5p5in, isIPhone5p8in, isIPhone6p1in, isIPhone6p5in, isSimulator, isWebApp,
} from './cordovaUtils';


// <div className="page-content-container" style={{ marginTop: `${cordovaBallotFilterTopMargin()}` }}>
// This determines where the top of the "All", "Choices" and "Decided" tabs should start.
export function cordovaBallotFilterTopMargin () {
  if (isWebApp()) {
    return undefined;
  }

  const page = pageEnumeration();
  if (isIOS()) {
    if (isIPhone4p7in()) {
      return '65px';
    } else if (isIPhone5p5in()) {
      if (window.location.href.indexOf('/index.html#/ballot/vote') > 0) {
        return '55px';
      }
      return '69px';
    } else if (isIPhone5p8in()) {
      if (window.location.href.indexOf('/index.html#/friends') > 0) {
        return '76px';
      }
      return '86px';
    } else if (isIPhone6p1in()) {
      if (window.location.href.indexOf('/index.html#/friends') > 0) {
        return '79px';
      }
      if (window.location.href.indexOf('/index.html#/ballot/vote') > 0) {
        return '46px';
      }
      return '88px';
    } else if (isIPhone6p5in()) {
      if (window.location.href.indexOf('/index.html#/friends') > 0) {
        return '79px';
      }
      return '89px';
    } else if (hasIPhoneNotch()) {
      if (page === CordovaPageConstants.candidateWild) {
        return '65px';
      }
    } else if (isIOSAppOnMac()) {
      if (page === CordovaPageConstants.news) {
        return '69px';
      // } else if (pageEnumeration === CordovaPageConstants.friends) {
      //   return '0px'; // test hack
      }
      return '3px';
    } else if (isIPad()) {
      return '73px';
    } else if (isIPhone4in()) {
      return '67px';
    }
  } else if (isAndroid()) {
    const sizeString = getAndroidSize();
    if (sizeString === '--sm') {
      if (window.location.href.indexOf('/index.html#/ballot/vote') > 0) {
        return '-12px';
      } else if (window.location.href.indexOf('/index.html#/friends') > 0) {
        return '59px';
      }
      return '47px';
    } else if (sizeString === '--md') {
      if (window.location.href.indexOf('/index.html#/ballot/vote') > 0) {
        return '-58px';
      } else if (window.location.href.indexOf('/index.html#/friends') > 0) {
        return '56px';
      }
      return '49px';
    } else if (sizeString === '--lg') {
      if (window.location.href.indexOf('/index.html#/ballot/vote') > 0) {
        return '-32px';
      } else if (window.location.href.indexOf('/index.html#/friends') > 0) {
        return '61px';
      }
      return '55px';
    } else if (sizeString === '--xl') {
      if (window.location.href.indexOf('/index.html#/ballot/vote') > 0) {
        return '-10px';
      } else if (page === CordovaPageConstants.ballotSmHdrWild ||  // Not signed in
                 page === CordovaPageConstants.ballotLgHdrWild) {  // Signed in
        return '0';
      }
      return '52px';
    } else if (sizeString === '--fold') {
      if (page === 'news') {
        return '52px';
      }
      return '0px';
    }
  }
  return undefined;
}

export function cordovaNetworkNextButtonTop () {
  if (isIOS()) {
    if (isIPhone5p5in()) {
      return '89vh';
    } else if (isIPhone4p7in()) {
      return '89vh';
    } else if (hasIPhoneNotch()) {
      return '88vh';
    } else if (isIPad()) {
      return '89vh';
    } else if (isIPhone4in()) {
      return '88vh';
    }
  } else if (isAndroid()) {
    const sizeString = getAndroidSize();
    if (sizeString === '--xl') {
      return '89vh';
    }
  }
  return undefined;
}

// <div className="container-main">
export function cordovaContainerMainOverride () {
  if (isIOS()) {
    if (isIPhone6p5in()) {
      return '34px';
    }
  } else if (isAndroid()) {
    const sizeString = getAndroidSize();
    if (sizeString === '--fold') {
      return '0px';
    }
    if (sizeString === '--xl') {
      return '0px';
    }
    if (sizeString === '--lg') {
      return '0px';
    }
    if (sizeString === '--md') {
      return '0px';
    }
    if (sizeString === '--sm') {
      return '16px';
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
// This pushes down the voter guide organization Twitter banner - parallel to voterGuideWild
export function cordovaVoterGuideTopPadding () {
  if (isIOS()) {
    const page = pageEnumeration();
    if (isIPhone5p5in()) {
      return '11px';
    } else if (isIPhone4p7in()) {
      return '0px';
    } else if (hasIPhoneNotch()) {
      return '28px';
    } else if (isIPad()) {
      switch (page) {
        case CordovaPageConstants.news:             return '19px';
        case CordovaPageConstants.voterGuideWild:   return '26px';
        default:                                    return '0px';
      }
    }
  } else if (isAndroid()) {
    return '0px';
  }
  return '12px';
}

// <Toolbar classes={{ root: classes.toolbar }} disableGutters style={{ top: cordovaWelcomeAppToolbarTop() }}>
export function cordovaWelcomeAppToolbarTop () {
  if (isIOS()) {
    if (isIPhone5p5in()) {
      return '10px';
    } else if (isIPhone4p7in()) {
      return '10px';
    } else if (hasIPhoneNotch()) {
      return '14px';
    } else if (isIPad()) {
      return '10px';
    }
  } else if (isAndroid()) {
    return '0px';
  }
  return '0px';
}

// <div className="ballot__heading-vote-section " style="top: 112px; height: 90px;">
export function cordovaVoteMiniHeader () {
  if (isIOS()) {
    if (isIPhone4in()) {
      return {
        top: '69px',
        height: '127px',
      };
    } else if (isIPhone4p7in()) {
      return {
        top: '66px',
        height: '124px',
      };
    } else if (isIPhone5p5in()) {
      return {
        top: '69px',
        height: '127px',
      };
    } else if (isIPhone5p8in()) {
      return {
        top: '92px',
        height: '116px',
      };
    } else if (isIPhone6p1in()) {
      return {
        top: '94px',
        height: '125px',
      };
    } else if (isIPhone6p5in()) {
      return {
        top: '91px',
        height: '118px',
      };
    } else if (hasIPhoneNotch()) {
      return {
        top: '82px',
        height: '125px',
      };
    } else if (isIPad()) {
      return {
        top: '53px',
        height: '116px',
      };
    }
  } else if (isAndroid()) {
    const sizeString = getAndroidSize();
    if (sizeString === '--sm') {
      return {
        top: '53px',
        height: '134px !important',
      };
    }
    return {
      top: '53px',
      height: '116px',
    };
  }
  return undefined;
}

// <div className={pageHeaderStyle} style={cordovaTopHeaderTopMargin()} id="header-container">
// This is the margin above the "Back to" bars across the very top of the screen
export function cordovaTopHeaderTopMargin () {
  const style = {
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: '0',
  };
  const page = pageEnumeration();

  if (isCordova()) {
    if (isSimulator()) {
      if (isAndroidSimulator()) {
        cordovaOffsetLog(`cordovaTopHeaderTopMargin android: ${window.location.href}, page: ${page}`);
      } else {
        cordovaOffsetLog(`cordovaTopHeaderTopMargin iOS page: ${page}`);
        cordovaOffsetLog(`cordovaTopHeaderTopMargin iOS (first 60): ${window.location.href.slice(0, 60)}`);
        cordovaOffsetLog(`cordovaTopHeaderTopMargin iOS (last 60): ${window.location.href.slice(window.location.href.length - 60)}`);
      }
    }

    if (isIOS()) {
      if (isIPhone5p5in() || isIPhone4p7in()) {
        switch (page) {
          case CordovaPageConstants.officeWild:      style.marginTop = '16px'; break;
          case CordovaPageConstants.measureWild:     style.marginTop = '22px'; break;
          case CordovaPageConstants.values:          style.marginTop = '19px'; break;
          case CordovaPageConstants.valueWild:       style.marginTop = '22px'; break;
          case CordovaPageConstants.friends:         style.marginTop = '16px'; break;
          case CordovaPageConstants.ballotSmHdrWild: style.marginTop = '19px'; break;
          case CordovaPageConstants.ballotLgHdrWild: style.marginTop = '19px'; break;
          case CordovaPageConstants.ballotVote:      style.marginTop = '19px'; break;
          case CordovaPageConstants.settingsWild:    style.marginTop = '22px'; break;
          case CordovaPageConstants.voterGuideCreatorWild: style.marginTop = '38px'; break; // $headroom-wrapper-webapp__voter-guide-creator
          case CordovaPageConstants.twitterIdMFollowers:   style.marginTop = '37px'; break; // /*/m/friends, /*/m/following, /*/m/followers
          default:                          style.marginTop = '19px'; break;
        }
      } else if (hasIPhoneNotch()) {
        switch (page) {
          case CordovaPageConstants.officeWild:      style.marginTop = '36px'; break;
          case CordovaPageConstants.measureWild:     style.marginTop = '34px'; break;
          case CordovaPageConstants.candidate:       style.marginTop = '35px'; break;
          case CordovaPageConstants.candidateWild:   style.marginTop = '33px'; break;
          case CordovaPageConstants.valuesList:      style.marginTop = '38px'; break;
          case CordovaPageConstants.values:          style.marginTop = '16px'; break;
          case CordovaPageConstants.valueWild:       style.marginTop = '32px'; break;
          case CordovaPageConstants.opinions:        style.marginTop = '17px'; break;
          case CordovaPageConstants.friends:         style.marginTop = '16px'; break;
          case CordovaPageConstants.ballotSmHdrWild: style.marginTop = '16px'; break;
          case CordovaPageConstants.ballotLgHdrWild: style.marginTop = '16px'; break;
          case CordovaPageConstants.ballotVote:      style.marginTop = '16px'; break;
          case CordovaPageConstants.settingsAccount:       style.marginTop = '31px'; break;
          case CordovaPageConstants.settingsSubscription:  style.marginTop = '34px'; break;
          case CordovaPageConstants.settingsNotifications: style.marginTop = '36px'; break;
          case CordovaPageConstants.settingsWild:          style.marginTop = '38px'; break;
          case CordovaPageConstants.voterGuideCreatorWild: style.marginTop = '38px'; break; // $headroom-wrapper-webapp__voter-guide-creator
          case CordovaPageConstants.voterGuideWild:        style.marginTop = '38px'; break; // Any voter page with btcand or btmeas
          case CordovaPageConstants.twitterIdMFollowers:   style.marginTop = '37px'; break; // /*/m/friends, /*/m/following, /*/m/followers
          case CordovaPageConstants.twitterInfoPage:       style.marginTop = '32px'; break; // A twitter page guess, that ends with 'btcand' 'btmeas' or'btdb'
          default:                                         style.marginTop = '16px'; break;
        }
      } else if (isIOSAppOnMac()) {
        style.marginTop = '0px';
      } else if (isIPad()) {
        switch (page) {
          case CordovaPageConstants.defaultVal:            style.marginTop = '26px'; break;
          default:                                         style.marginTop = '0px'; break;
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
    if (isIPhone5p5in()) {
      return '71px';
    } else if (isIPhone4p7in()) {
      return '69px';
    } else if (isIPhone5p8in()) {
      return '83px';
    } else if (isIPhone6p1in()) {
      return '81px';
    } else if (isIPhone6p5in()) {
      return '81px';
    } else if (hasIPhoneNotch()) {
      return '76px';
    } else if (isIPad() || isIOSAppOnMac()) {
      return '77px';
    }
  } else if (isAndroid()) {
    const sizeString = getAndroidSize();
    if (isSimulator()) {
      cordovaOffsetLog(`cordovaStickyHeaderPaddingTop sizeString: >${sizeString}<`);
    }
    if (sizeString === '--sm') {
      return '48px';
    } else if (sizeString === '--md') {
      return '49px';
    } else if (sizeString === '--lg') {
      return '48px';
    } else if (sizeString === '--xl') {
      return '48px';
    }
  }
  return '';
}

export function cordovaSignInModalTopPosition (collapsed) {
  if (isIOS()) {
    if (isIPhone6p5in()) {                    //  11 Pro Max and XS Max
      return collapsed ? '01%' : '-25%';
    } else if (isIPhone6p1in()) {             // XR and 11
      return collapsed ? '01%' : '-25%';
    } else if (isIPhone5p8in()) {             //  X and 11 Pro
      return collapsed ? '300px' : '-206px';
    } else if (isIPhone5p5in()) {             //  6 Plus, 7 Plus and 8 Plus
      return collapsed ? '-3%' : '-170px';
    } else if (isIPhone4p7in()) {             // 6, 7, 8
      return collapsed ? 'unset' : '-24%';
    } else if (isIPhone4in()) {               // SE
      return collapsed ? '30px' : '-18%';
    } else if (isIPad()) {
      return collapsed ? '-5%' : '-22%';
    } else {
      return collapsed ? '-30%' : '-15%';
    }
  } else if (isAndroid()) {
    return collapsed ? '-30%' : '-25%';
  }
  return '';
}

export function shareBottomOffset (pinToBottom) {
  if (isIOS()) {
    if (hasIPhoneNotch()) {
      return pinToBottom ? '0' : '66px';
    }
  } else if (isAndroid()) {
    return pinToBottom ? '0px' : '57px';
  }

  // Default for all other devices, including desktop and mobile browsers
  return pinToBottom ? '0' : '57px';
}

export function cordovaFriendsWrapper () {
  if (isIOS()) {
    if (isIPhone5p8in()) {
      return {
        paddingTop: '69px',
        paddingBottom: '90px',
      };
    }
    if (isIPhone6p1in()) {
      return {
        paddingTop: '69px',
        paddingBottom: '0',
      };
    }
    if (isIPhone6p5in()) {
      if (window.location.href.indexOf('/index.html#/friends/invite') > 0) {
        return {
          paddingTop: '20%',
          paddingBottom: '0px',
        };
      }
      return {
        paddingTop: '81px',
        paddingBottom: '90px',
      };
    }
  }

  // Default for all other devices, including desktop and mobile browsers
  return {
    paddingTop: '60px',
    paddingBottom: '90px',
  };
}

export function cordovaNewsPaddingTop () {
  // if (isIOS()) {
  //   if (isIPhone6p5in()) {                    //  11 Pro Max and XS Max
  //     return '85px';
  //   } else if (isIPhone6p1in()) {             // XR and 11
  //     return '85px';
  //   } else if (isIPhone5p8in()) {             //  X and 11 Pro
  //     return '85px';
  //   } else if (isIPhone5p5in()) {             //  6 Plus, 7 Plus and 8 Plus
  //     return '68px';
  //   } else if (isIPhone4p7in()) {             // 6, 7, 8, SE (2nd Gen)
  //     return '65px';
  //   } else if (isIPhone4in()) {               // SE
  //     return '65px';
  //   } else if (isIPad()) {
  //     return '85px';
  //   } else {
  //     return '85px';
  //   }
  // } else if (isAndroid()) {
  //   return '44px';
  // }
  return '';
}

export function cordovaDrawerTopMargin () {
  if (isIOS()) {
    if (isIPhone4in() || isIPhone4p7in() || isIPhone5p5in()) {
      return '22px';
    } else if (hasIPhoneNotch()) {
      return '40px';
    } else if (isIPad()) {
      return '26px';
    }
  } else if (isAndroid()) {
    return '0px';
  }
  return '0px';
}
