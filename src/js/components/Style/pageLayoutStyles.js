import { AppBar } from '@mui/material';
import styled from 'styled-components';
import standardBoxShadow from '../../common/components/Style/standardBoxShadow';
import AppObservableStore from '../../common/stores/AppObservableStore';
import { hasDynamicIsland, hasIPhoneNotch, isAndroidSizeMD, isAndroidSizeWide, isAndroidSizeXL, isIOS, isIOSAppOnMac, isIOsSmallerThanPlus, isIPad, isIPhone4p7in, isIPhone5p5inEarly, isIPhone5p5inMini, isIPhone6p1in, isIPhone6p5in, isIPhoneAir, isIPhoneMiniOrSmaller } from '../../common/utils/cordovaUtils';
import { normalizedHrefPage } from '../../common/utils/hrefUtils';
import { isAndroid, isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import isMobileScreenSize, { isTablet } from '../../common/utils/isMobileScreenSize';
import { cordovaOffsetLog } from '../../common/utils/logging';
import CordovaPageConstants from '../../constants/CordovaPageConstants';
import { cordovaComplexHeaderPageContainerTopOffset, cordovaSimplePageContainerTopOffset } from '../../utils/cordovaCalculatedOffsets';
import { cordovaBallotFilterTopMargin } from '../../utils/cordovaOffsets';
import cordovaScrollablePaneTopPadding from '../../utils/cordovaScrollablePaneTopPadding';
import { pageEnumeration } from '../../utils/cordovaUtilsPageEnumeration';
import heightOfIOSSpacer, { cordovaDualHeaderContainerTopOffset } from './heightOfIOSSpacer';


export const IOSNotchedSpacer = styled('div')`
  height: ${() => {
    if (hasDynamicIsland())       return '52px';
    // if (isIPhone5p5inMini())   return '40px';
    if (isIPhoneMiniOrSmaller())  return '20px';
    return                        '36px';
  }};
  top: 0;
  position: fixed;
  background: white;
  width: 100%;
  opacity: 1;
  z-index: 1300;
`;

export function getIOSDynamicIslandSpacerHeight () {
  if (isIOS()) {
    if (isIPad())                                   return '26px';
    if (isIPhoneAir())                              return '58px';
    if (isIPhoneMiniOrSmaller())                    return '22px';
    if (hasDynamicIsland())                         return '52px';
    if (isIOsSmallerThanPlus())                     return '24px';
    return                                                 '36px';
  }
  return 0;
}

export const IOSDynamicIslandSpacer = styled('div')`
  height: ${() => getIOSDynamicIslandSpacerHeight()};
  top: ${() => ((isIPhone4p7in() ? '-1px' : '0px'))};
  position: fixed;
  background: white;
  width: 100%;
  opacity: 1;
  z-index: 3;
`;

function getPaddingTop () {
  if ((normalizedHrefPage() === 'politicianpage') && AppObservableStore.getShowNotificationBannerAboveHeader() === true) {
    // In this case we want to start the page content below the NotificationBannerAboveHeader and the top menu
    // Applies to both WebApp and Cordova
    // Example page: http://localhost:3000/ted-lieu-politician-from-california/-/?show_edit_politician_notice=1
    return '102px !important';
  }
  if (isCordova()) {
    const normalizedHref = normalizedHrefPage();
    if ((normalizedHref === 'ballot') || (normalizedHref === 'friends')) {
      return `${cordovaComplexHeaderPageContainerTopOffset()} !important`;
    } else {
      // The following line sets the value directly (non-ideal)
      cordovaSimplePageContainerTopOffset();
      return '';
    }
  }
  return cordovaScrollablePaneTopPadding();  // 7/19/25 This is called elsewhere for cordova.  5/14/22 TODO: Refactor this...  Funny that this is no longer used for Cordova, only for the WebApp
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

export const PageContentContainer = styled('div')(({ theme }) => (`
  margin: 0 auto;
  max-width: 960px;
  min-height: 190px;
  padding-top: ${getPaddingTop()};
  padding-bottom: ${getPaddingBottom()};
  position: relative;
  z-index: 0;
  ${theme.breakpoints.down('sm')} {
    min-height: ${isWebApp() ? '10px' : `${window.innerHeight}px`};
    margin: ${isWebApp() ? '0 !important' : '35px 10px'};
  }
`));

export const PageContentContainerGetStarted = styled('div')`
  background-color: white;
  display: flex;
  justify-content: center;
`;

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

export const DualHeaderContainer = styled('div', {
  shouldForwardProp: (prop) => !['scrolledDown'].includes(prop),
})(({ scrolledDown }) => (`
  position: fixed;
  top: ${cordovaDualHeaderContainerTopOffset()};
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
    // console.log('HeadroomWrapper top: ', heightOfIOSSpacer(true));
    return heightOfIOSSpacer(true);
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
  paddingTop: ${heightOfIOSSpacer(true)};
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
  // Calculated approach Nov 2022
  const { $ } = window;
  if (!$) {
    // To trap "$ is not a function" crash
    return '0px';
  }
  const headerBack = $('#headerBackToBallotAppBar');
  if (isIOS() && headerBack.length) {
    const height = heightOfIOSSpacer();
    const ret = height > 0 ? `${height}px` : '';
    cordovaOffsetLog(`getBackToPaddingTop #headerBackToBallotAppBar iOSSpacer.outerHeight(): ${height}, ret: '${ret}', page: ${pageEnumeration()}`);
    return height > 0 ? `${height}px` : '';
  }
  // end calculated approach

  // IMPORTANT: This is a last chance way to adjust the height, to be used only if cordovaScrollablePaneTopPadding can't do it!
  if ([CordovaPageConstants.candidateWild,
    CordovaPageConstants.officeWild,
    CordovaPageConstants.settingsProfile,
    CordovaPageConstants.settingsAccount,
    CordovaPageConstants.settingsNotifications,
    CordovaPageConstants.settingsSubscription,
    CordovaPageConstants.settingsWild,
    CordovaPageConstants.measureWild,
    CordovaPageConstants.valuesList,
    CordovaPageConstants.valuesWild].includes(pageEnumeration())) {
    if (isIPhone4p7in())      return '20px';
    if (isIPhone5p5inEarly()) return '20px';
    if (isIPhone5p5inMini())  return '39px';
    if (isIPhone6p1in())      return '34px';
    if (isIPhone6p5in())      return '34px';
    if (hasIPhoneNotch())     return '34px';
    if (isIPad())             return '24px';
  }
  return '0px';
}

export const AppBarForBackTo = styled(AppBar)(({ theme }) => (`
  border-top: none;
  border-right: none;
  border-left: none;
  border-image: initial;
  display: flex;
  justify-content: center;
  padding-top: ${getBackToPaddingTop()};
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
`));

export const OfficeShareWrapper = styled('div')`
  margin-bottom: 12px;
  margin-right: ${(isIPad() || isIOSAppOnMac()) ? '19px' : ''};
`;

export const FirstRowPhoneOrEmail = styled('div')`
  margin: 5px 0px 2px 0px;
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
  font-size: 18px;
  font-weight: 400;
`;
