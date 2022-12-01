import CordovaPageConstants from '../constants/CordovaPageConstants';
import { hasIPhoneNotch, isAndroidSimulator, isIOS, isIOSAppOnMac, isIPad, isIPhone4p7in, isIPhone5p5inEarly, isIPhone5p5inMini, isSimulator } from '../common/utils/cordovaUtils';
import { isCordova } from '../common/utils/isCordovaOrWebApp';
import { cordovaOffsetLog } from '../common/utils/logging';
import { getPageKey } from './cordovaPageUtils';
import { pageEnumeration } from './cordovaUtilsPageEnumeration';

export function decorativeSpacing () {
  // Please don't change these unless you are testing your change in a Cordova simulator
  const page = pageEnumeration();
  switch (page) {
    case CordovaPageConstants.ballotLgHdrWild:       return 8;
    case CordovaPageConstants.ballotSmHdrWild:       return 8;
    case CordovaPageConstants.ballotVote:            return 0;
    case CordovaPageConstants.candidate:             return 0;
    case CordovaPageConstants.candidateWild:         return 0;
    case CordovaPageConstants.friends:               return 0;
    case CordovaPageConstants.friendsCurrent:        return 0;
    case CordovaPageConstants.friendsSentRequest:    return 0;
    case CordovaPageConstants.measureWild:           return 0;
    case CordovaPageConstants.moreAbout:             return 0;
    case CordovaPageConstants.moreElections:         return 0;
    case CordovaPageConstants.moreFaq:               return 0;
    case CordovaPageConstants.moreTerms:             return 0;
    case CordovaPageConstants.news:                  return 0;
    case CordovaPageConstants.officeWild:            return 0;
    case CordovaPageConstants.opinions:              return 0;
    case CordovaPageConstants.opinionsFiltered:      return 0;
    case CordovaPageConstants.ready:                 return 8;
    case CordovaPageConstants.settingsAccount:       return 0;
    case CordovaPageConstants.settingsHamburger:     return 0;
    case CordovaPageConstants.settingsNotifications: return 0;
    case CordovaPageConstants.settingsProfile:       return 0;
    case CordovaPageConstants.settingsSubscription:  return 0;
    case CordovaPageConstants.settingsWild:          return 0;
    case CordovaPageConstants.twitterHandleLanding:  return 0;
    case CordovaPageConstants.twitterIdMFollowers:   return 0; // /*/m/friends, /*/m/following, /*/m/followers
    case CordovaPageConstants.twitterInfoPage:       return 0; // A twitter page guess, that ends with 'btcand' 'btmeas' or'btdb'
    case CordovaPageConstants.valuesWild:            return 0;
    case CordovaPageConstants.values:                return 0;
    case CordovaPageConstants.valuesList:            return 0;
    case CordovaPageConstants.voterGuideCreatorWild: return 0; // $headroom-wrapper-webapp__voter-guide-creator
    case CordovaPageConstants.voterGuideWild:        return 0; // Any voter page with btcand or btmeas
    default:                                         return 0;
  }
}



