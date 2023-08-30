import { isAndroidSizeWide, isIOS, isIPad11in, isIPadMini } from '../../common/utils/cordovaUtils';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';

// cordovaFriendlyUShowStyles
function cordovaIsMobileSize () {
  return !isAndroidSizeWide() || (isIOS() && window.screen.width < 576 && !isIPad11in() && !isIPadMini());
}

export function uShowMobile () {
  // I'd like that to be 'none !important', but it doesn't seem to work, the 'display' css is ignored.
  return cordovaIsMobileSize() || isWebApp() ? {} : { display: 'none' };
}

export function uShowDesktopTablet () {
  // I'd like that to be 'none !important', but it doesn't seem to work, the 'display' css is ignored.
  return !cordovaIsMobileSize() || isWebApp() ?  {} : { display: 'none' };
}
