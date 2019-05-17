// Position related functions
export function extractFirstEndorsementFromPositionList (positionListAsDict, limitToYes, limitToNo) {
  let onePosition = {};
  let endorsementOrganization = '';
  let endorsementText = '';
  // console.log('extractFirstEndorsementFromPositionList: ', positionListAsDict);
  const positionListAsArray = Object.values(positionListAsDict);
  for (let i = 0; i < positionListAsArray.length; i++) {
    onePosition = positionListAsArray[i];
    // console.log('onePosition.statement_text: ', onePosition.statement_text, 'limitToYes:', limitToYes, 'limitToNo:', limitToNo);
    if (onePosition && onePosition.statement_text && onePosition.statement_text.length > 2) {
      if (limitToYes && !onePosition.is_support_or_positive_rating) {
        // ignore
      } else if (limitToNo && !onePosition.is_oppose_or_negative_rating) {
        // ignore
      } else {
        endorsementOrganization = onePosition.speaker_display_name;
        endorsementText = onePosition.statement_text;
        break;
      }
    }
  }
  // console.log('endorsementText: ', endorsementText);
  return {
    endorsementOrganization,
    endorsementText,
  };
}

export function extractNumberOfPositionsFromPositionList (positionListAsDict) {
  let onePosition = {};
  let numberOfSupportPositions = 0;
  let numberOfOpposePositions = 0;
  let numberOfInfoOnlyPositions = 0;
  // console.log('extractNumberOfPositionsFromPositionList: ', positionListAsDict);
  const positionListAsArray = Object.values(positionListAsDict);
  for (let i = 0; i < positionListAsArray.length; i++) {
    onePosition = positionListAsArray[i];
    if (onePosition.is_support_or_positive_rating) {
      numberOfSupportPositions += 1;
    } else if (onePosition.is_oppose_or_negative_rating) {
      numberOfOpposePositions += 1;
    } else {
      numberOfInfoOnlyPositions += 1;
    }
  }
  return {
    numberOfSupportPositions,
    numberOfOpposePositions,
    numberOfInfoOnlyPositions,
  };
}
