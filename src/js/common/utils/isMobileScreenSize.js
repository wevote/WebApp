import { isWebApp } from './isCordovaOrWebApp';

function isCordova () {
  const { cordova } = window;
  return cordova !== undefined;
}

export default function isMobileScreenSize () {
  const { muiThemeGlobal: { breakpoints: { values: { tabMin } } } } = window;
  const width = isCordova() ? window.screen.availWidth : window.innerWidth;
  // console.log('window.screen.availWidth or window.innerWidth:', width);
  return width < tabMin;
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

export function isLargeSizedTablet () {
  const { innerWidth, muiThemeGlobal: { breakpoints: { values: { tabLgMin, tabMax } } } } = window;
  return  innerWidth > tabLgMin && innerWidth < tabMax;
}

export function getTabletSize () {
  if (isSmallTablet()) {
    return 'small tablet';
  }
  if (isMidSizedTablet()) {
    return 'medium tablet';
  }
  if (isLargeSizedTablet()) {
    return 'large tablet';
  }
  return 'not a tablet';
}

/*
In Cordova, the comparison is to 740px for small tablets, from muiTheme.js
---> On screens that are 991px or less, do NOT display this component
@media all and (max-width: 991px) {
  .u-show-desktop {
    display: none !important;
  }
}
was .u-show-desktop then this function was uShowDesktop
 */
export function displayNoneIfSmallerThanDesktop () {
  const { innerWidth, muiThemeGlobal: { breakpoints: { values: { tabMax } } } } = window;
  if ((isWebApp() && innerWidth > 991) || (!isWebApp() && innerWidth > tabMax)) {
    return 'display: none !important;';
  }
  return '';
}
