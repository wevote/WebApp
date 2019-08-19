export default function addVoterGuideSearchPriority (originalString, item) {
  // console.log('addVoterGuideSearchPriority, originalString: ', originalString, 'item.ballot_item_display_name:', item.ballot_item_display_name);
  if (originalString === undefined) {
    return 0;
  }
  const wordsArray = originalString.split(' ');
  let oneWordScore = 0;
  let searchPriority = 0;
  let searchNeedleString = '';
  for (let i = 0; i < wordsArray.length; i++) {
    searchNeedleString = wordsArray[i].toString();
    oneWordScore = 0;
    if (item.ballot_item_display_name) oneWordScore += item.ballot_item_display_name.numberOfNeedlesFoundInString(searchNeedleString) * 5;
    if (item.ballot_item_political_party) oneWordScore += item.ballot_item_political_party.numberOfNeedlesFoundInString(searchNeedleString);
    if (item.ballot_item_twitter_handle) oneWordScore += item.ballot_item_twitter_handle.numberOfNeedlesFoundInString(searchNeedleString);
    if (item.contest_office_name) oneWordScore += item.contest_office_name.numberOfNeedlesFoundInString(searchNeedleString) * 5;
    if (item.candidate_list) {
      // eslint-disable-next-line no-loop-func
      item.candidate_list.forEach((candidate) => {
        // if (candidate.ballotpedia_candidate_summary) oneWordScore += candidate.ballotpedia_candidate_summary.numberOfNeedlesFoundInString(searchNeedleString) * 5;
        if (candidate.ballot_item_display_name) oneWordScore += candidate.ballot_item_display_name.numberOfNeedlesFoundInString(searchNeedleString) * 5;
        // if (candidate.twitter_description) oneWordScore += candidate.twitter_description.numberOfNeedlesFoundInString(searchNeedleString) * 2;
        if (candidate.twitter_handle) oneWordScore += candidate.twitter_handle.numberOfNeedlesFoundInString(searchNeedleString);
        if (candidate.party) oneWordScore += candidate.party.numberOfNeedlesFoundInString(searchNeedleString);
      });
    }
    // if (item.yes_vote_description) oneWordScore += item.yes_vote_description.numberOfNeedlesFoundInString(searchNeedleString) * 2;
    // if (item.no_vote_description) oneWordScore += item.no_vote_description.numberOfNeedlesFoundInString(searchNeedleString) * 2;
    if (oneWordScore === 0) {
      searchPriority = 0; // Reset the search priority
      break; // Break out of for loop at any point a word is not found
    } else {
      searchPriority += oneWordScore;
    }
  }
  return searchPriority;
}
