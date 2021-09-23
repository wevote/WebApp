import { normalizedHref } from './applicationUtils';
import { hasIPhoneNotch, isAndroid, isCordova, isIOSAppOnMac, isIPad, isWebApp } from './cordovaUtils';
import isMobileScreenSize from './isMobileScreenSize';

export function headerStyles () {
  const styles = {                // from main.css .page-header
    border: 'none',
    paddingTop: 0,
    paddingRight: '15px',
    paddingBottom: 0,
    paddingLeft: '15px',
    margin: '0 auto',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '48px',
  };

  const [, page] = normalizedHref().split('/');

  if (['ballot', 'friends'].includes(page)) {
    styles.boxShadow = '0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12)';
  }

  if (['candidate', 'office', 'measure'].includes(page)) {
    if (isWebApp() && !isMobileScreenSize()) {
      styles.height = '96px';
      styles.display = 'contents';
    }
    if (isCordova()) {            // from main.css .page-header__cordova
      switch (page) {
        case 'candidate': styles.height = '41px'; break;
        case 'measure':   styles.height = '94px'; break;
        default:          styles.height = '71px'; break;
      }
      styles.margin = '0 15px 0 15px';
      styles.paddingBottom = '4px';
    }
    if (hasIPhoneNotch()) {       // from .page-header__cordova-iphonex
      styles.margin = 0;
      styles.paddingTop = '0 !important';
    }
    if (isIOSAppOnMac() || isIPad() || isAndroid()) {
      styles.height = ['office'].includes(page) ? '87px' : '50px';
    }
  }
  return styles;
}

export function headerToolbarStyles () {
  return {                // from main.css .header-toolbar
    width: '100%',
    maxWidth: '960px',
    justifyContent: 'space-between',  // .header-backto-toolbar
  };
}

