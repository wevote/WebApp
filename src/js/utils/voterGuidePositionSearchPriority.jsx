import React from 'react';
import { countMatches } from './searchFunctions';
import { arrayContains } from './textFormat';

export default function voterGuidePositionSearchPriority (originalString, item) {
  // console.log('voterGuidePositionSearchPriority, originalString: ', originalString);
  if (originalString === undefined) {
    return 0;
  }
  let searchNeedleString = '';
  const candidatesToShowForSearchResults = [];
  const foundInArray = [];
  let foundInItemsAlreadyShown;
  let foundInThisPosition = false;
  let positionDetailsString = '';
  let positionElement;
  let oneWordScore = 0;
  const positionDetailsArray = [];
  let searchPriority = 0;
  const wordsArray = originalString.split(' ');
  for (let i = 0; i < wordsArray.length; i++) {
    searchNeedleString = wordsArray[i].toString();
    oneWordScore = 0;
    if ((item.ballot_item_display_name && item.ballot_item_display_name.includes(searchNeedleString))) {
      oneWordScore += countMatches(searchNeedleString, item.ballot_item_display_name) * 10;
      foundInThisPosition = true;
      if (!arrayContains('Name', positionDetailsArray)) positionDetailsArray.push('Name');
    }
    if ((item.state_code && item.state_code.includes(searchNeedleString))) {
      oneWordScore += countMatches(searchNeedleString, item.state_code) * 10;
      foundInThisPosition = true;
      if (!arrayContains('State', positionDetailsArray)) positionDetailsArray.push('State');
    }
    if (item.ballot_item_twitter_handle && item.ballot_item_twitter_handle.includes(searchNeedleString)) {
      oneWordScore += countMatches(searchNeedleString, item.ballot_item_twitter_handle) * 5;
      foundInThisPosition = true;
      if (!arrayContains('Twitter handle', positionDetailsArray)) positionDetailsArray.push('Twitter handle');
    }
    if (item.more_info_url && item.more_info_url.includes(searchNeedleString)) {
      oneWordScore += countMatches(searchNeedleString, item.more_info_url) * 5;
      foundInThisPosition = true;
      if (!arrayContains('Website', positionDetailsArray)) positionDetailsArray.push('Website');
    }
    if (item.contest_office_name && item.contest_office_name.includes(searchNeedleString)) {
      oneWordScore += countMatches(searchNeedleString, item.contest_office_name) * 3;
      foundInThisPosition = true;
      if (!arrayContains('Office name', positionDetailsArray)) positionDetailsArray.push('Office name');
    }
    if (item.kind_of_ballot_item && item.kind_of_ballot_item.includes(searchNeedleString)) {
      oneWordScore += countMatches(searchNeedleString, item.kind_of_ballot_item) * 3;
      foundInThisPosition = true;
      if (!arrayContains('Kind of ballot item', positionDetailsArray)) positionDetailsArray.push('Kind of ballot item');
    }
    if (item.statement_text && item.statement_text.includes(searchNeedleString)) {
      oneWordScore += countMatches(searchNeedleString, item.statement_text) * 1;
      foundInThisPosition = true;
      if (!arrayContains('Endorsement text', positionDetailsArray)) positionDetailsArray.push('Endorsement text');
    }
    searchPriority += oneWordScore;
  }
  if (foundInThisPosition) {
    if (positionDetailsArray.length) {
      foundInItemsAlreadyShown = 0;
      positionDetailsString += ' (';
      for (let counter = 0; counter < positionDetailsArray.length; counter++) {
        positionDetailsString += `${foundInItemsAlreadyShown ? ', ' : ''}${positionDetailsArray[counter]}`;
        foundInItemsAlreadyShown += 1;
      }
      positionDetailsString += ')';
    }
    positionElement = (
      <span>
        <strong>{item.ballot_item_display_name}</strong>
        {positionDetailsArray.length ? <span>{positionDetailsString}</span> : null}
      </span>
    );
    foundInArray.push(positionElement);
  }
  return {
    searchPriority,
    foundInArray,
    candidatesToShowForSearchResults,
  };
}
