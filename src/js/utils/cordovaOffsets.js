import CordovaPageConstants from '../constants/CordovaPageConstants';
import VoterStore from '../stores/VoterStore';
import showBallotDecisionsTabs from '../utilsApi/showBallotDecisionsTabs';
import { cordovaOffsetLog } from './logging';
import { pageEnumeration } from '../utilsApi/cordovaUtilsPageEnumeration';
import { getAndroidSize, hasAndroidNotch, hasIPhoneNotch,
  isAndroid, isAndroidSimulator, isAppleSilicon, isCordova, isIOS, isIPad,
  isIPhone4in, isIPhone4p7in, isIPhone5p5in, isIPhone5p8in, isIPhone6p1in, isIPhone6p5in, isSimulator,
} from './cordovaUtils';


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
        case CordovaPageConstants.ballotLgHdrWild:       return showBallotDecisionsTabs() ? '48px' : '32px';
        case CordovaPageConstants.ballotSmHdrWild:       return '141px';  // $body-padding-top-no-decision-tabs
        case CordovaPageConstants.ballotVote:            return '157px';
        case CordovaPageConstants.candidate:             return '42px';
        case CordovaPageConstants.candidateWild:         return '42px';
        case CordovaPageConstants.measureWild:           return '42px';
        case CordovaPageConstants.moreAbout:             return '22px';
        case CordovaPageConstants.moreTerms:             return '40px';
        case CordovaPageConstants.moreTools:             return '44px';
        case CordovaPageConstants.officeWild:            return '84px';
        case CordovaPageConstants.settingsHamburger:     return '57px';
        case CordovaPageConstants.settingsWild:          return '67px';
        case CordovaPageConstants.twitterSignIn:         return '20px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp__voter-guide
        case CordovaPageConstants.welcomeWild:           return '10px';
        case CordovaPageConstants.wevoteintroWild:       return '18px';
        default:                          return '0px';
      }
    } else if (isIPhone4p7in()) {
      cordovaOffsetLog('cordovaScrollablePaneTopPadding: isIPhone4p7in');
      switch (pageEnumeration()) {
        case CordovaPageConstants.ballotLgHdrWild:       return showBallotDecisionsTabs() ? '52px' : '36px';
        case CordovaPageConstants.ballotSmHdrWild:       return isSignedIn ? '144px' : '160px';
        case CordovaPageConstants.ballotVote:            return isSignedIn ? '149px' : '148px';
        case CordovaPageConstants.candidate:             return '42px';
        case CordovaPageConstants.candidateWild:         return '57px';
        case CordovaPageConstants.measureWild:           return '58px';
        case CordovaPageConstants.moreAbout:             return '22px';
        case CordovaPageConstants.moreTerms:             return '40px';
        case CordovaPageConstants.moreTools:             return '44px';
        case CordovaPageConstants.officeWild:            return '84px';
        case CordovaPageConstants.settingsAccount:       return '71px';
        case CordovaPageConstants.settingsHamburger:     return '66px';
        case CordovaPageConstants.settingsSubscription:  return '72px';
        case CordovaPageConstants.settingsVoterGuideLst: return '73px';
        case CordovaPageConstants.settingsWild:          return '76px';
        case CordovaPageConstants.twitterSignIn:         return '20px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp__voter-guide
        case CordovaPageConstants.welcomeWild:           return '10px';
        case CordovaPageConstants.wevoteintroWild:       return '18px';
        default:                          return '0px';
      }
    } else if (isIPhone5p5in()) {
      cordovaOffsetLog('cordovaScrollablePaneTopPadding: isIPhone5p5in');
      switch (pageEnumeration()) {
        case CordovaPageConstants.ballotLgHdrWild:       return showBallotDecisionsTabs() ? '35px' : '19px';
        case CordovaPageConstants.ballotSmHdrWild:       return '148px';
        case CordovaPageConstants.ballotVote:            return '157px';
        case CordovaPageConstants.candidate:             return '40px';
        case CordovaPageConstants.candidateWild:         return '59px';
        case CordovaPageConstants.measureWild:           return '58px';
        case CordovaPageConstants.moreAbout:             return '22px';
        case CordovaPageConstants.moreTerms:             return '44px';
        case CordovaPageConstants.moreTools:             return '44px';
        case CordovaPageConstants.officeWild:            return '84px';
        case CordovaPageConstants.settingsAccount:       return '76px';
        case CordovaPageConstants.settingsHamburger:     return '10px';
        case CordovaPageConstants.settingsVoterGuideLst: return '75px';
        case CordovaPageConstants.settingsWild:          return '51px';
        case CordovaPageConstants.twitterSignIn:         return '20px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp__voter-guide
        case CordovaPageConstants.welcomeWild:           return '22px';
        case CordovaPageConstants.wevoteintroWild:       return '18px';
        default:                          return '0px';
      }
    } else if (isIPhone6p1in()) {  // XR  and maybe iPhone 11
      cordovaOffsetLog('cordovaScrollablePaneTopPadding: isIPhone6p1in');
      switch (pageEnumeration()) {
        case CordovaPageConstants.ballotLgHdrWild:       return showBallotDecisionsTabs() ? '58px' : '41px';
        case CordovaPageConstants.ballotSmHdrWild:       return '169px';
        case CordovaPageConstants.ballotVote:            return isSignedIn ? '163px' : '165px';
        case CordovaPageConstants.candidate:             return '56px';
        case CordovaPageConstants.candidateWild:         return '72px';
        case CordovaPageConstants.measureWild:           return '58px';
        case CordovaPageConstants.moreAbout:             return '22px';
        case CordovaPageConstants.moreTerms:             return '60px';
        case CordovaPageConstants.moreTools:             return '44px';
        case CordovaPageConstants.officeWild:            return '101px';
        case CordovaPageConstants.opinions:              return '10px';
        case CordovaPageConstants.ready:                 return '24px';
        case CordovaPageConstants.settingsAccount:       return '81px';
        case CordovaPageConstants.settingsHamburger:     return '90px';
        case CordovaPageConstants.settingsWild:          return '89px';
        case CordovaPageConstants.twitterSignIn:         return '20px';
        case CordovaPageConstants.values:                return '10px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp__voter-guide
        case CordovaPageConstants.welcomeWild:           return '22px';
        case CordovaPageConstants.wevoteintroWild:       return '32px';
        default:                          return '0px';
      }
    } else if (isIPhone6p5in()) {
      cordovaOffsetLog('cordovaScrollablePaneTopPadding: isIPhone6p5in');
      switch (pageEnumeration()) {
        case CordovaPageConstants.ballotLgHdrWild:       return showBallotDecisionsTabs() ? '58px' : '42px';
        case CordovaPageConstants.ballotSmHdrWild:       return '170px';
        case CordovaPageConstants.ballotVote:            return isSignedIn ? '165px' : '173px';
        case CordovaPageConstants.candidate:             return '56px';
        case CordovaPageConstants.candidateWild:         return '73px';
        case CordovaPageConstants.measureWild:           return '56px';
        case CordovaPageConstants.moreAbout:             return '22px';
        case CordovaPageConstants.moreTerms:             return '60px';
        case CordovaPageConstants.moreTools:             return '44px';
        case CordovaPageConstants.officeWild:            return '76px';
        case CordovaPageConstants.ready:                 return '7px';
        case CordovaPageConstants.settingsAccount:       return '84px';
        case CordovaPageConstants.settingsHamburger:     return '81px';
        case CordovaPageConstants.settingsNotifications: return '79px';
        case CordovaPageConstants.settingsSubscription:  return '90px';
        case CordovaPageConstants.settingsVoterGuideLst: return '98px';
        case CordovaPageConstants.settingsWild:          return '63px';
        case CordovaPageConstants.twitterSignIn:         return '50px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp__voter-guide
        case CordovaPageConstants.welcomeWild:           return '22px';
        case CordovaPageConstants.wevoteintroWild:       return '32px';
        default:                          return '0px';
      }
    } else if (hasIPhoneNotch()) {  // defaults for X or 11 Pro
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding: hasIPhoneNotch -- signed in: ${isSignedIn}`);
      switch (pageEnumeration()) {
        case CordovaPageConstants.wevoteintroWild:       return '32px';
        case CordovaPageConstants.measureWild:           return '72px';
        case CordovaPageConstants.candidate:             return '66px';
        case CordovaPageConstants.candidateWild:         return '69px';
        case CordovaPageConstants.opinions:              return '10px';
        case CordovaPageConstants.officeWild:            return '96px';
        case CordovaPageConstants.ballotVote:            return '162px';
        case CordovaPageConstants.ballotSmHdrWild:       return '163px';
        case CordovaPageConstants.ballotLgHdrWild:       return showBallotDecisionsTabs() ? '58px' : '42px';
        case CordovaPageConstants.moreAbout:             return '22px';
        case CordovaPageConstants.settingsAccount:       return '81px';
        case CordovaPageConstants.settingsNotifications: return '82px';
        case CordovaPageConstants.moreTerms:             return '60px';
        // case CordovaPageConstants.voterGuideWild: return 'YYx'; // See cordovaVoterGuideTopPadding instead
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp__voter-guide
        case CordovaPageConstants.welcomeWild:           return '22px';
        case CordovaPageConstants.settingsHamburger:     return '35px';
        case CordovaPageConstants.moreTools:             return '44px';
        case CordovaPageConstants.settingsSubscription:  return '87px';
        case CordovaPageConstants.settingsVoterGuideLst: return '72px';
        case CordovaPageConstants.settingsWild:          return '67px';
        case CordovaPageConstants.ready:                 return '35px';
        default:                          return '0px';
      }
    } else if (isAppleSilicon()) {
      cordovaOffsetLog('cordovaScrollablePaneTopPadding: is Apple Silicon ARM64');
      switch (pageEnumeration()) {
        case CordovaPageConstants.ballotLgHdrWild:       return '34px';  // tested 9/30/20
        case CordovaPageConstants.ballotSmHdrWild:       return '134px'; // tested 10/2/20
        case CordovaPageConstants.ballotVote:            return '131px';
        case CordovaPageConstants.candidate:             return '40px';
        case CordovaPageConstants.candidateWild:         return '49px';  // tested 10/2/20
        case CordovaPageConstants.measureWild:           return '67px';
        case CordovaPageConstants.moreAbout:             return '22px';  // tested 10/1/20
        case CordovaPageConstants.moreTerms:             return '44px';
        case CordovaPageConstants.moreTools:             return '44px';
        case CordovaPageConstants.news:                  return '9px';   // tested 9/30/20
        case CordovaPageConstants.officeWild:            return '106px';
        case CordovaPageConstants.opinions:              return '14px';
        case CordovaPageConstants.ready:                 return '0px';   // tested 9/30/20
        case CordovaPageConstants.settingsAccount:       return '85px';
        case CordovaPageConstants.settingsHamburger:     return '45px';  // tested 10/1/20
        case CordovaPageConstants.settingsNotifications: return '67px';  // tested 9/30/20
        case CordovaPageConstants.settingsSubscription:  return '87px';
        case CordovaPageConstants.settingsWild:          return '61px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px';  // $headroom-wrapper-webapp__voter-guide
        case CordovaPageConstants.voterGuideWild:        return '47px';  // tested 10/1/20
        case CordovaPageConstants.welcomeWild:           return '0px';
        case CordovaPageConstants.wevoteintroWild:       return '18px';
        default:                          return '0px';
      }
    } else if (isIPad()) {
      cordovaOffsetLog('cordovaScrollablePaneTopPadding: is IPad');
      switch (pageEnumeration()) {
        case CordovaPageConstants.ballotLgHdrWild:       return '86px';
        case CordovaPageConstants.ballotSmHdrWild:       return '165px';
        case CordovaPageConstants.ballotVote:            return '131px';
        case CordovaPageConstants.candidate:             return '40px';
        case CordovaPageConstants.candidateWild:         return '65px';
        case CordovaPageConstants.measureWild:           return '67px';
        case CordovaPageConstants.moreAbout:             return '22px';
        case CordovaPageConstants.moreTerms:             return '44px';
        case CordovaPageConstants.moreTools:             return '44px';
        case CordovaPageConstants.news:                  return '19px';
        case CordovaPageConstants.officeWild:            return '106px';
        case CordovaPageConstants.opinions:              return '14px';
        case CordovaPageConstants.ready:                 return '24px';
        case CordovaPageConstants.settingsAccount:       return '85px';
        case CordovaPageConstants.settingsHamburger:     return '75px';
        case CordovaPageConstants.settingsNotifications: return '83px';
        case CordovaPageConstants.settingsSubscription:  return '87px';
        case CordovaPageConstants.settingsWild:          return '61px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp__voter-guide
        case CordovaPageConstants.voterGuideWild:        return '65px';
        case CordovaPageConstants.welcomeWild:           return '0px';
        case CordovaPageConstants.wevoteintroWild:       return '18px';
        default:                          return '0px';
      }
    } else {
      cordovaOffsetLog('********* Did not find a screen size match for this iPhone simulator *********');
    }
  } else if (isAndroid()) {
    const sizeString = getAndroidSize();
    cordovaOffsetLog(`cordovaScrollablePaneTopPadding sizeString: ${sizeString}`);
    if (sizeString === '--fold') {
      switch (pageEnumeration()) {
        case CordovaPageConstants.ballotLgHdrWild:
          return '25px';
        case CordovaPageConstants.ballotSmHdrWild:
          return '0';
        case CordovaPageConstants.ballotVote:
          return isSignedIn ? '149px' : '145px';
        case CordovaPageConstants.candidate:
          return '64px';
        case CordovaPageConstants.candidateWild:
          return '53px';
        case CordovaPageConstants.measureWild:
          return '57px';
        case CordovaPageConstants.moreTerms:
          return '32px';
        case CordovaPageConstants.officeWild:
          return '79px';
        case CordovaPageConstants.settingsAccount:
          return '53px';
        case CordovaPageConstants.settingsHamburger:
          return '43px';
        case CordovaPageConstants.settingsNotifications:
          return '39px';
        case CordovaPageConstants.settingsSubscription:
          return '54px';
        case CordovaPageConstants.settingsWild:
          return '57px';
        case CordovaPageConstants.twitterSignIn:
          return hasAndroidNotch() ? '20px' : '10px';
        case CordovaPageConstants.voterGuideCreatorWild:
          return '10px'; // $headroom-wrapper-webapp__voter-guide
        default:
          return '0px';
      }
    } else if (sizeString === '--xl') {
      switch (pageEnumeration()) {
        case CordovaPageConstants.ballotLgHdrWild:
          return showBallotDecisionsTabs() ? '36px' : '42px';
        case CordovaPageConstants.ballotSmHdrWild:
          return '131px';
        case CordovaPageConstants.ballotVote:
          return isSignedIn ? '149px' : '145px';
        case CordovaPageConstants.candidate:
          return '64px';
        case CordovaPageConstants.candidateWild:
          return '53px';
        case CordovaPageConstants.measureWild:
          return '57px';
        case CordovaPageConstants.moreTerms:
          return '32px';
        case CordovaPageConstants.officeWild:
          return '79px';
        case CordovaPageConstants.settingsAccount:
          return '53px';
        case CordovaPageConstants.settingsHamburger:
          return '43px';
        case CordovaPageConstants.settingsNotifications:
          return '39px';
        case CordovaPageConstants.settingsSubscription:
          return '54px';
        case CordovaPageConstants.settingsWild:
          return '57px';
        case CordovaPageConstants.twitterSignIn:
          return hasAndroidNotch() ? '20px' : '10px';
        case CordovaPageConstants.voterGuideCreatorWild:
          return '10px'; // $headroom-wrapper-webapp__voter-guide
        default:
          return '0px';
      }
    } else if (sizeString === '--fold') {
      switch (pageEnumeration()) {
        case CordovaPageConstants.ballotLgHdrWild:       return showBallotDecisionsTabs() ? '36px' : '42px';
        case CordovaPageConstants.ballotSmHdrWild:       return '131px';
        case CordovaPageConstants.ballotVote:            return isSignedIn ? '149px' : '145px';
        case CordovaPageConstants.candidate:             return '64px';
        case CordovaPageConstants.candidateWild:         return '53px';
        case CordovaPageConstants.measureWild:           return '57px';
        case CordovaPageConstants.moreTerms:             return '32px';
        case CordovaPageConstants.officeWild:            return '79px';
        case CordovaPageConstants.settingsAccount:       return '53px';
        case CordovaPageConstants.settingsHamburger:     return '43px';
        case CordovaPageConstants.settingsNotifications: return '39px';
        case CordovaPageConstants.settingsSubscription:  return '54px';
        case CordovaPageConstants.settingsWild:          return '57px';
        case CordovaPageConstants.twitterSignIn:         return hasAndroidNotch() ? '20px' : '10px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp__voter-guide
        default:                          return '0px';
      }
    } else if (sizeString === '--lg') {
      switch (pageEnumeration()) {
        case CordovaPageConstants.ballotSmHdrWild:       return '135px';
        case CordovaPageConstants.ballotVote:            return isSignedIn ? '128px' : '135px';
        case CordovaPageConstants.candidate:             return '55px';
        case CordovaPageConstants.candidateWild:         return '53px';
        case CordovaPageConstants.measureWild:           return '40px';
        case CordovaPageConstants.moreTerms:             return '32px';
        case CordovaPageConstants.officeWild:            return '78px';
        case CordovaPageConstants.settingsAccount:       return '51px';
        case CordovaPageConstants.settingsHamburger:     return '46px';
        case CordovaPageConstants.settingsNotifications: return '39px';
        case CordovaPageConstants.settingsSubscription:  return '87px';
        case CordovaPageConstants.settingsWild:          return '61px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp__voter-guide
        default:                          return '0px';
      }
    } if (sizeString === '--md') {
      switch (pageEnumeration()) {
        case CordovaPageConstants.ballotLgHdrWild:       return showBallotDecisionsTabs() ? '58px' : '42px';
        case CordovaPageConstants.ballotSmHdrWild:       return '124px';
        case CordovaPageConstants.ballotVote:            return isSignedIn ? '132px' : '131px';
        case CordovaPageConstants.candidate:             return '53px';
        case CordovaPageConstants.candidateWild:         return '51px';
        case CordovaPageConstants.measureWild:           return '53px';
        case CordovaPageConstants.moreTerms:             return '32px';
        case CordovaPageConstants.officeWild:            return '84px';
        case CordovaPageConstants.settingsAccount:       return '53px';
        case CordovaPageConstants.settingsHamburger:     return '38px';
        case CordovaPageConstants.settingsNotifications: return '39px';
        case CordovaPageConstants.settingsSubscription:  return '53px';
        case CordovaPageConstants.settingsWild:          return '61px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp__voter-guide
        default:                          return '0px';
      }
    } else if (sizeString === '--sm') {
      switch (pageEnumeration()) {
        case CordovaPageConstants.ballotLgHdrWild:       return showBallotDecisionsTabs() ? '58px' : '42px';
        case CordovaPageConstants.ballotSmHdrWild:       return '114px';
        case CordovaPageConstants.ballotVote:            return isSignedIn ? '131px' : '128px';
        case CordovaPageConstants.candidate:             return '24px';
        case CordovaPageConstants.candidateWild:         return '36px';
        case CordovaPageConstants.measureWild:           return '42px';
        case CordovaPageConstants.moreTerms:             return '32px';
        case CordovaPageConstants.officeWild:            return '42px';
        case CordovaPageConstants.settingsHamburger:     return '43px';
        case CordovaPageConstants.settingsNotifications: return '39px';
        case CordovaPageConstants.settingsWild:          return '55px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp__voter-guide
        default:                          return '0px';
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
      if (pageEnumeration() === CordovaPageConstants.candidateWild) {
        return '65px';
      }
    } else if (isAppleSilicon()) {
      if (pageEnumeration() === CordovaPageConstants.news) {
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
      switch (pageEnumeration()) {
        case CordovaPageConstants.news:             return '19px';
        case CordovaPageConstants.voterGuideWild:   return '26px';
        default:                     return '0px';
      }
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
        switch (pageEnumeration()) {
          case CordovaPageConstants.officeWild:      style.marginTop = '30px'; break;
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
          case CordovaPageConstants.voterGuideWild:        style.marginTop = '38px'; break; // Any page with btcand or btmeas
          case CordovaPageConstants.twitterIdMFollowers:   style.marginTop = '37px'; break; // /*/m/friends, /*/m/following, /*/m/followers
          default:                          style.marginTop = '16px'; break;
        }
      } else if (isAppleSilicon()) {
        style.marginTop = '0px';
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
  } else if (isAndroid()) {
    return pinToBottom ? '10px' : '57px';
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
