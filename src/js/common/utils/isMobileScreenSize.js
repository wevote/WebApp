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
