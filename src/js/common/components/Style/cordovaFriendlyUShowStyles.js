import { isIPad11in, isIPadMini } from '../../utils/cordovaUtils';

export function uShowMobile () {
  const showMobile = window.screen.width < 576 || isIPad11in() || isIPadMini();
  return showMobile ? {} : { display: 'none !important' };
}

export function uShowDesktopTablet () {
  const showMobile = window.screen.width < 576 || isIPad11in() || isIPadMini();
  return showMobile ? { display: 'none !important' } : {};
}
