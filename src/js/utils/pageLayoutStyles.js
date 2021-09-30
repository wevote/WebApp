import styled from 'styled-components';
import { normalizedHrefPage } from './applicationUtils';
import cordovaScrollablePaneTopPadding from './cordovaScrollablePaneTopPadding';
import { isCordova } from './cordovaUtils';
import isMobileScreenSize from './isMobileScreenSize';

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

export function headerToolbarStyles () {
  const styles = {                // from main.css .header-toolbar
    width: '100%',
    maxWidth: '960px',
    justifyContent: 'space-between',  // .header-backto-toolbar
    display: 'grid',   // hack
    gridTemplateColumns: 'auto auto auto',
  };

  // if (isWebApp() && !isMobileScreenSize()) {
  //   styles.width = '-webkit-fill-available';
  //   // console.log('header styles ------------- ', normalizedHrefPage());
  //   styles.transform = normalizedHrefPage() === 'measure' ? 'translate(43%, -21%)' : null;
  // }

  return styles;
}

export const OfficeShareWrapper = styled.div`
  margin-bottom: 12px;
  margin-right: ${({ ipad }) => (ipad ? '19px' : '')};
`;

export const PageContentContainer = styled.div`
  position: relative;
  max-width: 960px;
  z-index: 0;
  min-height: 190px;
  margin: 0 auto;
  padding-top: ${() => cordovaScrollablePaneTopPadding()};
  padding-bottom ${() => ((isCordova()) ? '625px' : null)};
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-height: 10px;
    margin: 0 10px;
  }
  // for debugging... ${({ theme }) => ((theme) ? console.log(theme) : console.log(theme))}
 `;


export const HeaderContentContainer = styled.div`
  position: relative;
  max-width: 960px;
  z-index: 0;
  margin: 0 auto;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-height: 10px;
    margin: 0 10px;
  }
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
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  padding-right: ${() => ((isMobileScreenSize()) ? '15px' : '')};

  // z-index: 3; //to float above the account/ProfilePopUp menu option grey div
  // @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
  //   padding-left: ${(props) => (props.cordova ? '0 !important' : 'calc(100% - 147px)')};
  // }
`;


export const TopRowTwoLeftContainer = styled.div`
  grid-row-start: 2;
  grid-row-end: 3;
  grid-column: ${() => (['measure', 'friends'].includes(normalizedHrefPage()) ? '1 / 4' : '1 / 3')};
  padding-bottom: ${() => (normalizedHrefPage() === 'measure' ? '28px' : '15px')};
`;

export const TopRowTwoRightContainer = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  padding-right: ${() => ((isMobileScreenSize()) ? '15px' : '')};;  //grid-row-start: 2;
  //grid-row-end: 3;
  //grid-column: 2 / 3;
`;
