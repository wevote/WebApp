export function makeSearchLink (twitterHandle, weVoteId, kindOfOwner, linkInternal, googleCivicElectionId) {
  let searchLink = '';
  switch (kindOfOwner) {
    case 'CANDIDATE':
      searchLink = twitterHandle ? `/${twitterHandle}` : `/candidate/${weVoteId}`;
      break;
    case 'OFFICE':
      searchLink = `/office/${weVoteId}`;
      break;
    case 'ORGANIZATION':
      searchLink = twitterHandle ? `/${twitterHandle}` : `/voterguide/${weVoteId}`;
      break;
    case 'MEASURE':
      searchLink = `/measure/${weVoteId}`;
      break;
    case 'POLITICIAN':
      searchLink = twitterHandle ? `/${twitterHandle}` : `/voterguide/${weVoteId}`;
      break;
    case 'ELECTION':
      searchLink = linkInternal || `/ballot/election/${googleCivicElectionId}`;
      break;
    default:
      break;
  }
  return searchLink;
}

// May 2021:  This was causing hard to debug problems... clever but brittle -- mostly replaced with newer built in String.includes()
// Aug 2019: Adding functions to the String prototype will make stuff like `for (char in str)` break, because it will loop over the substringOccurences property.
// As long as we use `forEach()` or `for (char of str)` then that side effect will be mitigated.
// export function numberOfNeedlesFoundInString (needle) {
//   const regExp = new RegExp(needle, 'gi');
//   return (this.match(regExp) || []).length;
// }

export function countMatches (needle, haystack) {
  if (!needle || !haystack) return 0;
  const haystackLowerCase = haystack.toLowerCase();
  const needleLowerCase = needle.toLowerCase();
  return haystackLowerCase.split(needleLowerCase).length - 1;
}
