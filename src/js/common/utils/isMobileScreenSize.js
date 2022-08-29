import { isAndroid } from './cordovaUtils';

function isCordova () {
  const { cordova } = window;
  return cordova !== undefined;
}

export default function isMobileScreenSize () {
  if (isCordova()) {
    // availWidth is the full width of the screen
    // console.log('window.screen.availWidth:', window.screen.availWidth);
    if (isAndroid()) {
      // Aug 2022: The Galaxy S22+ is 540 wide, and it is only a --md device. trouble ahead
      return (window.screen.availWidth < 600);
    }
    return (window.screen.availWidth < 500);
  } else {
    // innerWidth is the width of the display area in the browser
    // console.log('window.innerWidth:', window.innerWidth);
    return (window.innerWidth < 576);
  }
}

// iPad Mini is 744px wide, iPad 9.7" is 768, iPad 11" is 834, iPad 12.9" is 1024
export function isTablet () {
  const { innerWidth, muiThemeGlobal: { breakpoints: { values: { tabMin, tabMax } } } } = window;
  return innerWidth > tabMin && innerWidth < tabMax;
}

export function isSmallTablet () {
  const { innerWidth, muiThemeGlobal: { breakpoints: { values: { tabMin, tabMdMin } } } } = window;
  // const pb1 = window.muiThemeGlobal.breakpoints.values.tabMin;
  return innerWidth > tabMin && innerWidth < tabMdMin;
}

export function isMedOrLgTablet () {
  const { innerWidth, muiThemeGlobal: { breakpoints: { values: { tabMdMin, tabMax } } } } = window;
  return innerWidth > tabMdMin && innerWidth < tabMax;
}

export function isSmallerThanTablet () {
  const { innerWidth, muiThemeGlobal: { breakpoints: { values: { tabMin } } } } = window;
  return innerWidth < tabMin;
}

export function isMidSizedTablet () {
  const { innerWidth, muiThemeGlobal: { breakpoints: { values: { tabMdMin, tabLgMin } } } } = window;
  return  innerWidth > tabMdMin && innerWidth < tabLgMin;
}
