// Position related functions
export default function extractFirstEndorsementFromPositionList (positionListAsDict) {
  let onePosition = {};
  let endorsementOrganization = '';
  let endorsementText = '';
  // console.log('extractFirstEndorsementFromPositionList: ', positionListAsDict);
  const positionListAsArray = Object.values(positionListAsDict);
  for (let i = 0; i < positionListAsArray.length; i++) {
    onePosition = positionListAsArray[i];
    // console.log('onePosition.statement_text: ', onePosition.statement_text);
    if (onePosition && onePosition.statement_text && onePosition.statement_text.length > 2) {
      endorsementOrganization = onePosition.speaker_display_name;
      endorsementText = onePosition.statement_text;
      break;
    }
  }
  // console.log('endorsementText: ', endorsementText);
  return {
    endorsementOrganization,
    endorsementText,
  };
}
