export function normalizedHref () {
  const { cordova, location: { hash, pathname } } = window;
  // Eliminates dependency cycle cordova === undefined   is the same as isWebApp()
  return cordova === undefined ? pathname.toLowerCase() : hash.substring(1).toLowerCase();
}

export function normalizedHrefPage () {
  const [, page, second] = normalizedHref().split('/');
  if (second && page === 'more') {
    return `${page}/${second}`;
  }
  return page;
}
