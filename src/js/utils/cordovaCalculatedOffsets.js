import AppObservableStore from '../common/stores/AppObservableStore';
import { heightOfCordovaSpacer, isAndroidSizeWide, isAndroidSizeXL, isIOS, isIOSAppOnMac, isIPad, isIPhoneSmall } from '../common/utils/cordovaUtils';
import decorativeSpacing from '../common/utils/decorativeSpacing';
import { normalizedHrefPage } from '../common/utils/hrefUtils';
import { isAndroid, isCordova, isWebApp } from '../common/utils/isCordovaOrWebApp';
import { cordovaOffsetLog } from '../common/utils/logging';
import CordovaPageConstants from '../constants/CordovaPageConstants';
import { getPageKey } from './cordovaPageUtils';
import { pageEnumeration } from './cordovaUtilsPageEnumeration';

/* global $ */

// Static data
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

function clearAllOnSignInStateChange (isSignedIn) {
  // Wipe out all state info if isSignedIn state changes
  if (offsetsSignedInState !== isSignedIn || $.isEmptyObject(pageData)) {
    debugLogging('clearAllOnSignInStateChange clearing all data --------');
    offsetsSignedInState = isSignedIn;
    topOffsets = {};
    pageData = Object.assign(defaultPageData);
  }
}

function calcOffset (wrapper, wrapperContainer, type, pageHref, heightOfHW) {
  // console.log(`offsetToBottomOfHeadroomWrapper SUCCESSFUL FOR wrapType: ${wrapper}`);
  const outerHeight = wrapperContainer.outerHeight();
  const position = wrapperContainer?.position()?.top || 0;
  let offset = outerHeight + (isIPhoneSmall() ? 0 : position);
  if (wrapper === 'DualHeaderContainer') {
    // console.log(`calcOffset adding ${offset} to offset`);
    offset += heightOfHW;
  }
  cordovaOffsetLog(`offsetToBottomOfHeadroomWrapper -> calcOffset  type: ${type}, pageHref: %c${pageHref}%c, wrapType: ${wrapper}, offset: ${offset}, position: ${position}, outerHeight: ${outerHeight}`, 'font-weight: bold;', 'font-weight: 400;');
  return offset;
}

export function outerHeightOfDualHeaderContainer () {
  const dualHeaderContainer = $(`div[class*="${'DualHeaderContainer'}"]`);
  return dualHeaderContainer.length > 0 ? dualHeaderContainer.outerHeight() : 0;
}

// eslint-disable-next-line no-unused-vars
export function offsetToBottomOfHeadroomWrapper (type, override = false) {
  const headroomWrapper = $(`div[class*="${'HeadroomWrapper'}"]`);
  const heightOfHW = headroomWrapper.length > 0 ? headroomWrapper.height() : 0;
  const outerHeightOfHW = headroomWrapper.length > 0 ? headroomWrapper.outerHeight() : 0;
  // const outerHeightOfDHC = outerHeightOfDualHeaderContainer();
  const pageHref = normalizedHrefPage();
  // console.log('offsetToBottomOfHeadroomWrapper heightOfHW', heightOfHW);
  const dualHeaderContainer = $(`div[class*="${'DualHeaderContainer'}"]`);
  if (isAndroid()) {
    return outerHeightOfHW;
  } else if (headroomWrapper.length > 0) {
    if (heightOfHW === 0) {
      // Fallback for value and measure pages which end up with a zero height headroom wrapper (probably because of a fixed top value inside)
      const headerBackToAppBar = $('#headerBackToAppBar');
      const headerBackToBallotAppBar = $('#headerBackToBallotAppBar');
      const bar = (headerBackToAppBar.length > 0) ? headerBackToAppBar : headerBackToBallotAppBar;
      const barName = (headerBackToAppBar.length > 0) ? 'headerBackToAppBar' : 'headerBackToBallotAppBar';
      const heightAppBar = bar.height();
      if (heightAppBar > 0) {
        return calcOffset(barName, bar, type, pageHref, heightAppBar);
      }
    }
    return calcOffset('HeadroomWrapper', headroomWrapper, type, pageHref, heightOfHW);
  } else if (dualHeaderContainer.length > 0) {
    return calcOffset('DualHeaderContainer', dualHeaderContainer, type, pageHref, heightOfHW);
  }

  console.log(`ERROR in offsetToBottomOfHeadroomWrapper type: ${type}, pageHref ${pageHref} -- No known Headroom Container type found`);
  return 0;
}

export function cordovaFullyCalculatedHeaderContainerTopOffset (rootTag) {
  if (isWebApp()) return '';
  const raw = offsetToBottomOfHeadroomWrapper(`${rootTag}+newAndImproved`);
  const decoration = decorativeSpacing();
  return raw + decoration;
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
    const page = pageNameOverride || pageEnumeration();
    let position = 0;
    if (page === 'measureWild' || (page === 'candidateWild') || includePosition) {
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
  pageData.previousPage = normalizedHrefPage();
  setTimeout(() => {
    const page = pageEnumeration();
    const pageContentContainer = $('div[class*=\'PageContentContainer\']');
    const spacerHeight = heightOfCordovaSpacer();
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
      pageContentContainer.css('border-top', `${height}px !important`);
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
