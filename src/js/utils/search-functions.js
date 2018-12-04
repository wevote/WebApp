export default function makeSearchLink (twitter_handle, we_vote_id, kind_of_owner, link_internal, google_civic_election_id) {
  let search_link = "";
  switch (kind_of_owner) {
    case "CANDIDATE":
      search_link = twitter_handle ? `/${twitter_handle}` : `/candidate/${we_vote_id}`;
      break;
    case "OFFICE":
      search_link = `/office/${we_vote_id}`;
      break;
    case "ORGANIZATION":
      search_link = twitter_handle ? `/${twitter_handle}` : `/voterguide/${we_vote_id}`;
      break;
    case "MEASURE":
      search_link = `/measure/${we_vote_id}`;
      break;
    case "POLITICIAN":
      search_link = twitter_handle ? `/${twitter_handle}` : `/voterguide/${we_vote_id}`;
      break;
    case "ELECTION":
      search_link = link_internal || `/ballot/election/${google_civic_election_id}`;
      break;
    default:
      break;
  }
  return search_link;
}
