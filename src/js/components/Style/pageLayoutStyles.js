import { AppBar } from '@mui/material';
import styled from 'styled-components';
import standardBoxShadow from '../../common/components/Style/standardBoxShadow';
import AppObservableStore from '../../common/stores/AppObservableStore';
import { hasDynamicIsland, hasIPhoneNotch, isAndroidSizeMD, isAndroidSizeWide, isAndroidSizeXL, isIOS, isIOSAppOnMac, isIPad, isIPad11in, isIPadMini, isIPhone14Pro, isIPhone4p7in, isIPhone5p5inEarly, isIPhone5p5inMini, isIPhone6p1in, isIPhone6p5in } from '../../common/utils/cordovaUtils';
import { normalizedHrefPage } from '../../common/utils/hrefUtils';
import { isAndroid, isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import isMobileScreenSize, { isTablet } from '../../common/utils/isMobileScreenSize';
import { cordovaOffsetLog } from '../../common/utils/logging';
import CordovaPageConstants from '../../constants/CordovaPageConstants';
import VoterStore from '../../stores/VoterStore';
import { cordovaComplexHeaderPageContainerTopOffset, cordovaSimplePageContainerTopOffset } from '../../utils/cordovaCalculatedOffsets';
import { cordovaBallotFilterTopMargin } from '../../utils/cordovaOffsets';
import cordovaScrollablePaneTopPadding from '../../utils/cordovaScrollablePaneTopPadding';
import { pageEnumeration } from '../../utils/cordovaUtilsPageEnumeration';


export const IOSNotchedSpacer = styled('div')`
  height: ${() => {
    if (isIPhone5p5inMini())      return '40px';
    if (hasDynamicIsland())       return '52px';
    return                        '36px';
  }};
  top: 0;
  position: fixed;
  background: white;
  width: 100%;
  opacity: 1;
  z-index: 1300;
`;

export const IOSNoNotchSpacer = styled('div')`
  height: ${() => {
    if (isIPad())                                   return '26px';
    if (isIPhone4p7in() || isIPhone5p5inEarly())    return '22px';
    return                                                 '36px';
  }};
  top: ${() => ((isIPhone4p7in() ? '-1px' : '0px'))};
  position: fixed;
  //background: white;
  width: 100%;
  opacity: 0;
  z-index: 3;
`;

function getPaddingTop () {
  if (isCordova()) {
    if ((normalizedHrefPage() === 'ballot') ||
        (normalizedHrefPage() === 'friends' && VoterStore.getVoterIsSignedIn())) {
      return `${cordovaComplexHeaderPageContainerTopOffset()} !important`;
    } else {
      // The following line sets the value directly (non-ideal)
      cordovaSimplePageContainerTopOffset();
      return '';
    }
  }
  return cordovaScrollablePaneTopPadding();  // 5/14/22 TODO: Refactor this...  Funny that this is no longer used for Cordova, only for the WebApp
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
    margin: ${isWebApp() ? '0 !important' : '24px 10px'};  // From Dale: Let's discuss this
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
`;

export const DualHeaderContainer = styled('div', {
  shouldForwardProp: (prop) => !['scrolledDown'].includes(prop),
})(({ scrolledDown }) => (`
  // padding-top: cordovaDualHeaderContainerPadding()
  width: 100%;
  background-color: #fff;
  ${scrolledDown ? 'border-bottom: 1px solid #aaa' : ''};
  ${scrolledDown ? `box_shadow: ${standardBoxShadow('wide')}` : ''};
  overflow: hidden;
  position: fixed;
  z-index: 1;
  left: 0;
`));

/* eslint-disable no-nested-ternary */
export const HeadroomWrapper = styled('div')`
  position: fixed;
  top: ${() => (hasDynamicIsland() ? (isIPhone14Pro() ? '22px' : '12px') : '0px')};
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
  ${() => ((isIPad11in() || isIPadMini()) ? {
    paddingLeft: '15px',
    paddingRight: '15px',
  } : {})
  }
`));

export const TopRowOneLeftContainer = styled('div')`
   grid-row-start: 1;
   grid-row-end: 1;
   grid-column: 1 / 2;
  //display: flex;
  //justify-content: flex-start;
`;

export const TopRowOneMiddleContainer = styled('div')`
  grid-row-start: 1;
  grid-row-end: 1;
  grid-column: 2 / 3;
`;

export const TopRowOneRightContainer = styled('div')`
  // padding-right: 0px;
  // {() => (((isMobileScreenSize() && !isIPhone5p5inMini()) || isIPadGiantSize()) ? '15px' : '0px')}; // Can this always be 0px?
  padding-right: ${() => {
    // if (isAndroidSizeWide()) return '55px';
    if (isAndroidSizeMD() || isAndroidSizeXL() || isAndroidSizeWide() || isTablet()) return '15px';
    return '0px';
  }};
  display: flex;
  justify-content: flex-end;
  cursor: pointer;

  // z-index: 3; //to float above the account/ProfilePopUp menu option grey div
  // {theme.breakpoints.down('sm')} {
  //   padding-left: {(props) => (props.cordova ? '0 !important' : 'calc(100% - 147px)')};
  // }
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
    const iOSNotchedSpacer = $('div[class*=\'IOSNotchedSpacer\']');
    const iOSNoNotchSpacer = $('div[class*=\'IOSNoNotchSpacer\']');
    const height = iOSNotchedSpacer.length ? iOSNotchedSpacer.outerHeight() : iOSNoNotchSpacer.outerHeight();
    cordovaOffsetLog(`getBackToPaddingTop #headerBackToBallotAppBar iOS[No]NotchedSpacer.outerHeight(): ${height}, page: ${pageEnumeration()}`);
    return `${height}px`;
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
