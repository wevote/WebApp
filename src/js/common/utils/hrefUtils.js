export function normalizedHref () {
  const { cordova, location: { hash, pathname } } = window;
  // Eliminates dependency cycle cordova === undefined   is the same as isWebApp()
  // DALE Nov 2022: Hopefully this works without toLowerCase()
  // I am removing toLowerCase because it breaks SharedItem BallotShared links
  // return cordova === undefined ? pathname.toLowerCase() : hash.substring(1).toLowerCase();
  return cordova === undefined ? pathname : hash.substring(1);
}

export function normalizedHrefPage () {
  const [, page, second] = normalizedHref().split('/');
  if (second && page === 'more') {
    return `${page}/${second}`;
  }
  return page;
}
