import CordovaPageConstants from '../constants/CordovaPageConstants';
import { hasIPhoneNotch, isAndroidSimulator, isCordova, isIOS, isIOSAppOnMac, isIPad, isIPhone4p7in, isIPhone5p5inEarly, isIPhone5p5inMini, isSimulator } from './cordovaUtils';
import { pageEnumeration } from './cordovaUtilsPageEnumeration';
import { cordovaOffsetLog } from './logging';

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

    if (isIOS()) {
      if (isIPhone5p5inEarly() || isIPhone4p7in()) {
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
          default:                                   style.marginTop = '19px'; break;
        }
      } else if (isIPhone5p5inMini()) {
        switch (page) {
          case CordovaPageConstants.ballotLgHdrWild:       style.marginTop = '16px'; break;
          case CordovaPageConstants.ballotSmHdrWild:       style.marginTop = '39px'; break;
          case CordovaPageConstants.ballotVote:            style.marginTop = '16px'; break;
          case CordovaPageConstants.candidate:             style.marginTop = '35px'; break;
          case CordovaPageConstants.candidateWild:         style.marginTop = '0px'; break;
          case CordovaPageConstants.friends:               style.marginTop = '34px'; break;
          case CordovaPageConstants.friendsCurrent:        style.marginTop = '34px'; break;
          case CordovaPageConstants.friendsSentRequest:    style.marginTop = '34px'; break;
          case CordovaPageConstants.measureWild:           style.marginTop = '40px'; break;
          case CordovaPageConstants.moreFaq:               style.marginTop = '35px'; break;
          case CordovaPageConstants.news:                  style.marginTop = '39px'; break;
          case CordovaPageConstants.officeWild:            style.marginTop = '0px'; break;
          case CordovaPageConstants.opinions:              style.marginTop = '17px'; break;
          case CordovaPageConstants.opinionsFiltered:      style.marginTop = '39px'; break;
          case CordovaPageConstants.ready:                 style.marginTop = '39px'; break;
          case CordovaPageConstants.settingsAccount:       style.marginTop = '31px'; break;
          case CordovaPageConstants.settingsHamburger:     style.marginTop = '35px'; break;
          case CordovaPageConstants.settingsNotifications: style.marginTop = '29px'; break;         // from 36 to 29  for the 12 max pro
          case CordovaPageConstants.settingsProfile:       style.marginTop = '32px'; break;         // from 36 to 29  for the 12 max pro
          case CordovaPageConstants.settingsSubscription:  style.marginTop = '34px'; break;
          case CordovaPageConstants.settingsWild:          style.marginTop = '31px'; break;
          case CordovaPageConstants.twitterHandleLanding:  style.marginTop = '39px'; break;
          case CordovaPageConstants.twitterIdMFollowers:   style.marginTop = '37px'; break; // /*/m/friends, /*/m/following, /*/m/followers
          case CordovaPageConstants.twitterInfoPage:       style.marginTop = '32px'; break; // A twitter page guess, that ends with 'btcand' 'btmeas' or'btdb'
          case CordovaPageConstants.valueWild:             style.marginTop = '32px'; break;
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
          case CordovaPageConstants.measureWild:           style.marginTop = '40px'; break;
          case CordovaPageConstants.moreFaq:               style.marginTop = '35px'; break;
          case CordovaPageConstants.moreTerms:             style.marginTop = '34px'; break;
          case CordovaPageConstants.news:                  style.marginTop = '34px'; break;
          case CordovaPageConstants.officeWild:            style.marginTop = '36px'; break;
          case CordovaPageConstants.opinions:              style.marginTop = '17px'; break;
          case CordovaPageConstants.opinionsFiltered:      style.marginTop = '34px'; break;
          case CordovaPageConstants.ready:                 style.marginTop = '34px'; break;
          case CordovaPageConstants.settingsAccount:       style.marginTop = '31px'; break;
          case CordovaPageConstants.settingsHamburger:     style.marginTop = '34px'; break;
          case CordovaPageConstants.settingsNotifications: style.marginTop = '29px'; break;         // from 36 to 29  for the 12 max pro
          case CordovaPageConstants.settingsProfile:       style.marginTop = '32px'; break;         // from 36 to 29  for the 12 max pro
          case CordovaPageConstants.settingsSubscription:  style.marginTop = '34px'; break;
          case CordovaPageConstants.settingsWild:          style.marginTop = '31px'; break;
          case CordovaPageConstants.twitterHandleLanding:  style.marginTop = '34px'; break;
          case CordovaPageConstants.twitterIdMFollowers:   style.marginTop = '37px'; break; // /*/m/friends, /*/m/following, /*/m/followers
          case CordovaPageConstants.twitterInfoPage:       style.marginTop = '32px'; break; // A twitter page guess, that ends with 'btcand' 'btmeas' or'btdb'
          case CordovaPageConstants.valueWild:             style.marginTop = '32px'; break;
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
