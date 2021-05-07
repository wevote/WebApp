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

export function numberOfNeedlesFoundInString (needle) {
  const regExp = new RegExp(needle, 'gi');
  return (this.match(regExp) || []).length;
}
