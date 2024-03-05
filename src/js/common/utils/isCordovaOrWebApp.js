export function isCordova () {
  const { cordova } = window;
  return cordova !== undefined;
}

export function isWebApp () {
  return !isCordova();
}

export function isAndroid () {
  if (isWebApp()) return false;
  const { platform } = window.device || '';
  return isCordova() && platform === 'Android';  // Ignore the "Condition is always false" warning.  This line works correctly.
}

export function isAndroidTablet () {
  if (isAndroid()) {
    const { visualViewport: { height, width, scale } } = window;
    const ua = navigator.userAgent;
    const diameter = Math.sqrt(((width * scale) ** 2) + ((height * scale) ** 2));
    const aspectRatio = height / width;
    // console.log('Phone user agent: ', ua);

    return (aspectRatio < 1 ||
      (width === 1848 && height === 2960 && diameter === 14.54) ||             // Galaxy Tab S9 Ultra (2023)
      (width === 1232 && height === 1890 && Math.trunc(diameter) === 2256) ||  // Galaxy Tab S9 Ultra (2024)
      (ua.includes('Samsung Galaxy Tab')) ||
      (ua.includes('Pixel Tablet')) ||
      (ua.includes('Lenovo TAB')));
  }
  return false;
}
