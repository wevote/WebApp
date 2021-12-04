export function isCordova () {
  const { cordova } = window;
  return cordova !== undefined;
}

export function isWebApp () {
  return !isCordova();
}
