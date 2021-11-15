import React from 'react';
import { countMatches } from './searchFunctions';

export default function ballotSearchPriority (originalString, item, ignoreDescriptionFields = false) {
  // console.log('ballotSearchPriority, originalString: ', originalString, 'item.ballot_item_display_name:', item.ballot_item_display_name);
  if (originalString === undefined) {
    return 0;
  }
  let searchNeedleString = '';
  let candidateDetailsArray = [];
  let candidateElement;
  let candidateDetailsString;
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
  if (foundInThisOfficeOrMeasure) {
    officeOrMeasureElement = (
      <span>
        <strong>{item.ballot_item_display_name}</strong>
        {' '}
        (name or description)
      </span>
    );
    foundInArray.push(officeOrMeasureElement);
  }
  if (item.candidate_list) {
    // eslint-disable-next-line no-loop-func
    item.candidate_list.forEach((candidate) => {
      foundInThisCandidate = false;
      candidateDetailsArray = [];
      candidateDetailsString = '';
      for (let i = 0; i < wordsArray.length; i++) {
        searchNeedleString = wordsArray[i].toString();
        if (!ignoreDescriptionFields && countMatches(searchNeedleString, candidate.ballotpedia_candidate_summary)) {
          oneWordScore += countMatches(searchNeedleString, candidate.ballotpedia_candidate_summary);
          foundInThisCandidate = true;
          if (!candidateDetailsArray.includes('candidate summary')) candidateDetailsArray.push('candidate summary');
        }
        if (countMatches(searchNeedleString, candidate.ballot_item_display_name)) {
          oneWordScore += countMatches(searchNeedleString, candidate.ballot_item_display_name) * 5;
          foundInThisCandidate = true;
          if (!candidateDetailsArray.includes('name')) candidateDetailsArray.push('name');
        }
        if (!ignoreDescriptionFields && countMatches(searchNeedleString, candidate.twitter_description)) {
          oneWordScore += countMatches(searchNeedleString, candidate.twitter_description);
          foundInThisCandidate = true;
          if (!candidateDetailsArray.includes('Twitter description')) candidateDetailsArray.push('Twitter description');
        }
        if (countMatches(searchNeedleString, candidate.twitter_handle)) {
          oneWordScore += countMatches(searchNeedleString, candidate.twitter_handle) * 2;
          foundInThisCandidate = true;
          if (!candidateDetailsArray.includes('Twitter handle')) candidateDetailsArray.push('Twitter handle');
        }
        if (countMatches(searchNeedleString, candidate.party)) {
          oneWordScore += countMatches(searchNeedleString, candidate.party) * 2;
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
            <strong>{candidate.ballot_item_display_name}</strong>
            {candidateDetailsArray.length ? <span>{candidateDetailsString}</span> : null}
          </span>
        );
        foundInArray.push(candidateElement);
        candidatesToShowForSearchResults.push(candidate.we_vote_id);
      }
    });
  }
  return {
    searchPriority,
    foundInArray,
    candidatesToShowForSearchResults,
  };
}
