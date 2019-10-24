import { isCordova, isIOS, isAndroid, isAndroidSimulator, isSimulator, getAndroidSize, pageEnumeration, enums,
  isIPhone4in, isIPhone4p7in, isIPhone5p5in, hasIPhoneNotch, isIPhone6p1in, isIPhone6p5in, isIPad } from './cordovaUtils';
import { cordovaOffsetLog } from './logging';
/* global $  */

// <Wrapper padTop={cordovaScrollablePaneTopPadding()}>
// renders approximately as ...  <div className="Ballot__Wrapper-sc-11u8kf3-0 dYbfmq">
//                               <div className="Application__Wrapper-sc-1ek38e7-0 bYNRzy">
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
    if (isIPhone4in()) {
      cordovaOffsetLog('cordovaScrollablePaneTopPadding: isIPhone4in');
      switch (pageEnumeration()) {
        case enums.wevoteintroWild: return '18px';
        case enums.measureWild:     return '42px';
        case enums.candidate:       return '42px';
        case enums.candidateWild:   return '42px';
        case enums.ballotVote:      return '157px';
        case enums.officeWild:      return isSignedIn ? '71px' : '62px';
        case enums.ballotSmHdrWild: return '161px';  // $body-padding-top-no-decision-tabs
        case enums.ballotLgHdrWild: return '32px';
        case enums.moreAbout:       return '22px';
        case enums.moreTerms:       return '40px';
        case enums.welcomeWild:     return '10px';
        case enums.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp-voter-guide
        case enums.moreHamburger:   return '10px';
        case enums.moreTools:       return '44px';
        case enums.settingsWild:    return '16px';
        default:                    return '0px';
      }
    } else if (isIPhone4p7in()) {
      cordovaOffsetLog('cordovaScrollablePaneTopPadding: isIPhone5p4in');
      switch (pageEnumeration()) {
        case enums.wevoteintroWild: return '18px';
        case enums.measureWild:     return '58px';
        case enums.candidate:       return '42px';
        case enums.candidateWild:   return '57px';
        case enums.ballotVote:      return isSignedIn ? '149px' : '148px';
        case enums.officeWild:      return '62px';
        case enums.ballotSmHdrWild: return isSignedIn ? '161px' : '160px';
        case enums.ballotLgHdrWild: return '36px';
        case enums.moreAbout:       return '22px';
        case enums.moreTerms:       return '40px';
        case enums.welcomeWild:     return '10px';
        case enums.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp-voter-guide
        case enums.moreHamburger:   return '10px';
        case enums.moreTools:       return '44px';
        case enums.settingsWild:    return '16px';
        default:                    return '0px';
      }
    } else if (isIPhone5p5in()) {
      cordovaOffsetLog('cordovaScrollablePaneTopPadding: isIPhone5p5in');
      switch (pageEnumeration()) {
        case enums.wevoteintroWild: return '18px';
        case enums.measureWild:     return '58px';
        case enums.candidate:       return '40px';
        case enums.candidateWild:   return '59px';
        case enums.ballotVote:      return '157px';
        case enums.officeWild:      return '64px';
        case enums.ballotSmHdrWild: return '148px';
        case enums.ballotLgHdrWild: return '19px';
        case enums.moreAbout:       return '22px';
        case enums.moreTerms:       return '44px';
        case enums.welcomeWild:     return '22px';
        case enums.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp-voter-guide
        case enums.moreHamburger:   return '10px';
        case enums.moreTools:       return '44px';
        case enums.settingsWild:    return '16px';
        default:                    return '0px';
      }
    } else if (isIPhone6p1in()) {
      cordovaOffsetLog('cordovaScrollablePaneTopPadding: isIPhone6p1in');
      switch (pageEnumeration()) {
        case enums.wevoteintroWild: return '32px';
        case enums.measureWild:     return '58px';
        case enums.candidate:       return '56px';
        case enums.candidateWild:   return '72px';
        case enums.officeWild:      return '76px';
        case enums.values:          return '10px';
        case enums.ballotVote:      return isSignedIn ? '163px' : '165px';
        case enums.ballotSmHdrWild: return '169px';
        case enums.ballotLgHdrWild: return '41px';
        case enums.moreAbout:       return '22px';
        case enums.moreTerms:       return '60px';
        case enums.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp-voter-guide
        case enums.welcomeWild:     return '22px';
        case enums.moreHamburger:   return '35px';
        case enums.moreTools:       return '44px';
        case enums.settingsWild:    return '32px';
        default:                    return '0px';
      }
    } else if (isIPhone6p5in()) {
      cordovaOffsetLog('cordovaScrollablePaneTopPadding: isIPhone6p5in');
      switch (pageEnumeration()) {
        case enums.wevoteintroWild: return '32px';
        case enums.measureWild:     return '56px';
        case enums.candidate:       return '56px';
        case enums.candidateWild:   return '73px';
        case enums.officeWild:      return '76px';
        case enums.ballotVote:      return isSignedIn ? '165px' : '173px';
        case enums.ballotSmHdrWild: return '170px';
        case enums.ballotLgHdrWild: return '42px';
        case enums.moreAbout:       return '22px';
        case enums.moreTerms:       return '60px';
        case enums.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp-voter-guide
        case enums.welcomeWild:     return '22px';
        case enums.moreHamburger:   return '35px';
        case enums.moreTools:       return '44px';
        case enums.settingsWild:    return '32px';
        default:                    return '0px';
      }
    } else if (hasIPhoneNotch()) {  // defaults for X or 11 Pro
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding: hasIPhoneNotch -- signed in: ${isSignedIn}`);
      switch (pageEnumeration()) {
        case enums.wevoteintroWild: return '32px';
        case enums.measureWild:     return '72px';
        case enums.candidate:       return '66px';
        case enums.candidateWild:   return '69px';
        case enums.opinions:        return '10px';
        case enums.officeWild:      return '76px';
        case enums.ballotVote:      return isSignedIn ? '162px' : '162px';
        case enums.ballotSmHdrWild: return '167px';
        case enums.ballotLgHdrWild: return '42px';
        case enums.moreAbout:       return '22px';
        case enums.moreTerms:       return '60px';
        case enums.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp-voter-guide
        case enums.welcomeWild:     return '22px';
        case enums.moreHamburger:   return '35px';
        case enums.moreTools:       return '44px';
        case enums.settingsWild:    return '32px';
        default:                    return '0px';
      }
    } else if (isIPad()) {
      cordovaOffsetLog('cordovaScrollablePaneTopPadding: is IPad');
      switch (pageEnumeration()) {
        case enums.wevoteintroWild: return '18px';
        case enums.measureWild:     return '58px';
        case enums.candidate:       return '40px';
        case enums.candidateWild:   return '40px';
        case enums.ballotVote:      return '16px';
        case enums.officeWild:      return '64px';
        case enums.ballotSmHdrWild: return '137px';
        case enums.ballotLgHdrWild: return '12px';
        case enums.moreAbout:       return '0px';
        case enums.moreTerms:       return '44px';
        case enums.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp-voter-guide
        case enums.welcomeWild:     return '0px';
        case enums.moreHamburger:   return '15px';
        case enums.moreTools:       return '44px';
        case enums.settingsWild:    return '15px';
        default:                    return '0px';
      }
    } else {
      cordovaOffsetLog('********* Did not find a screen size match for this iPhone simulator *********');
    }
  } else if (isAndroid()) {
    const sizeString = getAndroidSize();
    if (sizeString === '--xl') {
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding sizeString: ${sizeString}`);
      switch (pageEnumeration()) {
        case enums.officeWild:      return '79px';
        case enums.measureWild:     return '57px';
        case enums.candidate:       return '64px';
        case enums.candidateWild:   return '53px';
        case enums.ballotSmHdrWild: return '131px';
        case enums.ballotVote:      return isSignedIn ? '149px' : '145px';
        case enums.moreTerms:       return '32px';
        case enums.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp-voter-guide
        default:                    return '0px';
      }
    } else if (sizeString === '--lg') {
      switch (pageEnumeration()) {
        case enums.officeWild:      return '78px';
        case enums.measureWild:     return '40px';
        case enums.candidate:       return '55px';
        case enums.candidateWild:   return '53px';
        case enums.ballotSmHdrWild: return '126px';
        case enums.ballotVote:      return isSignedIn ? '128px' : '135px';
        case enums.moreTerms:       return '32px';
        case enums.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp-voter-guide
        default:                    return '0px';
      }
    } if (sizeString === '--md') {
      switch (pageEnumeration()) {
        case enums.officeWild:      return '77px';
        case enums.measureWild:     return '53px';
        case enums.candidate:       return '53px';
        case enums.candidateWild:   return '51px';
        case enums.ballotSmHdrWild: return '124px';
        case enums.ballotVote:      return isSignedIn ? '132px' : '131px';
        case enums.moreTerms:       return '32px';
        case enums.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp-voter-guide
        default:                    return '0px';
      }
    } else if (sizeString === '--sm') {
      switch (pageEnumeration()) {
        case enums.officeWild:      return '42px';
        case enums.measureWild:     return '42px';
        case enums.candidate:       return '24px';
        case enums.candidateWild:   return '36px';
        case enums.ballotSmHdrWild: return '138px';
        case enums.ballotVote:      return isSignedIn ? '131px' : '128px';
        case enums.moreTerms:       return '32px';
        case enums.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp-voter-guide
        case enums.valuesList:
        default:                    return '0px';
      }
    }
  }
  return '0px';
}

