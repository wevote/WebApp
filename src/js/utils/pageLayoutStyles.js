import { AppBar } from '@material-ui/core';
import styled from 'styled-components';
import CordovaPageConstants from '../constants/CordovaPageConstants';
import AppObservableStore from '../stores/AppObservableStore';
import { normalizedHrefPage } from './applicationUtils';
import { cordovaBallotFilterTopMargin, cordovaDualHeaderContainerPadding } from './cordovaOffsets';
import cordovaScrollablePaneTopPadding from './cordovaScrollablePaneTopPadding';
import { isIPad, isIPhone4p7in, isIPhone5p5inEarly, isIPhone5p5inMini, isIPhone6p1in, isIPhone6p5in, isWebApp } from './cordovaUtils';
import { pageEnumeration } from './cordovaUtilsPageEnumeration';
import isMobileScreenSize from './isMobileScreenSize';


export const IOSNotchedSpacer = styled.div`
  height: ${() => ((isIPhone5p5inMini()) ? '40px' : '36px')};
  top: 0;
  position: fixed;
  background: #2e3c5d;
  width: 100%;
  opacity: 1;
  z-index: 1300;
`;

export const IOSNoNotchSpacer = styled.div`
  height: ${() => {
    if (isIPad())                                   return '26px';
    if (isIPhone4p7in() || isIPhone5p5inEarly())    return '22px';
    return                                                 '36px';
  }};
  top: 0;
  position: fixed;
  background: #2e3c5d;
  width: 100%;
  opacity: 1;
  z-index: 3;
`;

export const PageContentContainer = styled.div`
  padding-top: ${() => cordovaScrollablePaneTopPadding()};
  padding-bottom ${() => {
    if (isWebApp()) return null;
    return isIPhone6p1in() || isIPhone4p7in() || isIPhone5p5inEarly() ? '800px' : '625px';
  }};
  position: relative;
  max-width: 960px;
  z-index: 0;
  min-height: 190px;
  margin: 0 auto;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-height: 10px;
    margin: 0 10px;
  }
  // for debugging... ${({ theme }) => ((theme) ? console.log(theme) : console.log(theme))}
`;


export const HeaderContentContainer = styled.div`
  margin: ${() => cordovaBallotFilterTopMargin()} auto 0 auto;
  position: relative;
  max-width: 960px;
  z-index: 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-height: 10px;
    //margin: 0 10px;
  }
`;


export const DualHeaderContainer = styled.div`   // was ballot__heading
  padding-top: ${() => cordovaDualHeaderContainerPadding()};
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #aaa;
  overflow: hidden;
  position: fixed;
  z-index: 1;
  left: 0;
  //transform: translate3d(0, -53px, 0);
  //transition: all 100ms ease-in-out 0s;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12); }
  //.ballot__heading__unpinned {
  //  position: fixed;
  //  top: 0;
  //  left: 0;
  //  right: 0;
  //  z-index: 9000 !important;
  //  transform: translate3d(0, -58px, 0);
  //  transition: all 100ms ease-in-out 0s; }
`;

// let classNameHeadroom = '';  // Value for isCordova is ''
// if (isWebApp()) {
//   if (stringContains('/ballot', pathname.toLowerCase())) {
//     classNameHeadroom = 'headroom-wrapper-webapp__ballot';
//   } else if (stringContains('/office', pathname.toLowerCase())) {
//     if (isMobileScreenSize()) {
//       classNameHeadroom = 'headroom-wrapper-webapp__default';
//     } else {
//       classNameHeadroom = 'headroom-wrapper-webapp__office';
//     }
//   } else if (displayFriendsTabs()) {
//     classNameHeadroom = 'headroom-wrapper-webapp__ballot';
//   } else {
//     classNameHeadroom = 'headroom-wrapper-webapp__default';
//   }
// }
// let classNameHeadroom = '';
// if (isWebApp()) {
//   classNameHeadroom = showBackToVoterGuides ? 'headroom-wrapper-webapp__voter-guide' : 'headroom-wrapper-webapp__default';
// }
// was <div className={isWebApp() ? classNameHeadroom : ''} id="headroom-wrapper">
export const HeadroomWrapper = styled.div`
  // margin-top: ${() => ((isWebApp()) ? '48px' : '')};  // headroom-wrapper-webapp   // headroom-wrapper-webapp__default was 54px
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  z-index: 2;
  transform: translateY(0);
`;

export const TopOfPageHeader = styled.div`
  width: 100%;
  max-width: 960px;
  justify-content: space-between;  // .header-backto-toolbar
  display: grid;
  grid-template-columns: auto auto auto;
  height: fit-content;
  margin: auto;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-left: 15px;
    padding-right: 15px;
  }
`;

export const TopRowOneLeftContainer = styled.div`
  grid-row-start: 1;
  grid-row-end: 1;
  grid-column: 1 / 2;
`;

export const TopRowOneMiddleContainer = styled.div`
  grid-row-start: 1;
  grid-row-end: 1;
  grid-column: 2 / 3;
  //display: ${() => ((isMobileScreenSize()) ? 'none' : null)};
`;

export const TopRowOneRightContainer = styled.div`
  padding-right: ${() => ((isMobileScreenSize() && !isIPhone5p5inMini()) ? '15px' : '')};
  display: flex;
  justify-content: space-between;
  cursor: pointer;

  // z-index: 3; //to float above the account/ProfilePopUp menu option grey div
  // @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
  //   padding-left: ${(props) => (props.cordova ? '0 !important' : 'calc(100% - 147px)')};
  // }
`;

