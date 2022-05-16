import { normalizedHrefPage } from '../common/utils/hrefUtils';
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
  const page = normalizedHrefPage();
  if (pageData.previousPage !== page || ballotHeaderOffset <= 0) {
    pageData.previousPage = page;
    for (let i = 0; i < 4; i++) {
      let topOffset = 0;
      setTimeout(() => {
        debugLogging('setCordovaCalculatedBallotTopOffset loop, i = ', i);
        const preAdjustDatumMin = 50;
        const headerContentContainerMin = 60;
        const initDatumOffset = $('#cordovaHeaderBottomDatum').offset() || { left: 0, top: 0 };
        if (initDatumOffset !== undefined && initDatumOffset.top > 0) {
          const preAdjustDatum = initDatumOffset.top;
          if (preAdjustDatum >= preAdjustDatumMin) {
            debugLogging('acceptable preAdjustDatum from dom ', preAdjustDatum);
            const iosSpacer = $('div[class*=\'IOSNotchedSpacer\']').height();  // 36
            const headerBarWrapper = $('div[class*=\'HeaderBarWrapper\']').height();   // 82
            const headerContentContainer = $('div[class*=\'HeaderContentContainer\']').height();  // 119
            debugLogging('headerContentContainer', headerContentContainer);
            if (headerContentContainer !== undefined && headerContentContainer > headerContentContainerMin) {
              topOffset = iosSpacer + headerBarWrapper + headerContentContainer - preAdjustDatum - 2;
              debugLogging(`calculation ios ${iosSpacer}, headerBarWrapper ${headerBarWrapper}, hcc ${headerContentContainer}, preAdjustDatum ${preAdjustDatum}, calc ${topOffset}`);
              if (topOffset > 0) {
                debugLogging('DualHeaderContainer top set to: ', topOffset);
                setBallotHeaderOffset(topOffset);
                dhc.css('top', topOffset);
              }
            } else {
              debugLogging('headerContentContainer', headerContentContainer);
            }
          } else {
            debugLogging('preAdjustDatum >= preAdjustDatumMin', preAdjustDatum, preAdjustDatumMin);
          }
        }
      }, 100);  // Wait for Ballot header to render, if initial URL is /ballot
    }
  }
}

export function cordovaComplexHeaderPageContainerTopOffset () {
  if (isWebApp()) return '';
  const headroomWrapper = $('div[class*=\'HeadroomWrapper\']');
  const hrHeight = headroomWrapper.height();
  const dhc = $('div[class*=\'DualHeaderContainer\']');  // none
  const dhcHeight = dhc.height() || 0;   // No dhc for Friends when signed in

  // const decorativeUiWhitespaceComplex = 10;
  const topOffsetValue = hrHeight + dhcHeight;// + decorativeUiWhitespaceComplex;
  if ($.isNumeric(topOffsetValue)) {
    pageData.previousPage = normalizedHrefPage();
    debugLogging('cordovaComplexHeaderPageContainer topOffset success', topOffsetValue);
    return `${topOffsetValue}px`;
  }
  debugLogging('cordovaComplexHeaderPageContainer topOffset not a number', topOffsetValue);
  return '0';
}


function setCordovaSimplePageContainerTopOffsetValue (topOffsetValue) {
  const page = normalizedHrefPage() || 'ready';
  topOffsets[page] = topOffsetValue;
}

function getCordovaSimplePageContainerTopOffsetValue (isSignedIn = false) {
  clearAllOnSignInStateChange(isSignedIn);
  const page = normalizedHrefPage();
  debugLogging('getCordovaSimplePageContainerTopOffsetValue:', window.location.href);
  debugLogging('getCordovaSimplePageContainerTopOffsetValue topOffsets:', topOffsets);
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
      debugLogging('cordovaSimplePageContainerTopOffset HeadRoomWrapper height', height, normalizedHrefPage());

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
