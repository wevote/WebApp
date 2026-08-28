import { AppBar } from '@mui/material';
import styled from 'styled-components';
import standardBoxShadow from '../../common/components/Style/standardBoxShadow';
import AppObservableStore from '../../common/stores/AppObservableStore';
import { heightOfCordovaSpacer, isAndroidSizeMD, isAndroidSizeWide, isAndroidSizeXL, isIOS, isIOSAppOnMac, isIPad } from '../../common/utils/cordovaUtils';
import { normalizedHrefPage } from '../../common/utils/hrefUtils';
import { isAndroid, isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import isMobileScreenSize, { isTablet } from '../../common/utils/isMobileScreenSize';
import { cordovaOffsetLog } from '../../common/utils/logging';
import CordovaPageConstants from '../../constants/CordovaPageConstants';
import { cordovaFullyCalculatedHeaderContainerTopOffset, offsetToBottomOfHeadroomWrapper } from '../../utils/cordovaCalculatedOffsets';
import { cordovaBallotFilterTopMargin } from '../../utils/cordovaOffsets';
import { pageEnumeration } from '../../utils/cordovaUtilsPageEnumeration';
import scrollablePaneTopPaddingWebApp from '../../utils/scrollablePaneTopPaddingWebApp';

/* global $ */

export const CordovaTopOfScreenSpacer = styled('div')`
  height: ${() => heightOfCordovaSpacer(true)};
  top: 0;
  position: fixed;
  background: white;
  width: 100%;
  opacity: 1;
  z-index: 3;
`;

function getPaddingTop () {
  // console.log('getPaddingTop AppObservableStore.getShowOfficeBannerAboveHeader()', AppObservableStore.getShowOfficeBannerAboveHeader());
  // Applies to both WebApp and Cordova
  if ((normalizedHrefPage() === 'office') && AppObservableStore.getShowOfficeBannerAboveHeader() === true) {
    // Start the page content below the OfficeBannerAboveHeader and the top menu
    // Example page: http://localhost:3000/office/wv87off87798?office_intro=1
    return '400px !important'; // TODO deal with mobile spacing - would be ideal to match mobile & desktop
  } else if ((normalizedHrefPage() === 'politicianpage') && AppObservableStore.getShowNotificationBannerAboveHeader() === true) {
    // Start the page content below the NotificationBannerAboveHeader and the top menu
    // Example page: http://localhost:3000/ted-lieu-politician-from-california/-/?show_edit_politician_notice=1
    return '102px !important';
  }
  const normalizedHref = normalizedHrefPage();
  if (isCordova()) {
    if (normalizedHref === 'ballot') {
      return '';
    } else {
      const offs = offsetToBottomOfHeadroomWrapper('getPaddingTop', 'HeadroomWrapper');
      cordovaOffsetLog(`PageContentContainer paddingTop Cordova: '${offs}px !important' for page: ${normalizedHref}`);
      return `${offs}px !important`;
    }
  }
  // console.log('getPaddingTop scrollablePaneTopPaddingWebApp:', scrollablePaneTopPaddingWebApp());
  return scrollablePaneTopPaddingWebApp();  // 7/19/25 This is called elsewhere for cordova.  5/14/22 TODO: Refactor this...  Funny that this is no longer used for Cordova, only for the WebApp
}

function getPaddingBottom () {
  if (isCordova()) {
    const pages = ['ready', 'settings', 'more/attributions', 'more/privacy', 'more/terms', 'more/faq'];
    const page = normalizedHrefPage() || 'ready';  // readyLight has path '/'
    if (pages.includes(page)) {
      return '120px';
    }
  }
  return '';
}

// this is for DualHeaderContainer or PageContentContainer
function getOuterContainerMargins () {
  if (isWebApp()) return '0 !important';
  const page = normalizedHrefPage();
  let outerContainerHeight = 0;
  let marginBottom = 35;
  if (page === 'ballot') {
    // Ballot is an unusual page, where part of the header is defined within the ballot_root, not the Headroom wrapper
    // this requires unusual processing.
    const dualHeaderContainer = $('div[class*=\'DualHeaderContainer\']');
    if (dualHeaderContainer.length > 0) {        // If it has rendered yet for the ballot page
      outerContainerHeight = dualHeaderContainer.outerHeight() + dualHeaderContainer.position().top;
    }
  } else if (isAndroid() && window.androidNotchCutout) {
    outerContainerHeight = window.androidNotchInset;
  }

  if (page === 'challenges') {
    marginBottom = 60;
  }
  const marginStr = `${outerContainerHeight}px 10px ${marginBottom}px 10px`;
  cordovaOffsetLog(`PageContentContainer ${page} page offset for DualHeaderContainer : ${marginStr}`);
  return marginStr;    // all other Cordova pages
}

export const PageContentContainer = styled('div')(({ theme }) => (`
  margin: 0 auto;
  max-width: 960px;
  min-height: 190px;
  padding-top: ${getPaddingTop()};
  padding-bottom: ${getPaddingBottom()};
  position: relative;
  z-index: 1;
  ${theme.breakpoints.down('sm')} {
    min-height: ${isWebApp() ? '10px' : `${window.innerHeight}px`};
    margin: ${getOuterContainerMargins()};
  }
`));

export const HeaderContentContainer = styled('div')(({ theme }) => (`
  margin: ${() => cordovaBallotFilterTopMargin()} auto 0 auto;
  position: relative;
  max-width: 960px;
  width: 100%;
  z-index: 0;
  ${theme.breakpoints.down('sm')} {
    min-height: 10px;
    //margin: 0 10px;
  }
`));


export const HeaderContentOuterContainer = styled('div')`
  display: flex;
  justify-content: center;
  width: 100%;
  padding-left: calc(-100% + 100vw);
`;

export function getTopOffsetDueToHeadroomWrapper () {
  const offs = cordovaFullyCalculatedHeaderContainerTopOffset('DualHeaderContainer-top');
  const offsAdjusted = offs - 65;   // Oct 2025, Yuck, remove some decorative spacing
  // console.log('DualHeaderContainer styled div topOffset: ', offs);
  return offs > 0 ? `top: ${offsAdjusted}px` : '';
}


export const DualHeaderContainer = styled('div', {
  shouldForwardProp: (prop) => !['scrolledDown', 'topOffset'].includes(prop),
})(({ scrolledDown, topOffset }) => (`
  position: fixed;
  ${topOffset};
  width: 100%;
  background-color: #fff;
  ${scrolledDown ? 'border-bottom: 1px solid #aaa' : ''};
  ${scrolledDown ? `box_shadow: ${standardBoxShadow('wide')}` : ''};
  overflow: hidden;
  z-index: 1;
  left: 0;
`));

/* eslint-disable arrow-body-style */
// Sits on top of the iOS screen, below the IOSSpacer -- contains the header
export const HeadroomWrapper = styled('div')`
  position: fixed;
  top: ${() => {
    return heightOfCordovaSpacer(true);
  }};
  left: 0;
  width: 100%;
  background: white;
  z-index: 2;
`;

export const TopOfPageHeader = styled('div')(({ theme }) => (`
  width: 100%;
  max-width: 960px;
  justify-content: space-between;  // .header-backto-toolbar
  display: grid;
  grid-template-columns: auto auto auto;
  height: fit-content;
  margin: auto;
  ${theme.breakpoints.down('md')} {
    padding-left: 15px;
    padding-right: 15px;
  }
  paddingTop: ${heightOfCordovaSpacer(true)};
`));

export const TopRowOneLeftContainer = styled('div')`
   grid-row-start: 1;
   grid-row-end: 1;
   grid-column: 1 / 2;
`;

export const TopRowOneMiddleContainer = styled('div')`
  grid-row-start: 1;
  grid-row-end: 1;
  grid-column: 2 / 3;
`;

export const TopRowOneRightContainer = styled('div')`
  padding-right: ${() => {
    if (isAndroidSizeMD() || isAndroidSizeXL() || isAndroidSizeWide() || isTablet()) return '15px';
    return '0px';
  }};
  display: flex;
  justify-content: flex-end;
  cursor: pointer;
`;

export const TopRowTwoLeftContainer = styled('div')`
  grid-row-start: 2;
  grid-row-end: 3;
  grid-column: ${() => (['measure', 'friends', 'office'].includes(normalizedHrefPage()) ? '1 / 4' : '1 / 3')};
  padding-bottom: ${() => {
    if (normalizedHrefPage() === 'measure') {
      return isAndroid() ? '0px' : '28px';
    }
    return '7px';
  }};
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TopRowTwoRightContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  padding-right: ${() => ((isMobileScreenSize()) ? '15px' : '0px')};  //grid-row-start: 2;
  ${() => {
    if ((isWebApp() && !isMobileScreenSize())) {
      return {
        gridRow: '2 / 2',
        gridColumn: '3 /3',
        paddingRight: '13px',
      };
    } else if (isAndroidSizeXL() || isAndroidSizeWide()) {
      return {
        gridRow: '2 / 2',
        gridColumn: '3 /3',
      };
    }
    return {};
  }};
`;

function getBackToPaddingTop () {
  // Calculated approach
  // Try as I might, I could not remove the css 'top' attribute from MUI AppBar, so ...
  const { $ } = window;
  if (!$) {
    // To trap "$ is not a function" crash from before jQuery loads
    return '0px';
  }
  const headerBack = $('#headerBackToBallotAppBar');
  if (isIOS() && headerBack.length) {
    const height = heightOfCordovaSpacer();
    const heightAppBar = headerBack.outerHeight();
    const total = height + heightAppBar;
    const ret = total > 0 ? `${total}px` : '';
    cordovaOffsetLog(`getBackToPaddingTop #headerBackToBallotAppBar iOSSpacer.outerHeight(): ${height}, ret: '${ret}', page: ${pageEnumeration()}`);
    return height > 0 ? `${height}px` : '';
  }
  return '';
}

export const AppBarForBackTo = styled(AppBar)(({ theme }) => (`
  border-top: none;
  border-right: none;
  border-left: none;
  border-image: initial;
  display: flex;
  justify-content: center;
  ${() => {
    if (AppObservableStore.getScrolledDown() && ![
      CordovaPageConstants.officeWild,
      CordovaPageConstants.measureWild,
      CordovaPageConstants.valuesList,
      CordovaPageConstants.valuesWild].includes(pageEnumeration())) {
      // Do not show border or shadow
      return {};
    }
    return {
      borderBottom: '1px solid rgb(170, 170, 170)',
      boxShadow: standardBoxShadow('wide'),
    };
  }};
  ${theme.breakpoints.down('sm')} {
    display: inherit;
  };
  padding-top: ${getBackToPaddingTop()}
`));

export const OfficeShareWrapper = styled('div')`
  margin-bottom: 12px;
  margin-right: ${(isIPad() || isIOSAppOnMac()) ? '19px' : ''};
`;

export const FirstRowPhoneOrEmail = styled('div')`
  margin: 5px 0 2px 0;
  text-align: center;
`;

export const SecondRowPhoneOrEmail = styled('div')`
  margin-bottom: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SecondRowPhoneOrEmailDiv = styled('div')`
  width: 250px;
  display: flex;
  justify-content: space-between;
`;

export const AllPhoneOrEmailTypes = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const TermsAndPrivacyText = styled('span')`
  color: #999;
  font-size: .9em;
  font-weight: 400;
  .u-cursor--pointer:hover {
    color: #0156b3;
    text-decoration: underline;
  }
  * {
    span:hover {
      color: #0156b3;
      text-decoration: underline;
    }
`;

export const DeviceInformationSpan = styled('span')`
  color: #007bff;
  font-size: 16px;
  font-weight: 400;
`;
