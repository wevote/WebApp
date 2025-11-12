import { cordovaOffsetLog } from '../common/utils/logging';
import CordovaPageConstants from '../constants/CordovaPageConstants';
import showBallotDecisionsTabs from '../utilsApi/showBallotDecisionsTabs';
import { pageEnumeration } from './cordovaUtilsPageEnumeration';


// This was originally for Cordova, and was designed out in November 2025
// it probably is still needed for WebApp
export default function scrollablePaneTopPaddingWebApp (pageEnumerationOverride = false) {
  const page = pageEnumerationOverride || pageEnumeration();


  // WebApp desktop mode
  cordovaOffsetLog(`scrollablePaneTopPaddingWebApp: WebApp desktop, page: ${page}`);
  switch (page) {
    // First number is with "Choices / Decided" showing
    case CordovaPageConstants.ballotLgHdrWild:       return showBallotDecisionsTabs() ? '180px' : '64px'; // 32/0: Added ~80px
    // Without showBallotDecisionsTabs
    case CordovaPageConstants.ballotSmHdrWild:       return '96px';
    case CordovaPageConstants.candidateWild:         return '44px';
    case CordovaPageConstants.friends:               return '102px';
    case CordovaPageConstants.friendsCurrent:        return '102px';
    case CordovaPageConstants.friendsSentRequest:    return '102px';
    case CordovaPageConstants.measureWild:           return '102px';
    case CordovaPageConstants.moreAbout:             return 0;
    case CordovaPageConstants.moreCredits:           return 0;
    case CordovaPageConstants.officeWild:            return '102px';
    case CordovaPageConstants.ready:                 return '99px';
    case CordovaPageConstants.welcomeWild:           return 0;
    case CordovaPageConstants.twitterHandleLanding:  return '102px';
    case CordovaPageConstants.voterGuideCreatorWild: return '130px';
    default:                                         return '60px';
  }
}
