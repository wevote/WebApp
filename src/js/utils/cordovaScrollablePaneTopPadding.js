import CordovaPageConstants from '../constants/CordovaPageConstants';
import VoterStore from '../stores/VoterStore';
import showBallotDecisionsTabs from '../utilsApi/showBallotDecisionsTabs';
import { cordovaOffsetLog } from './logging';
import { pageEnumeration } from './cordovaUtilsPageEnumeration';
import { getAndroidSize, hasAndroidNotch, hasIPhoneNotch,
  isAndroid, isAndroidSimulator, isIOSAppOnMac, isIOS, isIPad,
  isIPhone4in, isIPhone4p7in, isIPhone5p5in, isIPhone6p1in, isIPhone6p5in, isSimulator,
} from './cordovaUtils';


// <Wrapper padTop={cordovaScrollablePaneTopPadding()}>
// renders approximately as ...  <div className="Ballot__Wrapper-sc-11u8kf3-0 dYbfmq">
//                               <div className="Application__Wrapper-sc-1ek38e7-0 bYNRzy">
// <VoteContainer padTop={cordovaScrollablePaneTopPadding()}>   /index.html#/ballot/vote
// This function controls the padding above the content that makes room for the header for a particular section
export default function cordovaScrollablePaneTopPadding () {
  const voter = VoterStore.getVoter();
  const { is_signed_in: isSignedIn } = voter;
  const page = pageEnumeration();
  // const showBallotDecisionTabs = (BallotStore.ballotLength !== BallotStore.ballotRemainingChoicesLength) && (BallotStore.ballotRemainingChoicesLength > 0);

  if (isSimulator()) {
    if (isAndroidSimulator()) {
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding android: ${window.location.href}, page: ${page}, showBallotDecisionsTabs(): ${showBallotDecisionsTabs()}`);
    } else {
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding iOS: ${window.location.href.slice(0, 40)}, page: ${page}, showBallotDecisionsTabs(): ${showBallotDecisionsTabs()}`);
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding iOS: ${window.location.href.slice(window.location.href.length - 60)}`);
    }
  }

  if (isIOS()) {
    if (isIPhone4in()) {
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding: isIPhone4in, page: ${page}`);
      switch (page) {
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
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding: isIPhone4p7in, page: ${page}`);
      switch (page) {
        case CordovaPageConstants.ballotLgHdrWild:       return showBallotDecisionsTabs() ? '52px' : '36px';
        case CordovaPageConstants.ballotSmHdrWild:       return '136px';
        case CordovaPageConstants.ballotVote:            return isSignedIn ? '149px' : '148px';
        case CordovaPageConstants.candidate:             return '42px';
        case CordovaPageConstants.candidateWild:         return '57px';
        case CordovaPageConstants.measureWild:           return '58px';
        case CordovaPageConstants.moreAbout:             return '22px';
        case CordovaPageConstants.moreTerms:             return '40px';
        case CordovaPageConstants.moreTools:             return '44px';
        case CordovaPageConstants.officeWild:            return '84px';
        case CordovaPageConstants.ready:                 return '52px';
        case CordovaPageConstants.settingsAccount:       return '71px';
        case CordovaPageConstants.settingsHamburger:     return '66px';
        case CordovaPageConstants.settingsNotifications: return '57px';
        case CordovaPageConstants.settingsSubscription:  return '72px';
        case CordovaPageConstants.settingsVoterGuideLst: return '73px';
        case CordovaPageConstants.settingsWild:          return '76px';
        case CordovaPageConstants.twitterSignIn:         return '20px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp__voter-guide
        case CordovaPageConstants.voterGuideWild:        return '55px';
        case CordovaPageConstants.welcomeWild:           return '10px';
        case CordovaPageConstants.wevoteintroWild:       return '18px';
        default:                                         return '0px';
      }
    } else if (isIPhone5p5in()) {
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding: isIPhone5p5in, page: ${page}`);
      switch (page) {
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
        case CordovaPageConstants.ready:                 return '53px';
        case CordovaPageConstants.settingsAccount:       return '76px';
        case CordovaPageConstants.settingsHamburger:     return '60px';
        case CordovaPageConstants.settingsNotifications: return '62px';
        case CordovaPageConstants.settingsVoterGuideLst: return '75px';
        case CordovaPageConstants.settingsWild:          return '51px';
        case CordovaPageConstants.twitterSignIn:         return '20px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp__voter-guide
        case CordovaPageConstants.voterGuideWild:        return '51px';
        case CordovaPageConstants.welcomeWild:           return '22px';
        case CordovaPageConstants.wevoteintroWild:       return '18px';
        default:                                         return '0px';
      }
    } else if (isIPhone6p1in()) {  // XR  and maybe iPhone 11
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding: isIPhone6p1in, page: ${page}`);
      switch (page) {
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
        case CordovaPageConstants.opinionsPubFigs:       return '25px';
        case CordovaPageConstants.ready:                 return '74px';
        case CordovaPageConstants.settingsAccount:       return '81px';
        case CordovaPageConstants.settingsHamburger:     return '90px';
        case CordovaPageConstants.settingsNotifications: return '79px';
        case CordovaPageConstants.settingsWild:          return '89px';
        case CordovaPageConstants.twitterSignIn:         return '50px';
        case CordovaPageConstants.values:                return '25px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp__voter-guide
        case CordovaPageConstants.voterGuideWild:        return '74px';
        case CordovaPageConstants.welcomeWild:           return '22px';
        case CordovaPageConstants.wevoteintroWild:       return '32px';
        default:                                         return '0px';
      }
    } else if (isIPhone6p5in()) {
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding: isIPhone6p5in, page: ${page}`);
      switch (page) {
        case CordovaPageConstants.ballotLgHdrWild:       return showBallotDecisionsTabs() ? '58px' : '42px';
        case CordovaPageConstants.ballotSmHdrWild:       return '170px';
        case CordovaPageConstants.ballotVote:            return isSignedIn ? '165px' : '173px';
        case CordovaPageConstants.candidate:             return '56px';
        case CordovaPageConstants.candidateWild:         return '53px';
        case CordovaPageConstants.measureWild:           return '56px';
        case CordovaPageConstants.moreAbout:             return '22px';
        case CordovaPageConstants.moreTerms:             return '0px';
        case CordovaPageConstants.moreTools:             return '44px';
        case CordovaPageConstants.officeWild:            return '76px';
        case CordovaPageConstants.ready:                 return '57px';
        case CordovaPageConstants.settingsAccount:       return '84px';
        case CordovaPageConstants.settingsHamburger:     return '81px';
        case CordovaPageConstants.settingsNotifications: return '79px';
        case CordovaPageConstants.settingsSubscription:  return '90px';
        case CordovaPageConstants.settingsVoterGuideLst: return '98px';
        case CordovaPageConstants.settingsWild:          return '63px';
        case CordovaPageConstants.twitterSignIn:         return '50px';
        case CordovaPageConstants.values:                return '3px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp__voter-guide
        case CordovaPageConstants.voterGuideWild:        return '59px';
        case CordovaPageConstants.welcomeWild:           return '22px';
        case CordovaPageConstants.wevoteintroWild:       return '32px';
        default:                                         return '0px';
      }
    } else if (hasIPhoneNotch()) {  // defaults for X or 11 Pro (5.8")
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding: hasIPhoneNotch -- signed in: ${isSignedIn}  page: ${page}`);
      switch (page) {
        case CordovaPageConstants.ballotLgHdrWild:       return showBallotDecisionsTabs() ? '58px' : '42px';
        case CordovaPageConstants.ballotSmHdrWild:       return '163px';
        case CordovaPageConstants.ballotVote:            return '162px';
        case CordovaPageConstants.candidate:             return '66px';
        case CordovaPageConstants.candidateWild:         return '69px';
        case CordovaPageConstants.measureWild:           return '72px';
        case CordovaPageConstants.moreAbout:             return '22px';
        case CordovaPageConstants.moreTerms:             return '60px';
        case CordovaPageConstants.moreTools:             return '44px';
        case CordovaPageConstants.officeWild:            return '96px';
        case CordovaPageConstants.opinions:              return '24px';
        case CordovaPageConstants.opinionsPubFigs:       return '21px';
        case CordovaPageConstants.ready:                 return '73px';
        case CordovaPageConstants.settingsAccount:       return '81px';
        case CordovaPageConstants.settingsHamburger:     return '35px';
        case CordovaPageConstants.settingsNotifications: return '82px';
        case CordovaPageConstants.settingsSubscription:  return '87px';
        case CordovaPageConstants.settingsVoterGuideLst: return '72px';
        case CordovaPageConstants.settingsWild:          return '67px';
        case CordovaPageConstants.twitterSignIn:         return '50px';
        case CordovaPageConstants.values:                return '21px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp__voter-guide
        case CordovaPageConstants.voterGuideWild:        return '75px'; // See cordovaVoterGuideTopPadding instead
        case CordovaPageConstants.welcomeWild:           return '22px';
        case CordovaPageConstants.wevoteintroWild:       return '32px';
        default:                                         return '0px';
      }
    } else if (isIOSAppOnMac()) {
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding: is Apple Silicon ARM64, page: ${page}`);
      switch (page) {
        case CordovaPageConstants.ballotLgHdrWild:       return '34px';  // tested 11/3/20
        case CordovaPageConstants.ballotSmHdrWild:       return '34px';  // tested 11/2/20
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
        case CordovaPageConstants.ready:                 return '50px';   // tested 11/3/20
        case CordovaPageConstants.settingsAccount:       return '85px';
        case CordovaPageConstants.settingsHamburger:     return '45px';  // tested 10/1/20
        case CordovaPageConstants.settingsNotifications: return '67px';  // tested 9/30/20
        case CordovaPageConstants.settingsSubscription:  return '87px';
        case CordovaPageConstants.settingsWild:          return '61px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px';  // $headroom-wrapper-webapp__voter-guide
        case CordovaPageConstants.voterGuideWild:        return '47px';  // tested 10/1/20
        case CordovaPageConstants.welcomeWild:           return '0px';
        case CordovaPageConstants.wevoteintroWild:       return '18px';
        default:                                         return '0px';
      }
    } else if (isIPad()) {
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding: is IPad, page: ${page}`);
      switch (page) {
        case CordovaPageConstants.ballotLgHdrWild:       return '67px';
        case CordovaPageConstants.ballotSmHdrWild:       return '67px';
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
        case CordovaPageConstants.opinionsPubFigs:       return '15px';
        case CordovaPageConstants.ready:                 return '62px';
        case CordovaPageConstants.settingsAccount:       return '85px';
        case CordovaPageConstants.settingsHamburger:     return '75px';
        case CordovaPageConstants.settingsNotifications: return '83px';
        case CordovaPageConstants.settingsSubscription:  return '87px';
        case CordovaPageConstants.settingsWild:          return '61px';
        case CordovaPageConstants.twitterSignIn:         return '50px';
        case CordovaPageConstants.values:                return '13px';
        case CordovaPageConstants.valuesList:            return '38px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp__voter-guide
        case CordovaPageConstants.voterGuideWild:        return '65px';
        case CordovaPageConstants.welcomeWild:           return '0px';
        case CordovaPageConstants.wevoteintroWild:       return '18px';
        case CordovaPageConstants.defaultVal:            return '26px';
        default:                                         return '0px';
      }
    } else {
      cordovaOffsetLog('********* Did not find a screen size match for this iPhone simulator *********');
    }
  } else if (isAndroid()) {
    const sizeString = getAndroidSize();
    cordovaOffsetLog(`cordovaScrollablePaneTopPadding Android sizeString: ${sizeString}, page: ${page}`);
    if (sizeString === '--fold') {
      switch (page) {
        case CordovaPageConstants.ballotLgHdrWild:        return '25px';
        case CordovaPageConstants.ballotSmHdrWild:        return '54px';
        case CordovaPageConstants.ballotVote:             return isSignedIn ? '149px' : '145px';
        case CordovaPageConstants.candidate:              return '64px';
        case CordovaPageConstants.candidateWild:          return '53px';
        case CordovaPageConstants.measureWild:            return '57px';
        case CordovaPageConstants.moreTerms:              return '32px';
        case CordovaPageConstants.officeWild:             return '91px';
        case CordovaPageConstants.ready:                  return '52px';
        case CordovaPageConstants.settingsAccount:        return '53px';
        case CordovaPageConstants.settingsHamburger:      return '43px';
        case CordovaPageConstants.settingsNotifications:  return '39px';
        case CordovaPageConstants.settingsSubscription:   return '54px';
        case CordovaPageConstants.settingsWild:           return '57px';
        case CordovaPageConstants.twitterSignIn:          return hasAndroidNotch() ? '20px' : '10px';
        case CordovaPageConstants.values:                 return '0px';
        case CordovaPageConstants.voterGuideCreatorWild:  return '10px'; // $headroom-wrapper-webapp__voter-guide
        case CordovaPageConstants.voterGuideWild:         return '53px';
        default:                                          return '0px';
      }
    } else if (sizeString === '--xl') {
      switch (page) {
        case CordovaPageConstants.ballotLgHdrWild:        return showBallotDecisionsTabs() ? '36px' : '42px';
        case CordovaPageConstants.ballotSmHdrWild:        return '131px';
        case CordovaPageConstants.ballotVote:             return isSignedIn ? '149px' : '145px';
        case CordovaPageConstants.candidate:              return '64px';
        case CordovaPageConstants.candidateWild:          return '53px';
        case CordovaPageConstants.measureWild:            return '57px';
        case CordovaPageConstants.moreTerms:              return '32px';
        case CordovaPageConstants.officeWild:             return '94px';
        case CordovaPageConstants.ready:                  return '56px';
        case CordovaPageConstants.settingsAccount:        return '53px';
        case CordovaPageConstants.settingsHamburger:      return '43px';
        case CordovaPageConstants.settingsNotifications:  return '39px';
        case CordovaPageConstants.settingsSubscription:   return '54px';
        case CordovaPageConstants.settingsWild:           return '57px';
        case CordovaPageConstants.twitterSignIn:          return hasAndroidNotch() ? '20px' : '10px';
        case CordovaPageConstants.voterGuideCreatorWild:  return '10px'; // $headroom-wrapper-webapp__voter-guide
        case CordovaPageConstants.voterGuideWild:         return '55px';
        default:                                          return '0px';
      }
    } else if (sizeString === '--lg') {
      switch (page) {
        case CordovaPageConstants.ballotSmHdrWild:       return '135px';
        case CordovaPageConstants.ballotVote:            return isSignedIn ? '128px' : '135px';
        case CordovaPageConstants.candidate:             return '55px';
        case CordovaPageConstants.candidateWild:         return '53px';
        case CordovaPageConstants.measureWild:           return '40px';
        case CordovaPageConstants.moreTerms:             return '32px';
        case CordovaPageConstants.officeWild:            return '78px';
        case CordovaPageConstants.ready:                 return '47px';
        case CordovaPageConstants.settingsAccount:       return '51px';
        case CordovaPageConstants.settingsHamburger:     return '46px';
        case CordovaPageConstants.settingsNotifications: return '39px';
        case CordovaPageConstants.settingsSubscription:  return '87px';
        case CordovaPageConstants.settingsWild:          return '37px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp__voter-guide
        default:                                         return '0px';
      }
    } if (sizeString === '--md') {
      switch (page) {
        case CordovaPageConstants.ballotLgHdrWild:       return showBallotDecisionsTabs() ? '58px' : '42px';
        case CordovaPageConstants.ballotSmHdrWild:       return '124px';
        case CordovaPageConstants.ballotVote:            return isSignedIn ? '132px' : '131px';
        case CordovaPageConstants.candidate:             return '53px';
        case CordovaPageConstants.candidateWild:         return '51px';
        case CordovaPageConstants.measureWild:           return '53px';
        case CordovaPageConstants.moreTerms:             return '32px';
        case CordovaPageConstants.officeWild:            return '84px';
        case CordovaPageConstants.ready:                 return '50px';
        case CordovaPageConstants.settingsAccount:       return '53px';
        case CordovaPageConstants.settingsHamburger:     return '38px';
        case CordovaPageConstants.settingsNotifications: return '39px';
        case CordovaPageConstants.settingsSubscription:  return '53px';
        case CordovaPageConstants.settingsWild:          return '61px';
        case CordovaPageConstants.values:                return '0px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp__voter-guide
        default:                          return '0px';
      }
    } else if (sizeString === '--sm') {
      switch (page) {
        case CordovaPageConstants.ballotLgHdrWild:       return showBallotDecisionsTabs() ? '58px' : '42px';
        case CordovaPageConstants.ballotSmHdrWild:       return '114px';
        case CordovaPageConstants.ballotVote:            return isSignedIn ? '131px' : '128px';
        case CordovaPageConstants.candidate:             return '24px';
        case CordovaPageConstants.candidateWild:         return '36px';
        case CordovaPageConstants.measureWild:           return '42px';
        case CordovaPageConstants.moreTerms:             return '32px';
        case CordovaPageConstants.officeWild:            return '61px';
        case CordovaPageConstants.ready:                 return '30px';
        case CordovaPageConstants.settingsAccount:       return '40px';
        case CordovaPageConstants.settingsHamburger:     return '43px';
        case CordovaPageConstants.settingsNotifications: return '39px';
        case CordovaPageConstants.settingsWild:          return '55px';
        case CordovaPageConstants.values:                return '0';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // $headroom-wrapper-webapp__voter-guide
        default:                                         return '0px';
      }
    }
  }
  return '0px';
}
