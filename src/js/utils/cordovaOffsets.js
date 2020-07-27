import { isCordova, isIOS, isAndroid, isAndroidSimulator, isSimulator, getAndroidSize,
  isIPhone4in, isIPhone4p7in, isIPhone5p5in, isIPhone5p8in, hasIPhoneNotch, isIPhone6p1in, isIPhone6p5in, isIPad } from './cordovaUtils';
import { enums, pageEnumeration } from '../utilsApi/cordovaUtilsPageEnumeration';
import { cordovaOffsetLog } from './logging';
import showBallotDecisionsTabs from '../utilsApi/showBallotDecisionsTabs';
import VoterStore from '../stores/VoterStore';


// <Wrapper padTop={cordovaScrollablePaneTopPadding()}>
// renders approximately as ...  <div className="Ballot__Wrapper-sc-11u8kf3-0 dYbfmq">
//                               <div className="Application__Wrapper-sc-1ek38e7-0 bYNRzy">
// <VoteContainer padTop={cordovaScrollablePaneTopPadding()}>   /index.html#/ballot/vote
// This function controls the padding above the content that makes room for the header for a particular section
export function cordovaScrollablePaneTopPadding () {
  const voter = VoterStore.getVoter();
  const { is_signed_in: isSignedIn } = voter;
  // const showBallotDecisionTabs = (BallotStore.ballotLength !== BallotStore.ballotRemainingChoicesLength) && (BallotStore.ballotRemainingChoicesLength > 0);

  if (isSimulator()) {
    if (isAndroidSimulator()) {
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding android: ${window.location.href}, pageEnumeration(): ${pageEnumeration()}, showBallotDecisionsTabs(): ${showBallotDecisionsTabs()}`);
    } else {
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding iOS: ${window.location.href.slice(0, 40)}, pageEnumeration(): ${pageEnumeration()}, showBallotDecisionsTabs(): ${showBallotDecisionsTabs()}`);
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding iOS: ${window.location.href.slice(window.location.href.length - 60)}`);
    }
  }

  if (isIOS()) {
    if (isIPhone4in()) {
      cordovaOffsetLog('cordovaScrollablePaneTopPadding: isIPhone4in');
      switch (pageEnumeration()) {
        case enums.ballotLgHdrWild: return showBallotDecisionsTabs() ? '48px' : '32px';
        case enums.ballotSmHdrWild: return '141px';  // $body-padding-top-no-decision-tabs
        case enums.ballotVote:      return '157px';
        case enums.candidate:       return '42px';
        case enums.candidateWild:   return '42px';
        case enums.measureWild:     return '42px';
        case enums.moreAbout:       return '22px';
        case enums.moreTerms:       return '40px';
        case enums.moreTools:       return '44px';
        case enums.officeWild:      return '84px';
        case enums.settingsHamburger:   return '57px';
        case enums.settingsWild:    return '67px';
        case enums.twitterSignIn:   return '20px';
        case enums.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp-voter-guide
        case enums.welcomeWild:     return '10px';
        case enums.wevoteintroWild: return '18px';
        default:                    return '0px';
      }
    } else if (isIPhone4p7in()) {
      cordovaOffsetLog('cordovaScrollablePaneTopPadding: isIPhone4p7in');
      switch (pageEnumeration()) {
        case enums.ballotLgHdrWild: return showBallotDecisionsTabs() ? '52px' : '36px';
        case enums.ballotSmHdrWild: return isSignedIn ? '144px' : '160px';
        case enums.ballotVote:      return isSignedIn ? '149px' : '148px';
        case enums.candidate:       return '42px';
        case enums.candidateWild:   return '57px';
        case enums.measureWild:     return '58px';
        case enums.moreAbout:       return '22px';
        case enums.moreTerms:       return '40px';
        case enums.moreTools:       return '44px';
        case enums.officeWild:      return '84px';
        case enums.settingsAccount:     return '71px';
        case enums.settingsHamburger:   return '66px';
        case enums.settingsSubscription: return '72px';
        case enums.settingsVoterGuideList: return '73px';
        case enums.settingsWild:    return '76px';
        case enums.twitterSignIn:   return '20px';
        case enums.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp-voter-guide
        case enums.welcomeWild:     return '10px';
        case enums.wevoteintroWild: return '18px';
        default:                    return '0px';
      }
    } else if (isIPhone5p5in()) {
      cordovaOffsetLog('cordovaScrollablePaneTopPadding: isIPhone5p5in');
      switch (pageEnumeration()) {
        case enums.ballotLgHdrWild: return showBallotDecisionsTabs() ? '35px' : '19px';
        case enums.ballotSmHdrWild: return '148px';
        case enums.ballotVote:      return '157px';
        case enums.candidate:       return '40px';
        case enums.candidateWild:   return '59px';
        case enums.measureWild:     return '58px';
        case enums.moreAbout:       return '22px';
        case enums.moreTerms:       return '44px';
        case enums.moreTools:       return '44px';
        case enums.officeWild:      return '84px';
        case enums.settingsAccount:     return '76px';
        case enums.settingsHamburger:   return '10px';
        case enums.settingsVoterGuideList: return '75px';
        case enums.settingsWild:    return '51px';
        case enums.twitterSignIn:   return '20px';
        case enums.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp-voter-guide
        case enums.welcomeWild:     return '22px';
        case enums.wevoteintroWild: return '18px';
        default:                    return '0px';
      }
    } else if (isIPhone6p1in()) {  // XR  and maybe iPhone 11
      cordovaOffsetLog('cordovaScrollablePaneTopPadding: isIPhone6p1in');
      switch (pageEnumeration()) {
        case enums.ballotLgHdrWild: return showBallotDecisionsTabs() ? '58px' : '41px';
        case enums.ballotSmHdrWild: return '169px';
        case enums.ballotVote:      return isSignedIn ? '163px' : '165px';
        case enums.candidate:       return '56px';
        case enums.candidateWild:   return '72px';
        case enums.measureWild:     return '58px';
        case enums.moreAbout:       return '22px';
        case enums.moreTerms:       return '60px';
        case enums.moreTools:       return '44px';
        case enums.officeWild:      return '101px';
        case enums.opinions:        return '10px';
        case enums.ready:           return '24px';
        case enums.settingsAccount:  return '81px';
        case enums.settingsHamburger:   return '90px';
        case enums.settingsWild:    return '89px';
        case enums.twitterSignIn:   return '20px';
        case enums.values:          return '10px';
        case enums.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp-voter-guide
        case enums.welcomeWild:     return '22px';
        case enums.wevoteintroWild: return '32px';
        default:                    return '0px';
      }
    } else if (isIPhone6p5in()) {
      cordovaOffsetLog('cordovaScrollablePaneTopPadding: isIPhone6p5in');
      switch (pageEnumeration()) {
        case enums.ballotLgHdrWild: return showBallotDecisionsTabs() ? '58px' : '42px';
        case enums.ballotSmHdrWild: return '170px';
        case enums.ballotVote:      return isSignedIn ? '165px' : '173px';
        case enums.candidate:       return '56px';
        case enums.candidateWild:   return '73px';
        case enums.measureWild:     return '56px';
        case enums.moreAbout:       return '22px';
        case enums.moreTerms:       return '60px';
        case enums.moreTools:       return '44px';
        case enums.officeWild:      return '76px';
        case enums.ready:           return '7px';
        case enums.settingsAccount:     return '84px';
        case enums.settingsHamburger:   return '81px';
        case enums.settingsSubscription: return '90px';
        case enums.settingsVoterGuideList: return '98px';
        case enums.settingsWild:    return '63px';
        case enums.twitterSignIn:   return '50px';
        case enums.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp-voter-guide
        case enums.welcomeWild:     return '22px';
        case enums.wevoteintroWild: return '32px';
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
        case enums.officeWild:      return '96px';
        case enums.ballotVote:      return '162px';
        case enums.ballotSmHdrWild: return '163px';
        case enums.ballotLgHdrWild: return showBallotDecisionsTabs() ? '58px' : '42px';
        case enums.moreAbout:       return '22px';
        case enums.settingsAccount: return '81px';
        case enums.moreTerms:       return '60px';
        // case enums.voterGuideWild: return 'YYx'; // See cordovaVoterGuideTopPadding instead
        case enums.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp-voter-guide
        case enums.welcomeWild:     return '22px';
        case enums.settingsHamburger: return '35px';
        case enums.moreTools:       return '44px';
        case enums.settingsSubscription:   return '87px';
        case enums.settingsVoterGuideList: return '72px';
        case enums.settingsWild:    return '67px';
        case enums.ready:           return '35px';
        default:                    return '0px';
      }
    } else if (isIPad()) {
      cordovaOffsetLog('cordovaScrollablePaneTopPadding: is IPad');
      switch (pageEnumeration()) {
        case enums.ballotLgHdrWild: return showBallotDecisionsTabs() ? '71px' : '12px';
        case enums.ballotSmHdrWild: return '165px';
        case enums.ballotVote:      return '131px';
        case enums.candidate:       return '40px';
        case enums.candidateWild:   return '65px';
        case enums.measureWild:     return '67px';
        case enums.moreAbout:       return '51px';
        case enums.moreTerms:       return '44px';
        case enums.moreTools:       return '44px';
        case enums.officeWild:      return '94px';
        case enums.opinions:        return '14px';
        case enums.ready:           return '24px';
        case enums.settingsAccount: return '85px';
        case enums.settingsHamburger: return '75px';
        case enums.settingsSubscription: return '87px';
        case enums.settingsWild:    return '61px';
        case enums.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp-voter-guide
        case enums.welcomeWild:     return '0px';
        case enums.wevoteintroWild: return '18px';
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
        case enums.ballotLgHdrWild: return showBallotDecisionsTabs() ? '25px' : '42px';
        case enums.ballotSmHdrWild: return '131px';
        case enums.ballotVote:      return isSignedIn ? '149px' : '145px';
        case enums.candidate:       return '64px';
        case enums.candidateWild:   return '53px';
        case enums.measureWild:     return '57px';
        case enums.moreTerms:       return '32px';
        case enums.officeWild:      return '79px';
        case enums.settingsHamburger:   return '43px';
        case enums.settingsWild:    return '57px';
        case enums.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp-voter-guide
        default:                    return '0px';
      }
    } else if (sizeString === '--lg') {
      switch (pageEnumeration()) {
        case enums.ballotSmHdrWild: return '135px';
        case enums.ballotVote:      return isSignedIn ? '128px' : '135px';
        case enums.candidate:       return '55px';
        case enums.candidateWild:   return '53px';
        case enums.measureWild:     return '40px';
        case enums.moreTerms:       return '32px';
        case enums.officeWild:      return '78px';
        case enums.settingsHamburger: return '46px';
        case enums.settingsWild:    return '61px';
        case enums.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp-voter-guide
        default:                    return '0px';
      }
    } if (sizeString === '--md') {
      switch (pageEnumeration()) {
        case enums.ballotLgHdrWild: return showBallotDecisionsTabs() ? '58px' : '42px';
        case enums.ballotSmHdrWild: return '124px';
        case enums.ballotVote:      return isSignedIn ? '132px' : '131px';
        case enums.candidate:       return '53px';
        case enums.candidateWild:   return '51px';
        case enums.measureWild:     return '53px';
        case enums.moreTerms:       return '32px';
        case enums.officeWild:      return '84px';
        case enums.settingsHamburger: return '38px';
        case enums.settingsWild:    return '61px';
        case enums.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp-voter-guide
        default:                    return '0px';
      }
    } else if (sizeString === '--sm') {
      switch (pageEnumeration()) {
        case enums.ballotLgHdrWild: return showBallotDecisionsTabs() ? '58px' : '42px';
        case enums.ballotSmHdrWild: return '141px';
        case enums.ballotVote:      return isSignedIn ? '131px' : '128px';
        case enums.candidate:       return '24px';
        case enums.candidateWild:   return '36px';
        case enums.measureWild:     return '42px';
        case enums.moreTerms:       return '32px';
        case enums.officeWild:      return '42px';
        case enums.settingsHamburger:   return '43px';
        case enums.settingsWild:    return '55px';
        case enums.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp-voter-guide
        default:                    return '0px';
      }
    }
  }
  return '0px';
}

// <div className="page-content-container" style={{ marginTop: `${cordovaBallotFilterTopMargin()}` }}>
// This determines where the top of the "All", "Choices" and "Decided" tabs should start.
export function cordovaBallotFilterTopMargin () {
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
      if (pageEnumeration() === enums.candidateWild) {
        return '65px';
      }
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
      return '61px';
    } else if (sizeString === '--xl') {
      if (window.location.href.indexOf('/index.html#/ballot/vote') > 0) {
        return '-10px';
      }
      return '52px';
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
    if (isIPhone5p5in()) {
      return '11px';
    } else if (isIPhone4p7in()) {
      return '0px';
    } else if (hasIPhoneNotch()) {
      return '28px';
    } else if (isIPad()) {
      return '0px';
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

  if (isCordova()) {
    if (isSimulator()) {
      if (isAndroidSimulator()) {
        cordovaOffsetLog(`cordovaTopHeaderTopMargin android: ${window.location.href}, pageEnumeration(): ${pageEnumeration()}`);
      } else {
        cordovaOffsetLog(`cordovaTopHeaderTopMargin iOS (first 60): ${window.location.href.slice(0, 60)}, pageEnumeration(): ${pageEnumeration()}`);
        cordovaOffsetLog(`cordovaTopHeaderTopMargin iOS (last 60): ${window.location.href.slice(window.location.href.length - 60)}`);
      }
    }

    if (isIOS()) {
      if (isIPhone5p5in() || isIPhone4p7in()) {
        switch (pageEnumeration()) {
          case enums.officeWild:      style.marginTop = '16px'; break;
          case enums.measureWild:     style.marginTop = '22px'; break;
          case enums.values:          style.marginTop = '16px'; break;
          case enums.valueWild:       style.marginTop = '22px'; break;
          case enums.friends:         style.marginTop = '16px'; break;
          case enums.ballotSmHdrWild: style.marginTop = '19px'; break;
          case enums.ballotLgHdrWild: style.marginTop = '19px'; break;
          case enums.ballotVote:      style.marginTop = '19px'; break;
          case enums.settingsWild:    style.marginTop = '22px'; break;
          case enums.voterGuideCreatorWild: style.marginTop = '38px'; break; // $headroom-wrapper-webapp-voter-guide-creator
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
          case enums.ballotSmHdrWild: style.marginTop = '16px'; break;
          case enums.ballotLgHdrWild: style.marginTop = '16px'; break;
          case enums.ballotVote:      style.marginTop = '16px'; break;
          case enums.settingsAccount:       style.marginTop = '31px'; break;
          case enums.settingsSubscription:  style.marginTop = '34px'; break;
          case enums.settingsWild:          style.marginTop = '38px'; break;
          case enums.voterGuideCreatorWild: style.marginTop = '38px'; break; // $headroom-wrapper-webapp-voter-guide-creator
          case enums.voterGuideWild:   style.marginTop = '38px'; break; // Any page with btcand or btmeas
          default:                     style.marginTop = '16px'; break;
        }
      } else if (isIPad()) {
        style.marginTop = '0px';
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
