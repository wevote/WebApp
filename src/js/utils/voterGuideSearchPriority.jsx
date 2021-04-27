import React from 'react';

const { arrayContains } = React.lazy(() => import('./textFormat'));

export default function voterGuideSearchPriority (originalString, item, ignoreDescriptionFields = false) {
  // console.log('voterGuideSearchPriority, originalString: ', originalString, 'item.ballot_item_display_name:', item.ballot_item_display_name);
  if (originalString === undefined) {
    return 0;
  }
  let searchNeedleString = '';
  const candidateDetailsArray = [];
  let candidateElement;
  let candidateDetailsString = '';
  const candidatesToShowForSearchResults = [];
  const foundInArray = [];
  let foundInItemsAlreadyShown = 0;
  let foundInThisOfficeOrMeasure = false;
  let foundInThisCandidate = false;
  let officeOrMeasureElement;
  let oneWordScore = 0;
  let searchPriority = 0;
  const wordsArray = originalString.split(' ');
  for (let i = 0; i < wordsArray.length; i++) {
    searchNeedleString = wordsArray[i].toString();
    oneWordScore = 0;
    if ((item.ballot_item_display_name && item.ballot_item_display_name.numberOfNeedlesFoundInString(searchNeedleString))) {
      oneWordScore += item.ballot_item_display_name.numberOfNeedlesFoundInString(searchNeedleString) * 10;
      foundInThisOfficeOrMeasure = true;
    }
    if (!ignoreDescriptionFields && item.yes_vote_description && item.yes_vote_description.numberOfNeedlesFoundInString(searchNeedleString)) {
      oneWordScore += item.yes_vote_description.numberOfNeedlesFoundInString(searchNeedleString) * 3;
      foundInThisOfficeOrMeasure = true;
    }
    if (!ignoreDescriptionFields && item.no_vote_description && item.no_vote_description.numberOfNeedlesFoundInString(searchNeedleString)) {
      oneWordScore += item.no_vote_description.numberOfNeedlesFoundInString(searchNeedleString) * 3;
      foundInThisOfficeOrMeasure = true;
    }
    searchPriority += oneWordScore;
  }
  const addOnText = (item.kind_of_ballot_item === 'CANDIDATE') ? '(name or description)' : '(measure)';

  if (foundInThisOfficeOrMeasure) {
    officeOrMeasureElement = (
      <span>
        <strong>{item.ballot_item_display_name}</strong>
        {' '}
        {addOnText}
      </span>
    );
    foundInArray.push(officeOrMeasureElement);
  }
  // candidateDetailsArray = [];
  for (let i = 0; i < wordsArray.length; i++) {
    searchNeedleString = wordsArray[i].toString();
    if (!ignoreDescriptionFields && item.ballotpedia_candidate_summary && item.ballotpedia_candidate_summary.numberOfNeedlesFoundInString(searchNeedleString)) {
      oneWordScore += item.ballotpedia_candidate_summary.numberOfNeedlesFoundInString(searchNeedleString);
      foundInThisCandidate = true;
      if (!arrayContains('candidate summary', candidateDetailsArray)) candidateDetailsArray.push('candidate summary');
    }
    if (item.ballot_item_display_name && item.ballot_item_display_name.numberOfNeedlesFoundInString(searchNeedleString)) {
      oneWordScore += item.ballot_item_display_name.numberOfNeedlesFoundInString(searchNeedleString) * 5;
      foundInThisCandidate = true;
      if (!arrayContains('name', candidateDetailsArray)) candidateDetailsArray.push('name');
    }
    if (!ignoreDescriptionFields && item.twitter_description && item.twitter_description.numberOfNeedlesFoundInString(searchNeedleString)) {
      oneWordScore += item.twitter_description.numberOfNeedlesFoundInString(searchNeedleString);
      foundInThisCandidate = true;
      if (!arrayContains('Twitter description', candidateDetailsArray)) candidateDetailsArray.push('Twitter description');
    }
    if (item.twitter_handle && item.twitter_handle.numberOfNeedlesFoundInString(searchNeedleString)) {
      oneWordScore += item.twitter_handle.numberOfNeedlesFoundInString(searchNeedleString) * 2;
      foundInThisCandidate = true;
      if (!arrayContains('Twitter handle', candidateDetailsArray)) candidateDetailsArray.push('Twitter handle');
    }
    if (item.contest_office_name && item.contest_office_name.numberOfNeedlesFoundInString(searchNeedleString)) {
      oneWordScore += item.contest_office_name.numberOfNeedlesFoundInString(searchNeedleString) * 2;
      foundInThisCandidate = true;
      if (!arrayContains('Contest Office', candidateDetailsArray)) candidateDetailsArray.push('Contest Office');
    }
    if (item.party && item.party.numberOfNeedlesFoundInString(searchNeedleString)) {
      oneWordScore += item.party.numberOfNeedlesFoundInString(searchNeedleString) * 2;
      foundInThisCandidate = true;
      if (!arrayContains('political party', candidateDetailsArray)) candidateDetailsArray.push('political party');
    }
    searchPriority += oneWordScore;
  }
  if (foundInThisCandidate) {
    if (candidateDetailsArray.length) {
      foundInItemsAlreadyShown = 0;
      candidateDetailsString += ' (';
      for (let counter = 0; counter < candidateDetailsArray.length; counter++) {
        candidateDetailsString += `${foundInItemsAlreadyShown ? ', ' : ''}${candidateDetailsArray[counter]}`;
        foundInItemsAlreadyShown += 1;
      }
      candidateDetailsString += ')';
    }
    candidateElement = (
      <span>
        <strong>{item.ballot_item_display_name}</strong>
        {candidateDetailsArray.length ? <span>{candidateDetailsString}</span> : null}
      </span>
    );
    foundInArray.push(candidateElement);
    candidatesToShowForSearchResults.push(item.we_vote_id);
  }
  return {
    searchPriority,
    foundInArray,
    candidatesToShowForSearchResults,
  };
}
