import AppObservableStore from '../common/stores/AppObservableStore';
import { hasIPhoneNotch, isAndroidSizeMD, isAndroidSizeWide, isAndroidSizeXL, isIOS, isIOSAppOnMac, isIPad } from '../common/utils/cordovaUtils';
import decorativeSpacing from '../common/utils/decorativeSpacing';
import { normalizedHrefPage } from '../common/utils/hrefUtils';
import { isAndroid, isCordova, isWebApp } from '../common/utils/isCordovaOrWebApp';
import { cordovaOffsetLog } from '../common/utils/logging';
import heightOfIOSSpacer from '../components/Style/heightOfIOSSpacer';
import CordovaPageConstants from '../constants/CordovaPageConstants';
import { getPageKey } from './cordovaPageUtils';
import { pageEnumeration } from './cordovaUtilsPageEnumeration';

/* global $ */

// Static data
let ballotHeaderOffset = -1;
let pageData = {};
let topOffsets = {};
let offsetsSignedInState;
const defaultPageData = {
  previousPage: '',
  preAdjustDatumMin: 50,
};

const DEBUG_LOGGING = false;
function debugLogging (string) {
  if (DEBUG_LOGGING) {
    console.log(string);
  }
}

// Simple Header
function setBallotHeaderOffset (bho) {
  ballotHeaderOffset = bho;
}

function clearAllOnSignInStateChange (isSignedIn) {
  // Wipe out all state info if isSignedIn state changes
  if (offsetsSignedInState !== isSignedIn || $.isEmptyObject(pageData)) {
    debugLogging('clearAllOnSignInStateChange clearing all data --------');
    offsetsSignedInState = isSignedIn;
    ballotHeaderOffset = 0;
    topOffsets = {};
    pageData = Object.assign(defaultPageData);
  }
}

export function setBallotDualHeaderContentContainerTopOffset (isSignedIn) {
  if (isWebApp()) return;
  clearAllOnSignInStateChange(isSignedIn);
  // const dhc = $('div[class*=\'DualHeaderContainer\']');  // none
  if (isIPad()) {
    debugLogging('setBallotDualHeaderContentContainerTopOffset no Top Offset set, for iPad');
    return;
  }
  if (ballotHeaderOffset > 0) {  // global to this file, ballotHeaderOffset
    // Removed October 25, 2025 (for Cordova only)
    // debugLogging('setBallotDualHeaderContentContainerTopOffset Top Offset set, Cordova, top = ', ballotHeaderOffset);
    // dhc.css('top', ballotHeaderOffset);
    return;
  }
  const page = getPageKey();
  if (pageData.previousPage !== page || ballotHeaderOffset <= 0) {
    pageData.previousPage = page;
    for (let i = 0; i < 4; i++) {
      let topOffset = 0;
      setTimeout(() => {
        debugLogging(`setBallotDualHeaderContentContainerTopOffset loop, i = ${i}`);
        const preAdjustDatumMin = 50;
        const headerContentContainerMin = 60;
        const initDatumOffset = $('#cordovaHeaderBottomDatum').offset() || { left: 0, top: 0 };
        if (initDatumOffset !== undefined && initDatumOffset.top > 0) {
          const preAdjustDatum = initDatumOffset.top;
          if (preAdjustDatum >= preAdjustDatumMin) {
            debugLogging(`acceptable preAdjustDatum from dom ${preAdjustDatum}`);
            const headerContentContainerHeight = $('div[class*=\'HeaderContentContainer\']').height();
            let iOsSpacerHeight = 0;
            const iosSpacerElem = $('div[class*=\'IOSNotchedSpacer\']');
            const hasDynamicIsle = $('div[class*=\'IOSDynamicIslandSpacer\']').length > 0;
            debugLogging(`calculation --------- hasDynamicIsle ${hasDynamicIsle}`);
            if (hasDynamicIsle) {  // ipads and old iPhones and Androids
              const headroomWrapper = $('div[class*=\'HeadroomWrapper\']');
              topOffset = isIOS() ? 0 : headroomWrapper.height();
            } else if (iosSpacerElem.length) {
              iOsSpacerHeight = iosSpacerElem.height;
              const headerBarWrapperHeight = $('div[class*=\'HeaderBarWrapper\']').height();
              topOffset = iOsSpacerHeight + headerBarWrapperHeight + headerContentContainerHeight - preAdjustDatum - 2;
            }

            debugLogging(`setBallotDualHeaderContentContainerTopOffset headerContentContainerHeight ${headerContentContainerHeight}`);
            if (headerContentContainerHeight !== undefined && headerContentContainerHeight > headerContentContainerMin) {
              debugLogging(`calculation ios ${iOsSpacerHeight}, hcc ${headerContentContainerHeight}, preAdjustDatum ${preAdjustDatum}, calc ${topOffset}`);
              if (topOffset > 0) {
                debugLogging(`DualHeaderContainer top set to: ${topOffset}`);
                setBallotHeaderOffset(topOffset);
                // Removed October 25, 2025 (for Cordova only)
                // dhc.css('top', topOffset);
              }
            } else {
              debugLogging(`headerContentContainer ${headerContentContainerHeight}`);
            }
          } else {
            debugLogging(`preAdjustDatum >= preAdjustDatumMin ${preAdjustDatum} ${preAdjustDatumMin}`);
          }
        }
      }, 100);  // Wait for Ballot header to render, if initial URL is /ballot
    }
  }
}

