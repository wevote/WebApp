import stringContains from './stringContains';

export function isChallengeSEOFriendlyURL (path) {
  // console.log("isSEOFriendlyURL, path:", path);
  if (path) {
    return stringContains('/+/', path);
  } else {
    return false;
  }
}

export function isPoliticianSEOFriendlyURL (path) {
  // console.log("isSEOFriendlyURL, path:", path);
  if (path) {
    return stringContains('/-/', path);
  } else {
    return false;
  }
}

export function isSEOFriendlyURL (path) {
  // console.log("isSEOFriendlyURL, path:", path);
  if (path) {
    return stringContains('/+/', path) || stringContains('/-/', path);
  } else {
    return false;
  }
}
