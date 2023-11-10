import { hasIPhoneNotch, isAndroid, isAndroidSizeMD, isAndroidSizeWide, isAndroidSizeXL, isIOS, isIOSAppOnMac, isIPad } from '../common/utils/cordovaUtils';
import { normalizedHrefPage } from '../common/utils/hrefUtils';
import { isCordova, isWebApp } from '../common/utils/isCordovaOrWebApp';
import { cordovaOffsetLog } from '../common/utils/logging';
import CordovaPageConstants from '../constants/CordovaPageConstants';
import AppObservableStore from '../common/stores/AppObservableStore';
import { getPageKey } from './cordovaPageUtils';
import { decorativeSpacing } from './cordovaTopHeaderTopMargin';
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
  const dhc = $('div[class*=\'DualHeaderContainer\']');  // none
  if (isIPad()) {
    debugLogging('setBallotDualHeaderContentContainerTopOffset no Top Offset set, for iPad');
    return;
  }
  if (ballotHeaderOffset > 0) {  // global to this file, ballotHeaderOffset
    debugLogging('setBallotDualHeaderContentContainerTopOffset Top Offset set, Cordova, top = ', ballotHeaderOffset);
    dhc.css('top', ballotHeaderOffset);
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
            const hasNoNotch = $('div[class*=\'IOSNoNotchSpacer\']').length > 0;
            debugLogging(`calculation --------- hasNoNotch ${hasNoNotch}`);
            if (hasNoNotch) {  // ipads and old iPhones and Androids
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
                dhc.css('top', topOffset);
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

export function cordovaComplexHeaderPageContainerTopOffset () {
  if (isWebApp()) return '';
  const iOSNotchedSpacer = $('div[class*=\'IOSNotchedSpacer\']');
  const headroomWrapper = $('div[class*=\'HeadroomWrapper\']');
  const dualHeaderContainer = $('div[class*=\'DualHeaderContainer\']');
  const dhcHeight = dualHeaderContainer.height() || 0;   // No dualHeaderCont for Friends when signed in
  let hrHeight = 0;

  if (isIOS()) {
    // Calculated approach Nov 2022
    if (dualHeaderContainer.length) {
      let calculated = dualHeaderContainer.outerHeight();
      let decoration = decorativeSpacing();
      if (isIPad()) {
        calculated = 0;
        decoration = 80;
      }
      cordovaOffsetLog(`cordovaTopHeaderTopMargin .dualHeaderContainer outerHeight: ${calculated}, decoration: ${decoration}, page: ${getPageKey()}`);
      return `${calculated + decoration}px`;
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
        const rowBallotBody = $('div[class*=\'row ballot__body\']');
        if (rowBallotBody.length) {
          const padDigits = rowBallotBody.css('padding-top').replace('px', '');
          hrHeight -= parseInt(padDigits);
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

export function headroomWrapperOffset (includePosition) {
  let offset = 0;
  if (isCordova()) {
    const { $ } = window;
    const headroomWrapper = $('div[class*=\'HeadroomWrapper\']');
    const outerHeight = headroomWrapper.outerHeight();
    const position = includePosition ? headroomWrapper.position().top : 0;
    offset = outerHeight + position;
    const page = pageEnumeration();
    if (page === 'candidatelist' || page === 'values') {
      if (isIOS()) {
        if (page === 'values') {
          offset /= 3 / 2;
        } else {
          offset /= isIPad() ? 2 : 3;
        }
      } else if (isAndroidSizeXL()) {
        offset = 1;
      } else {
        offset /= 2;
      }
    }

    cordovaOffsetLog(`headroomWrapperOffset HeadroomWrapper outerHeight+top: ${outerHeight + position}, new offset: ${offset}, page: ${getPageKey()}`);
  }
  return offset;
}

export function cordovaSimplePageContainerTopOffset (/* isSignedIn */) {
  if (isWebApp()) return;
  pageData.previousPage = normalizedHrefPage();
  setTimeout(() => {
    const page = pageEnumeration();
    const pageContentContainer = $('div[class*=\'PageContentContainer\']');
    let height = headroomWrapperOffset(false);  // 11/21/22 now includes the notch height (Value if not backTo)
    let                 appBar = $('#headerBackToBallotAppBar');
    if (!appBar.length) appBar = $('#headerBackToAppBar');
    if (!appBar.length) appBar = $('#headerBackToVoterGuidesAppBar');
    if (appBar.length) {
      height = appBar.outerHeight();
      cordovaOffsetLog(`cordovaSimplePageContainerTopOffset appBar.outerHeight(): ${height}, page: ${getPageKey()}`);
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