export function offsetToBottomOfHeadroomWrapper (type) {
  const headroomWrapper = $('div[class*=\'HeadroomWrapper\']');
  const page = pageEnumeration();
  if (headroomWrapper.length > 0) {
    const outerHeight = headroomWrapper.outerHeight();
    const position = headroomWrapper.position().top;
    const offset = outerHeight + position;
    console.log(`offsetToBottomOfHeadroomWrapper page: ${page}, type: ${type}, position: ${position}, outerHeight: ${outerHeight}, offset: ${offset}`);
    return offset;
  }
  console.log(`ERROR in offsetToBottomOfHeadroomWrapper page: ${page}, type: ${type} -- No HeadroomWrapper found`);
  return '0';
}

export function cordovaComplexHeaderPageContainerTopOffset () {
  if (isWebApp()) return '';
  offsetToBottomOfHeadroomWrapper('complex');   // test only for now
  const friendsMenu = $('#friendsHorizontalMenu');
  const iOSNotchedSpacer = $('div[class*=\'IOSNotchedSpacer\']');
  const headroomWrapper = $('div[class*=\'HeadroomWrapper\']');
  const dualHeaderContainer = $('div[class*=\'DualHeaderContainer\']');
  const dhcHeight = dualHeaderContainer.height() || 0;   // No dualHeaderCont for Friends when signed in
  let hrHeight = 0;
  let calculated = 0;
  let decoration = 0;
  let total = 0;
  let spacer = 0;

  if (isIOS()) {
    // Calculated approach Nov 2022 and Oct 2025
    if (dualHeaderContainer.length) {
      calculated = dualHeaderContainer.outerHeight();
      // const spacer = heightOfIOSSpacer();
      decoration = decorativeSpacing();
      if (isIPad()) {
        calculated = 0;
        decoration = 80;
      }
      total = calculated + decoration;  // + spacer;
      cordovaOffsetLog(`cordovaTopHeaderTopMargin dualHeaderContainer outerHeight: ${calculated}, decoration: ${decoration}, iOSSpacer: n/a, total: ${total}px,  page: ${getPageKey()}`);
      return `${total}px`;
    } else if (friendsMenu.length) {
      calculated = friendsMenu.outerHeight();
      // calculated = friends;
      spacer = heightOfIOSSpacer();
      decoration = decorativeSpacing();
      if (isIPad()) {
        calculated = 0;
        decoration = 80;
      }
      total = calculated + decoration + spacer;
      cordovaOffsetLog(`cordovaTopHeaderTopMargin dualHeaderContainer outerHeight: ${calculated}, decoration: ${decoration}, iOSSpacer: n/a, total: ${total}px,  page: ${getPageKey()}`);
      return `${total}px`;
    }
    // end calculated approach

    if (hasIPhoneNotch()) {
      if (getPageKey() === 'friends') {
        hrHeight = headroomWrapper.height();
      } else if (getPageKey() === 'ballot' && isIPad()) {
        hrHeight = 0;
      } else {
        hrHeight = iOSNotchedSpacer.height();
      }
    }
  }

  if (isAndroid()) {
    hrHeight = headroomWrapper.height();
    if (isAndroidSizeMD() || isAndroidSizeXL() || isAndroidSizeWide()) {
      try {
        const ballotWrapperBody = $('#BallotWrapperBody');
        if (ballotWrapperBody.length) {
          const padDigits = ballotWrapperBody.css('padding-top').replace('px', '');
          hrHeight -= parseInt(padDigits) + 50;  // 50 to get more payload content between the menus on mobile devices
        }
      } catch (e) {
        console.error('It looks like the layout of the ballot has changed');
      }
    }
  }

  const topOffsetValue = hrHeight + dhcHeight;

  if ($.isNumeric(topOffsetValue)) {
    pageData.previousPage = getPageKey();
    debugLogging(`cordovaComplexHeaderPageContainer topOffset success ${topOffsetValue}`);
    return `${topOffsetValue}px`;
  }
  debugLogging(`cordovaComplexHeaderPageContainer topOffset not a number ${topOffsetValue}`);
  return '0';
}


