import { isWebApp } from './isCordovaOrWebApp';

function isCordova () {
  const { cordova } = window;
  return cordova !== undefined;
}

export default function isMobileScreenSize () {
  const { muiThemeGlobal: { breakpoints: { values: { tabMin } } } } = window;
  const width = isCordova() ? window.screen.availWidth : window.innerWidth;
  // console.log('isMobileScreenSize isCordova, width, maxWidth, return value:', isCordova(), width, tabMin,  width < tabMin);
  return  width < tabMin;
}

// iPad Mini is 744px wide, iPad 9.7" is 768, iPad 11" is 834, iPad 12.9" is 1024
export function isTablet () {
  const { innerWidth, muiThemeGlobal: { breakpoints: { values: { tabMin, tabMax } } } } = window;
  // console.log('isTablet isCordova, innerWidth, tabMin, tabMax, return value:', isCordova(), innerWidth, tabMin, tabMax,  innerWidth > tabMin && innerWidth < tabMax);
  return innerWidth > tabMin && innerWidth < tabMax;
}

export function isLargerThanTablet () {
  const { innerWidth, muiThemeGlobal: { breakpoints: { values: { tabMax } } } } = window;
  // console.log('isLargerThanTablet isCordova, innerWidth, tabMin, tabMax return value:', isCordova(), innerWidth, tabMin, tabMax,  innerWidth > tabMin && innerWidth < tabMax);
  return innerWidth > tabMax;
}

export function isSmallTablet () {
  const { innerWidth, muiThemeGlobal: { breakpoints: { values: { tabMin, tabMdMin } } } } = window;
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
  if ((isWebApp() && innerWidth < 991) || (!isWebApp() && innerWidth < tabMax)) {
    return 'display: none !important;';
  }
  return '';
}

export function handleResize (componentName) {
  const { priorHeaderWidth, priorHeaderBarWidth, priorFooterWidth, innerWidth: current, muiThemeGlobal: { breakpoints: { values: { tabMin: threshold } } } } = window;

  let prior = '';
  if (componentName === 'Footer') {
    prior = priorFooterWidth;
  } else if (componentName === 'Header') {
    prior = priorHeaderWidth;
  } else if (componentName === 'HeaderBar') {
    prior = priorHeaderBarWidth;
  } else {
    console.error(`handleResize called with invalid componentName ${componentName}`);
    return true;
  }
  // console.log(`----------- ${componentName} handleResize entry`);

  if (prior === undefined) {
    // console.log(`----------- ${componentName} handleResize FORCE RENDER prior is undefined, set to: `, current, threshold);
    if (componentName === 'Footer') window.priorFooterWidth = current;
    if (componentName === 'Header') window.priorHeaderWidth = current;
    if (componentName === 'HeaderBar') window.priorHeaderBarWidth = current;
    return false;
  } else if ((prior < threshold && current < threshold) || (prior > threshold && current > threshold)) {
    // console.log(`----------- ${componentName} handleResize both prior and current are on the same side of threshold: `, prior, current, threshold);
    return false;
  } else {
    // console.log(`----------- ${componentName} handleResize FORCE RENDER prior and current are on either side of threshold: `, prior, current, threshold);
    if (componentName === 'Footer') window.priorFooterWidth = current;
    if (componentName === 'Header') window.priorHeaderWidth = current;
    if (componentName === 'HeaderBar') window.priorHeaderBarWidth = current;
    return true;
  }
}

