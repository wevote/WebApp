export default function ballotSearchPriority (search, item) {
  let searchPriority = item.ballot_item_display_name.substringOccurrences(search) * 5;
  if (item.candidate_list) {
    item.candidate_list.forEach((candidate) => {
      searchPriority += candidate.ballotpedia_candidate_summary.substringOccurrences(search) * 5;
      searchPriority += candidate.ballot_item_display_name.substringOccurrences(search) * 5;
      if (candidate.twitter_description) searchPriority += candidate.twitter_description.substringOccurrences(search) * 2;
      if (candidate.twitter_handle) searchPriority += candidate.twitter_handle.substringOccurrences(search);
      searchPriority += candidate.party.substringOccurrences(search);
    });
  }
  if (item.yes_vote_description) {
    searchPriority += item.yes_vote_description.substringOccurrences(search) * 2;
    searchPriority += item.no_vote_description.substringOccurrences(search) * 2;
  }
  return searchPriority;
}
