import React from 'react';
import { countMatches } from './searchFunctions';

export default function positionSearchPriority (originalString, item) {
  // console.log('positionSearchPriority, originalString: ', originalString);
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
    if (countMatches(searchNeedleString, item.speaker_display_name)) {
      oneWordScore += countMatches(searchNeedleString, item.speaker_display_name) * 10;
      foundInThisPosition = true;
      if (!positionDetailsArray.includes('Name')) positionDetailsArray.push('Name');
    }
    if (countMatches(searchNeedleString, item.speaker_twitter_handle)) {
      oneWordScore += countMatches(searchNeedleString, item.speaker_twitter_handle) * 5;
      foundInThisPosition = true;
      if (!positionDetailsArray.includes('Twitter handle')) positionDetailsArray.push('Twitter handle');
    }
    if (countMatches(searchNeedleString, item.statement_text)) {
      oneWordScore += countMatches(searchNeedleString, item.statement_text) * 1;
      foundInThisPosition = true;
      if (!positionDetailsArray.includes('Twitter description')) positionDetailsArray.push('Twitter description');
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
        <strong>{item.speaker_display_name}</strong>
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
