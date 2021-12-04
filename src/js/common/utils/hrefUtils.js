export function normalizedHref () {
  const { cordova, location: { hash, pathname } } = window;
  // Eliminates dependency cycle cordova === undefined   is the same as isWebApp()
  return cordova === undefined ? pathname.toLowerCase() : hash.substring(1).toLowerCase();
}

export function normalizedHrefPage () {
  const [, page] = normalizedHref().split('/');
  return page;
}