// <div className={pageHeaderStyle} style={cordovaTopHeaderTopMargin()} id="header-container">
export default function cordovaTopHeaderTopMargin () {
  const style = {
    marginTop: '1px',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: '0',
    backgroundColor: 'white',
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

    const { $ } = window;
    if (isIOS()) {
      const headerBackToAppBar = $('#headerBackToAppBar');
      // Calculated approach Nov 2022
      if (headerBackToAppBar.length) {
        const marginTop = headerBackToAppBar.outerHeight();
        const paddingTop = headerBackToAppBar.css('padding').split(' ')[0];
        style.marginTop = `${marginTop + paddingTop}px`;
        cordovaOffsetLog(`cordovaTopHeaderTopMargin new way, headerBackToAppBar marginTop: ${marginTop}, page: ${getPageKey()}`);
        return style;
      }
      // end calculated approach

      if (isIPhone5p5inEarly() || isIPhone4p7in()) {
        cordovaOffsetLog('---------------- isIPhone5p5inEarly');
        switch (page) {
          case CordovaPageConstants.ballotLgHdrWild:       style.marginTop = '19px'; break;
          case CordovaPageConstants.ballotSmHdrWild:       style.marginTop = '19px'; break;
          case CordovaPageConstants.ballotVote:            style.marginTop = '19px'; break;
          case CordovaPageConstants.friends:               style.marginTop = '20px'; break;
          case CordovaPageConstants.friendsCurrent:        style.marginTop = '20px'; break;
          case CordovaPageConstants.friendsSentRequest:    style.marginTop = '20px'; break;
          case CordovaPageConstants.measureWild:           style.marginTop = '22px'; break;
          case CordovaPageConstants.officeWild:            style.marginTop = '16px'; break;
          case CordovaPageConstants.settingsWild:          style.marginTop = '22px'; break;
          case CordovaPageConstants.twitterIdMFollowers:   style.marginTop = '37px'; break; // /*/m/friends, /*/m/following, /*/m/followers
          case CordovaPageConstants.valuesWild:            style.marginTop = '22px'; break;
          case CordovaPageConstants.values:                style.marginTop = '19px'; break;
          case CordovaPageConstants.voterGuideCreatorWild: style.marginTop = '38px'; break; // $headroom-wrapper-webapp__voter-guide-creator
          default:                                         style.marginTop = '19px'; break;
        }
      } else if (isIPhone5p5inMini()) {
        cordovaOffsetLog('---------------- isIPhone5p5inMini');
        switch (page) {
          case CordovaPageConstants.ballotLgHdrWild:       style.marginTop = '16px'; break;
          case CordovaPageConstants.ballotSmHdrWild:       style.marginTop = '39px'; break;
          case CordovaPageConstants.ballotVote:            style.marginTop = '16px'; break;
          case CordovaPageConstants.candidate:             style.marginTop = '35px'; break;
          case CordovaPageConstants.candidateWild:         style.marginTop = '0px'; break;
          case CordovaPageConstants.friends:               style.marginTop = '39px'; break;
          case CordovaPageConstants.friendsCurrent:        style.marginTop = '39px'; break;
          case CordovaPageConstants.friendsSentRequest:    style.marginTop = '39px'; break;
          case CordovaPageConstants.measureWild:           style.marginTop = '39px'; break;
          case CordovaPageConstants.moreAbout:             style.marginTop = '22px'; break;
          case CordovaPageConstants.moreElections:         style.marginTop = '39px'; break;
          case CordovaPageConstants.moreFaq:               style.marginTop = '39px'; break;
          case CordovaPageConstants.moreTerms:             style.marginTop = '39px'; break;
          case CordovaPageConstants.news:                  style.marginTop = '39px'; break;
          case CordovaPageConstants.officeWild:            style.marginTop = '0px'; break;
          case CordovaPageConstants.opinions:              style.marginTop = '38px'; break;
          case CordovaPageConstants.opinionsFiltered:      style.marginTop = '39px'; break;
          case CordovaPageConstants.ready:                 style.marginTop = '39px'; break;
          case CordovaPageConstants.settingsAccount:       style.marginTop = '31px'; break;
          case CordovaPageConstants.settingsHamburger:     style.marginTop = '39px'; break;
          case CordovaPageConstants.settingsNotifications: style.marginTop = '29px'; break;
          case CordovaPageConstants.settingsProfile:       style.marginTop = '32px'; break;
          case CordovaPageConstants.settingsSubscription:  style.marginTop = '34px'; break;
          case CordovaPageConstants.settingsWild:          style.marginTop = '31px'; break;
          case CordovaPageConstants.twitterHandleLanding:  style.marginTop = '39px'; break;
          case CordovaPageConstants.twitterIdMFollowers:   style.marginTop = '37px'; break; // /*/m/friends, /*/m/following, /*/m/followers
          case CordovaPageConstants.twitterInfoPage:       style.marginTop = '32px'; break; // A twitter page guess, that ends with 'btcand' 'btmeas' or'btdb'
          case CordovaPageConstants.valuesWild:            style.marginTop = '32px'; break;
          case CordovaPageConstants.values:                style.marginTop = '39px'; break;
          case CordovaPageConstants.valuesList:            style.marginTop = '15px'; break;
          case CordovaPageConstants.voterGuideCreatorWild: style.marginTop = '38px'; break; // $headroom-wrapper-webapp__voter-guide-creator
          case CordovaPageConstants.voterGuideWild:        style.marginTop = '38px'; break; // Any voter page with btcand or btmeas
          default:                                         style.marginTop = '16px'; break;
        }
      } else if (hasIPhoneNotch()) {
        switch (page) {
          case CordovaPageConstants.ballotLgHdrWild:       style.marginTop = '16px'; break;
          case CordovaPageConstants.ballotSmHdrWild:       style.marginTop = '34px'; break;
          case CordovaPageConstants.ballotVote:            style.marginTop = '16px'; break;
          case CordovaPageConstants.candidate:             style.marginTop = '35px'; break;
          case CordovaPageConstants.candidateWild:         style.marginTop = '40px'; break;
          case CordovaPageConstants.friends:               style.marginTop = '34px'; break;
          case CordovaPageConstants.friendsCurrent:        style.marginTop = '34px'; break;
          case CordovaPageConstants.friendsSentRequest:    style.marginTop = '34px'; break;
          case CordovaPageConstants.start:                 style.marginTop = '34px'; break;
          case CordovaPageConstants.measureWild:           style.marginTop = '40px'; break;
          case CordovaPageConstants.moreElections:         style.marginTop = '34px'; break;
          case CordovaPageConstants.moreFaq:               style.marginTop = '35px'; break;
          case CordovaPageConstants.moreTerms:             style.marginTop = '34px'; break;
          case CordovaPageConstants.news:                  style.marginTop = '34px'; break;
          case CordovaPageConstants.officeWild:            style.marginTop = '36px'; break;
          case CordovaPageConstants.opinions:              style.marginTop = '34px'; break;
          case CordovaPageConstants.opinionsFiltered:      style.marginTop = '34px'; break;
          case CordovaPageConstants.ready:                 style.marginTop = '34px'; break;
          case CordovaPageConstants.settingsAccount:       style.marginTop = '31px'; break;
          case CordovaPageConstants.settingsHamburger:     style.marginTop = '34px'; break;
          case CordovaPageConstants.settingsNotifications: style.marginTop = '29px'; break;
          case CordovaPageConstants.settingsProfile:       style.marginTop = '32px'; break;
          case CordovaPageConstants.settingsSubscription:  style.marginTop = '34px'; break;
          case CordovaPageConstants.settingsWild:          style.marginTop = '31px'; break;
          case CordovaPageConstants.twitterHandleLanding:  style.marginTop = '34px'; break;
          case CordovaPageConstants.twitterIdMFollowers:   style.marginTop = '37px'; break; // /*/m/friends, /*/m/following, /*/m/followers
          case CordovaPageConstants.twitterInfoPage:       style.marginTop = '32px'; break; // A twitter page guess, that ends with 'btcand' 'btmeas' or'btdb'
          case CordovaPageConstants.valuesWild:            style.marginTop = '32px'; break;
          case CordovaPageConstants.values:                style.marginTop = '34px'; break;
          case CordovaPageConstants.valuesList:            style.marginTop = '15px'; break;
          case CordovaPageConstants.voterGuideCreatorWild: style.marginTop = '38px'; break; // $headroom-wrapper-webapp__voter-guide-creator
          case CordovaPageConstants.voterGuideWild:        style.marginTop = '38px'; break; // Any voter page with btcand or btmeas
          default:                                         style.marginTop = '16px'; break;
        }
      } else if (isIOSAppOnMac()) {
        style.marginTop = '0px';
      } else if (isIPad()) {
        switch (page) {
          default:                                         style.marginTop = '24px'; break;  // ballotSmHdrWild, settingsHamburger
        }
      } else {
        style.marginTop = '20px';
      }
    } else {  // Android
      style.marginTop = '0px';
    }
    return style;
  }

  return undefined;
}
