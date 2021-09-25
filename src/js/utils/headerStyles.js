import { normalizedHrefPage } from './applicationUtils';
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

  const page = normalizedHrefPage();

  if (['candidate', 'friends', 'office', 'measure'].includes(page)) {
    styles.borderBottom = '1px solid #aaa';
    styles.boxShadow = '0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12)';
  }

  if (['candidate', 'office', 'measure'].includes(page)) {
    if (isWebApp()) {
      if (isMobileScreenSize()) {
        styles.height  = ['measure'].includes(page) ? '96px' : 'fit-content';
      } else {
        styles.padding = 0;
        styles.height  = ['office', 'measure'].includes(page) ? '96px' : '41px';
        if (['candidate'].includes(page)) {
          // styles.width = '960px';
          styles.flexDirection = 'column';
        }
        if (['measure'].includes(page)) {
          styles.height  = '67px';
        }
      }
      // styles.height = isMobileScreenSize() ? 'fit-content' : '96px';
      // styles.display = 'contents';
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

  // console.log('headerStyles: ', styles);
  return styles;
}

export function headerToolbarStyles () {
  const styles = {                // from main.css .header-toolbar
    width: '100%',
    maxWidth: '960px',
    justifyContent: 'space-between',  // .header-backto-toolbar
  };

  if (isWebApp() && !isMobileScreenSize()) {
    styles.width = '-webkit-fill-available';
    // console.log('header styles ------------- ', normalizedHrefPage());
    styles.transform = normalizedHrefPage() === 'measure' ? 'translate(43%, -21%)' : null;
  }

  return styles;
}

