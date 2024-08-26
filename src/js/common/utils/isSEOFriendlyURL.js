import stringContains from './stringContains';

export default function isSEOFriendlyURL (path) {
  // console.log("isSEOFriendlyURL, path:", path);
  if (path) {
    return stringContains('/+/', path) || stringContains('/-/', path);
  } else {
    return false;
  }
}
