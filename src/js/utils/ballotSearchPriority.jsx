import React from 'react';
import { countMatches } from './searchFunctions';
import { arrayContains } from './textFormat';

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
    if ((item.ballot_item_display_name && item.ballot_item_display_name.includes(searchNeedleString))) {
      oneWordScore += countMatches(searchNeedleString, item.ballot_item_display_name) * 10;
      foundInThisOfficeOrMeasure = true;
    }
    if (!ignoreDescriptionFields && item.yes_vote_description && item.yes_vote_description.includes(searchNeedleString)) {
      oneWordScore += countMatches(searchNeedleString, item.yes_vote_description) * 3;
      foundInThisOfficeOrMeasure = true;
    }
    if (!ignoreDescriptionFields && item.no_vote_description && item.no_vote_description.includes(searchNeedleString)) {
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
        if (!ignoreDescriptionFields && candidate.ballotpedia_candidate_summary && candidate.ballotpedia_candidate_summary.includes(searchNeedleString)) {
          oneWordScore += countMatches(searchNeedleString, candidate.ballotpedia_candidate_summary);
          foundInThisCandidate = true;
          if (!arrayContains('candidate summary', candidateDetailsArray)) candidateDetailsArray.push('candidate summary');
        }
        if (candidate.ballot_item_display_name && candidate.ballot_item_display_name.includes(searchNeedleString)) {
          oneWordScore += countMatches(searchNeedleString, candidate.ballot_item_display_name) * 5;
          foundInThisCandidate = true;
          if (!arrayContains('name', candidateDetailsArray)) candidateDetailsArray.push('name');
        }
        if (!ignoreDescriptionFields && candidate.twitter_description && candidate.twitter_description.includes(searchNeedleString)) {
          oneWordScore += countMatches(searchNeedleString, candidate.twitter_description);
          foundInThisCandidate = true;
          if (!arrayContains('Twitter description', candidateDetailsArray)) candidateDetailsArray.push('Twitter description');
        }
        if (candidate.twitter_handle && candidate.twitter_handle.includes(searchNeedleString)) {
          oneWordScore += countMatches(searchNeedleString, candidate.twitter_handle) * 2;
          foundInThisCandidate = true;
          if (!arrayContains('Twitter handle', candidateDetailsArray)) candidateDetailsArray.push('Twitter handle');
        }
        if (candidate.party && candidate.party.includes(searchNeedleString)) {
          oneWordScore += countMatches(searchNeedleString, candidate.party) * 2;
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
