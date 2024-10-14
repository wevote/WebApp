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
  } else if (page && page === 'cs') { // Does the pathname start with '/cs/', i.e., candidates for state?
    return 'candidatelist';
  } else if (second && second === 'cs') { // Does the pathname end with '/cs/', i.e., candidates for state?
    return 'candidatelist';
  } else if (second && second === '-') { // Does the pathname end with '/-/', i.e., on a candidate landing page?
    return 'candidatelist';
  } else if (second && second === '+') { // Does the pathname end with '/-/', i.e., on a candidate landing page?
    return 'challenges';
  }
  return page;
}

export function isWeVoteMarketingSite () {
  let { hostname } = window.location;
  hostname = hostname || '';
  const weVoteSites = ['wevote.org', 'www.wevote.org', 'wevote.us', 'quality.wevote.us', 'www.wevote.us', 'localhost', 'silicon', 'wevotedeveloper.com', ''];   // localhost on Cordova is a ''
  return weVoteSites.includes(String(hostname));
}