export const TopRowTwoLeftContainer = styled.div`
  grid-row-start: 2;
  grid-row-end: 3;
  grid-column: ${() => (['measure', 'friends', 'office'].includes(normalizedHrefPage()) ? '1 / 4' : '1 / 3')};
  padding-bottom: ${() => {
    if (normalizedHrefPage() === 'measure') {
      return '28px';
    }
    return '7px';
  }};
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TopRowTwoRightContainer = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  padding-right: ${() => ((isMobileScreenSize()) ? '15px' : '')};  //grid-row-start: 2;
  ${() => {
    if (isWebApp() && !isMobileScreenSize()) {
      return {
        gridRow: '2 / 2',
        gridColumn: '3 /3',
      };
    }
    return {};
  }};
`;

export const AppBarForBackTo = styled(AppBar)`
  border-top: none;
  border-right: none;
  border-left: none;
  border-image: initial;
  display: flex;
  justify-content: center;
  padding-top: ${() => {
    // IMPORTANT: This is a last chance way to adjust the height, to be used only if cordovaScrollablePaneTopPadding can't do it!
    if ([CordovaPageConstants.candidateWild,
      CordovaPageConstants.officeWild,
      CordovaPageConstants.settingsProfile,
      CordovaPageConstants.settingsAccount,
      CordovaPageConstants.settingsNotifications,
      CordovaPageConstants.settingsSubscription,
      CordovaPageConstants.settingsWild,
      CordovaPageConstants.measureWild,
      CordovaPageConstants.valuesList].includes(pageEnumeration())) {
      if (isIPhone4p7in())      return '20px';
      if (isIPhone5p5inEarly()) return '20px';
      if (isIPhone5p5inMini())  return '39px';
      if (isIPhone6p1in())      return '32px';
      if (isIPhone6p5in())      return '34px';
    }
    return '0px';
  }};
  ${() => {
    if (AppObservableStore.getScrolledDown() && ![
      CordovaPageConstants.officeWild,
      CordovaPageConstants.measureWild,
      CordovaPageConstants.valuesList].includes(pageEnumeration())) {
      return {};
    }
    return {
      borderBottom: '1px solid rgb(170, 170, 170)',
      boxShadow: 'rgb(0 0 0 / 20%) 0 2px 4px -1px, rgb(0 0 0 / 14%) 0px 4px 5px 0px, rgb(0 0 0 / 12%) 0px 1px 10px 0px',
    };
  }};
@media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
  display: inherit;
}
`;

export const OfficeShareWrapper = styled.div`
  margin-bottom: 12px;
  margin-right: ${({ ipad }) => (ipad ? '19px' : '')};
`;


// export function pageLayoutStyles () {
//   const styles = {                // from main.css .page-header
//     border: 'none',
//     paddingTop: 0,
//     paddingRight: '15px',
//     paddingBottom: 0,
//     paddingLeft: '15px',
//     margin: '0 auto',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     height: '48px',
//   };
//
//   const page = normalizedHrefPage();
//
//   if (['candidate', 'friends', 'office', 'measure'].includes(page)) {
//     styles.borderBottom = '1px solid #aaa';
//     styles.boxShadow = '0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12)';
//   }
//
//   if (['candidate', 'office', 'measure'].includes(page)) {
//     if (isWebApp()) {
//       if (isMobileScreenSize()) {
//         styles.height  = ['measure'].includes(page) ? '96px' : 'fit-content';
//       } else {
//         styles.padding = 0;
//         styles.height  = ['office', 'measure'].includes(page) ? '96px' : '41px';
//         if (['candidate'].includes(page)) {
//           // styles.width = '960px';
//           styles.flexDirection = 'column';
//         }
//         if (['measure'].includes(page)) {
//           styles.height  = '67px';
//         }
//       }
//       // styles.height = isMobileScreenSize() ? 'fit-content' : '96px';
//       // styles.display = 'contents';
//     }
//     if (isCordova()) {            // from main.css .page-header__cordova
//       switch (page) {
//         case 'candidate': styles.height = '41px'; break;
//         case 'measure':   styles.height = '94px'; break;
//         default:          styles.height = '71px'; break;
//       }
//       styles.margin = '0 15px 0 15px';
//       styles.paddingBottom = '4px';
//     }
//     if (hasIPhoneNotch()) {       // from .page-header__cordova-iphonex
//       styles.margin = 0;
//       styles.paddingTop = '0 !important';
//     }
//     if (isIOSAppOnMac() || isIPad() || isAndroid()) {
//       styles.height = ['office'].includes(page) ? '87px' : '50px';
//     }
//   }
//
//   // console.log('headerStyles: ', styles);
//   return styles;
// }


// export function headerToolbarStyles () {
//   const styles = {                // from main.css .header-toolbar
//     width: '100%',
//     maxWidth: '960px',
//     justifyContent: 'space-between',  // .header-backto-toolbar
//     display: 'grid',   // hack
//     gridTemplateColumns: 'auto auto auto',
//   };
//
//   // if (isWebApp() && !isMobileScreenSize()) {
//   //   styles.width = '-webkit-fill-available';
//   //   // console.log('header styles ------------- ', normalizedHrefPage());
//   //   styles.transform = normalizedHrefPage() === 'measure' ? 'translate(43%, -21%)' : null;
//   // }
//
//   return styles;
// }
