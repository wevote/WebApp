function isCordova () {
  const { cordova } = window;
  return cordova !== undefined;
}

export default function isMobileScreenSize () {
  if (isCordova()) {
    // availWidth is the full width of the screen
    // console.log('window.screen.availWidth:', window.screen.availWidth);
    return (window.screen.availWidth < 500);
  } else {
    // innerWidth is the width of the display area in the browser
    // console.log('window.innerWidth:', window.innerWidth);
    return (window.innerWidth < 576);
  }
}
