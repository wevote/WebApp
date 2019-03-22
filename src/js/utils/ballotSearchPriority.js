export default function ballotSearchPriority (search, item) {
  // console.log('ballotSearchPriority, search: ', search, 'item.ballot_item_display_name:', item.ballot_item_display_name);
  if (search === undefined) {
    return 0;
  }
  const searchString = search.toString();
  let searchPriority = 0;
  if (item.ballot_item_display_name) searchPriority += item.ballot_item_display_name.substringOccurrences(searchString) * 5;
  if (item.candidate_list) {
    item.candidate_list.forEach((candidate) => {
      if (candidate.ballotpedia_candidate_summary) searchPriority += candidate.ballotpedia_candidate_summary.substringOccurrences(searchString) * 5;
      if (candidate.ballot_item_display_name) searchPriority += candidate.ballot_item_display_name.substringOccurrences(searchString) * 5;
      if (candidate.twitter_description) searchPriority += candidate.twitter_description.substringOccurrences(searchString) * 2;
      if (candidate.twitter_handle) searchPriority += candidate.twitter_handle.substringOccurrences(searchString);
      if (candidate.party) searchPriority += candidate.party.substringOccurrences(searchString);
    });
  }
  if (item.yes_vote_description) searchPriority += item.yes_vote_description.substringOccurrences(searchString) * 2;
  if (item.no_vote_description) searchPriority += item.no_vote_description.substringOccurrences(searchString) * 2;
  return searchPriority;
}
