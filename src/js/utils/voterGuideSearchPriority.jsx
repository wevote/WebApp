import React from 'react';
import { countMatches } from './searchFunctions';

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
    if (countMatches(searchNeedleString, item.ballot_item_display_name)) {
      oneWordScore += countMatches(searchNeedleString, item.ballot_item_display_name) * 10;
      foundInThisOfficeOrMeasure = true;
    }
    if (!ignoreDescriptionFields && countMatches(searchNeedleString, item.yes_vote_description)) {
      oneWordScore += countMatches(searchNeedleString, item.yes_vote_description) * 3;
      foundInThisOfficeOrMeasure = true;
    }
    if (!ignoreDescriptionFields && countMatches(searchNeedleString, item.no_vote_description)) {
      oneWordScore += countMatches(searchNeedleString, item.no_vote_description) * 3;
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
    if (!ignoreDescriptionFields && countMatches(searchNeedleString, item.ballotpedia_candidate_summary)) {
      oneWordScore += countMatches(searchNeedleString, item.ballotpedia_candidate_summary);
      foundInThisCandidate = true;
      if (!candidateDetailsArray.includes('candidate summary')) candidateDetailsArray.push('candidate summary');
    }
    if (countMatches(searchNeedleString, item.ballot_item_display_name)) {
      oneWordScore += countMatches(searchNeedleString, item.ballot_item_display_name) * 5;
      foundInThisCandidate = true;
      if (!candidateDetailsArray.includes('name')) candidateDetailsArray.push('name');
    }
    if (!ignoreDescriptionFields && countMatches(searchNeedleString, item.twitter_description)) {
      oneWordScore += countMatches(searchNeedleString, item.twitter_description);
      foundInThisCandidate = true;
      if (!candidateDetailsArray.includes('Twitter description')) candidateDetailsArray.push('Twitter description');
    }
    if (countMatches(searchNeedleString, item.twitter_handle)) {
      oneWordScore += countMatches(searchNeedleString, item.twitter_handle) * 2;
      foundInThisCandidate = true;
      if (!candidateDetailsArray.includes('Twitter handle')) candidateDetailsArray.push('Twitter handle');
    }
    if (countMatches(searchNeedleString, item.contest_office_name)) {
      oneWordScore += countMatches(searchNeedleString, item.contest_office_name) * 2;
      foundInThisCandidate = true;
      if (!candidateDetailsArray.includes('Contest Office')) candidateDetailsArray.push('Contest Office');
    }
    if (countMatches(searchNeedleString, item.party)) {
      oneWordScore += countMatches(searchNeedleString, item.party) * 2;
      foundInThisCandidate = true;
      if (!candidateDetailsArray.includes('political party')) candidateDetailsArray.push('political party');
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