function setCordovaSimplePageContainerTopOffsetValue (topOffsetValue) {
  const page = getPageKey();
  topOffsets[page] = topOffsetValue;
}

function getCordovaSimplePageContainerTopOffsetValue (isSignedIn = false) {
  clearAllOnSignInStateChange(isSignedIn);
  const page = getPageKey();
  debugLogging(`getCordovaSimplePageContainerTopOffsetValue: ${window.location.href}`);
  debugLogging(`getCordovaSimplePageContainerTopOffsetValue: ${page}, isSignedIn: ${isSignedIn}, topOffsets[page] ${topOffsets[normalizedHrefPage()]}`);
  return topOffsets[normalizedHrefPage()] || 0;
}

export function headroomWrapperOffset (includePosition, pageNameOverride = null) {
  let offset = 0;
  if (isCordova()) {
    const { $ } = window;
    const headroomWrapper = $('div[class*=\'HeadroomWrapper\']');
    let outerHeight = headroomWrapper.outerHeight();
    console.log(`cordovaComplexHeaderTopOffsetValue postion: ${JSON.stringify(headroomWrapper.position())}`);
    const page = pageNameOverride || pageEnumeration();
    let position = 0;
    if (page === 'measureWild' || includePosition) {
      if (headroomWrapper.length > 0) {
        position = headroomWrapper.position().top;
      }
    }
    offset = outerHeight + position;
    if (outerHeight === 0) {
      const cordovaTopHeaderTopMargin = $('div[class*=\'cordovaTopHeaderTopMargin\']');
      const topMargin = cordovaTopHeaderTopMargin.css('marginTop');
      if (topMargin) {
        const valueString = topMargin.replace('px', '');
        position = parseInt(valueString);
        outerHeight = cordovaTopHeaderTopMargin.outerHeight();
        offset = outerHeight + position;
        cordovaOffsetLog(`headroomWrapperOffset cordovaTopHeaderTopMargin outerHeight+top: ${outerHeight + position}, new offset: ${offset}, page: ${getPageKey()}`);
      }
    }
    if (page === 'PoliticianDetailsPage' && isCordova()) {
      offset = -50;
    } else if (page === 'candidatelist' || page === 'politicianpage' || page === 'values' || page === 'challenges') {
      if (isIOS()) {
        if (page === 'values') {
          offset /= 3 / 2;
        } else if (page === 'challenges') {
          offset += 10;
        } else if (page === 'candidatelist') {
          // not needed
        } else {
          offset /= isIPad() ? 2 : 3;
        }
      } else if (isAndroidSizeXL()) {
        offset = 1;
      } else {
        offset /= 2;
      }
    } else if (page === 'ballotSmHdrWild' && isCordova()) {
      offset -= isIPad() || isAndroidSizeXL() ? 0 : 30;
    }

    cordovaOffsetLog(`headroomWrapperOffset HeadroomWrapper outerHeight+top: ${outerHeight + position}, new offset: ${offset}, page: ${getPageKey()}`);
  }
  return offset;
}

