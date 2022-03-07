import CordovaPageConstants from '../constants/CordovaPageConstants';
import VoterStore from '../stores/VoterStore';
import showBallotDecisionsTabs from '../utilsApi/showBallotDecisionsTabs';
import { getAndroidSize, hasAndroidNotch, hasIPhoneNotch, isAndroid, isAndroidSimulator, isIOS, isIOSAppOnMac, isIPad, isIPadGiantSize, isIPhone4in, isIPhone4p7in, isIPhone5p5inEarly, isIPhone5p5inMini, isIPhone6p1in, isIPhone6p5in, isSimulator } from '../common/utils/cordovaUtils';
import { pageEnumeration } from './cordovaUtilsPageEnumeration';
import isMobileScreenSize from '../common/utils/isMobileScreenSize';
import { cordovaOffsetLog } from '../common/utils/logging';


export default function cordovaScrollablePaneTopPadding (pageEnumerationOverride = false) {
  const voter = VoterStore.getVoter();
  const { is_signed_in: isSignedIn } = voter;
  const page = pageEnumerationOverride || pageEnumeration();
  // const showBallotDecisionTabs = (BallotStore.ballotLength !== BallotStore.ballotRemainingChoicesLength) && (BallotStore.ballotRemainingChoicesLength > 0);

  if (isSimulator()) {
    if (isAndroidSimulator()) {
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding android: ${window.location.href}, page: ${page}, showBallotDecisionsTabs(): ${showBallotDecisionsTabs()}`);
    } else {
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding iOS: ${window.location.href.slice(0, 40)}, page: ${page}, showBallotDecisionsTabs(): ${showBallotDecisionsTabs()}`);
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding iOS: ${window.location.href.slice(window.location.href.length - 80)}`);
    }
  }

  if (isIOS()) {
    if (isIPhone4in()) {
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding: isIPhone4in, page: ${page}`);
      switch (page) {
        // case CordovaPageConstants.about:                 return '12px'; // We should use "CordovaPageConstants.moreAbout"
        case CordovaPageConstants.ballotLgHdrWild:       return showBallotDecisionsTabs() ? '48px' : '32px';
        case CordovaPageConstants.ballotSmHdrWild:       return '141px';  // $body-padding-top-no-decision-tabs
        case CordovaPageConstants.ballotVote:            return '157px';
        case CordovaPageConstants.candidate:             return '42px';
        case CordovaPageConstants.candidateWild:         return '42px';
        case CordovaPageConstants.friends:               return '80px';
        case CordovaPageConstants.friendsCurrent:        return '0';
        case CordovaPageConstants.friendsSentRequest:    return '0';
        case CordovaPageConstants.measureWild:           return '42px';
        case CordovaPageConstants.moreAbout:             return '22px';
        case CordovaPageConstants.moreCredits:           return '22px';
        case CordovaPageConstants.moreElections:         return '68px';
        case CordovaPageConstants.moreFaq:               return '40px';
        case CordovaPageConstants.moreTerms:             return '40px';
        case CordovaPageConstants.moreTools:             return '44px';
        case CordovaPageConstants.news:                  return '90px';
        case CordovaPageConstants.officeWild:            return '84px';
        case CordovaPageConstants.opinions:              return '89px';
        case CordovaPageConstants.opinionsFiltered:      return '89px';
        case CordovaPageConstants.ready:                 return '93px';
        case CordovaPageConstants.settingsAccount:       return '84px';
        case CordovaPageConstants.settingsHamburger:     return '57px';
        case CordovaPageConstants.settingsNotifications: return '67px';
        case CordovaPageConstants.settingsProfile:       return '0px';
        case CordovaPageConstants.settingsSubscription:  return '67px';
        case CordovaPageConstants.settingsVoterGuideLst: return '67px';
        case CordovaPageConstants.settingsWild:          return '67px';
        case CordovaPageConstants.twitterHandleLanding:  return '82px';
        case CordovaPageConstants.twitterInfoPage:       return '26px';
        case CordovaPageConstants.twitterSignIn:         return '20px';
        case CordovaPageConstants.values:                return '89px';
        case CordovaPageConstants.valuesList:            return '92px';
        case CordovaPageConstants.valuesWild:            return '20px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // should be '130px'; // $headroom-wrapper-webapp__voter-guide-creator
        case CordovaPageConstants.voterGuideWild:        return '59px';
        case CordovaPageConstants.welcomeWild:           return '10px';
        case CordovaPageConstants.wevoteintroWild:       return '18px';
        default:                          return '0px';
      }
    } else if (isIPhone4p7in()) {
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding: isIPhone4p7in, page: ${page}`);
      switch (page) {
        // case CordovaPageConstants.about:                 return '12px'; // We should use "CordovaPageConstants.moreAbout"
        case CordovaPageConstants.ballotLgHdrWild:       return showBallotDecisionsTabs() ? '52px' : '36px';
        case CordovaPageConstants.ballotSmHdrWild:       return '140px';
        case CordovaPageConstants.ballotVote:            return isSignedIn ? '149px' : '148px';
        case CordovaPageConstants.candidate:             return '42px';
        case CordovaPageConstants.candidateWild:         return '76px';
        case CordovaPageConstants.friends:               return '0px';
        case CordovaPageConstants.friendsCurrent:        return '0px';
        case CordovaPageConstants.friendsSentRequest:    return '0px';
        case CordovaPageConstants.measureWild:           return '58px';
        case CordovaPageConstants.moreAbout:             return '22px';
        case CordovaPageConstants.moreCredits:           return '22px';
        case CordovaPageConstants.moreElections:         return '58px';
        case CordovaPageConstants.moreFaq:               return '76px';
        case CordovaPageConstants.moreTerms:             return '69px';
        case CordovaPageConstants.moreTools:             return '44px';
        case CordovaPageConstants.news:                  return '68px';
        case CordovaPageConstants.officeWild:            return '101px';
        case CordovaPageConstants.opinions:              return '74px';
        case CordovaPageConstants.opinionsFiltered:      return '72px';
        case CordovaPageConstants.ready:                 return '77px';
        case CordovaPageConstants.settingsAccount:       return '75px';
        case CordovaPageConstants.settingsHamburger:     return '66px';
        case CordovaPageConstants.settingsNotifications: return '75px';
        case CordovaPageConstants.settingsProfile:       return '12px';
        case CordovaPageConstants.settingsSubscription:  return '50px';
        case CordovaPageConstants.settingsVoterGuideLst: return '73px';
        case CordovaPageConstants.settingsWild:          return '76px';
        case CordovaPageConstants.twitterHandleLanding:  return '67px';
        case CordovaPageConstants.twitterSignIn:         return '99px';
        case CordovaPageConstants.values:                return '78px';
        case CordovaPageConstants.valuesList:            return '77px';
        case CordovaPageConstants.valuesWild:            return '77px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // should be '130px'; // $headroom-wrapper-webapp__voter-guide-creator
        case CordovaPageConstants.voterGuideWild:        return '55px';
        case CordovaPageConstants.welcomeWild:           return '10px';
        case CordovaPageConstants.wevoteintroWild:       return '18px';
        default:                                         return '0px';
      }
    } else if (isIPhone5p5inEarly()) {
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding: isIPhone5p5inEarly, page: ${page}`);
      switch (page) {
        // case CordovaPageConstants.ballotLgHdrWild:       return showBallotDecisionsTabs() ? '35px' : '19px';
        case CordovaPageConstants.ballotSmHdrWild:       return '148px';
        case CordovaPageConstants.ballotVote:            return '157px';
        case CordovaPageConstants.candidate:             return '40px';
        case CordovaPageConstants.candidateWild:         return '74px';
        case CordovaPageConstants.friends:               return '0px';
        case CordovaPageConstants.friendsCurrent:        return '0px';
        case CordovaPageConstants.friendsSentRequest:    return '0px';
        case CordovaPageConstants.measureWild:           return '58px';
        case CordovaPageConstants.moreAbout:             return '22px';
        case CordovaPageConstants.moreCredits:           return '22px';
        case CordovaPageConstants.moreElections:         return '58px';
        case CordovaPageConstants.moreFaq:               return '73px';
        case CordovaPageConstants.moreTerms:             return '63px';
        case CordovaPageConstants.moreTools:             return '44px';
        case CordovaPageConstants.news:                  return '68px';
        case CordovaPageConstants.officeWild:            return '84px';
        case CordovaPageConstants.opinions:              return '73px';
        case CordovaPageConstants.opinionsFiltered:      return '72px';
        case CordovaPageConstants.ready:                 return '73px';
        case CordovaPageConstants.settingsAccount:       return '76px';
        case CordovaPageConstants.settingsHamburger:     return '60px';
        case CordovaPageConstants.settingsNotifications: return '74px';
        case CordovaPageConstants.settingsProfile:       return '5px';
        case CordovaPageConstants.settingsSubscription:  return '72px';
        case CordovaPageConstants.settingsVoterGuideLst: return '75px';
        case CordovaPageConstants.settingsWild:          return '76px';
        case CordovaPageConstants.twitterHandleLanding:  return '67px';
        case CordovaPageConstants.twitterInfoPage:       return '26px';
        case CordovaPageConstants.twitterSignIn:         return '70px';
        case CordovaPageConstants.values:                return '71px';
        case CordovaPageConstants.valuesList:            return '74px';
        case CordovaPageConstants.valuesWild:            return '74px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // should be '130px'; // $headroom-wrapper-webapp__voter-guide-creator
        case CordovaPageConstants.voterGuideWild:        return '51px';
        case CordovaPageConstants.welcomeWild:           return '22px';
        case CordovaPageConstants.wevoteintroWild:       return '18px';
        default:                                         return '0px';
      }
    } else if (isIPhone5p5inMini()) {
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding: isIPhone5p5inMini, page: ${page}`);
      switch (page) {
        // case CordovaPageConstants.about:                 return '0px'; // We should use "CordovaPageConstants.moreAbout"
        case CordovaPageConstants.ballotLgHdrWild:       return showBallotDecisionsTabs() ? '35px' : '19px';
        case CordovaPageConstants.ballotSmHdrWild:       return '193px';
        case CordovaPageConstants.ballotVote:            return '157px';
        case CordovaPageConstants.candidate:             return '40px';
        case CordovaPageConstants.candidateWild:         return '96px';
        case CordovaPageConstants.friends:               return '0px';
        case CordovaPageConstants.friendsCurrent:        return '0px';
        case CordovaPageConstants.friendsSentRequest:    return '0px';
        case CordovaPageConstants.measureWild:           return '58px';
        case CordovaPageConstants.moreAbout:             return '22px';
        case CordovaPageConstants.moreCredits:           return '22px';
        case CordovaPageConstants.moreElections:         return '32px';
        case CordovaPageConstants.moreFaq:               return '93px';
        case CordovaPageConstants.moreTerms:             return '74px';
        case CordovaPageConstants.moreTools:             return '44px';
        case CordovaPageConstants.news:                  return '94px';
        case CordovaPageConstants.officeWild:            return '115px';
        case CordovaPageConstants.opinions:              return '91px';
        case CordovaPageConstants.opinionsFiltered:      return '88px';
        case CordovaPageConstants.ready:                 return '93px';
        case CordovaPageConstants.settingsAccount:       return '84px';
        case CordovaPageConstants.settingsHamburger:     return '76px';
        case CordovaPageConstants.settingsNotifications: return '93px';
        case CordovaPageConstants.settingsProfile:       return '25px';
        case CordovaPageConstants.settingsSubscription:  return '77px';
        case CordovaPageConstants.settingsVoterGuideLst: return '75px';
        case CordovaPageConstants.settingsWild:          return '94px';
        case CordovaPageConstants.twitterInfoPage:       return '43px';
        case CordovaPageConstants.twitterHandleLanding:  return '87px';
        case CordovaPageConstants.twitterSignIn:         return '70px';
        case CordovaPageConstants.values:                return '94px';
        case CordovaPageConstants.valuesList:            return '93px';
        case CordovaPageConstants.valuesWild:            return '693px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // should be '130px'; // $headroom-wrapper-webapp__voter-guide-creator
        case CordovaPageConstants.voterGuideWild:        return '51px';
        case CordovaPageConstants.welcomeWild:           return '22px';
        case CordovaPageConstants.wevoteintroWild:       return '18px';
        default:                                         return '0px';
      }
    } else if (isIPhone6p1in()) {  // XR, iPhone 11, iPhone 13 and 13 Pro
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding: isIPhone6p1in, page: ${page}`);
      switch (page) {
        // case CordovaPageConstants.about:                 return '12px'; // We should use "CordovaPageConstants.moreAbout"
        case CordovaPageConstants.ballotLgHdrWild:       return showBallotDecisionsTabs() ? '58px' : '41px';
        case CordovaPageConstants.ballotSmHdrWild:       return '156px';
        case CordovaPageConstants.ballotVote:            return isSignedIn ? '163px' : '165px';
        case CordovaPageConstants.candidate:             return '56px';
        case CordovaPageConstants.candidateWild:         return '86px';
        case CordovaPageConstants.friends:               return '62px';
        case CordovaPageConstants.friendsCurrent:        return '62px';
        case CordovaPageConstants.friendsSentRequest:    return '62px';
        case CordovaPageConstants.measureWild:           return '48px';
        case CordovaPageConstants.moreAbout:             return '22px';
        case CordovaPageConstants.moreCredits:           return '22px';
        case CordovaPageConstants.moreElections:         return '68px';
        case CordovaPageConstants.moreFaq:               return '89px';
        case CordovaPageConstants.moreTerms:             return '85px';
        case CordovaPageConstants.moreTools:             return '44px';
        case CordovaPageConstants.news:                  return '83px';
        case CordovaPageConstants.officeWild:            return '113px';
        case CordovaPageConstants.opinions:              return '88px';
        case CordovaPageConstants.opinionsFiltered:      return '85px';
        case CordovaPageConstants.ready:                 return '86px';
        case CordovaPageConstants.settingsAccount:       return '89px';
        case CordovaPageConstants.settingsHamburger:     return '90px';
        case CordovaPageConstants.settingsNotifications: return '88px';
        case CordovaPageConstants.settingsProfile:       return '0px';
        case CordovaPageConstants.settingsSubscription:  return '77px';
        case CordovaPageConstants.settingsVoterGuideLst: return '75px';
        case CordovaPageConstants.settingsWild:          return '88px';
        case CordovaPageConstants.twitterHandleLanding:  return '82px';
        case CordovaPageConstants.twitterInfoPage:       return '28px';
        case CordovaPageConstants.twitterSignIn:         return '50px';
        case CordovaPageConstants.values:                return '87px';
        case CordovaPageConstants.valuesList:            return '87px';
        case CordovaPageConstants.valuesWild:            return '87px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // should be '130px'; // $headroom-wrapper-webapp__voter-guide-creator
        case CordovaPageConstants.voterGuideWild:        return '74px';
        case CordovaPageConstants.welcomeWild:           return '22px';
        case CordovaPageConstants.wevoteintroWild:       return '32px';
        default:                                         return '0px';
      }
    } else if (isIPhone6p5in()) {
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding: isIPhone6p5in (and 6.7), page: ${page}`);
      switch (page) {
        case CordovaPageConstants.ballotLgHdrWild:       return showBallotDecisionsTabs() ? '58px' : '42px';
        case CordovaPageConstants.ballotSmHdrWild:       return '161px';
        case CordovaPageConstants.ballotVote:            return isSignedIn ? '165px' : '173px';
        case CordovaPageConstants.candidate:             return '56px';
        case CordovaPageConstants.candidateWild:         return '96px';
        case CordovaPageConstants.friends:               return '80px';
        case CordovaPageConstants.friendsCurrent:        return '0';
        case CordovaPageConstants.friendsSentRequest:    return '0';
        case CordovaPageConstants.measureWild:           return '56px';
        case CordovaPageConstants.moreAbout:             return '22px';
        case CordovaPageConstants.moreFaq:               return '89px';
        case CordovaPageConstants.moreTerms:             return '91px';
        case CordovaPageConstants.moreTools:             return '44px';
        case CordovaPageConstants.news:                  return '90px';
        case CordovaPageConstants.opinions:              return '73px';
        case CordovaPageConstants.officeWild:            return '120px';
        case CordovaPageConstants.opinionsFiltered:      return '89px';
        case CordovaPageConstants.ready:                 return '93px';
        case CordovaPageConstants.settingsAccount:       return '84px';
        case CordovaPageConstants.settingsHamburger:     return '74px';
        case CordovaPageConstants.settingsNotifications: return '88px';
        case CordovaPageConstants.settingsProfile:       return '0px';
        case CordovaPageConstants.settingsSubscription:  return '90px';
        case CordovaPageConstants.settingsVoterGuideLst: return '98px';
        case CordovaPageConstants.settingsWild:          return '88px';
        case CordovaPageConstants.twitterHandleLanding:  return '82px';
        case CordovaPageConstants.twitterInfoPage:       return '26px';
        case CordovaPageConstants.twitterSignIn:         return '50px';
        case CordovaPageConstants.values:                return '89px';
        case CordovaPageConstants.valuesList:            return '92px';
        case CordovaPageConstants.valuesWild:            return '89px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // should be '130px'; // $headroom-wrapper-webapp__voter-guide-creator
        case CordovaPageConstants.voterGuideWild:        return '59px';
        case CordovaPageConstants.welcomeWild:           return '22px';
        case CordovaPageConstants.wevoteintroWild:       return '32px';
        default:                                         return '0px';
      }
    } else if (hasIPhoneNotch()) {  // defaults for X or 11 Pro (5.8")
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding: hasIPhoneNotch -- signed in: ${isSignedIn}  page: ${page}`);
      switch (page) {
        // case CordovaPageConstants.ballotLgHdrWild:       return showBallotDecisionsTabs() ? '58px' : '42px';
        case CordovaPageConstants.ballotSmHdrWild:       return '163px';
        case CordovaPageConstants.ballotVote:            return '162px';
        case CordovaPageConstants.candidate:             return '66px';
        case CordovaPageConstants.candidateWild:         return '88px';
        case CordovaPageConstants.friends:               return '0px';
        case CordovaPageConstants.friendsCurrent:        return '0px';
        case CordovaPageConstants.friendsSentRequest:    return '0px';
        case CordovaPageConstants.measureWild:           return '17px';
        case CordovaPageConstants.moreAbout:             return '22px';
        case CordovaPageConstants.moreFaq:               return '90px';
        case CordovaPageConstants.moreElections:         return '90px';
        case CordovaPageConstants.moreTerms:             return '90px';
        case CordovaPageConstants.moreTools:             return '44px';
        case CordovaPageConstants.news:                  return '90px';
        case CordovaPageConstants.officeWild:            return '115px';
        case CordovaPageConstants.opinions:              return '89px';
        case CordovaPageConstants.opinionsFiltered:      return '87px';
        case CordovaPageConstants.ready:                 return '85px';
        case CordovaPageConstants.settingsAccount:       return '81px';
        case CordovaPageConstants.settingsHamburger:     return '80px';
        case CordovaPageConstants.settingsNotifications: return '88px';
        case CordovaPageConstants.settingsProfile:       return '0px';
        case CordovaPageConstants.settingsSubscription:  return '87px';
        case CordovaPageConstants.settingsVoterGuideLst: return '72px';
        case CordovaPageConstants.settingsWild:          return '90px';
        case CordovaPageConstants.twitterHandleLanding:  return '82px';
        case CordovaPageConstants.twitterInfoPage:       return '26px';
        case CordovaPageConstants.twitterSignIn:         return '50px';
        case CordovaPageConstants.values:                return '90px';
        case CordovaPageConstants.valuesList:            return '90px';
        case CordovaPageConstants.valuesWild:            return '90px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // should be '130px'; // $headroom-wrapper-webapp__voter-guide-creator
        case CordovaPageConstants.voterGuideWild:        return '75px'; // See cordovaVoterGuideTopPadding instead
        case CordovaPageConstants.welcomeWild:           return '22px';
        case CordovaPageConstants.wevoteintroWild:       return '32px';
        default:                                         return '0px';
      }
    } else if (isIOSAppOnMac()) {
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding: is Apple Silicon ARM64 on MacOS, page: ${page}`);
      switch (page) {
        case CordovaPageConstants.ballotLgHdrWild:       return '34px';
        case CordovaPageConstants.ballotSmHdrWild:       return '34px';
        case CordovaPageConstants.ballotVote:            return '131px';
        case CordovaPageConstants.candidate:             return '40px';
        case CordovaPageConstants.candidateWild:         return '49px';
        case CordovaPageConstants.friends:               return '80px';
        case CordovaPageConstants.friendsCurrent:        return '0';
        case CordovaPageConstants.friendsSentRequest:    return '0';
        case CordovaPageConstants.measureWild:           return '56px';
        case CordovaPageConstants.moreAbout:             return '22px';
        case CordovaPageConstants.moreFaq:               return '44px';
        case CordovaPageConstants.moreTerms:             return '44px';
        case CordovaPageConstants.moreTools:             return '44px';
        case CordovaPageConstants.news:                  return '9px';
        case CordovaPageConstants.officeWild:            return '106px';
        case CordovaPageConstants.opinions:              return '14px';
        case CordovaPageConstants.opinionsFiltered:      return '89px';
        case CordovaPageConstants.ready:                 return '50px';
        case CordovaPageConstants.settingsAccount:       return '85px';
        case CordovaPageConstants.settingsHamburger:     return '45px';
        case CordovaPageConstants.settingsNotifications: return '67px';
        case CordovaPageConstants.settingsProfile:       return '0px';
        case CordovaPageConstants.settingsSubscription:  return '87px';
        case CordovaPageConstants.settingsVoterGuideLst: return '98px';
        case CordovaPageConstants.settingsWild:          return '61px';
        case CordovaPageConstants.twitterHandleLanding:  return '82px';
        case CordovaPageConstants.twitterInfoPage:       return '26px';
        case CordovaPageConstants.twitterSignIn:         return '50px';
        case CordovaPageConstants.values:                return '89px';
        case CordovaPageConstants.valuesList:            return '92px';
        case CordovaPageConstants.valuesWild:            return '89px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // should be '130px';  // $headroom-wrapper-webapp__voter-guide-creator
        case CordovaPageConstants.voterGuideWild:        return '47px';
        case CordovaPageConstants.welcomeWild:           return '0px';
        case CordovaPageConstants.wevoteintroWild:       return '18px';
        default:                                         return '0px';
      }
    } else if (isIPad()) {
      cordovaOffsetLog(`cordovaScrollablePaneTopPadding: is IPad, page: ${page}`);
      switch (page) {
        // case CordovaPageConstants.about:                 return '12px'; // We should use "CordovaPageConstants.moreAbout"
        case CordovaPageConstants.ballotLgHdrWild:       return '64px';  // Ballot when signed in on iPad Nov 2021
        case CordovaPageConstants.ballotSmHdrWild:       return isIPadGiantSize() ? '67px' : '175px';
        case CordovaPageConstants.ballotVote:            return '131px';
        case CordovaPageConstants.candidate:             return '40px';
        case CordovaPageConstants.candidateWild:         return isIPadGiantSize() ? '90px' : '65px';
        case CordovaPageConstants.friends:               return '0px';
        case CordovaPageConstants.friendsCurrent:        return '0px';
        case CordovaPageConstants.friendsSentRequest:    return '0px';
        case CordovaPageConstants.measureWild:           return '54px';
        case CordovaPageConstants.moreAbout:             return '22px';
        case CordovaPageConstants.moreCredits:           return isIPadGiantSize() ? '0px' : '22px';
        case CordovaPageConstants.moreElections:         return '58px';
        case CordovaPageConstants.moreFaq:               return '61px';
        case CordovaPageConstants.moreTerms:             return '80px';
        case CordovaPageConstants.moreTools:             return '44px';
        case CordovaPageConstants.news:                  return '78px';
        case CordovaPageConstants.officeWild:            return '157px';
        case CordovaPageConstants.opinions:              return '77px';
        case CordovaPageConstants.opinionsFiltered:      return '88px';
        case CordovaPageConstants.ready:                 return '88px';
        case CordovaPageConstants.settingsAccount:       return '85px';
        case CordovaPageConstants.settingsHamburger:     return '75px';
        case CordovaPageConstants.settingsNotifications: return '83px';
        case CordovaPageConstants.settingsProfile:       return '0px';
        case CordovaPageConstants.settingsSubscription:  return '87px';
        case CordovaPageConstants.settingsVoterGuideLst: return '75px';
        case CordovaPageConstants.settingsWild:          return '83px';
        case CordovaPageConstants.twitterHandleLanding:  return '67px';
        case CordovaPageConstants.twitterSignIn:         return '50px';
        case CordovaPageConstants.values:                return '92px';
        case CordovaPageConstants.valuesList:            return '80px';
        case CordovaPageConstants.valuesWild:            return '80px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // should be '130px'; // $headroom-wrapper-webapp__voter-guide-creator
        case CordovaPageConstants.voterGuideWild:        return '65px';
        case CordovaPageConstants.welcomeWild:           return '0px';
        case CordovaPageConstants.wevoteintroWild:       return '18px';
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
        case CordovaPageConstants.ballotLgHdrWild:        return '1px';
        case CordovaPageConstants.ballotSmHdrWild:        return '99px';
        case CordovaPageConstants.ballotVote:             return isSignedIn ? '149px' : '145px';
        case CordovaPageConstants.candidate:              return '64px';
        case CordovaPageConstants.candidateWild:          return '57px';
        case CordovaPageConstants.friends:                return '0px';
        case CordovaPageConstants.friendsCurrent:         return '0px';
        case CordovaPageConstants.friendsSentRequest:     return '0px';
        case CordovaPageConstants.measureWild:            return '103px';
        case CordovaPageConstants.moreElections:          return '49px';
        case CordovaPageConstants.moreFaq:                return '46px';
        case CordovaPageConstants.moreTerms:              return '32px';
        case CordovaPageConstants.news:                   return '58px';
        case CordovaPageConstants.officeWild:             return '100px';
        case CordovaPageConstants.opinions:               return '60px';
        case CordovaPageConstants.opinionsFiltered:       return '60px';
        case CordovaPageConstants.ready:                  return '60px';
        case CordovaPageConstants.settingsAccount:        return '60px';
        case CordovaPageConstants.settingsHamburger:      return '43px';
        case CordovaPageConstants.settingsNotifications:  return '60px';
        case CordovaPageConstants.settingsProfile:        return '60px';
        case CordovaPageConstants.settingsSubscription:   return '54px';
        case CordovaPageConstants.settingsWild:           return '57px';
        case CordovaPageConstants.twitterHandleLanding:   return '65px';
        case CordovaPageConstants.twitterSignIn:          return hasAndroidNotch() ? '20px' : '10px';
        case CordovaPageConstants.values:                 return '60px';
        case CordovaPageConstants.valuesList:             return '60px';
        case CordovaPageConstants.valuesWild:             return '60px';
        case CordovaPageConstants.voterGuideCreatorWild:  return '10px'; // should be '130px'; // $headroom-wrapper-webapp__voter-guide-creator
        case CordovaPageConstants.voterGuideWild:         return '53px';
        default:                                          return '0px';
      }
    } else if (sizeString === '--xl') {
      switch (page) {
        case CordovaPageConstants.ballotLgHdrWild:        return showBallotDecisionsTabs() ? '2px' : '42px';
        case CordovaPageConstants.ballotSmHdrWild:        return '131px';
        case CordovaPageConstants.ballotVote:             return isSignedIn ? '149px' : '145px';
        case CordovaPageConstants.candidate:              return '64px';
        case CordovaPageConstants.candidateWild:          return '59px';
        case CordovaPageConstants.friends:                return '0px';
        case CordovaPageConstants.friendsCurrent:         return '0px';
        case CordovaPageConstants.friendsSentRequest:     return '0px';
        case CordovaPageConstants.measureWild:            return '57px';
        case CordovaPageConstants.moreElections:          return '49px';
        case CordovaPageConstants.moreFaq:                return '58px';
        case CordovaPageConstants.moreTerms:              return '58px';
        case CordovaPageConstants.news:                   return '58px';
        case CordovaPageConstants.officeWild:             return '102px';
        case CordovaPageConstants.opinions:               return '51px';
        case CordovaPageConstants.opinionsFiltered:       return '51px';
        case CordovaPageConstants.ready:                  return '56px';
        case CordovaPageConstants.settingsAccount:        return '53px';
        case CordovaPageConstants.settingsHamburger:      return '43px';
        case CordovaPageConstants.settingsNotifications:  return '58px';
        case CordovaPageConstants.settingsProfile:        return '7px';
        case CordovaPageConstants.settingsSubscription:   return '54px';
        case CordovaPageConstants.settingsWild:           return '57px';
        case CordovaPageConstants.twitterHandleLanding:   return '65px';
        case CordovaPageConstants.twitterSignIn:          return hasAndroidNotch() ? '20px' : '10px';
        case CordovaPageConstants.values:                 return '60px';
        case CordovaPageConstants.valuesList:             return '60px';
        case CordovaPageConstants.valuesWild:             return '60px';
        case CordovaPageConstants.voterGuideCreatorWild:  return '10px'; // should be '130px'; // $headroom-wrapper-webapp__voter-guide-creator
        case CordovaPageConstants.voterGuideWild:         return '55px';
        default:                                          return '0px';
      }
    } else if (sizeString === '--lg') {
      switch (page) {
        case CordovaPageConstants.ballotLgHdrWild:       return '34px';
        case CordovaPageConstants.ballotSmHdrWild:       return '135px';
        case CordovaPageConstants.ballotVote:            return isSignedIn ? '128px' : '135px';
        case CordovaPageConstants.candidate:             return '55px';
        case CordovaPageConstants.candidateWild:         return '53px';
        case CordovaPageConstants.friends:               return '0px';
        case CordovaPageConstants.friendsCurrent:        return '0px';
        case CordovaPageConstants.friendsSentRequest:    return '0px';
        case CordovaPageConstants.measureWild:           return '40px';
        case CordovaPageConstants.moreAbout:             return '22px';
        case CordovaPageConstants.moreFaq:               return '42px';
        case CordovaPageConstants.moreTerms:             return '45px';
        case CordovaPageConstants.moreTools:             return '44px';
        case CordovaPageConstants.news:                  return '47px';
        case CordovaPageConstants.officeWild:            return '78px';
        case CordovaPageConstants.opinions:              return '50px';
        case CordovaPageConstants.opinionsFiltered:      return '53px';
        case CordovaPageConstants.ready:                 return '47px';
        case CordovaPageConstants.settingsAccount:       return '51px';
        case CordovaPageConstants.settingsHamburger:     return '46px';
        case CordovaPageConstants.settingsNotifications: return '39px';
        case CordovaPageConstants.settingsProfile:       return '0px';
        case CordovaPageConstants.settingsSubscription:  return '87px';
        case CordovaPageConstants.settingsVoterGuideLst: return '98px';
        case CordovaPageConstants.settingsWild:          return '50px';
        case CordovaPageConstants.twitterHandleLanding:  return '46px';
        case CordovaPageConstants.twitterInfoPage:       return '26px';
        case CordovaPageConstants.twitterSignIn:         return '50px';
        case CordovaPageConstants.values:                return '53px';
        case CordovaPageConstants.valuesList:            return '92px';
        case CordovaPageConstants.valuesWild:            return '53px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // should be '130px'; // $headroom-wrapper-webapp__voter-guide-creator
        case CordovaPageConstants.voterGuideWild:        return '47px';
        case CordovaPageConstants.welcomeWild:           return '0px';
        case CordovaPageConstants.wevoteintroWild:       return '18px';
        default:                                         return '0px';
      }
    }
    if (sizeString === '--md') {
      switch (page) {
        case CordovaPageConstants.ballotLgHdrWild:       return showBallotDecisionsTabs() ? '58px' : '42px';
        case CordovaPageConstants.ballotSmHdrWild:       return '124px';
        case CordovaPageConstants.ballotVote:            return isSignedIn ? '132px' : '131px';
        case CordovaPageConstants.candidate:             return '53px';
        case CordovaPageConstants.candidateWild:         return '51px';
        case CordovaPageConstants.friends:               return '0px';
        case CordovaPageConstants.friendsCurrent:        return '0px';
        case CordovaPageConstants.friendsSentRequest:    return '0px';
        case CordovaPageConstants.measureWild:           return '53px';
        case CordovaPageConstants.moreFaq:               return '41px';
        case CordovaPageConstants.moreTerms:             return '43px';
        case CordovaPageConstants.news:                  return '47px';
        case CordovaPageConstants.officeWild:            return '84px';
        case CordovaPageConstants.opinions:              return '51px';
        case CordovaPageConstants.opinionsFiltered:      return '51px';
        case CordovaPageConstants.ready:                 return '50px';
        case CordovaPageConstants.settingsAccount:       return '53px';
        case CordovaPageConstants.settingsHamburger:     return '38px';
        case CordovaPageConstants.settingsNotifications: return '39px';
        case CordovaPageConstants.settingsSubscription:  return '53px';
        case CordovaPageConstants.settingsWild:          return '20px';
        case CordovaPageConstants.twitterHandleLanding:  return '46px';
        case CordovaPageConstants.twitterSignIn:         return hasAndroidNotch() ? '20px' : '10px';
        case CordovaPageConstants.values:                return '53px';
        case CordovaPageConstants.valuesList:            return '53px';
        case CordovaPageConstants.valuesWild:            return '53px';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // should be '130px'; // $headroom-wrapper-webapp__voter-guide-creator
        case CordovaPageConstants.voterGuideWild:        return '53px';
        default:                                         return '0px';
      }
    } else if (sizeString === '--sm') {
      switch (page) {
        // case CordovaPageConstants.about:                 return '0px'; // We should use "CordovaPageConstants.moreAbout"
        case CordovaPageConstants.ballotLgHdrWild:       return showBallotDecisionsTabs() ? '58px' : '42px';
        case CordovaPageConstants.ballotSmHdrWild:       return '114px';
        case CordovaPageConstants.ballotVote:            return isSignedIn ? '131px' : '128px';
        case CordovaPageConstants.candidate:             return '24px';
        case CordovaPageConstants.candidateWild:         return '36px';
        case CordovaPageConstants.measureWild:           return '42px';
        case CordovaPageConstants.moreFaq:               return '32px';
        case CordovaPageConstants.moreTerms:             return '32px';
        case CordovaPageConstants.officeWild:            return '61px';
        case CordovaPageConstants.ready:                 return '30px';
        case CordovaPageConstants.settingsAccount:       return '40px';
        case CordovaPageConstants.settingsHamburger:     return '43px';
        case CordovaPageConstants.settingsNotifications: return '39px';
        case CordovaPageConstants.settingsWild:          return '55px';
        case CordovaPageConstants.values:                return '0';
        case CordovaPageConstants.voterGuideCreatorWild: return '10px'; // should be '130px'; // $headroom-wrapper-webapp__voter-guide-creator
        default:                                         return '0px';
      }
    }
  } else if (isMobileScreenSize()) {
    cordovaOffsetLog(`cordovaScrollablePaneTopPadding: WebApp mobile screen size, page: ${page}`);
    switch (page) {
      case CordovaPageConstants.ballotLgHdrWild:          return showBallotDecisionsTabs() ? '0px' : '0px';
      case CordovaPageConstants.ballotSmHdrWild:          return '0px';
      // case CordovaPageConstants.ballotVote:
      //   return isSignedIn ? '131px' : '128px';
      // case CordovaPageConstants.candidate:                return '48px';
      case CordovaPageConstants.candidateWild:            return '58px';
      case CordovaPageConstants.measureWild:              return '100px';
      case CordovaPageConstants.moreAbout:                return 0;
      case CordovaPageConstants.moreCredits:              return 0;
      // case CordovaPageConstants.moreFaq:                  return '58px';
      // case CordovaPageConstants.moreTerms:                return '58px';
      case CordovaPageConstants.officeWild:               return '78px';
      // case CordovaPageConstants.ready:
      //   return '30px';
      // case CordovaPageConstants.settingsAccount:
      //   return '40px';
      // case CordovaPageConstants.settingsHamburger:
      //   return '43px';
      // case CordovaPageConstants.settingsNotifications:
      //   return '39px';
      // case CordovaPageConstants.settingsWild:
      //   return '55px';
      // case CordovaPageConstants.values:                   return '58px';
      case CordovaPageConstants.voterGuideCreatorWild:    return '130px';
      default:                                            return '58px';
    }
  }

  // WebApp desktop mode
  cordovaOffsetLog(`cordovaScrollablePaneTopPadding: WebApp desktop, page: ${page}`);
  switch (page) {
    case CordovaPageConstants.ballotLgHdrWild:       return showBallotDecisionsTabs() ? '32px' : '0px';
    case CordovaPageConstants.ballotSmHdrWild:       return '30px';
    case CordovaPageConstants.candidateWild:         return '60px';
    case CordovaPageConstants.friends:               return '102px';
    case CordovaPageConstants.friendsCurrent:        return '102px';
    case CordovaPageConstants.friendsSentRequest:    return '102px';
    case CordovaPageConstants.measureWild:           return '102px';
    case CordovaPageConstants.moreAbout:             return 0;
    case CordovaPageConstants.moreCredits:           return 0;
    case CordovaPageConstants.officeWild:            return '102px';
    case CordovaPageConstants.welcomeWild:           return 0;
    case CordovaPageConstants.twitterHandleLanding:  return '102px';
    case CordovaPageConstants.voterGuideCreatorWild: return '130px';
    default:                                         return '60px';
  }
}
