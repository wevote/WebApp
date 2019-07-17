import { isCordova, isIOS, isAndroid, isAndroidSimulator, isSimulator, getAndroidSize, pageEnumeration, enums,
  isIPhone5sSE, isIPhone678, isIPhone678Plus, hasIPhoneNotch, isIPhoneXR,  isIPhoneXSMax, isIPad } from './cordovaUtils';
import { cordovaOffsetLog } from './logging';
/* global $  */

// <Wrapper padTop={cordovaScrollablePaneTopPadding()}>
// renders approximately as ...  <div className="Ballot__Wrapper-sc-11u8kf3-0 dYbfmq"><div>
// <VoteContainer padTop={cordovaScrollablePaneTopPadding()}>   /index.html#/ballot/vote
export function cordovaScrollablePaneTopPadding () {
  if (isSimulator()) {
    if (isAndroidSimulator()) {
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding android: ${window.location.href}`);
    } else {
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding iOS: ${window.location.href.slice(0, 40)}`);
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding iOS: ${window.location.href.slice(window.location.href.indexOf('WeVoteCordova.app') - 1)}`);
    }
  }
  const isSignedIn = $('#profileAvatarHeaderBar').length > 0;

  if (isIOS()) {
    if (isIPhone5sSE()) {
      if (isSimulator()) {
        cordovaOffsetLog('cordovaScrollablePaneTopPadding: isIPhone5sSE');
      }
      switch (pageEnumeration()) {
        case enums.wevoteintroWild: return '18px';
        case enums.measureWild:     return '42px';
        case enums.candidate:       return '42px';
        case enums.ballotVote:      return '131px';
        case enums.officeWild:      return isSignedIn ? '71px' : '62px';
        case enums.ballotSmHdrWild: return '153px';
        case enums.ballotLgHdrWild: return '24px';
        case enums.moreAbout:       return '22px';
        case enums.moreTerms:       return '40px';
        case enums.welcomeWild:     return '10px';
        case enums.moreHamburger:   return '10px';
        case enums.moreTools:       return '44px';
        case enums.settingsWild:    return '16px';
        default:                    return '0px';
      }
    } else if (isIPhone678()) {
      if (isSimulator()) {
        cordovaOffsetLog('cordovaScrollablePaneTopPadding: isIPhone678');
      }
      switch (pageEnumeration()) {
        case enums.wevoteintroWild: return '18px';
        case enums.measureWild:     return '58px';
        case enums.candidate:       return '42px';
        case enums.ballotVote:      return isSignedIn ? '123px' : '122px';
        case enums.officeWild:      return '62px';
        case enums.ballotSmHdrWild: return isSignedIn ? '153px' : '152px';
        case enums.ballotLgHdrWild: return '28px';
        case enums.moreAbout:       return '22px';
        case enums.moreTerms:       return '40px';
        case enums.welcomeWild:     return '10px';
        case enums.moreHamburger:   return '10px';
        case enums.moreTools:       return '44px';
        case enums.settingsWild:    return '16px';
        default:                    return '0px';
      }
    } else if (isIPhone678Plus()) {
      if (isSimulator()) {
        cordovaOffsetLog('cordovaScrollablePaneTopPadding: isIPhone678Plus');
      }
      switch (pageEnumeration()) {
        case enums.wevoteintroWild: return '18px';
        case enums.measureWild:     return '58px';
        case enums.candidate:       return '40px';
        case enums.ballotVote:      return '131px';
        case enums.officeWild:      return '64px';
        case enums.ballotSmHdrWild: return '140px';
        case enums.ballotLgHdrWild: return '11px';
        case enums.moreAbout:       return '22px';
        case enums.moreTerms:       return '44px';
        case enums.welcomeWild:     return '22px';
        case enums.moreHamburger:   return '10px';
        case enums.moreTools:       return '44px';
        case enums.settingsWild:    return '16px';
        default:                    return '0px';
      }
    } else if (isIPhoneXR()) {
      if (isSimulator()) {
        cordovaOffsetLog('cordovaScrollablePaneTopPadding: isIPhoneXR');
      }
      switch (pageEnumeration()) {
        case enums.wevoteintroWild: return '32px';
        case enums.measureWild:     return '58px';
        case enums.candidate:       return '56px';
        case enums.officeWild:      return '76px';
        case enums.values:          return '10px';
        case enums.ballotVote:      return isSignedIn ? '137px' : '139px';
        case enums.ballotSmHdrWild: return '161px';
        case enums.ballotLgHdrWild: return '33px';
        case enums.moreAbout:       return '22px';
        case enums.moreTerms:       return '60px';
        case enums.welcomeWild:     return '22px';
        case enums.moreHamburger:   return '35px';
        case enums.moreTools:       return '44px';
        case enums.settingsWild:    return '32px';
        default:                    return '0px';
      }
    } else if (isIPhoneXSMax()) {
      if (isSimulator()) {
        cordovaOffsetLog('cordovaScrollablePaneTopPadding: isIPhoneXSMax');
      }
      switch (pageEnumeration()) {
        case enums.wevoteintroWild: return '32px';
        case enums.measureWild:     return '56px';
        case enums.candidate:       return '56px';
        case enums.officeWild:      return '76px';
        case enums.ballotVote:      return isSignedIn ? '139px' : '147px';
        case enums.ballotSmHdrWild: return '162px';
        case enums.ballotLgHdrWild: return '34px';
        case enums.moreAbout:       return '22px';
        case enums.moreTerms:       return '60px';
        case enums.welcomeWild:     return '22px';
        case enums.moreHamburger:   return '35px';
        case enums.moreTools:       return '44px';
        case enums.settingsWild:    return '32px';
        default:                    return '0px';
      }
    } else if (hasIPhoneNotch()) {
      if (isSimulator()) {
        cordovaOffsetLog(`cordovaScrollablePaneTopPadding: hasIPhoneNotch -- signed in: ${isSignedIn}`);
      }
      switch (pageEnumeration()) {
        case enums.wevoteintroWild: return '32px';
        case enums.measureWild:     return '72px';
        case enums.candidate:       return '66px';
        case enums.opinions:        return '10px';
        case enums.officeWild:      return '76px';
        case enums.ballotVote:      return isSignedIn ? '136px' : '139px';
        case enums.ballotSmHdrWild: return '159px';
        case enums.ballotLgHdrWild: return '34px';
        case enums.moreAbout:       return '22px';
        case enums.moreTerms:       return '60px';
        case enums.welcomeWild:     return '22px';
        case enums.moreHamburger:   return '35px';
        case enums.moreTools:       return '44px';
        case enums.settingsWild:    return '32px';
        default:                    return '0px';
      }
    } else if (isIPad()) {
      if (isSimulator()) {
        cordovaOffsetLog('cordovaScrollablePaneTopPadding: is IPad');
      }
      switch (pageEnumeration()) {
        case enums.wevoteintroWild: return '18px';
        case enums.measureWild:     return '58px';
        case enums.candidate:       return '40px';
        case enums.ballotVote:      return '10px';
        case enums.officeWild:      return '64px';
        case enums.ballotSmHdrWild: return '129px';
        case enums.ballotLgHdrWild: return '4px';
        case enums.moreAbout:       return '0px';
        case enums.moreTerms:       return '44px';
        case enums.welcomeWild:     return '0px';
        case enums.moreHamburger:   return '15px';
        case enums.moreTools:       return '44px';
        case enums.settingsWild:    return '15px';
        default:                    return '0px';
      }
    }
  } else if (isAndroid()) {
    const sizeString = getAndroidSize();
    if (sizeString === '--xl') {
      if (isSimulator()) {
        cordovaOffsetLog(`cordovaScrollablePaneTopPadding sizeString: ${sizeString}`);
      }
      switch (pageEnumeration()) {
        case enums.officeWild:      return '79px';
        case enums.measureWild:     return '57px';
        case enums.candidate:       return '64px';
        case enums.ballotSmHdrWild: return '123px';
        case enums.ballotVote:      return isSignedIn ? '123px' : '119px';
        case enums.moreTerms:       return '32px';
        default:                    return '0px';
      }
    } else if (sizeString === '--lg') {
      switch (pageEnumeration()) {
        case enums.officeWild:      return '78px';
        case enums.measureWild:     return '40px';
        case enums.candidate:       return '55px';
        case enums.ballotSmHdrWild: return '118px';
        case enums.ballotVote:      return isSignedIn ? '102px' : '109px';
        case enums.moreTerms:       return '32px';
        default:                    return '0px';
      }
    } if (sizeString === '--md') {
      switch (pageEnumeration()) {
        case enums.officeWild:      return '77px';
        case enums.measureWild:     return '53px';
        case enums.candidate:       return '53px';
        case enums.ballotSmHdrWild: return '116px';
        case enums.ballotVote:      return isSignedIn ? '106px' : '105px';
        case enums.moreTerms:       return '32px';
        default:                    return '0px';
      }
    } else if (sizeString === '--sm') {
      switch (pageEnumeration()) {
        case enums.officeWild:      return '42px';
        case enums.measureWild:     return '42px';
        case enums.candidate:       return '24px';
        case enums.ballotSmHdrWild: return '130px';
        case enums.ballotVote:      return isSignedIn ? '103px' : '102px';
        case enums.moreTerms:       return '32px';
        case enums.valuesList:
        default:                    return '0px';
      }
    }
  }
  if (isIOS) {
    cordovaOffsetLog('********* Did not find a UUID match for this simulator *********');
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
      return '65px';
    } else if (hasIPhoneNotch()) {
      if (pageEnumeration() === enums.candidateWild) {
        return '65px';
      }
      return '74px';
    } else if (isIPhoneXR()) {
      return '46px';
    } else if (isIPad()) {
      return '38px';
    } else if (isIPhone5sSE()) {
      return '67px';
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

export function cordovaNetworkNextButtonTop () {
  if (isIOS()) {
    if (isIPhone678Plus()) {
      return '89vh';
    } else if (isIPhone678()) {
      return '89vh';
    } else if (hasIPhoneNotch()) {
      return '88vh';
    } else if (isIPad()) {
      return '89vh';
    } else if (isIPhone5sSE()) {
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
  if (isAndroid()) {
    const sizeString = getAndroidSize();
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
      return '0px';
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
      return '66px';
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

// <Toolbar classes={{ root: classes.toolbar }} disableGutters style={{ top: cordovaWelcomeAppToolbarTop() }}>
export function cordovaWelcomeAppToolbarTop () {
  if (isIOS()) {
    if (isIPhone678Plus()) {
      return '10px';
    } else if (isIPhone678()) {
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
    if (isIPhone5sSE()) {
      return {
        top: '69px',
        height: '121px',
      };
    } else if (isIPhone678()) {
      return {
        top: '66px',
        height: '118px',
      };
    } else if (isIPhone678Plus()) {
      return {
        top: '69px',
        height: '121px',
      };
    } else if (hasIPhoneNotch()) {
      return {
        top: '82px',
        height: '118px',
      };
    } else if (isIPad()) {
      return {
        top: '40px',
        height: '118px',
      };
    }
  } else if (isAndroid()) {
    return {
      top: '44px',
      height: '118px',
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
        cordovaOffsetLog(`cordovaTopHeaderTopMargin android: ${window.location.href}`);
      } else {
        cordovaOffsetLog(`cordovaTopHeaderTopMargin iOS: ${window.location.href.slice(0, 40)}`);
        cordovaOffsetLog(`cordovaTopHeaderTopMargin iOS: ${window.location.href.slice(window.location.href.indexOf('WeVoteCordova.app') - 1)}`);
      }
    }

    if (isIOS()) {
      if (isIPhone678Plus() || isIPhone678()) {
        switch (pageEnumeration()) {
          case enums.officeWild:      style.marginTop = '16px'; break;
          case enums.measureWild:     style.marginTop = '22px'; break;
          case enums.values:          style.marginTop = '16px'; break;
          case enums.valueWild:       style.marginTop = '32px'; break;
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
          case enums.candidateWild:   style.marginTop = '17px'; break;
          case enums.valuesList:      style.marginTop = '38px'; break;
          case enums.values:          style.marginTop = '12px'; break;
          case enums.valueWild:       style.marginTop = '32px'; break;
          case enums.opinions:        style.marginTop = '36px'; break;
          case enums.friends:         style.marginTop = '16px'; break;
          case enums.ballot:          style.marginTop = '16px'; break;
          case enums.ballotVote:      style.marginTop = '16px'; break;
          case enums.settingsWild:    style.marginTop = '38px'; break;
          default:                    style.marginTop = '16px'; break;
        }
      } else if (isIPad()) {
        switch (pageEnumeration()) {
          default:                    style.marginTop = '0px'; break;
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
      cordovaOffsetLog(`cordovaStickyHeaderPaddingTop sizeString: >${sizeString}<`);
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