export function cordovaSimplePageContainerTopOffset (/* isSignedIn */) {
  if (isWebApp()) return;
  offsetToBottomOfHeadroomWrapper('simple');   // test only for now
  pageData.previousPage = normalizedHrefPage();
  setTimeout(() => {
    const page = pageEnumeration();
    const pageContentContainer = $('div[class*=\'PageContentContainer\']');
    const spacerHeight = heightOfIOSSpacer();
    let height = headroomWrapperOffset(false);  // 11/21/22 now includes the notch height (Value if not backTo)
    const friendsMenu           = $('friendsHorizontalMenu');
    let                 appBar = $('#headerBackToBallotAppBar');
    if (!appBar.length) appBar = $('#headerBackToAppBar');
    if (!appBar.length) appBar = $('#headerBackToVoterGuidesAppBar');
    if (appBar.length) {
      // October 24, 2025, just default to headroomWrapperOffset
      pageContentContainer.css('padding-top', `${height}px`);
      return;
    } else if (friendsMenu.length) {
      height = spacerHeight + friendsMenu.height();
      cordovaOffsetLog('cordovaSimplePageContainerTopOffset friendsHorizontalMenu height', height, page);
      pageContentContainer.css('padding-top', `${height}px`);
      return;
    } else if (AppObservableStore.getShowTwitterLandingPage() ||
      [CordovaPageConstants.news, CordovaPageConstants.ready].includes(page)) {
      height = headroomWrapperOffset(true);
      cordovaOffsetLog('cordovaSimplePageContainerTopOffset twitterLanding, news or ready pcc.css height', height, page);
      pageContentContainer.css('padding-top', `${height}px`);
      return;
    } else if ([CordovaPageConstants.moreFaq].includes(page)) {
      height = headroomWrapperOffset(false);
      cordovaOffsetLog('cordovaSimplePageContainerTopOffset moreFaq pcc.css height', height, page);
      pageContentContainer.css('padding-top', `${height}px`);
      return;
    } else if (isIPad()) {
      height = headroomWrapperOffset(false);
      const pageKey = getPageKey();
      if (pageKey === 'challenges') {
        height += 20;
      }
      cordovaOffsetLog('cordovaSimplePageContainerTopOffset iPad height', height, page);
      pageContentContainer.css('padding-top', `${height}px`);
      return;
    }

    height = headroomWrapperOffset(false);
    if (isAndroid() && AppObservableStore.getShowTwitterLandingPage()) {
      cordovaOffsetLog('cordovaSimplePageContainerTopOffset twitterLandingPage pcc.css height', height, page);
      pageContentContainer.css('padding-top', `${height}px`);
      return;
    }

    if (height !== undefined && height > 0 && getCordovaSimplePageContainerTopOffsetValue() === 0) {
      const superSimplePage = (AppObservableStore.getShowTwitterLandingPage() ||
        (['measure', 'more/faq'].includes(page) && !isIPad() && !isIOSAppOnMac() && !isAndroid()));
      let decorativeUiWhitespaceSimple = superSimplePage && !isAndroid() ? -30 : 20;
      if (isAndroidSizeWide()) decorativeUiWhitespaceSimple = 0;
      const topOffsetValue = height + decorativeUiWhitespaceSimple;  // 11/21/22 now notch height is included in headroom wrapper // + notchHeight;
      setCordovaSimplePageContainerTopOffsetValue(topOffsetValue);

      debugLogging(`cordovaSimplePageContainerTopOffset setting padding-top in pcc: ${topOffsetValue}`);

      pageContentContainer.css('padding-top', `${topOffsetValue}px`);
    } else {
      debugLogging('cordovaSimplePageContainerTopOffset getCordovaSimplePageContainerTopOffsetValue > 0 or height === 0');
      if (height) {
        debugLogging('cordovaSimplePageContainerTopOffset DEFAULT FALLTHROUGH pcc.css height', height, page);
        pageContentContainer.css('padding-top', `${height}px`);
      }
    }
  }, 100);
}
