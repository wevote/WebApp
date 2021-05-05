import { arrayContains } from './textFormat';

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
    if ((item.speaker_display_name && item.speaker_display_name.numberOfNeedlesFoundInString(searchNeedleString))) {
      oneWordScore += item.speaker_display_name.numberOfNeedlesFoundInString(searchNeedleString) * 10;
      foundInThisPosition = true;
      if (!arrayContains('Name', positionDetailsArray)) positionDetailsArray.push('Name');
    }
    if (item.speaker_twitter_handle && item.speaker_twitter_handle.numberOfNeedlesFoundInString(searchNeedleString)) {
      oneWordScore += item.speaker_twitter_handle.numberOfNeedlesFoundInString(searchNeedleString) * 5;
      foundInThisPosition = true;
      if (!arrayContains('Twitter handle', positionDetailsArray)) positionDetailsArray.push('Twitter handle');
    }
    if (item.statement_text && item.statement_text.numberOfNeedlesFoundInString(searchNeedleString)) {
      oneWordScore += item.statement_text.numberOfNeedlesFoundInString(searchNeedleString) * 1;
      foundInThisPosition = true;
      if (!arrayContains('Twitter description', positionDetailsArray)) positionDetailsArray.push('Twitter description');
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
