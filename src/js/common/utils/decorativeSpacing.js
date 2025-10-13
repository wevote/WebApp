import CordovaPageConstants from '../../constants/CordovaPageConstants';
import { pageEnumeration } from '../../utils/cordovaUtilsPageEnumeration';

export default function decorativeSpacing () {
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