// <div className="page-content-container" style={{ marginTop: `${cordovaBallotFilterTopMargin()}` }}>
export function cordovaBallotFilterTopMargin () {
  if (isIOS()) {
    if (isIPhone5p5in()) {
      if (window.location.href.indexOf('/index.html#/ballot/vote') > 0) {
        return '55px';
      }
      return '53px';
    } else if (isIPhone4p7in()) {
      return '65px';
    } else if (hasIPhoneNotch()) {
      if (pageEnumeration() === enums.candidateWild) {
        return '65px';
      }
      return '74px';
    } else if (isIPhone6p1in()) {
      return '46px';
    } else if (isIPad()) {
      return '38px';
    } else if (isIPhone4in()) {
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
    if (isIPhone5p5in()) {
      return '66px';
    } else if (isIPhone4p7in()) {
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
    } else if (hasIPhoneNotch()) {
      return {
        top: '82px',
        height: '125px',
      };
    } else if (isIPad()) {
      return {
        top: '40px',
        height: '125px',
      };
    }
  } else if (isAndroid()) {
    return {
      top: '44px',
      height: '125px',
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
      if (isIPhone5p5in() || isIPhone4p7in()) {
        switch (pageEnumeration()) {
          case enums.officeWild:      style.marginTop = '16px'; break;
          case enums.measureWild:     style.marginTop = '22px'; break;
          case enums.values:          style.marginTop = '16px'; break;
          case enums.valueWild:       style.marginTop = '32px'; break;
          case enums.friends:         style.marginTop = '16px'; break;
          case enums.ballot:          style.marginTop = '19px'; break;
          case enums.ballotVote:      style.marginTop = '19px'; break;
          case enums.settingsWild:    style.marginTop = '22px'; break;
          case enums.voterGuideCreatorWild: style.marginTop = '10px'; break; // $headroom-wrapper-webapp-voter-guide
          default:                    style.marginTop = '19px'; break;
        }
      } else if (hasIPhoneNotch()) {
        switch (pageEnumeration()) {
          case enums.officeWild:      style.marginTop = '30px'; break;
          case enums.measureWild:     style.marginTop = '34px'; break;
          case enums.candidate:       style.marginTop = '35px'; break;
          case enums.candidateWild:   style.marginTop = '33px'; break;
          case enums.valuesList:      style.marginTop = '38px'; break;
          case enums.values:          style.marginTop = '12px'; break;
          case enums.valueWild:       style.marginTop = '32px'; break;
          case enums.opinions:        style.marginTop = '36px'; break;
          case enums.friends:         style.marginTop = '16px'; break;
          case enums.ballot:          style.marginTop = '16px'; break;
          case enums.ballotVote:      style.marginTop = '16px'; break;
          case enums.settingsWild:    style.marginTop = '38px'; break;
          case enums.voterGuideCreatorWild: style.marginTop = '10px'; break; // $headroom-wrapper-webapp-voter-guide
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
    if (isIPhone5p5in()) {
      return '62px';
    } else if (isIPhone4p7in()) {
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

