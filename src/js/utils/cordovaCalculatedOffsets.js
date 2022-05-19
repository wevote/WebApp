import { isIPad } from '../common/utils/cordovaUtils';
import { normalizedHref, normalizedHrefPage } from '../common/utils/hrefUtils';
import { isWebApp } from '../common/utils/isCordovaOrWebApp';

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

function getPageKey () {
  const useLongerPath = ['settings', 'more'];
  let page = normalizedHrefPage() || 'ready';
  if (useLongerPath.includes(page)) {
    page = normalizedHref();
  }
  debugLogging(`getPageKey page: ${page}`);
  return page;
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
  if (ballotHeaderOffset > 0) {
    dhc.css('top', ballotHeaderOffset);
  }
  const page = getPageKey();
  if (pageData.previousPage !== page || ballotHeaderOffset <= 0) {
    pageData.previousPage = page;
    for (let i = 0; i < 4; i++) {
      let topOffset = 0;
      setTimeout(() => {
        debugLogging(`setCordovaCalculatedBallotTopOffset loop, i = ${i}`);
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
              topOffset = headroomWrapper.height();
            } else if (iosSpacerElem.length) {
              iOsSpacerHeight = iosSpacerElem.height;
              const headerBarWrapperHeight = $('div[class*=\'HeaderBarWrapper\']').height();
              topOffset = iOsSpacerHeight + headerBarWrapperHeight + headerContentContainerHeight - preAdjustDatum - 2;
            }

            debugLogging(`headerContentContainerHeight ${headerContentContainerHeight}`);
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
  const headroomWrapper = $('div[class*=\'HeadroomWrapper\']');
  const hrHeight = getPageKey() === 'ballot' && isIPad() ? 0 : headroomWrapper.height();
  const dhc = $('div[class*=\'DualHeaderContainer\']');  // none
  const dhcHeight = dhc.height() || 0;   // No dhc for Friends when signed in
  const nonDhcHeight = getPageKey() === 'friends' ? 20 : 0;

  const topOffsetValue = hrHeight + dhcHeight + nonDhcHeight;
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

export function cordovaSimplePageContainerTopOffset (isSignedIn) {
  if (isWebApp()) return;
  pageData.previousPage = normalizedHrefPage();
  const storedTopOffsetValue = getCordovaSimplePageContainerTopOffsetValue(isSignedIn);
  if (storedTopOffsetValue > 50) {  // was 100, does this need to be page sensitive since it is now only for complex pages?
    const pageContentContainer = $('div[class*=\'PageContentContainer\']');
    pageContentContainer.css('padding-top', `${storedTopOffsetValue}px`);
  } else {
    setTimeout(() => {
      const headroomWrapper = $('div[class*=\'HeadroomWrapper\']');
      const height = headroomWrapper.height();
      debugLogging(`cordovaSimplePageContainerTopOffset HeadRoomWrapper height ${height}, ${getPageKey()}`);

      if (height !== undefined && height > 0 && getCordovaSimplePageContainerTopOffsetValue() === 0) {
        const decorativeUiWhitespaceSimple = 20;
        const topOffsetValue = height + decorativeUiWhitespaceSimple;
        setCordovaSimplePageContainerTopOffsetValue(topOffsetValue);

        debugLogging(`cordovaSimplePageContainerTopOffset setting padding-top in PageContentContainer: ${topOffsetValue}`);

        const pageContentContainer = $('div[class*=\'PageContentContainer\']');
        pageContentContainer.css('padding-top', `${topOffsetValue}px`);
      } else {
        debugLogging('cordovaSimplePageContainerTopOffset getCordovaSimplePageContainerTopOffsetValue > 0 or height === 0');
      }
    }, 100);
  }
}
